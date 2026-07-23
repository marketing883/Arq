/**
 * Unified Lead Journey
 *
 * Merges everything a lead did into a single chronological timeline, grouped
 * into visits: anonymous page views, touchpoint events, form submissions, chat
 * messages, journey-stage transitions, agent runs, and admin activities. Powers
 * the Command Center timeline.
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import {
  getTouchpointEvents,
  getJourneyHistory,
} from "./lead-profile-service";
import { getActivities, getAgentRuns } from "./lead-actions-service";
import { getPageViewsForSessions } from "@/lib/analytics/tracking-service";
import type {
  LeadProfile,
  UnifiedJourney,
  UnifiedJourneyEvent,
  JourneyVisit,
  TouchpointEvent,
  JourneyTransition,
  LeadActivity,
  AgentRun,
} from "@/types/lead-intelligence-v2";
import type { PageView } from "@/types/analytics";

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

const VISIT_GAP_MS = 30 * 60 * 1000; // 30 minutes splits one visit from the next

function labelActivity(a: LeadActivity): string {
  switch (a.activity_type) {
    case "note":
      return "Note added";
    case "stage_change":
      return `Stage changed: ${a.metadata?.from} to ${a.metadata?.to}`;
    case "status_change":
      return `Pipeline status: ${a.metadata?.from} to ${a.metadata?.to}`;
    case "contacted":
      return `Contacted via ${a.metadata?.channel || "unknown"}`;
    case "task":
      return "Next step set";
    case "task_completed":
      return "Task completed";
    case "email_draft_sent":
      return "Follow-up email sent";
    case "research_rerun":
      return "Research re-run requested";
    case "priority_change":
      return `Priority changed: ${a.metadata?.from} to ${a.metadata?.to}`;
    default:
      return "Activity";
  }
}

/**
 * Build the unified journey for a lead profile.
 */
export async function buildUnifiedJourney(
  profile: LeadProfile
): Promise<UnifiedJourney> {
  const email = profile.canonical_email || "";

  const [
    pageViews,
    touchpoints,
    transitions,
    activities,
    agentRuns,
    formSubmissions,
    chatConversations,
  ] = await Promise.all([
    getPageViewsForSessions(profile.session_ids || []),
    getTouchpointEvents(profile.id),
    getJourneyHistory(profile.id),
    getActivities(profile.id),
    getAgentRuns(profile.id, 10),
    getFormSubmissions(email),
    getChatConversations(email, profile.session_ids || []),
  ]);

  const events: UnifiedJourneyEvent[] = [];

  // Page views
  for (const pv of pageViews as PageView[]) {
    const dwell = pv.time_on_page_seconds
      ? `${pv.time_on_page_seconds}s on page`
      : undefined;
    const scroll = pv.scroll_depth_percent
      ? `${pv.scroll_depth_percent}% scrolled`
      : undefined;
    events.push({
      id: `pv-${pv.id}`,
      kind: "page_view",
      occurred_at: pv.created_at,
      session_id: pv.session_id,
      title: `Viewed ${pv.page_path}`,
      detail: [dwell, scroll].filter(Boolean).join(", ") || undefined,
      meta: {
        referrer: pv.referrer,
        utm_source: pv.utm_source,
        utm_campaign: pv.utm_campaign,
        device: pv.device_type,
        location: [pv.city, pv.region, pv.country].filter(Boolean).join(", "),
      },
    });
  }

  // Touchpoint events (chat messages carry a preview; forms carry fields)
  for (const t of touchpoints as TouchpointEvent[]) {
    if (t.source === "chat") continue; // chat rendered from conversations below
    const preview =
      (t.event_data?.message_preview as string | undefined) ||
      (t.event_data?.resource_title as string | undefined);
    events.push({
      id: `tp-${t.id}`,
      kind: "touchpoint",
      occurred_at: t.created_at,
      session_id: t.session_id,
      title: `${sourceLabel(t.source)}: ${t.event_type}`,
      detail: preview,
      meta: { signals: (t.signals || []).map((s) => `${s.category}/${s.type}`) },
    });
  }

  // Form submissions (full message bodies)
  for (const f of formSubmissions) {
    events.push(f);
  }

  // Chat conversations (one expandable event per conversation)
  for (const c of chatConversations) {
    events.push(c);
  }

  // Journey-stage transitions
  for (const tr of transitions as JourneyTransition[]) {
    events.push({
      id: `jt-${tr.id}`,
      kind: "journey_transition",
      occurred_at: tr.created_at,
      title: `Stage: ${tr.from_stage} to ${tr.to_stage}`,
      detail: tr.trigger_type,
      meta: { score_at_transition: tr.score_at_transition },
    });
  }

  // Agent runs
  for (const r of agentRuns as AgentRun[]) {
    events.push({
      id: `ar-${r.id}`,
      kind: "agent_run",
      occurred_at: r.completed_at || r.started_at || r.created_at,
      title:
        r.status === "completed"
          ? "Intelligence dossier generated"
          : `Research run ${r.status}`,
      detail:
        r.status === "failed"
          ? r.error_message
          : r.model_used
          ? `${r.model_used}${r.web_search_used ? " with web search" : ""}`
          : undefined,
      meta: { status: r.status, trigger: r.trigger_source },
    });
  }

  // Admin activities (notes, status/stage changes, tasks, sent emails)
  for (const a of activities as LeadActivity[]) {
    const kind: UnifiedJourneyEvent["kind"] =
      a.activity_type === "email_draft_sent" ? "email" : "activity";
    events.push({
      id: `ac-${a.id}`,
      kind,
      occurred_at: a.created_at,
      title: labelActivity(a),
      detail: a.body || undefined,
      meta: { ...a.metadata, activity_type: a.activity_type },
    });
  }

  // Chronological
  events.sort(
    (a, b) => new Date(a.occurred_at).getTime() - new Date(b.occurred_at).getTime()
  );

  const visits = groupIntoVisits(events);
  return { visits, events };
}

function sourceLabel(source: string): string {
  const labels: Record<string, string> = {
    chat: "Chat",
    contact_form: "Contact form",
    resource_download: "Resource download",
    webinar: "Webinar",
    page_view: "Page view",
    newsletter: "Newsletter",
  };
  return labels[source] || source;
}

/**
 * Group a chronological event list into visits. A new visit starts when the
 * session id changes or a gap of more than 30 minutes elapses. Sessionless
 * events (forms, chat by email, agent runs, admin actions) attach to the
 * current visit's window, or start their own group if none is open.
 */
function groupIntoVisits(events: UnifiedJourneyEvent[]): JourneyVisit[] {
  const visits: JourneyVisit[] = [];
  let current: JourneyVisit | null = null;
  let lastTime = 0;

  for (const event of events) {
    const t = new Date(event.occurred_at).getTime();
    const gap = current ? t - lastTime : Infinity;
    const sessionChanged =
      !!current &&
      !!event.session_id &&
      !!current.session_id &&
      event.session_id !== current.session_id;

    if (!current || gap > VISIT_GAP_MS || sessionChanged) {
      current = {
        visit_number: visits.length + 1,
        session_id: event.session_id,
        started_at: event.occurred_at,
        ended_at: event.occurred_at,
        source: undefined,
        events: [],
      };
      visits.push(current);
    }

    if (!current.session_id && event.session_id) {
      current.session_id = event.session_id;
    }
    // Set the visit source from the first page view with referrer/utm info.
    if (!current.source && event.kind === "page_view" && event.meta) {
      const utm = event.meta.utm_source as string | undefined;
      const referrer = event.meta.referrer as string | undefined;
      current.source = utm || referrer || undefined;
    }
    current.events.push(event);
    current.ended_at = event.occurred_at;
    lastTime = t;
  }

  return visits;
}

// ============================================
// FORM SUBMISSIONS
// ============================================

async function getFormSubmissions(email: string): Promise<UnifiedJourneyEvent[]> {
  const supabase = getSupabaseClient();
  if (!supabase || !email) return [];
  const out: UnifiedJourneyEvent[] = [];

  try {
    const { data: contacts } = await supabase
      .from("contact_submissions")
      .select("id, message, inquiry_type, ai_detected_intent, session_id, created_at")
      .eq("email", email)
      .order("created_at", { ascending: true });
    for (const c of contacts || []) {
      out.push({
        id: `cs-${c.id}`,
        kind: "form_submission",
        occurred_at: c.created_at,
        session_id: c.session_id || undefined,
        title: `Contact form: ${c.ai_detected_intent || c.inquiry_type || "general"}`,
        detail: c.message || undefined,
        meta: { form: "contact" },
      });
    }
  } catch (err) {
    console.error("Journey: contact_submissions load failed:", err);
  }

  try {
    const { data: partners } = await supabase
      .from("partner_enquiries")
      .select("id, message, partnership_type, created_at")
      .eq("email", email)
      .order("created_at", { ascending: true });
    for (const p of partners || []) {
      out.push({
        id: `pe-${p.id}`,
        kind: "form_submission",
        occurred_at: p.created_at,
        title: `Partner enquiry: ${p.partnership_type || "general"}`,
        detail: p.message || undefined,
        meta: { form: "partner" },
      });
    }
  } catch (err) {
    console.error("Journey: partner_enquiries load failed:", err);
  }

  try {
    const { data: resources } = await supabase
      .from("resource_leads")
      .select("id, resource_type, resource_id, created_at")
      .eq("email", email)
      .order("created_at", { ascending: true });
    for (const r of resources || []) {
      out.push({
        id: `rl-${r.id}`,
        kind: "form_submission",
        occurred_at: r.created_at,
        title: `Resource download: ${r.resource_type}`,
        detail: undefined,
        meta: { form: "resource", resource_id: r.resource_id },
      });
    }
  } catch (err) {
    console.error("Journey: resource_leads load failed:", err);
  }

  return out;
}

// ============================================
// CHAT CONVERSATIONS (V1 tables, joined by email)
// ============================================

async function getChatConversations(
  email: string,
  sessionIds: string[]
): Promise<UnifiedJourneyEvent[]> {
  const supabase = getSupabaseClient();
  if (!supabase || !email) return [];

  try {
    const { data: user } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();
    if (!user) return [];

    const { data: conversations } = await supabase
      .from("conversations")
      .select("id, messages, session_id, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true })
      .limit(20);

    const out: UnifiedJourneyEvent[] = [];
    for (const conv of conversations || []) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const messages = Array.isArray(conv.messages) ? (conv.messages as any[]) : [];
      const transcript = messages
        .map((m) => ({
          role: m.role === "assistant" ? "ArqAI" : "Visitor",
          content: typeof m.content === "string" ? m.content : "",
        }))
        .filter((m) => m.content);
      if (transcript.length === 0) continue;

      const firstVisitor = transcript.find((m) => m.role === "Visitor");
      // If the chat's analytics session id matches one of the profile's
      // sessions, use it to place the chat within the right visit.
      const matchedSession =
        conv.session_id && sessionIds.includes(conv.session_id)
          ? conv.session_id
          : undefined;

      out.push({
        id: `chat-${conv.id}`,
        kind: "chat_message",
        occurred_at: conv.created_at,
        session_id: matchedSession,
        title: `Chat conversation (${transcript.length} messages)`,
        detail: firstVisitor?.content,
        meta: { transcript },
      });
    }
    return out;
  } catch (err) {
    console.error("Journey: chat conversations load failed:", err);
    return [];
  }
}
