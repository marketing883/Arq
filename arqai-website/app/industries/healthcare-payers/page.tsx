"use client";

import { IndustryPage } from "@/components/industries/IndustryPage";

export default function HealthcarePayersPage() {
  return (
    <IndustryPage
      data={{
        eyebrow: "Industries / Healthcare payers",
        heroHeadline: "AI for payer workflows where every decision needs evidence.",
        heroSubhead:
          "Payment integrity, prior authorization, utilization management, and care operations all depend on the same thing: the right context, in the right workflow, before the decision is made.",
        heroImage:
          "/img/services/Healthcare-Real-Time-Risk-Stratification-With-Built-In-Compliance.jpg",
        heroImageAlt: "Healthcare payer operations",
        primaryCta: { label: "Get Started", href: "/engage-us" },
        secondaryCta: { label: "Get Started", href: "/products/arqfwa" },
        outcomes: [
          {
            metric: "30%+",
            label: "More high-value risk surfaced",
            description:
              "Claims, provider history, policy rules, and member context come together so review teams can focus on cases worth action.",
          },
          {
            metric: "2x",
            label: "Faster clinical and claims review",
            description:
              "Routine reviews move faster while edge cases route to the people who need to make the call.",
          },
          {
            metric: "100%",
            label: "Evidence-ready decisions",
            description:
              "Recommendations carry the rationale, source context, and policy trail your compliance and program-integrity teams need.",
          },
        ],
        useCasesHeading: "Where AI can create leverage inside payer operations.",
        useCases: [
          {
            tag: "Fraud, waste, abuse",
            title: "Payment integrity that sees across the claim.",
            body: "Spot billing anomalies, provider risk, claims leakage, and policy conflicts with explanations a reviewer can defend.",
          },
          {
            tag: "Patient management",
            title: "Member outreach that does not lose the thread.",
            body: "Prioritize the members who need follow-up, surface the right next action, and keep care teams working from current context.",
          },
          {
            tag: "Prior auth",
            title: "Prior authorization that moves with policy.",
            body: "Route routine requests, flag incomplete evidence, and escalate the decisions that need clinical review.",
          },
          {
            tag: "Utilization management",
            title: "Utilization management with defensible context.",
            body: "Tie recommendations to plan-specific guidelines, utilization history, and the evidence reviewers need at decision time.",
          },
        ],
        midCtaHeadline:
          "Bring us the payer workflow creating the most drag.",
        midCtaBody:
          "We will review the process, the data sources, and the decision points, then show whether a productized agent, accelerator, or custom build is the right path.",
        audienceHeading: "Built for leaders accountable for payer performance.",
        audienceBody:
          "Operations leaders, program-integrity directors, claims teams, medical-management leaders, and the technology executives backing them at:",
        audienceList: [
          "BCBS regional plans",
          "Medicaid managed care organisations",
          "Mid-tier Medicare Advantage plans",
          "Independent practice associations and provider-sponsored plans",
          "Mid-market commercial health plans",
          "Specialty and ancillary plans",
        ],
        productsHeading: "Productized where it earns its place.",
        productsBody:
          "ArqFWA is live for payment integrity and claims review. Veyra and Luma accelerate adjacent payer workflows from the same governed foundation.",
        products: [
          {
            name: "ArqFWA",
            status: "LIVE",
            statusColor: "bg-green-500",
            description:
              "The AI agent for fraud, waste, and abuse detection. Built for healthcare payers and P&C insurance carriers.",
            cta: "Get Started",
            href: "/products/arqfwa",
          },
          {
            name: "Veyra",
            status: "ACCELERATOR",
            statusColor: "bg-lime-500",
            description:
              "Payment-integrity and fraud intelligence for payer teams that need better prioritization and cleaner evidence.",
            cta: "Get Started",
            href: "/accelerators/veyra",
          },
          {
            name: "Luma",
            status: "ACCELERATOR",
            statusColor: "bg-lime-500",
            description:
              "Claims triage and decision support for intake, routing, evidence review, and reviewer handoff.",
            cta: "Get Started",
            href: "/accelerators/luma",
          },
        ],
        closingCta: {
          headline: "Show us the workflow. We will show you the production path.",
          body: "We will help you separate useful AI leverage from another pilot that never reaches the operating team.",
        },
      }}
    />
  );
}
