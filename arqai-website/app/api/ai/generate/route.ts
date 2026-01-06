import { NextRequest, NextResponse } from "next/server";
import { generateWithClaude, isConfigured } from "@/lib/ai/client";
import {
  buildTitlePrompt,
  buildDescriptionPrompt,
  buildOutlinePrompt,
  buildContentPrompt,
  buildFAQPrompt,
  buildOGPrompt,
  buildKeywordExtractionPrompt,
  buildEntityExtractionPrompt,
  buildAnalysisPrompt,
} from "@/lib/ai/prompts";
import type { KeywordResearchResult } from "@/lib/dataforseo/types";

export const maxDuration = 60; // Allow up to 60 seconds for content generation

type GenerationType =
  | "title"
  | "description"
  | "outline"
  | "content"
  | "faq"
  | "og_title"
  | "og_description"
  | "extract_keywords"
  | "extract_entities"
  | "analyze";

interface GenerationRequest {
  type: GenerationType;
  topic: string;
  focusKeyword: string;
  seoData?: KeywordResearchResult | null;
  toneId?: string;
  audienceIds?: string[];
  customAudience?: string;
  lengthId?: string;
  includeStats?: boolean;
  includeFaqs?: boolean;
  includeActionables?: boolean;
  existingContent?: string;
}

export async function POST(request: NextRequest) {
  try {
    if (!isConfigured()) {
      return NextResponse.json(
        { error: "Anthropic API not configured" },
        { status: 500 }
      );
    }

    const body: GenerationRequest = await request.json();
    const {
      type,
      topic,
      focusKeyword,
      seoData,
      toneId = "authoritative-trustworthy",
      audienceIds = ["c-suite", "it-leaders"],
      customAudience,
      lengthId = "standard",
      includeStats = true,
      includeFaqs = true,
      includeActionables = true,
      existingContent,
    } = body;

    if (!type) {
      return NextResponse.json({ error: "Generation type is required" }, { status: 400 });
    }

    const context = {
      topic,
      focusKeyword,
      seoData,
      toneId,
      audienceIds,
      customAudience,
      lengthId,
      includeStats,
      includeFaqs,
      includeActionables,
      existingContent,
    };

    let prompt: { system: string; user: string };
    let options = { maxTokens: 4096, temperature: 0.7 };

    switch (type) {
      case "title":
        prompt = buildTitlePrompt(context);
        options = { maxTokens: 500, temperature: 0.8 };
        break;

      case "description":
        prompt = buildDescriptionPrompt(context);
        options = { maxTokens: 500, temperature: 0.7 };
        break;

      case "outline":
        prompt = buildOutlinePrompt(context);
        options = { maxTokens: 2000, temperature: 0.6 };
        break;

      case "content":
        prompt = buildContentPrompt(context);
        options = { maxTokens: 8000, temperature: 0.7 };
        break;

      case "faq":
        prompt = buildFAQPrompt(context);
        options = { maxTokens: 1500, temperature: 0.6 };
        break;

      case "og_title":
        prompt = buildOGPrompt(context, "title");
        options = { maxTokens: 300, temperature: 0.8 };
        break;

      case "og_description":
        prompt = buildOGPrompt(context, "description");
        options = { maxTokens: 500, temperature: 0.7 };
        break;

      case "extract_keywords":
        if (!existingContent) {
          return NextResponse.json(
            { error: "Content is required for keyword extraction" },
            { status: 400 }
          );
        }
        prompt = buildKeywordExtractionPrompt(existingContent);
        options = { maxTokens: 500, temperature: 0.3 };
        break;

      case "extract_entities":
        prompt = buildEntityExtractionPrompt(context);
        options = { maxTokens: 500, temperature: 0.4 };
        break;

      case "analyze":
        if (!existingContent) {
          return NextResponse.json(
            { error: "Content is required for analysis" },
            { status: 400 }
          );
        }
        prompt = buildAnalysisPrompt(existingContent, focusKeyword);
        options = { maxTokens: 1500, temperature: 0.3 };
        break;

      default:
        return NextResponse.json({ error: "Invalid generation type" }, { status: 400 });
    }

    const result = await generateWithClaude(prompt.system, prompt.user, options);

    // Parse structured responses (FAQ, extract_keywords, extract_entities, analyze)
    if (type === "faq" || type === "extract_keywords" || type === "extract_entities" || type === "analyze") {
      try {
        // Extract JSON from the response
        const jsonMatch = result.match(/\[[\s\S]*\]|\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return NextResponse.json({ result: parsed, raw: result });
        }
      } catch {
        // Return raw if JSON parsing fails
        return NextResponse.json({ result, raw: result });
      }
    }

    // For title/description, split into options
    if (
      type === "title" ||
      type === "description" ||
      type === "og_title" ||
      type === "og_description"
    ) {
      const options = result
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 10 && !line.startsWith("#") && !line.match(/^\d+\./));

      return NextResponse.json({
        result: options.length > 0 ? options[0] : result,
        options: options.slice(0, 3),
        raw: result,
      });
    }

    return NextResponse.json({ result, raw: result });
  } catch (error) {
    console.error("AI generation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Generation failed" },
      { status: 500 }
    );
  }
}
