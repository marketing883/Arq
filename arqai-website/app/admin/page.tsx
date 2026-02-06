"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import AdminHeader from "@/components/admin/AdminHeader";
import type { LeadIntelligence, User, BehavioralSignal } from "@/types";

interface LeadData {
  user: User;
  intelligence: LeadIntelligence;
}

interface Stats {
  total: number;
  hot: number;
  warm: number;
  cold: number;
  qualified: number;
  enterprise: number;
  recentLeads: number;
}

interface Filters {
  intent_category?: string;
  company_size?: string;
  urgency?: string;
  qualification_status?: string;
}

// AI-generated insights based on lead data
function generateInsights(leads: LeadData[], stats: Stats | null): string[] {
  const insights: string[] = [];

  if (!stats || leads.length === 0) {
    insights.push("Start conversations to generate lead insights.");
    return insights;
  }

  if (stats.hot > 0) {
    insights.push(`${stats.hot} hot lead${stats.hot > 1 ? 's' : ''} requiring immediate attention`);
  }

  const meetingLeads = leads.filter(l =>
    l.intelligence.behavioral_signals?.some(s => s.type === "demo_request")
  );
  if (meetingLeads.length > 0) {
    insights.push(`${meetingLeads.length} lead${meetingLeads.length > 1 ? 's' : ''} requested a meeting or demo`);
  }

  if (stats.enterprise > 0) {
    insights.push(`${stats.enterprise} enterprise-level opportunit${stats.enterprise > 1 ? 'ies' : 'y'} identified`);
  }

  if (stats.recentLeads > 0) {
    insights.push(`${stats.recentLeads} new lead${stats.recentLeads > 1 ? 's' : ''} in the last 24 hours`);
  }

  const qualifiedRate = stats.total > 0 ? Math.round((stats.qualified / stats.total) * 100) : 0;
  if (qualifiedRate > 0) {
    insights.push(`${qualifiedRate}% of leads are qualified - follow up promptly`);
  }

  return insights.length > 0 ? insights : ["Collecting intelligence on your leads..."];
}

// Get priority tier label
function getPriorityTier(lead: LeadData): { tier: string; color: string; bgColor: string; action: string } {
  const { buy_intent_score = 0, company_size, urgency, qualification_status } = lead.intelligence;

  if (buy_intent_score >= 70 || urgency === "immediate" || qualification_status === "qualified") {
    return { tier: "P1", color: "text-red-700", bgColor: "bg-red-50", action: "Contact within 1 hour" };
  }
  if (buy_intent_score >= 40 || company_size === "enterprise" || urgency === "high") {
    return { tier: "P2", color: "text-amber-700", bgColor: "bg-amber-50", action: "Contact within 24 hours" };
  }
  if (buy_intent_score >= 20 || qualification_status === "nurture") {
    return { tier: "P3", color: "text-slate-600", bgColor: "bg-slate-100", action: "Add to nurture sequence" };
  }
  return { tier: "P4", color: "text-slate-500", bgColor: "bg-slate-50", action: "Monitor activity" };
}

// Format signal type for display
function formatSignalType(type: string): string {
  const labels: Record<string, string> = {
    pricing_interest: "Pricing",
    competitor_mention: "Competitor",
    timeline_mention: "Timeline",
    pain_point: "Pain Point",
    feature_interest: "Feature",
    demo_request: "Meeting",
    compliance_mention: "Compliance",
    integration_question: "Integration",
  };
  return labels[type] || type.replace(/_/g, " ");
}

export default function AdminDashboard() {
  const [leads, setLeads] = useState<LeadData[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState<Filters>({});
  const [selectedLead, setSelectedLead] = useState<LeadData | null>(null);
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDeleteLead = async (userId: string) => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/leads?userId=${userId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setLeads(leads.filter(lead => lead.user.id !== userId));
        setDeleteConfirm(null);
        if (selectedLead?.user.id === userId) {
          setSelectedLead(null);
        }
        // Refresh stats
        fetchData();
      }
    } catch (err) {
      console.error("Failed to delete lead:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const fetchData = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await fetch(`/api/admin/leads?${params.toString()}`);

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
      setError("Failed to load dashboard data");
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

  const insights = generateInsights(leads, stats);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-500 text-xs">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminHeader
        title="Chat Leads"
        subtitle="Lead intelligence from chat conversations"
        onRefresh={fetchData}
        showExport={true}
      />

      <div className="p-5">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm flex items-center gap-2"
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </motion.div>
        )}

        {/* AI Insights Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5 p-4 bg-slate-900 rounded-md text-white"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 bg-white/10 rounded">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">AI Insights</h2>
              <ul className="space-y-0.5">
                {insights.map((insight, idx) => (
                  <li key={idx} className="text-white/90 text-xs flex items-center gap-1.5">
                    <span className="w-1 h-1 bg-white/50 rounded-full"></span>
                    {insight}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-md p-4 border border-slate-200"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-500 text-xs font-medium">Total Leads</span>
                <span className="p-1.5 bg-slate-100 rounded">
                  <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </span>
              </div>
              <p className="text-2xl font-semibold text-slate-900">{stats.total}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-md p-4 border border-slate-200"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-red-600 text-xs font-medium">Hot Leads</span>
                <span className="p-1.5 bg-red-50 rounded">
                  <svg className="w-3.5 h-3.5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                  </svg>
                </span>
              </div>
              <p className="text-2xl font-semibold text-red-600">{stats.hot}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Immediate action</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-md p-4 border border-slate-200"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-emerald-600 text-xs font-medium">Qualified</span>
                <span className="p-1.5 bg-emerald-50 rounded">
                  <svg className="w-3.5 h-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </span>
              </div>
              <p className="text-2xl font-semibold text-emerald-600">{stats.qualified}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Ready for outreach</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-md p-4 border border-slate-200"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-500 text-xs font-medium">Last 24h</span>
                <span className="p-1.5 bg-slate-100 rounded">
                  <svg className="w-3.5 h-3.5 text-slate-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </span>
              </div>
              <p className="text-2xl font-semibold text-slate-900">{stats.recentLeads}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">New conversations</p>
            </motion.div>
          </div>
        )}

        {/* Filters & View Toggle */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="flex-1 flex flex-wrap gap-2">
            <select
              value={filters.intent_category || ""}
              onChange={(e) => setFilters({ ...filters, intent_category: e.target.value || undefined })}
              className="px-3 py-2 bg-white rounded border border-slate-200 text-xs font-medium text-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-400 focus:border-transparent"
            >
              <option value="">All Intent</option>
              <option value="hot">Hot</option>
              <option value="warm">Warm</option>
              <option value="cold">Cold</option>
            </select>

            <select
              value={filters.urgency || ""}
              onChange={(e) => setFilters({ ...filters, urgency: e.target.value || undefined })}
              className="px-3 py-2 bg-white rounded border border-slate-200 text-xs font-medium text-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-400 focus:border-transparent"
            >
              <option value="">All Urgency</option>
              <option value="immediate">Immediate</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <select
              value={filters.company_size || ""}
              onChange={(e) => setFilters({ ...filters, company_size: e.target.value || undefined })}
              className="px-3 py-2 bg-white rounded border border-slate-200 text-xs font-medium text-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-400 focus:border-transparent"
            >
              <option value="">All Sizes</option>
              <option value="enterprise">Enterprise</option>
              <option value="mid-market">Mid-Market</option>
              <option value="smb">SMB</option>
              <option value="startup">Startup</option>
            </select>

            {Object.keys(filters).some(k => filters[k as keyof Filters]) && (
              <button
                onClick={() => setFilters({})}
                className="px-3 py-2 text-xs font-medium text-slate-400 hover:text-slate-600 transition-colors"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-0.5 bg-slate-100 rounded p-0.5">
            <button
              onClick={() => setViewMode("cards")}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                viewMode === "cards" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Cards
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                viewMode === "table" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Table
            </button>
          </div>
        </div>

        {/* Leads Display */}
        {leads.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-md p-10 text-center border border-slate-200"
          >
            <div className="w-12 h-12 bg-slate-100 rounded-md flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-slate-900 mb-1">No leads yet</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Leads will appear here as visitors interact with the chat widget.
            </p>
          </motion.div>
        ) : viewMode === "cards" ? (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
            <AnimatePresence>
              {leads.map((lead, idx) => {
                const priority = getPriorityTier(lead);
                return (
                  <motion.div
                    key={lead.user.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: idx * 0.03 }}
                    onClick={() => setSelectedLead(lead)}
                    className="bg-white rounded-md p-4 border border-slate-200 hover:border-slate-300 hover:shadow-sm cursor-pointer transition-all group"
                  >
                    {/* Priority Badge & Score */}
                    <div className="flex items-start justify-between mb-3">
                      <div className={`px-2 py-0.5 ${priority.bgColor} rounded text-[10px] font-semibold ${priority.color}`}>
                        {priority.tier}
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-slate-900">{lead.intelligence.buy_intent_score}</div>
                        <div className="text-[10px] text-slate-400">Score</div>
                      </div>
                    </div>

                    {/* Lead Info */}
                    <div className="mb-3">
                      <h3 className="text-sm font-medium text-slate-900 group-hover:text-slate-700 transition-colors truncate">
                        {lead.user.name || "Anonymous Visitor"}
                      </h3>
                      {lead.user.email && (
                        <p className="text-xs text-slate-500 truncate">{lead.user.email}</p>
                      )}
                      {lead.user.company && (
                        <p className="text-xs text-slate-600 font-medium mt-0.5">{lead.user.company}</p>
                      )}
                    </div>

                    {/* Signals Preview */}
                    {lead.intelligence.behavioral_signals && lead.intelligence.behavioral_signals.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {Array.from(new Set(lead.intelligence.behavioral_signals.map(s => s.type))).slice(0, 3).map((type) => (
                          <span
                            key={type}
                            className="px-1.5 py-0.5 bg-slate-100 text-slate-600 text-[10px] rounded"
                          >
                            {formatSignalType(type)}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Meta Info */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium capitalize ${
                        lead.intelligence.intent_category === "hot" ? "bg-red-50 text-red-600" :
                        lead.intelligence.intent_category === "warm" ? "bg-amber-50 text-amber-600" :
                        "bg-slate-50 text-slate-600"
                      }`}>
                        {lead.intelligence.intent_category}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(lead.intelligence.updated_at).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Recommended Action */}
                    <div className="mt-2 p-2 bg-slate-50 rounded flex items-center justify-between">
                      <p className="text-[10px] text-slate-500">
                        <span className="font-medium">Action:</span> {priority.action}
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteConfirm(lead.user.id);
                        }}
                        className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100"
                        title="Delete lead"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          /* Table View */
          <div className="bg-white rounded-md border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-4 py-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Lead</th>
                    <th className="text-left px-4 py-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Company</th>
                    <th className="text-left px-4 py-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Intent</th>
                    <th className="text-left px-4 py-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Score</th>
                    <th className="text-left px-4 py-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Priority</th>
                    <th className="text-left px-4 py-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Updated</th>
                    <th className="text-right px-4 py-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {leads.map((lead) => {
                    const priority = getPriorityTier(lead);
                    return (
                      <tr
                        key={lead.user.id}
                        onClick={() => setSelectedLead(lead)}
                        className="hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        <td className="px-4 py-3">
                          <div>
                            <p className="text-xs font-medium text-slate-900">{lead.user.name || "Anonymous"}</p>
                            <p className="text-[10px] text-slate-500">{lead.user.email || "No email"}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-xs text-slate-700">{lead.user.company || "-"}</p>
                          <p className="text-[10px] text-slate-400 capitalize">{lead.intelligence.company_size || "-"}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium capitalize ${
                            lead.intelligence.intent_category === "hot" ? "bg-red-50 text-red-600" :
                            lead.intelligence.intent_category === "warm" ? "bg-amber-50 text-amber-600" :
                            "bg-slate-50 text-slate-600"
                          }`}>
                            {lead.intelligence.intent_category}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  lead.intelligence.buy_intent_score >= 60 ? "bg-red-500" :
                                  lead.intelligence.buy_intent_score >= 30 ? "bg-amber-500" :
                                  "bg-slate-400"
                                }`}
                                style={{ width: `${lead.intelligence.buy_intent_score}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium text-slate-600">{lead.intelligence.buy_intent_score}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-1.5 py-0.5 ${priority.bgColor} rounded text-[10px] font-medium ${priority.color}`}>
                            {priority.tier}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-500">
                          {new Date(lead.intelligence.updated_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteConfirm(lead.user.id);
                            }}
                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                            title="Delete lead"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
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
                className="bg-white rounded-md shadow-xl max-w-2xl w-full max-h-[85vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="p-5 bg-slate-900 text-white">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className={`inline-flex px-2 py-0.5 ${getPriorityTier(selectedLead).bgColor} rounded text-[10px] font-semibold ${getPriorityTier(selectedLead).color} mb-2`}>
                        {getPriorityTier(selectedLead).tier}
                      </div>
                      <h2 className="text-lg font-semibold text-white">
                        {selectedLead.user.name || "Anonymous Lead"}
                      </h2>
                      <p className="text-slate-400 text-sm mt-0.5">
                        {selectedLead.user.email || "No email provided"}
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

                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-3 mt-4">
                    <div className="bg-white/10 rounded p-2.5">
                      <p className="text-slate-400 text-[10px]">Intent Score</p>
                      <p className="text-xl font-semibold text-white">{selectedLead.intelligence.buy_intent_score}/100</p>
                    </div>
                    <div className="bg-white/10 rounded p-2.5">
                      <p className="text-slate-400 text-[10px]">Category</p>
                      <p className="text-lg font-semibold text-white capitalize">{selectedLead.intelligence.intent_category}</p>
                    </div>
                    <div className="bg-white/10 rounded p-2.5">
                      <p className="text-slate-400 text-[10px]">Urgency</p>
                      <p className="text-lg font-semibold text-white capitalize">{selectedLead.intelligence.urgency}</p>
                    </div>
                  </div>
                </div>

                {/* Modal Body */}
                <div className="p-5 overflow-y-auto max-h-[50vh] space-y-5">
                  {/* Contact Info */}
                  <div>
                    <h3 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Contact Details</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-slate-50 rounded">
                        <p className="text-[10px] text-slate-400 mb-0.5">Company</p>
                        <p className="text-xs font-medium text-slate-900">{selectedLead.user.company || "Not provided"}</p>
                      </div>
                      <div className="p-3 bg-slate-50 rounded">
                        <p className="text-[10px] text-slate-400 mb-0.5">Job Title</p>
                        <p className="text-xs font-medium text-slate-900">{selectedLead.user.job_title || "Not provided"}</p>
                      </div>
                      <div className="p-3 bg-slate-50 rounded">
                        <p className="text-[10px] text-slate-400 mb-0.5">Phone</p>
                        <p className="text-xs font-medium text-slate-900">{selectedLead.user.phone || "Not provided"}</p>
                      </div>
                      <div className="p-3 bg-slate-50 rounded">
                        <p className="text-[10px] text-slate-400 mb-0.5">Company Size</p>
                        <p className="text-xs font-medium text-slate-900 capitalize">{selectedLead.intelligence.company_size || "Unknown"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Behavioral Signals */}
                  {selectedLead.intelligence.behavioral_signals && selectedLead.intelligence.behavioral_signals.length > 0 && (
                    <div>
                      <h3 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Behavioral Signals</h3>
                      <div className="space-y-1.5">
                        {Array.from(new Map(selectedLead.intelligence.behavioral_signals.map(s => [s.type + s.content.substring(0, 30), s])).values())
                          .slice(0, 8)
                          .map((signal: BehavioralSignal, idx: number) => (
                          <div key={idx} className="flex items-start gap-2 p-2 bg-slate-50 rounded">
                            <span className="px-1.5 py-0.5 bg-slate-200 text-slate-600 text-[10px] font-medium rounded whitespace-nowrap">
                              {formatSignalType(signal.type)}
                            </span>
                            <p className="text-xs text-slate-600 flex-1 line-clamp-2">
                              {signal.content.substring(0, 100)}...
                            </p>
                            <span className="text-[10px] text-slate-400 whitespace-nowrap">
                              {Math.round(signal.confidence * 100)}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Company Research */}
                  {selectedLead.intelligence.company_research && (
                    <div>
                      <h3 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Company Research</h3>
                      <div className="p-3 bg-slate-50 rounded space-y-2">
                        {selectedLead.intelligence.company_research.industry && (
                          <div>
                            <p className="text-[10px] text-slate-400">Industry</p>
                            <p className="text-xs font-medium text-slate-900">{selectedLead.intelligence.company_research.industry}</p>
                          </div>
                        )}
                        {selectedLead.intelligence.company_research.compliance_requirements &&
                         selectedLead.intelligence.company_research.compliance_requirements.length > 0 && (
                          <div>
                            <p className="text-[10px] text-slate-400 mb-1">Compliance</p>
                            <div className="flex flex-wrap gap-1">
                              {selectedLead.intelligence.company_research.compliance_requirements.map((req) => (
                                <span key={req} className="px-2 py-0.5 bg-slate-200 text-slate-600 text-xs font-medium rounded">
                                  {req}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Recommended Actions */}
                  <div>
                    <h3 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Recommended Actions</h3>
                    <div className="p-3 bg-slate-100 rounded border border-slate-200">
                      <p className="text-xs text-slate-700 font-medium">{getPriorityTier(selectedLead).action}</p>
                      {selectedLead.user.email && (
                        <a
                          href={`mailto:${selectedLead.user.email}?subject=Following up on your ArqAI inquiry`}
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

                  {/* Delete Lead */}
                  <div className="pt-4 border-t border-slate-200">
                    <button
                      onClick={() => setDeleteConfirm(selectedLead.user.id)}
                      className="text-xs text-red-600 hover:text-red-700 font-medium"
                    >
                      Delete this lead
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {deleteConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50"
              onClick={() => !isDeleting && setDeleteConfirm(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white rounded-md shadow-xl max-w-md w-full p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Delete Lead</h3>
                <p className="text-sm text-slate-600 mb-6">
                  Are you sure you want to delete this lead? This will permanently remove all their data including conversations and intelligence. This action cannot be undone.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    disabled={isDeleting}
                    className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDeleteLead(deleteConfirm)}
                    disabled={isDeleting}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
                  >
                    {isDeleting && (
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    )}
                    Delete
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
