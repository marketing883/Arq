"use client";

/**
 * Lead Intelligence V2: triage-first list.
 *
 * Built around the questions a marketing lead asks every morning:
 *   1. Who came in that I haven't acted on? (Hot and uncontacted tile)
 *   2. What did I promise to do and is it overdue? (Overdue tile)
 *   3. Who is new this week? (New tile)
 *   4. Is the automation actually working? (Research health chip)
 * Every tile is a one-click filter; every row says WHY the lead matters in
 * plain language and lets you act inline (open, email, mark contacted).
 */

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import AdminHeader from "@/components/admin/AdminHeader";
import type { JourneyStage } from "@/types/lead-intelligence-v2";
import {
  JOURNEY_STAGES,
  STAGE_LABELS,
  STAGE_COLORS,
  PRIORITY_COLORS,
  PIPELINE_STATUS_LABELS,
  PIPELINE_STATUSES,
  getTimeAgo,
  whyLine,
  isOverdue,
} from "@/components/admin/leads/leadUi";

interface LeadRow {
  id: string;
  canonical_email?: string;
  name?: string;
  company?: string;
  journey_stage: JourneyStage;
  priority_tier: string;
  composite_score: number;
  intent_score: number;
  engagement_score: number;
  icp_fit_score: number;
  total_touchpoints: number;
  last_touch: string;
  first_touch?: string;
  recommended_action?: string;
  pipeline_status?: string;
  last_contacted_at?: string;
  next_step?: string;
  next_step_due_at?: string;
  top_signals?: string[];
}

interface V2Stats {
  total_profiles: number;
  by_journey_stage: Record<JourneyStage, number>;
  by_priority_tier: Record<string, number>;
  avg_composite_score: number;
  high_intent_count: number;
}

interface ResearchHealth {
  queued: number;
  running: number;
  failed_7d: number;
  completed_7d: number;
}

type TriageView = "all" | "hot" | "new" | "overdue";

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

function isHotUncontacted(lead: LeadRow): boolean {
  const hot = lead.priority_tier === "P1" || lead.priority_tier === "P2";
  const uncontacted = !lead.last_contacted_at;
  const openStatus =
    !lead.pipeline_status ||
    ["new", "researching", "contacted"].includes(lead.pipeline_status);
  return hot && uncontacted && openStatus;
}

function isNewThisWeek(lead: LeadRow): boolean {
  const start = lead.first_touch || lead.last_touch;
  return !!start && Date.now() - new Date(start).getTime() < WEEK_MS;
}

function hasOverdueFollowUp(lead: LeadRow): boolean {
  return !!lead.next_step && isOverdue(lead.next_step_due_at);
}

export default function LeadsV2Page() {
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [stats, setStats] = useState<V2Stats | null>(null);
  const [research, setResearch] = useState<ResearchHealth | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [view, setView] = useState<TriageView>("all");
  const [search, setSearch] = useState("");
  const [pipelineStatus, setPipelineStatus] = useState<string>("");
  const [stageFilter, setStageFilter] = useState<JourneyStage | undefined>();
  const [tierFilter, setTierFilter] = useState<string>("");
  const [busyLead, setBusyLead] = useState<string>("");
  const router = useRouter();

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(`/api/admin/leads-v2`);
      if (response.status === 401) {
        router.push("/admin/login");
        return;
      }
      if (!response.ok) throw new Error("Failed to fetch data");
      const data = await response.json();
      setLeads(data.leads || []);
      setStats(data.stats || null);
      setResearch(data.research || null);
      setError("");
    } catch (err) {
      setError("Failed to load lead intelligence data");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  // Tile counts always reflect the full dataset, not the current filter.
  const counts = useMemo(
    () => ({
      all: leads.length,
      hot: leads.filter(isHotUncontacted).length,
      new: leads.filter(isNewThisWeek).length,
      overdue: leads.filter(hasOverdueFollowUp).length,
    }),
    [leads]
  );

  const visibleLeads = useMemo(() => {
    const q = search.trim().toLowerCase();
    return leads.filter((lead) => {
      if (view === "hot" && !isHotUncontacted(lead)) return false;
      if (view === "new" && !isNewThisWeek(lead)) return false;
      if (view === "overdue" && !hasOverdueFollowUp(lead)) return false;
      if (stageFilter && lead.journey_stage !== stageFilter) return false;
      if (tierFilter && lead.priority_tier !== tierFilter) return false;
      if (pipelineStatus && (lead.pipeline_status || "new") !== pipelineStatus) return false;
      if (q) {
        const haystack = [lead.name, lead.canonical_email, lead.company]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [leads, view, search, stageFilter, tierFilter, pipelineStatus]);

  const quickMarkContacted = async (lead: LeadRow, e: React.MouseEvent) => {
    e.stopPropagation();
    setBusyLead(lead.id);
    try {
      await fetch("/api/admin/leads-v2", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "mark_contacted",
          profile_id: lead.id,
          channel: "email",
        }),
      });
      await fetchData();
    } finally {
      setBusyLead("");
    }
  };

  const openEmail = (lead: LeadRow, e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/admin/leads-v2/${lead.id}?compose=1`);
  };

  const hasSecondaryFilters = !!(stageFilter || tierFilter || pipelineStatus || search);

  const tiles: Array<{
    key: TriageView;
    label: string;
    sub: string;
    count: number;
    accent: string;
    activeRing: string;
  }> = [
    {
      key: "hot",
      label: "Hot, not contacted",
      sub: "P1/P2 waiting on you",
      count: counts.hot,
      accent: "text-red-600",
      activeRing: "ring-red-400",
    },
    {
      key: "new",
      label: "New this week",
      sub: "First seen in the last 7 days",
      count: counts.new,
      accent: "text-blue-600",
      activeRing: "ring-blue-400",
    },
    {
      key: "overdue",
      label: "Overdue follow-ups",
      sub: "Next step past its date",
      count: counts.overdue,
      accent: "text-amber-600",
      activeRing: "ring-amber-400",
    },
    {
      key: "all",
      label: "All leads",
      sub: "Everything tracked",
      count: counts.all,
      accent: "text-slate-700",
      activeRing: "ring-slate-400",
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-500 text-xs">Loading leads...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminHeader
        title="Leads"
        subtitle="Who to act on, why they matter, and what happens next"
        onRefresh={fetchData}
        showExport={true}
      />

      <div className="p-5">
        {error && (
          <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Triage tiles: each one is a filter */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          {tiles.map((tile) => (
            <button
              key={tile.key}
              onClick={() => setView(view === tile.key ? "all" : tile.key)}
              className={`p-4 bg-white rounded-md border border-slate-200 text-left transition-all hover:shadow-sm ${
                view === tile.key ? `ring-2 ring-offset-1 ${tile.activeRing}` : ""
              }`}
            >
              <p className={`text-2xl font-semibold ${tile.accent}`}>{tile.count}</p>
              <p className="text-xs font-medium text-slate-900 mt-0.5">{tile.label}</p>
              <p className="text-[10px] text-slate-400">{tile.sub}</p>
            </button>
          ))}
        </div>

        {/* Research agent health: is the automation keeping up? */}
        {research && (
          <div className="flex items-center gap-2 mb-4 text-[11px]">
            <span className="text-slate-400 uppercase tracking-wider font-semibold text-[10px]">
              Research agent
            </span>
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded font-medium">
              {research.completed_7d} completed (7d)
            </span>
            {(research.queued > 0 || research.running > 0) && (
              <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded font-medium">
                {research.queued + research.running} in progress
              </span>
            )}
            {research.failed_7d > 0 && (
              <span className="px-2 py-0.5 bg-red-50 text-red-700 rounded font-medium">
                {research.failed_7d} failed - check a lead&apos;s Research Runs panel
              </span>
            )}
          </div>
        )}

        {/* Journey stage pipeline (kept: the funnel view) */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 bg-white rounded-md border border-slate-200"
          >
            <h2 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Journey pipeline
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
                        setStageFilter(stageFilter === stage ? undefined : stage)
                      }
                      className={`flex-1 p-2.5 rounded transition-all ${colors.bg} ${
                        stageFilter === stage
                          ? "ring-2 ring-offset-1 ring-slate-400"
                          : "hover:ring-1 hover:ring-slate-300"
                      }`}
                    >
                      <p className={`text-xl font-semibold ${colors.text}`}>{count}</p>
                      <p className="text-[10px] text-slate-500 font-medium">
                        {STAGE_LABELS[stage]}
                      </p>
                    </button>
                    {!isLast && (
                      <svg
                        className="w-4 h-4 text-slate-300 mx-1 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Search + secondary filters */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <div className="relative">
            <svg
              className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, company..."
              className="pl-8 pr-3 py-2 w-64 bg-white rounded border border-slate-200 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
            />
          </div>

          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="px-3 py-2 bg-white rounded border border-slate-200 text-xs font-medium text-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-400"
          >
            <option value="">All priorities</option>
            <option value="P1">P1 - Critical</option>
            <option value="P2">P2 - High</option>
            <option value="P3">P3 - Medium</option>
            <option value="P4">P4 - Low</option>
          </select>

          <select
            value={pipelineStatus}
            onChange={(e) => setPipelineStatus(e.target.value)}
            className="px-3 py-2 bg-white rounded border border-slate-200 text-xs font-medium text-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-400"
          >
            <option value="">All statuses</option>
            {PIPELINE_STATUSES.map((s) => (
              <option key={s} value={s}>
                {PIPELINE_STATUS_LABELS[s]}
              </option>
            ))}
          </select>

          {(hasSecondaryFilters || view !== "all") && (
            <button
              onClick={() => {
                setView("all");
                setSearch("");
                setStageFilter(undefined);
                setTierFilter("");
                setPipelineStatus("");
              }}
              className="px-3 py-2 text-xs font-medium text-slate-400 hover:text-slate-600 transition-colors"
            >
              Clear all
            </button>
          )}

          <span className="ml-auto text-[11px] text-slate-400">
            {visibleLeads.length} of {leads.length} leads
          </span>
        </div>

        {/* Leads table */}
        {visibleLeads.length === 0 ? (
          <div className="bg-white rounded-md p-10 text-center border border-slate-200">
            <h3 className="text-sm font-medium text-slate-900 mb-1">
              {view === "hot"
                ? "No hot leads waiting - inbox zero"
                : view === "overdue"
                  ? "No overdue follow-ups"
                  : "No matching leads"}
            </h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Lead profiles are created automatically as visitors engage through
              chat, forms, and resources.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-md border border-slate-200 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="px-4 py-2.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Lead
                  </th>
                  <th className="px-4 py-2.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Why they matter
                  </th>
                  <th className="px-4 py-2.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Stage
                  </th>
                  <th className="px-4 py-2.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider text-right">
                    Score
                  </th>
                  <th className="px-4 py-2.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Last activity
                  </th>
                  <th className="px-4 py-2.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Next step
                  </th>
                  <th className="px-4 py-2.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider text-right">
                    Act
                  </th>
                </tr>
              </thead>
              <tbody>
                {visibleLeads.map((lead) => {
                  const priorityColor =
                    PRIORITY_COLORS[lead.priority_tier] || PRIORITY_COLORS.P4;
                  const stageColor = STAGE_COLORS[lead.journey_stage];
                  const overdue = hasOverdueFollowUp(lead);
                  const display =
                    lead.name ||
                    lead.canonical_email ||
                    `Anonymous ${lead.id.slice(0, 6)}`;
                  return (
                    <tr
                      key={lead.id}
                      onClick={() => router.push(`/admin/leads-v2/${lead.id}`)}
                      className="border-b border-slate-50 last:border-0 hover:bg-slate-50/70 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3 max-w-[220px]">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-1.5 py-0.5 ${priorityColor.bg} rounded text-[10px] font-semibold ${priorityColor.text} flex-shrink-0`}
                          >
                            {lead.priority_tier}
                          </span>
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-slate-900 truncate">
                              {display}
                            </p>
                            <p className="text-[10px] text-slate-400 truncate">
                              {[
                                lead.name ? lead.canonical_email : null,
                                lead.company,
                              ]
                                .filter(Boolean)
                                .join(" · ") || " "}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 max-w-[260px]">
                        <p className="text-xs text-slate-700 truncate">
                          {whyLine(lead.top_signals, lead.recommended_action)}
                        </p>
                        {!lead.last_contacted_at &&
                          (lead.priority_tier === "P1" ||
                            lead.priority_tier === "P2") && (
                            <p className="text-[10px] text-red-500 font-medium">
                              Never contacted
                            </p>
                          )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 ${stageColor.bg} rounded text-[10px] font-medium ${stageColor.text}`}
                        >
                          {STAGE_LABELS[lead.journey_stage]}
                        </span>
                        {lead.pipeline_status && lead.pipeline_status !== "new" && (
                          <span className="ml-1 px-2 py-0.5 bg-slate-100 rounded text-[10px] font-medium text-slate-600">
                            {PIPELINE_STATUS_LABELS[lead.pipeline_status] ||
                              lead.pipeline_status}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-sm font-semibold text-slate-900">
                          {lead.composite_score}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[11px] text-slate-500">
                          {getTimeAgo(lead.last_touch)}
                        </span>
                      </td>
                      <td className="px-4 py-3 max-w-[180px]">
                        {lead.next_step ? (
                          <p
                            className={`text-[11px] truncate ${
                              overdue
                                ? "text-red-600 font-medium"
                                : "text-slate-600"
                            }`}
                          >
                            {overdue ? "Overdue: " : ""}
                            {lead.next_step}
                          </p>
                        ) : (
                          <span className="text-[11px] text-slate-300">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          {lead.canonical_email && (
                            <button
                              onClick={(e) => openEmail(lead, e)}
                              title="Write email"
                              className="p-1.5 rounded hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors"
                            >
                              <svg
                                className="w-3.5 h-3.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                />
                              </svg>
                            </button>
                          )}
                          {!lead.last_contacted_at && (
                            <button
                              onClick={(e) => quickMarkContacted(lead, e)}
                              disabled={busyLead === lead.id}
                              title="Mark contacted"
                              className="p-1.5 rounded hover:bg-slate-200 text-slate-400 hover:text-emerald-600 transition-colors disabled:opacity-40"
                            >
                              <svg
                                className="w-3.5 h-3.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
