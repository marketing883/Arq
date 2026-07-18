import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://thearq.ai";

  // AI/answer-engine crawlers get the same full access as search bots —
  // the blog, case studies, and resource library are citation targets.
  const aiCrawlers = ["GPTBot", "ChatGPT-User", "Anthropic-AI", "Claude-Web", "PerplexityBot"];

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
      ...aiCrawlers.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: ["/admin/", "/api/"],
      })),
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
