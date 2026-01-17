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
    <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-200">
        <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
          <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          Step 2: Content Settings
        </h3>
      </div>

      <div className="p-4 space-y-5">
        {/* Target Audience */}
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-2">
            Target Audience
          </label>
          <div className="flex flex-wrap gap-1.5">
            {AUDIENCE_PRESETS.map((audience) => (
              <button
                key={audience.id}
                type="button"
                onClick={() => toggleAudience(audience.id)}
                disabled={disabled}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  settings.audienceIds.includes(audience.id)
                    ? "bg-purple-100 text-purple-700 border border-purple-300"
                    : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100"
                }`}
                title={audience.description}
              >
                {audience.label}
              </button>
            ))}
          </div>

          {/* Custom Audience */}
          <div className="mt-2">
            <button
              type="button"
              onClick={() => setShowCustomAudience(!showCustomAudience)}
              className="text-xs text-purple-600 hover:text-purple-700"
            >
              {showCustomAudience ? "− Hide" : "+ Add"} custom audience
            </button>
            {showCustomAudience && (
              <textarea
                value={settings.customAudience}
                onChange={(e) => updateSetting("customAudience", e.target.value)}
                disabled={disabled}
                placeholder="Add specific details about your target audience..."
                className="mt-1.5 w-full px-2.5 py-1.5 rounded border border-slate-200 bg-white text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                rows={2}
              />
            )}
          </div>
        </div>

        {/* Content Length */}
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-2">
            Content Length
          </label>
          <div className="space-y-1.5">
            {LENGTH_OPTIONS.map((length) => (
              <label
                key={length.id}
                className={`flex items-start gap-2.5 p-2.5 rounded cursor-pointer transition-colors ${
                  settings.lengthId === length.id
                    ? "bg-blue-50 border border-blue-200"
                    : "bg-slate-50 border border-transparent hover:bg-slate-100"
                }`}
              >
                <input
                  type="radio"
                  name="contentLength"
                  value={length.id}
                  checked={settings.lengthId === length.id}
                  onChange={() => updateSetting("lengthId", length.id)}
                  disabled={disabled}
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-900">
                      {length.label}
                    </span>
                    <span className="text-xs text-slate-500">
                      {length.wordRange}
                    </span>
                    <span className="text-xs text-slate-400">
                      ~{length.readTime}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {length.bestFor}
                  </p>
                </div>
              </label>
            ))}
          </div>
          {selectedLength && (
            <p className="mt-1.5 text-xs text-blue-600">
              SEO: {selectedLength.seoNote}
            </p>
          )}
        </div>

        {/* Tone & Voice */}
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1.5">
            Tone & Voice
          </label>
          <select
            value={settings.toneId}
            onChange={(e) => updateSetting("toneId", e.target.value)}
            disabled={disabled}
            className="w-full px-2.5 py-1.5 rounded border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
          >
            {TONE_OPTIONS.map((tone) => (
              <option key={tone.id} value={tone.id}>
                {tone.label}
              </option>
            ))}
          </select>
          {selectedTone && (
            <p className="mt-1 text-xs text-slate-500">
              {selectedTone.description}
            </p>
          )}
        </div>

        {/* Include Options */}
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-2">
            Include in Content
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { key: "includeStats", label: "Statistics & Data" },
              { key: "includeFaqs", label: "FAQ Section" },
              { key: "includeActionables", label: "Actionable Tips" },
              { key: "includeCaseStudies", label: "Case Studies" },
              { key: "includeInternalLinks", label: "Internal Links" },
            ].map((option) => (
              <label
                key={option.key}
                className="flex items-center gap-1.5 cursor-pointer"
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
                  className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-xs text-slate-700">
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
