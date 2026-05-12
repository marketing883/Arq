"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SiteNav } from "@/components/site-dark/SiteNav";
import { SiteFooter } from "@/components/site-dark/SiteFooter";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    company: "",
    message: "",
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
          message: formData.message,
          inquiryType: "general",
          website_url: formData.website_url,
          _formLoadedAt: formLoadedAt,
        }),
      });
      if (response.ok) {
        setSubmitStatus("success");
        setFormData({ fullName: "", email: "", company: "", message: "", website_url: "" });
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="arq-dark min-h-screen">
      <SiteNav />
      <main>
        <section className="a-section" style={{ paddingTop: "clamp(140px, 16vh, 200px)" }}>
          <div className="a-wrap">
            <span className="a-eyebrow">Contact</span>
            <h1 className="h-display" style={{ marginTop: 18, maxWidth: "18ch" }}>
              Talk to <em>us</em>.
            </h1>
            <p className="lede" style={{ marginTop: 28, maxWidth: "62ch" }}>
              Tell us what your operation needs. We&apos;ll tell you what&apos;s honestly possible. In plain language.
              Without a deck.
            </p>
          </div>
        </section>

        <section className="a-section">
          <div className="a-wrap">
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 40, alignItems: "start" }} className="contact-grid">
              {/* Info */}
              <div>
                <span className="a-eyebrow">General inquiries</span>
                <h2 className="h-section" style={{ marginTop: 18, fontSize: "clamp(28px, 3.4vw, 44px)" }}>
                  For anything else,<br />
                  write to us.
                </h2>
                <a
                  href="mailto:hello@thearq.ai"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    color: "var(--ember)",
                    fontSize: 22,
                    fontWeight: 500,
                    marginTop: 24,
                    marginBottom: 32,
                  }}
                >
                  hello@thearq.ai
                </a>

                <div style={{ borderTop: "1px solid var(--aline)", paddingTop: 24, display: "flex", flexDirection: "column", gap: 20 }}>
                  <RouteRow label="Engagements and demos" value="Bring your workflow" href="/engage-us" />
                  <RouteRow label="Partnerships and design partners" value="partnerships@aciinfotech.net" href="mailto:partnerships@aciinfotech.net" />
                  <RouteRow label="Press and analyst" value="marketing@aciinfotech.net" href="mailto:marketing@aciinfotech.net" />
                  <RouteRow label="Careers" value="See open roles" href="/careers" />
                </div>
              </div>

              {/* Form */}
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
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="a-card" style={{ padding: 32, position: "relative" }}>
                    <div className="d-honeypot" aria-hidden="true">
                      <input type="text" name="website_url" value={formData.website_url} onChange={handleChange} tabIndex={-1} autoComplete="off" />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }} className="contact-fields">
                      <DarkField label="Full name" required>
                        <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} className="d-input" />
                      </DarkField>
                      <DarkField label="Work email" required>
                        <input type="email" name="email" required value={formData.email} onChange={handleChange} className="d-input" />
                      </DarkField>
                    </div>
                    <DarkField label="Company">
                      <input type="text" name="company" value={formData.company} onChange={handleChange} className="d-input" />
                    </DarkField>
                    <DarkField label="Message" required>
                      <textarea
                        name="message"
                        rows={5}
                        required
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us a little about what you're trying to do."
                        className="d-input"
                        style={{ resize: "vertical" }}
                      />
                    </DarkField>

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

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="a-btn a-btn-primary"
                      style={{ width: "100%", justifyContent: "center", marginTop: 20 }}
                    >
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
        @media (min-width: 900px) {
          .arq-dark .contact-grid { grid-template-columns: 5fr 7fr !important; gap: 64px !important; }
        }
        @media (max-width: 600px) {
          .arq-dark .contact-fields { grid-template-columns: 1fr !important; }
        }
        .arq-dark .d-input {
          width: 100%;
          padding: 12px 14px;
          border-radius: 10px;
          background: rgba(245,239,230,0.04);
          border: 1px solid var(--aline-2);
          color: var(--ink-cream);
          font-family: inherit;
          font-size: 14.5px;
          line-height: 1.5;
          transition: border-color .2s, background .2s;
        }
        .arq-dark .d-input:focus {
          outline: none;
          border-color: var(--ember);
          background: rgba(245,239,230,0.06);
        }
        .arq-dark .d-input::placeholder { color: var(--ink-muted); }
        .arq-dark .d-honeypot {
          position: absolute; left: -9999px; opacity: 0; pointer-events: none;
        }
      `}</style>
    </div>
  );
}

function DarkField({
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

function RouteRow({ label, value, href }: { label: string; value: string; href: string }) {
  return (
    <div>
      <p style={{ fontFamily: "var(--mono)", fontSize: 10.5, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--ink-muted)", margin: "0 0 6px" }}>
        {label}
      </p>
      {href.startsWith("/") ? (
        <Link href={href} style={{ color: "var(--ink-cream)", fontSize: 15 }}>
          {value} <span style={{ color: "var(--ember)" }}>→</span>
        </Link>
      ) : (
        <a href={href} style={{ color: "var(--ink-cream)", fontSize: 15 }}>
          {value}
        </a>
      )}
    </div>
  );
}
