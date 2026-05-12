import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { ContentMorpher } from "@/components/morph/ContentMorpher";
import { MorphProvider } from "@/contexts/MorphContext";
import { LocaleProvider } from "@/contexts/LocaleContext";
import { CookieConsent } from "@/components/compliance/CookieConsent";
import { Tracker } from "@/components/analytics/Tracker";
// Temporarily disabled for GTM debugging
// import { GoogleTagManager as GTMConsentHandler } from "@/components/analytics/GoogleTagManager";

const GTM_ID = "GTM-PR74FLRQ";

export const metadata: Metadata = {
  title: {
    default: "ArqAI Labs | AI agents for fraud, claims, and financial crime",
    template: "%s | ArqAI Labs",
  },
  description:
    "Detect more fraud. Resolve more claims. Stop more financial crime. Vertical AI agents built for healthcare payers, P&C carriers, and regional banks. Live in production today.",
  keywords: [
    "vertical AI agents",
    "AI for healthcare payers",
    "AI for insurance",
    "AI for banking",
    "fraud waste abuse detection",
    "claims triage AI",
    "AML KYC AI",
    "financial crime AI",
    "ArqFWA",
    "ArqClaims",
    "ArqBanker",
    "production AI agents",
    "ACI Infotech",
  ],
  authors: [{ name: "ArqAI Labs" }],
  creator: "ArqAI Labs",
  publisher: "ArqAI Labs",
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
    siteName: "ArqAI Labs",
    title: "ArqAI Labs | AI agents for fraud, claims, and financial crime",
    description:
      "Vertical AI agents for healthcare payers, P&C carriers, and regional banks. Live in production today.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ArqAI Labs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ArqAI Labs | AI agents for fraud, claims, and financial crime",
    description:
      "Vertical AI agents for healthcare payers, P&C carriers, and regional banks. Live in production today.",
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
  themeColor: "#08080B",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Tag Manager - initialize dataLayer and load GTM */}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];window.dataLayer.push({'gtm.start':new Date().getTime(),event:'gtm.js'});`,
          }}
        />
        <script
          async
          src={`https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`}
        />
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
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
          }}
        />
        <LocaleProvider>
          <MorphProvider>
            {children}
            <ContentMorpher />
            <ChatWidget />
            <CookieConsent />
            <Tracker />
          </MorphProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
