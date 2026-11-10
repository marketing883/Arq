import type { Metadata } from "next";
import UseCasesClient from "./UseCasesClient";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Enterprise AI Use Cases We Build",
  description:
    "AI workflows ArqAI Labs has built or is ready to build — claims triage, FWA detection, financial-crime alerts, ticket resolution, supply-chain exceptions, and more.",
  alternates: { canonical: `${SITE_URL}/use-cases` },
  openGraph: {
    title: "Enterprise AI Use Cases We Build | ArqAI Labs",
    description:
      "AI workflows ArqAI Labs has built or is ready to build — claims triage, FWA detection, financial-crime alerts, ticket resolution, supply-chain exceptions, and more.",
    url: `${SITE_URL}/use-cases`,
  },
};

export default function UseCasesPage() {
  return <UseCasesClient />;
}
