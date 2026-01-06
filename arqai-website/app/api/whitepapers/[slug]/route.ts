import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) return null;
  return createClient(supabaseUrl, supabaseKey);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const supabase = getSupabase();

    if (!supabase) {
      return NextResponse.json({ whitepaper: null }, { status: 404 });
    }

    const { data, error } = await supabase
      .from("whitepapers")
      .select("id, title, slug, description, content, cover_image, file_url, category, gated, published_at")
      .eq("slug", slug)
      .eq("status", "published")
      .single();

    if (error || !data) {
      return NextResponse.json({ whitepaper: null }, { status: 404 });
    }

    return NextResponse.json({ whitepaper: data });
  } catch (error) {
    console.error("Error fetching whitepaper:", error);
    return NextResponse.json({ whitepaper: null }, { status: 500 });
  }
}
