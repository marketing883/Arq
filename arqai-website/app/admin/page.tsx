"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Logo } from "@/components/layout/Logo";
import type { LeadIntelligence, User } from "@/types";

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

export default function AdminDashboard() {
  const [leads, setLeads] = useState<LeadData[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState<Filters>({});
  const [selectedLead, setSelectedLead] = useState<LeadData | null>(null);
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
  }, [fetchData]);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const getIntentColor = (category: string) => {
    switch (category) {
      case "hot":
        return "bg-red-100 text-red-700 border-red-200";
      case "warm":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "cold":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "immediate":
        return "bg-red-500 text-white";
      case "high":
        return "bg-orange-500 text-white";
      case "medium":
        return "bg-yellow-500 text-black";
      case "low":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--arq-gray-50)]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[var(--arq-blue)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[var(--arq-gray-600)]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--arq-gray-50)]">
      {/* Header */}
      <header className="bg-white border-b border-[var(--arq-gray-200)] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Logo />
              <span className="text-[var(--arq-gray-400)]">|</span>
              <span className="font-semibold text-[var(--arq-gray-700)]">
                Admin Dashboard
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-[var(--arq-gray-600)] hover:text-[var(--arq-black)] transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-4 shadow-sm border border-[var(--arq-gray-200)]"
            >
              <p className="text-sm text-[var(--arq-gray-500)]">Total Leads</p>
              <p className="text-2xl font-bold text-[var(--arq-black)]">
                {stats.total}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="bg-red-50 rounded-xl p-4 shadow-sm border border-red-200"
            >
              <p className="text-sm text-red-600">Hot</p>
              <p className="text-2xl font-bold text-red-700">{stats.hot}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-orange-50 rounded-xl p-4 shadow-sm border border-orange-200"
            >
              <p className="text-sm text-orange-600">Warm</p>
              <p className="text-2xl font-bold text-orange-700">{stats.warm}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-blue-50 rounded-xl p-4 shadow-sm border border-blue-200"
            >
              <p className="text-sm text-blue-600">Cold</p>
              <p className="text-2xl font-bold text-blue-700">{stats.cold}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-green-50 rounded-xl p-4 shadow-sm border border-green-200"
            >
              <p className="text-sm text-green-600">Qualified</p>
              <p className="text-2xl font-bold text-green-700">
                {stats.qualified}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-purple-50 rounded-xl p-4 shadow-sm border border-purple-200"
            >
              <p className="text-sm text-purple-600">Enterprise</p>
              <p className="text-2xl font-bold text-purple-700">
                {stats.enterprise}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-[var(--arq-lime)]/20 rounded-xl p-4 shadow-sm border border-[var(--arq-lime)]"
            >
              <p className="text-sm text-[var(--arq-gray-700)]">Last 24h</p>
              <p className="text-2xl font-bold text-[var(--arq-black)]">
                {stats.recentLeads}
              </p>
            </motion.div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-[var(--arq-gray-200)] mb-6">
          <div className="flex flex-wrap gap-4">
            <select
              value={filters.intent_category || ""}
              onChange={(e) =>
                setFilters({ ...filters, intent_category: e.target.value || undefined })
              }
              className="px-4 py-2 rounded-lg border border-[var(--arq-gray-200)] focus:outline-none focus:ring-2 focus:ring-[var(--arq-blue)]"
            >
              <option value="">All Intent</option>
              <option value="hot">Hot</option>
              <option value="warm">Warm</option>
              <option value="cold">Cold</option>
            </select>

            <select
              value={filters.company_size || ""}
              onChange={(e) =>
                setFilters({ ...filters, company_size: e.target.value || undefined })
              }
              className="px-4 py-2 rounded-lg border border-[var(--arq-gray-200)] focus:outline-none focus:ring-2 focus:ring-[var(--arq-blue)]"
            >
              <option value="">All Sizes</option>
              <option value="startup">Startup</option>
              <option value="smb">SMB</option>
              <option value="mid-market">Mid-Market</option>
              <option value="enterprise">Enterprise</option>
            </select>

            <select
              value={filters.urgency || ""}
              onChange={(e) =>
                setFilters({ ...filters, urgency: e.target.value || undefined })
              }
              className="px-4 py-2 rounded-lg border border-[var(--arq-gray-200)] focus:outline-none focus:ring-2 focus:ring-[var(--arq-blue)]"
            >
              <option value="">All Urgency</option>
              <option value="immediate">Immediate</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <select
              value={filters.qualification_status || ""}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  qualification_status: e.target.value || undefined,
                })
              }
              className="px-4 py-2 rounded-lg border border-[var(--arq-gray-200)] focus:outline-none focus:ring-2 focus:ring-[var(--arq-blue)]"
            >
              <option value="">All Status</option>
              <option value="new">New</option>
              <option value="qualified">Qualified</option>
              <option value="nurture">Nurture</option>
              <option value="unqualified">Unqualified</option>
            </select>

            <button
              onClick={() => setFilters({})}
              className="px-4 py-2 text-[var(--arq-gray-600)] hover:text-[var(--arq-black)] transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-white rounded-xl shadow-sm border border-[var(--arq-gray-200)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[var(--arq-gray-50)] border-b border-[var(--arq-gray-200)]">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--arq-gray-700)]">
                    Lead
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--arq-gray-700)]">
                    Company
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--arq-gray-700)]">
                    Intent
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--arq-gray-700)]">
                    Score
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--arq-gray-700)]">
                    Urgency
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--arq-gray-700)]">
                    Status
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--arq-gray-700)]">
                    Updated
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--arq-gray-100)]">
                {leads.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-12 text-center text-[var(--arq-gray-500)]"
                    >
                      No leads found. Leads will appear here as visitors interact
                      with the chat.
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => (
                    <tr
                      key={lead.user.id}
                      onClick={() => setSelectedLead(lead)}
                      className="hover:bg-[var(--arq-gray-50)] cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-[var(--arq-black)]">
                            {lead.user.name || "Anonymous"}
                          </p>
                          <p className="text-sm text-[var(--arq-gray-500)]">
                            {lead.user.email || "No email"}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-[var(--arq-gray-700)]">
                            {lead.user.company || "-"}
                          </p>
                          <p className="text-sm text-[var(--arq-gray-500)]">
                            {lead.intelligence.company_size || "-"}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2 py-1 rounded text-xs font-medium border ${getIntentColor(
                            lead.intelligence.intent_category
                          )}`}
                        >
                          {lead.intelligence.intent_category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-[var(--arq-gray-200)] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[var(--arq-blue)] rounded-full"
                              style={{
                                width: `${lead.intelligence.buy_intent_score}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm text-[var(--arq-gray-600)]">
                            {lead.intelligence.buy_intent_score}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2 py-1 rounded text-xs font-medium ${getUrgencyColor(
                            lead.intelligence.urgency
                          )}`}
                        >
                          {lead.intelligence.urgency}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-[var(--arq-gray-600)] capitalize">
                          {lead.intelligence.qualification_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-[var(--arq-gray-500)]">
                        {new Date(lead.intelligence.updated_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Lead Detail Modal */}
        {selectedLead && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => setSelectedLead(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-[var(--arq-gray-200)]">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-[var(--arq-black)]">
                      {selectedLead.user.name || "Anonymous Lead"}
                    </h2>
                    <p className="text-[var(--arq-gray-500)]">
                      {selectedLead.user.email || "No email provided"}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedLead(null)}
                    className="p-2 hover:bg-[var(--arq-gray-100)] rounded-lg transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Contact Info */}
                <div>
                  <h3 className="font-semibold text-[var(--arq-black)] mb-3">
                    Contact Information
                  </h3>
                  <dl className="grid grid-cols-2 gap-4">
                    <div>
                      <dt className="text-sm text-[var(--arq-gray-500)]">
                        Company
                      </dt>
                      <dd className="text-[var(--arq-black)]">
                        {selectedLead.user.company || "-"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-[var(--arq-gray-500)]">
                        Job Title
                      </dt>
                      <dd className="text-[var(--arq-black)]">
                        {selectedLead.user.job_title || "-"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-[var(--arq-gray-500)]">
                        Phone
                      </dt>
                      <dd className="text-[var(--arq-black)]">
                        {selectedLead.user.phone || "-"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-[var(--arq-gray-500)]">
                        Location
                      </dt>
                      <dd className="text-[var(--arq-black)]">
                        {selectedLead.user.location || "-"}
                      </dd>
                    </div>
                  </dl>
                </div>

                {/* Intelligence */}
                <div>
                  <h3 className="font-semibold text-[var(--arq-black)] mb-3">
                    Lead Intelligence
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-[var(--arq-gray-50)] rounded-lg">
                      <p className="text-sm text-[var(--arq-gray-500)]">
                        Intent Score
                      </p>
                      <p className="text-2xl font-bold text-[var(--arq-blue)]">
                        {selectedLead.intelligence.buy_intent_score}/100
                      </p>
                    </div>
                    <div className="p-4 bg-[var(--arq-gray-50)] rounded-lg">
                      <p className="text-sm text-[var(--arq-gray-500)]">
                        Company Size
                      </p>
                      <p className="text-lg font-semibold text-[var(--arq-black)] capitalize">
                        {selectedLead.intelligence.company_size || "Unknown"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Behavioral Signals */}
                {selectedLead.intelligence.behavioral_signals &&
                  selectedLead.intelligence.behavioral_signals.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-[var(--arq-black)] mb-3">
                        Behavioral Signals
                      </h3>
                      <div className="space-y-2">
                        {selectedLead.intelligence.behavioral_signals
                          .slice(-10)
                          .map((signal, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-3 p-3 bg-[var(--arq-gray-50)] rounded-lg"
                            >
                              <span className="px-2 py-1 text-xs font-medium bg-[var(--arq-blue)]/10 text-[var(--arq-blue)] rounded">
                                {signal.type.replace(/_/g, " ")}
                              </span>
                              <span className="text-sm text-[var(--arq-gray-600)] truncate flex-1">
                                {signal.content.substring(0, 100)}...
                              </span>
                              <span className="text-xs text-[var(--arq-gray-400)]">
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
                    <h3 className="font-semibold text-[var(--arq-black)] mb-3">
                      Company Research
                    </h3>
                    <dl className="grid grid-cols-2 gap-4">
                      {selectedLead.intelligence.company_research.industry && (
                        <div>
                          <dt className="text-sm text-[var(--arq-gray-500)]">
                            Industry
                          </dt>
                          <dd className="text-[var(--arq-black)]">
                            {selectedLead.intelligence.company_research.industry}
                          </dd>
                        </div>
                      )}
                      {selectedLead.intelligence.company_research
                        .compliance_requirements &&
                        selectedLead.intelligence.company_research
                          .compliance_requirements.length > 0 && (
                          <div className="col-span-2">
                            <dt className="text-sm text-[var(--arq-gray-500)] mb-1">
                              Compliance Requirements
                            </dt>
                            <dd className="flex flex-wrap gap-2">
                              {selectedLead.intelligence.company_research.compliance_requirements.map(
                                (req) => (
                                  <span
                                    key={req}
                                    className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded"
                                  >
                                    {req}
                                  </span>
                                )
                              )}
                            </dd>
                          </div>
                        )}
                    </dl>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
}
