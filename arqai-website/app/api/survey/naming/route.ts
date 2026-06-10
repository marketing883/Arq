import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      respondent_name,
      respondent_email,
      q1, q2, q3, q4, q5, q6, q7,
    } = body;

    if (!respondent_name || typeof respondent_name !== "string" || !respondent_name.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    if (q5 !== undefined && q5 !== null) {
      const n = Number(q5);
      if (!Number.isInteger(n) || n < 1 || n > 5) {
        return NextResponse.json({ error: "q5 must be 1–5" }, { status: 400 });
      }
    }

    const client = getClient();
    if (!client) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    const { error } = await client.from("naming_survey_responses").insert({
      respondent_name: respondent_name.trim(),
      respondent_email: respondent_email?.trim() || null,
      q1: q1 || null,
      q2: q2 || null,
      q3: q3 || null,
      q4: q4 || null,
      q5: q5 ? Number(q5) : null,
      q6: Array.isArray(q6) ? q6 : [],
      q7: q7?.trim() || null,
      user_agent: request.headers.get("user-agent") || null,
    });

    if (error) {
      console.error("[survey/naming] insert error:", error);
      const hint =
        error.code === "42P01" || error.message?.includes("does not exist")
          ? "Survey database table has not been created. Please contact admin."
          : "Failed to save response. Please try again.";
      return NextResponse.json({ error: hint }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[survey/naming] unexpected error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
