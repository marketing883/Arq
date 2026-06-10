import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { RESULTS_KEY, QUESTIONS, optionLabel } from "@/app/survey/naming/questions";

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");
  if (key !== RESULTS_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const client = getClient();
  if (!client) {
    return NextResponse.json({ error: "Database not configured" }, { status: 500 });
  }

  const { data, error } = await client
    .from("naming_survey_responses")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[survey/naming/results] fetch error:", error);
    const hint =
      error.code === "42P01" || error.message?.includes("does not exist")
        ? "The naming_survey_responses table has not been created yet. Run supabase-naming-survey.sql in the Supabase SQL editor."
        : error.message || "Failed to fetch results";
    return NextResponse.json({ error: hint }, { status: 500 });
  }

  const rows = data ?? [];
  const total = rows.length;

  // Aggregate single-choice + scale questions (q1–q5)
  const tallies: Record<string, Record<string, number>> = {};
  for (const qid of ["q1", "q2", "q3", "q4", "q5"]) {
    tallies[qid] = {};
  }

  // Multi-choice q6
  const q6Tally: Record<string, number> = {};

  // Open text q7
  const comments: string[] = [];

  for (const row of rows) {
    for (const qid of ["q1", "q2", "q3", "q4"]) {
      const val = row[qid as keyof typeof row] as string | null;
      if (val) {
        tallies[qid][val] = (tallies[qid][val] || 0) + 1;
      }
    }
    if (row.q5 !== null && row.q5 !== undefined) {
      const v = String(row.q5);
      tallies["q5"][v] = (tallies["q5"][v] || 0) + 1;
    }
    if (Array.isArray(row.q6)) {
      for (const val of row.q6) {
        q6Tally[val] = (q6Tally[val] || 0) + 1;
      }
    }
    if (row.q7) {
      comments.push(row.q7);
    }
  }

  // Build structured breakdown with labels
  const breakdown: Record<string, { value: string; label: string; count: number; pct: number }[]> = {};
  for (const qid of ["q1", "q2", "q3", "q4", "q5"]) {
    const q = QUESTIONS.find((x) => x.id === qid);
    if (!q || q.type === "text") continue;
    const opts = q.options;
    breakdown[qid] = opts.map((opt) => {
      const count = tallies[qid][opt.value] || 0;
      return {
        value: opt.value,
        label: opt.label,
        count,
        pct: total > 0 ? Math.round((count / total) * 100) : 0,
      };
    });
  }

  // q6
  const q6q = QUESTIONS.find((x) => x.id === "q6");
  if (q6q && q6q.type !== "text") {
    breakdown["q6"] = q6q.options.map((opt) => {
      const count = q6Tally[opt.value] || 0;
      return {
        value: opt.value,
        label: opt.label,
        count,
        pct: total > 0 ? Math.round((count / total) * 100) : 0,
      };
    });
  }

  // q5 mean
  let q5Sum = 0;
  let q5Count = 0;
  for (const row of rows) {
    if (row.q5 !== null && row.q5 !== undefined) {
      q5Sum += Number(row.q5);
      q5Count++;
    }
  }
  const q5Mean = q5Count > 0 ? Math.round((q5Sum / q5Count) * 10) / 10 : null;

  return NextResponse.json({
    total,
    breakdown,
    q5Mean,
    comments,
    respondents: rows.map((r) => ({
      name: r.respondent_name,
      email: r.respondent_email,
      submitted_at: r.created_at,
    })),
  });
}
