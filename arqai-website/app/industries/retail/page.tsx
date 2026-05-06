"use client";

import { IndustryPage } from "@/components/industries/IndustryPage";

export default function RetailPage() {
  return (
    <IndustryPage
      data={{
        eyebrow: "Industries / Retail",
        heroHeadline: "AI for retail teams that compete on customer relationship.",
        heroSubhead:
          "Loyalty that learns. Inventory that anticipates. Store associate copilots that actually help. Built for retailers tired of static loyalty programs and inventory that lags the floor.",
        heroImage:
          "/img/services/Retail-40-percent-Faster-Pricing-Ops-Without-Manual-Review.jpg",
        heroImageAlt: "Retail operations",
        primaryCta: { label: "Engage us", href: "/engage-us" },
        secondaryCta: { label: "See use cases", href: "/use-cases" },
        outcomes: [
          {
            metric: "20%+",
            label: "Lift in repeat-customer revenue",
            description:
              "Loyalty that replaces points-and-badges with offers tuned to actual buying behavior. Retention up. Spend on stale incentives down.",
          },
          {
            metric: "30%",
            label: "Lower stock-out rate",
            description:
              "AI that sees the shelf, the season, and the local trend at once. Fewer stock-outs, fewer markdowns, less working capital tied up.",
          },
          {
            metric: "2x",
            label: "Faster store-associate answers",
            description:
              "Copilots that give associates the right answer for the customer in front of them, drawn from your catalog, your policies, and your store ops.",
          },
        ],
        useCasesHeading: "Where we work in retail operations.",
        useCases: [
          {
            tag: "Loyalty",
            title: "Loyalty that learns what each customer values.",
            body: "Replaces points-and-badges with offers tuned to actual buying behavior. Retention up. Spend on stale incentives down.",
          },
          {
            tag: "Inventory",
            title: "Inventory that anticipates.",
            body: "AI that sees the shelf, the season, and the local trend at once. Stock-outs down. Markdowns down.",
          },
          {
            tag: "Store ops",
            title: "Store associate copilots that actually help.",
            body: "Right answer for the customer in front of them, drawn from your catalog, your policies, and your store ops.",
          },
          {
            tag: "Pricing",
            title: "Pricing ops without the manual review queue.",
            body: "Dynamic pricing tuned to demand, competitor signals, and your margin guardrails. Auditable, defensible, fast.",
          },
        ],
        midCtaHeadline:
          "Bring your customer data, your inventory data, your shelf data. We'll show you what shifts.",
        midCtaBody:
          "30 minutes with a senior on our team. Plain language. No deck. We'll tell you whether a custom build is the right path or whether one of our productised agents fits.",
        audienceHeading: "Built for the operators who own the customer.",
        audienceBody:
          "Heads of CRM and loyalty, VPs of e-commerce, store-operations leadership, supply-chain directors, plus the technology and AI executives backing them at:",
        audienceList: [
          "Multi-store specialty retailers",
          "Digitally-native vertical brands",
          "Mid-market grocers and convenience chains",
          "Apparel and home retailers",
          "Health, beauty, and wellness retailers",
          "QSR and food-service operators",
        ],
        productsHeading: "Custom builds, where productised doesn't fit.",
        productsBody:
          "We don't have a productised retail agent yet. Most retail engagements are bespoke. When the same workflow shows up across enough customers, that changes.",
        products: [],
        closingCta: {
          headline: "Tell us what your operation needs.",
          body: "We'll tell you what's honestly possible. In plain language. Without a deck.",
        },
      }}
    />
  );
}
