# ArqAI Labs — Complete SEO / AEO / GEO Audit

**Date:** 2026-07-18
**Scope:** The live Next.js site (`arqai-website/`) — homepage (v5), all inner pages, the blog/content engine, technical SEO layer, and content quality from a "will this rank and attract organic traffic" point of view.
**Branch:** `claude/homepage-seo-aeo-geo-audit-i76cy6`

---

## 0. Homepage status

The v5 homepage **is already the main homepage on this branch**: `app/page.tsx` renders the full v5 experience (Hero "Operational AI. Built for Your Enterprise.", Features, Accelerators, Why Us, Process, Integration, Testimonials, FAQ, Blogs, Contact) — promoted in commit `db38d42`. `/v5` 301s to `/`. No change was needed.

---

## 1. Executive assessment

The real site is far stronger than the earlier external audit suggested (see §7 — that audit was run against the **stale static HTML files at the repo root**, which are not the live site). The Next.js site already has: unique metadata + canonicals on most core pages, a rich homepage JSON-LD `@graph` (Organization, WebSite, WebPage, ProfessionalService + OfferCatalog, accelerator ItemList, FAQPage), a visible homepage FAQ matching its schema, a dynamic hourly-revalidating sitemap, robots.txt with explicit AI-crawler rules, `llms.txt`, www→apex and legacy-URL 301s, and genuinely deep service/accelerator pages (~650–750 unique words each).

But it is not yet a site that can win organic or answer-engine traffic, for five structural reasons:

1. **The content that should earn traffic is invisible to crawlers.** Blog post bodies, the blog index, case-study lists, careers, and whitepaper pages are client-rendered (`"use client"` + `useEffect` fetch). Google will eventually render them; GPTBot, ClaudeBot, and PerplexityBot **do not execute JavaScript** and see empty pages. For a site targeting AEO/GEO this is disqualifying.
2. **~11 indexable money pages have no metadata at all** — all five industry pages, /contact, /demo, /engage-us, /case-studies, /use-cases, /partners, /careers share one generic root title and have no canonicals.
3. **There is almost no content.** One stub blog post seed. The content engine (admin editor with Claude-powered meta/FAQ/entity generation, DataForSEO keyword research) is 80% built, but its SEO fields are **write-only** — never read by any public page — and the warehouse is empty.
4. **Every social share is broken**: `/og-image.png` is referenced site-wide and does not exist.
5. **Trust/proof content is template debris**: homepage testimonials are fictional Framer-template clients with invented metrics — an E-E-A-T liability the moment a buyer (or an answer engine) checks.

**Grades:** Technical SEO **B−** · On-page/metadata **C+** · AEO **C−** · GEO **C** (llms.txt is good; content invisibility undermines it) · Content depth/proof **D+** (infrastructure A−, inventory F).

---

## 2. Critical findings (fix first)

### 2.1 `/og-image.png` does not exist — site-wide broken social/OG images
Referenced in `app/layout.tsx:56,68`, `app/page.tsx:47,53,130`. `public/` has no og-image and there is no `app/opengraph-image.*`. Every share on LinkedIn/X/Slack renders imageless. **Fix:** ship a real 1200×630 image (or `app/opengraph-image.png`).

### 2.2 Blog post bodies are client-fetched
`app/blog/[slug]/page.tsx` fetches the full post row server-side for `generateMetadata`, then throws it away and renders `<BlogPostClient />`, which re-fetches `/api/blog/${slug}` in `useEffect`. Non-JS crawlers (all LLM crawlers) get metadata + JSON-LD and **zero article body**. **Fix:** render the post HTML in the server component (the data is already in hand at line ~76).

### 2.3 Eleven indexable pages have no metadata/canonicals
`"use client"` at line 1 with no metadata export: `industries/{healthcare-payers,banking,insurance-carriers,manufacturing,retail}`, `contact`, `demo` (+`engage-us`), `case-studies`, `use-cases`, `partners`, `careers`, plus `/blog` and `/whitepapers/[slug]`. All inherit the identical root title/description; most are in the sitemap. The industry pages are the worst case: 550–650 words of genuinely good vertical content invisible under a duplicate generic title. **Fix:** split each into a server `page.tsx` (metadata + canonical) wrapping a client child.

### 2.4 `/demo` and `/engage-us` are byte-identical duplicates, both in the sitemap
`app/engage-us/page.tsx` is `export { default } from "@/app/demo/page";`. Neither has a canonical. CTAs are inconsistent (index pages → `/engage-us`, detail pages → `/demo`). **Fix:** pick `/engage-us` as canonical, 301 `/demo` → `/engage-us` (or canonicalize), drop one from `coreStaticPaths`, unify CTAs.

### 2.5 Fictional testimonials and unsourced claims on the homepage
`components/home-v5/content.ts:157-198` — "Zylo Ren", "NeoTech Architectures", "HelioWave", "Wong's Wings" are Framer-template placeholders with invented stats and stock avatars; "Trusted by 120+ Businesses" uses template avatars; hero metrics (98% satisfaction, 3X, 40%) are unsubstantiated. Seed data also contains a fictional case study ("Regional Health Network", "Dr. Sarah Chen"). **Fix:** replace with real (or clearly anonymized) proof, or cut the section until real proof exists. This is the single biggest credibility/E-E-A-T risk.

### 2.6 Doubled title suffix: "… | ArqAI Labs | ArqAI Labs"
Root template `"%s | ArqAI Labs"` (`app/layout.tsx:16`) + pages that hard-code the brand: `platform`, `services` (+`[slug]`), `accelerators` (+`[id]`), `industries`, `resources`, `privacy`, `terms`, `case-studies/[slug]`. **Fix:** drop the hard-coded suffixes; let the template append.

### 2.7 The admin SEO pipeline is write-only
`meta_title`, `meta_description`, `og_title`, `og_description`, `faq_schema` (built "for AEO"), `key_entities` ("for GEO"), `focus_keyword` are stored by the admin (`components/admin/seo/SEOFieldsPanel.tsx`, save routes) but **never read by any public page**. `generateMetadata` uses only `post.title`/`post.excerpt`. **Fix:** prefer `meta_title ?? title`, `meta_description ?? excerpt`; emit `FAQPage` JSON-LD from `faq_schema` on post pages. One-afternoon fix, highest ROI in the codebase.

### 2.8 Old homepages are indexable
- `/home-legacy`: no metadata, **no noindex**, and it renders `HomeStructuredData` claiming `pageUrl = https://thearq.ai` — a crawlable near-duplicate that asserts it *is* the homepage in its schema.
- `/v4`: indexable "preview" page, UA-sniffs mobile vs desktop on one URL.
**Fix:** `robots: { index: false }` on both (or delete them).

### 2.9 Google site-verification token lives only in the dead static site
The token (`XOs-V3gSvkOFaXMEK9fgLgQRdO2pzGsySaK10Ymi0a8`) exists only in the stale root `index.html`, not in the Next.js app. If Search Console relies on the meta-tag method, verification is broken. **Fix:** add `verification: { google: "…" }` to root metadata (harmless even if DNS-verified).

---

## 3. High-priority findings

| # | Finding | Evidence | Fix |
|---|---|---|---|
| 3.1 | Blog listing capped at **6 posts forever**; no pagination, no category/tag pages, no related posts, no RSS | `/api/blog/published/route.ts:28` `.limit(6)` | Server-render `/blog` with pagination; add category pages + RSS |
| 3.2 | **Drafts publicly reachable** by slug; `ilike` fallback lets multiple URLs resolve to one post (malformed canonicals possible) | `app/blog/[slug]/page.tsx:32-36`, `/api/blog/[slug]/route.ts` | Filter `status=published`; drop `ilike` fallback |
| 3.3 | FAQ schema without visible FAQs on `/platform` (content-parity violation); `SolutionsStructuredData` (industry FAQs) is **dead code, never imported**; no inner page has a visible FAQ | `components/seo/StructuredData.tsx:105-121, 129-154` | Render visible FAQs matching schema; wire up industries schema |
| 3.4 | `/about` is entity-thin: ~300 words, **no AboutPage/Organization schema**, no founders/timeline/location — weak GEO grounding, even though `generateOrganizationSchema()` (founding date, NJ address, sameAs) already exists unused at `lib/seo/structured-data.ts:27-64` | | Emit org schema on /about; add facts box, leadership, timeline |
| 3.5 | Broken icon refs: `/favicon-16x16.png`, `/apple-touch-icon.png` don't exist at root (`app/layout.tsx:74-75`); `site.webmanifest` carries old branding ("Enterprise AI Governance Platform", old blue `#0033A0`) | | Fix paths; update manifest |
| 3.6 | Case-study detail selects `featured_image` but the column is `hero_image` → OG image always empty on the best-templated page type | `supabase-content-schema.sql:37` | Align column name |
| 3.7 | Sitemap `lastModified` = `new Date()` for all static pages on every hourly revalidation — teaches Google to ignore lastmod | `app/sitemap.ts:23` | Use real/stable dates |
| 3.8 | Homepage internal-link bug: "See All Services" CTA → `/about` instead of `/services` | `components/home-v5/content.ts:42` | Point to `/services` |
| 3.9 | robots.ts AI-bot allow lists reference dead `/solutions` and omit `/blog`, `/case-studies` — signals the content library is *not* for AI crawlers, contradicting the GEO goal | `app/robots.ts:15-30` | Allow content paths (or simplify to allow all) |
| 3.10 | `llms.txt` never mentions blog, case studies, whitepapers, or resources | `public/llms.txt` | Add content-library section; consider llms-full.txt |
| 3.11 | Webinars lack Event/VideoObject schema; whitepaper detail pages are client-only with zero metadata | `app/webinars/[slug]`, `app/whitepapers/[slug]` | Add schema; server-wrap whitepapers |
| 3.12 | i18n is client-side locale-swapping on the same URLs (localStorage/IP), `<html lang="en">` hardcoded, zero hreflang — translations invisible to search, mildly cloaking-shaped | `contexts/LocaleContext.tsx` | Either path-based locales with hreflang, or drop the switcher |
| 3.13 | CSP entirely commented out ("TEMPORARILY DISABLED for GTM debugging") | `next.config.mjs:57-75` | Re-enable with GTM allowances |

---

## 4. Content quality — "will this rank and attract organic traffic?"

**Honest answer: not yet.** The site converts well for people who already found it, but it has almost nothing that *earns* discovery.

**What's genuinely good (keep and build on):**
- `services/[slug]` and `accelerators/[id]` are the best pages: unique intent-matched metadata, canonicals, Service + Breadcrumb schema, 650–750 words of specific, non-generic copy (capabilities, use cases, rollout, integrations), clean H1→H2→H3 ladders, real cross-linking. These can rank for commercial long-tail ("payment integrity AI for healthcare payers", "AI ticket triage ServiceNow") once the pages get authority.
- Industry page copy (healthcare payers, banking, insurance, retail, manufacturing) is substantive and vertical-specific — it just needs metadata (§2.3) to exist in Google's eyes.
- Homepage FAQ answers are answer-first, quotable, and match the schema — a correct AEO pattern.
- `llms.txt` is well-crafted and current, including retired-name disambiguation for answer engines.
- No lorem ipsum, no keyword stuffing; the voice is distinctive.

**What blocks ranking:**
1. **No educational/problem-space content.** Zero published articles (one seed stub). Nobody searches "ArqAI"; buyers search problems: *"how to detect FWA in TPA claims"*, *"AI claims triage for insurance carriers"*, *"move AI pilot to production governance"*. Without 20–50 deep, intent-matched pieces, there is nothing for search or answer engines to cite. The admin engine (keyword research, Claude-assisted SEO fields) makes this cheap to produce — but the fields must first be wired to the public site (§2.7) and bodies server-rendered (§2.2).
2. **Proof is fictional or unsourced.** Template testimonials, invented case-study seed, unsourced "30%+ / 2x / 40% / $3.2M / 120+ businesses" claims. Enterprise buyers and LLMs both discount unverifiable claims; one real anonymized case study with baseline → intervention → measured outcome is worth more than every current number on the site.
3. **Answer-first blocks exist only on the homepage.** Inner pages lead with positioning lines ("The operating fabric for production AI workflows") rather than a plain one-sentence definition + key-takeaways block an answer engine can lift. Accelerator H1s are bare product names ("ArqFWA") with no query terms.
4. **No topical architecture.** No glossary, no comparison pages ("ArqAI vs building in-house", "vs generic automation platforms"), no category hubs, no related-post graph — so even good future posts won't reinforce each other.
5. **Minor consistency debt:** `/how-it-works` says "three layers" while `/platform` says "four layers"; `/how-it-works` vs `/how-we-work` are near-identical slugs; `service.promise` repeats 3× per service page; "prioritises" (UK) at `app/use-cases/page.tsx:25`; legal pages inconsistently branded "ArqAI" vs "ArqAI Labs"; unused legacy `lib/data/industries.ts` contradicts live positioning (foundry/telecom/real-estate era) and could leak via AI chat prompts.

---

## 5. What the earlier external audit got right and wrong

That audit reviewed the **stale static site** (`/index.html`, `/about-us.html`, `/contact.html` at repo root) — the *old* ArqAI site, not what's deployed. Verdicts on its findings as applied to the real site:

| External finding | Verdict for the live Next.js site |
|---|---|
| Duplicated metadata / canonicals all → homepage | **Stale.** Core pages have unique metadata + self-canonicals. The *real* version of this problem is the 11 client-only pages (§2.3) and demo/engage-us (§2.4). |
| No JSON-LD anywhere | **Stale.** Homepage has a rich `@graph`; services/accelerators/case-studies/blog posts have schema. Real gaps: About, Contact, industries, webinars, visible-FAQ parity (§3.3, §3.4). |
| H1 "One AI Platform Infinite Possibilities" too generic | **Stale.** Live H1 is "Operational AI. Built for Your Enterprise." — names category + audience. Reasonable; could test appending an outcome clause, but not a priority. |
| Products = ArqRelease/ArqOptimize/ArqEstate/ArqIntel | **Stale.** Current catalog is ArqFWA, ArqClaims, ArqBanker, ArqLoyalty, ArqTechOps, ArqLogistics, ArqDesk, ArqSecOps — with dedicated pages that already exist. |
| No FAQs / not answer-first | **Partially valid.** Homepage has visible FAQ + schema; inner pages have none (§3.3), and answer-first definition blocks are missing site-wide (§4.3). |
| No llms.txt | **Stale.** Exists and is good; needs content-library coverage (§3.10). |
| Thin Contact page, wrong titles | **Directionally valid** — Contact has *no* metadata at all (§2.3) and ~150 words. |
| Claims need proof | **Fully valid, and worse than they knew** — the proof shown is fictional (§2.5). |
| Recommended content library (pillars, comparisons, case studies, glossary) | **Fully valid** — this is the core growth gap (§4). |
| Stale root static files | The files it audited should be **deleted from the repo** (nothing deploys them; no CNAME/workflows reference them), after carrying the Google verification token into the Next app (§2.9). Old indexed URLs like `/contact.html` also need redirects (only `/about-us.html` has one). |

---

## 6. Prioritized action plan

**Week 1 — mechanical fixes (1–2 days of work, most of the technical wins):**
1. Ship `/og-image.png` (§2.1) and fix icon paths + webmanifest (§3.5).
2. Server-wrap the 11 metadata-less pages with unique titles/descriptions/canonicals (§2.3).
3. De-duplicate titles (drop hard-coded "| ArqAI Labs") (§2.6).
4. Canonicalize `/engage-us`, 301 `/demo`, unify CTAs (§2.4).
5. Noindex (or delete) `/home-legacy` and `/v4` (§2.8).
6. Add Google verification to Next metadata; then delete the stale root static site; add redirects for `/contact.html` and other old URLs (§2.9, §5).
7. Fix "See All Services" → `/services` (§3.8); fix case-study `hero_image` column (§3.6); real sitemap lastmod (§3.7).

**Week 2 — make content visible to crawlers and answer engines:**
8. Server-render blog post bodies (§2.2), blog listing, case-studies listing, whitepaper pages.
9. Wire admin SEO fields into public metadata + emit per-post FAQPage schema (§2.7).
10. Publish-status filter + drop `ilike` fallback (§3.2); remove 6-post cap, add pagination + category pages + RSS (§3.1).
11. Visible FAQs (with schema parity) on /platform, /services, industries, /contact, /engage-us (§3.3); AboutPage/Organization schema + facts on /about (§3.4).
12. Update robots AI-bot rules and llms.txt to cover the content library (§3.9, §3.10).

**Weeks 3–6 — earn traffic:**
13. Replace fictional testimonials with real/anonymized proof; source or remove every metric claim (§2.5).
14. Publish 2 real case studies (baseline → intervention → measured outcome).
15. Launch the content program with the already-built engine: 8–12 pillar/answer pages targeting vertical problem queries (FWA detection, claims triage, financial-crime ops, AI pilot-to-production governance), each with answer-first intro, key takeaways, FAQ, author bio, reviewed date.
16. Add comparison pages and a governed-AI glossary; interlink with services/accelerators/industries.
17. Reconcile the "three layers vs four layers" story; decide the fate of `/how-it-works` vs `/how-we-work`; delete legacy `lib/data/industries.ts`.

---

*Compiled from a three-track code audit (technical SEO layer; all inner pages; blog/content engine) plus a direct review of the v5 homepage components, with every external-audit claim re-verified against the live codebase.*
