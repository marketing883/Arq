"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import AdminHeader from "@/components/admin/AdminHeader";
import {
  JOURNEY_STAGES,
  STAGE_LABELS,
  STAGE_COLORS,
  PRIORITY_COLORS,
  PIPELINE_STATUS_LABELS,
  PIPELINE_STATUSES,
  getTimeAgo,
  formatDateTime,
} from "@/components/admin/leads/leadUi";
import type {
  LeadProfile,
  LeadDossier,
  LeadActivity,
  AgentRun,
  UnifiedJourney,
  UnifiedJourneyEvent,
  JourneyVisit,
  ActiveAlert,
} from "@/types/lead-intelligence-v2";

interface CommandCenterData {
  profile: LeadProfile;
  dossier: LeadDossier | null;
  dossier_history: Array<{ id: string; created_at: string; confidence?: number }>;
  agent_runs: AgentRun[];
  journey: UnifiedJourney;
  activities: LeadActivity[];
  open_tasks: LeadActivity[];
  alerts: ActiveAlert[];
}

const CHANNELS = ["email", "phone", "meeting", "chat"];

export default function LeadCommandCenterPage() {
  const params = useParams();
  const router = useRouter();
  const profileId = params?.id as string;

  const [data, setData] = useState<CommandCenterData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/leads-v2?action=command_center&id=${profileId}`);
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      if (!res.ok) throw new Error("Failed to load lead");
      setData(await res.json());
    } catch (err) {
      setError("Failed to load lead command center");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [profileId, router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const post = useCallback(
    async (body: Record<string, unknown>) => {
      setBusy(true);
      try {
        const res = await fetch("/api/admin/leads-v2", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ profile_id: profileId, ...body }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Action failed");
        await fetchData();
        return json;
      } catch (err) {
        console.error("Action error:", err);
        alert(err instanceof Error ? err.message : "Action failed");
        return null;
      } finally {
        setBusy(false);
      }
    },
    [profileId, fetchData]
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-500 text-xs">Loading Command Center...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-50">
        <AdminHeader title="Lead Command Center" subtitle="" onRefresh={fetchData} />
        <div className="p-5">
          <div className="bg-red-50 border border-red-200 rounded p-4 text-red-700 text-sm">
            {error || "Lead not found"}
          </div>
        </div>
      </div>
    );
  }

  const { profile, dossier, agent_runs, journey, activities, open_tasks, alerts } = data;
  const name = profile.first_name
    ? `${profile.first_name} ${profile.last_name || ""}`.trim()
    : profile.canonical_email || "Anonymous lead";

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminHeader
        title="Lead Command Center"
        subtitle={profile.canonical_email || "Anonymous lead"}
        onRefresh={fetchData}
      />

      <div className="p-5">
        <button
          onClick={() => router.push("/admin/leads-v2")}
          className="mb-4 text-xs font-medium text-slate-500 hover:text-slate-800 inline-flex items-center gap-1"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
          Back to all leads
        </button>

        <LeadHeaderCard profile={profile} name={name} onPost={post} busy={busy} />

        <div className="grid lg:grid-cols-3 gap-4 mt-4">
          {/* Left: dossier + journey + runs */}
          <div className="lg:col-span-2 space-y-4">
            <DossierPanel
              dossier={dossier}
              onRerun={() => post({ action: "rerun_research" })}
              onSend={(subject, emailBody) =>
                post({
                  action: "send_draft_email",
                  dossier_id: dossier?.id,
                  subject,
                  email_body: emailBody,
                })
              }
              busy={busy}
            />
            <JourneyTimeline journey={journey} />
            <AgentRunsList runs={agent_runs} />
          </div>

          {/* Right: actions */}
          <div className="space-y-4">
            <ActionsPanel profile={profile} onPost={post} busy={busy} />
            <NextStepCard profile={profile} onPost={post} busy={busy} />
            <TasksCard tasks={open_tasks} onComplete={(id) => post({ action: "complete_task", activity_id: id })} />
            <AlertsCard alerts={alerts} />
            <NotesPanel activities={activities} onAddNote={(note) => post({ action: "add_note", note })} busy={busy} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// HEADER
// ============================================

function LeadHeaderCard({
  profile,
  name,
  onPost,
  busy,
}: {
  profile: LeadProfile;
  name: string;
  onPost: (body: Record<string, unknown>) => Promise<unknown>;
  busy: boolean;
}) {
  const priorityColor = PRIORITY_COLORS[profile.priority_tier] || PRIORITY_COLORS.P4;
  const stageColor = STAGE_COLORS[profile.journey_stage];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-md border border-slate-200 overflow-hidden"
    >
      <div className="p-5 bg-slate-900 text-white">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className={`px-2 py-0.5 ${priorityColor.bg} rounded text-[10px] font-semibold ${priorityColor.text}`}>
                {profile.priority_tier}
              </span>
              <span className={`px-2 py-0.5 ${stageColor?.bg} rounded text-[10px] font-medium ${stageColor?.text}`}>
                {STAGE_LABELS[profile.journey_stage]}
              </span>
            </div>
            <h2 className="text-lg font-semibold">{name}</h2>
            <p className="text-slate-400 text-sm mt-0.5">
              {[profile.job_title, profile.company_intel?.company_name || profile.company]
                .filter(Boolean)
                .join(" at ") || profile.canonical_email}
            </p>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: "Composite", value: Math.round(profile.composite_score || 0) },
              { label: "Intent", value: Math.round(profile.intent_score || 0) },
              { label: "Engage", value: Math.round(profile.engagement_score || 0) },
              { label: "ICP Fit", value: Math.round(profile.icp_fit_score || 0) },
            ].map((s) => (
              <div key={s.label} className="bg-white/10 rounded p-2.5 text-center min-w-[62px]">
                <p className="text-slate-400 text-[10px]">{s.label}</p>
                <p className="text-lg font-semibold">{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stage promoter + pipeline status */}
      <div className="p-4 flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-1">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Journey Stage</p>
          <div className="flex items-center gap-1">
            {JOURNEY_STAGES.map((stage, idx) => {
              const isCurrentOrPast = JOURNEY_STAGES.indexOf(profile.journey_stage) >= idx;
              const isCurrent = profile.journey_stage === stage;
              const canPromote = JOURNEY_STAGES.indexOf(profile.journey_stage) === idx - 1;
              return (
                <div key={stage} className="flex items-center flex-1">
                  <button
                    disabled={!canPromote || busy}
                    onClick={() => canPromote && onPost({ action: "promote_stage", new_stage: stage })}
                    className={`flex-1 p-2 rounded text-center transition-all ${
                      isCurrent
                        ? `${STAGE_COLORS[stage].bg} ring-2 ring-offset-1 ring-slate-400`
                        : isCurrentOrPast
                        ? STAGE_COLORS[stage].bg
                        : "bg-slate-100"
                    } ${canPromote ? "hover:ring-2 hover:ring-slate-300 cursor-pointer" : ""}`}
                    title={canPromote ? `Promote to ${STAGE_LABELS[stage]}` : ""}
                  >
                    <p className={`text-[10px] font-medium ${isCurrentOrPast ? STAGE_COLORS[stage].text : "text-slate-400"}`}>
                      {STAGE_LABELS[stage]}
                    </p>
                  </button>
                  {idx < JOURNEY_STAGES.length - 1 && (
                    <svg className={`w-3 h-3 mx-0.5 flex-shrink-0 ${isCurrentOrPast ? "text-slate-400" : "text-slate-200"}`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div>
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Pipeline Status</p>
          <select
            value={profile.pipeline_status || "new"}
            disabled={busy}
            onChange={(e) => onPost({ action: "set_pipeline_status", status: e.target.value })}
            className="px-3 py-2 bg-white rounded border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-400"
          >
            {PIPELINE_STATUSES.map((s) => (
              <option key={s} value={s}>
                {PIPELINE_STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================
// DOSSIER
// ============================================

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{title}</h4>
      {children}
    </div>
  );
}

function DossierPanel({
  dossier,
  onRerun,
  onSend,
  busy,
}: {
  dossier: LeadDossier | null;
  onRerun: () => void;
  onSend: (subject: string, body: string) => Promise<unknown>;
  busy: boolean;
}) {
  if (!dossier) {
    return (
      <div className="bg-white rounded-md border border-slate-200 p-6 text-center">
        <h3 className="text-sm font-medium text-slate-900 mb-1">No intelligence dossier yet</h3>
        <p className="text-xs text-slate-500 mb-4 max-w-sm mx-auto">
          The research agent runs automatically when a lead engages. You can also start it now.
        </p>
        <button
          onClick={onRerun}
          disabled={busy}
          className="px-4 py-2 bg-slate-900 text-white text-xs font-medium rounded hover:bg-slate-800 disabled:opacity-50"
        >
          Run research
        </button>
      </div>
    );
  }

  const sa = dossier.sales_approach || {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-md border border-slate-200 p-5 space-y-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Intelligence Dossier</h3>
          <p className="text-[10px] text-slate-400 mt-0.5">
            {formatDateTime(dossier.created_at)}
            {typeof dossier.confidence === "number" ? ` • confidence ${Math.round(dossier.confidence * 100)}%` : ""}
          </p>
        </div>
        <button
          onClick={onRerun}
          disabled={busy}
          className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-medium rounded hover:bg-slate-200 disabled:opacity-50"
        >
          Re-run
        </button>
      </div>

      {dossier.summary && (
        <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 rounded p-3 border-l-4 border-slate-800">
          {dossier.summary}
        </p>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <Section title="Person">
          <div className="text-xs text-slate-600 space-y-0.5">
            {dossier.person?.seniority && <p><span className="text-slate-400">Seniority:</span> {dossier.person.seniority}</p>}
            {dossier.person?.role && <p><span className="text-slate-400">Role:</span> {dossier.person.role}</p>}
            {dossier.person?.responsibilities && <p><span className="text-slate-400">Owns:</span> {dossier.person.responsibilities}</p>}
            {typeof dossier.person?.decision_maker === "boolean" && (
              <p><span className="text-slate-400">Decision maker:</span> {dossier.person.decision_maker ? "Yes" : "No"}</p>
            )}
            {dossier.person?.notes && <p className="text-slate-500">{dossier.person.notes}</p>}
          </div>
        </Section>
        <Section title="Company">
          <div className="text-xs text-slate-600 space-y-0.5">
            {dossier.company?.name && <p className="font-medium text-slate-800">{dossier.company.name}</p>}
            {dossier.company?.industry && <p><span className="text-slate-400">Industry:</span> {dossier.company.industry}</p>}
            {dossier.company?.size && <p><span className="text-slate-400">Size:</span> {dossier.company.size}</p>}
            {dossier.company?.description && <p className="text-slate-500">{dossier.company.description}</p>}
            {!!dossier.company?.compliance?.length && (
              <p><span className="text-slate-400">Compliance:</span> {dossier.company.compliance.join(", ")}</p>
            )}
            {dossier.company?.recent_news && <p className="text-slate-500">News: {dossier.company.recent_news}</p>}
          </div>
        </Section>
      </div>

      {(dossier.industry?.dynamics || dossier.industry?.regulatory_pressure || dossier.industry?.ai_adoption) && (
        <Section title="Industry">
          <div className="text-xs text-slate-600 space-y-0.5">
            {dossier.industry?.dynamics && <p>{dossier.industry.dynamics}</p>}
            {dossier.industry?.regulatory_pressure && <p><span className="text-slate-400">Regulatory:</span> {dossier.industry.regulatory_pressure}</p>}
            {dossier.industry?.ai_adoption && <p><span className="text-slate-400">AI adoption:</span> {dossier.industry.ai_adoption}</p>}
          </div>
        </Section>
      )}

      <Section title="Intent Assessment">
        <div className="text-xs text-slate-600 space-y-1">
          <p>
            <span className="font-medium text-slate-800 capitalize">{dossier.intent?.classified_intent || "unknown"}</span>
            {dossier.intent?.urgency && <span className="ml-2 px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">{dossier.intent.urgency} urgency</span>}
          </p>
          {!!dossier.intent?.evidence?.length && (
            <ul className="list-disc pl-4 text-slate-500 space-y-0.5">
              {dossier.intent.evidence.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          )}
        </div>
      </Section>

      {/* Sales playbook */}
      <div className="bg-slate-50 rounded p-4 space-y-3">
        <h4 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Sales Playbook</h4>
        {sa.angle && (
          <p className="text-sm text-slate-800"><span className="font-medium">Angle:</span> {sa.angle}</p>
        )}
        {!!sa.talking_points?.length && (
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Talking points</p>
            <ul className="list-disc pl-4 text-xs text-slate-600 space-y-0.5">
              {sa.talking_points.map((tp, i) => (
                <li key={i}>{tp}</li>
              ))}
            </ul>
          </div>
        )}
        {!!sa.objections?.length && (
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Objections</p>
            <div className="space-y-1.5">
              {sa.objections.map((o, i) => (
                <div key={i} className="text-xs">
                  <p className="text-slate-700 font-medium">{o.objection}</p>
                  <p className="text-slate-500">{o.response}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="flex flex-wrap gap-4 text-xs text-slate-600">
          {sa.recommended_channel && <p><span className="text-slate-400">Channel:</span> {sa.recommended_channel}</p>}
          {sa.next_step && <p><span className="text-slate-400">Next step:</span> {sa.next_step}</p>}
        </div>
      </div>

      <DraftEmailCard dossier={dossier} onSend={onSend} busy={busy} />

      {!!dossier.sources?.length && (
        <Section title="Sources">
          <ul className="text-[11px] text-slate-500 space-y-0.5">
            {dossier.sources.map((s, i) => (
              <li key={i} className="truncate">{s}</li>
            ))}
          </ul>
        </Section>
      )}
    </motion.div>
  );
}

function DraftEmailCard({
  dossier,
  onSend,
  busy,
}: {
  dossier: LeadDossier;
  onSend: (subject: string, body: string) => Promise<unknown>;
  busy: boolean;
}) {
  const [subject, setSubject] = useState(dossier.draft_email?.subject || "");
  const [body, setBody] = useState(dossier.draft_email?.body || "");
  const [copied, setCopied] = useState(false);
  const sent = dossier.draft_email?.status === "sent";

  const copy = async () => {
    await navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="border border-slate-200 rounded p-4 space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Draft Follow-up Email</h4>
        {sent && <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600">Sent</span>}
      </div>
      <input
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        placeholder="Subject"
        className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-slate-400"
      />
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={6}
        placeholder="Email body"
        className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-slate-400 resize-y"
      />
      <div className="flex items-center gap-2">
        <button
          onClick={copy}
          className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-medium rounded hover:bg-slate-200"
        >
          {copied ? "Copied" : "Copy"}
        </button>
        <button
          onClick={() => {
            if (confirm("Send this email to the lead?")) onSend(subject, body);
          }}
          disabled={busy || !subject || !body}
          className="px-3 py-1.5 bg-slate-900 text-white text-xs font-medium rounded hover:bg-slate-800 disabled:opacity-50"
        >
          Send email
        </button>
      </div>
      <p className="text-[10px] text-slate-400">
        Review and edit before sending. This email is drafted by the research agent for a human to approve.
      </p>
    </div>
  );
}

// ============================================
// JOURNEY TIMELINE
// ============================================

const KIND_COLORS: Record<string, string> = {
  page_view: "bg-slate-400",
  touchpoint: "bg-blue-500",
  form_submission: "bg-emerald-500",
  chat_message: "bg-blue-500",
  journey_transition: "bg-purple-500",
  agent_run: "bg-indigo-500",
  activity: "bg-slate-500",
  email: "bg-amber-500",
};

function JourneyEventRow({ event }: { event: UnifiedJourneyEvent }) {
  const [expanded, setExpanded] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const transcript = (event.meta?.transcript as any[]) || null;
  const hasExpandable = !!transcript || (!!event.detail && event.detail.length > 120);

  return (
    <div className="flex items-start gap-3">
      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${KIND_COLORS[event.kind] || "bg-slate-400"}`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-medium text-slate-700 truncate">{event.title}</p>
          <span className="text-[10px] text-slate-400 flex-shrink-0">{getTimeAgo(event.occurred_at)}</span>
        </div>
        {event.detail && !transcript && (
          <p className={`text-[11px] text-slate-500 mt-0.5 ${expanded ? "" : "line-clamp-2"}`}>{event.detail}</p>
        )}
        {transcript && expanded && (
          <div className="mt-1.5 space-y-1 bg-slate-50 rounded p-2 max-h-56 overflow-y-auto">
            {transcript.map((m, i) => (
              <p key={i} className="text-[11px]">
                <span className={`font-medium ${m.role === "ArqAI" ? "text-blue-600" : "text-slate-700"}`}>{m.role}:</span>{" "}
                <span className="text-slate-600">{m.content}</span>
              </p>
            ))}
          </div>
        )}
        {hasExpandable && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="text-[10px] text-slate-400 hover:text-slate-600 mt-0.5"
          >
            {expanded ? "Show less" : transcript ? "View transcript" : "Show more"}
          </button>
        )}
      </div>
    </div>
  );
}

function VisitBlock({ visit }: { visit: JourneyVisit }) {
  const [open, setOpen] = useState(visit.visit_number <= 2);
  const durationMin = Math.max(
    1,
    Math.round((new Date(visit.ended_at).getTime() - new Date(visit.started_at).getTime()) / 60000)
  );
  const pageCount = visit.events.filter((e) => e.kind === "page_view").length;

  return (
    <div className="border border-slate-200 rounded">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between p-3 hover:bg-slate-50"
      >
        <div className="text-left">
          <p className="text-xs font-medium text-slate-700">
            Visit {visit.visit_number} • {new Date(visit.started_at).toLocaleDateString()}
          </p>
          <p className="text-[10px] text-slate-400">
            {pageCount} page{pageCount !== 1 ? "s" : ""} • {durationMin}m
            {visit.source ? ` • via ${visit.source}` : ""}
          </p>
        </div>
        <svg className={`w-4 h-4 text-slate-400 transition-transform ${open ? "rotate-90" : ""}`} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      </button>
      {open && (
        <div className="p-3 pt-0 space-y-2.5">
          {visit.events.map((e) => (
            <JourneyEventRow key={e.id} event={e} />
          ))}
        </div>
      )}
    </div>
  );
}

function JourneyTimeline({ journey }: { journey: UnifiedJourney }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-md border border-slate-200 p-5"
    >
      <h3 className="text-sm font-semibold text-slate-900 mb-3">Full Journey</h3>
      {journey.visits.length === 0 ? (
        <p className="text-xs text-slate-400">No journey activity recorded yet.</p>
      ) : (
        <div className="space-y-2">
          {journey.visits.map((v) => (
            <VisitBlock key={v.visit_number} visit={v} />
          ))}
        </div>
      )}
    </motion.div>
  );
}

// ============================================
// AGENT RUNS
// ============================================

function AgentRunsList({ runs }: { runs: AgentRun[] }) {
  if (runs.length === 0) return null;
  const statusColor: Record<string, string> = {
    completed: "text-emerald-600",
    failed: "text-red-600",
    running: "text-blue-600",
    queued: "text-slate-500",
    skipped: "text-slate-400",
  };
  return (
    <div className="bg-white rounded-md border border-slate-200 p-5">
      <h3 className="text-sm font-semibold text-slate-900 mb-3">Research Runs</h3>
      <div className="space-y-2">
        {runs.map((r) => (
          <div key={r.id} className="flex items-center justify-between text-xs border-b border-slate-100 pb-2 last:border-0">
            <div>
              <span className={`font-medium ${statusColor[r.status] || "text-slate-500"}`}>{r.status}</span>
              <span className="text-slate-400 ml-2">{r.trigger_source}</span>
              {r.error_message && <p className="text-[10px] text-red-500 mt-0.5">{r.error_message}</p>}
            </div>
            <div className="text-right text-[10px] text-slate-400">
              <p>{getTimeAgo(r.created_at)}</p>
              {r.web_search_used && <p className="text-indigo-500">web search</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// RIGHT COLUMN
// ============================================

function ActionsPanel({
  profile,
  onPost,
  busy,
}: {
  profile: LeadProfile;
  onPost: (body: Record<string, unknown>) => Promise<unknown>;
  busy: boolean;
}) {
  const [channel, setChannel] = useState("email");
  return (
    <div className="bg-white rounded-md border border-slate-200 p-4 space-y-3">
      <h3 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Actions</h3>

      <div className="flex gap-2">
        <select
          value={channel}
          onChange={(e) => setChannel(e.target.value)}
          className="px-2 py-1.5 text-xs border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-slate-400"
        >
          {CHANNELS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <button
          onClick={() => onPost({ action: "mark_contacted", channel })}
          disabled={busy}
          className="flex-1 px-3 py-1.5 bg-slate-900 text-white text-xs font-medium rounded hover:bg-slate-800 disabled:opacity-50"
        >
          Mark contacted
        </button>
      </div>

      {profile.last_contacted_at && (
        <p className="text-[10px] text-slate-400">Last contacted {getTimeAgo(profile.last_contacted_at)}</p>
      )}

      <div className="grid grid-cols-2 gap-2">
        {profile.canonical_email && (
          <a
            href={`mailto:${profile.canonical_email}?subject=Following up on your ArqAI inquiry`}
            className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-medium rounded hover:bg-slate-200 text-center"
          >
            Email
          </a>
        )}
        <button
          onClick={() => onPost({ action: "rerun_research" })}
          disabled={busy}
          className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-medium rounded hover:bg-slate-200 disabled:opacity-50"
        >
          Re-run research
        </button>
      </div>

      <div>
        <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Priority override</p>
        <div className="flex gap-1">
          {["P1", "P2", "P3", "P4"].map((t) => (
            <button
              key={t}
              onClick={() => onPost({ action: "set_priority", tier: t })}
              disabled={busy}
              className={`flex-1 px-2 py-1 text-[10px] font-semibold rounded border ${
                profile.priority_tier === t
                  ? `${PRIORITY_COLORS[t].bg} ${PRIORITY_COLORS[t].text} ${PRIORITY_COLORS[t].border}`
                  : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function NextStepCard({
  profile,
  onPost,
  busy,
}: {
  profile: LeadProfile;
  onPost: (body: Record<string, unknown>) => Promise<unknown>;
  busy: boolean;
}) {
  const [text, setText] = useState("");
  const [due, setDue] = useState("");
  return (
    <div className="bg-white rounded-md border border-slate-200 p-4 space-y-2">
      <h3 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Next Step</h3>
      {profile.next_step && (
        <p className="text-xs text-slate-700 bg-slate-50 rounded p-2">
          {profile.next_step}
          {profile.next_step_due_at && (
            <span className="block text-[10px] text-slate-400 mt-0.5">
              Due {new Date(profile.next_step_due_at).toLocaleDateString()}
            </span>
          )}
        </p>
      )}
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="What's the next step?"
        className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-slate-400"
      />
      <div className="flex gap-2">
        <input
          type="date"
          value={due}
          onChange={(e) => setDue(e.target.value)}
          className="flex-1 px-2.5 py-1.5 text-xs border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-slate-400"
        />
        <button
          onClick={async () => {
            if (!text) return;
            await onPost({
              action: "set_next_step",
              next_step: text,
              due_at: due ? new Date(due).toISOString() : undefined,
            });
            setText("");
            setDue("");
          }}
          disabled={busy || !text}
          className="px-3 py-1.5 bg-slate-900 text-white text-xs font-medium rounded hover:bg-slate-800 disabled:opacity-50"
        >
          Set
        </button>
      </div>
    </div>
  );
}

function TasksCard({ tasks, onComplete }: { tasks: LeadActivity[]; onComplete: (id: string) => void }) {
  if (tasks.length === 0) return null;
  return (
    <div className="bg-white rounded-md border border-slate-200 p-4">
      <h3 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Open Tasks</h3>
      <div className="space-y-2">
        {tasks.map((t) => (
          <div key={t.id} className="flex items-start gap-2">
            <input
              type="checkbox"
              onChange={() => onComplete(t.id)}
              className="mt-0.5"
            />
            <div className="flex-1">
              <p className="text-xs text-slate-700">{t.body}</p>
              {t.due_at && (
                <p className="text-[10px] text-slate-400">Due {new Date(t.due_at).toLocaleDateString()}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AlertsCard({ alerts }: { alerts: ActiveAlert[] }) {
  if (alerts.length === 0) return null;
  return (
    <div className="bg-white rounded-md border border-slate-200 p-4">
      <h3 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Active Alerts</h3>
      <div className="space-y-2">
        {alerts.map((a) => (
          <div key={a.id} className="text-xs bg-red-50 border border-red-100 rounded p-2">
            <p className="font-medium text-red-700">{a.title || a.alert_type}</p>
            <p className="text-red-600 text-[11px]">{a.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function NotesPanel({
  activities,
  onAddNote,
  busy,
}: {
  activities: LeadActivity[];
  onAddNote: (note: string) => Promise<unknown>;
  busy: boolean;
}) {
  const [note, setNote] = useState("");
  return (
    <div className="bg-white rounded-md border border-slate-200 p-4">
      <h3 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Notes &amp; Activity</h3>
      <div className="flex gap-2 mb-3">
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add a note"
          className="flex-1 px-2.5 py-1.5 text-xs border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-slate-400"
        />
        <button
          onClick={async () => {
            if (!note) return;
            await onAddNote(note);
            setNote("");
          }}
          disabled={busy || !note}
          className="px-3 py-1.5 bg-slate-900 text-white text-xs font-medium rounded hover:bg-slate-800 disabled:opacity-50"
        >
          Add
        </button>
      </div>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {activities.length === 0 ? (
          <p className="text-[11px] text-slate-400">No activity yet.</p>
        ) : (
          activities.map((a) => (
            <div key={a.id} className="text-xs border-b border-slate-100 pb-1.5 last:border-0">
              <div className="flex items-center justify-between">
                <span className="text-slate-700 font-medium capitalize">{a.activity_type.replace(/_/g, " ")}</span>
                <span className="text-[10px] text-slate-400">{getTimeAgo(a.created_at)}</span>
              </div>
              {a.body && <p className="text-slate-500 text-[11px]">{a.body}</p>}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
