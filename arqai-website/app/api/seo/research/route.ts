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
    let result;
    try {
      result = await fullKeywordResearch(normalizedKeyword);
    } catch (apiError) {
      console.error("DataForSEO API error:", apiError);
      return NextResponse.json(
        { error: `DataForSEO API error: ${apiError instanceof Error ? apiError.message : "Unknown error"}` },
        { status: 500 }
      );
    }

    if (!result) {
      // Return mock data for testing when API doesn't return results
      console.log("No results from DataForSEO, returning mock data for:", normalizedKeyword);
      return NextResponse.json({
        data: {
          keyword: normalizedKeyword,
          metrics: {
            keyword: normalizedKeyword,
            searchVolume: 1200,
            keywordDifficulty: 45,
            cpc: 3.50,
            competition: 0.65,
            competitionLevel: "MEDIUM",
            trendPercent: 12,
            trendDirection: "up",
            trend: [900, 1000, 1100, 1200, 1150, 1200],
          },
          relatedKeywords: [
            { keyword: `${normalizedKeyword} best practices`, searchVolume: 720, cpc: 2.80, competition: 0.5 },
            { keyword: `${normalizedKeyword} guide`, searchVolume: 590, cpc: 2.20, competition: 0.4 },
            { keyword: `${normalizedKeyword} examples`, searchVolume: 480, cpc: 1.90, competition: 0.35 },
          ],
          questions: [
            { question: `What is ${normalizedKeyword}?` },
            { question: `How to implement ${normalizedKeyword}?` },
            { question: `Why is ${normalizedKeyword} important?` },
            { question: `Best ${normalizedKeyword} tools?` },
          ],
          competitors: [
            { title: `Complete Guide to ${normalizedKeyword}`, domain: "example.com", position: 1 },
            { title: `${normalizedKeyword} Explained`, domain: "industry-blog.com", position: 2 },
          ],
          suggestions: [
            { keyword: `${normalizedKeyword} for enterprise`, reason: "Lower competition with good volume", searchVolume: 450 },
          ],
          fetchedAt: new Date().toISOString(),
        },
        cached: false,
        mock: true,
      });
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
