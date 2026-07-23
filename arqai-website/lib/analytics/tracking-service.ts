/**
 * Analytics Tracking Service
 *
 * Server-side analytics tracking with real-time aggregation.
 * Stores events in Supabase and maintains daily aggregations.
 *
 * SECURITY: All tracking is server-side, no client-side data manipulation.
 * PERFORMANCE: Uses batch inserts and maintains pre-computed aggregations.
 */

import { createServiceClient } from "@/lib/supabase/server";
import { classifySource } from "@/lib/analytics/channels";
import type {
  PageView,
  ActiveSession,
  TrackingEvent,
  EngagementMetrics,
  PageEngagement,
  RealTimeStats,
  AnalyticsDaily,
  DeviceType,
  TrackingConfig,
  DEFAULT_TRACKING_CONFIG,
} from "@/types/analytics";

// ============================================
// CONFIGURATION
// ============================================

const TRACKING_CONFIG: TrackingConfig = {
  track_page_views: true,
  track_scroll_depth: true,
  track_time_on_page: true,
  track_clicks: true,
  track_forms: true,
  scroll_depth_thresholds: [25, 50, 75, 100],
  time_on_page_interval_seconds: 30,
};

// Session timeout in minutes
const SESSION_TIMEOUT_MINUTES = 30;

/** A visitor counts as "on the site right now" with activity in this window. */
const ACTIVE_NOW_MINUTES = 5;

/**
 * Internal traffic that must never enter analytics. The client tracker also
 * excludes these, but the server guard makes the rule hold even for stale
 * clients and direct API calls.
 */
const EXCLUDED_PATH_PREFIXES = ["/admin", "/api"];

export function isExcludedAnalyticsPath(path: string | undefined | null): boolean {
  if (!path) return false;
  return EXCLUDED_PATH_PREFIXES.some((p) => path === p || path.startsWith(`${p}/`));
}

/** Cap a single session's duration so one forgotten tab cannot skew averages. */
const MAX_SESSION_DURATION_SECONDS = 2 * 60 * 60;

// ============================================
// PAGE VIEW TRACKING
// ============================================

export interface TrackPageViewInput {
  session_id: string;
  lead_profile_id?: string;
  page_path: string;
  page_title?: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  device_type?: DeviceType;
  browser?: string;
  os?: string;
  country?: string;
  region?: string;
  city?: string;
}

/**
 * Track a page view
 */
export async function trackPageView(input: TrackPageViewInput): Promise<PageView | null> {
  if (isExcludedAnalyticsPath(input.page_path)) return null;
  try {
    const supabase = await createServiceClient();

    const pageView: Omit<PageView, "id" | "created_at"> = {
      session_id: input.session_id,
      lead_profile_id: input.lead_profile_id,
      page_path: input.page_path,
      page_title: input.page_title,
      referrer: input.referrer,
      utm_source: input.utm_source,
      utm_medium: input.utm_medium,
      utm_campaign: input.utm_campaign,
      utm_term: input.utm_term,
      utm_content: input.utm_content,
      device_type: input.device_type ?? "unknown",
      browser: input.browser,
      os: input.os,
      country: input.country,
      region: input.region,
      city: input.city,
    };

    const { data, error } = await supabase
      .from("page_views")
      .insert(pageView)
      .select()
      .single();

    if (error) {
      console.error("Failed to track page view:", error);
      return null;
    }

    // Update active session
    await updateActiveSession(input.session_id, input.page_path, input.lead_profile_id);

    return data as PageView;
  } catch (error) {
    console.error("Page view tracking error:", error);
    return null;
  }
}

/**
 * Update scroll depth for a page view
 */
export async function updateScrollDepth(
  session_id: string,
  page_path: string,
  scroll_depth_percent: number
): Promise<void> {
  try {
    const supabase = await createServiceClient();

    // Update the most recent page view for this session/page
    await supabase
      .from("page_views")
      .update({ scroll_depth_percent })
      .eq("session_id", session_id)
      .eq("page_path", page_path)
      .order("created_at", { ascending: false })
      .limit(1);
  } catch (error) {
    console.error("Scroll depth update error:", error);
  }
}

/**
 * Update time on page for a page view
 */
export async function updateTimeOnPage(
  session_id: string,
  page_path: string,
  time_on_page_seconds: number
): Promise<void> {
  try {
    const supabase = await createServiceClient();

    await supabase
      .from("page_views")
      .update({ time_on_page_seconds })
      .eq("session_id", session_id)
      .eq("page_path", page_path)
      .order("created_at", { ascending: false })
      .limit(1);
  } catch (error) {
    console.error("Time on page update error:", error);
  }
}

/**
 * Backfill a lead profile id onto the anonymous browsing history for a
 * session. Called once a visitor identifies themselves (form or chat) so the
 * page views they generated *before* identifying join to their lead profile.
 * Only stamps rows that are still unattributed.
 */
export async function linkSessionToLeadProfile(
  session_id: string,
  lead_profile_id: string
): Promise<void> {
  if (!session_id || !lead_profile_id) return;
  try {
    const supabase = await createServiceClient();
    await supabase
      .from("page_views")
      .update({ lead_profile_id })
      .eq("session_id", session_id)
      .is("lead_profile_id", null);
    await supabase
      .from("active_sessions")
      .update({ lead_profile_id })
      .eq("session_id", session_id)
      .is("lead_profile_id", null);
  } catch (error) {
    console.error("Failed to link session to lead profile:", error);
  }
}

/**
 * Return the page-view journey for a set of sessions, oldest first. Used by the
 * admin lead detail to show what a lead browsed across their sessions.
 */
export async function getPageViewsForSessions(
  session_ids: string[]
): Promise<PageView[]> {
  if (!session_ids || session_ids.length === 0) return [];
  try {
    const supabase = await createServiceClient();
    const { data, error } = await supabase
      .from("page_views")
      .select(
        "session_id, page_path, page_title, referrer, utm_source, utm_medium, utm_campaign, device_type, country, region, city, scroll_depth_percent, time_on_page_seconds, created_at"
      )
      .in("session_id", session_ids)
      .order("created_at", { ascending: true })
      .limit(300);

    if (error) {
      console.error("Failed to load page views for sessions:", error);
      return [];
    }
    return (data as PageView[]) || [];
  } catch (error) {
    console.error("Page views for sessions error:", error);
    return [];
  }
}

// ============================================
// SESSION MANAGEMENT
// ============================================

/**
 * Update or create active session
 */
export async function updateActiveSession(
  session_id: string,
  current_page: string,
  lead_profile_id?: string
): Promise<void> {
  try {
    const supabase = await createServiceClient();

    // Check if session exists
    const { data: existing } = await supabase
      .from("active_sessions")
      .select("id, pages_viewed, time_on_site_seconds, created_at, lead_profile_id")
      .eq("session_id", session_id)
      .single();

    const now = new Date();

    if (existing) {
      // Update existing session
      const pagesViewed = existing.pages_viewed as Array<{ path: string; timestamp: string }>;
      const lastPage = pagesViewed[pagesViewed.length - 1];

      // Add new page if different from last
      if (!lastPage || lastPage.path !== current_page) {
        pagesViewed.push({
          path: current_page,
          timestamp: now.toISOString(),
        });
      }

      // Calculate time on site
      const sessionStart = new Date(existing.created_at);
      const timeOnSite = Math.floor((now.getTime() - sessionStart.getTime()) / 1000);

      await supabase
        .from("active_sessions")
        .update({
          current_page,
          pages_viewed: pagesViewed,
          time_on_site_seconds: timeOnSite,
          last_activity: now.toISOString(),
          is_active: true,
          lead_profile_id: lead_profile_id ?? existing.lead_profile_id,
        })
        .eq("id", existing.id);
    } else {
      // Create new session
      await supabase.from("active_sessions").insert({
        session_id,
        lead_profile_id,
        current_page,
        pages_viewed: [{ path: current_page, timestamp: now.toISOString() }],
        time_on_site_seconds: 0,
        last_activity: now.toISOString(),
        is_active: true,
      });
    }
  } catch (error) {
    console.error("Session update error:", error);
  }
}

/**
 * Mark session as inactive
 */
export async function endSession(session_id: string): Promise<void> {
  try {
    const supabase = await createServiceClient();

    await supabase
      .from("active_sessions")
      .update({ is_active: false })
      .eq("session_id", session_id);
  } catch (error) {
    console.error("End session error:", error);
  }
}

/**
 * Clean up inactive sessions
 */
export async function cleanupInactiveSessions(): Promise<number> {
  try {
    const supabase = await createServiceClient();

    const cutoff = new Date(Date.now() - SESSION_TIMEOUT_MINUTES * 60 * 1000).toISOString();

    const { data, error } = await supabase
      .from("active_sessions")
      .update({ is_active: false })
      .eq("is_active", true)
      .lt("last_activity", cutoff)
      .select("id");

    if (error) {
      console.error("Session cleanup error:", error);
      return 0;
    }

    return data?.length ?? 0;
  } catch (error) {
    console.error("Session cleanup error:", error);
    return 0;
  }
}

// ============================================
// REAL-TIME ANALYTICS
// ============================================

/**
 * Get real-time analytics stats
 */
export async function getRealTimeStats(): Promise<RealTimeStats> {
  try {
    const supabase = await createServiceClient();

    // "Right now" means real activity in the last few minutes, judged by
    // last_activity itself. The is_active flag alone is unreliable: it only
    // flips on an unload beacon, so stale sessions linger as "active".
    const activeCutoff = new Date(
      Date.now() - ACTIVE_NOW_MINUTES * 60 * 1000
    ).toISOString();
    const { data: sessions } = await supabase
      .from("active_sessions")
      .select(`
        session_id,
        lead_profile_id,
        current_page,
        pages_viewed,
        time_on_site_seconds
      `)
      .gte("last_activity", activeCutoff)
      .order("last_activity", { ascending: false })
      .limit(100);

    // Get recent page views for geo distribution
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();
    const { data: recentViews } = await supabase
      .from("page_views")
      .select("country")
      .gte("created_at", fifteenMinutesAgo);

    // Count pages being viewed (internal pages excluded)
    const pageCounts = new Map<string, number>();
    for (const session of sessions ?? []) {
      const page = session.current_page;
      if (page && !isExcludedAnalyticsPath(page)) {
        pageCounts.set(page, (pageCounts.get(page) ?? 0) + 1);
      }
    }

    // Known leads browsing right now: the moment to reach out.
    const identifiedIds = Array.from(
      new Set(
        (sessions ?? [])
          .map((s) => s.lead_profile_id)
          .filter((id): id is string => !!id)
      )
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let identifiedActive: any[] = [];
    if (identifiedIds.length > 0) {
      const { data: profiles } = await supabase
        .from("lead_profiles")
        .select("id, canonical_email, first_name, last_name, company, priority_tier")
        .in("id", identifiedIds.slice(0, 20));
      const bySession = new Map(
        (sessions ?? [])
          .filter((s) => s.lead_profile_id)
          .map((s) => [s.lead_profile_id as string, s.current_page])
      );
      identifiedActive = (profiles || []).map((p) => ({
        lead_profile_id: p.id,
        email: p.canonical_email,
        name: [p.first_name, p.last_name].filter(Boolean).join(" ") || undefined,
        company: p.company,
        priority_tier: p.priority_tier,
        current_page: bySession.get(p.id),
      }));
    }

    // Count geo distribution
    const geoCounts = new Map<string, number>();
    for (const view of recentViews ?? []) {
      if (view.country) {
        geoCounts.set(view.country, (geoCounts.get(view.country) ?? 0) + 1);
      }
    }

    return {
      active_visitors: sessions?.length ?? 0,
      active_sessions: (sessions ?? []).map(s => ({
        session_id: s.session_id,
        lead_profile_id: s.lead_profile_id,
        current_page: s.current_page,
        time_on_site_seconds: s.time_on_site_seconds,
        pages_viewed: (s.pages_viewed as unknown[])?.length ?? 0,
      })),
      pages_being_viewed: Array.from(pageCounts.entries())
        .map(([page_path, active_viewers]) => ({ page_path, active_viewers }))
        .sort((a, b) => b.active_viewers - a.active_viewers)
        .slice(0, 10),
      recent_events: [],
      identified_active: identifiedActive,
      geo_distribution: Array.from(geoCounts.entries())
        .map(([country, visitors]) => ({ country, visitors, sessions: visitors }))
        .sort((a, b) => b.visitors - a.visitors)
        .slice(0, 10),
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Real-time stats error:", error);
    return {
      active_visitors: 0,
      active_sessions: [],
      pages_being_viewed: [],
      recent_events: [],
      identified_active: [],
      geo_distribution: [],
      timestamp: new Date().toISOString(),
    };
  }
}

// ============================================
// AGGREGATION & REPORTING
// ============================================

/**
 * Fetch page views for a range in batches (PostgREST caps a single select at
 * 1000 rows, which silently truncates busy periods), excluding internal
 * paths. Bounded at 20k rows per call.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function fetchAllPageViews(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  columns: string,
  startDate: string,
  endDate: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any[]> {
  const BATCH = 1000;
  const MAX_ROWS = 20000;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const all: any[] = [];
  for (let from = 0; from < MAX_ROWS; from += BATCH) {
    const { data, error } = await supabase
      .from("page_views")
      .select(columns)
      .gte("created_at", startDate)
      .lte("created_at", endDate)
      .not("page_path", "like", "/admin%")
      .not("page_path", "like", "/api%")
      .order("created_at", { ascending: true })
      .range(from, from + BATCH - 1);
    if (error) {
      console.error("fetchAllPageViews error:", error);
      break;
    }
    if (!data || data.length === 0) break;
    all.push(...data);
    if (data.length < BATCH) break;
  }
  return all;
}

/**
 * Get engagement metrics for a date range
 */
export async function getEngagementMetrics(
  startDate: string,
  endDate: string
): Promise<EngagementMetrics> {
  try {
    const supabase = await createServiceClient();

    const pageViews = await fetchAllPageViews(
      supabase,
      "session_id, lead_profile_id, time_on_page_seconds, created_at",
      startDate,
      endDate
    );

    if (pageViews.length === 0) {
      return {
        total_page_views: 0,
        unique_visitors: 0,
        unique_sessions: 0,
        avg_session_duration_seconds: 0,
        avg_pages_per_session: 0,
        bounce_rate: 0,
        return_visitor_rate: 0,
      };
    }

    const uniqueSessions = new Set(pageViews.map(pv => pv.session_id));
    const uniqueVisitors = new Set(
      pageViews.map(pv => pv.lead_profile_id ?? pv.session_id)
    );

    // Pages per session + honest per-session duration: last activity minus
    // first view (plus dwell on single-page sessions), capped so one
    // forgotten tab cannot skew the average.
    const sessionPageCounts = new Map<string, number>();
    const sessionSpans = new Map<string, { first: number; last: number; dwell: number }>();
    for (const pv of pageViews) {
      sessionPageCounts.set(
        pv.session_id,
        (sessionPageCounts.get(pv.session_id) ?? 0) + 1
      );
      const t = new Date(pv.created_at as string).getTime();
      const dwell = Math.min(Number(pv.time_on_page_seconds) || 0, 1800);
      const span = sessionSpans.get(pv.session_id);
      if (!span) {
        sessionSpans.set(pv.session_id, { first: t, last: t, dwell });
      } else {
        span.first = Math.min(span.first, t);
        span.last = Math.max(span.last, t);
        span.dwell = Math.max(span.dwell, dwell);
      }
    }

    const durations = Array.from(sessionSpans.values()).map((s) => {
      const spanSeconds = Math.max(0, (s.last - s.first) / 1000);
      // Single-view sessions have no span; their dwell time is the duration.
      const duration = spanSeconds > 0 ? spanSeconds + Math.min(s.dwell, 600) : s.dwell;
      return Math.min(duration, MAX_SESSION_DURATION_SECONDS);
    });
    const avgSessionDuration =
      durations.length > 0
        ? durations.reduce((a, b) => a + b, 0) / durations.length
        : 0;

    const avgPagesPerSession = Array.from(sessionPageCounts.values()).reduce((a, b) => a + b, 0) /
      sessionPageCounts.size;

    // Bounce rate: sessions with only 1 page view
    const bouncedSessions = Array.from(sessionPageCounts.values()).filter(c => c === 1).length;
    const bounceRate = bouncedSessions / sessionPageCounts.size;

    // Return visitors: identified visitors in this period who were already
    // browsing before it started. Honest but partial (anonymous visitors
    // cannot be recognized across sessions without a persistent cookie).
    let returnVisitorRate = 0;
    const identifiedIds = Array.from(
      new Set(
        pageViews.map((pv) => pv.lead_profile_id).filter((id): id is string => !!id)
      )
    );
    if (identifiedIds.length > 0) {
      const { data: earlier } = await supabase
        .from("page_views")
        .select("lead_profile_id")
        .in("lead_profile_id", identifiedIds.slice(0, 200))
        .lt("created_at", startDate)
        .limit(1000);
      const returning = new Set(
        (earlier || []).map((r) => r.lead_profile_id).filter(Boolean)
      );
      returnVisitorRate = returning.size / uniqueVisitors.size;
    }

    return {
      total_page_views: pageViews.length,
      unique_visitors: uniqueVisitors.size,
      unique_sessions: uniqueSessions.size,
      avg_session_duration_seconds: avgSessionDuration,
      avg_pages_per_session: avgPagesPerSession,
      bounce_rate: bounceRate,
      return_visitor_rate: returnVisitorRate,
    };
  } catch (error) {
    console.error("Engagement metrics error:", error);
    throw error;
  }
}

/**
 * Get page engagement data
 */
export async function getPageEngagement(
  startDate: string,
  endDate: string,
  limit: number = 20
): Promise<PageEngagement[]> {
  try {
    const supabase = await createServiceClient();

    const pageViews = await fetchAllPageViews(
      supabase,
      "page_path, page_title, session_id, lead_profile_id, time_on_page_seconds, scroll_depth_percent",
      startDate,
      endDate
    );

    if (pageViews.length === 0) {
      return [];
    }

    // Aggregate by page
    const pageStats = new Map<string, {
      title?: string;
      views: number;
      visitors: Set<string>;
      times: number[];
      scrolls: number[];
      sessions: Set<string>;
    }>();

    for (const pv of pageViews) {
      const existing = pageStats.get(pv.page_path) ?? {
        title: pv.page_title ?? undefined,
        views: 0,
        visitors: new Set<string>(),
        times: [] as number[],
        scrolls: [] as number[],
        sessions: new Set<string>(),
      };

      existing.views++;
      existing.visitors.add(pv.lead_profile_id ?? pv.session_id);
      existing.sessions.add(pv.session_id);

      if (pv.time_on_page_seconds != null) {
        existing.times.push(pv.time_on_page_seconds as number);
      }
      if (pv.scroll_depth_percent != null) {
        existing.scrolls.push(pv.scroll_depth_percent as number);
      }

      pageStats.set(pv.page_path, existing);
    }

    // Convert to array and calculate metrics
    const results: PageEngagement[] = [];
    for (const [page_path, stats] of Array.from(pageStats.entries())) {
      const avgTime = stats.times.length > 0
        ? stats.times.reduce((a: number, b: number) => a + b, 0) / stats.times.length
        : 0;
      const avgScroll = stats.scrolls.length > 0
        ? stats.scrolls.reduce((a: number, b: number) => a + b, 0) / stats.scrolls.length
        : 0;

      results.push({
        page_path,
        page_title: stats.title,
        views: stats.views,
        unique_visitors: stats.visitors.size,
        avg_time_on_page_seconds: avgTime,
        avg_scroll_depth_percent: avgScroll,
        bounce_rate: 0, // Would need exit page analysis
        exit_rate: 0,
      });
    }

    // Sort by views and limit
    return results
      .sort((a, b) => b.views - a.views)
      .slice(0, limit);
  } catch (error) {
    console.error("Page engagement error:", error);
    throw error;
  }
}

/**
 * Update daily analytics aggregation
 */
export async function updateDailyAnalytics(date: Date): Promise<void> {
  try {
    const supabase = await createServiceClient();

    const dateStr = date.toISOString().split("T")[0];
    const startOfDay = `${dateStr}T00:00:00Z`;
    const endOfDay = `${dateStr}T23:59:59Z`;

    const metrics = await getEngagementMetrics(startOfDay, endOfDay);
    const topPages = await getPageEngagement(startOfDay, endOfDay, 10);

    // Traffic sources: referrer-aware channel classification (UTM wins when
    // present), counted once per session using the session's first view.
    const sourceData = await fetchAllPageViews(
      supabase,
      "session_id, referrer, utm_source, utm_medium, created_at",
      startOfDay,
      endOfDay
    );

    const firstBySession = new Map<
      string,
      { referrer?: string; utm_source?: string; utm_medium?: string }
    >();
    for (const view of sourceData) {
      if (!firstBySession.has(view.session_id)) {
        firstBySession.set(view.session_id, view);
      }
    }

    const sourceCounts = new Map<string, number>();
    for (const first of Array.from(firstBySession.values())) {
      const { channel, source } = classifySource(first);
      const key = `${source}|${channel}`;
      sourceCounts.set(key, (sourceCounts.get(key) ?? 0) + 1);
    }

    const trafficSources = Array.from(sourceCounts.entries())
      .map(([key, visits]) => {
        const [source, medium] = key.split("|");
        return { source, medium, visits };
      })
      .sort((a, b) => b.visits - a.visits)
      .slice(0, 10);

    // Upsert daily record
    await supabase
      .from("analytics_daily")
      .upsert({
        date: dateStr,
        total_page_views: metrics.total_page_views,
        unique_visitors: metrics.unique_visitors,
        unique_sessions: metrics.unique_sessions,
        avg_session_duration_seconds: metrics.avg_session_duration_seconds,
        avg_pages_per_session: metrics.avg_pages_per_session,
        bounce_rate: metrics.bounce_rate,
        top_pages: topPages.map(p => ({ path: p.page_path, title: p.page_title, views: p.views })),
        traffic_sources: trafficSources,
      }, { onConflict: "date" });
  } catch (error) {
    console.error("Daily analytics update error:", error);
  }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Parse user agent for device/browser/OS info
 */
export function parseUserAgent(userAgent: string): {
  device_type: DeviceType;
  browser?: string;
  os?: string;
} {
  const ua = userAgent.toLowerCase();

  // Device type
  let device_type: DeviceType = "desktop";
  if (/mobile|android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua)) {
    device_type = /tablet|ipad/i.test(ua) ? "tablet" : "mobile";
  }

  // Browser
  let browser: string | undefined;
  if (ua.includes("chrome") && !ua.includes("edge")) browser = "Chrome";
  else if (ua.includes("firefox")) browser = "Firefox";
  else if (ua.includes("safari") && !ua.includes("chrome")) browser = "Safari";
  else if (ua.includes("edge")) browser = "Edge";
  else if (ua.includes("opera") || ua.includes("opr")) browser = "Opera";

  // OS
  let os: string | undefined;
  if (ua.includes("windows")) os = "Windows";
  else if (ua.includes("mac os")) os = "macOS";
  else if (ua.includes("linux")) os = "Linux";
  else if (ua.includes("android")) os = "Android";
  else if (ua.includes("iphone") || ua.includes("ipad")) os = "iOS";

  return { device_type, browser, os };
}

/**
 * Parse UTM parameters from URL
 */
export function parseUtmParams(url: string): {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
} {
  try {
    const urlObj = new URL(url);
    const params = urlObj.searchParams;

    return {
      utm_source: params.get("utm_source") ?? undefined,
      utm_medium: params.get("utm_medium") ?? undefined,
      utm_campaign: params.get("utm_campaign") ?? undefined,
      utm_term: params.get("utm_term") ?? undefined,
      utm_content: params.get("utm_content") ?? undefined,
    };
  } catch {
    return {};
  }
}
