import { NextRequest, NextResponse } from "next/server";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { sendContactFormNotification, sendUserConfirmation } from "@/lib/email/resend";
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
    const rateLimitResult = applyRateLimit(request, "/api/contact", "sensitive");
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: "Too many submissions. Please try again later." },
        { status: 429, headers: rateLimitResult.headers }
      );
    }

    const body = await request.json();
    const { name, email, company, jobTitle, message, inquiryType } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
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

    // Store the contact submission if Supabase is configured
    const client = getSupabaseClient();
    if (client) {
      const { error: dbError } = await client
        .from("contact_submissions")
        .insert({
          name,
          email,
          company: company || null,
          job_title: jobTitle || null,
          message,
          inquiry_type: inquiryType || "general",
          status: "new",
        });

      if (dbError) {
        console.error("Database error:", dbError);
        // Don't fail if DB insert fails - we might not have the table yet
        // In production, you'd want proper error handling
      }
    } else {
      console.log("Supabase not configured - skipping database storage");
    }

    // Send email notification to team
    const teamNotificationSent = await sendContactFormNotification({
      name,
      email,
      company: company || undefined,
      jobTitle: jobTitle || undefined,
      message,
      inquiryType: inquiryType || "general",
    });

    if (!teamNotificationSent) {
      console.error("Failed to send team notification email - check RESEND_API_KEY");
    }

    // Send confirmation email to user
    const userConfirmationSent = await sendUserConfirmation({
      name,
      email,
    });

    if (!userConfirmationSent) {
      console.error("Failed to send user confirmation email - check RESEND_API_KEY");
    }

    console.log(`Contact form processed: team=${teamNotificationSent}, user=${userConfirmationSent}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to submit contact form" },
      { status: 500 }
    );
  }
}
