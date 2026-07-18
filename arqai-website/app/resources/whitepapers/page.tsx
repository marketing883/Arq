import type { Metadata } from "next";
import ResourcesWhitepapersClient from "./ResourcesWhitepapersClient";

// This listing duplicates /whitepapers; canonicalize there so crawl and
// index signals consolidate on one URL.
export const metadata: Metadata = {
  title: "Whitepapers",
  description:
    "Deep dives and frameworks from ArqAI Labs on operational AI — governance architecture, agent design, and moving enterprise AI from pilot to production.",
  alternates: { canonical: "https://thearq.ai/whitepapers" },
};

export default function ResourcesWhitepapersPage() {
  return <ResourcesWhitepapersClient />;
}
