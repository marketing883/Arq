"use client";

import { IndustryPage } from "@/components/industries/IndustryPage";

export default function BankingPage() {
  return (
    <IndustryPage
      data={{
        eyebrow: "Industries / Banking",
        heroHeadline: "AI for financial-crime teams that need fewer false positives and cleaner evidence.",
        heroSubhead:
          "Regional and mid-tier banks need automation that respects examiner scrutiny, analyst judgment, and thin operational capacity. We build around that reality from day one.",
        heroImage: "https://images.unsplash.com/photo-1684679674829-fc7b436ec8e8?auto=format&fit=crop&w=1600&q=80",
        secondaryImage: "https://images.unsplash.com/photo-1633059050703-0f1b50828402?auto=format&fit=crop&w=1920&q=80",
        heroImageAlt: "Banking operations",
        featuredAcceleratorId: "sentra",
        contactIndustry: "Banking",
        contactWorkflow: "Financial crime, AML/KYC, and customer risk",
        primaryCta: { label: "Get Started", href: "/engage-us" },
        secondaryCta: { label: "Explore Sentra", href: "/accelerators/sentra" },
        outcomes: [
          {
            metric: "60%",
            label: "Less alert noise",
            description:
              "Prioritize alerts with customer context, typology signals, and explainable rationale so analysts work what actually matters.",
          },
          {
            metric: "3x",
            label: "Faster CDD assembly",
            description:
              "Collect ownership, risk, sanctions, and document context faster while preserving the review trail compliance needs.",
          },
          {
            metric: "100%",
            label: "Examiner-ready decisions",
            description:
              "Every escalation, clearance, and SAR-support output keeps the supporting evidence close to the decision.",
          },
        ],
        useCasesHeading: "Where AI can create leverage inside financial-crime operations.",
        useCases: [
          {
            tag: "AML monitoring",
            title: "Transaction monitoring that explains the alert.",
            body: "Reduce noise, escalate real risk earlier, and connect each alert to the customer profile, typology, and evidence behind it.",
          },
          {
            tag: "KYC / CDD",
            title: "Customer due diligence that moves without losing control.",
            body: "Assemble CDD context, flag gaps, and route exceptions while analysts retain authority over risk decisions.",
          },
          {
            tag: "Sanctions screening",
            title: "Sanctions screening with explainable matching.",
            body: "Surface likely matches, suppress weak noise, and show why a result should be cleared, escalated, or reviewed.",
          },
          {
            tag: "SAR support",
            title: "SAR support that respects the analyst.",
            body: "Draft narratives, assemble supporting evidence, and keep final filing authority with the people accountable for it.",
          },
        ],
        midCtaHeadline:
          "Bring us the financial-crime workflow creating the most friction.",
        midCtaBody:
          "We will map the alert sources, evidence needs, review steps, and risk boundaries, then show whether Sentra or a custom build is the right path.",
        operatingContextHeading: "Useful where compliance work depends on judgment, evidence, and timing.",
        operatingContextBody:
          "Financial-crime workflows benefit when AI narrows the queue, assembles the evidence, and keeps the rationale clear enough for review.",
        operatingContextList: [
          "AML alert triage with too many low-value cases",
          "KYC refreshes that require faster evidence collection",
          "Sanctions screening where context changes the next action",
          "Beneficial-ownership reviews with fragmented records",
          "SAR narrative preparation that needs consistency and traceability",
          "Customer-risk monitoring where reviewers need the why, not just a score",
        ],
        productsHeading: "Accelerator paths for financial-crime workflows.",
        productsBody:
          "Sentra accelerates alert triage, ownership review, sanctions context, and customer-risk workflows where the pattern fits.",
        products: [
          {
            name: "Sentra",
            status: "ACCELERATOR",
            statusColor: "bg-lime-500",
            description:
              "Financial-crime and customer-risk acceleration for AML, KYC, sanctions, ownership, and alert-triage workflows.",
            cta: "Get Started",
            href: "/accelerators/sentra",
          },
        ],
        closingCta: {
          headline: "Show us the control point. We will show you the AI path around it.",
          body: "The goal is not more automation for its own sake. It is faster work your risk, compliance, and technology leaders can defend.",
        },
      }}
    />
  );
}
