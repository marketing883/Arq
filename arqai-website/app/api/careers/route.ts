import { NextRequest, NextResponse } from "next/server";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { getMissingSchemaColumn, PUBLIC_JOB_STATUSES } from "@/lib/careers/job-postings";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
  const client = getClient();
  if (!client) {
    return NextResponse.json({ jobs: [] }, { headers: { "Cache-Control": "no-store" } });
  }

  const url = new URL(request.url);
  const department = url.searchParams.get("department");
  const location = url.searchParams.get("location");
  const employmentType = url.searchParams.get("type");
  const remote = url.searchParams.get("remote");

  let query = client
    .from("job_postings")
    .select(
      "id, slug, title, department, location, employment_type, short_description, experience_level, remote, published_at, created_at"
    )
    .in("status", PUBLIC_JOB_STATUSES)
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (department) query = query.eq("department", department);
  if (location) query = query.eq("location", location);
  if (employmentType) query = query.eq("employment_type", employmentType);
  if (remote === "true") query = query.eq("remote", true);

  const { data, error } = await query;
  if (error) {
    const missingColumn = getMissingSchemaColumn(error);
    if (missingColumn === "experience_level") {
      let fallbackQuery = client
        .from("job_postings")
        .select(
          "id, slug, title, department, location, employment_type, short_description, remote, published_at, created_at"
        )
        .in("status", PUBLIC_JOB_STATUSES)
        .order("published_at", { ascending: false, nullsFirst: false })
        .order("created_at", { ascending: false });

      if (department) fallbackQuery = fallbackQuery.eq("department", department);
      if (location) fallbackQuery = fallbackQuery.eq("location", location);
      if (employmentType) fallbackQuery = fallbackQuery.eq("employment_type", employmentType);
      if (remote === "true") fallbackQuery = fallbackQuery.eq("remote", true);

      const { data: fallbackData, error: fallbackError } = await fallbackQuery;
      if (!fallbackError) {
        return NextResponse.json({
          jobs: (fallbackData ?? []).map((job) => ({ ...job, experience_level: null })),
        }, { headers: { "Cache-Control": "no-store" } });
      }
    }
    console.error("[careers] list error", error);
    return NextResponse.json({ jobs: [] }, { headers: { "Cache-Control": "no-store" } });
  }
  return NextResponse.json({ jobs: data ?? [] }, { headers: { "Cache-Control": "no-store" } });
}
