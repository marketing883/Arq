# ArqAI Labs: move to arqailabs.com

Summary of the CEO brief "ArqAI Labs: Move to arqailabs.com" (Jag Kanumuri,
November 8, 2026), kept here so the decision and its checklist travel with
the code. Status notes were added on November 12-13, 2026, against the live
sites; update them as items close.

## Decision

- Website and email move from thearq.ai to **arqailabs.com**.
- thearq.ai stays registered and **permanently 301-redirects** to the new domain. Never let it lapse.
- Inbound sales and marketing email moves to **hello@arqailabs.com**, replacing salesteam@aciinfotech.com on all ArqAI Labs materials.
- salesteam@aciinfotech.com forwards to hello@arqailabs.com for at least 12 months.

Why: the domain matches the brand exactly; @arqailabs.com email says which company is writing; it separates ArqAI Labs from look-alikes (arqai.com is an unrelated Florida smart-home company, ArqAi LLC; also ARCQ AI, Orq.ai); .com fits all-industry positioning; the site is young, so moving now costs least.

## New email addresses

| Address | Use | Where it appears |
|---|---|---|
| hello@arqailabs.com | All inbound sales and general questions | Website, brochure, deck closing slide, LinkedIn, directories |
| firstname@arqailabs.com | Follow-up after a meeting | Proposals, follow-up decks, signatures |
| partners@arqailabs.com | Technology and channel partners | Partners page |
| careers@arqailabs.com | Job applications | Careers page, job posts |

Route every inbound address into the CRM with its source tagged. **Set up SPF, DKIM and DMARC before sending any email from arqailabs.com.**

> **Website status:** the site still shows @thearq.ai addresses (engage@, hello@, privacy@, legal@, no-reply@) on purpose. As of Nov 12, arqailabs.com has **no MX and no SPF record** (only a default DMARC), so new addresses would bounce. Switch the site's addresses only after MX, SPF and DKIM resolve.

## Migration checklist

| # | Task | Status (Nov 12) |
|---|---|---|
| 1 | Confirm ownership and auto-renewal of arqailabs.com and thearq.ai | Open (registrar) |
| 2 | Email on arqailabs.com (four addresses) with SPF, DKIM, DMARC | **Open:** no MX/SPF yet |
| 3 | Crawl and export every live thearq.ai URL | Done: 81 URLs in the sitemap |
| 4 | One-to-one redirect map (not everything to the home page) | Done: nginx 301 keeps each path (`thearq.ai/x` → `arqailabs.com/x`) |
| 5 | Retire legacy pages (about-us.html, /demo, /solutions/*) | Done in code: about-us.html → /about, /demo → /engage-us, /solutions/* → /industries or /accelerators |
| 6 | Same URL paths on arqailabs.com | Done: same app, same paths |
| 7 | Verify arqailabs.com in Search Console and Bing | Google: done Nov 13 (Domain property, DNS TXT at GoDaddy; keep the record). Bing: open |
| 8 | Canonicals, schema, sitemap, internal links on new domain | Done, live Nov 12 (`lib/site.ts`, NEXT_PUBLIC_SITE_URL) |
| 9 | 301 redirects from every thearq.ai URL | Live since early November (nginx); `/__deploy` and `/.well-known/` exempt |
| 10 | Change of Address in Search Console | Done Nov 13 (in progress at Google; do not cancel) |
| 11 | Submit new sitemap to Search Console and Bing | Google: done Nov 13 (81 pages, Success). Bing: open |
| 12 | Spot-check 20+ old URLs | Done Nov 13: all 81 sitemap URLs 301 one-to-one; http://arqailabs.com now 301s to https (nginx `20-force-https-arqailabs.conf`) |
| 13 | Analytics and tag manager on the new domain | Open |
| 14 | Weekly Search Console check, weeks 1–8 | Open |
| 15 | Ask top linking sites to update links | Open |
| 16 | Expect a short traffic dip; flag if not recovered in 8 weeks | Open |
| 17 | Keep thearq.ai registered and redirecting | Ongoing |

## Everything that needs updating

| Asset | Change | Owner (per brief) |
|---|---|---|
| Website, all pages | New domain; hello@arqailabs.com in contact sections and footer | Web (email part waits on task 2) |
| Structured data | url, email and sameAs on Organization | Web |
| Brochure (v6) | New URL, email and QR code | |
| Pitch deck, sales decks, one-pagers | Contact slide and footer details | |
| Email signatures | New domain | |
| LinkedIn company page | Website field; consider renaming the URL thearq-ai → arqai-labs | Vinay |
| X / social profiles | Website field and bio | Neha |
| aciinfotech.com | Links to ArqAI Labs point to arqailabs.com | Ali |
| Directories (Crunchbase, Clutch, G2, partners, Google Business Profile) | New URL and email | Neha |
| Press boilerplate | New URL in "About ArqAI Labs" | |
| Ads, UTM links, CRM forms | Landing URLs and notification addresses | Nitesh |
| llms.txt and robots.txt | Publish on the new domain | Neha (done in code) |

## Naming rules

- Company: **ArqAI Labs**, always ArqAI as one word. Never "ARQ AI" or "Arq AI".
- Products keep the Arq prefix: ArqFWA, ArqBanker, ArqForecast, and so on.
- Positioning: production AI for enterprises in **every industry**. Remove "for regulated enterprises" from titles, footers and the brochure. *(Website: 3 occurrences remain, to do.)*
- Always "ACI Infotech" in full, using the one approved sentence. On this site that sentence is: **"ArqAI Labs is an independent AI engineering studio, in strategic partnership with ACI Infotech."**

## Risks

| Risk | Mitigation |
|---|---|
| Rankings drop and don't recover | One-to-one 301s, Search Console Change of Address, keep the old domain live |
| Email lands in spam | SPF, DKIM, DMARC before the first send; warm the domain up gradually |
| Leads sent to the old address are lost | Forward salesteam@aciinfotech.com for 12+ months |
| Printed brochures point to the old site | Old QR code keeps working through the redirect; reprint on the next run |
