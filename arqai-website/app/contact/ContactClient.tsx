"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import V6Nav from "@/components/v6/V6Nav";
import V6Footer from "@/components/v6/V6Footer";
import { ArrowUpRight } from "@/components/home-v5/icons";
import { trackGenerateLead } from "@/lib/analytics/gtm-events";
import FAQStatic from "@/components/home-v5/FAQStatic";
import { contactFaqs } from "./faqs";
import "@/components/v6/v6.css";
import "@/components/home-v5/styles.css";

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
  return (
    <Suspense fallback={null}>
      <ContactPageInner />
    </Suspense>
  );
}

function ContactPageInner() {
  const params = useSearchParams();
  const [formData, setFormData] = useState<ContactFormData>(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [formLoadedAt, setFormLoadedAt] = useState(0);

  useEffect(() => {
    setFormLoadedAt(Date.now());
    if (!params) return;
    // Pre-fill from deep links (e.g. industry pages -> /contact?industry=...&workflow=...&inquiry=...)
    const industry = params.get("industry");
    const workflow = params.get("workflow");
    const inquiry = params.get("inquiry");
    if (industry || workflow || inquiry) {
      setFormData((prev) => ({
        ...prev,
        industry: industry ?? prev.industry,
        workflowArea: workflow ?? prev.workflowArea,
        inquiryType: inquiry ?? prev.inquiryType,
      }));
    }
  }, [params]);

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
        // Capture lead dimensions before the form state is reset below.
        trackGenerateLead({
          form_name: "contact_form",
          inquiry_type: formData.inquiryType,
          industry: formData.industry,
          company_size: formData.companySize,
          timeline: formData.timeline,
          budget_range: formData.budgetRange,
          workflow_area: formData.workflowArea,
          value: formData.company ? 100 : 50,
        });
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="v5-shell">
      <V6Nav />
      <main>
        {/* Hero */}
        <section className="v5-page-hero">
          <div className="v5-container">
            <div className="v5-page-hero-inner">
              <span className="v5-badge">
                <span className="v5-badge-dot" />
                Contact
              </span>
              <h1 className="v5-h1">Tell us what needs to change.</h1>
              <p className="v5-lead">
                Share the workflow, constraint, or opportunity. We will route it to the right
                senior owner and come back with a practical next step.
              </p>
            </div>
          </div>
        </section>

        {/* Form */}
        <section className="v5-section v5-bg-grey">
          <div className="v5-container">
            <div className="v5-contact-grid">
              <aside>
                <span className="v5-eyebrow">Start here</span>
                <h2 className="v5-h2" style={{ marginTop: 14, fontSize: "clamp(26px, 3vw, 38px)" }}>
                  A sharper form means a sharper first conversation.
                </h2>
                <p className="v5-lead" style={{ marginTop: 16 }}>
                  A few details help us understand the operating context, the systems
                  involved, and what a useful first conversation should cover.
                </p>

                <div className="v5-routes">
                  <RouteRow label="Engagements and demos" value="Bring your workflow" href="/engage-us" />
                  <RouteRow label="Partnerships and design partners" value="Use the partner intake" href="/partners" />
                  <RouteRow label="Careers" value="See open roles" href="/careers" />
                </div>
              </aside>

              <div>
                {submitStatus === "success" ? (
                  <div className="v5-card v5-success">
                    <div className="v5-success-mark">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--v5-ink)" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="v5-h3">Thanks. We have what we need.</h3>
                    <p className="v5-body" style={{ marginTop: 8 }}>
                      A senior on our team will reach out within one business day.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="v5-card v5-form" style={{ position: "relative" }}>
                    <div className="v5-honeypot" aria-hidden="true">
                      <input type="text" name="website_url" value={formData.website_url} onChange={handleChange} tabIndex={-1} autoComplete="off" />
                    </div>

                    <div className="v5-form-grid two">
                      <Field label="Full name" required>
                        <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} className="v5-input" />
                      </Field>
                      <Field label="Work email" required>
                        <input type="email" name="email" required value={formData.email} onChange={handleChange} className="v5-input" />
                      </Field>
                    </div>

                    <div className="v5-form-grid two">
                      <Field label="Company" required>
                        <input type="text" name="company" required value={formData.company} onChange={handleChange} className="v5-input" />
                      </Field>
                      <Field label="Role" required>
                        <input type="text" name="jobTitle" required value={formData.jobTitle} onChange={handleChange} className="v5-input" />
                      </Field>
                    </div>

                    <div className="v5-form-grid two">
                      <Field label="Phone">
                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="v5-input" />
                      </Field>
                      <Field label="Inquiry type">
                        <select name="inquiryType" value={formData.inquiryType} onChange={handleChange} className="v5-input">
                          {inquiryTypes.map((item) => (
                            <option key={item.value} value={item.value}>{item.label}</option>
                          ))}
                        </select>
                      </Field>
                    </div>

                    <div className="v5-form-grid three">
                      <Field label="Company size">
                        <select name="companySize" value={formData.companySize} onChange={handleChange} className="v5-input">
                          <option value="">Select</option>
                          {companySizes.map((item) => (
                            <option key={item.value} value={item.value}>{item.label}</option>
                          ))}
                        </select>
                      </Field>
                      <Field label="Industry">
                        <input type="text" name="industry" value={formData.industry} onChange={handleChange} className="v5-input" placeholder="Insurance, banking, healthcare..." />
                      </Field>
                      <Field label="Timeline">
                        <select name="timeline" value={formData.timeline} onChange={handleChange} className="v5-input">
                          <option value="">Select</option>
                          {timelines.map((item) => (
                            <option key={item.value} value={item.value}>{item.label}</option>
                          ))}
                        </select>
                      </Field>
                    </div>

                    <div className="v5-form-grid two">
                      <Field label="Workflow area" required>
                        <input
                          type="text"
                          name="workflowArea"
                          required
                          value={formData.workflowArea}
                          onChange={handleChange}
                          className="v5-input"
                          placeholder="Claims, onboarding, service desk, compliance review..."
                        />
                      </Field>
                      <Field label="Budget range">
                        <select name="budgetRange" value={formData.budgetRange} onChange={handleChange} className="v5-input">
                          <option value="">Select</option>
                          {budgetRanges.map((item) => (
                            <option key={item.value} value={item.value}>{item.label}</option>
                          ))}
                        </select>
                      </Field>
                    </div>

                    <Field label="Systems involved">
                      <textarea
                        name="currentSystems"
                        rows={3}
                        value={formData.currentSystems}
                        onChange={handleChange}
                        placeholder="CRM, ERP, data warehouse, ticketing, policy systems, documents, spreadsheets..."
                        className="v5-input"
                      />
                    </Field>

                    <Field label="What should change first?" required>
                      <textarea
                        name="message"
                        rows={5}
                        required
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Describe the bottleneck, desired outcome, constraints, and what success would look like."
                        className="v5-input"
                      />
                    </Field>

                    {submitStatus === "error" && (
                      <div className="v5-form-error">Something went wrong. Please try again.</div>
                    )}

                    <button type="submit" disabled={isSubmitting} className="v5-btn v5-btn-primary v5-form-submit">
                      {isSubmitting ? "Sending..." : "Get Started"}
                    </button>

                    <p className="v5-form-note">
                      We use this only to follow up. <Link href="/privacy">Privacy notice</Link>.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
        <FAQStatic
          items={contactFaqs}
          heading="Before you reach out"
          bg="white"
          withSchema={false}
        />
      </main>
      <V6Footer />
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
    <label className="v5-field">
      <span className="v5-field-label">
        {label} {required && <span className="req">*</span>}
      </span>
      {children}
    </label>
  );
}

function RouteRow({ label, value, href }: { label: string; value: string; href: string }) {
  return (
    <div>
      <p className="v5-route-label">{label}</p>
      <Link href={href} className="v5-route-link">
        {value} <ArrowUpRight />
      </Link>
    </div>
  );
}
