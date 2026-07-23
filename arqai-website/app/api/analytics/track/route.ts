/**
 * Analytics Tracking API
 *
 * Receives tracking events from the client-side tracker.
 * All data is validated and sanitized before storage.
 *
 * POST /api/analytics/track
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  trackPageView,
  updateScrollDepth,
  updateTimeOnPage,
  parseUserAgent,
  parseUtmParams,
} from "@/lib/analytics/tracking-service";
import { applyRateLimit, RATE_LIMIT_CONFIGS } from "@/lib/security/rate-limiter";

// ============================================
// VALIDATION SCHEMAS
// ============================================

const pageViewSchema = z.object({
  event_type: z.literal("page_view"),
  session_id: z.string().min(1).max(100),
  page_path: z.string().min(1).max(500),
  page_title: z.string().max(200).optional(),
  referrer: z.string().max(500).optional(),
  url: z.string().max(1000).optional(),
});

const scrollDepthSchema = z.object({
  event_type: z.literal("scroll_depth"),
  session_id: z.string().min(1).max(100),
  page_path: z.string().min(1).max(500),
  scroll_depth_percent: z.number().min(0).max(100),
});

const timeOnPageSchema = z.object({
  event_type: z.literal("time_on_page"),
  session_id: z.string().min(1).max(100),
  page_path: z.string().min(1).max(500),
  time_on_page_seconds: z.number().min(0).max(86400),
});

const trackingEventSchema = z.discriminatedUnion("event_type", [
  pageViewSchema,
  scrollDepthSchema,
  timeOnPageSchema,
]);

// ============================================
// RATE LIMIT CONFIG
// ============================================

const TRACKING_RATE_LIMIT = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100, // 100 events per minute per IP
};

// ============================================
// API HANDLER
// ============================================

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const { allowed, headers: rateLimitHeaders } = applyRateLimit(
      request,
      "/api/analytics/track",
      "api"
    );

    if (!allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429, headers: rateLimitHeaders }
      );
    }

    // Parse and validate body
    const body = await request.json();
    const parseResult = trackingEventSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid tracking event", details: parseResult.error.issues },
        { status: 400, headers: rateLimitHeaders }
      );
    }

    const event = parseResult.data;

    // Get client info
    const userAgent = request.headers.get("user-agent") ?? "";
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() ?? "unknown";

    // Parse user agent
    const { device_type, browser, os } = parseUserAgent(userAgent);

    // Get geo from Vercel headers (if available)
    // Geo: Vercel headers on Vercel, Cloudflare's when the VPS sits behind CF.
    // Absent both, geo stays empty and the dashboard hides the geo panel.
    const country =
      request.headers.get("x-vercel-ip-country") ??
      request.headers.get("cf-ipcountry") ??
      undefined;
    const region = request.headers.get("x-vercel-ip-country-region") ?? undefined;
    const city = request.headers.get("x-vercel-ip-city") ?? undefined;

    // Handle different event types
    switch (event.event_type) {
      case "page_view": {
        // Parse UTM params from URL
        const utmParams = event.url ? parseUtmParams(event.url) : {};

        await trackPageView({
          session_id: event.session_id,
          page_path: event.page_path,
          page_title: event.page_title,
          referrer: event.referrer,
          utm_source: utmParams.utm_source,
          utm_medium: utmParams.utm_medium,
          utm_campaign: utmParams.utm_campaign,
          utm_term: utmParams.utm_term,
          utm_content: utmParams.utm_content,
          device_type,
          browser,
          os,
          country,
          region,
          city,
        });
        break;
      }

      case "scroll_depth": {
        await updateScrollDepth(
          event.session_id,
          event.page_path,
          event.scroll_depth_percent
        );
        break;
      }

      case "time_on_page": {
        await updateTimeOnPage(
          event.session_id,
          event.page_path,
          event.time_on_page_seconds
        );
        break;
      }
    }

    return NextResponse.json(
      { success: true },
      { status: 200, headers: rateLimitHeaders }
    );
  } catch (error) {
    console.error("Analytics tracking error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Disable body parsing for edge compatibility
export const runtime = "nodejs";
