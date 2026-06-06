"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Props = {
  acceleratorName: string;
  acceleratorCategory: string;
};

export default function AcceleratorForm({ acceleratorName, acceleratorCategory }: Props) {
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

  useEffect(() => {
    setFormLoadedAt(Date.now());
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ([fullName, email, company, jobTitle].some((v) => v.trim().length === 0)) {
      setError("Please complete the required fields.");
      return;
    }
    setSubmitting(true);
    setError(null);

    const composedMessage = [
      `Accelerator interest: ${acceleratorName} (${acceleratorCategory}).`,
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
          inquiryType: "accelerator",
          workflowArea: `${acceleratorName} accelerator`,
          website_url: website,
          _formLoadedAt: formLoadedAt,
        }),
      });
      const body = await res.json().catch(() => null);
      if (res.ok && body?.success) {
        setStatus("success");
        setFullName("");
        setEmail("");
        setCompany("");
        setJobTitle("");
        setPhone("");
        setMessage("");
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
        <h3 className="v5-h3">Thanks — we&apos;ve got it.</h3>
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
          <input className="v5-input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
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
        <span className="v5-field-label">What workflow are you trying to improve?</span>
        <textarea
          className="v5-input"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={`Tell us about the queue, volume, systems, or metric you want ${acceleratorName} to move.`}
        />
      </label>

      {status === "error" && error && <div className="v5-form-error">{error}</div>}

      <button type="submit" disabled={submitting} className="v5-btn v5-btn-primary v5-form-submit">
        {submitting ? "Sending..." : `Request a ${acceleratorName} walkthrough`}
      </button>

      <p className="v5-form-note">
        Use your work email. We use this only to follow up. <Link href="/privacy">Privacy notice</Link>.
      </p>
    </form>
  );
}
