"use client";

import { motion } from "framer-motion";

const technologies = [
  {
    abbr: "GOV",
    name: "Governance Plane",
    description: "Permissions, approvals, and audit trails",
  },
  {
    abbr: "POL",
    name: "Workflow Policy",
    description: "Rules built into agentic actions",
  },
  {
    abbr: "EVAL",
    name: "Evaluation Layer",
    description: "Quality, evidence, and performance review",
  },
];

const layers = [
  {
    id: "agents",
    label: "Industry AI Workflows",
    sublabel: "Finance, Healthcare, Insurance, Telecom, Retail, Real Estate",
    color: "bg-accent",
    textColor: "text-base-opp",
  },
  {
    id: "blueprints",
    label: "Accelerator Patterns",
    sublabel: "Reusable workflow spines for repeatable operating patterns",
    color: "bg-accent/70",
    textColor: "text-base-opp",
  },
  {
    id: "governance",
    label: "Operating Fabric",
    sublabel: "Governance + policy + evaluation",
    color: "bg-base-opp",
    textColor: "text-base",
  },
];

interface GovernanceArchitectureProps {
  variant?: "full" | "compact";
  className?: string;
}

export function GovernanceArchitecture({
  variant = "full",
  className = "",
}: GovernanceArchitectureProps) {
  if (variant === "compact") {
    return (
      <div className={`${className}`}>
        <div className="flex flex-col gap-2">
          {layers.map((layer, index) => (
            <motion.div
              key={layer.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className={`${layer.color} ${layer.textColor} rounded-lg p-4 text-center`}
            >
              <div className="font-semibold text-sm">{layer.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      {/* Main Architecture Diagram */}
      <div className="relative max-w-4xl mx-auto">
        {/* Stacked Layers */}
        <div className="flex flex-col gap-3">
          {layers.map((layer, index) => (
            <motion.div
              key={layer.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              className="relative"
            >
              <div
                className={`${layer.color} ${layer.textColor} rounded-xl p-6 md:p-8 text-center relative overflow-hidden`}
              >
                {/* Decorative gradient overlay */}
                {layer.id === "governance" && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                )}

                <div className="relative z-10">
                  <h3 className="text-xl md:text-2xl font-display font-bold mb-2">
                    {layer.label}
                  </h3>
                  <p className="text-sm opacity-80">{layer.sublabel}</p>
                </div>

                {/* Connection lines */}
                {index < layers.length - 1 && (
                  <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 z-20">
                    <motion.div
                      initial={{ scaleY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.2 + 0.3 }}
                      className="w-px h-3 bg-accent origin-top"
                    />
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.2 + 0.4 }}
                      className="w-2 h-2 rounded-full bg-accent mx-auto"
                    />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Technology Pills - Governance Detail */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="mt-8"
        >
          <div className="grid md:grid-cols-3 gap-4">
            {technologies.map((tech, index) => (
              <motion.div
                key={tech.abbr}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.9 + index * 0.1 }}
                className="group bg-base-tint hover:bg-base-shade rounded-xl p-5 border border-stroke-muted hover:border-accent transition-all cursor-default"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-white">
                      {tech.abbr}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-text-bright group-hover:text-accent transition-colors">
                      {tech.name}
                    </h4>
                  </div>
                </div>
                <p className="text-xs text-text-muted">{tech.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom Label */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.2 }}
          className="mt-8 text-center"
        >
          <p className="text-body-sm text-text-muted">
            <span className="font-semibold text-accent">Governance built in, not bolted on.</span>
            {" "}Every agent inherits trust, compliance, and observability from the foundation.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
