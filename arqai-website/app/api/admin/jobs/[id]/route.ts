import { NextRequest, NextResponse } from "next/server";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";
import { getAdminSession } from "@/lib/auth/admin-auth";
import {
  executeJobPostingMutationWithSchemaFallback,
  getCheckConstraint,
  getMissingSchemaColumn,
  jobPostingConstraintMessage,
  jobPostingSchemaDriftMessage,
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

const patchSchema = z.object({
  slug: z
    .string()
    .min(2)
    .max(120)
    .regex(/^[a-z0-9-]+$/)
    .optional(),
  title: z.string().min(2).max(200).optional(),
  department: z.string().min(2).max(80).optional(),
  location: z.string().min(2).max(120).optional(),
  employment_type: z
    .enum(["full-time", "part-time", "contract", "internship", "temporary"])
    .optional(),
  short_description: z.string().max(280).optional().nullable(),
  description: z.string().max(20000).optional().nullable(),
  requirements: z.string().max(20000).optional().nullable(),
  responsibilities: z.string().max(20000).optional().nullable(),
  salary_range: z.string().max(80).optional().nullable(),
  experience_level: z
    .enum(["entry", "mid", "senior", "lead", "principal"])
    .optional()
    .nullable(),
  notification_email: z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? null : v),
    z
      .string()
      .email("Notification email must be a valid email address")
      .max(200)
      .nullable()
      .optional()
  ),
  remote: z.boolean().optional(),
  status: z.enum(["draft", "active", "closed"]).optional(),
});

async function requireAdmin() {
  const session = await getAdminSession();
  return !!session;
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const client = getClient();
  if (!client) return NextResponse.json({ error: "Server not configured" }, { status: 500 });
  const { data, error } = await client
    .from("job_postings")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) return NextResponse.json({ error: "Server error" }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ job: data });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const client = getClient();
  if (!client) return NextResponse.json({ error: "Server not configured" }, { status: 500 });

  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const updates: Record<string, unknown> = { ...parsed.data };
  if (parsed.data.status === "active") {
    // Stamp published_at the first time the job goes active
    const { data: existing } = await client
      .from("job_postings")
      .select("published_at")
      .eq("id", id)
      .maybeSingle();
    if (existing && !existing.published_at) {
      updates.published_at = new Date().toISOString();
    }
  }

  const { data, error, omittedColumns } = await executeJobPostingMutationWithSchemaFallback(
    updates,
    (nextUpdates) =>
      client.from("job_postings").update(nextUpdates).eq("id", id).select("*").single()
  );
  if (error) {
    console.error("[admin/jobs/:id] update error", error);
    const missingColumn = getMissingSchemaColumn(error);
    const constraint = getCheckConstraint(error);
    const constraintMessage = jobPostingConstraintMessage(constraint);
    return NextResponse.json(
      {
        error: missingColumn
          ? jobPostingSchemaDriftMessage(missingColumn)
          : constraintMessage
            ? constraintMessage
          : error.message || "Could not update job posting",
      },
      { status: 500 }
    );
  }
  if (omittedColumns.length > 0) {
    console.warn("[admin/jobs/:id] updated job after omitting missing optional columns", {
      omittedColumns,
    });
  }
  return NextResponse.json({ job: data });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const client = getClient();
  if (!client) return NextResponse.json({ error: "Server not configured" }, { status: 500 });

  const { data: applications, error: applicationsFetchError } = await client
    .from("job_applications")
    .select("id, resume_path")
    .eq("job_id", id);
  if (applicationsFetchError && applicationsFetchError.code !== "42P01") {
    console.error("[admin/jobs/:id] applications fetch error", applicationsFetchError);
    return NextResponse.json(
      { error: "Could not inspect applications for this job opening" },
      { status: 500 }
    );
  }

  if (applications?.length) {
    const { error: applicationsDeleteError } = await client
      .from("job_applications")
      .delete()
      .eq("job_id", id);
    if (applicationsDeleteError) {
      console.error("[admin/jobs/:id] applications delete error", applicationsDeleteError);
      return NextResponse.json(
        { error: "Could not delete applications for this job opening" },
        { status: 500 }
      );
    }
  }

  const { error } = await client.from("job_postings").delete().eq("id", id);
  if (error) {
    console.error("[admin/jobs/:id] delete error", error);
    return NextResponse.json({ error: "Could not delete" }, { status: 500 });
  }

  const resumePaths = (applications ?? [])
    .map((application) => application.resume_path)
    .filter((path): path is string => typeof path === "string" && path.length > 0);
  if (resumePaths.length > 0) {
    await client.storage.from("resumes").remove(resumePaths).catch(() => undefined);
  }

  return NextResponse.json({ ok: true });
}
