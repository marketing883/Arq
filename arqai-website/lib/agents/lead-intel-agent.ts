/**
 * Lead Intelligence Agent
 *
 * When a visitor identifies themselves (form submission or chat), this agent
 * runs in the background to research the person, their company, and industry,
 * classify intent, and produce a sales playbook plus a draft follow-up email.
 * The output is stored as a versioned "dossier" on the lead profile.
 *
 * Execution model: durable queue row (agent_runs) + immediate best-effort
 * inline kick via @vercel/functions waitUntil + a cron sweep. The queue row
 * makes every run observable, dedup-able, and retryable; the inline kick keeps
 * the common case near-real-time; the cron guarantees eventual completion.
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { LEAD_INTEL_MODEL } from "@/lib/ai/models";
import { isWorkEmail } from "@/lib/security/anti-spam";
import { researchDomain } from "./domain-research-agent";
import {
  getLeadProfile,
  getTouchpointEvents,
  updateLeadProfile,
  recalculateProfileScores,
  upsertDomainIntelligence,
} from "@/lib/lead/lead-profile-service";
import { getPageViewsForSessions } from "@/lib/analytics/tracking-service";
import type {
  AgentRun,
  AgentRunTriggerSource,
  CompanyIntelligence,
  LeadDossier,
  LeadProfile,
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
    if (!url || !key) {
      console.warn("Supabase credentials not configured for lead intel agent");
      return null;
    }
    supabaseClient = createClient<Database>(url, key);
  }
  return supabaseClient;
}

const STALE_RUNNING_MS = 10 * 60 * 1000; // reclaim a run stuck "running" > 10 min
const DEDUPE_WINDOW_MS = 24 * 60 * 60 * 1000; // skip if researched within 24h
const MAX_ATTEMPTS = 3;

// ============================================
// QUEUE MANAGEMENT
// ============================================

/**
 * Enqueue a research run for a lead profile. Dedupes against a run already
 * queued/running, or completed within the last 24h, unless this is a manual
 * rerun. Returns the (possibly pre-existing) run, or null if not enqueued.
 */
export async function enqueueLeadIntelRun(
  profileId: string,
  triggerSource: AgentRunTriggerSource,
  triggerDetails: Record<string, unknown> = {}
): Promise<AgentRun | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    const isManual = triggerSource === "manual_rerun";

    // An in-flight run already covers this profile.
    const { data: inflight } = await supabase
      .from("agent_runs")
      .select("*")
      .eq("lead_profile_id", profileId)
      .in("status", ["queued", "running"])
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (inflight) return inflight as AgentRun;

    // Recent completed run: don't re-research automatically (manual bypasses).
    if (!isManual) {
      const cutoff = new Date(Date.now() - DEDUPE_WINDOW_MS).toISOString();
      const { data: recent } = await supabase
        .from("agent_runs")
        .select("*")
        .eq("lead_profile_id", profileId)
        .eq("status", "completed")
        .gte("completed_at", cutoff)
        .order("completed_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (recent) return recent as AgentRun;
    }

    const { data, error } = await supabase
      .from("agent_runs")
      .insert({
        lead_profile_id: profileId,
        trigger_source: triggerSource,
        trigger_details: triggerDetails,
        status: "queued",
        attempts: 0,
      })
      .select()
      .single();

    if (error) throw error;
    return data as AgentRun;
  } catch (error) {
    console.error("Error enqueuing lead intel run:", error);
    return null;
  }
}

/**
 * Best-effort inline kick. On Vercel, waitUntil keeps the function alive after
 * the response so the run finishes near-real-time; locally (or if the import
 * fails) it falls back to a floating promise. Either way the cron sweep is the
 * durable backstop.
 */
export function kickLeadIntelRun(run: AgentRun | null): void {
  if (!run || run.status !== "queued") return;
  const runId = run.id;

  import("@vercel/functions")
    .then(({ waitUntil }) => {
      waitUntil(
        executeLeadIntelRun(runId).catch((err) =>
          console.error("Lead intel run failed (waitUntil):", err)
        )
      );
    })
    .catch(() => {
      void executeLeadIntelRun(runId).catch((err) =>
        console.error("Lead intel run failed (inline):", err)
      );
    });
}

// ============================================
// RUN EXECUTION
// ============================================

/**
 * Execute a queued (or failed/stale) research run. Idempotent-ish: claims the
 * row atomically so an inline kick and the cron sweep cannot both process it.
 */
export async function executeLeadIntelRun(runId: string): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) return;

  // Load and claim the run.
  const { data: run } = await supabase
    .from("agent_runs")
    .select("*")
    .eq("id", runId)
    .maybeSingle();

  if (!run) return;
  const current = run as AgentRun;

  // Skip if another worker holds a fresh "running" claim.
  if (current.status === "running" && current.started_at) {
    const age = Date.now() - new Date(current.started_at).getTime();
    if (age < STALE_RUNNING_MS) return;
  }
  if (current.status === "completed" || current.status === "skipped") return;

  const now = new Date().toISOString();
  const { data: claimed } = await supabase
    .from("agent_runs")
    .update({
      status: "running",
      started_at: now,
      attempts: (current.attempts || 0) + 1,
      updated_at: now,
    })
    .eq("id", runId)
    .eq("status", current.status) // only claim if nobody changed it since read
    .select()
    .maybeSingle();

  if (!claimed) return; // lost the race

  const startedMs = Date.now();

  try {
    const dossier = await buildDossier(current.lead_profile_id);
    if (!dossier) throw new Error("Dossier synthesis returned no result");

    const { data: dossierRow, error: dossierError } = await supabase
      .from("lead_dossiers")
      .insert({
        lead_profile_id: current.lead_profile_id,
        agent_run_id: runId,
        person: dossier.person,
        company: dossier.company,
        industry: dossier.industry,
        intent: dossier.intent,
        sales_approach: dossier.sales_approach,
        draft_email: { ...dossier.draft_email, status: "draft" },
        summary: dossier.summary,
        confidence: dossier.confidence,
        sources: dossier.sources,
      })
      .select()
      .single();

    if (dossierError) throw dossierError;

    // Recalculate scores so the researched company intel feeds ICP fit.
    await recalculateProfileScores(current.lead_profile_id).catch((err) =>
      console.error("Score recalc after dossier failed:", err)
    );

    await supabase
      .from("agent_runs")
      .update({
        status: "completed",
        completed_at: new Date().toISOString(),
        duration_ms: Date.now() - startedMs,
        model_used: dossier.modelUsed,
        web_search_used: dossier.webSearchUsed,
        updated_at: new Date().toISOString(),
      })
      .eq("id", runId);

    // Notify the team for high-value leads (non-blocking).
    await maybeNotifyTeam(current.lead_profile_id, dossierRow as LeadDossier);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`Lead intel run ${runId} failed:`, message);
    await supabase
      .from("agent_runs")
      .update({
        status: "failed",
        error_message: message.slice(0, 500),
        completed_at: new Date().toISOString(),
        duration_ms: Date.now() - startedMs,
        updated_at: new Date().toISOString(),
      })
      .eq("id", runId);
  }
}

/**
 * Cron sweep: run any queued work, retry recoverable failures, and reclaim runs
 * stuck in "running" past the stale threshold. Called by the cron route.
 */
export async function sweepAgentRuns(
  limit = 5
): Promise<{ picked: number; completed: number }> {
  const supabase = getSupabaseClient();
  if (!supabase) return { picked: 0, completed: 0 };

  const staleCutoff = new Date(Date.now() - STALE_RUNNING_MS).toISOString();

  // Queued, retryable-failed, or stale-running rows, oldest first.
  const { data: rows } = await supabase
    .from("agent_runs")
    .select("id, status, attempts, started_at")
    .or(
      `status.eq.queued,and(status.eq.failed,attempts.lt.${MAX_ATTEMPTS}),and(status.eq.running,started_at.lt.${staleCutoff})`
    )
    .order("created_at", { ascending: true })
    .limit(limit);

  const picked = rows?.length || 0;
  let completed = 0;

  for (const row of rows || []) {
    try {
      await executeLeadIntelRun(row.id);
      completed++;
    } catch (err) {
      console.error("Sweep run error:", err);
    }
  }

  return { picked, completed };
}

// ============================================
// DOSSIER SYNTHESIS
// ============================================

interface SynthesizedDossier {
  person: LeadDossier["person"];
  company: LeadDossier["company"];
  industry: LeadDossier["industry"];
  intent: LeadDossier["intent"];
  sales_approach: LeadDossier["sales_approach"];
  draft_email: LeadDossier["draft_email"];
  summary: string;
  confidence: number;
  sources: string[];
  modelUsed: string;
  webSearchUsed: boolean;
}

/**
 * Gather context, research the company, and synthesize a dossier.
 */
async function buildDossier(profileId: string): Promise<SynthesizedDossier | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const profile = await getLeadProfile(profileId);
  if (!profile) return null;

  const email = profile.canonical_email || "";
  const domain = email.split("@")[1]?.toLowerCase() || "";
  const isCorporate = !!email && isWorkEmail(email);

  // --- Context gathering (parallel) ---
  const [events, pageViews, contactSubmission, chatTranscript] = await Promise.all([
    getTouchpointEvents(profileId),
    getPageViewsForSessions(profile.session_ids || []),
    getLatestContactSubmission(email),
    getChatTranscript(email),
  ]);

  // --- Company research (reuse the domain research agent) ---
  let companyResearch: Record<string, unknown> | null = null;
  if (isCorporate && domain) {
    try {
      const fresh = await getFreshCache(domain);
      if (fresh) {
        companyResearch = fresh;
      } else {
        const job = await researchDomain(domain, "standard");
        if (job.status === "completed" && job.synthesized_result) {
          companyResearch = job.synthesized_result as unknown as Record<string, unknown>;
          await persistCompanyResearch(domain, job.synthesized_result, job.confidence_score);
        }
      }
    } catch (err) {
      console.error("Company research failed (continuing):", err);
    }
  }

  const contextBlock = buildContextBlock(profile, {
    events,
    pageViews,
    contactSubmission,
    chatTranscript,
    companyResearch,
    isCorporate,
  });

  const synthesized = await synthesize(contextBlock);
  if (!synthesized) return null;

  // Backfill profile contact fields and company intel from what we learned.
  await backfillProfile(profile, synthesized, companyResearch);

  return synthesized;
}

/**
 * Call the LLM to produce the structured dossier. Prefers Anthropic with the
 * web_search server tool; degrades to inference-only, then to OpenAI.
 */
async function synthesize(context: string): Promise<SynthesizedDossier> {
  const prompt = buildSynthesisPrompt(context);
  const errors: string[] = [];

  // 1) Anthropic with web search.
  if (process.env.ANTHROPIC_API_KEY) {
    try {
      const { text, webSearchUsed } = await callAnthropic(prompt, true);
      const parsed = parseDossier(text);
      if (parsed) return { ...parsed, modelUsed: LEAD_INTEL_MODEL, webSearchUsed };
      errors.push("Anthropic (web search) returned unparseable output");
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("Anthropic dossier (with tools) failed:", message);
      errors.push(`Anthropic (web search): ${message}`);
      // 2) Retry inference-only if the tool was the problem.
      try {
        const { text } = await callAnthropic(prompt, false);
        const parsed = parseDossier(text);
        if (parsed) return { ...parsed, modelUsed: LEAD_INTEL_MODEL, webSearchUsed: false };
        errors.push("Anthropic (inference-only) returned unparseable output");
      } catch (err2) {
        const message2 = err2 instanceof Error ? err2.message : String(err2);
        console.error("Anthropic dossier (inference-only) failed:", message2);
        errors.push(`Anthropic (inference-only): ${message2}`);
      }
    }
  } else {
    errors.push("ANTHROPIC_API_KEY not set");
  }

  // 3) OpenAI fallback.
  if (process.env.OPENAI_API_KEY) {
    try {
      const text = await callOpenAI(prompt);
      const parsed = parseDossier(text);
      if (parsed) return { ...parsed, modelUsed: "gpt-4-turbo-preview", webSearchUsed: false };
      errors.push("OpenAI returned unparseable output");
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("OpenAI dossier fallback failed:", message);
      errors.push(`OpenAI: ${message}`);
    }
  } else {
    errors.push("OPENAI_API_KEY not set");
  }

  // Surface the real reason so it lands in agent_runs.error_message and the UI.
  throw new Error(errors.join(" | ") || "No LLM provider configured");
}

let anthropicClient: Anthropic | null = null;
function getAnthropic(): Anthropic {
  if (!anthropicClient) {
    anthropicClient = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return anthropicClient;
}

async function callAnthropic(
  prompt: string,
  withTools: boolean
): Promise<{ text: string; webSearchUsed: boolean }> {
  const anthropic = getAnthropic();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tools: any[] = withTools
    ? [{ type: "web_search_20260209", name: "web_search", max_uses: 5 }]
    : [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const messages: any[] = [{ role: "user", content: prompt }];

  let response = await anthropic.messages.create({
    model: LEAD_INTEL_MODEL,
    max_tokens: 8000,
    ...(tools.length ? { tools } : {}),
    messages,
  });

  // Server-tool loops can pause; resend to resume until the turn completes.
  let guard = 0;
  while (response.stop_reason === "pause_turn" && guard < 5) {
    messages.push({ role: "assistant", content: response.content });
    response = await anthropic.messages.create({
      model: LEAD_INTEL_MODEL,
      max_tokens: 8000,
      ...(tools.length ? { tools } : {}),
      messages,
    });
    guard++;
  }

  const text = response.content
    .filter((block): block is Anthropic.TextBlock => block.type === "text")
    .map((block) => block.text)
    .join("\n");

  const webSearchUsed =
    withTools &&
    response.content.some((block) => block.type === "server_tool_use");

  return { text, webSearchUsed };
}

async function callOpenAI(prompt: string): Promise<string> {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    max_tokens: 2500,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "You are a senior B2B sales intelligence analyst. Respond only with the requested JSON object.",
      },
      { role: "user", content: prompt },
    ],
  });
  return response.choices[0]?.message?.content || "";
}

function parseDossier(text: string): Omit<SynthesizedDossier, "modelUsed" | "webSearchUsed"> | null {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw = JSON.parse(jsonMatch[0]) as any;
    return {
      person: raw.person || {},
      company: raw.company || {},
      industry: raw.industry || {},
      intent: raw.intent || {},
      sales_approach: raw.sales_approach || {},
      draft_email: raw.draft_email || {},
      summary: typeof raw.summary === "string" ? raw.summary : "",
      confidence: typeof raw.confidence === "number" ? raw.confidence : 0.5,
      sources: Array.isArray(raw.sources) ? raw.sources.map(String) : [],
    };
  } catch (err) {
    console.error("Failed to parse dossier JSON:", err);
    return null;
  }
}

// ============================================
// PROMPT CONSTRUCTION
// ============================================

interface ContextInputs {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  events: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pageViews: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  contactSubmission: any | null;
  chatTranscript: string;
  companyResearch: Record<string, unknown> | null;
  isCorporate: boolean;
}

function buildContextBlock(profile: LeadProfile, inputs: ContextInputs): string {
  const { events, pageViews, contactSubmission, chatTranscript, companyResearch, isCorporate } = inputs;

  const journey = pageViews
    .slice(0, 60)
    .map((pv) => {
      const dwell = pv.time_on_page_seconds ? ` (${pv.time_on_page_seconds}s)` : "";
      return `- ${pv.page_path}${dwell}`;
    })
    .join("\n");

  const signals = events
    .flatMap((e) => e.signals || [])
    .map((s: { type?: string; category?: string }) => `${s.category}/${s.type}`)
    .filter((v, i, arr) => arr.indexOf(v) === i)
    .slice(0, 30)
    .join(", ");

  const formMessage = contactSubmission?.message || "";
  const aiIntel = contactSubmission?.ai_intel_json
    ? safeStringify(contactSubmission.ai_intel_json)
    : "";

  return [
    `LEAD IDENTITY`,
    `- Email: ${profile.canonical_email || "unknown"}`,
    `- Email type: ${isCorporate ? "corporate/work domain" : "personal/free-mail domain"}`,
    profile.first_name ? `- Name: ${profile.first_name} ${profile.last_name || ""}`.trim() : "",
    profile.job_title ? `- Job title: ${profile.job_title}` : "",
    profile.company_intel?.company_name ? `- Company (known): ${profile.company_intel.company_name}` : "",
    ``,
    `FORM SUBMISSION MESSAGE`,
    formMessage || "(none)",
    ``,
    aiIntel ? `FAST AI INTEL (from form submit)\n${aiIntel}\n` : "",
    `CHAT TRANSCRIPT`,
    chatTranscript || "(no chat)",
    ``,
    `BROWSE JOURNEY (pages, dwell)`,
    journey || "(no page views recorded)",
    ``,
    `DETECTED SIGNALS`,
    signals || "(none)",
    ``,
    `COMPANY RESEARCH (from domain research agent)`,
    companyResearch ? safeStringify(companyResearch) : "(no company research available)",
  ]
    .filter(Boolean)
    .join("\n");
}

function buildSynthesisPrompt(context: string): string {
  return `You are a senior B2B sales intelligence analyst for ArqAI, an enterprise AI governance and orchestration platform. Analyze this inbound lead and produce a research-backed dossier and sales playbook.

When web search is available, verify and enrich the company and industry details. Never fabricate facts about the company or person: if something is inferred rather than confirmed, mark it as inferred in the text. Do not use em dashes or en dashes anywhere in your output; use commas, colons, or "to" instead.

## Lead context
${context}

## Output
Respond with ONLY a JSON object in exactly this shape (no prose before or after):

{
  "person": {
    "seniority": "c-level|vp|director|manager|individual|unknown",
    "role": "likely function/role",
    "responsibilities": "what they likely own",
    "decision_maker": true,
    "notes": "anything notable, marking inferences as inferred"
  },
  "company": {
    "name": "company name",
    "size": "startup|smb|mid-market|enterprise",
    "industry": "primary industry",
    "description": "one line on what they do",
    "tech_stack": ["notable tools if known"],
    "compliance": ["frameworks likely relevant, e.g. SOC2, HIPAA, GDPR"],
    "recent_news": "one recent, verifiable development if found, else empty"
  },
  "industry": {
    "dynamics": "key industry dynamics relevant to AI adoption",
    "regulatory_pressure": "regulatory or governance pressure they face",
    "ai_adoption": "where this industry sits on AI adoption"
  },
  "intent": {
    "classified_intent": "demo|pricing|partnership|support|evaluation|general",
    "urgency": "high|medium|low",
    "evidence": ["short quotes or facts from the journey/message that justify this"]
  },
  "sales_approach": {
    "angle": "the single most compelling angle to lead with",
    "talking_points": ["3 to 5 concrete talking points tailored to them"],
    "objections": [{ "objection": "likely objection", "response": "how to handle it" }],
    "recommended_channel": "email|phone|meeting|chat",
    "next_step": "the single best next action for the sales team"
  },
  "draft_email": {
    "subject": "short, specific subject line",
    "body": "a short, plain, personal follow-up email that references one concrete thing from their journey or message. No marketing fluff. Sign off as the ArqAI team."
  },
  "summary": "one paragraph executive summary for the sales team",
  "confidence": 0.0,
  "sources": ["urls or sources used, if any"]
}`;
}

// ============================================
// CONTEXT HELPERS
// ============================================

async function getLatestContactSubmission(
  email: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any | null> {
  const supabase = getSupabaseClient();
  if (!supabase || !email) return null;
  try {
    const { data } = await supabase
      .from("contact_submissions")
      .select("message, ai_intel_json, inquiry_type, created_at")
      .eq("email", email)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    return data;
  } catch {
    return null;
  }
}

/** Reconstruct the V1 chat transcript, joined by email through the users table. */
async function getChatTranscript(email: string): Promise<string> {
  const supabase = getSupabaseClient();
  if (!supabase || !email) return "";
  try {
    const { data: user } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();
    if (!user) return "";

    const { data: conversations } = await supabase
      .from("conversations")
      .select("messages, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true })
      .limit(5);

    if (!conversations || conversations.length === 0) return "";

    const lines: string[] = [];
    for (const conv of conversations) {
      const messages = Array.isArray(conv.messages) ? conv.messages : [];
      for (const m of messages.slice(0, 40)) {
        const role = m.role === "assistant" ? "ArqAI" : "Visitor";
        const content = typeof m.content === "string" ? m.content : "";
        if (content) lines.push(`${role}: ${content}`);
      }
    }
    return lines.join("\n").slice(0, 4000);
  } catch {
    return "";
  }
}

async function getFreshCache(domain: string): Promise<Record<string, unknown> | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;
  try {
    const { data } = await supabase
      .from("domain_intelligence_cache")
      .select("research_result")
      .eq("domain", domain)
      .gt("expires_at", new Date().toISOString())
      .maybeSingle();
    return (data?.research_result as Record<string, unknown>) || null;
  } catch {
    return null;
  }
}

/**
 * Persist company research to both caches: domain_intelligence_cache (7-day
 * TTL, mirroring the admin research route) and domain_intelligence (so
 * calculateICPFit benefits on the next scoring pass).
 */
async function persistCompanyResearch(
  domain: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  result: any,
  confidence: number
): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  try {
    await supabase.from("domain_intelligence_cache").upsert(
      {
        domain,
        research_result: result,
        source: "lead_intel_agent",
        confidence,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      { onConflict: "domain" }
    );
  } catch (err) {
    console.error("Failed to write domain_intelligence_cache:", err);
  }

  await upsertDomainIntelligence(domain, {
    company_name: result.company_name,
    company_size: result.company_size,
    industry: result.industry,
    compliance_frameworks: result.compliance_frameworks || [],
    source: "inferred",
    confidence,
  }).catch((err) => console.error("Failed to upsert domain_intelligence:", err));
}

/** Fill in empty profile contact/company fields from the dossier + research. */
async function backfillProfile(
  profile: LeadProfile,
  dossier: SynthesizedDossier,
  companyResearch: Record<string, unknown> | null
): Promise<void> {
  const updates: Partial<LeadProfile> = {};

  const companyName =
    dossier.company?.name ||
    (companyResearch?.company_name as string | undefined) ||
    profile.company_intel?.company_name;

  if (!profile.company && companyName) updates.company = companyName;
  if (!profile.job_title && dossier.person?.role) updates.job_title = dossier.person.role;

  // Merge researched company intel so ICP fit reflects it.
  const mergedIntel: CompanyIntelligence = {
    ...profile.company_intel,
    company_name: companyName || profile.company_intel?.company_name,
    industry:
      dossier.company?.industry ||
      (companyResearch?.industry as string | undefined) ||
      profile.company_intel?.industry,
    size:
      (dossier.company?.size as CompanyIntelligence["size"]) ||
      profile.company_intel?.size,
    compliance_frameworks:
      dossier.company?.compliance ||
      profile.company_intel?.compliance_frameworks,
  };
  updates.company_intel = mergedIntel;

  if (Object.keys(updates).length > 0) {
    await updateLeadProfile(profile.id, updates).catch((err) =>
      console.error("Failed to backfill profile from dossier:", err)
    );
  }
}

async function maybeNotifyTeam(
  profileId: string,
  dossier: LeadDossier
): Promise<void> {
  try {
    const profile = await getLeadProfile(profileId);
    if (!profile) return;

    const highValue =
      profile.priority_tier === "P1" ||
      profile.priority_tier === "P2" ||
      dossier.intent?.urgency === "high";
    if (!highValue) return;

    const { sendAgentDossierNotification } = await import("@/lib/email/resend");
    await sendAgentDossierNotification({
      profileId,
      leadEmail: profile.canonical_email,
      leadName: profile.first_name
        ? `${profile.first_name} ${profile.last_name || ""}`.trim()
        : undefined,
      company: dossier.company?.name || profile.company_intel?.company_name,
      priorityTier: profile.priority_tier,
      journeyStage: profile.journey_stage,
      summary: dossier.summary,
      angle: dossier.sales_approach?.angle,
      nextStep: dossier.sales_approach?.next_step,
      recommendedChannel: dossier.sales_approach?.recommended_channel,
    });
  } catch (err) {
    console.error("Failed to notify team of dossier:", err);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function safeStringify(value: any): string {
  if (typeof value === "string") {
    try {
      return JSON.stringify(JSON.parse(value), null, 2);
    } catch {
      return value.slice(0, 3000);
    }
  }
  try {
    return JSON.stringify(value, null, 2).slice(0, 3000);
  } catch {
    return "";
  }
}
