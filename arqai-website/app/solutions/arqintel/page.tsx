"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const features = [
  {
    title: "Deal Flow Acceleration",
    description: "Screen hundreds of companies in minutes with AI-powered analysis of financials, market position, and growth potential.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
  {
    title: "Portfolio Intelligence",
    description: "Deep insights into portfolio company performance with automated KPI tracking and competitive analysis.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    title: "Risk Assessment",
    description: "Automated risk scoring with analysis of market conditions, competitive threats, and operational factors.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
  },
  {
    title: "Market Intelligence",
    description: "Stay ahead with real-time market analysis, trend identification, and competitive landscape mapping.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

const metrics = [
  { value: "70%", label: "Faster Screening" },
  { value: "Deep", label: "Portfolio Insights" },
  { value: "AI-Powered", label: "Risk Analysis" },
  { value: "Real-Time", label: "Market Data" },
];

const useCases = [
  {
    title: "Venture Capital",
    description: "Accelerate deal sourcing and due diligence with AI-powered company analysis and market intelligence.",
  },
  {
    title: "Private Equity",
    description: "Deep portfolio analytics and performance tracking with automated reporting and insights.",
  },
  {
    title: "Corporate Development",
    description: "Identify acquisition targets and assess strategic fit with comprehensive market analysis.",
  },
];

export default function ArqIntelPage() {
  return (
    <>
      <Header />
      <main className="bg-base">
        {/* Hero Section */}
        <section className="pt-32 pb-20 md:pt-40 md:pb-28 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-accent/5" />
          <div className="container mx-auto px-4 md:px-6 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium">
                  For VCs & Private Equity
                </span>
              </div>
              <h1 className="text-display-lg md:text-display-xl font-display text-text-bright mb-6">
                ArqIntel™
              </h1>
              <p className="text-2xl md:text-3xl text-accent font-medium mb-6">
                AI-powered investment due diligence at scale
              </p>
              <p className="text-body-lg text-text-muted max-w-2xl mb-8">
                ArqIntel accelerates deal flow with intelligent company analysis, market
                positioning evaluation, and automated risk scoring. Get deeper insights
                faster to make better investment decisions.
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
                Comprehensive investment intelligence powered by AI
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

        {/* Process Section */}
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
                Intelligent investment analysis in three steps
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: "01", title: "Source", description: "Connect your deal flow sources and let AI continuously scan for opportunities." },
                { step: "02", title: "Analyze", description: "Deep-dive analysis of financials, market position, team, and growth potential." },
                { step: "03", title: "Decide", description: "Get comprehensive reports with risk scores and investment recommendations." },
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
                Ready to supercharge your investment research?
              </h2>
              <p className="text-body-lg text-white/80 mb-8">
                See ArqIntel in action and discover how AI can accelerate your
                deal flow and improve investment decisions.
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
