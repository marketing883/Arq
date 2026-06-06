export type AcceleratorCapability = { title: string; body: string };
export type AcceleratorUseCase = { title: string; body: string };

export type Accelerator = {
  id: string;
  name: string;
  category: string;
  tagline: string;
  summary: string;
  builtFor: string;
  image: string;
  heroImage: string;
  secondaryImage: string;
  tertiaryImage: string;
  overview: string;
  capabilities: AcceleratorCapability[];
  useCases: AcceleratorUseCase[];
  integrations: string[];
  pain: string;
  promise: string;
  proof: string;
  rollout: string[];
  metrics: { value: string; label: string }[];
  signals: string[];
};

// Optimized Unsplash delivery. `w` controls the crop width; auto=format serves
// AVIF/WebP, q=80 keeps it sharp but light.
const img = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const accelerators: Accelerator[] = [
  {
    id: "veyra",
    name: "Veyra",
    category: "Payment integrity and fraud intelligence",
    tagline: "Fraud, waste, abuse, and claims-leakage intelligence for payer operations.",
    summary:
      "Detect billing anomalies, provider risk, claims leakage, and program-integrity signals with explainable AI built for healthcare payer workflows.",
    builtFor: "Healthcare payers, TPAs, PBMs, and program-integrity teams",
    image: img("photo-1576091160550-2173dba999ef", 1200),
    heroImage: img("photo-1576091160550-2173dba999ef", 1600),
    secondaryImage: img("photo-1517120026326-d87759a7b63b", 1920),
    tertiaryImage: img("photo-1516549655169-df83a0774514", 800),
    overview:
      "Veyra is a payment-integrity intelligence layer for healthcare payers. It reads across claims, providers, policy, and member context to surface the cases most likely to be fraud, waste, abuse, or leakage — and explains the reasoning clearly enough for an investigator to act on and defend.",
    capabilities: [
      {
        title: "Cross-signal anomaly detection",
        body: "Correlates billing patterns, provider behavior, and member history into one risk picture instead of thousands of isolated rule hits.",
      },
      {
        title: "Explainable case scoring",
        body: "Every flagged case carries the evidence, peer comparisons, and policy references a reviewer needs — no black-box scores.",
      },
      {
        title: "Provider risk profiling",
        body: "Builds a longitudinal view of each provider so emerging risk is visible before it compounds into material leakage.",
      },
      {
        title: "Reviewer workbench",
        body: "Routes the highest-value cases to investigators with context, suggested next steps, and a clean, exportable audit trail.",
      },
      {
        title: "Continuous calibration",
        body: "Learns from investigation outcomes and recoveries so prioritization keeps sharpening against your real results.",
      },
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
      "Claims platforms (Facets, QNXT)",
      "Policy & edit engines",
      "Provider directories",
      "Data warehouse / lakehouse",
      "Case management",
      "BI & reporting",
    ],
    pain:
      "Payment-integrity teams are buried in claim volume, brittle rules, and cases that arrive too late to protect margin. The highest-risk patterns sit across claims, providers, policy, and member context — and no single system sees all of it.",
    promise:
      "Veyra prioritizes the cases worth human attention, explains why they matter, and keeps the evidence trail clean enough for downstream recovery and audit.",
    proof:
      "Built from payer fraud, waste, abuse, and claims-review patterns already appearing across ArqAI healthcare work, with governance-first review loops and auditable recommendations.",
    rollout: [
      "Load a sample claims and provider-history slice.",
      "Calibrate risk signals against known leakage and investigation outcomes.",
      "Deploy a reviewer workbench with explanations, evidence, and routing.",
      "Expand from sampled review to active queue prioritization.",
    ],
    metrics: [
      { value: "30%+", label: "More high-value cases surfaced" },
      { value: "2x", label: "Faster review triage" },
      { value: "100%", label: "Decision evidence captured" },
    ],
    signals: [
      "Rules generate too many low-value flags",
      "SIU and claims-review teams need better prioritization",
      "Provider risk context is scattered across systems",
      "Leadership wants payment-integrity value without a black box",
    ],
  },
  {
    id: "luma",
    name: "Luma",
    category: "Claims triage and decision support",
    tagline: "AI-assisted claims intake, enrichment, routing, and reviewer support.",
    summary:
      "Prioritize, route, enrich, and resolve claims faster with decision support that respects policy, evidence, and human authority.",
    builtFor: "Healthcare, insurance, benefits, and claims operations",
    image: img("photo-1554224155-1696413565d3", 1200),
    heroImage: img("photo-1554224155-1696413565d3", 1600),
    secondaryImage: img("photo-1521791055366-0d553872125f", 1920),
    tertiaryImage: img("photo-1619418602850-35ad20aa1700", 800),
    overview:
      "Luma turns claims intake into a governed triage flow. It enriches each file, checks it against policy, flags missing evidence, and recommends the next action — while every decision stays with your reviewers and every override is captured.",
    capabilities: [
      {
        title: "Intelligent intake & classification",
        body: "Reads documents and structured data on arrival, classifies the claim type, and starts the file with the right context attached.",
      },
      {
        title: "Completeness & evidence checks",
        body: "Detects missing documents and inconsistencies up front so files don't stall halfway through review.",
      },
      {
        title: "Policy-aware routing",
        body: "Applies the right policy checks per claim type and routes to the correct queue or reviewer automatically.",
      },
      {
        title: "Reviewer copilot",
        body: "Summarizes the file, surfaces the relevant policy, and recommends a next-best action the reviewer can accept or override.",
      },
      {
        title: "Override capture & learning",
        body: "Records every reviewer decision and override to tune routing and evidence prompts over time.",
      },
    ],
    useCases: [
      {
        title: "First-notice-of-loss triage",
        body: "Classify, enrich, and prioritize new claims the moment they arrive.",
      },
      {
        title: "Coverage & documentation review",
        body: "Check files against coverage rules and flag what's missing before a human opens them.",
      },
      {
        title: "Complex-claim escalation",
        body: "Spot the files that need senior review early and route them with full context.",
      },
    ],
    integrations: [
      "Claims & policy admin (Guidewire, Duck Creek)",
      "Document & content stores",
      "Email / intake channels",
      "Knowledge bases",
      "Workflow / BPM",
      "Data warehouse",
    ],
    pain:
      "Claims teams lose time on incomplete files, manual routing, repetitive documentation checks, and reviews that should have been escalated earlier.",
    promise:
      "Luma turns intake into a governed triage flow — enriching the file, identifying missing evidence, recommending next action, and keeping reviewers in control.",
    proof:
      "The accelerator combines claims operating patterns with policy-aware routing, evidence capture, and human-in-the-loop decision support.",
    rollout: [
      "Map claim types, queues, policy checks, and escalation rules.",
      "Connect document, claim, and knowledge sources.",
      "Launch triage recommendations beside the existing reviewer process.",
      "Tune routing and evidence prompts from reviewer feedback.",
    ],
    metrics: [
      { value: "40%", label: "Less manual intake effort" },
      { value: "2x", label: "Faster routing decisions" },
      { value: "100%", label: "Reviewer override captured" },
    ],
    signals: [
      "Claims arrive incomplete or misrouted",
      "Review teams spend too much time summarizing files",
      "Policy checks differ across teams",
      "Leaders need cycle-time improvement without losing control",
    ],
  },
  {
    id: "sentra",
    name: "Sentra",
    category: "Financial crime and customer risk",
    tagline: "AML, KYC, sanctions, ownership, and alert-triage automation.",
    summary:
      "Automate financial-crime workflows with explainable triage, customer risk context, and analyst-ready evidence.",
    builtFor: "Banks, fintechs, credit unions, and financial institutions",
    image: img("photo-1582139329536-e7284fece509", 1200),
    heroImage: img("photo-1582139329536-e7284fece509", 1600),
    secondaryImage: img("photo-1592698765727-387c9464cd7f", 1920),
    tertiaryImage: img("photo-1616803140344-6682afb13cda", 800),
    overview:
      "Sentra is an analyst-first financial-crime accelerator. It clears alert noise, assembles customer risk context, and drafts examiner-ready narratives across AML, KYC, sanctions, and CDD — keeping disposition authority firmly with your team.",
    capabilities: [
      {
        title: "Alert triage & deduplication",
        body: "Groups related alerts, suppresses obvious noise, and ranks what actually needs an analyst's eyes.",
      },
      {
        title: "Customer risk context",
        body: "Assembles CDD/EDD context — ownership, behavior, history — into one view instead of ten tabs.",
      },
      {
        title: "Sanctions & adverse-media support",
        body: "Helps adjudicate screening hits with the context to clear false matches faster and escalate true ones.",
      },
      {
        title: "SAR narrative drafting",
        body: "Drafts structured, evidence-backed narratives the analyst edits and approves — not auto-files.",
      },
      {
        title: "Audit-ready decision trails",
        body: "Every recommendation and disposition is logged with rationale for examiners and QA.",
      },
    ],
    useCases: [
      {
        title: "Transaction-monitoring triage",
        body: "Cut through alert backlog and focus analysts on genuine risk.",
      },
      {
        title: "Onboarding & periodic KYC",
        body: "Speed up due-diligence assembly for new and reviewed customers.",
      },
      {
        title: "Sanctions hit adjudication",
        body: "Clear false positives quickly while preserving a defensible record.",
      },
    ],
    integrations: [
      "Core banking",
      "Transaction monitoring (Actimize, etc.)",
      "KYC / onboarding platforms",
      "Sanctions & watchlist providers",
      "Case management",
      "Data warehouse",
    ],
    pain:
      "Financial-crime teams face rising alert volume, examiner pressure, thin analyst capacity, and onboarding flows that frustrate good customers.",
    promise:
      "Sentra helps analysts clear noise faster, escalate real risk earlier, and keep defensible evidence across AML, KYC, sanctions, and CDD workflows.",
    proof:
      "Built from banking use cases around AML, KYC, SAR support, and sanctions screening, with audit-first recommendations and reviewer authority.",
    rollout: [
      "Assess alert queues, risk typologies, and customer data sources.",
      "Calibrate alert explanations and disposition recommendations.",
      "Deploy analyst support for triage, enrichment, and narrative drafting.",
      "Expand into KYC, sanctions, or ongoing monitoring based on value.",
    ],
    metrics: [
      { value: "60%", label: "Less alert fatigue" },
      { value: "3x", label: "Faster CDD assembly" },
      { value: "100%", label: "Examiner-ready rationale" },
    ],
    signals: [
      "Alert queues grow faster than analyst capacity",
      "CDD evidence is manually assembled",
      "SAR narratives take too long to draft",
      "Compliance wants explainable automation, not opaque scoring",
    ],
  },
  {
    id: "nuvia",
    name: "Nuvia",
    category: "Loyalty and personalization automation",
    tagline: "Next-best offers, retention actions, and customer engagement workflows.",
    summary:
      "Turn customer, transaction, and behavioral data into personalized offers and retention actions with operational guardrails.",
    builtFor: "Retail, QSR, consumer brands, and loyalty teams",
    image: img("photo-1481437156560-3205f6a55735", 1200),
    heroImage: img("photo-1481437156560-3205f6a55735", 1600),
    secondaryImage: img("photo-1483985988355-763728e1935b", 1920),
    tertiaryImage: img("photo-1556742502-ec7c0e9f34b1", 800),
    overview:
      "Nuvia turns customer, transaction, and product signals into the next useful action for each segment — offers, retention nudges, and associate prompts — all inside your margin, inventory, and consent guardrails, learning from every campaign.",
    capabilities: [
      {
        title: "Next-best-action recommendations",
        body: "Decides the most valuable action for each customer segment, not just the same broad discount for everyone.",
      },
      {
        title: "Guardrailed offer logic",
        body: "Keeps every recommendation inside margin, inventory, brand, and consent rules you define.",
      },
      {
        title: "Segment & lifecycle modeling",
        body: "Identifies high-value, at-risk, and reactivation segments from behavior, not guesswork.",
      },
      {
        title: "Campaign response learning",
        body: "Measures what actually changed behavior and folds it back into the next recommendation.",
      },
      {
        title: "Associate & channel prompts",
        body: "Surfaces the right nudge in-store or in-app at the moment it can change the outcome.",
      },
    ],
    useCases: [
      {
        title: "Personalized offers & retention",
        body: "Move from blanket promos to per-segment offers that protect margin.",
      },
      {
        title: "Replenishment & win-back",
        body: "Trigger timely nudges before churn or stock-driven drop-off.",
      },
      {
        title: "In-store next-best-action",
        body: "Give associates a clear, guardrailed prompt for each customer.",
      },
    ],
    integrations: [
      "POS systems",
      "Loyalty / CDP",
      "E-commerce platform",
      "Inventory & merchandising",
      "Marketing / ESP",
      "BI & analytics",
    ],
    pain:
      "Loyalty programs often become static discount engines. Teams know they have useful customer signals, but campaign operations cannot react fast enough.",
    promise:
      "Nuvia identifies the next useful action for each customer segment, keeps offers inside margin and policy guardrails, and learns from campaign response.",
    proof:
      "The accelerator draws on retail personalization, inventory, pricing, and store-operations patterns that need fast action with clear business rules.",
    rollout: [
      "Unify customer, transaction, product, and campaign signals.",
      "Define margin, inventory, consent, and brand guardrails.",
      "Launch offer recommendations for a narrow customer segment.",
      "Expand into retention, replenishment, and store-associate prompts.",
    ],
    metrics: [
      { value: "20%+", label: "Repeat-revenue lift target" },
      { value: "30%", label: "Less stale incentive spend" },
      { value: "1:1", label: "Offer logic with guardrails" },
    ],
    signals: [
      "Campaign teams rely on broad segments",
      "Loyalty spend is hard to tie to behavior change",
      "Customer, product, and inventory data are disconnected",
      "Consent and margin rules must be built in",
    ],
  },
  {
    id: "kyra",
    name: "Kyra",
    category: "Network and service operations",
    tagline: "Incident detection, ticket enrichment, escalation, and service restoration.",
    summary:
      "Accelerate network and service operations by turning telemetry, tickets, runbooks, and history into governed recommendations.",
    builtFor: "Telecom, managed services, enterprise IT, and operations teams",
    image: img("photo-1558494949-ef010cbdcc31", 1200),
    heroImage: img("photo-1558494949-ef010cbdcc31", 1600),
    secondaryImage: img("photo-1544197150-b99a580bb7a8", 1920),
    tertiaryImage: img("photo-1506399558188-acca6f8cbf41", 800),
    overview:
      "Kyra gives network and service operations a working memory. It correlates telemetry, tickets, and runbooks into enriched incidents with a recommended next action — and turns every event into reusable operational knowledge.",
    capabilities: [
      {
        title: "Alert correlation & enrichment",
        body: "Collapses noisy alert storms into a single enriched incident with the context that matters.",
      },
      {
        title: "Runbook retrieval & guided resolution",
        body: "Pulls the right runbook step at the right moment so Tier-1 can resolve more without escalating.",
      },
      {
        title: "Escalation routing with context",
        body: "When escalation is needed, the next team gets the full evidence trail, not a bare ticket.",
      },
      {
        title: "SLA-aware prioritization",
        body: "Ranks incidents against SLA risk and business impact, not just arrival order.",
      },
      {
        title: "Operational memory",
        body: "Captures how each incident was resolved so the next similar event is faster to close.",
      },
    ],
    useCases: [
      {
        title: "Incident triage & enrichment",
        body: "Turn raw alerts into actionable, context-rich incidents automatically.",
      },
      {
        title: "Tier-1 guided resolution",
        body: "Help front-line teams resolve more on first touch.",
      },
      {
        title: "Outage correlation & escalation",
        body: "Connect related signals fast and route major incidents cleanly.",
      },
    ],
    integrations: [
      "ITSM (ServiceNow)",
      "Monitoring & telemetry",
      "Topology / CMDB",
      "Runbooks & knowledge",
      "Paging (PagerDuty)",
      "Collaboration (Slack/Teams)",
    ],
    pain:
      "Operations teams lose time correlating alerts, rewriting tickets, searching runbooks, and escalating incidents without enough context.",
    promise:
      "Kyra enriches incidents, recommends the next action, routes escalations, and builds a cleaner operational memory from every event.",
    proof:
      "The accelerator starts from service-operations and network workflow patterns where speed, evidence, and handoff quality matter most.",
    rollout: [
      "Connect ticket, telemetry, topology, and runbook sources.",
      "Model incident categories, escalation paths, and SLA rules.",
      "Deploy enrichment and recommended-action support beside existing tools.",
      "Automate low-risk routing and documentation after reviewer validation.",
    ],
    metrics: [
      { value: "35%", label: "Faster ticket enrichment" },
      { value: "25%", label: "Lower mean handoff time" },
      { value: "Full", label: "Operational memory captured" },
    ],
    signals: [
      "Incident context is scattered across tools",
      "Tier-1 teams escalate without enough evidence",
      "Runbooks exist but are not used consistently",
      "Service leaders need better triage without replacing ITSM",
    ],
  },
  {
    id: "orbis",
    name: "Orbis",
    category: "Supply chain and vendor risk",
    tagline: "Supplier risk, procurement exposure, contract signals, and shipment exceptions.",
    summary:
      "Monitor supplier, procurement, logistics, and operational dependency signals so teams can act before disruption becomes a business event.",
    builtFor: "Energy, manufacturing, logistics, and procurement teams",
    image: img("photo-1494412519320-aa613dfb7738", 1200),
    heroImage: img("photo-1494412519320-aa613dfb7738", 1600),
    secondaryImage: img("photo-1605745341112-85968b19335b", 1920),
    tertiaryImage: img("photo-1493946740644-2d8a1f1a6aff", 800),
    overview:
      "Orbis watches your supplier and logistics dependency graph for risk — across contracts, ERP, shipments, quality data, and external signals — and routes exposure-backed actions to the right owner before disruption becomes a business event.",
    capabilities: [
      {
        title: "Dependency-graph monitoring",
        body: "Maps suppliers, SKUs, plants, and lanes so you can see what a single failure actually puts at risk.",
      },
      {
        title: "External signal fusion",
        body: "Blends news, weather, financial, and logistics signals with your internal records.",
      },
      {
        title: "Exposure quantification",
        body: "Translates a risk signal into the revenue, SKUs, or commitments it threatens.",
      },
      {
        title: "Exception & disruption alerts",
        body: "Flags shipment, quality, and contract exceptions early — not in next month's report.",
      },
      {
        title: "Mitigation action routing",
        body: "Sends the right action to procurement, operations, or risk owners with the context to act.",
      },
    ],
    useCases: [
      {
        title: "Supplier risk monitoring",
        body: "Continuously watch critical suppliers instead of periodic spreadsheet reviews.",
      },
      {
        title: "Shipment exception management",
        body: "Catch and route delays and disruptions before they hit the line.",
      },
      {
        title: "Procurement exposure reviews",
        body: "Quantify and act on concentration and contract risk.",
      },
    ],
    integrations: [
      "ERP (SAP, Oracle)",
      "Procurement (Coupa, Ariba)",
      "Logistics / TMS",
      "Contract repositories",
      "External risk feeds",
      "BI & reporting",
    ],
    pain:
      "Supplier and shipment risks appear across contracts, ERP records, emails, news, quality data, and logistics tools long before they show up in a monthly report.",
    promise:
      "Orbis watches the dependency graph, highlights exposure, and routes the right action to procurement, operations, or risk owners.",
    proof:
      "The accelerator is shaped around supply-chain and vendor-risk workflows where external signals must be tied back to internal exposure.",
    rollout: [
      "Map suppliers, contracts, SKUs, plants, and critical dependencies.",
      "Connect ERP, procurement, logistics, and external risk signals.",
      "Launch exception monitoring for a focused supplier or lane segment.",
      "Expand into proactive mitigation planning and executive reporting.",
    ],
    metrics: [
      { value: "Early", label: "Risk signal detection" },
      { value: "360°", label: "Supplier context view" },
      { value: "1", label: "Exposure-backed action queue" },
    ],
    signals: [
      "Supplier risk is handled in spreadsheets",
      "Critical dependencies are not visible until disruption",
      "Procurement and operations lack shared context",
      "Leaders need risk action, not just risk reporting",
    ],
  },
  {
    id: "astra",
    name: "Astra",
    category: "Enterprise service workflow automation",
    tagline: "Classify, route, resolve, and govern enterprise service workflows.",
    summary:
      "Automate service workflows across ITSM, shared services, knowledge bases, and operating tools while preserving approvals and auditability.",
    builtFor: "Enterprise IT, shared services, HR ops, finance ops, and support teams",
    image: img("photo-1497366754035-f200968a6e72", 1200),
    heroImage: img("photo-1497366754035-f200968a6e72", 1600),
    secondaryImage: img("photo-1556761175-4b46a572b786", 1920),
    tertiaryImage: img("photo-1531973576160-7125cd663d86", 800),
    overview:
      "Astra automates internal service workflows end to end — classifying requests, retrieving the right answer, executing low-risk steps, and routing exceptions with full context — while preserving the approvals and audit trail your controls require.",
    capabilities: [
      {
        title: "Request classification",
        body: "Reads each request, detects intent, and starts it on the right path automatically.",
      },
      {
        title: "Knowledge retrieval & answers",
        body: "Finds the current, correct answer from your knowledge base instead of stale macros.",
      },
      {
        title: "Permission-aware actions",
        body: "Executes low-risk steps within scoped permissions — never beyond what policy allows.",
      },
      {
        title: "Exception routing",
        body: "Hands off the cases that need a human with the context already assembled.",
      },
      {
        title: "Approval & audit preservation",
        body: "Keeps every approval and action logged so internal controls stay intact.",
      },
    ],
    useCases: [
      {
        title: "IT service-desk deflection",
        body: "Resolve repeat requests automatically and free up agents.",
      },
      {
        title: "HR & finance shared services",
        body: "Handle common employee requests with consistent, governed answers.",
      },
      {
        title: "Employee onboarding tasks",
        body: "Coordinate provisioning and access steps across systems.",
      },
    ],
    integrations: [
      "ITSM (ServiceNow, Jira)",
      "Identity (Okta, Active Directory)",
      "Knowledge bases",
      "HRIS / ERP",
      "Collaboration (Slack, Teams)",
      "Email / ticketing",
    ],
    pain:
      "Internal service teams are buried in repetitive requests, inconsistent routing, stale knowledge, and handoffs that slow employees down.",
    promise:
      "Astra classifies the request, retrieves the right answer, executes low-risk steps, and routes exceptions with the context a human needs.",
    proof:
      "The accelerator packages enterprise service-workflow patterns with knowledge retrieval, permission-aware actions, and service-desk integration.",
    rollout: [
      "Select one request family with volume and clear policy boundaries.",
      "Connect ITSM, knowledge, identity, and operating tools.",
      "Deploy guided resolution and agent-assist for service teams.",
      "Automate approved low-risk actions with monitoring and review.",
    ],
    metrics: [
      { value: "50%", label: "Routine request deflection" },
      { value: "2x", label: "Faster first response" },
      { value: "Full", label: "Approval trail preserved" },
    ],
    signals: [
      "Tickets repeat but are still handled manually",
      "Knowledge exists but is hard to apply at request time",
      "Routing mistakes create employee frustration",
      "Leaders need automation that respects internal controls",
    ],
  },
  {
    id: "vantaq",
    name: "Vantaq",
    category: "Security operations and incident intelligence",
    tagline: "Alert triage, incident summaries, threat context, and compliance evidence.",
    summary:
      "Help SecOps teams triage alerts, summarize incidents, enrich threat context, recommend response actions, and generate evidence.",
    builtFor: "Cybersecurity, SecOps, GRC, and risk teams",
    image: img("photo-1550751827-4bd374c3f58b", 1200),
    heroImage: img("photo-1550751827-4bd374c3f58b", 1600),
    secondaryImage: img("photo-1526374965328-7f61d4dc18c5", 1920),
    tertiaryImage: img("photo-1510915228340-29c85a43dcfe", 800),
    overview:
      "Vantaq is a SecOps copilot that compresses time-to-context. It enriches alerts, correlates incidents, drafts summaries, recommends response steps, and captures the evidence GRC needs — so analysts spend their time on investigation, not assembly.",
    capabilities: [
      {
        title: "Alert enrichment & correlation",
        body: "Adds asset, identity, and threat context to alerts and links related ones into a single incident.",
      },
      {
        title: "Incident summarization",
        body: "Produces a clear, consistent incident summary analysts and leaders can act on immediately.",
      },
      {
        title: "Threat-intel context",
        body: "Pulls relevant threat intelligence so analysts understand what they're looking at, fast.",
      },
      {
        title: "Response recommendation",
        body: "Suggests next steps and playbook actions, keeping the analyst in command of execution.",
      },
      {
        title: "Compliance evidence capture",
        body: "Records the investigation and response trail GRC and auditors need for review.",
      },
    ],
    useCases: [
      {
        title: "Tier-1 alert triage",
        body: "Cut dwell time by enriching and ranking alerts automatically.",
      },
      {
        title: "Incident summary & handoff",
        body: "Generate consistent summaries for shift change and escalation.",
      },
      {
        title: "Post-incident evidence",
        body: "Assemble the report and evidence package without manual collation.",
      },
    ],
    integrations: [
      "SIEM (Splunk, Sentinel)",
      "EDR / XDR",
      "SOAR",
      "Threat intel platforms",
      "Ticketing / case management",
      "GRC tooling",
    ],
    pain:
      "Security teams face alert overload, fragmented tooling, and reporting demands that pull analysts away from investigation and response.",
    promise:
      "Vantaq enriches alerts, summarizes incidents, recommends next steps, and captures the evidence needed for compliance and post-incident review.",
    proof:
      "The accelerator combines incident intelligence, workflow governance, and audit-ready evidence patterns for security operations.",
    rollout: [
      "Connect SIEM, EDR, ticketing, threat intel, and policy sources.",
      "Calibrate severity, escalation, and response-recommendation rules.",
      "Deploy analyst-assist for alert enrichment and incident summaries.",
      "Expand into evidence generation and response-playbook automation.",
    ],
    metrics: [
      { value: "45%", label: "Less manual context gathering" },
      { value: "2x", label: "Faster incident summaries" },
      { value: "100%", label: "Evidence trail for review" },
    ],
    signals: [
      "Analysts spend too much time gathering context",
      "Incident summaries are inconsistent or late",
      "Tooling is fragmented across detection and response",
      "GRC teams need better evidence from SecOps workflows",
    ],
  },
];

export function getAccelerator(id: string) {
  return accelerators.find((accelerator) => accelerator.id === id);
}
