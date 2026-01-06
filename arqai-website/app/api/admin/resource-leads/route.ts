import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getAdminSession } from "@/lib/auth/admin-auth";

function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseServiceKey) return null;
  return createClient(supabaseUrl, supabaseServiceKey);
}

export async function GET() {
  try {
    // Verify admin session
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json({ leads: [] });
    }

    const { data: leads, error } = await supabase
      .from("resource_leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching resource leads:", error);
      return NextResponse.json({ leads: [] });
    }

    return NextResponse.json({ leads: leads || [] });
  } catch (error) {
    console.error("Error in resource leads API:", error);
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
  }
}
