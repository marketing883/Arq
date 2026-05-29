/**
 * Analytics Domain Model
 *
 * Types for analytics, tracking, and consent management.
 */

/**
 * Consent types for GDPR compliance
 */
export type ConsentType = "necessary" | "analytics" | "marketing" | "preferences";

/**
 * Consent record for a user
 */
export interface ConsentRecord {
  id: string;
  userId?: string;
  sessionId: string;
  consents: ConsentPreferences;
  ipAddress?: string;
  userAgent?: string;
  grantedAt: Date;
  updatedAt: Date;
}

export interface ConsentPreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

/**
 * Analytics event
 */
export interface AnalyticsEvent {
  id?: string;
  eventName: string;
  eventData: Record<string, unknown>;
  sessionId: string;
  userId?: string;
  pageUrl: string;
  timestamp: Date;
}

/**
 * Page analytics summary
 */
export interface PageAnalytics {
  path: string;
  pageViews: number;
  uniqueVisitors: number;
  avgTimeOnPage: number;
  bounceRate: number;
  period: AnalyticsPeriod;
}

export interface AnalyticsPeriod {
  start: Date;
  end: Date;
}

/**
 * Lead analytics summary
 */
export interface LeadAnalytics {
  totalLeads: number;
  newLeads: number;
  qualifiedLeads: number;
  conversionRate: number;
  avgScore: number;
  bySource: Record<string, number>;
  byJourneyStage: Record<string, number>;
  period: AnalyticsPeriod;
}

/**
 * Predictive scoring config
 */
export interface PredictiveScoringConfig {
  signals: SignalWeight[];
  velocityBonus: VelocityBonus;
  icpCriteria: ICPCriteria;
}

export interface SignalWeight {
  signalType: string;
  baseWeight: number;
  decayHalfLifeDays: number;
  isNegative: boolean;
}

export interface VelocityBonus {
  threshold3Events: number;
  threshold5Events: number;
  timeWindowHours: number;
}

export interface ICPCriteria {
  preferredIndustries: string[];
  preferredSizes: string[];
  requiredCompliance: string[];
}
