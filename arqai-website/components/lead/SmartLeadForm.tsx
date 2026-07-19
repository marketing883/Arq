"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { trackGenerateLead } from "@/lib/analytics/gtm-events";
import { getAttribution, getPreviousPage } from "@/lib/attribution/visitor-context";
import {
  getPageContext,
  genericIntents,
  timelineToSlug,
  TIMELINE_QUALIFIER,
  type PageContext,
  type Qualifier,
  type GenericIntent,
} from "@/lib/attribution/page-context";
import { inferCompanyFromEmail, getReturningVisitor } from "@/lib/attribution/smart-prefill";

export const HQ_ADDRESS =
  "220 Davidson Ave, 2nd Floor, Suite 209, Somerset, NJ 08873, United States";

type Props = {
  /** GTM form identifier, e.g. "contact_form" or "engagement_form". */
  formName: string;
  /** The route this form lives on — used for attribution. */
  formPath: "/contact" | "/engage-us";
  /** Heading when we don't know what the visitor is here for. */
  defaultHeading: string;
  /** Inquiry type when no context or intent supplies one. */
  defaultInquiryType: string;
  /** Submit button label. */
  ctaLabel: string;
};

function headingFor(ctx: PageContext | null, fallback: string): string {
  if (!ctx) return fallback;
  if (ctx.kind === "industry") return `Let's talk about AI for ${ctx.shortLabel.toLowerCase()}.`;
  if (ctx.kind === "case-study") return "Want results like these?";
  return `Let's talk about ${ctx.shortLabel}.`;
}

/** "Claims volume per month" / "When are you looking to move?" -> summary line label. */
function lineLabel(q: Qualifier): string {
  return q.label.replace(/\?$/, "");
}

export default function SmartLeadForm(props: Props) {
  return (
    <Suspense fallback={null}>
      <SmartLeadFormInner {...props} />
    </Suspense>
  );
}

function SmartLeadFormInner({
  formName,
  formPath,
  defaultHeading,
  defaultInquiryType,
  ctaLabel,
}: Props) {
  const params = useSearchParams();

  // Identity
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [phone, setPhone] = useState("");
  const [welcomeBack, setWelcomeBack] = useState("");

  // Context / intent
  const [ctx, setCtx] = useState<PageContext | null>(null);
  const [sourcePage, setSourcePage] = useState("");
  const [intentId, setIntentId] = useState("");
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [wantsEntryPoint, setWantsEntryPoint] = useState(false);
  const [note, setNote] = useState("");

  // Mechanics
  const [website, setWebsite] = useState(""); // honeypot
  const [formLoadedAt, setFormLoadedAt] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFormLoadedAt(Date.now());
    const visitor = getReturningVisitor();
    if (visitor) {
      setFullName((prev) => prev || visitor.name);
      setEmail((prev) => prev || visitor.email);
      setCompany((prev) => prev || visitor.company);
      if (visitor.name) setWelcomeBack(visitor.name.split(" ")[0]);
    }
  }, []);

  useEffect(() => {
    if (!params) return;
    const source = params.get("source") || getPreviousPage(formPath);
    if (source) setSourcePage(source);
    const resolved = getPageContext(source);
    if (resolved) setCtx(resolved);
  }, [params, formPath]);

  const intent: GenericIntent | null = useMemo(
    () => genericIntents.find((i) => i.id === intentId) ?? null,
    [intentId]
  );

  // The questions currently on screen.
  const activeQualifiers: Qualifier[] = useMemo(() => {
    if (ctx) return ctx.qualifiers ?? [TIMELINE_QUALIFIER];
    if (intent && !intent.routeTo) return intent.qualifiers;
    return [];
  }, [ctx, intent]);

  const heading = headingFor(ctx, defaultHeading);
  const sub = ctx
    ? "A few quick questions and we'll come back within one business day."
    : "Tell us a little about you — we'll come back within one business day.";

  const pick = (q: Qualifier, option: string) => {
    setAnswers((prev) => {
      if (q.type === "radio") return { ...prev, [q.id]: option };
      const current = Array.isArray(prev[q.id]) ? (prev[q.id] as string[]) : [];
      return {
        ...prev,
        [q.id]: current.includes(option)
          ? current.filter((o) => o !== option)
          : [...current, option],
      };
    });
  };

  const isPicked = (q: Qualifier, option: string) => {
    const a = answers[q.id];
    return q.type === "radio" ? a === option : Array.isArray(a) && a.includes(option);
  };

  const clearContext = () => {
    setCtx(null);
    setAnswers({});
    setWantsEntryPoint(false);
  };

  const handleEmailBlur = () => {
    if (company || !email) return;
    const inferred = inferCompanyFromEmail(email);
    if (inferred) setCompany((prev) => prev || inferred);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ([fullName, email, company, jobTitle].some((v) => v.trim().length === 0)) {
      setError("Please complete the required fields.");
      return;
    }
    setSubmitting(true);
    setError(null);

    const timelineAnswer = typeof answers.timeline === "string" ? answers.timeline : undefined;
    const answerLines = activeQualifiers
      .map((q) => {
        const a = answers[q.id];
        if (!a || (Array.isArray(a) && a.length === 0)) return null;
        return `${lineLabel(q)}: ${Array.isArray(a) ? a.join(", ") : a}`;
      })
      .filter(Boolean) as string[];

    const message =
      [
        ctx ? `Interest: ${ctx.shortLabel}` : intent ? `Interest: ${intent.label}` : null,
        wantsEntryPoint && ctx?.entryPoint
          ? `Requested entry point: ${ctx.entryPoint.name}.`
          : null,
        ...answerLines,
        note.trim() ? `Note from visitor: ${note.trim()}` : null,
      ]
        .filter(Boolean)
        .join("\n") || "Submitted via contact form.";

    const inquiryType =
      ctx?.contact?.inquiryType ?? intent?.inquiryType ?? defaultInquiryType;
    const workflowArea =
      ctx?.contact?.workflowArea ??
      (ctx ? `${ctx.shortLabel} inquiry` : intent?.workflowArea) ??
      "General inquiry";

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName,
          email,
          company,
          jobTitle,
          phone: phone || undefined,
          message,
          inquiryType,
          industry: ctx?.contact?.industry || "",
          workflowArea,
          timeline: timelineToSlug(timelineAnswer),
          website_url: website,
          _formLoadedAt: formLoadedAt,
          attribution: {
            ...getAttribution(formPath),
            ...(sourcePage ? { sourcePage } : {}),
            sourceContext: ctx?.shortLabel || intent?.label || "",
          },
        }),
      });
      const body = await res.json().catch(() => null);
      if (res.ok && body?.success) {
        trackGenerateLead({
          form_name: formName,
          inquiry_type: inquiryType,
          industry: ctx?.contact?.industry || "",
          timeline: timelineToSlug(timelineAnswer),
          workflow_area: workflowArea,
          value: company ? 100 : 50,
        });
        setStatus("success");
      } else {
        setStatus("error");
        setError(body?.error || "Could not send. Please try again.");
      }
    } catch {
      setStatus("error");
      setError("Could not send. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Heading — short, human, intent-aware, deliberately smaller than v5-h1 */}
      <section className="v5-page-hero" style={{ paddingBottom: 8 }}>
        <div className="v5-container" style={{ maxWidth: 820 }}>
          <h1
            className="v5-h1"
            style={{ fontSize: "clamp(26px, 3.2vw, 38px)", lineHeight: 1.15 }}
          >
            {heading}
          </h1>
          <p className="v5-lead" style={{ marginTop: 10, fontSize: 16 }}>
            {sub}
          </p>
        </div>
      </section>

      {/* The form is the page */}
      <section className="v5-section v5-bg-grey" style={{ paddingTop: 28 }}>
        <div className="v5-container" style={{ maxWidth: 820 }}>
          {status === "success" ? (
            <div className="v5-card v5-success">
              <div className="v5-success-mark">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--v5-ink)" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="v5-h3">Thanks. We have what we need.</h3>
              <p className="v5-body" style={{ marginTop: 8 }}>
                We&apos;ll come back within one business day.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="v5-card v5-form" style={{ position: "relative" }} noValidate>
              <div className="v5-honeypot" aria-hidden="true">
                <input
                  type="text"
                  name="website_url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              {welcomeBack && (
                <p className="v5-form-note" style={{ marginTop: 0 }}>
                  Welcome back, {welcomeBack} — we&apos;ve filled in what you shared with us
                  earlier.
                </p>
              )}

              {/* Who you are — the only typing */}
              <div className="v5-form-grid two">
                <Field label="Full name" required>
                  <input className="v5-input" type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} autoComplete="name" />
                </Field>
                <Field label="Work email" required>
                  <input className="v5-input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} onBlur={handleEmailBlur} autoComplete="email" />
                </Field>
              </div>
              <div className="v5-form-grid two">
                <Field label="Company" required>
                  <input className="v5-input" type="text" required value={company} onChange={(e) => setCompany(e.target.value)} autoComplete="organization" />
                </Field>
                <Field label="Job title" required>
                  <input className="v5-input" type="text" required value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} autoComplete="organization-title" />
                </Field>
              </div>
              <Field label="Phone (optional)">
                <input className="v5-input" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" />
              </Field>

              {/* About your situation — all clicks, no typing */}
              {ctx ? (
                <div style={{ marginTop: 6 }}>
                  <p className="v5-form-note" style={{ marginTop: 0, marginBottom: 14 }}>
                    A couple of quick questions about {ctx.shortLabel}.{" "}
                    <button
                      type="button"
                      onClick={clearContext}
                      style={{ background: "none", border: "none", padding: 0, font: "inherit", textDecoration: "underline", cursor: "pointer", color: "inherit" }}
                    >
                      Here about something else?
                    </button>
                  </p>
                </div>
              ) : (
                <Field label="What brings you in?" group>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {genericIntents.map((i) => (
                      <label className="v5-system-chip" key={i.id}>
                        <input
                          type="radio"
                          name="intent"
                          checked={intentId === i.id}
                          onChange={() => {
                            setIntentId(i.id);
                            setAnswers({});
                          }}
                        />
                        <span>{i.label}</span>
                      </label>
                    ))}
                  </div>
                </Field>
              )}

              {intent?.routeTo && !ctx && (
                <div className="v5-prefill" style={{ marginBottom: 18 }}>
                  <div className="v5-prefill-note" style={{ marginTop: 0 }}>
                    <Link href={intent.routeTo.href} style={{ textDecoration: "underline" }}>
                      {intent.routeTo.label}
                    </Link>
                  </div>
                </div>
              )}

              {activeQualifiers.map((q) => (
                <Field label={q.label} key={q.id} group>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {q.options.map((option) => (
                      <label className="v5-system-chip" key={option}>
                        <input
                          type={q.type === "radio" ? "radio" : "checkbox"}
                          name={q.id}
                          checked={isPicked(q, option)}
                          onChange={() => pick(q, option)}
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </Field>
              ))}

              {ctx?.entryPoint && (
                <label
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                    padding: "10px 12px",
                    background: "#f5f8ec",
                    border: "1px solid #e3eeba",
                    borderRadius: 10,
                    cursor: "pointer",
                    fontSize: 13,
                    lineHeight: 1.5,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={wantsEntryPoint}
                    onChange={(e) => setWantsEntryPoint(e.target.checked)}
                    style={{ marginTop: 3 }}
                  />
                  <span>
                    <strong>Start with the {ctx.entryPoint.name}</strong> — {ctx.entryPoint.blurb}.
                    The usual first step, with no build commitment.
                  </span>
                </label>
              )}

              <Field label="Anything else we should know? (optional)">
                <textarea
                  className="v5-input"
                  rows={2}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Only if there's something the questions above didn't cover."
                />
              </Field>

              {status === "error" && error && <div className="v5-form-error">{error}</div>}

              <button type="submit" disabled={submitting} className="v5-btn v5-btn-primary v5-form-submit">
                {submitting ? "Sending..." : ctaLabel}
              </button>

              <p className="v5-form-note">
                We use this only to follow up. <Link href="/privacy">Privacy notice</Link>.
              </p>
            </form>
          )}

          {/* Quiet strip: HQ + misroute links. One line each, no panels. */}
          <div style={{ marginTop: 22, fontSize: 13, color: "var(--v5-ink-soft)", lineHeight: 1.8 }}>
            <p style={{ margin: 0 }}>ArqAI Labs HQ — {HQ_ADDRESS}</p>
            <p style={{ margin: 0 }}>
              Partnerships? <Link href="/partners" style={{ textDecoration: "underline" }}>Use the partner intake</Link>.
              {"  "}Careers? <Link href="/careers" style={{ textDecoration: "underline" }}>See open roles</Link>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

function Field({
  label,
  required,
  group,
  children,
}: {
  label: string;
  required?: boolean;
  /** Render as a div — required when children contain their own labels (chips). */
  group?: boolean;
  children: React.ReactNode;
}) {
  const inner = (
    <>
      <span className="v5-field-label">
        {label} {required && <span className="req">*</span>}
      </span>
      {children}
    </>
  );
  return group ? (
    <div className="v5-field" role="group" aria-label={label}>
      {inner}
    </div>
  ) : (
    <label className="v5-field">{inner}</label>
  );
}
