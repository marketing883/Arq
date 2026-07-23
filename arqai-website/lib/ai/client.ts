// Anthropic Claude API Client

import Anthropic from "@anthropic-ai/sdk";
import { CONTENT_MODEL } from "./models";

let anthropicClient: Anthropic | null = null;

export function getAnthropicClient(): Anthropic {
  if (!anthropicClient) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error("ANTHROPIC_API_KEY not configured");
    }
    anthropicClient = new Anthropic({ apiKey });
  }
  return anthropicClient;
}

export interface GenerationOptions {
  maxTokens?: number;
}

export async function generateWithClaude(
  systemPrompt: string,
  userPrompt: string,
  options: GenerationOptions = {}
): Promise<string> {
  const client = getAnthropicClient();

  const response = await client.messages.create({
    model: CONTENT_MODEL,
    max_tokens: options.maxTokens || 4096,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  return textBlock?.type === "text" ? textBlock.text : "";
}

export function isConfigured(): boolean {
  return !!process.env.ANTHROPIC_API_KEY;
}
