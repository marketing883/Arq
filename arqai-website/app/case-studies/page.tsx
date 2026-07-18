import type { Metadata } from "next";
import CaseStudiesClient from "./CaseStudiesClient";

export const metadata: Metadata = {
  title: "Case Studies: Production AI Results",
  description:
    "How enterprise teams put ArqAI Labs accelerators and agents into production — with the baseline, the intervention, and the measured outcome for each engagement.",
  alternates: { canonical: "https://thearq.ai/case-studies" },
  openGraph: {
    title: "Case Studies: Production AI Results | ArqAI Labs",
    description:
      "How enterprise teams put ArqAI Labs accelerators and agents into production — with the baseline, the intervention, and the measured outcome for each engagement.",
    url: "https://thearq.ai/case-studies",
  },
};

export default function CaseStudiesPage() {
  return <CaseStudiesClient />;
}
