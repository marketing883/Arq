/**
 * Visitor context: first-party journey and attribution capture.
 *
 * Records, in sessionStorage, what the visitor did before reaching a form:
 * the pages they visited (journey trail), where they entered (landing page),
 * what brought them here (referrer + UTM params). Forms attach this as an
 * `attribution` payload on submission so a lead can be tied back to the
 * campaign and the on-site journey that produced it.
 *
 * Shares the session id key with components/analytics/Tracker.tsx so form
 * submissions can be joined against the page_views analytics table.
 */

const SESSION_KEY = "arq_session_id"; // must match Tracker.tsx
const JOURNEY_KEY = "arq_journey";
const FIRST_TOUCH_KEY = "arq_first_touch";
const MAX_JOURNEY_STEPS = 15;

export type JourneyStep = {
  /** Page path, e.g. "/accelerators/arqfwa" */
  p: string;
  /** Arrival timestamp (ms epoch) */
  t: number;
};

export type FirstTouch = {
  landingPage: string;
  referrer: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmTerm: string;
  utmContent: string;
  startedAt: number;
};

export type AttributionPayload = {
  sessionId: string;
  /** Page the visitor was on before opening the form page. */
  sourcePage: string;
  landingPage: string;
  referrer: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmTerm: string;
  utmContent: string;
  /** Visit start (first touch), ms epoch. */
  visitStartedAt: number;
  journey: JourneyStep[];
};

function safeRead<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function safeWrite(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or blocked; attribution is best-effort.
  }
}

/**
 * Capture landing page, referrer, and UTM params once per session.
 * Called by the Tracker on the first page view.
 */
export function captureFirstTouch() {
  if (typeof window === "undefined") return;
  if (safeRead<FirstTouch>(FIRST_TOUCH_KEY)) return;

  const params = new URLSearchParams(window.location.search);
  safeWrite(FIRST_TOUCH_KEY, {
    landingPage: window.location.pathname,
    referrer: document.referrer || "",
    utmSource: params.get("utm_source") || "",
    utmMedium: params.get("utm_medium") || "",
    utmCampaign: params.get("utm_campaign") || "",
    utmTerm: params.get("utm_term") || "",
    utmContent: params.get("utm_content") || "",
    startedAt: Date.now(),
  } satisfies FirstTouch);
}

/**
 * Append a page to the journey trail. Consecutive duplicates are collapsed;
 * the trail is capped at MAX_JOURNEY_STEPS (oldest dropped first, but the
 * landing page (step 0) is always kept).
 */
export function recordPageVisit(path: string) {
  if (typeof window === "undefined" || !path) return;

  const journey = safeRead<JourneyStep[]>(JOURNEY_KEY) ?? [];
  if (journey.length > 0 && journey[journey.length - 1].p === path) return;

  journey.push({ p: path, t: Date.now() });
  if (journey.length > MAX_JOURNEY_STEPS) {
    // Keep the landing page + the most recent steps.
    journey.splice(1, journey.length - MAX_JOURNEY_STEPS);
  }
  safeWrite(JOURNEY_KEY, journey);
}

/** The last page visited before `currentPath` (or "" if unknown). */
export function getPreviousPage(currentPath: string): string {
  const journey = safeRead<JourneyStep[]>(JOURNEY_KEY) ?? [];
  for (let i = journey.length - 1; i >= 0; i--) {
    if (journey[i].p !== currentPath) return journey[i].p;
  }
  return "";
}

/**
 * Assemble the attribution payload a form sends with its submission.
 * Everything is best-effort: missing pieces come through as empty strings.
 */
export function getAttribution(currentPath?: string): AttributionPayload {
  const first = safeRead<FirstTouch>(FIRST_TOUCH_KEY);
  const journey = safeRead<JourneyStep[]>(JOURNEY_KEY) ?? [];
  const path =
    currentPath ??
    (typeof window !== "undefined" ? window.location.pathname : "");

  let sessionId = "";
  if (typeof window !== "undefined") {
    try {
      sessionId = sessionStorage.getItem(SESSION_KEY) || "";
    } catch {
      // ignore
    }
  }

  return {
    sessionId,
    sourcePage: getPreviousPage(path),
    landingPage: first?.landingPage || "",
    referrer:
      first?.referrer ||
      (typeof document !== "undefined" ? document.referrer : "") ||
      "",
    utmSource: first?.utmSource || "",
    utmMedium: first?.utmMedium || "",
    utmCampaign: first?.utmCampaign || "",
    utmTerm: first?.utmTerm || "",
    utmContent: first?.utmContent || "",
    visitStartedAt: first?.startedAt || 0,
    journey,
  };
}
