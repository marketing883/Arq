import OpenAI from "openai";
import { SYSTEM_PROMPT, PAGE_CONTEXT_PROMPTS } from "./knowledge-base";
import type { ChatMessage, ChatContext } from "./anthropic";

// Lazy initialization to prevent build-time errors
let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY;

    // Debug: Log if API key is present (not the actual key)
    console.log("[OpenAI] API key present:", !!apiKey, "Length:", apiKey?.length || 0);

    if (!apiKey) {
      throw new Error("OPENAI_API_KEY environment variable is not set");
    }

    openaiClient = new OpenAI({
      apiKey: apiKey,
    });
  }
  return openaiClient;
}

export async function generateChatResponseOpenAI(
  userMessage: string,
  context: ChatContext
): Promise<string> {
  const openai = getOpenAIClient();
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

  // Convert conversation history to OpenAI format
  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: "system", content: systemPrompt },
    ...context.conversationHistory.map((msg) => ({
      role: msg.role as "user" | "assistant",
      content: msg.content,
    })),
    { role: "user", content: userMessage },
  ];

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      max_tokens: 300,
      messages: messages,
    });

    return response.choices[0]?.message?.content || "I apologize, but I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw error;
  }
}
