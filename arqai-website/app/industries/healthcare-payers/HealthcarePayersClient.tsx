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
        heroImage: "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1600&q=80",
        secondaryImage: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=1920&q=80",
        heroImageAlt: "Healthcare payer operations",
        featuredAcceleratorId: "arqfwa",
        contactIndustry: "Healthcare payers",
        contactWorkflow: "Payment integrity, claims, and program integrity",
        primaryCta: { label: "Get Started", href: "/engage-us" },
        secondaryCta: { label: "Explore accelerators", href: "/accelerators" },
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
          "We will review the process, the data sources, and the decision points, then show the cleanest path from current workflow to production-ready support.",
        operatingContextHeading: "Useful where review queues are heavy and evidence is scattered.",
        operatingContextBody:
          "The strongest payer use cases share the same pattern: high-volume decisions, regulated review, fragmented systems, and measurable consequences when the wrong case waits too long.",
        operatingContextList: [
          "Payment-integrity queues with too many low-signal cases",
          "Prior authorization reviews that need faster evidence assembly",
          "Utilization-management decisions that require clear rationale",
          "Care-management workflows split across notes, claims, and member context",
          "Appeals and grievance work that needs consistent documentation",
          "Audit preparation where every decision needs a defensible trail",
        ],
        productsHeading: "Accelerator paths for payer operating workflows.",
        productsBody:
          "ArqFWA anchors payer payment-integrity work; ArqSupport extends the same governed foundation to member, provider, and internal service queues.",
        products: [
          {
            name: "ArqFWA",
            status: "ACCELERATOR",
            statusColor: "bg-lime-500",
            description:
              "Payment-integrity and fraud intelligence for payer teams that need better prioritization and cleaner evidence.",
            cta: "Get Started",
            href: "/accelerators/arqfwa",
          },
          {
            name: "ArqSupport",
            status: "ACCELERATOR",
            statusColor: "bg-lime-500",
            description:
              "Agentic triage, auto-resolution, and SLA governance for member, provider, and internal service queues.",
            cta: "Get Started",
            href: "/accelerators/arqsupport",
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
