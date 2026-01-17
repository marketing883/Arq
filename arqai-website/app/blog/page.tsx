"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

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
    <>
      <Header />
      <main className="min-h-screen bg-base pt-24 md:pt-32">
        <div className="container mx-auto px-4 md:px-6">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12 md:mb-16"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-semibold mb-4">
              Blog
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-text-bright mb-4">
              Insights & Resources
            </h1>
            <p className="text-lg text-text-muted max-w-2xl mx-auto">
              Expert insights on AI governance, compliance, and enterprise automation
            </p>
          </motion.div>

          {/* Blog Grid */}
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[16/10] rounded-2xl bg-base-tint mb-5" />
                  <div className="h-4 bg-base-tint rounded w-24 mb-3" />
                  <div className="h-6 bg-base-tint rounded w-3/4 mb-3" />
                  <div className="h-4 bg-base-tint rounded w-full mb-2" />
                  <div className="h-4 bg-base-tint rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-base-tint flex items-center justify-center">
                <svg className="w-10 h-10 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-text-bright mb-3">No posts yet</h2>
              <p className="text-text-muted">Check back soon for insights and updates.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <Link href={`/blog/${post.slug}`} className="block">
                    {/* Image Container */}
                    <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-5 bg-base-tint">
                      {post.featured_image ? (
                        <Image
                          src={post.featured_image}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 rounded-xl bg-accent/20 flex items-center justify-center">
                            <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                            </svg>
                          </div>
                        </div>
                      )}
                      {post.category && (
                        <span className="absolute top-4 left-4 px-3 py-1 bg-white/90 dark:bg-base-tint/90 backdrop-blur-sm text-xs font-semibold text-accent rounded-full">
                          {post.category}
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div>
                      <div className="flex items-center gap-3 text-sm text-text-muted mb-3">
                        <span>{formatDate(post.published_at)}</span>
                        {post.read_time_minutes && (
                          <>
                            <span>•</span>
                            <span>{post.read_time_minutes} min read</span>
                          </>
                        )}
                      </div>
                      <h2 className="text-xl font-semibold text-text-bright mb-3 group-hover:text-accent transition-colors line-clamp-2">
                        {post.title}
                      </h2>
                      <p className="text-text-muted line-clamp-2 mb-4">
                        {post.excerpt}
                      </p>
                      <span className="inline-flex items-center gap-2 text-accent font-medium group-hover:gap-3 transition-all">
                        Read Article
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </span>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          )}
        </div>

        {/* Spacer */}
        <div className="h-20" />
      </main>
      <Footer />
    </>
  );
}
