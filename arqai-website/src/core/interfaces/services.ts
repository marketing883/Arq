/**
 * Service Interfaces
 *
 * Defines contracts for business logic services.
 */

import type {
  LeadIntelligence,
  LeadAlert,
  TouchpointEvent,
  JourneyStage,
  PriorityTier,
} from "../domain/lead";
import type { Conversation, Message, DetectedIntent } from "../domain/conversation";
import type { User, UserSession } from "../domain/user";
import type { BlogPost, CaseStudy, Whitepaper, Webinar, ContentStatus } from "../domain/content";
import type { ConsentPreferences, ConsentRecord } from "../domain/analytics";

/**
 * Lead Intelligence Service
 */
export interface ILeadService {
  /**
   * Get lead intelligence by user ID
   */
  getByUserId(userId: string): Promise<LeadIntelligence | null>;

  /**
   * Get lead intelligence by email
   */
  getByEmail(email: string): Promise<LeadIntelligence | null>;

  /**
   * Calculate and update lead score
   */
  calculateScore(userId: string): Promise<LeadIntelligence>;

  /**
   * Process a touchpoint event
   */
  processTouchpoint(event: TouchpointEvent): Promise<LeadIntelligence>;

  /**
   * Get active alerts for a lead
   */
  getAlerts(leadId: string): Promise<LeadAlert[]>;

  /**
   * Acknowledge an alert
   */
  acknowledgeAlert(alertId: string, userId: string): Promise<void>;

  /**
   * Get leads by journey stage
   */
  getByJourneyStage(stage: JourneyStage): Promise<LeadIntelligence[]>;

  /**
   * Get leads by priority tier
   */
  getByPriorityTier(tier: PriorityTier): Promise<LeadIntelligence[]>;
}

/**
 * Conversation Service
 */
export interface IConversationService {
  /**
   * Create a new conversation
   */
  create(sessionId: string, pageContext?: Record<string, string>): Promise<Conversation>;

  /**
   * Get conversation by ID
   */
  getById(id: string): Promise<Conversation | null>;

  /**
   * Get active conversation for session
   */
  getActiveForSession(sessionId: string): Promise<Conversation | null>;

  /**
   * Add message to conversation
   */
  addMessage(conversationId: string, message: Message): Promise<Conversation>;

  /**
   * End a conversation
   */
  endConversation(conversationId: string): Promise<void>;

  /**
   * Detect intent from message
   */
  detectIntent(message: string): Promise<DetectedIntent>;
}

/**
 * User Service
 */
export interface IUserService {
  /**
   * Get or create user by session ID
   */
  getOrCreateBySession(sessionId: string): Promise<User>;

  /**
   * Get user by ID
   */
  getById(id: string): Promise<User | null>;

  /**
   * Get user by email
   */
  getByEmail(email: string): Promise<User | null>;

  /**
   * Update user profile
   */
  update(id: string, data: Partial<User>): Promise<User>;

  /**
   * Track page visit
   */
  trackPageVisit(sessionId: string, path: string): Promise<void>;

  /**
   * Get user session
   */
  getSession(sessionId: string): Promise<UserSession | null>;
}

/**
 * Content Service
 */
export interface IContentService<T> {
  /**
   * Get content by ID
   */
  getById(id: string): Promise<T | null>;

  /**
   * Get content by slug
   */
  getBySlug(slug: string): Promise<T | null>;

  /**
   * List content with pagination
   */
  list(options: ContentListOptions): Promise<ContentListResult<T>>;

  /**
   * Create new content
   */
  create(data: Omit<T, "id" | "createdAt" | "updatedAt">): Promise<T>;

  /**
   * Update content
   */
  update(id: string, data: Partial<T>): Promise<T>;

  /**
   * Delete content
   */
  delete(id: string): Promise<void>;

  /**
   * Publish content
   */
  publish(id: string): Promise<T>;

  /**
   * Unpublish content
   */
  unpublish(id: string): Promise<T>;
}

export interface ContentListOptions {
  status?: ContentStatus;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
  category?: string;
  featured?: boolean;
}

export interface ContentListResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

/**
 * Consent Service
 */
export interface IConsentService {
  /**
   * Get consent for session
   */
  getBySession(sessionId: string): Promise<ConsentRecord | null>;

  /**
   * Save consent preferences
   */
  saveConsent(
    sessionId: string,
    preferences: ConsentPreferences,
    metadata?: { ipAddress?: string; userAgent?: string }
  ): Promise<ConsentRecord>;

  /**
   * Check if analytics is consented
   */
  hasAnalyticsConsent(sessionId: string): Promise<boolean>;
}

/**
 * Email Service
 */
export interface IEmailService {
  /**
   * Send email
   */
  send(options: EmailOptions): Promise<EmailResult>;

  /**
   * Send templated email
   */
  sendTemplate(templateId: string, to: string, data: Record<string, unknown>): Promise<EmailResult>;
}

export interface EmailOptions {
  to: string | string[];
  from?: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  tags?: string[];
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * AI Service
 */
export interface IAIService {
  /**
   * Generate chat response
   */
  generateChatResponse(
    messages: Message[],
    context?: Record<string, unknown>
  ): Promise<AIResponse>;

  /**
   * Analyze lead intelligence
   */
  analyzeLeadIntel(data: LeadAnalysisInput): Promise<LeadAnalysisResult>;

  /**
   * Generate content
   */
  generateContent(prompt: string, options?: ContentGenerationOptions): Promise<string>;
}

export interface AIResponse {
  content: string;
  usage?: {
    inputTokens: number;
    outputTokens: number;
  };
  model?: string;
}

export interface LeadAnalysisInput {
  name?: string;
  email: string;
  company?: string;
  jobTitle?: string;
  message?: string;
  pageContext?: string;
}

export interface LeadAnalysisResult {
  detectedIntent: string;
  intentConfidence: number;
  urgency: string;
  personalizedGreeting: string;
  personalizedMessage: string;
  suggestedNextSteps: string[];
  companyIntel: {
    likelyIndustry: string;
    estimatedSize: string;
    potentialUseCases: string[];
  };
  contactIntel: {
    seniority: string;
    department: string;
    decisionMaker: boolean;
  };
  summary: string;
}

export interface ContentGenerationOptions {
  maxTokens?: number;
  temperature?: number;
  systemPrompt?: string;
}
