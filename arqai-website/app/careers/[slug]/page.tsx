"use client";

import { useEffect, useState, useRef } from "react";
import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

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

function StarIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path d="M19.6,9.6h-3.9c-.4,0-1.8-.2-1.8-.2-.6,0-1.1-.2-1.6-.6-.5-.3-.9-.8-1.2-1.2-.3-.4-.4-.9-.5-1.4,0,0,0-1.1-.2-1.5V.4c0-.2-.2-.4-.4-.4s-.4.2-.4.4v4.4c0,.4-.2,1.5-.2,1.5,0,.5-.2,1-.5,1.4-.3.5-.7.9-1.2,1.2s-1,.5-1.6.6c0,0-1.2,0-1.7.2H.4c-.2,0-.4.2-.4.4s.2.4.4.4h4.1c.4,0,1.7.2,1.7.2.6,0,1.1.2,1.6.6.4.3.8.7,1.1,1.1.3.5.5,1,.6,1.6,0,0,0,1.3.2,1.7v4.1c0,.2.2.4.4.4s.4-.2.4-.4v-4.1c0-.4.2-1.7.2-1.7,0-.6.2-1.1.6-1.6.3-.4.7-.8,1.1-1.1.5-.3,1-.5,1.6-.6,0,0,1.3,0,1.8-.2h3.9c.2,0,.4-.2.4-.4s-.2-.4-.4-.4h0Z" />
    </svg>
  );
}

function renderBlock(text: string) {
  // Split lines that start with "-" or "*" into bullet list, otherwise paragraph
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
  const isList = lines.every((l) => /^[-*•]/.test(l));
  if (isList) {
    return (
      <ul className="space-y-3">
        {lines.map((line, i) => (
          <li key={i} className="flex items-start gap-3 text-body-md text-text-muted leading-relaxed">
            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
            <span>{line.replace(/^[-*•]\s*/, "")}</span>
          </li>
        ))}
      </ul>
    );
  }
  return (
    <div className="space-y-4">
      {text.split(/\n{2,}/).map((para, i) => (
        <p key={i} className="text-body-md text-text-muted leading-relaxed whitespace-pre-line">
          {para.trim()}
        </p>
      ))}
    </div>
  );
}

export default function JobDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  // Form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [resume, setResume] = useState<File | null>(null);
  const [resumeError, setResumeError] = useState<string | null>(null);
  const [website, setWebsite] = useState(""); // honeypot
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetch(`/api/careers/${slug}`)
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

  if (missing) notFound();

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
    const err = validateResume(resume);
    if (err) {
      setResumeError(err);
      return;
    }

    setSubmitting(true);
    setServerError(null);

    const fd = new FormData();
    fd.append("jobId", job.id);
    fd.append("fullName", fullName);
    fd.append("email", email);
    if (phone) fd.append("phone", phone);
    if (linkedin) fd.append("linkedin", linkedin);
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
        setCoverLetter("");
        setResume(null);
        setResumeError(null);
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
      <>
        <Header />
        <main className="bg-base pt-32 md:pt-40 pb-20">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <p className="text-body-md text-text-muted">Loading role…</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }
  if (!job) return null;

  return (
    <>
      <Header />
      <main className="bg-base">
        {/* Hero */}
        <section className="pt-32 md:pt-40 pb-12">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <Link
              href="/careers"
              className="inline-flex items-center gap-2 text-body-sm text-accent hover:underline mb-6"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              All roles
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl"
            >
              <p className="flex items-center gap-2 text-body-sm text-accent mb-5 uppercase tracking-wider font-medium">
                <StarIcon className="w-4 h-4" />
                {job.department}
              </p>
              <h1 className="text-display-xl md:text-[clamp(2.5rem,5vw,4.5rem)] font-display leading-[1.1] text-text-bright mb-6">
                {job.title}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-body-sm">
                <span className="px-3 py-1 rounded-full bg-base-tint border border-stroke-muted text-text-bright">
                  {job.location}
                </span>
                <span className="px-3 py-1 rounded-full bg-base-tint border border-stroke-muted text-text-bright">
                  {employmentTypeLabel[job.employment_type] ?? job.employment_type}
                </span>
                {job.experience_level && (
                  <span className="px-3 py-1 rounded-full bg-base-tint border border-stroke-muted text-text-bright">
                    {job.experience_level} level
                  </span>
                )}
                {job.remote && (
                  <span className="px-3 py-1 rounded-full bg-accent/10 text-accent">
                    Remote-friendly
                  </span>
                )}
                {job.salary_range && (
                  <span className="px-3 py-1 rounded-full bg-base-tint border border-stroke-muted text-text-bright">
                    {job.salary_range}
                  </span>
                )}
              </div>
              <div className="mt-8">
                <button onClick={scrollToForm} className="btn bg-accent text-white hover:bg-accent/90">
                  Apply for this role
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Body */}
        <section className="py-section bg-base-tint">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
              <div className="lg:col-span-8 space-y-12">
                {job.short_description && (
                  <p className="text-body-lg text-text-bright leading-relaxed">
                    {job.short_description}
                  </p>
                )}
                {job.description && (
                  <div>
                    <h2 className="text-display-sm font-display text-text-bright mb-4">
                      About the role
                    </h2>
                    {renderBlock(job.description)}
                  </div>
                )}
                {job.responsibilities && (
                  <div>
                    <h2 className="text-display-sm font-display text-text-bright mb-4">
                      What you&apos;ll do
                    </h2>
                    {renderBlock(job.responsibilities)}
                  </div>
                )}
                {job.requirements && (
                  <div>
                    <h2 className="text-display-sm font-display text-text-bright mb-4">
                      What we&apos;re looking for
                    </h2>
                    {renderBlock(job.requirements)}
                  </div>
                )}
              </div>

              <aside className="lg:col-span-4">
                <div className="lg:sticky lg:top-32 card p-6">
                  <h3 className="text-lg font-display font-semibold text-text-bright mb-2">
                    Ready to apply?
                  </h3>
                  <p className="text-body-sm text-text-muted mb-5">
                    Send us your resume and a short note about why this role.
                  </p>
                  <button
                    onClick={scrollToForm}
                    className="w-full btn bg-accent text-white hover:bg-accent/90"
                  >
                    Apply now
                  </button>
                  <Link href="/careers" className="block text-body-sm text-accent hover:underline mt-4 text-center">
                    See other roles
                  </Link>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* Application form */}
        <section className="py-section bg-base" ref={formRef}>
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
              <p className="flex items-center gap-2 text-body-sm text-accent mb-3 uppercase tracking-wider font-medium">
                <StarIcon className="w-4 h-4" />
                Apply
              </p>
              <h2 className="text-display-md font-display text-text-bright mb-2">
                Apply for {job.title}
              </h2>
              <p className="text-body-md text-text-muted mb-8">
                Resume in PDF, DOC, or DOCX. 5 MB max.
              </p>

              {submitStatus === "success" ? (
                <div className="card p-8 md:p-10 text-center">
                  <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mx-auto mb-5">
                    <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-display font-semibold text-text-bright mb-3">
                    Application received.
                  </h3>
                  <p className="text-body-md text-text-muted">
                    Thanks. Our team will review and get back to you. You will hear from us within
                    a few business days.
                  </p>
                  <Link href="/careers" className="inline-block mt-6 btn btn-outline">
                    Back to all roles
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="card p-6 md:p-8 relative" noValidate>
                  {/* Honeypot */}
                  <div className="absolute left-[-9999px] opacity-0 pointer-events-none" aria-hidden="true" tabIndex={-1}>
                    <input
                      type="text"
                      name="website_url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5 mb-5">
                    <Field label="Full name" required>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="form-input"
                      />
                    </Field>
                    <Field label="Email" required>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-input"
                      />
                    </Field>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5 mb-5">
                    <Field label="Phone">
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="form-input"
                      />
                    </Field>
                    <Field label="LinkedIn">
                      <input
                        type="url"
                        placeholder="https://linkedin.com/in/..."
                        value={linkedin}
                        onChange={(e) => setLinkedin(e.target.value)}
                        className="form-input"
                      />
                    </Field>
                  </div>

                  <Field label="Resume" required>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={handleResume}
                      className="block w-full text-body-sm text-text-bright file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border file:border-stroke-muted file:text-body-sm file:font-medium file:bg-base file:text-text-bright hover:file:bg-base-tint"
                    />
                    {resume && !resumeError && (
                      <p className="mt-2 text-body-xs text-text-muted">
                        {resume.name} · {(resume.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    )}
                    {resumeError && (
                      <p className="mt-2 text-body-xs text-red-600">{resumeError}</p>
                    )}
                  </Field>

                  <Field label="Cover note">
                    <textarea
                      rows={5}
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      placeholder="Why this role, and a project you've shipped that's relevant."
                      className="form-input resize-none"
                    />
                  </Field>

                  {submitStatus === "error" && (
                    <div className="mb-5 p-4 bg-red-100 dark:bg-red-900/20 rounded-lg">
                      <p className="text-sm text-red-600 dark:text-red-400">
                        {serverError ||
                          "Something went wrong. Please try again or email us at hello@thearq.ai."}
                      </p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting || !!resumeError}
                    className="w-full btn bg-accent text-white hover:bg-accent/90 disabled:opacity-50"
                  >
                    {submitting ? "Submitting…" : "Submit application"}
                  </button>

                  <p className="mt-4 text-body-xs text-text-muted text-center">
                    We use this only to evaluate your application. See our{" "}
                    <Link href="/privacy" className="text-accent hover:underline">
                      privacy notice
                    </Link>
                    .
                  </p>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
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
    <label className="block mb-5">
      <span className="block text-body-sm font-medium text-text-bright mb-2">
        {label} {required && <span className="text-accent">*</span>}
      </span>
      {children}
    </label>
  );
}
