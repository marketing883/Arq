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
      return NextResponse.json({ caseStudies: [] });
    }

    const { data, error } = await supabase
      .from("case_studies")
      .select("id, title, slug, client_name, industry, hero_image, overview, impact_summary, metrics, published_at")
      .eq("status", "published")
      .order("published_at", { ascending: false });

    if (error) {
      console.error("Error fetching case studies:", error);
      return NextResponse.json({ caseStudies: [] });
    }

    return NextResponse.json({ caseStudies: data || [] });
  } catch (error) {
    console.error("Error in case studies list API:", error);
    return NextResponse.json({ caseStudies: [] });
  }
}
