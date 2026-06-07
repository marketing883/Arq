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
        heroImage: "https://images.unsplash.com/photo-1597328290883-50c5787b7c7e?auto=format&fit=crop&w=1600&q=80",
        secondaryImage: "https://images.unsplash.com/photo-1683446748468-eba61cda9473?auto=format&fit=crop&w=1920&q=80",
        heroImageAlt: "P&C insurance operations",
        primaryCta: { label: "Get Started", href: "/engage-us" },
        secondaryCta: { label: "Explore accelerators", href: "/accelerators" },
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
          "We will map the decision path, the data required, and the human-review points, then show where an accelerator or custom build fits.",
        operatingContextHeading: "Useful where claim decisions need speed and defensible evidence.",
        operatingContextBody:
          "Carrier workflows benefit most when the work is high-volume, evidence-heavy, and too important to hand to an opaque model.",
        operatingContextList: [
          "FNOL intake that needs complete capture from the first touch",
          "Claim routing where severity, coverage, and complexity matter",
          "SIU referral workflows that need stronger signal before review",
          "Reserve recommendations that require context and traceability",
          "Underwriting reviews with exceptions that cannot be missed",
          "Policyholder service workflows where status and next action need clarity",
        ],
        productsHeading: "Accelerator paths for claims and leakage workflows.",
        productsBody:
          "Luma and Veyra cover claims intake, triage, investigation, and leakage-review patterns from the same governed foundation.",
        products: [
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
