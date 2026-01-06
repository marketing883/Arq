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
      return NextResponse.json({ whitepaper: null });
    }

    // Get the most recently published whitepaper
    const { data, error } = await supabase
      .from("whitepapers")
      .select("id, title, slug, description, cover_image, file_url, category, topics, page_count")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      return NextResponse.json({ whitepaper: null });
    }

    return NextResponse.json({
      whitepaper: {
        id: data.id,
        title: data.title,
        description: data.description,
        cover_image: data.cover_image,
        file_url: data.file_url,
        topics: data.topics,
        page_count: data.page_count,
      }
    });
  } catch (error) {
    console.error("Error in featured whitepaper API:", error);
    return NextResponse.json({ whitepaper: null });
  }
}
