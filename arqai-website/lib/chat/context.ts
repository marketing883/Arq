// User context management for intelligent chat

import {
  UserContext,
  ConversationMessage,
  ExtractedEntities,
  Industry,
  CompanySize,
  PainPoint,
  ComplianceFramework,
  UseCase,
  ConversationIntent,
  ProfilingQuestion,
} from "./types";

// Generate unique session ID
function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Create initial empty context
export function createInitialContext(): UserContext {
  return {
    sessionId: generateSessionId(),
    companyName: null,
    industry: null,
    companySize: null,
    painPoints: [],
    useCases: [],
    complianceFrameworks: [],
    hasExistingAI: null,
    currentAITools: [],
    aiAgentCount: null,
    currentIntent: null,
    questionsAsked: [],
    topicsDiscussed: [],
    cardsShown: [],
    engagementLevel: "low",
    buyingSignals: [],
    email: null,
    name: null,
    role: null,
    createdAt: new Date(),
    lastActiveAt: new Date(),
  };
}

// Update context with new information
export function updateContext(
  context: UserContext,
  updates: Partial<UserContext>
): UserContext {
  return {
    ...context,
    ...updates,
    lastActiveAt: new Date(),
    // Merge arrays instead of replacing (use Array.from for TS compatibility)
    painPoints: updates.painPoints
      ? Array.from(new Set([...context.painPoints, ...updates.painPoints]))
      : context.painPoints,
    useCases: updates.useCases
      ? Array.from(new Set([...context.useCases, ...updates.useCases]))
      : context.useCases,
    complianceFrameworks: updates.complianceFrameworks
      ? Array.from(new Set([...context.complianceFrameworks, ...updates.complianceFrameworks]))
      : context.complianceFrameworks,
    topicsDiscussed: updates.topicsDiscussed
      ? Array.from(new Set([...context.topicsDiscussed, ...updates.topicsDiscussed]))
      : context.topicsDiscussed,
    cardsShown: updates.cardsShown
      ? Array.from(new Set([...context.cardsShown, ...updates.cardsShown]))
      : context.cardsShown,
  };
}

// Merge extracted entities into context
export function mergeEntitiesIntoContext(
  context: UserContext,
  entities: ExtractedEntities
): UserContext {
  const updates: Partial<UserContext> = {};

  if (entities.companyName && !context.companyName) {
    updates.companyName = entities.companyName;
  }

  if (entities.industry && !context.industry) {
    updates.industry = entities.industry;
  }

  if (entities.complianceFrameworks?.length) {
    updates.complianceFrameworks = entities.complianceFrameworks;
  }

  if (entities.painPoints?.length) {
    updates.painPoints = entities.painPoints;
  }

  if (entities.useCases?.length) {
    updates.useCases = entities.useCases;
  }

  if (entities.numbers?.agentCount && !context.aiAgentCount) {
    updates.aiAgentCount = entities.numbers.agentCount;
    updates.hasExistingAI = true;
  }

  return updateContext(context, updates);
}

// Determine engagement level based on interaction patterns
export function calculateEngagementLevel(
  context: UserContext,
  messageCount: number
): "low" | "medium" | "high" {
  const cardsViewedCount = context.cardsShown.length;
  const topicsDiscussedCount = context.topicsDiscussed.length;
  const buyingSignalsCount = context.buyingSignals.length;
  const hasContactInfo = context.email !== null;

  let score = 0;
  if (messageCount >= 5) score += 2;
  if (messageCount >= 10) score += 2;
  if (cardsViewedCount >= 2) score += 2;
  if (topicsDiscussedCount >= 3) score += 2;
  if (buyingSignalsCount >= 1) score += 3;
  if (hasContactInfo) score += 3;

  if (score >= 8) return "high";
  if (score >= 4) return "medium";
  return "low";
}

// Profiling questions, current positioning: forward-deployed engineering,
// workflow-first discovery that maps answers onto accelerators. Ordered by
// priority; each fills a gap in the context the model uses to convert.
export const profilingQuestions: ProfilingQuestion[] = [
  {
    id: "workflow_focus",
    question:
      "Which workflow are you trying to improve: claims, underwriting, support tickets, forecasting, pricing, loyalty, supplier risk, or something else?",
    contextKey: "useCases",
    priority: 1,
    condition: (ctx) => ctx.useCases.length === 0 && ctx.painPoints.length === 0,
  },
  {
    id: "industry",
    question:
      "Which industry are you in? It changes which accelerator I would point you to.",
    contextKey: "industry",
    priority: 2,
    condition: (ctx) => !ctx.industry,
  },
  {
    id: "whats_breaking",
    question:
      "What breaks today in that workflow: volume, accuracy, audit pressure, or cycle time?",
    contextKey: "painPoints",
    priority: 3,
    condition: (ctx) =>
      (ctx.useCases.length > 0 || ctx.industry !== null) && ctx.painPoints.length === 0,
  },
  {
    id: "current_ai",
    question:
      "Is anything AI-driven running in that workflow today, or would this be the first production piece?",
    contextKey: "hasExistingAI",
    priority: 4,
    condition: (ctx) => ctx.hasExistingAI === null,
  },
  {
    id: "compliance_specific",
    question:
      "Any compliance regimes in play I should account for (HIPAA, SOX, GDPR, model risk)?",
    contextKey: "complianceFrameworks",
    priority: 5,
    condition: (ctx) =>
      (ctx.industry === "healthcare" ||
        ctx.industry === "financial_services" ||
        ctx.industry === "insurance") &&
      ctx.complianceFrameworks.length === 0,
  },
];

// Get the next profiling question to ask (if appropriate)
export function getNextProfilingQuestion(
  context: UserContext,
  recentMessages: ConversationMessage[]
): ProfilingQuestion | null {
  // Don't ask questions too frequently
  const recentQuestions = recentMessages
    .slice(-4)
    .filter((m) => m.role === "assistant" && m.content.includes("?"));

  if (recentQuestions.length >= 2) {
    return null; // Too many recent questions
  }

  // Find the highest priority unanswered question
  const availableQuestions = profilingQuestions
    .filter((q) => q.condition?.(context) ?? true)
    .sort((a, b) => a.priority - b.priority);

  return availableQuestions[0] || null;
}

// Determine if we should ask a profiling question now. Deterministic:
// conversion cadence should never be a coin flip.
export function shouldAskProfilingQuestion(
  context: UserContext,
  messageCount: number,
  lastAssistantMessage: string
): boolean {
  // Let the visitor engage first.
  if (messageCount < 2) return false;

  // The model already ended with a question; don't stack another.
  if (lastAssistantMessage.includes("?")) return false;

  // Fixed checkpoints through the conversation arc.
  return [2, 4, 7, 11].includes(messageCount);
}

// Industry display names
export const industryNames: Record<NonNullable<Industry>, string> = {
  healthcare: "Healthcare",
  financial_services: "Financial Services",
  insurance: "Insurance",
  manufacturing: "Manufacturing",
  retail: "Retail",
  technology: "Technology",
  government: "Government",
  energy: "Energy",
  telecom: "Telecommunications",
  other: "Other",
};

// Pain point display names
export const painPointNames: Record<PainPoint, string> = {
  compliance_complexity: "Compliance Complexity",
  audit_trail: "Audit Trail Requirements",
  ai_governance: "AI Governance",
  security_concerns: "Security Concerns",
  scaling_ai: "Scaling AI Operations",
  cost_reduction: "Cost Reduction",
  risk_management: "Risk Management",
  manual_processes: "Manual Processes",
  lack_visibility: "Lack of Visibility",
  integration_challenges: "Integration Challenges",
  quality_control: "Quality Control",
};

// Serialize context for storage
export function serializeContext(context: UserContext): string {
  return JSON.stringify({
    ...context,
    createdAt: context.createdAt.toISOString(),
    lastActiveAt: context.lastActiveAt.toISOString(),
  });
}

// Deserialize context from storage
export function deserializeContext(data: string): UserContext {
  const parsed = JSON.parse(data);
  return {
    ...parsed,
    createdAt: new Date(parsed.createdAt),
    lastActiveAt: new Date(parsed.lastActiveAt),
  };
}
