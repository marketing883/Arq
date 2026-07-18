import type { Metadata } from "next";
import WhitepapersClient from "./WhitepapersClient";

export const metadata: Metadata = {
  title: "Whitepapers",
  description:
    "Deep dives and frameworks from ArqAI Labs on operational AI — governance architecture, agent design, and moving enterprise AI from pilot to production.",
  alternates: { canonical: "https://thearq.ai/whitepapers" },
  openGraph: {
    title: "Whitepapers | ArqAI Labs",
    description:
      "Deep dives and frameworks from ArqAI Labs on operational AI — governance architecture, agent design, and moving enterprise AI from pilot to production.",
    url: "https://thearq.ai/whitepapers",
  },
};

export default function WhitepapersPage() {
  return <WhitepapersClient />;
}
