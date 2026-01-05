// User context types for intelligent chat system

export type Industry =
  | "healthcare"
  | "financial_services"
  | "insurance"
  | "manufacturing"
  | "retail"
  | "technology"
  | "government"
  | "energy"
  | "telecom"
  | "other"
  | null;

export type CompanySize =
  | "startup"      // < 50 employees
  | "smb"          // 50-500 employees
  | "midmarket"    // 500-5000 employees
  | "enterprise"   // 5000+ employees
  | null;

export type ComplianceFramework =
  | "hipaa"
  | "sox"
  | "gdpr"
  | "ccpa"
  | "pci_dss"
  | "naic"
  | "finra"
  | "fedramp"
  | "iso27001";

export type PainPoint =
  | "compliance_complexity"
  | "audit_trail"
  | "ai_governance"
  | "security_concerns"
  | "scaling_ai"
  | "cost_reduction"
  | "risk_management"
  | "manual_processes"
  | "lack_visibility"
  | "integration_challenges"
  | "quality_control";

export type UseCase =
  | "document_processing"
  | "customer_service"
  | "underwriting"
  | "claims_processing"
  | "data_analysis"
  | "code_generation"
  | "content_creation"
  | "fraud_detection"
  | "compliance_monitoring"
  | "workflow_automation";

export type ConversationIntent =
  | "learn_product"
  | "see_demo"
  | "understand_pricing"
  | "technical_question"
  | "compare_solutions"
  | "implementation_timeline"
  | "case_study"
  | "roi_calculation"
  | "security_audit"
  | "general_inquiry";

export interface UserContext {
  // Identification
  sessionId: string;

  // Company Profile
  companyName: string | null;
  industry: Industry;
  companySize: CompanySize;

  // Pain Points & Needs
  painPoints: PainPoint[];
  useCases: UseCase[];
  complianceFrameworks: ComplianceFramework[];

  // AI Maturity
  hasExistingAI: boolean | null;
  currentAITools: string[];
  aiAgentCount: number | null;

  // Conversation State
  currentIntent: ConversationIntent | null;
  questionsAsked: string[];
  topicsDiscussed: string[];
  cardsShown: string[];

  // Lead Quality Signals
  engagementLevel: "low" | "medium" | "high";
  buyingSignals: string[];

  // Contact Info (if provided)
  email: string | null;
  name: string | null;
  role: string | null;

  // Timestamps
  createdAt: Date;
  lastActiveAt: Date;
}

export interface ConversationMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  metadata?: {
    intent?: ConversationIntent;
    entities?: ExtractedEntities;
    suggestedCard?: string;
    contextUpdate?: Partial<UserContext>;
  };
}

export interface ExtractedEntities {
  companyName?: string;
  industry?: Industry;
  complianceFrameworks?: ComplianceFramework[];
  painPoints?: PainPoint[];
  useCases?: UseCase[];
  numbers?: {
    agentCount?: number;
    budget?: number;
    timeline?: string;
  };
}

export interface CardTrigger {
  cardType: string;
  confidence: number;
  reason: string;
  customizations?: CardCustomization;
}

export interface CardCustomization {
  // Basic context
  industry?: Industry;
  companySize?: CompanySize;
  painPoints?: PainPoint[];
  complianceFrameworks?: ComplianceFramework[];

  // Content customization
  headline?: string;
  subheadline?: string;
  highlightedFeatures?: string[];

  // Case study customization
  caseStudy?: {
    industry?: string;
    companyType?: string;
    title?: string;
    challenge?: string;
    solution?: string;
    results?: Array<{ metric: string; label: string }>;
    quote?: string;
    quoteAuthor?: string;
  };

  // ROI calculator defaults
  roiDefaults?: {
    aiAgentCount?: number;
    avgSalary?: number;
    complianceLevel?: "low" | "medium" | "high";
    auditHoursPerAgent?: number;
  };
}

// Information gathering question types
export interface ProfilingQuestion {
  id: string;
  question: string;
  contextKey: keyof UserContext;
  priority: number;
  condition?: (ctx: UserContext) => boolean;
  followUp?: string;
}

// Content template types
export interface DynamicContent {
  headline: string;
  subheadline?: string;
  bullets?: string[];
  cta?: {
    text: string;
    action: string;
  };
  caseStudy?: {
    industry: string;
    title: string;
    results: { metric: string; label: string }[];
  };
}
