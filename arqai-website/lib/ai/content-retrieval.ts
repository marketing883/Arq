/**
 * RAG-lite content retrieval for the chat assistant.
 *
 * Grounds the bot in what the site actually publishes: blog posts, case
 * studies, whitepapers, and webinars from the CMS. Deterministic keyword
 * scoring over titles/summaries (no embedding infra needed; pgvector is the
 * upgrade path), cached in-process for ten minutes.
 *
 * The retrieved block is injected into the system prompt so the assistant can
 * recommend and link real, current content instead of only static knowledge.
 */

import { createClient } from "@supabase/supabase-js";

interface ContentDoc {
  type: "blog" | "case-study" | "whitepaper" | "webinar";
  title: string;
  url: string;
  summary: string;
  /** Pre-tokenized searchable text. */
  tokens: Set<string>;
}

const CACHE_TTL_MS = 10 * 60 * 1000;
let cache: { docs: ContentDoc[]; fetchedAt: number } | null = null;

const STOPWORDS = new Set([
  "the", "a", "an", "and", "or", "but", "of", "in", "on", "at", "to", "for",
  "with", "by", "is", "are", "was", "be", "been", "it", "its", "this", "that",
  "we", "our", "you", "your", "i", "my", "me", "us", "they", "their", "how",
  "what", "when", "where", "why", "who", "can", "do", "does", "about", "from",
  "as", "have", "has", "will", "would", "should", "could", "not", "no", "yes",
]);

function tokenize(text: string): string[] {
  return (text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/[\s-]+/)
    .filter((t) => t.length > 2 && !STOPWORDS.has(t));
}

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

async function loadDocs(): Promise<ContentDoc[]> {
  if (cache && Date.now() - cache.fetchedAt < CACHE_TTL_MS) return cache.docs;

  const supabase = getSupabase();
  if (!supabase) return [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const safe = async (p: PromiseLike<{ data: any; error: any }>): Promise<any[]> => {
    try {
      const { data, error } = await p;
      if (error) throw error;
      return data || [];
    } catch {
      return [];
    }
  };

  const [blogs, cases, papers, webinars] = await Promise.all([
    safe(
      supabase
        .from("blog_posts")
        .select("title, slug, excerpt, category")
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .limit(50)
    ),
    safe(
      supabase
        .from("case_studies")
        .select("title, slug, overview, industry, impact_summary")
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .limit(30)
    ),
    safe(
      supabase
        .from("whitepapers")
        .select("title, slug, description")
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .limit(30)
    ),
    safe(
      supabase
        .from("webinars")
        .select("title, slug, description")
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .limit(30)
    ),
  ]);

  const docs: ContentDoc[] = [];
  const push = (
    type: ContentDoc["type"],
    title: string,
    url: string,
    summary: string,
    extra = ""
  ) => {
    if (!title) return;
    docs.push({
      type,
      title,
      url,
      summary: (summary || "").slice(0, 220),
      tokens: new Set(tokenize(`${title} ${summary} ${extra}`)),
    });
  };

  for (const b of blogs) push("blog", b.title, `/blog/${b.slug}`, b.excerpt, b.category);
  for (const c of cases)
    push(
      "case-study",
      c.title,
      `/case-studies/${c.slug}`,
      c.overview || c.impact_summary,
      c.industry
    );
  for (const w of papers) push("whitepaper", w.title, `/whitepapers/${w.slug}`, w.description);
  for (const w of webinars) push("webinar", w.title, `/webinars/${w.slug}`, w.description);

  cache = { docs, fetchedAt: Date.now() };
  return docs;
}

const TYPE_LABELS: Record<ContentDoc["type"], string> = {
  blog: "Blog post",
  "case-study": "Case study",
  whitepaper: "Whitepaper",
  webinar: "Webinar",
};

/**
 * Return a system-prompt block with up to `limit` published content pieces
 * relevant to the visitor's message (plus recent topics), or an empty string
 * when nothing clears the relevance bar.
 */
export async function getRelevantContentBlock(
  message: string,
  recentTopics: string[] = [],
  limit = 3
): Promise<string> {
  try {
    const docs = await loadDocs();
    if (docs.length === 0) return "";

    const queryTokens = tokenize(`${message} ${recentTopics.join(" ")}`);
    if (queryTokens.length === 0) return "";

    const scored = docs
      .map((doc) => {
        let score = 0;
        for (const token of queryTokens) {
          if (doc.tokens.has(token)) score += 1;
        }
        return { doc, score };
      })
      .filter((s) => s.score >= 2) // require real overlap, not a stray word
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    if (scored.length === 0) return "";

    const lines = scored.map(
      ({ doc }) =>
        `- ${TYPE_LABELS[doc.type]}: "${doc.title}" at ${doc.url}${doc.summary ? ` (${doc.summary})` : ""}`
    );

    return [
      "## Published content relevant to this visitor (real pages, safe to recommend and link)",
      ...lines,
      "Recommend at most one of these when it genuinely helps, using a link action in the machine block.",
    ].join("\n");
  } catch (error) {
    console.error("Content retrieval error:", error);
    return "";
  }
}
