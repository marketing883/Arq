import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Missing Supabase credentials:", {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseServiceKey
    });
    return null;
  }

  return createClient(supabaseUrl, supabaseServiceKey);
}

export async function GET() {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json({ items: [], error: "Database not configured" });
    }

    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching blog posts:", error);
      return NextResponse.json({ items: [], error: error.message });
    }

    return NextResponse.json({ items: data || [] });
  } catch (error) {
    console.error("Error in blog API:", error);
    return NextResponse.json({ items: [], error: "Failed to fetch blog posts" });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = getSupabase();

    if (!supabase) {
      return NextResponse.json({
        error: "Database not configured. Please check your Supabase credentials."
      }, { status: 500 });
    }

    // Validate required fields
    if (!body.title || !body.slug) {
      return NextResponse.json({
        error: "Title and slug are required"
      }, { status: 400 });
    }

    // Prepare the data with proper field mapping
    const postData = {
      title: body.title,
      slug: body.slug,
      excerpt: body.excerpt || null,
      content: body.content || null,
      featured_image: body.featured_image || body.featuredImage || null,
      category: body.category || null,
      tags: body.tags || [],
      author: body.author || "ArqAI Team",
      status: body.status || "draft",
      published_at: body.status === "published" ? new Date().toISOString() : null,
    };

    const { data, error } = await supabase
      .from("blog_posts")
      .insert(postData)
      .select()
      .single();

    if (error) {
      console.error("Error creating blog post:", error);

      // Provide more specific error messages
      if (error.code === "42P01") {
        return NextResponse.json({
          error: "Blog posts table not found. Please run the content schema in Supabase."
        }, { status: 500 });
      }
      if (error.code === "23505") {
        return NextResponse.json({
          error: "A blog post with this slug already exists."
        }, { status: 400 });
      }

      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ item: data, success: true });
  } catch (error) {
    console.error("Error in blog POST:", error);
    return NextResponse.json({
      error: "Failed to create blog post. Please try again."
    }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const supabase = getSupabase();

    if (!supabase) {
      return NextResponse.json({
        error: "Database not configured"
      }, { status: 500 });
    }

    if (!body.id) {
      return NextResponse.json({
        error: "Post ID is required"
      }, { status: 400 });
    }

    const updateData = {
      title: body.title,
      slug: body.slug,
      excerpt: body.excerpt || null,
      content: body.content || null,
      featured_image: body.featured_image || body.featuredImage || null,
      category: body.category || null,
      tags: body.tags || [],
      author: body.author || "ArqAI Team",
      status: body.status || "draft",
      published_at: body.status === "published" && !body.published_at
        ? new Date().toISOString()
        : body.published_at,
    };

    const { data, error } = await supabase
      .from("blog_posts")
      .update(updateData)
      .eq("id", body.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating blog post:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ item: data, success: true });
  } catch (error) {
    console.error("Error in blog PUT:", error);
    return NextResponse.json({
      error: "Failed to update blog post"
    }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    const supabase = getSupabase();

    if (!supabase) {
      return NextResponse.json({
        error: "Database not configured"
      }, { status: 500 });
    }

    if (!id) {
      return NextResponse.json({
        error: "Post ID is required"
      }, { status: 400 });
    }

    const { error } = await supabase
      .from("blog_posts")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting blog post:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in blog DELETE:", error);
    return NextResponse.json({
      error: "Failed to delete blog post"
    }, { status: 500 });
  }
}
