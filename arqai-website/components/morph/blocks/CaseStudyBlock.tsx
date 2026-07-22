"use client";

import { motion } from "framer-motion";
import { ArrowRightIcon, CheckIcon } from "@/components/ui/Icons";
import { CardCustomization } from "@/lib/chat/types";

interface CaseStudyBlockProps {
  customizations?: CardCustomization | null;
}

// The one real, publishable engagement. This block intentionally ignores
// AI-personalized case-study content — proof is never generated at runtime.
// Full narrative: /case-studies/tpa-blind-spot-assessment
const study = {
  industry: "Healthcare Payers",
  badge: "Mid-Size TPA",
  title: "Undetected Waste Found in One Blind Spot Assessment",
  challenge:
    "A mid-size third-party administrator had been rated fully compliant by its payment-integrity vendor. The rating reflected what the incumbent tooling was designed to look for — isolated claims scored against generic payer rules — not what pattern-level analysis could still find.",
  solution:
    "A single ArqAI Blind Spot Assessment ran ArqFWA's cross-signal analysis over historical claims the incumbent tools had already cleared, correlating billing patterns, provider behavior, and member history into one risk picture — with every flagged case carrying the evidence a reviewer needs to act.",
  results: [
    { metric: "Surfaced", label: "Undetected waste" },
    { metric: "Cut", label: "Manual review time" },
    { metric: "1", label: "Assessment engagement" },
    { metric: "Evidenced", label: "Every finding" },
  ],
  outcomes: [
    "Waste and leakage surfaced in claims already rated compliant",
    "Fewer, better cases instead of thousands of isolated rule hits",
    "Evidence, peer comparisons, and policy references on every finding",
    "No rip-and-replace — ran on data the operation already had",
  ],
};

export function CaseStudyBlock({ customizations }: CaseStudyBlockProps) {
  const introText =
    customizations?.subheadline ||
    "One real engagement, told straight — what a single ArqAI Blind Spot Assessment found at a mid-size TPA.";

  return (
    <div className="space-y-8">
      <p className="text-gray-600 text-center max-w-2xl mx-auto">{introText}</p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="grid lg:grid-cols-2 gap-8"
      >
        {/* Left Column - Details */}
        <div className="space-y-6">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-[#252e3d]/10 text-[#252e3d] text-sm font-semibold mb-3">
              {study.badge} · {study.industry}
            </span>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{study.title}</h3>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-2">The Challenge</h4>
            <p className="text-gray-600">{study.challenge}</p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-2">The Assessment</h4>
            <p className="text-gray-600">{study.solution}</p>
          </div>

          <a
            href="/case-studies/tpa-blind-spot-assessment"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#252e3d] underline underline-offset-4"
          >
            Read the full case study
            <ArrowRightIcon size={16} />
          </a>
        </div>

        {/* Right Column - Results */}
        <div className="space-y-6">
          <h4 className="font-semibold text-gray-900">Results</h4>
          <div className="grid grid-cols-2 gap-4">
            {study.results.map((result, index) => (
              <motion.div
                key={result.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-xl bg-white border border-gray-200 text-center shadow-sm"
              >
                <div className="text-3xl font-bold text-[#252e3d] mb-1">{result.metric}</div>
                <div className="text-sm text-gray-600">{result.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Key Outcomes */}
          <div className="p-6 rounded-xl bg-[#252e3d] text-white">
            <h4 className="font-semibold mb-4">Key Outcomes</h4>
            <ul className="space-y-3">
              {study.outcomes.map((outcome, index) => (
                <li key={index} className="flex items-center gap-3">
                  <CheckIcon size={16} className="text-[#d0f439]" />
                  <span className="text-white/90">{outcome}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-center pt-4"
      >
        <p className="text-sm text-gray-600 mb-4">
          What would an assessment find in your claims data?
        </p>
        <a
          href="/engage-us"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#252e3d] text-white rounded-lg font-semibold hover:opacity-90 transition-colors"
        >
          Get Started
          <ArrowRightIcon size={18} />
        </a>
      </motion.div>
    </div>
  );
}
