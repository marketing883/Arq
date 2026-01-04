"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRightIcon, CheckIcon } from "@/components/ui/Icons";

const caseStudies = [
  {
    id: "financial",
    industry: "Financial Services",
    badge: "Top 5 Global Bank",
    title: "Automated Loan Underwriting with Complete Audit Trails",
    challenge:
      "A leading global bank needed to automate their loan underwriting process while maintaining strict SOX compliance and Fair Lending Act adherence. Their existing AI solutions lacked the audit capabilities required by regulators.",
    solution:
      "ArqAI's Foundry platform enabled the bank to build compliant AI agents with built-in policy enforcement. Every underwriting decision is now backed by cryptographic proof and a complete audit trail.",
    results: [
      { metric: "70%", label: "Faster Underwriting" },
      { metric: "100%", label: "Audit Compliance" },
      { metric: "$2.3M", label: "Annual Savings" },
      { metric: "Zero", label: "Regulatory Findings" },
    ],
    quote:
      "ArqAI gave us the confidence to deploy AI at scale. We no longer worry about compliance - it's built into every agent.",
    quoteAuthor: "Chief Risk Officer",
  },
  {
    id: "healthcare",
    industry: "Healthcare",
    badge: "Major Health System",
    title: "HIPAA-Compliant Patient Data Management",
    challenge:
      "A large health system wanted to use AI for patient data summarization and care coordination but couldn't risk HIPAA violations. Manual processes were slowing down care delivery.",
    solution:
      "ArqAI's zero-trust architecture ensured that AI agents only accessed patient data with proper authorization. Every access is logged with cryptographic proof for HIPAA audits.",
    results: [
      { metric: "50%", label: "Reduced Admin Time" },
      { metric: "100%", label: "HIPAA Compliance" },
      { metric: "40%", label: "Faster Care Coordination" },
      { metric: "3x", label: "AI Deployment Scale" },
    ],
    quote:
      "Patient data security is non-negotiable. ArqAI's approach to zero-trust AI governance was exactly what we needed.",
    quoteAuthor: "CISO",
  },
  {
    id: "insurance",
    industry: "Insurance",
    badge: "Fortune 100 Insurer",
    title: "Intelligent Claims Processing with Fraud Detection",
    challenge:
      "A major insurer needed to accelerate claims processing while maintaining regulatory compliance with NAIC guidelines and detecting potential fraud. Manual review was creating bottlenecks.",
    solution:
      "ArqAI enabled the deployment of AI agents that process claims autonomously while flagging potential fraud. Every decision is logged and can be reviewed by adjusters when needed.",
    results: [
      { metric: "80%", label: "Faster Processing" },
      { metric: "35%", label: "More Fraud Detected" },
      { metric: "$5M+", label: "Fraud Prevented" },
      { metric: "98%", label: "Customer Satisfaction" },
    ],
    quote:
      "The combination of speed and compliance oversight has transformed our claims operation. Our adjusters now focus on complex cases.",
    quoteAuthor: "VP of Claims Operations",
  },
];

export function CaseStudyBlock() {
  const [activeStudy, setActiveStudy] = useState(caseStudies[0]);

  return (
    <div className="space-y-8">
      <p className="text-[var(--arq-gray-600)] text-center max-w-2xl mx-auto">
        See how leading enterprises across industries are using ArqAI to govern
        their AI workforce with confidence.
      </p>

      {/* Industry Tabs */}
      <div className="flex flex-wrap justify-center gap-3">
        {caseStudies.map((study) => (
          <button
            key={study.id}
            onClick={() => setActiveStudy(study)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeStudy.id === study.id
                ? "bg-[var(--arq-blue)] text-white"
                : "bg-[var(--arq-gray-100)] text-[var(--arq-gray-600)] hover:bg-[var(--arq-gray-200)]"
            }`}
          >
            {study.industry}
          </button>
        ))}
      </div>

      {/* Case Study Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStudy.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="grid lg:grid-cols-2 gap-8"
        >
          {/* Left Column - Details */}
          <div className="space-y-6">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-[var(--arq-blue)]/10 text-[var(--arq-blue)] text-sm font-semibold mb-3">
                {activeStudy.badge}
              </span>
              <h3 className="text-xl font-bold text-[var(--arq-black)] mb-2">
                {activeStudy.title}
              </h3>
            </div>

            <div>
              <h4 className="font-semibold text-[var(--arq-black)] mb-2">
                The Challenge
              </h4>
              <p className="text-[var(--arq-gray-600)]">{activeStudy.challenge}</p>
            </div>

            <div>
              <h4 className="font-semibold text-[var(--arq-black)] mb-2">
                The Solution
              </h4>
              <p className="text-[var(--arq-gray-600)]">{activeStudy.solution}</p>
            </div>

            {/* Quote */}
            <div className="p-6 rounded-xl bg-[var(--arq-gray-50)] border-l-4 border-[var(--arq-blue)]">
              <blockquote className="text-[var(--arq-gray-700)] italic mb-3">
                &ldquo;{activeStudy.quote}&rdquo;
              </blockquote>
              <p className="text-sm font-semibold text-[var(--arq-gray-500)]">
                — {activeStudy.quoteAuthor}, {activeStudy.badge}
              </p>
            </div>
          </div>

          {/* Right Column - Results */}
          <div className="space-y-6">
            <h4 className="font-semibold text-[var(--arq-black)]">Results</h4>
            <div className="grid grid-cols-2 gap-4">
              {activeStudy.results.map((result, index) => (
                <motion.div
                  key={result.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 rounded-xl bg-white border border-[var(--arq-gray-200)] text-center shadow-sm"
                >
                  <div className="text-3xl font-bold text-[var(--arq-blue)] mb-1">
                    {result.metric}
                  </div>
                  <div className="text-sm text-[var(--arq-gray-600)]">
                    {result.label}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Key Outcomes */}
            <div className="p-6 rounded-xl bg-[var(--arq-black)] text-white">
              <h4 className="font-semibold mb-4">Key Outcomes</h4>
              <ul className="space-y-3">
                {[
                  "Full regulatory compliance maintained",
                  "Complete audit trail for all AI decisions",
                  "Scalable AI deployment with governance",
                  "Reduced risk of compliance violations",
                ].map((outcome, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckIcon size={16} className="text-[var(--arq-lime)]" />
                    <span className="text-white/90">{outcome}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-center pt-4"
      >
        <p className="text-sm text-[var(--arq-gray-600)] mb-4">
          Want to achieve similar results for your organization?
        </p>
        <a
          href="/demo"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--arq-blue)] text-white rounded-lg font-semibold hover:bg-[var(--arq-blue)]/90 transition-colors"
        >
          Request a Demo
          <ArrowRightIcon size={18} />
        </a>
      </motion.div>
    </div>
  );
}
