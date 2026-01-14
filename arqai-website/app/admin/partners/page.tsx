"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface PartnerEnquiry {
  id: string;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  job_title: string | null;
  partnership_type: string;
  company_size: string | null;
  message: string | null;
  website: string | null;
  status: string;
  priority: string;
  notes: string | null;
  assigned_to: string | null;
  last_contact_at: string | null;
  created_at: string;
}

interface Stats {
  total: number;
  new: number;
  contacted: number;
  qualified: number;
  negotiating: number;
  closedWon: number;
  closedLost: number;
  highPriority: number;
}

export default function PartnersAdminPage() {
  const router = useRouter();
  const [enquiries, setEnquiries] = useState<PartnerEnquiry[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEnquiry, setSelectedEnquiry] = useState<PartnerEnquiry | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterType, setFilterType] = useState<string>("");

  useEffect(() => {
    fetchEnquiries();
  }, [filterStatus, filterType]);

  async function fetchEnquiries() {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (filterStatus) params.set("status", filterStatus);
      if (filterType) params.set("partnership_type", filterType);

      const response = await fetch(`/api/admin/partner-enquiries?${params.toString()}`);

      if (response.status === 401) {
        router.push("/admin/login");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch partner enquiries");
      }

      const data = await response.json();
      setEnquiries(data.enquiries || []);
      setStats(data.stats || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  async function updateEnquiry(id: string, updates: Partial<PartnerEnquiry>) {
    try {
      await fetch("/api/admin/partner-enquiries", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, ...updates }),
      });
      fetchEnquiries();
      if (selectedEnquiry?.id === id) {
        setSelectedEnquiry({ ...selectedEnquiry, ...updates } as PartnerEnquiry);
      }
    } catch (err) {
      console.error("Failed to update enquiry:", err);
    }
  }

  async function deleteEnquiry(id: string) {
    try {
      const response = await fetch(`/api/admin/partner-enquiries?id=${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setEnquiries(enquiries.filter((e) => e.id !== id));
        setDeleteConfirm(null);
        if (selectedEnquiry?.id === id) {
          setSelectedEnquiry(null);
        }
      }
    } catch (err) {
      console.error("Failed to delete enquiry:", err);
    }
  }

  async function exportCSV() {
    setExporting(true);
    try {
      const response = await fetch("/api/admin/export?type=partners");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `partner-enquiries-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to export:", err);
    } finally {
      setExporting(false);
    }
  }

  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function getStatusBadge(status: string): { bg: string; text: string } {
    const badges: Record<string, { bg: string; text: string }> = {
      new: { bg: "bg-blue-100 text-blue-700", text: "New" },
      contacted: { bg: "bg-yellow-100 text-yellow-700", text: "Contacted" },
      qualified: { bg: "bg-purple-100 text-purple-700", text: "Qualified" },
      negotiating: { bg: "bg-orange-100 text-orange-700", text: "Negotiating" },
      "closed-won": { bg: "bg-green-100 text-green-700", text: "Won" },
      "closed-lost": { bg: "bg-gray-100 text-gray-700", text: "Lost" },
    };
    return badges[status] || badges.new;
  }

  function getTypeBadge(type: string): { bg: string; text: string } {
    const badges: Record<string, { bg: string; text: string }> = {
      technology: { bg: "bg-indigo-100 text-indigo-700", text: "Technology" },
      reseller: { bg: "bg-green-100 text-green-700", text: "Reseller" },
      integration: { bg: "bg-orange-100 text-orange-700", text: "Integration" },
      strategic: { bg: "bg-red-100 text-red-700", text: "Strategic" },
      general: { bg: "bg-gray-100 text-gray-700", text: "General" },
    };
    return badges[type] || badges.general;
  }

  function getPriorityBadge(priority: string): { bg: string; text: string } {
    const badges: Record<string, { bg: string; text: string }> = {
      high: { bg: "bg-red-100 text-red-700", text: "High" },
      medium: { bg: "bg-yellow-100 text-yellow-700", text: "Medium" },
      low: { bg: "bg-gray-100 text-gray-600", text: "Low" },
    };
    return badges[priority] || badges.medium;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading partner enquiries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="text-gray-500 hover:text-gray-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">Partner Enquiries</h1>
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xs font-medium text-white">Pipeline</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={exportCSV}
                disabled={exporting || enquiries.length === 0}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                {exporting ? "Exporting..." : "Export CSV"}
              </button>
              <button
                onClick={fetchEnquiries}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <p className="text-xs text-gray-500 mb-1">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-white rounded-lg border border-blue-200 p-4">
              <p className="text-xs text-gray-500 mb-1">New</p>
              <p className="text-2xl font-bold text-blue-600">{stats.new}</p>
            </div>
            <div className="bg-white rounded-lg border border-yellow-200 p-4">
              <p className="text-xs text-gray-500 mb-1">Contacted</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.contacted}</p>
            </div>
            <div className="bg-white rounded-lg border border-purple-200 p-4">
              <p className="text-xs text-gray-500 mb-1">Qualified</p>
              <p className="text-2xl font-bold text-purple-600">{stats.qualified}</p>
            </div>
            <div className="bg-white rounded-lg border border-orange-200 p-4">
              <p className="text-xs text-gray-500 mb-1">Negotiating</p>
              <p className="text-2xl font-bold text-orange-600">{stats.negotiating}</p>
            </div>
            <div className="bg-white rounded-lg border border-green-200 p-4">
              <p className="text-xs text-gray-500 mb-1">Won</p>
              <p className="text-2xl font-bold text-green-600">{stats.closedWon}</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <p className="text-xs text-gray-500 mb-1">Lost</p>
              <p className="text-2xl font-bold text-gray-500">{stats.closedLost}</p>
            </div>
            <div className="bg-white rounded-lg border border-red-200 p-4">
              <p className="text-xs text-gray-500 mb-1">High Priority</p>
              <p className="text-2xl font-bold text-red-600">{stats.highPriority}</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Statuses</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="negotiating">Negotiating</option>
                <option value="closed-won">Won</option>
                <option value="closed-lost">Lost</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Partnership Type</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Types</option>
                <option value="technology">Technology</option>
                <option value="reseller">Reseller</option>
                <option value="integration">Integration</option>
                <option value="strategic">Strategic</option>
                <option value="general">General</option>
              </select>
            </div>
            {(filterStatus || filterType) && (
              <button
                onClick={() => {
                  setFilterStatus("");
                  setFilterType("");
                }}
                className="self-end px-3 py-2 text-sm text-gray-600 hover:text-gray-900"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Enquiries Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Partner Enquiries</h2>
          </div>

          {enquiries.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-gray-500">No partner enquiries yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {enquiries.map((enquiry) => {
                    const statusBadge = getStatusBadge(enquiry.status);
                    const typeBadge = getTypeBadge(enquiry.partnership_type);
                    const priorityBadge = getPriorityBadge(enquiry.priority);
                    return (
                      <tr key={enquiry.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{enquiry.name}</p>
                            <p className="text-sm text-gray-500">{enquiry.email}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-900">{enquiry.company || "-"}</p>
                          <p className="text-sm text-gray-500">{enquiry.job_title || "-"}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${typeBadge.bg}`}>
                            {typeBadge.text}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusBadge.bg}`}>
                            {statusBadge.text}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${priorityBadge.bg}`}>
                            {priorityBadge.text}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {formatDate(enquiry.created_at)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => setSelectedEnquiry(enquiry)}
                              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                            >
                              View
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(enquiry.id)}
                              className="text-red-600 hover:text-red-800 text-sm font-medium"
                            >
                              Delete
                            </button>
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
      </main>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Enquiry</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this partner enquiry? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteEnquiry(deleteConfirm)}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enquiry Detail Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Partner Enquiry Details</h3>
                <button
                  onClick={() => setSelectedEnquiry(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{selectedEnquiry.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <a href={`mailto:${selectedEnquiry.email}`} className="font-medium text-indigo-600 hover:underline">
                    {selectedEnquiry.email}
                  </a>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Company</p>
                  <p className="font-medium">{selectedEnquiry.company || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Job Title</p>
                  <p className="font-medium">{selectedEnquiry.job_title || "-"}</p>
                </div>
                {selectedEnquiry.phone && (
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{selectedEnquiry.phone}</p>
                  </div>
                )}
                {selectedEnquiry.website && (
                  <div>
                    <p className="text-sm text-gray-500">Website</p>
                    <a href={selectedEnquiry.website} target="_blank" rel="noopener noreferrer" className="font-medium text-indigo-600 hover:underline">
                      {selectedEnquiry.website}
                    </a>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500">Partnership Type</p>
                  <p className="font-medium capitalize">{selectedEnquiry.partnership_type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Company Size</p>
                  <p className="font-medium capitalize">{selectedEnquiry.company_size || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Submitted</p>
                  <p className="font-medium">{formatDate(selectedEnquiry.created_at)}</p>
                </div>
                {selectedEnquiry.last_contact_at && (
                  <div>
                    <p className="text-sm text-gray-500">Last Contact</p>
                    <p className="font-medium">{formatDate(selectedEnquiry.last_contact_at)}</p>
                  </div>
                )}
              </div>

              {/* Message */}
              {selectedEnquiry.message && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Message / Use Case</p>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedEnquiry.message}</p>
                  </div>
                </div>
              )}

              {/* Status Update */}
              <div>
                <p className="text-sm text-gray-500 mb-2">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  {["new", "contacted", "qualified", "negotiating", "closed-won", "closed-lost"].map((status) => (
                    <button
                      key={status}
                      onClick={() => updateEnquiry(selectedEnquiry.id, { status })}
                      className={`px-3 py-1.5 text-sm font-medium rounded-lg border ${
                        selectedEnquiry.status === status
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {status === "new" ? "New" : status === "closed-won" ? "Won" : status === "closed-lost" ? "Lost" : status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Priority Update */}
              <div>
                <p className="text-sm text-gray-500 mb-2">Priority</p>
                <div className="flex gap-2">
                  {["high", "medium", "low"].map((priority) => (
                    <button
                      key={priority}
                      onClick={() => updateEnquiry(selectedEnquiry.id, { priority })}
                      className={`px-3 py-1.5 text-sm font-medium rounded-lg border ${
                        selectedEnquiry.priority === priority
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <p className="text-sm text-gray-500 mb-2">Internal Notes</p>
                <textarea
                  value={selectedEnquiry.notes || ""}
                  onChange={(e) => setSelectedEnquiry({ ...selectedEnquiry, notes: e.target.value })}
                  onBlur={() => updateEnquiry(selectedEnquiry.id, { notes: selectedEnquiry.notes })}
                  placeholder="Add internal notes..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  rows={3}
                />
              </div>

              {/* Assigned To */}
              <div>
                <p className="text-sm text-gray-500 mb-2">Assigned To</p>
                <input
                  type="text"
                  value={selectedEnquiry.assigned_to || ""}
                  onChange={(e) => setSelectedEnquiry({ ...selectedEnquiry, assigned_to: e.target.value })}
                  onBlur={() => updateEnquiry(selectedEnquiry.id, { assigned_to: selectedEnquiry.assigned_to })}
                  placeholder="Enter team member name or email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                <button
                  onClick={() => setDeleteConfirm(selectedEnquiry.id)}
                  className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-800"
                >
                  Delete this enquiry
                </button>
                <a
                  href={`mailto:${selectedEnquiry.email}`}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                >
                  Reply via Email
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
