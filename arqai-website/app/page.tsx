"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HomeStructuredData } from "@/components/seo/StructuredData";
// import { StatsSection } from "@/components/sections/StatsSection"; // Disabled per user request
import { BlogSectionStatic } from "@/components/sections/BlogSection";
import { CaseStudiesSectionStatic } from "@/components/sections/CaseStudiesSection";
import { WhitepaperSectionStatic } from "@/components/sections/WhitepaperSection";

// Scroll-aware marquee component
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

  // Triple the items to ensure smooth infinite scroll
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

// Animated counter component with countdown effect
function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimatedRef.current) {
          hasAnimatedRef.current = true;

          const duration = 2000;
          const steps = 60;
          const stepTime = duration / steps;
          const increment = value / steps;
          let current = 0;
          let step = 0;

          const animate = () => {
            step++;
            current = Math.min(current + increment, value);
            setCount(Math.floor(current));

            if (step < steps && current < value) {
              setTimeout(animate, stepTime);
            } else {
              setCount(value);
            }
          };

          animate();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="inline-block">
      <span className="tabular-nums">{count}</span>{suffix}
    </div>
  );
}

// Star icon component used throughout the page
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

// Stats data with numeric values for animation
const stats = [
  { numValue: 30, suffix: "+", label: "Governed workflows deployed", description: "Pilots to production in 30 days." },
  { numValue: 3, suffix: "", label: "Patented technologies", description: "Governance built in, not bolted on." },
  { numValue: 20, suffix: "+", label: "Years of expertise", description: "Solving enterprise data, security, and compliance at scale." },
  { numValue: 40, suffix: "%", label: "Faster audit preparation", description: "Automatic compliance evidence." },
];

// Marquee text items
const marqueeItems = [
  "Enterprise Intelligence Fabric",
  "Data-to-Action Bridge",
  "Built for Real Ops",
  "Risk-Conscious Intelligence",
  "Outcomes Without Overhead",
];

// Products data
const products = [
  {
    id: "arqrelease",
    name: "ArqRelease™",
    category: "For Enterprise Tech Teams",
    headline: "Autonomous DevSecOps documentation that never falls behind",
    features: ["40% faster releases", "Zero compliance violations", "Full audit trails"],
    description: "Continuously monitors CI/CD pipelines, auto-generates JIRA tickets for significant changes, keeps technical documentation current. Built on Trust-Aware Orchestration.",
    deployment: "In production at a leading telecom provider",
  },
  {
    id: "arqoptimize",
    name: "ArqOptimize™",
    category: "For FinOps & Platform Teams",
    headline: "Autonomous cloud cost optimization across your entire stack",
    features: ["25-40% cost reduction", "Real-time recommendations", "Multi-cloud support"],
    description: "Analyzes spending patterns, identifies waste, provides actionable recommendations. Connects project management tools to infrastructure for full visibility.",
    deployment: null,
  },
  {
    id: "arqfwa",
    name: "ArqFWA™",
    category: "For TPAs & Insurance Carriers",
    headline: "Intelligent insurance workflow automation with compliance built-in",
    features: ["70% faster claim processing", "Regulatory compliance by design", "Auditable decisions"],
    description: "Automates underwriting, claims processing, and compliance tracking. Every decision carries verifiable evidence chains.",
    deployment: null,
  },
  {
    id: "arqintel",
    name: "ArqIntel™",
    category: "For VCs & Private Equity",
    headline: "AI-powered investment due diligence at scale",
    features: ["70% faster screening", "Deeper portfolio insights", "Risk assessment automation"],
    description: "Accelerates deal flow with intelligent company analysis, market positioning evaluation, and automated risk scoring.",
    deployment: null,
  },
];

// Industries data
const industries = [
  {
    name: "Retail & E-Commerce",
    compliance: ["GDPR", "CCPA", "PCI-DSS"],
    description: "Customer data protection, payment security, and cross-border compliance.",
  },
  {
    name: "BFSI",
    compliance: ["PCI-DSS", "SOX", "GLBA", "MiFID II"],
    description: "Financial data governance, trading compliance, and regulatory reporting.",
  },
  {
    name: "Manufacturing",
    compliance: ["ISO 9001", "AS9100", "ITAR"],
    description: "Quality management, aerospace standards, and export control.",
  },
  {
    name: "Healthcare",
    compliance: ["HIPAA", "HITECH"],
    description: "Patient data protection, medical records security, and health IT compliance.",
  },
];

// Three pillars data
const pillars = [
  {
    name: "TAO",
    fullName: "Trust-Aware Agent Orchestration",
    description: "Cryptographic identity and non-repudiable audit trails for every agent action.",
  },
  {
    name: "CAPC",
    fullName: "Compliance-Aware Prompt Compiler",
    description: "Business rules and compliance requirements baked directly into agent behavior.",
  },
  {
    name: "ODA-RAG",
    fullName: "Observability-Driven Adaptive RAG",
    description: "Real-time quality scoring and self-improving knowledge retrieval.",
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
            {/* Hero Title */}
            <div className="relative mb-16">
              {/* Floating decorative image - positioned to not overlap text */}
              <div className="absolute right-0 md:right-0 lg:right-[5%] top-4 md:top-0 w-16 h-16 md:w-24 md:h-24 lg:w-28 lg:h-28 animate-rotate-slow z-10">
                <Image
                  src="/img/hero/03_hero-img.webp"
                  alt="Decorative element"
                  width={120}
                  height={120}
                  className="w-full h-full object-contain"
                />
              </div>

              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-display-xl md:text-[clamp(3.5rem,8vw,7rem)] font-display leading-[0.95] text-text-bright max-w-[90%] lg:max-w-[85%]"
              >
                <span className="block">The Enterprise Foundry</span>
                <span className="flex items-center gap-4 flex-wrap">
                  <StarIcon className="w-6 h-6 md:w-10 md:h-10 text-additional" />
                  <span>for Trusted AI</span>
                </span>
              </motion.h1>
            </div>

            {/* Hero Bottom Section */}
            <div className="grid md:grid-cols-2 gap-12 items-end">
              {/* Left Side - Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-6"
              >
                <div className="w-full h-px bg-stroke-muted" />
                <p className="text-body-lg text-text-medium max-w-lg">
                  Build, run, and govern mission-critical agent workforces in regulated industries.
                  From pilot to production in 30 days, with compliance, security, and accountability built into the DNA.
                </p>
                <div className="flex items-center gap-6 text-body-sm text-text-muted">
                  <div className="flex items-center gap-2">
                    <StarIcon className="w-4 h-4" />
                    <span>Build</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <StarIcon className="w-4 h-4" />
                    <span>Run</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <StarIcon className="w-4 h-4" />
                    <span>Govern</span>
                  </div>
                </div>
              </motion.div>

              {/* Right Side - Video (smaller) */}
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
                  poster="/img/hero/video-poster.jpg"
                >
                  <source src="/video/hero-video.mp4" type="video/mp4" />
                  <source src="/video/hero-video.webm" type="video/webm" />
                </video>
                <Link
                  href="/demo"
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

        {/* Problem Statement Section */}
        <section className="py-section bg-base">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-2 text-body-sm text-accent mb-4"
                >
                  <StarIcon className="w-4 h-4" />
                  Trusted by Industry Leaders
                </motion.p>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="text-display-lg font-display text-text-bright mb-6"
                >
                  The Platform Powering Mission-Critical AI in Regulated Industries
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="text-body-md text-text-muted mb-8"
                >
                  When enterprises need AI governance that enables production, not just compliance theater, they build on ArqAI. From leading telecom players to healthcare&apos;s most sensitive workflows, our three patented technologies are the foundation for autonomous agents operating at scale.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  <Link href="/demo" className="btn group">
                    Build with ArqAI
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
                    </svg>
                  </Link>
                </motion.div>
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="relative"
              >
                {/* Modern device frame for video */}
                <div className="relative rounded-md overflow-hidden bg-base-opp/5 p-1 shadow-2xl shadow-accent/10">
                  <div className="rounded overflow-hidden bg-base-opp aspect-[16/10]">
                    <video
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      className="w-full h-full object-cover animate-video-pan"
                      poster="/img/demo/arqai-foundry-poster.webp"
                    >
                      <source src="/video/ArqAI-foundry-optimized.webm" type="video/webm" />
                      <source src="/video/ArqAI-foundry-optimized.mp4" type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="py-section bg-base-tint">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="card text-center"
                >
                  <div className="text-6xl md:text-7xl lg:text-8xl font-display font-bold text-accent mb-4 leading-none">
                    <AnimatedCounter value={stat.numValue} suffix={stat.suffix} />
                  </div>
                  <div className="text-body-md font-medium text-text-bright mb-3">
                    {stat.label}
                  </div>
                  <div className="text-body-sm text-text-muted leading-relaxed">
                    {stat.description}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Marquee Section - Scrolls based on user scroll direction */}
        <section className="py-8 bg-accent overflow-hidden">
          <ScrollAwareMarquee items={marqueeItems} />
        </section>

        {/* Platform Overview Section */}
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
                Platform Overview
              </p>
              <h2 className="text-display-lg font-display text-text-bright">
                The Governance Engine Behind Every Product
              </h2>
            </motion.div>

            {/* Platform Architecture Animation */}
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
                {/* Fallback to static image if video not supported */}
                <Image
                  src="/img/hero/arq-wf.png"
                  alt="ArqAI Platform Architecture - The Governance Fabric with Three Patented Technologies"
                  width={800}
                  height={1000}
                  className="w-full max-w-3xl rounded-lg"
                />
              </video>
            </motion.div>
          </div>
        </section>

        {/* Platform → Agents Section */}
        <section className="py-section bg-base-tint overflow-hidden">
          <div className="container mx-auto px-4 md:px-6">
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="section-header text-center mb-16"
            >
              <p className="flex items-center justify-center gap-2 text-body-sm text-accent mb-4">
                <StarIcon className="w-4 h-4" />
                Our Solutions
              </p>
              <h2 className="text-display-lg font-display text-text-bright mb-4">
                Built on ArqAI. Deployed with Confidence.
              </h2>
              <p className="text-body-lg text-text-muted max-w-3xl mx-auto">
                These autonomous agents were forged in our foundry, engineered with TAO, CAPC, and ODA-RAG.
                Each one is audit-ready, explainable, and built for the demands of regulated industries.
              </p>
            </motion.div>

            {/* Platform → Agents Flow Layout */}
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-6 items-start">

              {/* Left Side - The Foundry Core */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="lg:col-span-5"
              >
                <div className="relative">
                  {/* Foundry Card */}
                  <div className="bg-gradient-to-br from-base-opp to-base-opp/90 rounded-lg p-8 border border-stroke-medium">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded bg-accent/20 flex items-center justify-center">
                        <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-body-xs text-additional/70 uppercase tracking-wider">The Foundry Core</p>
                        <h3 className="text-display-sm font-display text-base">ArqAI Platform</h3>
                      </div>
                    </div>

                    <p className="text-body-sm text-base/60 mb-8">
                      The governance fabric that powers every agent we build. Three patented technologies working in harmony.
                    </p>

                    {/* Technology Stack */}
                    <div className="space-y-4">
                      {/* TAO */}
                      <div className="group relative bg-base/5 hover:bg-base/10 rounded-lg p-4 transition-all cursor-default border border-base/10">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded bg-accent flex items-center justify-center shrink-0">
                            <span className="text-sm font-bold text-white">TAO</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-body-md font-semibold text-base mb-1">Trust-Aware Orchestration™</h4>
                            <p className="text-body-xs text-base/60">Cryptographic identity & non-repudiable audit trails for every agent action.</p>
                          </div>
                        </div>
                      </div>

                      {/* CAPC */}
                      <div className="group relative bg-base/5 hover:bg-base/10 rounded-lg p-4 transition-all cursor-default border border-base/10">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded bg-accent flex items-center justify-center shrink-0">
                            <span className="text-sm font-bold text-white">CAPC</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-body-md font-semibold text-base mb-1">Compliance-Aware Compiler™</h4>
                            <p className="text-body-xs text-base/60">Business rules & compliance baked directly into agent behavior.</p>
                          </div>
                        </div>
                      </div>

                      {/* ODA-RAG */}
                      <div className="group relative bg-base/5 hover:bg-base/10 rounded-lg p-4 transition-all cursor-default border border-base/10">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded bg-accent flex items-center justify-center shrink-0">
                            <span className="text-[11px] font-bold text-white leading-tight text-center">ODA<br/>RAG</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-body-md font-semibold text-base mb-1">Observability-Driven RAG™</h4>
                            <p className="text-body-xs text-base/60">Real-time quality scoring & self-improving knowledge retrieval.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Center - Flow Arrow (visible on lg+) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="hidden lg:flex lg:col-span-2 items-center justify-center"
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="w-px h-12 bg-gradient-to-b from-transparent via-accent to-transparent" />
                  <div className="w-16 h-16 rounded-full bg-accent/10 border-2 border-accent flex items-center justify-center">
                    <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                  <p className="text-body-xs text-text-muted font-medium">Powers</p>
                  <div className="w-px h-12 bg-gradient-to-b from-transparent via-accent to-transparent" />
                </div>
              </motion.div>

              {/* Right Side - Agents Built Here */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="lg:col-span-5"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded bg-accent/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-body-xs text-accent uppercase tracking-wider">Deployed Solutions</p>
                    <h3 className="text-display-sm font-display text-text-bright">Agents Built Here</h3>
                  </div>
                </div>

                {/* Product Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {products.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="group card relative hover:border-accent transition-all hover:shadow-lg hover:shadow-accent/5"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="text-lg font-display font-semibold text-text-bright group-hover:text-accent transition-colors">
                          {product.name}
                        </h4>
                        <svg className="w-4 h-4 text-text-muted group-hover:text-accent transition-colors shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
                        </svg>
                      </div>
                      <p className="text-body-xs text-text-muted mb-3 line-clamp-2">
                        {product.headline}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {product.features.slice(0, 2).map((feature, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-full bg-accent/10 text-[10px] font-medium text-accent">
                            {feature}
                          </span>
                        ))}
                      </div>
                      {product.deployment && (
                        <p className="text-[10px] text-text-medium font-medium mt-3 pt-3 border-t border-stroke-muted">
                          ✓ {product.deployment}
                        </p>
                      )}
                      <Link href={`/solutions/${product.id}`} className="absolute inset-0">
                        <span className="sr-only">Learn more about {product.name}</span>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Bottom CTA - Custom Workflows */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="mt-16"
            >
              <div className="relative bg-gradient-to-r from-accent via-accent to-accent/90 rounded-2xl p-8 md:p-10 overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

                <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <StarIcon className="w-4 h-4 text-additional" />
                      <span className="text-body-xs text-white/80 uppercase tracking-wider">Custom Build</span>
                    </div>
                    <h3 className="text-display-sm font-display mb-3 text-white">
                      Need a custom workflow?
                    </h3>
                    <p className="text-body-md text-white/80 max-w-xl">
                      We&apos;ll forge a governed AI agent tailored to your specific use case.
                      From pilot to production in 30 days, with full audit trails and compliance built in.
                    </p>
                  </div>
                  <div className="shrink-0">
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-white text-accent font-semibold rounded-lg hover:shadow-lg hover:shadow-black/20 transition-all group"
                    >
                      Let&apos;s Build Together
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

        {/* Industries Section */}
        <section className="py-section bg-base">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="section-header text-center"
            >
              <p className="flex items-center justify-center gap-2 text-body-sm text-accent mb-4">
                <StarIcon className="w-4 h-4" />
                Industries We Serve
              </p>
              <h2 className="text-display-lg font-display text-text-bright">
                Built for Regulated Environments
              </h2>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {industries.map((industry, index) => (
                <motion.div
                  key={industry.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="card flex flex-col h-full"
                >
                  <h3 className="text-2xl font-display font-semibold text-text-bright mb-4">
                    {industry.name}
                  </h3>
                  <p className="text-body-sm text-text-muted mb-6 flex-1 leading-relaxed">
                    {industry.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {industry.compliance.map((item) => (
                      <span key={item} className="tag text-xs">
                        {item}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Animated Stats Section - Disabled per user request */}
        {/* <StatsSection /> */}

        {/* Case Studies Section */}
        <CaseStudiesSectionStatic />

        {/* Whitepaper Download Section */}
        <WhitepaperSectionStatic />

        {/* Blog Section */}
        <BlogSectionStatic />

        {/* Three Pillars Section - Dark background section */}
        <section className="py-section bg-base-opp">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="section-header text-center"
            >
              <p className="flex items-center justify-center gap-2 text-body-sm text-additional mb-4">
                <StarIcon className="w-4 h-4" />
                Our Technology
              </p>
              <h2 className="text-display-lg font-display text-base">
                Three Proprietary Technologies
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {pillars.map((pillar, index) => (
                <motion.div
                  key={pillar.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 md:p-8 rounded-lg border border-stroke-medium"
                >
                  <div className="text-base font-bold text-additional mb-2">
                    {pillar.name}
                  </div>
                  <h3 className="text-2xl font-display font-medium text-base mb-4">
                    {pillar.fullName}
                  </h3>
                  <p className="text-body-md text-base/70">
                    {pillar.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-section bg-base">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="text-display-lg md:text-display-xl font-display text-text-bright mb-6">
                Ready to take command of your AI workforce?
              </h2>
              <p className="text-body-lg text-text-muted mb-8">
                Schedule a personalized demo to see how the ArqAI Foundry can help you
                de-risk innovation and accelerate your enterprise AI strategy.
              </p>
              <Link href="/contact" className="btn bg-accent text-white">
                Request a Demo
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
