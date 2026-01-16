import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

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
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching case studies:", error);
      return NextResponse.json({ items: [], error: error.message });
    }

    return NextResponse.json({ items: data || [] });
  } catch (error) {
    console.error("Error in case studies API:", error);
    return NextResponse.json({ items: [], error: "Failed to fetch case studies" });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = getSupabase();

    if (!supabase) {
      return NextResponse.json({
        error: "Database not configured"
      }, { status: 500 });
    }

    if (!body.title || !body.slug || !body.client_name) {
      return NextResponse.json({
        error: "Title, slug, and client name are required"
      }, { status: 400 });
    }

    // Sanitize slug to ensure URL-safe
    const sanitizedSlug = generateSlug(body.slug || body.title);

    const caseStudyData = {
      title: body.title,
      slug: sanitizedSlug,
      client_name: body.client_name,
      industry: body.industry || null,
      hero_image: body.hero_image || null,
      overview: body.overview || null,
      challenge_description: body.challenge_description || null,
      challenge_points: body.challenge_points || [],
      solution_description: body.solution_description || null,
      solution_points: body.solution_points || [],
      metrics: body.metrics || [],
      impact_summary: body.impact_summary || null,
      testimonial_quote: body.testimonial_quote || null,
      testimonial_author_name: body.testimonial_author_name || null,
      testimonial_author_title: body.testimonial_author_title || null,
      testimonial_author_company: body.testimonial_author_company || null,
      testimonial_author_photo: body.testimonial_author_photo || null,
      status: body.status || "draft",
      featured: body.featured || false,
      published_at: body.status === "published" ? new Date().toISOString() : null,
    };

    const { data, error } = await supabase
      .from("case_studies")
      .insert(caseStudyData)
      .select()
      .single();

    if (error) {
      console.error("Error creating case study:", error);
      if (error.code === "23505") {
        return NextResponse.json({
          error: "A case study with this slug already exists."
        }, { status: 400 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ item: data, success: true });
  } catch (error) {
    console.error("Error in case study POST:", error);
    return NextResponse.json({
      error: "Failed to create case study"
    }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  console.log("=== PUT case study request received ===");
  try {
    const body = await request.json();
    const supabase = getSupabase();

    console.log("PUT case study - ID:", body.id);
    console.log("PUT case study - received slug:", body.slug);
    console.log("PUT case study - received title:", body.title);

    if (!supabase) {
      console.log("PUT case study - ERROR: Database not configured");
      return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    if (!body.id) {
      console.log("PUT case study - ERROR: No ID provided");
      return NextResponse.json({ error: "Case study ID is required" }, { status: 400 });
    }

    // Sanitize slug to ensure URL-safe
    const sanitizedSlug = generateSlug(body.slug || body.title);
    console.log("PUT case study - sanitized slug:", sanitizedSlug);

    const updateData = {
      title: body.title,
      slug: sanitizedSlug,
      client_name: body.client_name,
      industry: body.industry || null,
      hero_image: body.hero_image || null,
      overview: body.overview || null,
      challenge_description: body.challenge_description || null,
      challenge_points: body.challenge_points || [],
      solution_description: body.solution_description || null,
      solution_points: body.solution_points || [],
      metrics: body.metrics || [],
      impact_summary: body.impact_summary || null,
      testimonial_quote: body.testimonial_quote || null,
      testimonial_author_name: body.testimonial_author_name || null,
      testimonial_author_title: body.testimonial_author_title || null,
      testimonial_author_company: body.testimonial_author_company || null,
      testimonial_author_photo: body.testimonial_author_photo || null,
      status: body.status || "draft",
      featured: body.featured || false,
      published_at: body.status === "published" && !body.published_at
        ? new Date().toISOString()
        : body.published_at,
    };

    console.log("PUT case study - calling Supabase update...");
    const { data, error } = await supabase
      .from("case_studies")
      .update(updateData)
      .eq("id", body.id)
      .select()
      .single();

    if (error) {
      console.error("PUT case study - Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log("PUT case study - SUCCESS! Updated slug:", data?.slug);
    return NextResponse.json({ item: data, success: true });
  } catch (error) {
    console.error("PUT case study - Exception:", error);
    return NextResponse.json({ error: "Failed to update case study" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const supabase = getSupabase();

    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    if (!id) {
      return NextResponse.json({ error: "Case study ID is required" }, { status: 400 });
    }

    const { error } = await supabase
      .from("case_studies")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting case study:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in case study DELETE:", error);
    return NextResponse.json({ error: "Failed to delete case study" }, { status: 500 });
  }
}
