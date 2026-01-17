"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const features = [
  {
    title: "Intelligent Claims Processing",
    description: "Automate claims intake, validation, and routing with AI that understands policy language and coverage rules.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "Underwriting Automation",
    description: "Accelerate underwriting decisions with AI-powered risk assessment and policy recommendations.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: "Compliance by Design",
    description: "Built-in regulatory compliance for state insurance regulations, HIPAA, and industry standards.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
      </svg>
    ),
  },
  {
    title: "Auditable Decisions",
    description: "Every automated decision includes verifiable evidence chains for regulatory audits and dispute resolution.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
];

const metrics = [
  { value: "70%", label: "Faster Claim Processing" },
  { value: "100%", label: "Regulatory Compliance" },
  { value: "24/7", label: "Automated Operations" },
  { value: "Full", label: "Audit Trails" },
];

const useCases = [
  {
    title: "Third-Party Administrators",
    description: "Streamline claims processing across multiple carriers with consistent, compliant workflows.",
  },
  {
    title: "Insurance Carriers",
    description: "Automate underwriting and claims while maintaining full regulatory compliance.",
  },
  {
    title: "Self-Insured Organizations",
    description: "Manage claims efficiently with enterprise-grade automation and reporting.",
  },
];

export default function ArqFWAPage() {
  return (
    <>
      <Header />
      <main className="bg-base">
        {/* Hero Section */}
        <section className="pt-32 pb-20 md:pt-40 md:pb-28 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-accent/5" />
          <div className="container mx-auto px-4 md:px-6 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium">
                  For TPAs & Insurance Carriers
                </span>
              </div>
              <h1 className="text-display-lg md:text-display-xl font-display text-text-bright mb-6">
                ArqFWA™
              </h1>
              <p className="text-2xl md:text-3xl text-accent font-medium mb-6">
                Intelligent insurance workflow automation with compliance built-in
              </p>
              <p className="text-body-lg text-text-muted max-w-2xl mb-8">
                ArqFWA automates underwriting, claims processing, and compliance tracking.
                Every decision carries verifiable evidence chains for regulatory audits
                and dispute resolution.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/demo" className="btn bg-accent text-white">
                  Request Demo
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </Link>
                <Link href="/contact" className="btn btn-outline">
                  Talk to Sales
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Metrics Section */}
        <section className="py-16 bg-base-tint">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {metrics.map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-4xl md:text-5xl font-display font-bold text-accent mb-2">
                    {metric.value}
                  </div>
                  <div className="text-body-sm text-text-muted">{metric.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 md:py-28">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-display-md md:text-display-lg font-display text-text-bright mb-4">
                Key Capabilities
              </h2>
              <p className="text-body-lg text-text-muted max-w-2xl mx-auto">
                End-to-end insurance workflow automation with built-in compliance
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="card group hover:border-accent transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-4 group-hover:bg-accent group-hover:text-white transition-all">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-display font-semibold text-text-bright mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-body-md text-text-muted">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Workflow Section */}
        <section className="py-20 md:py-28 bg-base-opp">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-display-md md:text-display-lg font-display text-base mb-4">
                How It Works
              </h2>
              <p className="text-body-lg text-base/70 max-w-2xl mx-auto">
                Intelligent automation for the entire insurance lifecycle
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: "01", title: "Intake", description: "Automatically process claims, extract data, and validate against policy terms." },
                { step: "02", title: "Analyze", description: "AI evaluates risk, checks compliance, and recommends actions with full transparency." },
                { step: "03", title: "Execute", description: "Automate decisions with audit trails and evidence chains for every action." },
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className="relative"
                >
                  <div className="text-6xl font-display font-bold text-accent/20 mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-display font-semibold text-base mb-3">
                    {item.title}
                  </h3>
                  <p className="text-body-md text-base/70">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="py-20 md:py-28">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-display-md md:text-display-lg font-display text-text-bright mb-4">
                Use Cases
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {useCases.map((useCase, index) => (
                <motion.div
                  key={useCase.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="card"
                >
                  <h3 className="text-lg font-display font-semibold text-text-bright mb-3">
                    {useCase.title}
                  </h3>
                  <p className="text-body-md text-text-muted">
                    {useCase.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-28 bg-accent">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="text-display-md md:text-display-lg font-display text-white mb-6">
                Ready to transform your insurance workflows?
              </h2>
              <p className="text-body-lg text-white/80 mb-8">
                See ArqFWA in action and discover how intelligent automation can
                accelerate claims processing while ensuring compliance.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/demo" className="btn bg-white text-accent hover:bg-white/90">
                  Schedule a Demo
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </Link>
                <Link href="/contact" className="btn border-2 border-white text-white hover:bg-white hover:text-accent">
                  Contact Sales
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
