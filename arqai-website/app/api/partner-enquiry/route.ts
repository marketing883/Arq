import { NextRequest, NextResponse } from "next/server";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { sendPartnerEnquiryNotification } from "@/lib/email/resend";
import { applyRateLimit } from "@/lib/security/rate-limiter";
import { validateAntiSpam } from "@/lib/security/anti-spam";
import { analyzeLeadIntel } from "@/lib/ai/lead-intel";
import { getOrCreateLeadProfile, recordTouchpointEvent } from "@/lib/lead/lead-profile-service";

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
      partnerRegion,
      customerBase,
      solutionAreas,
      typicalDealSize,
      timeline,
      existingRelationship,
      proposedOpportunity,
      website_url,
      _formLoadedAt,
    } = body;

    // Validate required fields
    if (!name || !email || !company || !jobTitle || !partnershipType || !proposedOpportunity) {
      return NextResponse.json(
        { error: "Name, email, company, role, partnership type, and opportunity are required" },
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

    // Anti-spam validation (honeypot, timing, work email)
    const spamCheck = validateAntiSpam({ email, website_url, _formLoadedAt });
    if (!spamCheck.passed) {
      if (spamCheck.silent) {
        return NextResponse.json({ success: true });
      }
      return NextResponse.json({ error: spamCheck.error }, { status: 400 });
    }

    const intakeDetails = [
      partnershipType ? `Partnership type: ${partnershipType}` : null,
      companySize ? `Company size: ${companySize}` : null,
      partnerRegion ? `Markets served: ${partnerRegion}` : null,
      customerBase ? `Customer base: ${customerBase}` : null,
      solutionAreas ? `Solution areas: ${solutionAreas}` : null,
      typicalDealSize ? `Typical deal size: ${typicalDealSize}` : null,
      timeline ? `Timeline: ${timeline}` : null,
      existingRelationship ? `Existing relationship or opportunity: ${existingRelationship}` : null,
      message ? `Additional context: ${message}` : null,
    ].filter(Boolean);
    const enrichedMessage = `${proposedOpportunity}\n\nPartner intake context:\n${intakeDetails.join("\n")}`;

    let aiIntel = null;
    try {
      aiIntel = await analyzeLeadIntel({
        name,
        email,
        company,
        jobTitle,
        message: enrichedMessage,
        inquiryType: "partnership",
      });
    } catch (error) {
      console.error("Partner AI Intel analysis failed (continuing without it):", error);
    }

    // Determine priority based on partnership type and company size
    let priority = "medium";
    if (
      partnershipType === "strategic" ||
      partnershipType === "design_partner" ||
      companySize === "enterprise" ||
      timeline === "now"
    ) {
      priority = "high";
    } else if (partnershipType === "technology" || partnershipType === "implementation" || companySize === "mid-market") {
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
          message: proposedOpportunity || message || null,
          website: website || null,
          partner_region: partnerRegion || null,
          customer_base: customerBase || null,
          solution_areas: solutionAreas || null,
          typical_deal_size: typicalDealSize || null,
          timeline: timeline || null,
          existing_relationship: existingRelationship || null,
          proposed_opportunity: proposedOpportunity || null,
          status: "new",
          priority,
          source: "website",
          ai_detected_intent: aiIntel?.detectedIntent || null,
          ai_urgency: aiIntel?.urgency || null,
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

    getOrCreateLeadProfile(email, undefined, undefined)
      .then(async (profile) => {
        if (profile) {
          await recordTouchpointEvent(
            profile.id,
            "contact_form",
            "partnership_inquiry",
            {
              name,
              company,
              job_title: jobTitle,
              phone,
              partnership_type: partnershipType || "general",
              company_size: companySize,
              website,
              partner_region: partnerRegion,
              customer_base: customerBase,
              solution_areas: solutionAreas,
              typical_deal_size: typicalDealSize,
              timeline,
              existing_relationship: existingRelationship,
              proposed_opportunity: proposedOpportunity,
              ai_detected_intent: aiIntel?.detectedIntent,
              ai_urgency: aiIntel?.urgency,
            },
            enrichedMessage,
            "/partners"
          );
          console.log(`[LEAD V2] Partner enquiry recorded for ${email}, profile: ${profile.id}`);
        }
      })
      .catch((error) => {
        console.error("Lead V2 partner enquiry error:", error instanceof Error ? error.message : "Unknown");
      });

    // Send email notification to team
    await sendPartnerEnquiryNotification({
      name,
      email,
      company: company || undefined,
      phone: phone || undefined,
      jobTitle: jobTitle || undefined,
      partnershipType: partnershipType || "general",
      companySize: companySize || undefined,
      message: enrichedMessage,
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
