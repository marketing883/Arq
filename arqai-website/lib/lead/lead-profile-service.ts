/**
 * Lead Profile Service
 *
 * Supabase integration for Lead Intelligence V2.
 * This service manages lead profiles in the new system
 * while maintaining backward compatibility with the existing
 * lead-intelligence.ts and lead-service.ts modules.
 *
 * BACKWARD COMPATIBILITY:
 * - All existing functions in lead-service.ts continue to work
 * - This service adds NEW functionality via new tables
 * - The existing lead_intelligence table is NOT modified
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import {
  LeadProfile,
  TouchpointEvent,
  JourneyTransition,
  LeadAlert,
  ScoredSignal,
  CompanyIntelligence,
  DomainIntelligence,
  LeadDashboardItem,
  ActiveAlert,
  AggregatedTouchpoints,
  TouchpointSource,
  JourneyStage,
} from "@/types/lead-intelligence-v2";
import {
  detectSignals,
  calculateDecayedScore,
  calculateVelocityBonus,
  calculateICPFit,
  calculateCompositeScore,
  calculatePriorityTier,
  evaluateJourneyProgression,
  evaluateAlerts,
  generatePredictiveInsights,
  inferFromDomain,
  createEmptyTouchpoints,
  updateProfileScores,
  DEFAULT_SCORING_CONFIG,
} from "./lead-intelligence-v2";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Database = any;

// Lazy-initialized Supabase client
let supabaseClient: SupabaseClient<Database> | null = null;

function getSupabaseClient(): SupabaseClient<Database> | null {
  if (!supabaseClient) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
      console.warn("Supabase credentials not configured for lead profile service");
      return null;
    }

    supabaseClient = createClient<Database>(url, key);
  }
  return supabaseClient;
}

// ============================================
// LEAD PROFILE CRUD
// ============================================

/**
 * Get or create a lead profile by email
 */
export async function getOrCreateLeadProfile(
  email: string,
  sessionId?: string,
  userId?: string
): Promise<LeadProfile | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const canonicalEmail = email.toLowerCase().trim();

  try {
    // Check for existing profile
    const { data: existing } = await supabase
      .from("lead_profiles")
      .select("*")
      .eq("canonical_email", canonicalEmail)
      .single();

    if (existing) {
      // Update session_ids if new session
      if (sessionId && !existing.session_ids?.includes(sessionId)) {
        const updatedSessionIds = [...(existing.session_ids || []), sessionId];
        await supabase
          .from("lead_profiles")
          .update({
            session_ids: updatedSessionIds,
            user_id: userId || existing.user_id,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existing.id);

        return { ...existing, session_ids: updatedSessionIds };
      }
      return existing as LeadProfile;
    }

    // Try to get domain intelligence
    let companyIntel: CompanyIntelligence = {};
    const domainIntel = await getDomainIntelligence(canonicalEmail);
    if (domainIntel) {
      companyIntel = {
        company_name: domainIntel.company_name,
        size: domainIntel.company_size,
        industry: domainIntel.industry,
        compliance_frameworks: domainIntel.compliance_frameworks,
        source: domainIntel.source,
        confidence: domainIntel.confidence,
      };
    } else {
      // Try to infer from domain
      const inferred = inferFromDomain(canonicalEmail);
      if (inferred) {
        companyIntel = inferred;
      }
    }

    // Create new profile
    const newProfile: Partial<LeadProfile> = {
      user_id: userId,
      canonical_email: canonicalEmail,
      session_ids: sessionId ? [sessionId] : [],
      touchpoints: createEmptyTouchpoints(),
      scored_signals: [],
      company_intel: companyIntel,
      raw_score: 0,
      decay_adjusted_score: 0,
      engagement_velocity: 0,
      icp_fit_score: calculateICPFit(companyIntel),
      composite_score: 0,
      journey_stage: "identified", // Has email = identified
      priority_tier: "P4",
      total_touchpoints: 0,
      days_since_first_touch: 0,
      days_since_last_touch: 0,
      first_touch: new Date().toISOString(),
      last_touch: new Date().toISOString(),
      score_calculated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("lead_profiles")
      .insert(newProfile)
      .select()
      .single();

    if (error) throw error;
    return data as LeadProfile;
  } catch (error) {
    console.error("Error getting/creating lead profile:", error);
    return null;
  }
}

/**
 * Get lead profile by ID
 */
export async function getLeadProfile(profileId: string): Promise<LeadProfile | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from("lead_profiles")
      .select("*")
      .eq("id", profileId)
      .single();

    if (error) throw error;
    return data as LeadProfile;
  } catch (error) {
    console.error("Error getting lead profile:", error);
    return null;
  }
}

/**
 * Get lead profile by session ID
 */
export async function getLeadProfileBySession(sessionId: string): Promise<LeadProfile | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from("lead_profiles")
      .select("*")
      .contains("session_ids", [sessionId])
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data as LeadProfile | null;
  } catch (error) {
    console.error("Error getting lead profile by session:", error);
    return null;
  }
}

/**
 * Update lead profile
 */
export async function updateLeadProfile(
  profileId: string,
  updates: Partial<LeadProfile>
): Promise<LeadProfile | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from("lead_profiles")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", profileId)
      .select()
      .single();

    if (error) throw error;
    return data as LeadProfile;
  } catch (error) {
    console.error("Error updating lead profile:", error);
    return null;
  }
}

// ============================================
// TOUCHPOINT EVENT MANAGEMENT
// ============================================

/**
 * Record a new touchpoint event
 */
export async function recordTouchpointEvent(
  profileId: string,
  source: TouchpointSource,
  eventType: string,
  eventData: Record<string, unknown> = {},
  content?: string,
  pageUrl?: string,
  sessionId?: string
): Promise<TouchpointEvent | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    // Detect signals from content if provided
    const signals: ScoredSignal[] = content ? detectSignals(content, source) : [];

    // Calculate raw score contribution
    const rawScoreContribution = signals.reduce(
      (sum, s) => sum + s.raw_weight * s.confidence,
      0
    );

    // Insert event
    const { data: event, error } = await supabase
      .from("touchpoint_events")
      .insert({
        lead_profile_id: profileId,
        source,
        event_type: eventType,
        event_data: eventData,
        signals,
        raw_score_contribution: rawScoreContribution,
        page_url: pageUrl,
        session_id: sessionId,
      })
      .select()
      .single();

    if (error) throw error;

    // Update profile scores
    await recalculateProfileScores(profileId);

    return event as TouchpointEvent;
  } catch (error) {
    console.error("Error recording touchpoint event:", error);
    return null;
  }
}

/**
 * Get all touchpoint events for a profile
 */
export async function getTouchpointEvents(profileId: string): Promise<TouchpointEvent[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from("touchpoint_events")
      .select("*")
      .eq("lead_profile_id", profileId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data || []) as TouchpointEvent[];
  } catch (error) {
    console.error("Error getting touchpoint events:", error);
    return [];
  }
}

// ============================================
// SCORE RECALCULATION
// ============================================

/**
 * Recalculate all scores for a profile
 */
export async function recalculateProfileScores(profileId: string): Promise<LeadProfile | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    // Get current profile
    const profile = await getLeadProfile(profileId);
    if (!profile) return null;

    // Get all events
    const events = await getTouchpointEvents(profileId);

    // Collect all signals from events
    const allSignals: ScoredSignal[] = events.flatMap((e) => e.signals || []);

    // Calculate scores
    const decayedScore = calculateDecayedScore(allSignals);
    const velocityBonus = calculateVelocityBonus(events);
    const icpFitScore = calculateICPFit(profile.company_intel || {});
    const compositeScore = calculateCompositeScore(decayedScore, velocityBonus, icpFitScore);

    // Calculate priority tier
    const priorityTier = calculatePriorityTier(
      compositeScore,
      profile.company_intel?.size,
      profile.journey_stage
    );

    // Calculate time-based metrics
    const now = new Date();
    const firstEventTime = events.length > 0
      ? new Date(Math.min(...events.map((e) => new Date(e.created_at).getTime())))
      : new Date(profile.first_touch);
    const lastEventTime = events.length > 0
      ? new Date(Math.max(...events.map((e) => new Date(e.created_at).getTime())))
      : new Date(profile.last_touch);

    // Generate recommended action
    const insights = generatePredictiveInsights({ ...profile, scored_signals: allSignals }, events);

    // Update profile
    const updates: Partial<LeadProfile> = {
      scored_signals: allSignals,
      raw_score: allSignals.reduce((sum, s) => sum + s.raw_weight * s.confidence, 0),
      decay_adjusted_score: decayedScore,
      engagement_velocity: velocityBonus,
      icp_fit_score: icpFitScore,
      composite_score: compositeScore,
      priority_tier: priorityTier,
      recommended_action: insights.recommended_action,
      recommended_channel: insights.recommended_channel,
      total_touchpoints: events.length,
      days_since_first_touch: Math.floor((now.getTime() - firstEventTime.getTime()) / (1000 * 60 * 60 * 24)),
      days_since_last_touch: Math.floor((now.getTime() - lastEventTime.getTime()) / (1000 * 60 * 60 * 24)),
      first_touch: firstEventTime.toISOString(),
      last_touch: lastEventTime.toISOString(),
      score_calculated_at: now.toISOString(),
    };

    // Check for journey progression
    const updatedProfile = { ...profile, ...updates, scored_signals: allSignals };
    const transition = evaluateJourneyProgression(updatedProfile, events);
    if (transition) {
      updates.journey_stage = transition.to_stage;
      await recordJourneyTransition(profileId, transition);
    }

    // Check for alerts
    const lastEvent = events[0];
    const alerts = evaluateAlerts(updatedProfile, lastEvent);
    for (const alert of alerts) {
      await createAlert(alert);
    }

    return await updateLeadProfile(profileId, updates);
  } catch (error) {
    console.error("Error recalculating profile scores:", error);
    return null;
  }
}

// ============================================
// JOURNEY TRANSITIONS
// ============================================

/**
 * Record a journey transition
 */
export async function recordJourneyTransition(
  profileId: string,
  transition: JourneyTransition
): Promise<JourneyTransition | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from("journey_transitions")
      .insert({
        lead_profile_id: profileId,
        from_stage: transition.from_stage,
        to_stage: transition.to_stage,
        trigger_type: transition.trigger_type,
        trigger_details: transition.trigger_details,
        score_at_transition: transition.score_at_transition,
      })
      .select()
      .single();

    if (error) throw error;
    return data as JourneyTransition;
  } catch (error) {
    console.error("Error recording journey transition:", error);
    return null;
  }
}

/**
 * Get journey history for a profile
 */
export async function getJourneyHistory(profileId: string): Promise<JourneyTransition[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from("journey_transitions")
      .select("*")
      .eq("lead_profile_id", profileId)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return (data || []) as JourneyTransition[];
  } catch (error) {
    console.error("Error getting journey history:", error);
    return [];
  }
}

/**
 * Manually promote a lead to a new stage
 */
export async function promoteLeadStage(
  profileId: string,
  newStage: JourneyStage,
  trigger: string = "manual_promotion"
): Promise<LeadProfile | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    const profile = await getLeadProfile(profileId);
    if (!profile) return null;

    // Record transition
    await recordJourneyTransition(profileId, {
      id: "",
      lead_profile_id: profileId,
      from_stage: profile.journey_stage,
      to_stage: newStage,
      trigger_type: trigger,
      trigger_details: { promoted_by: "admin" },
      score_at_transition: profile.composite_score,
      created_at: new Date().toISOString(),
    });

    // Update profile
    return await updateLeadProfile(profileId, { journey_stage: newStage });
  } catch (error) {
    console.error("Error promoting lead stage:", error);
    return null;
  }
}

// ============================================
// ALERTS
// ============================================

/**
 * Create a new alert
 */
export async function createAlert(alert: Omit<LeadAlert, "id">): Promise<LeadAlert | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    // Check for duplicate active alert of same type
    const { data: existing } = await supabase
      .from("lead_alerts")
      .select("id")
      .eq("lead_profile_id", alert.lead_profile_id)
      .eq("alert_type", alert.alert_type)
      .eq("status", "active")
      .single();

    if (existing) {
      // Don't create duplicate
      return null;
    }

    const { data, error } = await supabase
      .from("lead_alerts")
      .insert(alert)
      .select()
      .single();

    if (error) throw error;
    return data as LeadAlert;
  } catch (error) {
    console.error("Error creating alert:", error);
    return null;
  }
}

/**
 * Get active alerts
 */
export async function getActiveAlerts(limit: number = 50): Promise<ActiveAlert[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from("v_active_alerts")
      .select("*")
      .limit(limit);

    if (error) throw error;
    return (data || []) as ActiveAlert[];
  } catch (error) {
    console.error("Error getting active alerts:", error);
    return [];
  }
}

/**
 * Acknowledge an alert
 */
export async function acknowledgeAlert(
  alertId: string,
  acknowledgedBy: string
): Promise<LeadAlert | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from("lead_alerts")
      .update({
        status: "acknowledged",
        acknowledged_at: new Date().toISOString(),
        acknowledged_by: acknowledgedBy,
      })
      .eq("id", alertId)
      .select()
      .single();

    if (error) throw error;
    return data as LeadAlert;
  } catch (error) {
    console.error("Error acknowledging alert:", error);
    return null;
  }
}

/**
 * Dismiss an alert
 */
export async function dismissAlert(alertId: string): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  try {
    const { error } = await supabase
      .from("lead_alerts")
      .update({ status: "dismissed" })
      .eq("id", alertId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error dismissing alert:", error);
    return false;
  }
}

// ============================================
// DOMAIN INTELLIGENCE
// ============================================

/**
 * Get domain intelligence for an email
 */
export async function getDomainIntelligence(email: string): Promise<DomainIntelligence | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const domain = email.split("@")[1]?.toLowerCase();
  if (!domain) return null;

  try {
    const { data, error } = await supabase
      .from("domain_intelligence")
      .select("*")
      .eq("domain", domain)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data as DomainIntelligence | null;
  } catch (error) {
    console.error("Error getting domain intelligence:", error);
    return null;
  }
}

/**
 * Add or update domain intelligence
 */
export async function upsertDomainIntelligence(
  domain: string,
  intel: Partial<DomainIntelligence>
): Promise<DomainIntelligence | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from("domain_intelligence")
      .upsert({
        domain: domain.toLowerCase(),
        ...intel,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data as DomainIntelligence;
  } catch (error) {
    console.error("Error upserting domain intelligence:", error);
    return null;
  }
}

// ============================================
// DASHBOARD & REPORTING
// ============================================

/**
 * Get leads for dashboard
 */
export async function getLeadDashboard(filters?: {
  journey_stage?: JourneyStage;
  priority_tier?: string;
  min_score?: number;
  limit?: number;
}): Promise<LeadDashboardItem[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  try {
    let query = supabase
      .from("v_lead_dashboard")
      .select("*")
      .order("score", { ascending: false });

    if (filters?.journey_stage) {
      query = query.eq("journey_stage", filters.journey_stage);
    }
    if (filters?.priority_tier) {
      query = query.eq("priority_tier", filters.priority_tier);
    }
    if (filters?.min_score) {
      query = query.gte("score", filters.min_score);
    }

    const limit = filters?.limit || 100;
    query = query.limit(limit);

    const { data, error } = await query;

    if (error) throw error;
    return (data || []) as LeadDashboardItem[];
  } catch (error) {
    console.error("Error getting lead dashboard:", error);
    return [];
  }
}

/**
 * Get lead statistics
 */
export async function getLeadProfileStats(): Promise<{
  total: number;
  byStage: Record<JourneyStage, number>;
  byPriority: Record<string, number>;
  avgScore: number;
  recentAlerts: number;
}> {
  const supabase = getSupabaseClient();
  const defaultStats = {
    total: 0,
    byStage: {
      anonymous: 0,
      identified: 0,
      engaged: 0,
      qualified: 0,
      opportunity: 0,
    },
    byPriority: { P1: 0, P2: 0, P3: 0, P4: 0 },
    avgScore: 0,
    recentAlerts: 0,
  };

  if (!supabase) return defaultStats;

  try {
    // Get total and average score
    const { data: profiles } = await supabase
      .from("lead_profiles")
      .select("journey_stage, priority_tier, composite_score");

    if (!profiles || profiles.length === 0) return defaultStats;

    const byStage: Record<JourneyStage, number> = {
      anonymous: 0,
      identified: 0,
      engaged: 0,
      qualified: 0,
      opportunity: 0,
    };

    const byPriority: Record<string, number> = { P1: 0, P2: 0, P3: 0, P4: 0 };

    let totalScore = 0;
    for (const profile of profiles) {
      byStage[profile.journey_stage as JourneyStage]++;
      byPriority[profile.priority_tier]++;
      totalScore += profile.composite_score || 0;
    }

    // Get recent alerts count
    const { count: recentAlerts } = await supabase
      .from("lead_alerts")
      .select("*", { count: "exact", head: true })
      .eq("status", "active")
      .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    return {
      total: profiles.length,
      byStage,
      byPriority,
      avgScore: profiles.length > 0 ? Math.round(totalScore / profiles.length) : 0,
      recentAlerts: recentAlerts || 0,
    };
  } catch (error) {
    console.error("Error getting lead profile stats:", error);
    return defaultStats;
  }
}

// ============================================
// MIGRATION HELPERS
// ============================================

/**
 * Migrate existing lead_intelligence records to lead_profiles
 * This should be called once after schema migration
 */
export async function migrateExistingLeads(): Promise<number> {
  const supabase = getSupabaseClient();
  if (!supabase) return 0;

  try {
    // Call the database function
    const { data, error } = await supabase.rpc("migrate_existing_leads");

    if (error) throw error;
    return data as number;
  } catch (error) {
    console.error("Error migrating existing leads:", error);
    return 0;
  }
}

// ============================================
// INTEGRATION WITH EXISTING SYSTEM
// ============================================

/**
 * Process a chat message and update both old and new systems
 * This maintains backward compatibility while adding V2 features
 */
export async function processMessageForV2Intelligence(
  sessionId: string,
  userMessage: string,
  userInfo: {
    name?: string;
    email?: string;
    company?: string;
    jobTitle?: string;
  },
  pageUrl?: string
): Promise<{
  profile: LeadProfile | null;
  alerts: LeadAlert[];
  journeyChanged: boolean;
}> {
  if (!userInfo.email) {
    return { profile: null, alerts: [], journeyChanged: false };
  }

  try {
    // Get or create profile
    const profile = await getOrCreateLeadProfile(
      userInfo.email,
      sessionId
    );

    if (!profile) {
      return { profile: null, alerts: [], journeyChanged: false };
    }

    // Update company intel if we have new info
    if (userInfo.company || userInfo.jobTitle) {
      const updatedIntel = {
        ...profile.company_intel,
        company_name: userInfo.company || profile.company_intel?.company_name,
      };
      await updateLeadProfile(profile.id, { company_intel: updatedIntel });
    }

    // Record the chat event
    const event = await recordTouchpointEvent(
      profile.id,
      "chat",
      "message",
      {
        message_preview: userMessage.substring(0, 100),
        user_name: userInfo.name,
        user_company: userInfo.company,
        user_job_title: userInfo.jobTitle,
      },
      userMessage,
      pageUrl,
      sessionId
    );

    // Get updated profile
    const updatedProfile = await getLeadProfile(profile.id);

    // Check for journey changes
    const journeyChanged = updatedProfile?.journey_stage !== profile.journey_stage;

    // Get any new alerts
    const alerts = event
      ? evaluateAlerts(updatedProfile || profile, event)
      : [];

    return {
      profile: updatedProfile,
      alerts,
      journeyChanged,
    };
  } catch (error) {
    console.error("Error processing message for V2 intelligence:", error);
    return { profile: null, alerts: [], journeyChanged: false };
  }
}
