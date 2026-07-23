"use client";

/**
 * Admin Home: the start-of-day screen. Answers, at a glance:
 * who needs action now, what follow-ups slipped, what just came in across
 * every channel, and whether the automation (research agent) is healthy.
 * Every block links straight to where the work happens.
 */

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import AdminHeader from "@/components/admin/AdminHeader";
import {
  PRIORITY_COLORS,
  getTimeAgo,
  whyLine,
} from "@/components/admin/leads/leadUi";

interface HomeLead {
  id: string;
  canonical_email?: string;
  name?: string;
  company?: string;
  priority_tier: string;
  composite_score: number;
  last_touch: string;
  next_step?: string;
  next_step_due_at?: string;
  top_signals?: string[];
  recommended_action?: string;
}

interface HomeAlert {
  id: string;
  title?: string;
  alert_type?: string;
  message?: string;
  lead_profile_id?: string;
  created_at?: string;
}

interface InboundItem {
  id: string;
  source: "contact" | "partner" | "download" | "subscriber";
  name?: string;
  email?: string;
  company?: string;
  detail?: string;
  created_at: string;
}

interface HomeData {
  counts: {
    hot_uncontacted: number;
    overdue: number;
    new_this_week: number;
    total_leads: number;
    active_alerts: number;
  };
  hot_leads: HomeLead[];
  overdue_leads: HomeLead[];
  alerts: HomeAlert[];
  research: { queued: number; running: number; failed_7d: number; completed_7d: number };
  inbound: InboundItem[];
  inbound_week_counts: Record<string, number>;
}

const SOURCE_LINKS: Record<InboundItem["source"], string> = {
  contact: "/admin/contacts",
  partner: "/admin/partners",
  download: "/admin/resources",
  subscriber: "/admin/subscribers",
};

const SOURCE_DOTS: Record<InboundItem["source"], string> = {
  contact: "bg-emerald-500",
  partner: "bg-purple-500",
  download: "bg-blue-500",
  subscriber: "bg-slate-400",
};

export default function AdminHomePage() {
  const [data, setData] = useState<HomeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/home");
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      if (!res.ok) throw new Error("Failed to load");
      setData(await res.json());
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load the dashboard");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [fetchData]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-500 text-xs">Loading your day...</p>
        </div>
      </div>
    );
  }

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  })();

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminHeader
        title={greeting}
        subtitle="Here is what needs your attention"
        onRefresh={fetchData}
      />

      <div className="p-5 space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        {data && (
          <>
            {/* Top counts: each links to the filtered view */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <Link
                href="/admin/leads-v2"
                className="p-4 bg-white rounded-md border border-slate-200 hover:shadow-sm transition-all"
              >
                <p className="text-2xl font-semibold text-red-600">
                  {data.counts.hot_uncontacted}
                </p>
                <p className="text-xs font-medium text-slate-900 mt-0.5">
                  Hot, not contacted
                </p>
                <p className="text-[10px] text-slate-400">P1/P2 waiting on you</p>
              </Link>
              <Link
                href="/admin/leads-v2"
                className="p-4 bg-white rounded-md border border-slate-200 hover:shadow-sm transition-all"
              >
                <p className="text-2xl font-semibold text-amber-600">
                  {data.counts.overdue}
                </p>
                <p className="text-xs font-medium text-slate-900 mt-0.5">
                  Overdue follow-ups
                </p>
                <p className="text-[10px] text-slate-400">Past their due date</p>
              </Link>
              <Link
                href="/admin/leads-v2"
                className="p-4 bg-white rounded-md border border-slate-200 hover:shadow-sm transition-all"
              >
                <p className="text-2xl font-semibold text-blue-600">
                  {data.counts.new_this_week}
                </p>
                <p className="text-xs font-medium text-slate-900 mt-0.5">New this week</p>
                <p className="text-[10px] text-slate-400">
                  of {data.counts.total_leads} tracked leads
                </p>
              </Link>
              <Link
                href="/admin/alerts"
                className="p-4 bg-white rounded-md border border-slate-200 hover:shadow-sm transition-all"
              >
                <p className="text-2xl font-semibold text-purple-600">
                  {data.counts.active_alerts}
                </p>
                <p className="text-xs font-medium text-slate-900 mt-0.5">Active alerts</p>
                <p className="text-[10px] text-slate-400">Signals worth a look</p>
              </Link>
            </div>

            {/* Research agent health */}
            <div className="flex items-center gap-2 text-[11px]">
              <span className="text-slate-400 uppercase tracking-wider font-semibold text-[10px]">
                Research agent
              </span>
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded font-medium">
                {data.research.completed_7d} dossiers this week
              </span>
              {data.research.queued + data.research.running > 0 && (
                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded font-medium">
                  {data.research.queued + data.research.running} in progress
                </span>
              )}
              {data.research.failed_7d > 0 && (
                <span className="px-2 py-0.5 bg-red-50 text-red-700 rounded font-medium">
                  {data.research.failed_7d} failed
                </span>
              )}
            </div>

            <div className="grid lg:grid-cols-2 gap-4">
              {/* Act now: hot uncontacted */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-md border border-slate-200 p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-slate-900">Act now</h2>
                  <Link
                    href="/admin/leads-v2"
                    className="text-[11px] text-slate-400 hover:text-slate-700"
                  >
                    All leads
                  </Link>
                </div>
                {data.hot_leads.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center">
                    No hot leads waiting. Inbox zero.
                  </p>
                ) : (
                  <div className="space-y-1">
                    {data.hot_leads.map((lead) => {
                      const pc = PRIORITY_COLORS[lead.priority_tier] || PRIORITY_COLORS.P4;
                      return (
                        <button
                          key={lead.id}
                          onClick={() => router.push(`/admin/leads-v2/${lead.id}`)}
                          className="w-full flex items-center gap-2.5 p-2 rounded hover:bg-slate-50 text-left transition-colors"
                        >
                          <span
                            className={`px-1.5 py-0.5 ${pc.bg} rounded text-[10px] font-semibold ${pc.text} flex-shrink-0`}
                          >
                            {lead.priority_tier}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-slate-900 truncate">
                              {lead.name || lead.canonical_email || "Anonymous"}
                              {lead.company ? (
                                <span className="text-slate-400 font-normal">
                                  {" "}
                                  · {lead.company}
                                </span>
                              ) : null}
                            </p>
                            <p className="text-[10px] text-slate-500 truncate">
                              {whyLine(lead.top_signals, lead.recommended_action)}
                            </p>
                          </div>
                          <span className="text-[10px] text-slate-400 flex-shrink-0">
                            {getTimeAgo(lead.last_touch)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Overdue follow-ups fold into the same card */}
                {data.overdue_leads.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <h3 className="text-[10px] font-semibold text-amber-600 uppercase tracking-wider mb-2">
                      Overdue follow-ups
                    </h3>
                    <div className="space-y-1">
                      {data.overdue_leads.map((lead) => (
                        <button
                          key={lead.id}
                          onClick={() => router.push(`/admin/leads-v2/${lead.id}`)}
                          className="w-full flex items-center gap-2.5 p-2 rounded hover:bg-slate-50 text-left transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-slate-900 truncate">
                              {lead.name || lead.canonical_email || "Anonymous"}
                            </p>
                            <p className="text-[10px] text-red-600 truncate">
                              {lead.next_step}
                              {lead.next_step_due_at
                                ? ` · due ${new Date(lead.next_step_due_at).toLocaleDateString()}`
                                : ""}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Fresh inbound across all sources */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="bg-white rounded-md border border-slate-200 p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-slate-900">Just came in</h2>
                  <div className="flex gap-2 text-[10px] text-slate-400">
                    {Object.entries(data.inbound_week_counts)
                      .filter(([, count]) => count > 0)
                      .map(([source, count]) => (
                        <span key={source}>
                          {count} {source}
                          {count !== 1 ? "s" : ""} (7d)
                        </span>
                      ))}
                  </div>
                </div>
                {data.inbound.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center">
                    No recent submissions.
                  </p>
                ) : (
                  <div className="space-y-1">
                    {data.inbound.map((item) => (
                      <Link
                        key={item.id}
                        href={SOURCE_LINKS[item.source]}
                        className="flex items-center gap-2.5 p-2 rounded hover:bg-slate-50 transition-colors"
                      >
                        <span
                          className={`w-2 h-2 rounded-full flex-shrink-0 ${SOURCE_DOTS[item.source]}`}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-slate-900 truncate">
                            {item.name || item.email || "Unknown"}
                            {item.company ? (
                              <span className="text-slate-400 font-normal">
                                {" "}
                                · {item.company}
                              </span>
                            ) : null}
                          </p>
                          <p className="text-[10px] text-slate-500 truncate">{item.detail}</p>
                        </div>
                        <span className="text-[10px] text-slate-400 flex-shrink-0">
                          {getTimeAgo(item.created_at)}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Alerts preview */}
                {data.alerts.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-[10px] font-semibold text-purple-600 uppercase tracking-wider">
                        Latest alerts
                      </h3>
                      <Link
                        href="/admin/alerts"
                        className="text-[10px] text-slate-400 hover:text-slate-700"
                      >
                        All alerts
                      </Link>
                    </div>
                    <div className="space-y-1.5">
                      {data.alerts.slice(0, 3).map((a) => (
                        <Link
                          key={a.id}
                          href={
                            a.lead_profile_id
                              ? `/admin/leads-v2/${a.lead_profile_id}`
                              : "/admin/alerts"
                          }
                          className="block p-2 bg-slate-50 rounded hover:bg-slate-100 transition-colors"
                        >
                          <p className="text-[11px] font-medium text-slate-800 truncate">
                            {a.title || a.alert_type}
                          </p>
                          {a.message && (
                            <p className="text-[10px] text-slate-500 truncate">{a.message}</p>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
