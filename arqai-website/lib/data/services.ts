export type ServiceOutcome = {
  value: string;
  label: string;
  detail: string;
};

export type ServiceCapability = { title: string; body: string };
export type ServiceUseCase = { title: string; body: string };

export type Service = {
  slug: string;
  title: string;
  shortTitle: string;
  eyebrow: string;
  summary: string;
  image: string;
  heroImage: string;
  secondaryImage: string;
  tertiaryImage: string;
  overview: string;
  capabilities: ServiceCapability[];
  useCases: ServiceUseCase[];
  integrations: string[];
  problem: string;
  promise: string;
  outcomes: ServiceOutcome[];
  deliverables: string[];
  signals: string[];
  workflowContexts: string[];
  cta: {
    heading: string;
    body: string;
  };
};

// Sized Unsplash delivery; the detail page rewrites width/quality at render.
const u = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const services: Service[] = [
  {
    slug: "workflow-strategy",
    title: "Workflow Strategy",
    shortTitle: "Strategy",
    eyebrow: "Services / Workflow strategy",
    summary:
      "Find the workflow where AI should create measurable operating leverage, then define the users, data, risks, controls, integrations, and success metrics before anything is built.",
    image: u("photo-1517048676732-d65bc937f952", 1400),
    heroImage: u("photo-1517048676732-d65bc937f952", 1600),
    secondaryImage: u("photo-1542744173-8e7e53415bb0", 1920),
    tertiaryImage: u("photo-1517245386807-bb43f82c33c4", 800),
    overview:
      "Workflow Strategy is a focused engagement that turns one messy enterprise workflow into a buildable AI operating plan. We work with the people who own the process to define the outcome, the data, the controls, and the first production slice — before a line of build is committed.",
    capabilities: [
      { title: "Opportunity mapping", body: "We map where AI creates real operating leverage across the workflow and rank candidates by value, feasibility, and risk." },
      { title: "Operating-metric definition", body: "We anchor the engagement to a metric leadership will fund — cycle time, cost-to-serve, recovery, or quality." },
      { title: "Risk & control posture", body: "We define the permissions, approvals, and evidence the workflow needs to pass production review." },
      { title: "Data & integration requirements", body: "We identify the systems, data, and access the build depends on, surfacing gaps early." },
      { title: "Build-vs-accelerator call", body: "We recommend the honest path — bespoke build, accelerator, or no-build — with a costed roadmap." },
    ],
    useCases: [
      { title: "Pre-funding business case", body: "Give leadership a costed, de-risked plan to approve." },
      { title: "Stakeholder alignment", body: "Get business, technology, and risk owners onto one production path." },
      { title: "Portfolio roadmapping", body: "Turn one workflow into a sequence of fundable releases." },
    ],
    integrations: [
      "Existing CRM / ERP / ITSM",
      "Data warehouse / lakehouse",
      "Knowledge bases",
      "Identity & access",
      "BI & reporting",
    ],
    problem:
      "Most AI programs begin with a model choice instead of an operating problem. Teams spend months on demos that never meet the workflow owner, the compliance owner, or the production metric.",
    promise:
      "We turn one messy enterprise workflow into a buildable AI operating plan, with the value case, controls, and technical path clear enough for leadership to fund and delivery teams to execute.",
    outcomes: [
      {
        value: "2-4 wks",
        label: "Decision-ready blueprint",
        detail: "A prioritized workflow map, operating metric, implementation plan, and risk posture for the first production slice.",
      },
      {
        value: "1",
        label: "Named workflow owner",
        detail: "The engagement centers on the person accountable for the process, not a generic innovation committee.",
      },
      {
        value: "0",
        label: "Stranded demos",
        detail: "Every recommendation connects to a production path, required data, system dependency, and measurable business change.",
      },
    ],
    deliverables: [
      "Workflow opportunity map and prioritization",
      "Current-state process, exception, and risk inventory",
      "Target-state agentic workflow architecture",
      "Data, integration, and governance requirements",
      "Business case, KPI model, and implementation roadmap",
      "Build-versus-accelerator recommendation",
    ],
    signals: [
      "AI pilots exist but do not reach production",
      "Leadership wants a specific workflow outcome, not a broad AI strategy",
      "Process owners disagree on what should be automated",
      "Compliance and technology teams need to approve the path early",
    ],
    workflowContexts: [
      "A specific process needs an AI path before funding or build decisions",
      "The workflow spans business, technology, and risk ownership",
      "Teams need a concrete production plan instead of another assessment",
      "The first release must be measurable, governable, and worth operating",
    ],
    cta: {
      heading: "Bring us one workflow that should not be manual anymore.",
      body: "We will map the first production slice, define the controls, and tell you whether a custom build, accelerator, or no-build path is the honest answer.",
    },
  },
  {
    slug: "agentic-ai-buildout",
    title: "Agentic AI Buildout",
    shortTitle: "Buildout",
    eyebrow: "Services / Agentic AI buildout",
    summary:
      "Design and deploy agents, copilots, automations, decision systems, retrieval flows, and human review loops around the way your operation actually runs.",
    image: u("photo-1607799279861-4dd421887fb3", 1400),
    heroImage: u("photo-1607799279861-4dd421887fb3", 1600),
    secondaryImage: u("photo-1619410283995-43d9134e7656", 1920),
    tertiaryImage: u("photo-1515879218367-8466d910aaa4", 800),
    overview:
      "Agentic AI Buildout is where the plan becomes a working system. We design and ship agents, copilots, automations, and review loops that act inside defined boundaries, ask for human approval where it matters, and produce evidence your teams can trust.",
    capabilities: [
      { title: "Agent & tool architecture", body: "We design the agents, tools, and orchestration that carry the workflow end to end." },
      { title: "Retrieval & reasoning", body: "Grounded retrieval and reasoning flows keep outputs accurate and current." },
      { title: "Human-in-the-loop review", body: "High-risk actions and low-confidence outputs route to the right owner before execution." },
      { title: "Workbench & copilot UX", body: "We ship the interface where the work actually happens — embedded or standalone." },
      { title: "Evaluation harness", body: "Acceptance criteria and evals prove the system before it goes live." },
    ],
    useCases: [
      { title: "Triage & routing agents", body: "Classify, enrich, and route incoming work automatically." },
      { title: "Decision copilots", body: "Give reviewers summaries, evidence, and a next-best action." },
      { title: "Document & evidence automation", body: "Assemble, check, and summarize files at scale." },
    ],
    integrations: [
      "LLM providers (Anthropic, OpenAI, Bedrock, Azure)",
      "Vector / search stores",
      "Business systems & APIs",
      "Identity & secrets",
      "Observability",
    ],
    problem:
      "Enterprise teams can prompt a model, but they struggle to make it do useful work across approvals, exceptions, handoffs, and production data without creating new operational risk.",
    promise:
      "We build agentic workflows that act inside defined boundaries, ask for human approval where it matters, and produce the evidence your teams need to trust the output.",
    outcomes: [
      {
        value: "30-90",
        label: "Day production path",
        detail: "A scoped build that moves from workflow design to a working system without drifting into research theater.",
      },
      {
        value: "100%",
        label: "Human review where required",
        detail: "High-risk actions, exceptions, and low-confidence outputs route to the right owner before execution.",
      },
      {
        value: "24/7",
        label: "Operational continuity",
        detail: "Agents continue the repetitive work while users retain authority over policy, exceptions, and escalation.",
      },
    ],
    deliverables: [
      "Agent and tool architecture",
      "Retrieval, reasoning, and orchestration flows",
      "Human-in-the-loop review and escalation paths",
      "Front-end workbench or embedded copilot experience",
      "Evaluation harness and acceptance criteria",
      "Launch plan, training, and operating handoff",
    ],
    signals: [
      "Users need more than chat answers",
      "The workflow requires action across multiple systems",
      "Manual triage, routing, summarization, or evidence gathering is slowing teams down",
      "A working prototype needs production architecture",
    ],
    workflowContexts: [
      "The work requires action across multiple systems, not just answers",
      "Manual triage, routing, summarization, or evidence gathering slows the team down",
      "High-risk steps need human approval before execution",
      "A useful prototype needs production architecture before it can launch",
    ],
    cta: {
      heading: "Ship the workflow, not the demo.",
      body: "Show us the task, the systems, and the risk boundary. We will design the agentic build that can survive production.",
    },
  },
  {
    slug: "enterprise-integration",
    title: "Enterprise Integration",
    shortTitle: "Integration",
    eyebrow: "Services / Enterprise integration",
    summary:
      "Connect AI into CRM, ERP, ITSM, data platforms, cloud stacks, knowledge bases, and operating tools without forcing rip-and-replace.",
    image: u("photo-1691435828932-911a7801adfb", 1400),
    heroImage: u("photo-1691435828932-911a7801adfb", 1600),
    secondaryImage: u("photo-1629837093109-11325d6e7afd", 1920),
    tertiaryImage: u("photo-1563884705074-7c8b15f16295", 800),
    overview:
      "Enterprise Integration wires agentic workflows into the systems where work already happens. AI retrieves the right context, updates the right records, and respects the permissions your business already runs on — with no rip-and-replace.",
    capabilities: [
      { title: "System & data mapping", body: "We map identity, data, business systems, and knowledge sources the workflow depends on." },
      { title: "Connector engineering", body: "We build and harden the connectors that read from and write to your stack." },
      { title: "Permission inheritance", body: "Agent actions inherit the access boundaries your security team already trusts." },
      { title: "Knowledge & retrieval wiring", body: "We connect knowledge bases and content so retrieval stays current and grounded." },
      { title: "Observability & audit", body: "Every read, recommendation, and write is logged for audit and troubleshooting." },
    ],
    useCases: [
      { title: "Live-data copilots", body: "Ground AI in real-time system data, not stale exports." },
      { title: "Cross-system automation", body: "Remove swivel-chair handoffs across multiple tools." },
      { title: "Governed write-back", body: "Let agents update systems within strict permissions." },
    ],
    integrations: [
      "CRM (Salesforce)",
      "ERP (SAP, Oracle)",
      "ITSM (ServiceNow)",
      "Data platforms (Snowflake, Databricks)",
      "Identity (Okta, Entra)",
      "Knowledge bases",
    ],
    problem:
      "AI stalls when it cannot reach the systems where work happens. Teams end up with a smart interface on top of disconnected data, stale context, and manual handoffs.",
    promise:
      "We wire agentic workflows into your existing stack so AI can retrieve the right context, update the right systems, and respect the permissions already governing your business.",
    outcomes: [
      {
        value: "5-12",
        label: "Core systems mapped",
        detail: "The first integration plan covers identity, data, business systems, knowledge sources, and operational tools.",
      },
      {
        value: "1",
        label: "Permission model",
        detail: "Agent actions inherit the enterprise access boundaries your security and operations teams already trust.",
      },
      {
        value: "Full",
        label: "Execution trail",
        detail: "Every read, recommendation, and write can be logged for audit, troubleshooting, and performance review.",
      },
    ],
    deliverables: [
      "System and data dependency mapping",
      "Connector design and implementation",
      "Identity, authorization, and secrets handling",
      "Knowledge-base and retrieval integration",
      "Event, queue, API, and workflow orchestration",
      "Observability and audit instrumentation",
    ],
    signals: [
      "The AI experience needs live enterprise data",
      "Manual swivel-chair work spans multiple tools",
      "Security needs clear permission and audit boundaries",
      "Existing SaaS, ERP, CRM, or ITSM systems must stay in place",
    ],
    workflowContexts: [
      "The AI experience needs live data from systems already in use",
      "The workflow crosses CRM, ERP, ITSM, cloud, data, or knowledge tools",
      "Permission boundaries and audit trails need to match enterprise controls",
      "Teams need fewer swivel-chair handoffs without replacing the stack",
    ],
    cta: {
      heading: "Keep your stack. Make the workflow smarter.",
      body: "We will map the systems that matter, define the access boundary, and connect AI where work actually happens.",
    },
  },
  {
    slug: "governance-by-design",
    title: "Governance by Design",
    shortTitle: "Governance",
    eyebrow: "Services / Governance by design",
    summary:
      "Build permissions, approvals, policy checks, human review, audit trails, and exception handling into the workflow before AI takes action.",
    image: u("photo-1562654501-a0ccc0fc3fb1", 1400),
    heroImage: u("photo-1562654501-a0ccc0fc3fb1", 1600),
    secondaryImage: u("photo-1583521214690-73421a1829a9", 1920),
    tertiaryImage: u("photo-1554224154-26032ffc0d07", 800),
    overview:
      "Governance by Design builds the control plane into the workflow from day one. Agents know what they can do, when they must ask, and what evidence to keep — so production approval has something concrete to review instead of a black box.",
    capabilities: [
      { title: "Policy & risk modeling", body: "We translate your policies into rules the workflow enforces at runtime." },
      { title: "Approval & escalation design", body: "High-risk steps route through the right human approvals and exception paths." },
      { title: "Role & data-access control", body: "Permissions and data boundaries are explicit and enforced for every action." },
      { title: "Evidence & audit trail", body: "Decisions, context, tool calls, approvals, and overrides are captured by default." },
      { title: "Monitoring & incident response", body: "Evaluation, drift detection, and an incident plan keep it trustworthy in production." },
    ],
    useCases: [
      { title: "Regulated decisioning", body: "Automate within compliance and keep every step defensible." },
      { title: "Audit readiness", body: "Produce the evidence reviewers and examiners need on demand." },
      { title: "Responsible-AI sign-off", body: "Give legal, risk, and security something concrete to approve." },
    ],
    integrations: [
      "IAM / SSO",
      "Policy & GRC tooling",
      "SIEM / logging",
      "Data catalog & lineage",
      "Case management",
    ],
    problem:
      "AI initiatives often add governance after the prototype works. By then, risk teams see an uncontrolled system, users lose confidence, and production approval slows down.",
    promise:
      "We make governance part of the product architecture from day one, so agents know what they can do, when they must ask, and what evidence they must keep.",
    outcomes: [
      {
        value: "100%",
        label: "Policy-aware actions",
        detail: "Every automated step can be tied to a permission, policy, approval rule, or escalation path.",
      },
      {
        value: "0",
        label: "Black-box handoffs",
        detail: "Users and reviewers can see why a recommendation was made and what evidence supported it.",
      },
      {
        value: "Audit",
        label: "Ready by default",
        detail: "Decision logs, prompt context, tool calls, approvals, and overrides are captured as part of normal operation.",
      },
    ],
    deliverables: [
      "Risk and policy model",
      "Human approval and escalation design",
      "Role, permission, and data-access rules",
      "Audit trail and evidence architecture",
      "Evaluation, monitoring, and incident response plan",
      "Responsible AI operating documentation",
    ],
    signals: [
      "The workflow touches regulated or sensitive decisions",
      "Legal, compliance, or security must approve production use",
      "Users need explainability before trusting recommendations",
      "Automated actions require strong boundaries",
    ],
    workflowContexts: [
      "The workflow touches regulated, sensitive, or policy-bound decisions",
      "Users need to understand why a recommendation was made",
      "Automated actions require approvals, exceptions, and clear boundaries",
      "Production approval depends on evidence, logging, and reviewability",
    ],
    cta: {
      heading: "Governance should not be a launch blocker.",
      body: "We will design the control plane with the workflow, not after it, so production approval has something concrete to review.",
    },
  },
  {
    slug: "vertical-acceleration",
    title: "Vertical Acceleration",
    shortTitle: "Acceleration",
    eyebrow: "Services / Vertical acceleration",
    summary:
      "Use proven accelerator patterns for repeatable workflows like claims, fraud, AML, loyalty, network operations, service workflow, and supply chain risk.",
    image: u("photo-1534078362425-387ae9668c17", 1400),
    heroImage: u("photo-1534078362425-387ae9668c17", 1600),
    secondaryImage: u("photo-1712696779652-dfca8766c5f8", 1920),
    tertiaryImage: u("photo-1542621334-a254cf47733d", 800),
    overview:
      "Vertical Acceleration starts you closer to production. We begin from proven accelerator patterns for recurring enterprise workflows, then adapt them to your data, policies, users, and success metrics — so speed never comes at the expense of fit.",
    capabilities: [
      { title: "Accelerator fit assessment", body: "We match your workflow to the nearest proven pattern and name exactly what must change." },
      { title: "Pattern adaptation", body: "We tune the workflow, data model, and rules to your environment, not a template." },
      { title: "Policy & routing configuration", body: "Review, routing, and escalation rules are configured to your operation." },
      { title: "Client-specific evaluation", body: "We measure against your metrics and acceptance criteria before rollout." },
      { title: "Portfolio rollout", body: "One successful workflow becomes a repeatable, expandable pattern." },
    ],
    useCases: [
      { title: "Known-pattern workflows", body: "Claims, FWA, financial crime, loyalty, service ops, and supply chain." },
      { title: "Faster first release", body: "Cut blank-page build time with reusable architecture." },
      { title: "Repeatable portfolio", body: "Scale one win into many across teams and units." },
    ],
    integrations: [
      "ArqAI accelerator library",
      "Industry core systems",
      "Data & knowledge sources",
      "Governance & review tooling",
      "BI & reporting",
    ],
    problem:
      "Some enterprise AI workflows repeat across companies, but off-the-shelf products rarely match the data, policy, and operating reality of the work.",
    promise:
      "We start from reusable accelerator patterns, then adapt the workflow to your systems, policies, users, and success metrics so speed does not come at the expense of fit.",
    outcomes: [
      {
        value: "40%",
        label: "Less blank-page build time",
        detail: "Reusable workflow, governance, and evaluation patterns shorten discovery and implementation.",
      },
      {
        value: "8",
        label: "Accelerator lines",
        detail: "Healthcare, claims, banking, loyalty, network ops, service workflow, supply chain, and security ops patterns.",
      },
      {
        value: "1",
        label: "Customized operating model",
        detail: "The accelerator is tuned to the client environment instead of forcing the client into a generic template.",
      },
    ],
    deliverables: [
      "Accelerator fit assessment",
      "Workflow and data adaptation plan",
      "Configuration of policy, routing, and review rules",
      "Integration with client systems and knowledge sources",
      "Evaluation against client-specific success metrics",
      "Rollout plan from first team to broader adoption",
    ],
    signals: [
      "Your workflow maps to a known ArqAI accelerator",
      "Speed matters, but the operating context is still specific",
      "The team wants reusable architecture rather than a one-off build",
      "The workflow needs a reusable starting point with services depth",
    ],
    workflowContexts: [
      "The workflow resembles a proven ArqAI accelerator pattern",
      "Speed matters, but the operating context still needs careful fit",
      "Reusable architecture can reduce blank-page build time",
      "One successful workflow needs to become a repeatable portfolio pattern",
    ],
    cta: {
      heading: "Start closer to production.",
      body: "We will show which accelerator is nearest to your workflow, what must be customized, and where a bespoke build is still the better answer.",
    },
  },
  {
    slug: "managed-ai-operations",
    title: "Managed AI Operations",
    shortTitle: "Operations",
    eyebrow: "Services / Managed AI operations",
    summary:
      "Monitor, improve, and expand AI workflows after launch so they keep performing in real business conditions.",
    image: u("photo-1639313521811-fdfb1c040ddb", 1400),
    heroImage: u("photo-1639313521811-fdfb1c040ddb", 1600),
    secondaryImage: u("photo-1653108951561-b9198632de97", 1920),
    tertiaryImage: u("photo-1685720543547-cc4873188c75", 800),
    overview:
      "Managed AI Operations keeps the workflow healthy after launch. With named owners, monitoring, evaluation, and tuning, we turn production learning into a system that keeps performing — and a roadmap for expanding from the first workflow to the next.",
    capabilities: [
      { title: "Performance monitoring", body: "Operational metrics, model quality, exceptions, and risk signals are watched continuously." },
      { title: "Tuning cadence", body: "Regular cycles turn production feedback into better prompts, policies, and retrieval." },
      { title: "Incident & change support", body: "Defined runbooks, SLAs, and change management keep operations stable." },
      { title: "User support & training", body: "We support the people using the workflow as new edge cases emerge." },
      { title: "Expansion roadmap", body: "A quarterly backlog turns the first workflow into a portfolio." },
    ],
    useCases: [
      { title: "Post-launch ownership", body: "Keep a business-critical workflow performing in real conditions." },
      { title: "Continuous improvement", body: "Fold production learning back into the system every cycle." },
      { title: "Scaling to N+1", body: "Expand to adjacent teams without losing governance." },
    ],
    integrations: [
      "Monitoring & evaluation dashboards",
      "LLM & retrieval stack",
      "ITSM / ticketing",
      "Analytics & BI",
      "Incident & on-call tooling",
    ],
    problem:
      "AI workflows drift after launch. Data changes, policies shift, users discover edge cases, and the original pilot team moves on before the system becomes operational muscle.",
    promise:
      "We operate the AI workflow alongside your team with named owners, monitoring, evaluation, tuning, and a roadmap for expanding from the first workflow to the next.",
    outcomes: [
      {
        value: "Live",
        label: "Performance monitoring",
        detail: "Operational metrics, model quality, exception rates, user feedback, and risk signals are monitored after launch.",
      },
      {
        value: "30",
        label: "Day improvement cadence",
        detail: "Regular tuning cycles turn production learning into better prompts, policies, retrieval, and workflow design.",
      },
      {
        value: "N+1",
        label: "Workflow expansion",
        detail: "The first governed workflow becomes a base for adjacent use cases, teams, and operating units.",
      },
    ],
    deliverables: [
      "Named technical and relationship leads",
      "Runbook, SLA, and support cadence",
      "Monitoring and evaluation dashboard",
      "Prompt, retrieval, and policy tuning",
      "Incident, exception, and change-management support",
      "Expansion backlog and quarterly roadmap",
    ],
    signals: [
      "The AI workflow is business-critical enough to need ownership",
      "Users need post-launch tuning, training, and support",
      "Leadership wants the first workflow to become a repeatable pattern",
      "The team needs an operating partner while internal capability matures",
    ],
    workflowContexts: [
      "The AI workflow is important enough to need ongoing ownership",
      "Users need post-launch tuning, training, and support",
      "Production learning should improve prompts, policies, retrieval, and UX",
      "A first workflow is ready to expand without losing governance",
    ],
    cta: {
      heading: "Launch is the beginning of the operating system.",
      body: "We will keep the workflow healthy, improve it with production feedback, and help your team expand without losing control.",
    },
  },
];

export function getService(slug: string) {
  return services.find((service) => service.slug === slug);
}
