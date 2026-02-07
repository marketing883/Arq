"use client";

import Script from "next/script";
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

  return (
    <>
      {/* Google Tag Manager - always load, consent mode controls tracking */}
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
