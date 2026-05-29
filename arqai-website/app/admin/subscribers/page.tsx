"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Subscription {
  id: string;
  email: string;
  source: string;
  segment: string;
  status: string;
  created_at: string;
  updated_at?: string;
}

interface Stats {
  total: number;
  active: number;
}

export default function SubscribersPage() {
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  async function fetchSubscriptions() {
    try {
      setLoading(true);

      const response = await fetch("/api/newsletter");

      if (response.status === 401) {
        router.push("/admin/login");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch subscriptions");
      }

      const data = await response.json();
      setSubscriptions(data.subscriptions || []);
      setStats(data.stats || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  async function deleteSubscription(id: string) {
    try {
      const response = await fetch(`/api/newsletter?id=${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setSubscriptions(subscriptions.filter(s => s.id !== id));
        setDeleteConfirm(null);
        if (stats) {
          setStats({ ...stats, total: stats.total - 1 });
        }
      }
    } catch (err) {
      console.error("Failed to delete subscription:", err);
    }
  }

  async function exportCSV() {
    setExporting(true);
    try {
      const response = await fetch("/api/admin/export?type=subscribers");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `subscribers-${new Date().toISOString().split("T")[0]}.csv`;
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

  function getSegmentBadge(segment: string): { bg: string; text: string } {
    const badges: Record<string, { bg: string; text: string }> = {
      general: { bg: "bg-gray-100 text-gray-700", text: "General" },
      content_interested: { bg: "bg-blue-100 text-blue-700", text: "Content Interested" },
      resource_seeker: { bg: "bg-purple-100 text-purple-700", text: "Resource Seeker" },
      high_intent: { bg: "bg-red-100 text-red-700", text: "High Intent" },
      engaged_visitor: { bg: "bg-green-100 text-green-700", text: "Engaged Visitor" },
    };
    return badges[segment] || badges.general;
  }

  function getSourceBadge(source: string): string {
    const sources: Record<string, string> = {
      footer: "Footer",
      blog: "Blog",
      whitepaper: "Whitepaper",
      demo: "Demo",
      popup: "Popup",
    };
    return sources[source] || source;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading subscribers...</p>
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
              <h1 className="text-xl font-semibold text-gray-900">Newsletter Subscribers</h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={exportCSV}
                disabled={exporting || subscriptions.length === 0}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                {exporting ? "Exporting..." : "Export CSV"}
              </button>
              <button
                onClick={fetchSubscriptions}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <p className="text-sm text-gray-500 mb-1">Total Subscribers</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <p className="text-sm text-gray-500 mb-1">Active Subscribers</p>
              <p className="text-3xl font-bold text-green-600">{stats.active}</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <p className="text-sm text-gray-500 mb-1">This Month</p>
              <p className="text-3xl font-bold text-blue-600">
                {subscriptions.filter(s => {
                  const subDate = new Date(s.created_at);
                  const now = new Date();
                  return subDate.getMonth() === now.getMonth() && subDate.getFullYear() === now.getFullYear();
                }).length}
              </p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <p className="text-sm text-gray-500 mb-1">Conversion Rate</p>
              <p className="text-3xl font-bold text-purple-600">
                {stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0}%
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Subscribers Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">All Subscribers</h2>
          </div>

          {subscriptions.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-500">No subscribers yet</p>
              <p className="text-sm text-gray-400 mt-1">Subscribers will appear here when people sign up</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Source
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Segment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subscribed
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {subscriptions.map((sub) => {
                    const segmentBadge = getSegmentBadge(sub.segment);
                    return (
                      <tr key={sub.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900">{sub.email}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-500">{getSourceBadge(sub.source)}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${segmentBadge.bg}`}>
                            {segmentBadge.text}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            sub.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                          }`}>
                            {sub.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(sub.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => setDeleteConfirm(sub.id)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                          >
                            Delete
                          </button>
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
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Subscriber</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this subscriber? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteSubscription(deleteConfirm)}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
