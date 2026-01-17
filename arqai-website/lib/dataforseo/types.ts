// DataForSEO API Types

export interface KeywordMetrics {
  keyword: string;
  searchVolume: number;
  cpc: number;
  competition: number; // 0-1
  competitionLevel: "LOW" | "MEDIUM" | "HIGH";
  keywordDifficulty?: number; // 0-100
  trend: number[]; // Monthly search volumes (last 12 months)
  trendDirection: "up" | "down" | "stable";
  trendPercent: number;
}

export interface RelatedKeyword {
  keyword: string;
  searchVolume: number;
  cpc: number;
  competition: number;
  keywordDifficulty?: number;
}

export interface SearchQuestion {
  question: string;
  searchVolume?: number;
}

export interface CompetitorPage {
  title: string;
  url: string;
  domain: string;
  position: number;
  description?: string;
}

export interface KeywordResearchResult {
  keyword: string;
  metrics: KeywordMetrics;
  relatedKeywords: RelatedKeyword[];
  questions: SearchQuestion[];
  competitors: CompetitorPage[];
  suggestions: {
    keyword: string;
    reason: string;
    searchVolume: number;
    keywordDifficulty?: number;
  }[];
  fetchedAt: string;
}

// DataForSEO API Response Types
export interface DataForSEOResponse<T> {
  version: string;
  status_code: number;
  status_message: string;
  time: string;
  cost: number;
  tasks_count: number;
  tasks_error: number;
  tasks: {
    id: string;
    status_code: number;
    status_message: string;
    time: string;
    cost: number;
    result_count: number;
    path: string[];
    data: Record<string, unknown>;
    result: T[];
  }[];
}

export interface SearchVolumeResult {
  keyword: string;
  location_code: number;
  language_code: string;
  search_partners: boolean;
  keyword_info: {
    search_volume: number;
    competition: number;
    competition_level: "LOW" | "MEDIUM" | "HIGH";
    cpc: number;
    low_top_of_page_bid: number;
    high_top_of_page_bid: number;
    monthly_searches: {
      year: number;
      month: number;
      search_volume: number;
    }[];
  };
  keyword_properties: {
    keyword_difficulty: number;
  };
}

export interface KeywordSuggestionResult {
  keyword: string;
  location_code: number;
  language_code: string;
  keyword_info: {
    search_volume: number;
    competition: number;
    competition_level: "LOW" | "MEDIUM" | "HIGH";
    cpc: number;
  };
  keyword_properties?: {
    keyword_difficulty: number;
  };
}

export interface SerpOrganicResult {
  keyword: string;
  type: string;
  se_domain: string;
  location_code: number;
  language_code: string;
  items: {
    type: string;
    rank_group: number;
    rank_absolute: number;
    position: string;
    title: string;
    url: string;
    domain: string;
    description: string;
    breadcrumb: string;
  }[];
}

export interface RelatedQuestionsResult {
  keyword: string;
  location_code: number;
  language_code: string;
  items: {
    question: string;
    answer?: string;
    expanded_element?: {
      title: string;
      url: string;
    }[];
  }[];
}
