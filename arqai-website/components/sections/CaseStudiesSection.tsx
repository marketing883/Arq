"use client";

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

const industryColors: Record<string, string> = {
  "Financial Services": "from-blue-500 to-blue-700",
  "Healthcare": "from-green-500 to-green-700",
  "Insurance": "from-purple-500 to-purple-700",
  "Government": "from-gray-500 to-gray-700",
};

export function CaseStudiesSection({ caseStudies }: CaseStudiesSectionProps) {
  if (!caseStudies || caseStudies.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-white dark:bg-[var(--arq-gray-800)]">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-[var(--arq-lime)]/20 text-[var(--arq-lime-dark)] dark:text-[var(--arq-lime)] text-sm font-semibold mb-4">
            Customer Success
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--arq-black)] dark:text-white mb-4">
            Real Results from Real Enterprises
          </h2>
          <p className="text-[var(--arq-gray-600)] dark:text-[var(--arq-gray-400)] max-w-2xl mx-auto">
            See how leading organizations are transforming their AI operations with ArqAI
          </p>
        </motion.div>

        {/* Case Studies Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {caseStudies.slice(0, 2).map((study, index) => (
            <motion.div
              key={study.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="group"
            >
              <Link href={`/customers/${study.slug}`}>
                <div className="bg-[var(--arq-gray-50)] dark:bg-[var(--arq-gray-900)] rounded-2xl overflow-hidden border border-[var(--arq-gray-200)] dark:border-[var(--arq-gray-700)] hover:border-[var(--arq-blue)] transition-all duration-300 h-full">
                  {/* Header with gradient */}
                  <div className={`bg-gradient-to-r ${industryColors[study.industry] || "from-[var(--arq-blue)] to-[var(--arq-blue-dark)]"} p-6`}>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-white/90 text-sm font-medium">{study.industry}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{study.client_name}</h3>
                    <p className="text-white/80 text-sm">{study.title}</p>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-[var(--arq-gray-500)] uppercase tracking-wider mb-2">
                        Challenge
                      </p>
                      <p className="text-[var(--arq-gray-700)] dark:text-[var(--arq-gray-300)] text-sm line-clamp-2">
                        {study.challenge_summary}
                      </p>
                    </div>

                    {study.key_metrics && study.key_metrics.length > 0 && (
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        {study.key_metrics.slice(0, 4).map((metric, i) => (
                          <div key={i} className="text-center p-3 bg-white dark:bg-[var(--arq-gray-800)] rounded-lg">
                            <div className="text-xl font-bold text-[var(--arq-blue)]">
                              {metric.value}
                            </div>
                            <div className="text-xs text-[var(--arq-gray-500)]">
                              {metric.label}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <span className="inline-flex items-center gap-2 text-[var(--arq-blue)] font-medium text-sm group-hover:gap-3 transition-all">
                      Read Case Study
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-10"
        >
          <Link
            href="/customers"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--arq-blue)] text-white font-semibold rounded-full hover:bg-[var(--arq-blue-dark)] transition-colors"
          >
            View All Case Studies
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// Static placeholder version
export function CaseStudiesSectionStatic() {
  const placeholderStudies: CaseStudy[] = [
    {
      id: "1",
      slug: "global-bank-loan-underwriting",
      title: "Automated Loan Underwriting with 100% Audit Compliance",
      client_name: "Top 5 Global Bank",
      industry: "Financial Services",
      challenge_summary: "Manual compliance checks were slowing loan processing by 70%, creating bottlenecks and customer dissatisfaction.",
      results_summary: "Achieved 70% faster underwriting with zero regulatory findings and $2.3M annual savings.",
      key_metrics: [
        { label: "Faster Processing", value: "70%" },
        { label: "Audit Compliance", value: "100%" },
        { label: "Annual Savings", value: "$2.3M" },
        { label: "Regulatory Issues", value: "Zero" },
      ],
    },
    {
      id: "2",
      slug: "healthcare-hipaa-compliance",
      title: "HIPAA-Compliant Patient Data Management at Scale",
      client_name: "Major Health System",
      industry: "Healthcare",
      challenge_summary: "Needed AI for patient data summarization without risking HIPAA violations across multiple facilities.",
      results_summary: "50% reduced admin time with 100% HIPAA compliance and 3x AI deployment scale.",
      key_metrics: [
        { label: "Admin Time Saved", value: "50%" },
        { label: "HIPAA Compliance", value: "100%" },
        { label: "Care Coordination", value: "+40%" },
        { label: "Deployment Scale", value: "3x" },
      ],
    },
  ];

  return <CaseStudiesSection caseStudies={placeholderStudies} />;
}
