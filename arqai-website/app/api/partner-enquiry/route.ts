import { NextRequest, NextResponse } from "next/server";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { sendPartnerEnquiryNotification } from "@/lib/email/resend";
import { applyRateLimit } from "@/lib/security/rate-limiter";

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
    // Apply rate limiting (sensitive endpoint - strict limits)
    const rateLimitResult = applyRateLimit(request, "/api/partner-enquiry", "sensitive");
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: "Too many submissions. Please try again later." },
        { status: 429, headers: rateLimitResult.headers }
      );
    }

    const body = await request.json();
    const {
      name,
      email,
      company,
      phone,
      jobTitle,
      partnershipType,
      companySize,
      message,
      website,
    } = body;

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
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

    // Determine priority based on partnership type and company size
    let priority = "medium";
    if (partnershipType === "strategic" || companySize === "enterprise") {
      priority = "high";
    } else if (partnershipType === "technology" || companySize === "mid-market") {
      priority = "medium";
    }

    // Store the partner enquiry if Supabase is configured
    const client = getSupabaseClient();
    if (client) {
      const { error: dbError } = await client
        .from("partner_enquiries")
        .insert({
          name,
          email,
          company: company || null,
          phone: phone || null,
          job_title: jobTitle || null,
          partnership_type: partnershipType || "general",
          company_size: companySize || null,
          message: message || null,
          website: website || null,
          status: "new",
          priority,
          source: "website",
        });

      if (dbError) {
        console.error("Database error:", dbError);
        // Don't fail if DB insert fails - we might not have the table yet
      }
    } else {
      console.log("Supabase not configured - skipping database storage");
    }

    // Send email notification to team
    await sendPartnerEnquiryNotification({
      name,
      email,
      company: company || undefined,
      phone: phone || undefined,
      jobTitle: jobTitle || undefined,
      partnershipType: partnershipType || "general",
      companySize: companySize || undefined,
      message: message || undefined,
      website: website || undefined,
      priority,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Partner enquiry error:", error);
    return NextResponse.json(
      { error: "Failed to submit partner enquiry" },
      { status: 500 }
    );
  }
}
