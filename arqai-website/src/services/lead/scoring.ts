/**
 * Lead Scoring Module
 *
 * Calculates lead scores using:
 * - Signal-based scoring with time decay
 * - Engagement velocity bonuses
 * - ICP fit scoring
 */

import type {
  LeadIntelligence,
  TouchpointEvent,
  JourneyStage,
  PriorityTier,
  TouchpointSource,
  CompanySize,
} from "@/src/core";

/**
 * Scoring configuration
 */
export interface ScoringConfig {
  signals: SignalConfig[];
  sourceMultipliers: Record<TouchpointSource, number>;
  velocityBonus: {
    threshold3: number; // Bonus for 3+ events in 48h
    threshold5: number; // Bonus for 5+ events in 48h
    windowHours: number;
  };
  decayHalfLifeDays: number;
  icpCriteria: {
    preferredIndustries: string[];
    preferredSizes: CompanySize[];
    requiredCompliance: string[];
  };
}

export interface SignalConfig {
  type: string;
  category: string;
  baseWeight: number;
  isNegative: boolean;
}

/**
 * Scoring result
 */
export interface ScoreResult {
  compositeScore: number;
  intentScore: number;
  engagementScore: number;
  icpFitScore: number;
  velocityBonus: number;
  signals: Array<{ type: string; weight: number; decayed: number }>;
}

/**
 * Default scoring configuration
 */
const DEFAULT_CONFIG: ScoringConfig = {
  signals: [
    { type: "pricing_interest", category: "purchase_intent", baseWeight: 15, isNegative: false },
    { type: "demo_request", category: "purchase_intent", baseWeight: 25, isNegative: false },
    { type: "timeline_mention", category: "timeline", baseWeight: 20, isNegative: false },
    { type: "competitor_mention", category: "competitive", baseWeight: 10, isNegative: false },
    { type: "pain_point", category: "pain", baseWeight: 12, isNegative: false },
    { type: "feature_interest", category: "product", baseWeight: 8, isNegative: false },
    { type: "compliance_mention", category: "compliance", baseWeight: 15, isNegative: false },
    { type: "integration_question", category: "technical", baseWeight: 10, isNegative: false },
  ],
  sourceMultipliers: {
    chat: 1.5,
    contact_form: 2.0,
    resource_download: 1.3,
    webinar: 1.4,
    page_view: 0.5,
    newsletter: 0.8,
  },
  velocityBonus: {
    threshold3: 5,
    threshold5: 10,
    windowHours: 48,
  },
  decayHalfLifeDays: 14,
  icpCriteria: {
    preferredIndustries: ["financial_services", "healthcare", "technology", "manufacturing"],
    preferredSizes: ["mid-market", "enterprise"],
    requiredCompliance: ["SOC2", "ISO27001", "HIPAA", "GDPR"],
  },
};

/**
 * Calculate comprehensive lead score
 */
export function calculateLeadScore(
  lead: LeadIntelligence,
  touchpoints: TouchpointEvent[],
  config: ScoringConfig = DEFAULT_CONFIG
): ScoreResult {
  const now = new Date();

  // Calculate intent score from behavioral signals
  let intentScore = 0;
  const scoredSignals: Array<{ type: string; weight: number; decayed: number }> = [];

  for (const signal of lead.behavioralSignals) {
    const signalConfig = config.signals.find((s) => s.type === signal.type);
    if (!signalConfig) continue;

    // Apply time decay
    const ageInDays = (now.getTime() - signal.timestamp.getTime()) / (1000 * 60 * 60 * 24);
    const decayFactor = Math.pow(0.5, ageInDays / config.decayHalfLifeDays);
    const decayedWeight = signalConfig.baseWeight * decayFactor * signal.confidence;

    scoredSignals.push({
      type: signal.type,
      weight: signalConfig.baseWeight,
      decayed: decayedWeight,
    });

    if (signalConfig.isNegative) {
      intentScore -= decayedWeight;
    } else {
      intentScore += decayedWeight;
    }
  }

  // Calculate engagement score from touchpoints
  let engagementScore = 0;
  for (const touchpoint of touchpoints) {
    const multiplier = config.sourceMultipliers[touchpoint.source] || 1;
    const ageInDays =
      (now.getTime() - touchpoint.createdAt.getTime()) / (1000 * 60 * 60 * 24);
    const decayFactor = Math.pow(0.5, ageInDays / config.decayHalfLifeDays);
    engagementScore += touchpoint.scoreContribution * multiplier * decayFactor;
  }

  // Calculate velocity bonus
  const velocityBonus = calculateVelocityBonus(touchpoints, config.velocityBonus);

  // Calculate ICP fit score
  const icpFitScore = calculateICPFitScore(lead, config.icpCriteria);

  // Calculate composite score
  const compositeScore = Math.min(
    100,
    Math.max(
      0,
      intentScore * 0.4 + // 40% weight on intent
      engagementScore * 0.3 + // 30% weight on engagement
      icpFitScore * 0.2 + // 20% weight on ICP fit
      velocityBonus * 0.1 // 10% weight on velocity
    )
  );

  return {
    compositeScore: Math.round(compositeScore),
    intentScore: Math.round(intentScore),
    engagementScore: Math.round(engagementScore),
    icpFitScore: Math.round(icpFitScore),
    velocityBonus,
    signals: scoredSignals,
  };
}

/**
 * Calculate velocity bonus based on recent activity
 */
function calculateVelocityBonus(
  touchpoints: TouchpointEvent[],
  config: ScoringConfig["velocityBonus"]
): number {
  const windowStart = new Date(Date.now() - config.windowHours * 60 * 60 * 1000);
  const recentTouchpoints = touchpoints.filter((t) => t.createdAt >= windowStart);

  if (recentTouchpoints.length >= 5) {
    return config.threshold5;
  } else if (recentTouchpoints.length >= 3) {
    return config.threshold3;
  }
  return 0;
}

/**
 * Calculate ICP fit score
 */
function calculateICPFitScore(
  lead: LeadIntelligence,
  criteria: ScoringConfig["icpCriteria"]
): number {
  let score = 0;
  const maxScore = 100;

  // Industry match (30 points)
  if (lead.companyResearch?.industry) {
    if (criteria.preferredIndustries.includes(lead.companyResearch.industry.toLowerCase())) {
      score += 30;
    }
  }

  // Company size match (25 points)
  if (lead.companyResearch?.size) {
    if (criteria.preferredSizes.includes(lead.companyResearch.size)) {
      score += 25;
    }
  }

  // Compliance requirements (25 points)
  if (lead.companyResearch?.complianceRequirements) {
    const matchingCompliance = lead.companyResearch.complianceRequirements.filter((c) =>
      criteria.requiredCompliance.includes(c)
    );
    score += Math.min(25, matchingCompliance.length * 8);
  }

  // Decision maker (20 points)
  if (lead.userResearch?.decisionMaker) {
    score += 20;
  } else if (lead.userResearch?.roleSeniority) {
    const seniorityScores: Record<string, number> = {
      "c-level": 20,
      vp: 15,
      director: 10,
      manager: 5,
      individual: 0,
    };
    score += seniorityScores[lead.userResearch.roleSeniority] || 0;
  }

  return Math.min(maxScore, score);
}

/**
 * Determine journey stage based on lead data and score
 */
export function determineJourneyStage(
  lead: LeadIntelligence,
  scoreResult: ScoreResult
): JourneyStage {
  // Opportunity: High score + decision maker + demo request
  if (
    scoreResult.compositeScore >= 70 &&
    lead.userResearch?.decisionMaker &&
    lead.behavioralSignals.some((s) => s.type === "demo_request")
  ) {
    return "opportunity";
  }

  // Qualified: Score >= 60 or enterprise with score >= 40
  if (scoreResult.compositeScore >= 60) {
    return "qualified";
  }
  if (lead.companyResearch?.size === "enterprise" && scoreResult.compositeScore >= 40) {
    return "qualified";
  }

  // Engaged: Multiple touchpoints or high engagement
  if (lead.totalTouchpoints >= 3 || scoreResult.engagementScore >= 30) {
    return "engaged";
  }

  // Identified: Has email
  if (lead.user?.email) {
    return "identified";
  }

  return "anonymous";
}

/**
 * Determine priority tier based on lead data and score
 */
export function determinePriorityTier(
  lead: LeadIntelligence,
  scoreResult: ScoreResult
): PriorityTier {
  // P1: Hot leads - high score, recent activity, strong signals
  if (
    scoreResult.compositeScore >= 70 &&
    lead.daysSinceLastTouch <= 2 &&
    scoreResult.velocityBonus > 0
  ) {
    return "P1";
  }

  // P2: Warm leads - good score, active engagement
  if (scoreResult.compositeScore >= 50 && lead.daysSinceLastTouch <= 7) {
    return "P2";
  }

  // P3: Nurture leads - moderate score or recent engagement
  if (scoreResult.compositeScore >= 30 || lead.totalTouchpoints >= 3) {
    return "P3";
  }

  // P4: Cold leads
  return "P4";
}
