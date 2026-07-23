import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT, resolvePageContextPrompt } from "./knowledge-base";
import { CHAT_MODEL } from "./models";

// Lazy initialization to prevent build-time errors
let anthropicClient: Anthropic | null = null;

function getAnthropicClient(): Anthropic {
  if (!anthropicClient) {
    const apiKey = process.env.ANTHROPIC_API_KEY;

    // Debug: Log if API key is present (not the actual key)
    console.log("[Anthropic] API key present:", !!apiKey, "Length:", apiKey?.length || 0);

    if (!apiKey) {
      throw new Error("ANTHROPIC_API_KEY environment variable is not set");
    }

    anthropicClient = new Anthropic({
      apiKey: apiKey,
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
  /** Extra grounding injected into the system prompt (e.g. retrieved content). */
  extraContext?: string;
}

// ============================================
// Machine block ([[META ...]]) protocol
// ============================================

export interface ChatAction {
  type: "quick_replies" | "link" | "ask_email";
  options?: string[];
  label?: string;
  href?: string;
}

export interface ChatMeta {
  actions: ChatAction[];
  extracted: Partial<{
    name: string;
    email: string;
    company: string;
    job_title: string;
    phone: string;
    industry: string;
    workflow: string;
    timeline: string;
    systems: string;
  }>;
}

/** Marker that opens the machine block appended to every model reply. */
export const META_MARKER = "[[META";

/**
 * Split a raw model reply into visible text and the parsed machine block.
 * Tolerant: a missing or malformed block yields meta=null and the full text.
 */
export function parseMetaBlock(raw: string): { text: string; meta: ChatMeta | null } {
  const idx = raw.lastIndexOf(META_MARKER);
  if (idx === -1) return { text: raw.trim(), meta: null };

  const text = raw.slice(0, idx).trim();
  const tail = raw.slice(idx + META_MARKER.length);
  const jsonStart = tail.indexOf("{");
  const jsonEnd = tail.lastIndexOf("}");
  if (jsonStart === -1 || jsonEnd === -1 || jsonEnd < jsonStart) {
    return { text, meta: null };
  }
  try {
    const parsed = JSON.parse(tail.slice(jsonStart, jsonEnd + 1));
    const actions: ChatAction[] = Array.isArray(parsed.actions)
      ? parsed.actions
          .filter(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (a: any) =>
              a &&
              (a.type === "quick_replies" || a.type === "link" || a.type === "ask_email")
          )
          .slice(0, 3)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((a: any) => ({
            type: a.type,
            options: Array.isArray(a.options)
              ? a.options.map(String).slice(0, 4)
              : undefined,
            label: typeof a.label === "string" ? a.label.slice(0, 60) : undefined,
            // Internal links only: never let the model send visitors off-site.
            href:
              typeof a.href === "string" && a.href.startsWith("/")
                ? a.href
                : undefined,
          }))
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .filter((a: any) => (a.type === "link" ? !!a.href : true))
      : [];
    const extracted =
      parsed.extracted && typeof parsed.extracted === "object" ? parsed.extracted : {};
    return { text, meta: { actions, extracted } };
  } catch {
    return { text, meta: null };
  }
}

/** Assemble the full system prompt for a chat turn. */
export function buildChatSystemPrompt(context: ChatContext): string {
  const pageContext = resolvePageContextPrompt(context.currentPage);
  let systemPrompt = SYSTEM_PROMPT;
  systemPrompt += `\n\n## Current Context:\n`;
  systemPrompt += `- User is on: ${context.currentPage}\n`;
  systemPrompt += `- Page context: ${pageContext}\n`;
  if (context.userName) systemPrompt += `- User's name: ${context.userName}\n`;
  if (context.userCompany) systemPrompt += `- User's company: ${context.userCompany}\n`;
  if (context.userEmail) systemPrompt += `- User's email (already captured, do not ask again): ${context.userEmail}\n`;
  if (context.extraContext) systemPrompt += `\n${context.extraContext}\n`;
  return systemPrompt;
}

function buildChatMessages(userMessage: string, context: ChatContext) {
  const messages = context.conversationHistory.map((msg) => ({
    role: msg.role as "user" | "assistant",
    content: msg.content,
  }));
  messages.push({ role: "user" as const, content: userMessage });
  return messages;
}

export interface ChatGenerationResult {
  text: string;
  meta: ChatMeta | null;
}

export async function generateChatResponse(
  userMessage: string,
  context: ChatContext
): Promise<ChatGenerationResult> {
  const anthropic = getAnthropicClient();

  try {
    const response = await anthropic.messages.create({
      model: CHAT_MODEL,
      max_tokens: 500,
      system: buildChatSystemPrompt(context),
      messages: buildChatMessages(userMessage, context),
    });

    const textContent = response.content.find((block) => block.type === "text");
    if (textContent && textContent.type === "text") {
      return parseMetaBlock(textContent.text);
    }

    return {
      text: "I apologize, but I couldn't generate a response. Please try again.",
      meta: null,
    };
  } catch (error) {
    console.error("Anthropic API error:", error);
    throw error;
  }
}

/**
 * Streaming variant: returns the SDK message stream. The caller is
 * responsible for scanning out the trailing [[META ...]] block before
 * forwarding text to the client (see /api/chat).
 */
export function streamChatResponse(userMessage: string, context: ChatContext) {
  const anthropic = getAnthropicClient();
  return anthropic.messages.stream({
    model: CHAT_MODEL,
    max_tokens: 500,
    system: buildChatSystemPrompt(context),
    messages: buildChatMessages(userMessage, context),
  });
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

  // Email regex - case insensitive
  const emailRegex = /[\w.-]+@[\w.-]+\.\w+/gi;
  const emailMatch = message.match(emailRegex);
  if (emailMatch) {
    extracted.email = emailMatch[0].toLowerCase();
  }

  // Phone regex (various formats)
  const phoneRegex = /(?:\+?1[-.]?)?\(?[0-9]{3}\)?[-.]?[0-9]{3}[-.]?[0-9]{4}/g;
  const phoneMatch = message.match(phoneRegex);
  if (phoneMatch) {
    extracted.phone = phoneMatch[0];
  }

  // Enhanced name patterns - much more flexible, handles lowercase input
  const namePatterns = [
    // "I'm John Smith" or "I am John" - handles any case
    /(?:i'?m|i am|my name is|my name's|this is|call me|it's|its|hey,?\s*(?:i'?m|this is)?)\s+([a-z][a-z'-]*(?:\s+[a-z][a-z'-]*)?)/i,
    // "John here" or "John Smith here"
    /^([a-z][a-z'-]+(?:\s+[a-z][a-z'-]+)?)\s+here/i,
    // "name: John" or "name - John Smith" or "name is john"
    /name(?:\s+is)?[\s:=-]+([a-z][a-z'-]+(?:\s+[a-z][a-z'-]+)?)/i,
    // Looking for standalone name after greeting: "Hi, I'm john" -> "john"
    /(?:hi|hello|hey)[,!.]?\s+(?:i'?m|my name is)\s+([a-z][a-z'-]+(?:\s+[a-z][a-z'-]+)?)/i,
  ];

  for (const pattern of namePatterns) {
    const match = message.match(pattern);
    if (match && match[1]) {
      // Capitalize properly: "john smith" -> "John Smith"
      const name = match[1].trim();
      extracted.name = name.split(/\s+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
      break;
    }
  }

  // Enhanced company patterns - more flexible
  const companyPatterns = [
    /(?:work(?:ing)?\s+(?:at|for)|from|representing|with)\s+([A-Za-z][A-Za-z0-9\s&.'-]+?)(?:\.|,|!|\?|$|\s+and\s|\s+in\s|\s+as\s)/i,
    /(?:company(?:'s| is| name is)?|our company|organization|business)\s+(?:is\s+)?([A-Za-z][A-Za-z0-9\s&.'-]+?)(?:\.|,|!|\?|$)/i,
    /(?:we're|we are|i represent)\s+([A-Za-z][A-Za-z0-9\s&.'-]+?)(?:\.|,|!|\?|$|\s+and)/i,
    /company[\s:=-]+([A-Za-z][A-Za-z0-9\s&.'-]+?)(?:\.|,|!|\?|$)/i,
  ];

  for (const pattern of companyPatterns) {
    const match = message.match(pattern);
    if (match && match[1]) {
      const company = match[1].trim();
      // Filter out common false positives
      const falsePositives = ['a', 'the', 'an', 'my', 'our', 'your', 'this', 'that', 'here', 'there'];
      if (!falsePositives.includes(company.toLowerCase()) && company.length > 1) {
        extracted.company = company;
        break;
      }
    }
  }

  // Enhanced job title patterns
  const titlePatterns = [
    /(?:i'?m\s+(?:a|the|an)?|i am\s+(?:a|the|an)?|work(?:ing)?\s+as\s+(?:a|an)?|my (?:role|title|position) is)\s+([A-Za-z\s]+?)(?:\s+at|\s+for|\s+in|\.|,|!|\?|$)/i,
    /(?:role|title|position)[\s:=-]+([A-Za-z\s]+?)(?:\.|,|!|\?|$)/i,
  ];

  for (const pattern of titlePatterns) {
    const match = message.match(pattern);
    if (match && match[1]) {
      const title = match[1].trim();
      if (title.length > 1) {
        extracted.jobTitle = title;
        break;
      }
    }
  }

  return extracted;
}
