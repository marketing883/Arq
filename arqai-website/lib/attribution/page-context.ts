/**
 * Page context — maps a site path to the topic the visitor was engaging
 * with, plus sensible form pre-fills for /contact and /engage-us.
 *
 * Kept as a lightweight hand-maintained map (rather than importing the full
 * accelerator/service data files) so it can ship in the client bundle of the
 * form pages without dragging ~50KB of marketing copy along.
 */

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
};

const ACCELERATORS: Record<string, PageContext> = {
  arqfwa: {
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
  },
  arqloyalty: {
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
  },
  arqbanker: {
    shortLabel: "ArqBanker",
    label: "banking operations — underwriting, KYC, AML, and reporting",
    kind: "accelerator",
    contact: { inquiryType: "workflow", industry: "Banking", workflowArea: "Banking operations — underwriting, KYC, AML (ArqBanker)" },
    engage: { industry: "banking", workflowArea: "financial-crime" },
    question: {
      label: "Which banking workflow hurts most today?",
      placeholder:
        "Underwriting, onboarding/KYC, AML surveillance, or regulatory reporting — with rough volumes and cycle times.",
    },
    entryPoint: {
      name: "Banking Operations Efficiency Assessment",
      blurb:
        "a two-week diagnostic of underwriting cycle times, onboarding drop-off, AML false-positive rates, and reporting hours",
    },
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
  },
  arqvantage: {
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
  },
};

const SERVICES: Record<string, PageContext> = {
  "workflow-strategy": {
    shortLabel: "Workflow Strategy",
    label: "our Workflow Strategy service",
    kind: "service",
    contact: { inquiryType: "workflow" },
  },
  "agentic-ai-buildout": {
    shortLabel: "Agentic AI Buildout",
    label: "our Agentic AI Buildout service",
    kind: "service",
    contact: { inquiryType: "demo" },
  },
  "enterprise-integration": {
    shortLabel: "Enterprise Integration",
    label: "our Enterprise Integration service",
    kind: "service",
    contact: { inquiryType: "integration" },
    engage: { workflowArea: "enterprise-integration" },
  },
  "governance-by-design": {
    shortLabel: "Governance by Design",
    label: "our Governance by Design service",
    kind: "service",
    contact: { inquiryType: "governance" },
    engage: { workflowArea: "governance" },
  },
  "vertical-acceleration": {
    shortLabel: "Vertical Acceleration",
    label: "our Vertical Acceleration service",
    kind: "service",
    contact: { inquiryType: "workflow" },
  },
  "managed-ai-operations": {
    shortLabel: "Managed AI Operations",
    label: "our Managed AI Operations service",
    kind: "service",
    contact: { inquiryType: "managed_ops" },
  },
};

const INDUSTRIES: Record<string, PageContext> = {
  banking: {
    shortLabel: "Banking",
    label: "AI for banking and financial services",
    kind: "industry",
    contact: { inquiryType: "workflow", industry: "Banking" },
    engage: { industry: "banking" },
  },
  "healthcare-payers": {
    shortLabel: "Healthcare Payers",
    label: "AI for healthcare payers",
    kind: "industry",
    contact: { inquiryType: "workflow", industry: "Healthcare payer" },
    engage: { industry: "healthcare-payers" },
  },
  "insurance-carriers": {
    shortLabel: "Insurance Carriers",
    label: "AI for P&C insurance carriers",
    kind: "industry",
    contact: { inquiryType: "workflow", industry: "Insurance carrier" },
    engage: { industry: "insurance-carriers" },
  },
  manufacturing: {
    shortLabel: "Manufacturing",
    label: "AI for manufacturing and supply chain",
    kind: "industry",
    contact: { inquiryType: "workflow", industry: "Manufacturing" },
    engage: { industry: "manufacturing" },
  },
  retail: {
    shortLabel: "Retail",
    label: "AI for retail and loyalty",
    kind: "industry",
    contact: { inquiryType: "workflow", industry: "Retail" },
    engage: { industry: "retail" },
  },
};

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
    };
  }
  return null;
}
