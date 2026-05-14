import { NextRequest, NextResponse } from "next/server";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";
import { getAdminSession } from "@/lib/auth/admin-auth";
import {
  executeJobPostingMutationWithSchemaFallback,
  getMissingSchemaColumn,
  jobPostingSchemaDriftMessage,
  pruneEmptyOptionalJobPostingFields,
} from "@/lib/careers/job-postings";

let supabase: SupabaseClient | null = null;
function getClient() {
  if (supabase) return supabase;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  supabase = createClient(url, key);
  return supabase;
}

const jobSchema = z.object({
  slug: z
    .string()
    .min(2)
    .max(120)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, hyphens"),
  title: z.string().min(2).max(200),
  department: z.string().min(2).max(80),
  location: z.string().min(2).max(120),
  employment_type: z.enum(["full-time", "part-time", "contract", "internship", "temporary"]),
  short_description: z.string().max(280).optional().nullable(),
  description: z.string().max(20000).optional().nullable(),
  requirements: z.string().max(20000).optional().nullable(),
  responsibilities: z.string().max(20000).optional().nullable(),
  salary_range: z.string().max(80).optional().nullable(),
  experience_level: z
    .enum(["entry", "mid", "senior", "lead", "principal"])
    .optional()
    .nullable(),
  remote: z.boolean().optional(),
  status: z.enum(["draft", "active", "closed"]).default("draft"),
});

async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) return null;
  return session;
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const client = getClient();
  if (!client) return NextResponse.json({ jobs: [] });
  const { data, error } = await client
    .from("job_postings")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("[admin/jobs] list error", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
  return NextResponse.json({ jobs: data ?? [] });
}

export async function POST(request: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const client = getClient();
  if (!client) return NextResponse.json({ error: "Server not configured" }, { status: 500 });

  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const parsed = jobSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const payload = parsed.data;
  const published_at = payload.status === "active" ? new Date().toISOString() : null;
  const insertPayload = pruneEmptyOptionalJobPostingFields({ ...payload, published_at });

  const { data, error, omittedColumns } = await executeJobPostingMutationWithSchemaFallback(
    insertPayload,
    (nextPayload) =>
      client.from("job_postings").insert(nextPayload).select("*").single()
  );
  if (error) {
    console.error("[admin/jobs] insert error", error);
    const missingColumn = getMissingSchemaColumn(error);
    return NextResponse.json(
      {
        error: missingColumn
          ? jobPostingSchemaDriftMessage(missingColumn)
          : error.message || "Could not create job posting",
      },
      { status: 500 }
    );
  }
  if (omittedColumns.length > 0) {
    console.warn("[admin/jobs] created job after omitting missing optional columns", {
      omittedColumns,
    });
  }
  return NextResponse.json({ job: data });
}
