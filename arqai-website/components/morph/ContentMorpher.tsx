"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useMorph, MorphType } from "@/contexts/MorphContext";
import { ComparisonBlock } from "./blocks/ComparisonBlock";
import { ROICalculatorBlock } from "./blocks/ROICalculatorBlock";
import { ArchitectureBlock } from "./blocks/ArchitectureBlock";
import { CaseStudyBlock } from "./blocks/CaseStudyBlock";
import { TimelineBlock } from "./blocks/TimelineBlock";
import { IntegrationBlock } from "./blocks/IntegrationBlock";
import { FeaturesBlock } from "./blocks/FeaturesBlock";
import { CloseIcon } from "@/components/ui/Icons";

// Use a function to get component to avoid SSR/hydration issues
function getMorphComponent(type: Exclude<MorphType, null>) {
  switch (type) {
    case "comparison":
      return ComparisonBlock;
    case "roi":
      return ROICalculatorBlock;
    case "architecture":
      return ArchitectureBlock;
    case "case-study":
      return CaseStudyBlock;
    case "timeline":
      return TimelineBlock;
    case "integration":
      return IntegrationBlock;
    case "features":
    case "pricing":
      return FeaturesBlock;
    default:
      return null;
  }
}

const morphTitles: Record<Exclude<MorphType, null>, string> = {
  comparison: "How ArqAI Compares",
  roi: "Calculate Your ROI",
  architecture: "Platform Architecture",
  "case-study": "Success Stories",
  timeline: "Implementation Timeline",
  integration: "Integration Checklist",
  features: "Feature Deep Dive",
  pricing: "Pricing Overview",
};

export function ContentMorpher() {
  const { activeMorph, clearMorph } = useMorph();

  if (!activeMorph) return null;

  const MorphComponent = getMorphComponent(activeMorph);

  // Safety check - if component doesn't exist for this morph type, don't render
  if (!MorphComponent) {
    console.warn(`No morph component found for type: ${activeMorph}`);
    clearMorph();
    return null;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeMorph}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        transition={{
          duration: 0.4,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="fixed inset-0 z-40 flex items-center justify-center p-4 md:p-8"
      >
        {/* Backdrop with blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-[var(--arq-black)]/20 backdrop-blur-sm"
          onClick={clearMorph}
        />

        {/* Content Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="relative w-full max-w-5xl max-h-[85vh] overflow-auto glass-morph rounded-2xl shadow-2xl"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-white/20 bg-white/80 backdrop-blur-xl rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[var(--arq-lime)] animate-pulse" />
              <h2 className="text-lg font-semibold text-[var(--arq-black)]">
                {morphTitles[activeMorph]}
              </h2>
            </div>
            <button
              onClick={clearMorph}
              className="p-2 rounded-lg hover:bg-[var(--arq-gray-100)] transition-colors"
              aria-label="Close"
            >
              <CloseIcon size={20} className="text-[var(--arq-gray-600)]" />
            </button>
          </div>

          {/* Dynamic Content */}
          <div className="p-6 md:p-8">
            <MorphComponent />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
