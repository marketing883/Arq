export type Accelerator = {
  id: string;
  name: string;
  category: string;
  tagline: string;
  summary: string;
  builtFor: string;
  image: string;
  pain: string;
  promise: string;
  proof: string;
  rollout: string[];
  metrics: { value: string; label: string }[];
  signals: string[];
};

export const accelerators: Accelerator[] = [
  {
    id: "veyra",
    name: "Veyra",
    category: "Payment integrity and fraud intelligence",
    tagline: "Fraud, waste, abuse, and claims leakage intelligence for payer operations.",
    summary:
      "Detect billing anomalies, provider risk, claims leakage, and program-integrity signals with explainable AI built for healthcare payer workflows.",
    builtFor: "Healthcare payers, TPAs, PBMs, and program-integrity teams",
    image: "/img/services/Healthcare-Real-Time-Risk-Stratification-With-Built-In-Compliance.jpg",
    pain:
      "Payment integrity teams are buried in claim volume, brittle rules, and cases that arrive too late to protect margin. The highest-risk patterns often sit across claims, providers, policy, and member context.",
    promise:
      "Veyra prioritizes the cases worth human attention, explains why they matter, and keeps the evidence trail clean enough for downstream action.",
    proof:
      "Built from payer fraud, waste, abuse, and claims review patterns already appearing across ArqAI healthcare work, with governance-first review loops and auditable recommendations.",
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
      "SIU and claims review teams need better prioritization",
      "Provider risk context is scattered across systems",
      "Leadership wants payment integrity value without a black box",
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
    image: "/img/services/use-case-2.webp",
    pain:
      "Claims teams lose time on incomplete files, manual routing, repetitive documentation checks, and reviews that should have been escalated earlier.",
    promise:
      "Luma turns intake into a governed triage flow, enriching the file, identifying missing evidence, recommending next action, and keeping reviewers in control.",
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
    image: "/img/services/Banking-Customer-Service-That-Resolves-50-percent-of-Tickets-Automatically.jpg",
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
    image: "/img/services/Retail-40-percent-Faster-Pricing-Ops-Without-Manual-Review.jpg",
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
      "Expand into retention, replenishment, and store associate prompts.",
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
    image: "/img/services/use-case-4.webp",
    pain:
      "Operations teams lose time correlating alerts, rewriting tickets, searching runbooks, and escalating incidents without enough context.",
    promise:
      "Kyra enriches incidents, recommends the next action, routes escalations, and builds a cleaner operational memory from every event.",
    proof:
      "The accelerator starts from service operations and network workflow patterns where speed, evidence, and handoff quality matter most.",
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
    image: "/img/services/Manufacturing-Autonomous-Maintenance-With-Scoped-Agent-Control.jpg",
    pain:
      "Supplier and shipment risks appear across contracts, ERP records, emails, news, quality data, and logistics tools long before they show up in a monthly report.",
    promise:
      "Orbis watches the dependency graph, highlights exposure, and routes the right action to procurement, operations, or risk owners.",
    proof:
      "The accelerator is shaped around supply chain and vendor-risk workflows where external signals must be tied back to internal exposure.",
    rollout: [
      "Map suppliers, contracts, SKUs, plants, and critical dependencies.",
      "Connect ERP, procurement, logistics, and external risk signals.",
      "Launch exception monitoring for a focused supplier or lane segment.",
      "Expand into proactive mitigation planning and executive reporting.",
    ],
    metrics: [
      { value: "Early", label: "Risk signal detection" },
      { value: "360", label: "Supplier context view" },
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
    image: "/img/services/use-case-1.webp",
    pain:
      "Internal service teams are buried in repetitive requests, inconsistent routing, stale knowledge, and handoffs that slow employees down.",
    promise:
      "Astra classifies the request, retrieves the right answer, executes low-risk steps, and routes exceptions with the context a human needs.",
    proof:
      "The accelerator packages enterprise service workflow patterns with knowledge retrieval, permission-aware actions, and service desk integration.",
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
    image: "/img/services/use-case-5.webp",
    pain:
      "Security teams face alert overload, fragmented tooling, and reporting demands that pull analysts away from investigation and response.",
    promise:
      "Vantaq enriches alerts, summarizes incidents, recommends next steps, and captures the evidence needed for compliance and post-incident review.",
    proof:
      "The accelerator combines incident intelligence, workflow governance, and audit-ready evidence patterns for security operations.",
    rollout: [
      "Connect SIEM, EDR, ticketing, threat intel, and policy sources.",
      "Calibrate severity, escalation, and response recommendation rules.",
      "Deploy analyst-assist for alert enrichment and incident summaries.",
      "Expand into evidence generation and response playbook automation.",
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
