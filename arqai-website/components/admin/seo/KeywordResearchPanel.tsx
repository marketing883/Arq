"use client";

import { useState } from "react";
import type { KeywordResearchResult } from "@/lib/dataforseo/types";

interface KeywordResearchPanelProps {
  onKeywordConfirmed: (keyword: string, data: KeywordResearchResult | null) => void;
  initialKeyword?: string;
}

export function KeywordResearchPanel({
  onKeywordConfirmed,
  initialKeyword = "",
}: KeywordResearchPanelProps) {
  const [keyword, setKeyword] = useState(initialKeyword);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [researchData, setResearchData] = useState<KeywordResearchResult | null>(null);
  const [showInsights, setShowInsights] = useState(false);

  const handleResearch = async () => {
    if (!keyword.trim()) {
      setError("Please enter a keyword");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/seo/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword: keyword.trim() }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch keyword data");
      }

      setResearchData(result.data);
      setShowInsights(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Research failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = () => {
    onKeywordConfirmed(keyword.trim(), researchData);
  };

  const handleSwitchKeyword = (newKeyword: string) => {
    setKeyword(newKeyword);
    setResearchData(null);
    setShowInsights(false);
  };

  const getDifficultyColor = (difficulty?: number) => {
    if (!difficulty) return "bg-gray-200 text-gray-700";
    if (difficulty < 30) return "bg-green-100 text-green-700";
    if (difficulty < 50) return "bg-yellow-100 text-yellow-700";
    if (difficulty < 70) return "bg-orange-100 text-orange-700";
    return "bg-red-100 text-red-700";
  };

  const getDifficultyLabel = (difficulty?: number) => {
    if (!difficulty) return "Unknown";
    if (difficulty < 30) return "Easy";
    if (difficulty < 50) return "Medium";
    if (difficulty < 70) return "Hard";
    return "Very Hard";
  };

  const getTrendIcon = (direction?: string) => {
    if (direction === "up") {
      return <span className="text-green-500">↑</span>;
    } else if (direction === "down") {
      return <span className="text-red-500">↓</span>;
    }
    return <span className="text-gray-400">→</span>;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Step 1: Keyword Research
        </h3>
      </div>

      <div className="p-4 space-y-4">
        {/* Keyword Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Enter your topic or target keyword
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleResearch()}
              placeholder="e.g., enterprise ai governance"
              className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleResearch}
              disabled={isLoading || !keyword.trim()}
              className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium transition-colors"
            >
              {isLoading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Researching...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Research
                </>
              )}
            </button>
          </div>
          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        </div>

        {/* Insights Panel */}
        {showInsights && researchData && (
          <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            {/* Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                <p className="text-xs text-gray-500 dark:text-gray-400">Search Volume</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {researchData.metrics.searchVolume.toLocaleString()}
                  <span className="text-xs font-normal text-gray-500">/mo</span>
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                <p className="text-xs text-gray-500 dark:text-gray-400">Difficulty</p>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${getDifficultyColor(researchData.metrics.keywordDifficulty)}`}>
                    {researchData.metrics.keywordDifficulty || "N/A"}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {getDifficultyLabel(researchData.metrics.keywordDifficulty)}
                  </span>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                <p className="text-xs text-gray-500 dark:text-gray-400">CPC</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  ${researchData.metrics.cpc.toFixed(2)}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                <p className="text-xs text-gray-500 dark:text-gray-400">Trend</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-1">
                  {getTrendIcon(researchData.metrics.trendDirection)}
                  {researchData.metrics.trendPercent > 0 ? "+" : ""}
                  {researchData.metrics.trendPercent}%
                </p>
              </div>
            </div>

            {/* Suggestions */}
            {researchData.suggestions.length > 0 && (
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <p className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  Alternative Keywords with Better Opportunity
                </p>
                <div className="space-y-2">
                  {researchData.suggestions.map((s, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg p-3"
                    >
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{s.keyword}</p>
                        <p className="text-xs text-gray-500">{s.reason}</p>
                      </div>
                      <button
                        onClick={() => handleSwitchKeyword(s.keyword)}
                        className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                      >
                        Use This
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Related Keywords */}
            {researchData.relatedKeywords.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Related Keywords
                </p>
                <div className="flex flex-wrap gap-2">
                  {researchData.relatedKeywords.slice(0, 10).map((kw, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-700 dark:text-gray-300"
                    >
                      {kw.keyword} ({kw.searchVolume})
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Questions */}
            {researchData.questions.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Questions People Ask
                </p>
                <ul className="space-y-1">
                  {researchData.questions.slice(0, 5).map((q, i) => (
                    <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                      <span className="text-blue-500">•</span>
                      {q.question}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Competitors */}
            {researchData.competitors.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Top Competitor Articles
                </p>
                <div className="space-y-2">
                  {researchData.competitors.slice(0, 3).map((c, i) => (
                    <div key={i} className="text-sm">
                      <p className="text-gray-900 dark:text-white font-medium truncate">
                        {i + 1}. {c.title}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{c.domain}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleConfirm}
                className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Continue with &quot;{keyword}&quot;
              </button>
              <button
                onClick={() => {
                  setShowInsights(false);
                  setResearchData(null);
                }}
                className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors"
              >
                Try Different Keyword
              </button>
            </div>
          </div>
        )}

        {/* Skip Research Option */}
        {!showInsights && (
          <button
            onClick={() => onKeywordConfirmed(keyword.trim() || "untitled", null)}
            className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            Skip research and continue without SEO data →
          </button>
        )}
      </div>
    </div>
  );
}
