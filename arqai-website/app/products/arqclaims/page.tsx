"use client";

import Image from "next/image";
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
    title: "Built for the full triage and routing workflow",
    description:
      "ArqClaims is a product, not a kit. It is calibrated for the operational logic mid-market P&C carriers actually run. Triage, routing, reserve recommendations, escalation handling. End-to-end.",
  },
  {
    title: "Engineered for production at scale",
    description:
      "ArqClaims runs on the same architectural foundation as every other ArqAI Labs product. Production-grade reliability is the default, not a roadmap goal.",
  },
  {
    title: "Adjusters in control",
    description:
      "ArqClaims surfaces the right context, prioritises the queue, and supports the decision. Your adjusters keep authority on every claim. The agent assists, not overrides.",
  },
];

export default function ArqClaimsPage() {
  return (
    <>
      <Header />

      <main className="bg-base">
        {/* Hero Section */}
        <section className="pt-32 md:pt-40 pb-16">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="grid lg:grid-cols-12 gap-10 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-7"
              >
                <div className="flex items-center gap-4 mb-6">
                  <p className="flex items-center gap-2 text-body-sm text-accent uppercase tracking-wider font-medium">
                    <StarIcon className="w-4 h-4" />
                    Product
                  </p>
                  <span className="inline-block text-xs font-semibold px-3 py-1.5 rounded-full text-white bg-amber-500">
                    IN BUILD
                  </span>
                </div>

                <h1 className="text-display-xl md:text-[clamp(2.5rem,5vw,4rem)] font-display leading-[1.1] text-text-bright mb-6">
                  The AI agent for claims triage. Built for the workflow, not a kit to build one.
                </h1>

                <p className="text-body-lg md:text-xl text-text-medium mb-10 leading-relaxed">
                  ArqClaims is the AI agent for claims triage and processing at mid-market P&C insurance carriers. It triages incoming claims, surfaces the right ones to the right adjuster, and handles the routing and reserve logic your operation runs on. In build with design partners now.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/contact" className="btn bg-accent text-white hover:bg-accent/90">
                    Get Started
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
                    </svg>
                  </Link>
                  <Link href="/demo" className="btn btn-outline">
                    Get Started
                  </Link>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="lg:col-span-5 relative"
              >
                <div className="relative rounded-xl overflow-hidden shadow-2xl shadow-accent/15 border border-stroke-muted bg-base-tint">
                  <Image
                    src="/img/Policy-Hub-Interface.png"
                    alt="ArqClaims interface preview"
                    width={900}
                    height={600}
                    className="w-full h-auto"
                  />
                </div>
                <div className="mt-6 p-5 rounded-xl bg-base-tint border border-stroke-muted">
                  <p className="text-body-xs text-amber-500 uppercase tracking-wider mb-2">Design partner build</p>
                  <p className="text-body-sm text-text-muted">Concept screens. Live deployment in pilot Q3 2026.</p>
                </div>
              </motion.div>
            </div>
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
                  Claims volume is up. Headcount is not. AI alternatives are not built for your operation.
                </h2>
                <p className="text-body-lg text-text-medium leading-relaxed">
                  Mid-market P&C carriers run claims operations under structural pressure. Volume rises. Adjuster bench expansion is slow and expensive. Cycle times stretch. Leakage compounds. Most of the AI options on offer either ship as horizontal toolkits that require an internal AI engineering bench you do not have, or solve a narrow slice of the workflow that disappears in handoff.
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
                Why ArqClaims
              </p>
              <h2 className="text-display-lg font-display text-text-bright">
                How ArqClaims is different
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
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="card p-8 md:p-12"
              >
                <h2 className="text-2xl font-display font-semibold text-text-bright mb-6">
                  Who ArqClaims is for
                </h2>
                <p className="text-body-lg text-text-muted leading-relaxed">
                  Built for VPs of Claims and claims operations directors at mid-market P&C carriers carrying $500M to $5B in direct written premium across personal auto, home, and commercial lines. Built for the technology and AI executives evaluating claims modernisation.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Design Partner Section */}
        <section className="py-section bg-base">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="bg-accent rounded-2xl p-8 md:p-12">
              <div className="max-w-3xl">
                <p className="text-white/60 text-sm uppercase tracking-wider mb-4">
                  Design Partner Program
                </p>
                <h2 className="text-2xl md:text-3xl font-display font-semibold text-white mb-6">
                  We are taking a small number of carriers into the design partner program now.
                </h2>
                <p className="text-white/80 text-lg mb-8">
                  Design partners shape the product. They get early access, a direct line to the engineering team, and pricing that reflects co-development. We are looking for two to three carriers.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-accent font-semibold rounded-lg hover:shadow-lg transition-all"
                >
                  Get Started
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
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-section bg-base-tint">
          <div className="container mx-auto px-4 md:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="text-display-lg font-display text-text-bright mb-6">
                Shape what ArqClaims becomes.
              </h2>
              <p className="text-body-lg text-text-muted mb-8">
                The earlier you are in the conversation, the more your operation shapes the product.
              </p>
              <Link
                href="/contact"
                className="btn bg-accent text-white hover:bg-accent/90"
              >
                Get Started
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
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
