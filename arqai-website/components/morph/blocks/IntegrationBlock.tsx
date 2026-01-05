"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckIcon, ArrowRightIcon } from "@/components/ui/Icons";

const integrationCategories = [
  {
    id: "llm",
    name: "LLM Providers",
    description: "Connect to any LLM while maintaining governance",
    integrations: [
      { name: "OpenAI", status: "available", features: ["GPT-4", "GPT-3.5", "Embeddings"] },
      { name: "Anthropic", status: "available", features: ["Claude 3", "Claude 2", "Embeddings"] },
      { name: "Azure OpenAI", status: "available", features: ["GPT-4", "GPT-3.5", "DALL-E"] },
      { name: "Google AI", status: "available", features: ["Gemini Pro", "PaLM 2"] },
      { name: "Cohere", status: "available", features: ["Command", "Embed", "Rerank"] },
      { name: "AWS Bedrock", status: "available", features: ["Multiple models"] },
      { name: "Custom/Self-hosted", status: "available", features: ["Any OpenAI-compatible API"] },
    ],
  },
  {
    id: "cloud",
    name: "Cloud Platforms",
    description: "Deploy in your preferred cloud environment",
    integrations: [
      { name: "AWS", status: "available", features: ["EC2", "EKS", "Lambda", "S3"] },
      { name: "Microsoft Azure", status: "available", features: ["AKS", "Functions", "Blob"] },
      { name: "Google Cloud", status: "available", features: ["GKE", "Cloud Run", "BigQuery"] },
      { name: "Private Cloud", status: "available", features: ["VMware", "OpenStack", "K8s"] },
    ],
  },
  {
    id: "data",
    name: "Data Platforms",
    description: "Connect your data sources securely",
    integrations: [
      { name: "Snowflake", status: "available", features: ["Tables", "Stages", "Streams"] },
      { name: "Databricks", status: "available", features: ["Delta Lake", "Unity Catalog"] },
      { name: "BigQuery", status: "available", features: ["Datasets", "ML Models"] },
      { name: "Redshift", status: "available", features: ["Tables", "Spectrum"] },
      { name: "PostgreSQL", status: "available", features: ["Direct connection"] },
      { name: "MongoDB", status: "available", features: ["Collections", "Atlas"] },
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise Tools",
    description: "Integrate with your existing workflows",
    integrations: [
      { name: "Slack", status: "available", features: ["Bots", "Notifications", "Workflows"] },
      { name: "Microsoft Teams", status: "available", features: ["Bots", "Cards", "Tabs"] },
      { name: "ServiceNow", status: "available", features: ["Incidents", "Requests", "CMDB"] },
      { name: "Salesforce", status: "available", features: ["Objects", "Flows", "Einstein"] },
      { name: "Jira", status: "available", features: ["Issues", "Automation"] },
      { name: "SAP", status: "coming-soon", features: ["S/4HANA", "BTP"] },
    ],
  },
  {
    id: "security",
    name: "Security & Identity",
    description: "Enterprise-grade security integrations",
    integrations: [
      { name: "Okta", status: "available", features: ["SSO", "MFA", "SCIM"] },
      { name: "Azure AD", status: "available", features: ["SSO", "Groups", "Conditional Access"] },
      { name: "AWS IAM", status: "available", features: ["Roles", "Policies"] },
      { name: "HashiCorp Vault", status: "available", features: ["Secrets", "Encryption"] },
      { name: "Splunk", status: "available", features: ["Logs", "SIEM"] },
      { name: "Datadog", status: "available", features: ["Logs", "APM", "Security"] },
    ],
  },
];

export function IntegrationBlock() {
  const [activeCategory, setActiveCategory] = useState(integrationCategories[0]);

  return (
    <div className="space-y-8">
      <p className="text-gray-600 dark:text-gray-400 text-center max-w-2xl mx-auto">
        ArqAI integrates seamlessly with your existing infrastructure. Our open
        architecture ensures you can connect to any system while maintaining
        complete governance.
      </p>

      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-2">
        {integrationCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeCategory.id === category.id
                ? "bg-[#0432a5] text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Integration Grid */}
      <motion.div
        key={activeCategory.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <p className="text-center text-gray-600 dark:text-gray-400">
          {activeCategory.description}
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeCategory.integrations.map((integration, index) => (
            <motion.div
              key={integration.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`p-4 rounded-xl border ${
                integration.status === "coming-soon"
                  ? "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
                  : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-[#0432a5]/50 dark:hover:border-[#d0f438]/50 hover:shadow-md"
              } transition-all`}
            >
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                  {integration.name}
                </h4>
                {integration.status === "coming-soon" ? (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                    Coming Soon
                  </span>
                ) : (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                    Available
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-1">
                {integration.features.map((feature) => (
                  <span
                    key={feature}
                    className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-400"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Integration Checklist */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-6 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
      >
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Integration Readiness Checklist
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            "API access to your LLM provider(s)",
            "Cloud environment with Kubernetes support",
            "Network connectivity to data sources",
            "Identity provider for SSO (recommended)",
            "Logging infrastructure (optional)",
            "Secret management solution (optional)",
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center">
                <CheckIcon size={12} className="text-gray-400 dark:text-gray-500" />
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">{item}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-center pt-4"
      >
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Don&apos;t see an integration you need? We can help.
        </p>
        <a
          href="/demo"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#0432a5] text-white rounded-lg font-semibold hover:opacity-90 transition-colors"
        >
          Discuss Your Requirements
          <ArrowRightIcon size={18} />
        </a>
      </motion.div>
    </div>
  );
}
