"use client";

/**
 * Client-Side Analytics Tracker
 *
 * Lightweight component that tracks:
 * - Page views
 * - Scroll depth
 * - Time on page
 *
 * Sends data to /api/analytics/track
 */

import { useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import { captureFirstTouch, recordPageVisit } from "@/lib/attribution/visitor-context";

// ============================================
// CONFIGURATION
// ============================================

const TRACKING_CONFIG = {
  // Scroll depth thresholds to track (percentages)
  scrollThresholds: [25, 50, 75, 100],

  // Time on page update interval (seconds)
  timeInterval: 30,

  // Debounce delay for scroll tracking (ms)
  scrollDebounce: 500,

  // Session storage key
  sessionKey: "arq_session_id",
};

// ============================================
// HELPERS
// ============================================

/**
 * Generate a unique session ID
 */
function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Get or create session ID
 */
function getSessionId(): string {
  if (typeof window === "undefined") return "";

  let sessionId = sessionStorage.getItem(TRACKING_CONFIG.sessionKey);
  if (!sessionId) {
    sessionId = generateSessionId();
    sessionStorage.setItem(TRACKING_CONFIG.sessionKey, sessionId);
  }
  return sessionId;
}

/**
 * Send tracking event to API
 */
async function sendTrackingEvent(event: {
  event_type: string;
  session_id: string;
  page_path: string;
  [key: string]: unknown;
}): Promise<void> {
  try {
    await fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
      keepalive: true, // Ensure request completes even on page unload
    });
  } catch {
    // Silently fail - analytics should not break the site
  }
}

/**
 * Calculate scroll depth percentage
 */
function getScrollDepth(): number {
  if (typeof window === "undefined") return 0;

  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight;
  const clientHeight = document.documentElement.clientHeight;

  if (scrollHeight <= clientHeight) return 100;

  const scrolled = (scrollTop / (scrollHeight - clientHeight)) * 100;
  return Math.min(Math.round(scrolled), 100);
}

// ============================================
// COMPONENT
// ============================================

interface TrackerProps {
  enabled?: boolean;
}

/**
 * Paths that must never be tracked: the team's own admin browsing would
 * pollute visitor counts, top pages, durations, and bounce rates.
 */
function isExcludedPath(pathname: string): boolean {
  return pathname.startsWith("/admin");
}

export function Tracker({ enabled: enabledProp = true }: TrackerProps) {
  const pathname = usePathname();
  const enabled = enabledProp && !isExcludedPath(pathname || "");
  const sessionId = useRef<string>("");
  const startTime = useRef<number>(0);
  const maxScrollDepth = useRef<number>(0);
  const trackedThresholds = useRef<Set<number>>(new Set());
  const lastTimeUpdate = useRef<number>(0);

  // Initialize session ID
  useEffect(() => {
    sessionId.current = getSessionId();
  }, []);

  // Track page view on route change
  useEffect(() => {
    if (!enabled || !sessionId.current) return;

    // Record first-touch attribution + journey trail (read by lead forms)
    captureFirstTouch();
    recordPageVisit(pathname);

    // Reset tracking state for new page
    startTime.current = Date.now();
    maxScrollDepth.current = 0;
    trackedThresholds.current.clear();
    lastTimeUpdate.current = 0;

    // Send page view event
    sendTrackingEvent({
      event_type: "page_view",
      session_id: sessionId.current,
      page_path: pathname,
      page_title: document.title,
      referrer: document.referrer || undefined,
      url: window.location.href,
    });
  }, [pathname, enabled]);

  // Scroll tracking
  const handleScroll = useCallback(() => {
    if (!enabled || !sessionId.current) return;

    const depth = getScrollDepth();
    if (depth <= maxScrollDepth.current) return;

    maxScrollDepth.current = depth;

    // Check if we crossed any thresholds
    for (const threshold of TRACKING_CONFIG.scrollThresholds) {
      if (depth >= threshold && !trackedThresholds.current.has(threshold)) {
        trackedThresholds.current.add(threshold);

        sendTrackingEvent({
          event_type: "scroll_depth",
          session_id: sessionId.current,
          page_path: pathname,
          scroll_depth_percent: threshold,
        });
      }
    }
  }, [pathname, enabled]);

  // Time on page tracking
  const sendTimeOnPage = useCallback(() => {
    if (!enabled || !sessionId.current || startTime.current === 0) return;

    const timeOnPage = Math.floor((Date.now() - startTime.current) / 1000);

    // Only send if significant time has passed since last update
    if (timeOnPage - lastTimeUpdate.current >= TRACKING_CONFIG.timeInterval) {
      lastTimeUpdate.current = timeOnPage;

      sendTrackingEvent({
        event_type: "time_on_page",
        session_id: sessionId.current,
        page_path: pathname,
        time_on_page_seconds: timeOnPage,
      });
    }
  }, [pathname, enabled]);

  // Set up scroll listener with debounce
  useEffect(() => {
    if (!enabled) return;

    let scrollTimeout: NodeJS.Timeout;

    const debouncedScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(handleScroll, TRACKING_CONFIG.scrollDebounce);
    };

    window.addEventListener("scroll", debouncedScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", debouncedScroll);
      clearTimeout(scrollTimeout);
    };
  }, [handleScroll, enabled]);

  // Set up time tracking interval
  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(
      sendTimeOnPage,
      TRACKING_CONFIG.timeInterval * 1000
    );

    return () => clearInterval(interval);
  }, [sendTimeOnPage, enabled]);

  // Send final time on page when leaving
  useEffect(() => {
    if (!enabled) return;

    const handleBeforeUnload = () => {
      if (sessionId.current && startTime.current > 0) {
        const timeOnPage = Math.floor((Date.now() - startTime.current) / 1000);

        // Use sendBeacon for reliable delivery on page unload
        if (navigator.sendBeacon) {
          navigator.sendBeacon(
            "/api/analytics/track",
            JSON.stringify({
              event_type: "time_on_page",
              session_id: sessionId.current,
              page_path: pathname,
              time_on_page_seconds: timeOnPage,
            })
          );
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [pathname, enabled]);

  // This component renders nothing
  return null;
}

export default Tracker;
