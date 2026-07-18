import { cache } from "react";
import type { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";
import { generateArticleSchema, generateBreadcrumbSchema } from "@/lib/seo/structured-data";
import BlogPostClient from "./BlogPostClient";

// Blog content is DB-backed; revalidate so crawlers get fresh server HTML
// for the metadata and structured data without rebuilding the whole site.
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
};

// Read the post once per request; cache() dedupes the call shared by
// generateMetadata and the page component.
const getPost = cache(async (slug: string): Promise<BlogPostRecord | null> => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  const supabase = createClient(url, key);

  const exact = await supabase.from("blog_posts").select("*").eq("slug", slug).single();
  if (exact.data) return exact.data as BlogPostRecord;

  const alt = await supabase.from("blog_posts").select("*").ilike("slug", `%${slug}`).single();
  return (alt.data as BlogPostRecord) ?? null;
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

  const title = post.title;
  const description = post.excerpt || `${post.title} — insights on operational AI from ArqAI Labs.`;
  const canonical = `https://thearq.ai/blog/${post.slug}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "article",
      title,
      description,
      url: canonical,
      ...(post.featured_image && { images: [{ url: post.featured_image }] }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      site: "@The_ArqAI",
      creator: "@The_ArqAI",
      ...(post.featured_image && { images: [post.featured_image] }),
    },
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);

  const schemas = post
    ? [
        generateArticleSchema({
          title: post.title,
          description: post.excerpt || post.title,
          url: `https://thearq.ai/blog/${post.slug}`,
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
          { name: post.title, url: `https://thearq.ai/blog/${post.slug}` },
        ]),
      ]
    : [];

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <BlogPostClient />
    </>
  );
}
