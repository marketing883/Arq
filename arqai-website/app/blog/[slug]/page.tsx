"use client";

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

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

export default function BlogPostPage() {
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
      <>
        <Header />
        <main className="min-h-screen bg-base pt-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto">
              <div className="animate-pulse space-y-6">
                <div className="h-4 bg-base-tint rounded w-24" />
                <div className="h-12 bg-base-tint rounded w-3/4" />
                <div className="h-4 bg-base-tint rounded w-1/2" />
                <div className="h-64 bg-base-tint rounded-2xl" />
                <div className="space-y-3">
                  <div className="h-4 bg-base-tint rounded" />
                  <div className="h-4 bg-base-tint rounded" />
                  <div className="h-4 bg-base-tint rounded w-5/6" />
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !post) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-base pt-32">
          <div className="container mx-auto px-4 md:px-6 text-center py-20">
            <h1 className="text-3xl font-bold text-text-bright mb-4">Post Not Found</h1>
            <p className="text-text-muted mb-8">The blog post you're looking for doesn't exist or has been removed.</p>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-base-opp font-semibold rounded-full hover:bg-accent/90 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Blog
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const readTime = post.read_time_minutes || calculateReadTime(post.content || "");

  return (
    <>
      <Header />
      <main className="min-h-screen bg-base pt-24 md:pt-32">
        <article className="container mx-auto px-4 md:px-6">
          {/* Article Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto mb-8 md:mb-12"
          >
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-text-muted mb-6">
              <Link href="/" className="hover:text-accent transition-colors">Home</Link>
              <span>/</span>
              <Link href="/blog" className="hover:text-accent transition-colors">Blog</Link>
              <span>/</span>
              <span className="text-text-bright truncate">{post.title}</span>
            </nav>

            {/* Category Badge */}
            {post.category && (
              <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-sm font-medium rounded-full mb-4">
                {post.category}
              </span>
            )}

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-bright mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-text-muted">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-text-bright">{post.author}</p>
                  <p className="text-xs">{formatDate(post.published_at)}</p>
                </div>
              </div>
              <span className="text-text-muted">•</span>
              <span className="text-sm">{readTime} min read</span>
            </div>
          </motion.div>

          {/* Featured Image */}
          {post.featured_image && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="max-w-4xl mx-auto mb-12"
            >
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-base-tint">
                <Image
                  src={post.featured_image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </motion.div>
          )}

          {/* Article Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-3xl mx-auto"
          >
            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-xl text-text-muted leading-relaxed mb-8 pb-8 border-b border-stroke-muted">
                {post.excerpt}
              </p>
            )}

            {/* Content */}
            <div
              className="prose prose-lg max-w-none
                prose-headings:text-text-bright prose-headings:font-bold
                prose-h1:text-3xl prose-h1:mt-10 prose-h1:mb-4
                prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
                prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
                prose-p:text-text-muted prose-p:leading-relaxed prose-p:mb-4
                prose-a:text-accent prose-a:no-underline hover:prose-a:underline
                prose-strong:text-text-bright
                prose-ul:text-text-muted prose-ol:text-text-muted
                prose-li:mb-2
                prose-blockquote:border-l-accent prose-blockquote:text-text-muted prose-blockquote:italic
                prose-code:text-accent prose-code:bg-base-tint prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                prose-pre:bg-base-tint prose-pre:border prose-pre:border-stroke-muted
                prose-img:rounded-xl"
              dangerouslySetInnerHTML={{ __html: post.content || "" }}
            />

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-stroke-muted">
                <h4 className="text-sm font-medium text-text-muted mb-3">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 bg-base-tint text-text-muted text-sm rounded-full hover:bg-base-shade transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Back to Blog */}
            <div className="mt-12 pt-8 border-t border-stroke-muted">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-accent font-medium hover:gap-3 transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to all articles
              </Link>
            </div>
          </motion.div>
        </article>

        {/* Spacer */}
        <div className="h-20" />
      </main>
      <Footer />
    </>
  );
}
