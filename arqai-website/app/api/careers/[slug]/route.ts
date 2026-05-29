import { NextResponse } from "next/server";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { PUBLIC_JOB_STATUSES } from "@/lib/careers/job-postings";

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

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const client = getClient();
  if (!client) {
    return NextResponse.json(
      { error: "Not configured" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }

  const { data, error } = await client
    .from("job_postings")
    .select("*")
    .eq("slug", slug)
    .in("status", PUBLIC_JOB_STATUSES)
    .maybeSingle();

  if (error) {
    console.error("[careers] detail error", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
  if (!data) {
    return NextResponse.json(
      { error: "Not found" },
      { status: 404, headers: { "Cache-Control": "no-store" } }
    );
  }
  return NextResponse.json({ job: data }, { headers: { "Cache-Control": "no-store" } });
}
