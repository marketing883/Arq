import { NextRequest, NextResponse } from "next/server";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { getMissingSchemaColumn } from "@/lib/careers/job-postings";

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
    return NextResponse.json({ jobs: [] });
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
    .eq("status", "active")
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
        .eq("status", "active")
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
        });
      }
    }
    console.error("[careers] list error", error);
    return NextResponse.json({ jobs: [] });
  }
  return NextResponse.json({ jobs: data ?? [] });
}
