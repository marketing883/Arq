"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BlueprintIcon,
  CertificateIcon,
  DashboardIcon,
  CheckIcon,
  ArrowRightIcon,
} from "@/components/ui/Icons";

const featureCategories = [
  {
    id: "compliance",
    name: "Compliance",
    icon: BlueprintIcon,
    color: "var(--arq-blue)",
    features: [
      {
        title: "Policy Hub",
        description:
          "Centralized repository for all your compliance policies. Define rules once, enforce everywhere.",
        capabilities: [
          "Visual policy builder",
          "Version control",
          "Policy inheritance",
          "Conflict detection",
        ],
      },
      {
        title: "Pre-Execution Validation",
        description:
          "Every agent action is validated against policies before execution, not after.",
        capabilities: [
          "Real-time policy checking",
          "Action blocking",
          "Alternative suggestions",
          "Audit logging",
        ],
      },
      {
        title: "Regulatory Templates",
        description:
          "Pre-built policy templates for common regulatory frameworks, customizable to your needs.",
        capabilities: [
          "HIPAA templates",
          "GDPR templates",
          "SOX templates",
          "Custom frameworks",
        ],
      },
      {
        title: "Compliance Reporting",
        description:
          "Automated compliance reports for auditors and regulators with complete evidence.",
        capabilities: [
          "Scheduled reports",
          "Audit exports",
          "Evidence packages",
          "Gap analysis",
        ],
      },
    ],
  },
  {
    id: "security",
    name: "Security",
    icon: CertificateIcon,
    color: "#10B981",
    features: [
      {
        title: "Zero-Trust Architecture",
        description:
          "Every action requires explicit permission. No implicit trust, no exceptions.",
        capabilities: [
          "Capability-based security",
          "Least privilege by default",
          "Dynamic permission grants",
          "Session isolation",
        ],
      },
      {
        title: "Cryptographic Audit Trails",
        description:
          "Every action is cryptographically signed and logged for non-repudiation.",
        capabilities: [
          "Immutable logs",
          "Digital signatures",
          "Tamper detection",
          "Chain of custody",
        ],
      },
      {
        title: "Data Residency Controls",
        description:
          "Control where your data is processed and stored with geographic restrictions.",
        capabilities: [
          "Region selection",
          "Cross-border controls",
          "Data classification",
          "Encryption at rest",
        ],
      },
      {
        title: "Access Management",
        description:
          "Fine-grained access control for users, agents, and data with role-based policies.",
        capabilities: [
          "RBAC/ABAC support",
          "SSO integration",
          "MFA enforcement",
          "Session management",
        ],
      },
    ],
  },
  {
    id: "operations",
    name: "Operations",
    icon: DashboardIcon,
    color: "#8B5CF6",
    features: [
      {
        title: "Unified Dashboard",
        description:
          "Single pane of glass for your entire AI workforce with real-time visibility.",
        capabilities: [
          "Agent inventory",
          "Performance metrics",
          "Health monitoring",
          "Trend analysis",
        ],
      },
      {
        title: "AI Quality Scoring",
        description:
          "Secondary AI analyst evaluates every output for quality and confidence.",
        capabilities: [
          "Confidence scores",
          "Quality ratings",
          "Hallucination detection",
          "Consistency checks",
        ],
      },
      {
        title: "Alerting & Notifications",
        description:
          "Proactive alerts when agents behave unexpectedly or quality drops.",
        capabilities: [
          "Custom alert rules",
          "Multi-channel delivery",
          "Escalation paths",
          "Alert correlation",
        ],
      },
      {
        title: "Performance Analytics",
        description:
          "Deep insights into agent performance with drill-down capabilities.",
        capabilities: [
          "Usage analytics",
          "Cost tracking",
          "Latency metrics",
          "Error analysis",
        ],
      },
    ],
  },
];

export function FeaturesBlock() {
  const [activeCategory, setActiveCategory] = useState(featureCategories[0]);
  const [activeFeature, setActiveFeature] = useState(activeCategory.features[0]);

  const handleCategoryChange = (category: typeof featureCategories[0]) => {
    setActiveCategory(category);
    setActiveFeature(category.features[0]);
  };

  const Icon = activeCategory.icon;

  return (
    <div className="space-y-8">
      <p className="text-[var(--arq-gray-600)] text-center max-w-2xl mx-auto">
        Explore the comprehensive capabilities of the ArqAI Foundry platform
        across compliance, security, and operations.
      </p>

      {/* Category Tabs */}
      <div className="flex justify-center gap-4">
        {featureCategories.map((category) => {
          const CategoryIcon = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all ${
                activeCategory.id === category.id
                  ? "text-white shadow-lg"
                  : "bg-[var(--arq-gray-100)] text-[var(--arq-gray-600)] hover:bg-[var(--arq-gray-200)]"
              }`}
              style={{
                backgroundColor:
                  activeCategory.id === category.id ? category.color : undefined,
              }}
            >
              <CategoryIcon size={20} />
              {category.name}
            </button>
          );
        })}
      </div>

      {/* Feature Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="grid lg:grid-cols-3 gap-6"
        >
          {/* Feature List */}
          <div className="space-y-2">
            {activeCategory.features.map((feature) => (
              <button
                key={feature.title}
                onClick={() => setActiveFeature(feature)}
                className={`w-full text-left p-4 rounded-xl transition-all ${
                  activeFeature.title === feature.title
                    ? "bg-white shadow-md border-2"
                    : "bg-[var(--arq-gray-50)] hover:bg-white border-2 border-transparent"
                }`}
                style={{
                  borderColor:
                    activeFeature.title === feature.title
                      ? activeCategory.color
                      : undefined,
                }}
              >
                <h4 className="font-semibold text-[var(--arq-black)]">
                  {feature.title}
                </h4>
              </button>
            ))}
          </div>

          {/* Feature Details */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFeature.title}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-6 rounded-xl bg-white border border-[var(--arq-gray-200)] shadow-sm h-full"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${activeCategory.color}15`, color: activeCategory.color }}
                  >
                    <Icon size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-[var(--arq-black)]">
                    {activeFeature.title}
                  </h3>
                </div>

                <p className="text-[var(--arq-gray-600)] mb-6">
                  {activeFeature.description}
                </p>

                <h4 className="text-sm font-semibold text-[var(--arq-gray-700)] mb-3">
                  Key Capabilities
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {activeFeature.capabilities.map((capability, index) => (
                    <motion.div
                      key={capability}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-2"
                      style={{ color: activeCategory.color }}
                    >
                      <CheckIcon
                        size={16}
                        className="flex-shrink-0"
                      />
                      <span className="text-sm text-[var(--arq-gray-600)]">
                        {capability}
                      </span>
                    </motion.div>
                  ))}
                </div>

                <div
                  className="mt-6 pt-6 border-t"
                  style={{ borderColor: `${activeCategory.color}20` }}
                >
                  <a
                    href="/platform"
                    className="inline-flex items-center gap-2 text-sm font-medium transition-colors"
                    style={{ color: activeCategory.color }}
                  >
                    Learn more about {activeCategory.name}
                    <ArrowRightIcon size={14} />
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center pt-4"
      >
        <a
          href="/demo"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--arq-blue)] text-white rounded-lg font-semibold hover:bg-[var(--arq-blue)]/90 transition-colors"
        >
          See Features in Action
          <ArrowRightIcon size={18} />
        </a>
      </motion.div>
    </div>
  );
}
