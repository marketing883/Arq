/**
 * Admin Analytics API
 *
 * Provides analytics data for the admin dashboard.
 * Protected by admin authentication.
 *
 * GET /api/admin/analytics?range=7d
 * GET /api/admin/analytics?action=realtime
 * GET /api/admin/analytics?action=pages
 */

import { NextRequest, NextResponse } from "next/server";
import {
  getRealTimeStats,
  getEngagementMetrics,
  getPageEngagement,
} from "@/lib/analytics/tracking-service";
import { getMarketingInsights } from "@/lib/analytics/marketing-insights";
import { createServiceClient } from "@/lib/supabase/server";

// Reads per-request query parameters and is admin-authenticated, so it can
// never be statically rendered.
export const dynamic = "force-dynamic";
export const revalidate = 0;

// ============================================
// DATE RANGE HELPERS
// ============================================

function getDateRange(range: string): { start: string; end: string } {
  const now = new Date();
  const end = now.toISOString();

  let start: Date;
  switch (range) {
    case "today":
      start = new Date(now.setHours(0, 0, 0, 0));
      break;
    case "yesterday":
      start = new Date(now.setDate(now.getDate() - 1));
      start.setHours(0, 0, 0, 0);
      break;
    case "7d":
      start = new Date(now.setDate(now.getDate() - 7));
      break;
    case "30d":
      start = new Date(now.setDate(now.getDate() - 30));
      break;
    case "90d":
      start = new Date(now.setDate(now.getDate() - 90));
      break;
    default:
      start = new Date(now.setDate(now.getDate() - 7));
  }

  return { start: start.toISOString(), end };
}

// ============================================
// API HANDLER
// ============================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");
    const range = searchParams.get("range") ?? "7d";

    // Handle different actions
    switch (action) {
      case "realtime": {
        const stats = await getRealTimeStats();
        return NextResponse.json(stats);
      }

      case "marketing": {
        // The Insights payload: KPIs with deltas, channels-to-leads funnel,
        // content that converts, campaigns, daily trend, tracking health.
        const days = range === "30d" ? 30 : range === "90d" ? 90 : 7;
        const insights = await getMarketingInsights(days);
        return NextResponse.json(insights);
      }

      case "pages": {
        const { start, end } = getDateRange(range);
        const limit = parseInt(searchParams.get("limit") ?? "20", 10);
        const pages = await getPageEngagement(start, end, limit);
        return NextResponse.json({ pages });
      }

      case "traffic": {
        const { start, end } = getDateRange(range);
        const supabase = await createServiceClient();

        // Get traffic sources
        const { data: trafficData } = await supabase
          .from("page_views")
          .select("utm_source, utm_medium, utm_campaign")
          .gte("created_at", start)
          .lte("created_at", end);

        // Aggregate sources
        const sourceCounts = new Map<string, { visits: number; source: string; medium: string }>();
        for (const view of trafficData ?? []) {
          const source = view.utm_source ?? "direct";
          const medium = view.utm_medium ?? "none";
          const key = `${source}|${medium}`;
          const existing = sourceCounts.get(key) ?? { visits: 0, source, medium };
          existing.visits++;
          sourceCounts.set(key, existing);
        }

        const sources = Array.from(sourceCounts.values())
          .sort((a, b) => b.visits - a.visits)
          .slice(0, 20);

        return NextResponse.json({ sources });
      }

      case "geo": {
        const { start, end } = getDateRange(range);
        const supabase = await createServiceClient();

        // Get geo data
        const { data: geoData } = await supabase
          .from("page_views")
          .select("country, region, city")
          .gte("created_at", start)
          .lte("created_at", end)
          .not("country", "is", null);

        // Aggregate by country
        const countryCounts = new Map<string, number>();
        for (const view of geoData ?? []) {
          if (view.country) {
            countryCounts.set(view.country, (countryCounts.get(view.country) ?? 0) + 1);
          }
        }

        const countries = Array.from(countryCounts.entries())
          .map(([country, visitors]) => ({ country, visitors }))
          .sort((a, b) => b.visitors - a.visitors)
          .slice(0, 20);

        return NextResponse.json({ countries });
      }

      case "daily": {
        const supabase = await createServiceClient();
        const days = parseInt(searchParams.get("days") ?? "30", 10);

        const { data: dailyData } = await supabase
          .from("analytics_daily")
          .select("*")
          .order("date", { ascending: false })
          .limit(days);

        return NextResponse.json({
          daily: dailyData ?? [],
        });
      }

      default: {
        // Default: return overview metrics
        const { start, end } = getDateRange(range);
        const metrics = await getEngagementMetrics(start, end);
        const topPages = await getPageEngagement(start, end, 10);

        // Get comparison with previous period
        const rangeMs = new Date(end).getTime() - new Date(start).getTime();
        const prevStart = new Date(new Date(start).getTime() - rangeMs).toISOString();
        const prevMetrics = await getEngagementMetrics(prevStart, start);

        // Calculate changes
        const changes = {
          page_views: calculateChange(metrics.total_page_views, prevMetrics.total_page_views),
          visitors: calculateChange(metrics.unique_visitors, prevMetrics.unique_visitors),
          sessions: calculateChange(metrics.unique_sessions, prevMetrics.unique_sessions),
          bounce_rate: calculateChange(metrics.bounce_rate, prevMetrics.bounce_rate),
        };

        return NextResponse.json({
          metrics,
          top_pages: topPages,
          changes,
          period: { start, end },
        });
      }
    }
  } catch (error) {
    console.error("Analytics API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}

/**
 * Calculate percentage change
 */
function calculateChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}
