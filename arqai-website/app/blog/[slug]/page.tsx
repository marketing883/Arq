import { cache } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import {
  generateArticleSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
} from "@/lib/seo/structured-data";
import { sanitizeHtmlServer } from "@/lib/security/sanitize";
import V5Nav from "@/components/home-v5/V5Nav";
import Footer from "@/components/home-v5/Footer";
import { ArrowRight } from "@/components/home-v5/icons";
import "@/components/home-v5/styles.css";

// Blog content is DB-backed; revalidate so crawlers get fresh server HTML
// without rebuilding the whole site.
export const revalidate = 300;

type BlogPostRecord = {
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  featured_image?: string;
  category?: string;
  tags?: string[];
  author?: string;
  published_at?: string;
  updated_at?: string;
  // SEO fields authored in the admin editor.
  meta_title?: string;
  meta_description?: string;
  og_title?: string;
  og_description?: string;
  faq_schema?: { question: string; answer: string }[] | null;
};

// Read the post once per request; cache() dedupes the call shared by
// generateMetadata and the page component. Only published posts are served —
// drafts must not be reachable by slug, and no fuzzy slug fallback: one URL,
// one post, one canonical.
const getPost = cache(async (slug: string): Promise<BlogPostRecord | null> => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  const supabase = createClient(url, key);

  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();
  return (data as BlogPostRecord) ?? null;
});

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) {
    return { title: "Post Not Found" };
  }

  // Prefer the SEO fields authored in the admin editor, fall back to content.
  const title = post.meta_title || post.title;
  const description =
    post.meta_description ||
    post.excerpt ||
    `${post.title} — insights on operational AI from ArqAI Labs.`;
  const ogTitle = post.og_title || title;
  const ogDescription = post.og_description || description;
  const canonical = `https://thearq.ai/blog/${post.slug}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "article",
      title: ogTitle,
      description: ogDescription,
      url: canonical,
      ...(post.featured_image && { images: [{ url: post.featured_image }] }),
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      site: "@The_ArqAI",
      creator: "@The_ArqAI",
      ...(post.featured_image && { images: [post.featured_image] }),
    },
  };
}

function formatDate(dateString?: string) {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function readTimeMinutes(content: string) {
  const words = content.replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  const canonical = `https://thearq.ai/blog/${post.slug}`;
  const faqs = Array.isArray(post.faq_schema)
    ? post.faq_schema.filter((f) => f?.question && f?.answer)
    : [];

  const schemas: Record<string, unknown>[] = [
    generateArticleSchema({
      title: post.title,
      description: post.meta_description || post.excerpt || post.title,
      url: canonical,
      image: post.featured_image,
      author: post.author || "ArqAI Labs",
      publishedDate: post.published_at || new Date().toISOString(),
      modifiedDate: post.updated_at,
      category: post.category,
      tags: post.tags,
    }),
    generateBreadcrumbSchema([
      { name: "Home", url: "https://thearq.ai" },
      { name: "Blog", url: "https://thearq.ai/blog" },
      { name: post.title, url: canonical },
    ]),
    ...(faqs.length > 0 ? [generateFAQSchema(faqs)] : []),
  ];

  const contentHtml = sanitizeHtmlServer(post.content || "");
  const readTime = readTimeMinutes(post.content || "");

  return (
    <div className="v5-shell">
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <V5Nav />
      <main>
        {/* Article Header */}
        <section className="v5-page-hero">
          <div className="v5-container">
            <div className="v5-page-hero-inner">
              <div className="v5-crumbs" style={{ marginBottom: 24 }}>
                <Link href="/">Home</Link>
                <span>/</span>
                <Link href="/blog">Blog</Link>
                <span>/</span>
                <span style={{ color: "var(--v5-ink-soft)" }}>{post.title}</span>
              </div>

              {post.category && (
                <span className="v5-badge">
                  <span className="v5-badge-dot" />
                  {post.category}
                </span>
              )}

              <h1 className="v5-h1">{post.title}</h1>

              <p className="v5-body" style={{ marginTop: 18 }}>
                By {post.author || "ArqAI Labs"} &middot; {formatDate(post.published_at)}{" "}
                &middot; {readTime} min read
              </p>
            </div>
          </div>
        </section>

        <section className="v5-section v5-bg-white">
          <div className="v5-container">
            {post.featured_image && (
              <div
                className="v5-split-media"
                style={{ aspectRatio: "16 / 9", marginBottom: 40 }}
              >
                <img src={post.featured_image} alt={post.title} decoding="async" />
              </div>
            )}

            {post.excerpt && (
              <p className="v5-lead" style={{ marginBottom: 32 }}>
                {post.excerpt}
              </p>
            )}

            <div
              className="v5-prose"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />

            {faqs.length > 0 && (
              <div style={{ marginTop: 48 }}>
                <h2 className="v5-h2">Frequently asked questions</h2>
                <div style={{ marginTop: 20, display: "grid", gap: 20 }}>
                  {faqs.map((faq) => (
                    <div key={faq.question}>
                      <h3 className="v5-h3">{faq.question}</h3>
                      <p className="v5-body" style={{ marginTop: 8 }}>
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {post.tags && post.tags.length > 0 && (
              <div style={{ marginTop: 48 }}>
                <span className="v5-eyebrow">Tags</span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
                  {post.tags.map((tag) => (
                    <span key={tag} className="v5-chip">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="v5-hero-actions" style={{ marginTop: 40 }}>
              <Link href="/blog" className="v5-btn v5-btn-ghost">
                Back to all articles
                <ArrowRight />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
