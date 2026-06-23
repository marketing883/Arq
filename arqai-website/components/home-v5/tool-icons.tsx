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
  Salesforce: (
    <svg viewBox="0 0 24 24" width="24" height="24" {...s}>
      <path d="M8 18h8.5a3.5 3.5 0 0 0 .4-7 4.5 4.5 0 0 0-8.6-1.3A3.4 3.4 0 0 0 8 18z" />
    </svg>
  ),
  SAP: (
    <svg viewBox="0 0 24 24" width="24" height="24" {...s}>
      <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
      <path d="M4 7.5l8 4.5 8-4.5M12 12v9" />
    </svg>
  ),
  ServiceNow: (
    <svg viewBox="0 0 24 24" width="24" height="24" {...s}>
      <path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2 2 2 0 0 0 0 4 2 2 0 0 1-2 2H5a2 2 0 0 1-2-2 2 2 0 0 0 0-4z" />
      <path d="M14 7.5v9" />
    </svg>
  ),
  Snowflake: (
    <svg viewBox="0 0 24 24" width="24" height="24" {...s}>
      <path d="M12 3v18M4.2 7.5l15.6 9M19.8 7.5l-15.6 9" />
    </svg>
  ),
  Databricks: (
    <svg viewBox="0 0 24 24" width="24" height="24" {...s}>
      <path d="M12 3l3 2-3 2-3-2 3-2zM12 9l3 2-3 2-3-2 3-2zM12 15l3 2-3 2-3-2 3-2z" />
    </svg>
  ),
  "Microsoft 365": (
    <svg viewBox="0 0 24 24" width="24" height="24" {...s}>
      <rect x="4" y="4" width="7" height="7" rx="1" />
      <rect x="13" y="4" width="7" height="7" rx="1" />
      <rect x="4" y="13" width="7" height="7" rx="1" />
      <rect x="13" y="13" width="7" height="7" rx="1" />
    </svg>
  ),
  Okta: (
    <svg viewBox="0 0 24 24" width="24" height="24" {...s}>
      <path d="M12 3l7 3v5c0 4.2-3 7.4-7 8.6C8 18.4 5 15.2 5 11V6l7-3z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
  Guidewire: (
    <svg viewBox="0 0 24 24" width="24" height="24" {...s}>
      <path d="M6 3h8l4 4v14H6V3z" />
      <path d="M14 3v4h4M9 12h6M9 16h6" />
    </svg>
  ),
};
