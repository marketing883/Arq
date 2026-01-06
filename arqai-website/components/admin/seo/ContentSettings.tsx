"use client";

import { useState } from "react";
import {
  TONE_OPTIONS,
  AUDIENCE_PRESETS,
  LENGTH_OPTIONS,
  DEFAULT_TONE,
  DEFAULT_LENGTH,
  DEFAULT_AUDIENCES,
} from "@/lib/ai/config";

export interface ContentSettingsData {
  toneId: string;
  audienceIds: string[];
  customAudience: string;
  lengthId: string;
  includeStats: boolean;
  includeFaqs: boolean;
  includeActionables: boolean;
  includeCaseStudies: boolean;
  includeInternalLinks: boolean;
}

interface ContentSettingsProps {
  settings: ContentSettingsData;
  onChange: (settings: ContentSettingsData) => void;
  disabled?: boolean;
}

export function ContentSettings({
  settings,
  onChange,
  disabled = false,
}: ContentSettingsProps) {
  const [showCustomAudience, setShowCustomAudience] = useState(!!settings.customAudience);

  const updateSetting = <K extends keyof ContentSettingsData>(
    key: K,
    value: ContentSettingsData[K]
  ) => {
    onChange({ ...settings, [key]: value });
  };

  const toggleAudience = (audienceId: string) => {
    const newAudiences = settings.audienceIds.includes(audienceId)
      ? settings.audienceIds.filter((id) => id !== audienceId)
      : [...settings.audienceIds, audienceId];
    updateSetting("audienceIds", newAudiences);
  };

  const selectedTone = TONE_OPTIONS.find((t) => t.id === settings.toneId);
  const selectedLength = LENGTH_OPTIONS.find((l) => l.id === settings.lengthId);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          Step 2: Content Settings
        </h3>
      </div>

      <div className="p-4 space-y-6">
        {/* Target Audience */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Target Audience
          </label>
          <div className="flex flex-wrap gap-2">
            {AUDIENCE_PRESETS.map((audience) => (
              <button
                key={audience.id}
                type="button"
                onClick={() => toggleAudience(audience.id)}
                disabled={disabled}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  settings.audienceIds.includes(audience.id)
                    ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-2 border-purple-500"
                    : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 border-2 border-transparent hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
                title={audience.description}
              >
                {audience.label}
              </button>
            ))}
          </div>

          {/* Custom Audience */}
          <div className="mt-3">
            <button
              type="button"
              onClick={() => setShowCustomAudience(!showCustomAudience)}
              className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
            >
              {showCustomAudience ? "− Hide" : "+ Add"} custom audience context
            </button>
            {showCustomAudience && (
              <textarea
                value={settings.customAudience}
                onChange={(e) => updateSetting("customAudience", e.target.value)}
                disabled={disabled}
                placeholder="Add specific details about your target audience, industry focus, pain points..."
                className="mt-2 w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                rows={2}
              />
            )}
          </div>
        </div>

        {/* Content Length */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Content Length
          </label>
          <div className="space-y-2">
            {LENGTH_OPTIONS.map((length) => (
              <label
                key={length.id}
                className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  settings.lengthId === length.id
                    ? "bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500"
                    : "bg-gray-50 dark:bg-gray-700/50 border-2 border-transparent hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <input
                  type="radio"
                  name="contentLength"
                  value={length.id}
                  checked={settings.lengthId === length.id}
                  onChange={() => updateSetting("lengthId", length.id)}
                  disabled={disabled}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {length.label}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {length.wordRange}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      ~{length.readTime}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {length.bestFor}
                  </p>
                </div>
              </label>
            ))}
          </div>
          {selectedLength && (
            <p className="mt-2 text-xs text-blue-600 dark:text-blue-400">
              SEO Note: {selectedLength.seoNote}
            </p>
          )}
        </div>

        {/* Tone & Voice */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tone & Voice
          </label>
          <select
            value={settings.toneId}
            onChange={(e) => updateSetting("toneId", e.target.value)}
            disabled={disabled}
            className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            {TONE_OPTIONS.map((tone) => (
              <option key={tone.id} value={tone.id}>
                {tone.label}
              </option>
            ))}
          </select>
          {selectedTone && (
            <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
              {selectedTone.description}
            </p>
          )}
        </div>

        {/* Include Options */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Include in Content
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { key: "includeStats", label: "Statistics & Data Points" },
              { key: "includeFaqs", label: "FAQ Section (for AEO)" },
              { key: "includeActionables", label: "Actionable Takeaways" },
              { key: "includeCaseStudies", label: "Case Study Examples" },
              { key: "includeInternalLinks", label: "Internal Links to ArqAI" },
            ].map((option) => (
              <label
                key={option.key}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={settings[option.key as keyof ContentSettingsData] as boolean}
                  onChange={(e) =>
                    updateSetting(
                      option.key as keyof ContentSettingsData,
                      e.target.checked
                    )
                  }
                  disabled={disabled}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function getDefaultSettings(): ContentSettingsData {
  return {
    toneId: DEFAULT_TONE,
    audienceIds: DEFAULT_AUDIENCES,
    customAudience: "",
    lengthId: DEFAULT_LENGTH,
    includeStats: true,
    includeFaqs: true,
    includeActionables: true,
    includeCaseStudies: false,
    includeInternalLinks: true,
  };
}
