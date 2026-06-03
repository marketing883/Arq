"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import V5Nav from "@/components/home-v5/V5Nav";
import Footer from "@/components/home-v5/Footer";
import "@/components/home-v5/styles.css";

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
    <div className="v5-shell">
      <V5Nav />
      <main>
        <section className="v5-page-hero">
          <div className="v5-container">
            <div className="v5-engage-grid">
              <div>
                <span className="v5-badge">
                  <span className="v5-badge-dot" />
                  Get Started
                </span>
                <h1 className="v5-h1" style={{ marginTop: 18 }}>Scope the workflow before we build.</h1>
                <p className="v5-lead">
                  Share the operating context in a few structured answers. We will use that to
                  decide whether the right next step is strategy, an accelerator fit check, or
                  a custom build conversation.
                </p>
                <div className="v5-proof">
                  {[
                    "Workflow fit before tool selection",
                    "Systems, data, and control boundaries captured upfront",
                    "Senior engineering review before the first call",
                  ].map((item) => (
                    <div className="v5-proof-row" key={item}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                {submitStatus === "success" ? (
                  <div className="v5-card v5-success">
                    <div className="v5-success-mark">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--v5-ink)" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="v5-h3">Thanks. We have enough to start.</h3>
                    <p className="v5-body" style={{ marginTop: 8, marginBottom: 22 }}>
                      A senior on our team will review the workflow context and follow up
                      within one business day.
                    </p>
                    <Link href="/" className="v5-btn v5-btn-ghost">
                      Back to home
                    </Link>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="v5-card v5-form" style={{ position: "relative" }}>
                    <div className="v5-honeypot" aria-hidden="true">
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
                      <div className="v5-prefill">
                        <div className="v5-prefill-label">✓ From the match console</div>
                        <pre>{v4Brief}</pre>
                        <div className="v5-prefill-note">
                          Your selections have prefilled the form below. Edit any field that&apos;s off.
                        </div>
                      </div>
                    )}

                    <FormSection eyebrow="01" title="Who should we speak with?">
                      <div className="v5-form-grid two">
                        <Field label="Full name" required>
                          <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} className="v5-input" autoComplete="name" />
                        </Field>
                        <Field label="Work email" required>
                          <input type="email" name="email" required value={formData.email} onChange={handleChange} className="v5-input" autoComplete="email" />
                        </Field>
                      </div>
                      <div className="v5-form-grid two">
                        <Field label="Company" required>
                          <input type="text" name="company" required value={formData.company} onChange={handleChange} className="v5-input" autoComplete="organization" />
                        </Field>
                        <Field label="Role" required>
                          <input type="text" name="role" required value={formData.role} onChange={handleChange} className="v5-input" autoComplete="organization-title" />
                        </Field>
                      </div>
                      <div className="v5-form-grid two">
                        <Field label="Phone">
                          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="v5-input" autoComplete="tel" />
                        </Field>
                        <Field label="Company size" required>
                          <select name="companySize" required value={formData.companySize} onChange={handleChange} className="v5-input">
                            <option value="">Select size</option>
                            {companySizes.map((option) => (
                              <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                          </select>
                        </Field>
                      </div>
                    </FormSection>

                    <FormSection eyebrow="02" title="What workflow should we evaluate?">
                      <div className="v5-form-grid two">
                        <Field label="Industry" required>
                          <select name="industry" required value={formData.industry} onChange={handleChange} className="v5-input">
                            <option value="">Select industry</option>
                            {industries.map((option) => (
                              <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                          </select>
                        </Field>
                        <Field label="Primary workflow" required>
                          <select name="workflowArea" required value={formData.workflowArea} onChange={handleChange} className="v5-input">
                            <option value="">Select workflow</option>
                            {workflowAreas.map((option) => (
                              <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                          </select>
                        </Field>
                      </div>
                      <Field label="Systems involved">
                        <div className="v5-chip-grid">
                          {systemOptions.map((option) => (
                            <label className="v5-system-chip" key={option.value}>
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
                          className="v5-input"
                          placeholder="Guidewire, Duck Creek, ServiceNow, Salesforce, SAP..."
                        />
                      </Field>
                    </FormSection>

                    <FormSection eyebrow="03" title="How real is the initiative?">
                      <div className="v5-form-grid two">
                        <Field label="Timeline" required>
                          <select name="timeline" required value={formData.timeline} onChange={handleChange} className="v5-input">
                            <option value="">Select timeline</option>
                            {timelineOptions.map((option) => (
                              <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                          </select>
                        </Field>
                        <Field label="Budget range" required>
                          <select name="budgetRange" required value={formData.budgetRange} onChange={handleChange} className="v5-input">
                            <option value="">Select range</option>
                            {budgetRanges.map((option) => (
                              <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                          </select>
                        </Field>
                      </div>
                      <div className="v5-form-grid two">
                        <Field label="Data readiness" required>
                          <select name="dataReadiness" required value={formData.dataReadiness} onChange={handleChange} className="v5-input">
                            <option value="">Select readiness</option>
                            {dataReadinessOptions.map((option) => (
                              <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                          </select>
                        </Field>
                        <Field label="Deployment preference" required>
                          <select name="deploymentModel" required value={formData.deploymentModel} onChange={handleChange} className="v5-input">
                            <option value="">Select preference</option>
                            {deploymentModels.map((option) => (
                              <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                          </select>
                        </Field>
                      </div>
                      <Field label="Primary success metric" required>
                        <select name="successMetric" required value={formData.successMetric} onChange={handleChange} className="v5-input">
                          <option value="">Select metric</option>
                          {successMetrics.map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                      </Field>
                      <Field label="Important constraint">
                        <textarea
                          name="constraint"
                          rows={3}
                          value={formData.constraint}
                          onChange={handleChange}
                          className="v5-input"
                          placeholder="A policy, integration, review, security, or operational constraint we should know."
                        />
                      </Field>
                    </FormSection>

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
      </main>
      <Footer />
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
    <section className="v5-form-section">
      <div className="v5-form-section-head">
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
    <label className="v5-field">
      <span className="v5-field-label">
        {label} {required && <span className="req">*</span>}
      </span>
      {children}
    </label>
  );
}
