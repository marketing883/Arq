/**
 * Page context: maps a site path to the topic the visitor was engaging
 * with, plus sensible form pre-fills for /contact and /engage-us.
 *
 * Kept as a lightweight hand-maintained map (rather than importing the full
 * accelerator/service data files) so it can ship in the client bundle of the
 * form pages without dragging ~50KB of marketing copy along.
 */

/**
 * A pointed, clickable qualifying question. "radio" = pick one,
 * "chips" = pick any. Answers are composed into the submission message,
 * no free-text typing required from the visitor.
 */
export type Qualifier = {
  id: string;
  label: string;
  type: "radio" | "chips";
  options: string[];
};

/** Shared "when?" question, asked in every block, mapped to the API's timeline slugs. */
export const TIMELINE_QUALIFIER: Qualifier = {
  id: "timeline",
  label: "When are you looking to move?",
  type: "radio",
  options: ["Urgent", "This quarter", "Next 3-6 months", "Just exploring"],
};

const TIMELINE_SLUGS: Record<string, string> = {
  Urgent: "now",
  "This quarter": "quarter",
  "Next 3-6 months": "half_year",
  "Just exploring": "exploring",
};

export function timelineToSlug(label: string | undefined): string {
  return (label && TIMELINE_SLUGS[label]) || "";
}

export type PageContext = {
  /** Short name shown in the context banner, e.g. "ArqFWA". */
  shortLabel: string;
  /** One-line description shown in the context banner. */
  label: string;
  kind: "accelerator" | "service" | "industry" | "case-study";
  /** Pre-fills for the /contact form (free-text industry/workflow fields). */
  contact?: {
    inquiryType?: string;
    industry?: string;
    workflowArea?: string;
  };
  /** Pre-fills for the /engage-us form (select slugs, must match its options). */
  engage?: {
    industry?: string;
    workflowArea?: string;
  };
  /**
   * Topic-specific replacement for the generic message field, so the form
   * asks the question a scoping call would open with.
   */
  question?: {
    label: string;
    placeholder: string;
  };
  /**
   * The accelerator's fixed two-week entry point (fit check) offered as a
   * one-click "start with this" option. Mirrors lib/data/accelerators.ts.
   */
  entryPoint?: {
    name: string;
    blurb: string;
  };
  /** Pointed click-to-answer questions shown instead of open text fields. */
  qualifiers?: Qualifier[];
  /**
   * True when a live product demo exists for this accelerator. Drives the
   * "See a live demo" option on the accelerator page form. Flip this flag
   * when an accelerator becomes demo ready and every form picks it up.
   */
  demoReady?: boolean;
};

const ACCELERATORS: Record<string, PageContext> = {
  arqfwa: {
    demoReady: true,
    shortLabel: "ArqFWA",
    label: "payment integrity and FWA detection for healthcare payers",
    kind: "accelerator",
    contact: { inquiryType: "workflow", industry: "Healthcare payer", workflowArea: "Payment integrity / FWA detection (ArqFWA)" },
    engage: { industry: "healthcare-payers", workflowArea: "fraud-leakage" },
    question: {
      label: "What does your claims operation look like?",
      placeholder:
        "Rough claims volume per month, lines of business, current FWA tooling, and where you suspect leakage.",
    },
    entryPoint: {
      name: "FWA Blind Spot Assessment",
      blurb:
        "a two-week analysis of a claims sample against 120+ FWA patterns your current rules don't cover",
    },
    qualifiers: [
      { id: "volume", label: "Claims volume per month", type: "radio", options: ["Under 25k", "25k-100k", "100k-500k", "500k+"] },
      { id: "current", label: "What do you use for FWA today?", type: "chips", options: ["Rules engine", "Manual review / SIU", "Vendor tool", "Nothing formal"] },
      TIMELINE_QUALIFIER,
    ],
  },
  arqloyalty: {
    demoReady: true,
    shortLabel: "ArqLoyalty",
    label: "loyalty platform modernization without migration risk",
    kind: "accelerator",
    contact: { inquiryType: "workflow", industry: "Retail / loyalty operator", workflowArea: "Loyalty platform modernization (ArqLoyalty)" },
    engage: { industry: "retail", workflowArea: "customer-operations" },
    question: {
      label: "What does your loyalty program look like?",
      placeholder:
        "Current platform, number of members and currencies, and what's driving the modernization.",
    },
    entryPoint: {
      name: "Loyalty Platform Risk Assessment",
      blurb:
        "a two-week analysis of your program structure, transaction volume, and data model with a migration sequence recommendation",
    },
    qualifiers: [
      { id: "platform", label: "What runs your loyalty program today?", type: "radio", options: ["Custom / in-house", "Legacy vendor platform", "Modern SaaS", "No program yet"] },
      { id: "members", label: "Program size (members)", type: "radio", options: ["Under 100k", "100k-1M", "1M-10M", "10M+"] },
      TIMELINE_QUALIFIER,
    ],
  },
  arqlogistics: {
    shortLabel: "ArqLogistics",
    label: "supply chain and vendor risk intelligence",
    kind: "accelerator",
    contact: { inquiryType: "workflow", industry: "Manufacturing / supply chain", workflowArea: "Supply chain & vendor risk (ArqLogistics)" },
    engage: { industry: "manufacturing", workflowArea: "supply-chain" },
    question: {
      label: "What does your supplier landscape look like?",
      placeholder:
        "Supplier count, critical single-source dependencies, ERP and procurement systems, and any recent disruptions.",
    },
    entryPoint: {
      name: "Supplier Risk Blind Spot Audit",
      blurb:
        "a two-week analysis of your top 50 supplier relationships against 12 risk signals you aren't monitoring today",
    },
    qualifiers: [
      { id: "suppliers", label: "Active suppliers", type: "radio", options: ["Under 100", "100-500", "500-2,000", "2,000+"] },
      { id: "worry", label: "What worries you most?", type: "chips", options: ["Single-source dependencies", "Tier-2/3 visibility", "Late disruption warning", "Procurement exposure"] },
      TIMELINE_QUALIFIER,
    ],
  },
  arqbanker: {
    shortLabel: "ArqBanker",
    label: "banking operations: underwriting, KYC, AML, and reporting",
    kind: "accelerator",
    contact: { inquiryType: "workflow", industry: "Banking", workflowArea: "Banking operations: underwriting, KYC, AML (ArqBanker)" },
    engage: { industry: "banking", workflowArea: "financial-crime" },
    question: {
      label: "Which banking workflow hurts most today?",
      placeholder:
        "Underwriting, onboarding/KYC, AML surveillance, or regulatory reporting, with rough volumes and cycle times.",
    },
    entryPoint: {
      name: "Banking Operations Efficiency Assessment",
      blurb:
        "a two-week diagnostic of underwriting cycle times, onboarding drop-off, AML false-positive rates, and reporting hours",
    },
    qualifiers: [
      { id: "area", label: "Which area first?", type: "chips", options: ["Underwriting", "Onboarding / KYC", "AML surveillance", "Regulatory reporting"] },
      TIMELINE_QUALIFIER,
    ],
  },
  arqforecast: {
    shortLabel: "ArqForecast",
    label: "demand, inventory, and cash flow forecasting",
    kind: "accelerator",
    contact: { inquiryType: "workflow", workflowArea: "Demand & cash flow forecasting (ArqForecast)" },
    engage: { workflowArea: "supply-chain" },
    question: {
      label: "What are you forecasting today?",
      placeholder:
        "Demand, inventory, or cash flow; the data sources involved; and how the current forecast is produced.",
    },
    entryPoint: {
      name: "Forecasting Accuracy Baseline",
      blurb:
        "a two-week benchmark of your historical data against the current forecasting method, with an opportunity size estimate",
    },
    qualifiers: [
      { id: "what", label: "What are you forecasting?", type: "chips", options: ["Demand", "Inventory", "Cash flow", "Raw materials"] },
      { id: "how", label: "How is it done today?", type: "radio", options: ["Spreadsheets", "BI tool", "Custom ML", "Vendor tool"] },
      TIMELINE_QUALIFIER,
    ],
  },
  arqsupport: {
    shortLabel: "ArqSupport",
    label: "agentic ticket triage and service management",
    kind: "accelerator",
    contact: { inquiryType: "workflow", workflowArea: "Service desk / ticket automation (ArqSupport)" },
    engage: { workflowArea: "customer-operations" },
    question: {
      label: "What does your ticket queue look like?",
      placeholder:
        "Monthly ticket volume, ticketing system, the most repetitive L1 categories, and SLA pain points.",
    },
    entryPoint: {
      name: "Support Queue Analysis",
      blurb:
        "a two-week review of ticket categories, resolution patterns, and SLA performance showing your L1 auto-resolution opportunity",
    },
    qualifiers: [
      { id: "volume", label: "Tickets per month", type: "radio", options: ["Under 1k", "1k-10k", "10k-50k", "50k+"] },
      { id: "system", label: "Ticketing system", type: "chips", options: ["ServiceNow", "Jira SM", "Zendesk", "Freshservice", "Other"] },
      TIMELINE_QUALIFIER,
    ],
  },
  arqdataq: {
    shortLabel: "ArqDataQ",
    label: "data quality monitoring and autonomous remediation",
    kind: "accelerator",
    contact: { inquiryType: "workflow", workflowArea: "Data quality monitoring (ArqDataQ)" },
    engage: { workflowArea: "enterprise-integration" },
    question: {
      label: "Where does bad data bite today?",
      placeholder:
        "Warehouse and pipeline stack, the critical datasets, and the last incident an end user caught before your team did.",
    },
    entryPoint: {
      name: "Data Quality Baseline Audit",
      blurb:
        "a two-week profiling run across your critical pipelines with top issue categories ranked by business impact",
    },
    qualifiers: [
      { id: "stack", label: "Where does your data live?", type: "chips", options: ["Snowflake", "Databricks", "BigQuery", "Redshift", "Other"] },
      { id: "pain", label: "Biggest pain today", type: "chips", options: ["Users find issues first", "Constant fire-fighting", "No pipeline visibility", "Governance SLAs"] },
      TIMELINE_QUALIFIER,
    ],
  },
  arqvantage: {
    demoReady: true,
    shortLabel: "ArqVantage",
    label: "competitive pricing intelligence and governed repricing",
    kind: "accelerator",
    contact: { inquiryType: "workflow", workflowArea: "Competitive pricing intelligence (ArqVantage)" },
    engage: { workflowArea: "custom" },
    question: {
      label: "What does your pricing battlefield look like?",
      placeholder:
        "Marketplaces you sell on, SKU count, the competitors you watch, and any MAP or B2B contract constraints.",
    },
    entryPoint: {
      name: "Competitive Pricing Blind Spot Scan",
      blurb:
        "a 30-day monitor of your top 50 SKUs against the top 10 competitors, with a pricing gap report and opportunity matrix",
    },
    qualifiers: [
      { id: "channels", label: "Where do you sell?", type: "chips", options: ["Amazon", "Walmart", "Own site", "Distributor portals"] },
      { id: "skus", label: "SKUs to monitor", type: "radio", options: ["Under 100", "100-1k", "1k-10k", "10k+"] },
      TIMELINE_QUALIFIER,
    ],
  },
  arqsecops: {
    shortLabel: "ArqSecOps",
    label: "security operations and incident intelligence",
    kind: "accelerator",
    contact: { inquiryType: "governance", workflowArea: "Security operations (ArqSecOps)" },
    engage: { workflowArea: "governance" },
    question: {
      label: "Where does the SOC lose time today?",
      placeholder:
        "SIEM/EDR stack, daily alert volume, analyst headcount, and where compliance evidence hurts most.",
    },
    entryPoint: {
      name: "SecOps Coverage Gap Assessment",
      blurb:
        "a two-week review of alert volume, tooling integrations, context-assembly time, and evidence practices",
    },
    qualifiers: [
      { id: "siem", label: "Core SIEM", type: "chips", options: ["Splunk", "Microsoft Sentinel", "QRadar", "Other"] },
      { id: "drain", label: "Biggest drain on the team", type: "chips", options: ["Alert volume", "Context assembly", "Shift handoffs", "Compliance evidence"] },
      TIMELINE_QUALIFIER,
    ],
  },
  arqeye: {
    shortLabel: "ArqEye",
    label: "AI-native data observability and pipeline intelligence",
    kind: "accelerator",
    contact: { inquiryType: "workflow", workflowArea: "Data observability (ArqEye)" },
    engage: { workflowArea: "enterprise-integration" },
    question: {
      label: "How do data incidents surface today?",
      placeholder:
        "Your data stack, recent incidents, typical detection lag, and which data SLAs exist on paper only.",
    },
    entryPoint: {
      name: "Data Observability Maturity Assessment",
      blurb:
        "a two-week analysis of recent incidents, detection lag, and SLA compliance with a prioritized roadmap",
    },
    qualifiers: [
      { id: "stack", label: "Data platform", type: "chips", options: ["Snowflake", "Databricks", "BigQuery", "Redshift", "Other"] },
      { id: "pain", label: "Biggest pain today", type: "chips", options: ["Late incident detection", "Unknown blast radius", "Schema drift surprises", "SLAs on paper only"] },
      TIMELINE_QUALIFIER,
    ],
  },
};

const SERVICES: Record<string, PageContext> = {
  "workflow-strategy": {
    shortLabel: "Workflow Strategy",
    label: "our Workflow Strategy service",
    kind: "service",
    contact: { inquiryType: "workflow" },
    qualifiers: [
      { id: "goal", label: "What are you trying to figure out?", type: "chips", options: ["Where AI fits", "Business case / ROI", "Roadmap & sequencing", "Build vs buy"] },
      TIMELINE_QUALIFIER,
    ],
  },
  "agentic-ai-buildout": {
    shortLabel: "Agentic AI Buildout",
    label: "our Agentic AI Buildout service",
    kind: "service",
    contact: { inquiryType: "demo" },
    qualifiers: [
      { id: "stage", label: "Where are you today?", type: "radio", options: ["Idea stage", "Prototype exists", "A pilot that stalled", "Scaling something live"] },
      TIMELINE_QUALIFIER,
    ],
  },
  "enterprise-integration": {
    shortLabel: "Enterprise Integration",
    label: "our Enterprise Integration service",
    kind: "service",
    contact: { inquiryType: "integration" },
    engage: { workflowArea: "enterprise-integration" },
    qualifiers: [
      { id: "systems", label: "What needs connecting?", type: "chips", options: ["CRM", "ERP", "Data warehouse", "Ticketing / ITSM", "Legacy / core systems"] },
      TIMELINE_QUALIFIER,
    ],
  },
  "governance-by-design": {
    shortLabel: "Governance by Design",
    label: "our Governance by Design service",
    kind: "service",
    contact: { inquiryType: "governance" },
    engage: { workflowArea: "governance" },
    qualifiers: [
      { id: "driver", label: "What's driving it?", type: "chips", options: ["Upcoming audit", "Regulator expectations", "Board mandate", "Scaling AI safely"] },
      TIMELINE_QUALIFIER,
    ],
  },
  "vertical-acceleration": {
    shortLabel: "Vertical Acceleration",
    label: "our Vertical Acceleration service",
    kind: "service",
    contact: { inquiryType: "workflow" },
    qualifiers: [
      { id: "domain", label: "Which domain?", type: "chips", options: ["Healthcare claims", "Loyalty", "Supply chain", "Banking ops", "Other"] },
      TIMELINE_QUALIFIER,
    ],
  },
  "managed-ai-operations": {
    shortLabel: "Managed AI Operations",
    label: "our Managed AI Operations service",
    kind: "service",
    contact: { inquiryType: "managed_ops" },
    qualifiers: [
      { id: "today", label: "What's running today?", type: "radio", options: ["Nothing yet", "A pilot in production", "Several AI workflows", "Inherited / unmanaged AI"] },
      TIMELINE_QUALIFIER,
    ],
  },
};

const INDUSTRIES: Record<string, PageContext> = {
  banking: {
    shortLabel: "Banking",
    label: "AI for banking and financial services",
    kind: "industry",
    contact: { inquiryType: "workflow", industry: "Banking" },
    engage: { industry: "banking" },
    qualifiers: [
      { id: "area", label: "Which area?", type: "chips", options: ["Underwriting", "KYC / onboarding", "AML & financial crime", "Reporting", "Customer operations"] },
      TIMELINE_QUALIFIER,
    ],
  },
  "healthcare-payers": {
    shortLabel: "Healthcare Payers",
    label: "AI for healthcare payers",
    kind: "industry",
    contact: { inquiryType: "workflow", industry: "Healthcare payer" },
    engage: { industry: "healthcare-payers" },
    qualifiers: [
      { id: "area", label: "Which area?", type: "chips", options: ["Payment integrity / FWA", "Claims triage", "Member services", "Provider operations"] },
      TIMELINE_QUALIFIER,
    ],
  },
  "insurance-carriers": {
    shortLabel: "Insurance Carriers",
    label: "AI for P&C insurance carriers",
    kind: "industry",
    contact: { inquiryType: "workflow", industry: "Insurance carrier" },
    engage: { industry: "insurance-carriers" },
    qualifiers: [
      { id: "area", label: "Which area?", type: "chips", options: ["Claims triage", "Fraud / leakage", "Underwriting", "Policy servicing"] },
      TIMELINE_QUALIFIER,
    ],
  },
  manufacturing: {
    shortLabel: "Manufacturing",
    label: "AI for manufacturing and supply chain",
    kind: "industry",
    contact: { inquiryType: "workflow", industry: "Manufacturing" },
    engage: { industry: "manufacturing" },
    qualifiers: [
      { id: "area", label: "Which area?", type: "chips", options: ["Supplier risk", "Demand forecasting", "Procurement", "Quality"] },
      TIMELINE_QUALIFIER,
    ],
  },
  retail: {
    shortLabel: "Retail",
    label: "AI for retail and loyalty",
    kind: "industry",
    contact: { inquiryType: "workflow", industry: "Retail" },
    engage: { industry: "retail" },
    qualifiers: [
      { id: "area", label: "Which area?", type: "chips", options: ["Loyalty", "Pricing", "Demand forecasting", "Customer service"] },
      TIMELINE_QUALIFIER,
    ],
  },
};

/**
 * Every accelerator as a dropdown choice for the Book a Demo form, in
 * catalog order (verticals first, then horizontals).
 */
export const ACCELERATOR_CHOICES: { slug: string; name: string }[] = Object.entries(
  ACCELERATORS
).map(([slug, ctx]) => ({ slug, name: ctx.shortLabel }));

/**
 * Resolve a site path to the topic it represents, or null for generic pages
 * (home, blog, about...) where no meaningful pre-fill exists.
 */
export function getPageContext(path: string | null | undefined): PageContext | null {
  if (!path || !path.startsWith("/")) return null;
  const clean = path.split(/[?#]/)[0].replace(/\/+$/, "");
  const segments = clean.split("/").filter(Boolean);
  if (segments.length < 1) return null;

  const [section, slug] = segments;
  if (section === "accelerators" && slug) return ACCELERATORS[slug] ?? null;
  if (section === "services" && slug) return SERVICES[slug] ?? null;
  if (section === "industries" && slug) return INDUSTRIES[slug] ?? null;
  if (section === "case-studies" && slug) {
    return {
      shortLabel: "a case study",
      label: "an engagement similar to the case study you just read",
      kind: "case-study",
      contact: { inquiryType: "workflow" },
      qualifiers: [
        { id: "interest", label: "What caught your eye?", type: "chips", options: ["We have a similar problem", "The approach", "The numbers", "Just exploring"] },
        TIMELINE_QUALIFIER,
      ],
    };
  }
  return null;
}

// ============================================================
// Generic intents: shown when the visitor arrives with no context.
// One friendly chooser; picking an intent reveals its 1-2 questions.
// ============================================================

export type GenericIntent = {
  id: string;
  label: string;
  inquiryType: string;
  workflowArea: string;
  qualifiers: Qualifier[];
  /** When set, this intent routes elsewhere instead of showing questions. */
  routeTo?: { href: string; label: string };
};

export const genericIntents: GenericIntent[] = [
  {
    id: "accelerator",
    label: "An accelerator I read about",
    inquiryType: "workflow",
    workflowArea: "Accelerator interest",
    qualifiers: [
      { id: "which", label: "Which one?", type: "chips", options: ["ArqFWA", "ArqLoyalty", "ArqLogistics", "ArqBanker", "ArqForecast", "ArqSupport", "ArqDataQ", "ArqVantage", "ArqSecOps", "ArqEye", "Not sure yet"] },
      TIMELINE_QUALIFIER,
    ],
  },
  {
    id: "workflow",
    label: "Modernizing a workflow",
    inquiryType: "workflow",
    workflowArea: "Workflow modernization",
    qualifiers: [
      { id: "area", label: "What kind of work?", type: "chips", options: ["Claims / documents", "Fraud & risk", "Customer operations", "Supply chain", "Data & analytics", "Security operations", "Other"] },
      TIMELINE_QUALIFIER,
    ],
  },
  {
    id: "governance",
    label: "AI governance & risk",
    inquiryType: "governance",
    workflowArea: "AI governance",
    qualifiers: [
      { id: "driver", label: "What's driving it?", type: "chips", options: ["Upcoming audit", "Regulator expectations", "Board mandate", "Scaling AI safely"] },
      TIMELINE_QUALIFIER,
    ],
  },
  {
    id: "partnership",
    label: "Partnership",
    inquiryType: "general",
    workflowArea: "Partnership",
    qualifiers: [],
    routeTo: { href: "/partners", label: "Use the partner intake, which goes straight to the right team" },
  },
  {
    id: "other",
    label: "Something else",
    inquiryType: "general",
    workflowArea: "General inquiry",
    qualifiers: [TIMELINE_QUALIFIER],
  },
];
