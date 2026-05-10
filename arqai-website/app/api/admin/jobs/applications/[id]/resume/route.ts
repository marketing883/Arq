import { NextResponse } from "next/server";
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

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const client = getClient();
  if (!client) return NextResponse.json({ error: "Server not configured" }, { status: 500 });

  const { data: app, error } = await client
    .from("job_applications")
    .select("resume_path, resume_filename")
    .eq("id", id)
    .maybeSingle();
  if (error || !app) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { data: signed, error: signErr } = await client.storage
    .from("resumes")
    .createSignedUrl(app.resume_path, 60 * 5, {
      download: app.resume_filename || "resume",
    });
  if (signErr || !signed?.signedUrl) {
    return NextResponse.json({ error: "Could not sign resume URL" }, { status: 500 });
  }

  return NextResponse.json({ url: signed.signedUrl, filename: app.resume_filename });
}
