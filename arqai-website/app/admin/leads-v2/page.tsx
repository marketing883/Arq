"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import AdminHeader from "@/components/admin/AdminHeader";
import type { JourneyStage } from "@/types/lead-intelligence-v2";
import {
  JOURNEY_STAGES,
  STAGE_LABELS,
  STAGE_COLORS,
  PRIORITY_COLORS,
  PRIORITY_ACTIONS,
  PIPELINE_STATUS_LABELS,
  PIPELINE_STATUSES,
  getTimeAgo,
} from "@/components/admin/leads/leadUi";

interface LeadRow {
  id: string;
  canonical_email?: string;
  company?: string;
  journey_stage: JourneyStage;
  priority_tier: string;
  composite_score: number;
  intent_score: number;
  engagement_score: number;
  icp_fit_score: number;
  total_touchpoints: number;
  last_touch: string;
  pipeline_status?: string;
  last_contacted_at?: string;
  next_step?: string;
}

interface V2Stats {
  total_profiles: number;
  by_journey_stage: Record<JourneyStage, number>;
  by_priority_tier: Record<string, number>;
  avg_composite_score: number;
  high_intent_count: number;
}

export default function LeadsV2Page() {
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [stats, setStats] = useState<V2Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [needsAction, setNeedsAction] = useState(false);
  const [pipelineStatus, setPipelineStatus] = useState<string>("");
  const [filters, setFilters] = useState<{
    journey_stage?: JourneyStage;
    priority_tier?: string;
    min_score?: number;
  }>({});
  const router = useRouter();

  const fetchData = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filters.journey_stage) params.append("journey_stage", filters.journey_stage);
      if (filters.priority_tier) params.append("priority_tier", filters.priority_tier);
      if (filters.min_score) params.append("min_score", filters.min_score.toString());

      const response = await fetch(`/api/admin/leads-v2?${params.toString()}`);
      if (response.status === 401) {
        router.push("/admin/login");
        return;
      }
      if (!response.ok) throw new Error("Failed to fetch data");

      const data = await response.json();
      setLeads(data.leads || []);
      setStats(data.stats || null);
    } catch (err) {
      setError("Failed to load lead intelligence data");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [filters, router]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  // "Needs action": a hot lead (P1/P2) that has never been contacted, or whose
  // pipeline is still new/researching. Combined with the pipeline_status filter.
  const visibleLeads = useMemo(() => {
    return leads.filter((lead) => {
      if (pipelineStatus && (lead.pipeline_status || "new") !== pipelineStatus) {
        return false;
      }
      if (needsAction) {
        const hot = lead.priority_tier === "P1" || lead.priority_tier === "P2";
        const uncontacted = !lead.last_contacted_at;
        const earlyStage =
          !lead.pipeline_status ||
          lead.pipeline_status === "new" ||
          lead.pipeline_status === "researching";
        if (!(hot && uncontacted && earlyStage)) return false;
      }
      return true;
    });
  }, [leads, needsAction, pipelineStatus]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-500 text-xs">Loading Intelligence...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminHeader
        title="Lead Intelligence"
        subtitle="Journey tracking, decay scoring, and the research agent command center"
        onRefresh={fetchData}
        showExport={true}
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

        {/* Journey Stage Pipeline */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 p-4 bg-white rounded-md border border-slate-200"
          >
            <h2 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Lead Journey Pipeline
            </h2>
            <div className="flex items-center gap-2">
              {JOURNEY_STAGES.map((stage, idx) => {
                const count = stats.by_journey_stage?.[stage] || 0;
                const colors = STAGE_COLORS[stage];
                const isLast = idx === JOURNEY_STAGES.length - 1;
                return (
                  <div key={stage} className="flex items-center flex-1">
                    <button
                      onClick={() =>
                        setFilters((f) =>
                          f.journey_stage === stage
                            ? { ...f, journey_stage: undefined }
                            : { ...f, journey_stage: stage }
                        )
                      }
                      className={`flex-1 p-3 rounded transition-all ${
                        filters.journey_stage === stage
                          ? `${colors.bg} ring-2 ring-offset-1 ring-slate-400`
                          : `${colors.bg} hover:ring-1 hover:ring-slate-300`
                      }`}
                    >
                      <p className={`text-2xl font-semibold ${colors.text}`}>{count}</p>
                      <p className="text-[10px] text-slate-500 font-medium">{STAGE_LABELS[stage]}</p>
                    </button>
                    {!isLast && (
                      <svg className="w-4 h-4 text-slate-300 mx-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-5">
          <button
            onClick={() => setNeedsAction((v) => !v)}
            className={`px-3 py-2 rounded border text-xs font-medium transition-colors ${
              needsAction
                ? "bg-red-600 text-white border-red-600"
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
            }`}
          >
            Needs action
          </button>

          <select
            value={pipelineStatus}
            onChange={(e) => setPipelineStatus(e.target.value)}
            className="px-3 py-2 bg-white rounded border border-slate-200 text-xs font-medium text-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-400"
          >
            <option value="">All Statuses</option>
            {PIPELINE_STATUSES.map((s) => (
              <option key={s} value={s}>
                {PIPELINE_STATUS_LABELS[s]}
              </option>
            ))}
          </select>

          <select
            value={filters.priority_tier || ""}
            onChange={(e) => setFilters({ ...filters, priority_tier: e.target.value || undefined })}
            className="px-3 py-2 bg-white rounded border border-slate-200 text-xs font-medium text-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-400"
          >
            <option value="">All Priorities</option>
            <option value="P1">P1 - Critical</option>
            <option value="P2">P2 - High</option>
            <option value="P3">P3 - Medium</option>
            <option value="P4">P4 - Low</option>
          </select>

          <select
            value={filters.min_score?.toString() || ""}
            onChange={(e) =>
              setFilters({
                ...filters,
                min_score: e.target.value ? parseInt(e.target.value, 10) : undefined,
              })
            }
            className="px-3 py-2 bg-white rounded border border-slate-200 text-xs font-medium text-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-400"
          >
            <option value="">Any Score</option>
            <option value="20">Score &gt;= 20</option>
            <option value="40">Score &gt;= 40</option>
            <option value="60">Score &gt;= 60</option>
            <option value="80">Score &gt;= 80</option>
          </select>

          {(filters.journey_stage ||
            filters.priority_tier ||
            filters.min_score ||
            pipelineStatus ||
            needsAction) && (
            <button
              onClick={() => {
                setFilters({});
                setPipelineStatus("");
                setNeedsAction(false);
              }}
              className="px-3 py-2 text-xs font-medium text-slate-400 hover:text-slate-600 transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Leads Grid */}
        {visibleLeads.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-md p-10 text-center border border-slate-200"
          >
            <div className="w-12 h-12 bg-slate-100 rounded-md flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-slate-900 mb-1">No matching leads</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Lead profiles are created as visitors interact across chat, forms, and resources.
            </p>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
            <AnimatePresence>
              {visibleLeads.map((lead, idx) => {
                const priorityColor = PRIORITY_COLORS[lead.priority_tier] || PRIORITY_COLORS.P4;
                const stageColor = STAGE_COLORS[lead.journey_stage];
                return (
                  <motion.div
                    key={lead.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: idx * 0.03 }}
                    onClick={() => router.push(`/admin/leads-v2/${lead.id}`)}
                    className={`bg-white rounded-md p-4 border ${priorityColor.border} hover:shadow-sm cursor-pointer transition-all`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2 py-0.5 ${priorityColor.bg} rounded text-[10px] font-semibold ${priorityColor.text}`}>
                          {lead.priority_tier}
                        </span>
                        <span className={`px-2 py-0.5 ${stageColor.bg} rounded text-[10px] font-medium ${stageColor.text}`}>
                          {STAGE_LABELS[lead.journey_stage]}
                        </span>
                        {lead.pipeline_status && lead.pipeline_status !== "new" && (
                          <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-medium text-slate-600">
                            {PIPELINE_STATUS_LABELS[lead.pipeline_status] || lead.pipeline_status}
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-slate-900">{lead.composite_score}</div>
                        <div className="text-[10px] text-slate-400">Score</div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <h3 className="text-sm font-medium text-slate-900 truncate">
                        {lead.canonical_email || `Session: ${lead.id?.slice(0, 8) || "unknown"}...`}
                      </h3>
                      {lead.company && <p className="text-xs text-slate-500">{lead.company}</p>}
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <div className="text-center p-2 bg-slate-50 rounded">
                        <p className="text-sm font-semibold text-slate-700">{lead.intent_score}</p>
                        <p className="text-[9px] text-slate-400">Intent</p>
                      </div>
                      <div className="text-center p-2 bg-slate-50 rounded">
                        <p className="text-sm font-semibold text-slate-700">{lead.engagement_score}</p>
                        <p className="text-[9px] text-slate-400">Engage</p>
                      </div>
                      <div className="text-center p-2 bg-slate-50 rounded">
                        <p className="text-sm font-semibold text-slate-700">{lead.icp_fit_score}</p>
                        <p className="text-[9px] text-slate-400">ICP Fit</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <span className="text-[10px] text-slate-500">
                        {lead.total_touchpoints} touchpoint{lead.total_touchpoints !== 1 ? "s" : ""}
                      </span>
                      <span className="text-[10px] text-slate-400">{getTimeAgo(lead.last_touch)}</span>
                    </div>

                    <div className="mt-2 p-2 bg-slate-50 rounded">
                      <p className="text-[10px] text-slate-500 truncate">
                        <span className="font-medium">Action:</span>{" "}
                        {lead.next_step || PRIORITY_ACTIONS[lead.priority_tier]}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
