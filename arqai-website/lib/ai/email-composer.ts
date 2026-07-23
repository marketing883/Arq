/**
 * AI Email Composer
 *
 * Generates and refines outreach emails for a specific lead, grounded in
 * everything the system knows: the research dossier (playbook angle, talking
 * points), the lead's actual journey (pages visited, form message, chat), and
 * prior emails we already sent (so follow-ups do not repeat themselves).
 *
 * Two modes:
 *  - Generate: fresh draft from context plus an optional admin instruction.
 *  - Refine: rewrite the current draft per an instruction ("shorter", "mention
 *    the banking compliance angle", ...).
 *
 * The output is always a draft for a human to review; nothing here sends.
 */

import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { LEAD_INTEL_MODEL } from "@/lib/ai/models";
import { getLeadProfile, getTouchpointEvents } from "@/lib/lead/lead-profile-service";
import { getLatestDossier, getLeadEmails } from "@/lib/lead/lead-actions-service";
import type { LeadDossier, LeadProfile, LeadEmail } from "@/types/lead-intelligence-v2";

export interface GeneratedEmail {
  subject: string;
  body: string;
  modelUsed: string;
}

export interface GenerateEmailOptions {
  /** What the admin wants ("invite to a 20 minute demo Tuesday", "shorter"). */
  instruction?: string;
  /** When set, refine this draft instead of writing a fresh one. */
  currentSubject?: string;
  currentBody?: string;
}

export async function generateLeadEmail(
  profileId: string,
  options: GenerateEmailOptions = {}
): Promise<GeneratedEmail | null> {
  const profile = await getLeadProfile(profileId);
  if (!profile) return null;

  const [dossier, priorEmails, touchpoints] = await Promise.all([
    getLatestDossier(profileId),
    getLeadEmails(profileId),
    getTouchpointEvents(profileId),
  ]);

  const prompt = buildPrompt(profile, dossier, priorEmails, touchpoints, options);

  // Anthropic first, OpenAI fallback; surface the combined failure reason.
  const errors: string[] = [];

  if (process.env.ANTHROPIC_API_KEY) {
    try {
      const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
      const response = await anthropic.messages.create({
        model: LEAD_INTEL_MODEL,
        max_tokens: 1500,
        messages: [{ role: "user", content: prompt }],
      });
      const text = response.content
        .filter((b): b is Anthropic.TextBlock => b.type === "text")
        .map((b) => b.text)
        .join("\n");
      const parsed = parseEmail(text);
      if (parsed) return { ...parsed, modelUsed: LEAD_INTEL_MODEL };
      errors.push("Anthropic returned unparseable output");
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("Email generation (Anthropic) failed:", message);
      errors.push(`Anthropic: ${message}`);
    }
  } else {
    errors.push("ANTHROPIC_API_KEY not set");
  }

  if (process.env.OPENAI_API_KEY) {
    try {
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const response = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        max_tokens: 1200,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "You write concise, personal B2B sales emails. Respond only with the requested JSON object.",
          },
          { role: "user", content: prompt },
        ],
      });
      const parsed = parseEmail(response.choices[0]?.message?.content || "");
      if (parsed) return { ...parsed, modelUsed: "gpt-4-turbo-preview" };
      errors.push("OpenAI returned unparseable output");
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("Email generation (OpenAI) failed:", message);
      errors.push(`OpenAI: ${message}`);
    }
  } else {
    errors.push("OPENAI_API_KEY not set");
  }

  throw new Error(errors.join(" | ") || "No LLM provider configured");
}

function parseEmail(text: string): { subject: string; body: string } | null {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return null;
  try {
    const raw = JSON.parse(jsonMatch[0]) as { subject?: unknown; body?: unknown };
    const subject = typeof raw.subject === "string" ? raw.subject.trim() : "";
    const body = typeof raw.body === "string" ? raw.body.trim() : "";
    if (!subject || !body) return null;
    return { subject, body };
  } catch {
    return null;
  }
}

function buildPrompt(
  profile: LeadProfile,
  dossier: LeadDossier | null,
  priorEmails: LeadEmail[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  touchpoints: any[],
  options: GenerateEmailOptions
): string {
  const name = [profile.first_name, profile.last_name].filter(Boolean).join(" ");
  const company =
    profile.company || profile.company_intel?.company_name || "";
  const lines: string[] = [];

  lines.push(
    "You are writing an outreach email on behalf of the ArqAI team (enterprise AI solutions and governance). Write like a thoughtful human colleague, not a marketing blast."
  );
  lines.push("");
  lines.push("## The lead");
  lines.push(`- Name: ${name || "unknown (address them naturally without a name)"}`);
  lines.push(`- Email: ${profile.canonical_email || "unknown"}`);
  if (profile.job_title) lines.push(`- Title: ${profile.job_title}`);
  if (company) lines.push(`- Company: ${company}`);

  if (dossier) {
    lines.push("");
    lines.push("## Research dossier");
    if (dossier.summary) lines.push(`Summary: ${dossier.summary}`);
    const sa = dossier.sales_approach || {};
    if (sa.angle) lines.push(`Recommended angle: ${sa.angle}`);
    if (sa.talking_points?.length)
      lines.push(`Talking points: ${sa.talking_points.join("; ")}`);
    if (sa.next_step) lines.push(`Suggested next step: ${sa.next_step}`);
    if (dossier.intent?.classified_intent)
      lines.push(
        `Detected intent: ${dossier.intent.classified_intent} (urgency: ${dossier.intent.urgency || "unknown"})`
      );
    if (dossier.company?.description)
      lines.push(`About their company: ${dossier.company.description}`);
  }

  // Journey highlights: the most recent meaningful interactions.
  const highlights = (touchpoints || [])
    .slice(0, 8)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((t: any) => {
      const preview =
        t.event_data?.message_preview || t.event_data?.message || t.content || "";
      return `- ${t.source || t.event_type || "interaction"}${
        preview ? `: ${String(preview).slice(0, 200)}` : ""
      }`;
    });
  if (highlights.length) {
    lines.push("");
    lines.push("## What they actually did on our site (most recent first)");
    lines.push(...highlights);
  }

  const sent = priorEmails.filter((e) => e.status === "sent");
  if (sent.length) {
    lines.push("");
    lines.push("## Emails we already sent them (do not repeat these)");
    for (const e of sent.slice(0, 3)) {
      lines.push(`- Subject: ${e.subject}`);
      lines.push(`  Body: ${e.body.slice(0, 400)}`);
    }
  }

  const isRefine = !!(options.currentBody || options.currentSubject);
  if (isRefine) {
    lines.push("");
    lines.push("## Current draft (rewrite this)");
    lines.push(`Subject: ${options.currentSubject || ""}`);
    lines.push(`Body:\n${options.currentBody || ""}`);
    lines.push("");
    lines.push(
      `## Rewrite instruction\n${options.instruction || "Improve clarity and flow while keeping the meaning."}`
    );
  } else if (options.instruction) {
    lines.push("");
    lines.push(`## What the sender wants this email to do\n${options.instruction}`);
  }

  lines.push("");
  lines.push("## Rules");
  lines.push("- Short: 60 to 140 words. One clear call to action.");
  lines.push(
    "- Reference exactly one concrete thing from their journey or form message so it reads personal, never generic."
  );
  lines.push(
    "- Never fabricate facts about them or their company. If unsure, stay general."
  );
  lines.push("- Plain text only. No placeholders like [Name]; if the name is unknown, write around it.");
  lines.push("- No em dashes or en dashes anywhere. Use commas or periods instead.");
  lines.push("- Sign off as 'The ArqAI Team' unless the instruction says otherwise.");
  lines.push("");
  lines.push(
    'Respond with ONLY a JSON object: {"subject": "...", "body": "..."}'
  );

  return lines.join("\n");
}
