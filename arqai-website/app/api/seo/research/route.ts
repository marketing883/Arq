import { NextRequest, NextResponse } from "next/server";
import { fullKeywordResearch, isConfigured } from "@/lib/dataforseo/client";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function POST(request: NextRequest) {
  try {
    // Check if DataForSEO is configured
    if (!isConfigured()) {
      return NextResponse.json(
        { error: "DataForSEO API not configured" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { keyword, forceRefresh = false } = body;

    if (!keyword || typeof keyword !== "string") {
      return NextResponse.json(
        { error: "Keyword is required" },
        { status: 400 }
      );
    }

    const normalizedKeyword = keyword.toLowerCase().trim();

    // Check cache first (unless force refresh)
    const supabase = getSupabase();
    if (supabase && !forceRefresh) {
      const { data: cached } = await supabase
        .from("seo_research_cache")
        .select("*")
        .eq("keyword", normalizedKeyword)
        .gt("expires_at", new Date().toISOString())
        .single();

      if (cached) {
        return NextResponse.json({
          data: {
            keyword: cached.keyword,
            metrics: {
              keyword: cached.keyword,
              searchVolume: cached.search_volume,
              keywordDifficulty: cached.keyword_difficulty,
              cpc: cached.cpc,
              competition: cached.competition || 0,
              competitionLevel: cached.competition_level || "MEDIUM",
              trendPercent: cached.trend_percent,
              trendDirection: cached.trend_direction || "stable",
              trend: cached.trend_data || [],
            },
            relatedKeywords: cached.related_keywords || [],
            questions: cached.questions || [],
            competitors: cached.competitor_headlines || [],
            suggestions: cached.suggestions || [],
            fetchedAt: cached.fetched_at,
          },
          cached: true,
        });
      }
    }

    // Fetch fresh data from DataForSEO
    const result = await fullKeywordResearch(normalizedKeyword);

    if (!result) {
      return NextResponse.json(
        { error: "Failed to fetch keyword data. The keyword may have no search data." },
        { status: 404 }
      );
    }

    // Cache the result
    if (supabase) {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7 day cache

      await supabase.from("seo_research_cache").upsert(
        {
          keyword: normalizedKeyword,
          search_volume: result.metrics.searchVolume,
          keyword_difficulty: result.metrics.keywordDifficulty,
          cpc: result.metrics.cpc,
          competition: result.metrics.competition,
          competition_level: result.metrics.competitionLevel,
          trend_percent: result.metrics.trendPercent,
          trend_direction: result.metrics.trendDirection,
          trend_data: result.metrics.trend,
          related_keywords: result.relatedKeywords,
          questions: result.questions,
          competitor_headlines: result.competitors,
          suggestions: result.suggestions,
          fetched_at: new Date().toISOString(),
          expires_at: expiresAt.toISOString(),
        },
        { onConflict: "keyword" }
      );
    }

    return NextResponse.json({
      data: result,
      cached: false,
    });
  } catch (error) {
    console.error("SEO research error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch SEO data" },
      { status: 500 }
    );
  }
}
