// Intent detection and entity extraction for intelligent chat

import {
  ExtractedEntities,
  Industry,
  ComplianceFramework,
  PainPoint,
  UseCase,
  ConversationIntent,
  CardTrigger,
  UserContext,
} from "./types";

// Keyword patterns for entity extraction
const industryPatterns: Record<NonNullable<Industry>, RegExp[]> = {
  healthcare: [
    /\b(healthcare|health\s*care|hospital|clinic|medical|patient|hipaa|ehr|emr|health\s*system)\b/i,
  ],
  financial_services: [
    /\b(bank|banking|financial|finance|fintech|investment|trading|sox|credit|loan)\b/i,
  ],
  insurance: [
    /\b(insurance|insurer|underwriting|claims|actuarial|policy\s*holder|naic)\b/i,
  ],
  manufacturing: [
    /\b(manufacturing|factory|production|industrial|supply\s*chain|quality\s*control)\b/i,
  ],
  retail: [
    /\b(retail|e-?commerce|shopping|merchant|consumer|store|inventory)\b/i,
  ],
  technology: [
    /\b(tech|software|saas|startup|developer|engineering|platform)\b/i,
  ],
  government: [
    /\b(government|federal|state|agency|public\s*sector|fedramp|municipality)\b/i,
  ],
  energy: [
    /\b(energy|oil|gas|utilities|power|renewable|grid)\b/i,
  ],
  telecom: [
    /\b(telecom|telecommunications|carrier|network|mobile|5g)\b/i,
  ],
  other: [],
};

const compliancePatterns: Record<ComplianceFramework, RegExp[]> = {
  hipaa: [/\bhipaa\b/i, /\bprotected\s*health\s*information\b/i, /\bphi\b/i],
  sox: [/\bsox\b/i, /\bsarbanes[\s-]*oxley\b/i],
  gdpr: [/\bgdpr\b/i, /\bgeneral\s*data\s*protection\b/i],
  ccpa: [/\bccpa\b/i, /\bcalifornia\s*consumer\s*privacy\b/i],
  pci_dss: [/\bpci[\s-]*dss\b/i, /\bpayment\s*card\s*industry\b/i],
  naic: [/\bnaic\b/i, /\binsurance\s*commissioner\b/i],
  finra: [/\bfinra\b/i, /\bfinancial\s*industry\s*regulatory\b/i],
  fedramp: [/\bfedramp\b/i, /\bfederal\s*risk\b/i],
  iso27001: [/\biso\s*27001\b/i, /\binformation\s*security\s*management\b/i],
};

const painPointPatterns: Record<PainPoint, RegExp[]> = {
  compliance_complexity: [
    /\b(compliance|regulatory|regulation|compliant)\b.*\b(complex|difficult|hard|challenge)\b/i,
    /\b(complex|difficult|hard|challenge)\b.*\b(compliance|regulatory)\b/i,
  ],
  audit_trail: [
    /\b(audit|auditor|auditing|audit\s*trail|evidence|proof)\b/i,
  ],
  ai_governance: [
    /\b(govern|governance|oversight|control)\b.*\b(ai|agent|model)\b/i,
    /\b(ai|agent|model)\b.*\b(govern|governance|oversight|control)\b/i,
  ],
  security_concerns: [
    /\b(security|secure|breach|vulnerability|attack|risk)\b/i,
  ],
  scaling_ai: [
    /\b(scale|scaling|grow|expand)\b.*\b(ai|agent|automation)\b/i,
  ],
  cost_reduction: [
    /\b(cost|expensive|budget|roi|savings|reduce\s*cost)\b/i,
  ],
  risk_management: [
    /\b(risk|risky|risk\s*management|mitigate)\b/i,
  ],
  manual_processes: [
    /\b(manual|time[\s-]*consuming|tedious|repetitive|automate)\b/i,
  ],
  lack_visibility: [
    /\b(visibility|monitor|observability|track|insight|blind)\b/i,
  ],
  integration_challenges: [
    /\b(integrate|integration|connect|api|ecosystem)\b/i,
  ],
  quality_control: [
    /\b(quality|accuracy|hallucination|reliable|trust)\b/i,
  ],
};

const useCasePatterns: Record<UseCase, RegExp[]> = {
  document_processing: [
    /\b(document|pdf|contract|extract|ocr|processing)\b/i,
  ],
  customer_service: [
    /\b(customer\s*service|support|helpdesk|chatbot|ticket)\b/i,
  ],
  underwriting: [
    /\b(underwriting|underwrite|loan|credit\s*decision)\b/i,
  ],
  claims_processing: [
    /\b(claims?|claim\s*processing|adjuster)\b/i,
  ],
  data_analysis: [
    /\b(data\s*analysis|analytics|insight|report|dashboard)\b/i,
  ],
  code_generation: [
    /\b(code|coding|developer|programming|copilot)\b/i,
  ],
  content_creation: [
    /\b(content|writing|copy|marketing|blog)\b/i,
  ],
  fraud_detection: [
    /\b(fraud|fraudulent|suspicious|anomaly)\b/i,
  ],
  compliance_monitoring: [
    /\b(compliance\s*monitoring|regulatory\s*monitoring|policy\s*enforcement)\b/i,
  ],
  workflow_automation: [
    /\b(workflow|automation|automate|process|orchestration)\b/i,
  ],
};

const intentPatterns: Record<ConversationIntent, RegExp[]> = {
  learn_product: [
    /\b(what\s*(is|does)|how\s*does|tell\s*me\s*about|explain|learn)\b.*\b(arqai|platform|product)\b/i,
    /\bwhat\s*can\s*(you|arqai)\s*do\b/i,
  ],
  see_demo: [
    /\b(demo|demonstration|see\s*it|show\s*me|walk\s*through)\b/i,
  ],
  understand_pricing: [
    /\b(price|pricing|cost|how\s*much|subscription|license)\b/i,
  ],
  technical_question: [
    /\b(how\s*(do|does|to)|architecture|api|integrate|technical|implementation)\b/i,
  ],
  compare_solutions: [
    /\b(compare|comparison|vs|versus|alternative|different\s*from|competitor)\b/i,
  ],
  implementation_timeline: [
    /\b(how\s*long|timeline|implement|deploy|get\s*started|onboard)\b/i,
  ],
  case_study: [
    /\b(case\s*study|example|customer|success\s*story|who\s*uses)\b/i,
  ],
  roi_calculation: [
    /\b(roi|return|savings|value|worth|benefit|business\s*case)\b/i,
  ],
  security_audit: [
    /\b(security|soc\s*2|penetration|audit|compliance\s*cert)\b/i,
  ],
  general_inquiry: [],
};

// Extract entities from a message
export function extractEntities(message: string): ExtractedEntities {
  const entities: ExtractedEntities = {};

  // Extract industry
  for (const [industry, patterns] of Object.entries(industryPatterns)) {
    if (patterns.some((p) => p.test(message))) {
      entities.industry = industry as Industry;
      break;
    }
  }

  // Extract compliance frameworks
  const frameworks: ComplianceFramework[] = [];
  for (const [framework, patterns] of Object.entries(compliancePatterns)) {
    if (patterns.some((p) => p.test(message))) {
      frameworks.push(framework as ComplianceFramework);
    }
  }
  if (frameworks.length > 0) {
    entities.complianceFrameworks = frameworks;
  }

  // Extract pain points
  const painPoints: PainPoint[] = [];
  for (const [painPoint, patterns] of Object.entries(painPointPatterns)) {
    if (patterns.some((p) => p.test(message))) {
      painPoints.push(painPoint as PainPoint);
    }
  }
  if (painPoints.length > 0) {
    entities.painPoints = painPoints;
  }

  // Extract use cases
  const useCases: UseCase[] = [];
  for (const [useCase, patterns] of Object.entries(useCasePatterns)) {
    if (patterns.some((p) => p.test(message))) {
      useCases.push(useCase as UseCase);
    }
  }
  if (useCases.length > 0) {
    entities.useCases = useCases;
  }

  // Extract numbers
  const agentCountMatch = message.match(/(\d+)\s*(ai\s*)?(agents?|workflows?|bots?)/i);
  if (agentCountMatch) {
    entities.numbers = {
      ...entities.numbers,
      agentCount: parseInt(agentCountMatch[1], 10),
    };
  }

  // Extract company name (simple heuristic - words after "at" or "from" or "we're")
  const companyMatch = message.match(
    /(?:work(?:ing)?\s+(?:at|for)|from|we're|I'm\s+(?:at|with))\s+([A-Z][A-Za-z0-9\s&]+?)(?:\.|,|$|\s+and|\s+we)/i
  );
  if (companyMatch) {
    entities.companyName = companyMatch[1].trim();
  }

  return entities;
}

// Detect conversation intent
export function detectIntent(
  message: string,
  context: UserContext
): ConversationIntent {
  for (const [intent, patterns] of Object.entries(intentPatterns)) {
    if (patterns.some((p) => p.test(message))) {
      return intent as ConversationIntent;
    }
  }
  return "general_inquiry";
}

// Determine if a card should be triggered
export function detectCardTrigger(
  message: string,
  context: UserContext,
  conversationHistory: string[]
): CardTrigger | null {
  const lowerMessage = message.toLowerCase();
  const entities = extractEntities(message);
  const intent = detectIntent(message, context);

  // Feature Deep Dive triggers
  if (
    /\b(feature|capability|what\s*can|show\s*me\s*what|functionality)\b/i.test(message) ||
    intent === "learn_product"
  ) {
    return {
      cardType: "features",
      confidence: 0.8,
      reason: "User asking about features/capabilities",
      customizations: {
        industry: context.industry || entities.industry,
        painPoints: context.painPoints.length > 0 ? context.painPoints : entities.painPoints,
      },
    };
  }

  // Comparison triggers
  if (
    /\b(compare|vs|versus|different|competitor|alternative)\b/i.test(message) ||
    intent === "compare_solutions"
  ) {
    return {
      cardType: "comparison",
      confidence: 0.85,
      reason: "User interested in comparison",
      customizations: {
        highlightedFeatures: context.painPoints.map(painPointToFeature),
      },
    };
  }

  // Timeline triggers
  if (
    /\b(how\s*long|timeline|implement|deploy|get\s*started|onboard)\b/i.test(message) ||
    intent === "implementation_timeline"
  ) {
    return {
      cardType: "timeline",
      confidence: 0.8,
      reason: "User asking about implementation",
      customizations: {
        companySize: context.companySize,
      },
    };
  }

  // ROI Calculator triggers
  if (
    /\b(roi|cost|savings|value|worth|business\s*case|budget)\b/i.test(message) ||
    intent === "roi_calculation"
  ) {
    return {
      cardType: "roi",
      confidence: 0.85,
      reason: "User interested in ROI/value",
      customizations: {
        roiDefaults: {
          aiAgentCount: context.aiAgentCount || 10,
          complianceLevel: inferComplianceRisk(context),
        },
      },
    };
  }

  // Case Study triggers
  if (
    /\b(case\s*study|example|customer|success|who\s*uses|similar|like\s*us)\b/i.test(message) ||
    intent === "case_study"
  ) {
    return {
      cardType: "casestudy",
      confidence: 0.8,
      reason: "User asking for customer examples",
      customizations: {
        industry: context.industry || entities.industry,
      },
    };
  }

  // Architecture triggers
  if (
    /\b(architecture|how\s*it\s*works|technical|under\s*the\s*hood|platform)\b/i.test(message) ||
    intent === "technical_question"
  ) {
    return {
      cardType: "architecture",
      confidence: 0.75,
      reason: "User asking technical questions",
      customizations: {
        highlightedFeatures: context.painPoints.map(painPointToFeature),
      },
    };
  }

  // Integration triggers
  if (
    /\b(integrate|integration|connect|api|ecosystem|work\s*with)\b/i.test(message)
  ) {
    return {
      cardType: "integration",
      confidence: 0.8,
      reason: "User asking about integrations",
      customizations: {
        industry: context.industry,
      },
    };
  }

  return null;
}

// Map pain points to relevant features for highlighting
function painPointToFeature(painPoint: PainPoint): string {
  const mapping: Record<PainPoint, string> = {
    compliance_complexity: "capc",
    audit_trail: "tao",
    ai_governance: "capc",
    security_concerns: "tao",
    scaling_ai: "oda-rag",
    cost_reduction: "roi",
    risk_management: "tao",
    manual_processes: "capc",
    lack_visibility: "oda-rag",
    integration_challenges: "integration",
    quality_control: "oda-rag",
  };
  return mapping[painPoint] || "features";
}

// Map industry to most relevant case study
function mapIndustryToCaseStudy(industry: Industry | undefined): string {
  if (!industry) return "financial";

  const mapping: Partial<Record<NonNullable<Industry>, string>> = {
    healthcare: "healthcare",
    financial_services: "financial",
    insurance: "insurance",
  };
  return mapping[industry] || "financial";
}

// Infer compliance risk level from context
function inferComplianceRisk(
  context: UserContext
): "low" | "medium" | "high" {
  const highRiskIndustries: Industry[] = ["healthcare", "financial_services", "insurance", "government"];
  const highRiskFrameworks: ComplianceFramework[] = ["hipaa", "sox", "pci_dss", "fedramp"];

  if (context.industry && highRiskIndustries.includes(context.industry)) {
    return "high";
  }

  if (context.complianceFrameworks.some((f) => highRiskFrameworks.includes(f))) {
    return "high";
  }

  if (context.complianceFrameworks.length > 0) {
    return "medium";
  }

  return "low";
}

// Detect buying signals in message
export function detectBuyingSignals(message: string): string[] {
  const signals: string[] = [];
  const patterns = [
    { pattern: /\b(budget|funding|approved)\b/i, signal: "budget_discussion" },
    { pattern: /\b(timeline|when\s*can|how\s*soon)\b/i, signal: "timeline_urgency" },
    { pattern: /\b(decision\s*maker|cto|ciso|vp|director)\b/i, signal: "authority_mention" },
    { pattern: /\b(contract|agreement|proposal|quote)\b/i, signal: "procurement_language" },
    { pattern: /\b(pilot|poc|proof\s*of\s*concept|trial)\b/i, signal: "pilot_interest" },
    { pattern: /\b(compare|evaluating|considering)\b/i, signal: "active_evaluation" },
  ];

  for (const { pattern, signal } of patterns) {
    if (pattern.test(message)) {
      signals.push(signal);
    }
  }

  return signals;
}
