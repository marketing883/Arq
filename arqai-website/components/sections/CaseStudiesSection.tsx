"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  tags?: string[];
  key_metrics?: { label: string; value: string }[];
}

interface CaseStudiesSectionProps {
  caseStudies: CaseStudy[];
}

export function CaseStudiesSection({ caseStudies }: CaseStudiesSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const sectionRect = sectionRef.current.getBoundingClientRect();
      const sectionTop = sectionRef.current.offsetTop;

      // Only update when section is in view
      if (sectionRect.top > window.innerHeight || sectionRect.bottom < 0) return;

      textRefs.current.forEach((ref, index) => {
        if (ref) {
          const refRect = ref.getBoundingClientRect();
          const viewportCenter = window.innerHeight / 2;

          // Check if this item's center is closest to viewport center
          const refCenter = refRect.top + refRect.height / 2;
          if (refCenter > viewportCenter - 200 && refCenter < viewportCenter + 200) {
            setActiveIndex(index);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, [caseStudies.length]);

  if (!caseStudies || caseStudies.length === 0) {
    return null;
  }

  return (
    <section ref={sectionRef} className="py-section bg-base-tint">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="section-header text-center mb-12 lg:mb-16">
          <h2 className="text-text-bright mb-4">Solutions in Action</h2>
          <p className="text-body-lg text-text-muted max-w-2xl mx-auto">
            See how enterprises transform operations with ArqAI&apos;s governance-first AI platform.
          </p>
        </div>

        {/* Pinned Scroll Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Side - Sticky Image */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <div className="relative aspect-square rounded-3xl overflow-hidden bg-base p-8 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="relative w-full h-full flex items-center justify-center"
                  >
                    <Image
                      src={caseStudies[activeIndex]?.image || `/img/services/use-case-${activeIndex + 1}.webp`}
                      alt={caseStudies[activeIndex]?.client_name || "Case Study"}
                      width={500}
                      height={500}
                      className="object-contain max-w-[80%] max-h-[80%]"
                      priority
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Right Side - Scrolling Text */}
          <div className="space-y-24 lg:space-y-40 lg:py-20">
            {caseStudies.map((study, index) => (
              <motion.div
                key={study.id}
                ref={(el) => {
                  textRefs.current[index] = el;
                }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: 0.1 }}
                className={`transition-opacity duration-500 ${
                  activeIndex === index ? "opacity-100" : "lg:opacity-40"
                }`}
              >
                {/* Mobile Image */}
                <div className="lg:hidden mb-8">
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-base p-6 flex items-center justify-center">
                    <Image
                      src={study.image || `/img/services/use-case-${index + 1}.webp`}
                      alt={study.client_name}
                      width={400}
                      height={400}
                      className="object-contain max-w-[80%] max-h-[80%]"
                    />
                  </div>
                </div>

                {/* Category */}
                <span className="text-sm font-medium text-accent uppercase tracking-wide mb-3 block">
                  {study.industry}
                </span>

                {/* Title */}
                <h3 className="text-3xl lg:text-4xl font-display font-bold text-text-bright mb-6">
                  {study.title}
                </h3>

                {/* Tags / Metrics - Blue bg + lime text (light), Lime bg + black text (dark) */}
                {study.tags && study.tags.length > 0 ? (
                  <div className="flex flex-wrap gap-3 mb-6">
                    {study.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-5 py-2.5 rounded-full bg-accent text-additional dark:text-[#161616] font-semibold text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : study.key_metrics && study.key_metrics.length > 0 ? (
                  <div className="flex flex-wrap gap-3 mb-6">
                    {study.key_metrics.slice(0, 4).map((metric, i) => (
                      <span
                        key={i}
                        className="px-5 py-2.5 rounded-full bg-accent text-additional dark:text-[#161616] font-semibold text-sm"
                      >
                        {metric.value} {metric.label}
                      </span>
                    ))}
                  </div>
                ) : null}

                {/* Description */}
                <p className="text-body-lg text-text-muted leading-relaxed">
                  {study.challenge_summary}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Placeholder case studies with proper images and tags
const placeholderStudies: CaseStudy[] = [
  {
    id: "1",
    slug: "arqrelease-devsecops",
    title: "ArqRelease™",
    client_name: "DevSecOps Team",
    industry: "DevSecOps",
    image: "/img/services/use-case-1.webp",
    tags: [
      "40% Faster Releases",
      "Zero Violations",
      "Complete Audit Trail",
      "CI/CD Integration"
    ],
    challenge_summary: "Automated documentation agent for technical teams. ArqRelease continuously monitors your CI/CD pipeline for significant changes, drafts relevant JIRA tickets, and keeps your documentation up-to-date.",
    results_summary: "40% faster releases with zero compliance violations.",
    key_metrics: [
      { label: "Faster Releases", value: "40%" },
      { label: "Violations", value: "Zero" },
    ],
  },
  {
    id: "2",
    slug: "arqoptimize-finsecops",
    title: "ArqOptimize™",
    client_name: "FinOps Team",
    industry: "FinSecOps",
    image: "/img/services/use-case-2.webp",
    tags: [
      "25-40% Cost Reduction in 90 Days",
      "60-Day Payback Period",
      "400%+ ROI Over 2 Years",
      "Zero \"Zombie Resources\" Left Running"
    ],
    challenge_summary: "Enterprises waste up to 30-40% of cloud spend on idle resources. ArqOptimize connects your project tools (Jira, Asana, Trello, Monday) with cloud platforms (AWS, Azure, GCP) to detect and eliminate orphaned assets automatically turning project closure into instant savings.",
    results_summary: "25-40% cost reduction with 60-day payback.",
    key_metrics: [
      { label: "Cost Reduction", value: "25-40%" },
      { label: "Payback Period", value: "60 Days" },
    ],
  },
  {
    id: "3",
    slug: "arqintel-investment",
    title: "ArqIntel™",
    client_name: "Investment Team",
    industry: "Investment Due Diligence",
    image: "/img/services/use-case-4.webp",
    tags: [
      "70% Faster Screening",
      "100% Consistent Scoring",
      "Complete Audit Trails",
      "Multi-jurisdiction Compliance"
    ],
    challenge_summary: "Investment teams conduct thorough, repeatable due diligence without sacrificing speed. ArqIntel ingests documents from any source, applies consistent analysis frameworks, scores risks within your criteria, and produces audit-ready reports all with governance enforced at every step.",
    results_summary: "70% faster screening with consistent scoring.",
    key_metrics: [
      { label: "Faster Screening", value: "70%" },
      { label: "Consistent Scoring", value: "100%" },
    ],
  },
  {
    id: "4",
    slug: "custom-vertical-solutions",
    title: "Custom Vertical Solutions",
    client_name: "Enterprise",
    industry: "Custom",
    image: "/img/services/use-case-5.webp",
    tags: [
      "30-day Deployment",
      "Unified Governance Layer",
      "No Vendor Lock-in",
      "30+ Proven Deployments"
    ],
    challenge_summary: "Don't see your vertical? We build custom products on the ArqAI platform. Banking compliance automation. Healthcare PHI handling. Government FedRAMP deployments. Same platform foundation, tailored to your regulatory requirements and business outcomes.",
    results_summary: "30-day deployment with unified governance.",
    key_metrics: [
      { label: "Deployment", value: "30 Days" },
      { label: "Deployments", value: "30+" },
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
