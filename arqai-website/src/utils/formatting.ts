/**
 * Formatting Utilities
 *
 * Data formatting and display utilities.
 */

/**
 * Format a date for display
 */
export function formatDate(
  date: Date | string,
  options?: Intl.DateTimeFormatOptions
): string {
  const d = typeof date === "string" ? new Date(date) : date;

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  return d.toLocaleDateString("en-US", options || defaultOptions);
}

/**
 * Format a date with time
 */
export function formatDateTime(
  date: Date | string,
  options?: Intl.DateTimeFormatOptions
): string {
  const d = typeof date === "string" ? new Date(date) : date;

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  return d.toLocaleString("en-US", options || defaultOptions);
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) {
    return "just now";
  } else if (diffMin < 60) {
    return `${diffMin} minute${diffMin === 1 ? "" : "s"} ago`;
  } else if (diffHour < 24) {
    return `${diffHour} hour${diffHour === 1 ? "" : "s"} ago`;
  } else if (diffDay < 7) {
    return `${diffDay} day${diffDay === 1 ? "" : "s"} ago`;
  } else {
    return formatDate(d);
  }
}

/**
 * Format a number with commas
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US").format(num);
}

/**
 * Format a percentage
 */
export function formatPercent(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format currency
 */
export function formatCurrency(
  amount: number,
  currency: string = "USD"
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + "...";
}

/**
 * Capitalize first letter
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Convert to title case
 */
export function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => capitalize(word))
    .join(" ");
}

/**
 * Format lead score for display
 */
export function formatLeadScore(score: number): {
  value: string;
  label: string;
  color: string;
} {
  if (score >= 70) {
    return { value: `${score}`, label: "Hot", color: "#ef4444" };
  } else if (score >= 50) {
    return { value: `${score}`, label: "Warm", color: "#f97316" };
  } else if (score >= 30) {
    return { value: `${score}`, label: "Nurture", color: "#eab308" };
  } else {
    return { value: `${score}`, label: "Cold", color: "#6b7280" };
  }
}

/**
 * Format journey stage for display
 */
export function formatJourneyStage(stage: string): string {
  const stages: Record<string, string> = {
    anonymous: "Anonymous Visitor",
    identified: "Identified Lead",
    engaged: "Engaged Lead",
    qualified: "Qualified Lead",
    opportunity: "Sales Opportunity",
  };
  return stages[stage] || capitalize(stage);
}

/**
 * Format priority tier for display
 */
export function formatPriorityTier(tier: string): {
  label: string;
  color: string;
  description: string;
} {
  const tiers: Record<string, { label: string; color: string; description: string }> = {
    P1: { label: "P1 - Hot", color: "#ef4444", description: "Immediate action required" },
    P2: { label: "P2 - Warm", color: "#f97316", description: "Follow up within 24 hours" },
    P3: { label: "P3 - Nurture", color: "#eab308", description: "Add to nurture sequence" },
    P4: { label: "P4 - Cold", color: "#6b7280", description: "Monitor for engagement" },
  };
  return tiers[tier] || { label: tier, color: "#6b7280", description: "Unknown tier" };
}

/**
 * Format duration in seconds to readable string
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return secs > 0 ? `${minutes}m ${secs}s` : `${minutes}m`;
  } else {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }
}
