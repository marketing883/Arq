/**
 * Cron Job: Lead Intelligence Agent Sweep
 *
 * Durable backstop for the research agent queue. Picks up queued runs, retries
 * recoverable failures, and reclaims runs stuck "running" past the stale
 * threshold, then executes them sequentially. The inline waitUntil kick handles
 * the common case in near-real-time; this guarantees eventual completion.
 *
 * Schedule: every 5 minutes (see vercel.json). On the Vercel Hobby plan, which
 * only allows daily crons, drop to hourly and rely more on the inline kick.
 *
 * Security: protected by the CRON_SECRET environment variable.
 */

import { NextRequest, NextResponse } from "next/server";
import { sweepAgentRuns } from "@/lib/agents/lead-intel-agent";
import { cleanupInactiveSessions } from "@/lib/analytics/tracking-service";

export const runtime = "nodejs";
export const maxDuration = 300; // 5 minutes; agent runs can be slow
// Reads the authorization header, so it can never be statically rendered.
// Without this, `next build` tries anyway and logs a DYNAMIC_SERVER_USAGE
// error for this route on every deploy. Same pair every other API route in
// this app declares.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    // Allow if CRON_SECRET is not set (development) or matches.
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      console.warn("Unauthorized agent-runs cron request attempted");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await sweepAgentRuns(5);

    // Piggyback analytics hygiene on the same cadence: close sessions with no
    // activity for 30+ minutes so "active visitors" stays honest.
    const closedSessions = await cleanupInactiveSessions().catch((err) => {
      console.error("Session cleanup failed:", err);
      return 0;
    });

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      picked: result.picked,
      completed: result.completed,
      closed_sessions: closedSessions,
    });
  } catch (error) {
    console.error("Agent-runs cron failed:", error);
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
