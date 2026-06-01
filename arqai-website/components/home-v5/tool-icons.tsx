import type { ReactNode } from "react";

/* Simple monoline brand glyphs (stroke = currentColor), styled lime in CSS. */
const s = {
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const TOOL_ICONS: Record<string, ReactNode> = {
  Slack: (
    <svg viewBox="0 0 24 24" width="24" height="24" {...s}>
      <rect x="10" y="3" width="4" height="11" rx="2" />
      <rect x="10" y="17" width="4" height="4" rx="2" />
      <rect x="3" y="10" width="11" height="4" rx="2" />
      <rect x="17" y="10" width="4" height="4" rx="2" />
    </svg>
  ),
  Notion: (
    <svg viewBox="0 0 24 24" width="24" height="24" {...s}>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M8 16V8l8 8V8" />
    </svg>
  ),
  Gmail: (
    <svg viewBox="0 0 24 24" width="24" height="24" {...s}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  ),
  "Google Sheets": (
    <svg viewBox="0 0 24 24" width="24" height="24" {...s}>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M9 9h6M9 13h6M9 17h6M12 9v8" />
    </svg>
  ),
  Amazon: (
    <svg viewBox="0 0 24 24" width="24" height="24" {...s}>
      <path d="M5 15c4 3 10 3 14 0" />
      <path d="M17 17c1-.6 1.6-1.4 2-2.5" />
      <path d="M8 11c0-2 1.5-3 4-3s4 1 4 3v3" />
      <path d="M8 13c0 1.5 1.2 2.5 3 2.5 1.6 0 3-1 3-2.5" />
    </svg>
  ),
  Reddit: (
    <svg viewBox="0 0 24 24" width="24" height="24" {...s}>
      <circle cx="12" cy="13" r="7" />
      <circle cx="9" cy="13" r="1" />
      <circle cx="15" cy="13" r="1" />
      <path d="M9 16c1.8 1.2 4.2 1.2 6 0" />
      <path d="M16 7l-1 4M16 7a1.4 1.4 0 1 0 0-.1" />
    </svg>
  ),
  "X (Twitter)": (
    <svg viewBox="0 0 24 24" width="24" height="24" {...s}>
      <path d="M5 5l14 14M19 5L5 19" />
    </svg>
  ),
  LinkedIn: (
    <svg viewBox="0 0 24 24" width="24" height="24" {...s}>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M7 10v7M7 7v.01M11 17v-4a2 2 0 0 1 4 0v4M11 17v-7" />
    </svg>
  ),
  Meta: (
    <svg viewBox="0 0 24 24" width="24" height="24" {...s}>
      <path d="M3 15c0-5 2.5-8 5-8s3.5 3 4 5 1.5 5 4 5 4-3 4-6-1.5-6-4-6" />
    </svg>
  ),
  PayPal: (
    <svg viewBox="0 0 24 24" width="24" height="24" {...s}>
      <path d="M8 19l2-14h5a3 3 0 0 1 0 6h-4" />
      <path d="M7 16h4a3 3 0 0 0 0-6" />
    </svg>
  ),
};
