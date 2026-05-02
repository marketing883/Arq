"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HomeStructuredData } from "@/components/seo/StructuredData";

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

const products = [
  {
    id: "arqfwa",
    name: "ArqFWA",
    status: "LIVE",
    statusColor: "bg-green-500",
    tagline: "The AI agent for fraud, waste, and abuse detection.",
    description:
      "Reviews high volumes of claims and transactions, flags suspicious patterns, and surfaces the work your team should focus on first. Built for healthcare payers and P&C insurance carriers.",
    cta: "See ArqFWA",
    href: "/products/arqfwa",
  },
  {
    id: "arqclaims",
    name: "ArqClaims",
    status: "IN BUILD",
    statusColor: "bg-amber-500",
    tagline: "The AI agent for claims triage and processing.",
    description:
      "Triages incoming claims and surfaces the right ones to the right adjuster, with the routing logic and reserve recommendations your operation actually uses. Built for mid-market P&C carriers.",
    cta: "Join the design partner program",
    href: "/products/arqclaims",
  },
  {
    id: "arqbanker",
    name: "ArqBanker",
    status: "COMING",
    statusColor: "bg-blue-500",
    tagline: "The AI agent for AML, KYC, and financial crime.",
    description:
      "Built for the financial crimes operations at regional and mid-tier banks. Calibrated to the realities of running a financial crimes program on a lean team.",
    cta: "Get notified at launch",
    href: "/products/arqbanker",
  },
];

const pillars = [
  {
    title: "Vertical-deep, not horizontal-thin",
    description:
      "We do not sell a builder. ArqFWA does fraud, waste, and abuse. ArqClaims does claims triage. ArqBanker does financial crime. Each product is calibrated for one workflow, with the right interface for the actual user, integrated with the systems that workflow already lives in. Specialisation is the whole point.",
  },
  {
    title: "Engineered for production from day one",
    description:
      "Reliability in our products is a property of the architecture, not a marketing claim. Every ArqAI Labs agent runs on a shared substrate that handles cryptographic identity, runtime policy enforcement, and observable retrieval. Production-grade is the default. There is no \"production mode\" toggle.",
  },
  {
    title: "Delivered end-to-end. Not licensed.",
    description:
      "ArqAI Labs is the AI products and services arm of ACI Infotech, a technology services firm with over a decade of Fortune 500 delivery. The team that builds our products is the same team that deploys them in your environment. You do not get a software licence and a quickstart guide. You get a deployed agent and a senior team that knows your stack.",
  },
];

const proofPoints = [
  {
    metric: "100%",
    label: "End-to-end delivered",
    description:
      "Every ArqAI Labs deployment includes senior delivery, integration, and post-deployment support. We do not ship licences and walk away.",
  },
  {
    metric: "Built-in",
    label: "Architectural reliability",
    description:
      "Every agent runs on the same substrate that handles identity, policy enforcement, and observable retrieval. Production-grade by design, not by patch.",
  },
  {
    metric: "10+",
    label: "Years F500 delivery",
    description:
      "Fortune 500 delivery in regulated industries. The team that ships our products has done this before.",
  },
];

export default function HomePage() {
  return (
    <>
      <HomeStructuredData />
      <Header />

      <main className="bg-base">
        {/* Hero Section */}
        <section className="min-h-[90vh] flex flex-col justify-center pt-32 md:pt-40 pb-16 relative overflow-hidden">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl"
            >
              <p className="flex items-center gap-2 text-body-sm text-accent mb-6 uppercase tracking-wider font-medium">
                <StarIcon className="w-4 h-4" />
                ArqAI Labs
              </p>

              <h1 className="text-display-xl md:text-[clamp(3rem,6vw,5rem)] font-display leading-[1.05] text-text-bright mb-8">
                The AI agent for your workflow.{" "}
                <span className="text-text-muted">Not a toolkit to build one.</span>
              </h1>

              <p className="text-body-lg md:text-xl text-text-medium max-w-3xl mb-10 leading-relaxed">
                ArqAI Labs builds vertical AI agents for high-stakes operational workflows. Each one is purpose-built for a single job, deployed end-to-end by our team, and engineered to run reliably in production. ArqFWA for fraud, waste, and abuse detection. ArqClaims for claims triage and processing. ArqBanker for AML, KYC, and financial crime. More on the way.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/demo"
                  className="btn bg-accent text-white hover:bg-accent/90"
                >
                  See it in your environment
                  <svg
                    className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
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
                <Link
                  href="/how-it-works"
                  className="btn btn-outline"
                >
                  Read about our approach
                </Link>
              </div>
            </motion.div>
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
                <h2 className="text-display-lg font-display text-text-bright mb-8">
                  Most enterprise AI is a toolkit. You wanted a tool.
                </h2>

                <div className="space-y-6 text-body-lg text-text-medium leading-relaxed">
                  <p>
                    You have evaluated AI agent platforms. They asked your team to build, configure, train, and operate. Twelve months of internal engineering before the first production decision. A roadmap that competes with everything else your team is supposed to be doing. And at the end, an agent that works for the demo and stalls under real-world load.
                  </p>
                  <p>
                    We are a different kind of company. We do not hand you a builder. We hand you a deployed agent. Built for one workflow. Engineered for production from day one. Run by people who have shipped enterprise software in regulated industries for over a decade.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Products Showcase Section */}
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
                Products
              </p>
              <h2 className="text-display-lg font-display text-text-bright">
                Vertical AI agents. Live and on the way.
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="card group hover:border-accent transition-all flex flex-col h-full"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full text-white ${product.statusColor}`}
                    >
                      {product.status}
                    </span>
                  </div>

                  <h3 className="text-2xl font-display font-semibold text-text-bright mb-2 group-hover:text-accent transition-colors">
                    {product.name}
                  </h3>

                  <p className="text-body-md text-text-bright mb-4">
                    {product.tagline}
                  </p>

                  <p className="text-body-sm text-text-muted mb-6 flex-1">
                    {product.description}
                  </p>

                  <Link
                    href={product.href}
                    className="inline-flex items-center gap-2 text-accent font-medium hover:gap-3 transition-all"
                  >
                    {product.cta}
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
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-section bg-base-opp">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <p className="flex items-center gap-2 text-body-sm text-additional mb-4">
                  <StarIcon className="w-4 h-4" />
                  Services
                </p>
                <h2 className="text-display-lg font-display text-base mb-6">
                  When the productised agent is not the fit, we build the one you need.
                </h2>
                <p className="text-body-lg text-base/70 mb-8">
                  ArqAI Labs Services is our delivery arm. Senior engineers and domain leads who have shipped Fortune 500 programs for over a decade. We build custom AI agents into your environment, on the cloud you already use, integrated with the systems your team already runs. Same engineering standard as our products. End-to-end ownership.
                </p>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-accent font-semibold rounded-lg hover:shadow-lg transition-all group"
                >
                  Talk to our delivery team
                  <svg
                    className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
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

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="p-6 rounded-lg bg-base/5 border border-base/10">
                      <div className="text-3xl font-display font-bold text-base mb-2">F500</div>
                      <p className="text-sm text-base/60">Enterprise delivery experience</p>
                    </div>
                    <div className="p-6 rounded-lg bg-base/5 border border-base/10">
                      <div className="text-3xl font-display font-bold text-base mb-2">10+</div>
                      <p className="text-sm text-base/60">Years in regulated industries</p>
                    </div>
                  </div>
                  <div className="space-y-4 mt-8">
                    <div className="p-6 rounded-lg bg-base/5 border border-base/10">
                      <div className="text-3xl font-display font-bold text-base mb-2">100%</div>
                      <p className="text-sm text-base/60">End-to-end ownership</p>
                    </div>
                    <div className="p-6 rounded-lg bg-base/5 border border-base/10">
                      <div className="text-3xl font-display font-bold text-additional mb-2">Your stack</div>
                      <p className="text-sm text-base/60">AWS, Azure, or sovereign cloud</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Three Pillars Section */}
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
                Our Approach
              </p>
              <h2 className="text-display-lg font-display text-text-bright">
                Three things we will not compromise on.
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {pillars.map((pillar, index) => (
                <motion.div
                  key={pillar.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  <div className="text-6xl font-display font-bold text-accent/20 mb-4">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <h3 className="text-xl font-display font-semibold text-text-bright mb-4">
                    {pillar.title}
                  </h3>
                  <p className="text-body-md text-text-muted leading-relaxed">
                    {pillar.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Proof Strip Section */}
        <section className="py-section bg-base-tint">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              {proofPoints.map((point, index) => (
                <motion.div
                  key={point.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-5xl md:text-6xl font-display font-bold text-accent mb-3">
                    {point.metric}
                  </div>
                  <div className="text-lg font-semibold text-text-bright mb-2">
                    {point.label}
                  </div>
                  <p className="text-body-sm text-text-muted">
                    {point.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Closing CTA Section */}
        <section className="py-section bg-base">
          <div className="container mx-auto px-4 md:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="text-display-lg md:text-display-xl font-display text-text-bright mb-6">
                Tell us your workflow. We will tell you what is honestly possible.
              </h2>
              <p className="text-body-lg text-text-muted mb-8">
                The right way to evaluate ArqAI Labs is to bring your actual workflow into the conversation. Not a generic AI strategy. The specific operation you want better. We will tell you whether one of our products fits, whether services is the right path, and what realistic looks like.
              </p>
              <Link
                href="/demo"
                className="btn bg-accent text-white hover:bg-accent/90"
              >
                Book a demo
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
