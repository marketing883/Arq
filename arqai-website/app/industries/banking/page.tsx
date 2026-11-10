import type { Metadata } from "next";
import BankingClient from "./BankingClient";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "AI for Banking: Financial Crime & Customer Risk",
  description:
    "Production AI for banking operations — financial-crime detection, alert triage, KYC review, and customer risk workflows with audit-ready evidence on every action.",
  alternates: { canonical: `${SITE_URL}/industries/banking` },
  openGraph: {
    title: "AI for Banking: Financial Crime & Customer Risk | ArqAI Labs",
    description:
      "Production AI for banking operations — financial-crime detection, alert triage, KYC review, and customer risk workflows with audit-ready evidence on every action.",
    url: `${SITE_URL}/industries/banking`,
  },
};

export default function BankingPage() {
  return <BankingClient />;
}
