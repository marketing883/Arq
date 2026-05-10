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

export async function GET(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const client = getClient();
  if (!client) return NextResponse.json({ applications: [] });

  const url = new URL(request.url);
  const jobId = url.searchParams.get("jobId");
  const status = url.searchParams.get("status");

  let query = client
    .from("job_applications")
    .select(
      "id, job_id, full_name, email, phone, linkedin_url, status, notified_at, resume_filename, resume_size_bytes, created_at, job_postings:job_id (title, slug, department, location)"
    )
    .order("created_at", { ascending: false })
    .limit(500);
  if (jobId) query = query.eq("job_id", jobId);
  if (status) query = query.eq("status", status);

  const { data, error } = await query;
  if (error) {
    console.error("[admin/applications] list error", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
  return NextResponse.json({ applications: data ?? [] });
}
