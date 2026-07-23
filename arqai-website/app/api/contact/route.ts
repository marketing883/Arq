import { NextRequest, NextResponse } from "next/server";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { sendContactFormNotification, sendUserConfirmation, sendSystemErrorNotification } from "@/lib/email/resend";
import { applyRateLimit } from "@/lib/security/rate-limiter";
import { validateAntiSpam } from "@/lib/security/anti-spam";
import { analyzeLeadIntel, getIntentBasedEmailContent } from "@/lib/ai/lead-intel";
import { getOrCreateLeadProfile, recordTouchpointEvent } from "@/lib/lead/lead-profile-service";
import { enqueueLeadIntelRun, kickLeadIntelRun } from "@/lib/agents/lead-intel-agent";
import { sanitizeAttribution, describeAttribution } from "@/lib/attribution/server";

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
    const {
      name,
      email,
      company,
      jobTitle,
      phone,
      message,
      inquiryType,
      companySize,
      industry,
      workflowArea,
      timeline,
      budgetRange,
      currentSystems,
      website_url,
      _formLoadedAt,
      attribution,
    } = body;

    // Visitor journey / campaign attribution (untrusted client input, sanitized)
    const attr = sanitizeAttribution(attribution);

    // Validate required fields
    if (!name || !email || !company || !jobTitle || !workflowArea || !message) {
      return NextResponse.json(
        { error: "Name, email, company, job title, workflow area, and message are required" },
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
        return NextResponse.json({ success: true }); // Silently reject bots
      }
      return NextResponse.json({ error: spamCheck.error }, { status: 400 });
    }

    const intakeDetails = [
      inquiryType ? `Inquiry type: ${inquiryType}` : null,
      companySize ? `Company size: ${companySize}` : null,
      industry ? `Industry: ${industry}` : null,
      workflowArea ? `Workflow area: ${workflowArea}` : null,
      timeline ? `Timeline: ${timeline}` : null,
      budgetRange ? `Budget range: ${budgetRange}` : null,
      currentSystems ? `Systems involved: ${currentSystems}` : null,
    ].filter(Boolean);
    let enrichedMessage = intakeDetails.length > 0
      ? `${message}\n\nIntake context:\n${intakeDetails.join("\n")}`
      : message;

    // Append the visitor journey so the AI analysis and team notification see
    // where the lead came from and what they engaged with before submitting.
    const attributionBlock = attr ? describeAttribution(attr) : "";
    if (attributionBlock) {
      enrichedMessage = `${enrichedMessage}\n\nVisitor journey:\n${attributionBlock}`;
    }

    // Run AI analysis on the lead (non-blocking if it fails)
    let aiIntel = null;
    try {
      aiIntel = await analyzeLeadIntel({
        name,
        email,
        company,
        jobTitle,
        message: enrichedMessage,
        inquiryType: inquiryType || "general",
      });
      console.log("AI Intel analysis completed:", aiIntel?.detectedIntent, aiIntel?.urgency);
    } catch (error) {
      console.error("AI Intel analysis failed (continuing without it):", error);
    }

    // Store the contact submission if Supabase is configured
    const client = getSupabaseClient();
    if (client) {
      const baseRow = {
        name,
        email,
        company,
        job_title: jobTitle,
        phone: phone || null,
        message,
        inquiry_type: inquiryType || "general",
        company_size: companySize || null,
        industry: industry || null,
        workflow_area: workflowArea || null,
        timeline: timeline || null,
        budget_range: budgetRange || null,
        current_systems: currentSystems || null,
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
      };
      // Attribution fields (visitor journey + campaign), requires
      // supabase-contact-attribution-migration.sql to have been run.
      const attributionRow = attr
        ? {
            session_id: attr.sessionId || null,
            source_page: attr.sourcePage || null,
            source_context: attr.sourceContext || null,
            landing_page: attr.landingPage || null,
            referrer: attr.referrer || null,
            utm_source: attr.utmSource || null,
            utm_medium: attr.utmMedium || null,
            utm_campaign: attr.utmCampaign || null,
            utm_term: attr.utmTerm || null,
            utm_content: attr.utmContent || null,
            journey: attr.journey.length ? JSON.stringify(attr.journey) : null,
            visit_started_at: attr.visitStartedAt
              ? new Date(attr.visitStartedAt).toISOString()
              : null,
          }
        : {};

      let { error: dbError } = await client
        .from("contact_submissions")
        .insert({ ...baseRow, ...attributionRow });

      // If the attribution migration hasn't been applied yet, the unknown
      // columns fail the whole insert, so retry without them rather than
      // silently losing the lead.
      if (dbError && attr) {
        console.error(
          "Insert with attribution columns failed (run supabase-contact-attribution-migration.sql):",
          dbError.message
        );
        const retry = await client.from("contact_submissions").insert(baseRow);
        dbError = retry.error;
      }

      if (dbError) {
        console.error("Database error:", dbError);
        // Don't fail the visitor's request, but surface the data loss to the
        // team so a swallowed insert doesn't hide a real lead going missing.
        void sendSystemErrorNotification({
          context: "contact_submissions insert",
          message: dbError.message,
          details: `Lead: ${email} (${company || "no company"})`,
        }).catch(() => {});
      }
    } else {
      console.log("Supabase not configured - skipping database storage");
    }

    // Process for V2 lead intelligence (non-blocking).
    // Passing the analytics session id links the anonymous browsing history
    // to the lead profile the moment the visitor identifies themselves.
    getOrCreateLeadProfile(email, attr?.sessionId || undefined, undefined)
      .then(async (profile) => {
        if (profile) {
          // Record contact form touchpoint
          await recordTouchpointEvent(
            profile.id,
            "contact_form",
            aiIntel?.detectedIntent || inquiryType || "general",
            {
              name,
              company,
              job_title: jobTitle,
              phone,
              inquiry_type: inquiryType || "general",
              company_size: companySize,
              industry,
              workflow_area: workflowArea,
              timeline,
              budget_range: budgetRange,
              current_systems: currentSystems,
              ai_detected_intent: aiIntel?.detectedIntent,
              ai_urgency: aiIntel?.urgency,
              ai_company_size: aiIntel?.companyIntel?.estimatedSize,
              source_page: attr?.sourcePage,
              source_context: attr?.sourceContext,
              utm_source: attr?.utmSource,
              utm_campaign: attr?.utmCampaign,
            },
            enrichedMessage // Content for signal detection
          );
          console.log(`[LEAD V2] Contact form recorded for ${email}, profile: ${profile.id}`);

          // Kick off deep intelligence research for this lead.
          const run = await enqueueLeadIntelRun(profile.id, "contact_form", {
            inquiry_type: inquiryType || "general",
            source_page: attr?.sourcePage,
          });
          kickLeadIntelRun(run);
        }
      })
      .catch((error) => {
        console.error("Lead V2 contact form error:", error instanceof Error ? error.message : "Unknown");
      });

    // Get intent-based email content
    const detectedIntent = aiIntel?.detectedIntent || inquiryType || "general";
    const emailContent = getIntentBasedEmailContent(detectedIntent, name);

    // Send email notification to team (include AI intel summary)
    const teamNotificationSent = await sendContactFormNotification({
      name,
      email,
      company,
      jobTitle,
      message: enrichedMessage,
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
