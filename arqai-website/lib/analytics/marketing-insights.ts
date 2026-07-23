/**
 * Marketing Insights
 *
 * The aggregates a marketing team actually decides with, built on the one
 * advantage this stack has over generic analytics: journeys are linked to
 * lead profiles. So instead of "traffic", every view answers in terms of
 * visits AND the leads they produced.
 *
 *  - KPIs with honest deltas vs the previous period
 *  - Channels that convert (visits -> identified leads -> hot leads)
 *  - Content that converts (pages ranked by lead assists, not raw views)
 *  - Campaign funnel (per utm_campaign)
 *  - Daily trend of visits vs identified leads
 *  - Tracking health (is the pipeline alive?)
 */

import { createServiceClient } from "@/lib/supabase/server";
import { classifySource, CHANNEL_ORDER, type Channel } from "./channels";
import { fetchAllPageViews, getEngagementMetrics } from "./tracking-service";

export interface ChannelFunnelRow {
  channel: Channel;
  /** Most common concrete sources inside the channel, e.g. "google, bing". */
  top_sources: string[];
  visits: number;
  identified_leads: number;
  hot_leads: number;
  /** identified / visits */
  conversion_rate: number;
}

export interface ContentRow {
  page_path: string;
  page_title?: string;
  views: number;
  unique_sessions: number;
  lead_assists: number;
  avg_time_seconds: number;
  avg_scroll_percent: number;
}

export interface CampaignRow {
  campaign: string;
  visits: number;
  identified_leads: number;
  hot_leads: number;
}

export interface TrendPoint {
  date: string; // YYYY-MM-DD
  visits: number;
  identified: number;
}

export interface MarketingInsights {
  kpis: {
    visitors: number;
    visitors_prev: number;
    identified_leads: number;
    identified_leads_prev: number;
    lead_conversion_rate: number;
    lead_conversion_rate_prev: number;
    avg_session_seconds: number;
    avg_session_seconds_prev: number;
    bounce_rate: number;
    return_visitor_rate: number;
    total_page_views: number;
  };
  channels: ChannelFunnelRow[];
  content: ContentRow[];
  campaigns: CampaignRow[];
  trend: TrendPoint[];
  health: {
    last_event_at: string | null;
    events_today: number;
  };
}

interface ViewRow {
  session_id: string;
  lead_profile_id?: string | null;
  page_path: string;
  page_title?: string | null;
  referrer?: string | null;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  time_on_page_seconds?: number | null;
  scroll_depth_percent?: number | null;
  created_at: string;
}

export async function getMarketingInsights(days: number): Promise<MarketingInsights> {
  const supabase = await createServiceClient();

  const end = new Date();
  const start = new Date(end.getTime() - days * 24 * 60 * 60 * 1000);
  const prevStart = new Date(start.getTime() - days * 24 * 60 * 60 * 1000);

  const [views, metrics, prevMetrics] = await Promise.all([
    fetchAllPageViews(
      supabase,
      "session_id, lead_profile_id, page_path, page_title, referrer, utm_source, utm_medium, utm_campaign, time_on_page_seconds, scroll_depth_percent, created_at",
      start.toISOString(),
      end.toISOString()
    ) as Promise<ViewRow[]>,
    getEngagementMetrics(start.toISOString(), end.toISOString()),
    getEngagementMetrics(prevStart.toISOString(), start.toISOString()),
  ]);

  // ---- Session-level shape: first view decides the channel ----
  const firstView = new Map<string, ViewRow>();
  const sessionProfiles = new Map<string, string>();
  for (const v of views) {
    if (!firstView.has(v.session_id)) firstView.set(v.session_id, v);
    if (v.lead_profile_id) sessionProfiles.set(v.session_id, v.lead_profile_id);
  }

  // Priority tiers for every identified profile, one query.
  const profileIds = Array.from(new Set(sessionProfiles.values()));
  const hotProfiles = new Set<string>();
  if (profileIds.length > 0) {
    const { data: profiles } = await supabase
      .from("lead_profiles")
      .select("id, priority_tier")
      .in("id", profileIds.slice(0, 500));
    for (const p of profiles || []) {
      if (p.priority_tier === "P1" || p.priority_tier === "P2") hotProfiles.add(p.id);
    }
  }

  // ---- Channels that convert ----
  const channelAgg = new Map<
    Channel,
    { visits: number; identified: Set<string>; hot: Set<string>; sources: Map<string, number> }
  >();
  for (const [sessionId, first] of Array.from(firstView.entries())) {
    const { channel, source } = classifySource(first);
    let agg = channelAgg.get(channel);
    if (!agg) {
      agg = { visits: 0, identified: new Set(), hot: new Set(), sources: new Map() };
      channelAgg.set(channel, agg);
    }
    agg.visits++;
    agg.sources.set(source, (agg.sources.get(source) ?? 0) + 1);
    const profileId = sessionProfiles.get(sessionId);
    if (profileId) {
      agg.identified.add(profileId);
      if (hotProfiles.has(profileId)) agg.hot.add(profileId);
    }
  }

  const channels: ChannelFunnelRow[] = CHANNEL_ORDER.filter((c) => channelAgg.has(c)).map(
    (channel) => {
      const agg = channelAgg.get(channel)!;
      return {
        channel,
        top_sources: Array.from(agg.sources.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([s]) => s)
          .filter((s) => s !== "direct"),
        visits: agg.visits,
        identified_leads: agg.identified.size,
        hot_leads: agg.hot.size,
        conversion_rate: agg.visits > 0 ? agg.identified.size / agg.visits : 0,
      };
    }
  );

  // ---- Content that converts ----
  const pageAgg = new Map<
    string,
    {
      title?: string;
      views: number;
      sessions: Set<string>;
      assists: Set<string>;
      times: number[];
      scrolls: number[];
    }
  >();
  for (const v of views) {
    let agg = pageAgg.get(v.page_path);
    if (!agg) {
      agg = { title: v.page_title ?? undefined, views: 0, sessions: new Set(), assists: new Set(), times: [], scrolls: [] };
      pageAgg.set(v.page_path, agg);
    }
    agg.views++;
    agg.sessions.add(v.session_id);
    if (v.lead_profile_id) agg.assists.add(v.lead_profile_id);
    if (v.time_on_page_seconds != null)
      agg.times.push(Math.min(Number(v.time_on_page_seconds), 1800));
    if (v.scroll_depth_percent != null) agg.scrolls.push(Number(v.scroll_depth_percent));
  }

  const avg = (arr: number[]) =>
    arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

  const content: ContentRow[] = Array.from(pageAgg.entries())
    .map(([page_path, agg]) => ({
      page_path,
      page_title: agg.title,
      views: agg.views,
      unique_sessions: agg.sessions.size,
      lead_assists: agg.assists.size,
      avg_time_seconds: Math.round(avg(agg.times)),
      avg_scroll_percent: Math.round(avg(agg.scrolls)),
    }))
    .sort((a, b) => b.lead_assists - a.lead_assists || b.views - a.views)
    .slice(0, 12);

  // ---- Campaigns ----
  const campaignAgg = new Map<
    string,
    { visits: number; identified: Set<string>; hot: Set<string> }
  >();
  for (const [sessionId, first] of Array.from(firstView.entries())) {
    const campaign = first.utm_campaign;
    if (!campaign) continue;
    let agg = campaignAgg.get(campaign);
    if (!agg) {
      agg = { visits: 0, identified: new Set(), hot: new Set() };
      campaignAgg.set(campaign, agg);
    }
    agg.visits++;
    const profileId = sessionProfiles.get(sessionId);
    if (profileId) {
      agg.identified.add(profileId);
      if (hotProfiles.has(profileId)) agg.hot.add(profileId);
    }
  }
  const campaigns: CampaignRow[] = Array.from(campaignAgg.entries())
    .map(([campaign, agg]) => ({
      campaign,
      visits: agg.visits,
      identified_leads: agg.identified.size,
      hot_leads: agg.hot.size,
    }))
    .sort((a, b) => b.visits - a.visits)
    .slice(0, 10);

  // ---- Daily trend ----
  const trendMap = new Map<string, { visits: Set<string>; identified: Set<string> }>();
  for (let i = 0; i < days; i++) {
    const d = new Date(start.getTime() + i * 24 * 60 * 60 * 1000);
    trendMap.set(d.toISOString().slice(0, 10), { visits: new Set(), identified: new Set() });
  }
  for (const v of views) {
    const day = v.created_at.slice(0, 10);
    const point = trendMap.get(day);
    if (!point) continue;
    point.visits.add(v.session_id);
    if (v.lead_profile_id) point.identified.add(v.lead_profile_id);
  }
  const trend: TrendPoint[] = Array.from(trendMap.entries()).map(([date, p]) => ({
    date,
    visits: p.visits.size,
    identified: p.identified.size,
  }));

  // ---- Tracking health ----
  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);
  const { data: lastEvent } = await supabase
    .from("page_views")
    .select("created_at")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  const { count: eventsToday } = await supabase
    .from("page_views")
    .select("id", { count: "exact", head: true })
    .gte("created_at", todayStart.toISOString());

  const conversionRate =
    metrics.unique_sessions > 0 ? (profileIds.length ? profileIds.length : 0) / metrics.unique_sessions : 0;
  // Previous period identified count (cheap: distinct profiles in prev window)
  const prevViews = (await fetchAllPageViews(
    supabase,
    "session_id, lead_profile_id",
    prevStart.toISOString(),
    start.toISOString()
  )) as Array<{ session_id: string; lead_profile_id?: string | null }>;
  const prevIdentified = new Set(
    prevViews.map((v) => v.lead_profile_id).filter(Boolean)
  ).size;
  const prevConversion =
    prevMetrics.unique_sessions > 0 ? prevIdentified / prevMetrics.unique_sessions : 0;

  return {
    kpis: {
      visitors: metrics.unique_sessions,
      visitors_prev: prevMetrics.unique_sessions,
      identified_leads: profileIds.length,
      identified_leads_prev: prevIdentified,
      lead_conversion_rate: conversionRate,
      lead_conversion_rate_prev: prevConversion,
      avg_session_seconds: Math.round(metrics.avg_session_duration_seconds),
      avg_session_seconds_prev: Math.round(prevMetrics.avg_session_duration_seconds),
      bounce_rate: metrics.bounce_rate,
      return_visitor_rate: metrics.return_visitor_rate,
      total_page_views: metrics.total_page_views,
    },
    channels,
    content,
    campaigns,
    trend,
    health: {
      last_event_at: lastEvent?.created_at ?? null,
      events_today: eventsToday ?? 0,
    },
  };
}
