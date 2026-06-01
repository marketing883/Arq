import { createClient } from "@supabase/supabase-js";
import { ArrowRight } from "./icons";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  featured_image?: string;
  category?: string;
  published_at: string;
}

function extractSlug(slugOrUrl: string): string {
  if (!slugOrUrl) return "";
  if (slugOrUrl.includes("/blog/")) {
    const parts = slugOrUrl.split("/blog/");
    return parts[parts.length - 1].replace(/\/$/, "");
  }
  if (slugOrUrl.startsWith("http")) {
    try {
      const url = new URL(slugOrUrl);
      const parts = url.pathname.split("/").filter(Boolean);
      return parts[parts.length - 1] || slugOrUrl;
    } catch {
      return slugOrUrl;
    }
  }
  return slugOrUrl;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

async function getRecentPosts(): Promise<BlogPost[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) return [];

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase
      .from("blog_posts")
      .select("id, title, slug, excerpt, featured_image, category, published_at")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(3);

    if (error) return [];
    return data || [];
  } catch {
    return [];
  }
}

export default async function Blogs() {
  const posts = await getRecentPosts();

  return (
    <section className="v5-section v5-bg-grey" id="insights">
      <div className="v5-container">
        <div className="v5-title-block">
          <div>
            <span className="v5-badge">
              <span className="v5-badge-dot" />
              Insights &amp; Articles
            </span>
          </div>
          <div className="v5-title-main">
            <h2 className="v5-h2">Discover the Future of AI in Business</h2>
            <p className="v5-lead">
              Stay informed with the latest trends, strategies, and insights on
              operational AI — direct from our team.
            </p>
          </div>
        </div>

        <div className="v5-blog-grid">
          {posts.length > 0
            ? posts.map((post) => (
                <a
                  key={post.id}
                  className="v5-blog-card"
                  href={`/blog/${extractSlug(post.slug)}`}
                >
                  <div className="v5-blog-cover">
                    {post.featured_image ? (
                      <img src={post.featured_image} alt={post.title} loading="lazy" />
                    ) : (
                      <div className="v5-blog-cover-placeholder" />
                    )}
                  </div>
                  <div className="v5-blog-body">
                    <span className="v5-blog-meta">
                      {post.category && (
                        <span className="v5-blog-cat">{post.category}</span>
                      )}
                      {formatDate(post.published_at)}
                    </span>
                    <h3 className="v5-h3">{post.title}</h3>
                    <p className="v5-body">{post.excerpt}</p>
                  </div>
                </a>
              ))
            : /* fallback skeleton cards while no posts exist */
              [0, 1, 2].map((i) => (
                <div key={i} className="v5-blog-card v5-blog-skeleton">
                  <div className="v5-blog-cover v5-blog-cover-placeholder" />
                  <div className="v5-blog-body">
                    <div className="v5-skel v5-skel-sm" />
                    <div className="v5-skel v5-skel-lg" />
                    <div className="v5-skel v5-skel-md" />
                  </div>
                </div>
              ))}
        </div>

        <div className="v5-blog-foot">
          <a href="/blog" className="v5-btn v5-btn-dark">
            Discover More
            <ArrowRight />
          </a>
        </div>
      </div>
    </section>
  );
}
