import { NextRequest, NextResponse } from "next/server";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { getAdminSession } from "@/lib/auth/admin-auth";

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

export async function GET(request: NextRequest) {
  try {
    // Verify admin session
    const session = await getAdminSession();
    if (!session) {
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

    // Parse query params for filtering
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const partnershipType = searchParams.get("partnership_type");
    const priority = searchParams.get("priority");

    let query = client
      .from("partner_enquiries")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    // Apply filters if provided
    if (status) {
      query = query.eq("status", status);
    }
    if (partnershipType) {
      query = query.eq("partnership_type", partnershipType);
    }
    if (priority) {
      query = query.eq("priority", priority);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to fetch partner enquiries" },
        { status: 500 }
      );
    }

    // Calculate stats
    const allEnquiries = data || [];
    const stats = {
      total: allEnquiries.length,
      new: allEnquiries.filter((e) => e.status === "new").length,
      contacted: allEnquiries.filter((e) => e.status === "contacted").length,
      qualified: allEnquiries.filter((e) => e.status === "qualified").length,
      negotiating: allEnquiries.filter((e) => e.status === "negotiating").length,
      closedWon: allEnquiries.filter((e) => e.status === "closed-won").length,
      closedLost: allEnquiries.filter((e) => e.status === "closed-lost").length,
      highPriority: allEnquiries.filter((e) => e.priority === "high").length,
    };

    return NextResponse.json({ enquiries: data || [], stats });
  } catch (error) {
    console.error("Admin partner enquiries error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Verify admin session
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, status, priority, notes, assigned_to } = body;

    if (!id) {
      return NextResponse.json(
        { error: "ID is required" },
        { status: 400 }
      );
    }

    const client = getSupabaseClient();
    if (!client) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 500 }
      );
    }

    // Build update object with only provided fields
    const updateData: Record<string, unknown> = {};
    if (status !== undefined) updateData.status = status;
    if (priority !== undefined) updateData.priority = priority;
    if (notes !== undefined) updateData.notes = notes;
    if (assigned_to !== undefined) updateData.assigned_to = assigned_to;

    // Track last contact if status changed to contacted
    if (status === "contacted" || status === "qualified" || status === "negotiating") {
      updateData.last_contact_at = new Date().toISOString();
    }

    const { error } = await client
      .from("partner_enquiries")
      .update(updateData)
      .eq("id", id);

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to update partner enquiry" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin partner enquiries update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const client = getSupabaseClient();
    if (!client) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    const { error } = await client
      .from("partner_enquiries")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Delete error:", error);
      return NextResponse.json({ error: "Failed to delete partner enquiry" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin partner enquiries delete error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
