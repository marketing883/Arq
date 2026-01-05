import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) return null;
  return createClient(supabaseUrl, supabaseKey);
}

export async function GET() {
  try {
    const supabase = getSupabase();

    if (!supabase) {
      return NextResponse.json({ caseStudies: [] });
    }

    // Get the most recently published case studies
    const { data, error } = await supabase
      .from("case_studies")
      .select("id, title, slug, client_name, industry, challenge_description, impact_summary, metrics")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(4);

    if (error) {
      console.error("Error fetching featured case studies:", error);
      return NextResponse.json({ caseStudies: [] });
    }

    // Map database fields to component expected fields
    const caseStudies = (data || []).map(study => ({
      id: study.id,
      slug: study.slug,
      title: study.title,
      client_name: study.client_name,
      industry: study.industry,
      challenge_summary: study.challenge_description,
      results_summary: study.impact_summary,
      key_metrics: study.metrics,
    }));

    return NextResponse.json({ caseStudies });
  } catch (error) {
    console.error("Error in featured case studies API:", error);
    return NextResponse.json({ caseStudies: [] });
  }
}
