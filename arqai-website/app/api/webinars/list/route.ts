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
      return NextResponse.json({ webinars: [] });
    }

    const { data, error } = await supabase
      .from("webinars")
      .select("id, title, slug, description, banner_image, webinar_date, duration, timezone, presenters, status, recording_url")
      .in("status", ["upcoming", "live", "on-demand"])
      .order("webinar_date", { ascending: false });

    if (error) {
      console.error("Error fetching webinars:", error);
      return NextResponse.json({ webinars: [] });
    }

    return NextResponse.json({ webinars: data || [] });
  } catch (error) {
    console.error("Error in webinars list API:", error);
    return NextResponse.json({ webinars: [] });
  }
}
