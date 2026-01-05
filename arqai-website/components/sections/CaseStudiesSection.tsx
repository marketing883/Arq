"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

interface CaseStudy {
  id: string;
  slug: string;
  title: string;
  client_name: string;
  industry: string;
  challenge_summary: string;
  results_summary: string;
  image?: string;
  key_metrics?: { label: string; value: string }[];
}

interface CaseStudiesSectionProps {
  caseStudies: CaseStudy[];
}

// Star icon - matching the site design
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

export function CaseStudiesSection({ caseStudies }: CaseStudiesSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const sectionTop = sectionRef.current.offsetTop;
      const scrollPosition = window.scrollY - sectionTop + window.innerHeight / 2;

      textRefs.current.forEach((ref, index) => {
        if (ref) {
          const refTop = ref.offsetTop;
          const refBottom = refTop + ref.offsetHeight;

          if (scrollPosition >= refTop && scrollPosition < refBottom) {
            setActiveIndex(index);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [caseStudies.length]);

  if (!caseStudies || caseStudies.length === 0) {
    return null;
  }

  return (
    <section ref={sectionRef} className="py-section bg-base">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="grid grid-cols-12 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="col-span-12 lg:col-span-6"
          >
            <h2 className="text-display-lg font-display text-text-bright">
              Real Products. Real Results.
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="col-span-12 lg:col-span-3"
          >
            <p className="text-body-md text-text-muted">Proven</p>
            <p className="text-body-md text-text-muted">Scalable</p>
            <p className="text-body-md text-text-muted">Impactful.</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="col-span-12 lg:col-span-3 flex lg:justify-end items-start"
          >
            <Link
              href="/case-studies"
              className="btn btn-outline group"
            >
              <span>View All Case Studies</span>
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
              </svg>
            </Link>
          </motion.div>
        </div>

        {/* Pinned Scroll Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Left Side - Sticky Image */}
          <div className="hidden lg:block">
            <div className="sticky top-32">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-base-tint">
                {caseStudies.map((study, index) => (
                  <motion.div
                    key={study.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: activeIndex === index ? 1 : 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={study.image || `/img/services/use-case-${index + 1}.webp`}
                      alt={study.client_name}
                      fill
                      className="object-cover"
                    />
                  </motion.div>
                ))}
              </div>

              {/* Progress Indicators */}
              <div className="flex gap-2 mt-6 justify-center">
                {caseStudies.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      const ref = textRefs.current[index];
                      if (ref) {
                        ref.scrollIntoView({ behavior: "smooth", block: "center" });
                      }
                    }}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      activeIndex === index
                        ? "w-8 bg-accent"
                        : "bg-stroke-muted hover:bg-stroke-bright"
                    }`}
                    aria-label={`Go to case study ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Scrolling Text */}
          <div className="space-y-16 lg:space-y-32">
            {caseStudies.map((study, index) => (
              <motion.div
                key={study.id}
                ref={(el) => {
                  textRefs.current[index] = el;
                }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: 0.1 }}
                className={`transition-opacity duration-300 ${
                  activeIndex === index ? "opacity-100" : "lg:opacity-50"
                }`}
              >
                {/* Mobile Image */}
                <div className="lg:hidden mb-6">
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-base-tint">
                    <Image
                      src={study.image || `/img/services/use-case-${index + 1}.webp`}
                      alt={study.client_name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <StarIcon className="w-5 h-5 text-accent" />
                  </div>
                  <span className="text-body-sm text-text-muted">{study.industry}</span>
                </div>

                <h3 className="text-2xl lg:text-3xl font-display font-bold text-text-bright mb-2">
                  {study.client_name}
                </h3>

                <p className="text-body-md text-accent font-medium mb-4">
                  {study.title}
                </p>

                <p className="text-body-md text-text-muted mb-6 leading-relaxed">
                  {study.challenge_summary}
                </p>

                {/* Results */}
                {study.key_metrics && study.key_metrics.length > 0 && (
                  <div className="mb-6">
                    <p className="text-body-sm font-semibold text-text-bright mb-3">Results:</p>
                    <ul className="space-y-2">
                      {study.key_metrics.slice(0, 4).map((metric, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="text-accent text-lg leading-none">•</span>
                          <span className="text-body-md text-text-muted">
                            <strong className="text-accent">{metric.value}</strong> {metric.label}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <Link
                  href={`/case-studies/${study.slug}`}
                  className="inline-flex items-center gap-2 text-body-md font-medium text-accent hover:gap-3 transition-all"
                >
                  Read Full Case Study
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Placeholder case studies with images
const placeholderStudies: CaseStudy[] = [
  {
    id: "1",
    slug: "devsecops-saas-company",
    title: "ArqRelease",
    client_name: "DevSecOps Team, SaaS Company",
    industry: "B2B SaaS",
    image: "/img/services/use-case-1.webp",
    challenge_summary: "Security review bottlenecks were slowing releases, and cloud waste from orphaned resources was costing $230K annually.",
    results_summary: "Reduced security review time from 6 weeks to 4 days with $230K annual savings.",
    key_metrics: [
      { label: "faster security review (6 weeks → 4 days)", value: "96%" },
      { label: "annual savings in cloud waste prevention", value: "$230K" },
      { label: "compliance violations in 18 months", value: "Zero" },
      { label: "increase in deployment frequency", value: "2.5x" },
    ],
  },
  {
    id: "2",
    slug: "finops-ecommerce-platform",
    title: "ArqOptimize",
    client_name: "FinOps Team, E-commerce Platform",
    industry: "E-commerce",
    image: "/img/services/use-case-2.webp",
    challenge_summary: "Cloud cost visibility across 40+ teams was impossible, and anomaly detection took days instead of minutes.",
    results_summary: "42% reduction in monthly cloud spend with 90% faster anomaly detection.",
    key_metrics: [
      { label: "reduction in monthly cloud spend", value: "42%" },
      { label: "faster anomaly detection (minutes vs. days)", value: "90%" },
      { label: "teams with real-time cost attribution", value: "40+" },
      { label: "developer complaints about resources", value: "Zero" },
    ],
  },
  {
    id: "3",
    slug: "ai-team-investment-firm",
    title: "ArqIntel",
    client_name: "AI Team, Investment Firm",
    industry: "Private Equity / VC",
    image: "/img/services/use-case-3.webp",
    challenge_summary: "Deal screening was inconsistent and slow. Each analyst had different criteria, making due diligence unreliable.",
    results_summary: "68% reduction in initial screening time with 100% consistent scoring.",
    key_metrics: [
      { label: "reduction in initial screening time", value: "68%" },
      { label: "consistent scoring across all deals", value: "100%" },
      { label: "time to audit-ready reports", value: "Hours" },
      { label: "regulatory concerns in 6-month pilot", value: "Zero" },
    ],
  },
];

// Dynamic version that fetches from database
export function CaseStudiesSectionStatic() {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>(placeholderStudies);

  useEffect(() => {
    async function fetchCaseStudies() {
      try {
        const response = await fetch("/api/case-studies/featured");
        if (response.ok) {
          const data = await response.json();
          if (data.caseStudies && data.caseStudies.length > 0) {
            setCaseStudies(data.caseStudies);
          }
        }
      } catch (error) {
        console.error("Error fetching case studies:", error);
      }
    }

    fetchCaseStudies();
  }, []);

  return <CaseStudiesSection caseStudies={caseStudies} />;
}
