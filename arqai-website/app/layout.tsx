import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { ContentMorpher } from "@/components/morph/ContentMorpher";
import { MorphProvider } from "@/contexts/MorphContext";
import { LocaleProvider } from "@/contexts/LocaleContext";
import { CookieConsent } from "@/components/compliance/CookieConsent";

export const metadata: Metadata = {
  title: {
    default: "ArqAI - The Command Platform for Enterprise AI",
    template: "%s | ArqAI",
  },
  description:
    "Move from high-risk AI chaos to a secure, compliant, and fully governed AI workforce. ArqAI is the industry's first integrated command platform for enterprise AI governance.",
  keywords: [
    "enterprise AI",
    "AI governance",
    "AI compliance",
    "AI security",
    "AI orchestration",
    "trusted AI",
    "AI audit",
    "AI platform",
    "HIPAA AI",
    "GDPR AI",
    "SOC 2 AI",
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
    title: "ArqAI - The Command Platform for Enterprise AI",
    description:
      "Move from high-risk AI chaos to a secure, compliant, and fully governed AI workforce.",
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
    title: "ArqAI - The Command Platform for Enterprise AI",
    description:
      "Move from high-risk AI chaos to a secure, compliant, and fully governed AI workforce.",
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
  themeColor: "#0052CC",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Funnel+Display:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased" suppressHydrationWarning>
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
