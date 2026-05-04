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

const audiences = [
  "BCBS regional plans",
  "Medicaid managed care organisations",
  "Mid-tier Medicare Advantage plans",
  "Independent practice associations and provider-sponsored plans",
  "Mid-market commercial health plans",
];

export default function HealthcarePayersPage() {
  return (
    <>
      <Header />

      <main className="bg-base">
        {/* Hero Section with industry imagery */}
        <section className="pt-32 md:pt-40 pb-16 relative overflow-hidden">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <p className="flex items-center gap-2 text-body-sm text-accent mb-6 uppercase tracking-wider font-medium">
                  <StarIcon className="w-4 h-4" />
                  Industries / Healthcare payers
                </p>

                <h1 className="text-display-xl md:text-[clamp(2.5rem,5vw,4rem)] font-display leading-[1.1] text-text-bright mb-6">
                  AI agents for the way healthcare payers actually operate.
                </h1>

                <p className="text-body-lg md:text-xl text-text-medium mb-10 leading-relaxed">
                  ArqAI Labs builds vertical AI agents for healthcare payer operations. Live today: ArqFWA, the AI agent for fraud, waste, and abuse detection. More products on the roadmap, each engineered for production and delivered end-to-end.
                </p>

                <Link href="/engage-us" className="btn bg-accent text-white hover:bg-accent/90">
                  Engage us
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-2xl shadow-accent/15"
              >
                <Image
                  src="/img/services/Healthcare-Real-Time-Risk-Stratification-With-Built-In-Compliance.jpg"
                  alt="Healthcare payer operations"
                  fill
                  priority
                  sizes="(min-width:1024px) 50vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-base-opp/40 to-transparent" />
              </motion.div>
            </div>
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
                <h2 className="text-display-lg font-display text-text-bright mb-6">
                  Who we serve
                </h2>
                <p className="text-body-lg text-text-muted mb-8">
                  Built for operations leaders, program-integrity directors, claims and SIU teams, and the technology and AI executives backing them at:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
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
              </motion.div>
            </div>
          </div>
        </section>

        {/* Available Today */}
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
                  Available Today
                </p>
                <h2 className="text-display-lg font-display text-text-bright">
                  Live in production
                </h2>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="card p-8 md:p-10 group hover:border-accent transition-all"
              >
                <div className="flex items-center gap-4 mb-4">
                  <span className="inline-block text-xs font-semibold px-3 py-1.5 rounded-full text-white bg-green-500">
                    LIVE
                  </span>
                </div>
                <h3 className="text-3xl font-display font-semibold text-text-bright mb-3 group-hover:text-accent transition-colors">
                  ArqFWA
                </h3>
                <p className="text-body-lg text-text-muted mb-6">
                  Detects fraud, waste, and abuse in claims and transactions. Production-grade. Deployed end-to-end.
                </p>
                <Link
                  href="/products/arqfwa"
                  className="inline-flex items-center gap-2 text-accent font-medium hover:gap-3 transition-all"
                >
                  See ArqFWA
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

        {/* On the Roadmap */}
        <section className="py-section bg-base-tint">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-display-lg font-display text-text-bright mb-6">
                  On the roadmap
                </h2>
                <p className="text-body-lg text-text-muted">
                  Additional products targeting prior authorization, utilization management, and claims operations are on the roadmap. Reach out if your operation has a workflow you want at the front of the queue.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-section bg-base">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="bg-accent rounded-2xl p-8 md:p-12 text-center max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-display font-semibold text-white mb-6">
                See what ArqAI Labs can do for your payer operation.
              </h2>
              <Link
                href="/engage-us"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-accent font-semibold rounded-lg hover:shadow-lg transition-all"
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
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
