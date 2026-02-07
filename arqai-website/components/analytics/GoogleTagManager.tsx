"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

const GTM_ID = "GTM-PR74FLRQ";

export function GoogleTagManager() {
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

  // Don't load GTM if consent not given
  if (!consentGiven) {
    return null;
  }

  return (
    <>
      {/* Google Tag Manager - Script */}
      <Script id="google-tag-manager" strategy="afterInteractive">
        {`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${GTM_ID}');
        `}
      </Script>
      {/* Google Tag Manager - noscript fallback */}
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        />
      </noscript>
    </>
  );
}
