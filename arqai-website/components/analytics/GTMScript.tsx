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
 * 6. Dynamically load GTM script
 *
 * The consent handler component (GoogleTagManager.tsx) updates consent
 * when users accept cookies.
 */
export function GTMScript() {
  return (
    <>
      {/*
        Complete GTM initialization with Consent Mode v2
        Following Google's recommended implementation order:
        1. Initialize dataLayer
        2. Define gtag function
        3. Set default consent state
        4. Push gtm.start event
        5. Load GTM script
      */}
      <Script
        id="gtm-init"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
(function(w,d,s,l,i){
  // Initialize dataLayer
  w[l]=w[l]||[];

  // Define gtag function
  function gtag(){w[l].push(arguments);}
  w.gtag = gtag;

  // Set default consent state (Consent Mode v2)
  // All consent denied by default for GDPR/privacy compliance
  gtag('consent', 'default', {
    'analytics_storage': 'denied',
    'ad_storage': 'denied',
    'ad_user_data': 'denied',
    'ad_personalization': 'denied',
    'wait_for_update': 500
  });

  // Set ads_data_redaction for enhanced privacy when consent is denied
  gtag('set', 'ads_data_redaction', true);

  // Enable URL passthrough for measurement without cookies
  gtag('set', 'url_passthrough', true);

  // Push GTM start event (must be before script loads)
  w[l].push({'gtm.start': new Date().getTime(), event: 'gtm.js'});

  // Load GTM script
  var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),
      dl=l!='dataLayer'?'&l='+l:'';
  j.async=true;
  j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
  f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');
`.trim(),
        }}
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
