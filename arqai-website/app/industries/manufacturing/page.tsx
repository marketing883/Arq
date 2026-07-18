import type { Metadata } from "next";
import ManufacturingClient from "./ManufacturingClient";

export const metadata: Metadata = {
  title: "AI for Manufacturing: Supply Chain & Operations",
  description:
    "Production AI for manufacturing operations — supplier risk, order exceptions, quality escapes, and maintenance workflows integrated with ERP and plant systems.",
  alternates: { canonical: "https://thearq.ai/industries/manufacturing" },
  openGraph: {
    title: "AI for Manufacturing: Supply Chain & Operations | ArqAI Labs",
    description:
      "Production AI for manufacturing operations — supplier risk, order exceptions, quality escapes, and maintenance workflows integrated with ERP and plant systems.",
    url: "https://thearq.ai/industries/manufacturing",
  },
};

export default function ManufacturingPage() {
  return <ManufacturingClient />;
}
