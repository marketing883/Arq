// DataForSEO API Client

import type {
  DataForSEOResponse,
  SearchVolumeResult,
  KeywordSuggestionResult,
  SerpOrganicResult,
  RelatedQuestionsResult,
  KeywordResearchResult,
  KeywordMetrics,
  RelatedKeyword,
  SearchQuestion,
  CompetitorPage,
} from "./types";

const DATAFORSEO_API_URL = "https://api.dataforseo.com/v3";

function getAuthHeader(): string {
  const login = process.env.DATAFORSEO_LOGIN;
  const password = process.env.DATAFORSEO_PASSWORD;

  if (!login || !password) {
    throw new Error("DataForSEO credentials not configured");
  }

  return "Basic " + Buffer.from(`${login}:${password}`).toString("base64");
}

async function apiRequest<T>(
  endpoint: string,
  body: unknown[]
): Promise<DataForSEOResponse<T>> {
  console.log(`DataForSEO API request to: ${endpoint}`);

  const response = await fetch(`${DATAFORSEO_API_URL}${endpoint}`, {
    method: "POST",
    headers: {
      Authorization: getAuthHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`DataForSEO API error ${response.status}:`, errorText);
    throw new Error(`DataForSEO API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();

  // Check for API-level errors
  if (data.status_code !== 20000) {
    console.error("DataForSEO API status error:", data.status_message);
  }

  return data;
}

/**
 * Get search volume and metrics for a keyword
 */
export async function getKeywordMetrics(
  keyword: string,
  locationCode: number = 2840, // USA
  languageCode: string = "en"
): Promise<KeywordMetrics | null> {
  try {
    const response = await apiRequest<SearchVolumeResult>(
      "/keywords_data/google_ads/search_volume/live",
      [
        {
          keywords: [keyword],
          location_code: locationCode,
          language_code: languageCode,
          include_adult_keywords: false,
        },
      ]
    );

    const result = response.tasks?.[0]?.result?.[0];
    if (!result?.keyword_info) return null;

    const monthlySearches = result.keyword_info.monthly_searches || [];
    const trend = monthlySearches.map((m) => m.search_volume);

    // Calculate trend direction
    let trendDirection: "up" | "down" | "stable" = "stable";
    let trendPercent = 0;

    if (trend.length >= 2) {
      const recent = trend.slice(0, 3).reduce((a, b) => a + b, 0) / 3;
      const older = trend.slice(-3).reduce((a, b) => a + b, 0) / 3;

      if (older > 0) {
        trendPercent = Math.round(((recent - older) / older) * 100);
        if (trendPercent > 10) trendDirection = "up";
        else if (trendPercent < -10) trendDirection = "down";
      }
    }

    return {
      keyword: result.keyword,
      searchVolume: result.keyword_info.search_volume || 0,
      cpc: result.keyword_info.cpc || 0,
      competition: result.keyword_info.competition || 0,
      competitionLevel: result.keyword_info.competition_level || "LOW",
      keywordDifficulty: result.keyword_properties?.keyword_difficulty,
      trend,
      trendDirection,
      trendPercent,
    };
  } catch (error) {
    console.error("Error fetching keyword metrics:", error);
    return null;
  }
}

/**
 * Get related keyword suggestions
 */
export async function getRelatedKeywords(
  keyword: string,
  locationCode: number = 2840,
  languageCode: string = "en",
  limit: number = 15
): Promise<RelatedKeyword[]> {
  try {
    const response = await apiRequest<KeywordSuggestionResult>(
      "/keywords_data/google_ads/keywords_for_keywords/live",
      [
        {
          keywords: [keyword],
          location_code: locationCode,
          language_code: languageCode,
          include_adult_keywords: false,
          sort_by: "search_volume",
          limit,
        },
      ]
    );

    const results = response.tasks?.[0]?.result || [];

    return results
      .filter((r) => r.keyword !== keyword)
      .map((r) => ({
        keyword: r.keyword,
        searchVolume: r.keyword_info?.search_volume || 0,
        cpc: r.keyword_info?.cpc || 0,
        competition: r.keyword_info?.competition || 0,
        keywordDifficulty: r.keyword_properties?.keyword_difficulty,
      }))
      .sort((a, b) => b.searchVolume - a.searchVolume)
      .slice(0, limit);
  } catch (error) {
    console.error("Error fetching related keywords:", error);
    return [];
  }
}

/**
 * Get SERP results (competitor analysis)
 */
export async function getSerpResults(
  keyword: string,
  locationCode: number = 2840,
  languageCode: string = "en",
  limit: number = 10
): Promise<CompetitorPage[]> {
  try {
    const response = await apiRequest<SerpOrganicResult>(
      "/serp/google/organic/live/regular",
      [
        {
          keyword,
          location_code: locationCode,
          language_code: languageCode,
          depth: limit,
        },
      ]
    );

    const items = response.tasks?.[0]?.result?.[0]?.items || [];

    return items
      .filter((item) => item.type === "organic")
      .map((item) => ({
        title: item.title,
        url: item.url,
        domain: item.domain,
        position: item.rank_absolute,
        description: item.description,
      }))
      .slice(0, limit);
  } catch (error) {
    console.error("Error fetching SERP results:", error);
    return [];
  }
}

/**
 * Get "People Also Ask" questions
 */
export async function getRelatedQuestions(
  keyword: string,
  locationCode: number = 2840,
  languageCode: string = "en"
): Promise<SearchQuestion[]> {
  try {
    // Use Google SERP to get People Also Ask
    const response = await apiRequest<SerpOrganicResult>(
      "/serp/google/organic/live/regular",
      [
        {
          keyword,
          location_code: locationCode,
          language_code: languageCode,
          depth: 10,
        },
      ]
    );

    const items = response.tasks?.[0]?.result?.[0]?.items || [];

    // Extract People Also Ask items
    const questions: SearchQuestion[] = [];
    for (const item of items) {
      if (item.type === "people_also_ask" && "items" in item) {
        const paaItems = (item as unknown as { items: { title: string }[] }).items || [];
        for (const paa of paaItems) {
          if (paa.title) {
            questions.push({ question: paa.title });
          }
        }
      }
    }

    // Also try to get questions from keyword suggestions
    if (questions.length < 5) {
      const relatedResponse = await apiRequest<KeywordSuggestionResult>(
        "/keywords_data/google_ads/keywords_for_keywords/live",
        [
          {
            keywords: [`${keyword} how`, `${keyword} what`, `${keyword} why`],
            location_code: locationCode,
            language_code: languageCode,
            limit: 20,
          },
        ]
      );

      const relatedResults = relatedResponse.tasks?.[0]?.result || [];
      for (const r of relatedResults) {
        if (
          r.keyword &&
          (r.keyword.includes("?") ||
            r.keyword.toLowerCase().startsWith("how") ||
            r.keyword.toLowerCase().startsWith("what") ||
            r.keyword.toLowerCase().startsWith("why") ||
            r.keyword.toLowerCase().startsWith("when") ||
            r.keyword.toLowerCase().startsWith("can") ||
            r.keyword.toLowerCase().startsWith("does") ||
            r.keyword.toLowerCase().startsWith("is"))
        ) {
          questions.push({
            question: r.keyword,
            searchVolume: r.keyword_info?.search_volume,
          });
        }
      }
    }

    return questions.slice(0, 10);
  } catch (error) {
    console.error("Error fetching related questions:", error);
    return [];
  }
}

/**
 * Full keyword research - combines all data sources
 */
export async function fullKeywordResearch(
  keyword: string,
  locationCode: number = 2840,
  languageCode: string = "en"
): Promise<KeywordResearchResult | null> {
  try {
    // Fetch all data in parallel
    const [metrics, relatedKeywords, competitors, questions] = await Promise.all([
      getKeywordMetrics(keyword, locationCode, languageCode),
      getRelatedKeywords(keyword, locationCode, languageCode, 15),
      getSerpResults(keyword, locationCode, languageCode, 5),
      getRelatedQuestions(keyword, locationCode, languageCode),
    ]);

    if (!metrics) {
      return null;
    }

    // Generate suggestions based on data
    const suggestions: KeywordResearchResult["suggestions"] = [];

    // Find easier alternatives
    const easierKeywords = relatedKeywords
      .filter(
        (k) =>
          k.searchVolume > 100 &&
          (k.keywordDifficulty === undefined ||
            k.keywordDifficulty < (metrics.keywordDifficulty || 50))
      )
      .slice(0, 3);

    for (const kw of easierKeywords) {
      suggestions.push({
        keyword: kw.keyword,
        reason:
          kw.keywordDifficulty !== undefined
            ? `Lower difficulty (${kw.keywordDifficulty}) with ${kw.searchVolume} monthly searches`
            : `Good search volume (${kw.searchVolume}/mo) with lower competition`,
        searchVolume: kw.searchVolume,
        keywordDifficulty: kw.keywordDifficulty,
      });
    }

    return {
      keyword,
      metrics,
      relatedKeywords,
      questions,
      competitors,
      suggestions,
      fetchedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error in full keyword research:", error);
    return null;
  }
}

/**
 * Check if DataForSEO credentials are configured
 */
export function isConfigured(): boolean {
  return !!(process.env.DATAFORSEO_LOGIN && process.env.DATAFORSEO_PASSWORD);
}
