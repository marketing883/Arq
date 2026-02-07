import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { ContentMorpher } from "@/components/morph/ContentMorpher";
import { MorphProvider } from "@/contexts/MorphContext";
import { LocaleProvider } from "@/contexts/LocaleContext";
import { CookieConsent } from "@/components/compliance/CookieConsent";
import { GoogleTagManager as GTMComponent } from "@/components/analytics/GoogleTagManager";

const GTM_ID = "GTM-PR74FLRQ";

export const metadata: Metadata = {
  title: {
    default: "ArqAI | The Enterprise Foundry for Trusted AI",
    template: "%s | ArqAI",
  },
  description:
    "Build, run, and govern your mission-critical AI workforce with confidence. ArqAI is the enterprise foundry that turns AI chaos into governed, ROI-driven intelligence.",
  keywords: [
    "enterprise AI",
    "AI governance",
    "AI compliance",
    "trusted AI",
    "AI orchestration",
    "AI workforce",
    "AI platform",
    "HIPAA AI",
    "GDPR AI",
    "SOC 2 AI",
    "AI security",
    "AI audit",
    "DevSecOps AI",
    "FinSecOps AI",
  ],
  authors: [{ name: "ArqAI" }],
  creator: "ArqAI",
  publisher: "ArqAI",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://thearq.ai",
    siteName: "ArqAI",
    title: "ArqAI | The Enterprise Foundry for Trusted AI",
    description:
      "Build, run, and govern your mission-critical AI workforce with confidence.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ArqAI - Intelligence, By Design",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ArqAI | The Enterprise Foundry for Trusted AI",
    description:
      "Build, run, and govern your mission-critical AI workforce with confidence.",
    images: ["/og-image.png"],
    creator: "@arqai",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  metadataBase: new URL("https://thearq.ai"),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#FAF7F6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Consent Mode Default - must be before GTM */}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('consent','default',{'analytics_storage':'denied','ad_storage':'denied','ad_user_data':'denied','ad_personalization':'denied','wait_for_update':500});`,
          }}
        />
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-PR74FLRQ');`,
          }}
        />
        {/* Preconnect to GTM for faster loading */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Funnel+Display:wght@300..800&family=Funnel+Sans:ital,wght@0,300..800;1,300..800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PR74FLRQ"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        <GTMComponent />
        <LocaleProvider>
          <MorphProvider>
            {children}
            <ContentMorpher />
            <ChatWidget />
            <CookieConsent />
          </MorphProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
