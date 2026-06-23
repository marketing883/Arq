# ArqAI Website: Content Review and SEO/AEO Read

A fresh dive on thearq.ai, read against the positioning we agreed. Content changes first, then a ten-keyword SEO and AEO read. Reviewed 23 June 2026.

Method note: pages read live. The SEO and AEO positions are approximate, read from live search, not a rank tracker, so treat ranks as "shows or does not show," not precise. The site looks like it is mid-update, and some of what follows reflects that.

## What is working, leave it alone

- The voice is sharp and on positioning. "We ship the work, we do not decorate the deck." "Production beats pilots." "Engineers, not consultants." "Tuned beats templated." This is the right register and it matches what we built.
- It is technically well built. Pages are server-rendered, so crawlers and AI engines can read everything. Titles, meta, Open Graph, and a healthy sitemap are all in place, and the homepage carries good structured data. robots.txt explicitly allows the AI bots. For a young site this is above average.
- The accelerator catalog is well structured and the vertical depth comes through clearly.

## Content changes to make

### 1. Fix the split-brained accelerator names, this is the biggest issue

The accelerators page now uses new standalone names: Veyra, Luma, Sentra, Nuvia, Kyra, Orbis, Astra, Vantaq. But the nav, the footers on other pages, the homepage, and the actual accelerator pages still use the old names: ArqFWA, ArqClaims, ArqBanker, ArqLoyalty, ArqTechOps, ArqLogistics, ArqDesk, ArqSecOps. Two naming systems are live at once, on split URLs (/accelerators/veyra versus /accelerators/arqfwa). A visitor clicking from the catalog lands on a different name than the nav shows.

Recommendation: finish the move to the standalone names. They read as real products rather than Arq-prefixed internal tools, which is better for an independent, fundable company and supports the raise. But the half-done state is confusing right now and it splits SEO across duplicate pages. Pick the new names, redirect the old URLs to the new ones, update the nav, footers, and homepage, and retire the Arq-prefixed versions everywhere.

### 2. Reframe the ACI relationship to match the raise

The About page says ArqAI is "backed by ACI Infotech," then: "Same engineering standard. Same end-to-end ownership. Same team, all the way from strategy to run." For a seed raise, "same team" reads as captive, ACI's people wearing an ArqAI badge, which is the exact signal that compresses an AI company's valuation toward services math.

This also contradicts the ACI site, which calls ArqAI "our proprietary platform." So the two sites tell two different captivity stories, in opposite directions, and both cut against the independent-company raise.

Recommendation: reframe to the model we agreed, two independent companies in a strategic partnership. Keep the real benefit, enterprise access and delivery muscle, but drop "same team." See the positioning doc and the source-of-truth doc for the exact language. Aligning both sites to the partnership model is the single highest-leverage brand fix across the two properties.

### 3. Bring the homepage hero up to the voice of the rest of the site

The homepage H1 is "Empower Your Business with Operational AI." It is generic, and weaker than the voice everywhere else on the site. Rewrite it in the About and Services register, the "we ship the work" voice. This doubles as the SEO fix below, since that H1 also undercuts the page's own keyword intent.

### 4. Replace generic proof and stock imagery with real proof

The accelerator stats (30%+, 2x, 100%) read as illustrative, not earned. The ArqFWA page uses Unsplash stock photos. The homepage testimonials look templated. For enterprise buyers and for investors, named case studies with specific numbers are the highest-value trust signal there is. Either tie the stats to named or specifically anonymized engagements, or label them honestly as targets. Swap the stock photography for real product views or clean diagrams.

### 5. Tighten the entity facts

The founding date conflicts: the homepage schema says 2024, Crunchbase and search say 2023. Pick one and make it consistent across the site, the schema, Crunchbase, and LinkedIn. Answer engines cross-check entity facts, and a conflict weakens citation confidence.

## SEO and AEO read, ten keywords

Bottom line up front: thearq.ai ranks for its own brand name and nothing else. For all nine non-branded queries it is not visible on page one. That is expected for a new domain with almost no earned authority. The pages that target these terms exist and are well written. They simply have no age, links, or citations yet.

| Keyword | ArqAI visible | Who owns it | AEO relevance |
|---|---|---|---|
| operational AI for enterprise | No | operational.ai, Moveworks, IBM, Dataiku | High. Their own title targets this, but it does not rank. Term collision with operational.ai. |
| AI agents for healthcare payers | No | Oracle Health, Hyro, Writer, IBM, BCG | High. Owned by analysts and incumbents. |
| fraud waste and abuse detection AI | No | Codoxo, GDIT, CGI, Thomson Reuters | Medium-high. Codoxo is the incumbent. ArqFWA invisible. |
| AML alert triage automation | No | Feedzai, Lucinity, Abrigo | Medium. ArqBanker targets it, does not surface. |
| enterprise AI in production, past the pilot | No | zbrain, CDW, Medium posts | High, and this is their core narrative. Biggest missed opportunity. |
| AI claims processing automation for insurers | No | Shift Technology, Sprout.ai, Quantiphi | High. ArqClaims invisible, Shift is the brand. |
| AI governance and audit for AI agents | No | WitnessAI, Galileo, Deloitte | High. Governance is their stated edge, no ranking content. |
| ArqAI Labs, branded | Yes, number one | Crowded namespace: arqa.ai, arqai.com, arqai.tech, ArchAI Labs | Brand is owned, but the namespace is crowded and a stale page and a public demo subdomain also show. |
| how to get enterprise AI out of pilot into production | No | ema.ai, CDW, Box, zbrain | Very high. Pure question query, strongest answer-engine trigger of the set, dead on message, completely absent. |
| AI accelerators for regulated industries | No | AWS, Databricks, IBM, Domino | Medium-high. Their signature term, but search reads it as hardware or startup-program accelerators. Collision risk. |

### Technical read

Strong: server-rendered content, clean titles and meta, homepage JSON-LD, AI bots allowed, healthy sitemap.

Gaps: inner pages carry zero structured data, so the accelerator and blog pages that target the money keywords have nothing structured for an answer engine to lift. The homepage H1 is generic and fights its own title. The founding date conflicts. A stale /about-us.html and a public demo.thearq.ai are indexable and dilute brand search. And llms.txt exists but is empty, which is a bad look for a company that sells AI readiness.

### Highest-impact fixes, ranked

1. Win the on-brand answer-engine queries with content. "Past the pilot" and "how to move enterprise AI from pilot to production" are literally your narrative and the strongest AI Overview triggers in the set, and competitors' blog posts own them. Publish deep, answer-first content: question as the H2, the direct answer in the first sentence, real data under it. This is the fastest realistic path to AEO citations.
2. Add JSON-LD to every inner page: Product or Service schema on accelerators, BlogPosting on posts, FAQPage on the FAQ sections.
3. Populate the empty llms.txt with a concise structured summary. Easy win, and it stops undercutting the positioning.
4. Fix the homepage H1 and reconcile the founding date everywhere.
5. Clean the brand SERP. Noindex or remove demo.thearq.ai and the stale /about-us.html so brand signals consolidate on the canonical pages.
6. Build authority. Near-zero backlinks on a one-to-two-year domain is the real ceiling, and on-page polish cannot beat it alone. Pursue analyst and vendor listings, guest content, and niche directories in payer-integrity and AML.
7. Target winnable long-tail first. Specific accelerator and vertical queries (TPA fraud detection AI, Facets QNXT claims AI, and the accelerator names themselves) are thin and match the product pages you already have, unlike the head terms that suffer collision.

## The one cross-site note

ArqAI's site says "backed by ACI, same team." ACI's site says ArqAI is "our proprietary platform." Both lean captive, in opposite directions, and both work against the independent-company raise. Aligning the two to the partnership model is worth more than any single on-page fix.

## Sources

- thearq.ai pages: home, /about, /services, /accelerators, /accelerators/arqfwa, /partners, /how-we-work
- thearq.ai/robots.txt, /sitemap.xml, /llms.txt (empty)
- Company signal: https://www.crunchbase.com/organization/arq-ai-labs-private-limited
- Representative ranking competitors: operational.ai, codoxo.com, feedzai.com, shift technology, zbrain.ai, ema.ai
