/**
 * Conversation Domain Model
 *
 * Represents chat conversations and messages in the system.
 */

/**
 * Message role in a conversation
 */
export type MessageRole = "user" | "assistant" | "system";

/**
 * A single message in a conversation
 */
export interface Message {
  id?: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  metadata?: MessageMetadata;
}

export interface MessageMetadata {
  intent?: string;
  confidence?: number;
  tokens?: number;
  model?: string;
}

/**
 * Page context for conversation
 */
export interface PageContext {
  currentPage: string;
  pageTitle?: string;
  referrer?: string;
  userIntent?: string;
}

/**
 * A chat conversation
 */
export interface Conversation {
  id: string;
  userId?: string;
  sessionId: string;
  messages: Message[];
  pageContext?: PageContext;
  startedAt: Date;
  endedAt?: Date;
  isActive: boolean;
  metadata?: ConversationMetadata;
}

export interface ConversationMetadata {
  source?: "widget" | "page" | "api";
  leadCaptured?: boolean;
  intentDetected?: string;
  totalTokens?: number;
}

/**
 * Intent detection result
 */
export interface DetectedIntent {
  intent: ConversationIntent;
  confidence: number;
  entities?: Record<string, string>;
}

export type ConversationIntent =
  | "demo_request"
  | "pricing_inquiry"
  | "support_request"
  | "partnership_inquiry"
  | "general_question"
  | "urgent_need"
  | "feature_question"
  | "competitor_comparison";
