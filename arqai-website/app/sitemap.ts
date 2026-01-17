import { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseServiceKey) return null;
  return createClient(supabaseUrl, supabaseServiceKey);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://thearq.ai";
  const currentDate = new Date().toISOString();

  // Core pages with high priority
  const corePages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/platform`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/solutions`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/demo`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/case-studies`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/resources/whitepapers`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/webinars`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  // Legal pages with lower priority
  const legalPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/privacy`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  // Dynamic content from database
  const dynamicPages: MetadataRoute.Sitemap = [];
  const supabase = getSupabase();

  if (supabase) {
    // Fetch published blog posts
    const { data: blogPosts } = await supabase
      .from("blog_posts")
      .select("slug, updated_at, published_at")
      .eq("status", "published")
      .order("published_at", { ascending: false });

    if (blogPosts) {
      blogPosts.forEach((post) => {
        dynamicPages.push({
          url: `${baseUrl}/blog/${post.slug}`,
          lastModified: post.updated_at || post.published_at || currentDate,
          changeFrequency: "weekly",
          priority: 0.7,
        });
      });
    }

    // Fetch published case studies
    const { data: caseStudies } = await supabase
      .from("case_studies")
      .select("slug, updated_at, created_at")
      .eq("status", "published")
      .order("created_at", { ascending: false });

    if (caseStudies) {
      caseStudies.forEach((study) => {
        dynamicPages.push({
          url: `${baseUrl}/case-studies/${study.slug}`,
          lastModified: study.updated_at || study.created_at || currentDate,
          changeFrequency: "monthly",
          priority: 0.7,
        });
      });
    }

    // Fetch published whitepapers
    const { data: whitepapers } = await supabase
      .from("whitepapers")
      .select("id, updated_at, created_at")
      .eq("status", "published")
      .order("created_at", { ascending: false });

    if (whitepapers) {
      whitepapers.forEach((wp) => {
        dynamicPages.push({
          url: `${baseUrl}/resources/whitepapers/${wp.id}`,
          lastModified: wp.updated_at || wp.created_at || currentDate,
          changeFrequency: "monthly",
          priority: 0.6,
        });
      });
    }

    // Fetch published webinars
    const { data: webinars } = await supabase
      .from("webinars")
      .select("slug, updated_at, created_at")
      .eq("status", "published")
      .order("created_at", { ascending: false });

    if (webinars) {
      webinars.forEach((webinar) => {
        dynamicPages.push({
          url: `${baseUrl}/webinars/${webinar.slug}`,
          lastModified: webinar.updated_at || webinar.created_at || currentDate,
          changeFrequency: "monthly",
          priority: 0.6,
        });
      });
    }
  }

  return [...corePages, ...legalPages, ...dynamicPages];
}
