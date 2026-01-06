"use client";

import { useState } from "react";
import type { KeywordResearchResult } from "@/lib/dataforseo/types";
import type { ContentSettingsData } from "./ContentSettings";

interface ContentGeneratorProps {
  focusKeyword: string;
  seoData: KeywordResearchResult | null;
  settings: ContentSettingsData;
  onContentGenerated: (content: string) => void;
  onOutlineGenerated: (outline: string) => void;
  disabled?: boolean;
}

export function ContentGenerator({
  focusKeyword,
  seoData,
  settings,
  onContentGenerated,
  onOutlineGenerated,
  disabled = false,
}: ContentGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState<"outline" | "content" | null>(null);
  const [generatedOutline, setGeneratedOutline] = useState("");
  const [showOutline, setShowOutline] = useState(false);

  const handleGenerate = async (type: "outline" | "content") => {
    if (!focusKeyword) {
      alert("Please complete keyword research first");
      return;
    }

    setIsGenerating(type);

    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          topic: focusKeyword,
          focusKeyword,
          seoData,
          toneId: settings.toneId,
          audienceIds: settings.audienceIds,
          customAudience: settings.customAudience,
          lengthId: settings.lengthId,
          includeStats: settings.includeStats,
          includeFaqs: settings.includeFaqs,
          includeActionables: settings.includeActionables,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Generation failed");
      }

      if (type === "outline") {
        setGeneratedOutline(data.result);
        setShowOutline(true);
        onOutlineGenerated(data.result);
      } else {
        onContentGenerated(data.result);
      }
    } catch (error) {
      console.error("Generation error:", error);
      alert(error instanceof Error ? error.message : "Generation failed");
    } finally {
      setIsGenerating(null);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
          Step 3: Generate Content
        </h3>
      </div>

      <div className="p-4 space-y-4">
        {!focusKeyword ? (
          <div className="text-center py-6 text-gray-500 dark:text-gray-400">
            <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p>Complete keyword research first to enable content generation</p>
          </div>
        ) : (
          <>
            <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4">
              <p className="text-sm text-indigo-800 dark:text-indigo-200 mb-3">
                <strong>Tip:</strong> Generate an outline first to review the structure before creating full content.
                This gives you more control over the final article.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => handleGenerate("outline")}
                  disabled={disabled || isGenerating !== null}
                  className="flex-1 px-4 py-3 bg-white dark:bg-gray-800 border-2 border-indigo-500 text-indigo-700 dark:text-indigo-300 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors flex items-center justify-center gap-2"
                >
                  {isGenerating === "outline" ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Generating Outline...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                      </svg>
                      Generate Outline First
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleGenerate("content")}
                  disabled={disabled || isGenerating !== null}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors flex items-center justify-center gap-2"
                >
                  {isGenerating === "content" ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Generating Content...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                      Generate Full Article
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Generated Outline Preview */}
            {showOutline && generatedOutline && (
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    Generated Outline
                  </h4>
                  <button
                    onClick={() => setShowOutline(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="prose prose-sm dark:prose-invert max-w-none max-h-64 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-xs text-gray-700 dark:text-gray-300 font-mono">
                    {generatedOutline}
                  </pre>
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => handleGenerate("content")}
                    disabled={isGenerating !== null}
                    className="px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                  >
                    Generate Content from Outline
                  </button>
                  <button
                    onClick={() => handleGenerate("outline")}
                    disabled={isGenerating !== null}
                    className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                  >
                    Regenerate Outline
                  </button>
                </div>
              </div>
            )}

            {/* Generation Info */}
            <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
              <p>
                <strong>Generating for:</strong> &quot;{focusKeyword}&quot;
              </p>
              <p>
                <strong>Target length:</strong>{" "}
                {settings.lengthId === "quick"
                  ? "800-1,200 words"
                  : settings.lengthId === "standard"
                  ? "1,500-2,000 words"
                  : settings.lengthId === "deep-dive"
                  ? "2,500-3,500 words"
                  : "4,000+ words"}
              </p>
              {seoData && (
                <p>
                  <strong>SEO data:</strong> {seoData.relatedKeywords.length} related keywords,{" "}
                  {seoData.questions.length} questions to address
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
