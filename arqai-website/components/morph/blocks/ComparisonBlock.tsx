"use client";

import { motion } from "framer-motion";
import { CheckIcon, CloseIcon } from "@/components/ui/Icons";

interface ComparisonFeature {
  feature: string;
  arqai: boolean;
  competitors: boolean | "partial";
  tooltip: string;
}

interface ComparisonCategory {
  name: string;
  features: ComparisonFeature[];
}

const comparisonData: { categories: ComparisonCategory[] } = {
  categories: [
    {
      name: "Compliance & Governance",
      features: [
        {
          feature: "Compliance-Aware Prompt Compilation",
          arqai: true,
          competitors: false,
          tooltip: "Bake compliance into agents at creation time",
        },
        {
          feature: "Cryptographic Audit Trails",
          arqai: true,
          competitors: false,
          tooltip: "Court-admissible, non-repudiable records",
        },
        {
          feature: "Pre-Execution Policy Enforcement",
          arqai: true,
          competitors: false,
          tooltip: "Stop violations before they happen",
        },
        {
          feature: "Regulatory Framework Templates",
          arqai: true,
          competitors: "partial",
          tooltip: "Pre-built policies for HIPAA, GDPR, SOX, etc.",
        },
      ],
    },
    {
      name: "Security & Trust",
      features: [
        {
          feature: "Zero-Trust Architecture",
          arqai: true,
          competitors: false,
          tooltip: "Every action requires explicit permission",
        },
        {
          feature: "Single-Use Capability Tokens",
          arqai: true,
          competitors: false,
          tooltip: "Cryptographically signed, consumed on use",
        },
        {
          feature: "Role-Based Access Control",
          arqai: true,
          competitors: true,
          tooltip: "Standard RBAC for users and agents",
        },
        {
          feature: "Data Residency Controls",
          arqai: true,
          competitors: "partial",
          tooltip: "Control where data is processed",
        },
      ],
    },
    {
      name: "Observability & Operations",
      features: [
        {
          feature: "AI-Powered Quality Scoring",
          arqai: true,
          competitors: false,
          tooltip: "Secondary AI analyst scores every output",
        },
        {
          feature: "Real-Time Confidence Metrics",
          arqai: true,
          competitors: "partial",
          tooltip: "Know when outputs need human review",
        },
        {
          feature: "Unified Agent Dashboard",
          arqai: true,
          competitors: true,
          tooltip: "Single pane of glass for all agents",
        },
        {
          feature: "Proactive Alert System",
          arqai: true,
          competitors: true,
          tooltip: "Get notified of issues before impact",
        },
      ],
    },
  ],
};

function FeatureCell({ value }: { value: boolean | "partial" }) {
  if (value === true) {
    return (
      <div className="flex items-center justify-center">
        <div className="w-6 h-6 rounded-full bg-[var(--arq-lime)]/20 flex items-center justify-center">
          <CheckIcon size={14} className="text-green-600" />
        </div>
      </div>
    );
  }
  if (value === "partial") {
    return (
      <div className="flex items-center justify-center">
        <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded">
          Partial
        </span>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center">
      <div className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center">
        <CloseIcon size={14} className="text-red-400" />
      </div>
    </div>
  );
}

export function ComparisonBlock() {
  return (
    <div className="space-y-8">
      <p className="text-[var(--arq-gray-600)] text-center max-w-2xl mx-auto">
        See how ArqAI&apos;s integrated approach to enterprise AI governance compares
        to traditional point solutions and general-purpose platforms.
      </p>

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--arq-gray-200)]">
              <th className="text-left py-4 px-4 font-semibold text-[var(--arq-black)]">
                Feature
              </th>
              <th className="text-center py-4 px-4 min-w-[120px]">
                <div className="flex flex-col items-center gap-1">
                  <span className="font-bold text-[var(--arq-blue)]">ArqAI</span>
                  <span className="text-xs text-[var(--arq-gray-500)]">
                    Foundry Platform
                  </span>
                </div>
              </th>
              <th className="text-center py-4 px-4 min-w-[120px]">
                <div className="flex flex-col items-center gap-1">
                  <span className="font-semibold text-[var(--arq-gray-600)]">
                    Others
                  </span>
                  <span className="text-xs text-[var(--arq-gray-500)]">
                    Point Solutions
                  </span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {comparisonData.categories.map((category, catIndex) => (
              <motion.tbody
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: catIndex * 0.1 }}
              >
                <tr className="bg-[var(--arq-gray-50)]">
                  <td
                    colSpan={3}
                    className="py-3 px-4 font-semibold text-[var(--arq-black)] text-sm uppercase tracking-wide"
                  >
                    {category.name}
                  </td>
                </tr>
                {category.features.map((item, index) => (
                  <motion.tr
                    key={item.feature}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: catIndex * 0.1 + index * 0.05 }}
                    className="border-b border-[var(--arq-gray-100)] hover:bg-[var(--arq-gray-50)]/50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-[var(--arq-black)] font-medium">
                          {item.feature}
                        </span>
                        <span className="text-xs text-[var(--arq-gray-500)]">
                          {item.tooltip}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <FeatureCell value={item.arqai} />
                    </td>
                    <td className="py-3 px-4">
                      <FeatureCell value={item.competitors} />
                    </td>
                  </motion.tr>
                ))}
              </motion.tbody>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-center pt-4"
      >
        <p className="text-sm text-[var(--arq-gray-600)] mb-4">
          Want to see these capabilities in action?
        </p>
        <a
          href="/demo"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--arq-blue)] text-white rounded-lg font-semibold hover:bg-[var(--arq-blue)]/90 transition-colors"
        >
          Schedule a Demo
        </a>
      </motion.div>
    </div>
  );
}
