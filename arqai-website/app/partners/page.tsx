"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SiteNav } from "@/components/site-dark/SiteNav";
import { SiteFooter } from "@/components/site-dark/SiteFooter";

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
    <div className="arq-dark min-h-screen">
      <SiteNav />
      <main>
        <section className="a-section" style={{ paddingTop: "clamp(140px, 16vh, 200px)" }}>
          <div className="a-wrap">
            <span className="a-eyebrow">Partners</span>
            <div className="partner-hero">
              <div>
                <h1 className="h-display" style={{ marginTop: 18, maxWidth: "13ch" }}>
                  Build the next AI workflow with <em>us</em>.
                </h1>
              </div>
              <p className="lede">
                We partner where there is a real operating problem, a clear path to customers, and a reason to build
                something governed enough for enterprise deployment.
              </p>
            </div>
          </div>
        </section>

        <section className="a-section">
          <div className="a-wrap">
            <div className="partner-models">
              {partnerModels.map((model, index) => (
                <article className="a-card partner-model" key={model.title}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h2>{model.title}</h2>
                  <p>{model.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="a-section" id="partner-intake">
          <div className="a-wrap">
            <div className="partner-form-grid">
              <div>
                <span className="a-eyebrow">Partner intake</span>
                <h2 className="h-section" style={{ marginTop: 18 }}>
                  Give us enough context to evaluate the fit.
                </h2>
                <p className="lede" style={{ marginTop: 20 }}>
                  Tell us where you fit, what customers you serve, and what opportunity we should evaluate together.
                </p>
                <div className="partner-notes">
                  <p>Best fits usually have:</p>
                  <ul>
                    <li>Enterprise or regulated-market access</li>
                    <li>A concrete workflow, customer segment, or platform gap</li>
                    <li>A shared path to implementation, not only referral volume</li>
                  </ul>
                </div>
              </div>

              {formSuccess ? (
                <div className="a-card form-success">
                  <div className="success-mark">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--ember)" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3>Thanks. We will review the fit.</h3>
                  <p>We will review the fit and follow up with the right owner.</p>
                  <button type="button" className="a-btn a-btn-ghost" onClick={() => setFormSuccess(false)}>
                    Send another enquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="a-card intake-form">
                  <div className="d-honeypot" aria-hidden="true">
                    <input type="text" name="website_url" value={formData.website_url} onChange={handleFormChange} tabIndex={-1} autoComplete="off" />
                  </div>

                  <div className="form-grid two">
                    <DarkField label="Name" required>
                      <input type="text" name="name" value={formData.name} onChange={handleFormChange} required className="d-input" />
                    </DarkField>
                    <DarkField label="Work email" required>
                      <input type="email" name="email" value={formData.email} onChange={handleFormChange} required className="d-input" />
                    </DarkField>
                  </div>

                  <div className="form-grid two">
                    <DarkField label="Company" required>
                      <input type="text" name="company" value={formData.company} onChange={handleFormChange} required className="d-input" />
                    </DarkField>
                    <DarkField label="Role" required>
                      <input type="text" name="jobTitle" value={formData.jobTitle} onChange={handleFormChange} required className="d-input" />
                    </DarkField>
                  </div>

                  <div className="form-grid two">
                    <DarkField label="Phone">
                      <input type="tel" name="phone" value={formData.phone} onChange={handleFormChange} className="d-input" />
                    </DarkField>
                    <DarkField label="Website">
                      <input type="url" name="website" value={formData.website} onChange={handleFormChange} className="d-input" placeholder="https://example.com" />
                    </DarkField>
                  </div>

                  <div className="form-grid three">
                    <DarkField label="Partnership type" required>
                      <select name="partnershipType" value={formData.partnershipType} onChange={handleFormChange} required className="d-input">
                        {partnershipTypes.map((item) => (
                          <option key={item.value} value={item.value}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                    </DarkField>
                    <DarkField label="Company size">
                      <select name="companySize" value={formData.companySize} onChange={handleFormChange} className="d-input">
                        <option value="">Select</option>
                        {companySizes.map((item) => (
                          <option key={item.value} value={item.value}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                    </DarkField>
                    <DarkField label="Timeline">
                      <select name="timeline" value={formData.timeline} onChange={handleFormChange} className="d-input">
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
                    <DarkField label="Region / markets served">
                      <input type="text" name="partnerRegion" value={formData.partnerRegion} onChange={handleFormChange} className="d-input" placeholder="North America, GCC, India, EU..." />
                    </DarkField>
                    <DarkField label="Typical deal size">
                      <input type="text" name="typicalDealSize" value={formData.typicalDealSize} onChange={handleFormChange} className="d-input" placeholder="$100K-$500K, enterprise license, services..." />
                    </DarkField>
                  </div>

                  <DarkField label="Customer base">
                    <textarea
                      name="customerBase"
                      value={formData.customerBase}
                      onChange={handleFormChange}
                      rows={3}
                      className="d-input"
                      placeholder="Who do you serve? Industries, buyer roles, account size, geography."
                    />
                  </DarkField>

                  <DarkField label="Solution areas">
                    <textarea
                      name="solutionAreas"
                      value={formData.solutionAreas}
                      onChange={handleFormChange}
                      rows={3}
                      className="d-input"
                      placeholder="Platforms, services, data, cloud, security, workflow, or AI areas you bring."
                    />
                  </DarkField>

                  <DarkField label="Existing relationship or opportunity">
                    <textarea
                      name="existingRelationship"
                      value={formData.existingRelationship}
                      onChange={handleFormChange}
                      rows={3}
                      className="d-input"
                      placeholder="Named customer, active opportunity, platform integration, or market thesis."
                    />
                  </DarkField>

                  <DarkField label="What should we explore together?" required>
                    <textarea
                      name="proposedOpportunity"
                      value={formData.proposedOpportunity}
                      onChange={handleFormChange}
                      rows={4}
                      required
                      className="d-input"
                      placeholder="Describe the partnership idea, workflow opportunity, or customer problem."
                    />
                  </DarkField>

                  <DarkField label="Anything else">
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleFormChange}
                      rows={3}
                      className="d-input"
                      placeholder="Add context, constraints, links, or next steps."
                    />
                  </DarkField>

                  {formError && <div className="form-error">{formError}</div>}

                  <button type="submit" disabled={formSubmitting} className="a-btn a-btn-primary form-submit">
                    {formSubmitting ? "Submitting..." : "Get Started"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
      <style>{`
        .arq-dark .partner-hero {
          display: grid;
          grid-template-columns: 1fr;
          gap: 28px;
          align-items: end;
        }
        @media (min-width: 940px) {
          .arq-dark .partner-hero { grid-template-columns: 7fr 5fr; }
          .arq-dark .partner-form-grid { grid-template-columns: 4fr 8fr !important; gap: 64px !important; }
        }
        @media (max-width: 760px) {
          .arq-dark .form-grid.two,
          .arq-dark .form-grid.three,
          .arq-dark .partner-models { grid-template-columns: 1fr !important; }
        }
        .arq-dark .partner-models {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        .arq-dark .partner-model {
          min-height: 250px;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .arq-dark .partner-model span {
          font-family: var(--mono);
          color: var(--ember);
          font-size: 12px;
          letter-spacing: .12em;
        }
        .arq-dark .partner-model h2 {
          color: var(--ink-cream);
          font-family: var(--display);
          font-size: 26px;
          font-weight: 500;
          letter-spacing: -0.02em;
          margin: 0;
        }
        .arq-dark .partner-model p,
        .arq-dark .partner-notes {
          color: var(--ink-cream-d);
          line-height: 1.6;
          margin: 0;
        }
        .arq-dark .partner-form-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 40px;
          align-items: start;
        }
        .arq-dark .partner-notes {
          margin-top: 28px;
          border-top: 1px solid var(--aline);
          padding-top: 24px;
          font-size: 14px;
        }
        .arq-dark .partner-notes ul {
          margin: 12px 0 0;
          padding-left: 18px;
        }
        .arq-dark .partner-notes li + li { margin-top: 8px; }
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
        .arq-dark select.d-input { color-scheme: dark; }
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
        .arq-dark .form-success {
          padding: clamp(28px, 5vw, 48px);
          text-align: center;
        }
        .arq-dark .form-success h3 {
          font-family: var(--display);
          color: var(--ink-cream);
          font-size: 28px;
          font-weight: 500;
          letter-spacing: -0.02em;
          margin: 0 0 12px;
        }
        .arq-dark .form-success p {
          color: var(--ink-cream-d);
          margin: 0 auto 24px;
          max-width: 42ch;
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
