export interface ServiceOffering {
  slug: string;
  name: string;
  shortName: string;
  eyebrow: string;
  headline: string;
  subhead: string;
  proof: string;
  problem: string;
  promise: string;
  outcomes: { metric: string; label: string; description: string }[];
  deliverables: string[];
  signals: string[];
  bestFit: string[];
  ctaHeadline: string;
  ctaBody: string;
}

export const serviceOfferings: ServiceOffering[] = [
  {
    slug: "workflow-intelligence",
    name: "Workflow intelligence",
    shortName: "Workflow intelligence",
    eyebrow: "Services / Workflow intelligence",
    headline: "Find the workflow where AI should actually run the business.",
    subhead:
      "Before agents, prompts, or dashboards, we map the operating reality: handoffs, exception paths, systems of record, policy gates, data quality, and the moments where human judgment still matters.",
    proof: "For leaders who need a fundable AI roadmap grounded in one painful workflow, not a generic transformation deck.",
    problem:
      "Most AI programs start with tools. The work starts somewhere else: undocumented approvals, spreadsheet sidecars, queues nobody owns, and exceptions that decide whether the business trusts automation.",
    promise:
      "We turn that mess into a buildable operating blueprint: what to automate, what to augment, what to leave human, what to measure, and what controls must exist before launch.",
    outcomes: [
      { metric: "2-3w", label: "Workflow blueprint", description: "A focused map of users, systems, handoffs, risks, metrics, and launch constraints." },
      { metric: "1", label: "Priority use case", description: "A narrow workflow slice with enough value and enough control to justify implementation." },
      { metric: "Clear", label: "Build path", description: "A decision on bespoke build, accelerator fit, integration scope, and rollout sequence." },
    ],
    deliverables: [
      "Workflow and exception-path map",
      "AI opportunity and risk register",
      "Data and integration readiness view",
      "Control, approval, and audit requirements",
      "Production proof-of-value plan",
    ],
    signals: ["Manual queues", "Exception-heavy work", "High-value decisions", "Fragmented systems", "Leadership needs a credible first move"],
    bestFit: ["COOs", "CIOs", "Heads of AI", "Transformation leaders", "Operations owners"],
    ctaHeadline: "Bring one messy workflow. We will tell you what is worth building.",
    ctaBody: "No deck required. We will pressure-test the workflow, the value, and the control path in plain language.",
  },
  {
    slug: "agentic-os-design",
    name: "Agentic OS design",
    shortName: "Agentic OS design",
    eyebrow: "Services / Agentic OS design",
    headline: "Design agents that know their job, their limits, and when to escalate.",
    subhead:
      "We define the agent roles, tool permissions, memory boundaries, retrieval paths, human review points, escalation rules, and evaluation criteria before implementation starts.",
    proof: "For teams moving beyond chat UX into AI systems that need to execute repeatable work safely.",
    problem:
      "A capable model is not an operating system. Without roles, permissions, context boundaries, and escalation paths, agents become demos that fail the first time the workflow gets messy.",
    promise:
      "We architect the AI operating layer around your business process so every agent has a job, every action has a policy boundary, and every exception has an owner.",
    outcomes: [
      { metric: "Role", label: "Agent design", description: "Clear agent responsibilities, tool access, context scope, and failure modes." },
      { metric: "Eval", label: "Quality gates", description: "Evaluation checks for accuracy, safety, relevance, policy compliance, and business usefulness." },
      { metric: "Human", label: "Oversight model", description: "Review, approval, escalation, and override paths built into the operating design." },
    ],
    deliverables: [
      "Agent role and responsibility model",
      "Tool-permission and memory-boundary map",
      "Retrieval and context architecture",
      "Evaluation and acceptance criteria",
      "Human-in-the-loop operating model",
    ],
    signals: ["Multiple roles touch the same work", "AI must take action", "Risk of hallucinated operations", "Human review cannot disappear", "Pilot needs production architecture"],
    bestFit: ["Product leaders", "AI engineering leaders", "Enterprise architects", "Risk owners", "Operations executives"],
    ctaHeadline: "If an agent will touch real work, design the operating system first.",
    ctaBody: "We help you define what the AI can do, what it cannot do, and how the business stays in control.",
  },
  {
    slug: "enterprise-integration",
    name: "Enterprise integration",
    shortName: "Enterprise integration",
    eyebrow: "Services / Enterprise integration",
    headline: "Connect AI to the systems where work already lives.",
    subhead:
      "We integrate agents and workflow intelligence with legacy apps, SaaS platforms, data stores, document systems, queues, notifications, and approval channels without forcing rip-and-replace.",
    proof: "For organizations where the value is trapped between systems, not inside a single model response.",
    problem:
      "Enterprise AI stalls when it cannot reach the right context or write back to the right workflow. Screens stay disconnected. Teams copy, paste, and reconcile by hand.",
    promise:
      "We build secure, auditable integration paths so AI can read, reason, route, recommend, and update the systems your teams already use.",
    outcomes: [
      { metric: "API", label: "Connected context", description: "Reliable access to the systems, documents, and data needed for the workflow." },
      { metric: "Queue", label: "Operational routing", description: "AI-enriched work routed to the right owner, channel, queue, or review path." },
      { metric: "Trace", label: "Evidence trail", description: "Every read, recommendation, and write-back connected to logs and business evidence." },
    ],
    deliverables: [
      "Integration architecture and data contracts",
      "System-of-record read/write patterns",
      "Tool execution and permission design",
      "Notification and queue workflows",
      "Observability and audit instrumentation",
    ],
    signals: ["Work crosses CRM/ERP/ITSM", "Documents drive decisions", "Manual swivel-chair operations", "Legacy systems block AI adoption", "Need controlled write-back"],
    bestFit: ["CIOs", "Enterprise architects", "Integration teams", "Platform teams", "Operations leaders"],
    ctaHeadline: "Your stack does not need replacing. It needs an operating layer.",
    ctaBody: "Show us the systems the workflow crosses. We will map the safest path to connect them.",
  },
  {
    slug: "governance-architecture",
    name: "Governance architecture",
    shortName: "Governance architecture",
    eyebrow: "Services / Governance architecture",
    headline: "Build controls into the workflow before AI starts acting.",
    subhead:
      "We design policy checks, audit logs, access boundaries, human approvals, red-team tests, prompt controls, and compliance reporting into the AI system itself.",
    proof: "For regulated or high-stakes workflows where trust has to be engineered, not promised.",
    problem:
      "Teams often add governance after the pilot. By then the AI has no reliable trail, no repeatable approval model, and no way for risk, compliance, or operations to sign off.",
    promise:
      "We make governance part of the production design: what data can be used, what the AI can do, what requires approval, what gets logged, and what evidence is available later.",
    outcomes: [
      { metric: "100%", label: "Action logging", description: "Agent actions, tool calls, approvals, and data access captured for review." },
      { metric: "Policy", label: "Runtime controls", description: "Checks before retrieval, recommendation, write-back, or escalation." },
      { metric: "Audit", label: "Decision evidence", description: "Provenance and rationale packaged for operational and compliance review." },
    ],
    deliverables: [
      "Control architecture and policy map",
      "Audit and decision-provenance model",
      "Human approval and exception paths",
      "Red-team and evaluation plan",
      "Compliance reporting requirements",
    ],
    signals: ["Regulated workflow", "Sensitive data", "High-impact decisions", "Audit pressure", "Risk team needs sign-off"],
    bestFit: ["Risk leaders", "Compliance teams", "CISOs", "Legal teams", "AI governance owners"],
    ctaHeadline: "If the workflow is high-stakes, governance is not optional UX.",
    ctaBody: "We will help you design the control layer before production risk appears.",
  },
  {
    slug: "accelerator-adaptation",
    name: "Accelerator adaptation",
    shortName: "Accelerator adaptation",
    eyebrow: "Services / Accelerator adaptation",
    headline: "Start from a proven pattern. Tune it until it fits your operation.",
    subhead:
      "When a workflow matches one of our repeatable patterns, we adapt the accelerator to your data boundaries, systems, approvals, policies, and operating metrics.",
    proof: "For teams that want speed without pretending an off-the-shelf tool understands their business.",
    problem:
      "Templates move fast until they meet the real workflow. Then edge cases, data contracts, approval paths, and enterprise controls decide whether anything ships.",
    promise:
      "We use accelerators as a starting system, not a finished answer: the reusable parts reduce build time, while the adaptation work makes it production-relevant.",
    outcomes: [
      { metric: "Fast", label: "Pattern reuse", description: "Reusable agent, integration, evaluation, and governance primitives reduce blank-page build time." },
      { metric: "Fit", label: "Enterprise tuning", description: "Configured around your stack, operating model, data constraints, and compliance needs." },
      { metric: "POV", label: "Narrow proof", description: "A concrete workflow slice proves value before broader rollout." },
    ],
    deliverables: [
      "Accelerator-fit assessment",
      "Workflow adaptation plan",
      "Data and integration tuning",
      "Control and approval configuration",
      "Proof-of-value launch plan",
    ],
    signals: ["Similar workflow already exists", "Need faster path than bespoke", "Enterprise constraints still matter", "Pilot must convert to rollout", "Leadership wants clear ROI"],
    bestFit: ["Operations leaders", "Product owners", "CIOs", "Heads of AI", "Business sponsors"],
    ctaHeadline: "Have a workflow that looks familiar? Start with the closest accelerator.",
    ctaBody: "We will tell you whether to adapt a pattern, build bespoke, or not build at all.",
  },
  {
    slug: "production-adoption",
    name: "Production adoption",
    shortName: "Production adoption",
    eyebrow: "Services / Production adoption",
    headline: "Move from proof-of-value to daily operating behavior.",
    subhead:
      "We help teams launch, monitor, tune, train, and expand AI workflows so they become part of the operating rhythm instead of another abandoned pilot.",
    proof: "For teams that already have a working prototype and need adoption, reliability, metrics, and ownership.",
    problem:
      "A working demo does not change operations. Adoption fails when teams do not trust the system, metrics are unclear, exceptions are unmanaged, and no one owns continuous improvement.",
    promise:
      "We install the operating cadence around the AI system: usage metrics, quality monitoring, feedback loops, escalation reviews, release discipline, and expansion planning.",
    outcomes: [
      { metric: "Daily", label: "Workflow usage", description: "The system moves into the places teams already work, with clear ownership and support." },
      { metric: "Live", label: "Monitoring", description: "Quality, drift, exception volume, and business outcomes tracked after launch." },
      { metric: "Scale", label: "Expansion path", description: "The first workflow becomes a repeatable pattern for adjacent teams and processes." },
    ],
    deliverables: [
      "Launch and adoption plan",
      "User training and enablement assets",
      "Quality monitoring and feedback loops",
      "Release and improvement cadence",
      "Expansion roadmap and operating metrics",
    ],
    signals: ["Prototype exists", "Users are skeptical", "Need production owner", "Metrics unclear", "Expansion depends on first launch"],
    bestFit: ["Business owners", "Transformation teams", "Product operations", "AI program leads", "Customer success or internal enablement"],
    ctaHeadline: "The work is not done when the demo works.",
    ctaBody: "We help turn a working AI system into daily behavior your teams trust.",
  },
];

export function getServiceOffering(slug: string) {
  return serviceOfferings.find((service) => service.slug === slug);
}
