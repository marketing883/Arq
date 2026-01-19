"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

const GA_MEASUREMENT_ID = "G-GJ2E4L3NMD";

export function GoogleAnalytics() {
  const [consentGiven, setConsentGiven] = useState(false);

  useEffect(() => {
    // Check if analytics consent was given
    const checkConsent = () => {
      const savedConsent = localStorage.getItem("arqai_cookie_consent");
      if (savedConsent) {
        try {
          const { categories } = JSON.parse(savedConsent);
          if (categories?.analytics) {
            setConsentGiven(true);
          }
        } catch {
          // Invalid consent data
        }
      }
    };

    // Check immediately
    checkConsent();

    // Also listen for consent changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "arqai_cookie_consent") {
        checkConsent();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Custom event for same-tab consent updates
    const handleConsentUpdate = () => checkConsent();
    window.addEventListener("arqai_consent_updated", handleConsentUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("arqai_consent_updated", handleConsentUpdate);
    };
  }, []);

  // Don't load GA if consent not given
  if (!consentGiven) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  );
}
