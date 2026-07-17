import type { Metadata } from "next";
import V6Nav from "@/components/v6/V6Nav";
import ForwardDeployed from "@/components/v6/ForwardDeployed";
import ProofBand from "@/components/v6/ProofBand";
import AcceleratorShowcase from "@/components/v6/AcceleratorShowcase";
import CaseStudies from "@/components/v6/CaseStudies";
import Insights from "@/components/v6/Insights";
import FaqSection from "@/components/v6/FaqSection";
import ClosingCta from "@/components/v6/ClosingCta";
import V6Footer from "@/components/v6/V6Footer";
import "@/components/v6/v6.css";
import { LandingAccordionItem } from "@/components/ui/interactive-image-accordion";

// Design-iteration preview for the reimagined homepage (v6).
// Kept out of the index until it's promoted to "/".
export const metadata: Metadata = {
  title: "ArqAI Labs — v6 Preview",
  robots: { index: false, follow: false },
};

// Case studies revalidate from the CMS periodically.
export const revalidate = 300;

export default function V6PreviewPage() {
  return (
    <main className="w-full">
      <V6Nav />
      <LandingAccordionItem />
      <ForwardDeployed />
      <ProofBand />
      <AcceleratorShowcase />
      <CaseStudies />
      <Insights />
      <FaqSection />
      <ClosingCta />
      <V6Footer />
    </main>
  );
}
