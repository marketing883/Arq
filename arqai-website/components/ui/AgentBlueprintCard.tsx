"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Blueprint } from "@/lib/data/blueprints";

const statusConfig = {
  available: {
    label: "Available",
    className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  },
  blueprint: {
    label: "Blueprint Ready",
    className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  pilot: {
    label: "Pilot",
    className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
  roadmap: {
    label: "Coming Soon",
    className: "bg-gray-100 text-gray-600 dark:bg-gray-800/50 dark:text-gray-400",
  },
};

interface AgentBlueprintCardProps {
  blueprint: Blueprint;
  variant?: "default" | "compact";
  index?: number;
}

export function AgentBlueprintCard({
  blueprint,
  variant = "default",
  index = 0,
}: AgentBlueprintCardProps) {
  const status = statusConfig[blueprint.status];

  if (variant === "compact") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1 }}
        className="group card relative hover:border-accent transition-all"
      >
        <div className="flex items-start justify-between mb-3">
          <div>
            <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full mb-2 ${status.className}`}>
              {status.label}
            </span>
            <h4 className="text-lg font-display font-semibold text-text-bright group-hover:text-accent transition-colors">
              {blueprint.name}
            </h4>
          </div>
          <svg
            className="w-4 h-4 text-text-muted group-hover:text-accent transition-colors shrink-0 mt-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 17L17 7M17 7H7M17 7v10"
            />
          </svg>
        </div>
        <p className="text-body-xs text-text-muted mb-3 line-clamp-2">
          {blueprint.headline}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {blueprint.metrics.slice(0, 2).map((metric, i) => (
            <span
              key={i}
              className="px-2 py-0.5 rounded-full bg-accent/10 text-[10px] font-medium text-accent"
            >
              {metric.value} {metric.label}
            </span>
          ))}
        </div>
        {blueprint.link && (
          <Link href={blueprint.link} className="absolute inset-0">
            <span className="sr-only">Learn more about {blueprint.name}</span>
          </Link>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group card relative hover:border-accent transition-all hover:shadow-lg hover:shadow-accent/5"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full mb-2 ${status.className}`}>
            {status.label}
          </span>
          <p className="text-body-xs text-text-muted uppercase tracking-wider">
            {blueprint.category}
          </p>
        </div>
        <svg
          className="w-5 h-5 text-text-muted group-hover:text-accent transition-colors"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 17L17 7M17 7H7M17 7v10"
          />
        </svg>
      </div>

      {/* Title & Description */}
      <h3 className="text-xl font-display font-semibold text-text-bright mb-2 group-hover:text-accent transition-colors">
        {blueprint.name}
      </h3>
      <p className="text-body-sm text-text-muted mb-4 line-clamp-2">
        {blueprint.headline}
      </p>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {blueprint.metrics.map((metric, i) => (
          <div key={i} className="text-center p-2 bg-base-tint rounded-lg">
            <div className="text-lg font-bold text-accent">{metric.value}</div>
            <div className="text-[10px] text-text-muted uppercase">{metric.label}</div>
          </div>
        ))}
      </div>

      {/* Features */}
      <div className="flex flex-wrap gap-1.5">
        {blueprint.features.slice(0, 3).map((feature, i) => (
          <span
            key={i}
            className="px-2 py-0.5 rounded-full bg-stroke-muted/50 text-[10px] text-text-medium"
          >
            {feature}
          </span>
        ))}
      </div>

      {/* Target Buyers */}
      <div className="mt-4 pt-4 border-t border-stroke-muted">
        <p className="text-[10px] text-text-muted">
          <span className="font-medium">For:</span> {blueprint.targetBuyers.join(", ")}
        </p>
      </div>

      {blueprint.link && (
        <Link href={blueprint.link} className="absolute inset-0">
          <span className="sr-only">Learn more about {blueprint.name}</span>
        </Link>
      )}
    </motion.div>
  );
}
