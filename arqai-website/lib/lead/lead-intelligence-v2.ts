/**
 * Lead Intelligence Engine V2
 *
 * Enhanced lead scoring system with:
 * - Multi-source touchpoint aggregation
 * - Time-decayed exponential scoring
 * - Journey stage state machine
 * - Smart alerts
 * - Predictive insights
 *
 * BACKWARD COMPATIBILITY:
 * This module runs ALONGSIDE the existing lead-intelligence.ts.
 * The original module continues to work unchanged.
 * This module provides enhanced functionality via new tables.
 */

import {
  LeadProfile,
  ScoredSignal,
  TouchpointEvent,
  JourneyStage,
  JourneyTransition,
  JourneyTrigger,
  PriorityTier,
  AlertPriority,
  LeadAlert,
  AlertType,
  AlertRule,
  TouchpointSource,
  SignalDefinition,
  CompanyIntelligence,
  PredictiveInsights,
  ScoringConfig,
  ProcessedEvent,
  AggregatedTouchpoints,
} from "@/types/lead-intelligence-v2";

// ============================================
// CONFIGURATION
// ============================================

/**
 * Default scoring configuration
 * Can be overridden per-deployment
 */
export const DEFAULT_SCORING_CONFIG: ScoringConfig = {
  sources: {
    chat: { multiplier: 1.0, decayConfig: { halfLifeDays: 7, minFactor: 0.1 } },
    contact_form: { multiplier: 1.2, decayConfig: { halfLifeDays: 14, minFactor: 0.15 } },
    resource_download: { multiplier: 0.8, decayConfig: { halfLifeDays: 21, minFactor: 0.2 } },
    webinar: { multiplier: 0.9, decayConfig: { halfLifeDays: 14, minFactor: 0.15 } },
    page_view: { multiplier: 0.6, decayConfig: { halfLifeDays: 7, minFactor: 0.05 } },
    newsletter: { multiplier: 0.3, decayConfig: { halfLifeDays: 30, minFactor: 0.1 } },
  },
  velocityBonus: {
    threshold3: 8,  // +8 points for 3+ events in 48h
    threshold5: 15, // +15 points for 5+ events in 48h
  },
  icpCriteria: {
    preferredIndustries: ["Financial Services", "Healthcare", "Insurance", "Government"],
    preferredSizes: ["enterprise", "mid-market"],
    requiredCompliance: ["HIPAA", "SOX", "GDPR", "FINRA", "NAIC"],
  },
};

// ============================================
// DECAY CALCULATION
// ============================================

/**
 * Calculate exponential decay factor
 * Uses formula: W = e^(-λt) where λ = ln(2) / half_life
 *
 * @param eventTimestamp - When the event occurred
 * @param halfLifeDays - Half-life in days (score halves after this period)
 * @param minFactor - Minimum decay factor (floor)
 * @returns Decay factor between minFactor and 1.0
 */
export function calculateDecayFactor(
  eventTimestamp: Date | string,
  halfLifeDays: number,
  minFactor: number = 0.1
): number {
  const now = new Date();
  const eventDate = typeof eventTimestamp === "string" ? new Date(eventTimestamp) : eventTimestamp;
  const daysSince = (now.getTime() - eventDate.getTime()) / (1000 * 60 * 60 * 24);

  if (daysSince <= 0) return 1.0;

  const decayConstant = Math.LN2 / halfLifeDays;
  const decayFactor = Math.exp(-decayConstant * daysSince);

  return Math.max(decayFactor, minFactor);
}

/**
 * Calculate decay-adjusted score for a set of signals
 */
export function calculateDecayedScore(
  signals: ScoredSignal[],
  config: ScoringConfig = DEFAULT_SCORING_CONFIG
): number {
  let totalScore = 0;
  const signalTypeStacks = new Map<string, number>();

  for (const signal of signals) {
    // Get source configuration
    const sourceConfig = config.sources[signal.source] || config.sources.page_view;

    // Calculate decay factor
    const decayFactor = calculateDecayFactor(
      signal.timestamp,
      sourceConfig.decayConfig.halfLifeDays,
      sourceConfig.decayConfig.minFactor
    );

    // Calculate signal stacking bonus (diminishing returns)
    const stackCount = signalTypeStacks.get(signal.type) || 0;
    const stackMultiplier = 1 + Math.log(stackCount + 1) * 0.2;
    signalTypeStacks.set(signal.type, stackCount + 1);

    // Calculate final signal contribution
    const signalScore =
      signal.raw_weight *
      signal.confidence *
      decayFactor *
      sourceConfig.multiplier *
      stackMultiplier;

    totalScore += signalScore;
  }

  return Math.min(totalScore, 100);
}

/**
 * Calculate engagement velocity bonus
 * Rewards concentrated recent activity
 */
export function calculateVelocityBonus(
  events: TouchpointEvent[],
  config: ScoringConfig = DEFAULT_SCORING_CONFIG
): number {
  const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
  const recentEvents = events.filter(
    (e) => new Date(e.created_at) > fortyEightHoursAgo
  );

  if (recentEvents.length >= 5) return config.velocityBonus.threshold5;
  if (recentEvents.length >= 3) return config.velocityBonus.threshold3;
  return 0;
}

/**
 * Calculate ICP (Ideal Customer Profile) fit score
 */
export function calculateICPFit(
  companyIntel: CompanyIntelligence,
  config: ScoringConfig = DEFAULT_SCORING_CONFIG
): number {
  let fitScore = 0;
  const maxScore = 100;
  const criteria = config.icpCriteria;

  // Industry match (40 points)
  if (companyIntel.industry) {
    if (criteria.preferredIndustries.includes(companyIntel.industry)) {
      fitScore += 40;
    } else {
      fitScore += 15; // Partial credit for identified industry
    }
  }

  // Company size match (30 points)
  if (companyIntel.size) {
    if (criteria.preferredSizes.includes(companyIntel.size)) {
      fitScore += 30;
    } else if (companyIntel.size === "smb") {
      fitScore += 15; // Partial credit
    }
  }

  // Compliance requirements match (30 points)
  if (companyIntel.compliance_frameworks && companyIntel.compliance_frameworks.length > 0) {
    const matchingFrameworks = companyIntel.compliance_frameworks.filter((f) =>
      criteria.requiredCompliance.includes(f)
    );
    const complianceScore = (matchingFrameworks.length / criteria.requiredCompliance.length) * 30;
    fitScore += Math.min(complianceScore, 30);
  }

  return Math.min(fitScore, maxScore);
}

/**
 * Calculate composite score combining all factors
 */
export function calculateCompositeScore(
  decayedScore: number,
  velocityBonus: number,
  icpFitScore: number
): number {
  // Weighted combination: 60% behavior, 15% velocity, 25% fit
  const behaviorWeight = 0.6;
  const velocityWeight = 0.15;
  const fitWeight = 0.25;

  const composite =
    decayedScore * behaviorWeight +
    velocityBonus * velocityWeight * 6.67 + // Normalize velocity (max 15 -> max 100)
    icpFitScore * fitWeight;

  return Math.min(Math.round(composite * 100) / 100, 100);
}

// ============================================
// SIGNAL DETECTION
// ============================================

/**
 * Default signal patterns (loaded from DB in production)
 */
export const DEFAULT_SIGNAL_PATTERNS: Partial<SignalDefinition>[] = [
  // Purchase Intent
  {
    signal_type: "demo_request",
    category: "purchase_intent",
    base_weight: 45,
    decay_half_life_days: 7,
    patterns: ["demo", "trial", "poc", "proof of concept", "pilot", "schedule", "book", "meeting"],
  },
  {
    signal_type: "pricing_interest",
    category: "purchase_intent",
    base_weight: 40,
    decay_half_life_days: 7,
    patterns: ["cost", "price", "pricing", "budget", "investment", "roi", "quote", "proposal"],
  },
  // Timeline
  {
    signal_type: "immediate_urgency",
    category: "timeline",
    base_weight: 45,
    decay_half_life_days: 3,
    patterns: ["asap", "urgent", "immediately", "right away", "today", "this week"],
  },
  {
    signal_type: "timeline_mention",
    category: "timeline",
    base_weight: 35,
    decay_half_life_days: 7,
    patterns: ["timeline", "deadline", "this quarter", "q1", "q2", "q3", "q4", "next month", "board meeting"],
  },
  // Authority
  {
    signal_type: "decision_maker",
    category: "authority",
    base_weight: 35,
    decay_half_life_days: 14,
    patterns: ["i decide", "my team", "we're evaluating", "i'm responsible", "my budget"],
  },
  // Compliance
  {
    signal_type: "compliance_mention",
    category: "compliance",
    base_weight: 35,
    decay_half_life_days: 21,
    patterns: ["hipaa", "gdpr", "sox", "finra", "naic", "eu ai act", "compliance", "audit", "governance"],
  },
  // Technical
  {
    signal_type: "integration_question",
    category: "technical",
    base_weight: 25,
    decay_half_life_days: 14,
    patterns: ["integrate", "api", "connect", "work with", "compatible", "snowflake", "azure", "aws"],
  },
  // Competitive
  {
    signal_type: "competitor_mention",
    category: "competitive",
    base_weight: 30,
    decay_half_life_days: 7,
    patterns: ["competitor", "alternative", "compare", "vs", "versus", "switch from", "currently using"],
  },
  // Pain
  {
    signal_type: "pain_point",
    category: "pain",
    base_weight: 25,
    decay_half_life_days: 14,
    patterns: ["challenge", "problem", "struggle", "difficult", "pain point", "frustrated", "manual process"],
  },
  // Disqualifying (negative)
  {
    signal_type: "no_budget",
    category: "disqualifying",
    base_weight: -25,
    decay_half_life_days: 14,
    patterns: ["no budget", "not looking to buy", "just curious", "free only"],
    is_negative: true,
  },
];

/**
 * Detect signals from text content
 */
export function detectSignals(
  content: string,
  source: TouchpointSource,
  signalDefinitions: Partial<SignalDefinition>[] = DEFAULT_SIGNAL_PATTERNS
): ScoredSignal[] {
  const signals: ScoredSignal[] = [];
  const contentLower = content.toLowerCase();
  const timestamp = new Date().toISOString();
  const detectedTypes = new Set<string>();

  for (const definition of signalDefinitions) {
    if (!definition.patterns || !definition.signal_type) continue;
    if (detectedTypes.has(definition.signal_type)) continue;

    for (const pattern of definition.patterns) {
      if (contentLower.includes(pattern.toLowerCase())) {
        // Calculate confidence based on pattern specificity
        const confidence = pattern.length > 10 ? 0.9 : 0.7;

        signals.push({
          type: definition.signal_type,
          category: definition.category || "engagement",
          raw_weight: definition.base_weight || 10,
          confidence,
          timestamp,
          source,
          content: content.substring(0, 200),
        });

        detectedTypes.add(definition.signal_type);
        break;
      }
    }
  }

  return signals;
}

// ============================================
// JOURNEY STAGE EVALUATION
// ============================================

/**
 * Journey transition rules
 */
const JOURNEY_TRANSITIONS: Record<
  JourneyStage,
  Array<{ next: JourneyStage; triggers: JourneyTrigger[] }>
> = {
  anonymous: [
    {
      next: "identified",
      triggers: ["email_captured", "newsletter_signup", "webinar_registration"],
    },
  ],
  identified: [
    {
      next: "engaged",
      triggers: [
        "second_session",
        "chat_conversation_3_plus",
        "resource_download",
        "multiple_page_views_5_plus",
      ],
    },
  ],
  engaged: [
    {
      next: "qualified",
      triggers: [
        "demo_request",
        "contact_form_submission",
        "score_threshold_60",
        "enterprise_with_score_40",
        "decision_maker_engaged",
      ],
    },
  ],
  qualified: [
    {
      next: "opportunity",
      triggers: ["meeting_scheduled", "sales_qualified", "proposal_requested"],
    },
  ],
  opportunity: [], // Terminal stage (manual progression from here)
};

/**
 * Check if a trigger condition is met
 */
export function checkTriggerCondition(
  profile: LeadProfile,
  trigger: JourneyTrigger,
  events: TouchpointEvent[] = []
): boolean {
  switch (trigger) {
    case "email_captured":
      return !!profile.canonical_email;

    case "newsletter_signup":
      return profile.touchpoints.newsletter_signups.length > 0;

    case "webinar_registration":
      return profile.touchpoints.webinar_registrations.length > 0;

    case "second_session":
      return profile.session_ids.length >= 2;

    case "chat_conversation_3_plus":
      return profile.touchpoints.chat.some((c) => c.message_count >= 3);

    case "resource_download":
      return profile.touchpoints.resource_downloads.length > 0;

    case "multiple_page_views_5_plus":
      return profile.touchpoints.page_views.length >= 5;

    case "demo_request":
      return profile.scored_signals.some((s) => s.type === "demo_request");

    case "contact_form_submission":
      return profile.touchpoints.contact_forms.length > 0;

    case "score_threshold_60":
      return profile.composite_score >= 60;

    case "enterprise_with_score_40":
      return profile.company_intel?.size === "enterprise" && profile.composite_score >= 40;

    case "decision_maker_engaged":
      return profile.scored_signals.some((s) => s.type === "decision_maker" || s.type === "c_level_title");

    case "meeting_scheduled":
      return events.some((e) => e.event_type === "meeting_scheduled");

    case "sales_qualified":
      return events.some((e) => e.event_type === "sales_qualified");

    case "proposal_requested":
      return profile.scored_signals.some((s) => s.type === "pricing_interest" && s.confidence > 0.8);

    default:
      return false;
  }
}

/**
 * Evaluate if a journey stage transition should occur
 */
export function evaluateJourneyProgression(
  profile: LeadProfile,
  events: TouchpointEvent[] = []
): JourneyTransition | null {
  const currentStage = profile.journey_stage;
  const possibleTransitions = JOURNEY_TRANSITIONS[currentStage];

  for (const transition of possibleTransitions) {
    for (const trigger of transition.triggers) {
      if (checkTriggerCondition(profile, trigger, events)) {
        return {
          id: "", // Will be assigned by DB
          lead_profile_id: profile.id,
          from_stage: currentStage,
          to_stage: transition.next,
          trigger_type: trigger,
          trigger_details: {},
          score_at_transition: profile.composite_score,
          created_at: new Date().toISOString(),
        };
      }
    }
  }

  return null;
}

// ============================================
// PRIORITY TIER CALCULATION
// ============================================

/**
 * Calculate priority tier based on score, company, and journey
 */
export function calculatePriorityTier(
  compositeScore: number,
  companySize: string | undefined,
  journeyStage: JourneyStage
): PriorityTier {
  // P1: Immediate action required
  if (compositeScore >= 70 || journeyStage === "qualified") {
    return "P1";
  }

  // Enterprise leads with decent score = P1
  if (companySize === "enterprise" && compositeScore >= 50) {
    return "P1";
  }

  // P2: Follow up within 24 hours
  if (compositeScore >= 50 || journeyStage === "engaged") {
    return "P2";
  }

  if (companySize === "mid-market" && compositeScore >= 30) {
    return "P2";
  }

  // P3: Standard follow up
  if (compositeScore >= 30) {
    return "P3";
  }

  // P4: Nurture
  return "P4";
}

// ============================================
// ALERT RULES
// ============================================

/**
 * Alert rule definitions
 */
export const ALERT_RULES: AlertRule[] = [
  {
    type: "hot_lead_new",
    priority: "critical",
    ttlHours: 4,
    condition: (profile) =>
      profile.composite_score >= 70 && profile.journey_stage === "qualified",
    getMessage: (profile) =>
      `Hot lead: ${profile.canonical_email || "Unknown"} - Score: ${profile.composite_score}`,
    getSuggestedAction: () => "Call within 1 hour",
  },
  {
    type: "engagement_surge",
    priority: "high",
    ttlHours: 24,
    condition: (profile) => profile.engagement_velocity >= 15,
    getMessage: (profile) =>
      `Engagement surge: ${profile.canonical_email || "Unknown"} - ${profile.total_touchpoints} touchpoints`,
    getSuggestedAction: () => "Send immediate personalized outreach",
  },
  {
    type: "competitor_mention",
    priority: "high",
    ttlHours: 24,
    condition: (profile) =>
      profile.scored_signals.some(
        (s) =>
          s.type === "competitor_mention" &&
          new Date(s.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000)
      ),
    getMessage: (profile) =>
      `Competitor mentioned by ${profile.canonical_email || "Unknown"} - active evaluation`,
    getSuggestedAction: () => "Send comparison content or schedule call",
  },
  {
    type: "dormant_high_value",
    priority: "medium",
    ttlHours: 72,
    condition: (profile) =>
      profile.composite_score >= 50 && profile.days_since_last_touch > 14,
    getMessage: (profile) =>
      `Dormant high-value lead: ${profile.canonical_email || "Unknown"} - no activity for ${profile.days_since_last_touch} days`,
    getSuggestedAction: () => "Re-engagement email with new content",
  },
  {
    type: "demo_page_visit",
    priority: "high",
    ttlHours: 4,
    condition: (profile, event) =>
      !!profile.canonical_email &&
      !!event &&
      event.source === "page_view" &&
      (event.page_url?.includes("/demo") || false),
    getMessage: (profile) =>
      `${profile.canonical_email} visited demo page - high intent`,
    getSuggestedAction: () => "Send personalized demo scheduling link",
  },
];

/**
 * Evaluate alerts for a profile
 */
export function evaluateAlerts(
  profile: LeadProfile,
  event?: TouchpointEvent
): LeadAlert[] {
  const alerts: LeadAlert[] = [];

  for (const rule of ALERT_RULES) {
    if (rule.condition(profile, event)) {
      alerts.push({
        id: "", // Will be assigned by DB
        lead_profile_id: profile.id,
        alert_type: rule.type,
        priority: rule.priority,
        title: rule.type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        message: rule.getMessage(profile),
        suggested_action: rule.getSuggestedAction(profile),
        status: "active",
        expires_at: new Date(Date.now() + rule.ttlHours * 60 * 60 * 1000).toISOString(),
        trigger_event: event ? { event_id: event.id, event_type: event.event_type } : {},
        created_at: new Date().toISOString(),
      });
    }
  }

  return alerts;
}

// ============================================
// PREDICTIVE INSIGHTS
// ============================================

/**
 * Generate predictive insights for a lead
 */
export function generatePredictiveInsights(
  profile: LeadProfile,
  events: TouchpointEvent[] = []
): PredictiveInsights {
  // Calculate engagement trend
  const recentEvents = events.filter(
    (e) => new Date(e.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  );
  const olderEvents = events.filter(
    (e) =>
      new Date(e.created_at) <= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) &&
      new Date(e.created_at) > new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
  );

  let engagementTrend: "increasing" | "stable" | "declining" = "stable";
  if (recentEvents.length > olderEvents.length * 1.5) {
    engagementTrend = "increasing";
  } else if (recentEvents.length < olderEvents.length * 0.5) {
    engagementTrend = "declining";
  }

  // Determine buy signal strength
  const highIntentSignals = profile.scored_signals.filter(
    (s) =>
      s.category === "purchase_intent" ||
      s.category === "timeline" ||
      s.category === "authority"
  );
  let buySignalStrength: "strong" | "moderate" | "weak" = "weak";
  if (highIntentSignals.length >= 3) {
    buySignalStrength = "strong";
  } else if (highIntentSignals.length >= 1) {
    buySignalStrength = "moderate";
  }

  // Generate recommended action
  const recommendedAction = generateRecommendedAction(profile);

  // Determine recommended channel
  const recommendedChannel = determineRecommendedChannel(profile);

  return {
    priority_tier: profile.priority_tier,
    recommended_action: recommendedAction,
    recommended_channel: recommendedChannel,
    ideal_outreach_window: profile.ideal_outreach_window,
    buy_signal_strength: buySignalStrength,
    fit_score: profile.icp_fit_score,
    engagement_trend: engagementTrend,
  };
}

/**
 * Generate recommended action based on profile data
 */
function generateRecommendedAction(profile: LeadProfile): string {
  const signals = profile.scored_signals;

  // Decision tree for next action
  if (signals.some((s) => s.type === "demo_request")) {
    return "Schedule demo within 24 hours - explicit request detected";
  }

  if (profile.company_intel?.compliance_frameworks?.length) {
    const framework = profile.company_intel.compliance_frameworks[0];
    return `Send compliance-specific case study (${framework})`;
  }

  if (signals.some((s) => s.type === "competitor_mention")) {
    return "Send competitive comparison content";
  }

  if (profile.touchpoints.resource_downloads.length > 0) {
    const lastDownload = profile.touchpoints.resource_downloads[0];
    return `Follow up on whitepaper: "${lastDownload.resource_title}"`;
  }

  if (profile.journey_stage === "engaged") {
    return "Invite to upcoming webinar or send relevant case study";
  }

  if (profile.journey_stage === "identified") {
    return "Send educational content to nurture engagement";
  }

  return "Add to nurture sequence";
}

/**
 * Determine recommended outreach channel
 */
function determineRecommendedChannel(profile: LeadProfile): "phone" | "email" | "chat" | "meeting" {
  // Enterprise leads prefer phone
  if (profile.company_intel?.size === "enterprise") {
    return "phone";
  }

  // Chat-engaged leads prefer chat follow-up
  if (profile.touchpoints.chat.length > 2) {
    return "chat";
  }

  // High scores warrant meeting request
  if (profile.composite_score >= 70) {
    return "meeting";
  }

  // Default to email
  return "email";
}

// ============================================
// DOMAIN INTELLIGENCE
// ============================================

/**
 * TLD-based inference rules
 */
const TLD_INFERENCE: Record<string, Partial<CompanyIntelligence>> = {
  ".gov": { size: "enterprise", industry: "Government", compliance_frameworks: ["FedRAMP", "FISMA"] },
  ".edu": { size: "mid-market", industry: "Education", compliance_frameworks: ["FERPA"] },
  ".bank": { size: "enterprise", industry: "Financial Services", compliance_frameworks: ["SOX", "FINRA"] },
  ".org": { size: "mid-market", industry: "Non-Profit" },
};

/**
 * Infer company intelligence from email domain
 */
export function inferFromDomain(email: string): CompanyIntelligence | null {
  const domain = email.split("@")[1]?.toLowerCase();
  if (!domain) return null;

  // Check TLD patterns
  for (const [tld, intel] of Object.entries(TLD_INFERENCE)) {
    if (domain.endsWith(tld)) {
      return {
        ...intel,
        source: "inferred",
        confidence: 0.8,
      } as CompanyIntelligence;
    }
  }

  // Multi-region domain pattern (likely enterprise)
  if (domain.includes(".co.") || domain.includes(".com.")) {
    return {
      size: "enterprise",
      source: "inferred",
      confidence: 0.6,
    };
  }

  return null;
}

// ============================================
// PROFILE MANAGEMENT
// ============================================

/**
 * Create empty touchpoints structure
 */
export function createEmptyTouchpoints(): AggregatedTouchpoints {
  return {
    chat: [],
    contact_forms: [],
    resource_downloads: [],
    webinar_registrations: [],
    page_views: [],
    newsletter_signups: [],
  };
}

/**
 * Update profile scores after new event
 */
export function updateProfileScores(
  profile: LeadProfile,
  events: TouchpointEvent[],
  config: ScoringConfig = DEFAULT_SCORING_CONFIG
): LeadProfile {
  // Recalculate decay-adjusted score
  const decayedScore = calculateDecayedScore(profile.scored_signals, config);

  // Calculate velocity bonus
  const velocityBonus = calculateVelocityBonus(events, config);

  // Calculate ICP fit
  const icpFitScore = calculateICPFit(profile.company_intel, config);

  // Calculate composite score
  const compositeScore = calculateCompositeScore(decayedScore, velocityBonus, icpFitScore);

  // Calculate priority tier
  const priorityTier = calculatePriorityTier(
    compositeScore,
    profile.company_intel?.size,
    profile.journey_stage
  );

  // Calculate days
  const now = new Date();
  const firstTouch = new Date(profile.first_touch);
  const lastTouch = events.length > 0
    ? new Date(Math.max(...events.map((e) => new Date(e.created_at).getTime())))
    : new Date(profile.last_touch);

  return {
    ...profile,
    raw_score: profile.scored_signals.reduce((sum, s) => sum + s.raw_weight * s.confidence, 0),
    decay_adjusted_score: decayedScore,
    engagement_velocity: velocityBonus,
    icp_fit_score: icpFitScore,
    composite_score: compositeScore,
    priority_tier: priorityTier,
    total_touchpoints: events.length,
    days_since_first_touch: Math.floor((now.getTime() - firstTouch.getTime()) / (1000 * 60 * 60 * 24)),
    days_since_last_touch: Math.floor((now.getTime() - lastTouch.getTime()) / (1000 * 60 * 60 * 24)),
    last_touch: lastTouch.toISOString(),
    score_calculated_at: now.toISOString(),
    updated_at: now.toISOString(),
  };
}

/**
 * Process a new event and update profile
 */
export function processEvent(
  profile: LeadProfile,
  event: TouchpointEvent,
  allEvents: TouchpointEvent[]
): ProcessedEvent {
  // Add new signals to profile
  const updatedSignals = [...profile.scored_signals, ...event.signals];

  // Update profile with new signals
  const updatedProfile: LeadProfile = {
    ...profile,
    scored_signals: updatedSignals,
  };

  // Recalculate scores
  const scoredProfile = updateProfileScores(updatedProfile, [...allEvents, event]);

  // Check for journey transition
  const journeyTransition = evaluateJourneyProgression(scoredProfile, [...allEvents, event]);

  // Check for alerts
  const alerts = evaluateAlerts(scoredProfile, event);

  return {
    profile_id: profile.id,
    signals_detected: event.signals,
    score_change: scoredProfile.composite_score - profile.composite_score,
    journey_transition: journeyTransition || undefined,
    alerts_triggered: alerts,
  };
}
