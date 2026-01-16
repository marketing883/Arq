import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Disable Next.js route caching to ensure fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
      .select("id, title, slug, client_name, industry, overview, solution_description, impact_summary, metrics, hero_image")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(4);

    if (error) {
      console.error("Error fetching featured case studies:", error);
      return NextResponse.json({ caseStudies: [] });
    }

    // Helper to truncate text to a max length with ellipsis
    const truncateText = (text: string | null, maxLength: number = 200): string => {
      if (!text) return "";
      if (text.length <= maxLength) return text;
      // Find the last space before maxLength to avoid cutting words
      const truncated = text.substring(0, maxLength);
      const lastSpace = truncated.lastIndexOf(" ");
      return (lastSpace > 0 ? truncated.substring(0, lastSpace) : truncated) + "...";
    };

    // Map database fields to component expected fields
    // Use overview (brief summary) instead of full challenge_description
    const caseStudies = (data || []).map(study => ({
      id: study.id,
      slug: study.slug,
      title: study.title,
      client_name: study.client_name,
      industry: study.industry,
      // Use overview as the excerpt, or truncate solution_description if no overview
      challenge_summary: truncateText(study.overview || study.solution_description, 250),
      results_summary: truncateText(study.impact_summary, 150),
      key_metrics: study.metrics,
      image: study.hero_image,
    }));

    return NextResponse.json({ caseStudies });
  } catch (error) {
    console.error("Error in featured case studies API:", error);
    return NextResponse.json({ caseStudies: [] });
  }
}
