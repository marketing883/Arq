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
      return NextResponse.json({ whitepapers: [] });
    }

    const { data, error } = await supabase
      .from("whitepapers")
      .select("id, title, slug, description, cover_image, file_url, category, gated, published_at")
      .eq("status", "published")
      .order("published_at", { ascending: false });

    if (error) {
      console.error("Error fetching whitepapers:", error);
      return NextResponse.json({ whitepapers: [] });
    }

    return NextResponse.json({ whitepapers: data || [] });
  } catch (error) {
    console.error("Error in whitepapers list API:", error);
    return NextResponse.json({ whitepapers: [] });
  }
}
