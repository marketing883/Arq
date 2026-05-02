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

const audiences = [
  "Regional banks ($10B-$100B in assets)",
  "Mid-tier community banks ($1B-$10B in assets)",
  "Credit unions and thrifts with active financial-crimes programs",
];

const roles = [
  "BSA officers",
  "Financial crimes directors",
  "AML programme leads",
  "Compliance officers",
  "CTOs and Heads of AI",
];

export default function BankingPage() {
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
                Solutions
              </p>

              <h1 className="text-display-xl md:text-[clamp(2.5rem,5vw,4rem)] font-display leading-[1.1] text-text-bright mb-6">
                AI agents built for the bank you are, not for the one Goldman Sachs is.
              </h1>

              <p className="text-body-lg md:text-xl text-text-medium max-w-3xl mb-10 leading-relaxed">
                ArqAI Labs builds vertical AI agents for regional and mid-tier US banks. Coming: ArqBanker, the AI agent for AML, KYC, and financial crime. Built for the operational reality of running a financial-crimes program on a lean team.
              </p>

              <Link
                href="/demo"
                className="btn bg-accent text-white hover:bg-accent/90"
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
                    d="M7 17L17 7M17 7H7M17 7v10"
                  />
                </svg>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Who We Serve */}
        <section className="py-section bg-base-tint">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-display-lg font-display text-text-bright mb-8">
                  Who we serve
                </h2>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-display font-semibold text-text-bright mb-4">
                      Built for
                    </h3>
                    <div className="space-y-3">
                      {roles.map((role, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center gap-3"
                        >
                          <div className="w-2 h-2 rounded-full bg-accent"></div>
                          <span className="text-body-md text-text-muted">{role}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-display font-semibold text-text-bright mb-4">
                      At institutions like
                    </h3>
                    <div className="space-y-3">
                      {audiences.map((audience, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center gap-3 p-4 bg-base rounded-lg border border-stroke-muted"
                        >
                          <div className="w-2 h-2 rounded-full bg-accent"></div>
                          <span className="text-body-md text-text-bright">{audience}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Coming Soon */}
        <section className="py-section bg-base">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <p className="flex items-center justify-center gap-2 text-body-sm text-accent mb-4">
                  <StarIcon className="w-4 h-4" />
                  Coming Soon
                </p>
                <h2 className="text-display-lg font-display text-text-bright">
                  On the way
                </h2>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="card p-8 md:p-10 group hover:border-accent transition-all"
              >
                <div className="flex items-center gap-4 mb-4">
                  <span className="inline-block text-xs font-semibold px-3 py-1.5 rounded-full text-white bg-blue-500">
                    IN DEVELOPMENT
                  </span>
                </div>
                <h3 className="text-3xl font-display font-semibold text-text-bright mb-3 group-hover:text-accent transition-colors">
                  ArqBanker
                </h3>
                <p className="text-body-lg text-text-muted mb-6">
                  AML, KYC, and financial crime workflow agent. Pre-design-partner stage. The earlier you are in the conversation, the more your operation shapes the product.
                </p>
                <Link
                  href="/products/arqbanker"
                  className="inline-flex items-center gap-2 text-accent font-medium hover:gap-3 transition-all"
                >
                  See ArqBanker
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
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-section bg-base-tint">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="bg-accent rounded-2xl p-8 md:p-12 text-center max-w-4xl mx-auto">
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
