"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  cover_image?: string;
  category?: string;
  published_at: string;
  read_time_minutes?: number;
}

interface BlogSectionProps {
  posts: BlogPost[];
}

export function BlogSection({ posts }: BlogSectionProps) {
  if (!posts || posts.length === 0) {
    return null;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <section className="py-20 bg-[var(--arq-gray-50)] dark:bg-[var(--arq-gray-900)]">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-[var(--arq-blue)]/10 text-[var(--arq-blue)] text-sm font-semibold mb-4">
            Insights & Resources
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--arq-black)] dark:text-white mb-4">
            Latest from the Blog
          </h2>
          <p className="text-[var(--arq-gray-600)] dark:text-[var(--arq-gray-400)] max-w-2xl mx-auto">
            Expert insights on AI governance, compliance, and enterprise automation
          </p>
        </motion.div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {posts.slice(0, 3).map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="group"
            >
              <Link href={`/blog/${post.slug}`} className="block">
                {/* Image Container */}
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-5 bg-[var(--arq-gray-200)] dark:bg-[var(--arq-gray-700)]">
                  {post.cover_image ? (
                    <Image
                      src={post.cover_image}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-xl bg-[var(--arq-blue)]/20 flex items-center justify-center">
                        <svg className="w-8 h-8 text-[var(--arq-blue)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                      </div>
                    </div>
                  )}
                  {post.category && (
                    <span className="absolute top-4 left-4 px-3 py-1 bg-white/90 dark:bg-[var(--arq-gray-800)]/90 backdrop-blur-sm text-xs font-semibold text-[var(--arq-blue)] rounded-full">
                      {post.category}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div>
                  <div className="flex items-center gap-3 text-sm text-[var(--arq-gray-500)] dark:text-[var(--arq-gray-400)] mb-3">
                    <span>{formatDate(post.published_at)}</span>
                    {post.read_time_minutes && (
                      <>
                        <span>•</span>
                        <span>{post.read_time_minutes} min read</span>
                      </>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-[var(--arq-black)] dark:text-white mb-3 group-hover:text-[var(--arq-blue)] transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-[var(--arq-gray-600)] dark:text-[var(--arq-gray-400)] line-clamp-2 mb-4">
                    {post.excerpt}
                  </p>
                  <span className="inline-flex items-center gap-2 text-[var(--arq-blue)] font-medium group-hover:gap-3 transition-all">
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

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-[var(--arq-gray-800)] border border-[var(--arq-gray-200)] dark:border-[var(--arq-gray-700)] text-[var(--arq-black)] dark:text-white font-semibold rounded-full hover:border-[var(--arq-blue)] hover:text-[var(--arq-blue)] transition-colors"
          >
            View All Articles
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// Static placeholder version for when database isn't connected
export function BlogSectionStatic() {
  const placeholderPosts: BlogPost[] = [
    {
      id: "1",
      slug: "enterprise-ai-governance-guide",
      title: "The Complete Guide to Enterprise AI Governance in 2025",
      excerpt: "Learn how leading organizations are building AI governance frameworks that enable innovation while maintaining compliance.",
      category: "AI Governance",
      published_at: new Date().toISOString(),
      read_time_minutes: 8,
    },
    {
      id: "2",
      slug: "zero-trust-ai-security",
      title: "Zero-Trust Security for AI Agents: A Technical Deep Dive",
      excerpt: "Explore the architectural patterns and security controls needed to deploy AI agents in zero-trust enterprise environments.",
      category: "Security",
      published_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      read_time_minutes: 12,
    },
    {
      id: "3",
      slug: "ai-compliance-financial-services",
      title: "AI Compliance in Financial Services: Meeting Fed SR 11-7",
      excerpt: "A practical guide to achieving model risk management compliance for AI systems in banking and financial services.",
      category: "Compliance",
      published_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      read_time_minutes: 10,
    },
  ];

  return <BlogSection posts={placeholderPosts} />;
}
