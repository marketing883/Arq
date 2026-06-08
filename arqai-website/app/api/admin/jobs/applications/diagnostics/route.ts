import { NextResponse } from "next/server";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { getAdminSession } from "@/lib/auth/admin-auth";
import { getMissingSchemaColumn } from "@/lib/careers/job-postings";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Columns the apply route writes that must exist for an insert to succeed.
const REQUIRED_INSERT_COLUMNS = [
  "job_id",
  "full_name",
  "email",
  "phone",
  "resume_path",
  "resume_filename",
  "resume_mime_type",
  "resume_size_bytes",
] as const;

let supabase: SupabaseClient | null = null;
function getClient() {
  if (supabase) return supabase;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  supabase = createClient(url, key);
  return supabase;
}

/**
 * Read-only health check for the careers application pipeline. Answers the
 * recurring "candidates apply but nothing shows in admin" question with a
 * precise cause instead of guesswork:
 *   - are the Supabase env vars present in this runtime?
 *   - does job_applications exist and how many rows are in it?
 *   - can we read the rows the admin list depends on (incl. the job join)?
 *   - is the table missing any column the insert requires?
 *   - does the `resumes` storage bucket the upload step needs exist?
 *
 * Visit /api/admin/jobs/applications/diagnostics while logged into admin.
 */
export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const report: Record<string, unknown> = {
    checkedAt: new Date().toISOString(),
  };

  // 1. Runtime configuration
  const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
  const hasServiceKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
  const hasResend = !!process.env.RESEND_API_KEY;
  report.config = {
    NEXT_PUBLIC_SUPABASE_URL: hasUrl ? "set" : "MISSING",
    SUPABASE_SERVICE_ROLE_KEY: hasServiceKey ? "set" : "MISSING",
    RESEND_API_KEY: hasResend ? "set" : "missing (notification emails disabled)",
    supabaseProjectHost: hasUrl
      ? (() => {
          try {
            return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!).host;
          } catch {
            return "unparseable";
          }
        })()
      : null,
  };

  const client = getClient();
  if (!client) {
    report.ok = false;
    report.verdict =
      "Supabase is not configured in this runtime. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY, then redeploy. Until then, the apply route returns 500 and nothing is saved.";
    return NextResponse.json(report, { status: 200 });
  }

  // 2. Row count (does the table exist and how many applications are stored?)
  const { count, error: countError } = await client
    .from("job_applications")
    .select("id", { count: "exact", head: true });
  report.rowCount = {
    value: countError ? null : count ?? 0,
    error: countError ? countError.message : null,
  };

  // 3. The exact query the admin list uses, with the embedded job join.
  const { data: joinSample, error: joinError } = await client
    .from("job_applications")
    .select(
      "id, full_name, email, job_id, status, created_at, resume_filename, job_postings:job_id (title, slug)"
    )
    .order("created_at", { ascending: false })
    .limit(5);
  report.adminListQuery = {
    ok: !joinError,
    error: joinError ? joinError.message : null,
    returned: joinSample?.length ?? 0,
    sample: (joinSample ?? []).map((r) => ({
      id: r.id,
      full_name: r.full_name,
      job: (r.job_postings as { title?: string } | null)?.title ?? null,
      status: r.status,
      created_at: r.created_at,
    })),
  };

  // 4. Schema probe: confirm every column the insert requires is present.
  const missingColumns: string[] = [];
  for (const col of REQUIRED_INSERT_COLUMNS) {
    const { error } = await client
      .from("job_applications")
      .select(col, { head: true })
      .limit(1);
    if (error) {
      const missing = getMissingSchemaColumn(error);
      // Only flag genuine "column does not exist" style errors.
      if (missing === col || /does not exist|could not find/i.test(error.message)) {
        missingColumns.push(col);
      }
    }
  }
  report.requiredColumns = {
    allPresent: missingColumns.length === 0,
    missing: missingColumns,
  };

  // 5. Storage bucket the resume upload depends on.
  const { data: bucket, error: bucketError } = await client.storage.getBucket("resumes");
  report.resumesBucket = {
    exists: !!bucket && !bucketError,
    error: bucketError ? bucketError.message : null,
  };

  // 6. Verdict
  const problems: string[] = [];
  if (report.rowCount && (report.rowCount as { error: string | null }).error) {
    problems.push("Cannot read the job_applications table (it may not exist or RLS/service-role is misconfigured).");
  }
  if (missingColumns.length > 0) {
    problems.push(
      `job_applications is missing required column(s): ${missingColumns.join(", ")}. Run supabase-careers-applications-repair.sql in Supabase.`
    );
  }
  if (!(report.resumesBucket as { exists: boolean }).exists) {
    problems.push(
      "The 'resumes' storage bucket is missing. Resume upload fails before insert, so no application is saved. Create a private bucket named 'resumes' in Supabase Storage."
    );
  }
  if (!joinError && (joinSample?.length ?? 0) === 0 && (count ?? 0) === 0 && missingColumns.length === 0) {
    problems.push(
      "Schema and bucket look healthy but there are zero applications. Likely causes: nothing has been submitted since the last fix, the honeypot is silently dropping submissions, or the deployed app points at a different Supabase project than expected. Submit one end-to-end test application and re-run this check."
    );
  }

  report.ok = problems.length === 0;
  report.verdict = problems.length === 0
    ? `Pipeline healthy. ${count ?? 0} application(s) stored and readable by the admin list.`
    : problems;

  return NextResponse.json(report, { status: 200 });
}
