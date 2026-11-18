// The site's public origin, used for canonical URLs, sitemaps, structured
// data, social previews, and links in emails. Set NEXT_PUBLIC_SITE_URL to
// move domains; it is read at build time, so rebuild after changing it.
//
// thearq.ai is the primary domain. A move to arqailabs.com in November 2026
// was reversed; arqailabs.com now 301-redirects to thearq.ai. Email
// addresses (engage@, privacy@, ...) are not derived from this.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://thearq.ai").replace(/\/+$/, "");

/** Hostname of SITE_URL, e.g. "thearq.ai". */
export const SITE_HOST = new URL(SITE_URL).hostname;
