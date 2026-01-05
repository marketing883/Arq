"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface ROIInputs {
  aiAgents: number;
  avgSalary: number;
  complianceRisk: "low" | "medium" | "high";
  manualAuditHours: number;
}

const riskMultipliers = {
  low: 0.5,
  medium: 1,
  high: 2,
};

const riskLabels = {
  low: "Low (General enterprise)",
  medium: "Medium (Some regulated data)",
  high: "High (Healthcare, Finance)",
};

export function ROICalculatorBlock() {
  const [inputs, setInputs] = useState<ROIInputs>({
    aiAgents: 10,
    avgSalary: 120000,
    complianceRisk: "medium",
    manualAuditHours: 20,
  });

  // Calculate ROI metrics
  const hourlyRate = inputs.avgSalary / 2080;
  const riskMultiplier = riskMultipliers[inputs.complianceRisk];

  // Time savings from automated compliance
  const automatedComplianceHours = inputs.manualAuditHours * 0.7; // 70% reduction
  const monthlyTimeSavings = automatedComplianceHours * inputs.aiAgents;
  const annualTimeSavings = monthlyTimeSavings * 12;
  const annualCostSavings = annualTimeSavings * hourlyRate;

  // Risk mitigation value (compliance violations avoided)
  const avgViolationCost = 500000; // Average cost of a compliance violation
  const violationProbability = 0.15 * riskMultiplier; // Base 15% annual probability
  const riskMitigationValue = avgViolationCost * violationProbability;

  // Productivity gains from AI workforce visibility
  const productivityGain = inputs.aiAgents * 5000; // $5k per agent per year from better management

  // Total annual value
  const totalAnnualValue = annualCostSavings + riskMitigationValue + productivityGain;

  return (
    <div className="space-y-8">
      <p className="text-gray-600 dark:text-gray-400 text-center max-w-2xl mx-auto">
        Estimate the potential return on investment from implementing ArqAI&apos;s
        enterprise AI governance platform.
      </p>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
            Your AI Footprint
          </h3>

          {/* Number of AI Agents */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Number of AI Agents / Workflows
            </label>
            <input
              type="range"
              min="5"
              max="100"
              value={inputs.aiAgents}
              onChange={(e) =>
                setInputs({ ...inputs, aiAgents: Number(e.target.value) })
              }
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#0432a5] dark:accent-[#d0f438]"
            />
            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>5</span>
              <span className="font-semibold text-[#0432a5] dark:text-[#d0f438]">
                {inputs.aiAgents} agents
              </span>
              <span>100</span>
            </div>
          </div>

          {/* Average Salary */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Average Team Member Salary (USD)
            </label>
            <input
              type="range"
              min="60000"
              max="250000"
              step="10000"
              value={inputs.avgSalary}
              onChange={(e) =>
                setInputs({ ...inputs, avgSalary: Number(e.target.value) })
              }
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#0432a5] dark:accent-[#d0f438]"
            />
            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>$60k</span>
              <span className="font-semibold text-[#0432a5] dark:text-[#d0f438]">
                ${(inputs.avgSalary / 1000).toFixed(0)}k
              </span>
              <span>$250k</span>
            </div>
          </div>

          {/* Compliance Risk Level */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Compliance Risk Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(riskLabels) as Array<keyof typeof riskLabels>).map(
                (level) => (
                  <button
                    key={level}
                    onClick={() => setInputs({ ...inputs, complianceRisk: level })}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      inputs.complianceRisk === level
                        ? "bg-[#0432a5] text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                )
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {riskLabels[inputs.complianceRisk]}
            </p>
          </div>

          {/* Manual Audit Hours */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Monthly Hours Spent on AI Auditing (per agent)
            </label>
            <input
              type="range"
              min="5"
              max="40"
              value={inputs.manualAuditHours}
              onChange={(e) =>
                setInputs({ ...inputs, manualAuditHours: Number(e.target.value) })
              }
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#0432a5] dark:accent-[#d0f438]"
            />
            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>5 hrs</span>
              <span className="font-semibold text-[#0432a5] dark:text-[#d0f438]">
                {inputs.manualAuditHours} hrs
              </span>
              <span>40 hrs</span>
            </div>
          </div>
        </motion.div>

        {/* Results Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
            Estimated Annual Value
          </h3>

          {/* ROI Cards */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="p-4 rounded-xl bg-[#d0f438]/10 border border-[#d0f438]/30"
            >
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Time Savings (70% audit automation)
                </span>
                <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  ${annualCostSavings.toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {annualTimeSavings.toLocaleString()} hours saved annually
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="p-4 rounded-xl bg-[#0432a5]/10 border border-[#0432a5]/30"
            >
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Risk Mitigation Value
                </span>
                <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  ${riskMitigationValue.toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Reduced compliance violation probability
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Productivity Gains
                </span>
                <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  ${productivityGain.toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Better agent management and observability
              </p>
            </motion.div>
          </div>

          {/* Total Value */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="p-6 rounded-xl bg-gray-900 dark:bg-gray-800 text-white"
          >
            <div className="flex justify-between items-center mb-4">
              <span className="text-white/80">Total Annual Value</span>
              <span className="text-3xl font-bold text-[#d0f438]">
                ${totalAnnualValue.toLocaleString()}
              </span>
            </div>
            <div className="pt-4 border-t border-white/20">
              <p className="text-sm text-white/60">
                * This is an estimate based on industry averages. Contact us for
                a detailed ROI analysis tailored to your organization.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="text-center pt-4"
      >
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Want a personalized ROI analysis for your organization?
        </p>
        <a
          href="/demo"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#0432a5] text-white rounded-lg font-semibold hover:opacity-90 transition-colors"
        >
          Get Your Custom Analysis
        </a>
      </motion.div>
    </div>
  );
}
