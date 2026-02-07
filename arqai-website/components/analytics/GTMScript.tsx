"use client";

import Script from "next/script";

const GTM_ID = "GTM-PR74FLRQ";

/**
 * GTMScript - Proper Google Tag Manager implementation with Consent Mode v2
 *
 * This component implements GTM with the correct initialization order:
 * 1. Initialize dataLayer array
 * 2. Define gtag function
 * 3. Set default consent state (denied for privacy)
 * 4. Set ads_data_redaction and url_passthrough for enhanced privacy
 * 5. Push gtm.start event (BEFORE script loads - required by GTM)
 * 6. Load GTM script via Next.js Script component
 *
 * The consent handler component (GoogleTagManager.tsx) updates consent
 * when users accept cookies.
 */
export function GTMScript() {
  return (
    <>
      {/* Step 1-5: Initialize dataLayer, gtag, consent, and gtm.start event */}
      <Script
        id="gtm-init"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;

// Consent Mode v2 - default denied for GDPR compliance
gtag('consent', 'default', {
  'analytics_storage': 'denied',
  'ad_storage': 'denied',
  'ad_user_data': 'denied',
  'ad_personalization': 'denied',
  'wait_for_update': 500
});

// Enhanced privacy settings
gtag('set', 'ads_data_redaction', true);
gtag('set', 'url_passthrough', true);

// GTM start event - MUST be pushed before gtm.js loads
dataLayer.push({'gtm.start': new Date().getTime(), event: 'gtm.js'});
`.trim(),
        }}
      />

      {/* Step 6: Load GTM script */}
      <Script
        id="gtm-script"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`}
      />
    </>
  );
}

/**
 * GTMNoScript - Fallback iframe for users with JavaScript disabled
 * Should be placed immediately after the opening <body> tag
 */
export function GTMNoScript() {
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: 'none', visibility: 'hidden' }}
        title="Google Tag Manager"
      />
    </noscript>
  );
}
