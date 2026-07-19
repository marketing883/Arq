"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import V6Nav from "@/components/v6/V6Nav";
import V6Footer from "@/components/v6/V6Footer";
import { ArrowUpRight } from "@/components/home-v5/icons";
import { trackGenerateLead } from "@/lib/analytics/gtm-events";
import { getAttribution, getPreviousPage } from "@/lib/attribution/visitor-context";
import { getPageContext, type PageContext } from "@/lib/attribution/page-context";
import { inferCompanyFromEmail, getReturningVisitor } from "@/lib/attribution/smart-prefill";
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
  const [pageContext, setPageContext] = useState<PageContext | null>(null);
  const [sourcePage, setSourcePage] = useState("");
  const [contextDismissed, setContextDismissed] = useState(false);
  const [wantsEntryPoint, setWantsEntryPoint] = useState(false);
  const [welcomeBack, setWelcomeBack] = useState("");

  // Returning-visitor memory: pre-fill identity fields the visitor already
  // shared with the chat widget.
  useEffect(() => {
    const visitor = getReturningVisitor();
    if (!visitor) return;
    setFormData((prev) => {
      if (prev.fullName || prev.email) return prev;
      return {
        ...prev,
        fullName: visitor.name,
        email: visitor.email,
        company: prev.company || visitor.company,
      };
    });
    if (visitor.name) setWelcomeBack(visitor.name.split(" ")[0]);
  }, []);

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

    // Context-aware pre-fill: ?source=<path> set by CTAs, falling back to the
    // previous page in the visitor's journey trail.
    const source = params.get("source") || getPreviousPage("/contact");
    if (source) setSourcePage(source);
    const ctx = getPageContext(source);
    if (ctx) {
      setPageContext(ctx);
      // Only fill fields the deep-link params didn't already set.
      setFormData((prev) => {
        const next = { ...prev };
        if (!inquiry && ctx.contact?.inquiryType) next.inquiryType = ctx.contact.inquiryType;
        if (!industry && !prev.industry && ctx.contact?.industry) next.industry = ctx.contact.industry;
        if (!workflow && !prev.workflowArea && ctx.contact?.workflowArea) next.workflowArea = ctx.contact.workflowArea;
        return next;
      });
    }
  }, [params]);

  // When the visitor gives a work email, derive the company name from the
  // domain so they don't have to type it.
  const handleEmailBlur = () => {
    if (formData.company || !formData.email) return;
    const inferred = inferCompanyFromEmail(formData.email);
    if (inferred) setFormData((prev) => (prev.company ? prev : { ...prev, company: inferred }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    const entryPoint = wantsEntryPoint && pageContext?.entryPoint ? pageContext.entryPoint : null;
    const message = entryPoint
      ? `Requested entry point: ${entryPoint.name}.\n\n${formData.message}`
      : formData.message;

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
          message,
          website_url: formData.website_url,
          _formLoadedAt: formLoadedAt,
          attribution: {
            ...getAttribution("/contact"),
            ...(sourcePage ? { sourcePage } : {}),
            sourceContext: pageContext?.shortLabel || "",
          },
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
        setWantsEntryPoint(false);
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

                    {pageContext && !contextDismissed && (
                      <div className="v5-prefill">
                        <div className="v5-prefill-label">
                          ✓ You&apos;re asking about {pageContext.shortLabel}
                        </div>
                        <div className="v5-prefill-note">
                          We noticed you were reading about {pageContext.label}. We&apos;ve
                          pre-filled a few details and will route this to the right senior
                          owner — edit anything that&apos;s off.{" "}
                          <button
                            type="button"
                            onClick={() => {
                              setContextDismissed(true);
                              // Undo the context-derived pre-fills the visitor didn't type.
                              setFormData((prev) => ({
                                ...prev,
                                inquiryType:
                                  prev.inquiryType === pageContext.contact?.inquiryType
                                    ? emptyForm.inquiryType
                                    : prev.inquiryType,
                                industry:
                                  prev.industry === pageContext.contact?.industry
                                    ? ""
                                    : prev.industry,
                                workflowArea:
                                  prev.workflowArea === pageContext.contact?.workflowArea
                                    ? ""
                                    : prev.workflowArea,
                              }));
                              setPageContext(null);
                              setWantsEntryPoint(false);
                            }}
                            style={{
                              background: "none",
                              border: "none",
                              padding: 0,
                              font: "inherit",
                              textDecoration: "underline",
                              cursor: "pointer",
                              color: "inherit",
                            }}
                          >
                            Not what you&apos;re here for?
                          </button>
                        </div>
                        {pageContext.entryPoint && (
                          <label
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: 10,
                              marginTop: 12,
                              padding: "10px 12px",
                              background: "#fff",
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
                              <strong>Start with the {pageContext.entryPoint.name}</strong> —{" "}
                              {pageContext.entryPoint.blurb}. The usual first step, with no build
                              commitment.
                            </span>
                          </label>
                        )}
                      </div>
                    )}

                    {welcomeBack && (
                      <p className="v5-form-note" style={{ marginTop: 0 }}>
                        Welcome back, {welcomeBack} — we&apos;ve filled in what you shared with
                        us earlier.
                      </p>
                    )}

                    <div className="v5-form-grid two">
                      <Field label="Full name" required>
                        <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} className="v5-input" />
                      </Field>
                      <Field label="Work email" required>
                        <input type="email" name="email" required value={formData.email} onChange={handleChange} onBlur={handleEmailBlur} className="v5-input" />
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

                    <Field
                      label={pageContext?.question?.label ?? "What should change first?"}
                      required
                    >
                      <textarea
                        name="message"
                        rows={5}
                        required
                        value={formData.message}
                        onChange={handleChange}
                        placeholder={
                          pageContext?.question?.placeholder ??
                          "Describe the bottleneck, desired outcome, constraints, and what success would look like."
                        }
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
