"use client";

import { useEffect } from "react";

const GTM_ID = "GTM-PR74FLRQ";

// Declare gtag on window for TypeScript
declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
    gtag: (...args: unknown[]) => void;
  }
}

export function GoogleTagManager() {
  useEffect(() => {
    // Update Google Consent Mode when consent changes
    const updateConsent = () => {
      const savedConsent = localStorage.getItem("arqai_cookie_consent");
      let analyticsConsent = false;
      let marketingConsent = false;

      if (savedConsent) {
        try {
          const { categories } = JSON.parse(savedConsent);
          analyticsConsent = categories?.analytics ?? false;
          marketingConsent = categories?.marketing ?? false;
        } catch {
          // Invalid consent data - keep defaults
        }
      }

      // Update Google Consent Mode
      if (typeof window.gtag === "function") {
        window.gtag("consent", "update", {
          analytics_storage: analyticsConsent ? "granted" : "denied",
          ad_storage: marketingConsent ? "granted" : "denied",
          ad_user_data: marketingConsent ? "granted" : "denied",
          ad_personalization: marketingConsent ? "granted" : "denied",
        });
      }
    };

    // Listen for consent changes (initial consent is handled in layout head)
    const handleConsentUpdate = () => updateConsent();
    window.addEventListener("arqai_consent_updated", handleConsentUpdate);

    return () => {
      window.removeEventListener("arqai_consent_updated", handleConsentUpdate);
    };
  }, []);

  // GTM script and noscript are loaded in layout.tsx
  // This component only handles consent updates
  return null;
}
