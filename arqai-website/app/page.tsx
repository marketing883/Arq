"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HomeStructuredData } from "@/components/seo/StructuredData";
import { BlogSectionStatic } from "@/components/sections/BlogSection";
import { CaseStudiesSectionStatic } from "@/components/sections/CaseStudiesSection";
import { WhitepaperSectionStatic } from "@/components/sections/WhitepaperSection";

function ScrollAwareMarquee({ items }: { items: string[] }) {
  const [scrollDirection, setScrollDirection] = useState<"left" | "right">("left");
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current) {
        setScrollDirection("left");
      } else if (currentScrollY < lastScrollY.current) {
        setScrollDirection("right");
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const tripleItems = [...items, ...items, ...items];

  return (
    <div className="overflow-hidden whitespace-nowrap">
      <div
        className={`inline-flex gap-12 ${
          scrollDirection === "left" ? "animate-marquee" : "animate-marquee-reverse"
        }`}
        style={{ width: "max-content" }}
      >
        {tripleItems.map((item, index) => (
          <span
            key={index}
            className="text-display-sm font-display text-base whitespace-nowrap inline-flex items-center gap-4"
          >
            {item}
            <StarIcon className="w-6 h-6" />
          </span>
        ))}
      </div>
    </div>
  );
}

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

const proofPoints = [
  {
    label: "End-to-end delivered",
    description:
      "Every ArqAI Labs deployment includes senior delivery, integration, and post-deployment support. We do not ship licences and walk away.",
  },
  {
    label: "Architectural reliability",
    description:
      "Every agent runs on the same substrate that handles identity, policy enforcement, and observable retrieval. Production-grade by design, not by patch.",
  },
  {
    label: "10+ years F500 delivery",
    description:
      "Fortune 500 delivery in regulated industries. The team that ships our products has done this before.",
  },
];

const marqueeItems = [
  "Vertical AI agents",
  "Engineered for production",
  "End-to-end delivered",
  "Built by ACI Infotech",
  "Run on your stack",
];

type ProductIcon = "shield" | "clipboard" | "vault";

function ProductIcon({ name, className = "" }: { name: ProductIcon; className?: string }) {
  if (name === "shield") {
    // Fraud / waste / abuse — shield with magnifier
    return (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M24 6l14 5v11c0 9-6 16-14 20-8-4-14-11-14-20V11l14-5z" />
        <circle cx="22" cy="22" r="5" />
        <path d="M26 26l4 4" />
      </svg>
    );
  }
  if (name === "clipboard") {
    // Claims triage — clipboard with prioritised list
    return (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="10" y="8" width="28" height="34" rx="2" />
        <path d="M18 6h12v6H18z" />
        <path d="M16 22h4M24 22h8M16 28h4M24 28h6M16 34h4M24 34h4" />
      </svg>
    );
  }
  // vault — AML / KYC / financial crime
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="6" y="10" width="36" height="28" rx="2" />
      <circle cx="24" cy="24" r="7" />
      <path d="M24 17v-3M24 34v-3M17 24h-3M34 24h-3" />
      <circle cx="24" cy="24" r="2" fill="currentColor" />
    </svg>
  );
}

const products: {
  id: string;
  name: string;
  status: string;
  statusColor: string;
  icon: ProductIcon;
  tagline: string;
  description: string;
  features: string[];
  cta: string;
  href: string;
}[] = [
  {
    id: "arqfwa",
    name: "ArqFWA",
    status: "LIVE",
    statusColor: "bg-green-500",
    icon: "shield",
    tagline: "The AI agent for fraud, waste, and abuse detection.",
    description:
      "Reviews high volumes of claims and transactions, flags suspicious patterns, and surfaces the work your team should focus on first. Built for healthcare payers and P&C insurance carriers.",
    features: ["Pattern detection", "Adjuster routing"],
    cta: "See ArqFWA",
    href: "/products/arqfwa",
  },
  {
    id: "arqclaims",
    name: "ArqClaims",
    status: "IN BUILD",
    statusColor: "bg-amber-500",
    icon: "clipboard",
    tagline: "The AI agent for claims triage and processing.",
    description:
      "Triages incoming claims and surfaces the right ones to the right adjuster, with the routing logic and reserve recommendations your operation actually uses. Built for mid-market P&C carriers.",
    features: ["Triage", "Reserve recommendations"],
    cta: "Join the design partner program",
    href: "/products/arqclaims",
  },
  {
    id: "arqbanker",
    name: "ArqBanker",
    status: "COMING",
    statusColor: "bg-blue-500",
    icon: "vault",
    tagline: "The AI agent for AML, KYC, and financial crime.",
    description:
      "Built for the financial crimes operations at regional and mid-tier banks. Calibrated to the realities of running a financial crimes program on a lean team.",
    features: ["AML monitoring", "KYC review"],
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

const substratePillars = [
  {
    abbr: "TAO",
    fullName: "Trust-Aware Orchestration",
    description: "Cryptographic identity and non-repudiable audit trails for every agent action. Built into the runtime, not bolted on.",
  },
  {
    abbr: "CAPC",
    fullName: "Compliance-Aware Compiler",
    description: "Business rules and compliance constraints baked directly into agent behavior. Policy enforced at runtime, not assumed.",
  },
  {
    abbr: "ODA",
    fullName: "Observability-Driven RAG",
    description: "Real-time quality scoring and self-improving knowledge retrieval. The agent knows when it does not know.",
  },
];

export default function HomePage() {
  return (
    <>
      <HomeStructuredData />
      <Header />

      <main className="bg-base">
        {/* Hero Section */}
        <section className="mxd-hero min-h-screen flex flex-col justify-between pt-40 md:pt-48 pb-16 relative overflow-hidden">
          <div className="container mx-auto px-4 md:px-6 lg:px-8 flex-1 flex flex-col justify-center">
            <div className="relative mb-16">
              {/* Floating decorative image */}
              <div className="absolute right-0 md:right-0 lg:right-[5%] top-4 md:top-0 w-16 h-16 md:w-24 md:h-24 lg:w-28 lg:h-28 animate-rotate-slow z-10">
                <Image
                  src="/img/hero/03_hero-img.webp"
                  alt="Decorative element"
                  width={120}
                  height={120}
                  className="w-full h-full object-contain"
                />
              </div>

              <p className="flex items-center gap-2 text-body-sm text-accent mb-6 uppercase tracking-wider font-medium">
                <StarIcon className="w-4 h-4" />
                ArqAI Labs
              </p>

              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-display-xl md:text-[clamp(2.75rem,6vw,5.5rem)] font-display leading-[1.05] text-text-bright max-w-[92%]"
              >
                Vertical AI agents.{" "}
                <span className="text-text-muted">Fraud. Claims. Financial crime.</span>
              </motion.h1>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-end">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-6"
              >
                <div className="w-full h-px bg-stroke-muted" />
                <p className="text-body-lg text-text-medium max-w-lg">
                  Built for healthcare payers, P&amp;C carriers, and regional banks. Live in production today.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/demo"
                    className="btn bg-accent text-white hover:bg-accent/90 group"
                  >
                    See it in your environment
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
                    </svg>
                  </Link>
                  <Link href="/how-it-works" className="btn btn-outline">
                    Read about our approach
                  </Link>
                </div>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-body-sm text-text-muted pt-2">
                  <div className="flex items-center gap-2">
                    <StarIcon className="w-4 h-4" />
                    <span>End-to-end delivered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <StarIcon className="w-4 h-4" />
                    <span>Production-grade by design</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <StarIcon className="w-4 h-4" />
                    <span>Run on your stack</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="relative rounded-2xl overflow-hidden aspect-video max-w-xs md:max-w-sm ml-auto"
              >
                <video
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                >
                  <source src="/video/hero-video.webm" type="video/webm" />
                  <source src="/video/1920x1080_video.mp4" type="video/mp4" />
                </video>
                <Link
                  href="/demo"
                  aria-label="Book a demo"
                  className="absolute bottom-3 right-3 w-12 h-12 rounded-full bg-additional flex items-center justify-center hover:scale-110 transition-transform"
                >
                  <svg className="w-4 h-4 text-base-opp ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Problem / What We Do Section with Foundry video */}
        <section className="py-section bg-base">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <p className="flex items-center gap-2 text-body-sm text-accent mb-4">
                  <StarIcon className="w-4 h-4" />
                  What we do
                </p>
                <h2 className="text-display-lg font-display text-text-bright mb-6">
                  Most enterprise AI is a toolkit. You wanted a tool.
                </h2>
                <div className="space-y-4 text-body-md text-text-muted leading-relaxed mb-8">
                  <p>
                    You have evaluated AI agent platforms. They asked your team to build, configure, train, and operate. Twelve months of internal engineering before the first production decision. An agent that works for the demo and stalls under real-world load.
                  </p>
                  <p>
                    We do not hand you a builder. We hand you a deployed agent. Built for one workflow. Engineered for production from day one. Run by people who have shipped enterprise software in regulated industries for over a decade.
                  </p>
                </div>
                <Link href="/how-it-works" className="btn group">
                  See how it works
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="relative"
              >
                <div className="relative rounded-md overflow-hidden bg-base-opp/5 p-1 shadow-2xl shadow-accent/10">
                  <div className="rounded overflow-hidden bg-base-opp">
                    <video
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      className="w-full h-auto scale-110"
                      poster="/img/demo/arqai-foundry-v2-poster.webp"
                    >
                      <source src="/video/ArqAI-foundry-v2.webm" type="video/webm" />
                      <source src="/video/ArqAI-foundry-v2.mp4" type="video/mp4" />
                    </video>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Proof Strip */}
        <section className="py-section bg-base-tint">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              {proofPoints.map((point, index) => (
                <motion.div
                  key={point.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="border-t-2 border-accent pt-6"
                >
                  <h3 className="text-xl md:text-2xl font-display font-semibold text-text-bright mb-3">
                    {point.label}
                  </h3>
                  <p className="text-body-md text-text-muted leading-relaxed">
                    {point.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Marquee Section */}
        <section className="py-8 bg-accent overflow-hidden">
          <ScrollAwareMarquee items={marqueeItems} />
        </section>

        {/* Products Showcase Section */}
        <section className="py-section bg-base-tint overflow-hidden">
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
              <h2 className="text-display-lg font-display text-text-bright mb-4">
                Three vertical AI agents announced. More to follow.
              </h2>
              <p className="text-body-lg text-text-muted max-w-2xl mx-auto">
                Each product takes one operational workflow and makes the AI agent for it. Same architectural foundation. Same delivery standard. Different jobs.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-10">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="card group hover:border-accent transition-all flex flex-col h-full"
                >
                  <div className="flex items-start justify-between mb-5">
                    <div className="w-14 h-14 rounded-xl bg-accent/10 text-accent flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-colors">
                      <ProductIcon name={product.icon} className="w-8 h-8" />
                    </div>
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

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {product.features.map((feature, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-full bg-accent/10 text-[10px] font-medium text-accent">
                        {feature}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={product.href}
                    className="inline-flex items-center gap-2 text-accent font-medium hover:gap-3 transition-all"
                  >
                    {product.cta}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* More to follow strip */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 p-5 rounded-xl bg-base border border-stroke-muted"
            >
              <div className="flex items-center gap-3">
                <div className="flex -space-x-1">
                  <span className="w-2 h-2 rounded-full bg-text-muted/40" />
                  <span className="w-2 h-2 rounded-full bg-text-muted/60" />
                  <span className="w-2 h-2 rounded-full bg-text-muted/80" />
                </div>
                <p className="text-body-sm text-text-medium">
                  <span className="font-semibold text-text-bright">More vertical agents on the way.</span>{" "}
                  Each one targets a workflow where the AI alternatives stop short.
                </p>
              </div>
              <Link
                href="/products/roadmap"
                className="text-body-sm text-accent font-medium hover:underline whitespace-nowrap"
              >
                See the roadmap &rarr;
              </Link>
            </motion.div>

            {/* Custom Build CTA - gradient panel */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="relative bg-gradient-to-r from-accent via-accent to-accent/90 rounded-2xl p-8 md:p-10 overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

                <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <StarIcon className="w-4 h-4 text-additional" />
                      <span className="text-body-xs text-white/80 uppercase tracking-wider">Services</span>
                    </div>
                    <h3 className="text-display-sm font-display mb-3 text-white">
                      When the productised agent is not the fit, we build the one you need.
                    </h3>
                    <p className="text-body-md text-white/80 max-w-xl">
                      Senior engineers and domain leads who have shipped Fortune 500 programs for over a decade. Built into your environment, on the cloud you already use.
                    </p>
                  </div>
                  <div className="shrink-0">
                    <Link
                      href="/services"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-white text-accent font-semibold rounded-lg hover:shadow-lg hover:shadow-black/20 transition-all group"
                    >
                      Talk to delivery
                      <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Platform / Substrate Section */}
        <section className="py-section bg-base">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="section-header text-center"
            >
              <p className="flex items-center justify-center gap-2 text-body-sm text-accent mb-4">
                <StarIcon className="w-4 h-4" />
                The substrate
              </p>
              <h2 className="text-display-lg font-display text-text-bright mb-4">
                The shared engine behind every ArqAI Labs agent.
              </h2>
              <p className="text-body-lg text-text-muted max-w-3xl mx-auto">
                Every product runs on the same production substrate. Identity, policy, and retrieval are properties of the architecture, not a checklist your team has to add later.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex justify-center mb-16"
            >
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full max-w-4xl rounded-lg"
                poster="/img/hero/arq-wf.png"
              >
                <source src="/img/hero/workflow-ai.webm" type="video/webm" />
              </video>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {substratePillars.map((p, index) => (
                <motion.div
                  key={p.abbr}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="card group hover:border-accent transition-all"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded bg-accent flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-white">{p.abbr}</span>
                    </div>
                    <h3 className="text-lg font-display font-semibold text-text-bright group-hover:text-accent transition-colors">
                      {p.fullName}
                    </h3>
                  </div>
                  <p className="text-body-sm text-text-muted leading-relaxed">
                    {p.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Three Pillars Section - Dark */}
        <section className="py-section bg-base-opp">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <p className="flex items-center justify-center gap-2 text-body-sm text-additional mb-4">
                <StarIcon className="w-4 h-4" />
                Our approach
              </p>
              <h2 className="text-display-lg font-display text-base">
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
                  className="p-6 md:p-8 rounded-lg border border-stroke-medium bg-base-opp/40"
                >
                  <div className="text-6xl font-display font-bold text-additional/30 mb-4">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <h3 className="text-xl font-display font-semibold text-base mb-4">
                    {pillar.title}
                  </h3>
                  <p className="text-body-md text-base/70 leading-relaxed">
                    {pillar.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Case Studies Section */}
        <CaseStudiesSectionStatic />

        {/* Whitepaper Download Section */}
        <WhitepaperSectionStatic />

        {/* Blog Section */}
        <BlogSectionStatic />

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
                The right way to evaluate ArqAI Labs is to bring your actual workflow into the conversation. We will tell you whether one of our products fits, whether services is the right path, and what realistic looks like.
              </p>
              <Link href="/demo" className="btn bg-accent text-white">
                Book a demo
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
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
