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
    category: "DevSecOps",
    tagline: "40% faster releases, zero violations",
    description: "Automated documentation agent for technical teams. ArqRelease continuously monitors your CI/CD pipeline for significant changes, drafts relevant JIRA tickets, and keeps your documentation up-to-date.",
    image: "/img/products/arqrelease.webp",
  },
  {
    id: "arqoptimize",
    name: "ArqOptimize™",
    category: "FinSecOps",
    tagline: "25-40% cost reduction",
    description: "Cloud cost optimization agent for FinOps teams. ArqOptimize analyzes your cloud spending patterns, identifies savings opportunities, and provides actionable recommendations.",
    image: "/img/products/arqoptimize.webp",
  },
  {
    id: "arqestate",
    name: "ArqEstate™",
    category: "Real Estate",
    tagline: "100% traceable assignments",
    description: "Real estate assignment automation with full audit trails. ArqEstate handles property assignments, compliance tracking, and reporting.",
    image: "/img/products/arqestate.webp",
  },
  {
    id: "arqintel",
    name: "ArqIntel™",
    category: "Investment DD",
    tagline: "70% faster screening",
    description: "AI-powered investment due diligence screening. ArqIntel accelerates your deal flow with intelligent company analysis and risk assessment.",
    image: "/img/products/arqintel.webp",
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
                  Build, run, and govern your mission-critical AI workforce with confidence.
                  The governance fabric that makes enterprise AI safe, auditable, and production-ready.
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
                  The Hidden Crisis
                </motion.p>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="text-display-lg font-display text-text-bright mb-6"
                >
                  Your AI Future is Being Built on a Foundation of Chaos
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="text-body-md text-text-muted mb-8"
                >
                  Three patented technologies compile your policies into infrastructure.
                  Deploy governed AI across any cloud, any model, any vertical—in weeks, not quarters.
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
                <Image
                  src="/img/demo/01_fea-img.webp"
                  alt="AI Platform Architecture"
                  width={600}
                  height={400}
                  className="rounded-lg w-full"
                />
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

        {/* Products Section */}
        <section className="py-section bg-base-tint">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="section-header text-center"
            >
              <p className="flex items-center justify-center gap-2 text-body-sm text-accent mb-4">
                <StarIcon className="w-4 h-4" />
                Our Products
              </p>
              <h2 className="text-display-lg font-display text-text-bright">
                Purpose-Built AI Solutions
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="card group hover:border-accent transition-colors"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-body-xs text-text-muted">{product.category}</span>
                    <span className="px-3 py-1 rounded-full bg-accent/10 text-body-sm font-medium text-accent">
                      {product.tagline}
                    </span>
                  </div>
                  <h3 className="text-display-sm font-display text-text-bright mb-4">
                    {product.name}
                  </h3>
                  <p className="text-body-md text-text-muted leading-relaxed">
                    {product.description}
                  </p>
                </motion.div>
              ))}

              {/* Custom Solutions Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="card bg-accent md:col-span-2"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                  <div>
                    <h3 className="text-display-sm font-display mb-3 text-white dark:text-black">
                      Custom Solutions
                    </h3>
                    <p className="text-body-md text-white/80 dark:text-black/80">
                      30-day deployment. We build governed AI solutions tailored to your specific workflows.
                    </p>
                  </div>
                  <Link
                    href="/contact"
                    className="btn bg-additional text-black hover:opacity-90 dark:bg-black dark:text-white dark:hover:bg-white dark:hover:text-black transition-all"
                  >
                    Let&apos;s Talk
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
                    </svg>
                  </Link>
                </div>
              </motion.div>
            </div>
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
                Three Core Technologies
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
