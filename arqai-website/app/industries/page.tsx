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

const solutions = [
  {
    title: "Healthcare payers",
    description:
      "AI agents for healthcare payer operations. ArqFWA for fraud, waste, and abuse detection. More on the roadmap.",
    audiences: [
      "BCBS regional plans",
      "Medicaid managed care organisations",
      "Medicare Advantage plans",
      "Commercial health plans",
    ],
    availableProducts: ["ArqFWA"],
    href: "/industries/healthcare-payers",
    image: "/img/services/Healthcare-Real-Time-Risk-Stratification-With-Built-In-Compliance.jpg",
  },
  {
    title: "P&C insurance carriers",
    description:
      "AI agents for property and casualty carrier operations. ArqFWA live. ArqClaims in build.",
    audiences: [
      "Personal lines carriers",
      "Commercial and specialty lines",
      "Regional carriers",
    ],
    availableProducts: ["ArqFWA", "ArqClaims"],
    href: "/industries/insurance-carriers",
    image: "/img/services/Retail-40-percent-Faster-Pricing-Ops-Without-Manual-Review.jpg",
  },
  {
    title: "Banks and financial institutions",
    description:
      "AI agents for regional and mid-tier banks. ArqBanker for AML, KYC, and financial crime coming soon.",
    audiences: [
      "Regional banks ($10B-$100B assets)",
      "Mid-tier community banks",
      "Credit unions and thrifts",
    ],
    availableProducts: ["ArqBanker"],
    href: "/industries/banking",
    image: "/img/services/Banking-Customer-Service-That-Resolves-50-percent-of-Tickets-Automatically.jpg",
  },
];

export default function SolutionsPage() {
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
              <p className="flex items-center gap-2 text-body-sm text-accent mb-6 uppercase tracking-wider font-medium">
                <StarIcon className="w-4 h-4" />
                Industries
              </p>

              <h1 className="text-display-xl md:text-[clamp(3rem,5vw,4.5rem)] font-display leading-[1.1] text-text-bright mb-6">
                AI for the industries we go deep in.
              </h1>

              <p className="text-body-lg md:text-xl text-text-medium max-w-3xl leading-relaxed">
                ArqAI Labs builds vertical AI agents for high-stakes operational workflows. We go deep in healthcare, insurance, and banking. Each solution is built for the operational reality of the industry.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Solutions Grid */}
        <section className="py-section bg-base-tint">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="grid gap-8">
              {solutions.map((solution, index) => (
                <motion.div
                  key={solution.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="card p-0 overflow-hidden group hover:border-accent transition-all"
                >
                  <div className={`grid lg:grid-cols-12 gap-0 items-stretch ${index % 2 === 1 ? "lg:[&>div:first-child]:order-2" : ""}`}>
                    <div className="lg:col-span-7 p-8 md:p-10">
                      <h2 className="text-3xl font-display font-semibold text-text-bright mb-4 group-hover:text-accent transition-colors">
                        {solution.title}
                      </h2>
                      <p className="text-body-lg text-text-muted mb-6">
                        {solution.description}
                      </p>

                      <div className="mb-6">
                        <h4 className="text-body-sm font-semibold text-text-bright uppercase tracking-wider mb-3">
                          Built for
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {solution.audiences.map((audience) => (
                            <span
                              key={audience}
                              className="px-3 py-1.5 rounded-full bg-base text-body-sm text-text-muted border border-stroke-muted"
                            >
                              {audience}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mb-8">
                        <h4 className="text-body-sm font-semibold text-text-bright uppercase tracking-wider mb-3">
                          Products
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {solution.availableProducts.map((product) => (
                            <span
                              key={product}
                              className="px-3 py-1.5 rounded-full bg-accent/10 text-body-sm text-accent font-medium"
                            >
                              {product}
                            </span>
                          ))}
                        </div>
                      </div>

                      <Link
                        href={solution.href}
                        className="btn bg-accent text-white hover:bg-accent/90 inline-flex items-center gap-2"
                      >
                        Learn more
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </Link>
                    </div>

                    <div className="lg:col-span-5 relative bg-base-tint min-h-[260px] lg:min-h-full">
                      <Image
                        src={solution.image}
                        alt={solution.title}
                        fill
                        sizes="(min-width:1024px) 40vw, 100vw"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-tr from-base-opp/30 via-transparent to-transparent" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-section bg-base">
          <div className="container mx-auto px-4 md:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="text-display-lg font-display text-text-bright mb-6">
                Different industry?
              </h2>
              <p className="text-body-lg text-text-muted mb-8">
                We don&apos;t ship templates. Most of the engagements we run weren&apos;t on a public page when they started. Tell us what your operation needs and we&apos;ll tell you what&apos;s honestly possible.
              </p>
              <Link
                href="/engage-us"
                className="btn bg-accent text-white hover:bg-accent/90"
              >
                Engage us
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
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
