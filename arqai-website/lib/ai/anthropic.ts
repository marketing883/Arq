import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT, PAGE_CONTEXT_PROMPTS } from "./knowledge-base";

// Lazy initialization to prevent build-time errors
let anthropicClient: Anthropic | null = null;

function getAnthropicClient(): Anthropic {
  if (!anthropicClient) {
    anthropicClient = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }
  return anthropicClient;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatContext {
  currentPage: string;
  userName?: string;
  userEmail?: string;
  userCompany?: string;
  conversationHistory: ChatMessage[];
}

export async function generateChatResponse(
  userMessage: string,
  context: ChatContext
): Promise<string> {
  const anthropic = getAnthropicClient();
  const pageContext = PAGE_CONTEXT_PROMPTS[context.currentPage] || PAGE_CONTEXT_PROMPTS["/"];

  // Build context-aware system prompt
  let systemPrompt = SYSTEM_PROMPT;
  systemPrompt += `\n\n## Current Context:\n`;
  systemPrompt += `- User is on: ${context.currentPage}\n`;
  systemPrompt += `- Page context: ${pageContext}\n`;

  if (context.userName) {
    systemPrompt += `- User's name: ${context.userName}\n`;
  }
  if (context.userCompany) {
    systemPrompt += `- User's company: ${context.userCompany}\n`;
  }

  // Convert conversation history to Anthropic format
  const messages = context.conversationHistory.map((msg) => ({
    role: msg.role as "user" | "assistant",
    content: msg.content,
  }));

  // Add the current user message
  messages.push({
    role: "user" as const,
    content: userMessage,
  });

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 300,
      system: systemPrompt,
      messages: messages,
    });

    // Extract text from response
    const textContent = response.content.find((block) => block.type === "text");
    if (textContent && textContent.type === "text") {
      return textContent.text;
    }

    return "I apologize, but I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("Anthropic API error:", error);
    throw error;
  }
}

// Detect if the message should trigger content morphing
export function detectMorphTriggers(response: string, userMessage?: string): string | null {
  const triggers: Record<string, string[]> = {
    comparison: ["competitor", "compare", "different from", "vs", "versus", "alternatives", "other platform"],
    roi: ["roi", "return on investment", "business case", "cost savings", "value", "pricing", "budget"],
    architecture: ["how it works", "architecture", "technical", "diagram", "flow", "under the hood"],
    "case-study": ["case study", "success story", "customer story", "example", "results", "outcomes"],
    timeline: ["timeline", "implementation", "how long", "deployment", "rollout", "schedule"],
    integration: ["integration", "connect", "integrate", "api", "ecosystem", "systems", "tools", "crm", "erp"],
    features: ["features", "capabilities", "what can", "automat", "process", "manufacturing", "workflow", "use case", "help with"],
  };

  // Check both user message and AI response for triggers
  const textToCheck = `${userMessage || ""} ${response}`.toLowerCase();

  for (const [blockType, keywords] of Object.entries(triggers)) {
    for (const keyword of keywords) {
      if (textToCheck.includes(keyword)) {
        return blockType;
      }
    }
  }

  return null;
}

// Extract lead information from conversation
export function extractLeadInfo(message: string): Partial<{
  name: string;
  email: string;
  company: string;
  jobTitle: string;
  phone: string;
}> {
  const extracted: Partial<{
    name: string;
    email: string;
    company: string;
    jobTitle: string;
    phone: string;
  }> = {};

  // Email regex
  const emailRegex = /[\w.-]+@[\w.-]+\.\w+/g;
  const emailMatch = message.match(emailRegex);
  if (emailMatch) {
    extracted.email = emailMatch[0];
  }

  // Phone regex (various formats)
  const phoneRegex = /(?:\+?1[-.]?)?\(?[0-9]{3}\)?[-.]?[0-9]{3}[-.]?[0-9]{4}/g;
  const phoneMatch = message.match(phoneRegex);
  if (phoneMatch) {
    extracted.phone = phoneMatch[0];
  }

  // Name patterns (e.g., "I'm John", "My name is John Smith", "This is John")
  const namePatterns = [
    /(?:i'm|i am|my name is|this is|call me)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i,
    /^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\s+here/i,
  ];

  for (const pattern of namePatterns) {
    const match = message.match(pattern);
    if (match) {
      extracted.name = match[1];
      break;
    }
  }

  // Company patterns
  const companyPatterns = [
    /(?:work at|work for|from|at|with)\s+([A-Z][A-Za-z0-9\s&]+?)(?:\.|,|$|\s+and|\s+in)/i,
    /(?:company is|company's|our company)\s+([A-Z][A-Za-z0-9\s&]+?)(?:\.|,|$)/i,
  ];

  for (const pattern of companyPatterns) {
    const match = message.match(pattern);
    if (match) {
      extracted.company = match[1].trim();
      break;
    }
  }

  // Job title patterns
  const titlePatterns = [
    /(?:i'm a|i am a|i'm the|i am the|work as a?|my role is|my title is)\s+([A-Za-z\s]+?)(?:\s+at|\s+for|\.|,|$)/i,
  ];

  for (const pattern of titlePatterns) {
    const match = message.match(pattern);
    if (match) {
      extracted.jobTitle = match[1].trim();
      break;
    }
  }

  return extracted;
}
