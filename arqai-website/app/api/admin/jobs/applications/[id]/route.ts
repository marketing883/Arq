import { NextRequest, NextResponse } from "next/server";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";
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

const patchSchema = z.object({
  status: z
    .enum(["new", "reviewing", "interviewed", "offered", "hired", "rejected", "withdrawn"])
    .optional(),
  notes: z.string().max(20000).optional().nullable(),
});

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const client = getClient();
  if (!client) return NextResponse.json({ error: "Server not configured" }, { status: 500 });

  const { data, error } = await client
    .from("job_applications")
    .select(
      "*, job_postings:job_id (title, slug, department, location, employment_type)"
    )
    .eq("id", id)
    .maybeSingle();
  if (error) return NextResponse.json({ error: "Server error" }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ application: data });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const client = getClient();
  if (!client) return NextResponse.json({ error: "Server not configured" }, { status: 500 });

  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { data, error } = await client
    .from("job_applications")
    .update(parsed.data)
    .eq("id", id)
    .select("*")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ application: data });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const client = getClient();
  if (!client) return NextResponse.json({ error: "Server not configured" }, { status: 500 });

  // Fetch resume path so we can drop the file from storage too
  const { data: app } = await client
    .from("job_applications")
    .select("resume_path")
    .eq("id", id)
    .maybeSingle();

  const { error } = await client.from("job_applications").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (app?.resume_path) {
    await client.storage.from("resumes").remove([app.resume_path]).catch(() => undefined);
  }

  return NextResponse.json({ ok: true });
}
