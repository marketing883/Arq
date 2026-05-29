/**
 * Cron Job: Daily Score Recalculation
 *
 * This endpoint is called daily by Vercel Cron to:
 * 1. Recalculate all lead profile scores with updated time decay
 * 2. Clean up old/expired alerts
 *
 * Schedule: Every day at 3:00 AM UTC
 *
 * Security: Protected by CRON_SECRET environment variable
 */

import { NextRequest, NextResponse } from "next/server";
import {
  batchRecalculateAllScores,
  cleanupOldAlerts,
} from "@/lib/lead/lead-profile-service";

export const runtime = "nodejs";
export const maxDuration = 300; // 5 minutes max for batch processing

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret (Vercel adds this header for cron jobs)
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    // Allow if CRON_SECRET is not set (development) or matches
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      console.warn("Unauthorized cron request attempted");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Starting daily score recalculation cron job...");

    // Run recalculation and cleanup in parallel
    const [recalcResult, cleanupCount] = await Promise.all([
      batchRecalculateAllScores(),
      cleanupOldAlerts(),
    ]);

    const result = {
      success: true,
      timestamp: new Date().toISOString(),
      recalculation: {
        profiles_processed: recalcResult.processed,
        profiles_updated: recalcResult.updated,
        errors: recalcResult.errors,
        duration_ms: recalcResult.duration_ms,
      },
      cleanup: {
        alerts_cleaned: cleanupCount,
      },
    };

    console.log("Cron job completed:", JSON.stringify(result));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Cron job failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
