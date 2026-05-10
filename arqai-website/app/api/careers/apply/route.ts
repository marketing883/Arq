import { NextRequest, NextResponse } from "next/server";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { z } from "zod";

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
  jobId: z.string().uuid(),
  fullName: z.string().min(2).max(120),
  email: z.string().email().max(200),
  phone: z.string().max(40).optional().nullable(),
  linkedin: z.string().max(300).optional().nullable(),
  coverLetter: z.string().max(5000).optional().nullable(),
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

export async function POST(request: NextRequest) {
  const client = getClient();
  if (!client) {
    return NextResponse.json({ error: "Server not configured" }, { status: 500 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  // Honeypot
  const honey = (formData.get("website_url") as string) || "";
  if (honey.trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  const parsed = applicationSchema.safeParse({
    jobId: formData.get("jobId"),
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone") || null,
    linkedin: formData.get("linkedin") || null,
    coverLetter: formData.get("coverLetter") || null,
  });
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const data = parsed.data;

  const resume = formData.get("resume");
  if (!(resume instanceof File)) {
    return NextResponse.json({ error: "Resume is required" }, { status: 400 });
  }
  if (resume.size === 0) {
    return NextResponse.json({ error: "Resume file is empty" }, { status: 400 });
  }
  if (resume.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "Resume must be 5 MB or less" },
      { status: 400 }
    );
  }
  if (!ALLOWED_MIME.has(resume.type) && !ALLOWED_EXT.test(resume.name || "")) {
    return NextResponse.json(
      { error: "Resume must be a PDF, DOC, or DOCX file" },
      { status: 400 }
    );
  }

  // Confirm the job exists and is active
  const { data: job, error: jobErr } = await client
    .from("job_postings")
    .select("id, slug, title, department, location, employment_type, status")
    .eq("id", data.jobId)
    .maybeSingle();
  if (jobErr || !job || job.status !== "active") {
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

  const { data: inserted, error: insertErr } = await client
    .from("job_applications")
    .insert({
      job_id: job.id,
      full_name: data.fullName,
      email: data.email,
      phone: data.phone || null,
      linkedin_url: data.linkedin || null,
      cover_letter: data.coverLetter || null,
      resume_path: path,
      resume_filename: filename,
      resume_mime_type: resume.type || "application/octet-stream",
      resume_size_bytes: resume.size,
      ip,
      user_agent: userAgent,
    })
    .select("id")
    .single();
  if (insertErr || !inserted) {
    console.error("[careers/apply] insert failed", insertErr);
    // Best-effort cleanup of the uploaded file
    await client.storage.from(RESUME_BUCKET).remove([path]).catch(() => undefined);
    return NextResponse.json(
      { error: "Could not save application. Please try again." },
      { status: 500 }
    );
  }

  // Send notification email with the resume attached
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      const resend = new Resend(apiKey);
      const subject = `New application: ${job.title} — ${data.fullName}`;
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
            ${data.phone ? `<tr><td style="color:#777">Phone</td><td>${escapeHtml(data.phone)}</td></tr>` : ""}
            ${data.linkedin ? `<tr><td style="color:#777">LinkedIn</td><td><a href="${escapeHtml(data.linkedin)}">${escapeHtml(data.linkedin)}</a></td></tr>` : ""}
          </table>
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
        data.phone ? `Phone: ${data.phone}` : null,
        data.linkedin ? `LinkedIn: ${data.linkedin}` : null,
        data.coverLetter ? `\nCover note:\n${data.coverLetter}` : null,
        ``,
        `Resume is attached. View in admin: /admin/jobs/applications.`,
      ]
        .filter(Boolean)
        .join("\n");

      await resend.emails.send({
        from: NOTIFY_FROM,
        to: NOTIFY_TO,
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
