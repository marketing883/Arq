"use client";

import { useEffect } from "react";

// ZoomInfo website tag (WebSights): identifies the companies visiting the
// site for sales follow-up. ZoomInfo ships it as an obfuscated snippet; this
// is the same thing written plainly - it sets window.ZIProjectKey and loads
// zi-tag.js - so a reviewer can see exactly what runs.
//
// It only loads on the production site, and only once the visitor has
// granted Marketing consent in the cookie banner, the same signal the GTM
// consent handler reads. Granting consent mid-visit loads it straight away.
const ZI_PROJECT_KEY = "7289014fe11683234019";
const ZI_TAG_SRC = "https://js.zi-scripts.com/zi-tag.js";
const PRODUCTION_HOSTS = ["thearq.ai", "www.thearq.ai"];

function hasMarketingConsent() {
  try {
    const saved = localStorage.getItem("arqai_cookie_consent");
    return !!(saved && JSON.parse(saved)?.categories?.marketing);
  } catch {
    return false;
  }
}

function loadTag() {
  if (document.querySelector(`script[src="${ZI_TAG_SRC}"]`)) return;
  (window as unknown as { ZIProjectKey?: string }).ZIProjectKey = ZI_PROJECT_KEY;
  const script = document.createElement("script");
  script.src = ZI_TAG_SRC;
  script.async = true;
  document.body.appendChild(script);
}

export function ZoomInfoTag() {
  useEffect(() => {
    if (!PRODUCTION_HOSTS.includes(window.location.hostname)) return;

    const maybeLoad = () => {
      if (hasMarketingConsent()) loadTag();
    };
    maybeLoad();
    window.addEventListener("arqai_consent_updated", maybeLoad);
    return () => window.removeEventListener("arqai_consent_updated", maybeLoad);
  }, []);

  return null;
}
