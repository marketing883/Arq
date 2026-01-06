import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseServiceKey) return null;
  return createClient(supabaseUrl, supabaseServiceKey);
}

interface SEOIssue {
  type: "error" | "warning" | "info";
  message: string;
  recommendation: string;
}

interface ContentSEOScore {
  id: string;
  type: string;
  title: string;
  slug?: string;
  url: string;
  score: number;
  issues: SEOIssue[];
  hasMetaDescription: boolean;
  hasFeaturedImage: boolean;
  titleLength: number;
  descriptionLength: number;
  status: string;
}

function analyzeSEO(content: {
  title?: string;
  excerpt?: string;
  description?: string;
  overview?: string;
  content?: string;
  featured_image?: string;
  cover_image?: string;
  meta_title?: string;
  meta_description?: string;
  slug?: string;
  tags?: string[];
  category?: string;
}): { score: number; issues: SEOIssue[] } {
  const issues: SEOIssue[] = [];
  let score = 100;

  const title = content.meta_title || content.title || "";
  const description = content.meta_description || content.description || content.excerpt || content.overview || "";
  const image = content.featured_image || content.cover_image;
  const bodyContent = content.content || "";

  // Title analysis
  if (!title) {
    issues.push({
      type: "error",
      message: "Missing title",
      recommendation: "Add a descriptive title for better SEO and user experience.",
    });
    score -= 20;
  } else if (title.length < 30) {
    issues.push({
      type: "warning",
      message: `Title too short (${title.length} chars)`,
      recommendation: "Aim for 50-60 characters for optimal display in search results.",
    });
    score -= 10;
  } else if (title.length > 60) {
    issues.push({
      type: "warning",
      message: `Title too long (${title.length} chars)`,
      recommendation: "Keep title under 60 characters to avoid truncation in search results.",
    });
    score -= 5;
  }

  // Description analysis
  if (!description) {
    issues.push({
      type: "error",
      message: "Missing meta description",
      recommendation: "Add a compelling description (150-160 chars) to improve click-through rates.",
    });
    score -= 20;
  } else if (description.length < 120) {
    issues.push({
      type: "warning",
      message: `Description too short (${description.length} chars)`,
      recommendation: "Aim for 150-160 characters to maximize search snippet visibility.",
    });
    score -= 10;
  } else if (description.length > 160) {
    issues.push({
      type: "info",
      message: `Description may be truncated (${description.length} chars)`,
      recommendation: "Consider keeping under 160 characters for full display in search results.",
    });
    score -= 3;
  }

  // Image analysis
  if (!image) {
    issues.push({
      type: "warning",
      message: "Missing featured image",
      recommendation: "Add a featured image to improve social sharing and visual appeal.",
    });
    score -= 10;
  }

  // Content analysis
  if (bodyContent) {
    const wordCount = bodyContent.replace(/<[^>]*>/g, "").split(/\s+/).length;

    if (wordCount < 300) {
      issues.push({
        type: "warning",
        message: `Content is thin (${wordCount} words)`,
        recommendation: "Add more comprehensive content. Aim for 1000+ words for in-depth topics.",
      });
      score -= 10;
    }

    // Check for headings
    const hasH2 = /<h2/i.test(bodyContent);
    if (!hasH2 && wordCount > 300) {
      issues.push({
        type: "info",
        message: "No subheadings detected",
        recommendation: "Add H2 subheadings to improve content structure and readability.",
      });
      score -= 5;
    }

    // Check for internal links
    const hasInternalLinks = /href=["']\/|href=["']https?:\/\/thearq\.ai/i.test(bodyContent);
    if (!hasInternalLinks && wordCount > 500) {
      issues.push({
        type: "info",
        message: "No internal links detected",
        recommendation: "Add internal links to related content to improve site navigation and SEO.",
      });
      score -= 5;
    }
  }

  // AEO checks
  if (!content.tags || content.tags.length === 0) {
    issues.push({
      type: "info",
      message: "No tags/keywords defined",
      recommendation: "Add relevant tags to help AI systems understand content topics.",
    });
    score -= 3;
  }

  // GEO checks - clear factual statements
  if (bodyContent && !/\d+%|\d+x|\$\d+|\d+ (million|billion|thousand)/i.test(bodyContent)) {
    issues.push({
      type: "info",
      message: "Consider adding specific data points",
      recommendation: "Include specific metrics, percentages, or statistics to improve credibility for AI citations.",
    });
    score -= 2;
  }

  return { score: Math.max(0, score), issues };
}

export async function GET() {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json({ error: "Database connection not available" }, { status: 500 });
    }

    const results: ContentSEOScore[] = [];

    // Analyze blog posts
    const { data: blogPosts } = await supabase
      .from("blog_posts")
      .select("id, title, slug, excerpt, content, featured_image, meta_title, meta_description, tags, category, status")
      .order("created_at", { ascending: false });

    if (blogPosts) {
      for (const post of blogPosts) {
        const { score, issues } = analyzeSEO(post);
        results.push({
          id: post.id,
          type: "blog",
          title: post.title,
          slug: post.slug,
          url: `/blog/${post.slug}`,
          score,
          issues,
          hasMetaDescription: !!(post.meta_description || post.excerpt),
          hasFeaturedImage: !!post.featured_image,
          titleLength: (post.meta_title || post.title || "").length,
          descriptionLength: (post.meta_description || post.excerpt || "").length,
          status: post.status,
        });
      }
    }

    // Analyze case studies
    const { data: caseStudies } = await supabase
      .from("case_studies")
      .select("id, title, slug, overview, featured_image, status")
      .order("created_at", { ascending: false });

    if (caseStudies) {
      for (const study of caseStudies) {
        const { score, issues } = analyzeSEO({
          title: study.title,
          overview: study.overview,
          featured_image: study.featured_image,
        });
        results.push({
          id: study.id,
          type: "case-study",
          title: study.title,
          slug: study.slug,
          url: `/case-studies/${study.slug}`,
          score,
          issues,
          hasMetaDescription: !!study.overview,
          hasFeaturedImage: !!study.featured_image,
          titleLength: (study.title || "").length,
          descriptionLength: (study.overview || "").length,
          status: study.status,
        });
      }
    }

    // Analyze whitepapers
    const { data: whitepapers } = await supabase
      .from("whitepapers")
      .select("id, title, description, cover_image, status")
      .order("created_at", { ascending: false });

    if (whitepapers) {
      for (const wp of whitepapers) {
        const { score, issues } = analyzeSEO({
          title: wp.title,
          description: wp.description,
          cover_image: wp.cover_image,
        });
        results.push({
          id: wp.id,
          type: "whitepaper",
          title: wp.title,
          url: `/resources/whitepapers/${wp.id}`,
          score,
          issues,
          hasMetaDescription: !!wp.description,
          hasFeaturedImage: !!wp.cover_image,
          titleLength: (wp.title || "").length,
          descriptionLength: (wp.description || "").length,
          status: wp.status,
        });
      }
    }

    // Analyze webinars
    const { data: webinars } = await supabase
      .from("webinars")
      .select("id, title, slug, description, thumbnail, status")
      .order("created_at", { ascending: false });

    if (webinars) {
      for (const webinar of webinars) {
        const { score, issues } = analyzeSEO({
          title: webinar.title,
          description: webinar.description,
          featured_image: webinar.thumbnail,
        });
        results.push({
          id: webinar.id,
          type: "webinar",
          title: webinar.title,
          slug: webinar.slug,
          url: `/webinars/${webinar.slug}`,
          score,
          issues,
          hasMetaDescription: !!webinar.description,
          hasFeaturedImage: !!webinar.thumbnail,
          titleLength: (webinar.title || "").length,
          descriptionLength: (webinar.description || "").length,
          status: webinar.status,
        });
      }
    }

    // Calculate overall statistics
    const totalContent = results.length;
    const averageScore = totalContent > 0 ? results.reduce((sum, r) => sum + r.score, 0) / totalContent : 0;
    const needsAttention = results.filter(r => r.score < 70).length;
    const excellent = results.filter(r => r.score >= 90).length;

    return NextResponse.json({
      overview: {
        totalContent,
        averageScore: Math.round(averageScore),
        needsAttention,
        excellent,
        byType: {
          blog: results.filter(r => r.type === "blog").length,
          caseStudy: results.filter(r => r.type === "case-study").length,
          whitepaper: results.filter(r => r.type === "whitepaper").length,
          webinar: results.filter(r => r.type === "webinar").length,
        },
      },
      content: results.sort((a, b) => a.score - b.score), // Sort by score ascending (worst first)
    });
  } catch (error) {
    console.error("Error analyzing SEO:", error);
    return NextResponse.json({ error: "Failed to analyze SEO" }, { status: 500 });
  }
}
