import type { Metadata } from "next";
import HealthcarePayersClient from "./HealthcarePayersClient";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "AI for Healthcare Payers: Claims, FWA & Program Integrity",
  description:
    "Production AI for payer operations — claims triage, fraud/waste/abuse detection, and program integrity with evidence attached to every decision. Built on ArqFWA and ArqSupport.",
  alternates: { canonical: `${SITE_URL}/industries/healthcare-payers` },
  openGraph: {
    title: "AI for Healthcare Payers: Claims, FWA & Program Integrity | ArqAI Labs",
    description:
      "Production AI for payer operations — claims triage, fraud/waste/abuse detection, and program integrity with evidence attached to every decision. Built on ArqFWA and ArqSupport.",
    url: `${SITE_URL}/industries/healthcare-payers`,
  },
};

export default function HealthcarePayersPage() {
  return <HealthcarePayersClient />;
}
