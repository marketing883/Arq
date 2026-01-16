import { NextRequest, NextResponse } from "next/server";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { sendContactFormNotification, sendUserConfirmation } from "@/lib/email/resend";
import { applyRateLimit } from "@/lib/security/rate-limiter";
import { analyzeLeadIntel, getIntentBasedEmailContent } from "@/lib/ai/lead-intel";

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
    if (!name || !email || !company || !jobTitle || !message) {
      return NextResponse.json(
        { error: "Name, email, company, job title, and message are required" },
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

    // Run AI analysis on the lead (non-blocking if it fails)
    let aiIntel = null;
    try {
      aiIntel = await analyzeLeadIntel({
        name,
        email,
        company,
        jobTitle,
        message,
        inquiryType: inquiryType || "general",
      });
      console.log("AI Intel analysis completed:", aiIntel?.detectedIntent, aiIntel?.urgency);
    } catch (error) {
      console.error("AI Intel analysis failed (continuing without it):", error);
    }

    // Store the contact submission if Supabase is configured
    const client = getSupabaseClient();
    if (client) {
      const { error: dbError } = await client
        .from("contact_submissions")
        .insert({
          name,
          email,
          company,
          job_title: jobTitle,
          message,
          inquiry_type: inquiryType || "general",
          status: "new",
          // AI Intel fields
          ai_detected_intent: aiIntel?.detectedIntent || null,
          ai_urgency: aiIntel?.urgency || null,
          ai_company_industry: aiIntel?.companyIntel?.likelyIndustry || null,
          ai_company_size: aiIntel?.companyIntel?.estimatedSize || null,
          ai_contact_seniority: aiIntel?.contactIntel?.seniority || null,
          ai_contact_department: aiIntel?.contactIntel?.department || null,
          ai_decision_maker: aiIntel?.contactIntel?.decisionMaker || null,
          ai_summary: aiIntel?.summary || null,
          ai_intel_json: aiIntel ? JSON.stringify(aiIntel) : null,
        });

      if (dbError) {
        console.error("Database error:", dbError);
        // Don't fail if DB insert fails - we might not have the table yet
      }
    } else {
      console.log("Supabase not configured - skipping database storage");
    }

    // Get intent-based email content
    const detectedIntent = aiIntel?.detectedIntent || inquiryType || "general";
    const emailContent = getIntentBasedEmailContent(detectedIntent, name);

    // Send email notification to team (include AI intel summary)
    const teamNotificationSent = await sendContactFormNotification({
      name,
      email,
      company,
      jobTitle,
      message,
      inquiryType: inquiryType || "general",
      // Pass AI intel to team notification
      aiIntel: aiIntel ? {
        detectedIntent: aiIntel.detectedIntent,
        urgency: aiIntel.urgency,
        summary: aiIntel.summary,
        companyIntel: aiIntel.companyIntel,
        contactIntel: aiIntel.contactIntel,
        researchSuggestions: aiIntel.researchSuggestions,
      } : undefined,
    });

    if (!teamNotificationSent) {
      console.error("Failed to send team notification email - check RESEND_API_KEY");
    }

    // Send personalized confirmation email to user
    const userConfirmationSent = await sendUserConfirmation({
      name,
      email,
      detectedIntent,
      personalizedMessage: aiIntel?.personalizedMessage || emailContent.message,
      customSubject: emailContent.subject,
      customHeading: emailContent.heading,
      ctaText: emailContent.ctaText,
      ctaUrl: emailContent.ctaUrl,
    });

    if (!userConfirmationSent) {
      console.error("Failed to send user confirmation email - check RESEND_API_KEY");
    }

    console.log(`Contact form processed: team=${teamNotificationSent}, user=${userConfirmationSent}, intent=${detectedIntent}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to submit contact form" },
      { status: 500 }
    );
  }
}
