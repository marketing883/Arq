"use client";

import { IndustryPage } from "@/components/industries/IndustryPage";

export default function ManufacturingPage() {
  return (
    <IndustryPage
      data={{
        eyebrow: "Industries / Manufacturing",
        heroHeadline: "AI for manufacturing operations that need their data to talk back.",
        heroSubhead:
          "ERP that finally answers. Quality control with eyes on every shift. Maintenance that fixes things before they break. Reports that don't take your team three days to assemble.",
        heroImage:
          "/img/services/Manufacturing-Autonomous-Maintenance-With-Scoped-Agent-Control.jpg",
        heroImageAlt: "Manufacturing operations",
        primaryCta: { label: "Get Started", href: "/engage-us" },
        secondaryCta: { label: "See use cases", href: "/use-cases" },
        outcomes: [
          {
            metric: "70%",
            label: "Less time assembling reports",
            description:
              "AI on top of your ERP that turns the data into decisions. Fewer reports your team has to assemble by hand.",
          },
          {
            metric: "30%",
            label: "Lower defect-escape rate",
            description:
              "Vision and language models on the shop floor that catch what the manual sample missed. Defect rates down. Yield up.",
          },
          {
            metric: "40%",
            label: "Less unplanned downtime",
            description:
              "Predictive maintenance across critical equipment. Less downtime. Lower cost per repair. Cleaner shift handoffs.",
          },
        ],
        useCasesHeading: "Where we work in manufacturing operations.",
        useCases: [
          {
            tag: "ERP",
            title: "ERP that finally answers the question.",
            body: "AI on top of your ERP that turns master data into decisions. Fewer reports your team has to assemble by hand. Faster answers for the people running the line.",
          },
          {
            tag: "Quality control",
            title: "Quality control with eyes on every shift.",
            body: "Vision and language models that catch what the manual sample missed. Defect rates down. Yield up. Audit trail clean.",
          },
          {
            tag: "Predictive maintenance",
            title: "Maintenance that fixes things before they break.",
            body: "AI that predicts failures across critical equipment from sensor data and service history. Less downtime. Lower cost per repair.",
          },
          {
            tag: "S&OP / planning",
            title: "Sales and operations planning with answers, not screens.",
            body: "AI that compiles the cross-functional view your S&OP cycle needs and surfaces the right tradeoffs to the right owner.",
          },
        ],
        midCtaHeadline:
          "Bring a slice of your shop-floor or ERP data. We'll show you what changes.",
        midCtaBody:
          "30 minutes with a senior on our team. Plain language. No deck. We'll tell you whether a custom build, services, or a productised agent is the right path.",
        audienceHeading: "Built for the leaders who own the floor.",
        audienceBody:
          "VPs of operations, plant managers, quality directors, maintenance leads, supply-chain directors, plus the CIOs and Heads of AI driving manufacturing modernisation at:",
        audienceList: [
          "Mid-market industrial manufacturers",
          "Process and chemical operators",
          "Automotive suppliers and Tier 1/2 plants",
          "Discrete manufacturing across electronics and machinery",
          "Food, beverage, and CPG manufacturers",
          "Operators running aged ERP and MES stacks",
        ],
        productsHeading: "Custom builds, where productised doesn't fit.",
        productsBody:
          "We don't have a productised manufacturing agent yet. Most manufacturing engagements are bespoke. When the same workflow shows up across enough customers, that changes.",
        products: [],
        closingCta: {
          headline: "Tell us what your operation needs.",
          body: "We'll tell you what's honestly possible. In plain language. Without a deck.",
        },
      }}
    />
  );
}
