/**
 * Lead Actions Service
 *
 * Reads and writes for the Lead Command Center: the activity log
 * (lead_activities), dossiers (lead_dossiers), agent runs (agent_runs), and the
 * pipeline fields on lead_profiles. Keeps the admin route handlers thin.
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { updateLeadProfile, getLeadProfile } from "./lead-profile-service";
import type {
  AgentRun,
  LeadActivity,
  LeadActivityType,
  LeadDossier,
  LeadEmail,
  LeadEmailAuthor,
  LeadProfile,
  PipelineStatus,
  PriorityTier,
} from "@/types/lead-intelligence-v2";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Database = any;

let supabaseClient: SupabaseClient<Database> | null = null;

function getSupabaseClient(): SupabaseClient<Database> | null {
  if (!supabaseClient) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return null;
    supabaseClient = createClient<Database>(url, key);
  }
  return supabaseClient;
}

// ============================================
// ACTIVITY LOG
// ============================================

export async function addActivity(
  profileId: string,
  activityType: LeadActivityType,
  options: {
    body?: string;
    metadata?: Record<string, unknown>;
    dueAt?: string;
    createdBy?: string;
  } = {}
): Promise<LeadActivity | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from("lead_activities")
      .insert({
        lead_profile_id: profileId,
        activity_type: activityType,
        body: options.body || null,
        metadata: options.metadata || {},
        due_at: options.dueAt || null,
        created_by: options.createdBy || "admin",
      })
      .select()
      .single();
    if (error) throw error;
    return data as LeadActivity;
  } catch (error) {
    console.error("Error adding lead activity:", error);
    return null;
  }
}

export async function getActivities(profileId: string): Promise<LeadActivity[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from("lead_activities")
      .select("*")
      .eq("lead_profile_id", profileId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data || []) as LeadActivity[];
  } catch (error) {
    console.error("Error getting lead activities:", error);
    return [];
  }
}

export async function getOpenTasks(profileId: string): Promise<LeadActivity[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from("lead_activities")
      .select("*")
      .eq("lead_profile_id", profileId)
      .eq("activity_type", "task")
      .is("completed_at", null)
      .order("due_at", { ascending: true });
    if (error) throw error;
    return (data || []) as LeadActivity[];
  } catch (error) {
    console.error("Error getting open tasks:", error);
    return [];
  }
}

export async function completeTask(activityId: string): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase) return false;
  try {
    const { data: task } = await supabase
      .from("lead_activities")
      .select("lead_profile_id")
      .eq("id", activityId)
      .maybeSingle();

    const { error } = await supabase
      .from("lead_activities")
      .update({ completed_at: new Date().toISOString() })
      .eq("id", activityId);
    if (error) throw error;

    // If no other open tasks remain, clear the profile's next step.
    if (task?.lead_profile_id) {
      const remaining = await getOpenTasks(task.lead_profile_id);
      if (remaining.length === 0) {
        await updateLeadProfile(task.lead_profile_id, {
          next_step: undefined,
          next_step_due_at: undefined,
        });
      }
    }
    return true;
  } catch (error) {
    console.error("Error completing task:", error);
    return false;
  }
}

// ============================================
// PIPELINE ACTIONS
// ============================================

export async function setNextStep(
  profileId: string,
  nextStep: string,
  dueAt?: string
): Promise<LeadProfile | null> {
  const profile = await updateLeadProfile(profileId, {
    next_step: nextStep,
    next_step_due_at: dueAt,
  });
  await addActivity(profileId, "task", {
    body: nextStep,
    dueAt,
    metadata: { kind: "next_step" },
  });
  return profile;
}

export async function markContacted(
  profileId: string,
  channel: string,
  note?: string
): Promise<LeadProfile | null> {
  const now = new Date().toISOString();
  const profile = await updateLeadProfile(profileId, { last_contacted_at: now });
  await addActivity(profileId, "contacted", {
    body: note,
    metadata: { channel },
  });
  return profile;
}

export async function setPipelineStatus(
  profileId: string,
  status: PipelineStatus
): Promise<LeadProfile | null> {
  const existing = await getLeadProfile(profileId);
  const profile = await updateLeadProfile(profileId, { pipeline_status: status });
  await addActivity(profileId, "status_change", {
    metadata: { from: existing?.pipeline_status || "new", to: status },
  });
  return profile;
}

export async function setPriorityOverride(
  profileId: string,
  tier: PriorityTier
): Promise<LeadProfile | null> {
  const existing = await getLeadProfile(profileId);
  // Set both the override (so the nightly recalc respects it) and the live tier.
  const profile = await updateLeadProfile(profileId, {
    priority_tier_override: tier,
    priority_tier: tier,
  });
  await addActivity(profileId, "priority_change", {
    metadata: { from: existing?.priority_tier || "P4", to: tier },
  });
  return profile;
}

// ============================================
// DOSSIERS & AGENT RUNS
// ============================================

export async function getLatestDossier(
  profileId: string
): Promise<LeadDossier | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from("lead_dossiers")
      .select("*")
      .eq("lead_profile_id", profileId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return (data as LeadDossier) || null;
  } catch (error) {
    console.error("Error getting latest dossier:", error);
    return null;
  }
}

export async function getDossierHistory(
  profileId: string
): Promise<Array<{ id: string; created_at: string; confidence?: number }>> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from("lead_dossiers")
      .select("id, created_at, confidence")
      .eq("lead_profile_id", profileId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error getting dossier history:", error);
    return [];
  }
}

export async function getAgentRuns(
  profileId: string,
  limit = 5
): Promise<AgentRun[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from("agent_runs")
      .select("*")
      .eq("lead_profile_id", profileId)
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data || []) as AgentRun[];
  } catch (error) {
    console.error("Error getting agent runs:", error);
    return [];
  }
}

// ============================================
// LEAD EMAILS (AI-assisted composer)
// ============================================

export async function getLeadEmails(profileId: string): Promise<LeadEmail[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from("lead_emails")
      .select("*")
      .eq("lead_profile_id", profileId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data || []) as LeadEmail[];
  } catch (error) {
    console.error("Error getting lead emails:", error);
    return [];
  }
}

/** Create or update a draft. Pass emailId to update an existing row. */
export async function saveLeadEmailDraft(
  profileId: string,
  draft: {
    emailId?: string;
    subject: string;
    body: string;
    generatedBy?: LeadEmailAuthor;
    instruction?: string;
    dossierId?: string;
  }
): Promise<LeadEmail | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;
  try {
    if (draft.emailId) {
      const { data, error } = await supabase
        .from("lead_emails")
        .update({
          subject: draft.subject,
          body: draft.body,
          generated_by: draft.generatedBy || "ai_edited",
          ...(draft.instruction ? { instruction: draft.instruction } : {}),
          updated_at: new Date().toISOString(),
        })
        .eq("id", draft.emailId)
        .eq("status", "draft") // never rewrite a sent email
        .select()
        .single();
      if (error) throw error;
      return data as LeadEmail;
    }
    const { data, error } = await supabase
      .from("lead_emails")
      .insert({
        lead_profile_id: profileId,
        dossier_id: draft.dossierId || null,
        status: "draft",
        subject: draft.subject,
        body: draft.body,
        generated_by: draft.generatedBy || "human",
        instruction: draft.instruction || null,
      })
      .select()
      .single();
    if (error) throw error;
    return data as LeadEmail;
  } catch (error) {
    console.error("Error saving lead email draft:", error);
    return null;
  }
}

/** Record the outcome of a send attempt on an email row. */
export async function markLeadEmailSent(
  emailId: string,
  outcome: { ok: boolean; resendId?: string; subject: string; body: string }
): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from("lead_emails")
      .update({
        status: outcome.ok ? "sent" : "failed",
        subject: outcome.subject,
        body: outcome.body,
        resend_id: outcome.resendId || null,
        sent_at: outcome.ok ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", emailId);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error marking lead email sent:", error);
    return false;
  }
}

export interface ResearchHealth {
  queued: number;
  running: number;
  failed_7d: number;
  completed_7d: number;
}

/**
 * Fleet-level research agent health for the leads list header, so the team can
 * see at a glance whether the automation is keeping up or silently failing.
 */
export async function getResearchHealth(): Promise<ResearchHealth> {
  const empty: ResearchHealth = { queued: 0, running: 0, failed_7d: 0, completed_7d: 0 };
  const supabase = getSupabaseClient();
  if (!supabase) return empty;
  try {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { data, error } = await supabase
      .from("agent_runs")
      .select("status, attempts, completed_at, created_at")
      .or(`status.in.(queued,running),created_at.gte.${weekAgo}`);
    if (error) throw error;

    const health = { ...empty };
    for (const run of data || []) {
      if (run.status === "queued") health.queued++;
      else if (run.status === "running") health.running++;
      else if (run.status === "failed" && (run.attempts ?? 0) >= 3) health.failed_7d++;
      else if (run.status === "completed") health.completed_7d++;
    }
    return health;
  } catch (error) {
    console.error("Error getting research health:", error);
    return empty;
  }
}

/** Mark a dossier's draft email as sent. */
export async function markDraftEmailSent(
  dossierId: string,
  subject: string,
  body: string
): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from("lead_dossiers")
      .update({
        draft_email: {
          subject,
          body,
          status: "sent",
          sent_at: new Date().toISOString(),
        },
      })
      .eq("id", dossierId);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error marking draft email sent:", error);
    return false;
  }
}
