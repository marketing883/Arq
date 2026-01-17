import {
  LeadIntelligence,
  BehavioralSignal,
  IntentCategory,
  UrgencyLevel,
  CompanySize,
  QualificationStatus,
} from "@/types";

// Intent scoring weights
const INTENT_WEIGHTS = {
  pricing_interest: 25,
  competitor_mention: 20,
  timeline_mention: 30,
  pain_point: 15,
  feature_interest: 10,
  compliance_mention: 20,
  demo_request: 40,
  integration_question: 15,
  company_size_enterprise: 10,
  decision_maker_role: 15,
};

// Keywords for detecting behavioral signals
const SIGNAL_PATTERNS = {
  pricing_interest: [
    /pric(e|ing)/i,
    /cost/i,
    /budget/i,
    /how much/i,
    /investment/i,
    /roi/i,
    /subscription/i,
    /license/i,
  ],
  competitor_mention: [
    /competitor/i,
    /alternative/i,
    /compare/i,
    /vs\./i,
    /versus/i,
    /switch from/i,
    /current(ly)? (use|using)/i,
    /looking at other/i,
  ],
  timeline_mention: [
    /timeline/i,
    /how (long|soon)/i,
    /implement(ation)?/i,
    /deploy/i,
    /go live/i,
    /deadline/i,
    /quarter/i,
    /this (week|month|year)/i,
    /next (week|month)/i,
  ],
  pain_point: [
    /challeng(e|ing)/i,
    /problem/i,
    /issue/i,
    /struggle/i,
    /difficult/i,
    /pain point/i,
    /frustrat/i,
    /compliance (issue|problem|risk)/i,
    /audit/i,
    /regulat/i,
    /need help/i,
    /looking for/i,
  ],
  feature_interest: [
    /feature/i,
    /capabilit/i,
    /can (you|it|arqai)/i,
    /does (it|arqai)/i,
    /support for/i,
    /how does/i,
    /automat/i,
    /workflow/i,
    /bot/i,
  ],
  demo_request: [
    /demo/i,
    /trial/i,
    /poc/i,
    /proof of concept/i,
    /pilot/i,
    /see it in action/i,
    /show me/i,
    /meeting/i,
    /schedule/i,
    /call/i,
    /talk/i,
    /discuss/i,
    /chat with/i,
    /speak with/i,
    /connect with/i,
    /set up/i,
    /book/i,
  ],
  compliance_mention: [
    /hipaa/i,
    /gdpr/i,
    /sox/i,
    /finra/i,
    /naic/i,
    /compliance/i,
    /regulat/i,
    /audit/i,
    /governance/i,
  ],
  integration_question: [
    /integrat/i,
    /connect/i,
    /api/i,
    /work with/i,
    /compatible/i,
    /snowflake/i,
    /azure/i,
    /aws/i,
    /slack/i,
    /erp/i,
    /crm/i,
    /salesforce/i,
  ],
};

// Role seniority patterns
const SENIORITY_PATTERNS = {
  executive: [/ceo/i, /cto/i, /cio/i, /ciso/i, /cfo/i, /chief/i, /president/i, /founder/i, /owner/i],
  director: [/director/i, /vp/i, /vice president/i, /head of/i, /svp/i, /evp/i],
  manager: [/manager/i, /lead/i, /principal/i, /senior/i, /team lead/i],
  individual: [/analyst/i, /engineer/i, /developer/i, /specialist/i, /associate/i],
};

// Company size patterns
const COMPANY_SIZE_PATTERNS = {
  startup: [/startup/i, /early stage/i, /seed/i, /small team/i, /just us/i, /founder/i],
  smb: [/small business/i, /smb/i, /50 (employees|people)/i, /growing/i],
  "mid-market": [/mid-?market/i, /medium/i, /few hundred/i, /\d{2,3} (employees|people)/i],
  enterprise: [/enterprise/i, /fortune/i, /global/i, /multinational/i, /\d{4,} (employees|people)/i, /large/i],
};

/**
 * Detect behavioral signals from a message
 */
export function detectBehavioralSignals(message: string): BehavioralSignal[] {
  const signals: BehavioralSignal[] = [];
  const timestamp = new Date().toISOString();

  for (const [signalType, patterns] of Object.entries(SIGNAL_PATTERNS)) {
    for (const pattern of patterns) {
      if (pattern.test(message)) {
        // Calculate confidence based on pattern specificity
        const confidence = pattern.toString().length > 20 ? 0.9 : 0.7;

        signals.push({
          type: signalType as BehavioralSignal["type"],
          content: message.substring(0, 200), // Store relevant snippet
          confidence,
          timestamp,
        });
        break; // Only one signal per type per message
      }
    }
  }

  return signals;
}

/**
 * Calculate buy intent score from behavioral signals
 */
export function calculateIntentScore(signals: BehavioralSignal[]): number {
  let score = 0;
  const signalTypes = new Set<string>();

  for (const signal of signals) {
    // Only count each signal type once
    if (!signalTypes.has(signal.type)) {
      signalTypes.add(signal.type);
      const weight = INTENT_WEIGHTS[signal.type as keyof typeof INTENT_WEIGHTS] || 5;
      score += weight * signal.confidence;
    }
  }

  // Bonus for multiple signal types (shows engaged prospect)
  if (signalTypes.size >= 3) {
    score += 10;
  }
  if (signalTypes.size >= 5) {
    score += 15;
  }

  // Cap at 100
  return Math.min(Math.round(score), 100);
}

/**
 * Determine intent category from score
 */
export function getIntentCategory(score: number): IntentCategory {
  if (score >= 60) return "hot";
  if (score >= 30) return "warm";
  return "cold";
}

/**
 * Determine urgency level from signals
 */
export function determineUrgency(signals: BehavioralSignal[], messages: string[]): UrgencyLevel {
  const hasTimeline = signals.some(s => s.type === "timeline_mention");
  const hasDemoRequest = signals.some(s => s.type === "demo_request" as BehavioralSignal["type"]);

  // Check for urgency keywords
  const combinedText = messages.join(" ").toLowerCase();
  const immediateKeywords = ["asap", "urgent", "immediately", "right away", "today", "this week"];
  const highKeywords = ["soon", "next week", "this month", "quickly"];
  const mediumKeywords = ["quarter", "next month", "planning"];

  if (immediateKeywords.some(k => combinedText.includes(k))) {
    return "immediate";
  }
  if (hasDemoRequest || highKeywords.some(k => combinedText.includes(k))) {
    return "high";
  }
  if (hasTimeline || mediumKeywords.some(k => combinedText.includes(k))) {
    return "medium";
  }
  return "low";
}

/**
 * Infer company size from conversation
 */
export function inferCompanySize(messages: string[]): CompanySize | undefined {
  const combinedText = messages.join(" ");

  for (const [size, patterns] of Object.entries(COMPANY_SIZE_PATTERNS)) {
    for (const pattern of patterns) {
      if (pattern.test(combinedText)) {
        return size as CompanySize;
      }
    }
  }

  return undefined;
}

/**
 * Infer role seniority from job title
 */
export function inferRoleSeniority(jobTitle?: string): string | undefined {
  if (!jobTitle) return undefined;

  for (const [seniority, patterns] of Object.entries(SENIORITY_PATTERNS)) {
    for (const pattern of patterns) {
      if (pattern.test(jobTitle)) {
        return seniority;
      }
    }
  }

  return "unknown";
}

/**
 * Determine qualification status based on lead data
 */
export function determineQualificationStatus(
  intentScore: number,
  hasEmail: boolean,
  hasCompany: boolean,
  companySize?: CompanySize
): QualificationStatus {
  // Enterprise with high intent and contact info = qualified
  if (intentScore >= 50 && hasEmail && companySize === "enterprise") {
    return "qualified";
  }

  // High intent with email = qualified
  if (intentScore >= 60 && hasEmail) {
    return "qualified";
  }

  // Medium intent with some info = nurture
  if (intentScore >= 30 && (hasEmail || hasCompany)) {
    return "nurture";
  }

  // Very low intent or no info
  if (intentScore < 20 && !hasEmail && !hasCompany) {
    return "unqualified";
  }

  return "new";
}

/**
 * Extract compliance requirements from conversation
 */
export function extractComplianceRequirements(messages: string[]): string[] {
  const combinedText = messages.join(" ").toLowerCase();
  const requirements: string[] = [];

  const frameworks: Record<string, string[]> = {
    "HIPAA": ["hipaa", "health", "patient", "phi", "protected health"],
    "GDPR": ["gdpr", "european", "eu data", "personal data", "data protection"],
    "SOX": ["sox", "sarbanes", "financial reporting", "public company"],
    "FINRA": ["finra", "broker", "dealer", "securities", "trading"],
    "NAIC": ["naic", "insurance", "state insurance"],
    "SOC 2": ["soc 2", "soc2", "type 2", "type ii"],
    "CCPA": ["ccpa", "california", "consumer privacy"],
    "EU AI Act": ["eu ai act", "ai regulation", "european ai"],
  };

  for (const [framework, keywords] of Object.entries(frameworks)) {
    if (keywords.some(k => combinedText.includes(k))) {
      requirements.push(framework);
    }
  }

  return requirements;
}

/**
 * Extract industry from conversation
 */
export function extractIndustry(messages: string[]): string | undefined {
  const combinedText = messages.join(" ").toLowerCase();

  const industries: Record<string, string[]> = {
    "Financial Services": ["bank", "financial", "fintech", "investment", "trading", "wealth"],
    "Insurance": ["insurance", "insurer", "claims", "underwriting", "policy"],
    "Healthcare": ["health", "hospital", "clinical", "patient", "medical", "pharma"],
    "Technology": ["tech", "software", "saas", "cloud", "platform"],
    "Manufacturing": ["manufacturing", "factory", "production", "supply chain"],
    "Retail": ["retail", "ecommerce", "consumer", "shopping"],
    "Government": ["government", "federal", "state", "public sector", "agency"],
  };

  for (const [industry, keywords] of Object.entries(industries)) {
    if (keywords.some(k => combinedText.includes(k))) {
      return industry;
    }
  }

  return undefined;
}

/**
 * Deduplicate signals by creating a unique key from type and content
 */
function deduplicateSignals(signals: BehavioralSignal[]): BehavioralSignal[] {
  const seen = new Map<string, BehavioralSignal>();

  for (const signal of signals) {
    // Create a unique key from type and content (first 50 chars)
    const contentKey = signal.content.substring(0, 50).toLowerCase().trim();
    const key = `${signal.type}:${contentKey}`;

    // Keep the signal with higher confidence, or the first one if same
    if (!seen.has(key) || (seen.get(key)!.confidence < signal.confidence)) {
      seen.set(key, signal);
    }
  }

  return Array.from(seen.values());
}

/**
 * Generate lead intelligence from conversation data
 */
export function generateLeadIntelligence(
  userId: string,
  messages: string[],
  userInfo: {
    name?: string;
    email?: string;
    company?: string;
    jobTitle?: string;
  },
  existingSignals: BehavioralSignal[] = []
): Partial<LeadIntelligence> {
  // Detect new signals from all messages
  const rawSignals = [...existingSignals];
  for (const message of messages) {
    const newSignals = detectBehavioralSignals(message);
    rawSignals.push(...newSignals);
  }

  // Deduplicate signals to prevent repetition
  const allSignals = deduplicateSignals(rawSignals);

  // Calculate scores
  const intentScore = calculateIntentScore(allSignals);
  const intentCategory = getIntentCategory(intentScore);
  const urgency = determineUrgency(allSignals, messages);
  const companySize = inferCompanySize(messages);
  const roleSeniority = inferRoleSeniority(userInfo.jobTitle);
  const qualificationStatus = determineQualificationStatus(
    intentScore,
    !!userInfo.email,
    !!userInfo.company,
    companySize
  );

  // Extract research data
  const complianceRequirements = extractComplianceRequirements(messages);
  const industry = extractIndustry(messages);

  return {
    user_id: userId,
    buy_intent_score: intentScore,
    intent_category: intentCategory,
    company_size: companySize,
    urgency,
    qualification_status: qualificationStatus,
    behavioral_signals: allSignals,
    user_research: roleSeniority ? { role_seniority: roleSeniority } : undefined,
    company_research: industry || complianceRequirements.length > 0
      ? {
          industry,
          compliance_requirements: complianceRequirements.length > 0 ? complianceRequirements : undefined,
        }
      : undefined,
    updated_at: new Date().toISOString(),
  };
}

/**
 * Get priority tier for lead routing
 */
export function getLeadPriorityTier(intelligence: Partial<LeadIntelligence>): "tier1" | "tier2" | "tier3" {
  const { buy_intent_score = 0, company_size, urgency, qualification_status } = intelligence;

  // Tier 1: Immediate follow-up needed
  if (
    buy_intent_score >= 70 ||
    (company_size === "enterprise" && buy_intent_score >= 50) ||
    urgency === "immediate" ||
    qualification_status === "qualified"
  ) {
    return "tier1";
  }

  // Tier 2: Follow-up within 24 hours
  if (
    buy_intent_score >= 40 ||
    company_size === "mid-market" ||
    urgency === "high" ||
    qualification_status === "nurture"
  ) {
    return "tier2";
  }

  // Tier 3: Nurture sequence
  return "tier3";
}
