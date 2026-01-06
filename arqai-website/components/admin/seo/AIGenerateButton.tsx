"use client";

import { useState } from "react";

interface AIGenerateButtonProps {
  onClick: () => Promise<void>;
  disabled?: boolean;
  size?: "sm" | "md";
  title?: string;
}

export function AIGenerateButton({
  onClick,
  disabled = false,
  size = "md",
  title = "Generate with AI",
}: AIGenerateButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (isLoading || disabled) return;
    setIsLoading(true);
    try {
      await onClick();
    } finally {
      setIsLoading(false);
    }
  };

  const sizeClasses = size === "sm" ? "p-1.5" : "p-2";
  const iconSize = size === "sm" ? "w-4 h-4" : "w-5 h-5";

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || isLoading}
      title={title}
      className={`${sizeClasses} rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md`}
    >
      {isLoading ? (
        <svg
          className={`${iconSize} animate-spin`}
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        <svg
          className={iconSize}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
          />
        </svg>
      )}
    </button>
  );
}

interface AIFieldWrapperProps {
  label: string;
  charCount?: number;
  maxChars?: number;
  children: React.ReactNode;
  onGenerate: () => Promise<void>;
  generateDisabled?: boolean;
  helpText?: string;
  status?: "good" | "warning" | "error";
}

export function AIFieldWrapper({
  label,
  charCount,
  maxChars,
  children,
  onGenerate,
  generateDisabled = false,
  helpText,
  status,
}: AIFieldWrapperProps) {
  const statusColors = {
    good: "text-green-600",
    warning: "text-yellow-600",
    error: "text-red-600",
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
        <div className="flex items-center gap-2">
          {charCount !== undefined && maxChars !== undefined && (
            <span
              className={`text-xs ${
                charCount > maxChars
                  ? "text-red-500"
                  : charCount > maxChars * 0.9
                  ? "text-yellow-500"
                  : "text-gray-400"
              }`}
            >
              {charCount}/{maxChars}
            </span>
          )}
          <AIGenerateButton
            onClick={onGenerate}
            disabled={generateDisabled}
            size="sm"
          />
        </div>
      </div>
      {children}
      {helpText && (
        <p className={`text-xs ${status ? statusColors[status] : "text-gray-500"}`}>
          {helpText}
        </p>
      )}
    </div>
  );
}
