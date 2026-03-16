/**
 * AI API Types
 *
 * Common types for AI service integrations.
 */

/**
 * AI model configuration
 */
export interface AIModelConfig {
  model: string;
  maxTokens?: number;
  temperature?: number;
  topP?: number;
}

/**
 * Chat message format for AI APIs
 */
export interface AIChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

/**
 * AI response
 */
export interface AICompletionResponse {
  content: string;
  model: string;
  usage: {
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
  };
  finishReason?: string;
}

/**
 * AI error types
 */
export type AIErrorType =
  | "rate_limit"
  | "invalid_request"
  | "authentication"
  | "server_error"
  | "context_length"
  | "content_filter"
  | "unknown";

/**
 * AI error
 */
export class AIError extends Error {
  constructor(
    message: string,
    public type: AIErrorType,
    public statusCode?: number,
    public retryable: boolean = false
  ) {
    super(message);
    this.name = "AIError";
  }
}
