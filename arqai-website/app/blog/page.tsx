import type { Metadata } from "next";
import BlogListClient from "./BlogListClient";

export const metadata: Metadata = {
  title: "Blog: Operational AI Insights",
  description:
    "Insights from the ArqAI Labs team on operational AI — agent design, governance, enterprise integration, and moving AI from pilot to production.",
  alternates: { canonical: "https://thearq.ai/blog" },
  openGraph: {
    title: "Blog: Operational AI Insights | ArqAI Labs",
    description:
      "Insights from the ArqAI Labs team on operational AI — agent design, governance, enterprise integration, and moving AI from pilot to production.",
    url: "https://thearq.ai/blog",
  },
};

export default function BlogIndexPage() {
  return <BlogListClient />;
}
