# ArqAI Labs : Website Content

*Version 3. AI engineering studio voice. Use cases lead. Products demoted to proof. ACI on About only.*



**Owner:** Habib Mehmoodi, VP, Strategy & Innovation  

**Brand:** ArqAI Labs is an AI engineering studio.  

**Hero promise:** We ship production-grade AI, bespoke to your operation.  

**Status:** Living document. Version 3.0.



---

# A. Brand and writing system

## Brand naming

- Company brand: **ArqAI Labs**.

- Category descriptor: AI engineering studio. In the hero. Reinforced deeper on the page.

- Product convention: Arq + workflow noun. ArqFWA, ArqClaims, ArqBanker. Demoted from lead role; framed as proof we ship the same workflow repeatedly.

- ACI Infotech parent: only on About.



## Voice

**Confident. Specialist. Accessible. A bit dry.**

We are an AI engineering studio. We design, build, deploy, and run AI for operations that don't fit off-the-shelf. We ship the work, we don't decorate the deck. Voice should read like a senior engineer explaining what they built, not a consultant pitching what they could build.



## Voice rules

- Active verbs: design, build, deploy, run, ship, tune, fit, integrate.

- Outcome-led.

- First-person plural. We, our.

- Plain language for technical concepts. Specific names where they exist (Microsoft Copilot, AWS Quick, Dynamics 365).

- 'Bespoke' allowed only when paired with engineering language so it lands as craft, not luxury.



## Words to use

Engineering studio. Production-grade. Bespoke to your operation. Tuned. Fit. Build, deploy, run. Ship. Lean. Senior. End-to-end. Plus a growing line of products from what works.



## Words to avoid

Services firm. World-class. Best-in-class. Premium. Exclusive. Boutique. Mission-critical. Cutting-edge. AI-powered. Trusted partner. Synergies. Transformative. Industry's first. Patent-pending. Leverage.

*No headline-level use of:* regulator, investigator, auditor, audit cycle.

*Strict no:* any framing that implies cheaper, more affordable, or alternative-to.



## Punctuation rules

- No long em dashes anywhere.

- En dashes only in numeric ranges.

- Sentence case for headlines.

- Numerals from 10 up. One through nine spelled.



---

# B. Information architecture

## Top navigation

- What we work on  /  use cases page

- How we work  /  the engineering process

- Products  /  ArqFWA, ArqClaims, ArqBanker

- Industries  /  healthcare, insurance, banking, retail, manufacturing, more

- Trust

- About

- Persistent CTA in nav: **'Engage us'**



## Footer

- Company: About, Careers, Contact

- Trust: Privacy, Terms, Security, Responsible AI

- Resources: Blog, Engineering blog

- Single CTA: Engage us



## Page inventory

- `/`  : Home

- `/use-cases` : What we work on

- `/how-we-work` : Engineering process

- `/products` : Products overview

- `/products/arqfwa`

- `/products/arqclaims`

- `/products/arqbanker`

- `/industries/healthcare-payers`

- `/industries/insurance-carriers`

- `/industries/banking`

- `/industries/retail`

- `/industries/manufacturing`

- `/trust`

- `/about`

- `/contact`

- `/engage-us`



---

# C. Page-by-page content

## Page 01 : Home

`/`



**META TITLE:** ArqAI Labs : an AI engineering studio

**META DESCRIPTION:** ArqAI Labs is an AI engineering studio. We ship production-grade AI, bespoke to your operation. Retail loyalty. Patient management. Claims triage. Manufacturing ERP. Plus a growing line of products from what we ship.



### Section 1: Hero

**EYEBROW:** ARQAI LABS

**HEADLINE:** **ArqAI Labs is an AI engineering studio.**

**SUBHEAD:** **We ship production-grade AI, bespoke to your operation.**

**PRIMARY CTA:** Engage us

**SECONDARY CTA:** See what we work on



### Section 2: What we work on (use case grid)

**Section heading:** What we work on.

**Section subhead:** A few of the operations we've engineered AI into. The list grows. Yours might be next.



#### Card 1 : RETAIL

**Title:** Loyalty that learns what each customer values.

**Body:** AI that replaces points-and-badges with offers tuned to actual buying behavior. Retention up. Spend on stale incentives down.



#### Card 2 : HEALTHCARE

**Title:** Patient management that doesn't drop people in the gap.

**Body:** AI that follows up, schedules, and surfaces the patients your team needs to call today. Less leakage between visits.



#### Card 3 : INSURANCE / HEALTHCARE

**Title:** Claims triage in days, not weeks.

**Body:** AI that routes incoming claims to the right person, prioritises the queue, and supports the decision your team makes.



#### Card 4 : MANUFACTURING

**Title:** ERP that finally answers the question.

**Body:** AI on top of your ERP that turns the data into decisions. Fewer reports your team has to assemble by hand.



#### Card 5 : HOSPITALITY

**Title:** Revenue management that doesn't miss a fill night.

**Body:** AI that prices rooms, packages, and add-ons dynamically against demand, competitor pricing, and your own historical patterns. More revenue per available unit. Fewer empty rooms.



#### Card 6 : FACILITIES MANAGEMENT

**Title:** Maintenance that fixes things before they break.

**Body:** AI that predicts failures across HVAC, elevators, lighting, and critical equipment from sensor data and service history. Less downtime. Lower cost per repair.



#### Card 7 : MICROSOFT 365

**Title:** Microsoft Copilot, tuned to your operation.

**Body:** Copilot extended with your context, your workflows, and the security posture your IT requires. Out-of-the-box does not get you there. We do.



#### Card 8 : MICROSOFT DYNAMICS

**Title:** Dynamics 365, AI-fied.

**Body:** Your Dynamics with AI that learns from your sales motion and your service desk. Less manual entry. Better next-best actions.



#### Card 9 : AWS ECOSYSTEM

**Title:** AWS Quick, configured.

**Body:** Quick Suite tuned for the agents your operation actually needs, integrated with the systems you already run.



### Visual treatment specification (for design and engineering)

*This section is internal: a brief for the team building the use-case section. The cards above carry the copy. The treatment below carries the experience.*



#### Layout

- Desktop: 3 columns x 3 rows. Equal-height cards. Generous whitespace between.

- Tablet: 2 columns. The 9th card centered on the final row.

- Mobile: single column, vertical stack with snap-scroll if it lands well.

- Each card is a self-contained 'screen': rounded container, soft border, subtle shadow, internal padding around the animated scene and the text.



#### Motion behavior

- Spring transition on scroll into viewport (Framer Motion: stiffness ~100, damping ~20). Cards rise and settle, not flop in.

- Parallax: visual elements inside each card move at slightly different speeds as the section scrolls past. Subtle, not theatrical.

- Hover: card lifts (shadow deepens, transform translateY(-4px), scale 1.02). The scene inside becomes more active (numbers tick faster, an indicator pulses).

- Idle ambience: every card has at least one element with low-amplitude continuous motion, so the grid feels alive even when the user isn't interacting.

- Stagger: cards animate in with a small delay (50-100ms) per card so the grid populates as a sequence, not a wall.



#### Per-card visual scene

**Card 1 : RETAIL : Loyalty that learns.**  Customer profile chips floating up; a personalised offer card slides into view; a small retention number ticks upward; previous static-loyalty graphic dissolves out behind it. Live element: the offer changes mid-scene to imply real-time tuning.

**Card 2 : HEALTHCARE : Patient management.**  A patient timeline with calendar dots; one missed appointment highlights amber; an AI flag rises on it; a follow-up appears on a future date. Live element: the flag pulses; a checkmark lands when the patient is rebooked.

**Card 3 : INSURANCE / HEALTHCARE : Claims triage.**  A stack of claim tiles entering from the left; they sort into three columns labelled URGENT, STANDARD, REVIEW. The right adjuster avatar lights up next to each routed claim. Live element: claim tiles continuously route; queue counter ticks down.

**Card 4 : MANUFACTURING : ERP that answers.**  A plain text question slides in ('Why did Q3 yields drop?'). A small dashboard composes itself in response: a chart, a callout, a recommendation. Live element: chart bars animate up; recommendation text types in.

**Card 5 : HOSPITALITY : Revenue management.**  A hotel rate calendar grid; prices subtly change cell-by-cell as demand signals (small icons on the side: weather, event, competitor) tick. A revenue-per-available-room counter ticks up. Live element: prices update continuously.

**Card 6 : FACILITIES MANAGEMENT : Predictive maintenance.**  A row of equipment cards (HVAC, elevator, lighting) with small status indicators. One indicator transitions from green to amber, then a callout appears: 'predicted failure in 14 days.' A work order auto-drafts below it. Live element: indicators breathe; one transitions on each loop.

**Card 7 : MICROSOFT 365 : Copilot tuned.**  A Copilot chat pane with a tuned company-context prompt typed in. The response composes itself, citing internal sources. A small lock icon next to it indicates security context. Live element: typing animation; response materialises with subtle delay.

**Card 8 : MICROSOFT DYNAMICS : Dynamics AI-fied.**  A Dynamics-style record card; an AI suggestion overlay appears with a next-best action. A small 'why this' reveal expands. Live element: suggestion fades in and out as the record updates; an indicator confirms the action was taken.

**Card 9 : AWS : Quick configured.**  A row of agent tiles; one is being configured (toggles, selectors animating); it transitions to a green 'running' state. Live element: agents transition from grey to green over the loop; a small log line appears each time.



#### Technology recommendations

- React + Framer Motion for spring transitions, parallax, and stagger.

- Lottie or inline SVG for per-card scenes (Lottie if the scene is rich; SVG with CSS or motion if geometric).

- IntersectionObserver to trigger animations only when the section is in viewport.

- GSAP as fallback if Framer Motion's parallax control feels insufficient for scene-by-scene motion.



#### Performance and accessibility

- Lazy-load each card's visual scene. Only the first row should be in initial bundle.

- Each card's scene budget: under 50kb gzipped. Aim lower.

- 60fps target on modern devices. Reduce motion complexity gracefully on low-end.

- Respect prefers-reduced-motion. When set, drop parallax, drop hover scaling, swap idle motion for static state. Keep the springs as fades.

- Tab focus must be visible on each card. Card content readable without any motion. Animated numbers must not be the only carrier of meaning (always pair with explicit text).

- Screen readers: animations are decorative. Scene elements aria-hidden='true'. Title and body remain announced normally.



#### Inspiration references for the design team

- Stripe (stripe.com): dashboard scenes that animate as you scroll. Per-section choreography.

- Linear (linear.app): card-based product pages with floating UI elements and spring transitions.

- Vercel (vercel.com): infrastructure visualisation; nodes light up in sequence.

- Apple iPhone product pages: per-feature animated scenes with parallax depth.

- Resend (resend.com): clean, technical, modern motion register that matches the engineering-studio voice we want.



#### What this section is not

Not a generic 'illustrations and icons' grid. Not stock-photography. Not a static feature matrix. Each card is a small live scene. The section's job is to communicate that we ship working AI in working operations: motion is the proof.



**Section CTA:** See more use cases → `/use-cases`



### Section 3: How we work

**Section heading:** Four steps. End-to-end.

#### Strategy

We start with the workflow, the buyer, and the operational metric. Discovery is short, focused, and outputs a concrete deployment plan.

#### Build

We design and engineer AI tuned to your environment. On the cloud you already run. Integrated with the systems your team already uses.

#### Deploy

We push it into production. Not a sandbox. Not a pilot that lives in a slide deck. Real decisions on real data.

#### Run

We operate it alongside your team. Named technical lead. Named relationship lead. Defined SLAs. We don't ship and walk away.



### Section 4: What we've productised

**Section heading:** When the same problem shows up enough times, we productise it.

**Section subhead:** A few of those problems showed up so often we built them out as products.



#### ArqFWA  ·  Live

The AI agent for fraud, waste, and abuse detection. Built for healthcare payers and P&C insurance carriers.

**CTA:** See ArqFWA

#### ArqClaims  ·  In build

The AI agent for claims triage and processing. In build with design partners.

**CTA:** Join the design partner program

#### ArqBanker  ·  Coming

The AI agent for AML, KYC, and financial crime. In development.

**CTA:** Get notified at launch



### Section 5: Why ArqAI Labs

**Section heading:** Three things we will not compromise on.

#### Lean engineering teams.

We are an AI engineering team. Senior. Sharp. Fluent in the modern frontier stack. We'd rather build than describe.

#### Tuned, not templated.

No two operations get the same build. Every engagement starts with how your team actually works, not with what we've shipped before.

#### Productised where it earns its place.

When a problem shows up enough times across customers, we turn it into a product. ArqFWA, ArqClaims, ArqBanker. The product line grows from the work, not the other way around.



### Section 6: Industries we serve

Healthcare. Insurance. Banking. Retail. Manufacturing. And other operations whose complexity rewards specialist work.

*Each industry word links to /industries/[name].*



### Section 7: Trust

Architectural controls first. Aligned with SOC 2, HIPAA, GDPR, and regional frameworks where engagements require them. → `/trust`



### Section 8: Closing CTA

**HEADLINE:** **Tell us what your operation needs.**

**BODY:** We'll tell you what's honestly possible. In plain language. Without a deck.

**CTA:** Engage us



---

## Page 02 : What we work on

`/use-cases`



**META TITLE:** What we work on : ArqAI Labs use cases

**META DESCRIPTION:** Operations we've engineered AI into. Retail loyalty. Patient management. Claims triage. Manufacturing ERP. Microsoft Copilot tuning. AWS Quick configuration. And more.



### Section 1: Hero

**HEADLINE:** **Use cases we've built. Or are building. Or are ready to build.**

**SUBHEAD:** Each one started the same way: a team with a complex operation and an AI alternative that didn't fit. We tuned it until it did.



### Section 2: Use case grid (full listing)

*Render all eight home-page cards plus expansions:*

- **BANKING:** Customer onboarding that finishes itself. AI that gets KYC and CDD across the line without dropping the application.

- **RETAIL:** Inventory that anticipates. AI that sees the shelf, the season, and the local trend at once.

- **MANUFACTURING:** Quality control with eyes on every shift. Vision and language models that catch what the manual sample missed.

- **CROSS-INDUSTRY:** SAP S/4HANA, AI-fied. Your S/4HANA with AI that turns master data into decisions.



### Section 3: Don't see your use case?

We don't ship templates. Most of the engagements we run weren't on a public page when they started. Tell us what your operation needs. We'll tell you what's honestly possible.

**CTA:** Engage us



---

## Page 03 : How we work

`/how-we-work`



**META TITLE:** How we work : ArqAI Labs engineering process

**META DESCRIPTION:** Strategy. Build. Deploy. Run. The four-step process behind every ArqAI Labs engagement.



### Section 1: Hero

**HEADLINE:** **Four steps. End-to-end. No handoffs to someone else's team.**

**SUBHEAD:** Every ArqAI Labs engagement runs on the same four steps. We do all of them. Together. With your team in the room.



### Section 2: Strategy

We start with the workflow, the buyer, and the operational metric. We don't run a generic AI assessment. We run a discovery scoped to the outcome you want, the timeline you need, and the constraints your environment imposes. Output: a concrete deployment plan and a committed timeline.



### Section 3: Build

We engineer the AI tuned to your environment. On the cloud you already run. Integrated with the systems your team already uses. Built on the modern frontier stack: Anthropic, OpenAI, Azure OpenAI, AWS Bedrock. Stack-agnostic by design. The build standard is production from day one, not a benchmark or a demo.



### Section 4: Deploy

We push it into your production environment. Not a sandbox. Not a pilot that lives in a slide deck. The same security review, change-management posture, and operational handoff your team applies to anything else that runs in production.



### Section 5: Run

We operate the AI alongside your team. Named technical lead. Named relationship lead. Defined SLAs. Defined cadence. The AI keeps shipping, your team keeps the lead, and the engagement compounds over time.



### Section 6: What we don't do

- Pure AI strategy decks without a delivery commitment.

- Engagements without a named workflow owner and a defined success metric.

- AI that ships into a sandbox and never sees production.

- Generic enterprise IT modernisation that happens to mention AI.



### Section 7: Closing CTA

**CTA:** Engage us



---

## Page 04 : Products overview

`/products`



**META TITLE:** Products : ArqAI Labs

**META DESCRIPTION:** When the same problem shows up enough times, we productise it. ArqFWA, live. ArqClaims, in build. ArqBanker, coming.



### Section 1: Hero

**HEADLINE:** **When a problem shows up enough times, we productise it.**

**SUBHEAD:** Most of the work we do is bespoke. But every once in a while, the same operational problem shows up across enough customers that it earns its place as a product. These are those.



### Section 2: ArqFWA  ·  Live

The AI agent for fraud, waste, and abuse detection. Built for healthcare payers and P&C insurance carriers.

→ See ArqFWA



### Section 3: ArqClaims  ·  In build

The AI agent for claims triage and processing. Built for mid-market P&C carriers. In build with design partners.

→ Join the design partner program



### Section 4: ArqBanker  ·  Coming

The AI agent for AML, KYC, and financial crime. Built for regional and mid-tier banks. In development.

→ Get notified at launch



### Section 5: One foundation, every product

Identity. Policy enforcement. Observable retrieval. Three layers every ArqAI Labs product is built on. Architecture once, products many. → How we engineer.



---

## Page 05 : ArqFWA

`/products/arqfwa`



**META TITLE:** ArqFWA : the AI agent for fraud, waste, and abuse

**META DESCRIPTION:** ArqFWA detects fraud, waste, and abuse in healthcare and insurance claims. Production-grade. Engineered end-to-end by ArqAI Labs.



### Section 1: Hero

**EYEBROW:** PRODUCT  ·  LIVE

**HEADLINE:** **The AI agent for fraud, waste, and abuse detection.**

**SUBHEAD:** ArqFWA reviews high volumes of claims and transactions, prioritises the cases your team should focus on, and explains its reasoning so a human can act on it. Built for healthcare payers and P&C insurance carriers. Production-grade from day one.

**PRIMARY CTA:** Book an ArqFWA demo

**SECONDARY CTA:** See how ArqFWA is engineered



### Section 2: How ArqFWA fits

#### Built for the workflow.

ArqFWA is a finished product. It does fraud, waste, and abuse. It does not ship as a kit your team configures.

#### Tuned to your operation.

We deploy ArqFWA inside your environment, integrated with your existing claims and case management systems, calibrated to the way your team actually works.

#### Engineered for production.

Cryptographic identity for the agent. Runtime policy enforcement before any action. Observable, governed retrieval for every data lookup. Production-grade is the default state.



### Section 3: Who ArqFWA is for

Operations leaders, fraud and special-investigations teams, and program-integrity directors at healthcare payers and P&C carriers. Plus the technology and AI executives backing them.



### Section 4: What changes with ArqFWA

- More fraud and waste flagged, with the explanation needed for the next step.

- Less time per investigation. Your team focuses where it pays back.

- Predictable operational performance. Production-grade reliability without internal AI engineering overhead.

*Replace with real ArqFWA pilot numbers when available.*



### Section 5: Trust

Architectural controls aligned with SOC 2 Trust Services Criteria. Type II audit in progress. HIPAA-aligned controls and BAAs in place with healthcare customers. → `/trust`



### Section 6: FAQ

#### Does ArqFWA replace our team?

No. ArqFWA prioritises and explains. Your team makes the call.

#### Where does our data live?

In your environment. ArqFWA is deployed inside your cloud or your sovereign provider. Your data is not used to train shared models.

#### Which AI provider does ArqFWA use?

We build to the AI provider your environment is already aligned with: Anthropic, OpenAI, Azure OpenAI, AWS Bedrock. Stack-agnostic by design.



### Section 7: Closing CTA

**CTA:** Book the demo



---

## Page 06 : ArqClaims

`/products/arqclaims`



**META TITLE:** ArqClaims : the AI agent for claims triage

**META DESCRIPTION:** ArqClaims triages and processes claims for mid-market P&C carriers. Built for the workflow. In build with design partners.



### Section 1: Hero

**EYEBROW:** PRODUCT  ·  IN BUILD

**HEADLINE:** **The AI agent for claims triage and processing.**

**SUBHEAD:** ArqClaims triages incoming claims so your adjusters touch the right ones first. With routing logic, reserve recommendations, and decision support tuned to your operation. In build with design partners now.

**PRIMARY CTA:** Apply to the design partner program

**SECONDARY CTA:** Get notified at launch



### Section 2: Built for the operation

Mid-market P&C carriers run claims under structural pressure. Volume up. Adjuster bench expansion slow. Cycle times stretched. Most of the AI alternatives either ship as toolkits your team has to configure, or solve a slice of the workflow that disappears in handoff. ArqClaims is built end-to-end, calibrated for the operational logic mid-market P&C carriers actually run.



### Section 3: Adjusters in control

ArqClaims surfaces the right context, prioritises the queue, and supports the decision. Your adjusters keep authority on every claim. The agent assists. It never overrides.



### Section 4: Who ArqClaims is for

VPs of Claims and claims operations directors at mid-market P&C carriers ($500M to $5B in DWP across personal auto, home, and commercial lines). Plus the technology and AI executives evaluating claims modernisation.



### Section 5: Design partner program

We are taking a small number of carriers into the design partner program now. Design partners shape the product. Early access. Direct line to the engineering team. Pricing that reflects co-development.

**CTA:** Apply to the program



---

## Page 07 : ArqBanker

`/products/arqbanker`



**META TITLE:** ArqBanker : the AI agent for AML, KYC, and financial crime

**META DESCRIPTION:** ArqBanker is the AI agent for financial crimes operations at regional and mid-tier banks. In development.



### Section 1: Hero

**EYEBROW:** PRODUCT  ·  COMING

**HEADLINE:** **The AI agent for AML, KYC, and financial crime.**

**SUBHEAD:** Built for the financial crimes operations at regional and mid-tier banks. Calibrated for the operational reality of running an AML, KYC, and financial-crime program on a lean team.

**PRIMARY CTA:** Get notified at launch

**SECONDARY CTA:** Talk to product



### Section 2: Built for the size of bank you actually are

Regional banks ($10B to $100B in assets) and mid-tier community banks ($1B to $10B) face the same operational expectations as the largest institutions, with smaller teams, leaner budgets, and AML stacks built before AI was a serious option. ArqBanker is built for the operational reality of those institutions, not the top tier.



### Section 3: Calibrated for the workflows your team actually runs

Sanctions screening. Customer due diligence. Transaction monitoring. SAR support. Each one calibrated to the operational logic financial-crimes leaders at regional banks actually run.



### Section 4: Who ArqBanker is for

BSA officers, financial crimes directors, AML programme leads, and compliance officers at regional and mid-tier US banks. Plus the CTOs and Heads of AI evaluating financial-crime modernisation.



### Section 5: Status and timing

ArqBanker is in development. Pre-design-partner and pre-pilot. The earlier you are in the conversation, the more your operation shapes the product.



### Section 6: Closing CTA

**CTA:** Get on the early-access list



---

## Page 08 : Industries we serve

`/industries` (and per-industry pages)



*Per-industry pages follow the same short structure: hero + use cases relevant to the industry + closing CTA. Examples below.*



### Healthcare payers : `/industries/healthcare-payers`

**HEADLINE:** **AI for the way healthcare payers actually operate.**

We build AI for operations leaders, program-integrity directors, claims and SIU teams at BCBS regionals, Medicaid MCOs, mid-tier MA plans, IPAs, and mid-market commercial health plans. Live today: ArqFWA. On the way: prior authorization, utilization management, claims operations.



### P&C insurance carriers : `/industries/insurance-carriers`

**HEADLINE:** **AI for the carriers that take operations seriously.**

We build AI for SIU and claims operations leadership at mid-market personal lines, commercial, and specialty carriers. Live today: ArqFWA. In build: ArqClaims.



### Banks and financial institutions : `/industries/banking`

**HEADLINE:** **AI built for the bank you are.**

Regional and mid-tier US banks. Financial crimes operations at the bank you actually run, not the bank Goldman Sachs runs. Coming: ArqBanker.



### Retail : `/industries/retail`

**HEADLINE:** **AI for retail teams that compete on customer relationship.**

We build AI for retail operators tired of static loyalty programs and inventory that lags the floor. Loyalty that learns. Inventory that anticipates. Bots that actually help your store associates.



### Manufacturing : `/industries/manufacturing`

**HEADLINE:** **AI for manufacturing operations that need their data to talk back.**

We build AI on top of your ERP, your shop floor, and your quality-control workflow. Reports that don't take your team three days to assemble.



---

## Page 09 : Trust

`/trust`



**META TITLE:** Trust : ArqAI Labs

**META DESCRIPTION:** Architectural controls and compliance posture across every ArqAI Labs engagement. SOC 2 in progress. HIPAA-aligned. GDPR-aligned. Control documentation under NDA.



### Section 1: Hero

**HEADLINE:** **Architectural controls first. Certifications next.**

**SUBHEAD:** We don't claim certifications we don't have. We tell you exactly where we are on every framework you care about, and we share control documentation under NDA on request.



### Section 2: Architectural controls

Independent of certification status, the architecture every ArqAI Labs engagement runs on includes:

- Cryptographic logging of every agent action and every data access.

- Policy enforcement before retrieval and before tool execution.

- Decision provenance exposed in the operational log and the user UI.

- Deployment options that respect data residency and tenancy requirements.



### Section 3: Compliance posture

*Replace placeholders with real status.*

#### SOC 2

Aligned with SOC 2 Trust Services Criteria. Type II audit in progress with [auditor name]. Target: [date].

#### HIPAA

HIPAA-aligned controls. BAAs executed with healthcare customers.

#### GDPR

GDPR-aligned data protection principles.

#### Regional frameworks

Aligned with the SAMA Cybersecurity Framework, NCA Essential Cybersecurity Controls, KSA PDPL, UAE PDPL, and NHRA standards for engagements in MENA.



### Section 4: Data handling

Customer data stays in customer environments. Customer data is not used to train shared models.



### Section 5: Responsible AI

Every ArqAI Labs engagement is designed to assist a human professional, not replace one. The AI surfaces evidence and reasoning. The human makes the consequential decision.



### Section 6: Request control documentation

**CTA:** Request control documentation



---

## Page 10 : About

`/about`



**META TITLE:** About : ArqAI Labs

**META DESCRIPTION:** ArqAI Labs is an AI engineering studio. The AI products and services arm of ACI Infotech.



### Section 1: Hero

**HEADLINE:** **We build AI for the way people actually work.**

**SUBHEAD:** ArqAI Labs is an AI engineering studio. We design, build, deploy, and run production AI for operations that don't fit off-the-shelf.



### Section 2: What we believe

#### Tuned beats templated.

Every operation has its own quirks. Off-the-shelf AI averages them away. We build to the quirks.

#### Production beats pilots.

Most enterprise AI never makes it past the sandbox. We engineer for production from day one. That is the only standard we ship at.

#### Engineers, not consultants.

We're a lean team of senior AI engineers. We'd rather build than describe.



### Section 3: Leadership

**Founder & CEO:** Jagannadh Varma Kanumuri  

**VP, Strategy & Innovation:** Habib Mehmoodi  

More team details to follow.



### Section 4: Our parent

ArqAI Labs is the AI products and services arm of ACI Infotech, a privately held technology services firm. ACI works with senior technology leaders across financial services, healthcare, insurance, telecommunications, and manufacturing. The relationship gives ArqAI Labs the implementation playbooks, the delivery muscle, and the access to enterprise customers that most AI engineering studios don't have.



### Section 5: Closing CTA

Book a demo  ·  See open roles  ·  Become a partner



---

## Page 11 : Engage us / Contact

`/engage-us` and `/contact`



**META TITLE:** Engage us : ArqAI Labs

**META DESCRIPTION:** Tell us what your operation needs. We'll tell you what's honestly possible.



### Engage us page

**HEADLINE:** **Tell us what your operation needs.**

**SUBHEAD:** We'll tell you what's honestly possible. In plain language. Without a deck. Bring a sample of your data and we'll show you what changes when ArqAI Labs is in your operation.

**Form fields:**

- Full name

- Work email

- Company

- Role

- Industry

- What workflow or use case are you exploring? (free text)

- Anything else we should know? (optional)

*Privacy line: We use this information only to follow up with you. See our privacy notice.*

**SUBMIT:** Send



### Contact page

#### Engagements and demos

→ `/engage-us`

#### Partnerships and design partners

partnerships@aciinfotech.net

#### Press and analyst

marketing@aciinfotech.net

#### Careers

→ See open roles



---

# D. Reusable elements

## About paragraph (short)

*ArqAI Labs is an AI engineering studio. We ship production-grade AI, bespoke to your operation.*



## About paragraph (medium)

*ArqAI Labs is an AI engineering studio. We design, build, deploy, and run production AI for operations that don't fit off-the-shelf. Retail loyalty, patient management, claims triage, manufacturing ERP, Microsoft Copilot tuning, AWS Quick configuration, and more. Plus a growing line of products from what we ship repeatedly.*



## About paragraph (long, for press / analyst)

*ArqAI Labs is an AI engineering studio. We design, build, deploy, and run production AI for operations that don't fit off-the-shelf, across healthcare, insurance, banking, retail, and manufacturing. Where the same workflow shows up across enough customers, we productise it. ArqFWA, the AI agent for fraud, waste, and abuse detection, is live in production. ArqClaims, the AI agent for claims triage, is in build with design partners. ArqBanker, the AI agent for AML, KYC, and financial crime, is in development. ArqAI Labs is the AI products and services arm of ACI Infotech.*



## Closing CTA block (reusable)

**Headline:** Tell us what your operation needs.

**Body:** We'll tell you what's honestly possible. In plain language. Without a deck.

**CTA:** Engage us



## Compliance language (short)

*Architectural controls aligned with SOC 2 Trust Services Criteria. Type II audit in progress. HIPAA-aligned controls and BAAs in place with healthcare customers. GDPR-aligned. Control documentation under NDA.*



---

# E. Open questions before publication

- Trademark status of ArqAI Labs and each product mark.

- Real ROI numbers from ArqFWA pilots.

- Named or anonymised customer references.

- SOC 2 Type II auditor name and target completion date.

- ArqClaims design-partner enrollments.

- Use cases beyond the eight in the home grid: ready to demo today vs. roadmap?

- Confirmed integrations to name.

- Office address for footer.

- Domain strategy: thearq.ai or arqailabs.com?
