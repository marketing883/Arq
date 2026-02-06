"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import AdminHeader from "@/components/admin/AdminHeader";
import type {
  TouchpointEvent,
  JourneyTransition,
  JourneyStage,
  LeadDashboardItem,
  ActiveAlert,
} from "@/types/lead-intelligence-v2";

// Extended profile type for UI display
interface LeadProfileDisplay {
  id: string;
  canonical_email?: string;
  first_name?: string;
  last_name?: string;
  company?: string;
  journey_stage: JourneyStage;
  priority_tier: string;
  composite_score: number;
  intent_score: number;
  engagement_score: number;
  icp_fit_score: number;
  total_touchpoints: number;
  last_touch: string;
}

interface LeadWithDetails {
  profile: LeadProfileDisplay;
  touchpoint_events?: TouchpointEvent[];
  journey_history?: JourneyTransition[];
}

interface V2Stats {
  total_profiles: number;
  by_journey_stage: Record<JourneyStage, number>;
  by_priority_tier: Record<string, number>;
  avg_composite_score: number;
  high_intent_count: number;
}

const JOURNEY_STAGES: JourneyStage[] = [
  "anonymous",
  "identified",
  "engaged",
  "qualified",
  "opportunity",
];

const STAGE_LABELS: Record<JourneyStage, string> = {
  anonymous: "Anonymous",
  identified: "Identified",
  engaged: "Engaged",
  qualified: "Qualified",
  opportunity: "Opportunity",
};

const STAGE_COLORS: Record<JourneyStage, { bg: string; text: string; bar: string }> = {
  anonymous: { bg: "bg-slate-100", text: "text-slate-600", bar: "bg-slate-400" },
  identified: { bg: "bg-blue-50", text: "text-blue-600", bar: "bg-blue-500" },
  engaged: { bg: "bg-amber-50", text: "text-amber-600", bar: "bg-amber-500" },
  qualified: { bg: "bg-emerald-50", text: "text-emerald-600", bar: "bg-emerald-500" },
  opportunity: { bg: "bg-purple-50", text: "text-purple-600", bar: "bg-purple-500" },
};

const PRIORITY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  P1: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
  P2: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  P3: { bg: "bg-slate-100", text: "text-slate-600", border: "border-slate-200" },
  P4: { bg: "bg-slate-50", text: "text-slate-500", border: "border-slate-100" },
};

const PRIORITY_ACTIONS: Record<string, string> = {
  P1: "Contact within 1 hour",
  P2: "Contact within 24 hours",
  P3: "Add to nurture sequence",
  P4: "Monitor activity",
};

function formatTouchpointSource(source: string): string {
  const labels: Record<string, string> = {
    chat: "Chat",
    contact_form: "Contact Form",
    resource_download: "Resource Download",
    newsletter: "Newsletter",
    webinar: "Webinar",
    page_view: "Page View",
  };
  return labels[source] || source.replace(/_/g, " ");
}

function formatEventAction(action: string): string {
  const labels: Record<string, string> = {
    message: "Message",
    submission: "Submission",
    download: "Download",
    signup: "Sign Up",
    view: "View",
    registration: "Registration",
  };
  return labels[action] || action;
}

function getTimeAgo(date: string | Date): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return then.toLocaleDateString();
}

export default function LeadsV2Page() {
  const [leads, setLeads] = useState<LeadProfileDisplay[]>([]);
  const [stats, setStats] = useState<V2Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedLead, setSelectedLead] = useState<LeadWithDetails | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
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

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

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

  const fetchLeadDetail = async (profileId: string) => {
    setLoadingDetail(true);
    try {
      const response = await fetch(`/api/admin/leads-v2?action=profile&id=${profileId}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedLead({
          profile: data.profile,
          touchpoint_events: data.touchpoint_events || [],
          journey_history: data.journey_history || [],
        });
      }
    } catch (err) {
      console.error("Failed to fetch lead details:", err);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handlePromoteStage = async (profileId: string, newStage: JourneyStage) => {
    try {
      const response = await fetch("/api/admin/leads-v2", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "promote_stage",
          profile_id: profileId,
          new_stage: newStage,
        }),
      });

      if (response.ok) {
        fetchData();
        if (selectedLead?.profile.id === profileId) {
          fetchLeadDetail(profileId);
        }
      }
    } catch (err) {
      console.error("Failed to promote stage:", err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-500 text-xs">Loading V2 Intelligence...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminHeader
        title="Lead Intelligence V2"
        subtitle="Enhanced lead profiles with journey tracking and decay scoring"
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
                        setFilters(f =>
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

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-md p-4 border border-slate-200"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-500 text-xs font-medium">Total Profiles</span>
                <span className="p-1.5 bg-slate-100 rounded">
                  <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </span>
              </div>
              <p className="text-2xl font-semibold text-slate-900">{stats.total_profiles}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-md p-4 border border-slate-200"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-red-600 text-xs font-medium">P1 Priority</span>
                <span className="p-1.5 bg-red-50 rounded">
                  <svg className="w-3.5 h-3.5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                  </svg>
                </span>
              </div>
              <p className="text-2xl font-semibold text-red-600">{stats.by_priority_tier?.P1 || 0}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Immediate action</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-md p-4 border border-slate-200"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-emerald-600 text-xs font-medium">High Intent</span>
                <span className="p-1.5 bg-emerald-50 rounded">
                  <svg className="w-3.5 h-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </span>
              </div>
              <p className="text-2xl font-semibold text-emerald-600">{stats.high_intent_count || 0}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Score &gt;= 60</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-md p-4 border border-slate-200"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-500 text-xs font-medium">Avg Score</span>
                <span className="p-1.5 bg-slate-100 rounded">
                  <svg className="w-3.5 h-3.5 text-slate-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                </span>
              </div>
              <p className="text-2xl font-semibold text-slate-900">
                {Math.round(stats.avg_composite_score || 0)}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">Composite score</p>
            </motion.div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-5">
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

          {(filters.journey_stage || filters.priority_tier || filters.min_score) && (
            <button
              onClick={() => setFilters({})}
              className="px-3 py-2 text-xs font-medium text-slate-400 hover:text-slate-600 transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Leads Grid */}
        {leads.length === 0 ? (
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
            <h3 className="text-sm font-medium text-slate-900 mb-1">No V2 profiles yet</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Lead profiles will be created as visitors interact across chat, forms, and resources.
            </p>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
            <AnimatePresence>
              {leads.map((lead, idx) => {
                const priorityColor = PRIORITY_COLORS[lead.priority_tier] || PRIORITY_COLORS.P4;
                const stageColor = STAGE_COLORS[lead.journey_stage];

                return (
                  <motion.div
                    key={lead.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: idx * 0.03 }}
                    onClick={() => fetchLeadDetail(lead.id)}
                    className={`bg-white rounded-md p-4 border ${priorityColor.border} hover:shadow-sm cursor-pointer transition-all group`}
                  >
                    {/* Header with Priority & Stage */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 ${priorityColor.bg} rounded text-[10px] font-semibold ${priorityColor.text}`}>
                          {lead.priority_tier}
                        </span>
                        <span className={`px-2 py-0.5 ${stageColor.bg} rounded text-[10px] font-medium ${stageColor.text}`}>
                          {STAGE_LABELS[lead.journey_stage]}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-slate-900">{lead.composite_score}</div>
                        <div className="text-[10px] text-slate-400">Score</div>
                      </div>
                    </div>

                    {/* Lead Info */}
                    <div className="mb-3">
                      <h3 className="text-sm font-medium text-slate-900 truncate">
                        {lead.canonical_email || `Session: ${lead.id.slice(0, 8)}...`}
                      </h3>
                      {lead.first_name && (
                        <p className="text-xs text-slate-600">
                          {lead.first_name} {lead.last_name}
                        </p>
                      )}
                      {lead.company && (
                        <p className="text-xs text-slate-500">{lead.company}</p>
                      )}
                    </div>

                    {/* Score Breakdown */}
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

                    {/* Touchpoint Summary */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <span className="text-[10px] text-slate-500">
                        {lead.total_touchpoints} touchpoint{lead.total_touchpoints !== 1 ? "s" : ""}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {getTimeAgo(lead.last_touch)}
                      </span>
                    </div>

                    {/* Action Hint */}
                    <div className="mt-2 p-2 bg-slate-50 rounded">
                      <p className="text-[10px] text-slate-500">
                        <span className="font-medium">Action:</span> {PRIORITY_ACTIONS[lead.priority_tier]}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
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
                className="bg-white rounded-md shadow-xl max-w-3xl w-full max-h-[85vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {loadingDetail ? (
                  <div className="p-10 text-center">
                    <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin mx-auto" />
                  </div>
                ) : (
                  <>
                    {/* Modal Header */}
                    <div className="p-5 bg-slate-900 text-white">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-0.5 ${PRIORITY_COLORS[selectedLead.profile.priority_tier]?.bg} rounded text-[10px] font-semibold ${PRIORITY_COLORS[selectedLead.profile.priority_tier]?.text}`}>
                              {selectedLead.profile.priority_tier}
                            </span>
                            <span className={`px-2 py-0.5 ${STAGE_COLORS[selectedLead.profile.journey_stage]?.bg} rounded text-[10px] font-medium ${STAGE_COLORS[selectedLead.profile.journey_stage]?.text}`}>
                              {STAGE_LABELS[selectedLead.profile.journey_stage]}
                            </span>
                          </div>
                          <h2 className="text-lg font-semibold text-white">
                            {selectedLead.profile.first_name
                              ? `${selectedLead.profile.first_name} ${selectedLead.profile.last_name || ""}`
                              : selectedLead.profile.canonical_email || "Anonymous Lead"}
                          </h2>
                          <p className="text-slate-400 text-sm mt-0.5">
                            {selectedLead.profile.canonical_email || "No email"}
                          </p>
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

                      {/* Score Grid */}
                      <div className="grid grid-cols-4 gap-3 mt-4">
                        <div className="bg-white/10 rounded p-2.5">
                          <p className="text-slate-400 text-[10px]">Composite</p>
                          <p className="text-xl font-semibold text-white">{selectedLead.profile.composite_score}</p>
                        </div>
                        <div className="bg-white/10 rounded p-2.5">
                          <p className="text-slate-400 text-[10px]">Intent</p>
                          <p className="text-lg font-semibold text-white">{selectedLead.profile.intent_score}</p>
                        </div>
                        <div className="bg-white/10 rounded p-2.5">
                          <p className="text-slate-400 text-[10px]">Engagement</p>
                          <p className="text-lg font-semibold text-white">{selectedLead.profile.engagement_score}</p>
                        </div>
                        <div className="bg-white/10 rounded p-2.5">
                          <p className="text-slate-400 text-[10px]">ICP Fit</p>
                          <p className="text-lg font-semibold text-white">{selectedLead.profile.icp_fit_score}</p>
                        </div>
                      </div>
                    </div>

                    {/* Modal Body */}
                    <div className="p-5 overflow-y-auto max-h-[50vh] space-y-5">
                      {/* Journey Stage Actions */}
                      <div>
                        <h3 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                          Journey Stage
                        </h3>
                        <div className="flex items-center gap-1">
                          {JOURNEY_STAGES.map((stage, idx) => {
                            const isCurrentOrPast =
                              JOURNEY_STAGES.indexOf(selectedLead.profile.journey_stage) >= idx;
                            const isCurrent = selectedLead.profile.journey_stage === stage;
                            const canPromote =
                              JOURNEY_STAGES.indexOf(selectedLead.profile.journey_stage) === idx - 1;

                            return (
                              <div key={stage} className="flex items-center flex-1">
                                <button
                                  disabled={!canPromote}
                                  onClick={() => canPromote && handlePromoteStage(selectedLead.profile.id, stage)}
                                  className={`flex-1 p-2 rounded text-center transition-all ${
                                    isCurrent
                                      ? `${STAGE_COLORS[stage].bg} ring-2 ring-offset-1 ring-slate-400`
                                      : isCurrentOrPast
                                      ? STAGE_COLORS[stage].bg
                                      : "bg-slate-100"
                                  } ${canPromote ? "hover:ring-2 hover:ring-slate-300 cursor-pointer" : ""}`}
                                  title={canPromote ? `Promote to ${STAGE_LABELS[stage]}` : ""}
                                >
                                  <p className={`text-[10px] font-medium ${isCurrentOrPast ? STAGE_COLORS[stage].text : "text-slate-400"}`}>
                                    {STAGE_LABELS[stage]}
                                  </p>
                                </button>
                                {idx < JOURNEY_STAGES.length - 1 && (
                                  <svg className={`w-3 h-3 mx-0.5 flex-shrink-0 ${isCurrentOrPast ? "text-slate-400" : "text-slate-200"}`} fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                  </svg>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Touchpoint Timeline */}
                      {selectedLead.touchpoint_events && selectedLead.touchpoint_events.length > 0 && (
                        <div>
                          <h3 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                            Touchpoint Timeline
                          </h3>
                          <div className="space-y-2 max-h-48 overflow-y-auto">
                            {selectedLead.touchpoint_events.slice(0, 10).map((event, idx) => (
                              <div key={idx} className="flex items-start gap-3 p-2 bg-slate-50 rounded">
                                <div className="w-8 h-8 bg-white rounded flex items-center justify-center flex-shrink-0 border border-slate-200">
                                  {event.source === "chat" && (
                                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                  )}
                                  {event.source === "contact_form" && (
                                    <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                  )}
                                  {event.source === "resource_download" && (
                                    <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                  )}
                                  {event.source === "newsletter" && (
                                    <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                    </svg>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-medium text-slate-700">
                                      {formatTouchpointSource(event.source)}
                                    </span>
                                    <span className="text-[10px] text-slate-400">
                                      {formatEventAction(event.event_type)}
                                    </span>
                                    {event.raw_score_contribution > 0 && (
                                      <span className="text-[10px] text-emerald-600 font-medium">
                                        +{event.raw_score_contribution}
                                      </span>
                                    )}
                                  </div>
                                  {event.event_data && Object.keys(event.event_data).length > 0 && (
                                    <p className="text-[10px] text-slate-500 truncate mt-0.5">
                                      {(event.event_data.page as string) || (event.event_data.resource_title as string) || ((event.event_data.message as string)?.substring(0, 50))}
                                    </p>
                                  )}
                                </div>
                                <span className="text-[10px] text-slate-400 flex-shrink-0">
                                  {getTimeAgo(event.created_at)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Journey History */}
                      {selectedLead.journey_history && selectedLead.journey_history.length > 0 && (
                        <div>
                          <h3 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                            Journey History
                          </h3>
                          <div className="space-y-1.5">
                            {selectedLead.journey_history.map((transition, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-xs">
                                <span className={`px-1.5 py-0.5 rounded ${STAGE_COLORS[transition.from_stage]?.bg} ${STAGE_COLORS[transition.from_stage]?.text}`}>
                                  {STAGE_LABELS[transition.from_stage]}
                                </span>
                                <svg className="w-3 h-3 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                                <span className={`px-1.5 py-0.5 rounded ${STAGE_COLORS[transition.to_stage]?.bg} ${STAGE_COLORS[transition.to_stage]?.text}`}>
                                  {STAGE_LABELS[transition.to_stage]}
                                </span>
                                <span className="text-slate-400 ml-auto text-[10px]">
                                  {transition.trigger_type} - {getTimeAgo(transition.created_at)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Recommended Action */}
                      <div>
                        <h3 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                          Recommended Action
                        </h3>
                        <div className="p-3 bg-slate-100 rounded border border-slate-200">
                          <p className="text-xs text-slate-700 font-medium">
                            {PRIORITY_ACTIONS[selectedLead.profile.priority_tier]}
                          </p>
                          {selectedLead.profile.canonical_email && (
                            <a
                              href={`mailto:${selectedLead.profile.canonical_email}?subject=Following up on your ArqAI inquiry`}
                              className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 bg-slate-900 text-white text-xs font-medium rounded hover:bg-slate-800 transition-colors"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              Send Email
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
