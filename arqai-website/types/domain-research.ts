/**
 * Domain Research Agent Types
 *
 * Types for the AI-powered domain/company research system.
 * The research agent gathers intelligence from web sources without requiring paid APIs.
 */

// ============================================
// RESEARCH JOB TYPES
// ============================================

export type ResearchJobStatus =
  | "pending"
  | "running"
  | "completed"
  | "failed"
  | "cancelled";

export interface ResearchJob {
  id: string;
  domain: string;
  status: ResearchJobStatus;
  sources_checked: ResearchSource[];
  raw_findings: RawFindings;
  synthesized_result?: CompanyResearchResult;
  confidence_score: number;
  error_message?: string;
  created_at: string;
  started_at?: string;
  completed_at?: string;
}

export interface ResearchSource {
  source_type: ResearchSourceType;
  url?: string;
  status: "pending" | "success" | "failed" | "skipped";
  data_found: boolean;
  error?: string;
  fetched_at?: string;
}

export type ResearchSourceType =
  | "company_website"
  | "linkedin"
  | "crunchbase"
  | "web_search"
  | "news_search"
  | "job_postings"
  | "press_releases"
  | "social_media";

// ============================================
// RAW FINDINGS TYPES
// ============================================

export interface RawFindings {
  website_data?: WebsiteData;
  search_results?: SearchResult[];
  news_articles?: NewsArticle[];
  job_postings?: JobPosting[];
  social_profiles?: SocialProfile[];
}

export interface WebsiteData {
  title?: string;
  description?: string;
  about_text?: string;
  team_page_text?: string;
  careers_text?: string;
  contact_info?: ContactInfo;
  technologies_detected?: string[];
  last_fetched: string;
}

export interface ContactInfo {
  email?: string;
  phone?: string;
  address?: string;
  headquarters?: string;
}

export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  source: string;
  timestamp?: string;
}

export interface NewsArticle {
  title: string;
  url: string;
  source: string;
  summary?: string;
  published_date?: string;
  sentiment?: "positive" | "neutral" | "negative";
  topics?: string[];
}

export interface JobPosting {
  title: string;
  department?: string;
  location?: string;
  technologies_mentioned?: string[];
  seniority_level?: string;
  source_url?: string;
}

export interface SocialProfile {
  platform: "linkedin" | "twitter" | "facebook" | "github";
  url?: string;
  follower_count?: number;
  description?: string;
}

// ============================================
// SYNTHESIZED RESULT TYPES
// ============================================

export interface CompanyResearchResult {
  // Basic Info
  company_name: string;
  domain: string;
  description?: string;
  tagline?: string;

  // Company Details
  founded_year?: number;
  headquarters?: string;
  locations?: string[];

  // Size & Scale
  employee_count?: EmployeeCountRange;
  company_size: CompanySize;
  revenue_estimate?: RevenueEstimate;

  // Industry & Market
  industry: string;
  sub_industry?: string;
  market_segment?: string;

  // Technology
  technology_stack?: TechnologyStack;

  // Leadership
  key_executives?: Executive[];

  // Funding & Financials
  funding_info?: FundingInfo;

  // Compliance & Certifications
  compliance_frameworks?: string[];
  certifications?: string[];

  // Recent Activity
  recent_news?: NewsHighlight[];
  recent_announcements?: string[];

  // Confidence & Metadata
  confidence_scores: ConfidenceScores;
  data_freshness: string;
  sources_used: string[];
}

export interface EmployeeCountRange {
  min: number;
  max: number;
  estimate: number;
  confidence: number;
}

export type CompanySize = "startup" | "smb" | "mid-market" | "enterprise";

export interface RevenueEstimate {
  range_min?: number;
  range_max?: number;
  currency: string;
  confidence: number;
}

export interface TechnologyStack {
  languages?: string[];
  frameworks?: string[];
  cloud_providers?: string[];
  databases?: string[];
  analytics?: string[];
  marketing?: string[];
  other?: string[];
}

export interface Executive {
  name: string;
  title: string;
  linkedin_url?: string;
  is_decision_maker: boolean;
}

export interface FundingInfo {
  total_raised?: number;
  currency: string;
  last_round_type?: string;
  last_round_date?: string;
  last_round_amount?: number;
  investors?: string[];
  is_public: boolean;
  stock_symbol?: string;
}

export interface NewsHighlight {
  title: string;
  date: string;
  summary: string;
  sentiment: "positive" | "neutral" | "negative";
  relevance: "high" | "medium" | "low";
}

export interface ConfidenceScores {
  overall: number;
  company_name: number;
  employee_count: number;
  industry: number;
  technology_stack: number;
  funding_info: number;
}

// ============================================
// RESEARCH REQUEST TYPES
// ============================================

export interface ResearchRequest {
  domain: string;
  priority?: "high" | "normal" | "low";
  requested_by?: string;
  lead_profile_id?: string;
  depth?: ResearchDepth;
}

export type ResearchDepth = "quick" | "standard" | "deep";

export interface ResearchConfig {
  depth: ResearchDepth;
  max_search_results: number;
  max_news_articles: number;
  include_job_postings: boolean;
  include_social_profiles: boolean;
  timeout_seconds: number;
}

export const RESEARCH_CONFIGS: Record<ResearchDepth, ResearchConfig> = {
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
// DOMAIN INTELLIGENCE CACHE TYPES
// ============================================

export interface DomainIntelligenceCache {
  id: string;
  domain: string;
  research_result: CompanyResearchResult;
  source: "research_agent" | "clearbit" | "apollo" | "manual";
  confidence: number;
  created_at: string;
  updated_at: string;
  expires_at: string;
}

// ============================================
// RESEARCH AGENT EVENTS
// ============================================

export interface ResearchProgressEvent {
  job_id: string;
  status: ResearchJobStatus;
  current_source?: ResearchSourceType;
  sources_completed: number;
  sources_total: number;
  message?: string;
  timestamp: string;
}

// ============================================
// ENRICHMENT ADAPTER TYPES
// ============================================

export interface EnrichmentProvider {
  name: string;
  is_configured: boolean;
  priority: number;
  enrich(domain: string): Promise<CompanyResearchResult | null>;
}

export interface EnrichmentResult {
  provider: string;
  result: CompanyResearchResult | null;
  cached: boolean;
  fetch_time_ms: number;
}
