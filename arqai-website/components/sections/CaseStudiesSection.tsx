"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface CaseStudy {
  id: string;
  slug: string;
  title: string;
  client_name: string;
  industry: string;
  challenge_summary: string;
  results_summary: string;
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
  if (!caseStudies || caseStudies.length === 0) {
    return null;
  }

  return (
    <section className="py-section bg-base">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header - matches old design "Real Products. Real Results." */}
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

        {/* Case Studies List - Clean list design matching old template */}
        <div className="space-y-0">
          {caseStudies.map((study, index) => (
            <motion.div
              key={study.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              {/* Top border */}
              <div className="h-px bg-stroke-muted" />

              <Link href={`/case-studies/${study.slug}`} className="block py-8 hover:bg-base-tint/50 transition-colors -mx-4 px-4 md:-mx-6 md:px-6">
                <div className="grid grid-cols-12 gap-6 items-start">
                  {/* Icon */}
                  <div className="col-span-12 md:col-span-2 lg:col-span-1">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                      <StarIcon className="w-6 h-6 text-accent" />
                    </div>
                  </div>

                  {/* Title & Meta */}
                  <div className="col-span-12 md:col-span-4 lg:col-span-3">
                    <h3 className="text-lg font-display font-semibold text-text-bright mb-2 group-hover:text-accent transition-colors">
                      {study.client_name}
                    </h3>
                    <p className="text-body-sm text-text-muted">
                      <strong>Industry:</strong> {study.industry}
                    </p>
                    <p className="text-body-sm text-text-muted">
                      <strong>Solution:</strong> {study.title}
                    </p>
                  </div>

                  {/* Results */}
                  <div className="col-span-12 md:col-span-6 lg:col-span-7">
                    <p className="text-body-sm font-semibold text-text-bright mb-2">Results:</p>
                    {study.key_metrics && study.key_metrics.length > 0 ? (
                      <ul className="space-y-1">
                        {study.key_metrics.slice(0, 4).map((metric, i) => (
                          <li key={i} className="text-body-sm text-text-muted flex items-start gap-2">
                            <span className="text-accent">•</span>
                            <span><strong className="text-accent">{metric.value}</strong> {metric.label}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-body-sm text-text-muted">{study.results_summary}</p>
                    )}
                  </div>

                  {/* Arrow - shows on hover */}
                  <div className="hidden lg:flex col-span-1 items-center justify-end">
                    <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Bottom border for last item */}
              {index === caseStudies.length - 1 && (
                <div className="h-px bg-stroke-muted" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Placeholder case studies for fallback - matching the old design's data format
const placeholderStudies: CaseStudy[] = [
  {
    id: "1",
    slug: "devsecops-saas-company",
    title: "ArqRelease",
    client_name: "DevSecOps Team, SaaS Company",
    industry: "B2B SaaS",
    challenge_summary: "Security review bottlenecks and cloud waste.",
    results_summary: "Reduced security review time from 6 weeks to 4 days with $230K annual savings.",
    key_metrics: [
      { label: "security review (6 weeks → 4 days)", value: "96%" },
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
    challenge_summary: "Cloud cost visibility and anomaly detection challenges.",
    results_summary: "42% reduction in monthly cloud spend with 90% faster anomaly detection.",
    key_metrics: [
      { label: "reduction in monthly cloud spend", value: "42%" },
      { label: "faster anomaly detection (minutes vs. days)", value: "90%" },
      { label: "Real-time cost attribution across 40+ teams", value: "40+" },
      { label: "developer complaints about resource constraints", value: "Zero" },
    ],
  },
  {
    id: "3",
    slug: "ai-team-investment-firm",
    title: "ArqIntel",
    client_name: "AI Team, Investment Firm (Pilot)",
    industry: "Private Equity / Venture Capital",
    challenge_summary: "Inconsistent deal screening and slow due diligence process.",
    results_summary: "68% reduction in initial screening time with 100% consistent scoring.",
    key_metrics: [
      { label: "reduction in initial screening time", value: "68%" },
      { label: "consistent scoring across all deals", value: "100%" },
      { label: "Audit-ready reports in hours, not weeks", value: "Hours" },
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
