/**
 * Admin API for Lead Intelligence V2
 *
 * Provides access to enhanced lead profiles with:
 * - Multi-source touchpoint data
 * - Decay-adjusted scoring
 * - Journey stage tracking
 * - Recommended actions
 */

import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/admin-auth";
import {
  getLeadDashboard,
  getLeadProfileStats,
  getLeadProfile,
  getTouchpointEvents,
  getJourneyHistory,
  promoteLeadStage,
  migrateExistingLeads,
} from "@/lib/lead/lead-profile-service";
import type { JourneyStage } from "@/types/lead-intelligence-v2";

export async function GET(request: NextRequest) {
  try {
    // Verify admin session
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get("action");

    // Handle different actions
    switch (action) {
      case "profile": {
        // Get a single lead profile with full details
        const profileId = searchParams.get("id");
        if (!profileId) {
          return NextResponse.json({ error: "Profile ID required" }, { status: 400 });
        }

        const [profile, events, journey] = await Promise.all([
          getLeadProfile(profileId),
          getTouchpointEvents(profileId),
          getJourneyHistory(profileId),
        ]);

        if (!profile) {
          return NextResponse.json({ error: "Profile not found" }, { status: 404 });
        }

        return NextResponse.json({
          profile,
          touchpoint_events: events,
          journey_history: journey,
        });
      }

      case "stats": {
        // Get V2 lead statistics
        const stats = await getLeadProfileStats();
        return NextResponse.json({ stats });
      }

      case "migrate": {
        // Migrate existing V1 leads to V2
        const migrated = await migrateExistingLeads();
        return NextResponse.json({
          success: true,
          migrated_count: migrated,
          message: `Migrated ${migrated} leads to V2 system`,
        });
      }

      default: {
        // Default: Get lead dashboard list
        const filters: {
          journey_stage?: JourneyStage;
          priority_tier?: string;
          min_score?: number;
          limit?: number;
        } = {};

        const journeyStage = searchParams.get("journey_stage");
        if (journeyStage) {
          filters.journey_stage = journeyStage as JourneyStage;
        }

        const priorityTier = searchParams.get("priority_tier");
        if (priorityTier) {
          filters.priority_tier = priorityTier;
        }

        const minScore = searchParams.get("min_score");
        if (minScore) {
          filters.min_score = parseInt(minScore, 10);
        }

        const limit = searchParams.get("limit");
        if (limit) {
          filters.limit = parseInt(limit, 10);
        }

        const [leads, stats] = await Promise.all([
          getLeadDashboard(filters),
          getLeadProfileStats(),
        ]);

        return NextResponse.json({
          leads,
          stats,
        });
      }
    }
  } catch (error) {
    console.error("Admin leads-v2 error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify admin session
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { action, profile_id, new_stage, trigger } = body;

    switch (action) {
      case "promote_stage": {
        // Manually promote a lead to a new stage
        if (!profile_id || !new_stage) {
          return NextResponse.json(
            { error: "profile_id and new_stage are required" },
            { status: 400 }
          );
        }

        const profile = await promoteLeadStage(
          profile_id,
          new_stage as JourneyStage,
          trigger || "manual_promotion"
        );

        if (!profile) {
          return NextResponse.json(
            { error: "Failed to promote lead stage" },
            { status: 500 }
          );
        }

        return NextResponse.json({
          success: true,
          profile,
          message: `Lead promoted to ${new_stage}`,
        });
      }

      default:
        return NextResponse.json(
          { error: "Unknown action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Admin leads-v2 POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
