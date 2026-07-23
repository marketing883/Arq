/**
 * AI Domain Research Agent
 *
 * Autonomous agent that researches company information from web sources.
 * Uses Claude for intelligent synthesis of gathered data.
 * No paid enrichment APIs required - works with web search and AI inference.
 *
 * SECURITY: All web requests are server-side only.
 * RELIABILITY: Graceful handling of failed sources.
 */

import Anthropic from "@anthropic-ai/sdk";
import { LEAD_INTEL_MODEL } from "@/lib/ai/models";
import type {
  ResearchJob,
  ResearchJobStatus,
  ResearchSource,
  ResearchSourceType,
  RawFindings,
  CompanyResearchResult,
  ResearchDepth,
  ResearchConfig,
  RESEARCH_CONFIGS,
  WebsiteData,
  SearchResult,
  NewsArticle,
  JobPosting,
  ConfidenceScores,
  TechnologyStack,
  Executive,
  FundingInfo,
  EmployeeCountRange,
  CompanySize,
} from "@/types/domain-research";

// ============================================
// CONFIGURATION
// ============================================

const RESEARCH_DEPTH_CONFIGS: Record<ResearchDepth, ResearchConfig> = {
  quick: {
    depth: "quick",
    max_search_results: 5,
    max_news_articles: 3,
    include_job_postings: false,
    include_social_profiles: false,
    timeout_seconds: 30,
  },
  standard: {
    depth: "standard",
    max_search_results: 10,
    max_news_articles: 5,
    include_job_postings: true,
    include_social_profiles: false,
    timeout_seconds: 60,
  },
  deep: {
    depth: "deep",
    max_search_results: 20,
    max_news_articles: 10,
    include_job_postings: true,
    include_social_profiles: true,
    timeout_seconds: 120,
  },
};

// ============================================
// MAIN AGENT CLASS
// ============================================

export class DomainResearchAgent {
  private anthropic: Anthropic | null = null;
  private config: ResearchConfig;

  constructor(depth: ResearchDepth = "standard") {
    this.config = RESEARCH_DEPTH_CONFIGS[depth];

    // Initialize Anthropic client if available
    if (process.env.ANTHROPIC_API_KEY) {
      this.anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
      });
    }
  }

  /**
   * Research a domain and return company intelligence
   */
  public async research(domain: string): Promise<ResearchJob> {
    const job: ResearchJob = {
      id: crypto.randomUUID(),
      domain: this.normalizeDomain(domain),
      status: "running",
      sources_checked: [],
      raw_findings: {},
      confidence_score: 0,
      created_at: new Date().toISOString(),
      started_at: new Date().toISOString(),
    };

    try {
      // Gather data from multiple sources
      const findings = await this.gatherData(job);
      job.raw_findings = findings;

      // Synthesize findings using AI
      const result = await this.synthesizeFindings(job.domain, findings);
      job.synthesized_result = result;
      job.confidence_score = result.confidence_scores.overall;

      job.status = "completed";
      job.completed_at = new Date().toISOString();
    } catch (error) {
      job.status = "failed";
      job.error_message = error instanceof Error ? error.message : "Unknown error";
      job.completed_at = new Date().toISOString();
    }

    return job;
  }

  /**
   * Normalize domain (remove protocol, www, trailing slash)
   */
  private normalizeDomain(domain: string): string {
    return domain
      .toLowerCase()
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")
      .replace(/\/$/, "")
      .split("/")[0];
  }

  /**
   * Gather data from multiple sources
   */
  private async gatherData(job: ResearchJob): Promise<RawFindings> {
    const findings: RawFindings = {};
    const domain = job.domain;

    // Source 1: Company website
    const websiteSource = await this.fetchWebsiteData(domain);
    job.sources_checked.push(websiteSource.source);
    if (websiteSource.data) {
      findings.website_data = websiteSource.data;
    }

    // Source 2: Web search for company info
    const searchSource = await this.searchCompanyInfo(domain);
    job.sources_checked.push(searchSource.source);
    if (searchSource.data) {
      findings.search_results = searchSource.data;
    }

    // Source 3: News search
    const newsSource = await this.searchNews(domain);
    job.sources_checked.push(newsSource.source);
    if (newsSource.data) {
      findings.news_articles = newsSource.data;
    }

    // Source 4: Job postings (for tech stack inference)
    if (this.config.include_job_postings) {
      const jobsSource = await this.searchJobPostings(domain);
      job.sources_checked.push(jobsSource.source);
      if (jobsSource.data) {
        findings.job_postings = jobsSource.data;
      }
    }

    return findings;
  }

  /**
   * Fetch and parse company website
   */
  private async fetchWebsiteData(
    domain: string
  ): Promise<{ source: ResearchSource; data: WebsiteData | null }> {
    const source: ResearchSource = {
      source_type: "company_website",
      url: `https://${domain}`,
      status: "pending",
      data_found: false,
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(`https://${domain}`, {
        signal: controller.signal,
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; ArqAI Research Bot/1.0)",
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        source.status = "failed";
        source.error = `HTTP ${response.status}`;
        return { source, data: null };
      }

      const html = await response.text();
      const data = this.parseWebsiteHtml(html);

      source.status = "success";
      source.data_found = true;
      source.fetched_at = new Date().toISOString();

      return { source, data };
    } catch (error) {
      source.status = "failed";
      source.error = error instanceof Error ? error.message : "Fetch failed";
      return { source, data: null };
    }
  }

  /**
   * Parse relevant data from website HTML
   */
  private parseWebsiteHtml(html: string): WebsiteData {
    // Extract title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? this.cleanText(titleMatch[1]) : undefined;

    // Extract meta description
    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
    const description = descMatch ? this.cleanText(descMatch[1]) : undefined;

    // Extract about text (simplified - look for common patterns)
    const aboutMatch = html.match(/(?:about\s+us|who\s+we\s+are|our\s+story)[^<]*<[^>]+>([^<]{100,500})/i);
    const about_text = aboutMatch ? this.cleanText(aboutMatch[1]) : undefined;

    // Detect technologies from script/link tags
    const technologies_detected = this.detectTechnologies(html);

    return {
      title,
      description,
      about_text,
      technologies_detected,
      last_fetched: new Date().toISOString(),
    };
  }

  /**
   * Detect technologies from HTML
   */
  private detectTechnologies(html: string): string[] {
    const technologies: string[] = [];
    const htmlLower = html.toLowerCase();

    // Common technology patterns
    const techPatterns: Record<string, RegExp> = {
      "React": /react|reactdom/i,
      "Next.js": /next\.js|_next\//i,
      "Vue.js": /vue\.js|vuejs/i,
      "Angular": /angular/i,
      "Tailwind CSS": /tailwindcss|tailwind/i,
      "Bootstrap": /bootstrap/i,
      "jQuery": /jquery/i,
      "Google Analytics": /google-analytics|gtag|ga\(/i,
      "Google Tag Manager": /googletagmanager/i,
      "HubSpot": /hubspot/i,
      "Salesforce": /salesforce|pardot/i,
      "Intercom": /intercom/i,
      "Drift": /drift/i,
      "Segment": /segment\.com|analytics\.js/i,
      "Stripe": /stripe/i,
      "Cloudflare": /cloudflare/i,
      "AWS": /amazonaws|aws\./i,
      "Vercel": /vercel/i,
    };

    for (const [tech, pattern] of Object.entries(techPatterns)) {
      if (pattern.test(htmlLower)) {
        technologies.push(tech);
      }
    }

    return technologies;
  }

  /**
   * Search for company information
   */
  private async searchCompanyInfo(
    domain: string
  ): Promise<{ source: ResearchSource; data: SearchResult[] | null }> {
    const source: ResearchSource = {
      source_type: "web_search",
      status: "pending",
      data_found: false,
    };

    // Note: In production, integrate with a search API
    // For now, we'll use the website data and AI inference
    source.status = "skipped";
    source.error = "Web search API not configured";
    return { source, data: null };
  }

  /**
   * Search for company news
   */
  private async searchNews(
    domain: string
  ): Promise<{ source: ResearchSource; data: NewsArticle[] | null }> {
    const source: ResearchSource = {
      source_type: "news_search",
      status: "pending",
      data_found: false,
    };

    // Note: In production, integrate with NewsAPI or similar
    source.status = "skipped";
    source.error = "News API not configured";
    return { source, data: null };
  }

  /**
   * Search for job postings (tech stack inference)
   */
  private async searchJobPostings(
    domain: string
  ): Promise<{ source: ResearchSource; data: JobPosting[] | null }> {
    const source: ResearchSource = {
      source_type: "job_postings",
      status: "pending",
      data_found: false,
    };

    source.status = "skipped";
    source.error = "Job search API not configured";
    return { source, data: null };
  }

  /**
   * Synthesize all findings using AI
   */
  private async synthesizeFindings(
    domain: string,
    findings: RawFindings
  ): Promise<CompanyResearchResult> {
    // If no AI available, use basic inference
    if (!this.anthropic) {
      return this.basicInference(domain, findings);
    }

    try {
      const prompt = this.buildSynthesisPrompt(domain, findings);

      const response = await this.anthropic.messages.create({
        model: LEAD_INTEL_MODEL,
        max_tokens: 2000,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      });

      const content = response.content[0];
      if (content.type !== "text") {
        return this.basicInference(domain, findings);
      }

      // Parse JSON from response
      const jsonMatch = content.text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        return this.basicInference(domain, findings);
      }

      const parsed = JSON.parse(jsonMatch[0]) as Partial<CompanyResearchResult>;

      // Merge with required fields
      return this.mergeWithDefaults(domain, parsed, findings);
    } catch (error) {
      console.error("AI synthesis failed:", error);
      return this.basicInference(domain, findings);
    }
  }

  /**
   * Build prompt for AI synthesis
   */
  private buildSynthesisPrompt(domain: string, findings: RawFindings): string {
    const findingsJson = JSON.stringify(findings, null, 2);

    return `Analyze the following data gathered about the company with domain "${domain}" and extract structured company intelligence.

GATHERED DATA:
${findingsJson}

Based on this data, provide a JSON object with the following structure. Only include fields where you have reasonable confidence. Use null for unknown fields.

{
  "company_name": "string - Official company name",
  "description": "string - Brief company description",
  "industry": "string - Primary industry",
  "sub_industry": "string - More specific industry segment",
  "company_size": "startup | smb | mid-market | enterprise",
  "employee_count": {
    "min": number,
    "max": number,
    "estimate": number,
    "confidence": 0-1
  },
  "headquarters": "string - City, Country",
  "founded_year": number,
  "technology_stack": {
    "languages": ["string"],
    "frameworks": ["string"],
    "cloud_providers": ["string"],
    "databases": ["string"],
    "analytics": ["string"],
    "marketing": ["string"]
  },
  "compliance_frameworks": ["string - e.g., HIPAA, SOC2, GDPR"],
  "key_executives": [
    {
      "name": "string",
      "title": "string",
      "is_decision_maker": boolean
    }
  ],
  "funding_info": {
    "is_public": boolean,
    "stock_symbol": "string or null",
    "total_raised": number or null,
    "currency": "USD",
    "last_round_type": "string or null"
  },
  "confidence_scores": {
    "overall": 0-1,
    "company_name": 0-1,
    "employee_count": 0-1,
    "industry": 0-1,
    "technology_stack": 0-1,
    "funding_info": 0-1
  }
}

Respond ONLY with the JSON object, no other text.`;
  }

  /**
   * Basic inference without AI
   */
  private basicInference(domain: string, findings: RawFindings): CompanyResearchResult {
    const websiteData = findings.website_data;

    // Infer company name from domain or title
    const companyName = websiteData?.title?.split(/[|\-–—]/)[0]?.trim() ||
      domain.split(".")[0].charAt(0).toUpperCase() + domain.split(".")[0].slice(1);

    // Infer size from technologies
    const techCount = websiteData?.technologies_detected?.length ?? 0;
    let companySize: CompanySize = "smb";
    if (techCount >= 10) companySize = "enterprise";
    else if (techCount >= 5) companySize = "mid-market";
    else if (techCount >= 2) companySize = "smb";
    else companySize = "startup";

    // Infer industry from TLD
    let industry = "Technology";
    if (domain.endsWith(".edu")) industry = "Education";
    else if (domain.endsWith(".gov")) industry = "Government";
    else if (domain.endsWith(".bank")) industry = "Financial Services";
    else if (domain.endsWith(".org")) industry = "Non-Profit";

    return {
      company_name: companyName,
      domain,
      description: websiteData?.description,
      industry,
      company_size: companySize,
      technology_stack: {
        other: websiteData?.technologies_detected,
      },
      confidence_scores: {
        overall: 0.4,
        company_name: 0.6,
        employee_count: 0.2,
        industry: 0.5,
        technology_stack: techCount > 0 ? 0.7 : 0.2,
        funding_info: 0.1,
      },
      data_freshness: new Date().toISOString(),
      sources_used: ["company_website"],
    };
  }

  /**
   * Merge AI response with defaults
   */
  private mergeWithDefaults(
    domain: string,
    parsed: Partial<CompanyResearchResult>,
    findings: RawFindings
  ): CompanyResearchResult {
    return {
      company_name: parsed.company_name ?? domain,
      domain,
      description: parsed.description,
      tagline: parsed.tagline,
      founded_year: parsed.founded_year,
      headquarters: parsed.headquarters,
      locations: parsed.locations,
      employee_count: parsed.employee_count,
      company_size: parsed.company_size ?? "smb",
      revenue_estimate: parsed.revenue_estimate,
      industry: parsed.industry ?? "Unknown",
      sub_industry: parsed.sub_industry,
      market_segment: parsed.market_segment,
      technology_stack: {
        ...parsed.technology_stack,
        other: findings.website_data?.technologies_detected,
      },
      key_executives: parsed.key_executives,
      funding_info: parsed.funding_info,
      compliance_frameworks: parsed.compliance_frameworks,
      certifications: parsed.certifications,
      recent_news: parsed.recent_news,
      recent_announcements: parsed.recent_announcements,
      confidence_scores: parsed.confidence_scores ?? {
        overall: 0.5,
        company_name: 0.7,
        employee_count: 0.3,
        industry: 0.5,
        technology_stack: 0.6,
        funding_info: 0.2,
      },
      data_freshness: new Date().toISOString(),
      sources_used: findings.website_data ? ["company_website", "ai_inference"] : ["ai_inference"],
    };
  }

  /**
   * Clean text (remove extra whitespace, HTML entities)
   */
  private cleanText(text: string): string {
    return text
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, " ")
      .trim();
  }
}

/**
 * Singleton instance
 */
let agentInstance: DomainResearchAgent | null = null;

export function getDomainResearchAgent(depth: ResearchDepth = "standard"): DomainResearchAgent {
  if (!agentInstance) {
    agentInstance = new DomainResearchAgent(depth);
  }
  return agentInstance;
}

/**
 * Quick research function
 */
export async function researchDomain(
  domain: string,
  depth: ResearchDepth = "standard"
): Promise<ResearchJob> {
  const agent = new DomainResearchAgent(depth);
  return agent.research(domain);
}
