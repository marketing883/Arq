"use client";

/**
 * Analytics Dashboard
 *
 * Comprehensive analytics view with real-time stats,
 * traffic analysis, engagement metrics, and content performance.
 */

import { useState, useEffect, useCallback } from "react";

// ============================================
// TYPES
// ============================================

interface EngagementMetrics {
  total_page_views: number;
  unique_visitors: number;
  unique_sessions: number;
  avg_session_duration_seconds: number;
  avg_pages_per_session: number;
  bounce_rate: number;
}

interface TopPage {
  page_path: string;
  page_title?: string;
  views: number;
  unique_visitors: number;
  avg_time_on_page_seconds: number;
}

interface Changes {
  page_views: number;
  visitors: number;
  sessions: number;
  bounce_rate: number;
}

interface RealTimeStats {
  active_visitors: number;
  active_sessions: Array<{
    session_id: string;
    current_page: string;
    time_on_site_seconds: number;
  }>;
  pages_being_viewed: Array<{
    page_path: string;
    active_viewers: number;
  }>;
}

interface TrafficSource {
  source: string;
  medium: string;
  visits: number;
}

interface GeoData {
  country: string;
  visitors: number;
}

// ============================================
// COMPONENT
// ============================================

export default function AnalyticsDashboard() {
  const [metrics, setMetrics] = useState<EngagementMetrics | null>(null);
  const [topPages, setTopPages] = useState<TopPage[]>([]);
  const [changes, setChanges] = useState<Changes | null>(null);
  const [realTime, setRealTime] = useState<RealTimeStats | null>(null);
  const [trafficSources, setTrafficSources] = useState<TrafficSource[]>([]);
  const [geoData, setGeoData] = useState<GeoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState("7d");

  // Fetch main analytics data
  const fetchAnalytics = useCallback(async () => {
    try {
      const response = await fetch(`/api/admin/analytics?range=${dateRange}`);
      if (!response.ok) throw new Error("Failed to fetch analytics");

      const data = await response.json();
      setMetrics(data.metrics);
      setTopPages(data.top_pages ?? []);
      setChanges(data.changes);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  // Fetch real-time stats
  const fetchRealTime = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/analytics?action=realtime");
      if (response.ok) {
        const data = await response.json();
        setRealTime(data);
      }
    } catch {
      // Silently fail for real-time updates
    }
  }, []);

  // Fetch traffic sources
  const fetchTraffic = useCallback(async () => {
    try {
      const response = await fetch(`/api/admin/analytics?action=traffic&range=${dateRange}`);
      if (response.ok) {
        const data = await response.json();
        setTrafficSources(data.sources ?? []);
      }
    } catch {
      // Silently fail
    }
  }, [dateRange]);

  // Fetch geo data
  const fetchGeo = useCallback(async () => {
    try {
      const response = await fetch(`/api/admin/analytics?action=geo&range=${dateRange}`);
      if (response.ok) {
        const data = await response.json();
        setGeoData(data.countries ?? []);
      }
    } catch {
      // Silently fail
    }
  }, [dateRange]);

  // Initial load
  useEffect(() => {
    fetchAnalytics();
    fetchTraffic();
    fetchGeo();
  }, [fetchAnalytics, fetchTraffic, fetchGeo]);

  // Real-time updates every 30 seconds
  useEffect(() => {
    fetchRealTime();
    const interval = setInterval(fetchRealTime, 30000);
    return () => clearInterval(interval);
  }, [fetchRealTime]);

  // Format duration
  const formatDuration = (seconds: number): string => {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  };

  // Format percentage
  const formatPercent = (value: number): string => {
    return `${(value * 100).toFixed(1)}%`;
  };

  // Format change with arrow
  const formatChange = (value: number): JSX.Element => {
    const isPositive = value > 0;
    const isNegative = value < 0;
    const arrow = isPositive ? "↑" : isNegative ? "↓" : "";
    const colorClass = isPositive
      ? "text-green-600"
      : isNegative
      ? "text-red-600"
      : "text-gray-500";

    return (
      <span className={colorClass}>
        {arrow} {Math.abs(value)}%
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-8" />
          <div className="grid grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
            <p className="text-sm text-gray-500 mt-1">
              Website traffic and engagement metrics
            </p>
          </div>

          {/* Date Range Selector */}
          <div className="flex items-center gap-4">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>

            <button
              onClick={() => fetchAnalytics()}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>
      </header>

      <main className="p-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Real-Time Stats Banner */}
        {realTime && realTime.active_visitors > 0 && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
              </span>
              <span className="text-green-800 font-medium">
                {realTime.active_visitors} active visitor{realTime.active_visitors !== 1 ? "s" : ""} right now
              </span>
              {realTime.pages_being_viewed.length > 0 && (
                <span className="text-green-600 text-sm">
                  · Most viewed: {realTime.pages_being_viewed[0].page_path}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Page Views */}
          <div className="bg-white rounded border border-slate-200 p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-slate-500 font-medium">Page Views</p>
                <p className="text-2xl font-semibold text-slate-900 mt-1">
                  {metrics?.total_page_views.toLocaleString() ?? 0}
                </p>
              </div>
              <div className="p-2 bg-blue-50 rounded">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
            {changes && (
              <p className="text-[10px] text-slate-400 mt-2">
                vs previous: {formatChange(changes.page_views)}
              </p>
            )}
          </div>

          {/* Unique Visitors */}
          <div className="bg-white rounded border border-slate-200 p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-slate-500 font-medium">Unique Visitors</p>
                <p className="text-2xl font-semibold text-slate-900 mt-1">
                  {metrics?.unique_visitors.toLocaleString() ?? 0}
                </p>
              </div>
              <div className="p-2 bg-green-50 rounded">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            {changes && (
              <p className="text-[10px] text-slate-400 mt-2">
                vs previous: {formatChange(changes.visitors)}
              </p>
            )}
          </div>

          {/* Avg Session Duration */}
          <div className="bg-white rounded border border-slate-200 p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-slate-500 font-medium">Avg Session Duration</p>
                <p className="text-2xl font-semibold text-slate-900 mt-1">
                  {formatDuration(metrics?.avg_session_duration_seconds ?? 0)}
                </p>
              </div>
              <div className="p-2 bg-purple-50 rounded">
                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 mt-2">
              {(metrics?.avg_pages_per_session ?? 0).toFixed(1)} pages/session
            </p>
          </div>

          {/* Bounce Rate */}
          <div className="bg-white rounded border border-slate-200 p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-slate-500 font-medium">Bounce Rate</p>
                <p className="text-2xl font-semibold text-slate-900 mt-1">
                  {formatPercent(metrics?.bounce_rate ?? 0)}
                </p>
              </div>
              <div className="p-2 bg-amber-50 rounded">
                <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            {changes && (
              <p className="text-[10px] text-slate-400 mt-2">
                vs previous: {formatChange(changes.bounce_rate * -1)}
              </p>
            )}
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
          {/* Top Pages */}
          <div className="bg-white rounded border border-slate-200">
            <div className="p-4 border-b border-slate-100">
              <h2 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Top Pages</h2>
            </div>
            <div className="p-4">
              {topPages.length === 0 ? (
                <p className="text-slate-400 text-center py-6 text-xs">No page data available</p>
              ) : (
                <div className="space-y-3">
                  {topPages.slice(0, 10).map((page, index) => (
                    <div key={page.page_path} className="flex items-center gap-3">
                      <span className="text-[10px] text-slate-400 w-4">{index + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-slate-900 truncate">
                          {page.page_title ?? page.page_path}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate">{page.page_path}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-medium text-slate-900">{page.views.toLocaleString()}</p>
                        <p className="text-[10px] text-slate-400">{page.unique_visitors} unique</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Traffic Sources */}
          <div className="bg-white rounded border border-slate-200">
            <div className="p-4 border-b border-slate-100">
              <h2 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Traffic Sources</h2>
            </div>
            <div className="p-4">
              {trafficSources.length === 0 ? (
                <p className="text-slate-400 text-center py-6 text-xs">No traffic data available</p>
              ) : (
                <div className="space-y-3">
                  {trafficSources.slice(0, 10).map((source, index) => {
                    const total = trafficSources.reduce((sum, s) => sum + s.visits, 0);
                    const percentage = total > 0 ? (source.visits / total) * 100 : 0;

                    return (
                      <div key={`${source.source}-${source.medium}`} className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-xs font-medium text-slate-900">
                              {source.source === "direct" ? "Direct" : source.source}
                            </span>
                            {source.medium !== "none" && (
                              <span className="text-[10px] text-slate-400 ml-2">
                                / {source.medium}
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-slate-500">
                            {source.visits.toLocaleString()} ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 rounded h-1.5">
                          <div
                            className="bg-slate-600 h-1.5 rounded transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Geographic Distribution */}
        <div className="bg-white rounded border border-slate-200">
          <div className="p-4 border-b border-slate-100">
            <h2 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Geographic Distribution</h2>
          </div>
          <div className="p-4">
            {geoData.length === 0 ? (
              <p className="text-slate-400 text-center py-6 text-xs">No geographic data available</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {geoData.slice(0, 12).map((geo) => (
                  <div key={geo.country} className="text-center p-3 bg-slate-50 rounded">
                    <p className="text-lg font-semibold text-slate-900">{geo.visitors}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{geo.country}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
