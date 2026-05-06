"use client";

import { IndustryPage } from "@/components/industries/IndustryPage";

export default function HealthcarePayersPage() {
  return (
    <IndustryPage
      data={{
        eyebrow: "Industries / Healthcare payers",
        heroHeadline: "AI for the way payers actually operate.",
        heroSubhead:
          "Catch more fraud and waste. Resolve claims faster. Close the gap between visits. Every model engineered for production from day one and tuned to your data.",
        heroImage:
          "/img/services/Healthcare-Real-Time-Risk-Stratification-With-Built-In-Compliance.jpg",
        heroImageAlt: "Healthcare payer operations",
        primaryCta: { label: "Engage us", href: "/engage-us" },
        secondaryCta: { label: "See ArqFWA", href: "/products/arqfwa" },
        outcomes: [
          {
            metric: "30%+",
            label: "More fraud, waste, and abuse caught",
            description:
              "ArqFWA reviews high volumes of claims and surfaces patterns manual review misses, with the explanation needed for downstream action.",
          },
          {
            metric: "2x",
            label: "Faster claim cycle times",
            description:
              "Triage, routing, and reserve recommendations tuned to your operation, not a generic claim flow.",
          },
          {
            metric: "100%",
            label: "Auditable decisions",
            description:
              "Every output carries decision provenance. Your compliance, SIU, and audit teams get evidence on demand.",
          },
        ],
        useCasesHeading: "Where we work in healthcare payer operations.",
        useCases: [
          {
            tag: "Fraud, waste, abuse",
            title: "ArqFWA, calibrated to your claims data.",
            body: "Reviews high volumes of claims and transactions, prioritises the cases your team should focus on, and explains its reasoning so a human can act on it.",
          },
          {
            tag: "Patient management",
            title: "Patient management that doesn't drop people in the gap.",
            body: "AI that follows up, schedules, and surfaces the patients your care team needs to call today. Less leakage between visits.",
          },
          {
            tag: "Prior auth",
            title: "Prior authorization that doesn't stall.",
            body: "Auto-routes routine prior auths and surfaces the ones that need a human, with reasoning the medical director can defend.",
          },
          {
            tag: "Utilization management",
            title: "Utilization management with the data your team relies on.",
            body: "Surfaces high-cost, high-risk patterns earlier, ties recommendations to plan-specific guidelines, and keeps a clean audit trail.",
          },
        ],
        midCtaHeadline:
          "Bring a sample of your claims data. We'll show you what changes.",
        midCtaBody:
          "30 minutes with a senior on our team. Plain language. No deck. We'll tell you whether one of our products fits, whether a custom build is the right path, and what realistic looks like.",
        audienceHeading: "Built for the people who own the workflow.",
        audienceBody:
          "Operations leaders, program-integrity directors, claims and SIU teams, and the technology and AI executives backing them at:",
        audienceList: [
          "BCBS regional plans",
          "Medicaid managed care organisations",
          "Mid-tier Medicare Advantage plans",
          "Independent practice associations and provider-sponsored plans",
          "Mid-market commercial health plans",
          "Specialty and ancillary plans",
        ],
        productsHeading: "Productised where it earns its place.",
        productsBody:
          "Live today: ArqFWA. More on the roadmap, each engineered for production and delivered end-to-end.",
        products: [
          {
            name: "ArqFWA",
            status: "LIVE",
            statusColor: "bg-green-500",
            description:
              "The AI agent for fraud, waste, and abuse detection. Built for healthcare payers and P&C insurance carriers.",
            cta: "See ArqFWA",
            href: "/products/arqfwa",
          },
        ],
        closingCta: {
          headline: "Tell us what your operation needs.",
          body: "We'll tell you what's honestly possible. In plain language. Without a deck.",
        },
      }}
    />
  );
}
