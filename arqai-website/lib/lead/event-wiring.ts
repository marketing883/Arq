/**
 * Event Wiring Service
 *
 * Central service that captures all touchpoint events and routes them
 * to the V2 Lead Intelligence scoring engine.
 *
 * This is the "nervous system" that connects user actions to intelligence.
 */

import { createServiceClient } from "@/lib/supabase/server";
import {
  processEvent,
  evaluateAlerts,
  evaluateJourneyProgression,
  updateProfileScores,
  detectSignals,
  createEmptyTouchpoints,
  inferFromDomain,
} from "./lead-intelligence-v2";
import { sendLeadAlert } from "@/lib/integrations/notifications/notification-service";
import type {
  LeadProfile,
  TouchpointEvent,
  TouchpointSource,
  ScoredSignal,
  JourneyStage,
  LeadAlert,
  ChatTouchpoint,
  ContactFormTouchpoint,
  ResourceDownloadTouchpoint,
  NewsletterTouchpoint,
  PageViewTouchpoint,
} from "@/types/lead-intelligence-v2";

// ============================================
// TYPES
// ============================================

export interface ChatEventData {
  conversationId: string;
  messageCount: number;
  messages: string[];
  page?: string;
}

export interface ContactFormEventData {
  submissionId: string;
  name: string;
  email: string;
  company?: string;
  jobTitle?: string;
  message?: string;
  inquiryType?: string;
}

export interface ResourceDownloadEventData {
  resourceId: string;
  resourceType: "whitepaper" | "case_study" | "datasheet";
  resourceTitle: string;
  email: string;
  name?: string;
  company?: string;
}

export interface NewsletterEventData {
  email: string;
  name?: string;
  source?: string;
}

export interface PageViewEventData {
  pageUrl: string;
  pageType: string;
  pageTitle?: string;
  durationSeconds?: number;
  scrollDepth?: number;
}

export interface WireEventResult {
  success: boolean;
  profileId?: string;
  scoreChange?: number;
  newScore?: number;
  journeyStage?: JourneyStage;
  alertsTriggered?: number;
  error?: string;
}

// ============================================
// PROFILE MANAGEMENT
// ============================================

/**
 * Get or create a lead profile for a session/email
 */
export async function getOrCreateProfile(
  sessionId: string,
  email?: string
): Promise<LeadProfile | null> {
  try {
    const supabase = await createServiceClient();

    // Try to find existing profile by email first (most reliable identifier)
    if (email) {
      const { data: existingByEmail } = await supabase
        .from("lead_profiles")
        .select("*")
        .eq("canonical_email", email.toLowerCase())
        .single();

      if (existingByEmail) {
        // Add session to profile if not already there
        const sessionIds = existingByEmail.session_ids || [];
        if (!sessionIds.includes(sessionId)) {
          await supabase
            .from("lead_profiles")
            .update({
              session_ids: [...sessionIds, sessionId],
              updated_at: new Date().toISOString(),
            })
            .eq("id", existingByEmail.id);
        }
        return mapDbToProfile(existingByEmail);
      }
    }

    // Try to find by session ID
    const { data: existingBySession } = await supabase
      .from("lead_profiles")
      .select("*")
      .contains("session_ids", [sessionId])
      .single();

    if (existingBySession) {
      // Update email if we now have it
      if (email && !existingBySession.canonical_email) {
        const domainIntel = inferFromDomain(email);
        await supabase
          .from("lead_profiles")
          .update({
            canonical_email: email.toLowerCase(),
            company_intel: domainIntel
              ? { ...existingBySession.company_intel, ...domainIntel }
              : existingBySession.company_intel,
            journey_stage:
              existingBySession.journey_stage === "anonymous"
                ? "identified"
                : existingBySession.journey_stage,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingBySession.id);
      }
      return mapDbToProfile(existingBySession);
    }

    // Create new profile
    const now = new Date().toISOString();
    const domainIntel = email ? inferFromDomain(email) : null;

    const newProfile = {
      session_ids: [sessionId],
      canonical_email: email?.toLowerCase() || null,
      journey_stage: email ? "identified" : "anonymous",
      priority_tier: "P4",
      touchpoints: createEmptyTouchpoints(),
      scored_signals: [],
      company_intel: domainIntel || {},
      raw_score: 0,
      decay_adjusted_score: 0,
      engagement_velocity: 0,
      icp_fit_score: 0,
      composite_score: 0,
      intent_score: 0,
      engagement_score: 0,
      total_touchpoints: 0,
      days_since_first_touch: 0,
      days_since_last_touch: 0,
      first_touch: now,
      last_touch: now,
      score_calculated_at: now,
      created_at: now,
      updated_at: now,
    };

    const { data: created, error } = await supabase
      .from("lead_profiles")
      .insert(newProfile)
      .select()
      .single();

    if (error) {
      console.error("Failed to create lead profile:", error);
      return null;
    }

    return mapDbToProfile(created);
  } catch (error) {
    console.error("Error in getOrCreateProfile:", error);
    return null;
  }
}

/**
 * Map database row to LeadProfile type
 */
function mapDbToProfile(row: Record<string, unknown>): LeadProfile {
  return {
    id: row.id as string,
    user_id: row.user_id as string | undefined,
    canonical_email: row.canonical_email as string | undefined,
    session_ids: (row.session_ids as string[]) || [],
    first_name: row.first_name as string | undefined,
    last_name: row.last_name as string | undefined,
    company: row.company as string | undefined,
    job_title: row.job_title as string | undefined,
    phone: row.phone as string | undefined,
    touchpoints: (row.touchpoints as LeadProfile["touchpoints"]) || createEmptyTouchpoints(),
    scored_signals: (row.scored_signals as ScoredSignal[]) || [],
    company_intel: (row.company_intel as LeadProfile["company_intel"]) || {},
    raw_score: (row.raw_score as number) || 0,
    decay_adjusted_score: (row.decay_adjusted_score as number) || 0,
    engagement_velocity: (row.engagement_velocity as number) || 0,
    icp_fit_score: (row.icp_fit_score as number) || 0,
    composite_score: (row.composite_score as number) || 0,
    intent_score: (row.intent_score as number) || 0,
    engagement_score: (row.engagement_score as number) || 0,
    journey_stage: (row.journey_stage as JourneyStage) || "anonymous",
    priority_tier: (row.priority_tier as LeadProfile["priority_tier"]) || "P4",
    recommended_action: row.recommended_action as string | undefined,
    recommended_channel: row.recommended_channel as LeadProfile["recommended_channel"],
    ideal_outreach_window: row.ideal_outreach_window as string | undefined,
    total_touchpoints: (row.total_touchpoints as number) || 0,
    days_since_first_touch: (row.days_since_first_touch as number) || 0,
    days_since_last_touch: (row.days_since_last_touch as number) || 0,
    first_touch: row.first_touch as string,
    last_touch: row.last_touch as string,
    score_calculated_at: row.score_calculated_at as string,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  };
}

// ============================================
// EVENT WIRING FUNCTIONS
// ============================================

/**
 * Wire a chat event to the V2 scoring engine
 */
export async function wireChatEvent(
  sessionId: string,
  data: ChatEventData,
  email?: string
): Promise<WireEventResult> {
  try {
    const profile = await getOrCreateProfile(sessionId, email);
    if (!profile) {
      return { success: false, error: "Failed to get/create profile" };
    }

    // Detect signals from chat messages
    const allMessages = data.messages.join(" ");
    const signals = detectSignals(allMessages, "chat");

    // Create touchpoint event
    const touchpointEvent: TouchpointEvent = {
      id: crypto.randomUUID(),
      lead_profile_id: profile.id,
      source: "chat",
      event_type: "message",
      event_data: {
        conversation_id: data.conversationId,
        message_count: data.messageCount,
        page: data.page,
      },
      signals,
      raw_score_contribution: signals.reduce((sum, s) => sum + s.raw_weight * s.confidence, 0),
      page_url: data.page,
      session_id: sessionId,
      created_at: new Date().toISOString(),
    };

    // Update touchpoints
    const chatTouchpoint: ChatTouchpoint = {
      conversation_id: data.conversationId,
      message_count: data.messageCount,
      signals_detected: signals.map((s) => s.type),
      timestamp: new Date().toISOString(),
    };

    const updatedTouchpoints = {
      ...profile.touchpoints,
      chat: [...(profile.touchpoints.chat || []), chatTouchpoint],
    };

    // Process event and get updated profile
    const result = await processAndSaveEvent(profile, touchpointEvent, updatedTouchpoints);

    return result;
  } catch (error) {
    console.error("Error wiring chat event:", error);
    return { success: false, error: String(error) };
  }
}

/**
 * Wire a contact form submission to the V2 scoring engine
 */
export async function wireContactFormEvent(
  sessionId: string,
  data: ContactFormEventData
): Promise<WireEventResult> {
  try {
    const profile = await getOrCreateProfile(sessionId, data.email);
    if (!profile) {
      return { success: false, error: "Failed to get/create profile" };
    }

    // Update profile with contact info
    await updateProfileContactInfo(profile.id, {
      first_name: data.name.split(" ")[0],
      last_name: data.name.split(" ").slice(1).join(" ") || undefined,
      company: data.company,
      job_title: data.jobTitle,
    });

    // Detect signals from message
    const signals = detectSignals(
      `${data.message || ""} ${data.inquiryType || ""}`,
      "contact_form"
    );

    // Create touchpoint event
    const touchpointEvent: TouchpointEvent = {
      id: crypto.randomUUID(),
      lead_profile_id: profile.id,
      source: "contact_form",
      event_type: "submission",
      event_data: {
        submission_id: data.submissionId,
        inquiry_type: data.inquiryType,
        has_company: !!data.company,
        has_job_title: !!data.jobTitle,
      },
      signals,
      raw_score_contribution:
        signals.reduce((sum, s) => sum + s.raw_weight * s.confidence, 0) + 25, // Base score for form submission
      session_id: sessionId,
      created_at: new Date().toISOString(),
    };

    // Update touchpoints
    const formTouchpoint: ContactFormTouchpoint = {
      submission_id: data.submissionId,
      inquiry_type: data.inquiryType || "general",
      signals_detected: signals.map((s) => s.type),
      timestamp: new Date().toISOString(),
    };

    const updatedTouchpoints = {
      ...profile.touchpoints,
      contact_forms: [...(profile.touchpoints.contact_forms || []), formTouchpoint],
    };

    // Process event
    const result = await processAndSaveEvent(profile, touchpointEvent, updatedTouchpoints);

    return result;
  } catch (error) {
    console.error("Error wiring contact form event:", error);
    return { success: false, error: String(error) };
  }
}

/**
 * Wire a resource download to the V2 scoring engine
 */
export async function wireResourceDownloadEvent(
  sessionId: string,
  data: ResourceDownloadEventData
): Promise<WireEventResult> {
  try {
    const profile = await getOrCreateProfile(sessionId, data.email);
    if (!profile) {
      return { success: false, error: "Failed to get/create profile" };
    }

    // Update profile with contact info if provided
    if (data.name || data.company) {
      await updateProfileContactInfo(profile.id, {
        first_name: data.name?.split(" ")[0],
        last_name: data.name?.split(" ").slice(1).join(" ") || undefined,
        company: data.company,
      });
    }

    // Create touchpoint event
    const touchpointEvent: TouchpointEvent = {
      id: crypto.randomUUID(),
      lead_profile_id: profile.id,
      source: "resource_download",
      event_type: "download",
      event_data: {
        resource_id: data.resourceId,
        resource_type: data.resourceType,
        resource_title: data.resourceTitle,
      },
      signals: [], // Resource downloads are signals themselves
      raw_score_contribution: data.resourceType === "whitepaper" ? 20 : 15,
      session_id: sessionId,
      created_at: new Date().toISOString(),
    };

    // Update touchpoints
    const downloadTouchpoint: ResourceDownloadTouchpoint = {
      resource_id: data.resourceId,
      resource_type: data.resourceType,
      resource_title: data.resourceTitle,
      timestamp: new Date().toISOString(),
    };

    const updatedTouchpoints = {
      ...profile.touchpoints,
      resource_downloads: [
        ...(profile.touchpoints.resource_downloads || []),
        downloadTouchpoint,
      ],
    };

    // Process event
    const result = await processAndSaveEvent(profile, touchpointEvent, updatedTouchpoints);

    return result;
  } catch (error) {
    console.error("Error wiring resource download event:", error);
    return { success: false, error: String(error) };
  }
}

/**
 * Wire a newsletter signup to the V2 scoring engine
 */
export async function wireNewsletterEvent(
  sessionId: string,
  data: NewsletterEventData
): Promise<WireEventResult> {
  try {
    const profile = await getOrCreateProfile(sessionId, data.email);
    if (!profile) {
      return { success: false, error: "Failed to get/create profile" };
    }

    // Update name if provided
    if (data.name) {
      await updateProfileContactInfo(profile.id, {
        first_name: data.name.split(" ")[0],
        last_name: data.name.split(" ").slice(1).join(" ") || undefined,
      });
    }

    // Create touchpoint event
    const touchpointEvent: TouchpointEvent = {
      id: crypto.randomUUID(),
      lead_profile_id: profile.id,
      source: "newsletter",
      event_type: "signup",
      event_data: {
        source: data.source,
      },
      signals: [],
      raw_score_contribution: 10,
      session_id: sessionId,
      created_at: new Date().toISOString(),
    };

    // Update touchpoints
    const newsletterTouchpoint: NewsletterTouchpoint = {
      signup_source: data.source || "website",
      timestamp: new Date().toISOString(),
    };

    const updatedTouchpoints = {
      ...profile.touchpoints,
      newsletter_signups: [
        ...(profile.touchpoints.newsletter_signups || []),
        newsletterTouchpoint,
      ],
    };

    // Process event
    const result = await processAndSaveEvent(profile, touchpointEvent, updatedTouchpoints);

    return result;
  } catch (error) {
    console.error("Error wiring newsletter event:", error);
    return { success: false, error: String(error) };
  }
}

/**
 * Wire a page view to the V2 scoring engine
 */
export async function wirePageViewEvent(
  sessionId: string,
  data: PageViewEventData,
  email?: string
): Promise<WireEventResult> {
  try {
    const profile = await getOrCreateProfile(sessionId, email);
    if (!profile) {
      return { success: false, error: "Failed to get/create profile" };
    }

    // Detect signals from page type
    const pageSignals: ScoredSignal[] = [];
    if (data.pageUrl.includes("/demo") || data.pageUrl.includes("/pricing")) {
      pageSignals.push({
        type: data.pageUrl.includes("/demo") ? "demo_interest" : "pricing_interest",
        category: "purchase_intent",
        raw_weight: 15,
        confidence: 0.8,
        timestamp: new Date().toISOString(),
        source: "page_view",
      });
    }
    if (data.pageUrl.includes("/solutions") || data.pageUrl.includes("/platform")) {
      pageSignals.push({
        type: "product_research",
        category: "product",
        raw_weight: 8,
        confidence: 0.7,
        timestamp: new Date().toISOString(),
        source: "page_view",
      });
    }

    // Create touchpoint event
    const touchpointEvent: TouchpointEvent = {
      id: crypto.randomUUID(),
      lead_profile_id: profile.id,
      source: "page_view",
      event_type: "view",
      event_data: {
        page_url: data.pageUrl,
        page_type: data.pageType,
        page_title: data.pageTitle,
        duration_seconds: data.durationSeconds,
        scroll_depth: data.scrollDepth,
      },
      signals: pageSignals,
      raw_score_contribution:
        pageSignals.reduce((sum, s) => sum + s.raw_weight * s.confidence, 0) + 2,
      page_url: data.pageUrl,
      session_id: sessionId,
      created_at: new Date().toISOString(),
    };

    // Update touchpoints
    const pageViewTouchpoint: PageViewTouchpoint = {
      page_url: data.pageUrl,
      page_type: data.pageType,
      duration_seconds: data.durationSeconds,
      timestamp: new Date().toISOString(),
    };

    const updatedTouchpoints = {
      ...profile.touchpoints,
      page_views: [...(profile.touchpoints.page_views || []), pageViewTouchpoint],
    };

    // Process event
    const result = await processAndSaveEvent(profile, touchpointEvent, updatedTouchpoints);

    return result;
  } catch (error) {
    console.error("Error wiring page view event:", error);
    return { success: false, error: String(error) };
  }
}

// ============================================
// INTERNAL HELPERS
// ============================================

/**
 * Process event through V2 engine and save to database
 */
async function processAndSaveEvent(
  profile: LeadProfile,
  event: TouchpointEvent,
  updatedTouchpoints: LeadProfile["touchpoints"]
): Promise<WireEventResult> {
  const supabase = await createServiceClient();

  // Store the touchpoint event
  await supabase.from("touchpoint_events").insert({
    id: event.id,
    lead_profile_id: event.lead_profile_id,
    source: event.source,
    event_type: event.event_type,
    event_data: event.event_data,
    signals: event.signals,
    raw_score_contribution: event.raw_score_contribution,
    page_url: event.page_url,
    session_id: event.session_id,
    created_at: event.created_at,
  });

  // Get all events for this profile
  const { data: allEvents } = await supabase
    .from("touchpoint_events")
    .select("*")
    .eq("lead_profile_id", profile.id)
    .order("created_at", { ascending: false });

  const events = (allEvents || []).map((e) => ({
    ...e,
    signals: e.signals || [],
  })) as TouchpointEvent[];

  // Update profile with new signals
  const newSignals = [...profile.scored_signals, ...event.signals];

  // Calculate updated scores
  const updatedProfile: LeadProfile = {
    ...profile,
    touchpoints: updatedTouchpoints,
    scored_signals: newSignals,
    total_touchpoints: events.length,
  };

  // Run through scoring engine
  const scoredProfile = updateProfileScores(updatedProfile, events);

  // Check for journey progression
  const journeyTransition = evaluateJourneyProgression(scoredProfile, events);
  if (journeyTransition) {
    scoredProfile.journey_stage = journeyTransition.to_stage;

    // Store journey transition
    await supabase.from("journey_transitions").insert({
      lead_profile_id: profile.id,
      from_stage: journeyTransition.from_stage,
      to_stage: journeyTransition.to_stage,
      trigger_type: journeyTransition.trigger_type,
      trigger_details: journeyTransition.trigger_details,
      score_at_transition: scoredProfile.composite_score,
    });
  }

  // Check for alerts
  const alerts = evaluateAlerts(scoredProfile, event);
  let alertsTriggered = 0;

  for (const alert of alerts) {
    // Store alert
    const { data: savedAlert } = await supabase
      .from("lead_alerts")
      .insert({
        lead_profile_id: profile.id,
        alert_type: alert.alert_type,
        priority: alert.priority,
        title: alert.title,
        message: alert.message,
        suggested_action: alert.suggested_action,
        status: "active",
        expires_at: alert.expires_at,
        trigger_event: alert.trigger_event,
      })
      .select()
      .single();

    if (savedAlert) {
      alertsTriggered++;
      // Send notification
      try {
        await sendLeadAlert(
          { ...alert, id: savedAlert.id } as LeadAlert,
          scoredProfile
        );
      } catch (e) {
        console.error("Failed to send alert notification:", e);
      }
    }
  }

  // Save updated profile
  await supabase
    .from("lead_profiles")
    .update({
      touchpoints: scoredProfile.touchpoints,
      scored_signals: scoredProfile.scored_signals,
      raw_score: scoredProfile.raw_score,
      decay_adjusted_score: scoredProfile.decay_adjusted_score,
      engagement_velocity: scoredProfile.engagement_velocity,
      icp_fit_score: scoredProfile.icp_fit_score,
      composite_score: scoredProfile.composite_score,
      intent_score: scoredProfile.intent_score,
      engagement_score: scoredProfile.engagement_score,
      journey_stage: scoredProfile.journey_stage,
      priority_tier: scoredProfile.priority_tier,
      total_touchpoints: scoredProfile.total_touchpoints,
      days_since_first_touch: scoredProfile.days_since_first_touch,
      days_since_last_touch: scoredProfile.days_since_last_touch,
      last_touch: scoredProfile.last_touch,
      score_calculated_at: scoredProfile.score_calculated_at,
      updated_at: new Date().toISOString(),
    })
    .eq("id", profile.id);

  return {
    success: true,
    profileId: profile.id,
    scoreChange: scoredProfile.composite_score - profile.composite_score,
    newScore: scoredProfile.composite_score,
    journeyStage: scoredProfile.journey_stage,
    alertsTriggered,
  };
}

/**
 * Update profile contact information
 */
async function updateProfileContactInfo(
  profileId: string,
  info: {
    first_name?: string;
    last_name?: string;
    company?: string;
    job_title?: string;
    phone?: string;
  }
): Promise<void> {
  const supabase = await createServiceClient();

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };

  if (info.first_name) updates.first_name = info.first_name;
  if (info.last_name) updates.last_name = info.last_name;
  if (info.company) updates.company = info.company;
  if (info.job_title) updates.job_title = info.job_title;
  if (info.phone) updates.phone = info.phone;

  await supabase.from("lead_profiles").update(updates).eq("id", profileId);
}
