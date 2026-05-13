"use client";

import { IndustryPage } from "@/components/industries/IndustryPage";

export default function ManufacturingPage() {
  return (
    <IndustryPage
      data={{
        eyebrow: "Industries / Manufacturing",
        heroHeadline: "AI for manufacturers that need the plant, ERP, and supply chain to speak the same language.",
        heroSubhead:
          "Manufacturing teams already have the data. The hard part is turning ERP, MES, quality, maintenance, supplier, and shift context into decisions before the line feels the cost.",
        heroImage:
          "/img/services/Manufacturing-Autonomous-Maintenance-With-Scoped-Agent-Control.jpg",
        heroImageAlt: "Manufacturing operations",
        primaryCta: { label: "Get Started", href: "/engage-us" },
        secondaryCta: { label: "See use cases", href: "/use-cases" },
        outcomes: [
          {
            metric: "70%",
            label: "Less manual reporting",
            description:
              "Turn ERP, MES, and operations data into answers leaders can use without another multi-day spreadsheet cycle.",
          },
          {
            metric: "30%",
            label: "Lower defect escape",
            description:
              "Combine quality signals, visual inspection, and production context so issues surface before they become customer problems.",
          },
          {
            metric: "40%",
            label: "Less unplanned downtime",
            description:
              "Maintenance recommendations connect sensor data, service history, parts context, and shift handoffs.",
          },
        ],
        useCasesHeading: "Where AI can create leverage inside manufacturing operations.",
        useCases: [
          {
            tag: "ERP",
            title: "ERP intelligence that answers the operational question.",
            body: "Translate master data, orders, inventory, and production context into answers for the people running the plant.",
          },
          {
            tag: "Quality control",
            title: "Quality control with context from every shift.",
            body: "Combine visual signals, inspection notes, process history, and exception routing so quality teams can act earlier.",
          },
          {
            tag: "Predictive maintenance",
            title: "Maintenance that moves before failure.",
            body: "Prioritize equipment risk using telemetry, service history, parts availability, and the production schedule.",
          },
          {
            tag: "S&OP / planning",
            title: "S&OP with tradeoffs surfaced earlier.",
            body: "Bring demand, capacity, inventory, supplier, and margin signals into the planning conversation before the meeting starts.",
          },
        ],
        midCtaHeadline:
          "Bring us the production workflow where delays are most expensive.",
        midCtaBody:
          "We will map the systems, signals, handoffs, and decision owners, then show whether Orbis, Kyra, or a custom build is the right starting point.",
        audienceHeading: "Built for leaders accountable for throughput and reliability.",
        audienceBody:
          "VPs of operations, plant managers, quality directors, maintenance leads, supply-chain directors, plus the CIOs and Heads of AI driving manufacturing modernization at:",
        audienceList: [
          "Mid-market industrial manufacturers",
          "Process and chemical operators",
          "Automotive suppliers and Tier 1/2 plants",
          "Discrete manufacturing across electronics and machinery",
          "Food, beverage, and CPG manufacturers",
          "Operators running aged ERP and MES stacks",
        ],
        productsHeading: "Custom builds where productized does not fit.",
        productsBody:
          "Orbis accelerates supplier and dependency-risk workflows. Kyra supports service and incident operations. Plant-specific use cases are built around your stack and operating model.",
        products: [
          {
            name: "Orbis",
            status: "ACCELERATOR",
            statusColor: "bg-lime-500",
            description:
              "Supplier, procurement, logistics, and dependency-risk intelligence for industrial operating teams.",
            cta: "Get Started",
            href: "/accelerators/orbis",
          },
          {
            name: "Kyra",
            status: "ACCELERATOR",
            statusColor: "bg-lime-500",
            description:
              "Incident enrichment, escalation, and service-restoration support for operations and service teams.",
            cta: "Get Started",
            href: "/accelerators/kyra",
          },
        ],
        closingCta: {
          headline: "Show us where the operation loses time, quality, or confidence.",
          body: "We will help turn the signal into a governed workflow that your plant, supply-chain, and technology teams can use.",
        },
      }}
    />
  );
}
