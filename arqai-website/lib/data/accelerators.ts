export type AcceleratorCapability = { title: string; body: string };
export type AcceleratorUseCase = { title: string; body: string };
export type AcceleratorFaq = { q: string; a: string };

export type Accelerator = {
  id: string;
  name: string;
  category: string;
  track: "Vertical" | "Horizontal";
  domain: string;
  flagship?: boolean;
  tagline: string;
  summary: string;
  builtFor: string;
  image: string;
  heroImage: string;
  secondaryImage: string;
  tertiaryImage: string;
  overview: string;
  whatChanges: string;
  capabilities: AcceleratorCapability[];
  architecture: string[];
  useCases: AcceleratorUseCase[];
  integrations: string[];
  buyers: string;
  pain: string;
  promise: string;
  proof: string;
  rollout: string[];
  metrics: { value: string; label: string }[];
  signals: string[];
  entryPoint: { name: string; body: string };
  faqs: AcceleratorFaq[];
  keywords: string[];
};

// Optimized Unsplash delivery. `w` controls the crop width; auto=format serves
// AVIF/WebP, q=80 keeps it sharp but light.
const img = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

// Canonical portfolio: 4 vertical + 6 horizontal accelerators, one governed
// spine. Sourced from the ArqAI Labs Accelerator Portfolio (2026).
export const accelerators: Accelerator[] = [
  // =====================================================================
  // VERTICAL
  // =====================================================================
  {
    id: "arqfwa",
    name: "ArqFWA",
    category: "Payment integrity and fraud intelligence",
    track: "Vertical",
    domain: "Healthcare · Payment Integrity",
    flagship: true,
    tagline:
      "Surfaces the cases most likely to be fraud, waste, or abuse before payment leaves the door.",
    summary:
      "ArqFWA is a payment-integrity intelligence layer for healthcare payers. It correlates claims, provider, policy, and member signals to surface high-value fraud, waste, and abuse cases — each with the evidence trail investigators need to act and defend.",
    builtFor: "Healthcare payers, TPAs, PBMs, and program-integrity teams",
    image: "/v5/assets/accel/arqfwa.jpg",
    heroImage: img("photo-1576091160550-2173dba999ef", 1600),
    secondaryImage: img("photo-1517120026326-d87759a7b63b", 1920),
    tertiaryImage: img("photo-1516549655169-df83a0774514", 800),
    overview:
      "ArqFWA is a payment-integrity intelligence layer for healthcare payers that reads across claims, providers, policy, and member context to surface the cases most likely to be fraud, waste, abuse, or claims leakage — and explains the reasoning clearly enough for an investigator to act on and defend. Unlike rule-based systems that generate thousands of low-value flags, it correlates signals across multiple dimensions to prioritize only the cases worth human attention.",
    whatChanges:
      "ArqFWA converts the payment-integrity function from a high-volume, low-yield review queue into a targeted, evidence-backed investigation workflow. Investigators spend their time on cases that matter. Each case arrives with the context needed to act on it and defend the decision downstream. Leaders have a clear view of program performance without a black box.",
    capabilities: [
      {
        title: "Cross-signal anomaly detection",
        body: "Correlates billing patterns, provider behavior, and member history into one risk picture instead of thousands of isolated rule hits — surfacing coordinated schemes that single-dimension rules cannot detect.",
      },
      {
        title: "Explainable case scoring",
        body: "Every flagged case carries the evidence, peer comparisons, and policy references a reviewer needs. Every flag includes the reasoning chain an investigator can follow and defend in an appeal, audit, or recovery proceeding.",
      },
      {
        title: "Provider risk profiling",
        body: "Builds a longitudinal view of each provider — behavioral drift, peer-comparison anomalies, and network-level coordinated billing — so emerging risk is visible before it compounds into material leakage.",
      },
      {
        title: "Reviewer workbench",
        body: "Routes the highest-value cases to investigators with context assembled, suggested next steps pre-populated, and a clean, exportable audit trail attached.",
      },
      {
        title: "Continuous calibration",
        body: "Learns from investigation outcomes and recoveries so prioritization keeps sharpening — reducing false positives over time and surfacing more material cases per investigator hour.",
      },
      {
        title: "Pre-pay and post-pay coverage",
        body: "Operates across pre-payment flagging and post-payment recovery: preventing payments that match risk patterns and identifying paid patterns worth pursuing retrospectively.",
      },
    ],
    architecture: [
      "A coordination agent manages the flow between signal ingestion, pattern correlation, scoring, and routing. A claim analysis agent reads across the claim history for the member and provider simultaneously, while a peer comparison agent benchmarks provider behavior against peer groups adjusted for specialty and geography.",
      "A case assembly agent builds the evidence package and reviewer brief — pulling relevant claims, provider history, policy language, and comparable peer data into a structured case record. All agents write to a shared audit log that serves as the governance trail for every decision made in the system.",
    ],
    useCases: [
      {
        title: "Pre-pay flagging",
        body: "Hold high-risk claims for review before payment leaves the door, with rationale your edits team can stand behind.",
      },
      {
        title: "Post-pay recovery",
        body: "Surface paid-claim patterns worth pursuing for recovery, provider education, or audit.",
      },
      {
        title: "Provider audits",
        body: "Assemble defensible evidence packages for provider audits in minutes instead of weeks.",
      },
    ],
    integrations: [
      "Claims platforms (Facets, QNXT, TriZetto, MedInsight)",
      "Policy & edit engines",
      "Clinical editing tools",
      "Provider directories & NPPES",
      "Data warehouse / lakehouse",
      "Case management & SIU workflow",
      "BI & reporting",
    ],
    buyers:
      "VP of Payment Integrity, Director of SIU, and Chief Medical Officer at health plans; VP of Operations and VP of Compliance at TPAs; Program Integrity leads at government and managed care organizations.",
    pain:
      "Payment-integrity teams are buried in claim volume. Rule engines generate enormous alert volumes, but most are low-value hits that consume investigator time without recovering meaningful dollars. The highest-risk patterns sit across claims history, provider behavior, policy language, and member context simultaneously — no single system sees all of it, and cases often escalate after payment has already left the door.",
    promise:
      "ArqFWA prioritizes the cases worth human attention, explains why they matter, and keeps the evidence trail clean enough for downstream recovery and audit.",
    proof:
      "Proven in the field: a single ArqFWA-powered Blind Spot Assessment surfaced roughly $3.2M in undetected waste for a mid-size TPA whose prior vendor had rated it fully compliant — while cutting manual review time by about 70%. Full story: /case-studies/tpa-blind-spot-assessment",
    rollout: [
      "Load a sample claims and provider-history slice; calibrate signals against known leakage patterns and past investigation outcomes.",
      "Deploy the reviewer workbench with explanations, evidence packages, and routing alongside the existing process.",
      "Expand from sampled review to active queue prioritization; measure recovery and false-positive rates against baseline.",
      "Integrate the recovery workflow, calibrate continuously from outcomes, and expand to additional claim types and program lines.",
    ],
    metrics: [
      { value: "30%+", label: "More high-value cases surfaced vs. rules-only baseline" },
      { value: "2x", label: "Faster review triage from assignment to decision" },
      { value: "100%", label: "Decision evidence captured per case for audit and recovery" },
    ],
    signals: [
      "Rules generate too many low-value flags and investigators spend time on cases that close without recovery",
      "SIU and claims-review teams need better prioritization, but leadership wants explainability, not a black box",
      "Provider risk context is scattered across systems and cannot be assembled quickly for a case",
      "Recovery rates are flat despite investment in staff and the existing rule engine",
      "Audit or compliance requirements demand a documented evidence trail for payment-integrity decisions",
    ],
    entryPoint: {
      name: "FWA Blind Spot Assessment",
      body: "A two-week analysis of a claims sample slice against 120+ fraud, waste, and abuse patterns not currently covered by your existing rule engine. Delivers a risk distribution map, a comparison of ArqFWA prioritization against your current review queue, and a recommended accelerator configuration — before any build commitment.",
    },
    faqs: [
      {
        q: "What is ArqFWA?",
        a: "ArqFWA is an AI payment-integrity accelerator for healthcare payers. It reads across claims, providers, policy, and member context to surface the cases most likely to be fraud, waste, abuse, or claims leakage, and attaches the evidence trail investigators need to act on and defend every case.",
      },
      {
        q: "Who is ArqFWA built for?",
        a: "Healthcare payers, third-party administrators (TPAs), pharmacy benefit managers (PBMs), and program-integrity teams — typically owned by the VP of Payment Integrity, Director of SIU, or VP of Compliance.",
      },
      {
        q: "How is ArqFWA different from a rules-based FWA engine?",
        a: "Rule engines generate thousands of isolated, low-value flags. ArqFWA correlates billing patterns, provider behavior, and member history into one risk picture, scores cases with explainable evidence rather than black-box scores, and keeps calibrating against your real investigation outcomes.",
      },
      {
        q: "How do we get started with ArqFWA?",
        a: "Most teams start with the FWA Blind Spot Assessment: a two-week analysis of a claims sample against 120+ FWA patterns your current rules don't cover. You get a risk distribution map and a recommended configuration before committing to any build.",
      },
    ],
    keywords: [
      "healthcare fraud detection AI",
      "payment integrity software",
      "FWA detection for payers",
      "claims leakage detection",
      "SIU case prioritization",
      "explainable AI healthcare claims",
      "TPA fraud detection",
    ],
  },
  {
    id: "arqloyalty",
    name: "ArqLoyalty",
    category: "Loyalty platform modernization",
    track: "Vertical",
    domain: "Retail · Hospitality · Fuel & Convenience",
    flagship: true,
    tagline:
      "Replace your loyalty platform without betting the business on a single migration night.",
    summary:
      "ArqLoyalty is a modern AI-governed loyalty engine adopted without migration risk: it runs in shadow beside your incumbent system, proves penny-for-penny parity every day, and cuts over one capability at a time on your timeline.",
    builtFor: "Fuel & convenience, hospitality, malls, and any loyalty operator",
    image: "/v5/assets/accel/arqloyalty.jpg",
    heroImage: img("photo-1481437156560-3205f6a55735", 1600),
    secondaryImage: img("photo-1483985988355-763728e1935b", 1920),
    tertiaryImage: img("photo-1556742502-ec7c0e9f34b1", 800),
    overview:
      "ArqLoyalty is a modern AI-governed loyalty engine that an operator can adopt without migration risk. It runs in shadow alongside the incumbent system, processes the same live transactions, and proves its numbers match penny-for-penny every day before being promoted to run live — one capability at a time, on the customer's timeline. Loyalty programs become configuration rather than custom code, and it runs on the operator's existing data lakehouse.",
    whatChanges:
      "ArqLoyalty removes migration risk entirely. Because it runs in parallel and proves parity daily before anything goes live, the cut-over decision is validated by data, not faith. Operations continue uninterrupted. Finance has reconciliation it can trust. The team promotes capabilities one at a time rather than betting the business on a single launch night.",
    capabilities: [
      {
        title: "Shadow-mode parallel run",
        body: "Runs beside the incumbent platform on the same live transactions with zero impact on members or operations. Both systems process every transaction; results are compared daily.",
      },
      {
        title: "Penny-for-penny parity proof",
        body: "Reconciles points, tiers, and balances against the existing system every day and surfaces any discrepancy before cut-over. Finance signs off on the numbers before anything goes live.",
      },
      {
        title: "Capability-by-capability cut-over",
        body: "Promote one program, currency, or redemption type to live at a time, on your timeline. No single migration night. Each promotion is independently validated before the next begins.",
      },
      {
        title: "Programs as configuration",
        body: "Earn rules, tiers, currencies, and redemptions are configured through a rule engine, not custom-coded. New earn mechanics go live within hours of configuration, not development cycles.",
      },
      {
        title: "Runs on your lakehouse",
        body: "Deploys on the data platform you already operate, keeping member and transaction data in your own environment. No data migration to a vendor cloud; data sovereignty preserved.",
      },
      {
        title: "Vertical packs on a shared core",
        body: "Fuel, hospitality, and mall programs each ship as a thin pack of currencies, adapters, and templates over the same engine. One platform serves multiple program types and brands.",
      },
    ],
    architecture: [
      "A reconciliation agent runs nightly, comparing transaction-level outputs between the legacy system and ArqLoyalty, flagging discrepancies and producing a signed parity report for finance review. A program engine agent handles earn and burn logic, tier evaluation, and balance management.",
      "A migration sequencing agent tracks the cut-over state and manages which capabilities are live versus in shadow, ensuring the transition state is always visible and auditable.",
    ],
    useCases: [
      {
        title: "Legacy platform replacement",
        body: "Retire an aging or end-of-life loyalty platform with parity proven daily before each capability is promoted.",
      },
      {
        title: "Program consolidation",
        body: "Consolidate multiple programs and currencies onto one shared core without a single high-stakes cut-over event.",
      },
      {
        title: "Program flexibility unlock",
        body: "Ship new earn mechanics, tiers, and offers as configuration in hours — flexibility the legacy platform could never provide.",
      },
    ],
    integrations: [
      "Incumbent loyalty system (API or event stream)",
      "POS, fuel controller, kiosk & payment terminal feeds",
      "CDP, CRM & marketing automation",
      "Snowflake, Databricks, BigQuery, Azure Synapse",
      "Campaign management & offer personalization",
    ],
    buyers:
      "VP of Loyalty and CMO for program strategy; CTO and CIO for platform decisions; VP of Finance and Director of Financial Reporting for reconciliation sign-off; VP of Operations for cut-over sequencing.",
    pain:
      "Loyalty platform modernization is one of the most deferred IT projects in retail and hospitality. Touching member balances, points liability, and daily financial reconciliation is high-stakes enough that teams would rather live with an aging system than risk a big-bang migration — so legacy platforms hold marketing budgets and member relationships hostage.",
    promise:
      "ArqLoyalty makes the cut-over decision a data decision: shadow-run on live transactions, penny-for-penny parity proven daily, and capabilities promoted one at a time on your timeline.",
    proof:
      "Onboarding follows a repeatable migrate–prove-parity–cut-over playbook designed to eliminate the primary reason operators stay on aging platforms: fear of migration. It runs on the lakehouse you already operate.",
    rollout: [
      "Migrate the existing program design into ArqLoyalty as configuration: earn rules, tiers, currencies, and redemption types.",
      "Run in shadow on live transactions; prove penny-for-penny parity daily, with finance reviewing signed reconciliation reports.",
      "Begin capability-by-capability cut-over on your timeline; each promotion independently validated before the next begins.",
      "Extend to new currencies, redemption mechanics, or vertical programs; decommission the legacy platform once all capabilities are confirmed live.",
    ],
    metrics: [
      { value: "Zero", label: "Migration risk at cut-over, proven by data not faith" },
      { value: "1:1", label: "Penny-for-penny parity validated every single day" },
      { value: "Hours", label: "To ship program changes as configuration, not code" },
    ],
    signals: [
      "Loyalty runs on a legacy or end-of-life platform and vendor support is degrading",
      "A big-bang migration has been discussed or attempted and rejected as too risky",
      "Multiple programs or currencies need consolidation without a single cut-over event",
      "Finance requires daily reconciliation it can trust before any migration step is approved",
      "Marketing wants program flexibility the current platform cannot provide",
    ],
    entryPoint: {
      name: "Loyalty Platform Risk Assessment",
      body: "A two-week analysis of your existing program structure, transaction volume, currency logic, and data model. Delivers a parity complexity estimate, a migration sequence recommendation, and a shadow-run deployment plan with resource and timeline estimates.",
    },
    faqs: [
      {
        q: "What is ArqLoyalty?",
        a: "ArqLoyalty is an AI-governed loyalty platform modernization accelerator. It runs in shadow beside your incumbent loyalty system on the same live transactions, proves penny-for-penny parity every day, and cuts over one capability at a time — eliminating big-bang migration risk.",
      },
      {
        q: "How does ArqLoyalty eliminate migration risk?",
        a: "Both systems process every live transaction in parallel. A reconciliation agent compares points, tiers, and balances daily and produces a signed parity report for finance. Nothing goes live until parity is proven, and each capability is promoted independently on your timeline.",
      },
      {
        q: "Who is ArqLoyalty built for?",
        a: "Loyalty operators in fuel and convenience, hospitality, and malls — and any operator on a legacy or end-of-life loyalty platform where finance requires trustworthy daily reconciliation before a migration step is approved.",
      },
      {
        q: "Do we have to move our data to a vendor cloud?",
        a: "No. ArqLoyalty deploys on the data lakehouse you already operate — Snowflake, Databricks, BigQuery, or Azure Synapse — so member and transaction data stays in your environment and data-sovereignty requirements are preserved.",
      },
    ],
    keywords: [
      "loyalty platform migration",
      "loyalty program modernization",
      "parallel run loyalty migration",
      "loyalty platform replacement without risk",
      "fuel and convenience loyalty platform",
      "hospitality loyalty program software",
    ],
  },
  {
    id: "arqlogistics",
    name: "ArqLogistics",
    category: "Supply chain and vendor risk intelligence",
    track: "Vertical",
    domain: "Manufacturing · Energy · Procurement",
    tagline:
      "Supplier risk, procurement exposure, and disruption signals before they become business events.",
    summary:
      "ArqLogistics watches your supplier and logistics dependency graph across contracts, ERP records, shipments, quality data, and external signals — and routes exposure-backed actions to the right owner before disruption becomes a business event.",
    builtFor: "Energy, manufacturing, logistics, and procurement teams",
    image: "/v5/assets/accel/arqlogistics.jpg",
    heroImage: img("photo-1494412519320-aa613dfb7738", 1600),
    secondaryImage: img("photo-1605745341112-85968b19335b", 1920),
    tertiaryImage: img("photo-1493946740644-2d8a1f1a6aff", 800),
    overview:
      "ArqLogistics watches the supplier and logistics dependency graph for risk across contracts, ERP records, shipments, quality data, and external signals, and routes exposure-backed actions to the right owner before disruption becomes a business event. It replaces periodic spreadsheet review with continuous monitoring and converts vague risk awareness into specific, quantified, actionable exposure.",
    whatChanges:
      "ArqLogistics converts supply chain risk from a periodic review activity into a continuous, signal-driven process. Procurement and operations teams receive specific, exposure-backed alerts about the risks most likely to affect their business. Mitigation options remain open rather than foreclosed by late discovery.",
    capabilities: [
      {
        title: "Dependency-graph monitoring",
        body: "Maps suppliers, SKUs, plants, and logistics lanes so a single supplier failure, route disruption, or quality failure is visible before it compounds. Tier-2 and tier-3 relationships are mapped alongside direct suppliers.",
      },
      {
        title: "External signal fusion",
        body: "Blends news, weather, financial health indicators, and logistics signals with internal ERP and procurement records in real time — so converging risks are visible before they combine into a supply event.",
      },
      {
        title: "Exposure quantification",
        body: "Translates a risk signal into the specific revenue, SKU commitments, production schedules, or contracts it threatens. Risk becomes a dollar amount and a timeline, not a flag.",
      },
      {
        title: "Exception and disruption alerts",
        body: "Flags shipment, quality, and contract exceptions early — with the context of what depends on that supplier — instead of in next month's report.",
      },
      {
        title: "Mitigation action routing",
        body: "Sends the right action to procurement, operations, or risk owners with supplier context, exposure size, and suggested next step assembled. Time from signal to action collapses from days to hours.",
      },
      {
        title: "Multi-tier visibility",
        body: "Extends monitoring to tier-2 and tier-3 supplier relationships, where surprises routinely originate — most companies can only see their direct suppliers.",
      },
    ],
    architecture: [
      "A dependency mapping agent maintains the supplier graph and updates it continuously as contracts, ERP records, and logistics data change. A signal monitoring agent ingests external data feeds continuously.",
      "A correlation agent links external signals to specific internal exposures and quantifies revenue and operational impact. A routing agent sends exposure-backed actions to the appropriate owner with context assembled from all preceding agents.",
    ],
    useCases: [
      {
        title: "Supplier risk monitoring",
        body: "Continuous, exception-driven monitoring of supplier health replacing monthly or quarterly spreadsheet reviews.",
      },
      {
        title: "Disruption early warning",
        body: "Detect converging risk signals 30–60 days before operational impact, while mitigation options are still open.",
      },
      {
        title: "Concentration risk analysis",
        body: "Surface single-source dependencies and tier-2/tier-3 exposure before they become operational emergencies.",
      },
    ],
    integrations: [
      "SAP, Oracle, NetSuite, Microsoft Dynamics",
      "Coupa, Ariba, Jaggaer",
      "Oracle TMS, Manhattan Associates, JDA",
      "Contract repositories",
      "News, financial, weather & logistics data feeds",
      "Tableau, Power BI, Looker",
    ],
    buyers:
      "VP Supply Chain and Chief Procurement Officer; VP Operations and VP Manufacturing; Head of Vendor Risk and Director of Procurement; CFO and VP Finance for exposure quantification.",
    pain:
      "Supplier and shipment risks appear across contracts, ERP records, emails, news, quality data, and logistics tools long before they surface in a monthly report — yet the average enterprise actively monitors fewer than five percent of its supplier relationships in real time. Most companies find out when the disruption is already happening and mitigation options have narrowed.",
    promise:
      "ArqLogistics converts vague risk awareness into specific, quantified, actionable exposure — and routes it to the owner who can act while options are still open.",
    proof:
      "ArqLogistics connects to the ERP, procurement, and logistics systems you already run and blends them with external signal feeds — continuous monitoring on top of your existing stack, not another system of record.",
    rollout: [
      "Map suppliers, contracts, SKUs, plants, and critical dependency relationships; identify concentration risks.",
      "Connect ERP, procurement, logistics systems, and external risk signal feeds; validate signal coverage against known events.",
      "Launch exception monitoring for a focused supplier segment; calibrate alert thresholds and routing rules with the team.",
      "Expand into proactive mitigation planning, full multi-tier monitoring, and executive exposure reporting.",
    ],
    metrics: [
      { value: "30–60d", label: "Earlier risk signal detection before operational impact" },
      { value: "360°", label: "Supplier context across ERP, contracts, and live signals" },
      { value: "1 queue", label: "Exposure-backed actions replacing scattered periodic reports" },
    ],
    signals: [
      "Supplier risk is managed in spreadsheets and reviewed monthly or quarterly rather than continuously",
      "Critical dependencies are not visible until disruption occurs and the organization learns about supply events reactively",
      "Procurement and operations lack shared context on supplier health, creating coordination gaps",
      "Leaders need risk action and mitigation options, not a risk report that arrives too late to act on",
      "The supply chain organization grew faster than its monitoring capability",
    ],
    entryPoint: {
      name: "Supplier Risk Blind Spot Audit",
      body: "A two-week analysis of your top 50 supplier relationships against 12 risk signals not currently being monitored. Delivers a risk score distribution, the five suppliers most likely to cause disruption in the next 90 days, and a recommended agent deployment roadmap.",
    },
    faqs: [
      {
        q: "What is ArqLogistics?",
        a: "ArqLogistics is a supply chain and vendor risk intelligence accelerator. AI agents map your supplier dependency graph, fuse external signals (news, weather, financial health) with internal ERP and procurement data, quantify the exposure each risk threatens, and route actions to the right owner before disruption becomes a business event.",
      },
      {
        q: "How much earlier does ArqLogistics detect supply chain risk?",
        a: "Supply disruption signals are typically visible 30–60 days before operational impact. ArqLogistics surfaces them while mitigation options are still open, instead of after the disruption has already begun.",
      },
      {
        q: "Does ArqLogistics cover tier-2 and tier-3 suppliers?",
        a: "Yes. It maps and monitors tier-2 and tier-3 supplier relationships alongside direct suppliers — the deeper tiers where supply surprises routinely originate and where most companies have no visibility.",
      },
      {
        q: "How do we get started with ArqLogistics?",
        a: "With the Supplier Risk Blind Spot Audit: a two-week analysis of your top 50 supplier relationships against 12 unmonitored risk signals, delivering a risk distribution, the five suppliers most likely to cause disruption in the next 90 days, and a deployment roadmap.",
      },
    ],
    keywords: [
      "supply chain risk management AI",
      "supplier risk monitoring software",
      "procurement risk intelligence",
      "supply chain disruption early warning",
      "vendor risk management platform",
      "multi-tier supplier visibility",
    ],
  },
  {
    id: "arqbanker",
    name: "ArqBanker",
    category: "Banking operations and intelligent financial services",
    track: "Vertical",
    domain: "Banking · Financial Services · Lending",
    tagline:
      "AI-native operations for underwriting, onboarding, AML, and compliance across the full banking lifecycle.",
    summary:
      "ArqBanker is an AI-native operations layer for banking institutions that automates underwriting, customer onboarding, AML surveillance, and regulatory reporting — with explainable reasoning on every decision.",
    builtFor: "Retail banks, credit unions, digital lenders, neo-banks, and insurance carriers",
    image: "/v5/assets/accel/arqbanker.jpg",
    heroImage: img("photo-1582139329536-e7284fece509", 1600),
    secondaryImage: img("photo-1592698765727-387c9464cd7f", 1920),
    tertiaryImage: img("photo-1616803140344-6682afb13cda", 800),
    overview:
      "ArqBanker is an AI-native operations layer for banking institutions that automates the high-volume, high-stakes workflows where speed and accuracy matter most: underwriting, customer onboarding, AML surveillance, and regulatory compliance reporting. It connects to core banking systems, credit bureaus, identity verification providers, and regulatory frameworks already in use, and adds AI-orchestrated agent workflows on top of them.",
    whatChanges:
      "ArqBanker brings AI agents into each workflow with governance designed in from the start. Underwriting decisions carry explainable reasoning. Onboarding steps are orchestrated in sequence without manual handoffs. AML surveillance runs continuously with pattern reasoning rather than static rule hits. Regulatory submissions compile from structured evidence already captured during the operating cycle.",
    capabilities: [
      {
        title: "Intelligent underwriting agent",
        body: "Automates credit decisioning using structured financial data, alternative signals, and live bureau feeds. Every decision carries an explainable scoring rationale that satisfies regulatory review and supports appeal.",
      },
      {
        title: "KYC and onboarding automation",
        body: "Orchestrates document extraction, identity verification, risk classification, and compliance checks in sequence — compressing onboarding from days to minutes without reducing regulatory thoroughness.",
      },
      {
        title: "AML and fraud surveillance",
        body: "Continuous transaction monitoring with LLM-powered pattern reasoning that distinguishes true anomalies from the false-positive noise that buries analysts. Every flagged case carries its reasoning chain and evidence.",
      },
      {
        title: "Regulatory reporting agent",
        body: "Compiles, validates, and formats regulatory submissions with evidence captured continuously during the operating cycle. Compliance teams review structured outputs rather than assembling reports from raw data.",
      },
      {
        title: "Credit risk scoring",
        body: "Dynamic risk models incorporating bureau data alongside alternative signals — payment behavior, cash flow patterns, sector indicators — updating continuously and calibrating against realized performance.",
      },
      {
        title: "Document intelligence agent",
        body: "Extracts, classifies, and validates structured information from loan applications, financial statements, identity documents, and collateral records — feeding clean data into downstream workflows without manual entry.",
      },
    ],
    architecture: [
      "An orchestration agent manages workflow sequencing across underwriting, onboarding, and compliance functions. Specialist agents handle document extraction, bureau data interpretation, identity verification orchestration, and regulatory framework formatting.",
      "All agents write to a shared audit log capturing the trigger, data inputs, reasoning, and outcome for every decision. This audit trail is the compliance evidence record, not a reporting afterthought. A risk governance layer enforces decision boundaries and escalation thresholds configurable per institution.",
    ],
    useCases: [
      {
        title: "Digital lending",
        body: "Compress underwriting from days to minutes for standard credit profiles, with explainable rationale on every decision.",
      },
      {
        title: "Customer onboarding",
        body: "Orchestrate KYC end to end — document extraction, identity verification, risk classification — without manual handoffs.",
      },
      {
        title: "Financial crime operations",
        body: "Cut AML false positives with pattern reasoning and give analysts cases that arrive with evidence assembled.",
      },
    ],
    integrations: [
      "Temenos, Fiserv, FIS, nCino, Finacle",
      "Equifax, TransUnion, Experian, D&B",
      "Jumio, Onfido, Trulioo",
      "NICE Actimize, FICO TONBELLER, Oracle FCCM",
      "OSFI, FINTRAC, Basel & FHFA reporting",
      "Data warehouse & CDP",
    ],
    buyers:
      "Chief Risk Officer and Chief Compliance Officer; Head of Retail Banking and Head of Digital Lending; VP of Financial Crime and Director of AML; Head of Operations and Chief Digital Officer.",
    pain:
      "Banks face compounding operational pressure: loan volumes that require manual underwriting at a pace human teams cannot sustain, KYC processes that take days when customers expect minutes, AML monitoring that generates enormous alert volumes with high false-positive rates, and regulatory reporting that consumes compliance bandwidth every quarter — each managed in isolation across the institution.",
    promise:
      "ArqBanker compresses cycle times across underwriting, onboarding, AML, and reporting — with explainable reasoning and audit-ready evidence on every decision.",
    proof:
      "ArqBanker connects to the core banking systems, credit bureaus, identity providers, and regulatory frameworks already in use — AI-orchestrated agent workflows on top of your stack, not a core replacement.",
    rollout: [
      "Connect core banking, credit bureau feeds, and identity verification providers; map existing workflows against agent deployment targets.",
      "Deploy the underwriting and document intelligence agents on sampled application volume alongside the existing process; validate accuracy and explainability.",
      "Expand to KYC and onboarding automation; begin AML surveillance on the live transaction monitoring feed.",
      "Add the regulatory reporting agent to the active compliance cycle; calibrate credit risk scoring against realized performance.",
    ],
    metrics: [
      { value: "70%", label: "Reduction in underwriting cycle time to decision" },
      { value: "85%", label: "Drop in KYC manual review hours per customer" },
      { value: "3x", label: "Improvement in fraud detection precision vs. static rules" },
    ],
    signals: [
      "Underwriting cycle times are measured in days and the bottleneck is manual review of standard credit profiles",
      "Customer onboarding involves multiple manual handoffs between document review, identity verification, and compliance teams",
      "AML alert volumes are high but true-positive rates are low, creating analyst fatigue and missed genuine cases",
      "Regulatory reporting consumes significant compliance bandwidth each filing cycle due to manual data assembly",
      "Leadership needs explainable AI for credit decisions to satisfy regulatory requirements and appeal processes",
    ],
    entryPoint: {
      name: "Banking Operations Efficiency Assessment",
      body: "A two-week diagnostic of underwriting cycle times, onboarding drop-off rates, AML false-positive rates, and regulatory reporting preparation hours. Delivers a quantified efficiency gap analysis and a prioritized ArqBanker module deployment sequence.",
    },
    faqs: [
      {
        q: "What is ArqBanker?",
        a: "ArqBanker is an AI-native banking operations accelerator that automates underwriting, KYC onboarding, AML and fraud surveillance, and regulatory reporting. It layers AI agent workflows on top of the core banking systems, bureaus, and identity providers a bank already uses.",
      },
      {
        q: "Is ArqBanker's credit decisioning explainable for regulators?",
        a: "Yes. Every underwriting decision carries an explainable scoring rationale, and every agent action is logged with its trigger, data inputs, reasoning, and outcome. The audit trail is the compliance evidence record, designed to satisfy regulatory explainability requirements and support customer appeals.",
      },
      {
        q: "Who is ArqBanker built for?",
        a: "Retail banks, credit unions, digital lenders, neo-banks, and insurance carriers — typically owned by the Chief Risk Officer, Chief Compliance Officer, Head of Digital Lending, or VP of Financial Crime.",
      },
      {
        q: "Does ArqBanker replace our core banking system?",
        a: "No. ArqBanker connects to core platforms like Temenos, Fiserv, FIS, nCino, and Finacle and orchestrates AI agent workflows on top of them. It is an operations layer, not a core replacement.",
      },
    ],
    keywords: [
      "AI underwriting automation",
      "KYC automation banking",
      "AML transaction monitoring AI",
      "regulatory reporting automation",
      "explainable AI credit decisioning",
      "banking operations AI platform",
    ],
  },

  // =====================================================================
  // HORIZONTAL
  // =====================================================================
  {
    id: "arqforecast",
    name: "ArqForecast",
    category: "Demand and cash flow forecasting",
    track: "Horizontal",
    domain: "Cross-Industry · Demand & Cash Flow",
    tagline:
      "Demand, inventory, and cash flow forecasting across any industry — deployed in weeks, not months.",
    summary:
      "ArqForecast is a production-ready AI forecasting accelerator: an ensemble of 20+ models spanning time series, multivariate, and deep learning architectures, dynamically selecting the best combination for your data and deployed in 15 to 30 days.",
    builtFor: "Retail, manufacturing, finance, operations, and supply chain teams",
    image: "/v5/assets/accel/arqforecast.jpg",
    heroImage: img("photo-1554224155-1696413565d3", 1600),
    secondaryImage: img("photo-1521791055366-0d553872125f", 1920),
    tertiaryImage: img("photo-1619418602850-35ad20aa1700", 800),
    overview:
      "ArqForecast is a production-ready AI forecasting accelerator that deploys accurate demand, inventory, and cash flow forecasting across any industry in 15 to 30 days. It uses an ensemble of 20 or more models spanning classical time series, multivariate predictive models, and deep learning architectures — selecting the best combination dynamically based on actual performance against your specific data. Unlike custom ML forecasting projects that take three to four months, it ships with pre-built pipelines, configurable parameters, and interactive dashboards ready for immediate use.",
    whatChanges:
      "ArqForecast replaces the spreadsheet or basic BI forecast with a model-ensemble approach calibrated to the organization's actual data patterns. Planners spend their time on decisions rather than building models. Leadership has forecast accuracy it can trust for procurement, production, and financing decisions.",
    capabilities: [
      {
        title: "20+ model ensemble",
        body: "Spans time series models (ARIMA, Prophet, ETS), multivariate predictive models, and deep learning architectures (LSTM, Transformer-based) — each trained and validated on your historical data, with the best selected on performance, not assumption.",
      },
      {
        title: "Multi-domain support",
        body: "One engine handles demand forecasting for retail, raw material demand for manufacturing, cash flow projections for finance, and inventory optimization for distribution — each configured differently from the same accelerator.",
      },
      {
        title: "External factor integration",
        body: "Incorporates holidays, promotional calendars, weather patterns, economic indicators, and market events as covariates — automating the external context experienced planners previously adjusted for by hand.",
      },
      {
        title: "Config-driven model selection",
        body: "The top three best-performing model combinations are surfaced dynamically and update automatically as new actuals arrive. Adaptable without re-engineering the system.",
      },
      {
        title: "Pre-processing pipeline",
        body: "Built-in handling for format conversion, missing value imputation, outlier treatment, and feature engineering. Time from raw data to first forecast is measured in days, not months of preparation.",
      },
      {
        title: "Interactive forecast dashboard",
        body: "Visualizes forecasts vs. actuals, confidence intervals, and anomaly drivers. Business users explore scenarios and understand variance without needing data science skills.",
      },
    ],
    architecture: [
      "An ingestion agent handles data format normalization and pipeline construction. A model training agent runs parallel training and cross-validation across the full model library, while a model selection agent benchmarks against historical holdout periods and selects the optimal combination.",
      "A monitoring agent tracks forecast versus actuals over time and triggers retraining when drift is detected — ensuring performance does not degrade as market conditions evolve.",
    ],
    useCases: [
      {
        title: "Retail demand planning",
        body: "SKU-level demand forecasts that catch out-of-stock and overstock risk before it hits the shelf.",
      },
      {
        title: "Manufacturing procurement",
        body: "Raw material demand forecasts that replace static annual plans with current demand signals.",
      },
      {
        title: "Cash flow projection",
        body: "Modeled cash flow with confidence intervals, replacing judgment-based planning for financing decisions.",
      },
    ],
    integrations: [
      "SAP, Oracle, NetSuite, Microsoft Dynamics",
      "Inventory management platforms",
      "POS & sales data systems",
      "FP&A tools",
      "Snowflake, Databricks, BigQuery, Redshift",
      "Weather, economic & promotional calendar data",
    ],
    buyers:
      "VP Operations and COO; Director of Supply Chain Planning and Head of Demand Planning; CFO and VP Finance for cash flow use cases; Director of Inventory Management; Chief Data Officer for methodology decisions.",
    pain:
      "Inaccurate forecasting has industry-specific but universally expensive consequences: out-of-stock events in retail, raw material over-ordering in manufacturing, poorly timed financing decisions in finance. Most organizations forecast in spreadsheets or basic BI tools — accurate to within 15–20% at best and blind to the external factors experienced planners incorporate manually. Building ML-grade forecasting from scratch takes three to four months and usually underdelivers.",
    promise:
      "ArqForecast delivers ML-grade forecast accuracy calibrated to your actual data patterns — in production within 15 to 30 days, not a multi-month custom build.",
    proof:
      "ArqForecast ships with pre-built pipelines and connects to the ERP, sales, and data warehouse systems you already run — validated across 50+ cross-industry deployments and case studies.",
    rollout: [
      "Data assessment, pre-processing pipeline setup, and baseline model training on available historical data.",
      "Model validation against historical holdout periods; the top three model combinations presented with performance metrics for stakeholder selection.",
      "Dashboard deployment, user training, and the first production forecast cycle — run alongside your existing forecast to build trust.",
      "Continuous monitoring and drift detection with automated retraining; expand to additional forecasting use cases.",
    ],
    metrics: [
      { value: "15–30d", label: "To first production forecast from data connection" },
      { value: "15–30%", label: "Forecast accuracy improvement vs. spreadsheet baseline" },
      { value: "20+", label: "Model combinations evaluated per deployment" },
    ],
    signals: [
      "Frequent out-of-stocks or overstock situations occur with no early warning from the current forecasting approach",
      "Cash flow planning is based on judgment rather than modeled projections with confidence intervals",
      "An ML forecasting initiative has stalled, missed expected accuracy, or run past 90 days with no production output",
      "Leadership wants ML-grade forecasting without committing to a multi-month custom build",
      "Raw material procurement is based on static annual plans that ignore current demand signals",
    ],
    entryPoint: {
      name: "Forecasting Accuracy Baseline",
      body: "A two-week analysis of your historical data against the current forecasting method. Delivers a forecast accuracy benchmark, an opportunity size estimate in revenue or working capital impact, and the recommended model architecture for the first production deployment.",
    },
    faqs: [
      {
        q: "What is ArqForecast?",
        a: "ArqForecast is an AI forecasting accelerator that deploys demand, inventory, and cash flow forecasting in 15 to 30 days. It evaluates an ensemble of 20+ models — time series, multivariate, and deep learning — against your historical data and dynamically selects the best-performing combination.",
      },
      {
        q: "How accurate is ArqForecast compared to spreadsheet forecasting?",
        a: "Deployments typically improve forecast accuracy 15–30% over spreadsheet or basic BI baselines, in part by automatically incorporating external factors like holidays, promotions, weather, and economic indicators as model covariates.",
      },
      {
        q: "How long does ArqForecast take to deploy?",
        a: "15 to 30 days from data connection to first production forecast, versus three to four months for a typical custom ML forecasting build. Pre-built pipelines handle data preparation, and the first cycle runs alongside your existing forecast to build trust.",
      },
      {
        q: "Can one deployment cover demand, inventory, and cash flow?",
        a: "Yes. The same engine handles retail demand, manufacturing raw material demand, finance cash flow projections, and distribution inventory optimization — each as a separate configuration of the same accelerator.",
      },
    ],
    keywords: [
      "AI demand forecasting software",
      "cash flow forecasting AI",
      "inventory forecasting machine learning",
      "demand planning accelerator",
      "ensemble forecasting models",
      "ML forecasting deployment",
    ],
  },
  {
    id: "arqsupport",
    name: "ArqSupport",
    category: "Agentic ticket and service management",
    track: "Horizontal",
    domain: "Cross-Industry · IT, HR & Shared Services",
    tagline:
      "Agentic L1/L2/L3 ticket management with intelligent triage, auto-resolution, and proactive SLA monitoring.",
    summary:
      "ArqSupport is a multi-agent platform for intelligent ticket triage, automated resolution, and proactive SLA management — resolving L1 tickets autonomously, assisting L2 with drafts and context, and escalating L3 with full context assembled.",
    builtFor: "IT operations, shared services, HR ops, finance ops, and any support team",
    image: "/v5/assets/accel/arqsupport.jpg",
    heroImage: img("photo-1497366754035-f200968a6e72", 1600),
    secondaryImage: img("photo-1556761175-4b46a572b786", 1920),
    tertiaryImage: img("photo-1531973576160-7125cd663d86", 800),
    overview:
      "ArqSupport is a multi-agent platform for intelligent ticket triage, automated resolution, and proactive SLA management. It transforms manual support queues into an agent-driven resolution process that handles L1 tickets autonomously, assists L2 with context and draft resolutions, and escalates L3 cases with full context assembled. A centralized knowledge base, real-time SLA tracking, and a live analytics dashboard give operations teams full visibility into queue health.",
    whatChanges:
      "ArqSupport converts a reactive manual support operation into an intelligence-driven queue where L1 issues resolve automatically, routing is consistent, and SLA breaches are prevented rather than discovered. Senior staff handle the cases that require their judgment, not the cases a well-configured knowledge base could resolve.",
    capabilities: [
      {
        title: "Intelligent auto-triage",
        body: "NLP-based classification assigns every ticket to the correct tier based on content, historical patterns, and configured categories. Routing is consistent, immediate, and auditable — not dependent on who reads the ticket first.",
      },
      {
        title: "Knowledge base auto-resolution",
        body: "For L1 tickets, the Resolution Agent queries SOPs, FAQs, and past cases and drafts the resolution directly. Human agents review and send rather than compose from scratch.",
      },
      {
        title: "Proactive SLA monitor agent",
        body: "Tracks each ticket against its SLA continuously and escalates approaching breaches before they occur — with configurable escalation rules, priority adjustments, and notification routing.",
      },
      {
        title: "Multi-agent architecture",
        body: "Triage, Resolution, and SLA Monitor agents operate in concert with an Orchestrator coordinating handoffs. The architecture scales horizontally as volume grows — adding agent capacity, not headcount.",
      },
      {
        title: "Knowledge base ingestion and maintenance",
        body: "SOPs, FAQs, runbooks, and historical ticket-resolution pairs are ingested into a vector store queried in real time. The knowledge base improves as resolved tickets feed back in, and coverage gaps surface automatically.",
      },
      {
        title: "Live analytics dashboard",
        body: "Tracks ticket trends, category distribution, MTTR, SLA compliance, and AI confidence scores in real time — so managers spot systemic issues and retraining needs without lag.",
      },
    ],
    architecture: [
      "The Triage Agent reads each incoming ticket and assigns tier, category, and priority from content analysis and configured rules. The Resolution Agent queries the knowledge base and either auto-resolves L1 tickets or drafts a suggested resolution for the human agent at L2.",
      "The SLA Monitor Agent runs a continuous loop tracking time-to-breach for all open tickets. The Orchestrator routes tickets between agents and manages escalation when SLA thresholds are approached or agent confidence falls below the configured threshold.",
    ],
    useCases: [
      {
        title: "IT service desk",
        body: "Auto-resolve the repetitive 20–30% of L1 categories and route the rest consistently, around the clock.",
      },
      {
        title: "HR and finance operations",
        body: "One agentic queue for HR service requests and finance ops tickets, grounded in your own SOPs and policies.",
      },
      {
        title: "Shared services consolidation",
        body: "Consolidate cross-functional support queues onto one triage-and-resolution spine with per-function SLAs.",
      },
    ],
    integrations: [
      "ServiceNow, Jira Service Management, Zendesk, Freshservice",
      "SharePoint, Confluence, Notion & internal wikis",
      "Microsoft Teams, Slack, email",
      "Azure OpenAI, OpenAI API",
      "Power BI, Tableau",
    ],
    buyers:
      "VP IT and CIO for enterprise IT support; Head of Shared Services and Director of Support Operations; Director of HR Operations; CFO and Director of Finance Operations; COO for cross-functional consolidation.",
    pain:
      "High-volume support queues are processed manually by teams that spend most of their time on repetitive issues with known resolution patterns. Triage is inconsistent — routing depends on who reads the ticket. SLA monitoring is reactive, with breaches discovered after they happen. Knowledge is scattered across documentation sources and the heads of experienced team members.",
    promise:
      "ArqSupport resolves the routine autonomously, routes everything consistently, and prevents SLA breaches instead of reporting them — so senior staff spend judgment where it matters.",
    proof:
      "ArqSupport connects to the ticketing, communication, and knowledge systems your team already uses — ServiceNow, Jira, Zendesk, Teams, Slack — and goes live alongside the existing process before taking on autonomous resolution.",
    rollout: [
      "Workshop to define ticket categories, SLA thresholds, and knowledge base scope; audit existing documentation for ingestion.",
      "Knowledge base ingestion and vector store setup; configure the Triage, SLA Monitor, and Orchestrator agents.",
      "Triage Agent and SLA Monitor go live on the existing queue, running alongside the current process to validate routing accuracy.",
      "Resolution Agent deployed for L1 auto-resolution; analytics dashboard launched; knowledge base expanded from live gap analysis.",
    ],
    metrics: [
      { value: "40–60%", label: "L1 auto-resolution rate from knowledge base coverage" },
      { value: "30–50%", label: "MTTR improvement vs. manual triage baseline" },
      { value: "24/7", label: "Proactive SLA monitoring across the full ticket queue" },
    ],
    signals: [
      "High ticket volume with a large proportion of repetitive L1 issues that follow known resolution patterns",
      "Triage and routing are inconsistent, creating bottlenecks and misaligned SLA tracking by category",
      "SLA breaches are discovered after they happen rather than detected and escalated in advance",
      "Knowledge is scattered across documentation sources, making consistent resolution impossible to scale",
      "Support cost per ticket is too high relative to the complexity of the issues being handled",
    ],
    entryPoint: {
      name: "Support Queue Analysis",
      body: "A two-week review of ticket category distribution, resolution patterns, SLA performance, and knowledge base content inventory. Delivers a categorization map showing the L1 auto-resolution opportunity and a phased deployment plan for the agent architecture.",
    },
    faqs: [
      {
        q: "What is ArqSupport?",
        a: "ArqSupport is an agentic ticket and service management accelerator. AI agents triage every incoming ticket, auto-resolve L1 issues from your knowledge base, assist L2 with drafted resolutions, and monitor SLAs proactively — escalating before breaches occur, not after.",
      },
      {
        q: "What share of tickets can ArqSupport resolve automatically?",
        a: "Typically 40–60% of L1 tickets resolve without human composition, depending on knowledge base coverage. The Resolution Agent drafts from your SOPs, FAQs, and past cases; humans review and send, or the ticket resolves autonomously once confidence thresholds are met.",
      },
      {
        q: "Does ArqSupport replace our ticketing system?",
        a: "No. It connects to ServiceNow, Jira Service Management, Zendesk, or Freshservice and adds the agentic triage, resolution, and SLA layer on top of the queue you already run.",
      },
      {
        q: "Which teams use ArqSupport?",
        a: "IT operations, HR operations, finance operations, and shared services — any support team with high ticket volume and repetitive L1 categories. It supports cross-functional consolidation onto one agentic queue with per-function SLAs.",
      },
    ],
    keywords: [
      "AI ticket triage",
      "agentic ITSM automation",
      "L1 auto-resolution AI",
      "service desk AI agents",
      "proactive SLA monitoring",
      "IT support automation platform",
    ],
  },
  {
    id: "arqdataq",
    name: "ArqDataQ",
    category: "Data quality monitoring and remediation",
    track: "Horizontal",
    domain: "Cross-Industry · Data Engineering & Analytics",
    tagline:
      "Multi-agent data quality monitoring, anomaly detection, and autonomous remediation across your data estate.",
    summary:
      "ArqDataQ is a multi-agent data quality system that monitors pipelines in real time, classifies issues by type and severity, identifies root causes, and remediates known issue patterns autonomously — before end users ever see a problem.",
    builtFor: "Data engineering teams, analytics teams, CDOs, and any data-dependent enterprise",
    image: "/v5/assets/accel/arqdataq.jpg",
    heroImage: img("photo-1551288049-bebda4e38f71", 1600),
    secondaryImage: img("photo-1542744173-8e7e53415bb0", 1920),
    tertiaryImage: img("photo-1551076805-e1869033e561", 800),
    overview:
      "ArqDataQ is a multi-agent data quality system that continuously monitors, detects, and remediates data quality issues across an enterprise data estate. Unlike batch-run data quality tools that surface issues the day after they occur, ArqDataQ agents watch pipelines in real time, classify issues by type and severity, identify root causes, and remediate routine issues autonomously. It connects to the warehouse, transformation layer, and orchestration tools the data team already operates.",
    whatChanges:
      "ArqDataQ converts data quality from a reactive fire-fighting activity into a proactive, continuous, and increasingly automated process. Issues are detected when they enter the pipeline, not when they reach a leadership report. Known patterns are remediated without human intervention. The data team focuses on novel issues and capability expansion.",
    capabilities: [
      {
        title: "Real-time pipeline monitoring",
        body: "Agents monitor continuously, not in scheduled batch runs. Issues are detected at ingestion and transformation — collapsing time-to-detection from hours or days to seconds or minutes.",
      },
      {
        title: "Multi-agent remediation",
        body: "A Detection Agent identifies and classifies the issue, a Root Cause Agent traces it to its origin, and a Remediation Agent fixes known patterns autonomously. Novel issues route to the right engineer with full context.",
      },
      {
        title: "Data profiling and trust scoring",
        body: "Continuously updated quality scores per data asset across completeness, accuracy, consistency, timeliness, and uniqueness — so degradation is visible before it becomes a user-impacting incident.",
      },
      {
        title: "Anomaly detection across schema and content",
        body: "Detects missing values, schema drift, statistical outliers in value distributions, referential integrity failures, and temporal anomalies where data arrives out of order or late.",
      },
      {
        title: "Lineage-aware impact assessment",
        body: "When an issue is detected, the lineage graph is traversed to surface every downstream table, dashboard, and report affected — before any end user finds it.",
      },
      {
        title: "Self-improving detection",
        body: "As remediations are applied and validated, detection patterns improve. The system learns what constitutes a real issue versus a false positive in your specific environment, reducing alert noise over time.",
      },
    ],
    architecture: [
      "A Monitoring Agent runs continuously against pipeline outputs at each transformation stage, comparing against configured quality rules and historical baselines. A Classification Agent categorizes detected issues and assigns severity based on downstream impact.",
      "A Root Cause Agent traverses the lineage graph to identify the source of failure. A Remediation Agent applies automated fixes for known issue patterns, and a Notification Agent routes unresolved issues to the appropriate engineer with full context and root cause assembled.",
    ],
    useCases: [
      {
        title: "Financial reporting data",
        body: "Guarantee the numbers leadership sees are validated at every pipeline stage, not questioned in the meeting.",
      },
      {
        title: "Transaction pipelines",
        body: "Catch ingestion and transformation issues in seconds on high-volume operational data flows.",
      },
      {
        title: "Governance quality SLAs",
        body: "Meet data governance requirements with continuous monitoring, trust scoring, and a documented remediation trail.",
      },
    ],
    integrations: [
      "Snowflake, Databricks, BigQuery, Redshift, Azure Synapse",
      "dbt",
      "Alation, Atlan, DataHub, Collibra",
      "Apache Airflow, Prefect",
      "Tableau, Power BI, Looker",
    ],
    buyers:
      "Chief Data Officer and VP Data Platform; Head of Data Engineering and Director of Data Architecture; Director of Analytics and BI Lead; VP Finance for financial data quality; Data Governance Lead.",
    pain:
      "Data quality issues in most enterprises are discovered by end users, not by data teams: a report is questioned in a leadership meeting, a dashboard shows an implausible number. Manual data quality management is reactive and does not scale — as pipelines multiply, engineering time is consumed by fire-fighting rather than development.",
    promise:
      "ArqDataQ detects issues the moment they enter the pipeline, fixes known patterns autonomously, and tells you exactly what's affected downstream — before anyone else finds out.",
    proof:
      "ArqDataQ connects to the warehouse, dbt layer, and orchestration tools your data team already operates, adding the monitoring and remediation intelligence layer on top — the same accelerator across transaction, financial, and analytics pipelines.",
    rollout: [
      "Data estate profiling and quality baseline; identify critical pipelines for initial coverage and define quality rules and trust score methodology.",
      "Deploy the Monitoring Agent on critical pipelines; calibrate alert thresholds and routing rules with the data engineering team.",
      "Enable the Root Cause and Remediation Agents for the most common issue classes; track auto-remediation and false-positive rates.",
      "Integrate lineage for full downstream impact assessment; expand coverage and enable self-improving detection from the remediation feedback loop.",
    ],
    metrics: [
      { value: "Real-time", label: "Detection vs. day-after discovery in batch validation" },
      { value: "90%+", label: "Known issue patterns remediated without human intervention" },
      { value: "Zero", label: "End-user-discovered data incidents as the target outcome" },
    ],
    signals: [
      "Data quality issues are consistently discovered by end users or in leadership meetings rather than by the data team",
      "Engineering time is dominated by reactive quality incident response rather than pipeline development",
      "No visibility into pipeline health between scheduled batch runs means issues accumulate undetected",
      "Past incidents where bad data reached production reports have eroded trust in the data platform",
      "Governance requirements demand quality SLAs and continuous monitoring the current tooling cannot provide",
    ],
    entryPoint: {
      name: "Data Quality Baseline Audit",
      body: "A two-week profiling run across a defined set of critical pipelines. Delivers a quality score distribution, the top issue categories by frequency and estimated business impact, and a monitoring agent deployment plan with phase-by-phase coverage expansion.",
    },
    faqs: [
      {
        q: "What is ArqDataQ?",
        a: "ArqDataQ is a multi-agent data quality accelerator that monitors pipelines in real time, detects anomalies at ingestion and transformation, traces root causes through the lineage graph, and autonomously remediates known issue patterns — before bad data reaches dashboards or end users.",
      },
      {
        q: "How is ArqDataQ different from batch data quality tools?",
        a: "Batch tools surface issues the day after they occur. ArqDataQ agents watch continuously, collapsing detection from hours or days to seconds, and go beyond detection: 90%+ of known issue patterns are remediated without human intervention.",
      },
      {
        q: "What does 'lineage-aware impact assessment' mean?",
        a: "When an issue is detected, ArqDataQ traverses the dependency graph to immediately identify every downstream table, dashboard, and report affected — so the data team knows the full blast radius before any downstream user discovers a problem.",
      },
      {
        q: "What systems does ArqDataQ work with?",
        a: "Any ANSI SQL-compatible warehouse including Snowflake, Databricks, BigQuery, Redshift, and Azure Synapse; dbt for transformation; Airflow and Prefect for orchestration; and catalogs like Alation, Atlan, DataHub, and Collibra.",
      },
    ],
    keywords: [
      "data quality monitoring AI",
      "automated data remediation",
      "real-time data quality platform",
      "data trust scoring",
      "data pipeline anomaly detection",
      "multi-agent data quality",
    ],
  },
  {
    id: "arqvantage",
    name: "ArqVantage",
    category: "Competitive market intelligence and dynamic pricing",
    track: "Horizontal",
    domain: "Cross-Industry · E-Commerce & Revenue Management",
    tagline:
      "Competitive pricing intelligence and dynamic repricing with reasoning, governance, and product intelligence built in.",
    summary:
      "ArqVantage monitors competitor SKUs in real time, interprets why prices moved using LLM reasoning, and reprices within governance guardrails — with MAP compliance enforced automatically and a full audit trail on every pricing decision.",
    builtFor: "E-commerce brands, manufacturers, revenue management teams, and marketplace sellers",
    image: "/v5/assets/accel/arqvantage.jpg",
    heroImage: img("photo-1460925895917-afdab827c52f", 1600),
    secondaryImage: img("photo-1551288049-bebda4e38f71", 1920),
    tertiaryImage: img("photo-1543286386-713bdd548da4", 800),
    overview:
      "ArqVantage is a competitive market intelligence and dynamic pricing accelerator for brands selling through e-commerce marketplaces. Agents continuously monitor competitor SKU listings, interpret pricing signals using LLM reasoning to understand why prices changed rather than just that they did, and adjust prices within governance guardrails. A product intelligence layer surfaces catalog gaps, underserved categories, and market opportunities from ongoing competitor analysis.",
    whatChanges:
      "ArqVantage converts competitive pricing from a manual, lagging, context-free activity into a continuous, reasoning-driven process with governance built in. Pricing teams make better decisions faster. MAP compliance is enforced automatically. Product gaps are surfaced without manual competitive research.",
    capabilities: [
      {
        title: "Competitor SKU mapper agent",
        body: "Continuously maps competitor listings to your catalog across specified marketplaces — tracking new SKU launches, discontinued products, bundle changes, and catalog gaps. Always current, never a point-in-time snapshot.",
      },
      {
        title: "Price surveillance agent",
        body: "Real-time price monitoring across Amazon, competitor websites, and distributor portals. Tracks Buy Box status, promotional patterns, price trajectories, and velocity of change per SKU.",
      },
      {
        title: "LLM signal interpreter agent",
        body: "Classifies why a competitor moved: promotion, clearance, supply constraint, new-entrant response, or seasonal pattern. A competitor clearing inventory doesn't require price defense; a new entrant pricing aggressively does.",
      },
      {
        title: "Guardrail-governed repricing agent",
        body: "Adjusts prices within MAP floors, margin ceilings, and channel-specific constraints. Every adjustment is logged with the trigger, interpretation, guardrails applied, and resulting change — with human escalation beyond thresholds.",
      },
      {
        title: "Product intelligence agent",
        body: "Analyzes competitor catalogs against yours continuously — surfacing SKUs they carry that you don't, underserved high-demand categories, and product improvement signals in competitor review text.",
      },
      {
        title: "B2B and MAP protection",
        body: "Built-in awareness of MAP policies and B2B contract pricing commitments, so marketplace pricing never undermines channel agreements — the exposure no generic repricing tool covers.",
      },
    ],
    architecture: [
      "A data collection layer ingests marketplace data via the Amazon SP-API and Walmart Marketplace API, supplemented by structured monitoring for non-API sources. The SKU Mapper maintains the competitive catalog graph, updated continuously as competitor listings change.",
      "The Signal Interpreter runs on each detected price event to produce a classified signal record. The Repricing Agent queries this record, applies configured guardrails, and executes or escalates. The Product Intelligence Agent runs on a scheduled cadence analyzing catalog coverage and opportunity signals.",
    ],
    useCases: [
      {
        title: "Competitive response",
        body: "Detect and respond to competitor price moves in minutes, with reasoning attached — not days behind a manual review queue.",
      },
      {
        title: "MAP and channel protection",
        body: "Enforce MAP automatically across marketplaces and keep pricing consistent with B2B contract commitments.",
      },
      {
        title: "Catalog gap analysis",
        body: "Surface SKUs and categories competitors serve that you don't, ranked by review velocity and demand signals.",
      },
    ],
    integrations: [
      "Amazon Selling Partner API",
      "Walmart Marketplace API",
      "Competitive monitoring for non-API sources",
      "ERP & inventory systems",
      "B2B pricing & punchout catalog management",
      "Analytics & BI platforms",
    ],
    buyers:
      "VP E-Commerce and Director of Digital Commerce; Head of Revenue Management and Pricing Manager; Category Manager; VP Sales at manufacturers for channel pricing protection; Chief Revenue Officer.",
    pain:
      "Brands selling on Amazon, Walmart, and distributor platforms cannot manually monitor hundreds of competitor SKUs in real time. Existing repricing tools react to price thresholds but miss the context — a competitor dropping 30% means something entirely different if they're clearing inventory versus responding to a new entrant. And no generic repricing tool understands MAP policies or B2B contract pricing commitments.",
    promise:
      "ArqVantage watches the market continuously, explains price moves before reacting to them, and keeps every adjustment inside the guardrails your commercial and compliance teams set.",
    proof:
      "ArqVantage connects to your marketplace APIs, ERP, and B2B pricing systems, and every pricing decision carries an audit trail with trigger, reasoning, and approval state — critical for manufacturers with MAP policies and contract pricing.",
    rollout: [
      "Competitive Pricing Blind Spot Scan: monitor your top 50 SKUs versus the top 10 competitors for 30 days; deliver a pricing gap report and product opportunity matrix.",
      "Deploy the SKU Mapper and Price Surveillance agents on the full priority catalog; calibrate the Signal Interpreter against historical price movement data.",
      "Enable guardrail-governed repricing with defined MAP floors, margin ceilings, and escalation thresholds; establish human review for above-threshold decisions.",
      "Deploy the Product Intelligence Agent for ongoing catalog gap analysis; expand to full catalog coverage and integrate B2B pricing constraints.",
    ],
    metrics: [
      { value: "<5 min", label: "To detect and respond to a competitor price move" },
      { value: "10–15%", label: "Higher revenue than static, rule-based repricing" },
      { value: "100%", label: "MAP compliance enforced on every pricing decision" },
    ],
    signals: [
      "Competitor prices are monitored weekly or monthly in spreadsheets, creating a lag that costs margin or Buy Box share",
      "Buy Box ownership has been declining without a clear understanding of which competitor actions drive the loss",
      "Product catalog gaps versus competitors are unknown, leaving growth opportunities on the table",
      "MAP compliance is enforced by manual review, creating compliance exposure and inconsistent enforcement",
      "B2B contract prices risk being undermined by marketplace pricing managed without contract visibility",
    ],
    entryPoint: {
      name: "Competitive Pricing Blind Spot Scan",
      body: "Monitor your top 50 SKUs versus the top 10 competitors for 30 days. Delivers a pricing gap report, a product gap opportunity matrix, a repricing guardrail framework, and a model of what ArqVantage would have done differently over those 30 days against actual revenue performance.",
    },
    faqs: [
      {
        q: "What is ArqVantage?",
        a: "ArqVantage is a competitive pricing intelligence and dynamic repricing accelerator. AI agents monitor competitor SKUs in real time, use LLM reasoning to classify why prices moved, and reprice within MAP floors and margin guardrails — with a complete audit trail on every pricing decision.",
      },
      {
        q: "How is ArqVantage different from standard repricing tools?",
        a: "Standard repricers react to price thresholds without context. ArqVantage interprets the signal first — clearance, promotion, supply constraint, or new entrant — because each demands a different response. It's also the only approach with MAP policy and B2B contract pricing awareness built in.",
      },
      {
        q: "How fast does ArqVantage respond to competitor price moves?",
        a: "Under five minutes from detection to a governed price adjustment or escalation, versus days for manual review cycles. Deployments typically see 10–15% higher revenue than static rule-based repricing.",
      },
      {
        q: "Which marketplaces does ArqVantage support?",
        a: "Amazon via the Selling Partner API and Walmart via the Marketplace API, plus structured competitive monitoring for competitor websites and distributor portals without APIs.",
      },
    ],
    keywords: [
      "competitive pricing intelligence",
      "dynamic repricing AI",
      "MAP compliance automation",
      "Amazon repricing with reasoning",
      "competitor price monitoring AI",
      "e-commerce pricing governance",
    ],
  },
  {
    id: "arqsecops",
    name: "ArqSecOps",
    category: "Security operations and incident intelligence",
    track: "Horizontal",
    domain: "Cross-Industry · Cybersecurity & SecOps",
    tagline:
      "Alert triage, incident summaries, threat context, and compliance evidence for SecOps teams.",
    summary:
      "ArqSecOps is a SecOps intelligence layer that compresses time-to-context: it enriches alerts, correlates incidents, drafts audit-ready summaries, recommends response steps, and captures the evidence GRC needs — on top of your existing security stack.",
    builtFor: "Cybersecurity teams, SecOps, GRC, risk operations, and any regulated industry",
    image: "/v5/assets/accel/arqsecops.jpg",
    heroImage: img("photo-1550751827-4bd374c3f58b", 1600),
    secondaryImage: img("photo-1526374965328-7f61d4dc18c5", 1920),
    tertiaryImage: img("photo-1510915228340-29c85a43dcfe", 800),
    overview:
      "ArqSecOps is a SecOps intelligence layer that compresses time-to-context. It enriches alerts, correlates incidents, drafts summaries, recommends response steps, and captures the evidence GRC needs — so analysts spend their time on investigation and response, not manual context assembly and documentation. It connects to the SIEM, EDR, ticketing, and threat intel systems the team already runs and begins adding value from day one without replacing any tooling.",
    whatChanges:
      "ArqSecOps converts the analyst experience from fragmented context-gathering to a focused investigation workflow where context arrives with the alert. Analysts make faster, better-informed decisions. Documentation happens continuously. GRC has the evidence it needs without pulling analyst time after the fact.",
    capabilities: [
      {
        title: "Alert enrichment and correlation",
        body: "Adds asset ownership, identity, and threat-intel context to each alert automatically within seconds of arrival — linking related alerts into a single incident view instead of flooding analysts with notifications.",
      },
      {
        title: "Incident summarization",
        body: "Produces clear, consistent summaries at triage, shift change, and escalation. Standardized and audit-ready from the moment they're produced — never written from scratch by an analyst under pressure.",
      },
      {
        title: "Threat-intel context",
        body: "Pulls relevant intelligence from connected feeds automatically so analysts immediately understand the adversary technique or malware family — attached to the incident record, not researched independently by each analyst.",
      },
      {
        title: "Response recommendation",
        body: "Suggests next steps and relevant playbook actions grounded in the specific incident context. The agent recommends; the human decides and acts.",
      },
      {
        title: "Compliance evidence capture",
        body: "Records the full investigation and response trail in the structured format GRC and auditors need — a continuous output of the investigation process, not a retroactive reconstruction.",
      },
      {
        title: "Shift handoff support",
        body: "Generates a structured handoff document at shift change so every shift starts with a complete picture of open incidents and pending actions — no verbal briefings or incomplete notes.",
      },
    ],
    architecture: [
      "An alert enrichment agent processes each incoming alert against asset inventory, identity directories, and threat intel feeds within seconds, producing an enriched alert record before the analyst sees the notification.",
      "A correlation agent groups related alerts into incidents and updates context as new alerts arrive. A summarization agent generates natural-language summaries at defined trigger points, and an evidence agent captures the investigation timeline in a structured, auditable format.",
    ],
    useCases: [
      {
        title: "Tier-1 alert triage",
        body: "Cut dwell time with alerts that arrive enriched, correlated, and ranked — context assembled before the analyst opens them.",
      },
      {
        title: "Shift handoff and escalation",
        body: "Structured, consistent summaries at shift change and escalation replace verbal briefings and incomplete notes.",
      },
      {
        title: "GRC evidence packages",
        body: "Audit-ready investigation trails produced continuously, eliminating retroactive evidence assembly under deadline pressure.",
      },
    ],
    integrations: [
      "Splunk, Microsoft Sentinel, IBM QRadar, LogRhythm",
      "CrowdStrike, Microsoft Defender, SentinelOne",
      "Splunk SOAR, Palo Alto XSOAR",
      "MISP, Recorded Future, CrowdStrike Intelligence",
      "ServiceNow, Jira Service Management",
      "ServiceNow GRC, Archer, LogicGate",
    ],
    buyers:
      "CISO and Deputy CISO; Director of Security Operations and SOC Manager; VP of GRC and Head of Compliance; Head of Incident Response and Threat Intelligence Lead.",
    pain:
      "Security teams face three compounding challenges: alert volume no team can fully review, fragmented tooling that forces analysts to pivot between systems to assemble context, and compliance reporting that pulls skilled analysts away from active investigation. Mean time to context is too high in almost every security operation, critical alerts get buried, and GRC evidence is assembled retroactively under pressure.",
    promise:
      "ArqSecOps delivers context with the alert: enrichment in seconds, consistent audit-ready summaries, grounded response recommendations, and a continuous evidence trail.",
    proof:
      "ArqSecOps is an intelligence layer on top of the SIEM, EDR, SOAR, and ticketing stack you already run — not a rip-and-replace. It begins adding value from day one without replacing any tooling.",
    rollout: [
      "Connect SIEM, EDR, ticketing, threat intel, and policy sources; validate data ingestion and enrichment coverage.",
      "Calibrate severity thresholds, escalation rules, and response recommendation playbooks with the SOC team.",
      "Deploy analyst-assist for alert enrichment and incident summaries on the live queue alongside the existing process.",
      "Expand into automated evidence generation, shift handoff automation, and response-playbook execution for defined incident types.",
    ],
    metrics: [
      { value: "45%", label: "Less time on manual context gathering per analyst" },
      { value: "2x", label: "Faster incident summaries from alert to actionable output" },
      { value: "100%", label: "Evidence trail captured per incident for audit" },
    ],
    signals: [
      "Analysts spend more than 40% of their time gathering context rather than investigating and responding",
      "Incident summaries are inconsistent, produced late, or skipped during high-volume periods",
      "Tooling is fragmented across detection, investigation, and response, forcing analysts across multiple systems",
      "GRC needs better evidence packages from SecOps workflows, but pulling analyst time for documentation is recurring friction",
      "Alert volume has exceeded the team's capacity to review, and critical alerts risk being buried in noise",
    ],
    entryPoint: {
      name: "SecOps Coverage Gap Assessment",
      body: "A two-week review of alert volume, tooling integrations, context-assembly time per incident, and evidence practices. Delivers a context-assembly time benchmark, a tooling integration map, and a prioritized deployment sequence for the first 90 days.",
    },
    faqs: [
      {
        q: "What is ArqSecOps?",
        a: "ArqSecOps is a security operations intelligence accelerator that compresses time-to-context. It enriches every alert with asset, identity, and threat-intel context within seconds, correlates related alerts into incidents, drafts audit-ready summaries, recommends response steps, and captures the compliance evidence trail continuously.",
      },
      {
        q: "Does ArqSecOps replace our SIEM or EDR?",
        a: "No. It's an intelligence layer on top of the SIEM (Splunk, Sentinel, QRadar), EDR (CrowdStrike, Defender, SentinelOne), SOAR, and ticketing systems you already run — adding value from day one without replacing any tooling.",
      },
      {
        q: "Does ArqSecOps take response actions autonomously?",
        a: "Response recommendations are grounded in the specific incident context, but the analyst stays in command: the agent recommends, the human decides and acts. Every step is captured in the structured evidence trail.",
      },
      {
        q: "How does ArqSecOps help with compliance?",
        a: "The full investigation and response trail is recorded continuously in the structured format GRC and auditors need — eliminating retroactive evidence assembly. Evidence capture is a by-product of the investigation, not an extra documentation task.",
      },
    ],
    keywords: [
      "SOC alert triage AI",
      "security operations automation",
      "incident summarization AI",
      "SecOps intelligence layer",
      "compliance evidence automation",
      "alert enrichment and correlation",
    ],
  },
  {
    id: "arqeye",
    name: "ArqEye",
    category: "AI-native data observability and pipeline intelligence",
    track: "Horizontal",
    domain: "Cross-Industry · Data Engineering & Platform",
    tagline:
      "AI agents that watch your data estate continuously, so teams act on insight, not incident recovery.",
    summary:
      "ArqEye is an AI-native data observability platform that monitors the health, freshness, quality, and lineage of data assets continuously — detecting anomalies at ingestion, tracing failures to their origin, and enforcing SLAs per data product.",
    builtFor: "Data engineering, analytics engineering, BI teams, CDOs, and data-intensive SaaS",
    image: "/v5/assets/accel/arqeye.jpg",
    heroImage: img("photo-1558494949-ef010cbdcc31", 1600),
    secondaryImage: img("photo-1544197150-b99a580bb7a8", 1920),
    tertiaryImage: img("photo-1506399558188-acca6f8cbf41", 800),
    overview:
      "ArqEye is an AI-native data observability platform that monitors the health, freshness, quality, and lineage of data assets continuously across pipelines, warehouses, and data products. It moves data incident management from reactive discovery to proactive prevention — detecting anomalies at ingestion and transformation, tracing failures to their origin, enforcing SLAs per data product, and routing incidents with full context assembled rather than requiring manual investigation from scratch.",
    whatChanges:
      "ArqEye converts data incident management from reactive recovery into proactive monitoring. Issues are detected at the point of entry, not after reaching consumers. Root cause is surfaced by an agent rather than reconstructed manually from pipeline logs. Impact scope is known immediately through lineage mapping. SLAs are enforced continuously rather than reported on retroactively.",
    capabilities: [
      {
        title: "Anomaly detection agent",
        body: "Monitors volume, freshness, schema drift, null rates, and statistical distribution across tables and pipeline stages continuously — flagging deviations before they propagate to downstream consumers, dashboards, or ML pipelines.",
      },
      {
        title: "Data lineage intelligence",
        body: "Automatically maps and maintains the dependency graph of upstream sources and downstream consumers for every data asset. When a failure is detected, the full blast radius is known immediately.",
      },
      {
        title: "Incident root cause analysis",
        body: "An LLM agent traces a data quality failure back to its origin — source schema change, upstream load failure, transformation drift, or infrastructure event — and surfaces the root cause with evidence and remediation options.",
      },
      {
        title: "Data SLA enforcement",
        body: "Defines and continuously monitors freshness, completeness, and quality SLAs at the data product level — triggering alerts and automated fallback logic the moment a breach threshold is approached, not after it's missed.",
      },
      {
        title: "Schema drift detection",
        body: "Tracks schema changes across source systems and pipeline stages in real time. Unplanned changes fire an immediate alert with the change description and affected downstream assets, preventing silent data corruption.",
      },
      {
        title: "Data asset health scoring",
        body: "A continuously updated health score per data asset across completeness, accuracy, consistency, timeliness, and validity — with trends visible before degradation causes incidents.",
      },
    ],
    architecture: [
      "A collection agent layer connects to data warehouses, lakes, and streaming systems to capture metadata, statistics, and schema snapshots continuously. A detection agent runs anomaly models and threshold checks per asset and per pipeline stage.",
      "A lineage agent maintains the dependency graph and evaluates blast radius on each detected anomaly. An RCA agent chains against the lineage and change history to trace root cause. All findings route to a monitoring dashboard and alert channels with full context, evidence, and suggested remediation attached.",
    ],
    useCases: [
      {
        title: "Pipeline health monitoring",
        body: "Continuous volume, freshness, and distribution monitoring across warehouses, lakes, and streaming systems.",
      },
      {
        title: "ML and BI reliability",
        body: "Stop bad data from silently corrupting ML features and BI dashboards, with blast radius known in seconds.",
      },
      {
        title: "Data product SLAs",
        body: "Turn documented data SLAs into continuously enforced commitments with automated alerting and fallback logic.",
      },
    ],
    integrations: [
      "Snowflake, BigQuery, Redshift, Databricks",
      "Apache Airflow, dbt, Prefect, Dagster",
      "Apache Kafka, Confluent, AWS Kinesis",
      "Alation, Collibra, DataHub, Apache Atlas",
      "PagerDuty, OpsGenie, Slack, Microsoft Teams",
      "Tableau, Power BI, Looker, Metabase",
    ],
    buyers:
      "Head of Data Engineering and VP of Data Platform; Chief Data Officer and VP of Analytics; Head of Analytics Engineering and Director of Data Infrastructure; Platform Engineering leads at data-intensive SaaS companies.",
    pain:
      "Data teams discover quality issues when a dashboard breaks, an ML model produces unexpected outputs, or a stakeholder notices something wrong. By then the failure has propagated downstream, the root cause is buried in hours of pipeline logs, and the impact scope is unknown until manually traced. Data SLAs exist on paper with no automated mechanism to monitor or enforce them.",
    promise:
      "ArqEye detects issues at the point of entry, surfaces root cause automatically, knows the blast radius instantly, and enforces data SLAs continuously.",
    proof:
      "ArqEye connects to your existing data infrastructure — warehouses, orchestration, streaming, catalogs, and alerting — without replacing it, adding a continuous monitoring and intelligence layer across any platform or cloud environment.",
    rollout: [
      "Connect the data warehouse, primary pipelines, and orchestration tool; baseline volume, freshness, and schema patterns across priority assets.",
      "Deploy anomaly detection and schema drift detection on production data flows; set SLA thresholds for priority data products; validate against recent incident history.",
      "Enable lineage intelligence and root cause analysis; wire alerts to existing incident channels; begin SLA enforcement automation.",
      "Expand coverage to the full data estate; activate health scoring dashboards; calibrate thresholds from observed true/false positive rates.",
    ],
    metrics: [
      { value: "80%", label: "Reduction in time to detect data quality incidents" },
      { value: "60%", label: "Drop in mean time to resolution via root cause analysis" },
      { value: "90%", label: "Fewer downstream errors reaching BI layers and ML models" },
    ],
    signals: [
      "Data quality issues are discovered by downstream consumers, BI users, or ML engineers rather than the data team",
      "Root cause investigation requires manual log analysis that takes hours and blocks the engineering team",
      "Schema changes from source systems cause silent downstream failures detected only when a report or model breaks",
      "Data SLAs exist as documented commitments with no automated mechanism to monitor or enforce them",
      "The data team spends significant time on reactive incident response and wants to shift to proactive quality management",
    ],
    entryPoint: {
      name: "Data Observability Maturity Assessment",
      body: "A two-week analysis of recent data incidents, detection lag times, root cause investigation hours, and current SLA compliance across priority data products. Delivers a maturity score, a gap analysis against observability best practice, and a prioritized ArqEye deployment roadmap.",
    },
    faqs: [
      {
        q: "What is ArqEye?",
        a: "ArqEye is an AI-native data observability accelerator. Agents continuously monitor the health, freshness, quality, and lineage of data assets across pipelines and warehouses — detecting anomalies at ingestion, tracing root causes automatically, and enforcing SLAs per data product.",
      },
      {
        q: "How is ArqEye different from ArqDataQ?",
        a: "ArqEye is the observability platform: estate-wide health, freshness, lineage, schema drift, and SLA enforcement. ArqDataQ is the quality remediation system: detecting and autonomously fixing data quality issues in pipelines. They share the governed agent spine and are often deployed together.",
      },
      {
        q: "How does ArqEye find the root cause of a data incident?",
        a: "An LLM agent chains against the lineage graph and change history to trace a failure back to its origin — a source schema change, upstream load failure, transformation drift, or infrastructure event — and surfaces it with evidence and remediation options in seconds instead of hours of manual log analysis.",
      },
      {
        q: "What infrastructure does ArqEye support?",
        a: "Warehouses including Snowflake, BigQuery, Redshift, and Databricks; orchestration via Airflow, dbt, Prefect, and Dagster; streaming via Kafka, Confluent, and Kinesis; catalogs like Alation, Collibra, and DataHub; and alerting through PagerDuty, OpsGenie, Slack, and Teams.",
      },
    ],
    keywords: [
      "data observability platform",
      "AI data pipeline monitoring",
      "data lineage intelligence",
      "data SLA enforcement",
      "schema drift detection",
      "data incident root cause analysis",
    ],
  },
];

export function getAccelerator(id: string) {
  return accelerators.find((accelerator) => accelerator.id === id);
}

export const verticalAccelerators = accelerators.filter((a) => a.track === "Vertical");
export const horizontalAccelerators = accelerators.filter((a) => a.track === "Horizontal");
