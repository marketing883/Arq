import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

const DEFAULT_IMAGE = { url: "/og-image.png", width: 1200, height: 630, alt: "ArqAI Labs" };

/**
 * Metadata for a static page: title, description, canonical, and the page's
 * own Open Graph and Twitter card.
 *
 * Next.js does not deep-merge `openGraph` or `twitter`: a page that leaves them
 * out inherits the root layout's, so its social preview links to the home page
 * with the home page's title. Building them here keeps og:url equal to the
 * canonical on every page.
 */
export function pageMetadata({
  path,
  title,
  description,
}: {
  /** Path with a leading slash, e.g. "/about". */
  path: string;
  title: string;
  description: string;
}): Metadata {
  const url = `${SITE_URL}${path}`;
  const socialTitle = `${title} | ArqAI Labs`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: "ArqAI Labs",
      url,
      title: socialTitle,
      description,
      images: [DEFAULT_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      site: "@The_ArqAI",
      creator: "@The_ArqAI",
      title: socialTitle,
      description,
      images: [DEFAULT_IMAGE.url],
    },
  };
}
