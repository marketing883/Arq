"use client";

import { IndustryPage } from "@/components/industries/IndustryPage";

export default function InsuranceCarriersPage() {
  return (
    <IndustryPage
      data={{
        eyebrow: "Industries / P&C insurance",
        heroHeadline: "AI for the carriers that take operations seriously.",
        heroSubhead:
          "Triage faster. Underwrite smarter. Catch more fraud. Close more claims with the people you already have. Built for mid-market personal, commercial, and specialty lines.",
        heroImage: "/img/services/use-case-2.webp",
        heroImageAlt: "P&C insurance operations",
        primaryCta: { label: "Get Started", href: "/engage-us" },
        secondaryCta: { label: "Get Started", href: "/products/arqclaims" },
        outcomes: [
          {
            metric: "40%",
            label: "Faster claims cycle",
            description:
              "Triage incoming claims, surface the right ones to the right adjuster, and support the decision your team makes.",
          },
          {
            metric: "25%+",
            label: "More suspicious claims caught",
            description:
              "ArqFWA reviews high volumes of claims and transactions and explains every flag, with the evidence chain SIU needs.",
          },
          {
            metric: "Zero",
            label: "Adjuster authority lost",
            description:
              "ArqClaims surfaces context, prioritises queues, supports the call. Your adjusters keep authority on every claim.",
          },
        ],
        useCasesHeading: "Where we work in P&C carrier operations.",
        useCases: [
          {
            tag: "Claims triage",
            title: "ArqClaims, tuned to your routing logic.",
            body: "Triages incoming claims, prioritises the queue, and recommends reserves and routing using the rules your operation actually runs.",
          },
          {
            tag: "Fraud detection",
            title: "ArqFWA, calibrated to your lines of business.",
            body: "Suspicious claim patterns flagged across personal auto, home, commercial, and specialty lines, with explanations that hold up in SIU.",
          },
          {
            tag: "Underwriting",
            title: "Underwriting AI that earns the underwriter's trust.",
            body: "Surfaces external data, applies your guidelines, and explains its risk scoring. The underwriter still owns the decision.",
          },
          {
            tag: "Customer service",
            title: "First-notice-of-loss that doesn't drop the ball.",
            body: "Captures the right details on the first call, routes to the right adjuster, and gives policyholders status they can trust.",
          },
        ],
        midCtaHeadline:
          "Bring a slice of your loss data. We'll show you what shifts.",
        midCtaBody:
          "30 minutes with a senior on our team. Plain language. No deck. We'll tell you whether ArqFWA, ArqClaims, or a custom build is the right path for your operation.",
        audienceHeading: "Built for the leaders who own the loss ratio.",
        audienceBody:
          "VPs of Claims, claims operations directors, SIU and special-investigations leaders, plus the technology and AI executives evaluating modernisation across:",
        audienceList: [
          "Mid-market personal lines carriers (auto, home)",
          "Commercial and specialty lines carriers",
          "Regional carriers writing $500M to $5B in DWP",
          "Reinsurers and MGAs",
          "Carriers running aged claims platforms",
          "Carriers expanding into new lines",
        ],
        productsHeading: "Productised where it earns its place.",
        productsBody:
          "Live today: ArqFWA. In build with design partners: ArqClaims. Both built on the same architectural foundation.",
        products: [
          {
            name: "ArqFWA",
            status: "LIVE",
            statusColor: "bg-green-500",
            description:
              "The AI agent for fraud, waste, and abuse detection across personal and commercial lines.",
            cta: "Get Started",
            href: "/products/arqfwa",
          },
          {
            name: "ArqClaims",
            status: "IN BUILD",
            statusColor: "bg-amber-500",
            description:
              "The AI agent for claims triage and processing at mid-market P&C carriers. Design partner program open.",
            cta: "Get Started",
            href: "/products/arqclaims",
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
