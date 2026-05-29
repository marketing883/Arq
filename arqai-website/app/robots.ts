import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://thearq.ai";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
      {
        userAgent: "GPTBot",
        allow: ["/", "/platform", "/solutions", "/demo"],
        disallow: ["/admin/", "/api/"],
      },
      {
        userAgent: "ChatGPT-User",
        allow: ["/", "/platform", "/solutions", "/demo"],
        disallow: ["/admin/", "/api/"],
      },
      {
        userAgent: "Anthropic-AI",
        allow: ["/", "/platform", "/solutions", "/demo"],
        disallow: ["/admin/", "/api/"],
      },
      {
        userAgent: "Claude-Web",
        allow: ["/", "/platform", "/solutions", "/demo"],
        disallow: ["/admin/", "/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
