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

// ==================== CASE STUDY PROMPTS ====================

interface CaseStudyContext {
  client_name?: string;
  industry?: string;
  overview?: string;
  challenge_description?: string;
  solution_description?: string;
}

export function buildCaseStudyTitlePrompt(context: CaseStudyContext): {
  system: string;
  user: string;
} {
  const system = `You are an expert B2B marketing copywriter specializing in enterprise case studies. Your task is to create compelling case study titles that highlight measurable business outcomes.

Guidelines:
- Include the client industry or company type
- Feature a specific, quantifiable result when possible
- Keep titles between 60-80 characters
- Use action-oriented language
- Avoid generic phrases like "How X Achieved Y"`;

  const user = `Generate 3 case study title options based on this context:

Client: ${context.client_name || "Enterprise client"}
Industry: ${context.industry || "Technology"}
Overview: ${context.overview || "AI-powered solution implementation"}

Provide exactly 3 title options, each on its own line. No numbering, no explanations.`;

  return { system, user };
}

export function buildCaseStudyOverviewPrompt(context: CaseStudyContext): {
  system: string;
  user: string;
} {
  const system = `You are an expert B2B case study writer. Your task is to write compelling executive summaries that capture the essence of a customer success story.

Guidelines:
- Keep it to 2-3 sentences (80-150 words)
- Start with the client's challenge
- Briefly mention the solution
- End with the key outcome/benefit
- Use professional, authoritative tone`;

  const user = `Write a case study overview/executive summary:

Client: ${context.client_name || "Enterprise client"}
Industry: ${context.industry || "Technology"}
${context.challenge_description ? `Challenge: ${context.challenge_description}` : ""}
${context.solution_description ? `Solution: ${context.solution_description}` : ""}

Provide exactly 3 overview options, each separated by ---. No numbering.`;

  return { system, user };
}

export function buildCaseStudyChallengePrompt(context: CaseStudyContext): {
  system: string;
  user: string;
} {
  const system = `You are an expert B2B case study writer. Your task is to articulate customer challenges in a way that resonates with similar prospects.

Guidelines:
- Start with the business context
- Describe 3-5 specific pain points
- Use concrete examples where possible
- Connect challenges to business impact
- Write in past tense
- Keep description to 150-250 words`;

  const user = `Write the challenge section for a case study:

Client: ${context.client_name || "Enterprise client"}
Industry: ${context.industry || "Technology"}
${context.overview ? `Context: ${context.overview}` : ""}

Provide:
1. A challenge description paragraph (150-200 words)
2. A list of 4-5 specific challenge bullet points

Format:
DESCRIPTION:
[paragraph]

POINTS:
- Point 1
- Point 2
- Point 3
- Point 4`;

  return { system, user };
}

export function buildCaseStudySolutionPrompt(context: CaseStudyContext): {
  system: string;
  user: string;
} {
  const system = `You are an expert B2B case study writer. Your task is to describe how the solution addressed the customer's challenges.

Guidelines:
- Focus on the approach and methodology
- Highlight key features and capabilities used
- Describe the implementation process
- Connect solution elements to specific challenges
- Write in past tense
- Keep description to 150-250 words`;

  const user = `Write the solution section for a case study:

Client: ${context.client_name || "Enterprise client"}
Industry: ${context.industry || "Technology"}
${context.challenge_description ? `Challenges: ${context.challenge_description}` : ""}
${context.overview ? `Context: ${context.overview}` : ""}

Provide:
1. A solution description paragraph (150-200 words)
2. A list of 4-5 specific solution bullet points

Format:
DESCRIPTION:
[paragraph]

POINTS:
- Point 1
- Point 2
- Point 3
- Point 4`;

  return { system, user };
}

export function buildCaseStudyImpactPrompt(context: CaseStudyContext): {
  system: string;
  user: string;
} {
  const system = `You are an expert B2B case study writer. Your task is to write compelling impact summaries that highlight measurable business outcomes.

Guidelines:
- Focus on quantifiable results (percentages, time saved, cost reduction)
- Connect outcomes to original challenges
- Use strong, active language
- Keep it concise but impactful (50-100 words)`;

  const user = `Write an impact summary for a case study:

Client: ${context.client_name || "Enterprise client"}
Industry: ${context.industry || "Technology"}
${context.solution_description ? `Solution: ${context.solution_description}` : ""}

Provide exactly 3 impact summary options, each separated by ---. Focus on different types of business impact (efficiency, cost, growth, etc.).`;

  return { system, user };
}

export function buildCaseStudyTestimonialPrompt(context: CaseStudyContext): {
  system: string;
  user: string;
} {
  const system = `You are an expert B2B case study writer. Your task is to write authentic-sounding customer testimonial quotes.

Guidelines:
- Write in first person from the customer's perspective
- Include specific benefits experienced
- Sound authentic and conversational, not overly polished
- Keep quotes to 2-3 sentences
- Reference specific outcomes or features`;

  const user = `Write a testimonial quote for a case study:

Client: ${context.client_name || "Enterprise client"}
Industry: ${context.industry || "Technology"}
${context.overview ? `Context: ${context.overview}` : ""}
${context.solution_description ? `Solution: ${context.solution_description}` : ""}

Provide exactly 3 testimonial quote options, each separated by ---. These should sound like real customer quotes.`;

  return { system, user };
}

export function buildCaseStudyMetricsPrompt(context: CaseStudyContext): {
  system: string;
  user: string;
} {
  const system = `You are an expert B2B case study writer. Your task is to suggest compelling, realistic key performance metrics that demonstrate business impact.

Guidelines:
- Suggest 3-4 specific, quantifiable metrics
- Use industry-appropriate benchmarks
- Focus on metrics that matter to executives (ROI, efficiency gains, cost savings, time to value)
- Be realistic but impressive
- Include the metric label, value, and brief description`;

  const user = `Suggest key metrics for a case study:

Client: ${context.client_name || "Enterprise client"}
Industry: ${context.industry || "Technology"}
${context.overview ? `Overview: ${context.overview}` : ""}
${context.solution_description ? `Solution: ${context.solution_description}` : ""}

Provide exactly 4 metrics in this JSON format:
[
  {"label": "Metric Label", "value": "XX%", "description": "Brief description of what this measures"},
  {"label": "Metric Label", "value": "$XM", "description": "Brief description"},
  {"label": "Metric Label", "value": "XX%", "description": "Brief description"},
  {"label": "Metric Label", "value": "X months", "description": "Brief description"}
]

Focus on realistic metrics for the ${context.industry || "technology"} industry.`;

  return { system, user };
}

// ==================== WEBINAR PROMPTS ====================

interface WebinarContext {
  title?: string;
  description?: string;
  presenters?: string;
  topic?: string;
}

export function buildWebinarTitlePrompt(context: WebinarContext): {
  system: string;
  user: string;
} {
  const system = `You are an expert B2B marketing copywriter specializing in webinar titles. Your task is to create compelling titles that drive registrations.

Guidelines:
- Create curiosity and urgency
- Promise specific value or learning outcomes
- Keep titles between 50-70 characters
- Avoid generic phrases
- Consider using formats like "How to...", "X Ways to...", "The Future of..."`;

  const user = `Generate 3 webinar title options:

Topic: ${context.topic || context.title || "Enterprise AI"}
${context.description ? `Description: ${context.description}` : ""}
${context.presenters ? `Presenters: ${context.presenters}` : ""}

Provide exactly 3 title options, each on its own line. No numbering, no explanations.`;

  return { system, user };
}

export function buildWebinarDescriptionPrompt(context: WebinarContext): {
  system: string;
  user: string;
} {
  const system = `You are an expert B2B marketing copywriter. Your task is to write webinar descriptions that drive registrations.

Guidelines:
- Start with a hook that addresses the audience's pain point
- Clearly state what attendees will learn
- Include presenter credentials if relevant
- Create urgency without being pushy
- Keep to 150-250 words
- End with a call-to-action`;

  const user = `Write a webinar description:

Title: ${context.title || "Enterprise AI Webinar"}
${context.topic ? `Topic: ${context.topic}` : ""}
${context.presenters ? `Presenters: ${context.presenters}` : ""}

Provide exactly 2 description options, separated by ---. Each should be 150-200 words.`;

  return { system, user };
}

export function buildWebinarLearningPointsPrompt(context: WebinarContext): {
  system: string;
  user: string;
} {
  const system = `You are an expert B2B content strategist. Your task is to create compelling learning outcomes for webinar promotions.

Guidelines:
- Start each point with an action verb
- Be specific about the value
- Keep each point to one clear sentence
- Focus on practical takeaways
- Make outcomes measurable when possible`;

  const user = `Generate learning points for a webinar:

Title: ${context.title || "Enterprise AI Webinar"}
${context.description ? `Description: ${context.description}` : ""}
${context.topic ? `Topic: ${context.topic}` : ""}

Provide exactly 5 learning points as a bulleted list. Format:
- Learning point 1
- Learning point 2
- Learning point 3
- Learning point 4
- Learning point 5`;

  return { system, user };
}

export function buildWebinarPromoPrompt(context: WebinarContext): {
  system: string;
  user: string;
} {
  const system = `You are an expert B2B marketing copywriter. Your task is to write promotional copy for webinar marketing campaigns.

Guidelines:
- Create urgency and FOMO
- Highlight key takeaways
- Include social proof if relevant
- Keep copy concise for email/social`;

  const user = `Write promotional copy for a webinar:

Title: ${context.title || "Enterprise AI Webinar"}
${context.description ? `Description: ${context.description}` : ""}
${context.presenters ? `Presenters: ${context.presenters}` : ""}

Provide 3 versions:
1. Email subject line (under 60 characters)
2. Social media post (under 280 characters)
3. Short promotional paragraph (2-3 sentences)

Format:
EMAIL SUBJECT:
[subject line]

SOCIAL POST:
[social media copy]

PROMO PARAGRAPH:
[promotional paragraph]`;

  return { system, user };
}

// ==================== WHITEPAPER PROMPTS ====================

interface WhitepaperContext {
  title?: string;
  description?: string;
  topic?: string;
  category?: string;
}

export function buildWhitepaperTitlePrompt(context: WhitepaperContext): {
  system: string;
  user: string;
} {
  const system = `You are an expert B2B content strategist specializing in thought leadership content. Your task is to create authoritative whitepaper titles.

Guidelines:
- Sound authoritative and research-backed
- Include industry-specific terminology
- Keep titles between 50-80 characters
- Avoid clickbait - maintain credibility
- Consider formats like "The Complete Guide to...", "State of...", "[Year] Report:"`;

  const user = `Generate 3 whitepaper title options:

Topic: ${context.topic || context.title || "Enterprise AI Governance"}
${context.category ? `Category: ${context.category}` : ""}
${context.description ? `Description: ${context.description}` : ""}

Provide exactly 3 title options, each on its own line. No numbering, no explanations.`;

  return { system, user };
}

export function buildWhitepaperDescriptionPrompt(context: WhitepaperContext): {
  system: string;
  user: string;
} {
  const system = `You are an expert B2B content strategist. Your task is to write whitepaper descriptions that drive downloads through gated content forms.

Guidelines:
- Establish the problem or opportunity
- Promise specific insights or frameworks
- Highlight unique research or data
- Build credibility with specifics
- Keep to 100-150 words
- End with what readers will gain`;

  const user = `Write a whitepaper description:

Title: ${context.title || "Enterprise AI Whitepaper"}
${context.topic ? `Topic: ${context.topic}` : ""}
${context.category ? `Category: ${context.category}` : ""}

Provide exactly 2 description options, separated by ---. Each should be 100-150 words.`;

  return { system, user };
}

export function buildWhitepaperOutlinePrompt(context: WhitepaperContext): {
  system: string;
  user: string;
} {
  const system = `You are an expert B2B content strategist specializing in thought leadership whitepapers. Your task is to create comprehensive whitepaper outlines.

Guidelines:
- Structure for 10-20 pages of content
- Include executive summary section
- Build logical progression of ideas
- Include data/research sections where appropriate
- End with actionable recommendations
- Use clear section titles`;

  const user = `Create a whitepaper outline:

Title: ${context.title || "Enterprise AI Whitepaper"}
${context.topic ? `Topic: ${context.topic}` : ""}
${context.category ? `Category: ${context.category}` : ""}
${context.description ? `Description: ${context.description}` : ""}

Provide a detailed outline with:
- Executive Summary
- 5-7 main sections with subsections
- Conclusion/Recommendations

Format with markdown headings (## for main sections, ### for subsections).`;

  return { system, user };
}

export function buildWhitepaperKeyTakeawaysPrompt(context: WhitepaperContext): {
  system: string;
  user: string;
} {
  const system = `You are an expert B2B content strategist. Your task is to create compelling key takeaways for whitepaper landing pages.

Guidelines:
- Each takeaway should be specific and valuable
- Use numbers and data where possible
- Focus on actionable insights
- Keep each takeaway to one sentence
- Make it clear what makes this whitepaper worth downloading`;

  const user = `Generate key takeaways for a whitepaper:

Title: ${context.title || "Enterprise AI Whitepaper"}
${context.description ? `Description: ${context.description}` : ""}
${context.topic ? `Topic: ${context.topic}` : ""}

Provide exactly 5 key takeaways as a bulleted list. Format:
- Takeaway 1
- Takeaway 2
- Takeaway 3
- Takeaway 4
- Takeaway 5`;

  return { system, user };
}
