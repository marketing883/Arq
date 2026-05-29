import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseServiceKey) return null;
  return createClient(supabaseUrl, supabaseServiceKey);
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const supabase = getSupabase();

    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    const { data, error } = await supabase
      .from("webinars")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) {
      console.error("Error fetching webinar:", error);
      return NextResponse.json({ error: "Webinar not found" }, { status: 404 });
    }

    return NextResponse.json({ webinar: data });
  } catch (error) {
    console.error("Error in webinar GET by slug:", error);
    return NextResponse.json({ error: "Failed to fetch webinar" }, { status: 500 });
  }
}
