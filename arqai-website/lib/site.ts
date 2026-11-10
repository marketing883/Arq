// The site's public origin, used for canonical URLs, sitemaps, structured
// data, social previews, and links in emails. Set NEXT_PUBLIC_SITE_URL to
// move domains; it is read at build time, so rebuild after changing it.
//
// The site moved from thearq.ai to arqailabs.com in November 2026; thearq.ai
// now 301-redirects here. Email addresses (engage@, privacy@, ...) are NOT
// derived from this - they stay on @thearq.ai until arqailabs.com has mail.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://arqailabs.com").replace(/\/+$/, "");

/** Hostname of SITE_URL, e.g. "arqailabs.com". */
export const SITE_HOST = new URL(SITE_URL).hostname;
