import type { Metadata } from "next";
import InsuranceCarriersClient from "./InsuranceCarriersClient";

export const metadata: Metadata = {
  title: "AI for Insurance Carriers: Claims Triage, Intake & Review",
  description:
    "Production AI for insurance carriers — FNOL intake, claims triage, coverage review, and subrogation signals wired into the core systems carriers already run.",
  alternates: { canonical: "https://thearq.ai/industries/insurance-carriers" },
  openGraph: {
    title: "AI for Insurance Carriers: Claims Triage, Intake & Review | ArqAI Labs",
    description:
      "Production AI for insurance carriers — FNOL intake, claims triage, coverage review, and subrogation signals wired into the core systems carriers already run.",
    url: "https://thearq.ai/industries/insurance-carriers",
  },
};

export default function InsuranceCarriersPage() {
  return <InsuranceCarriersClient />;
}
