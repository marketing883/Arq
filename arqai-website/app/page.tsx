"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HomeStructuredData } from "@/components/seo/StructuredData";

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

type UseCaseIconName =
  | "loyalty"
  | "patient"
  | "claims"
  | "erp"
  | "hospitality"
  | "facilities"
  | "copilot"
  | "dynamics"
  | "aws";

function HangingGraphic({ kind }: { kind: UseCaseIconName }) {
  return (
    <div
      aria-hidden="true"
      className="absolute top-0 right-4 sm:right-5 w-16 sm:w-[72px] h-24 origin-top pointer-events-none text-accent z-10 hanging-drop"
    >
      <div className="w-full h-full origin-top hanging-sway">
        <svg
          viewBox="0 0 60 96"
          className="w-full h-full block"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* hanging string */}
          <line x1="30" y1="0" x2="30" y2="26" strokeWidth={0.8} opacity={0.5} />

          {kind === "loyalty" && (
            <g>
              <path d="M30 26 L30 32" />
              <path d="M14 36 L20 36 L24 56 L46 56 L48 40 L22 40" />
              <circle cx="28" cy="62" r="2.5" />
              <circle cx="42" cy="62" r="2.5" />
              <circle cx="30" cy="32" r="1.8" fill="currentColor" />
            </g>
          )}

          {kind === "patient" && (
            <g>
              <path d="M22 30 Q22 50 30 56 Q38 50 38 30" />
              <circle cx="22" cy="28" r="2.4" />
              <circle cx="38" cy="28" r="2.4" />
              <path d="M30 56 L30 66" />
              <circle cx="30" cy="72" r="6" />
              <circle cx="30" cy="72" r="2.5" fill="currentColor" opacity={0.7} />
            </g>
          )}

          {kind === "claims" && (
            <g>
              <rect x="27" y="24" width="6" height="6" rx="1" />
              <g transform="translate(30 32) rotate(-10)">
                <rect x="-7" y="0" width="14" height="22" rx="1" fill="white" />
                <rect x="-7" y="0" width="14" height="22" rx="1" />
                <path d="M-4 6 L4 6 M-4 11 L4 11 M-4 16 L1 16" strokeWidth={0.9} opacity={0.7} />
              </g>
              <g transform="translate(30 32)">
                <rect x="-7" y="0" width="14" height="22" rx="1" fill="white" />
                <rect x="-7" y="0" width="14" height="22" rx="1" />
                <path d="M-4 6 L4 6 M-4 11 L4 11 M-4 16 L1 16" strokeWidth={0.9} opacity={0.7} />
              </g>
              <g transform="translate(30 32) rotate(10)">
                <rect x="-7" y="0" width="14" height="22" rx="1" fill="white" />
                <rect x="-7" y="0" width="14" height="22" rx="1" />
                <path d="M-4 6 L4 6 M-4 11 L4 11 M-4 16 L1 16" strokeWidth={0.9} opacity={0.7} />
              </g>
            </g>
          )}

          {kind === "erp" && (
            <g className="hanging-spin" style={{ transformOrigin: "30px 56px" }}>
              <g transform="translate(30 56)">
                <circle r="11" />
                <circle r="4" />
                {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                  <rect
                    key={deg}
                    x="-1.8"
                    y="-15"
                    width="3.6"
                    height="4"
                    rx="0.7"
                    transform={`rotate(${deg})`}
                    fill="currentColor"
                  />
                ))}
              </g>
            </g>
          )}

          {kind === "hospitality" && (
            <g>
              <path d="M30 26 L30 32" />
              <circle cx="30" cy="34" r="2.6" fill="currentColor" />
              <path d="M14 60 Q14 38 30 38 Q46 38 46 60 Z" />
              <line x1="10" y1="62" x2="50" y2="62" strokeWidth={2} />
              <circle cx="30" cy="68" r="2.4" fill="currentColor" />
            </g>
          )}

          {kind === "facilities" && (
            <g transform="translate(30 30) rotate(20)">
              <path d="M0 0 L0 4" />
              <circle cx="0" cy="4" r="6" />
              <circle cx="0" cy="4" r="2" fill="white" />
              <path d="M-2 8 L-2 28 L-5 38 L5 38 L2 28 L2 8" />
            </g>
          )}

          {kind === "copilot" && (
            <g>
              <path d="M14 32 L46 32 Q50 32 50 36 L50 52 Q50 56 46 56 L36 56 L30 64 L30 56 L14 56 Q10 56 10 52 L10 36 Q10 32 14 32 Z" />
              <circle cx="22" cy="44" r="2" fill="currentColor" className="hanging-dot-1" />
              <circle cx="30" cy="44" r="2" fill="currentColor" className="hanging-dot-2" />
              <circle cx="38" cy="44" r="2" fill="currentColor" className="hanging-dot-3" />
            </g>
          )}

          {kind === "dynamics" && (
            <g className="hanging-spin-slow" style={{ transformOrigin: "30px 52px" }}>
              <g transform="translate(30 52)">
                <path d="M-12 0 A12 12 0 1 1 0 12" />
                <polyline points="-3,7 0,12 -5,15" />
                <path d="M12 0 A12 12 0 0 1 0 -12" opacity={0.4} />
              </g>
            </g>
          )}

          {kind === "aws" && (
            <g>
              <path d="M16 50 Q10 50 10 44 Q10 38 18 38 Q18 30 26 30 Q34 30 36 36 Q44 36 44 44 Q44 50 38 50 Z" />
              <path
                d="M28 56 L24 64 L30 64 L26 72"
                className="hanging-spark"
                fill="currentColor"
                stroke="currentColor"
              />
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}

const useCases: {
  tag: string;
  title: string;
  body: string;
  icon: UseCaseIconName;
}[] = [
  {
    tag: "Retail",
    title: "Loyalty that learns what each customer values.",
    body: "AI that replaces points-and-badges with offers tuned to actual buying behavior. Retention up. Spend on stale incentives down.",
    icon: "loyalty",
  },
  {
    tag: "Healthcare",
    title: "Patient management that doesn't drop people in the gap.",
    body: "AI that follows up, schedules, and surfaces the patients your team needs to call today. Less leakage between visits.",
    icon: "patient",
  },
  {
    tag: "Insurance / Healthcare",
    title: "Claims triage in days, not weeks.",
    body: "AI that routes incoming claims to the right person, prioritises the queue, and supports the decision your team makes.",
    icon: "claims",
  },
  {
    tag: "Manufacturing",
    title: "ERP that finally answers the question.",
    body: "AI on top of your ERP that turns the data into decisions. Fewer reports your team has to assemble by hand.",
    icon: "erp",
  },
  {
    tag: "Hospitality",
    title: "Revenue management that doesn't miss a fill night.",
    body: "AI that prices rooms, packages, and add-ons dynamically against demand, competitor pricing, and your own historical patterns.",
    icon: "hospitality",
  },
  {
    tag: "Facilities management",
    title: "Maintenance that fixes things before they break.",
    body: "AI that predicts failures across HVAC, elevators, lighting, and critical equipment from sensor data and service history.",
    icon: "facilities",
  },
  {
    tag: "Microsoft 365",
    title: "Microsoft Copilot, tuned to your operation.",
    body: "Copilot extended with your context, your workflows, and the security posture your IT requires. Out-of-the-box does not get you there. We do.",
    icon: "copilot",
  },
  {
    tag: "Microsoft Dynamics",
    title: "Dynamics 365, AI-fied.",
    body: "Your Dynamics with AI that learns from your sales motion and your service desk. Less manual entry. Better next-best actions.",
    icon: "dynamics",
  },
  {
    tag: "AWS ecosystem",
    title: "AWS Quick, configured.",
    body: "Quick Suite tuned for the agents your operation actually needs, integrated with the systems you already run.",
    icon: "aws",
  },
];

const processSteps = [
  {
    name: "Strategy",
    description:
      "We start with the workflow, the buyer, and the operational metric. Discovery is short, focused, and outputs a concrete deployment plan.",
  },
  {
    name: "Build",
    description:
      "We design and engineer AI tuned to your environment. On the cloud you already run. Integrated with the systems your team already uses.",
  },
  {
    name: "Deploy",
    description:
      "We push it into production. Not a sandbox. Not a pilot that lives in a slide deck. Real decisions on real data.",
  },
  {
    name: "Run",
    description:
      "We operate it alongside your team. Named technical lead. Named relationship lead. Defined SLAs. We don't ship and walk away.",
  },
];

const products = [
  {
    name: "ArqFWA",
    status: "LIVE",
    statusColor: "bg-green-500",
    description:
      "The AI agent for fraud, waste, and abuse detection. Built for healthcare payers and P&C insurance carriers.",
    cta: "See ArqFWA",
    href: "/products/arqfwa",
  },
  {
    name: "ArqClaims",
    status: "IN BUILD",
    statusColor: "bg-amber-500",
    description:
      "The AI agent for claims triage and processing. In build with design partners.",
    cta: "Join the design partner program",
    href: "/products/arqclaims",
  },
  {
    name: "ArqBanker",
    status: "COMING",
    statusColor: "bg-blue-500",
    description:
      "The AI agent for AML, KYC, and financial crime. In development.",
    cta: "Get notified at launch",
    href: "/products/arqbanker",
  },
];

type IndustryIconKind = "healthcare" | "insurance" | "banking" | "retail" | "manufacturing";

function IndustryIcon({ kind, className = "" }: { kind: IndustryIconKind; className?: string }) {
  const props = {
    viewBox: "0 0 64 64",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
  };
  switch (kind) {
    case "healthcare":
      return (
        <svg {...props}>
          <path d="M32 56s-18-10-18-24a10 10 0 0118-6 10 10 0 0118 6c0 14-18 24-18 24z" />
          <path d="M28 28h8M32 24v8" strokeWidth={2.4} />
        </svg>
      );
    case "insurance":
      return (
        <svg {...props}>
          <path d="M32 8l18 6v14c0 12-8 22-18 28-10-6-18-16-18-28V14z" />
          <path d="M22 32l8 8 14-14" strokeWidth={2.4} />
        </svg>
      );
    case "banking":
      return (
        <svg {...props}>
          <path d="M8 24L32 10l24 14" />
          <path d="M12 24v22M22 28v18M32 28v18M42 28v18M52 28v18M52 24v22" />
          <path d="M8 50h48M8 54h48" />
        </svg>
      );
    case "retail":
      return (
        <svg {...props}>
          <path d="M14 22h36l-3 26a4 4 0 01-4 4H21a4 4 0 01-4-4z" />
          <path d="M22 22a10 10 0 0120 0" />
          <circle cx="24" cy="34" r="1.5" fill="currentColor" />
          <circle cx="40" cy="34" r="1.5" fill="currentColor" />
        </svg>
      );
    case "manufacturing":
      return (
        <svg {...props}>
          <path d="M8 56V32l10 6V32l10 6V32l10 6v-8l8 6v18z" />
          <path d="M8 56h48" />
          <circle cx="22" cy="46" r="2" fill="currentColor" />
          <circle cx="38" cy="46" r="2" fill="currentColor" />
          <path d="M50 26v-8l-4-4h-4v-4" />
        </svg>
      );
  }
}

const industries: {
  name: string;
  tagline: string;
  href: string;
  image: string;
  icon: IndustryIconKind;
}[] = [
  {
    name: "Healthcare",
    tagline: "Patient management, claims, fraud, and compliance.",
    href: "/industries/healthcare-payers",
    image: "/img/services/Healthcare-Real-Time-Risk-Stratification-With-Built-In-Compliance.jpg",
    icon: "healthcare",
  },
  {
    name: "Insurance",
    tagline: "Claims triage, underwriting, fraud, and operations at the carriers that take ops seriously.",
    href: "/industries/insurance-carriers",
    image: "/img/services/use-case-2.webp",
    icon: "insurance",
  },
  {
    name: "Banking",
    tagline: "AML, KYC, financial crime, and customer onboarding for regional and mid-tier banks.",
    href: "/industries/banking",
    image: "/img/services/Banking-Customer-Service-That-Resolves-50-percent-of-Tickets-Automatically.jpg",
    icon: "banking",
  },
  {
    name: "Retail",
    tagline: "Loyalty that learns, inventory that anticipates, store ops that move faster.",
    href: "/industries/retail",
    image: "/img/services/Retail-40-percent-Faster-Pricing-Ops-Without-Manual-Review.jpg",
    icon: "retail",
  },
  {
    name: "Manufacturing",
    tagline: "ERP that answers, quality control that catches, maintenance that predicts.",
    href: "/industries/manufacturing",
    image: "/img/services/Manufacturing-Autonomous-Maintenance-With-Scoped-Agent-Control.jpg",
    icon: "manufacturing",
  },
];

const marqueeItems = [
  "Production-grade AI",
  "Bespoke to your operation",
  "Tuned, not templated",
  "Engineers, not consultants",
  "Plus a growing line of products",
];

export default function HomePage() {
  return (
    <>
      <HomeStructuredData />
      <Header />

      <main className="bg-base">
        {/* Hero */}
        <section className="min-h-[88vh] flex flex-col justify-center pt-32 md:pt-40 pb-16 relative overflow-hidden">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="grid lg:grid-cols-12 gap-10 items-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-8"
              >
                <p className="flex items-center gap-2 text-body-sm text-accent mb-6 uppercase tracking-wider font-medium">
                  <StarIcon className="w-4 h-4" />
                  An AI engineering studio
                </p>

                <h1 className="text-display-xl md:text-[clamp(2.75rem,6vw,5.5rem)] font-display leading-[1.05] text-text-bright mb-6">
                  Production AI, bespoke to your operation.
                </h1>

                <p className="text-body-lg md:text-xl text-text-medium leading-relaxed mb-10 max-w-2xl">
                  We design, build, deploy, and run AI for operations that don&apos;t fit off-the-shelf.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/engage-us" className="btn bg-accent text-white hover:bg-accent/90 group">
                    Engage us
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
                    </svg>
                  </Link>
                  <Link href="/use-cases" className="btn btn-outline">
                    See what we work on
                  </Link>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="lg:col-span-4 relative"
              >
                <div className="relative rounded-2xl overflow-hidden aspect-square shadow-2xl shadow-accent/15">
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
                </div>
                <div className="absolute -top-6 -right-6 hidden md:block w-24 h-24 lg:w-28 lg:h-28 animate-rotate-slow">
                  <Image
                    src="/img/hero/03_hero-img.webp"
                    alt=""
                    width={120}
                    height={120}
                    className="w-full h-full object-contain"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* What we work on */}
        <section className="py-section bg-base-tint">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mb-14"
            >
              <p className="flex items-center gap-2 text-body-sm text-accent mb-4 uppercase tracking-wider font-medium">
                <StarIcon className="w-4 h-4" />
                What we work on
              </p>
              <h2 className="text-display-lg font-display text-text-bright mb-6">
                A few of the operations we&apos;ve engineered AI into.
              </h2>
              <p className="text-body-lg text-text-muted">
                The list grows. Yours might be next.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
              {useCases.map((uc, index) => (
                <motion.article
                  key={uc.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 20,
                    delay: (index % 3) * 0.06,
                  }}
                  whileHover={{ y: -4 }}
                  className="group card flex flex-col h-full hover:border-accent transition-colors relative"
                >
                  <HangingGraphic kind={uc.icon} />
                  <p className="text-body-xs text-accent uppercase tracking-wider mb-3 mt-24 pr-20">
                    {uc.tag}
                  </p>
                  <h3 className="text-lg font-display font-semibold text-text-bright leading-snug mb-3 group-hover:text-accent transition-colors">
                    {uc.title}
                  </h3>
                  <p className="text-body-sm text-text-muted leading-relaxed flex-1">
                    {uc.body}
                  </p>
                </motion.article>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link
                href="/use-cases"
                className="inline-flex items-center gap-2 text-accent font-medium hover:gap-3 transition-all"
              >
                See more use cases
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* Marquee */}
        <section className="py-8 bg-accent overflow-hidden">
          <ScrollAwareMarquee items={marqueeItems} />
        </section>

        {/* How we work */}
        <section className="py-section bg-base">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mb-14"
            >
              <p className="flex items-center gap-2 text-body-sm text-accent mb-4 uppercase tracking-wider font-medium">
                <StarIcon className="w-4 h-4" />
                How we work
              </p>
              <h2 className="text-display-lg font-display text-text-bright">
                Four steps.<br />End-to-end.
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {processSteps.map((step, index) => (
                <motion.div
                  key={step.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="border-t-2 border-accent pt-6"
                >
                  <p className="text-body-xs text-accent uppercase tracking-wider mb-2">
                    Step 0{index + 1}
                  </p>
                  <h3 className="text-2xl font-display font-semibold text-text-bright mb-3">
                    {step.name}
                  </h3>
                  <p className="text-body-sm text-text-muted leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="mt-10">
              <Link
                href="/how-we-work"
                className="inline-flex items-center gap-2 text-accent font-medium hover:gap-3 transition-all"
              >
                See the full process
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* What we've productised */}
        <section className="py-section bg-base-tint">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mb-14"
            >
              <p className="flex items-center gap-2 text-body-sm text-accent mb-4 uppercase tracking-wider font-medium">
                <StarIcon className="w-4 h-4" />
                Productised
              </p>
              <h2 className="text-display-lg font-display text-text-bright mb-6">
                When the same problem shows up enough times, we productise it.
              </h2>
              <p className="text-body-lg text-text-muted">
                A few of those problems showed up so often we built them out as products.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {products.map((product, index) => (
                <motion.div
                  key={product.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="card group flex flex-col h-full hover:border-accent transition-colors"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-display font-semibold text-text-bright group-hover:text-accent transition-colors">
                      {product.name}
                    </h3>
                    <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full text-white ${product.statusColor}`}>
                      {product.status}
                    </span>
                  </div>
                  <p className="text-body-sm text-text-muted mb-6 flex-1">
                    {product.description}
                  </p>
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
          </div>
        </section>

        {/* Industries we serve - Dark, full-width rows */}
        <section className="bg-base-opp">
          <div className="container mx-auto px-4 md:px-6 lg:px-8 pt-section pb-12 md:pb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl"
            >
              <p className="flex items-center gap-2 text-body-sm text-additional mb-4 uppercase tracking-wider font-medium">
                <StarIcon className="w-4 h-4" />
                Industries we serve
              </p>
              <h2 className="text-display-lg font-display text-base">
                Where we go deep.
              </h2>
              <p className="text-body-lg text-base/60 mt-5">
                Each industry has its own pace, its own data shape, and its own definition of done.
                We work in five.
              </p>
            </motion.div>
          </div>

          <div className="border-t border-stroke-medium/40">
            {industries.map((industry, idx) => (
              <Link
                key={industry.name}
                href={industry.href}
                className="industry-row group relative block border-b border-stroke-medium/40 overflow-hidden"
              >
                {/* background image */}
                <div className="absolute inset-0">
                  <Image
                    src={industry.image}
                    alt=""
                    fill
                    sizes="100vw"
                    className="object-cover scale-105 grayscale brightness-[0.35] saturate-50 group-hover:grayscale-0 group-hover:brightness-[0.55] group-hover:saturate-100 group-hover:scale-100 transition-all duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-base-opp via-base-opp/80 to-base-opp/30 group-hover:from-base-opp/85 group-hover:via-base-opp/40 group-hover:to-transparent transition-all duration-700" />
                </div>

                {/* content */}
                <div className="relative container mx-auto px-4 md:px-6 lg:px-8 py-10 md:py-14 lg:py-16 flex items-center justify-between gap-6">
                  <div className="flex items-baseline gap-5 md:gap-8 min-w-0">
                    <span className="text-body-xs md:text-body-sm text-additional font-mono shrink-0">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-display-sm md:text-display-md font-display text-base leading-tight transition-transform duration-500 ease-out group-hover:translate-x-2">
                        {industry.name}
                      </h3>
                      <p className="text-body-sm md:text-body-md text-base/60 group-hover:text-base/85 mt-2 max-w-xl transition-colors duration-500">
                        {industry.tagline}
                      </p>
                    </div>
                  </div>

                  {/* hover-revealed industry icon */}
                  <div className="hidden md:flex items-center gap-4 shrink-0 text-additional opacity-0 -translate-x-6 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 ease-out">
                    <IndustryIcon kind={industry.icon} className="w-12 h-12 lg:w-14 lg:h-14" />
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="container mx-auto px-4 md:px-6 lg:px-8 py-10 md:py-12 text-base/50 text-body-sm">
            And other operations whose complexity rewards specialist work.
          </div>
        </section>

        {/* Trust strip */}
        <section className="py-12 bg-base-tint border-y border-stroke-muted">
          <div className="container mx-auto px-4 md:px-6 lg:px-8 text-center">
            <p className="text-body-md text-text-muted">
              Architectural controls first. Aligned with SOC 2, HIPAA, GDPR, and regional frameworks where engagements require them.{" "}
              <Link href="/trust" className="text-accent font-medium hover:underline">
                See trust posture &rarr;
              </Link>
            </p>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="py-section bg-base">
          <div className="container mx-auto px-4 md:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="text-display-md font-display text-text-bright mb-6">
                Tell us what your operation needs.
              </h2>
              <p className="text-body-lg text-text-muted mb-8">
                We&apos;ll tell you what&apos;s honestly possible. In plain language. Without a deck.
              </p>
              <Link href="/engage-us" className="btn bg-accent text-white">
                Engage us
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
