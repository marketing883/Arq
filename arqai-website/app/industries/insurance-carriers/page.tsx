"use client";

import { IndustryPage } from "@/components/industries/IndustryPage";

export default function InsuranceCarriersPage() {
  return (
    <IndustryPage
      data={{
        eyebrow: "Industries / P&C insurance",
        heroHeadline: "AI for carriers that need faster claims without weaker judgment.",
        heroSubhead:
          "From FNOL to SIU referral, carriers need speed, evidence, and adjuster confidence in the same workflow. We build AI around the decisions your teams already own.",
        heroImage: "/img/industries/insurance-claims-vehicle.jpg",
        heroImageAlt: "P&C insurance operations",
        primaryCta: { label: "Get Started", href: "/engage-us" },
        secondaryCta: { label: "Get Started", href: "/products/arqclaims" },
        outcomes: [
          {
            metric: "40%",
            label: "Faster claims movement",
            description:
              "Route claims, summarize evidence, flag missing details, and help adjusters move files without losing context.",
          },
          {
            metric: "25%+",
            label: "More suspicious claims surfaced",
            description:
              "Patterns across claimant history, provider activity, loss details, and policy context surface earlier for SIU review.",
          },
          {
            metric: "Zero",
            label: "Authority taken from adjusters",
            description:
              "AI supports triage, documentation, and recommendations while human ownership stays clear on every claim decision.",
          },
        ],
        useCasesHeading: "Where AI can create leverage inside carrier operations.",
        useCases: [
          {
            tag: "Claims triage",
            title: "Claims triage tuned to your operating rules.",
            body: "Classify intake, enrich the file, recommend routing, and surface the coverage and severity signals adjusters need first.",
          },
          {
            tag: "Fraud detection",
            title: "Fraud detection that gives SIU a head start.",
            body: "Flag suspicious patterns across personal, commercial, and specialty lines with the evidence chain needed for investigation.",
          },
          {
            tag: "Underwriting",
            title: "Underwriting support with a clear rationale.",
            body: "Surface external data, apply guidelines, highlight exceptions, and explain why a risk deserves attention.",
          },
          {
            tag: "Customer service",
            title: "FNOL that captures the details that matter.",
            body: "Guide intake, identify missing evidence, route the claim correctly, and keep policyholders informed from the first touch.",
          },
        ],
        midCtaHeadline:
          "Bring us the claim workflow slowing the operation down.",
        midCtaBody:
          "We will map the decision path, the data required, and the human-review points, then show where ArqClaims, ArqFWA, or a custom build fits.",
        audienceHeading: "Built for leaders accountable for claim quality and loss outcomes.",
        audienceBody:
          "Claims executives, claims operations leaders, SIU teams, underwriting leaders, and the technology executives modernizing carrier operations across:",
        audienceList: [
          "Mid-market personal lines carriers (auto, home)",
          "Commercial and specialty lines carriers",
          "Regional carriers writing $500M to $5B in DWP",
          "Reinsurers and MGAs",
          "Carriers running aged claims platforms",
          "Carriers expanding into new lines",
        ],
        productsHeading: "Productized where it earns its place.",
        productsBody:
          "ArqFWA is live for suspicious-claim review. ArqClaims, Luma, and Veyra cover adjacent claims, triage, and investigation patterns from the same governed foundation.",
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
          {
            name: "Luma",
            status: "ACCELERATOR",
            statusColor: "bg-lime-500",
            description:
              "Claims intake, enrichment, routing, and reviewer support for teams moving high-volume claim queues.",
            cta: "Get Started",
            href: "/accelerators/luma",
          },
          {
            name: "Veyra",
            status: "ACCELERATOR",
            statusColor: "bg-lime-500",
            description:
              "Suspicious-claim and leakage intelligence that gives SIU teams a cleaner path to the right cases.",
            cta: "Get Started",
            href: "/accelerators/veyra",
          },
        ],
        closingCta: {
          headline: "Show us the carrier workflow. We will show you the production path.",
          body: "We will help you separate high-value AI from tooling that adds one more screen to an already busy claims desk.",
        },
      }}
    />
  );
}
