import { NextRequest, NextResponse } from "next/server";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { z } from "zod";
import {
  executeApplicationInsertWithSchemaFallback,
  getMissingSchemaColumn,
  isPublicJobStatus,
} from "@/lib/careers/job-postings";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const RESUME_BUCKET = "resumes";
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);
const ALLOWED_EXT = /\.(pdf|doc|docx)$/i;

const NOTIFY_TO = process.env.CAREERS_NOTIFY_TO || "rmg.india@aciinfotech.com";
const NOTIFY_FROM = process.env.CAREERS_NOTIFY_FROM || "ArqAI Careers <no-reply@thearq.ai>";
const SCREENING_COLUMNS = new Set([
  "total_experience",
  "skills",
  "achievements",
  "compensation_currency",
  "compensation_basis",
  "current_compensation",
  "expected_compensation",
  "compensation_negotiable",
  "notice_period",
]);

const compensationCurrencyLabels: Record<string, string> = {
  INR: "INR",
  USD: "USD",
  EUR: "EUR",
  GBP: "GBP",
  AED: "AED",
  SGD: "SGD",
  AUD: "AUD",
  CAD: "CAD",
  other: "Other / discuss",
};

// Human labels for fields, used to turn Zod validation errors into a readable
// "Field: message" summary the applicant can act on.
const FIELD_LABELS: Record<string, string> = {
  jobId: "Job",
  fullName: "Full name",
  email: "Email",
  phone: "Phone",
  linkedin: "LinkedIn",
  totalExperience: "Total experience",
  skills: "Primary skills",
  achievements: "Relevant achievements",
  compensationCurrency: "Compensation currency",
  compensationBasis: "Pay basis",
  currentCompensation: "Current compensation",
  expectedCompensation: "Expected compensation",
  compensationNegotiable: "Compensation flexibility",
  noticePeriod: "Notice period",
  coverLetter: "Cover note",
};

const compensationBasisLabels: Record<string, string> = {
  annual: "Annual",
  monthly: "Monthly",
  hourly: "Hourly",
  daily: "Daily",
  project: "Project / milestone",
  stipend: "Stipend",
  other: "Other / discuss",
};

let supabase: SupabaseClient | null = null;
function getClient() {
  if (supabase) return supabase;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  supabase = createClient(url, key);
  return supabase;
}

const applicationSchema = z.object({
  jobId: z.string().uuid("This job link looks invalid. Please reopen the posting and try again."),
  fullName: z.string().min(2, "Please enter your full name.").max(120, "Name is too long."),
  email: z.string().email("Please enter a valid email address.").max(200, "Email is too long."),
  phone: z.string().min(5, "Please enter a valid phone number.").max(40, "Phone number is too long."),
  linkedin: z.string().max(300, "LinkedIn URL is too long.").optional().nullable(),
  totalExperience: z.string().min(1, "Please add your total experience.").max(120, "Total experience is too long."),
  skills: z
    .string()
    .min(10, "Please describe your primary skills (at least 10 characters).")
    .max(5000, "Primary skills is too long (5000 characters max)."),
  achievements: z
    .string()
    .min(10, "Please add a few relevant achievements (at least 10 characters).")
    .max(5000, "Achievements is too long (5000 characters max)."),
  compensationCurrency: z.enum(
    ["INR", "USD", "EUR", "GBP", "AED", "SGD", "AUD", "CAD", "other"],
    { errorMap: () => ({ message: "Please select a compensation currency." }) }
  ),
  compensationBasis: z.enum(
    ["annual", "monthly", "hourly", "daily", "project", "stipend", "other"],
    { errorMap: () => ({ message: "Please select a pay basis." }) }
  ),
  currentCompensation: z.string().max(200, "Current compensation is too long.").optional().nullable(),
  expectedCompensation: z
    .string()
    .min(1, "Please add your expected compensation or range.")
    .max(200, "Expected compensation is too long."),
  compensationNegotiable: z.boolean(),
  noticePeriod: z.string().min(1, "Please add your notice period.").max(120, "Notice period is too long."),
  coverLetter: z.string().max(5000, "Cover note is too long (5000 characters max).").optional().nullable(),
});

function safeFilename(name: string) {
  return name.replace(/[^A-Za-z0-9._-]+/g, "_").slice(0, 120);
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formBoolean(value: FormDataEntryValue | null) {
  return value === "true" || value === "on" || value === "1";
}

export async function POST(request: NextRequest) {
  const client = getClient();
  if (!client) {
    console.error(
      "[careers/apply] Supabase client unavailable: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set in this runtime"
    );
    return NextResponse.json({ error: "Server not configured" }, { status: 500 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    console.warn("[careers/apply] rejected: could not parse multipart form data");
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  // Honeypot
  const honey = (formData.get("website_url") as string) || "";
  if (honey.trim().length > 0) {
    console.warn("[careers/apply] dropped: honeypot field 'website_url' was filled (likely bot or browser autofill)");
    return NextResponse.json({ ok: true });
  }

  const parsed = applicationSchema.safeParse({
    jobId: formData.get("jobId"),
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    linkedin: formData.get("linkedin") || null,
    totalExperience: formData.get("totalExperience"),
    skills: formData.get("skills"),
    achievements: formData.get("achievements"),
    compensationCurrency: formData.get("compensationCurrency"),
    compensationBasis: formData.get("compensationBasis"),
    currentCompensation: formData.get("currentCompensation") || null,
    expectedCompensation: formData.get("expectedCompensation"),
    compensationNegotiable: formBoolean(formData.get("compensationNegotiable")),
    noticePeriod: formData.get("noticePeriod"),
    coverLetter: formData.get("coverLetter") || null,
  });
  if (!parsed.success) {
    const flattened = parsed.error.flatten();
    console.warn(
      "[careers/apply] rejected: validation failed",
      JSON.stringify(flattened.fieldErrors)
    );
    // Build a readable, field-by-field summary so the applicant sees exactly
    // what to fix instead of a bare "Invalid input".
    const summary = Object.entries(flattened.fieldErrors)
      .map(([field, errors]) => {
        const label = FIELD_LABELS[field] ?? field;
        const message = Array.isArray(errors) && errors.length > 0 ? errors[0] : "is invalid";
        return `${label}: ${message}`;
      })
      .join(" ");
    return NextResponse.json(
      {
        error: summary || "Some fields need attention. Please review and try again.",
        fieldErrors: flattened.fieldErrors,
      },
      { status: 400 }
    );
  }
  const data = parsed.data;

  const resume = formData.get("resume");
  if (!(resume instanceof File)) {
    console.warn("[careers/apply] rejected: resume missing or not a file");
    return NextResponse.json({ error: "Resume is required" }, { status: 400 });
  }
  if (resume.size === 0) {
    console.warn("[careers/apply] rejected: resume file is empty");
    return NextResponse.json({ error: "Resume file is empty" }, { status: 400 });
  }
  if (resume.size > MAX_BYTES) {
    console.warn("[careers/apply] rejected: resume exceeds 5 MB");
    return NextResponse.json(
      { error: "Resume must be 5 MB or less" },
      { status: 400 }
    );
  }
  if (!ALLOWED_MIME.has(resume.type) && !ALLOWED_EXT.test(resume.name || "")) {
    console.warn(
      `[careers/apply] rejected: resume type not allowed (type=${resume.type}, name=${resume.name})`
    );
    return NextResponse.json(
      { error: "Resume must be a PDF, DOC, or DOCX file" },
      { status: 400 }
    );
  }

  // Confirm the job exists and is active
  // select("*") rather than an explicit column list so the lookup keeps working
  // even on installs that haven't yet added the optional notification_email
  // column (it simply comes back undefined there).
  const { data: job, error: jobErr } = await client
    .from("job_postings")
    .select("*")
    .eq("id", data.jobId)
    .maybeSingle();
  if (jobErr || !job || !isPublicJobStatus(job.status)) {
    console.warn(
      `[careers/apply] rejected: job lookup failed (jobId=${data.jobId}, found=${!!job}, status=${job?.status ?? "n/a"}, error=${jobErr?.message ?? "none"})`
    );
    return NextResponse.json({ error: "Job posting not found" }, { status: 404 });
  }

  // Upload resume
  const filename = safeFilename(resume.name || "resume");
  const path = `applications/${job.slug}/${Date.now()}-${crypto.randomUUID()}-${filename}`;
  const buf = Buffer.from(await resume.arrayBuffer());

  const { error: uploadErr } = await client.storage
    .from(RESUME_BUCKET)
    .upload(path, buf, {
      contentType: resume.type || "application/octet-stream",
      upsert: false,
    });
  if (uploadErr) {
    console.error("[careers/apply] storage upload failed", uploadErr);
    return NextResponse.json(
      { error: "Resume upload failed. Please try again or email rmg.india@aciinfotech.com directly." },
      { status: 500 }
    );
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    null;
  const userAgent = request.headers.get("user-agent") || null;

  // Insert with schema-drift fallback: if the table is missing optional
  // screening/compensation columns (older installs that never ran the careers
  // migration), drop those columns and retry so the application -- name,
  // email, phone, resume, and the job it's for -- is never lost wholesale.
  const { data: inserted, error: insertErr, omittedColumns } =
    await executeApplicationInsertWithSchemaFallback<{ id: string }>(
      {
        job_id: job.id,
        full_name: data.fullName,
        email: data.email,
        phone: data.phone,
        linkedin_url: data.linkedin || null,
        total_experience: data.totalExperience,
        skills: data.skills,
        achievements: data.achievements,
        compensation_currency: data.compensationCurrency,
        compensation_basis: data.compensationBasis,
        current_compensation: data.currentCompensation || null,
        expected_compensation: data.expectedCompensation,
        compensation_negotiable: data.compensationNegotiable,
        notice_period: data.noticePeriod,
        cover_letter: data.coverLetter || null,
        resume_path: path,
        resume_filename: filename,
        resume_mime_type: resume.type || "application/octet-stream",
        resume_size_bytes: resume.size,
        ip,
        user_agent: userAgent,
      },
      (payload) => client.from("job_applications").insert(payload).select("id").single()
    );
  if (insertErr || !inserted) {
    console.error("[careers/apply] insert failed", insertErr);
    // Best-effort cleanup of the uploaded file
    await client.storage.from(RESUME_BUCKET).remove([path]).catch(() => undefined);
    const missingColumn = getMissingSchemaColumn(insertErr);
    return NextResponse.json(
      {
        error:
          missingColumn && SCREENING_COLUMNS.has(missingColumn)
            ? `Careers applications database is missing the '${missingColumn}' column. Run supabase-careers-compensation-migration.sql in Supabase, then retry.`
            : "Could not save application. Please try again.",
      },
      { status: 500 }
    );
  }
  if (omittedColumns.length > 0) {
    // The application was saved, but some screening fields couldn't be stored
    // because the table is behind on migrations. Surface this in the logs so
    // the schema can be fixed without losing applications in the meantime.
    console.warn(
      `[careers/apply] saved application ${inserted.id} but dropped columns missing from job_applications: ${omittedColumns.join(", ")}. Run supabase-careers-compensation-migration.sql.`
    );
  } else {
    console.log(`[careers/apply] saved application ${inserted.id} for job ${job.slug}`);
  }

  // Send notification email with the resume attached
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      const resend = new Resend(apiKey);
      const subject = `New application: ${job.title} - ${data.fullName}`;
      const html = `
        <div style="font-family:Arial,Helvetica,sans-serif;color:#222;max-width:640px">
          <h2 style="margin:0 0 12px 0">New application</h2>
          <p style="margin:0 0 16px 0;color:#555">Submitted via the ArqAI Labs careers page.</p>
          <table cellpadding="6" style="border-collapse:collapse;font-size:14px">
            <tr><td style="color:#777">Role</td><td><strong>${escapeHtml(job.title)}</strong></td></tr>
            <tr><td style="color:#777">Department</td><td>${escapeHtml(job.department)}</td></tr>
            <tr><td style="color:#777">Location</td><td>${escapeHtml(job.location)}</td></tr>
            <tr><td style="color:#777">Employment</td><td>${escapeHtml(job.employment_type)}</td></tr>
            <tr><td colspan="2"><hr style="border:none;border-top:1px solid #eee"/></td></tr>
            <tr><td style="color:#777">Candidate</td><td><strong>${escapeHtml(data.fullName)}</strong></td></tr>
            <tr><td style="color:#777">Email</td><td><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></td></tr>
            <tr><td style="color:#777">Phone</td><td>${escapeHtml(data.phone)}</td></tr>
            ${data.linkedin ? `<tr><td style="color:#777">LinkedIn</td><td><a href="${escapeHtml(data.linkedin)}">${escapeHtml(data.linkedin)}</a></td></tr>` : ""}
            <tr><td style="color:#777">Experience</td><td>${escapeHtml(data.totalExperience)}</td></tr>
            <tr><td style="color:#777">Notice period</td><td>${escapeHtml(data.noticePeriod)}</td></tr>
            <tr><td style="color:#777">Compensation currency</td><td>${escapeHtml(compensationCurrencyLabels[data.compensationCurrency])}</td></tr>
            <tr><td style="color:#777">Pay basis</td><td>${escapeHtml(compensationBasisLabels[data.compensationBasis])}</td></tr>
            <tr><td style="color:#777">Current compensation</td><td>${escapeHtml(data.currentCompensation || "Not shared")}</td></tr>
            <tr><td style="color:#777">Expected compensation / range</td><td>${escapeHtml(data.expectedCompensation)}</td></tr>
            <tr><td style="color:#777">Open to market-aligned discussion</td><td>${data.compensationNegotiable ? "Yes" : "No"}</td></tr>
          </table>
          <h3 style="margin:24px 0 8px 0">Primary skills</h3>
          <pre style="white-space:pre-wrap;background:#f7f7f7;padding:12px;border-radius:6px;font-family:inherit;font-size:14px;line-height:1.5">${escapeHtml(data.skills)}</pre>
          <h3 style="margin:24px 0 8px 0">Relevant achievements</h3>
          <pre style="white-space:pre-wrap;background:#f7f7f7;padding:12px;border-radius:6px;font-family:inherit;font-size:14px;line-height:1.5">${escapeHtml(data.achievements)}</pre>
          ${
            data.coverLetter
              ? `<h3 style="margin:24px 0 8px 0">Cover note</h3><pre style="white-space:pre-wrap;background:#f7f7f7;padding:12px;border-radius:6px;font-family:inherit;font-size:14px;line-height:1.5">${escapeHtml(data.coverLetter)}</pre>`
              : ""
          }
          <p style="margin-top:24px;color:#777;font-size:12px">Resume is attached. The application is also viewable in the admin dashboard at /admin/jobs/applications.</p>
        </div>
      `;
      const text = [
        `New application: ${job.title}`,
        `Department: ${job.department}`,
        `Location: ${job.location}`,
        `Employment: ${job.employment_type}`,
        ``,
        `Candidate: ${data.fullName}`,
        `Email: ${data.email}`,
        `Phone: ${data.phone}`,
        data.linkedin ? `LinkedIn: ${data.linkedin}` : null,
        `Experience: ${data.totalExperience}`,
        `Notice period: ${data.noticePeriod}`,
        `Compensation currency: ${compensationCurrencyLabels[data.compensationCurrency]}`,
        `Pay basis: ${compensationBasisLabels[data.compensationBasis]}`,
        `Current compensation: ${data.currentCompensation || "Not shared"}`,
        `Expected compensation / range: ${data.expectedCompensation}`,
        `Open to market-aligned discussion: ${data.compensationNegotiable ? "Yes" : "No"}`,
        ``,
        `Primary skills:`,
        data.skills,
        ``,
        `Relevant achievements:`,
        data.achievements,
        data.coverLetter ? `\nCover note:\n${data.coverLetter}` : null,
        ``,
        `Resume is attached. View in admin: /admin/jobs/applications.`,
      ]
        .filter(Boolean)
        .join("\n");

      // Always notify the default recruiting inbox, plus the per-job
      // notification email if one was set on the posting (and isn't a duplicate).
      const recipients = [NOTIFY_TO];
      const jobNotifyEmail =
        typeof job.notification_email === "string" ? job.notification_email.trim() : "";
      if (
        jobNotifyEmail &&
        jobNotifyEmail.toLowerCase() !== NOTIFY_TO.toLowerCase()
      ) {
        recipients.push(jobNotifyEmail);
      }

      await resend.emails.send({
        from: NOTIFY_FROM,
        to: recipients,
        reply_to: data.email,
        subject,
        html,
        text,
        attachments: [
          {
            filename,
            content: buf,
          },
        ],
      });

      await client
        .from("job_applications")
        .update({ notified_at: new Date().toISOString() })
        .eq("id", inserted.id);
    } else {
      console.warn("[careers/apply] RESEND_API_KEY missing; skipping notification email");
    }
  } catch (emailErr) {
    // Don't fail the application if the notification fails -- the row + resume
    // are already in place. Log so it can be retried.
    console.error("[careers/apply] notification email failed", emailErr);
  }

  return NextResponse.json({ ok: true });
}
