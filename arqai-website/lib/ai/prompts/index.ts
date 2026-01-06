// AI Prompt Templates

import type { KeywordResearchResult } from "@/lib/dataforseo/types";
import {
  TONE_OPTIONS,
  AUDIENCE_PRESETS,
  LENGTH_OPTIONS,
  type ToneOption,
  type AudiencePreset,
  type LengthOption,
} from "../config";

interface GenerationContext {
  topic: string;
  focusKeyword: string;
  seoData?: KeywordResearchResult | null;
  toneId: string;
  audienceIds: string[];
  customAudience?: string;
  lengthId: string;
  includeStats?: boolean;
  includeFaqs?: boolean;
  includeActionables?: boolean;
  existingContent?: string;
}

function getTone(toneId: string): ToneOption {
  return TONE_OPTIONS.find((t) => t.id === toneId) || TONE_OPTIONS[0];
}

function getAudiences(audienceIds: string[]): AudiencePreset[] {
  return audienceIds
    .map((id) => AUDIENCE_PRESETS.find((a) => a.id === id))
    .filter(Boolean) as AudiencePreset[];
}

function getLength(lengthId: string): LengthOption {
  return LENGTH_OPTIONS.find((l) => l.id === lengthId) || LENGTH_OPTIONS[1];
}

function buildSEOContext(seoData: KeywordResearchResult | null | undefined): string {
  if (!seoData) return "";

  let context = `\n\nSEO RESEARCH DATA:\n`;
  context += `Focus Keyword: "${seoData.keyword}"\n`;
  context += `Search Volume: ${seoData.metrics.searchVolume}/month\n`;

  if (seoData.metrics.keywordDifficulty) {
    context += `Keyword Difficulty: ${seoData.metrics.keywordDifficulty}/100\n`;
  }

  if (seoData.relatedKeywords.length > 0) {
    context += `\nRelated Keywords to naturally include:\n`;
    seoData.relatedKeywords.slice(0, 8).forEach((kw) => {
      context += `- "${kw.keyword}" (${kw.searchVolume}/mo)\n`;
    });
  }

  if (seoData.questions.length > 0) {
    context += `\nQuestions people search for (address these in content):\n`;
    seoData.questions.slice(0, 6).forEach((q) => {
      context += `- ${q.question}\n`;
    });
  }

  if (seoData.competitors.length > 0) {
    context += `\nTop competitor articles:\n`;
    seoData.competitors.slice(0, 3).forEach((c, i) => {
      context += `${i + 1}. "${c.title}" - ${c.domain}\n`;
    });
  }

  return context;
}

function buildAudienceContext(
  audiences: AudiencePreset[],
  customAudience?: string
): string {
  if (audiences.length === 0 && !customAudience) {
    return "The target audience is Enterprise B2B professionals, including decision-makers and technical evaluators.";
  }

  let context = "TARGET AUDIENCE:\n";
  audiences.forEach((a) => {
    context += `${a.contextPrompt}\n`;
  });

  if (customAudience) {
    context += `Additional context: ${customAudience}\n`;
  }

  return context;
}

// ==================== TITLE GENERATION ====================

export function buildTitlePrompt(context: GenerationContext): {
  system: string;
  user: string;
} {
  const tone = getTone(context.toneId);
  const seoContext = buildSEOContext(context.seoData);

  const system = `You are an expert SEO copywriter specializing in B2B enterprise technology content. Your task is to generate compelling, SEO-optimized blog titles.

${tone.promptInstruction}

Guidelines:
- Include the focus keyword naturally (preferably near the beginning)
- Keep titles between 50-60 characters for optimal SERP display
- Create curiosity or promise clear value
- Make it stand out from competitor titles
- Avoid clickbait - maintain professional credibility`;

  const user = `Generate 3 different title options for a blog post about:

Topic: ${context.topic}
Focus Keyword: "${context.focusKeyword}"
${seoContext}

${
  context.seoData?.competitors?.length
    ? `\nCompetitor titles to differentiate from:\n${context.seoData.competitors
        .slice(0, 3)
        .map((c) => `- "${c.title}"`)
        .join("\n")}`
    : ""
}

Provide exactly 3 title options, each on its own line. No numbering, no explanations, just the titles.`;

  return { system, user };
}

// ==================== META DESCRIPTION GENERATION ====================

export function buildDescriptionPrompt(context: GenerationContext): {
  system: string;
  user: string;
} {
  const tone = getTone(context.toneId);
  const seoContext = buildSEOContext(context.seoData);

  const system = `You are an expert SEO copywriter. Your task is to write compelling meta descriptions that drive clicks from search results.

${tone.promptInstruction}

Guidelines:
- Length: 150-160 characters (critical - search engines truncate longer descriptions)
- Include the focus keyword naturally
- Include a clear value proposition
- End with a subtle call-to-action
- Create urgency or curiosity without being clickbait`;

  const user = `Write 3 different meta description options for a blog post:

Topic: ${context.topic}
Focus Keyword: "${context.focusKeyword}"
${seoContext}

Provide exactly 3 meta description options, each on its own line. No numbering, no character counts, just the descriptions.`;

  return { system, user };
}

// ==================== OUTLINE GENERATION ====================

export function buildOutlinePrompt(context: GenerationContext): {
  system: string;
  user: string;
} {
  const tone = getTone(context.toneId);
  const audiences = getAudiences(context.audienceIds);
  const length = getLength(context.lengthId);
  const seoContext = buildSEOContext(context.seoData);
  const audienceContext = buildAudienceContext(audiences, context.customAudience);

  const system = `You are an expert content strategist specializing in B2B enterprise technology content. Your task is to create comprehensive content outlines optimized for SEO and reader engagement.

${tone.promptInstruction}

${audienceContext}`;

  const user = `Create a detailed outline for a ${length.wordRange} blog post:

Topic: ${context.topic}
Focus Keyword: "${context.focusKeyword}"
Target Length: ${length.wordRange} (${length.readTime} read)
${seoContext}

Create an outline with:
1. A compelling introduction hook
2. Logical H2 sections (5-8 depending on length)
3. H3 subsections where needed
4. Key points to cover in each section
5. Suggested word count per section
${context.includeFaqs ? "6. FAQ section with 3-5 questions" : ""}
7. Strong conclusion with call-to-action

Format the outline clearly with markdown headings (## for H2, ### for H3).`;

  return { system, user };
}

// ==================== FULL CONTENT GENERATION ====================

export function buildContentPrompt(context: GenerationContext): {
  system: string;
  user: string;
} {
  const tone = getTone(context.toneId);
  const audiences = getAudiences(context.audienceIds);
  const length = getLength(context.lengthId);
  const seoContext = buildSEOContext(context.seoData);
  const audienceContext = buildAudienceContext(audiences, context.customAudience);

  const system = `You are an expert B2B content writer specializing in enterprise technology, AI, and digital transformation. You write authoritative, well-researched content that ranks well in search engines and provides genuine value to readers.

${tone.promptInstruction}

${audienceContext}

Writing Guidelines:
- Use clear, professional language
- Include specific examples and data points where relevant
- Break up text with subheadings for scannability
- Use bullet points and numbered lists appropriately
- Maintain a logical flow from introduction to conclusion
- Naturally incorporate SEO keywords without keyword stuffing
- Write for humans first, search engines second`;

  const user = `Write a comprehensive blog post:

Topic: ${context.topic}
Focus Keyword: "${context.focusKeyword}"
Target Length: ${length.minWords}-${length.maxWords} words
${seoContext}

Content Requirements:
- Start with a compelling hook that addresses the reader's pain point
- Use H2 (##) and H3 (###) headings to structure content
- Include the focus keyword in the first paragraph
- Naturally incorporate related keywords throughout
${context.includeStats ? "- Include relevant statistics and data points (use realistic industry benchmarks if specific data unavailable)" : ""}
${context.includeActionables ? "- Include actionable takeaways and practical advice" : ""}
${context.includeFaqs ? "- End with an FAQ section (## Frequently Asked Questions) with 3-5 Q&As addressing common questions" : ""}
- Conclude with a strong summary and clear call-to-action

Write the full article in markdown format. Do not include the title (it will be added separately).`;

  return { system, user };
}

// ==================== FAQ GENERATION ====================

export function buildFAQPrompt(context: GenerationContext): {
  system: string;
  user: string;
} {
  const seoContext = buildSEOContext(context.seoData);

  const system = `You are an SEO expert specializing in FAQ schema optimization for featured snippets and voice search. Your task is to generate FAQ pairs that directly answer common questions about the topic.

Guidelines:
- Questions should be natural, conversational queries
- Answers should be concise but comprehensive (2-4 sentences)
- Start answers with a direct response to the question
- Include the focus keyword naturally where appropriate
- Format for FAQ schema (direct Q&A pairs)`;

  const user = `Generate 5 FAQ pairs for a blog post about:

Topic: ${context.topic}
Focus Keyword: "${context.focusKeyword}"
${seoContext}

${
  context.seoData?.questions?.length
    ? `Questions people actually search for:\n${context.seoData.questions
        .slice(0, 5)
        .map((q) => `- ${q.question}`)
        .join("\n")}\n\nUse these as inspiration or include them directly.`
    : ""
}

Format your response as JSON array:
[
  {"question": "Question here?", "answer": "Answer here."},
  ...
]

Provide exactly 5 FAQ pairs.`;

  return { system, user };
}

// ==================== SOCIAL MEDIA (OG) GENERATION ====================

export function buildOGPrompt(
  context: GenerationContext,
  type: "title" | "description"
): { system: string; user: string } {
  const tone = getTone(context.toneId);

  const system = `You are a social media copywriting expert. Your task is to write ${
    type === "title" ? "titles" : "descriptions"
  } optimized for social media sharing (Facebook, LinkedIn, Twitter).

${tone.promptInstruction}

Guidelines for social ${type}:
${
  type === "title"
    ? `- Length: 60-70 characters
- More engaging/curiosity-driven than SEO titles
- Can use emojis sparingly if appropriate for B2B
- Should stop the scroll`
    : `- Length: 150-200 characters
- Focus on value proposition and intrigue
- Include a subtle call-to-action
- Complement the title without repeating it`
}`;

  const user = `Write 3 social media ${type} options for a blog post:

Topic: ${context.topic}
Focus Keyword: "${context.focusKeyword}"

Provide exactly 3 options, each on its own line. No numbering, no explanations.`;

  return { system, user };
}

// ==================== ENTITY EXTRACTION (for GEO) ====================

export function buildEntityExtractionPrompt(context: GenerationContext): {
  system: string;
  user: string;
} {
  const seoContext = buildSEOContext(context.seoData);

  const system = `You are an SEO and knowledge graph expert specializing in Generative Engine Optimization (GEO). Your task is to identify key entities for structured data and AI-driven search visibility.

Entities include:
- Companies and organizations (e.g., Google, Microsoft, ArqAI)
- Technologies and platforms (e.g., Kubernetes, AWS, React)
- Standards and regulations (e.g., HIPAA, SOC 2, GDPR, ISO 27001)
- Concepts and methodologies (e.g., Zero Trust, DevSecOps, MLOps)
- Industry terms and proper nouns`;

  const user = `Identify 5-10 key entities relevant to this topic for GEO optimization:

Topic: ${context.topic}
Focus Keyword: "${context.focusKeyword}"
${seoContext}

Return ONLY a JSON array of entity strings, no explanation:
["Entity1", "Entity2", "Entity3", ...]

Focus on:
- Entities that would appear in knowledge graphs
- Named organizations, technologies, standards
- Specific proper nouns, not generic terms`;

  return { system, user };
}

// ==================== SECONDARY KEYWORD SUGGESTION ====================

export function buildKeywordSuggestionPrompt(context: GenerationContext): {
  system: string;
  user: string;
} {
  const seoContext = buildSEOContext(context.seoData);

  const system = `You are an SEO keyword research expert. Your task is to suggest secondary keywords that complement a focus keyword for better SEO coverage and topic authority.

Secondary keywords should:
- Be semantically related to the focus keyword
- Include long-tail variations
- Cover different search intents (informational, navigational, transactional)
- Be relevant to enterprise B2B audiences`;

  const user = `Suggest 6-10 secondary keywords for this topic:

Topic: ${context.topic}
Focus Keyword: "${context.focusKeyword}"
${seoContext}

Return ONLY a JSON array of keyword strings, no explanation:
["keyword phrase 1", "keyword phrase 2", ...]

Include:
- Long-tail variations of the focus keyword
- Related concepts and terms
- Question-based keywords where relevant
- Industry-specific terminology`;

  return { system, user };
}

// ==================== KEYWORD/ENTITY EXTRACTION ====================

export function buildKeywordExtractionPrompt(content: string): {
  system: string;
  user: string;
} {
  const system = `You are an SEO analyst. Your task is to extract important keywords and entities from content for SEO optimization and structured data.`;

  const user = `Analyze this content and extract:

1. Secondary keywords (5-8 relevant terms/phrases)
2. Key entities (companies, technologies, concepts, people, regulations mentioned)

Content:
${content.substring(0, 4000)}

Format your response as JSON:
{
  "secondaryKeywords": ["keyword1", "keyword2", ...],
  "entities": ["Entity1", "Entity2", ...]
}`;

  return { system, user };
}

// ==================== CONTENT ANALYSIS ====================

export function buildAnalysisPrompt(
  content: string,
  focusKeyword: string
): { system: string; user: string } {
  const system = `You are an SEO and content quality analyst. Analyze content for SEO optimization, readability, and overall quality.`;

  const user = `Analyze this content for SEO and quality:

Focus Keyword: "${focusKeyword}"

Content:
${content.substring(0, 6000)}

Provide analysis as JSON:
{
  "scores": {
    "overall": 0-100,
    "seo": 0-100,
    "readability": 0-100,
    "structure": 0-100,
    "engagement": 0-100
  },
  "keywordAnalysis": {
    "inTitle": boolean,
    "inFirstParagraph": boolean,
    "density": "low|optimal|high",
    "inHeadings": number
  },
  "issues": [
    {"type": "error|warning|info", "message": "description", "recommendation": "how to fix"}
  ],
  "strengths": ["strength1", "strength2"],
  "wordCount": number,
  "readingTime": "X min"
}`;

  return { system, user };
}
