import type { Metadata } from "next";
import { LandingAccordionItem } from "@/components/ui/interactive-image-accordion";

// Design-iteration preview for the reimagined homepage (v6).
// Kept out of the index until it's promoted to "/".
export const metadata: Metadata = {
  title: "ArqAI Labs — v6 Preview",
  robots: { index: false, follow: false },
};

export default function V6PreviewPage() {
  return (
    <main className="w-full">
      <LandingAccordionItem />
    </main>
  );
}
