/**
 * Server-side attribution helpers for the contact API route:
 * sanitize the client-supplied attribution payload (it's untrusted input)
 * and format the journey trail for humans and the AI lead analysis.
 */

type RawJourneyStep = { p?: unknown; t?: unknown };

export type CleanAttribution = {
  sessionId: string;
  sourcePage: string;
  /** Friendly label of what the source page was about (e.g. "ArqFWA"). */
  sourceContext: string;
  landingPage: string;
  referrer: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmTerm: string;
  utmContent: string;
  visitStartedAt: number;
  journey: { p: string; t: number }[];
};

const MAX_STR = 300;
const MAX_JOURNEY = 15;

function cleanString(value: unknown, max = MAX_STR): string {
  if (typeof value !== "string") return "";
  return value.slice(0, max).trim();
}

/** Validate and clamp the attribution payload sent by the browser. */
export function sanitizeAttribution(raw: unknown): CleanAttribution | null {
  if (!raw || typeof raw !== "object") return null;
  const a = raw as Record<string, unknown>;

  const journey = Array.isArray(a.journey)
    ? (a.journey as RawJourneyStep[])
        .slice(0, MAX_JOURNEY)
        .map((step) => ({
          p: cleanString(step?.p, 200),
          t: typeof step?.t === "number" && Number.isFinite(step.t) ? step.t : 0,
        }))
        .filter((step) => step.p.startsWith("/"))
    : [];

  const clean: CleanAttribution = {
    sessionId: cleanString(a.sessionId, 80),
    sourcePage: cleanString(a.sourcePage, 200),
    sourceContext: cleanString(a.sourceContext, 120),
    landingPage: cleanString(a.landingPage, 200),
    referrer: cleanString(a.referrer, 500),
    utmSource: cleanString(a.utmSource, 120),
    utmMedium: cleanString(a.utmMedium, 120),
    utmCampaign: cleanString(a.utmCampaign, 120),
    utmTerm: cleanString(a.utmTerm, 120),
    utmContent: cleanString(a.utmContent, 120),
    visitStartedAt:
      typeof a.visitStartedAt === "number" && Number.isFinite(a.visitStartedAt)
        ? a.visitStartedAt
        : 0,
    journey,
  };

  const hasAnything =
    clean.sessionId ||
    clean.sourcePage ||
    clean.landingPage ||
    clean.referrer ||
    clean.utmSource ||
    clean.journey.length > 0;
  return hasAnything ? clean : null;
}

/**
 * Render the journey as a readable trail with dwell times, e.g.
 * "/ (12s) → /accelerators/arqfwa (1m 34s) → /contact".
 * The last step has no dwell (they submitted from there).
 */
export function formatJourney(journey: { p: string; t: number }[]): string {
  if (journey.length === 0) return "";
  return journey
    .map((step, i) => {
      const next = journey[i + 1];
      if (!next || !step.t || !next.t || next.t <= step.t) return step.p;
      const seconds = Math.round((next.t - step.t) / 1000);
      const dwell =
        seconds >= 60 ? `${Math.floor(seconds / 60)}m ${seconds % 60}s` : `${seconds}s`;
      return `${step.p} (${dwell})`;
    })
    .join(" → ");
}

/**
 * Human/AI-readable block describing where the lead came from, appended to
 * the enriched message that feeds the AI lead analysis and the team email.
 */
export function describeAttribution(attr: CleanAttribution): string {
  const totalSeconds =
    attr.visitStartedAt > 0
      ? Math.round((Date.now() - attr.visitStartedAt) / 1000)
      : 0;
  const campaign = [
    attr.utmSource && `source=${attr.utmSource}`,
    attr.utmMedium && `medium=${attr.utmMedium}`,
    attr.utmCampaign && `campaign=${attr.utmCampaign}`,
    attr.utmTerm && `term=${attr.utmTerm}`,
    attr.utmContent && `content=${attr.utmContent}`,
  ]
    .filter(Boolean)
    .join(", ");

  const lines = [
    attr.sourcePage &&
      `Came from page: ${attr.sourcePage}${attr.sourceContext ? ` (${attr.sourceContext})` : ""}`,
    attr.landingPage && `Landed on: ${attr.landingPage}`,
    attr.referrer && `External referrer: ${attr.referrer}`,
    campaign && `Campaign (UTM): ${campaign}`,
    attr.journey.length > 1 && `Journey: ${formatJourney(attr.journey)}`,
    totalSeconds > 0 &&
      `Time on site before submitting: ${
        totalSeconds >= 60
          ? `${Math.floor(totalSeconds / 60)}m ${totalSeconds % 60}s`
          : `${totalSeconds}s`
      }`,
  ].filter(Boolean) as string[];

  return lines.join("\n");
}
