"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

function StarIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
    >
      <path d="M19.6,9.6h-3.9c-.4,0-1.8-.2-1.8-.2-.6,0-1.1-.2-1.6-.6-.5-.3-.9-.8-1.2-1.2-.3-.4-.4-.9-.5-1.4,0,0,0-1.1-.2-1.5V.4c0-.2-.2-.4-.4-.4s-.4.2-.4.4v4.4c0,.4-.2,1.5-.2,1.5,0,.5-.2,1-.5,1.4-.3.5-.7.9-1.2,1.2s-1,.5-1.6.6c0,0-1.2,0-1.7.2H.4c-.2,0-.4.2-.4.4s.2.4.4.4h4.1c.4,0,1.7.2,1.7.2.6,0,1.1.2,1.6.6.4.3.8.7,1.1,1.1.3.5.5,1,.6,1.6,0,0,0,1.3.2,1.7v4.1c0,.2.2.4.4.4s.4-.2.4-.4v-4.1c0-.4.2-1.7.2-1.7,0-.6.2-1.1.6-1.6.3-.4.7-.8,1.1-1.1.5-.3,1-.5,1.6-.6,0,0,1.3,0,1.8-.2h3.9c.2,0,.4-.2.4-.4s-.2-.4-.4-.4h0Z" />
    </svg>
  );
}

const differentiators = [
  {
    title: "Built for the size of bank you actually are",
    description:
      "Designed for regional banks ($10B-$100B in assets) and mid-tier community banks ($1B-$10B in assets). Operational footprint sized for teams that do not have a dedicated AI engineering bench.",
  },
  {
    title: "Engineered for production, not for a benchmark",
    description:
      "Built on the same architectural foundation every ArqAI Labs product runs on. Production-grade by default. Integration depth is part of the product, not an integration project added on top.",
  },
  {
    title: "Calibrated for the workflows your team actually runs",
    description:
      "Sanctions screening. Customer due diligence. Transaction monitoring. SAR support. Each one calibrated to the operational logic financial crimes leaders at regional banks actually run.",
  },
];

const audiences = [
  "BSA officers",
  "Financial crimes directors",
  "AML programme leads",
  "Compliance officers",
  "CTOs and Heads of AI",
];

const bankTypes = [
  "Regional banks ($10B-$100B in assets)",
  "Mid-tier community banks ($1B-$10B in assets)",
  "Credit unions and thrifts with active financial-crimes programs",
];

export default function ArqBankerPage() {
  return (
    <>
      <Header />

      <main className="bg-base">
        {/* Hero Section */}
        <section className="pt-32 md:pt-40 pb-16">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl"
            >
              <div className="flex items-center gap-4 mb-6">
                <p className="flex items-center gap-2 text-body-sm text-accent uppercase tracking-wider font-medium">
                  <StarIcon className="w-4 h-4" />
                  Product
                </p>
                <span className="inline-block text-xs font-semibold px-3 py-1.5 rounded-full text-white bg-blue-500">
                  COMING
                </span>
              </div>

              <h1 className="text-display-xl md:text-[clamp(2.5rem,5vw,4rem)] font-display leading-[1.1] text-text-bright mb-6">
                The AI agent for AML, KYC, and financial crime. Built for the operation you actually run.
              </h1>

              <p className="text-body-lg md:text-xl text-text-medium max-w-3xl mb-10 leading-relaxed">
                ArqBanker is the AI agent for financial crimes operations at regional and mid-tier banks. It is built for the operational reality of running an AML, KYC, and financial-crime program on a lean team, with the integration depth and architectural reliability that production deployment requires.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/demo"
                  className="btn bg-accent text-white hover:bg-accent/90"
                >
                  Get notified when ArqBanker launches
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 17L17 7M17 7H7M17 7v10"
                    />
                  </svg>
                </Link>
                <Link href="/contact" className="btn btn-outline">
                  Talk to product
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Problem Section */}
        <section className="py-section bg-base-tint">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="max-w-4xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-display-lg font-display text-text-bright mb-6">
                  Mid-tier banks carry top-tier compliance pressure on lean teams.
                </h2>
                <p className="text-body-lg text-text-medium leading-relaxed">
                  Regional and mid-tier banks face the same operational expectations as the largest institutions, with smaller teams, leaner budgets, and AML stacks built before AI was a serious option. The result is alert fatigue, manual review queues that never empty, and a financial crimes program that runs on the heroics of a small team. The AI alternatives are mostly horizontal toolkits that ask your team to assemble the agent themselves, or vendors who serve top-tier institutions and do not understand the operational reality of a $5B to $50B asset bank.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Differentiators Section */}
        <section className="py-section bg-base">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <p className="flex items-center justify-center gap-2 text-body-sm text-accent mb-4">
                <StarIcon className="w-4 h-4" />
                Why ArqBanker
              </p>
              <h2 className="text-display-lg font-display text-text-bright">
                How ArqBanker is different
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {differentiators.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="card p-8"
                >
                  <div className="text-4xl font-display font-bold text-accent/20 mb-4">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <h3 className="text-xl font-display font-semibold text-text-bright mb-4">
                    {item.title}
                  </h3>
                  <p className="text-body-md text-text-muted leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Who It's For Section */}
        <section className="py-section bg-base-tint">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="card p-8"
              >
                <h3 className="text-2xl font-display font-semibold text-text-bright mb-6">
                  Who ArqBanker is for
                </h3>
                <ul className="space-y-3">
                  {audiences.map((item, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-accent"></div>
                      <span className="text-body-md text-text-muted">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="card p-8"
              >
                <h3 className="text-2xl font-display font-semibold text-text-bright mb-6">
                  At institutions like
                </h3>
                <ul className="space-y-3">
                  {bankTypes.map((item, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-accent"></div>
                      <span className="text-body-md text-text-muted">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Status Section */}
        <section className="py-section bg-base">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <p className="flex items-center justify-center gap-2 text-body-sm text-accent mb-4">
                  <StarIcon className="w-4 h-4" />
                  Status
                </p>
                <h2 className="text-display-lg font-display text-text-bright mb-6">
                  Status and timing
                </h2>
                <p className="text-body-lg text-text-muted leading-relaxed">
                  ArqBanker is in development. Pre-design-partner and pre-pilot. The earlier you are in the conversation, the more your operation shapes the product. We are looking for the kinds of teams we are building this for.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-section bg-base-tint">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="bg-accent rounded-2xl p-8 md:p-12 text-center">
              <h2 className="text-2xl md:text-3xl font-display font-semibold text-white mb-6">
                Shape what ArqBanker becomes.
              </h2>
              <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
                The earlier you are in the conversation, the more your operation shapes the product.
              </p>
              <Link
                href="/demo"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-accent font-semibold rounded-lg hover:shadow-lg transition-all"
              >
                Get on the early-access list
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
