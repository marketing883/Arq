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
      .from("blog_posts")
      .select("id, title, slug, status, category, published_at, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching blog posts:", error);
      return NextResponse.json({ items: [] });
    }

    return NextResponse.json({ items: data || [] });
  } catch (error) {
    console.error("Error in blog API:", error);
    return NextResponse.json({ error: "Failed to fetch blog posts" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    const { data, error } = await supabase
      .from("blog_posts")
      .insert(body)
      .select()
      .single();

    if (error) {
      console.error("Error creating blog post:", error);
      return NextResponse.json({ error: "Failed to create blog post" }, { status: 500 });
    }

    return NextResponse.json({ item: data });
  } catch (error) {
    console.error("Error in blog POST:", error);
    return NextResponse.json({ error: "Failed to create blog post" }, { status: 500 });
  }
}
