"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import V5Nav from "@/components/home-v5/V5Nav";
import Footer from "@/components/home-v5/Footer";
import { ArrowRight } from "@/components/home-v5/icons";
import { sanitizeHtml } from "@/lib/security/sanitize";
import "@/components/home-v5/styles.css";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image?: string;
  category?: string;
  tags?: string[];
  author: string;
  published_at: string;
  read_time_minutes?: number;
}

export default function BlogPostClient() {
  const params = useParams();
  const slug = params.slug as string;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await fetch(`/api/blog/${slug}`);
        if (response.ok) {
          const data = await response.json();
          if (data.post) {
            setPost(data.post);
          } else {
            setError(true);
          }
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Error fetching post:", err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    }

    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // Calculate read time from content
  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  if (isLoading) {
    return (
      <div className="v5-shell">
        <V5Nav />
        <main>
          <section className="v5-section">
            <div className="v5-container">
              <div className="v5-skel v5-skel-sm" style={{ marginBottom: 20 }} />
              <div className="v5-skel v5-skel-lg" style={{ height: 40, marginBottom: 20 }} />
              <div className="v5-skel v5-skel-md" style={{ marginBottom: 32 }} />
              <div
                className="v5-skel"
                style={{ height: 320, width: "100%", marginBottom: 32 }}
              />
              <div className="v5-skel v5-skel-lg" style={{ marginBottom: 12 }} />
              <div className="v5-skel v5-skel-lg" style={{ marginBottom: 12 }} />
              <div className="v5-skel v5-skel-md" />
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="v5-shell">
        <V5Nav />
        <main>
          <section className="v5-section">
            <div className="v5-container">
              <div className="v5-section-head center">
                <h1 className="v5-h2">Post Not Found</h1>
                <p className="v5-lead">
                  The blog post you&apos;re looking for doesn&apos;t exist or has been
                  removed.
                </p>
                <div className="v5-hero-actions" style={{ justifyContent: "center" }}>
                  <Link href="/blog" className="v5-btn v5-btn-dark">
                    Back to Blog
                    <ArrowRight />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  const readTime = post.read_time_minutes || calculateReadTime(post.content || "");

  return (
    <div className="v5-shell">
      <V5Nav />
      <main>
        {/* Article Header */}
        <section className="v5-page-hero">
          <div className="v5-container">
            <div className="v5-page-hero-inner">
              {/* Breadcrumb */}
              <div className="v5-crumbs" style={{ marginBottom: 24 }}>
                <Link href="/">Home</Link>
                <span>/</span>
                <Link href="/blog">Blog</Link>
                <span>/</span>
                <span style={{ color: "var(--v5-ink-soft)" }}>{post.title}</span>
              </div>

              {/* Category Badge */}
              {post.category && (
                <span className="v5-badge">
                  <span className="v5-badge-dot" />
                  {post.category}
                </span>
              )}

              {/* Title */}
              <h1 className="v5-h1">{post.title}</h1>

              {/* Meta Info */}
              <p className="v5-body" style={{ marginTop: 18 }}>
                By {post.author} &middot; {formatDate(post.published_at)} &middot; {readTime} min read
              </p>
            </div>
          </div>
        </section>

        <section className="v5-section v5-bg-white">
          <div className="v5-container">
            {/* Featured Image */}
            {post.featured_image && (
              <div className="v5-split-media" style={{ aspectRatio: "16 / 9", marginBottom: 40 }}>
                <img src={post.featured_image} alt={post.title} decoding="async" />
              </div>
            )}

            {/* Excerpt */}
            {post.excerpt && (
              <p className="v5-lead" style={{ marginBottom: 32 }}>
                {post.excerpt}
              </p>
            )}

            {/* Content */}
            <div
              className="v5-prose"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content || "") }}
            />

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div style={{ marginTop: 48 }}>
                <span className="v5-eyebrow">Tags</span>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 8,
                    marginTop: 12,
                  }}
                >
                  {post.tags.map((tag) => (
                    <span key={tag} className="v5-chip">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Back to Blog */}
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
