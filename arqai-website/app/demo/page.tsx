"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SiteNav } from "@/components/site-dark/SiteNav";
import { SiteFooter } from "@/components/site-dark/SiteFooter";

export default function EngageUsPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    company: "",
    role: "",
    industry: "",
    product: "",
    notes: "",
    website_url: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [formLoadedAt, setFormLoadedAt] = useState(0);

  useEffect(() => {
    setFormLoadedAt(Date.now());
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          company: formData.company,
          jobTitle: formData.role,
          message: `Industry: ${formData.industry}\nWorkflow / Use case: ${formData.product}\n\n${formData.notes}`,
          inquiryType: "demo",
          website_url: formData.website_url,
          _formLoadedAt: formLoadedAt,
        }),
      });
      if (response.ok) {
        setSubmitStatus("success");
        setFormData({ fullName: "", email: "", company: "", role: "", industry: "", product: "", notes: "", website_url: "" });
        setFormLoadedAt(Date.now());
      } else {
        setSubmitStatus("error");
      }
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="arq-dark min-h-screen">
      <SiteNav />
      <main>
        <section className="a-section" style={{ paddingTop: "clamp(140px, 16vh, 200px)" }}>
          <div className="a-wrap">
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 56, alignItems: "start" }} className="engage-grid">
              <div>
                <span className="a-eyebrow">Engage us</span>
                <h1 className="h-display" style={{ marginTop: 18, maxWidth: "16ch", fontSize: "clamp(40px, 5.4vw, 76px)" }}>
                  Tell us what your operation <em>needs</em>.
                </h1>
                <p className="lede" style={{ marginTop: 24, maxWidth: "52ch" }}>
                  We&apos;ll tell you what&apos;s honestly possible. In plain language. Without a deck. Bring a sample
                  of your data and we&apos;ll show you what changes when ArqAI Labs is in your operation.
                </p>
                <ul style={{ listStyle: "none", padding: 0, marginTop: 28, display: "flex", flexDirection: "column", gap: 12 }}>
                  {[
                    "Plain-language read on whether your workflow fits",
                    "Concrete deployment plan with a committed timeline",
                    "Senior engineering team in the room from day one",
                  ].map((item) => (
                    <li key={item} style={{ display: "flex", gap: 12, alignItems: "flex-start", color: "var(--ink-cream-d)", fontSize: 15 }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--ember)" strokeWidth={2.5} style={{ flexShrink: 0, marginTop: 2 }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                {submitStatus === "success" ? (
                  <div className="a-card" style={{ padding: 40, textAlign: "center" }}>
                    <div
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: 999,
                        background: "rgba(208,244,56,0.10)",
                        border: "1px solid rgba(208,244,56,0.35)",
                        display: "grid",
                        placeItems: "center",
                        margin: "0 auto 20px",
                      }}
                    >
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--ember)" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 style={{ fontFamily: "var(--display)", fontSize: 24, fontWeight: 500, letterSpacing: "-0.02em", color: "var(--ink-cream)", margin: "0 0 12px" }}>
                      Thanks. We&apos;ll be in touch.
                    </h3>
                    <p style={{ color: "var(--ink-cream-d)", fontSize: 15, margin: 0 }}>
                      A senior on our team will reach out within one business day.
                    </p>
                    <Link href="/" className="a-btn a-btn-ghost" style={{ marginTop: 28 }}>
                      Back to home
                    </Link>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="a-card" style={{ padding: 32, position: "relative" }}>
                    <div className="d-honeypot" aria-hidden="true">
                      <input type="text" name="website_url" value={formData.website_url} onChange={handleChange} tabIndex={-1} autoComplete="off" />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="engage-fields">
                      <Field label="Full name" required>
                        <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} className="d-input" />
                      </Field>
                      <Field label="Work email" required>
                        <input type="email" name="email" required value={formData.email} onChange={handleChange} className="d-input" />
                      </Field>
                      <Field label="Company" required>
                        <input type="text" name="company" required value={formData.company} onChange={handleChange} className="d-input" />
                      </Field>
                      <Field label="Role" required>
                        <input type="text" name="role" required value={formData.role} onChange={handleChange} className="d-input" />
                      </Field>
                    </div>
                    <Field label="Industry" required>
                      <select name="industry" required value={formData.industry} onChange={handleChange} className="d-input">
                        <option value="">Select industry</option>
                        <option value="healthcare-payer">Healthcare payer</option>
                        <option value="pc-insurance">P&C insurance</option>
                        <option value="banking">Banking</option>
                        <option value="retail">Retail</option>
                        <option value="manufacturing">Manufacturing</option>
                        <option value="other">Other</option>
                      </select>
                    </Field>
                    <Field label="Which workflow or use case are you exploring?" required>
                      <input
                        type="text"
                        name="product"
                        required
                        placeholder="e.g. fraud detection, claims triage, custom build"
                        value={formData.product}
                        onChange={handleChange}
                        className="d-input"
                      />
                    </Field>
                    <Field label="Anything else we should know?">
                      <textarea name="notes" rows={4} value={formData.notes} onChange={handleChange} className="d-input" style={{ resize: "vertical" }} />
                    </Field>

                    {submitStatus === "error" && (
                      <div
                        style={{
                          marginTop: 12,
                          padding: 12,
                          background: "rgba(255, 90, 90, 0.08)",
                          border: "1px solid rgba(255, 90, 90, 0.3)",
                          borderRadius: 8,
                          color: "rgba(255,200,200,0.95)",
                          fontSize: 13,
                        }}
                      >
                        Something went wrong. Please try again or email us at{" "}
                        <a href="mailto:hello@thearq.ai" style={{ color: "var(--ember)", textDecoration: "underline" }}>
                          hello@thearq.ai
                        </a>
                        .
                      </div>
                    )}

                    <button type="submit" disabled={isSubmitting} className="a-btn a-btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 20 }}>
                      {isSubmitting ? "Sending..." : "Send"}
                    </button>

                    <p style={{ marginTop: 16, fontSize: 12, color: "var(--ink-muted)", textAlign: "center" }}>
                      We use this only to follow up.{" "}
                      <Link href="/privacy" style={{ color: "var(--ember)" }}>
                        Privacy notice
                      </Link>
                      .
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
      <style>{`
        @media (min-width: 1000px) {
          .arq-dark .engage-grid { grid-template-columns: 1fr 1fr !important; gap: 80px !important; }
        }
        @media (max-width: 600px) {
          .arq-dark .engage-fields { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label style={{ display: "block", marginBottom: 16 }}>
      <span
        style={{
          display: "block",
          fontFamily: "var(--mono)",
          fontSize: 11,
          letterSpacing: ".1em",
          textTransform: "uppercase",
          color: "var(--ink-cream-d)",
          marginBottom: 8,
        }}
      >
        {label} {required && <span style={{ color: "var(--ember)" }}>*</span>}
      </span>
      {children}
    </label>
  );
}
