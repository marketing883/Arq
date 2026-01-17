"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const features = [
  {
    title: "Automated Documentation",
    description: "Continuously monitors CI/CD pipelines and auto-generates technical documentation that never falls behind your codebase.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    title: "JIRA Integration",
    description: "Auto-generates JIRA tickets for significant changes, keeping your project management in sync with your development workflow.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
  },
  {
    title: "Compliance Automation",
    description: "Built-in compliance tracking ensures every release meets regulatory requirements with full audit trails.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: "Trust-Aware Orchestration",
    description: "Built on TAO technology, ensuring cryptographic identity and non-repudiable audit trails for every automated action.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
  },
];

const metrics = [
  { value: "40%", label: "Faster Releases" },
  { value: "0", label: "Compliance Violations" },
  { value: "100%", label: "Audit Coverage" },
  { value: "24/7", label: "Automated Monitoring" },
];

const useCases = [
  {
    title: "Enterprise DevSecOps",
    description: "Automate security documentation and compliance tracking across your entire software development lifecycle.",
  },
  {
    title: "Regulated Industries",
    description: "Meet strict compliance requirements in healthcare, finance, and government with automated evidence generation.",
  },
  {
    title: "Multi-Team Coordination",
    description: "Keep documentation synchronized across distributed teams with real-time updates and notifications.",
  },
];

export default function ArqReleasePage() {
  return (
    <>
      <Header />
      <main className="bg-base">
        {/* Hero Section */}
        <section className="pt-32 pb-20 md:pt-40 md:pb-28 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-additional/5" />
          <div className="container mx-auto px-4 md:px-6 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium">
                  For Enterprise Tech Teams
                </span>
                <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-sm font-medium">
                  In Production
                </span>
              </div>
              <h1 className="text-display-lg md:text-display-xl font-display text-text-bright mb-6">
                ArqRelease™
              </h1>
              <p className="text-2xl md:text-3xl text-accent font-medium mb-6">
                Autonomous DevSecOps documentation that never falls behind
              </p>
              <p className="text-body-lg text-text-muted max-w-2xl mb-8">
                ArqRelease continuously monitors your CI/CD pipelines, auto-generates JIRA tickets
                for significant changes, and keeps technical documentation current. Built on
                Trust-Aware Orchestration for complete audit trails.
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
                Everything you need to automate your DevSecOps documentation workflow
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

        {/* How It Works Section */}
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
                ArqRelease integrates seamlessly into your existing workflow
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: "01", title: "Connect", description: "Integrate with your CI/CD pipelines, version control, and project management tools." },
                { step: "02", title: "Monitor", description: "ArqRelease continuously watches for code changes, deployments, and significant events." },
                { step: "03", title: "Document", description: "Automatically generate documentation, tickets, and compliance evidence in real-time." },
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
                Ready to automate your DevSecOps documentation?
              </h2>
              <p className="text-body-lg text-white/80 mb-8">
                See ArqRelease in action and discover how it can accelerate your releases
                while maintaining complete compliance.
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
