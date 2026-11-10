import type { Metadata } from "next";
import WhitepapersClient from "./WhitepapersClient";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Whitepapers",
  description:
    "Deep dives and frameworks from ArqAI Labs on operational AI — governance architecture, agent design, and moving enterprise AI from pilot to production.",
  alternates: { canonical: `${SITE_URL}/whitepapers` },
  openGraph: {
    title: "Whitepapers | ArqAI Labs",
    description:
      "Deep dives and frameworks from ArqAI Labs on operational AI — governance architecture, agent design, and moving enterprise AI from pilot to production.",
    url: `${SITE_URL}/whitepapers`,
  },
};

export default function WhitepapersPage() {
  return <WhitepapersClient />;
}
