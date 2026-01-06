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
      return NextResponse.json({ whitepaper: null });
    }

    // Try to get a published whitepaper first
    let { data, error } = await supabase
      .from("whitepapers")
      .select("id, title, slug, description, cover_image, file_url, category, topics, page_count")
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    // If no published whitepaper, try to get any whitepaper (for development)
    if (!data && process.env.NODE_ENV !== "production") {
      const result = await supabase
        .from("whitepapers")
        .select("id, title, slug, description, cover_image, file_url, category, topics, page_count")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      data = result.data;
      error = result.error;
    }

    if (error || !data) {
      console.log("No whitepaper found:", error?.message || "No data");
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
