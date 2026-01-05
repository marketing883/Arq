// User types
export interface User {
  id: string;
  name?: string;
  email?: string;
  company?: string;
  jobTitle?: string;
  job_title?: string;
  phone?: string;
  location?: string;
  createdAt: Date;
  updatedAt: Date;
}

// User research types
export interface UserResearch {
  role_seniority?: string;
  department?: string;
  decision_maker?: boolean;
}

// Lead intelligence types
export interface LeadIntelligence {
  id: string;
  userId: string;
  user_id: string;
  user: User;
  score: number;
  source: string;
  currentPage: string;
  intent: LeadIntent;
  interests: string[];
  conversationHistory: ConversationMessage[];
  pageViews: PageView[];
  createdAt: Date;
  updatedAt: Date;
  // Additional fields for admin dashboard
  company_size?: string;
  intent_category: string;
  buy_intent_score: number;
  urgency: string;
  qualification_status: string;
  updated_at: string;
  behavioral_signals?: BehavioralSignal[];
  company_research?: CompanyResearch;
  user_research?: UserResearch;
}

export type BehavioralSignalType =
  | "pricing_interest"
  | "competitor_mention"
  | "timeline_mention"
  | "pain_point"
  | "feature_interest"
  | "demo_request"
  | "compliance_mention"
  | "integration_question";

export interface BehavioralSignal {
  type: BehavioralSignalType;
  timestamp: string;
  details?: string;
  content: string;
  confidence: number;
}

export interface CompanyResearch {
  industry?: string;
  compliance_requirements?: string[];
  size?: string;
  revenue?: string;
}

export type LeadIntent =
  | "high_intent"
  | "medium_intent"
  | "low_intent"
  | "browsing";

// Intent category for lead scoring
export type IntentCategory = "hot" | "warm" | "cold";

// Urgency level for lead prioritization
export type UrgencyLevel = "immediate" | "high" | "medium" | "low";

// Company size classification
export type CompanySize = "startup" | "smb" | "mid-market" | "enterprise";

// Lead qualification status
export type QualificationStatus = "qualified" | "nurture" | "unqualified" | "new";

export interface ConversationMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

// Message type for chat
export interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: string;
}

// Conversation type for lead service
export interface Conversation {
  id: string;
  user_id: string;
  session_id: string;
  messages: Message[];
  page_context?: {
    current_page: string;
  };
  started_at: string;
  is_active: boolean;
}

export interface PageView {
  path: string;
  timestamp: Date;
  duration?: number;
}

// Admin types
export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: "admin" | "viewer";
  createdAt: Date;
}

// Consent types
export interface ConsentRecord {
  id: string;
  userId: string;
  type: "marketing" | "analytics" | "necessary";
  granted: boolean;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
}

// API response types
export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
