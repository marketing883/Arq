/**
 * Admin API for Lead Intelligence V2 + Lead Command Center
 *
 * GET actions:
 *   - (default)        lead dashboard list + stats
 *   - profile          single profile with touchpoints + journey (legacy modal)
 *   - command_center   full profile view: dossier, unified journey, activities,
 *                      agent runs, alerts, open tasks
 *   - stats            V2 statistics
 *   - migrate          migrate V1 leads to V2
 *
 * POST actions: pipeline movement (stage, status, priority, notes, tasks,
 *   mark contacted, re-run research, send draft email).
 */

import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/admin-auth";
import {
  getLeadDashboard,
  getLeadProfileStats,
  getLeadProfile,
  getTouchpointEvents,
  getJourneyHistory,
  getActiveAlerts,
  promoteLeadStage,
  migrateExistingLeads,
} from "@/lib/lead/lead-profile-service";
import {
  getActivities,
  getOpenTasks,
  getAgentRuns,
  getLatestDossier,
  getDossierHistory,
  addActivity,
  setNextStep,
  completeTask,
  markContacted,
  setPipelineStatus,
  setPriorityOverride,
  markDraftEmailSent,
  getResearchHealth,
  getLeadEmails,
  saveLeadEmailDraft,
  markLeadEmailSent,
} from "@/lib/lead/lead-actions-service";
import { generateLeadEmail } from "@/lib/ai/email-composer";
import { buildUnifiedJourney } from "@/lib/lead/journey";
import { enqueueLeadIntelRun, kickLeadIntelRun } from "@/lib/agents/lead-intel-agent";
import { sendSalesFollowUpEmail } from "@/lib/email/resend";
import { getPageViewsForSessions } from "@/lib/analytics/tracking-service";
import type {
  JourneyStage,
  PipelineStatus,
  PriorityTier,
} from "@/types/lead-intelligence-v2";

export async function GET(request: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get("action");

    switch (action) {
      case "profile": {
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

        const pageJourney = await getPageViewsForSessions(profile.session_ids || []);

        return NextResponse.json({
          profile,
          touchpoint_events: events,
          journey_history: journey,
          page_journey: pageJourney,
        });
      }

      case "command_center": {
        const profileId = searchParams.get("id");
        if (!profileId) {
          return NextResponse.json({ error: "Profile ID required" }, { status: 400 });
        }

        const profile = await getLeadProfile(profileId);
        if (!profile) {
          return NextResponse.json({ error: "Profile not found" }, { status: 404 });
        }

        const [
          dossier,
          dossierHistory,
          agentRuns,
          journey,
          activities,
          openTasks,
          alerts,
          emails,
        ] = await Promise.all([
          getLatestDossier(profileId),
          getDossierHistory(profileId),
          getAgentRuns(profileId, 5),
          buildUnifiedJourney(profile),
          getActivities(profileId),
          getOpenTasks(profileId),
          getActiveAlerts(200),
          getLeadEmails(profileId),
        ]);

        return NextResponse.json({
          profile,
          dossier,
          dossier_history: dossierHistory,
          agent_runs: agentRuns,
          journey,
          activities,
          open_tasks: openTasks,
          alerts: alerts.filter((a) => a.lead_profile_id === profileId),
          emails,
        });
      }

      case "stats": {
        const stats = await getLeadProfileStats();
        return NextResponse.json({ stats });
      }

      case "migrate": {
        const migrated = await migrateExistingLeads();
        return NextResponse.json({
          success: true,
          migrated_count: migrated,
          message: `Migrated ${migrated} leads to V2 system`,
        });
      }

      default: {
        const filters: {
          journey_stage?: JourneyStage;
          priority_tier?: string;
          min_score?: number;
          limit?: number;
        } = {};

        const journeyStage = searchParams.get("journey_stage");
        if (journeyStage) filters.journey_stage = journeyStage as JourneyStage;

        const priorityTier = searchParams.get("priority_tier");
        if (priorityTier) filters.priority_tier = priorityTier;

        const minScore = searchParams.get("min_score");
        if (minScore) filters.min_score = parseInt(minScore, 10);

        const limit = searchParams.get("limit");
        if (limit) filters.limit = parseInt(limit, 10);

        const [leads, stats, research] = await Promise.all([
          getLeadDashboard(filters),
          getLeadProfileStats(),
          getResearchHealth(),
        ]);

        return NextResponse.json({ leads, stats, research });
      }
    }
  } catch (error) {
    console.error("Admin leads-v2 error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { action, profile_id } = body;

    if (!profile_id && action !== "complete_task") {
      return NextResponse.json({ error: "profile_id is required" }, { status: 400 });
    }

    switch (action) {
      case "promote_stage": {
        const { new_stage, trigger } = body;
        if (!new_stage) {
          return NextResponse.json({ error: "new_stage is required" }, { status: 400 });
        }
        const profile = await promoteLeadStage(
          profile_id,
          new_stage as JourneyStage,
          trigger || "manual_promotion"
        );
        if (!profile) {
          return NextResponse.json({ error: "Failed to promote lead stage" }, { status: 500 });
        }
        // Log the manual stage change to the activity feed.
        await addActivity(profile_id, "stage_change", {
          metadata: { to: new_stage, trigger: trigger || "manual_promotion" },
        });
        return NextResponse.json({ success: true, profile });
      }

      case "add_note": {
        const { note } = body;
        if (!note) {
          return NextResponse.json({ error: "note is required" }, { status: 400 });
        }
        const activity = await addActivity(profile_id, "note", { body: note });
        return NextResponse.json({ success: true, activity });
      }

      case "set_next_step": {
        const { next_step, due_at } = body;
        if (!next_step) {
          return NextResponse.json({ error: "next_step is required" }, { status: 400 });
        }
        const profile = await setNextStep(profile_id, next_step, due_at || undefined);
        return NextResponse.json({ success: true, profile });
      }

      case "complete_task": {
        const { activity_id } = body;
        if (!activity_id) {
          return NextResponse.json({ error: "activity_id is required" }, { status: 400 });
        }
        const ok = await completeTask(activity_id);
        return NextResponse.json({ success: ok });
      }

      case "mark_contacted": {
        const { channel, note } = body;
        const profile = await markContacted(profile_id, channel || "email", note);
        return NextResponse.json({ success: true, profile });
      }

      case "set_pipeline_status": {
        const { status } = body;
        if (!status) {
          return NextResponse.json({ error: "status is required" }, { status: 400 });
        }
        const profile = await setPipelineStatus(profile_id, status as PipelineStatus);
        return NextResponse.json({ success: true, profile });
      }

      case "set_priority": {
        const { tier } = body;
        if (!tier) {
          return NextResponse.json({ error: "tier is required" }, { status: 400 });
        }
        const profile = await setPriorityOverride(profile_id, tier as PriorityTier);
        return NextResponse.json({ success: true, profile });
      }

      case "rerun_research": {
        const run = await enqueueLeadIntelRun(profile_id, "manual_rerun", {
          requested_by: "admin",
        });
        kickLeadIntelRun(run);
        await addActivity(profile_id, "research_rerun", {
          metadata: { run_id: run?.id },
        });
        return NextResponse.json({ success: true, run });
      }

      case "generate_email": {
        const { instruction, current_subject, current_body } = body;
        try {
          const generated = await generateLeadEmail(profile_id, {
            instruction,
            currentSubject: current_subject,
            currentBody: current_body,
          });
          if (!generated) {
            return NextResponse.json({ error: "Lead not found" }, { status: 404 });
          }
          return NextResponse.json({ success: true, email: generated });
        } catch (err) {
          const message = err instanceof Error ? err.message : "Generation failed";
          return NextResponse.json({ error: message }, { status: 502 });
        }
      }

      case "save_email_draft": {
        const { email_id, subject, email_body, generated_by, instruction, dossier_id } = body;
        if (!subject && !email_body) {
          return NextResponse.json(
            { error: "subject or email_body is required" },
            { status: 400 }
          );
        }
        const saved = await saveLeadEmailDraft(profile_id, {
          emailId: email_id,
          subject: subject || "",
          body: email_body || "",
          generatedBy: generated_by,
          instruction,
          dossierId: dossier_id,
        });
        if (!saved) {
          return NextResponse.json({ error: "Failed to save draft" }, { status: 500 });
        }
        return NextResponse.json({ success: true, email: saved });
      }

      case "send_email": {
        const { email_id, subject, email_body } = body;
        if (!subject || !email_body) {
          return NextResponse.json(
            { error: "subject and email_body are required" },
            { status: 400 }
          );
        }
        const profile = await getLeadProfile(profile_id);
        if (!profile?.canonical_email) {
          return NextResponse.json({ error: "Lead has no email" }, { status: 400 });
        }

        // Persist first so a failed send still leaves an auditable row.
        let emailRow = null;
        if (email_id) {
          emailRow = await saveLeadEmailDraft(profile_id, {
            emailId: email_id,
            subject,
            body: email_body,
          });
        }
        if (!emailRow) {
          emailRow = await saveLeadEmailDraft(profile_id, {
            subject,
            body: email_body,
            generatedBy: "human",
          });
        }

        const sent = await sendSalesFollowUpEmail({
          to: profile.canonical_email,
          subject,
          body: email_body,
        });

        if (emailRow) {
          await markLeadEmailSent(emailRow.id, { ok: sent, subject, body: email_body });
        }
        if (!sent) {
          return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
        }

        await markContacted(profile_id, "email", `Sent: ${subject}`);
        await addActivity(profile_id, "email_draft_sent", {
          body: subject,
          metadata: { email_id: emailRow?.id },
        });
        return NextResponse.json({ success: true, email_id: emailRow?.id });
      }

      case "send_draft_email": {
        const { dossier_id, subject, email_body } = body;
        if (!dossier_id || !subject || !email_body) {
          return NextResponse.json(
            { error: "dossier_id, subject, and email_body are required" },
            { status: 400 }
          );
        }
        const profile = await getLeadProfile(profile_id);
        if (!profile?.canonical_email) {
          return NextResponse.json({ error: "Lead has no email" }, { status: 400 });
        }
        const sent = await sendSalesFollowUpEmail({
          to: profile.canonical_email,
          subject,
          body: email_body,
        });
        if (!sent) {
          return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
        }
        await markDraftEmailSent(dossier_id, subject, email_body);
        await markContacted(profile_id, "email", `Sent follow-up: ${subject}`);
        await addActivity(profile_id, "email_draft_sent", {
          body: subject,
          metadata: { dossier_id },
        });
        return NextResponse.json({ success: true });
      }

      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Admin leads-v2 POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
