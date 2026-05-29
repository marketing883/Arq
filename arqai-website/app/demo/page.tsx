"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SiteNav } from "@/components/site-dark/SiteNav";
import { SiteFooter } from "@/components/site-dark/SiteFooter";

const V4_INDUSTRY_MAP: Record<string, string> = {
  "healthcare-payer": "healthcare-payers",
  "insurance-carrier": "insurance-carriers",
  banking: "banking",
  retail: "retail",
  manufacturing: "manufacturing",
  telecom: "other",
  "enterprise-it": "other",
  cybersecurity: "other",
  other: "other",
};

const V4_WORKFLOW_MAP: Record<string, string> = {
  claims: "claims-triage",
  "fraud-aml": "fraud-leakage",
  loyalty: "customer-operations",
  "network-ops": "customer-operations",
  "supply-chain": "supply-chain",
  "service-ops": "customer-operations",
  "security-ops": "governance",
  knowledge: "enterprise-integration",
};

const V4_DEPLOYMENT_MAP: Record<string, string> = {
  "our-cloud": "arq-managed",
  "your-cloud": "customer-cloud",
  "on-prem": "hybrid",
};

const V4_HORIZON_MAP: Record<string, string> = {
  weeks: "now",
  quarter: "quarter",
  "multi-quarter": "half-year",
};

const V4_HUMAN_LABELS = {
  industry: {
    "healthcare-payer": "Healthcare payer",
    "insurance-carrier": "Insurance carrier",
    banking: "Banking",
    retail: "Retail",
    telecom: "Telecom",
    manufacturing: "Manufacturing",
    "enterprise-it": "Enterprise IT",
    cybersecurity: "Cybersecurity",
    other: "Other",
  } as Record<string, string>,
  workflows: {
    claims: "Claims",
    "fraud-aml": "Fraud / AML",
    loyalty: "Loyalty",
    "network-ops": "Network ops",
    "supply-chain": "Supply chain",
    "service-ops": "Service ops",
    "security-ops": "Security ops",
    knowledge: "Knowledge",
  } as Record<string, string>,
  approach: { accelerator: "Accelerator-first", hybrid: "Hybrid build", bespoke: "Bespoke build" } as Record<string, string>,
  deployment: { "our-cloud": "Our cloud", "your-cloud": "Your cloud", "on-prem": "On-prem" } as Record<string, string>,
  sensitivity: { public: "Public data", regulated: "Regulated", restricted: "PHI / PII" } as Record<string, string>,
  horizon: { weeks: "Weeks", quarter: "One quarter", "multi-quarter": "Multi-quarter" } as Record<string, string>,
};

const industries = [
  { value: "healthcare-payers", label: "Healthcare payers" },
  { value: "insurance-carriers", label: "P&C insurance carriers" },
  { value: "banking", label: "Banking and financial services" },
  { value: "retail", label: "Retail and loyalty" },
  { value: "manufacturing", label: "Manufacturing and supply chain" },
  { value: "other", label: "Other regulated operation" },
];

const companySizes = [
  { value: "small", label: "51-200" },
  { value: "mid-market", label: "201-1,000" },
  { value: "enterprise", label: "1,000+" },
  { value: "global-enterprise", label: "10,000+" },
];

const workflowAreas = [
  { value: "claims-triage", label: "Claims triage or intake" },
  { value: "fraud-leakage", label: "Fraud, waste, leakage, or suspicious activity" },
  { value: "financial-crime", label: "AML, KYC, sanctions, or compliance review" },
  { value: "customer-operations", label: "Customer operations or service workflow" },
  { value: "supply-chain", label: "Supply chain, procurement, or planning" },
  { value: "governance", label: "AI governance, audit, or controls" },
  { value: "enterprise-integration", label: "Enterprise integration or automation" },
  { value: "custom", label: "Custom workflow" },
];

const timelineOptions = [
  { value: "now", label: "Active initiative now" },
  { value: "quarter", label: "This quarter" },
  { value: "half-year", label: "Next 3-6 months" },
  { value: "exploring", label: "Exploring fit" },
];

const budgetRanges = [
  { value: "not-set", label: "Not set yet" },
  { value: "under-100k", label: "Under $100K" },
  { value: "100k-250k", label: "$100K-$250K" },
  { value: "250k-500k", label: "$250K-$500K" },
  { value: "500k-plus", label: "$500K+" },
];

const dataReadinessOptions = [
  { value: "live-system", label: "Live system data exists" },
  { value: "documents", label: "Documents and records exist" },
  { value: "spreadsheet", label: "Mostly spreadsheet or manual process" },
  { value: "unclear", label: "Not sure yet" },
];

const deploymentModels = [
  { value: "customer-cloud", label: "Customer cloud" },
  { value: "arq-managed", label: "ArqAI managed environment" },
  { value: "hybrid", label: "Hybrid or restricted environment" },
  { value: "not-sure", label: "Not sure yet" },
];

const successMetrics = [
  { value: "cycle-time", label: "Reduce cycle time" },
  { value: "review-quality", label: "Improve review quality" },
  { value: "case-prioritization", label: "Prioritize the right cases" },
  { value: "cost-to-serve", label: "Lower cost to serve" },
  { value: "auditability", label: "Improve auditability" },
  { value: "revenue-margin", label: "Lift revenue or margin" },
];

const systemOptions = [
  { value: "crm", label: "CRM" },
  { value: "erp", label: "ERP" },
  { value: "data-warehouse", label: "Data warehouse" },
  { value: "ticketing", label: "Ticketing / ITSM" },
  { value: "policy-admin", label: "Policy / core admin" },
  { value: "documents", label: "Documents" },
];

type EngageFormData = {
  fullName: string;
  email: string;
  company: string;
  role: string;
  phone: string;
  companySize: string;
  industry: string;
  workflowArea: string;
  timeline: string;
  budgetRange: string;
  dataReadiness: string;
  deploymentModel: string;
  successMetric: string;
  otherSystems: string;
  constraint: string;
  website_url: string;
};

const emptyForm: EngageFormData = {
  fullName: "",
  email: "",
  company: "",
  role: "",
  phone: "",
  companySize: "",
  industry: "",
  workflowArea: "",
  timeline: "",
  budgetRange: "",
  dataReadiness: "",
  deploymentModel: "",
  successMetric: "",
  otherSystems: "",
  constraint: "",
  website_url: "",
};

export default function EngageUsPage() {
  return (
    <Suspense fallback={null}>
      <EngageUsPageInner />
    </Suspense>
  );
}

function EngageUsPageInner() {
  const params = useSearchParams();
  const [formData, setFormData] = useState<EngageFormData>(emptyForm);
  const [selectedSystems, setSelectedSystems] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [formLoadedAt, setFormLoadedAt] = useState(0);
  const [v4Brief, setV4Brief] = useState<string>("");

  useEffect(() => {
    setFormLoadedAt(Date.now());
    if (!params) return;
    const industry = params.get("industry");
    const workflowsParam = params.get("workflows");
    const approach = params.get("approach");
    const deployment = params.get("deployment");
    const sensitivity = params.get("sensitivity");
    const horizon = params.get("horizon");
    if (!industry && !workflowsParam && !approach && !deployment && !sensitivity && !horizon) return;

    const workflows = workflowsParam ? workflowsParam.split(",").filter(Boolean) : [];
    const primaryWorkflow = workflows[0];
    const workflowHumans = workflows.map((w) => V4_HUMAN_LABELS.workflows[w] || w).join(", ");

    setFormData((prev) => ({
      ...prev,
      industry: industry ? V4_INDUSTRY_MAP[industry] ?? prev.industry : prev.industry,
      workflowArea: primaryWorkflow ? V4_WORKFLOW_MAP[primaryWorkflow] ?? prev.workflowArea : prev.workflowArea,
      deploymentModel: deployment ? V4_DEPLOYMENT_MAP[deployment] ?? prev.deploymentModel : prev.deploymentModel,
      timeline: horizon ? V4_HORIZON_MAP[horizon] ?? prev.timeline : prev.timeline,
    }));

    const lines = [
      industry ? `Industry: ${V4_HUMAN_LABELS.industry[industry] || industry}` : null,
      workflows.length ? `Workflows: ${workflowHumans}` : null,
      approach ? `Approach: ${V4_HUMAN_LABELS.approach[approach] || approach}` : null,
      deployment ? `Deployment: ${V4_HUMAN_LABELS.deployment[deployment] || deployment}` : null,
      sensitivity ? `Data sensitivity: ${V4_HUMAN_LABELS.sensitivity[sensitivity] || sensitivity}` : null,
      horizon ? `Time horizon: ${V4_HUMAN_LABELS.horizon[horizon] || horizon}` : null,
    ].filter(Boolean) as string[];
    setV4Brief(lines.join("\n"));
  }, [params]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    const systems = [...selectedSystems, formData.otherSystems].filter(Boolean).join(", ");
    const message = [
      `Primary workflow: ${formData.workflowArea}`,
      `Data readiness: ${formData.dataReadiness || "not provided"}`,
      `Deployment environment: ${formData.deploymentModel || "not provided"}`,
      `Success metric: ${formData.successMetric || "not provided"}`,
      formData.constraint ? `Important constraint: ${formData.constraint}` : null,
      v4Brief ? `--- Match console configuration ---\n${v4Brief}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          company: formData.company,
          jobTitle: formData.role,
          phone: formData.phone,
          message,
          inquiryType: "demo",
          companySize: formData.companySize,
          industry: formData.industry,
          workflowArea: formData.workflowArea,
          timeline: formData.timeline,
          budgetRange: formData.budgetRange,
          currentSystems: systems,
          website_url: formData.website_url,
          _formLoadedAt: formLoadedAt,
        }),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData(emptyForm);
        setSelectedSystems([]);
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

  const toggleSystem = (value: string) => {
    setSelectedSystems((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value]
    );
  };

  return (
    <div className="arq-dark min-h-screen">
      <SiteNav />
      <main>
        <section className="engage-section">
          <div className="a-wrap">
            <div className="engage-grid">
              <div className="engage-copy">
                <span className="a-eyebrow">Get Started</span>
                <h1 className="h-display">
                  Scope the workflow before we <em>build</em>.
                </h1>
                <p className="lede">
                  Share the operating context in a few structured answers. We will use that to decide whether the right
                  next step is strategy, an accelerator fit check, or a custom build conversation.
                </p>
                <div className="engage-proof">
                  {[
                    "Workflow fit before tool selection",
                    "Systems, data, and control boundaries captured upfront",
                    "Senior engineering review before the first call",
                  ].map((item) => (
                    <div className="proof-row" key={item}>
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--ember)" strokeWidth={2.4}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                {submitStatus === "success" ? (
                  <div className="a-card engage-success">
                    <div className="success-mark">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--ember)" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3>Thanks. We have enough to start.</h3>
                    <p>A senior on our team will review the workflow context and follow up within one business day.</p>
                    <Link href="/" className="a-btn a-btn-ghost">
                      Back to home
                    </Link>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="a-card engage-form">
                    <div className="d-honeypot" aria-hidden="true">
                      <input
                        type="text"
                        name="website_url"
                        value={formData.website_url}
                        onChange={handleChange}
                        tabIndex={-1}
                        autoComplete="off"
                      />
                    </div>

                    {v4Brief && (
                      <div
                        style={{
                          marginBottom: 24,
                          padding: 18,
                          background: "rgba(208, 244, 56, 0.04)",
                          border: "1px solid rgba(208, 244, 56, 0.2)",
                          borderRadius: 8,
                        }}
                      >
                        <div
                          style={{
                            fontFamily: "var(--mono)",
                            fontSize: 10,
                            letterSpacing: "0.22em",
                            textTransform: "uppercase",
                            color: "var(--ember)",
                            marginBottom: 10,
                          }}
                        >
                          ✓ From the match console
                        </div>
                        <pre
                          style={{
                            margin: 0,
                            color: "var(--ink-cream-d, rgba(233, 220, 194, 0.75))",
                            fontSize: 12.5,
                            lineHeight: 1.6,
                            fontFamily: "var(--mono)",
                            whiteSpace: "pre-wrap",
                          }}
                        >
                          {v4Brief}
                        </pre>
                        <div
                          style={{
                            marginTop: 10,
                            fontSize: 12,
                            color: "var(--ink-muted)",
                          }}
                        >
                          Your selections have prefilled the form below. Edit any field that&apos;s off.
                        </div>
                      </div>
                    )}

                    <FormSection eyebrow="01" title="Who should we speak with?">
                      <div className="form-grid two">
                        <Field label="Full name" required>
                          <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} className="d-input" autoComplete="name" />
                        </Field>
                        <Field label="Work email" required>
                          <input type="email" name="email" required value={formData.email} onChange={handleChange} className="d-input" autoComplete="email" />
                        </Field>
                      </div>
                      <div className="form-grid two">
                        <Field label="Company" required>
                          <input type="text" name="company" required value={formData.company} onChange={handleChange} className="d-input" autoComplete="organization" />
                        </Field>
                        <Field label="Role" required>
                          <input type="text" name="role" required value={formData.role} onChange={handleChange} className="d-input" autoComplete="organization-title" />
                        </Field>
                      </div>
                      <div className="form-grid two">
                        <Field label="Phone">
                          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="d-input" autoComplete="tel" />
                        </Field>
                        <Field label="Company size" required>
                          <select name="companySize" required value={formData.companySize} onChange={handleChange} className="d-input">
                            <option value="">Select size</option>
                            {companySizes.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </Field>
                      </div>
                    </FormSection>

                    <FormSection eyebrow="02" title="What workflow should we evaluate?">
                      <div className="form-grid two">
                        <Field label="Industry" required>
                          <select name="industry" required value={formData.industry} onChange={handleChange} className="d-input">
                            <option value="">Select industry</option>
                            {industries.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </Field>
                        <Field label="Primary workflow" required>
                          <select name="workflowArea" required value={formData.workflowArea} onChange={handleChange} className="d-input">
                            <option value="">Select workflow</option>
                            {workflowAreas.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </Field>
                      </div>
                      <Field label="Systems involved">
                        <div className="chip-grid">
                          {systemOptions.map((option) => (
                            <label className="system-chip" key={option.value}>
                              <input
                                type="checkbox"
                                checked={selectedSystems.includes(option.value)}
                                onChange={() => toggleSystem(option.value)}
                              />
                              <span>{option.label}</span>
                            </label>
                          ))}
                        </div>
                      </Field>
                      <Field label="Other system or core platform">
                        <input
                          type="text"
                          name="otherSystems"
                          value={formData.otherSystems}
                          onChange={handleChange}
                          className="d-input"
                          placeholder="Guidewire, Duck Creek, ServiceNow, Salesforce, SAP..."
                        />
                      </Field>
                    </FormSection>

                    <FormSection eyebrow="03" title="How real is the initiative?">
                      <div className="form-grid two">
                        <Field label="Timeline" required>
                          <select name="timeline" required value={formData.timeline} onChange={handleChange} className="d-input">
                            <option value="">Select timeline</option>
                            {timelineOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </Field>
                        <Field label="Budget range" required>
                          <select name="budgetRange" required value={formData.budgetRange} onChange={handleChange} className="d-input">
                            <option value="">Select range</option>
                            {budgetRanges.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </Field>
                      </div>
                      <div className="form-grid two">
                        <Field label="Data readiness" required>
                          <select name="dataReadiness" required value={formData.dataReadiness} onChange={handleChange} className="d-input">
                            <option value="">Select readiness</option>
                            {dataReadinessOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </Field>
                        <Field label="Deployment preference" required>
                          <select name="deploymentModel" required value={formData.deploymentModel} onChange={handleChange} className="d-input">
                            <option value="">Select preference</option>
                            {deploymentModels.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </Field>
                      </div>
                      <Field label="Primary success metric" required>
                        <select name="successMetric" required value={formData.successMetric} onChange={handleChange} className="d-input">
                          <option value="">Select metric</option>
                          {successMetrics.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </Field>
                      <Field label="Important constraint">
                        <textarea
                          name="constraint"
                          rows={3}
                          value={formData.constraint}
                          onChange={handleChange}
                          className="d-input"
                          placeholder="A policy, integration, review, security, or operational constraint we should know."
                        />
                      </Field>
                    </FormSection>

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
        .arq-dark .engage-section {
          padding: clamp(132px, 15vh, 184px) 0 clamp(72px, 10vw, 128px);
          overflow-x: hidden;
        }
        .arq-dark .engage-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 44px;
          align-items: start;
          min-width: 0;
        }
        @media (min-width: 1080px) {
          .arq-dark .engage-grid {
            grid-template-columns: minmax(300px, 0.82fr) minmax(600px, 1.18fr);
            gap: 76px;
          }
          .arq-dark .engage-copy {
            position: sticky;
            top: 132px;
          }
        }
        @media (max-width: 760px) {
          .arq-dark .engage-section .a-wrap {
            max-width: 100vw;
            max-width: 100dvw;
            overflow: hidden;
          }
          .arq-dark .engage-copy,
          .arq-dark .engage-form,
          .arq-dark .engage-success {
            width: calc(100vw - 40px);
            width: calc(100dvw - 40px);
            max-width: calc(100vw - 40px);
            max-width: calc(100dvw - 40px);
          }
          .arq-dark .form-grid.two {
            grid-template-columns: 1fr !important;
          }
          .arq-dark .engage-form {
            padding: 22px !important;
          }
          .arq-dark .engage-copy .h-display {
            max-width: 10.5ch;
            font-size: clamp(38px, 12vw, 52px);
          }
          .arq-dark .engage-copy .lede,
          .arq-dark .proof-row {
            max-width: 100%;
            font-size: 15px;
          }
          .arq-dark .proof-row span,
          .arq-dark .engage-copy .lede {
            min-width: 0;
            overflow-wrap: anywhere;
          }
          .arq-dark .chip-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 520px) {
          .arq-dark .engage-copy,
          .arq-dark .engage-form,
          .arq-dark .engage-success {
            width: min(100%, 340px);
            max-width: 340px;
          }
        }
        .arq-dark .engage-copy .h-display {
          margin-top: 18px;
          max-width: 13ch;
          font-size: clamp(42px, 5.6vw, 78px);
        }
        .arq-dark .engage-proof {
          margin-top: 30px;
          border-top: 1px solid var(--aline);
          padding-top: 24px;
          display: flex;
          flex-direction: column;
          gap: 13px;
        }
        .arq-dark .proof-row {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          color: var(--ink-cream-d);
          font-size: 15px;
          line-height: 1.5;
        }
        .arq-dark .proof-row svg {
          flex: 0 0 auto;
          margin-top: 2px;
        }
        .arq-dark .engage-form {
          padding: clamp(24px, 4vw, 38px);
          position: relative;
          overflow: hidden;
          max-width: 100%;
        }
        .arq-dark .engage-form::after {
          content: "";
          position: absolute;
          inset: 0 auto auto 0;
          width: 180px;
          height: 180px;
          background: radial-gradient(circle, rgba(208,244,56,0.13), transparent 62%);
          pointer-events: none;
        }
        .arq-dark .engage-form > * {
          position: relative;
          z-index: 1;
        }
        .arq-dark .form-section {
          padding: 0 0 24px;
          margin-bottom: 24px;
          border-bottom: 1px solid var(--aline);
        }
        .arq-dark .form-section:last-of-type {
          border-bottom: 0;
          margin-bottom: 8px;
          padding-bottom: 0;
        }
        .arq-dark .form-section-head {
          display: flex;
          gap: 12px;
          align-items: center;
          margin-bottom: 18px;
        }
        .arq-dark .form-section-head span {
          width: 28px;
          height: 28px;
          border-radius: 999px;
          display: grid;
          place-items: center;
          background: rgba(208,244,56,0.10);
          border: 1px solid rgba(208,244,56,0.30);
          color: var(--ember);
          font-family: var(--mono);
          font-size: 10px;
          letter-spacing: .08em;
        }
        .arq-dark .form-section-head h2 {
          margin: 0;
          color: var(--ink-cream);
          font-family: var(--display);
          font-weight: 500;
          letter-spacing: -0.02em;
          font-size: clamp(20px, 2vw, 25px);
        }
        .arq-dark .form-grid {
          display: grid;
          gap: 16px;
          min-width: 0;
        }
        .arq-dark .form-grid.two {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        .arq-dark .form-field {
          display: block;
          margin-bottom: 16px;
        }
        .arq-dark .form-label {
          display: block;
          font-family: var(--mono);
          font-size: 10.5px;
          letter-spacing: .11em;
          text-transform: uppercase;
          color: var(--ink-cream-d);
          margin-bottom: 8px;
        }
        .arq-dark .d-input {
          width: 100%;
          min-width: 0;
          min-height: 46px;
          padding: 12px 14px;
          border-radius: 10px;
          background: rgba(245,239,230,0.055);
          border: 1px solid var(--aline-2);
          color: var(--ink-cream);
          font-family: inherit;
          font-size: 14.5px;
          line-height: 1.5;
          transition: border-color .2s, background .2s, box-shadow .2s;
        }
        .arq-dark select.d-input {
          color-scheme: dark;
        }
        .arq-dark textarea.d-input {
          min-height: 92px;
          resize: vertical;
        }
        .arq-dark .d-input:focus {
          outline: none;
          border-color: var(--ember);
          background: rgba(245,239,230,0.075);
          box-shadow: 0 0 0 3px rgba(208,244,56,0.10);
        }
        .arq-dark .d-input::placeholder {
          color: var(--ink-muted);
        }
        .arq-dark .chip-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }
        @media (min-width: 720px) {
          .arq-dark .chip-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }
        .arq-dark .system-chip {
          min-width: 0;
          min-height: 42px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 999px;
          background: rgba(245,239,230,0.045);
          border: 1px solid var(--aline);
          color: var(--ink-cream-d);
          font-size: 13px;
          cursor: pointer;
          transition: color .2s, border-color .2s, background .2s;
        }
        .arq-dark .system-chip:has(input:checked) {
          color: var(--ink-cream);
          border-color: rgba(208,244,56,0.44);
          background: rgba(208,244,56,0.08);
        }
        .arq-dark .system-chip input {
          width: 14px;
          height: 14px;
          accent-color: var(--ember);
          flex: 0 0 auto;
        }
        .arq-dark .system-chip span {
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .arq-dark .d-honeypot {
          position: absolute;
          left: -9999px;
          opacity: 0;
          pointer-events: none;
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
        .arq-dark .engage-success {
          padding: clamp(32px, 5vw, 52px);
          text-align: center;
        }
        .arq-dark .engage-success h3 {
          font-family: var(--display);
          color: var(--ink-cream);
          font-size: 28px;
          font-weight: 500;
          letter-spacing: -0.02em;
          margin: 0 0 12px;
        }
        .arq-dark .engage-success p {
          color: var(--ink-cream-d);
          margin: 0 auto 26px;
          max-width: 42ch;
          line-height: 1.55;
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
      `}</style>
    </div>
  );
}

function FormSection({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="form-section">
      <div className="form-section-head">
        <span>{eyebrow}</span>
        <h2>{title}</h2>
      </div>
      {children}
    </section>
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
    <label className="form-field">
      <span className="form-label">
        {label} {required && <span style={{ color: "var(--ember)" }}>*</span>}
      </span>
      {children}
    </label>
  );
}
