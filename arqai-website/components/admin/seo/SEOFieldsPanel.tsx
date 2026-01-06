"use client";

import { useState } from "react";
import { AIFieldWrapper } from "./AIGenerateButton";
import type { KeywordResearchResult } from "@/lib/dataforseo/types";

export interface SEOFieldsData {
  metaTitle: string;
  metaDescription: string;
  focusKeyword: string;
  secondaryKeywords: string[];
  faqSchema: { question: string; answer: string }[];
  keyEntities: string[];
  ogTitle: string;
  ogDescription: string;
}

interface SEOFieldsPanelProps {
  fields: SEOFieldsData;
  onChange: (fields: SEOFieldsData) => void;
  seoData: KeywordResearchResult | null;
  toneId: string;
  disabled?: boolean;
}

export function SEOFieldsPanel({
  fields,
  onChange,
  seoData,
  toneId,
  disabled = false,
}: SEOFieldsPanelProps) {
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const [generationOptions, setGenerationOptions] = useState<{
    field: string;
    options: string[];
  } | null>(null);

  const updateField = <K extends keyof SEOFieldsData>(
    key: K,
    value: SEOFieldsData[K]
  ) => {
    onChange({ ...fields, [key]: value });
  };

  const generateField = async (
    fieldType: "title" | "description" | "faq" | "og_title" | "og_description" | "extract_keywords"
  ) => {
    if (!fields.focusKeyword) {
      alert("Please enter a focus keyword first");
      return;
    }

    setIsGenerating(fieldType);
    setGenerationOptions(null);

    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: fieldType,
          topic: fields.focusKeyword,
          focusKeyword: fields.focusKeyword,
          seoData,
          toneId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Generation failed");
      }

      // Handle different response types
      if (fieldType === "title") {
        if (data.options?.length > 1) {
          setGenerationOptions({ field: "metaTitle", options: data.options });
        }
        updateField("metaTitle", data.result);
      } else if (fieldType === "description") {
        if (data.options?.length > 1) {
          setGenerationOptions({ field: "metaDescription", options: data.options });
        }
        updateField("metaDescription", data.result);
      } else if (fieldType === "og_title") {
        if (data.options?.length > 1) {
          setGenerationOptions({ field: "ogTitle", options: data.options });
        }
        updateField("ogTitle", data.result);
      } else if (fieldType === "og_description") {
        if (data.options?.length > 1) {
          setGenerationOptions({ field: "ogDescription", options: data.options });
        }
        updateField("ogDescription", data.result);
      } else if (fieldType === "faq") {
        if (Array.isArray(data.result)) {
          updateField("faqSchema", data.result);
        }
      } else if (fieldType === "extract_keywords") {
        if (data.result?.secondaryKeywords) {
          updateField("secondaryKeywords", data.result.secondaryKeywords);
        }
        if (data.result?.entities) {
          updateField("keyEntities", data.result.entities);
        }
      }
    } catch (error) {
      console.error("Generation error:", error);
      alert(error instanceof Error ? error.message : "Generation failed");
    } finally {
      setIsGenerating(null);
    }
  };

  const selectOption = (field: string, option: string) => {
    updateField(field as keyof SEOFieldsData, option);
    setGenerationOptions(null);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          SEO Optimization
        </h3>
      </div>

      <div className="p-4 space-y-5">
        {/* Focus Keyword */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Focus Keyword
          </label>
          <input
            type="text"
            value={fields.focusKeyword}
            onChange={(e) => updateField("focusKeyword", e.target.value)}
            disabled={disabled}
            placeholder="Primary keyword to rank for"
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        {/* Meta Title */}
        <AIFieldWrapper
          label="Meta Title"
          charCount={fields.metaTitle.length}
          maxChars={60}
          onGenerate={() => generateField("title")}
          generateDisabled={disabled || isGenerating === "title" || !fields.focusKeyword}
          helpText={
            fields.metaTitle.length > 0
              ? fields.metaTitle.length <= 60
                ? "Good length for search results"
                : "May be truncated in search results"
              : "50-60 characters recommended"
          }
          status={
            fields.metaTitle.length === 0
              ? undefined
              : fields.metaTitle.length <= 60
              ? "good"
              : "warning"
          }
        >
          <input
            type="text"
            value={fields.metaTitle}
            onChange={(e) => updateField("metaTitle", e.target.value)}
            disabled={disabled}
            placeholder="SEO-optimized title for search engines"
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </AIFieldWrapper>

        {/* Generation Options for Meta Title */}
        {generationOptions?.field === "metaTitle" && (
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 space-y-2">
            <p className="text-xs font-medium text-purple-700 dark:text-purple-300">
              Alternative options (click to use):
            </p>
            {generationOptions.options.map((option, i) => (
              <button
                key={i}
                onClick={() => selectOption("metaTitle", option)}
                className="block w-full text-left px-3 py-2 bg-white dark:bg-gray-800 rounded text-sm text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {/* Meta Description */}
        <AIFieldWrapper
          label="Meta Description"
          charCount={fields.metaDescription.length}
          maxChars={160}
          onGenerate={() => generateField("description")}
          generateDisabled={disabled || isGenerating === "description" || !fields.focusKeyword}
          helpText={
            fields.metaDescription.length > 0
              ? fields.metaDescription.length <= 160
                ? "Good length for search snippets"
                : "May be truncated in search results"
              : "150-160 characters recommended"
          }
          status={
            fields.metaDescription.length === 0
              ? undefined
              : fields.metaDescription.length <= 160
              ? "good"
              : "warning"
          }
        >
          <textarea
            value={fields.metaDescription}
            onChange={(e) => updateField("metaDescription", e.target.value)}
            disabled={disabled}
            placeholder="Compelling description for search results"
            rows={2}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </AIFieldWrapper>

        {/* Generation Options for Meta Description */}
        {generationOptions?.field === "metaDescription" && (
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 space-y-2">
            <p className="text-xs font-medium text-purple-700 dark:text-purple-300">
              Alternative options:
            </p>
            {generationOptions.options.map((option, i) => (
              <button
                key={i}
                onClick={() => selectOption("metaDescription", option)}
                className="block w-full text-left px-3 py-2 bg-white dark:bg-gray-800 rounded text-sm text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {/* Secondary Keywords */}
        <AIFieldWrapper
          label="Secondary Keywords"
          onGenerate={() => generateField("extract_keywords")}
          generateDisabled={disabled || isGenerating === "extract_keywords" || !fields.focusKeyword}
          helpText="Related terms to naturally include in content"
        >
          <input
            type="text"
            value={fields.secondaryKeywords.join(", ")}
            onChange={(e) =>
              updateField(
                "secondaryKeywords",
                e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
              )
            }
            disabled={disabled}
            placeholder="keyword1, keyword2, keyword3"
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </AIFieldWrapper>

        {/* FAQ Schema */}
        <AIFieldWrapper
          label="FAQ Schema (for AEO/Featured Snippets)"
          onGenerate={() => generateField("faq")}
          generateDisabled={disabled || isGenerating === "faq" || !fields.focusKeyword}
          helpText="Q&A pairs for structured data and voice search"
        >
          <div className="space-y-3">
            {fields.faqSchema.map((faq, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <input
                    type="text"
                    value={faq.question}
                    onChange={(e) => {
                      const newFaqs = [...fields.faqSchema];
                      newFaqs[index] = { ...faq, question: e.target.value };
                      updateField("faqSchema", newFaqs);
                    }}
                    disabled={disabled}
                    placeholder="Question"
                    className="flex-1 px-2 py-1.5 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newFaqs = fields.faqSchema.filter((_, i) => i !== index);
                      updateField("faqSchema", newFaqs);
                    }}
                    className="p-1 text-gray-400 hover:text-red-500"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <textarea
                  value={faq.answer}
                  onChange={(e) => {
                    const newFaqs = [...fields.faqSchema];
                    newFaqs[index] = { ...faq, answer: e.target.value };
                    updateField("faqSchema", newFaqs);
                  }}
                  disabled={disabled}
                  placeholder="Answer"
                  rows={2}
                  className="w-full px-2 py-1.5 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                updateField("faqSchema", [...fields.faqSchema, { question: "", answer: "" }])
              }
              disabled={disabled}
              className="text-sm text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
            >
              + Add FAQ
            </button>
          </div>
        </AIFieldWrapper>

        {/* Key Entities */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Key Entities (for GEO/AI Citations)
          </label>
          <input
            type="text"
            value={fields.keyEntities.join(", ")}
            onChange={(e) =>
              updateField(
                "keyEntities",
                e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
              )
            }
            disabled={disabled}
            placeholder="ArqAI, HIPAA, SOC 2, GDPR"
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Companies, products, regulations, and concepts mentioned
          </p>
        </div>

        {/* Social Media Preview */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Social Media Preview (Open Graph)
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AIFieldWrapper
              label="OG Title"
              charCount={fields.ogTitle.length}
              maxChars={70}
              onGenerate={() => generateField("og_title")}
              generateDisabled={disabled || isGenerating === "og_title" || !fields.focusKeyword}
            >
              <input
                type="text"
                value={fields.ogTitle}
                onChange={(e) => updateField("ogTitle", e.target.value)}
                disabled={disabled}
                placeholder="Social media title"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              />
            </AIFieldWrapper>

            <AIFieldWrapper
              label="OG Description"
              charCount={fields.ogDescription.length}
              maxChars={200}
              onGenerate={() => generateField("og_description")}
              generateDisabled={disabled || isGenerating === "og_description" || !fields.focusKeyword}
            >
              <input
                type="text"
                value={fields.ogDescription}
                onChange={(e) => updateField("ogDescription", e.target.value)}
                disabled={disabled}
                placeholder="Social media description"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              />
            </AIFieldWrapper>
          </div>
        </div>
      </div>
    </div>
  );
}

export function getDefaultSEOFields(): SEOFieldsData {
  return {
    metaTitle: "",
    metaDescription: "",
    focusKeyword: "",
    secondaryKeywords: [],
    faqSchema: [],
    keyEntities: [],
    ogTitle: "",
    ogDescription: "",
  };
}
