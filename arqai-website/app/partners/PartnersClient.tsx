"use client";

import { useEffect, useState } from "react";
import V6Nav from "@/components/v6/V6Nav";
import V6Footer from "@/components/v6/V6Footer";
import ClosingCta from "@/components/v6/ClosingCta";
import { trackGenerateLead } from "@/lib/analytics/gtm-events";
import "@/components/v6/v6.css";
import "@/components/home-v5/styles.css";

const partnerModels = [
  {
    title: "Technology alliances",
    body: "Model, cloud, data, security, and workflow platforms that want governed AI deployments in real operating environments.",
  },
  {
    title: "Implementation partners",
    body: "Specialist services teams with customer relationships, delivery depth, and a need for AI workflow engineering capacity.",
  },
  {
    title: "Design partners",
    body: "Enterprise operators ready to shape a repeatable workflow accelerator with a real production problem.",
  },
];

const partnershipTypes = [
  { value: "technology", label: "Technology alliance" },
  { value: "implementation", label: "Implementation partner" },
  { value: "reseller", label: "Reseller / channel" },
  { value: "design_partner", label: "Design partner" },
  { value: "strategic", label: "Strategic alliance" },
  { value: "other", label: "Other" },
];

const companySizes = [
  { value: "startup", label: "1-50" },
  { value: "small", label: "51-200" },
  { value: "mid-market", label: "201-1,000" },
  { value: "enterprise", label: "1,000+" },
];

const timelines = [
  { value: "now", label: "Now / active opportunity" },
  { value: "quarter", label: "This quarter" },
  { value: "half_year", label: "Next 3-6 months" },
  { value: "exploring", label: "Exploring partnership fit" },
];

type PartnerFormData = {
  name: string;
  email: string;
  company: string;
  phone: string;
  jobTitle: string;
  partnershipType: string;
  companySize: string;
  website: string;
  partnerRegion: string;
  customerBase: string;
  solutionAreas: string;
  typicalDealSize: string;
  timeline: string;
  existingRelationship: string;
  proposedOpportunity: string;
  message: string;
  website_url: string;
};

const emptyForm: PartnerFormData = {
  name: "",
  email: "",
  company: "",
  phone: "",
  jobTitle: "",
  partnershipType: "technology",
  companySize: "",
  website: "",
  partnerRegion: "",
  customerBase: "",
  solutionAreas: "",
  typicalDealSize: "",
  timeline: "",
  existingRelationship: "",
  proposedOpportunity: "",
  message: "",
  website_url: "",
};

export default function PartnersPage() {
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formLoadedAt, setFormLoadedAt] = useState(0);
  const [formData, setFormData] = useState<PartnerFormData>(emptyForm);

  useEffect(() => {
    setFormLoadedAt(Date.now());
  }, []);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormError(null);

    try {
      const response = await fetch("/api/partner-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, _formLoadedAt: formLoadedAt }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit partner enquiry");
      }

      trackGenerateLead({
        form_name: "partner_form",
        inquiry_type: `partner_${formData.partnershipType}`,
        company_size: formData.companySize,
        timeline: formData.timeline,
        value: 100,
      });
      setFormSuccess(true);
      setFormData(emptyForm);
      setFormLoadedAt(Date.now());
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setFormSubmitting(false);
    }
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
                Partners
              </span>
              <h1 className="v5-h1">Build the next AI workflow with us.</h1>
              <p className="v5-lead">
                We partner where there is a real operating problem, a clear path to customers, and a reason to build
                something governed enough for enterprise deployment.
              </p>
            </div>
          </div>
        </section>

        {/* Partner models */}
        <section className="v5-section v5-bg-grey">
          <div className="v5-container">
            <div className="v5-grid v5-grid-3">
              {partnerModels.map((model, index) => (
                <div className="v5-card v5-numcard" key={model.title}>
                  <span className="v5-num">{String(index + 1).padStart(2, "0")}</span>
                  <h2 className="v5-h3">{model.title}</h2>
                  <p className="v5-body">{model.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Partner intake */}
        <section className="v5-section v5-bg-white" id="partner-intake">
          <div className="v5-container">
            <div className="v5-contact-grid">
              <aside>
                <span className="v5-eyebrow">Partner intake</span>
                <h2 className="v5-h2" style={{ marginTop: 14, fontSize: "clamp(26px, 3vw, 38px)" }}>
                  Give us enough context to evaluate the fit.
                </h2>
                <p className="v5-lead" style={{ marginTop: 16 }}>
                  Tell us where you fit, what customers you serve, and what opportunity we should evaluate together.
                </p>
                <div style={{ marginTop: 24 }}>
                  <p className="v5-body" style={{ marginBottom: 12 }}>Best fits usually have:</p>
                  <ul className="v5-list">
                    <li>Enterprise or regulated-market access</li>
                    <li>A concrete workflow, customer segment, or platform gap</li>
                    <li>A shared path to implementation, not only referral volume</li>
                  </ul>
                </div>
              </aside>

              <div>
                {formSuccess ? (
                  <div className="v5-card v5-success">
                    <div className="v5-success-mark">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--v5-ink)" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="v5-h3">Thanks. We will review the fit.</h3>
                    <p className="v5-body" style={{ marginTop: 8 }}>
                      We will review the fit and follow up with the right owner.
                    </p>
                    <button
                      type="button"
                      className="v5-btn v5-btn-ghost"
                      style={{ marginTop: 20 }}
                      onClick={() => setFormSuccess(false)}
                    >
                      Send another enquiry
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="v5-card v5-form" style={{ position: "relative" }}>
                    <div className="v5-honeypot" aria-hidden="true">
                      <input type="text" name="website_url" value={formData.website_url} onChange={handleFormChange} tabIndex={-1} autoComplete="off" />
                    </div>

                    <div className="v5-form-grid two">
                      <Field label="Name" required>
                        <input type="text" name="name" value={formData.name} onChange={handleFormChange} required className="v5-input" />
                      </Field>
                      <Field label="Work email" required>
                        <input type="email" name="email" value={formData.email} onChange={handleFormChange} required className="v5-input" />
                      </Field>
                    </div>

                    <div className="v5-form-grid two">
                      <Field label="Company" required>
                        <input type="text" name="company" value={formData.company} onChange={handleFormChange} required className="v5-input" />
                      </Field>
                      <Field label="Role" required>
                        <input type="text" name="jobTitle" value={formData.jobTitle} onChange={handleFormChange} required className="v5-input" />
                      </Field>
                    </div>

                    <div className="v5-form-grid two">
                      <Field label="Phone">
                        <input type="tel" name="phone" value={formData.phone} onChange={handleFormChange} className="v5-input" />
                      </Field>
                      <Field label="Website">
                        <input type="url" name="website" value={formData.website} onChange={handleFormChange} className="v5-input" placeholder="https://example.com" />
                      </Field>
                    </div>

                    <div className="v5-form-grid three">
                      <Field label="Partnership type" required>
                        <select name="partnershipType" value={formData.partnershipType} onChange={handleFormChange} required className="v5-input">
                          {partnershipTypes.map((item) => (
                            <option key={item.value} value={item.value}>
                              {item.label}
                            </option>
                          ))}
                        </select>
                      </Field>
                      <Field label="Company size">
                        <select name="companySize" value={formData.companySize} onChange={handleFormChange} className="v5-input">
                          <option value="">Select</option>
                          {companySizes.map((item) => (
                            <option key={item.value} value={item.value}>
                              {item.label}
                            </option>
                          ))}
                        </select>
                      </Field>
                      <Field label="Timeline">
                        <select name="timeline" value={formData.timeline} onChange={handleFormChange} className="v5-input">
                          <option value="">Select</option>
                          {timelines.map((item) => (
                            <option key={item.value} value={item.value}>
                              {item.label}
                            </option>
                          ))}
                        </select>
                      </Field>
                    </div>

                    <div className="v5-form-grid two">
                      <Field label="Region / markets served">
                        <input type="text" name="partnerRegion" value={formData.partnerRegion} onChange={handleFormChange} className="v5-input" placeholder="North America, GCC, India, EU..." />
                      </Field>
                      <Field label="Typical deal size">
                        <input type="text" name="typicalDealSize" value={formData.typicalDealSize} onChange={handleFormChange} className="v5-input" placeholder="$100K-$500K, enterprise license, services..." />
                      </Field>
                    </div>

                    <Field label="Customer base">
                      <textarea
                        name="customerBase"
                        value={formData.customerBase}
                        onChange={handleFormChange}
                        rows={3}
                        className="v5-input"
                        placeholder="Who do you serve? Industries, buyer roles, account size, geography."
                      />
                    </Field>

                    <Field label="Solution areas">
                      <textarea
                        name="solutionAreas"
                        value={formData.solutionAreas}
                        onChange={handleFormChange}
                        rows={3}
                        className="v5-input"
                        placeholder="Platforms, services, data, cloud, security, workflow, or AI areas you bring."
                      />
                    </Field>

                    <Field label="Existing relationship or opportunity">
                      <textarea
                        name="existingRelationship"
                        value={formData.existingRelationship}
                        onChange={handleFormChange}
                        rows={3}
                        className="v5-input"
                        placeholder="Named customer, active opportunity, platform integration, or market thesis."
                      />
                    </Field>

                    <Field label="What should we explore together?" required>
                      <textarea
                        name="proposedOpportunity"
                        value={formData.proposedOpportunity}
                        onChange={handleFormChange}
                        rows={4}
                        required
                        className="v5-input"
                        placeholder="Describe the partnership idea, workflow opportunity, or customer problem."
                      />
                    </Field>

                    <Field label="Anything else">
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleFormChange}
                        rows={3}
                        className="v5-input"
                        placeholder="Add context, constraints, links, or next steps."
                      />
                    </Field>

                    {formError && <div className="v5-form-error">{formError}</div>}

                    <button type="submit" disabled={formSubmitting} className="v5-btn v5-btn-primary v5-form-submit">
                      {formSubmitting ? "Submitting..." : "Get Started"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
        <ClosingCta
          heading="Rather engage us directly?"
          sub="If a partnership isn't the right shape yet, bring us the workflow instead — a senior member of the team follows up within one business day."
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
