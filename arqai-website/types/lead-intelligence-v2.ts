/**
 * Lead Intelligence Engine V2 Types
 *
 * These types support the enhanced lead scoring system with:
 * - Multi-source touchpoint aggregation
 * - Time-decayed scoring
 * - Journey stage tracking
 * - Smart alerts
 *
 * BACKWARD COMPATIBILITY: These types are ADDITIVE.
 * Existing types in types/index.ts are unchanged.
 */

// ============================================
// JOURNEY & PRIORITY TYPES
// ============================================

export type JourneyStage =
  | "anonymous"
  | "identified"
  | "engaged"
  | "qualified"
  | "opportunity";

export type PriorityTier = "P1" | "P2" | "P3" | "P4";

export type AlertPriority = "critical" | "high" | "medium" | "low";

export type AlertStatus = "active" | "acknowledged" | "dismissed" | "actioned";

export type TouchpointSource =
  | "chat"
  | "contact_form"
  | "resource_download"
  | "webinar"
  | "page_view"
  | "newsletter";

export type RecommendedChannel = "phone" | "email" | "chat" | "meeting";

export type PipelineStatus =
  | "new"
  | "researching"
  | "contacted"
  | "in_conversation"
  | "meeting_booked"
  | "won"
  | "lost"
  | "nurture";

// ============================================
// SIGNAL TYPES
// ============================================

export type SignalCategory =
  | "purchase_intent"
  | "timeline"
  | "authority"
  | "compliance"
  | "technical"
  | "competitive"
  | "pain"
  | "product"
  | "engagement"
  | "disqualifying";

export interface SignalDefinition {
  id: string;
  signal_type: string;
  category: SignalCategory;
  base_weight: number;
  decay_half_life_days: number;
  patterns: string[];
  is_negative: boolean;
  is_active: boolean;
  description?: string;
}

export interface ScoredSignal {
  type: string;
  category: SignalCategory;
  raw_weight: number;
  confidence: number;
  timestamp: string;
  source: TouchpointSource;
  content?: string;
  decay_factor?: number;
  decayed_score?: number;
}

// ============================================
// TOUCHPOINT TYPES
// ============================================

export interface TouchpointEvent {
  id: string;
  lead_profile_id: string;
  source: TouchpointSource;
  event_type: string;
  event_data: Record<string, unknown>;
  signals: ScoredSignal[];
  raw_score_contribution: number;
  page_url?: string;
  session_id?: string;
  created_at: string;
}

export interface ChatTouchpoint {
  conversation_id: string;
  message_count: number;
  signals_detected: string[];
  timestamp: string;
}

export interface ContactFormTouchpoint {
  submission_id: string;
  inquiry_type: string;
  signals_detected: string[];
  timestamp: string;
}

export interface ResourceDownloadTouchpoint {
  resource_id: string;
  resource_type: "whitepaper" | "case_study" | "datasheet";
  resource_title: string;
  timestamp: string;
}

export interface WebinarTouchpoint {
  webinar_id: string;
  webinar_title: string;
  registration_type: "live" | "on_demand";
  attended: boolean;
  timestamp: string;
}

export interface PageViewTouchpoint {
  page_url: string;
  page_type: string;
  duration_seconds?: number;
  timestamp: string;
}

export interface NewsletterTouchpoint {
  signup_source: string;
  timestamp: string;
}

export interface AggregatedTouchpoints {
  chat: ChatTouchpoint[];
  contact_forms: ContactFormTouchpoint[];
  resource_downloads: ResourceDownloadTouchpoint[];
  webinar_registrations: WebinarTouchpoint[];
  page_views: PageViewTouchpoint[];
  newsletter_signups: NewsletterTouchpoint[];
}

// ============================================
// COMPANY INTELLIGENCE TYPES
// ============================================

export interface CompanyIntelligence {
  company_name?: string;
  size?: "startup" | "smb" | "mid-market" | "enterprise";
  industry?: string;
  compliance_frameworks?: string[];
  technology_stack?: string[];
  estimated_employees?: number;
  source?: "manual" | "clearbit" | "zoominfo" | "inferred" | "domain";
  confidence?: number;
}

export interface DomainIntelligence {
  id: string;
  domain: string;
  company_name?: string;
  company_size?: "startup" | "smb" | "mid-market" | "enterprise";
  industry?: string;
  compliance_frameworks: string[];
  source: "manual" | "clearbit" | "zoominfo" | "inferred";
  confidence: number;
}

// ============================================
// LEAD PROFILE TYPES
// ============================================

export interface LeadProfile {
  id: string;
  user_id?: string;
  canonical_email?: string;
  session_ids: string[];

  // Contact information
  first_name?: string;
  last_name?: string;
  company?: string;
  job_title?: string;
  phone?: string;

  // Aggregated touchpoints
  touchpoints: AggregatedTouchpoints;

  // Scored signals (with timestamps for decay)
  scored_signals: ScoredSignal[];

  // Company intelligence
  company_intel: CompanyIntelligence;

  // Computed scores
  raw_score: number;
  decay_adjusted_score: number;
  engagement_velocity: number;
  icp_fit_score: number;
  composite_score: number;
  intent_score: number;
  engagement_score: number;

  // Journey tracking
  journey_stage: JourneyStage;

  // Priority and qualification
  priority_tier: PriorityTier;
  /** Manual override of the computed priority_tier, set by an admin. */
  priority_tier_override?: PriorityTier;

  // Pipeline movement (Lead Command Center)
  pipeline_status?: PipelineStatus;
  next_step?: string;
  next_step_due_at?: string;
  last_contacted_at?: string;

  // Predictive insights
  recommended_action?: string;
  recommended_channel?: RecommendedChannel;
  ideal_outreach_window?: string;

  // Engagement metrics
  total_touchpoints: number;
  days_since_first_touch: number;
  days_since_last_touch: number;

  // Timestamps
  first_touch: string;
  last_touch: string;
  score_calculated_at: string;
  created_at: string;
  updated_at: string;
}

// ============================================
// JOURNEY TRANSITION TYPES
// ============================================

export interface JourneyTransition {
  id: string;
  lead_profile_id: string;
  from_stage: JourneyStage;
  to_stage: JourneyStage;
  trigger_type: string;
  trigger_details: Record<string, unknown>;
  score_at_transition: number;
  created_at: string;
}

export type JourneyTrigger =
  | "email_captured"
  | "newsletter_signup"
  | "webinar_registration"
  | "second_session"
  | "chat_conversation_3_plus"
  | "resource_download"
  | "multiple_page_views_5_plus"
  | "demo_request"
  | "contact_form_submission"
  | "score_threshold_60"
  | "enterprise_with_score_40"
  | "decision_maker_engaged"
  | "meeting_scheduled"
  | "sales_qualified"
  | "proposal_requested";

// ============================================
// ALERT TYPES
// ============================================

export interface LeadAlert {
  id: string;
  lead_profile_id: string;
  alert_type: string;
  priority: AlertPriority;
  title: string;
  message: string;
  suggested_action?: string;
  status: AlertStatus;
  acknowledged_at?: string;
  acknowledged_by?: string;
  expires_at?: string;
  trigger_event: Record<string, unknown>;
  created_at: string;
}

export type AlertType =
  | "hot_lead_new"
  | "engagement_surge"
  | "competitor_mention"
  | "dormant_high_value"
  | "demo_page_visit"
  | "compliance_urgency"
  | "decision_maker_engaged"
  | "journey_stage_change"
  | "score_threshold_reached";

export interface AlertRule {
  type: AlertType;
  priority: AlertPriority;
  ttlHours: number;
  condition: (profile: LeadProfile, event?: TouchpointEvent) => boolean;
  getMessage: (profile: LeadProfile) => string;
  getSuggestedAction: (profile: LeadProfile) => string;
}

// ============================================
// SCORING CONFIGURATION TYPES
// ============================================

export interface DecayConfig {
  halfLifeDays: number;
  minFactor: number; // Floor for decay (e.g., 0.1 = never goes below 10%)
}

export interface SourceConfig {
  multiplier: number;
  decayConfig: DecayConfig;
}

export interface ScoringConfig {
  sources: Record<TouchpointSource, SourceConfig>;
  velocityBonus: {
    threshold3: number; // Bonus for 3+ events in 48h
    threshold5: number; // Bonus for 5+ events in 48h
  };
  icpCriteria: {
    preferredIndustries: string[];
    preferredSizes: string[];
    requiredCompliance: string[];
  };
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface LeadDashboardItem {
  profile_id: string;
  user_id?: string;
  name?: string;
  email?: string;
  company?: string;
  job_title?: string;
  score: number;
  journey_stage: JourneyStage;
  priority_tier: PriorityTier;
  industry?: string;
  company_size?: string;
  total_touchpoints: number;
  days_since_last_touch: number;
  recommended_action?: string;
  recommended_channel?: RecommendedChannel;
  first_touch: string;
  last_touch: string;
  updated_at: string;
  // Legacy fields for compatibility
  intent_category?: string;
  urgency?: string;
  qualification_status?: string;
}

export interface LeadProfileWithUser extends LeadProfile {
  user?: {
    id: string;
    name?: string;
    email?: string;
    company?: string;
    job_title?: string;
  };
}

export interface ActiveAlert extends LeadAlert {
  canonical_email?: string;
  lead_name?: string;
  lead_company?: string;
}

// ============================================
// PREDICTIVE INSIGHTS TYPES
// ============================================

export interface PredictiveInsights {
  priority_tier: PriorityTier;
  recommended_action: string;
  recommended_channel: RecommendedChannel;
  ideal_outreach_window?: string;
  buy_signal_strength: "strong" | "moderate" | "weak";
  fit_score: number;
  engagement_trend: "increasing" | "stable" | "declining";
}

// ============================================
// EVENT PROCESSING TYPES
// ============================================

export interface ProcessedEvent {
  profile_id: string;
  signals_detected: ScoredSignal[];
  score_change: number;
  journey_transition?: JourneyTransition;
  alerts_triggered: LeadAlert[];
}

export interface EventProcessingResult {
  success: boolean;
  profile?: LeadProfile;
  processed_event?: ProcessedEvent;
  error?: string;
}

// ============================================
// LEAD INTELLIGENCE AGENT TYPES
// ============================================

export type AgentRunTriggerSource =
  | "contact_form"
  | "partner_form"
  | "resource_download"
  | "chat_identified"
  | "manual_rerun";

export type AgentRunStatus =
  | "queued"
  | "running"
  | "completed"
  | "failed"
  | "skipped";

export interface AgentRun {
  id: string;
  lead_profile_id: string;
  trigger_source: AgentRunTriggerSource;
  trigger_details: Record<string, unknown>;
  status: AgentRunStatus;
  attempts: number;
  error_message?: string;
  started_at?: string;
  completed_at?: string;
  duration_ms?: number;
  model_used?: string;
  web_search_used?: boolean;
  created_at: string;
  updated_at: string;
}

/** A sales objection paired with a suggested response. */
export interface DossierObjection {
  objection: string;
  response: string;
}

export interface DossierPerson {
  seniority?: string;
  role?: string;
  responsibilities?: string;
  decision_maker?: boolean;
  notes?: string;
}

export interface DossierCompany {
  name?: string;
  size?: string;
  industry?: string;
  description?: string;
  tech_stack?: string[];
  compliance?: string[];
  recent_news?: string;
}

export interface DossierIndustry {
  dynamics?: string;
  regulatory_pressure?: string;
  ai_adoption?: string;
}

export interface DossierIntent {
  classified_intent?: string;
  urgency?: "high" | "medium" | "low";
  evidence?: string[];
}

export interface DossierSalesApproach {
  angle?: string;
  talking_points?: string[];
  objections?: DossierObjection[];
  recommended_channel?: RecommendedChannel | string;
  next_step?: string;
}

export type DraftEmailStatus = "draft" | "sent" | "discarded";

export interface DossierDraftEmail {
  subject?: string;
  body?: string;
  status?: DraftEmailStatus;
  sent_at?: string;
}

export interface LeadDossier {
  id: string;
  lead_profile_id: string;
  agent_run_id?: string;
  person: DossierPerson;
  company: DossierCompany;
  industry: DossierIndustry;
  intent: DossierIntent;
  sales_approach: DossierSalesApproach;
  draft_email: DossierDraftEmail;
  summary?: string;
  confidence?: number;
  sources?: string[];
  created_at: string;
}

export type LeadActivityType =
  | "note"
  | "stage_change"
  | "status_change"
  | "contacted"
  | "task"
  | "task_completed"
  | "email_draft_sent"
  | "research_rerun"
  | "priority_change";

export interface LeadActivity {
  id: string;
  lead_profile_id: string;
  activity_type: LeadActivityType;
  body?: string;
  metadata: Record<string, unknown>;
  due_at?: string;
  completed_at?: string;
  created_by: string;
  created_at: string;
}

// ============================================
// UNIFIED JOURNEY TYPES
// ============================================

export type JourneyEventKind =
  | "page_view"
  | "touchpoint"
  | "form_submission"
  | "chat_message"
  | "journey_transition"
  | "agent_run"
  | "activity"
  | "email";

export interface UnifiedJourneyEvent {
  id: string;
  kind: JourneyEventKind;
  occurred_at: string;
  session_id?: string;
  title: string;
  detail?: string;
  meta?: Record<string, unknown>;
}

export interface JourneyVisit {
  visit_number: number;
  session_id?: string;
  started_at: string;
  ended_at: string;
  source?: string;
  events: UnifiedJourneyEvent[];
}

export interface UnifiedJourney {
  visits: JourneyVisit[];
  events: UnifiedJourneyEvent[];
}

// ============================================
// LEAD EMAILS (AI-assisted composer)
// ============================================

export type LeadEmailStatus = "draft" | "sent" | "failed";
export type LeadEmailAuthor = "ai" | "human" | "ai_edited";

export interface LeadEmail {
  id: string;
  lead_profile_id: string;
  dossier_id?: string | null;
  direction: "outbound";
  status: LeadEmailStatus;
  subject: string;
  body: string;
  generated_by: LeadEmailAuthor;
  /** The instruction the admin gave the AI when this draft was generated. */
  instruction?: string | null;
  resend_id?: string | null;
  sent_at?: string | null;
  created_at: string;
  updated_at: string;
}
