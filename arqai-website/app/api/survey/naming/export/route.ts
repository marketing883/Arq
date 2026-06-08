import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { RESULTS_KEY, optionLabel } from "@/app/survey/naming/questions";

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

function esc(v: string | null | undefined): string {
  if (v === null || v === undefined) return "";
  const s = String(v);
  if (s.includes(",") || s.includes('"') || s.includes("\n") || s.includes("\r")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");
  if (key !== RESULTS_KEY) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const client = getClient();
  if (!client) {
    return new NextResponse("Database not configured", { status: 500 });
  }

  const { data, error } = await client
    .from("naming_survey_responses")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[survey/naming/export] fetch error:", error);
    return new NextResponse("Failed to fetch data", { status: 500 });
  }

  const rows = data ?? [];

  const header = [
    "Name",
    "Email",
    "Q1 – Lead with in cold intro",
    "Q2 – Old vs new names for cold prospect",
    "Q3 – Champion internally",
    "Q4 – Where name matters most",
    "Q5 – Confidence (1–5)",
    "Q6 – What would help most (multi)",
    "Q7 – Open feedback",
    "Submitted At",
  ].join(",");

  const csvRows = rows.map((r) => {
    const q6Labels = Array.isArray(r.q6)
      ? r.q6.map((v: string) => optionLabel("q6", v)).join("; ")
      : "";
    return [
      esc(r.respondent_name),
      esc(r.respondent_email),
      esc(optionLabel("q1", r.q1)),
      esc(optionLabel("q2", r.q2)),
      esc(optionLabel("q3", r.q3)),
      esc(optionLabel("q4", r.q4)),
      esc(r.q5 !== null && r.q5 !== undefined ? String(r.q5) : ""),
      esc(q6Labels),
      esc(r.q7),
      esc(r.created_at ? new Date(r.created_at).toLocaleString("en-US") : ""),
    ].join(",");
  });

  const csv = [header, ...csvRows].join("\n");
  const date = new Date().toISOString().split("T")[0];

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="naming-survey-${date}.csv"`,
    },
  });
}
