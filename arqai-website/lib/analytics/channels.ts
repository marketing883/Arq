/**
 * Marketing channel classification.
 *
 * Turns raw referrer + UTM data into the channels a marketing team actually
 * budgets against. UTM parameters win when present (explicit campaign
 * tagging); otherwise the referrer hostname decides. Includes a dedicated
 * "AI Assistants" channel (ChatGPT, Perplexity, Claude, Gemini, Copilot),
 * an increasingly real acquisition source that classic tools bury under
 * referrals.
 */

export type Channel =
  | "Campaign"
  | "Organic Search"
  | "Social"
  | "AI Assistants"
  | "Referral"
  | "Direct";

export interface ClassifiedSource {
  channel: Channel;
  /** Human label for the specific source, e.g. "google", "linkedin", "chatgpt". */
  source: string;
}

const SEARCH_HOSTS: Array<[RegExp, string]> = [
  [/(^|\.)google\./, "google"],
  [/(^|\.)bing\.com$/, "bing"],
  [/(^|\.)duckduckgo\.com$/, "duckduckgo"],
  [/(^|\.)search\.yahoo\.com$/, "yahoo"],
  [/(^|\.)baidu\.com$/, "baidu"],
  [/(^|\.)yandex\./, "yandex"],
  [/(^|\.)ecosia\.org$/, "ecosia"],
  [/(^|\.)search\.brave\.com$/, "brave"],
];

const SOCIAL_HOSTS: Array<[RegExp, string]> = [
  [/(^|\.)linkedin\.com$/, "linkedin"],
  [/(^|\.)lnkd\.in$/, "linkedin"],
  [/(^|\.)twitter\.com$/, "x"],
  [/(^|\.)x\.com$/, "x"],
  [/(^|\.)t\.co$/, "x"],
  [/(^|\.)facebook\.com$/, "facebook"],
  [/(^|\.)fb\.me$/, "facebook"],
  [/(^|\.)instagram\.com$/, "instagram"],
  [/(^|\.)youtube\.com$/, "youtube"],
  [/(^|\.)youtu\.be$/, "youtube"],
  [/(^|\.)reddit\.com$/, "reddit"],
  [/(^|\.)news\.ycombinator\.com$/, "hacker news"],
  [/(^|\.)medium\.com$/, "medium"],
  [/(^|\.)threads\.net$/, "threads"],
  [/(^|\.)whatsapp\.com$/, "whatsapp"],
];

const AI_HOSTS: Array<[RegExp, string]> = [
  [/(^|\.)chat\.openai\.com$/, "chatgpt"],
  [/(^|\.)chatgpt\.com$/, "chatgpt"],
  [/(^|\.)perplexity\.ai$/, "perplexity"],
  [/(^|\.)claude\.ai$/, "claude"],
  [/(^|\.)gemini\.google\.com$/, "gemini"],
  [/(^|\.)copilot\.microsoft\.com$/, "copilot"],
  [/(^|\.)you\.com$/, "you.com"],
  [/(^|\.)phind\.com$/, "phind"],
];

function hostnameOf(referrer: string): string | null {
  try {
    const url = new URL(referrer);
    return url.hostname.toLowerCase();
  } catch {
    return null;
  }
}

function matchHost(
  host: string,
  table: Array<[RegExp, string]>
): string | null {
  for (const [pattern, label] of table) {
    if (pattern.test(host)) return label;
  }
  return null;
}

export function classifySource(input: {
  referrer?: string | null;
  utm_source?: string | null;
  utm_medium?: string | null;
  /** The site's own hostname, to treat self-referrals as Direct. */
  siteHost?: string;
}): ClassifiedSource {
  const { referrer, utm_source, utm_medium } = input;
  const siteHost = (input.siteHost || "thearq.ai").toLowerCase();

  // Explicit campaign tagging always wins.
  if (utm_source) {
    return {
      channel: "Campaign",
      source: `${utm_source}${utm_medium ? ` / ${utm_medium}` : ""}`.toLowerCase(),
    };
  }

  const host = referrer ? hostnameOf(referrer) : null;
  if (!host) return { channel: "Direct", source: "direct" };

  // Self-referrals are internal navigation, not acquisition.
  if (host === siteHost || host.endsWith(`.${siteHost}`) || host === "localhost") {
    return { channel: "Direct", source: "direct" };
  }

  const ai = matchHost(host, AI_HOSTS);
  if (ai) return { channel: "AI Assistants", source: ai };

  const search = matchHost(host, SEARCH_HOSTS);
  if (search) return { channel: "Organic Search", source: search };

  const social = matchHost(host, SOCIAL_HOSTS);
  if (social) return { channel: "Social", source: social };

  return { channel: "Referral", source: host.replace(/^www\./, "") };
}

/** Fixed display order for channel tables. */
export const CHANNEL_ORDER: Channel[] = [
  "Organic Search",
  "Campaign",
  "Social",
  "AI Assistants",
  "Referral",
  "Direct",
];
