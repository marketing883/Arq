/**
 * Shared visual tokens and helpers for the Lead Intelligence admin screens
 * (the leads-v2 list and the per-lead Command Center).
 */

import type { JourneyStage } from "@/types/lead-intelligence-v2";

export const JOURNEY_STAGES: JourneyStage[] = [
  "anonymous",
  "identified",
  "engaged",
  "qualified",
  "opportunity",
];

export const STAGE_LABELS: Record<JourneyStage, string> = {
  anonymous: "Anonymous",
  identified: "Identified",
  engaged: "Engaged",
  qualified: "Qualified",
  opportunity: "Opportunity",
};

export const STAGE_COLORS: Record<
  JourneyStage,
  { bg: string; text: string; bar: string }
> = {
  anonymous: { bg: "bg-slate-100", text: "text-slate-600", bar: "bg-slate-400" },
  identified: { bg: "bg-blue-50", text: "text-blue-600", bar: "bg-blue-500" },
  engaged: { bg: "bg-amber-50", text: "text-amber-600", bar: "bg-amber-500" },
  qualified: { bg: "bg-emerald-50", text: "text-emerald-600", bar: "bg-emerald-500" },
  opportunity: { bg: "bg-purple-50", text: "text-purple-600", bar: "bg-purple-500" },
};

export const PRIORITY_COLORS: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  P1: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
  P2: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  P3: { bg: "bg-slate-100", text: "text-slate-600", border: "border-slate-200" },
  P4: { bg: "bg-slate-50", text: "text-slate-500", border: "border-slate-100" },
};

export const PRIORITY_ACTIONS: Record<string, string> = {
  P1: "Contact within 1 hour",
  P2: "Contact within 24 hours",
  P3: "Add to nurture sequence",
  P4: "Monitor activity",
};

export const PIPELINE_STATUS_LABELS: Record<string, string> = {
  new: "New",
  researching: "Researching",
  contacted: "Contacted",
  in_conversation: "In conversation",
  meeting_booked: "Meeting booked",
  won: "Won",
  lost: "Lost",
  nurture: "Nurture",
};

export const PIPELINE_STATUSES = Object.keys(PIPELINE_STATUS_LABELS);

/**
 * Plain-language labels for scored signal types, so the team reads
 * "Asked for a demo" instead of "demo_request (weight 40)".
 */
export const SIGNAL_LABELS: Record<string, string> = {
  demo_request: "Asked for a demo",
  pricing_interest: "Asked about pricing",
  immediate_urgency: "Signalled urgency",
  timeline_mention: "Mentioned a timeline",
  decision_maker: "Is a decision maker",
  compliance_mention: "Raised compliance needs",
  integration_question: "Asked about integrations",
  competitor_mention: "Mentioned a competitor",
  pain_point: "Described a pain point",
  no_budget: "Said budget is a blocker",
  contact_form: "Filled the contact form",
  resource_download: "Downloaded a resource",
  newsletter: "Subscribed to the newsletter",
  partner_intake: "Submitted a partner enquiry",
};

/** Human phrase for a signal type; falls back to de-snake-cased text. */
export function humanizeSignal(type: string): string {
  return SIGNAL_LABELS[type] || type.replace(/_/g, " ");
}

/** One-line, plain-English reason this lead matters. */
export function whyLine(topSignals?: string[], recommendedAction?: string): string {
  if (topSignals && topSignals.length > 0) {
    return topSignals.slice(0, 2).map(humanizeSignal).join(" + ");
  }
  return recommendedAction || "Browsing, no strong signals yet";
}

/** True when a follow-up is due in the past and presumably not done. */
export function isOverdue(dueAt?: string): boolean {
  if (!dueAt) return false;
  return new Date(dueAt).getTime() < Date.now();
}

export function getTimeAgo(date: string | Date): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return then.toLocaleDateString();
}

export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}
