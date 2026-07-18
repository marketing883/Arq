import type { Metadata } from "next";
import { generateFAQSchema } from "@/lib/seo/structured-data";
import { engageFaqs } from "./faqs";
import EngageUsClient from "./EngageUsClient";

export const metadata: Metadata = {
  title: "Engage Us: Scope Your AI Workflow",
  description:
    "Tell us about the workflow, the systems it touches, and the outcome you need. A senior member of the ArqAI Labs team will follow up within one business day.",
  alternates: { canonical: "https://thearq.ai/engage-us" },
  openGraph: {
    title: "Engage Us: Scope Your AI Workflow | ArqAI Labs",
    description:
      "Tell us about the workflow, the systems it touches, and the outcome you need. We scope before we build.",
    url: "https://thearq.ai/engage-us",
  },
};

export default function EngageUsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFAQSchema(engageFaqs)) }}
      />
      <EngageUsClient />
    </>
  );
}
