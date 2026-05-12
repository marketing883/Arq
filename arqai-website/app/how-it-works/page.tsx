"use client";

import Link from "next/link";
import Image from "next/image";
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

const layers = [
  {
    number: "01",
    title: "Agent identity",
    headline: "Every agent has a cryptographic identity and a defined set of capabilities.",
    description:
      "Before an agent acts, the runtime verifies who it is and what it is permitted to do. Capabilities are scoped to the workflow. Actions are logged with cryptographic provenance. Nothing happens off-policy.",
  },
  {
    number: "02",
    title: "Runtime policy enforcement",
    headline: "Policies live in the runtime, not in a filter applied after.",
    description:
      "Internal policies and the rules that apply to the workflow are compiled into the agent's execution path before it runs. The agent cannot take an action that violates the policies it has been given. Reliability is enforced, not promised.",
  },
  {
    number: "03",
    title: "Observable retrieval",
    headline: "Every data lookup is logged, governed, and quality-monitored.",
    description:
      "When the agent retrieves data, the lookup is logged, the data is policy-checked before access, and retrieval quality is monitored continuously. If quality drifts, the agent corrects.",
  },
];

export default function HowItWorksPage() {
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
                Architecture
              </p>

              <h1 className="text-display-xl md:text-[clamp(2.5rem,5vw,4rem)] font-display leading-[1.1] text-text-bright mb-6">
                Three layers. Every product. Production-grade by design.
              </h1>

              <p className="text-body-lg md:text-xl text-text-medium max-w-3xl leading-relaxed">
                Every ArqAI Labs agent is built on the same architectural foundation. We do not rebuild reliability for each product. We build it once, deeply, and apply it everywhere. That is why our second product ships faster than our first, and why our customers can deploy a second agent without re-evaluating the foundation from scratch.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Architecture Diagram */}
        <section className="py-12 bg-base">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex justify-center"
            >
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full max-w-4xl rounded-lg"
              >
                <source src="/img/hero/workflow-ai.webm" type="video/webm" />
                <Image
                  src="/img/hero/arq-wf.png"
                  alt="ArqAI Labs Architecture - Three Layers"
                  width={800}
                  height={600}
                  className="w-full max-w-3xl rounded-lg"
                />
              </video>
            </motion.div>
          </div>
        </section>

        {/* Three Layers */}
        <section className="py-section bg-base-tint">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="space-y-16 md:space-y-24">
              {layers.map((layer, index) => (
                <motion.div
                  key={layer.number}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="max-w-4xl mx-auto"
                >
                  <div className="flex items-start gap-6 md:gap-10">
                    <div className="text-6xl md:text-8xl font-display font-bold text-accent/20 shrink-0">
                      {layer.number}
                    </div>
                    <div className="flex-1">
                      <p className="text-accent text-sm uppercase tracking-wider mb-2">
                        Layer {index + 1}
                      </p>
                      <h2 className="text-2xl md:text-3xl font-display font-semibold text-text-bright mb-4">
                        {layer.headline}
                      </h2>
                      <p className="text-body-lg text-text-muted leading-relaxed">
                        {layer.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* For Engineers */}
        <section className="py-section bg-base">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="card p-8 md:p-12 bg-base-opp text-center"
              >
                <h2 className="text-2xl md:text-3xl font-display font-semibold text-base mb-6">
                  For engineers
                </h2>
                <p className="text-body-lg text-base/70 leading-relaxed mb-8">
                  Each layer has technical depth that your principal architect should evaluate directly. Reach out under NDA for control documentation. Read the engineering blog for deep technical posts on each layer.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/contact"
                    className="btn bg-white text-accent hover:bg-white/90"
                  >
                    Request control documentation
                  </Link>
                  <Link
                    href="/blog"
                    className="btn border-white/30 text-base hover:bg-white/10"
                  >
                    Read the engineering blog
                  </Link>
                </div>
              </motion.div>
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
                See the architecture in action.
              </h2>
              <p className="text-body-lg text-text-muted mb-8">
                We can show how our products run on this foundation in your environment.
              </p>
              <Link
                href="/engage-us"
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
