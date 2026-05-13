"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SiteNav } from "@/components/site-dark/SiteNav";
import { SiteFooter } from "@/components/site-dark/SiteFooter";

const inquiryTypes = [
  { value: "workflow", label: "Workflow modernization" },
  { value: "demo", label: "Demo or build conversation" },
  { value: "governance", label: "Governance and risk" },
  { value: "integration", label: "Enterprise integration" },
  { value: "managed_ops", label: "Managed AI operations" },
  { value: "press", label: "Press or analyst" },
  { value: "general", label: "General inquiry" },
];

const companySizes = [
  { value: "startup", label: "1-50" },
  { value: "small", label: "51-200" },
  { value: "mid-market", label: "201-1,000" },
  { value: "enterprise", label: "1,000+" },
];

const timelines = [
  { value: "now", label: "Now / urgent" },
  { value: "quarter", label: "This quarter" },
  { value: "half_year", label: "Next 3-6 months" },
  { value: "exploring", label: "Exploring" },
];

const budgetRanges = [
  { value: "not_set", label: "Not set yet" },
  { value: "under_100k", label: "Under $100K" },
  { value: "100k_250k", label: "$100K-$250K" },
  { value: "250k_500k", label: "$250K-$500K" },
  { value: "500k_plus", label: "$500K+" },
];

type ContactFormData = {
  fullName: string;
  email: string;
  company: string;
  jobTitle: string;
  phone: string;
  inquiryType: string;
  companySize: string;
  industry: string;
  workflowArea: string;
  timeline: string;
  budgetRange: string;
  currentSystems: string;
  message: string;
  website_url: string;
};

const emptyForm: ContactFormData = {
  fullName: "",
  email: "",
  company: "",
  jobTitle: "",
  phone: "",
  inquiryType: "workflow",
  companySize: "",
  industry: "",
  workflowArea: "",
  timeline: "",
  budgetRange: "",
  currentSystems: "",
  message: "",
  website_url: "",
};

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactFormData>(emptyForm);
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
          jobTitle: formData.jobTitle,
          phone: formData.phone,
          inquiryType: formData.inquiryType,
          companySize: formData.companySize,
          industry: formData.industry,
          workflowArea: formData.workflowArea,
          timeline: formData.timeline,
          budgetRange: formData.budgetRange,
          currentSystems: formData.currentSystems,
          message: formData.message,
          website_url: formData.website_url,
          _formLoadedAt: formLoadedAt,
        }),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData(emptyForm);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="arq-dark min-h-screen">
      <SiteNav />
      <main>
        <section className="a-section" style={{ paddingTop: "clamp(140px, 16vh, 200px)" }}>
          <div className="a-wrap">
            <span className="a-eyebrow">Contact</span>
            <h1 className="h-display" style={{ marginTop: 18, maxWidth: "17ch" }}>
              Tell us what needs to <em>change</em>.
            </h1>
            <p className="lede" style={{ marginTop: 28, maxWidth: "62ch" }}>
              Share the workflow, constraint, or opportunity. We will route it to the right senior owner and come back
              with a practical next step.
            </p>
          </div>
        </section>

        <section className="a-section">
          <div className="a-wrap">
            <div className="contact-grid" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 40, alignItems: "start" }}>
              <aside>
                <span className="a-eyebrow">Start here</span>
                <h2 className="h-section" style={{ marginTop: 18, fontSize: "clamp(28px, 3.4vw, 44px)" }}>
                  A sharper form means a sharper first conversation.
                </h2>
                <p className="lede" style={{ marginTop: 20 }}>
                  A few details help us understand the operating context, the systems involved, and what a useful first
                  conversation should cover.
                </p>

                <div className="contact-routes">
                  <RouteRow label="Engagements and demos" value="Bring your workflow" href="/engage-us" />
                  <RouteRow label="Partnerships and design partners" value="Use the partner intake" href="/partners" />
                  <RouteRow label="Careers" value="See open roles" href="/careers" />
                </div>
              </aside>

              <div>
                {submitStatus === "success" ? (
                  <div className="a-card" style={{ padding: 40, textAlign: "center" }}>
                    <div className="success-mark">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--ember)" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="form-success-title">Thanks. We have what we need.</h3>
                    <p className="form-success-copy">A senior on our team will reach out within one business day.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="a-card intake-form">
                    <div className="d-honeypot" aria-hidden="true">
                      <input type="text" name="website_url" value={formData.website_url} onChange={handleChange} tabIndex={-1} autoComplete="off" />
                    </div>

                    <div className="form-grid two">
                      <DarkField label="Full name" required>
                        <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} className="d-input" />
                      </DarkField>
                      <DarkField label="Work email" required>
                        <input type="email" name="email" required value={formData.email} onChange={handleChange} className="d-input" />
                      </DarkField>
                    </div>

                    <div className="form-grid two">
                      <DarkField label="Company" required>
                        <input type="text" name="company" required value={formData.company} onChange={handleChange} className="d-input" />
                      </DarkField>
                      <DarkField label="Role" required>
                        <input type="text" name="jobTitle" required value={formData.jobTitle} onChange={handleChange} className="d-input" />
                      </DarkField>
                    </div>

                    <div className="form-grid two">
                      <DarkField label="Phone">
                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="d-input" />
                      </DarkField>
                      <DarkField label="Inquiry type">
                        <select name="inquiryType" value={formData.inquiryType} onChange={handleChange} className="d-input">
                          {inquiryTypes.map((item) => (
                            <option key={item.value} value={item.value}>
                              {item.label}
                            </option>
                          ))}
                        </select>
                      </DarkField>
                    </div>

                    <div className="form-grid three">
                      <DarkField label="Company size">
                        <select name="companySize" value={formData.companySize} onChange={handleChange} className="d-input">
                          <option value="">Select</option>
                          {companySizes.map((item) => (
                            <option key={item.value} value={item.value}>
                              {item.label}
                            </option>
                          ))}
                        </select>
                      </DarkField>
                      <DarkField label="Industry">
                        <input type="text" name="industry" value={formData.industry} onChange={handleChange} className="d-input" placeholder="Insurance, banking, healthcare..." />
                      </DarkField>
                      <DarkField label="Timeline">
                        <select name="timeline" value={formData.timeline} onChange={handleChange} className="d-input">
                          <option value="">Select</option>
                          {timelines.map((item) => (
                            <option key={item.value} value={item.value}>
                              {item.label}
                            </option>
                          ))}
                        </select>
                      </DarkField>
                    </div>

                    <div className="form-grid two">
                      <DarkField label="Workflow area" required>
                        <input
                          type="text"
                          name="workflowArea"
                          required
                          value={formData.workflowArea}
                          onChange={handleChange}
                          className="d-input"
                          placeholder="Claims, onboarding, service desk, compliance review..."
                        />
                      </DarkField>
                      <DarkField label="Budget range">
                        <select name="budgetRange" value={formData.budgetRange} onChange={handleChange} className="d-input">
                          <option value="">Select</option>
                          {budgetRanges.map((item) => (
                            <option key={item.value} value={item.value}>
                              {item.label}
                            </option>
                          ))}
                        </select>
                      </DarkField>
                    </div>

                    <DarkField label="Systems involved">
                      <textarea
                        name="currentSystems"
                        rows={3}
                        value={formData.currentSystems}
                        onChange={handleChange}
                        placeholder="CRM, ERP, data warehouse, ticketing, policy systems, documents, spreadsheets..."
                        className="d-input"
                      />
                    </DarkField>

                    <DarkField label="What should change first?" required>
                      <textarea
                        name="message"
                        rows={5}
                        required
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Describe the bottleneck, desired outcome, constraints, and what success would look like."
                        className="d-input"
                      />
                    </DarkField>

                    {submitStatus === "error" && (
                      <div className="form-error">Something went wrong. Please try again.</div>
                    )}

                    <button type="submit" disabled={isSubmitting} className="a-btn a-btn-primary form-submit">
                      {isSubmitting ? "Sending..." : "Get Started"}
                    </button>

                    <p className="form-privacy">
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
        @media (min-width: 980px) {
          .arq-dark .contact-grid { grid-template-columns: 4fr 8fr !important; gap: 64px !important; }
        }
        @media (max-width: 760px) {
          .arq-dark .form-grid.two,
          .arq-dark .form-grid.three { grid-template-columns: 1fr !important; }
        }
        .arq-dark .contact-routes {
          border-top: 1px solid var(--aline);
          margin-top: 28px;
          padding-top: 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .arq-dark .intake-form {
          padding: clamp(24px, 4vw, 36px);
          position: relative;
        }
        .arq-dark .form-grid {
          display: grid;
          gap: 16px;
        }
        .arq-dark .form-grid.two { grid-template-columns: repeat(2, 1fr); }
        .arq-dark .form-grid.three { grid-template-columns: repeat(3, 1fr); }
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
        .arq-dark select.d-input {
          color-scheme: dark;
        }
        .arq-dark .d-input:focus {
          outline: none;
          border-color: var(--ember);
          background: rgba(245,239,230,0.06);
        }
        .arq-dark .d-input::placeholder { color: var(--ink-muted); }
        .arq-dark .d-honeypot {
          position: absolute;
          left: -9999px;
          opacity: 0;
          pointer-events: none;
        }
        .arq-dark .success-mark {
          width: 56px;
          height: 56px;
          border-radius: 999px;
          background: rgba(208,244,56,0.10);
          border: 1px solid rgba(208,244,56,0.35);
          display: grid;
          place-items: center;
          margin: 0 auto 20px;
        }
        .arq-dark .form-success-title {
          font-family: var(--display);
          font-size: 24px;
          font-weight: 500;
          letter-spacing: -0.02em;
          color: var(--ink-cream);
          margin: 0 0 12px;
        }
        .arq-dark .form-success-copy {
          color: var(--ink-cream-d);
          font-size: 15px;
          margin: 0;
        }
        .arq-dark .form-error {
          margin-top: 12px;
          padding: 12px;
          background: rgba(255, 90, 90, 0.08);
          border: 1px solid rgba(255, 90, 90, 0.3);
          border-radius: 8px;
          color: rgba(255,200,200,0.95);
          font-size: 13px;
        }
        .arq-dark .form-submit {
          width: 100%;
          justify-content: center;
          margin-top: 20px;
        }
        .arq-dark .form-privacy {
          margin-top: 16px;
          font-size: 12px;
          color: var(--ink-muted);
          text-align: center;
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
      <span className="form-label">
        {label} {required && <span style={{ color: "var(--ember)" }}>*</span>}
      </span>
      {children}
      <style>{`
        .arq-dark .form-label {
          display: block;
          font-family: var(--mono);
          font-size: 11px;
          letter-spacing: .1em;
          text-transform: uppercase;
          color: var(--ink-cream-d);
          margin-bottom: 8px;
        }
      `}</style>
    </label>
  );
}

function RouteRow({ label, value, href }: { label: string; value: string; href: string }) {
  return (
    <div>
      <p style={{ fontFamily: "var(--mono)", fontSize: 10.5, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--ink-muted)", margin: "0 0 6px" }}>
        {label}
      </p>
      <Link href={href} style={{ color: "var(--ink-cream)", fontSize: 15 }}>
        {value} <span style={{ color: "var(--ember)" }}>-&gt;</span>
      </Link>
    </div>
  );
}
