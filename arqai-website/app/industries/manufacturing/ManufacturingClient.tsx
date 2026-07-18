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
        heroImage: "https://images.unsplash.com/photo-1610891015188-5369212db097?auto=format&fit=crop&w=1600&q=80",
        secondaryImage: "https://images.unsplash.com/photo-1496247749665-49cf5b1022e9?auto=format&fit=crop&w=1920&q=80",
        heroImageAlt: "Manufacturing operations",
        featuredAcceleratorId: "arqlogistics",
        contactIndustry: "Manufacturing",
        contactWorkflow: "Supply chain and vendor risk",
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
          "We will map the systems, signals, handoffs, and decision owners, then show whether ArqLogistics, ArqTechOps, or a custom build is the right starting point.",
        operatingContextHeading: "Useful where plant decisions depend on signals spread across systems.",
        operatingContextBody:
          "Manufacturing AI creates value when it connects production reality, quality evidence, maintenance risk, supply constraints, and the people responsible for the next decision.",
        operatingContextList: [
          "ERP and MES workflows that do not answer operational questions fast enough",
          "Quality reviews where visual, inspection, and process context must line up",
          "Maintenance planning that needs telemetry, service history, and parts context",
          "Supplier-risk decisions affected by delays, substitutions, and dependencies",
          "Shift handoffs where exceptions need continuity",
          "S&OP work where demand, capacity, inventory, and margin tradeoffs collide",
        ],
        productsHeading: "Accelerator paths for industrial operating workflows.",
        productsBody:
          "ArqLogistics accelerates supplier and dependency-risk workflows. ArqTechOps supports service and incident operations. Plant-specific use cases are built around your stack and operating model.",
        products: [
          {
            name: "ArqLogistics",
            status: "ACCELERATOR",
            statusColor: "bg-lime-500",
            description:
              "Supplier, procurement, logistics, and dependency-risk intelligence for industrial operating teams.",
            cta: "Get Started",
            href: "/accelerators/arqlogistics",
          },
          {
            name: "ArqTechOps",
            status: "ACCELERATOR",
            statusColor: "bg-lime-500",
            description:
              "Incident enrichment, escalation, and service-restoration support for operations and service teams.",
            cta: "Get Started",
            href: "/accelerators/arqtechops",
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
