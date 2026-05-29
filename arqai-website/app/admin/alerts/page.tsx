"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import AdminHeader from "@/components/admin/AdminHeader";
import type { ActiveAlert, AlertPriority } from "@/types/lead-intelligence-v2";

interface GroupedAlerts {
  critical: ActiveAlert[];
  high: ActiveAlert[];
  medium: ActiveAlert[];
  low: ActiveAlert[];
}

interface AlertStats {
  critical: number;
  high: number;
  medium: number;
  low: number;
}

const PRIORITY_COLORS: Record<AlertPriority, { bg: string; text: string; border: string; icon: string }> = {
  critical: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", icon: "text-red-500" },
  high: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", icon: "text-amber-500" },
  medium: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", icon: "text-blue-500" },
  low: { bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-200", icon: "text-slate-400" },
};

const PRIORITY_LABELS: Record<AlertPriority, string> = {
  critical: "Critical",
  high: "High Priority",
  medium: "Medium Priority",
  low: "Low Priority",
};

const ALERT_TYPE_LABELS: Record<string, string> = {
  high_intent_score: "High Intent Score",
  score_spike: "Score Spike",
  multiple_touchpoints: "Multiple Touchpoints",
  stage_progression: "Stage Progression",
  demo_request: "Demo Request",
  budget_mention: "Budget Mentioned",
  competitor_mention: "Competitor Mentioned",
  urgent_timeline: "Urgent Timeline",
  enterprise_company: "Enterprise Company",
  returning_visitor: "Returning Visitor",
};

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

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<ActiveAlert[]>([]);
  const [grouped, setGrouped] = useState<GroupedAlerts | null>(null);
  const [stats, setStats] = useState<AlertStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const router = useRouter();

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/alerts");

      if (response.status === 401) {
        router.push("/admin/login");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch alerts");
      }

      const data = await response.json();
      setAlerts(data.alerts || []);
      setGrouped(data.grouped || null);
      setStats(data.by_priority || null);
    } catch (err) {
      setError("Failed to load alerts");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const handleAcknowledge = async (alertId: string) => {
    setProcessingId(alertId);
    try {
      const response = await fetch("/api/admin/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "acknowledge", alert_id: alertId }),
      });

      if (response.ok) {
        // Update local state
        setAlerts((prev) =>
          prev.map((a) =>
            a.id === alertId
              ? { ...a, acknowledged: true, acknowledged_at: new Date().toISOString() }
              : a
          )
        );
      }
    } catch (err) {
      console.error("Failed to acknowledge alert:", err);
    } finally {
      setProcessingId(null);
    }
  };

  const handleDismiss = async (alertId: string) => {
    setProcessingId(alertId);
    try {
      const response = await fetch("/api/admin/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "dismiss", alert_id: alertId }),
      });

      if (response.ok) {
        // Remove from local state
        setAlerts((prev) => prev.filter((a) => a.id !== alertId));
        fetchData(); // Refresh to update grouped/stats
      }
    } catch (err) {
      console.error("Failed to dismiss alert:", err);
    } finally {
      setProcessingId(null);
    }
  };

  useEffect(() => {
    fetchData();
    // Poll for new alerts every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-500 text-xs">Loading alerts...</p>
        </div>
      </div>
    );
  }

  const priorityOrder: AlertPriority[] = ["critical", "high", "medium", "low"];

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminHeader
        title="Smart Alerts"
        subtitle="Real-time notifications for high-priority leads"
        onRefresh={fetchData}
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

        {/* Alert Summary */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
            {priorityOrder.map((priority, idx) => {
              const count = stats[priority] || 0;
              const colors = PRIORITY_COLORS[priority];

              return (
                <motion.div
                  key={priority}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`${colors.bg} rounded-md p-4 border ${colors.border}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`${colors.text} text-xs font-medium capitalize`}>
                      {PRIORITY_LABELS[priority]}
                    </span>
                    <span className={`p-1.5 bg-white/50 rounded ${colors.icon}`}>
                      {priority === "critical" && (
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      )}
                      {priority === "high" && (
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                        </svg>
                      )}
                      {priority === "medium" && (
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      )}
                      {priority === "low" && (
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                      )}
                    </span>
                  </div>
                  <p className={`text-2xl font-semibold ${colors.text}`}>{count}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Active alerts</p>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Alerts List */}
        {alerts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-md p-10 text-center border border-slate-200"
          >
            <div className="w-12 h-12 bg-emerald-100 rounded-md flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-slate-900 mb-1">All caught up!</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              No active alerts. You&apos;ll be notified when high-priority leads require attention.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {priorityOrder.map((priority) => {
              const priorityAlerts = grouped?.[priority] || [];
              if (priorityAlerts.length === 0) return null;

              const colors = PRIORITY_COLORS[priority];

              return (
                <div key={priority}>
                  <h2 className={`text-xs font-semibold uppercase tracking-wider mb-2 ${colors.text}`}>
                    {PRIORITY_LABELS[priority]} ({priorityAlerts.length})
                  </h2>
                  <div className="space-y-2">
                    <AnimatePresence>
                      {priorityAlerts.map((alert, idx) => (
                        <motion.div
                          key={alert.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ delay: idx * 0.03 }}
                          className={`bg-white rounded-md p-4 border ${colors.border} ${
                            !!alert.acknowledged_at ? "opacity-60" : ""
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            {/* Priority Icon */}
                            <div className={`p-2 ${colors.bg} rounded flex-shrink-0`}>
                              {priority === "critical" && (
                                <svg className={`w-4 h-4 ${colors.icon}`} fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                              )}
                              {priority === "high" && (
                                <svg className={`w-4 h-4 ${colors.icon}`} fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                                </svg>
                              )}
                              {priority === "medium" && (
                                <svg className={`w-4 h-4 ${colors.icon}`} fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                              )}
                              {priority === "low" && (
                                <svg className={`w-4 h-4 ${colors.icon}`} fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>

                            {/* Alert Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`px-1.5 py-0.5 ${colors.bg} rounded text-[10px] font-medium ${colors.text}`}>
                                  {ALERT_TYPE_LABELS[alert.alert_type] || alert.alert_type}
                                </span>
                                {!!alert.acknowledged_at && (
                                  <span className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] font-medium text-slate-500">
                                    Acknowledged
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-slate-900 font-medium">
                                {alert.message}
                              </p>
                              <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-500">
                                <span>{getTimeAgo(alert.created_at)}</span>
                                {alert.canonical_email && (
                                  <a
                                    href={`mailto:${alert.canonical_email}`}
                                    className="text-blue-600 hover:underline"
                                  >
                                    {alert.canonical_email}
                                  </a>
                                )}
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1.5 flex-shrink-0">
                              {!!!alert.acknowledged_at && (
                                <button
                                  onClick={() => handleAcknowledge(alert.id)}
                                  disabled={processingId === alert.id}
                                  className="px-2.5 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 rounded hover:bg-slate-200 transition-colors disabled:opacity-50"
                                >
                                  {processingId === alert.id ? (
                                    <div className="w-3 h-3 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
                                  ) : (
                                    "Acknowledge"
                                  )}
                                </button>
                              )}
                              <button
                                onClick={() => handleDismiss(alert.id)}
                                disabled={processingId === alert.id}
                                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                                title="Dismiss alert"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                              <a
                                href={`/admin/leads-v2`}
                                className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded transition-colors"
                                title="View lead"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </a>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
