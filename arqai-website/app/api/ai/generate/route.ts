import { NextRequest, NextResponse } from "next/server";
import { generateWithClaude, isConfigured } from "@/lib/ai/client";
import {
  buildTitlePrompt,
  buildDescriptionPrompt,
  buildExcerptPrompt,
  buildOutlinePrompt,
  buildContentPrompt,
  buildFAQPrompt,
  buildOGPrompt,
  buildKeywordExtractionPrompt,
  buildKeywordSuggestionPrompt,
  buildEntityExtractionPrompt,
  buildAnalysisPrompt,
  // Case Study prompts
  buildCaseStudyTitlePrompt,
  buildCaseStudyOverviewPrompt,
  buildCaseStudyChallengePrompt,
  buildCaseStudySolutionPrompt,
  buildCaseStudyImpactPrompt,
  buildCaseStudyTestimonialPrompt,
  buildCaseStudyMetricsPrompt,
  // Webinar prompts
  buildWebinarTitlePrompt,
  buildWebinarDescriptionPrompt,
  buildWebinarLearningPointsPrompt,
  buildWebinarPromoPrompt,
  // Whitepaper prompts
  buildWhitepaperTitlePrompt,
  buildWhitepaperDescriptionPrompt,
  buildWhitepaperOutlinePrompt,
  buildWhitepaperKeyTakeawaysPrompt,
} from "@/lib/ai/prompts";
import type { KeywordResearchResult } from "@/lib/dataforseo/types";

export const maxDuration = 60; // Allow up to 60 seconds for content generation

type GenerationType =
  | "title"
  | "description"
  | "excerpt"
  | "outline"
  | "content"
  | "faq"
  | "og_title"
  | "og_description"
  | "extract_keywords"
  | "suggest_keywords"
  | "extract_entities"
  | "analyze"
  // Case Study types
  | "casestudy_title"
  | "casestudy_overview"
  | "casestudy_challenge"
  | "casestudy_solution"
  | "casestudy_impact"
  | "casestudy_testimonial"
  | "casestudy_metrics"
  // Webinar types
  | "webinar_title"
  | "webinar_description"
  | "webinar_learning_points"
  | "webinar_promo"
  // Whitepaper types
  | "whitepaper_title"
  | "whitepaper_description"
  | "whitepaper_outline"
  | "whitepaper_key_takeaways";

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
  // Case Study specific fields
  client_name?: string;
  industry?: string;
  overview?: string;
  challenge_description?: string;
  solution_description?: string;
  // Webinar specific fields
  title?: string;
  description?: string;
  presenters?: string;
  // Whitepaper specific fields
  category?: string;
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

      case "excerpt":
        if (!existingContent) {
          return NextResponse.json(
            { error: "Content is required for excerpt generation" },
            { status: 400 }
          );
        }
        prompt = buildExcerptPrompt(existingContent, focusKeyword);
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

      case "suggest_keywords":
        prompt = buildKeywordSuggestionPrompt(context);
        options = { maxTokens: 500, temperature: 0.5 };
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

      // Case Study generation types
      case "casestudy_title":
        prompt = buildCaseStudyTitlePrompt({
          client_name: body.client_name,
          industry: body.industry,
          overview: body.overview,
        });
        options = { maxTokens: 500, temperature: 0.8 };
        break;

      case "casestudy_overview":
        prompt = buildCaseStudyOverviewPrompt({
          client_name: body.client_name,
          industry: body.industry,
          challenge_description: body.challenge_description,
          solution_description: body.solution_description,
        });
        options = { maxTokens: 800, temperature: 0.7 };
        break;

      case "casestudy_challenge":
        prompt = buildCaseStudyChallengePrompt({
          client_name: body.client_name,
          industry: body.industry,
          overview: body.overview,
        });
        options = { maxTokens: 1000, temperature: 0.7 };
        break;

      case "casestudy_solution":
        prompt = buildCaseStudySolutionPrompt({
          client_name: body.client_name,
          industry: body.industry,
          challenge_description: body.challenge_description,
          overview: body.overview,
        });
        options = { maxTokens: 1000, temperature: 0.7 };
        break;

      case "casestudy_impact":
        prompt = buildCaseStudyImpactPrompt({
          client_name: body.client_name,
          industry: body.industry,
          solution_description: body.solution_description,
        });
        options = { maxTokens: 600, temperature: 0.7 };
        break;

      case "casestudy_testimonial":
        prompt = buildCaseStudyTestimonialPrompt({
          client_name: body.client_name,
          industry: body.industry,
          overview: body.overview,
          solution_description: body.solution_description,
        });
        options = { maxTokens: 600, temperature: 0.8 };
        break;

      case "casestudy_metrics":
        prompt = buildCaseStudyMetricsPrompt({
          client_name: body.client_name,
          industry: body.industry,
          overview: body.overview,
          solution_description: body.solution_description,
        });
        options = { maxTokens: 800, temperature: 0.6 };
        break;

      // Webinar generation types
      case "webinar_title":
        prompt = buildWebinarTitlePrompt({
          title: body.title,
          description: body.description,
          presenters: body.presenters,
          topic: body.topic,
        });
        options = { maxTokens: 500, temperature: 0.8 };
        break;

      case "webinar_description":
        prompt = buildWebinarDescriptionPrompt({
          title: body.title,
          topic: body.topic,
          presenters: body.presenters,
        });
        options = { maxTokens: 800, temperature: 0.7 };
        break;

      case "webinar_learning_points":
        prompt = buildWebinarLearningPointsPrompt({
          title: body.title,
          description: body.description,
          topic: body.topic,
        });
        options = { maxTokens: 600, temperature: 0.6 };
        break;

      case "webinar_promo":
        prompt = buildWebinarPromoPrompt({
          title: body.title,
          description: body.description,
          presenters: body.presenters,
        });
        options = { maxTokens: 800, temperature: 0.7 };
        break;

      // Whitepaper generation types
      case "whitepaper_title":
        prompt = buildWhitepaperTitlePrompt({
          title: body.title,
          description: body.description,
          topic: body.topic,
          category: body.category,
        });
        options = { maxTokens: 500, temperature: 0.8 };
        break;

      case "whitepaper_description":
        prompt = buildWhitepaperDescriptionPrompt({
          title: body.title,
          topic: body.topic,
          category: body.category,
        });
        options = { maxTokens: 800, temperature: 0.7 };
        break;

      case "whitepaper_outline":
        prompt = buildWhitepaperOutlinePrompt({
          title: body.title,
          topic: body.topic,
          category: body.category,
          description: body.description,
        });
        options = { maxTokens: 2000, temperature: 0.6 };
        break;

      case "whitepaper_key_takeaways":
        prompt = buildWhitepaperKeyTakeawaysPrompt({
          title: body.title,
          description: body.description,
          topic: body.topic,
        });
        options = { maxTokens: 600, temperature: 0.6 };
        break;

      default:
        return NextResponse.json({ error: "Invalid generation type" }, { status: 400 });
    }

    const result = await generateWithClaude(prompt.system, prompt.user, options);

    // Parse structured responses (FAQ, extract_keywords, suggest_keywords, extract_entities, analyze, casestudy_metrics)
    if (type === "faq" || type === "extract_keywords" || type === "suggest_keywords" || type === "extract_entities" || type === "analyze" || type === "casestudy_metrics") {
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

    // For title/description types, split into options
    if (
      type === "title" ||
      type === "description" ||
      type === "og_title" ||
      type === "og_description" ||
      type === "casestudy_title" ||
      type === "webinar_title" ||
      type === "whitepaper_title"
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

    // For content with multiple options separated by ---
    if (
      type === "excerpt" ||
      type === "casestudy_overview" ||
      type === "casestudy_impact" ||
      type === "casestudy_testimonial" ||
      type === "webinar_description" ||
      type === "whitepaper_description"
    ) {
      const options = result
        .split("---")
        .map((section) => section.trim())
        .filter((section) => section.length > 20);

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
