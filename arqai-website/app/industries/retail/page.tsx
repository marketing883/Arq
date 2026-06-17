"use client";

import { IndustryPage } from "@/components/industries/IndustryPage";

export default function RetailPage() {
  return (
    <IndustryPage
      data={{
        eyebrow: "Industries / Retail",
        heroHeadline: "AI for retailers turning customer signals into better decisions.",
        heroSubhead:
          "Retail teams have signals everywhere: transactions, loyalty, inventory, store activity, pricing, and service conversations. We help turn those signals into actions that protect margin and deepen the customer relationship.",
        heroImage: "https://images.unsplash.com/photo-1759323321196-2813db509285?auto=format&fit=crop&w=1600&q=80",
        secondaryImage: "https://images.unsplash.com/photo-1736236560164-bc741c70bca5?auto=format&fit=crop&w=1920&q=80",
        heroImageAlt: "Retail operations",
        featuredAcceleratorId: "arqloyalty",
        contactIndustry: "Retail",
        contactWorkflow: "Loyalty, personalization, and customer operations",
        primaryCta: { label: "Get Started", href: "/engage-us" },
        secondaryCta: { label: "See use cases", href: "/use-cases" },
        outcomes: [
          {
            metric: "20%+",
            label: "Repeat-customer revenue lift",
            description:
              "Personalized offers and retention actions tied to behavior, not broad segments or stale campaign calendars.",
          },
          {
            metric: "30%",
            label: "Lower stock-out pressure",
            description:
              "Inventory, demand, and local signals come together so teams can act before the shelf or promotion misses the moment.",
          },
          {
            metric: "2x",
            label: "Faster associate answers",
            description:
              "Associates get current product, policy, and inventory context for the customer standing in front of them.",
          },
        ],
        useCasesHeading: "Where AI can create leverage inside retail operations.",
        useCases: [
          {
            tag: "Loyalty",
            title: "Loyalty that learns what customers actually value.",
            body: "Recommend offers, replenishment nudges, and retention actions tied to behavior, margin, inventory, and consent.",
          },
          {
            tag: "Inventory",
            title: "Inventory decisions that see demand earlier.",
            body: "Connect store, e-commerce, seasonality, and product signals to reduce stock-outs, markdowns, and avoidable working capital.",
          },
          {
            tag: "Store ops",
            title: "Store associate copilots grounded in your operation.",
            body: "Give associates product, policy, inventory, and customer context without forcing them to hunt across systems.",
          },
          {
            tag: "Pricing",
            title: "Pricing operations with guardrails.",
            body: "Use demand, competitor, inventory, and margin signals while keeping approval rules and auditability intact.",
          },
        ],
        midCtaHeadline:
          "Bring us the retail workflow where better timing would change the outcome.",
        midCtaBody:
          "We will map the signals, decisions, and guardrails, then show whether ArqLoyalty, a custom workflow, or a services-led build is the right starting point.",
        operatingContextHeading: "Useful where customer, inventory, and service signals need to become action.",
        operatingContextBody:
          "Retail AI works best when it can connect demand, behavior, margin, store execution, and service context without burying teams in another dashboard.",
        operatingContextList: [
          "Loyalty programs that need more relevant next-best actions",
          "Promotion workflows where margin and stock constraints matter",
          "Store operations where exceptions need faster routing",
          "Customer-service queues that need order, policy, and history context",
          "Demand and replenishment decisions with too many disconnected signals",
          "E-commerce journeys where support, offers, and fulfillment need to stay aligned",
        ],
        productsHeading: "Accelerator paths for retail workflow execution.",
        productsBody:
          "ArqLoyalty replaces an aging loyalty platform without migration risk. Other retail workflows are built around the systems, stores, and constraints already in place.",
        products: [
          {
            name: "ArqLoyalty",
            status: "ACCELERATOR",
            statusColor: "bg-lime-500",
            description:
              "A modern, AI-governed loyalty engine that runs in shadow, proves penny-for-penny parity daily, and cuts over on your timeline — no big-bang migration.",
            cta: "Get Started",
            href: "/accelerators/arqloyalty",
          },
        ],
        closingCta: {
          headline: "Show us the signal you are not using well enough.",
          body: "We will help turn it into a governed workflow your merchandising, store, loyalty, and technology teams can trust.",
        },
      }}
    />
  );
}
