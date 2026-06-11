// Combinatorial resolver for the v4 control panel.
// Inputs: control positions. Output: one of three tiers + always-present service shape.
// Every permutation resolves to something — no dead ends, no silent failures.

export type Industry =
  | "healthcare-payer"
  | "insurance-carrier"
  | "banking"
  | "retail"
  | "telecom"
  | "manufacturing"
  | "enterprise-it"
  | "cybersecurity"
  | "other";

export type Workflow =
  | "claims"
  | "fraud-aml"
  | "loyalty"
  | "network-ops"
  | "supply-chain"
  | "service-ops"
  | "security-ops"
  | "knowledge"
  | "custom";

export type Approach = "accelerator" | "hybrid" | "bespoke";
export type Deployment = "our-cloud" | "your-cloud" | "on-prem";
export type Sensitivity = "public" | "regulated" | "restricted";
export type Horizon = "weeks" | "quarter" | "multi-quarter";

export type Config = {
  industry: Industry;
  workflows: Workflow[];
  approach: Approach;
  deployment: Deployment;
  sensitivity: Sensitivity;
  horizon: Horizon;
};

export const INDUSTRY_LABEL: Record<Industry, string> = {
  "healthcare-payer": "Healthcare payer",
  "insurance-carrier": "Insurance carrier",
  banking: "Banking",
  retail: "Retail",
  telecom: "Telecom",
  manufacturing: "Manufacturing",
  "enterprise-it": "Enterprise IT",
  cybersecurity: "Cybersecurity",
  other: "Other",
};

export const WORKFLOW_LABEL: Record<Workflow, string> = {
  claims: "Claims",
  "fraud-aml": "Fraud / AML",
  loyalty: "Loyalty",
  "network-ops": "Network ops",
  "supply-chain": "Supply chain",
  "service-ops": "Service ops",
  "security-ops": "Security ops",
  knowledge: "Knowledge",
  custom: "Custom",
};

export const APPROACH_LABEL: Record<Approach, string> = {
  accelerator: "Accelerator-first",
  hybrid: "Hybrid build",
  bespoke: "Bespoke build",
};

export const DEPLOYMENT_LABEL: Record<Deployment, string> = {
  "our-cloud": "Our cloud",
  "your-cloud": "Your cloud",
  "on-prem": "On-prem",
};

export const SENSITIVITY_LABEL: Record<Sensitivity, string> = {
  public: "Public data",
  regulated: "Regulated",
  restricted: "PHI / PII",
};

export const HORIZON_LABEL: Record<Horizon, string> = {
  weeks: "Weeks",
  quarter: "One quarter",
  "multi-quarter": "Multi-quarter",
};

type AcceleratorEntry = {
  id: string;
  name: string;
  category: string;
  tagline: string;
  industries: Industry[];
  workflows: Workflow[];
  href: string;
};

export const ACCELERATORS: AcceleratorEntry[] = [
  {
    id: "arqfwa",
    name: "ArqFWA",
    category: "Payment integrity and fraud intelligence",
    tagline: "Fraud, waste, abuse, and claims leakage intelligence for payer operations.",
    industries: ["healthcare-payer"],
    workflows: ["fraud-aml", "claims"],
    href: "/accelerators/arqfwa",
  },
  {
    id: "arqclaims",
    name: "ArqClaims",
    category: "Claims triage and decision support",
    tagline: "AI-assisted claims intake, enrichment, routing, and reviewer support.",
    industries: ["healthcare-payer", "insurance-carrier"],
    workflows: ["claims"],
    href: "/accelerators/arqclaims",
  },
  {
    id: "arqbanker",
    name: "ArqBanker",
    category: "Financial crime and customer risk",
    tagline: "AML, KYC, sanctions, ownership, and alert-triage automation.",
    industries: ["banking"],
    workflows: ["fraud-aml"],
    href: "/accelerators/arqbanker",
  },
  {
    id: "arqretail",
    name: "ArqRetail",
    category: "Loyalty and personalization automation",
    tagline: "Next-best offers, retention actions, and customer engagement workflows.",
    industries: ["retail"],
    workflows: ["loyalty"],
    href: "/accelerators/arqretail",
  },
  {
    id: "arqtechops",
    name: "ArqTechOps",
    category: "Network and service operations",
    tagline: "Incident detection, ticket enrichment, escalation, and service restoration.",
    industries: ["telecom", "enterprise-it"],
    workflows: ["network-ops", "service-ops"],
    href: "/accelerators/arqtechops",
  },
  {
    id: "arqlogistics",
    name: "ArqLogistics",
    category: "Supply chain and vendor risk",
    tagline: "Supplier risk, procurement exposure, contract signals, and shipment exceptions.",
    industries: ["manufacturing"],
    workflows: ["supply-chain"],
    href: "/accelerators/arqlogistics",
  },
  {
    id: "arqdesk",
    name: "ArqDesk",
    category: "Enterprise service workflow automation",
    tagline: "Classify, route, resolve, and govern enterprise service workflows.",
    industries: ["enterprise-it"],
    workflows: ["service-ops", "knowledge"],
    href: "/accelerators/arqdesk",
  },
  {
    id: "arqsecops",
    name: "ArqSecOps",
    category: "Security operations and incident intelligence",
    tagline: "Alert triage, incident summaries, threat context, and compliance evidence.",
    industries: ["cybersecurity", "enterprise-it"],
    workflows: ["security-ops"],
    href: "/accelerators/arqsecops",
  },
];

type ServiceEntry = {
  slug: string;
  short: string;
  full: string;
  blurb: string;
};

export const SERVICES: ServiceEntry[] = [
  {
    slug: "workflow-strategy",
    short: "Strategy",
    full: "Workflow Strategy",
    blurb: "Find the workflow. Map the value. Set the controls.",
  },
  {
    slug: "agentic-ai-buildout",
    short: "Buildout",
    full: "Agentic AI Buildout",
    blurb: "Agents, copilots, retrieval, decision flows, review loops.",
  },
  {
    slug: "enterprise-integration",
    short: "Integration",
    full: "Enterprise Integration",
    blurb: "Wire AI into CRM, ERP, ITSM, data, and ops tools.",
  },
  {
    slug: "governance-by-design",
    short: "Governance",
    full: "Governance by Design",
    blurb: "Permissions, approvals, audit trails, exception handling.",
  },
  {
    slug: "vertical-acceleration",
    short: "Acceleration",
    full: "Vertical Acceleration",
    blurb: "Deploy proven accelerator patterns for repeatable workflows.",
  },
  {
    slug: "managed-ai-operations",
    short: "Operations",
    full: "Managed AI Operations",
    blurb: "Monitor, tune, and expand AI workflows after launch.",
  },
];

export type ResolverResult =
  | {
      tier: 1 | 2;
      kind: "accelerator";
      accelerator: AcceleratorEntry;
      services: ServiceEntry[];
      confidence: "exact" | "close";
      shape: string;
      summary: string;
    }
  | {
      tier: 3;
      kind: "bespoke";
      services: ServiceEntry[];
      shape: string;
      summary: string;
    };

function scoreAccelerator(a: AcceleratorEntry, c: Config): number {
  let score = 0;
  if (a.industries.includes(c.industry)) score += 3;
  const workflowOverlap = c.workflows.filter((w) => a.workflows.includes(w)).length;
  score += workflowOverlap * 3;
  return score;
}

function pickServices(c: Config, hasAccelerator: boolean): ServiceEntry[] {
  const set = new Set<string>();
  set.add("workflow-strategy");
  set.add("agentic-ai-buildout");
  if (c.deployment !== "our-cloud") set.add("enterprise-integration");
  if (c.sensitivity !== "public") set.add("governance-by-design");
  if (hasAccelerator) set.add("vertical-acceleration");
  if (c.horizon !== "weeks") set.add("managed-ai-operations");
  return SERVICES.filter((s) => set.has(s.slug));
}

function describeShape(c: Config): string {
  const weeks = c.horizon === "weeks" ? "~4–8 weeks" : c.horizon === "quarter" ? "~10–14 weeks" : "~5–9 months";
  const team =
    c.sensitivity === "restricted" || c.deployment === "on-prem"
      ? "senior team on-site"
      : "senior team remote-first";
  return `${weeks}, ${team}`;
}

export function resolve(c: Config): ResolverResult {
  const scored = ACCELERATORS.map((a) => ({ a, score: scoreAccelerator(a, c) })).sort(
    (x, y) => y.score - x.score,
  );
  const top = scored[0];
  const forceBespoke = c.approach === "bespoke";
  const isExact = top.score >= 6;
  const isClose = top.score >= 3;

  if (!forceBespoke && isExact) {
    return {
      tier: 1,
      kind: "accelerator",
      accelerator: top.a,
      services: pickServices(c, true),
      confidence: "exact",
      shape: describeShape(c),
      summary: `${top.a.name} is on the shelf for ${INDUSTRY_LABEL[c.industry].toLowerCase()} teams running ${c.workflows.map((w) => WORKFLOW_LABEL[w].toLowerCase()).join(" and ") || "this workflow"}.`,
    };
  }
  if (!forceBespoke && isClose && c.approach !== "bespoke") {
    return {
      tier: 2,
      kind: "accelerator",
      accelerator: top.a,
      services: pickServices(c, true),
      confidence: "close",
      shape: describeShape(c),
      summary: `${top.a.name} is the closest packaged fit. We extend it to your specifics during buildout.`,
    };
  }
  return {
    tier: 3,
    kind: "bespoke",
    services: pickServices(c, false),
    shape: describeShape(c),
    summary: forceBespoke
      ? `You asked for bespoke. We design and build this from your ${INDUSTRY_LABEL[c.industry].toLowerCase()} operating context.`
      : `This shape isn't on the shelf. We build it from your ${INDUSTRY_LABEL[c.industry].toLowerCase()} operating context.`,
  };
}

export function configToQuery(c: Config): string {
  const params = new URLSearchParams({
    industry: c.industry,
    workflows: c.workflows.join(","),
    approach: c.approach,
    deployment: c.deployment,
    sensitivity: c.sensitivity,
    horizon: c.horizon,
  });
  return params.toString();
}

export function configToHumanBrief(c: Config): string {
  return [
    `Industry: ${INDUSTRY_LABEL[c.industry]}`,
    `Workflows: ${c.workflows.length ? c.workflows.map((w) => WORKFLOW_LABEL[w]).join(", ") : "—"}`,
    `Approach: ${APPROACH_LABEL[c.approach]}`,
    `Deployment: ${DEPLOYMENT_LABEL[c.deployment]}`,
    `Sensitivity: ${SENSITIVITY_LABEL[c.sensitivity]}`,
    `Horizon: ${HORIZON_LABEL[c.horizon]}`,
  ].join("\n");
}
