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
      .from("whitepapers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching whitepapers:", error);
      return NextResponse.json({ items: [], error: error.message });
    }

    return NextResponse.json({ items: data || [] });
  } catch (error) {
    console.error("Error in whitepapers API:", error);
    return NextResponse.json({ items: [], error: "Failed to fetch whitepapers" });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = getSupabase();

    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    if (!body.title || !body.slug) {
      return NextResponse.json({ error: "Title and slug are required" }, { status: 400 });
    }

    const whitepaperData = {
      title: body.title,
      slug: body.slug,
      description: body.description || null,
      cover_image: body.cover_image || null,
      file_url: body.file_url || null,
      category: body.category || null,
      status: body.status || "draft",
      gated: body.gated !== false,
      published_at: body.status === "published" ? new Date().toISOString() : null,
    };

    const { data, error } = await supabase
      .from("whitepapers")
      .insert(whitepaperData)
      .select()
      .single();

    if (error) {
      console.error("Error creating whitepaper:", error);
      if (error.code === "23505") {
        return NextResponse.json({
          error: "A whitepaper with this slug already exists."
        }, { status: 400 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ item: data, success: true });
  } catch (error) {
    console.error("Error in whitepaper POST:", error);
    return NextResponse.json({ error: "Failed to create whitepaper" }, { status: 500 });
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
      return NextResponse.json({ error: "Whitepaper ID is required" }, { status: 400 });
    }

    const updateData = {
      title: body.title,
      slug: body.slug,
      description: body.description || null,
      cover_image: body.cover_image || null,
      file_url: body.file_url || null,
      category: body.category || null,
      status: body.status || "draft",
      gated: body.gated !== false,
      published_at: body.status === "published" && !body.published_at
        ? new Date().toISOString()
        : body.published_at,
    };

    const { data, error } = await supabase
      .from("whitepapers")
      .update(updateData)
      .eq("id", body.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating whitepaper:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ item: data, success: true });
  } catch (error) {
    console.error("Error in whitepaper PUT:", error);
    return NextResponse.json({ error: "Failed to update whitepaper" }, { status: 500 });
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
      return NextResponse.json({ error: "Whitepaper ID is required" }, { status: 400 });
    }

    const { error } = await supabase
      .from("whitepapers")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting whitepaper:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in whitepaper DELETE:", error);
    return NextResponse.json({ error: "Failed to delete whitepaper" }, { status: 500 });
  }
}
