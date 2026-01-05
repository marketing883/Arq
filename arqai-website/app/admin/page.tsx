"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
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

  // Hot leads insight
  if (stats.hot > 0) {
    insights.push(`🔥 ${stats.hot} hot lead${stats.hot > 1 ? 's' : ''} requiring immediate attention`);
  }

  // Meeting requests
  const meetingLeads = leads.filter(l =>
    l.intelligence.behavioral_signals?.some(s => s.type === "demo_request")
  );
  if (meetingLeads.length > 0) {
    insights.push(`📅 ${meetingLeads.length} lead${meetingLeads.length > 1 ? 's' : ''} requested a meeting or demo`);
  }

  // Enterprise opportunities
  if (stats.enterprise > 0) {
    insights.push(`🏢 ${stats.enterprise} enterprise-level opportunit${stats.enterprise > 1 ? 'ies' : 'y'} identified`);
  }

  // Recent activity
  if (stats.recentLeads > 0) {
    insights.push(`⚡ ${stats.recentLeads} new lead${stats.recentLeads > 1 ? 's' : ''} in the last 24 hours`);
  }

  // Conversion suggestion
  const qualifiedRate = stats.total > 0 ? Math.round((stats.qualified / stats.total) * 100) : 0;
  if (qualifiedRate > 0) {
    insights.push(`✅ ${qualifiedRate}% of leads are qualified - follow up promptly`);
  }

  return insights.length > 0 ? insights : ["Collecting intelligence on your leads..."];
}

// Get priority tier label
function getPriorityTier(lead: LeadData): { tier: string; color: string; action: string } {
  const { buy_intent_score = 0, company_size, urgency, qualification_status } = lead.intelligence;

  if (buy_intent_score >= 70 || urgency === "immediate" || qualification_status === "qualified") {
    return { tier: "Priority 1", color: "bg-red-500", action: "Contact within 1 hour" };
  }
  if (buy_intent_score >= 40 || company_size === "enterprise" || urgency === "high") {
    return { tier: "Priority 2", color: "bg-orange-500", action: "Contact within 24 hours" };
  }
  if (buy_intent_score >= 20 || qualification_status === "nurture") {
    return { tier: "Priority 3", color: "bg-yellow-500", action: "Add to nurture sequence" };
  }
  return { tier: "Priority 4", color: "bg-gray-400", action: "Monitor activity" };
}

// Format signal type for display
function formatSignalType(type: string): string {
  const labels: Record<string, string> = {
    pricing_interest: "💰 Pricing Interest",
    competitor_mention: "⚔️ Competitor Mention",
    timeline_mention: "📅 Timeline Discussed",
    pain_point: "😓 Pain Point",
    feature_interest: "✨ Feature Interest",
    demo_request: "🎯 Meeting Request",
    compliance_mention: "🔒 Compliance Need",
    integration_question: "🔗 Integration Query",
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
  const router = useRouter();

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
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const insights = generateInsights(leads, stats);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Loading intelligence...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center">
                <Image
                  src="/img/ArqAI-logo.png"
                  alt="ArqAI"
                  width={120}
                  height={40}
                  className="h-8 w-auto"
                  priority
                />
              </Link>
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xs font-medium text-white">Lead Intelligence</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/admin/content"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-medium rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Content
              </Link>
              <button
                onClick={fetchData}
                className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                title="Refresh data"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-700 flex items-center gap-3"
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </motion.div>
        )}

        {/* AI Insights Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-lg text-white shadow-lg shadow-blue-500/25"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/20 rounded-md">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold mb-2">AI-Powered Insights</h2>
              <div className="space-y-1">
                {insights.map((insight, idx) => (
                  <p key={idx} className="text-white/90 text-sm">{insight}</p>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg p-5 shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-slate-500 text-sm font-medium">Total Leads</span>
                <span className="p-2 bg-slate-100 rounded-lg">
                  <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </span>
              </div>
              <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-red-50 to-orange-50 rounded-lg p-5 shadow-sm border border-red-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-red-600 text-sm font-medium">Hot Leads</span>
                <span className="p-2 bg-red-100 rounded-lg">
                  <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                  </svg>
                </span>
              </div>
              <p className="text-3xl font-bold text-red-700">{stats.hot}</p>
              <p className="text-xs text-red-500 mt-1">Requires immediate action</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-5 shadow-sm border border-green-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-green-600 text-sm font-medium">Qualified</span>
                <span className="p-2 bg-green-100 rounded-lg">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </span>
              </div>
              <p className="text-3xl font-bold text-green-700">{stats.qualified}</p>
              <p className="text-xs text-green-500 mt-1">Ready for outreach</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-5 shadow-sm border border-purple-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-purple-600 text-sm font-medium">Last 24h</span>
                <span className="p-2 bg-purple-100 rounded-lg">
                  <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </span>
              </div>
              <p className="text-3xl font-bold text-purple-700">{stats.recentLeads}</p>
              <p className="text-xs text-purple-500 mt-1">New conversations</p>
            </motion.div>
          </div>
        )}

        {/* Filters & View Toggle */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 flex flex-wrap gap-3">
            <select
              value={filters.intent_category || ""}
              onChange={(e) => setFilters({ ...filters, intent_category: e.target.value || undefined })}
              className="px-4 py-2.5 bg-white rounded-md border border-slate-200 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Intent</option>
              <option value="hot">🔥 Hot</option>
              <option value="warm">🌡️ Warm</option>
              <option value="cold">❄️ Cold</option>
            </select>

            <select
              value={filters.urgency || ""}
              onChange={(e) => setFilters({ ...filters, urgency: e.target.value || undefined })}
              className="px-4 py-2.5 bg-white rounded-md border border-slate-200 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Urgency</option>
              <option value="immediate">⚡ Immediate</option>
              <option value="high">🔴 High</option>
              <option value="medium">🟡 Medium</option>
              <option value="low">🟢 Low</option>
            </select>

            <select
              value={filters.company_size || ""}
              onChange={(e) => setFilters({ ...filters, company_size: e.target.value || undefined })}
              className="px-4 py-2.5 bg-white rounded-md border border-slate-200 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Sizes</option>
              <option value="enterprise">🏢 Enterprise</option>
              <option value="mid-market">🏬 Mid-Market</option>
              <option value="smb">🏪 SMB</option>
              <option value="startup">🚀 Startup</option>
            </select>

            {Object.keys(filters).some(k => filters[k as keyof Filters]) && (
              <button
                onClick={() => setFilters({})}
                className="px-4 py-2.5 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 bg-slate-100 rounded-md p-1">
            <button
              onClick={() => setViewMode("cards")}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                viewMode === "cards" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Cards
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
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
            className="bg-white rounded-lg p-12 text-center shadow-sm border border-slate-200"
          >
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No leads yet</h3>
            <p className="text-slate-500 max-w-md mx-auto">
              Leads will appear here as visitors interact with the chat widget on your website.
            </p>
          </motion.div>
        ) : viewMode === "cards" ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {leads.map((lead, idx) => {
                const priority = getPriorityTier(lead);
                return (
                  <motion.div
                    key={lead.user.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => setSelectedLead(lead)}
                    className="bg-white rounded-lg p-5 shadow-sm border border-slate-200 hover:shadow-lg hover:border-slate-300 cursor-pointer transition-all group"
                  >
                    {/* Priority Badge */}
                    <div className="flex items-start justify-between mb-4">
                      <div className={`px-3 py-1 ${priority.color} rounded-full`}>
                        <span className="text-xs font-semibold text-white">{priority.tier}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-slate-900">{lead.intelligence.buy_intent_score}</div>
                        <div className="text-xs text-slate-500">Intent Score</div>
                      </div>
                    </div>

                    {/* Lead Info */}
                    <div className="mb-4">
                      <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {lead.user.name || "Anonymous Visitor"}
                      </h3>
                      {lead.user.email && (
                        <p className="text-sm text-slate-500 truncate">{lead.user.email}</p>
                      )}
                      {lead.user.company && (
                        <p className="text-sm text-slate-600 font-medium mt-1">{lead.user.company}</p>
                      )}
                    </div>

                    {/* Signals Preview */}
                    {lead.intelligence.behavioral_signals && lead.intelligence.behavioral_signals.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {Array.from(new Set(lead.intelligence.behavioral_signals.map(s => s.type))).slice(0, 3).map((type) => (
                          <span
                            key={type}
                            className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-lg"
                          >
                            {formatSignalType(type)}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Meta Info */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium capitalize ${
                        lead.intelligence.intent_category === "hot" ? "bg-red-100 text-red-700" :
                        lead.intelligence.intent_category === "warm" ? "bg-orange-100 text-orange-700" :
                        "bg-blue-100 text-blue-700"
                      }`}>
                        {lead.intelligence.intent_category}
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(lead.intelligence.updated_at).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Recommended Action */}
                    <div className="mt-3 p-3 bg-slate-50 rounded-md">
                      <p className="text-xs text-slate-600">
                        <span className="font-medium">Recommended:</span> {priority.action}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          /* Table View */
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Lead</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Company</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Intent</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Score</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Priority</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Updated</th>
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
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-slate-900">{lead.user.name || "Anonymous"}</p>
                            <p className="text-sm text-slate-500">{lead.user.email || "No email"}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-slate-700">{lead.user.company || "-"}</p>
                          <p className="text-sm text-slate-500 capitalize">{lead.intelligence.company_size || "-"}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize ${
                            lead.intelligence.intent_category === "hot" ? "bg-red-100 text-red-700" :
                            lead.intelligence.intent_category === "warm" ? "bg-orange-100 text-orange-700" :
                            "bg-blue-100 text-blue-700"
                          }`}>
                            {lead.intelligence.intent_category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  lead.intelligence.buy_intent_score >= 60 ? "bg-red-500" :
                                  lead.intelligence.buy_intent_score >= 30 ? "bg-orange-500" :
                                  "bg-blue-500"
                                }`}
                                style={{ width: `${lead.intelligence.buy_intent_score}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-slate-700">{lead.intelligence.buy_intent_score}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 ${priority.color} rounded-full text-xs font-medium text-white`}>
                            {priority.tier}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500">
                          {new Date(lead.intelligence.updated_at).toLocaleDateString()}
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
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
              onClick={() => setSelectedLead(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="p-6 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className={`inline-flex px-3 py-1 ${getPriorityTier(selectedLead).color} rounded-full text-xs font-semibold text-white mb-3`}>
                        {getPriorityTier(selectedLead).tier}
                      </div>
                      <h2 className="text-2xl font-bold text-white">
                        {selectedLead.user.name || "Anonymous Lead"}
                      </h2>
                      <p className="text-slate-300 mt-1">
                        {selectedLead.user.email || "No email provided"}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedLead(null)}
                      className="p-2 hover:bg-white/10 rounded-md transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-4 mt-6">
                    <div className="bg-white/10 rounded-md p-3">
                      <p className="text-slate-300 text-xs">Intent Score</p>
                      <p className="text-2xl font-bold text-white">{selectedLead.intelligence.buy_intent_score}/100</p>
                    </div>
                    <div className="bg-white/10 rounded-md p-3">
                      <p className="text-slate-300 text-xs">Category</p>
                      <p className="text-xl font-bold text-white capitalize">{selectedLead.intelligence.intent_category}</p>
                    </div>
                    <div className="bg-white/10 rounded-md p-3">
                      <p className="text-slate-300 text-xs">Urgency</p>
                      <p className="text-xl font-bold text-white capitalize">{selectedLead.intelligence.urgency}</p>
                    </div>
                  </div>
                </div>

                {/* Modal Body */}
                <div className="p-6 overflow-y-auto max-h-[50vh] space-y-6">
                  {/* Contact Info */}
                  <div>
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Contact Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-50 rounded-md">
                        <p className="text-xs text-slate-500 mb-1">Company</p>
                        <p className="font-medium text-slate-900">{selectedLead.user.company || "Not provided"}</p>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-md">
                        <p className="text-xs text-slate-500 mb-1">Job Title</p>
                        <p className="font-medium text-slate-900">{selectedLead.user.job_title || "Not provided"}</p>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-md">
                        <p className="text-xs text-slate-500 mb-1">Phone</p>
                        <p className="font-medium text-slate-900">{selectedLead.user.phone || "Not provided"}</p>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-md">
                        <p className="text-xs text-slate-500 mb-1">Company Size</p>
                        <p className="font-medium text-slate-900 capitalize">{selectedLead.intelligence.company_size || "Unknown"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Behavioral Signals */}
                  {selectedLead.intelligence.behavioral_signals && selectedLead.intelligence.behavioral_signals.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Behavioral Signals</h3>
                      <div className="space-y-2">
                        {Array.from(new Map(selectedLead.intelligence.behavioral_signals.map(s => [s.type + s.content.substring(0, 30), s])).values())
                          .slice(0, 8)
                          .map((signal: BehavioralSignal, idx: number) => (
                          <div key={idx} className="flex items-start gap-3 p-3 bg-slate-50 rounded-md">
                            <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-lg whitespace-nowrap">
                              {formatSignalType(signal.type)}
                            </span>
                            <p className="text-sm text-slate-600 flex-1 line-clamp-2">
                              {signal.content.substring(0, 120)}...
                            </p>
                            <span className="text-xs text-slate-400 whitespace-nowrap">
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
                      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Company Research</h3>
                      <div className="p-4 bg-slate-50 rounded-md space-y-3">
                        {selectedLead.intelligence.company_research.industry && (
                          <div>
                            <p className="text-xs text-slate-500">Industry</p>
                            <p className="font-medium text-slate-900">{selectedLead.intelligence.company_research.industry}</p>
                          </div>
                        )}
                        {selectedLead.intelligence.company_research.compliance_requirements &&
                         selectedLead.intelligence.company_research.compliance_requirements.length > 0 && (
                          <div>
                            <p className="text-xs text-slate-500 mb-2">Compliance Requirements</p>
                            <div className="flex flex-wrap gap-2">
                              {selectedLead.intelligence.company_research.compliance_requirements.map((req) => (
                                <span key={req} className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-medium rounded-full">
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
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Recommended Actions</h3>
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-md border border-blue-100">
                      <p className="text-blue-800 font-medium">{getPriorityTier(selectedLead).action}</p>
                      {selectedLead.user.email && (
                        <a
                          href={`mailto:${selectedLead.user.email}?subject=Following up on your ArqAI inquiry`}
                          className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          Send Email
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
