"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const features = [
  {
    title: "Multi-Cloud Analysis",
    description: "Unified visibility across AWS, Azure, GCP, and hybrid environments with intelligent cost attribution.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
      </svg>
    ),
  },
  {
    title: "Real-Time Recommendations",
    description: "AI-powered suggestions for rightsizing, reserved instances, and spot instance optimization.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    title: "Project Cost Attribution",
    description: "Connect project management tools to infrastructure for complete cost visibility by team, project, or initiative.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    title: "Waste Detection",
    description: "Automatically identify idle resources, over-provisioned instances, and unused storage across your infrastructure.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
];

const metrics = [
  { value: "25-40%", label: "Cost Reduction" },
  { value: "Real-Time", label: "Recommendations" },
  { value: "100+", label: "Resource Types" },
  { value: "Multi-Cloud", label: "Support" },
];

const useCases = [
  {
    title: "FinOps Teams",
    description: "Get complete visibility into cloud spending with actionable insights to optimize costs without impacting performance.",
  },
  {
    title: "Platform Engineering",
    description: "Automate resource optimization and ensure teams are using infrastructure efficiently.",
  },
  {
    title: "Cost Center Management",
    description: "Attribute costs accurately to departments, projects, and initiatives for better budget management.",
  },
];

export default function ArqOptimizePage() {
  return (
    <>
      <Header />
      <main className="bg-base">
        {/* Hero Section */}
        <section className="pt-32 pb-20 md:pt-40 md:pb-28 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-accent/5" />
          <div className="container mx-auto px-4 md:px-6 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium">
                  For FinOps & Platform Teams
                </span>
              </div>
              <h1 className="text-display-lg md:text-display-xl font-display text-text-bright mb-6">
                ArqOptimize™
              </h1>
              <p className="text-2xl md:text-3xl text-accent font-medium mb-6">
                Autonomous cloud cost optimization across your entire stack
              </p>
              <p className="text-body-lg text-text-muted max-w-2xl mb-8">
                ArqOptimize analyzes spending patterns, identifies waste, and provides actionable
                recommendations. It connects your project management tools to infrastructure for
                complete cost visibility.
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
                Comprehensive cloud cost management powered by AI
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

        {/* Visualization Section */}
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
                Intelligent optimization in three simple steps
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: "01", title: "Connect", description: "Link your cloud accounts, project tools, and cost management systems." },
                { step: "02", title: "Analyze", description: "AI continuously analyzes usage patterns, identifies waste, and forecasts spending." },
                { step: "03", title: "Optimize", description: "Receive actionable recommendations and automate cost savings." },
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
                Ready to reduce your cloud costs?
              </h2>
              <p className="text-body-lg text-white/80 mb-8">
                See ArqOptimize in action and discover potential savings in your cloud infrastructure.
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
