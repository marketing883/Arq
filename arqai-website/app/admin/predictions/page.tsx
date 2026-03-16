"use client";

/**
 * Predictive Intelligence Dashboard
 *
 * Displays ML-powered conversion predictions, risk factors,
 * and recommended actions for all leads.
 */

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import AdminHeader from "@/components/admin/AdminHeader";

interface PredictionData {
  lead_profile_id: string;
  email?: string;
  name?: string;
  company?: string;
  journey_stage: string;
  priority_tier: string;
  composite_score: number;
  conversion_probability: number;
  confidence: number;
  risk_factors: Array<{
    factor: string;
    impact: "high" | "medium" | "low";
    description: string;
  }>;
  positive_indicators: Array<{
    indicator: string;
    strength: "strong" | "moderate" | "weak";
    description: string;
  }>;
  recommended_actions: string[];
  predicted_at: string;
}

interface PredictionSummary {
  total_predictions: number;
  high_probability_count: number;
  medium_probability_count: number;
  low_probability_count: number;
  avg_probability: number;
  avg_confidence: number;
}

interface ModelInfo {
  version: string;
  trained_at: string;
  accuracy?: number;
}

const PROBABILITY_COLORS = {
  high: { bg: "bg-emerald-50", text: "text-emerald-700", bar: "bg-emerald-500" },
  medium: { bg: "bg-amber-50", text: "text-amber-700", bar: "bg-amber-500" },
  low: { bg: "bg-slate-100", text: "text-slate-600", bar: "bg-slate-400" },
};

const RISK_IMPACT_COLORS = {
  high: "text-red-600 bg-red-50",
  medium: "text-amber-600 bg-amber-50",
  low: "text-slate-500 bg-slate-100",
};

const INDICATOR_STRENGTH_COLORS = {
  strong: "text-emerald-600 bg-emerald-50",
  moderate: "text-blue-600 bg-blue-50",
  weak: "text-slate-500 bg-slate-100",
};

function getProbabilityCategory(prob: number): "high" | "medium" | "low" {
  if (prob >= 0.6) return "high";
  if (prob >= 0.3) return "medium";
  return "low";
}

export default function PredictionsPage() {
  const [predictions, setPredictions] = useState<PredictionData[]>([]);
  const [summary, setSummary] = useState<PredictionSummary | null>(null);
  const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedLead, setSelectedLead] = useState<PredictionData | null>(null);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingResult, setTrainingResult] = useState<string | null>(null);
  const router = useRouter();

  const fetchPredictions = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/predictions");

      if (response.status === 401) {
        router.push("/admin/login");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch predictions");
      }

      const data = await response.json();
      setPredictions(data.predictions || []);
      setSummary(data.summary || null);
      setModelInfo(data.model_info || null);
    } catch (err) {
      setError("Failed to load predictions");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const handleTrainModel = async () => {
    setIsTraining(true);
    setTrainingResult(null);

    try {
      const response = await fetch("/api/admin/predictions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "train" }),
      });

      const data = await response.json();

      if (!response.ok) {
        setTrainingResult(`Training failed: ${data.error || "Unknown error"}`);
      } else {
        setTrainingResult(
          `Model trained successfully! Version: ${data.model_version}, Accuracy: ${(data.accuracy * 100).toFixed(1)}%`
        );
        fetchPredictions();
      }
    } catch (err) {
      setTrainingResult("Training failed: Network error");
    } finally {
      setIsTraining(false);
    }
  };

  useEffect(() => {
    fetchPredictions();
  }, [fetchPredictions]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-500 text-xs">Loading predictions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminHeader
        title="Predictive Intelligence"
        subtitle="ML-powered conversion predictions and lead insights"
        onRefresh={fetchPredictions}
      />

      <div className="p-5">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm"
          >
            {error}
          </motion.div>
        )}

        {/* Model Info & Training */}
        <div className="mb-5 p-4 bg-white rounded border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                ML Model
              </h2>
              <p className="text-sm text-slate-900">
                {modelInfo?.version || "1.0.0-initial"}{" "}
                <span className="text-slate-400">
                  {modelInfo?.trained_at
                    ? `trained ${new Date(modelInfo.trained_at).toLocaleDateString()}`
                    : "default weights"}
                </span>
              </p>
            </div>
            <button
              onClick={handleTrainModel}
              disabled={isTraining}
              className="px-3 py-1.5 bg-slate-900 text-white text-xs font-medium rounded hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isTraining ? "Training..." : "Retrain Model"}
            </button>
          </div>
          {trainingResult && (
            <p
              className={`mt-2 text-xs ${
                trainingResult.includes("failed") ? "text-red-600" : "text-emerald-600"
              }`}
            >
              {trainingResult}
            </p>
          )}
        </div>

        {/* Summary Stats */}
        {summary && (
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 mb-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded border border-slate-200 p-4"
            >
              <p className="text-[10px] text-slate-500 font-medium uppercase">Total Leads</p>
              <p className="text-2xl font-semibold text-slate-900 mt-1">
                {summary.total_predictions}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05 }}
              className="bg-white rounded border border-emerald-200 p-4"
            >
              <p className="text-[10px] text-emerald-600 font-medium uppercase">High Probability</p>
              <p className="text-2xl font-semibold text-emerald-700 mt-1">
                {summary.high_probability_count}
              </p>
              <p className="text-[10px] text-slate-400">&gt;60% conversion</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded border border-amber-200 p-4"
            >
              <p className="text-[10px] text-amber-600 font-medium uppercase">Medium Probability</p>
              <p className="text-2xl font-semibold text-amber-700 mt-1">
                {summary.medium_probability_count}
              </p>
              <p className="text-[10px] text-slate-400">30-60% conversion</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 }}
              className="bg-white rounded border border-slate-200 p-4"
            >
              <p className="text-[10px] text-slate-500 font-medium uppercase">Low Probability</p>
              <p className="text-2xl font-semibold text-slate-600 mt-1">
                {summary.low_probability_count}
              </p>
              <p className="text-[10px] text-slate-400">&lt;30% conversion</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded border border-slate-200 p-4"
            >
              <p className="text-[10px] text-slate-500 font-medium uppercase">Avg Probability</p>
              <p className="text-2xl font-semibold text-slate-900 mt-1">
                {(summary.avg_probability * 100).toFixed(1)}%
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25 }}
              className="bg-white rounded border border-slate-200 p-4"
            >
              <p className="text-[10px] text-slate-500 font-medium uppercase">Model Confidence</p>
              <p className="text-2xl font-semibold text-slate-900 mt-1">
                {(summary.avg_confidence * 100).toFixed(0)}%
              </p>
            </motion.div>
          </div>
        )}

        {/* Predictions List */}
        {predictions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded p-10 text-center border border-slate-200"
          >
            <div className="w-12 h-12 bg-slate-100 rounded flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-slate-900 mb-1">No predictions yet</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Predictions will appear as leads interact with your site and build up engagement data.
            </p>
          </motion.div>
        ) : (
          <div className="bg-white rounded border border-slate-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                    Lead
                  </th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                    Stage
                  </th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                    Conversion Prob.
                  </th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                    Confidence
                  </th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                    Signals
                  </th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <AnimatePresence>
                  {predictions.map((pred, idx) => {
                    const probCategory = getProbabilityCategory(pred.conversion_probability);
                    const colors = PROBABILITY_COLORS[probCategory];

                    return (
                      <motion.tr
                        key={pred.lead_profile_id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: idx * 0.02 }}
                        className="hover:bg-slate-50 cursor-pointer"
                        onClick={() => setSelectedLead(pred)}
                      >
                        <td className="px-4 py-3">
                          <p className="text-sm font-medium text-slate-900 truncate max-w-[200px]">
                            {pred.email || `Session: ${pred.lead_profile_id.slice(0, 8)}...`}
                          </p>
                          {pred.company && (
                            <p className="text-[10px] text-slate-500">{pred.company}</p>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 text-[10px] font-medium bg-slate-100 text-slate-600 rounded capitalize">
                            {pred.journey_stage}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm font-semibold text-slate-900">
                            {pred.composite_score}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-slate-100 rounded overflow-hidden">
                              <div
                                className={`h-full ${colors.bar} transition-all`}
                                style={{ width: `${pred.conversion_probability * 100}%` }}
                              />
                            </div>
                            <span className={`text-xs font-semibold ${colors.text}`}>
                              {(pred.conversion_probability * 100).toFixed(0)}%
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs text-slate-500">
                            {(pred.confidence * 100).toFixed(0)}%
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            {pred.risk_factors.length > 0 && (
                              <span className="px-1.5 py-0.5 text-[9px] font-medium bg-red-50 text-red-600 rounded">
                                {pred.risk_factors.length} risk
                              </span>
                            )}
                            {pred.positive_indicators.length > 0 && (
                              <span className="px-1.5 py-0.5 text-[9px] font-medium bg-emerald-50 text-emerald-600 rounded">
                                {pred.positive_indicators.length} positive
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-[10px] text-slate-500 truncate max-w-[150px] block">
                            {pred.recommended_actions[0] || "-"}
                          </span>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}

        {/* Lead Detail Modal */}
        <AnimatePresence>
          {selectedLead && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
              onClick={() => setSelectedLead(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white rounded shadow-xl max-w-2xl w-full max-h-[85vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="p-5 bg-slate-900 text-white">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-white">
                        {selectedLead.name || selectedLead.email || "Anonymous Lead"}
                      </h2>
                      {selectedLead.company && (
                        <p className="text-slate-400 text-sm">{selectedLead.company}</p>
                      )}
                    </div>
                    <button
                      onClick={() => setSelectedLead(null)}
                      className="p-1.5 hover:bg-white/10 rounded transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Conversion Probability */}
                  <div className="mt-4 p-3 bg-white/10 rounded">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-300 text-xs">Conversion Probability</span>
                      <span className="text-white font-semibold">
                        {(selectedLead.conversion_probability * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-white/20 rounded overflow-hidden">
                      <div
                        className={`h-full ${PROBABILITY_COLORS[getProbabilityCategory(selectedLead.conversion_probability)].bar}`}
                        style={{ width: `${selectedLead.conversion_probability * 100}%` }}
                      />
                    </div>
                    <p className="text-slate-400 text-[10px] mt-1">
                      Model confidence: {(selectedLead.confidence * 100).toFixed(0)}%
                    </p>
                  </div>
                </div>

                {/* Modal Body */}
                <div className="p-5 overflow-y-auto max-h-[50vh] space-y-5">
                  {/* Risk Factors */}
                  {selectedLead.risk_factors.length > 0 && (
                    <div>
                      <h3 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                        Risk Factors
                      </h3>
                      <div className="space-y-2">
                        {selectedLead.risk_factors.map((risk, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-3 p-2 bg-slate-50 rounded"
                          >
                            <span
                              className={`px-1.5 py-0.5 text-[9px] font-semibold rounded ${RISK_IMPACT_COLORS[risk.impact]}`}
                            >
                              {risk.impact.toUpperCase()}
                            </span>
                            <div>
                              <p className="text-xs font-medium text-slate-900">
                                {risk.factor.replace(/_/g, " ")}
                              </p>
                              <p className="text-[10px] text-slate-500">{risk.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Positive Indicators */}
                  {selectedLead.positive_indicators.length > 0 && (
                    <div>
                      <h3 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                        Positive Indicators
                      </h3>
                      <div className="space-y-2">
                        {selectedLead.positive_indicators.map((indicator, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-3 p-2 bg-slate-50 rounded"
                          >
                            <span
                              className={`px-1.5 py-0.5 text-[9px] font-semibold rounded ${INDICATOR_STRENGTH_COLORS[indicator.strength]}`}
                            >
                              {indicator.strength.toUpperCase()}
                            </span>
                            <div>
                              <p className="text-xs font-medium text-slate-900">
                                {indicator.indicator.replace(/_/g, " ")}
                              </p>
                              <p className="text-[10px] text-slate-500">{indicator.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommended Actions */}
                  <div>
                    <h3 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      Recommended Actions
                    </h3>
                    <div className="space-y-1.5">
                      {selectedLead.recommended_actions.map((action, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 p-2 bg-slate-100 rounded"
                        >
                          <span className="w-5 h-5 bg-slate-900 text-white text-[10px] font-semibold rounded flex items-center justify-center flex-shrink-0">
                            {idx + 1}
                          </span>
                          <p className="text-xs text-slate-700">{action}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="pt-3 border-t border-slate-200 flex gap-2">
                    {selectedLead.email && (
                      <a
                        href={`mailto:${selectedLead.email}?subject=Following up on your ArqAI inquiry`}
                        className="flex-1 px-3 py-2 bg-slate-900 text-white text-xs font-medium rounded text-center hover:bg-slate-800 transition-colors"
                      >
                        Send Email
                      </a>
                    )}
                    <button
                      onClick={() => {
                        setSelectedLead(null);
                        router.push(`/admin/leads-v2?id=${selectedLead.lead_profile_id}`);
                      }}
                      className="flex-1 px-3 py-2 bg-slate-100 text-slate-700 text-xs font-medium rounded text-center hover:bg-slate-200 transition-colors"
                    >
                      View Full Profile
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
