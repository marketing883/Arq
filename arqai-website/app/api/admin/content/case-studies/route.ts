import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseServiceKey) return null;
  return createClient(supabaseUrl, supabaseServiceKey);
}

export async function GET() {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json({ items: [] });
    }

    const { data, error } = await supabase
      .from("case_studies")
      .select("id, title, slug, status, industry, company_name, published_at, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching case studies:", error);
      return NextResponse.json({ items: [] });
    }

    return NextResponse.json({ items: data || [] });
  } catch (error) {
    console.error("Error in case studies API:", error);
    return NextResponse.json({ error: "Failed to fetch case studies" }, { status: 500 });
  }
}
