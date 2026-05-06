"use client";

import { IndustryPage } from "@/components/industries/IndustryPage";

export default function BankingPage() {
  return (
    <IndustryPage
      data={{
        eyebrow: "Industries / Banking",
        heroHeadline: "AI built for the bank you actually are.",
        heroSubhead:
          "AML, KYC, transaction monitoring, customer onboarding. Built for regional and mid-tier banks running financial-crime programs on lean teams. Production-grade by architecture, not by patch.",
        heroImage:
          "/img/services/Banking-Customer-Service-That-Resolves-50-percent-of-Tickets-Automatically.jpg",
        heroImageAlt: "Banking operations",
        primaryCta: { label: "Engage us", href: "/engage-us" },
        secondaryCta: { label: "See ArqBanker", href: "/products/arqbanker" },
        outcomes: [
          {
            metric: "60%",
            label: "Less alert fatigue",
            description:
              "Smarter triage and explainable scoring at scale. Your investigators work the alerts that matter, not the ones the legacy system can't dismiss.",
          },
          {
            metric: "3x",
            label: "Faster KYC onboarding",
            description:
              "Customer due diligence that completes itself, with a clean audit trail. Fewer abandoned applications. Faster time to active customer.",
          },
          {
            metric: "100%",
            label: "Defensible decisions",
            description:
              "Every flag, every clearance, every SAR draft carries decision provenance your BSA officer and examiners can audit on demand.",
          },
        ],
        useCasesHeading: "Where we work in regional and mid-tier bank operations.",
        useCases: [
          {
            tag: "AML monitoring",
            title: "Transaction monitoring that explains every alert.",
            body: "Suppresses noise, raises the right alerts, and ties each one to the typology, the customer profile, and the data that prompted it.",
          },
          {
            tag: "KYC / CDD",
            title: "Customer due diligence that finishes itself.",
            body: "AI gets KYC and CDD across the line without dropping the application. Fewer abandoned applications. Faster time-to-active customer.",
          },
          {
            tag: "Sanctions screening",
            title: "Sanctions screening calibrated to your risk appetite.",
            body: "Screens against the lists that matter to your book of business, with explainable matching that holds up in audit.",
          },
          {
            tag: "SAR support",
            title: "SAR drafting that respects the analyst.",
            body: "Drafts the narrative, surfaces the supporting evidence, and lets the analyst keep authority on every filing.",
          },
        ],
        midCtaHeadline:
          "Bring a sample of your alert data. We'll show you what changes.",
        midCtaBody:
          "30 minutes with a senior on our team. Plain language. No deck. We'll tell you whether ArqBanker, a custom build, or services is the right path for your operation.",
        audienceHeading: "Built for the people running the financial-crime program.",
        audienceBody:
          "BSA officers, financial crimes directors, AML programme leads, compliance officers, plus the CTOs and Heads of AI evaluating financial-crime modernisation at:",
        audienceList: [
          "Regional banks ($10B-$100B in assets)",
          "Mid-tier community banks ($1B-$10B in assets)",
          "Credit unions and thrifts with active financial-crimes programs",
          "Trust banks and private wealth platforms",
          "Specialty lenders and digital banks",
          "Cross-border and correspondent operations",
        ],
        productsHeading: "Productised where it earns its place.",
        productsBody:
          "Coming: ArqBanker. The earlier you are in the conversation, the more your operation shapes the product.",
        products: [
          {
            name: "ArqBanker",
            status: "COMING",
            statusColor: "bg-blue-500",
            description:
              "The AI agent for AML, KYC, and financial crime at regional and mid-tier banks. In development.",
            cta: "Get notified at launch",
            href: "/products/arqbanker",
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
