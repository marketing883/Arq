import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import V5Nav from "@/components/home-v5/V5Nav";
import Footer from "@/components/home-v5/Footer";
import { ArrowRight } from "@/components/home-v5/icons";
import "@/components/home-v5/styles.css";

// Server-rendered listing so crawlers (including non-JS AI crawlers) see the
// full post index. Reads searchParams for pagination, so the route is
// dynamic; the Supabase query is cheap and new posts appear immediately.
export const dynamic = "force-dynamic";

const PAGE_SIZE = 12;

type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  featured_image?: string;
  category?: string;
  author?: string;
  published_at: string;
};

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

async function getPosts(page: number): Promise<{ posts: BlogPost[]; total: number }> {
  const supabase = getSupabase();
  if (!supabase) return { posts: [], total: 0 };

  const from = (page - 1) * PAGE_SIZE;
  const { data, count, error } = await supabase
    .from("blog_posts")
    .select("id, title, slug, excerpt, featured_image, category, author, published_at", {
      count: "exact",
    })
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .range(from, from + PAGE_SIZE - 1);

  if (error) return { posts: [], total: 0 };
  return { posts: (data as BlogPost[]) || [], total: count || 0 };
}

function pageNumber(searchParams: { page?: string }) {
  const n = Number(searchParams.page);
  return Number.isInteger(n) && n > 1 ? n : 1;
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { page?: string };
}): Promise<Metadata> {
  const page = pageNumber(searchParams);
  const suffix = page > 1 ? ` — Page ${page}` : "";
  const canonical = page > 1 ? `https://thearq.ai/blog?page=${page}` : "https://thearq.ai/blog";
  return {
    title: `Blog: Operational AI Insights${suffix}`,
    description:
      "Insights from the ArqAI Labs team on operational AI — agent design, governance, enterprise integration, and moving AI from pilot to production.",
    alternates: { canonical },
    openGraph: {
      title: `Blog: Operational AI Insights${suffix} | ArqAI Labs`,
      description:
        "Insights from the ArqAI Labs team on operational AI — agent design, governance, enterprise integration, and moving AI from pilot to production.",
      url: canonical,
    },
  };
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = pageNumber(searchParams);
  const { posts, total } = await getPosts(page);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="v5-shell">
      <V5Nav />
      <main>
        {/* Hero */}
        <section className="v5-page-hero">
          <div className="v5-container">
            <div className="v5-page-hero-inner">
              <span className="v5-badge">
                <span className="v5-badge-dot" />
                Blog
              </span>
              <h1 className="v5-h1">Insights &amp; Resources</h1>
              <p className="v5-lead">
                Expert insights on operational AI, governance, and enterprise automation —
                direct from the team that ships it.
              </p>
            </div>
          </div>
        </section>

        {/* Blog Grid */}
        <section className="v5-section v5-bg-grey">
          <div className="v5-container">
            {posts.length === 0 ? (
              <div className="v5-section-head center">
                <h2 className="v5-h2">No posts yet</h2>
                <p className="v5-lead">Check back soon for insights and updates.</p>
              </div>
            ) : (
              <div className="v5-blog-grid">
                {posts.map((post) => (
                  <a key={post.id} className="v5-blog-card" href={`/blog/${post.slug}`}>
                    <div className="v5-blog-cover">
                      {post.featured_image ? (
                        <img
                          src={post.featured_image}
                          alt={post.title}
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <div className="v5-blog-cover-placeholder" />
                      )}
                    </div>
                    <div className="v5-blog-body">
                      <span className="v5-blog-meta">
                        {post.category && <span className="v5-blog-cat">{post.category}</span>}
                        {formatDate(post.published_at)}
                      </span>
                      <h3 className="v5-h3">{post.title}</h3>
                      <p className="v5-body">{post.excerpt}</p>
                      <span className="v5-card-more">
                        Read Article <ArrowRight />
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <nav
                aria-label="Blog pagination"
                className="v5-hero-actions"
                style={{ justifyContent: "center", marginTop: 48 }}
              >
                {page > 1 && (
                  <Link
                    href={page === 2 ? "/blog" : `/blog?page=${page - 1}`}
                    className="v5-btn v5-btn-ghost"
                    rel="prev"
                  >
                    Newer posts
                  </Link>
                )}
                <span className="v5-body" style={{ alignSelf: "center" }}>
                  Page {page} of {totalPages}
                </span>
                {page < totalPages && (
                  <Link href={`/blog?page=${page + 1}`} className="v5-btn v5-btn-ghost" rel="next">
                    Older posts
                  </Link>
                )}
              </nav>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
