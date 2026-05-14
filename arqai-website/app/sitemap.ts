import { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";
import { accelerators } from "@/lib/data/accelerators";
import { services } from "@/lib/data/services";
import { coreStaticPaths, industryLinks } from "@/lib/data/site-navigation";

function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseServiceKey) return null;
  return createClient(supabaseUrl, supabaseServiceKey);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://thearq.ai";
  const currentDate = new Date().toISOString();
  const industryPaths = ["/industries", ...industryLinks.map((industry) => industry.href)];

  const corePriority = (path: string) => {
    if (path === "/") return 1;
    if (["/platform", "/services", "/accelerators", "/industries"].includes(path)) return 0.9;
    if (["/resources", "/case-studies", "/blog", "/about"].includes(path)) return 0.8;
    return 0.7;
  };

  // Core pages with high priority
  const corePages: MetadataRoute.Sitemap = coreStaticPaths.map((path) => ({
    url: path === "/" ? baseUrl : `${baseUrl}${path}`,
    lastModified: currentDate,
    changeFrequency: path === "/blog" ? "daily" : "weekly",
    priority: corePriority(path),
  }));

  const servicePages: MetadataRoute.Sitemap = services.map((service) => ({
    url: `${baseUrl}/services/${service.slug}`,
    lastModified: currentDate,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const acceleratorPages: MetadataRoute.Sitemap = accelerators.map((accelerator) => ({
    url: `${baseUrl}/accelerators/${accelerator.id}`,
    lastModified: currentDate,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const industryPages: MetadataRoute.Sitemap = industryPaths
    .filter((path) => !coreStaticPaths.includes(path))
    .map((path) => ({
      url: `${baseUrl}${path}`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: path === "/industries" ? 0.8 : 0.7,
    }));

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

  return [...corePages, ...servicePages, ...acceleratorPages, ...industryPages, ...legalPages, ...dynamicPages];
}
