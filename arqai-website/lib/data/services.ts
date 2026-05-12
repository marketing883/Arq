export type ServiceOutcome = {
  value: string;
  label: string;
  detail: string;
};

export type Service = {
  slug: string;
  title: string;
  shortTitle: string;
  eyebrow: string;
  summary: string;
  image: string;
  problem: string;
  promise: string;
  outcomes: ServiceOutcome[];
  deliverables: string[];
  signals: string[];
  bestFit: string[];
  cta: {
    heading: string;
    body: string;
  };
};

export const services: Service[] = [
  {
    slug: "workflow-strategy",
    title: "Workflow Strategy",
    shortTitle: "Strategy",
    eyebrow: "Services / Workflow strategy",
    summary:
      "Find the workflow where AI should create measurable operating leverage, then define the users, data, risks, controls, integrations, and success metrics before anything is built.",
    image: "/img/hero/workflow.png",
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
    bestFit: [
      "COOs and transformation leaders",
      "Heads of AI building the first production workflow",
      "CIOs and CTOs modernizing a specific operating process",
      "Business unit leaders with measurable workflow pain",
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
    image: "/img/demo/arqai-foundry-v2-poster.webp",
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
    bestFit: [
      "Enterprise operations teams",
      "Claims, service, risk, compliance, and support leaders",
      "AI product owners with a validated workflow",
      "Technology leaders who need governed execution",
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
    image: "/img/hero/arq-layer.png",
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
    bestFit: [
      "CIO and enterprise architecture teams",
      "Platform and integration leaders",
      "Operations teams modernizing tool-heavy processes",
      "Security leaders approving agent access",
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
    image: "/img/Policy-Hub-Interface.png",
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
    bestFit: [
      "Compliance, risk, and security leaders",
      "AI governance committees",
      "Regulated operations teams",
      "Product leaders building trusted enterprise AI",
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
      "Use proven product lines for repeatable workflows like claims, fraud, AML, loyalty, network operations, service workflow, and supply chain risk.",
    image: "/img/hero/arq-products.png",
    problem:
      "Some enterprise AI workflows repeat across companies, but off-the-shelf products rarely match the data, policy, and operating reality of a specific buyer.",
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
      "The buyer needs a productized starting point with services depth",
    ],
    bestFit: [
      "Healthcare payers and insurance carriers",
      "Banks and financial institutions",
      "Retail, telecom, manufacturing, and security operations",
      "Transformation teams scaling from one workflow to a portfolio",
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
    image: "/img/Operations-center.png",
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
      "Internal teams need a partner while capability is built in-house",
    ],
    bestFit: [
      "Operations leaders launching production AI",
      "AI teams moving from pilot to managed service",
      "CIOs who need named ownership after launch",
      "Business units expanding a proven workflow",
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
