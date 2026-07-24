"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { trackGenerateLead } from "@/lib/analytics/gtm-events";
import { getAttribution } from "@/lib/attribution/visitor-context";
import { getPageContext } from "@/lib/attribution/page-context";
import { inferCompanyFromEmail, getReturningVisitor } from "@/lib/attribution/smart-prefill";

type Props = {
  acceleratorName: string;
  acceleratorCategory: string;
};

type StartMode = "" | "demo" | "assessment" | "both";

export default function AcceleratorForm({ acceleratorName, acceleratorCategory }: Props) {
  const pathname = usePathname();
  const pageContext = getPageContext(pathname);
  const demoReady = !!pageContext?.demoReady;
  const [startMode, setStartMode] = useState<StartMode>("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [formLoadedAt, setFormLoadedAt] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [wantsEntryPoint, setWantsEntryPoint] = useState(false);
  const [welcomeBack, setWelcomeBack] = useState("");

  useEffect(() => {
    setFormLoadedAt(Date.now());
    // Returning-visitor memory: pre-fill identity fields the visitor already
    // shared with the chat widget.
    const visitor = getReturningVisitor();
    if (visitor) {
      setFullName((prev) => prev || visitor.name);
      setEmail((prev) => prev || visitor.email);
      setCompany((prev) => prev || visitor.company);
      if (visitor.name) setWelcomeBack(visitor.name.split(" ")[0]);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ([fullName, email, company, jobTitle].some((v) => v.trim().length === 0)) {
      setError("Please complete the required fields.");
      return;
    }
    if (demoReady && !startMode) {
      setError("Choose how you'd like to start.");
      return;
    }
    setSubmitting(true);
    setError(null);

    const wantsDemo = startMode === "demo" || startMode === "both";
    const wantsAssessment = demoReady
      ? startMode === "assessment" || startMode === "both"
      : wantsEntryPoint;
    const composedMessage = [
      `Accelerator interest: ${acceleratorName} (${acceleratorCategory}).`,
      wantsDemo ? `\nRequested: live demo of ${acceleratorName}.` : "",
      wantsAssessment && pageContext?.entryPoint
        ? `\nRequested entry point: ${pageContext.entryPoint.name}.`
        : "",
      message.trim() ? `\nWhat they want to improve:\n${message.trim()}` : "",
    ].join("");

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
          message: composedMessage,
          inquiryType: wantsDemo ? "demo" : "accelerator",
          workflowArea: `${acceleratorName} accelerator`,
          website_url: website,
          _formLoadedAt: formLoadedAt,
          attribution: {
            ...getAttribution(),
            // The form lives on the accelerator page itself — that IS the source.
            sourcePage:
              typeof window !== "undefined" ? window.location.pathname : "",
            sourceContext: acceleratorName,
          },
        }),
      });
      const body = await res.json().catch(() => null);
      if (res.ok && body?.success) {
        trackGenerateLead({
          form_name: "accelerator_form",
          inquiry_type: wantsDemo ? "demo" : "accelerator",
          accelerator_name: acceleratorName,
          workflow_area: `${acceleratorName} accelerator`,
          value: company ? 100 : 50,
        });
        setStatus("success");
        setFullName("");
        setEmail("");
        setCompany("");
        setJobTitle("");
        setPhone("");
        setMessage("");
        setWantsEntryPoint(false);
        setStartMode("");
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

  if (status === "success") {
    return (
      <div className="v5-card v5-success">
        <div className="v5-success-mark">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--v5-ink)" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="v5-h3">Thanks. We&apos;ve got it.</h3>
        <p className="v5-body" style={{ marginTop: 8 }}>
          A confirmation is on its way to your inbox, and a senior member of our team will
          reach out within one business day to scope {acceleratorName} against your workflow.
        </p>
      </div>
    );
  }

  return (
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

      <div className="v5-form-grid two">
        <label className="v5-field">
          <span className="v5-field-label">Full name <span className="req">*</span></span>
          <input className="v5-input" type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} autoComplete="name" />
        </label>
        <label className="v5-field">
          <span className="v5-field-label">Work email <span className="req">*</span></span>
          <input
            className="v5-input"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => {
              if (company || !email) return;
              const inferred = inferCompanyFromEmail(email);
              if (inferred) setCompany((prev) => prev || inferred);
            }}
            autoComplete="email"
          />
        </label>
      </div>

      <div className="v5-form-grid two">
        <label className="v5-field">
          <span className="v5-field-label">Company <span className="req">*</span></span>
          <input className="v5-input" type="text" required value={company} onChange={(e) => setCompany(e.target.value)} autoComplete="organization" />
        </label>
        <label className="v5-field">
          <span className="v5-field-label">Role <span className="req">*</span></span>
          <input className="v5-input" type="text" required value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} autoComplete="organization-title" />
        </label>
      </div>

      <label className="v5-field">
        <span className="v5-field-label">Phone</span>
        <input className="v5-input" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" />
      </label>

      <label className="v5-field">
        <span className="v5-field-label">
          {pageContext?.question?.label ?? "What workflow are you trying to improve?"}
        </span>
        <textarea
          className="v5-input"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={
            pageContext?.question?.placeholder ??
            `Tell us about the queue, volume, systems, or metric you want ${acceleratorName} to move.`
          }
        />
      </label>

      {demoReady && pageContext?.entryPoint ? (
        <div className="v5-field" role="group" aria-label="How would you like to start?">
          <span className="v5-field-label">
            How would you like to start? <span className="req">*</span>
          </span>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {(
              [
                {
                  value: "demo" as const,
                  title: `See a live ${acceleratorName} demo`,
                  blurb: "a walkthrough of the product on a real workflow, with your questions answered live",
                },
                {
                  value: "assessment" as const,
                  title: `Start with the ${pageContext.entryPoint.name}`,
                  blurb: `${pageContext.entryPoint.blurb}. No build commitment`,
                },
                {
                  value: "both" as const,
                  title: "Both: demo first, then the assessment",
                  blurb: "see it live, then put it to work on your own data",
                },
              ]
            ).map((opt) => (
              <label
                key={opt.value}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  padding: "10px 12px",
                  background: startMode === opt.value ? "#f5f8ec" : "var(--v5-white)",
                  border: `1px solid ${startMode === opt.value ? "#e3eeba" : "#e2e2e2"}`,
                  borderRadius: 10,
                  cursor: "pointer",
                  fontSize: 13,
                  lineHeight: 1.5,
                }}
              >
                <input
                  type="radio"
                  name="start_mode"
                  checked={startMode === opt.value}
                  onChange={() => setStartMode(opt.value)}
                  style={{ marginTop: 3, accentColor: "var(--v5-ink)" }}
                />
                <span>
                  <strong>{opt.title}:</strong> {opt.blurb}.
                </span>
              </label>
            ))}
          </div>
        </div>
      ) : (
        pageContext?.entryPoint && (
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
              <strong>Start with the {pageContext.entryPoint.name}:</strong>{" "}
              {pageContext.entryPoint.blurb}. The usual first step, with no build commitment.
            </span>
          </label>
        )
      )}

      {welcomeBack && (
        <p className="v5-form-note" style={{ marginTop: 0 }}>
          Welcome back, {welcomeBack}. We&apos;ve filled in what you shared with us earlier.
        </p>
      )}

      {status === "error" && error && <div className="v5-form-error">{error}</div>}

      <button type="submit" disabled={submitting} className="v5-btn v5-btn-primary v5-form-submit">
        {submitting
          ? "Sending..."
          : demoReady
            ? startMode === "assessment"
              ? "Request the assessment"
              : startMode === "both"
                ? "Book the demo + assessment"
                : `Book a ${acceleratorName} demo`
            : `Request a ${acceleratorName} walkthrough`}
      </button>

      <p className="v5-form-note">
        Use your work email. We use this only to follow up. <Link href="/privacy">Privacy notice</Link>.
      </p>
    </form>
  );
}
