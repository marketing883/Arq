"use client";

import { useEffect, useState } from "react";
import V5Nav from "@/components/home-v5/V5Nav";
import Footer from "@/components/home-v5/Footer";
import { ArrowRight } from "@/components/home-v5/icons";
import "@/components/home-v5/styles.css";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  featured_image?: string;
  category?: string;
  author: string;
  published_at: string;
  read_time_minutes?: number;
}

// Extract slug from potentially full URL
function extractSlug(slugOrUrl: string): string {
  if (!slugOrUrl) return "";
  if (slugOrUrl.includes("/blog/")) {
    const parts = slugOrUrl.split("/blog/");
    return parts[parts.length - 1].replace(/\/$/, "");
  }
  if (slugOrUrl.startsWith("http")) {
    try {
      const url = new URL(slugOrUrl);
      const pathParts = url.pathname.split("/").filter(Boolean);
      return pathParts[pathParts.length - 1] || slugOrUrl;
    } catch {
      return slugOrUrl;
    }
  }
  return slugOrUrl;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch("/api/blog/published");
        if (response.ok) {
          const data = await response.json();
          setPosts(data.posts || []);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPosts();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

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
                Expert insights on AI governance, compliance, and enterprise automation
              </p>
            </div>
          </div>
        </section>

        {/* Blog Grid */}
        <section className="v5-section v5-bg-grey">
          <div className="v5-container">
            {isLoading ? (
              <div className="v5-blog-grid">
                {[1, 2, 3, 4, 5, 6].map((i) => (
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
            ) : posts.length === 0 ? (
              <div className="v5-section-head center">
                <h2 className="v5-h2">No posts yet</h2>
                <p className="v5-lead">Check back soon for insights and updates.</p>
              </div>
            ) : (
              <div className="v5-blog-grid">
                {posts.map((post) => (
                  <a
                    key={post.id}
                    className="v5-blog-card"
                    href={`/blog/${extractSlug(post.slug)}`}
                  >
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
                        {post.category && (
                          <span className="v5-blog-cat">{post.category}</span>
                        )}
                        {formatDate(post.published_at)}
                        {post.read_time_minutes && (
                          <> &middot; {post.read_time_minutes} min read</>
                        )}
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
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
