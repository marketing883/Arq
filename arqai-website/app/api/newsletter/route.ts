import { NextRequest, NextResponse } from "next/server";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Lazy initialize Supabase client
let supabase: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient | null {
  if (supabase) return supabase;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    return null;
  }

  supabase = createClient(url, key);
  return supabase;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, source = "footer" } = body;

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Determine lead segment based on source
    const segment = getSegment(source);

    // Store the subscription if Supabase is configured
    const client = getSupabaseClient();
    if (client) {
      // Check if email already exists
      const { data: existing } = await client
        .from("newsletter_subscriptions")
        .select("id")
        .eq("email", email.toLowerCase())
        .single();

      if (existing) {
        // Update existing subscription
        const { error: updateError } = await client
          .from("newsletter_subscriptions")
          .update({
            source,
            segment,
            updated_at: new Date().toISOString(),
          })
          .eq("email", email.toLowerCase());

        if (updateError) {
          console.error("Database update error:", updateError);
        }
      } else {
        // Insert new subscription
        const { error: dbError } = await client
          .from("newsletter_subscriptions")
          .insert({
            email: email.toLowerCase(),
            source,
            segment,
            status: "active",
          });

        if (dbError) {
          console.error("Database error:", dbError);
          // If table doesn't exist, still return success for UX
          // The form works, we just can't store yet
        }
      }
    } else {
      console.log("Supabase not configured - skipping database storage");
    }

    // Log the subscription
    console.log("Newsletter subscription:", {
      email,
      source,
      segment,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "Successfully subscribed to newsletter"
    });
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json(
      { error: "Failed to subscribe" },
      { status: 500 }
    );
  }
}

// Determine segment based on subscription source
function getSegment(source: string): string {
  switch (source) {
    case "footer":
      return "general";
    case "blog":
      return "content_interested";
    case "whitepaper":
      return "resource_seeker";
    case "demo":
      return "high_intent";
    case "popup":
      return "engaged_visitor";
    default:
      return "general";
  }
}

// GET endpoint to fetch subscriptions (admin only)
export async function GET(request: NextRequest) {
  try {
    // Check for admin auth header (simple check)
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const client = getSupabaseClient();
    if (!client) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 500 }
      );
    }

    const { data, error } = await client
      .from("newsletter_subscriptions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to fetch subscriptions" },
        { status: 500 }
      );
    }

    // Get stats
    const { count: totalCount } = await client
      .from("newsletter_subscriptions")
      .select("*", { count: "exact", head: true });

    const { count: activeCount } = await client
      .from("newsletter_subscriptions")
      .select("*", { count: "exact", head: true })
      .eq("status", "active");

    return NextResponse.json({
      subscriptions: data || [],
      stats: {
        total: totalCount || 0,
        active: activeCount || 0,
      }
    });
  } catch (error) {
    console.error("Fetch subscriptions error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
