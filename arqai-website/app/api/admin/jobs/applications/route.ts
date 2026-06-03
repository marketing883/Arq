import { NextRequest, NextResponse } from "next/server";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { getAdminSession } from "@/lib/auth/admin-auth";

let supabase: SupabaseClient | null = null;
function getClient() {
  if (supabase) return supabase;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  supabase = createClient(url, key);
  return supabase;
}

const LIST_COLUMNS =
  "id, job_id, full_name, email, phone, linkedin_url, status, notified_at, resume_filename, resume_size_bytes, created_at";
const JOB_COLUMNS = "title, slug, department, location";

type JobPosting = {
  title: string | null;
  slug: string | null;
  department: string | null;
  location: string | null;
};

export async function GET(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const client = getClient();
  if (!client) {
    // Don't masquerade a misconfiguration as "no applications" -- that makes
    // a missing service-role key look identical to an empty table.
    console.error(
      "[admin/applications] Supabase client unavailable: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set in this runtime"
    );
    return NextResponse.json(
      { error: "Applications backend is not configured (missing Supabase service role key)." },
      { status: 500 }
    );
  }

  const url = new URL(request.url);
  const jobId = url.searchParams.get("jobId");
  const status = url.searchParams.get("status");

  // Preferred path: a single query with the embedded job_postings relationship.
  let query = client
    .from("job_applications")
    .select(`${LIST_COLUMNS}, job_postings:job_id (${JOB_COLUMNS})`)
    .order("created_at", { ascending: false })
    .limit(500);
  if (jobId) query = query.eq("job_id", jobId);
  if (status) query = query.eq("status", status);

  const { data, error } = await query;
  if (!error) {
    return NextResponse.json({ applications: data ?? [] });
  }

  // Fallback: some installs have a job_applications table that predates the
  // foreign key to job_postings, so PostgREST can't resolve the embedded join
  // and the query above errors. Rather than hide every application behind that
  // error, fetch the rows plainly and stitch in the job details in code.
  console.warn(
    "[admin/applications] embedded join failed, falling back to manual merge",
    error.message
  );

  let plain = client
    .from("job_applications")
    .select(LIST_COLUMNS)
    .order("created_at", { ascending: false })
    .limit(500);
  if (jobId) plain = plain.eq("job_id", jobId);
  if (status) plain = plain.eq("status", status);

  const { data: rows, error: rowsError } = await plain;
  if (rowsError) {
    console.error("[admin/applications] list error", rowsError);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }

  const applications = rows ?? [];
  const jobIds = Array.from(
    new Set(applications.map((row) => row.job_id).filter(Boolean))
  );

  const jobsById = new Map<string, JobPosting>();
  if (jobIds.length > 0) {
    const { data: jobs } = await client
      .from("job_postings")
      .select(`id, ${JOB_COLUMNS}`)
      .in("id", jobIds);
    for (const job of jobs ?? []) {
      jobsById.set(job.id, {
        title: job.title,
        slug: job.slug,
        department: job.department,
        location: job.location,
      });
    }
  }

  const merged = applications.map((row) => ({
    ...row,
    job_postings: jobsById.get(row.job_id) ?? null,
  }));

  return NextResponse.json({ applications: merged });
}
