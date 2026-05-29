import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Force dynamic rendering - always fetch fresh data
export const dynamic = "force-dynamic";
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
      return NextResponse.json({ posts: [] });
    }

    const { data, error } = await supabase
      .from("blog_posts")
      .select("id, title, slug, excerpt, featured_image, category, published_at")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(6);

    if (error) {
      console.error("Error fetching published blogs:", error);
      return NextResponse.json({ posts: [] });
    }

    return NextResponse.json({ posts: data || [] });
  } catch (error) {
    console.error("Error in published blog API:", error);
    return NextResponse.json({ posts: [] });
  }
}
