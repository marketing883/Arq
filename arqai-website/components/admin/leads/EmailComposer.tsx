"use client";

/**
 * AI-assisted email composer for the Lead Command Center.
 *
 * A slide-over panel where the team writes, generates, refines, and sends
 * emails to a lead without leaving the dashboard. Every AI draft is editable;
 * sending is always an explicit human click behind a confirm.
 */

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getTimeAgo } from "./leadUi";
import type { LeadEmail, LeadProfile, LeadDossier } from "@/types/lead-intelligence-v2";

const REFINE_CHIPS: Array<{ label: string; instruction: string }> = [
  { label: "Shorter", instruction: "Make it noticeably shorter while keeping the core message and call to action." },
  { label: "Friendlier", instruction: "Make the tone warmer and more conversational without losing professionalism." },
  { label: "More direct", instruction: "Make it more direct and confident. Get to the point in the first sentence." },
  { label: "Add CTA", instruction: "End with one clear, low-friction call to action proposing a specific next step." },
  { label: "Formal", instruction: "Make the tone more formal and polished for a senior executive reader." },
];

interface EmailComposerProps {
  open: boolean;
  onClose: () => void;
  profile: LeadProfile;
  dossier: LeadDossier | null;
  emails: LeadEmail[];
  /** Refetch command center data after saves/sends. */
  onChanged: () => Promise<void> | void;
}

export default function EmailComposer({
  open,
  onClose,
  profile,
  dossier,
  emails,
  onChanged,
}: EmailComposerProps) {
  const [emailId, setEmailId] = useState<string | undefined>();
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [instruction, setInstruction] = useState("");
  const [aiTouched, setAiTouched] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const drafts = emails.filter((e) => e.status === "draft");
  const sentEmails = emails.filter((e) => e.status !== "draft");

  // Seed the composer when opened: newest saved draft, else the research
  // agent's dossier draft, else blank.
  useEffect(() => {
    if (!open) return;
    setNotice("");
    setError("");
    if (emailId) return; // keep whatever is being edited
    const latestDraft = drafts[0];
    if (latestDraft) {
      setEmailId(latestDraft.id);
      setSubject(latestDraft.subject);
      setBody(latestDraft.body);
      setAiTouched(latestDraft.generated_by !== "human");
    } else if (dossier?.draft_email?.subject || dossier?.draft_email?.body) {
      setSubject(dossier.draft_email.subject || "");
      setBody(dossier.draft_email.body || "");
      setAiTouched(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const post = useCallback(
    async (payload: Record<string, unknown>) => {
      const res = await fetch("/api/admin/leads-v2", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile_id: profile.id, ...payload }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Request failed");
      return json;
    },
    [profile.id]
  );

  const generate = async (customInstruction?: string) => {
    setGenerating(true);
    setError("");
    setNotice("");
    try {
      const hasDraft = !!body.trim();
      const json = await post({
        action: "generate_email",
        instruction: customInstruction || instruction || undefined,
        // With text present, the AI refines it; empty means a fresh draft.
        current_subject: hasDraft ? subject : undefined,
        current_body: hasDraft ? body : undefined,
      });
      setSubject(json.email.subject);
      setBody(json.email.body);
      setAiTouched(true);
      setNotice(hasDraft ? "Draft refined. Review and edit before sending." : "Draft generated. Review and edit before sending.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setGenerating(false);
    }
  };

  const saveDraft = async () => {
    if (!subject.trim() && !body.trim()) return;
    setSaving(true);
    setError("");
    try {
      const json = await post({
        action: "save_email_draft",
        email_id: emailId,
        subject,
        email_body: body,
        generated_by: aiTouched ? "ai_edited" : "human",
        instruction: instruction || undefined,
        dossier_id: dossier?.id,
      });
      setEmailId(json.email.id);
      setNotice("Draft saved.");
      await onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const send = async () => {
    if (!subject.trim() || !body.trim()) return;
    if (!confirm(`Send this email to ${profile.canonical_email}?`)) return;
    setSending(true);
    setError("");
    try {
      await post({
        action: "send_email",
        email_id: emailId,
        subject,
        email_body: body,
      });
      setNotice("Email sent.");
      setEmailId(undefined);
      setSubject("");
      setBody("");
      setInstruction("");
      setAiTouched(false);
      await onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Send failed");
    } finally {
      setSending(false);
    }
  };

  const loadEmail = (e: LeadEmail) => {
    if (e.status === "draft") {
      setEmailId(e.id);
    } else {
      // Sent emails load as a fresh follow-up draft, never overwritten.
      setEmailId(undefined);
    }
    setSubject(e.status === "draft" ? e.subject : `Re: ${e.subject}`);
    setBody(e.status === "draft" ? e.body : "");
    setAiTouched(e.generated_by !== "human");
    setNotice(e.status === "draft" ? "" : "Started a follow-up to a sent email.");
  };

  const newDraft = () => {
    setEmailId(undefined);
    setSubject("");
    setBody("");
    setInstruction("");
    setAiTouched(false);
    setNotice("");
    setError("");
  };

  const busy = generating || saving || sending;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 z-40"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.2 }}
            className="fixed right-0 top-0 h-full w-full sm:w-[520px] bg-white z-50 shadow-xl flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Write email</h3>
                <p className="text-[11px] text-slate-500">
                  To: {profile.canonical_email || "no email on file"}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {/* AI toolbar */}
              <div className="bg-slate-50 rounded p-3 space-y-2">
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  AI assist
                </p>
                <div className="flex gap-2">
                  <input
                    value={instruction}
                    onChange={(e) => setInstruction(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !busy) generate();
                    }}
                    placeholder={
                      body.trim()
                        ? "How should the AI change this draft?"
                        : "What should this email do? e.g. invite to a 20 min demo"
                    }
                    className="flex-1 px-2.5 py-1.5 text-xs border border-slate-200 rounded bg-white focus:outline-none focus:ring-1 focus:ring-slate-400"
                  />
                  <button
                    onClick={() => generate()}
                    disabled={busy}
                    className="px-3 py-1.5 bg-slate-900 text-white text-xs font-medium rounded hover:bg-slate-800 disabled:opacity-50 whitespace-nowrap"
                  >
                    {generating ? "Working..." : body.trim() ? "Refine" : "Generate"}
                  </button>
                </div>
                {body.trim() && (
                  <div className="flex flex-wrap gap-1.5">
                    {REFINE_CHIPS.map((chip) => (
                      <button
                        key={chip.label}
                        onClick={() => generate(chip.instruction)}
                        disabled={busy}
                        className="px-2 py-1 text-[10px] font-medium bg-white border border-slate-200 rounded-full text-slate-600 hover:border-slate-400 disabled:opacity-50"
                      >
                        {chip.label}
                      </button>
                    ))}
                  </div>
                )}
                <p className="text-[10px] text-slate-400">
                  Drafts use the research dossier, this lead&apos;s journey, and prior emails as context.
                </p>
              </div>

              {/* Draft fields */}
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Subject"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-slate-400"
              />
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={12}
                placeholder="Write the email, or let the AI draft it from the lead's context..."
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-slate-400 resize-y leading-relaxed"
              />

              {notice && <p className="text-[11px] text-emerald-600">{notice}</p>}
              {error && <p className="text-[11px] text-red-600">{error}</p>}

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={send}
                  disabled={busy || !subject.trim() || !body.trim() || !profile.canonical_email}
                  className="px-4 py-2 bg-slate-900 text-white text-xs font-medium rounded hover:bg-slate-800 disabled:opacity-50"
                >
                  {sending ? "Sending..." : "Send email"}
                </button>
                <button
                  onClick={saveDraft}
                  disabled={busy || (!subject.trim() && !body.trim())}
                  className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-medium rounded hover:bg-slate-200 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save draft"}
                </button>
                <button
                  onClick={newDraft}
                  disabled={busy}
                  className="px-3 py-2 text-xs font-medium text-slate-400 hover:text-slate-600"
                >
                  New
                </button>
              </div>

              {/* History */}
              {(drafts.length > 0 || sentEmails.length > 0) && (
                <div className="pt-3 border-t border-slate-100">
                  <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Email history
                  </p>
                  <div className="space-y-1.5">
                    {[...drafts, ...sentEmails].map((e) => (
                      <button
                        key={e.id}
                        onClick={() => loadEmail(e)}
                        className={`w-full text-left p-2 rounded border transition-colors ${
                          e.id === emailId
                            ? "border-slate-400 bg-slate-50"
                            : "border-slate-100 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs text-slate-700 truncate font-medium">
                            {e.subject || "(no subject)"}
                          </p>
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded flex-shrink-0 ${
                              e.status === "sent"
                                ? "bg-emerald-50 text-emerald-600"
                                : e.status === "failed"
                                  ? "bg-red-50 text-red-600"
                                  : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {e.status}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400">
                          {e.status === "sent" && e.sent_at
                            ? `Sent ${getTimeAgo(e.sent_at)}`
                            : `Updated ${getTimeAgo(e.updated_at)}`}
                          {e.generated_by !== "human" ? " · AI assisted" : ""}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
