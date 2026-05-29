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
      .from("webinars")
      .select("*")
      .order("webinar_date", { ascending: false });

    if (error) {
      console.error("Error fetching webinars:", error);
      return NextResponse.json({ items: [], error: error.message });
    }

    return NextResponse.json({ items: data || [] });
  } catch (error) {
    console.error("Error in webinars API:", error);
    return NextResponse.json({ items: [], error: "Failed to fetch webinars" });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = getSupabase();

    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    if (!body.title || !body.slug || !body.webinar_date) {
      return NextResponse.json({
        error: "Title, slug, and webinar date are required"
      }, { status: 400 });
    }

    const webinarData = {
      title: body.title,
      slug: body.slug,
      description: body.description || null,
      banner_image: body.banner_image || null,
      webinar_date: body.webinar_date,
      duration: body.duration || 60,
      timezone: body.timezone || "America/New_York",
      presenters: body.presenters || [],
      learning_points: body.learning_points || [],
      registration_url: body.registration_url || null,
      recording_url: body.recording_url || null,
      status: body.status || "upcoming",
      featured: body.featured || false,
      published_at: body.status !== "draft" ? new Date().toISOString() : null,
    };

    const { data, error } = await supabase
      .from("webinars")
      .insert(webinarData)
      .select()
      .single();

    if (error) {
      console.error("Error creating webinar:", error);
      if (error.code === "23505") {
        return NextResponse.json({
          error: "A webinar with this slug already exists."
        }, { status: 400 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ item: data, success: true });
  } catch (error) {
    console.error("Error in webinar POST:", error);
    return NextResponse.json({ error: "Failed to create webinar" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const supabase = getSupabase();

    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    if (!body.id) {
      return NextResponse.json({ error: "Webinar ID is required" }, { status: 400 });
    }

    const updateData = {
      title: body.title,
      slug: body.slug,
      description: body.description || null,
      banner_image: body.banner_image || null,
      webinar_date: body.webinar_date,
      duration: body.duration || 60,
      timezone: body.timezone || "America/New_York",
      presenters: body.presenters || [],
      learning_points: body.learning_points || [],
      registration_url: body.registration_url || null,
      recording_url: body.recording_url || null,
      status: body.status || "upcoming",
      featured: body.featured || false,
      published_at: body.status !== "draft" && !body.published_at
        ? new Date().toISOString()
        : body.published_at,
    };

    const { data, error } = await supabase
      .from("webinars")
      .update(updateData)
      .eq("id", body.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating webinar:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ item: data, success: true });
  } catch (error) {
    console.error("Error in webinar PUT:", error);
    return NextResponse.json({ error: "Failed to update webinar" }, { status: 500 });
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
      return NextResponse.json({ error: "Webinar ID is required" }, { status: 400 });
    }

    const { error } = await supabase
      .from("webinars")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting webinar:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in webinar DELETE:", error);
    return NextResponse.json({ error: "Failed to delete webinar" }, { status: 500 });
  }
}
