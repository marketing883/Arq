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

const roadmapItems = [
  {
    name: "ArqFWA",
    status: "LIVE",
    statusColor: "bg-green-500",
    description: "Fraud, waste, and abuse detection for healthcare payers and P&C insurance carriers.",
    href: "/products/arqfwa",
  },
  {
    name: "ArqClaims",
    status: "IN BUILD",
    statusColor: "bg-amber-500",
    description: "Claims triage and processing for mid-market P&C carriers. Design partner program open.",
    href: "/products/arqclaims",
  },
  {
    name: "ArqBanker",
    status: "IN DEVELOPMENT",
    statusColor: "bg-blue-500",
    description: "AML, KYC, and financial crime for regional and mid-tier banks.",
    href: "/products/arqbanker",
  },
  {
    name: "More on the way",
    status: "EXPLORING",
    statusColor: "bg-gray-500",
    description: "We are actively exploring additional workflows in healthcare, insurance, and financial services. Tell us what you need.",
    href: "/contact",
  },
];

export default function RoadmapPage() {
  return (
    <>
      <Header />

      <main className="bg-base">
        {/* Hero Section */}
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
                  Roadmap
                </p>

                <h1 className="text-display-xl md:text-[clamp(3rem,5vw,4.5rem)] font-display leading-[1.1] text-text-bright mb-6">
                  What we are building.
                </h1>

                <p className="text-body-lg md:text-xl text-text-medium leading-relaxed">
                  Each new ArqAI Labs product targets an operational workflow where the customer&apos;s pain is acute and the AI alternatives all stop short. Here is where we are.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                <div className="rounded-2xl overflow-hidden border border-stroke-muted">
                  <Image
                    src="/img/hero/arq-products.png"
                    alt="ArqAI product roadmap"
                    width={900}
                    height={700}
                    className="w-full h-auto"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Roadmap Timeline */}
        <section className="py-section bg-base-tint">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-6 top-0 bottom-0 w-px bg-stroke-muted hidden md:block"></div>

                <div className="space-y-8">
                  {roadmapItems.map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="relative"
                    >
                      {/* Timeline dot */}
                      <div className={`absolute left-4 top-6 w-5 h-5 rounded-full ${item.statusColor} hidden md:block z-10`}></div>

                      <div className="card p-6 md:p-8 md:ml-16 group hover:border-accent transition-all">
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                          <h3 className="text-2xl font-display font-semibold text-text-bright group-hover:text-accent transition-colors">
                            {item.name}
                          </h3>
                          <span
                            className={`inline-block text-xs font-semibold px-3 py-1 rounded-full text-white ${item.statusColor}`}
                          >
                            {item.status}
                          </span>
                        </div>
                        <p className="text-body-md text-text-muted mb-4">
                          {item.description}
                        </p>
                        <Link
                          href={item.href}
                          className="inline-flex items-center gap-2 text-accent font-medium hover:gap-3 transition-all"
                        >
                          Learn more
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
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Suggest a Workflow CTA */}
        <section className="py-section bg-base">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="bg-accent rounded-2xl p-8 md:p-12">
              <div className="max-w-3xl">
                <h2 className="text-2xl md:text-3xl font-display font-semibold text-white mb-4">
                  Have a workflow you wish had a better answer?
                </h2>
                <p className="text-white/80 text-lg mb-6">
                  Each new ArqAI Labs product targets an operational workflow where the customer&apos;s pain is acute and the AI alternatives all stop short. If you have a workflow you wish had a better answer, we want to hear from you.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-accent font-semibold rounded-lg hover:shadow-lg transition-all"
                >
                  Suggest a workflow
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
      </main>

      <Footer />
    </>
  );
}
