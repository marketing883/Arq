"use client";

import { useState } from "react";
import type { KeywordResearchResult } from "@/lib/dataforseo/types";
import type { ContentSettingsData } from "./ContentSettings";
import { markdownToHtml } from "@/lib/utils/markdown";

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
        // Convert markdown to HTML for the TiptapEditor
        const htmlContent = markdownToHtml(data.result);
        onContentGenerated(htmlContent);
      }
    } catch (error) {
      console.error("Generation error:", error);
      alert(error instanceof Error ? error.message : "Generation failed");
    } finally {
      setIsGenerating(null);
    }
  };

  return (
    <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-200">
        <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
          <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
          Step 3: Generate Content
        </h3>
      </div>

      <div className="p-4 space-y-3">
        {!focusKeyword ? (
          <div className="text-center py-4 text-slate-500">
            <svg className="w-10 h-10 mx-auto mb-2 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-xs">Complete keyword research first</p>
          </div>
        ) : (
          <>
            <div className="bg-indigo-50 rounded p-3">
              <p className="text-xs text-indigo-800 mb-2.5">
                <strong>Tip:</strong> Generate an outline first to review structure before full content.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleGenerate("outline")}
                  disabled={disabled || isGenerating !== null}
                  className="flex-1 px-3 py-2 bg-white border border-indigo-300 text-indigo-700 rounded hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors flex items-center justify-center gap-1.5"
                >
                  {isGenerating === "outline" ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Generating...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                      </svg>
                      Outline First
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleGenerate("content")}
                  disabled={disabled || isGenerating !== null}
                  className="flex-1 px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors flex items-center justify-center gap-1.5"
                >
                  {isGenerating === "content" ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Generating...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                      Full Article
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Generated Outline Preview */}
            {showOutline && generatedOutline && (
              <div className="bg-slate-50 rounded p-3">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-medium text-slate-900">
                    Generated Outline
                  </h4>
                  <button
                    onClick={() => setShowOutline(false)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="max-h-48 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-xs text-slate-700 font-mono">
                    {generatedOutline}
                  </pre>
                </div>
                <div className="mt-2 flex gap-1.5">
                  <button
                    onClick={() => handleGenerate("content")}
                    disabled={isGenerating !== null}
                    className="px-2.5 py-1 bg-indigo-600 text-white text-xs rounded hover:bg-indigo-700 disabled:opacity-50"
                  >
                    Generate from Outline
                  </button>
                  <button
                    onClick={() => handleGenerate("outline")}
                    disabled={isGenerating !== null}
                    className="px-2.5 py-1 border border-slate-300 text-slate-700 text-xs rounded hover:bg-slate-100 disabled:opacity-50"
                  >
                    Regenerate
                  </button>
                </div>
              </div>
            )}

            {/* Generation Info */}
            <div className="text-xs text-slate-500 space-y-0.5">
              <p>
                <strong>Topic:</strong> &quot;{focusKeyword}&quot;
              </p>
              <p>
                <strong>Length:</strong>{" "}
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
                  <strong>SEO:</strong> {seoData.relatedKeywords.length} keywords, {seoData.questions.length} questions
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
