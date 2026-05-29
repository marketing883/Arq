import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { consent_given, consent_categories } = body;

    // Get session ID from cookie or generate new one
    const sessionId = request.cookies.get("arqai_session")?.value || uuidv4();

    // Get IP address
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ipAddress = forwardedFor?.split(",")[0].trim();

    // Store consent in database
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);

      await supabase.from("cookie_consents").insert({
        session_id: sessionId,
        consent_given,
        consent_categories,
        ip_address: ipAddress,
        consented_at: new Date().toISOString(),
      });
    }

    // Set session cookie if not exists
    const response = NextResponse.json({ success: true });

    if (!request.cookies.get("arqai_session")) {
      response.cookies.set("arqai_session", sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 365, // 1 year
        path: "/",
      });
    }

    return response;
  } catch (error) {
    console.error("Consent API error:", error);
    return NextResponse.json(
      { error: "Failed to save consent" },
      { status: 500 }
    );
  }
}
