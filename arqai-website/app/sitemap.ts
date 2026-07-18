import { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";
import { accelerators } from "@/lib/data/accelerators";
import { services } from "@/lib/data/services";
import { coreStaticPaths, industryLinks } from "@/lib/data/site-navigation";

// The sitemap pulls CMS content (blog posts, case studies, whitepapers,
// webinars) from Supabase. Without this, Next.js statically renders the
// sitemap once at build time and never picks up content published later from
// the CMS. Revalidating hourly keeps newly published content discoverable by
// search engines without re-deploying.
export const revalidate = 3600;

function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseServiceKey) return null;
  return createClient(supabaseUrl, supabaseServiceKey);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://thearq.ai";
  const currentDate = new Date().toISOString();
  // Static pages get NO lastModified: stamping the revalidation time on every
  // entry teaches crawlers the field is meaningless. Real dates flow through
  // for CMS content below.
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
    changeFrequency: path === "/blog" ? "daily" : "weekly",
    priority: corePriority(path),
  }));

  const servicePages: MetadataRoute.Sitemap = services.map((service) => ({
    url: `${baseUrl}/services/${service.slug}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const acceleratorPages: MetadataRoute.Sitemap = accelerators.map((accelerator) => ({
    url: `${baseUrl}/accelerators/${accelerator.id}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const industryPages: MetadataRoute.Sitemap = industryPaths
    .filter((path) => !coreStaticPaths.includes(path))
    .map((path) => ({
      url: `${baseUrl}${path}`,
        changeFrequency: "monthly",
      priority: path === "/industries" ? 0.8 : 0.7,
    }));

  // Legal pages with lower priority
  const legalPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/privacy`,
        changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
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
        if (!post.slug) return;
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
        if (!study.slug) return;
        dynamicPages.push({
          url: `${baseUrl}/case-studies/${study.slug}`,
          lastModified: study.updated_at || study.created_at || currentDate,
          changeFrequency: "monthly",
          priority: 0.7,
        });
      });
    }

    // Fetch published whitepapers. The public detail page lives at
    // /whitepapers/{slug} (not /resources/whitepapers/{id}), so emit the slug.
    const { data: whitepapers } = await supabase
      .from("whitepapers")
      .select("slug, updated_at, created_at")
      .eq("status", "published")
      .order("created_at", { ascending: false });

    if (whitepapers) {
      whitepapers.forEach((wp) => {
        if (!wp.slug) return;
        dynamicPages.push({
          url: `${baseUrl}/whitepapers/${wp.slug}`,
          lastModified: wp.updated_at || wp.created_at || currentDate,
          changeFrequency: "monthly",
          priority: 0.6,
        });
      });
    }

    // Fetch live/upcoming/on-demand webinars. Webinars never carry a
    // "published" status -- the public listing surfaces these three states.
    const { data: webinars } = await supabase
      .from("webinars")
      .select("slug, updated_at, created_at")
      .in("status", ["upcoming", "live", "on-demand"])
      .order("created_at", { ascending: false });

    if (webinars) {
      webinars.forEach((webinar) => {
        if (!webinar.slug) return;
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
