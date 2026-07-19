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
};

const ACCELERATORS: Record<string, PageContext> = {
  arqfwa: {
    shortLabel: "ArqFWA",
    label: "payment integrity and FWA detection for healthcare payers",
    kind: "accelerator",
    contact: { inquiryType: "workflow", industry: "Healthcare payer", workflowArea: "Payment integrity / FWA detection (ArqFWA)" },
    engage: { industry: "healthcare-payers", workflowArea: "fraud-leakage" },
  },
  arqloyalty: {
    shortLabel: "ArqLoyalty",
    label: "loyalty platform modernization without migration risk",
    kind: "accelerator",
    contact: { inquiryType: "workflow", industry: "Retail / loyalty operator", workflowArea: "Loyalty platform modernization (ArqLoyalty)" },
    engage: { industry: "retail", workflowArea: "customer-operations" },
  },
  arqlogistics: {
    shortLabel: "ArqLogistics",
    label: "supply chain and vendor risk intelligence",
    kind: "accelerator",
    contact: { inquiryType: "workflow", industry: "Manufacturing / supply chain", workflowArea: "Supply chain & vendor risk (ArqLogistics)" },
    engage: { industry: "manufacturing", workflowArea: "supply-chain" },
  },
  arqbanker: {
    shortLabel: "ArqBanker",
    label: "banking operations — underwriting, KYC, AML, and reporting",
    kind: "accelerator",
    contact: { inquiryType: "workflow", industry: "Banking", workflowArea: "Banking operations — underwriting, KYC, AML (ArqBanker)" },
    engage: { industry: "banking", workflowArea: "financial-crime" },
  },
  arqforecast: {
    shortLabel: "ArqForecast",
    label: "demand, inventory, and cash flow forecasting",
    kind: "accelerator",
    contact: { inquiryType: "workflow", workflowArea: "Demand & cash flow forecasting (ArqForecast)" },
    engage: { workflowArea: "supply-chain" },
  },
  arqsupport: {
    shortLabel: "ArqSupport",
    label: "agentic ticket triage and service management",
    kind: "accelerator",
    contact: { inquiryType: "workflow", workflowArea: "Service desk / ticket automation (ArqSupport)" },
    engage: { workflowArea: "customer-operations" },
  },
  arqdataq: {
    shortLabel: "ArqDataQ",
    label: "data quality monitoring and autonomous remediation",
    kind: "accelerator",
    contact: { inquiryType: "workflow", workflowArea: "Data quality monitoring (ArqDataQ)" },
    engage: { workflowArea: "enterprise-integration" },
  },
  arqvantage: {
    shortLabel: "ArqVantage",
    label: "competitive pricing intelligence and governed repricing",
    kind: "accelerator",
    contact: { inquiryType: "workflow", workflowArea: "Competitive pricing intelligence (ArqVantage)" },
    engage: { workflowArea: "custom" },
  },
  arqsecops: {
    shortLabel: "ArqSecOps",
    label: "security operations and incident intelligence",
    kind: "accelerator",
    contact: { inquiryType: "governance", workflowArea: "Security operations (ArqSecOps)" },
    engage: { workflowArea: "governance" },
  },
  arqeye: {
    shortLabel: "ArqEye",
    label: "AI-native data observability and pipeline intelligence",
    kind: "accelerator",
    contact: { inquiryType: "workflow", workflowArea: "Data observability (ArqEye)" },
    engage: { workflowArea: "enterprise-integration" },
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
