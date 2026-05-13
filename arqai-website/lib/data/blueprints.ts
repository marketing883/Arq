export interface Blueprint {
  id: string;
  name: string;
  category: string;
  headline: string;
  description: string;
  features: string[];
  metrics: { value: string; label: string }[];
  status: "available" | "blueprint" | "pilot" | "roadmap";
  workflowContexts: string[];
  industries: string[];
  link?: string;
}

export const blueprints: Blueprint[] = [
  {
    id: "arqrelease",
    name: "ArqRelease",
    category: "IT Infrastructure",
    headline: "Autonomous DevSecOps documentation that never falls behind",
    description:
      "Continuously monitors CI/CD pipelines, auto-generates JIRA tickets for significant changes, keeps technical documentation current. Built on Trust-Aware Orchestration.",
    features: [
      "CI/CD Pipeline Monitoring",
      "Auto-generated Documentation",
      "JIRA Integration",
      "Full Audit Trails",
    ],
    metrics: [
      { value: "40%", label: "Faster releases" },
      { value: "0", label: "Compliance violations" },
      { value: "100%", label: "Audit coverage" },
    ],
    status: "available",
    workflowContexts: ["Release documentation", "Change tracking", "Audit preparation"],
    industries: ["telecom", "financial", "healthcare"],
    link: "/solutions/arqrelease",
  },
  {
    id: "arqoptimize",
    name: "ArqOptimize",
    category: "FinOps",
    headline: "Autonomous cloud cost optimization across your entire stack",
    description:
      "Analyzes spending patterns, identifies waste, provides actionable recommendations. Connects project management tools to infrastructure for full visibility.",
    features: [
      "Multi-cloud Cost Analysis",
      "Waste Identification",
      "Actionable Recommendations",
      "Project-to-Infrastructure Mapping",
    ],
    metrics: [
      { value: "25-40%", label: "Cost reduction" },
      { value: "Real-time", label: "Recommendations" },
      { value: "Multi-cloud", label: "Support" },
    ],
    status: "available",
    workflowContexts: ["Cloud spend review", "Waste identification", "Project-to-cost visibility"],
    industries: ["telecom", "financial", "retail"],
    link: "/solutions/arqoptimize",
  },
  {
    id: "arqfwa",
    name: "ArqFWA",
    category: "Insurance Workflows",
    headline: "Intelligent insurance workflow automation with compliance built-in",
    description:
      "Automates underwriting, claims processing, and compliance tracking. Every decision carries verifiable evidence chains for regulatory requirements.",
    features: [
      "Claims Adjudication",
      "Policy Underwriting",
      "Fraud Detection",
      "Compliance Tracking",
    ],
    metrics: [
      { value: "70%", label: "Faster claim processing" },
      { value: "100%", label: "Regulatory compliance" },
      { value: "Full", label: "Audit trails" },
    ],
    status: "available",
    workflowContexts: ["Claims review", "Underwriting support", "Fraud detection"],
    industries: ["insurance"],
    link: "/solutions/arqfwa",
  },
  {
    id: "arqintel",
    name: "ArqIntel",
    category: "Investment Intelligence",
    headline: "AI-powered investment due diligence at scale",
    description:
      "Accelerates deal review with intelligent company analysis, competitive-context evaluation, and automated risk scoring for investment decisions.",
    features: [
      "Deal Flow Acceleration",
      "Company Analysis",
      "Risk Assessment",
      "Market Intelligence",
    ],
    metrics: [
      { value: "70%", label: "Faster screening" },
      { value: "Deeper", label: "Portfolio insights" },
      { value: "Automated", label: "Risk scoring" },
    ],
    status: "available",
    workflowContexts: ["Deal screening", "Company analysis", "Risk scoring"],
    industries: ["financial"],
    link: "/solutions/arqintel",
  },
  {
    id: "revenue-ops",
    name: "Revenue Operations Agent",
    category: "Revenue Operations",
    headline: "Autonomous revenue intelligence and pipeline optimization",
    description:
      "Monitors sales pipelines, identifies at-risk deals, automates forecasting, and provides actionable insights for revenue teams with full governance.",
    features: [
      "Pipeline Health Monitoring",
      "Deal Risk Scoring",
      "Automated Forecasting",
      "CRM Integration",
    ],
    metrics: [
      { value: "35%", label: "Forecast accuracy improvement" },
      { value: "Real-time", label: "Pipeline insights" },
      { value: "Governed", label: "Data access" },
    ],
    status: "blueprint",
    workflowContexts: ["Pipeline monitoring", "Deal-risk scoring", "Forecast support"],
    industries: ["retail", "financial", "telecom"],
  },
  {
    id: "customer-success",
    name: "Customer Success Agent",
    category: "Customer Success",
    headline: "Proactive customer health monitoring and intervention",
    description:
      "Tracks customer health scores, identifies churn risks, automates outreach, and ensures every customer interaction is logged and compliant.",
    features: [
      "Health Score Monitoring",
      "Churn Prediction",
      "Automated Outreach",
      "Interaction Logging",
    ],
    metrics: [
      { value: "25%", label: "Churn reduction" },
      { value: "Proactive", label: "Risk identification" },
      { value: "Complete", label: "Audit trails" },
    ],
    status: "blueprint",
    workflowContexts: ["Health scoring", "Churn risk", "Customer intervention"],
    industries: ["retail", "telecom", "financial"],
  },
  {
    id: "demand-gen",
    name: "Demand Generation Agent",
    category: "Marketing Automation",
    headline: "Intelligent lead scoring and campaign optimization",
    description:
      "Scores and prioritizes leads, optimizes campaign performance, and ensures all marketing automation respects privacy regulations and consent.",
    features: [
      "Lead Scoring",
      "Campaign Optimization",
      "Privacy Compliance",
      "Attribution Tracking",
    ],
    metrics: [
      { value: "40%", label: "Lead quality improvement" },
      { value: "GDPR/CCPA", label: "Compliant" },
      { value: "Full", label: "Attribution" },
    ],
    status: "blueprint",
    workflowContexts: ["Lead scoring", "Campaign optimization", "Consent-aware outreach"],
    industries: ["retail", "financial", "healthcare"],
  },
  {
    id: "healthcare-clinical",
    name: "Clinical Operations Agent",
    category: "Healthcare Operations",
    headline: "HIPAA-compliant clinical workflow automation",
    description:
      "Automates patient data management, clinical documentation, and administrative workflows while ensuring complete HIPAA compliance and audit trails.",
    features: [
      "Patient Data Management",
      "Clinical Documentation",
      "Prior Authorization",
      "HIPAA Compliance",
    ],
    metrics: [
      { value: "60%", label: "Admin time reduction" },
      { value: "100%", label: "HIPAA compliant" },
      { value: "Zero", label: "PHI violations" },
    ],
    status: "available",
    workflowContexts: ["Clinical documentation", "Administrative workflow", "Prior authorization"],
    industries: ["healthcare"],
  },
  {
    id: "real-estate-ops",
    name: "Real Estate Operations Agent",
    category: "Real Estate",
    headline: "Intelligent property analysis and transaction management",
    description:
      "Automates property valuation, due diligence, and transaction workflows with complete transparency and compliance for real estate operations.",
    features: [
      "Property Valuation",
      "Due Diligence Automation",
      "Transaction Management",
      "Compliance Tracking",
    ],
    metrics: [
      { value: "50%", label: "Faster due diligence" },
      { value: "Automated", label: "Valuations" },
      { value: "Full", label: "Transparency" },
    ],
    status: "pilot",
    workflowContexts: ["Property valuation", "Due diligence", "Transaction workflow"],
    industries: ["realEstate"],
  },
];

// Helper functions
export const getAvailableBlueprints = () =>
  blueprints.filter((b) => b.status === "available");

export const getBlueprintsByStatus = (status: Blueprint["status"]) =>
  blueprints.filter((b) => b.status === status);

export const getBlueprintsByIndustry = (industryId: string) =>
  blueprints.filter((b) => b.industries.includes(industryId));

export const getFeaturedBlueprints = (limit = 6) =>
  blueprints.slice(0, limit);
