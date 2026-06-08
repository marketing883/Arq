"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import V5Nav from "@/components/home-v5/V5Nav";
import Footer from "@/components/home-v5/Footer";
import { ArrowRight } from "@/components/home-v5/icons";
import "@/components/home-v5/styles.css";

type Job = {
  id: string;
  slug: string;
  title: string;
  department: string;
  location: string;
  employment_type: string;
  short_description: string | null;
  description: string | null;
  requirements: string | null;
  responsibilities: string | null;
  salary_range: string | null;
  experience_level: string | null;
  remote: boolean;
};

const employmentTypeLabel: Record<string, string> = {
  "full-time": "Full-time",
  "part-time": "Part-time",
  contract: "Contract",
  internship: "Internship",
  temporary: "Temporary",
};

const compensationCurrencies = [
  { value: "", label: "Select currency" },
  { value: "INR", label: "INR" },
  { value: "USD", label: "USD" },
  { value: "EUR", label: "EUR" },
  { value: "GBP", label: "GBP" },
  { value: "AED", label: "AED" },
  { value: "SGD", label: "SGD" },
  { value: "AUD", label: "AUD" },
  { value: "CAD", label: "CAD" },
  { value: "other", label: "Other / discuss" },
];

const compensationBasisOptions = [
  { value: "", label: "Select pay basis" },
  { value: "annual", label: "Annual" },
  { value: "monthly", label: "Monthly" },
  { value: "hourly", label: "Hourly" },
  { value: "daily", label: "Daily" },
  { value: "project", label: "Project / milestone" },
  { value: "stipend", label: "Stipend" },
  { value: "other", label: "Other / discuss" },
];

function toDisplayText(value: unknown): string {
  if (typeof value === "string") return value;
  if (value === null || value === undefined) return "";
  if (Array.isArray(value)) return value.map(toDisplayText).filter(Boolean).join("\n");
  return String(value);
}

type ContentBlock =
  | { type: "heading"; text: string }
  | { type: "para"; text: string }
  | { type: "list"; items: string[] };

// Turn free-form admin text (typed in a textarea, often a mix of intro
// sentences, sub-headings, and bullets) into structured blocks so it renders
// as clean paragraphs and lists instead of one undifferentiated chunk.
function parseContent(raw: string): ContentBlock[] {
  const lines = raw.split(/\r?\n/);
  const blocks: ContentBlock[] = [];
  let list: string[] | null = null;

  const flushList = () => {
    if (list && list.length) blocks.push({ type: "list", items: list });
    list = null;
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      flushList();
      continue;
    }

    const mdHeading = line.match(/^#{1,3}\s+(.*)$/);
    const boldHeading = line.match(/^\*\*(.+?)\*\*:?$/);
    const colonHeading = /^[A-Z][^.!?:]{0,58}:$/.test(line);
    if (mdHeading || boldHeading) {
      flushList();
      blocks.push({ type: "heading", text: (mdHeading?.[1] ?? boldHeading?.[1] ?? "").trim() });
      continue;
    }

    const bullet = line.match(/^[-*•·]\s+(.*)$/);
    if (bullet) {
      if (!list) list = [];
      list.push(bullet[1].trim());
      continue;
    }

    if (colonHeading) {
      flushList();
      blocks.push({ type: "heading", text: line.replace(/:$/, "") });
      continue;
    }

    flushList();
    blocks.push({ type: "para", text: line });
  }
  flushList();
  return blocks;
}

// Minimal inline formatting: **bold**.
function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    const m = part.match(/^\*\*([^*]+)\*\*$/);
    return m ? <strong key={i}>{m[1]}</strong> : <span key={i}>{part}</span>;
  });
}

function JobContent({ text }: { text: string }) {
  const blocks = parseContent(text);
  if (blocks.length === 0) return null;
  return (
    <div className="v5-prose">
      {blocks.map((block, i) => {
        if (block.type === "heading") {
          return <h3 key={i}>{renderInline(block.text)}</h3>;
        }
        if (block.type === "list") {
          return (
            <ul key={i} className="v5-list">
              {block.items.map((item, j) => (
                <li key={j}>{renderInline(item)}</li>
              ))}
            </ul>
          );
        }
        return <p key={i}>{renderInline(block.text)}</p>;
      })}
    </div>
  );
}

export default function JobDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  // Form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [totalExperience, setTotalExperience] = useState("");
  const [skills, setSkills] = useState("");
  const [achievements, setAchievements] = useState("");
  const [compensationCurrency, setCompensationCurrency] = useState("");
  const [compensationBasis, setCompensationBasis] = useState("");
  const [currentCompensation, setCurrentCompensation] = useState("");
  const [expectedCompensation, setExpectedCompensation] = useState("");
  const [compensationNegotiable, setCompensationNegotiable] = useState(false);
  const [noticePeriod, setNoticePeriod] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [resume, setResume] = useState<File | null>(null);
  const [resumeError, setResumeError] = useState<string | null>(null);
  const [website, setWebsite] = useState(""); // honeypot
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetch(`/api/careers/${slug}`, { cache: "no-store" })
      .then(async (r) => {
        if (r.status === 404) {
          if (active) setMissing(true);
          return null;
        }
        return r.json();
      })
      .then((data) => {
        if (!active) return;
        if (data?.job) setJob(data.job);
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [slug]);

  const validateResume = (file: File | null): string | null => {
    if (!file) return "Resume is required.";
    if (file.size > 5 * 1024 * 1024) return "Resume must be 5 MB or less.";
    if (!/\.(pdf|doc|docx)$/i.test(file.name)) {
      return "Resume must be a PDF, DOC, or DOCX file.";
    }
    return null;
  };

  const handleResume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setResume(file);
    setResumeError(validateResume(file));
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!job) return;
    const requiredFields = [
      fullName,
      email,
      phone,
      totalExperience,
      skills,
      achievements,
      compensationCurrency,
      compensationBasis,
      expectedCompensation,
      noticePeriod,
    ];
    if (requiredFields.some((value) => value.trim().length === 0)) {
      setFormError("Please complete all required fields.");
      return;
    }
    const err = validateResume(resume);
    if (err) {
      setResumeError(err);
      return;
    }

    setSubmitting(true);
    setServerError(null);
    setFormError(null);

    const fd = new FormData();
    fd.append("jobId", job.id);
    fd.append("fullName", fullName);
    fd.append("email", email);
    fd.append("phone", phone);
    if (linkedin) fd.append("linkedin", linkedin);
    fd.append("totalExperience", totalExperience);
    fd.append("skills", skills);
    fd.append("achievements", achievements);
    fd.append("compensationCurrency", compensationCurrency);
    fd.append("compensationBasis", compensationBasis);
    if (currentCompensation) fd.append("currentCompensation", currentCompensation);
    fd.append("expectedCompensation", expectedCompensation);
    fd.append("compensationNegotiable", compensationNegotiable ? "true" : "false");
    fd.append("noticePeriod", noticePeriod);
    if (coverLetter) fd.append("coverLetter", coverLetter);
    if (resume) fd.append("resume", resume);
    fd.append("website_url", website);

    try {
      const res = await fetch("/api/careers/apply", { method: "POST", body: fd });
      if (res.ok) {
        setSubmitStatus("success");
        setFullName("");
        setEmail("");
        setPhone("");
        setLinkedin("");
        setTotalExperience("");
        setSkills("");
        setAchievements("");
        setCompensationCurrency("");
        setCompensationBasis("");
        setCurrentCompensation("");
        setExpectedCompensation("");
        setCompensationNegotiable(false);
        setNoticePeriod("");
        setCoverLetter("");
        setResume(null);
        setResumeError(null);
        setFormError(null);
      } else {
        const body = await res.json().catch(() => null);
        setSubmitStatus("error");
        setServerError(body?.error || "Could not submit application.");
      }
    } catch {
      setSubmitStatus("error");
      setServerError("Could not submit application.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="v5-shell">
        <V5Nav />
        <main>
          <section className="v5-page-hero">
            <div className="v5-container">
              <p className="v5-lead">Loading role...</p>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  if (missing) {
    return (
      <div className="v5-shell">
        <V5Nav />
        <main>
          <section className="v5-page-hero">
            <div className="v5-container">
              <div className="v5-card" style={{ maxWidth: 640 }}>
                <h1 className="v5-h2">Role not found.</h1>
                <p className="v5-body">This opening may have closed or moved.</p>
                <Link href="/careers" className="v5-btn v5-btn-ghost" style={{ alignSelf: "flex-start" }}>
                  Back to all roles
                </Link>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  if (!job) return null;

  const shortDescription = toDisplayText(job.short_description);
  const description = toDisplayText(job.description);
  const responsibilities = toDisplayText(job.responsibilities);
  const requirements = toDisplayText(job.requirements);
  const salaryRange = toDisplayText(job.salary_range);
  const experienceLevel = toDisplayText(job.experience_level);

  return (
    <div className="v5-shell">
      <V5Nav />
      <main>
        {/* Hero */}
        <section className="v5-page-hero">
          <div className="v5-container">
            <div className="v5-crumbs" style={{ marginBottom: 22 }}>
              <Link href="/careers">Careers</Link>
              <span>/</span>
              <span style={{ color: "var(--v5-ink-soft)" }}>{job.title}</span>
            </div>
            <div className="v5-page-hero-inner">
              <span className="v5-badge">
                <span className="v5-badge-dot" />
                {job.department}
              </span>
              <h1 className="v5-h1">{job.title}</h1>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 22 }}>
                <span className="v5-chip">{job.location}</span>
                <span className="v5-chip">
                  {employmentTypeLabel[job.employment_type] ?? job.employment_type}
                </span>
                {experienceLevel && <span className="v5-chip">{experienceLevel} level</span>}
                {job.remote && <span className="v5-chip">Remote-friendly</span>}
                {salaryRange && <span className="v5-chip">{salaryRange}</span>}
              </div>
              <div className="v5-hero-actions">
                <button onClick={scrollToForm} className="v5-btn v5-btn-primary">
                  Apply for this role <ArrowRight />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Body */}
        <section className="v5-section v5-bg-grey">
          <div className="v5-container">
            <div className="v5-job-layout">
              <div className="v5-job-main">
                {shortDescription && <p className="v5-lead v5-job-intro">{shortDescription}</p>}
                {description && (
                  <div className="v5-job-section">
                    <h2>About the role</h2>
                    <JobContent text={description} />
                  </div>
                )}
                {responsibilities && (
                  <div className="v5-job-section">
                    <h2>What you&apos;ll do</h2>
                    <JobContent text={responsibilities} />
                  </div>
                )}
                {requirements && (
                  <div className="v5-job-section">
                    <h2>What we&apos;re looking for</h2>
                    <JobContent text={requirements} />
                  </div>
                )}
                {!description && !responsibilities && !requirements && !shortDescription && (
                  <p className="v5-body">Full role details are coming soon. Apply below and our team will share more.</p>
                )}
              </div>

              <aside className="v5-job-aside">
                <div className="v5-job-summary">
                  <span className="v5-job-summary-title">Role at a glance</span>
                  <dl className="v5-job-facts">
                    <SummaryRow label="Department" value={job.department} />
                    <SummaryRow label="Location" value={job.location} />
                    <SummaryRow
                      label="Employment"
                      value={employmentTypeLabel[job.employment_type] ?? job.employment_type}
                    />
                    {experienceLevel && (
                      <SummaryRow label="Experience" value={`${experienceLevel} level`} />
                    )}
                    <SummaryRow label="Work style" value={job.remote ? "Remote-friendly" : "On-site"} />
                    {salaryRange && <SummaryRow label="Compensation" value={salaryRange} />}
                  </dl>
                  <button onClick={scrollToForm} className="v5-btn v5-btn-primary v5-job-apply">
                    Apply for this role <ArrowRight />
                  </button>
                  <Link href="/careers" className="v5-job-summary-back">
                    View all open roles
                  </Link>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* Application form */}
        <section className="v5-section v5-bg-white">
          <div className="v5-container" ref={formRef}>
            <div style={{ maxWidth: 760, margin: "0 auto" }}>
              <div className="v5-section-head" style={{ marginBottom: 28 }}>
                <span className="v5-eyebrow">Apply</span>
                <h2 className="v5-h2">Apply for {job.title}</h2>
                <p className="v5-lead">Resume in PDF, DOC, or DOCX. 5 MB max.</p>
              </div>

              {submitStatus === "success" ? (
                <div className="v5-card v5-success">
                  <div className="v5-success-mark">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--v5-ink)" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="v5-h3">Application received.</h3>
                  <p className="v5-body" style={{ marginTop: 8, marginBottom: 22 }}>
                    Thanks. Our team will review and get back to you. You will hear from us
                    within a few business days.
                  </p>
                  <Link href="/careers" className="v5-btn v5-btn-ghost">
                    Back to all roles
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="v5-card v5-form" style={{ position: "relative" }} noValidate>
                  {/* Honeypot */}
                  <div className="v5-honeypot" aria-hidden="true" tabIndex={-1}>
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
                    <Field label="Full name" required>
                      <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} className="v5-input" />
                    </Field>
                    <Field label="Email" required>
                      <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="v5-input" />
                    </Field>
                  </div>

                  <div className="v5-form-grid two">
                    <Field label="Phone" required>
                      <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} className="v5-input" />
                    </Field>
                    <Field label="LinkedIn">
                      <input type="url" placeholder="https://linkedin.com/in/..." value={linkedin} onChange={(e) => setLinkedin(e.target.value)} className="v5-input" />
                    </Field>
                  </div>

                  <div className="v5-form-grid two">
                    <Field label="Total experience" required>
                      <input type="text" required placeholder="e.g. 6 years, 3 years in AI systems" value={totalExperience} onChange={(e) => setTotalExperience(e.target.value)} className="v5-input" />
                    </Field>
                    <Field label="Notice period" required>
                      <input type="text" required placeholder="e.g. Immediate, 30 days, 60 days" value={noticePeriod} onChange={(e) => setNoticePeriod(e.target.value)} className="v5-input" />
                    </Field>
                  </div>

                  <div className="v5-form-grid two">
                    <Field label="Compensation currency" required hint="Choose the currency most relevant to your location or engagement.">
                      <select required value={compensationCurrency} onChange={(e) => setCompensationCurrency(e.target.value)} className="v5-input">
                        {compensationCurrencies.map((option) => (
                          <option key={option.value || "empty"} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Pay basis" required>
                      <select required value={compensationBasis} onChange={(e) => setCompensationBasis(e.target.value)} className="v5-input">
                        {compensationBasisOptions.map((option) => (
                          <option key={option.value || "empty"} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </Field>
                  </div>

                  <div className="v5-form-grid two">
                    <Field label="Current compensation" hint="Optional. Use the currency and pay basis that applies to you.">
                      <input type="text" value={currentCompensation} onChange={(e) => setCurrentCompensation(e.target.value)} placeholder="e.g. USD 120k/year, INR 24 LPA, EUR 70/hour" className="v5-input" />
                    </Field>
                    <Field label="Expected compensation / range" required hint="A range or 'open to market range' is fine.">
                      <input type="text" required value={expectedCompensation} onChange={(e) => setExpectedCompensation(e.target.value)} placeholder="e.g. USD 140k/year, INR 32 LPA, open to market range" className="v5-input" />
                    </Field>
                  </div>

                  <label
                    className="v5-field"
                    style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 14px", border: "1px solid #e2e2e2", borderRadius: 12, background: "var(--v5-grey-5)" }}
                  >
                    <input
                      type="checkbox"
                      checked={compensationNegotiable}
                      onChange={(e) => setCompensationNegotiable(e.target.checked)}
                      style={{ marginTop: 3, accentColor: "var(--v5-ink)" }}
                    />
                    <span>
                      <span style={{ display: "block", fontSize: 14.5, color: "var(--v5-ink)" }}>
                        I am open to discussing market-aligned compensation.
                      </span>
                      <span style={{ display: "block", marginTop: 4, fontSize: 12.5, color: "var(--v5-grey-100)" }}>
                        This helps us evaluate applications across full-time, contract, hourly,
                        stipend, and project-based roles.
                      </span>
                    </span>
                  </label>

                  <Field label="Primary skills" required>
                    <textarea rows={4} required value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="List the tools, frameworks, domains, and workflows you are strongest in." className="v5-input" />
                  </Field>

                  <Field label="Relevant achievements" required>
                    <textarea rows={5} required value={achievements} onChange={(e) => setAchievements(e.target.value)} placeholder="Share 2-3 shipped projects, measurable outcomes, or production systems you have owned." className="v5-input" />
                  </Field>

                  <Field label="Resume" required>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={handleResume}
                      className="v5-input"
                      style={{ padding: 10 }}
                    />
                    {resume && !resumeError && (
                      <span style={{ display: "block", marginTop: 6, fontSize: 12.5, color: "var(--v5-grey-100)" }}>
                        {resume.name} - {(resume.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    )}
                    {resumeError && (
                      <span style={{ display: "block", marginTop: 6, fontSize: 12.5, color: "#b42318" }}>{resumeError}</span>
                    )}
                  </Field>

                  <Field label="Cover note">
                    <textarea rows={5} value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} placeholder="Why this role, and a project you've shipped that's relevant." className="v5-input" />
                  </Field>

                  {formError && (
                    <div className="v5-form-error" style={{ background: "#fff7e6", borderColor: "#f5d99a", color: "#8a5a00" }}>
                      {formError}
                    </div>
                  )}

                  {submitStatus === "error" && (
                    <div className="v5-form-error">
                      {serverError || "Something went wrong. Please try again or email us at hello@thearq.ai."}
                    </div>
                  )}

                  <button type="submit" disabled={submitting || !!resumeError} className="v5-btn v5-btn-primary v5-form-submit">
                    {submitting ? "Submitting..." : "Submit application"}
                  </button>

                  <p className="v5-form-note">
                    We use this only to evaluate your application. See our{" "}
                    <Link href="/privacy">privacy notice</Link>.
                  </p>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="v5-job-fact">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="v5-field">
      <span className="v5-field-label">
        {label} {required && <span className="req">*</span>}
      </span>
      {children}
      {hint && (
        <span style={{ display: "block", marginTop: 6, fontSize: 12.5, color: "var(--v5-grey-100)" }}>
          {hint}
        </span>
      )}
    </label>
  );
}
