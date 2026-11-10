import type { Metadata } from "next";
import InsuranceCarriersClient from "./InsuranceCarriersClient";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "AI for Insurance Carriers: Claims Triage, Intake & Review",
  description:
    "Production AI for insurance carriers — FNOL intake, claims triage, coverage review, and subrogation signals wired into the core systems carriers already run.",
  alternates: { canonical: `${SITE_URL}/industries/insurance-carriers` },
  openGraph: {
    title: "AI for Insurance Carriers: Claims Triage, Intake & Review | ArqAI Labs",
    description:
      "Production AI for insurance carriers — FNOL intake, claims triage, coverage review, and subrogation signals wired into the core systems carriers already run.",
    url: `${SITE_URL}/industries/insurance-carriers`,
  },
};

export default function InsuranceCarriersPage() {
  return <InsuranceCarriersClient />;
}
