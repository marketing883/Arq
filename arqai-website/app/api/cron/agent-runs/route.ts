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

export const runtime = "nodejs";
export const maxDuration = 300; // 5 minutes; agent runs can be slow

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

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      picked: result.picked,
      completed: result.completed,
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
