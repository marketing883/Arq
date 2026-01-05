import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/admin-auth";
import { getAllLeads, getLeadStats } from "@/lib/lead/lead-service";

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

    // Get query parameters for filtering
    const searchParams = request.nextUrl.searchParams;
    const filters = {
      intent_category: searchParams.get("intent_category") || undefined,
      company_size: searchParams.get("company_size") || undefined,
      urgency: searchParams.get("urgency") || undefined,
      qualification_status: searchParams.get("qualification_status") || undefined,
    };

    // Get leads and stats
    const [leads, stats] = await Promise.all([
      getAllLeads(filters),
      getLeadStats(),
    ]);

    return NextResponse.json({
      leads,
      stats,
    });
  } catch (error) {
    console.error("Admin leads error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
