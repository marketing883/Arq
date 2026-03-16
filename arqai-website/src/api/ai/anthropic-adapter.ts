/**
 * Anthropic Claude API Adapter
 *
 * Implements AI service interface for Anthropic's Claude API.
 */

import type {
  IAIService,
  AIResponse,
  LeadAnalysisInput,
  LeadAnalysisResult,
  ContentGenerationOptions,
  Message,
} from "@/src/core";
import type { AIModelConfig, AIChatMessage, AICompletionResponse } from "./types";
import { AIError } from "./types";

/**
 * Anthropic client configuration
 */
export interface AnthropicConfig {
  apiKey: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

/**
 * Default configuration
 */
const DEFAULT_CONFIG: Partial<AnthropicConfig> = {
  model: "claude-sonnet-4-20250514",
  maxTokens: 1024,
  temperature: 0.7,
};

/**
 * Knowledge base for context
 */
const SYSTEM_PROMPT = `You are an AI assistant for ArqAI, an enterprise AI governance platform. You help visitors understand ArqAI's products, answer questions about AI governance, and assist with lead qualification.

Key product offerings:
- ArqFWA: AI model firewall and access control
- ArqIntel: AI usage analytics and insights
- ArqOptimize: AI cost optimization and efficiency
- ArqRelease: AI model deployment and management

Be helpful, professional, and concise. If asked about pricing, suggest they contact sales or schedule a demo. If the question seems like a sales opportunity, gather relevant information about their company and use case.`;

/**
 * Anthropic API Adapter
 */
export class AnthropicAdapter implements IAIService {
  private config: AnthropicConfig;

  constructor(config: Partial<AnthropicConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config } as AnthropicConfig;

    if (!this.config.apiKey) {
      this.config.apiKey = process.env.ANTHROPIC_API_KEY || "";
    }
  }

  async generateChatResponse(
    messages: Message[],
    context?: Record<string, unknown>
  ): Promise<AIResponse> {
    const systemPrompt = this.buildSystemPrompt(context);

    const apiMessages: AIChatMessage[] = messages.map((m) => ({
      role: m.role === "system" ? "user" : m.role,
      content: m.content,
    }));

    const response = await this.callAPI(systemPrompt, apiMessages);

    return {
      content: response.content,
      usage: {
        inputTokens: response.usage.inputTokens,
        outputTokens: response.usage.outputTokens,
      },
      model: response.model,
    };
  }

  async analyzeLeadIntel(data: LeadAnalysisInput): Promise<LeadAnalysisResult> {
    const prompt = this.buildLeadAnalysisPrompt(data);

    const response = await this.callAPI(
      "You are a lead intelligence analyst. Analyze the following contact form submission and provide structured insights.",
      [{ role: "user", content: prompt }],
      { temperature: 0.3 } // Lower temperature for more consistent analysis
    );

    return this.parseLeadAnalysisResponse(response.content);
  }

  async generateContent(
    prompt: string,
    options?: ContentGenerationOptions
  ): Promise<string> {
    const response = await this.callAPI(
      options?.systemPrompt || "You are a content writer for an enterprise AI governance company.",
      [{ role: "user", content: prompt }],
      {
        maxTokens: options?.maxTokens,
        temperature: options?.temperature,
      }
    );

    return response.content;
  }

  /**
   * Call the Anthropic API
   */
  private async callAPI(
    systemPrompt: string,
    messages: AIChatMessage[],
    overrides: Partial<AIModelConfig> = {}
  ): Promise<AICompletionResponse> {
    const body = {
      model: overrides.model || this.config.model,
      max_tokens: overrides.maxTokens || this.config.maxTokens,
      temperature: overrides.temperature ?? this.config.temperature,
      system: systemPrompt,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    };

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": this.config.apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw this.mapAPIError(response.status, error);
      }

      const data = await response.json();

      return {
        content: data.content[0]?.text || "",
        model: data.model,
        usage: {
          inputTokens: data.usage?.input_tokens || 0,
          outputTokens: data.usage?.output_tokens || 0,
          totalTokens:
            (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0),
        },
        finishReason: data.stop_reason,
      };
    } catch (error) {
      if (error instanceof AIError) throw error;
      throw new AIError(
        `Anthropic API error: ${error instanceof Error ? error.message : "Unknown error"}`,
        "unknown"
      );
    }
  }

  /**
   * Build system prompt with context
   */
  private buildSystemPrompt(context?: Record<string, unknown>): string {
    let prompt = SYSTEM_PROMPT;

    if (context?.pageContext) {
      const pageContext = context.pageContext as { currentPage?: string };
      prompt += `\n\nThe user is currently viewing: ${pageContext.currentPage || "unknown page"}`;
    }

    return prompt;
  }

  /**
   * Build lead analysis prompt
   */
  private buildLeadAnalysisPrompt(data: LeadAnalysisInput): string {
    return `Analyze this contact form submission and provide insights:

Name: ${data.name || "Not provided"}
Email: ${data.email}
Company: ${data.company || "Not provided"}
Job Title: ${data.jobTitle || "Not provided"}
Message: ${data.message || "Not provided"}
Page Context: ${data.pageContext || "Not provided"}

Provide analysis in JSON format with the following structure:
{
  "detectedIntent": "demo|pricing|support|partnership|general|urgent",
  "intentConfidence": 0.0-1.0,
  "urgency": "high|medium|low",
  "personalizedGreeting": "personalized greeting",
  "personalizedMessage": "follow-up message",
  "suggestedNextSteps": ["step1", "step2"],
  "companyIntel": {
    "likelyIndustry": "industry",
    "estimatedSize": "startup|smb|mid-market|enterprise",
    "potentialUseCases": ["use case 1"]
  },
  "contactIntel": {
    "seniority": "c-level|vp|director|manager|individual",
    "department": "department",
    "decisionMaker": true/false
  },
  "summary": "one sentence summary"
}`;
  }

  /**
   * Parse lead analysis response
   */
  private parseLeadAnalysisResponse(content: string): LeadAnalysisResult {
    try {
      // Extract JSON from response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]) as LeadAnalysisResult;
      }
    } catch {
      // Fallback to default values
    }

    return {
      detectedIntent: "general",
      intentConfidence: 0.5,
      urgency: "medium",
      personalizedGreeting: "Thank you for reaching out!",
      personalizedMessage:
        "We appreciate your interest in ArqAI and will get back to you shortly.",
      suggestedNextSteps: ["Review inquiry", "Send follow-up email"],
      companyIntel: {
        likelyIndustry: "Unknown",
        estimatedSize: "Unknown",
        potentialUseCases: [],
      },
      contactIntel: {
        seniority: "individual",
        department: "Unknown",
        decisionMaker: false,
      },
      summary: "General inquiry received",
    };
  }

  /**
   * Map API errors to typed errors
   */
  private mapAPIError(
    statusCode: number,
    error: Record<string, unknown>
  ): AIError {
    const errorObj = error.error as Record<string, unknown> | undefined;
    const message: string =
      (errorObj?.message as string) ||
      (error.message as string) ||
      "Unknown API error";

    switch (statusCode) {
      case 401:
        return new AIError(message, "authentication", statusCode);
      case 429:
        return new AIError(message, "rate_limit", statusCode, true);
      case 400:
        if (message.includes("context length")) {
          return new AIError(message, "context_length", statusCode);
        }
        return new AIError(message, "invalid_request", statusCode);
      case 500:
      case 502:
      case 503:
        return new AIError(message, "server_error", statusCode, true);
      default:
        return new AIError(message, "unknown", statusCode);
    }
  }
}

/**
 * Factory function to create Anthropic adapter
 */
export function createAnthropicAdapter(
  config?: Partial<AnthropicConfig>
): AnthropicAdapter {
  return new AnthropicAdapter(config);
}
