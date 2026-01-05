"use client";

import { motion } from "framer-motion";
import { BlueprintIcon, CertificateIcon, DashboardIcon, ArrowRightIcon } from "@/components/ui/Icons";
import { CardCustomization } from "@/lib/chat/types";

interface ArchitectureBlockProps {
  customizations?: CardCustomization | null;
}

const architectureLayers = [
  {
    id: "capc",
    name: "CAPC",
    fullName: "Compliance-Aware Prompt Compiler",
    description: "Build with Confidence",
    icon: BlueprintIcon,
    color: "#d0f438",
    features: [
      "Policy Hub for centralized rule management",
      "Automatic compliance injection at build time",
      "Pre-deployment validation checks",
      "Regulatory framework templates",
    ],
    position: "top",
  },
  {
    id: "tao",
    name: "TAO",
    fullName: "Trust-Aware Agent Orchestration",
    description: "Run with Trust",
    icon: CertificateIcon,
    color: "#10B981",
    features: [
      "Zero-trust security architecture",
      "Single-use cryptographic tokens",
      "Immutable audit trail logging",
      "Real-time permission validation",
    ],
    position: "middle",
  },
  {
    id: "oda-rag",
    name: "ODA-RAG",
    fullName: "Observability-Driven Adaptive RAG",
    description: "Govern with Insight",
    icon: DashboardIcon,
    color: "#8B5CF6",
    features: [
      "AI-powered quality analysis",
      "Real-time confidence scoring",
      "Unified operations dashboard",
      "Proactive anomaly detection",
    ],
    position: "bottom",
  },
];

const integrationPoints = [
  { name: "LLM Providers", items: ["OpenAI", "Anthropic", "Azure AI", "Cohere"] },
  { name: "Cloud Platforms", items: ["AWS", "Azure", "GCP", "Private Cloud"] },
  { name: "Enterprise Tools", items: ["Slack", "Teams", "ServiceNow", "Salesforce"] },
  { name: "Data Platforms", items: ["Snowflake", "Databricks", "BigQuery", "Redshift"] },
];

export function ArchitectureBlock({ customizations }: ArchitectureBlockProps) {
  const introText = customizations?.subheadline ||
    "The ArqAI Foundry is an integrated platform with three core pillars that work together to provide end-to-end enterprise AI governance.";

  return (
    <div className="space-y-8">
      <p className="text-gray-600 dark:text-gray-400 text-center max-w-2xl mx-auto">
        {introText}
      </p>

      {/* Architecture Diagram */}
      <div className="relative">
        {/* Flow Lines */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#d0f438] via-green-500 to-purple-500 opacity-20" />

        <div className="space-y-6">
          {architectureLayers.map((layer, index) => {
            const Icon = layer.icon;
            return (
              <motion.div
                key={layer.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.15 }}
                className="relative"
              >
                <div
                  className={`grid md:grid-cols-2 gap-6 items-center ${
                    index % 2 === 1 ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Info Card */}
                  <div
                    className={`p-6 rounded-xl border-2 bg-white dark:bg-gray-800 shadow-sm ${
                      index % 2 === 1 ? "md:order-2" : ""
                    }`}
                    style={{ borderColor: `${layer.color}30` }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${layer.color}20`, color: layer.color }}
                      >
                        <Icon size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-gray-100">
                          {layer.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {layer.fullName}
                        </p>
                      </div>
                    </div>
                    <p
                      className="text-sm font-semibold mb-3"
                      style={{ color: layer.color }}
                    >
                      {layer.description}
                    </p>
                    <ul className="space-y-2">
                      {layer.features.map((feature, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                            style={{ backgroundColor: layer.color }}
                          />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Visual Element */}
                  <div
                    className={`hidden md:flex items-center justify-center ${
                      index % 2 === 1 ? "md:order-1" : ""
                    }`}
                  >
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: index * 0.15 + 0.1 }}
                      className="relative w-32 h-32 rounded-2xl flex items-center justify-center"
                      style={{ backgroundColor: `${layer.color}15`, color: layer.color }}
                    >
                      <Icon size={48} />
                      {index < architectureLayers.length - 1 && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.15 + 0.3 }}
                          className="absolute -bottom-8 left-1/2 -translate-x-1/2"
                        >
                          <ArrowRightIcon
                            size={24}
                            className="rotate-90 text-gray-300 dark:text-gray-600"
                          />
                        </motion.div>
                      )}
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Integration Points */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700"
      >
        <h3 className="text-center font-semibold text-gray-900 dark:text-gray-100 mb-6">
          Seamless Integration Ecosystem
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {integrationPoints.map((point, index) => (
            <motion.div
              key={point.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 text-center"
            >
              <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {point.name}
              </h4>
              <div className="flex flex-wrap justify-center gap-1">
                {point.items.map((item) => (
                  <span
                    key={item}
                    className="text-xs px-2 py-1 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="text-center pt-4"
      >
        <a
          href="/platform"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#0432a5] text-white rounded-lg font-semibold hover:opacity-90 transition-colors"
        >
          Explore the Platform
          <ArrowRightIcon size={18} />
        </a>
      </motion.div>
    </div>
  );
}
