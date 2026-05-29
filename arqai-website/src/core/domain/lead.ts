/**
 * Lead Domain Model
 *
 * Represents a qualified lead with scoring, intelligence,
 * and journey tracking capabilities.
 */

import type { User, UserResearch } from "./user";

/**
 * Lead intent categories for qualification
 */
export type IntentCategory = "hot" | "warm" | "cold";

/**
 * Urgency level for lead prioritization
 */
export type UrgencyLevel = "immediate" | "high" | "medium" | "low";

/**
 * Company size classification
 */
export type CompanySize = "startup" | "smb" | "mid-market" | "enterprise";

/**
 * Lead qualification status
 */
export type QualificationStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "opportunity"
  | "customer"
  | "nurture"
  | "unqualified";

/**
 * Journey stage tracking
 */
export type JourneyStage =
  | "anonymous"
  | "identified"
  | "engaged"
  | "qualified"
  | "opportunity";

/**
 * Priority tier for lead routing
 */
export type PriorityTier = "P1" | "P2" | "P3" | "P4";

/**
 * Behavioral signal types detected from user interactions
 */
export type BehavioralSignalType =
  | "pricing_interest"
  | "competitor_mention"
  | "timeline_mention"
  | "pain_point"
  | "feature_interest"
  | "demo_request"
  | "compliance_mention"
  | "integration_question";

/**
 * A detected behavioral signal from user interactions
 */
export interface BehavioralSignal {
  type: BehavioralSignalType;
  timestamp: Date;
  content: string;
  confidence: number;
  details?: string;
}

/**
 * Company research/enrichment data
 */
export interface CompanyResearch {
  name?: string;
  industry?: string;
  size?: CompanySize;
  revenue?: string;
  complianceRequirements?: string[];
  technologyStack?: string[];
  employeeCount?: number;
  source?: "manual" | "clearbit" | "zoominfo" | "inferred" | "domain";
}

/**
 * Core lead intelligence entity
 */
export interface LeadIntelligence {
  id: string;
  userId: string;
  user: User;

  // Scoring
  score: number;
  intentScore: number;
  engagementScore: number;
  icpFitScore: number;

  // Classification
  intentCategory: IntentCategory;
  urgency: UrgencyLevel;
  qualificationStatus: QualificationStatus;
  journeyStage: JourneyStage;
  priorityTier: PriorityTier;

  // Signals
  behavioralSignals: BehavioralSignal[];

  // Research
  companyResearch?: CompanyResearch;
  userResearch?: UserResearch;

  // Recommendations
  recommendedAction?: string;
  recommendedChannel?: RecommendedChannel;
  idealOutreachWindow?: string;

  // Engagement metrics
  totalTouchpoints: number;
  daysSinceFirstTouch: number;
  daysSinceLastTouch: number;

  // Timestamps
  firstTouch: Date;
  lastTouch: Date;
  scoreCalculatedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type RecommendedChannel = "phone" | "email" | "chat" | "meeting";

/**
 * Touchpoint sources for lead tracking
 */
export type TouchpointSource =
  | "chat"
  | "contact_form"
  | "resource_download"
  | "webinar"
  | "page_view"
  | "newsletter";

/**
 * A touchpoint event in the lead journey
 */
export interface TouchpointEvent {
  id: string;
  leadProfileId: string;
  source: TouchpointSource;
  eventType: string;
  eventData: Record<string, unknown>;
  pageUrl?: string;
  sessionId?: string;
  scoreContribution: number;
  createdAt: Date;
}

/**
 * Lead alert for sales team notifications
 */
export interface LeadAlert {
  id: string;
  leadProfileId: string;
  alertType: AlertType;
  priority: AlertPriority;
  title: string;
  message: string;
  suggestedAction?: string;
  status: AlertStatus;
  acknowledgedAt?: Date;
  acknowledgedBy?: string;
  expiresAt?: Date;
  triggerEvent: Record<string, unknown>;
  createdAt: Date;
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

export type AlertPriority = "critical" | "high" | "medium" | "low";
export type AlertStatus = "active" | "acknowledged" | "dismissed" | "actioned";
