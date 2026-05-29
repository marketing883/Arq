import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Force dynamic rendering - no caching
export const dynamic = "force-dynamic";
export const revalidate = 0;

function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseServiceKey);
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = getSupabase();

    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching blog post:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log("[Blog GET by ID] Returning item:", {
      id: data.id,
      title: data.title,
      featured_image: data.featured_image,
      meta_title: data.meta_title,
      meta_description: data.meta_description,
      published_at: data.published_at,
    });
    return NextResponse.json({ item: data });
  } catch (error) {
    console.error("Error in blog GET by ID:", error);
    return NextResponse.json({ error: "Failed to fetch blog post" }, { status: 500 });
  }
}
