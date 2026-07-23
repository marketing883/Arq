"use client";

/**
 * Insights: marketing analytics that answer decisions, not vanity questions.
 *
 * Built on the one edge this stack has over generic analytics: journeys are
 * linked to lead profiles. Every block reads in terms of visits AND the leads
 * they produced: which channels convert, which content assists pipeline,
 * who is on the site right now, and whether tracking itself is healthy.
 */

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import AdminHeader from "@/components/admin/AdminHeader";
import { PRIORITY_COLORS } from "@/components/admin/leads/leadUi";
import type { RealTimeStats } from "@/types/analytics";
import type { MarketingInsights } from "@/lib/analytics/marketing-insights";

type Range = "7d" | "30d" | "90d";

const RANGE_LABELS: Record<Range, string> = {
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  "90d": "Last 90 days",
};

function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return "0s";
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  if (m === 0) return `${s}s`;
  return `${m}m ${s.toString().padStart(2, "0")}s`;
}

function pct(n: number): string {
  return `${(n * 100).toFixed(1)}%`;
}

/** Delta pill vs previous period. invert=true when down is good (bounce). */
function DeltaPill({
  current,
  previous,
  invert = false,
}: {
  current: number;
  previous: number;
  invert?: boolean;
}) {
  if (previous === 0 && current === 0) {
    return <span className="text-[10px] text-slate-300">no prior data</span>;
  }
  const change = previous === 0 ? 1 : (current - previous) / previous;
  const up = change >= 0;
  const good = invert ? !up : up;
  const label = previous === 0 ? "new" : `${up ? "+" : ""}${Math.round(change * 100)}%`;
  return (
    <span
      className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
        good ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
      }`}
    >
      {label}
    </span>
  );
}

/** Dual-series inline SVG trend: visits area + identified leads line. */
function TrendChart({ trend }: { trend: MarketingInsights["trend"] }) {
  const W = 720;
  const H = 140;
  const PAD = 8;
  if (trend.length < 2) {
    return <p className="text-xs text-slate-400 py-6 text-center">Not enough data yet.</p>;
  }
  const maxVisits = Math.max(1, ...trend.map((t) => t.visits));
  const maxIdent = Math.max(1, ...trend.map((t) => t.identified));
  const x = (i: number) => PAD + (i / (trend.length - 1)) * (W - PAD * 2);
  const yV = (v: number) => H - PAD - (v / maxVisits) * (H - PAD * 2);
  const yI = (v: number) => H - PAD - (v / maxIdent) * (H - PAD * 2);

  const visitsPath = trend
    .map((t, i) => `${i === 0 ? "M" : "L"}${x(i)},${yV(t.visits)}`)
    .join(" ");
  const areaPath = `${visitsPath} L${x(trend.length - 1)},${H - PAD} L${x(0)},${H - PAD} Z`;
  const identPath = trend
    .map((t, i) => `${i === 0 ? "M" : "L"}${x(i)},${yI(t.identified)}`)
    .join(" ");

  const labelEvery = Math.max(1, Math.floor(trend.length / 6));

  return (
    <div>
      <svg
        viewBox={`0 0 ${W} ${H + 18}`}
        className="w-full"
        role="img"
        aria-label="Visits and identified leads per day"
      >
        <path d={areaPath} fill="rgb(59 130 246 / 0.08)" />
        <path d={visitsPath} fill="none" stroke="rgb(59 130 246)" strokeWidth="1.5" />
        <path d={identPath} fill="none" stroke="rgb(16 185 129)" strokeWidth="1.5" />
        {trend.map((t, i) =>
          t.identified > 0 ? (
            <circle key={t.date} cx={x(i)} cy={yI(t.identified)} r="2.5" fill="rgb(16 185 129)" />
          ) : null
        )}
        {trend.map((t, i) =>
          i % labelEvery === 0 ? (
            <text
              key={t.date}
              x={x(i)}
              y={H + 12}
              fontSize="9"
              fill="rgb(148 163 184)"
              textAnchor="middle"
            >
              {t.date.slice(5)}
            </text>
          ) : null
        )}
      </svg>
      <div className="flex items-center gap-4 mt-1">
        <span className="flex items-center gap-1.5 text-[10px] text-slate-500">
          <span className="w-3 h-0.5 bg-blue-500 inline-block rounded" /> Visits
        </span>
        <span className="flex items-center gap-1.5 text-[10px] text-slate-500">
          <span className="w-2 h-2 bg-emerald-500 inline-block rounded-full" /> Identified leads
        </span>
        <span className="text-[10px] text-slate-300">scales independent</span>
      </div>
    </div>
  );
}

function MeterBar({ value, max, className }: { value: number; max: number; className: string }) {
  const width = max > 0 ? Math.max(2, (value / max) * 100) : 0;
  return (
    <div className="h-1 w-full bg-slate-100 rounded overflow-hidden mt-1">
      <div className={`h-full rounded ${className}`} style={{ width: `${width}%` }} />
    </div>
  );
}

export default function InsightsPage() {
  const [range, setRange] = useState<Range>("7d");
  const [data, setData] = useState<MarketingInsights | null>(null);
  const [live, setLive] = useState<RealTimeStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  const fetchInsights = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/analytics?action=marketing&range=${range}`);
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      if (!res.ok) throw new Error("failed");
      setData(await res.json());
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load insights");
    } finally {
      setIsLoading(false);
    }
  }, [range, router]);

  const fetchLive = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/analytics?action=realtime`);
      if (res.ok) setLive(await res.json());
    } catch {
      // live strip is best-effort
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    fetchInsights();
  }, [fetchInsights]);

  useEffect(() => {
    fetchLive();
    const interval = setInterval(fetchLive, 30000);
    return () => clearInterval(interval);
  }, [fetchLive]);

  if (isLoading && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-500 text-xs">Reading the signals...</p>
        </div>
      </div>
    );
  }

  const maxChannelVisits = Math.max(1, ...(data?.channels || []).map((c) => c.visits));
  const trackingAlive =
    !!data?.health.last_event_at &&
    Date.now() - new Date(data.health.last_event_at).getTime() < 24 * 60 * 60 * 1000;

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminHeader
        title="Insights"
        subtitle="Which channels and content actually produce leads"
        onRefresh={() => {
          fetchInsights();
          fetchLive();
        }}
      />

      <div className="p-5 space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Live strip */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-md border border-slate-200 p-3.5 flex flex-wrap items-center gap-3"
        >
          <span className="flex items-center gap-2 text-xs font-medium text-slate-800">
            <span className="relative flex h-2.5 w-2.5">
              {(live?.active_visitors ?? 0) > 0 && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
              )}
              <span
                className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                  (live?.active_visitors ?? 0) > 0 ? "bg-emerald-500" : "bg-slate-300"
                }`}
              />
            </span>
            {live?.active_visitors ?? 0} on the site now
            <span className="text-slate-400 font-normal">(last 5 min)</span>
          </span>

          {(live?.pages_being_viewed || []).slice(0, 3).map((p) => (
            <span key={p.page_path} className="text-[11px] text-slate-500">
              {p.page_path} <span className="text-slate-300">x{p.active_viewers}</span>
            </span>
          ))}

          {/* Known leads browsing right now: strike while hot */}
          {(live?.identified_active || []).length > 0 && (
            <div className="flex items-center gap-2 ml-auto flex-wrap">
              <span className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wider">
                Known lead on site
              </span>
              {(live?.identified_active || []).slice(0, 3).map((v) => {
                const tierColor =
                  PRIORITY_COLORS[v.priority_tier || "P4"] || PRIORITY_COLORS.P4;
                return (
                  <Link
                    key={v.lead_profile_id}
                    href={`/admin/leads-v2/${v.lead_profile_id}`}
                    className={`px-2 py-1 rounded border text-[11px] font-medium hover:shadow-sm transition-all ${tierColor.bg} ${tierColor.text} ${tierColor.border}`}
                  >
                    {v.name || v.email}
                    {v.current_page ? (
                      <span className="opacity-60"> · {v.current_page}</span>
                    ) : null}
                  </Link>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Range selector */}
        <div className="flex items-center gap-1.5">
          {(Object.keys(RANGE_LABELS) as Range[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                range === r
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300"
              }`}
            >
              {RANGE_LABELS[r]}
            </button>
          ))}
          {isLoading && <span className="text-[10px] text-slate-400 ml-2">updating...</span>}
        </div>

        {data && (
          <>
            {/* KPI row */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
              <div className="p-4 bg-white rounded-md border border-slate-200">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Visitors
                  </p>
                  <DeltaPill current={data.kpis.visitors} previous={data.kpis.visitors_prev} />
                </div>
                <p className="text-2xl font-semibold text-slate-900 mt-1">
                  {data.kpis.visitors.toLocaleString()}
                </p>
                <p className="text-[10px] text-slate-400">
                  {data.kpis.total_page_views.toLocaleString()} page views
                </p>
              </div>

              <div className="p-4 bg-white rounded-md border border-slate-200">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Identified leads
                  </p>
                  <DeltaPill
                    current={data.kpis.identified_leads}
                    previous={data.kpis.identified_leads_prev}
                  />
                </div>
                <p className="text-2xl font-semibold text-emerald-600 mt-1">
                  {data.kpis.identified_leads}
                </p>
                <p className="text-[10px] text-slate-400">visitors who became known</p>
              </div>

              <div className="p-4 bg-white rounded-md border border-slate-200">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Lead conversion
                  </p>
                  <DeltaPill
                    current={data.kpis.lead_conversion_rate}
                    previous={data.kpis.lead_conversion_rate_prev}
                  />
                </div>
                <p className="text-2xl font-semibold text-slate-900 mt-1">
                  {pct(data.kpis.lead_conversion_rate)}
                </p>
                <p className="text-[10px] text-slate-400">visits that identified</p>
              </div>

              <div className="p-4 bg-white rounded-md border border-slate-200">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Avg session
                  </p>
                  <DeltaPill
                    current={data.kpis.avg_session_seconds}
                    previous={data.kpis.avg_session_seconds_prev}
                  />
                </div>
                <p className="text-2xl font-semibold text-slate-900 mt-1">
                  {formatDuration(data.kpis.avg_session_seconds)}
                </p>
                <p className="text-[10px] text-slate-400">honest, outliers capped</p>
              </div>

              <div className="p-4 bg-white rounded-md border border-slate-200">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Bounce rate
                </p>
                <p className="text-2xl font-semibold text-slate-900 mt-1">
                  {pct(data.kpis.bounce_rate)}
                </p>
                <p className="text-[10px] text-slate-400">
                  {pct(data.kpis.return_visitor_rate)} returning identified
                </p>
              </div>
            </div>

            {/* Trend */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-md border border-slate-200 p-4"
            >
              <h2 className="text-sm font-semibold text-slate-900 mb-2">
                Visits vs identified leads
              </h2>
              <TrendChart trend={data.trend} />
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-4">
              {/* Channels that convert */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-md border border-slate-200 p-4"
              >
                <h2 className="text-sm font-semibold text-slate-900 mb-1">
                  Channels that convert
                </h2>
                <p className="text-[11px] text-slate-400 mb-3">
                  Where visits come from, and which of them become leads
                </p>
                {data.channels.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center">No traffic yet.</p>
                ) : (
                  <div className="space-y-3">
                    {data.channels.map((c) => (
                      <div key={c.channel}>
                        <div className="flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <span className="text-xs font-medium text-slate-800">
                              {c.channel}
                            </span>
                            {c.top_sources.length > 0 && (
                              <span className="text-[10px] text-slate-400 ml-1.5">
                                {c.top_sources.join(", ")}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-[11px] flex-shrink-0">
                            <span className="text-slate-600 font-medium">
                              {c.visits.toLocaleString()} visits
                            </span>
                            <span
                              className={
                                c.identified_leads > 0
                                  ? "text-emerald-600 font-medium"
                                  : "text-slate-300"
                              }
                            >
                              {c.identified_leads} leads
                            </span>
                            <span
                              className={
                                c.hot_leads > 0 ? "text-red-600 font-medium" : "text-slate-300"
                              }
                            >
                              {c.hot_leads} hot
                            </span>
                          </div>
                        </div>
                        <MeterBar
                          value={c.visits}
                          max={maxChannelVisits}
                          className="bg-blue-400"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Campaigns fold in below when present */}
                {data.campaigns.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <h3 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      Campaigns
                    </h3>
                    <div className="space-y-1.5">
                      {data.campaigns.map((c) => (
                        <div
                          key={c.campaign}
                          className="flex items-center justify-between text-[11px]"
                        >
                          <span className="text-slate-700 truncate">{c.campaign}</span>
                          <span className="text-slate-500 flex-shrink-0">
                            {c.visits} visits ·{" "}
                            <span className={c.identified_leads > 0 ? "text-emerald-600" : ""}>
                              {c.identified_leads} leads
                            </span>
                            {c.hot_leads > 0 && (
                              <span className="text-red-600"> · {c.hot_leads} hot</span>
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Content that converts */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="bg-white rounded-md border border-slate-200 p-4"
              >
                <h2 className="text-sm font-semibold text-slate-900 mb-1">
                  Content that converts
                </h2>
                <p className="text-[11px] text-slate-400 mb-3">
                  Ranked by lead assists: pages appearing in identified leads&apos; journeys
                </p>
                {data.content.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center">No page data yet.</p>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr className="text-[10px] text-slate-400 uppercase tracking-wider">
                        <th className="text-left font-semibold pb-2">Page</th>
                        <th className="text-right font-semibold pb-2">Assists</th>
                        <th className="text-right font-semibold pb-2">Views</th>
                        <th className="text-right font-semibold pb-2">Time</th>
                        <th className="text-right font-semibold pb-2">Scroll</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.content.map((p) => (
                        <tr key={p.page_path} className="border-t border-slate-50">
                          <td className="py-1.5 pr-2 max-w-[220px]">
                            <p className="text-[11px] text-slate-700 truncate">{p.page_path}</p>
                          </td>
                          <td className="py-1.5 text-right">
                            <span
                              className={`text-[11px] font-semibold ${
                                p.lead_assists > 0 ? "text-emerald-600" : "text-slate-300"
                              }`}
                            >
                              {p.lead_assists}
                            </span>
                          </td>
                          <td className="py-1.5 text-right text-[11px] text-slate-600">
                            {p.views.toLocaleString()}
                          </td>
                          <td className="py-1.5 text-right text-[11px] text-slate-500">
                            {formatDuration(p.avg_time_seconds)}
                          </td>
                          <td className="py-1.5 text-right text-[11px] text-slate-500">
                            {p.avg_scroll_percent}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </motion.div>
            </div>

            {/* Geo, only when data exists (a VPS without CF headers has none) */}
            {(live?.geo_distribution || []).length > 0 && (
              <div className="bg-white rounded-md border border-slate-200 p-4">
                <h2 className="text-sm font-semibold text-slate-900 mb-2">
                  Recent visitors by country
                </h2>
                <div className="flex flex-wrap gap-2">
                  {(live?.geo_distribution || []).map((g) => (
                    <span
                      key={g.country}
                      className="px-2 py-1 bg-slate-50 rounded text-[11px] text-slate-600"
                    >
                      {g.country} <span className="font-semibold">{g.visitors}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Tracking health footer */}
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span
                className={`w-2 h-2 rounded-full ${
                  trackingAlive ? "bg-emerald-500" : "bg-red-500"
                }`}
              />
              Tracking {trackingAlive ? "healthy" : "silent for 24h+"} ·{" "}
              {data.health.events_today.toLocaleString()} events today
              {data.health.last_event_at
                ? ` · last event ${new Date(data.health.last_event_at).toLocaleTimeString()}`
                : " · no events recorded yet"}
              <span className="ml-auto">
                Internal /admin traffic is excluded from all numbers
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
