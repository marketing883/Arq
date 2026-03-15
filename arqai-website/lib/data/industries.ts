export interface Industry {
  id: string;
  title: string;
  headline: string;
  description: string;
  useCases: string[];
  regulations: string[];
  status: "active" | "pilot" | "roadmap";
}

export const industries: Record<string, Industry> = {
  financial: {
    id: "financial",
    title: "Financial Services",
    headline: "AI-Powered Automation with Unbreakable Compliance",
    description:
      "In an industry where a single compliance failure can cost millions, ArqAI provides the assurance to automate your most critical processes. From SOX and FINRA to the Fair Lending Act, our platform allows you to codify your regulatory obligations and build agents that adhere to them by design.",
    useCases: [
      "Automated Loan & Mortgage Underwriting",
      "Algorithmic Trade Compliance Monitoring",
      "KYC/AML Process Automation",
      "Automated Generation of Regulatory Reports",
    ],
    regulations: ["SOX", "FINRA", "Fair Lending Act", "GLBA", "Basel III", "MiFID II"],
    status: "active",
  },
  insurance: {
    id: "insurance",
    title: "Insurance",
    headline: "Build a Trusted Agent Workforce for Claims Processing",
    description:
      "The insurance industry runs on complex rules and sensitive data. ArqAI provides the foundry to build agents that can navigate this complexity securely. Automate claims, price policies, and detect fraud with a complete audit trail for every decision.",
    useCases: [
      "Autonomous Claims Adjudication & Processing",
      "Dynamic Policy Underwriting & Pricing",
      "Automated Fraud Detection & Flagging",
      "Compliance with NAIC and IFRS 17 standards",
    ],
    regulations: ["NAIC Model Laws", "IFRS 17", "State Insurance Regulations", "HIPAA (Health)"],
    status: "active",
  },
  healthcare: {
    id: "healthcare",
    title: "Healthcare",
    headline: "Securely Automate Clinical and Administrative Processes",
    description:
      "Patient data is your most sensitive asset. ArqAI's zero-trust architecture ensures that agents interacting with PHI do so with provable, audited permission. Build agents that can streamline operations while maintaining the highest standards of patient data privacy.",
    useCases: [
      "Patient Data Management & Summarization",
      "Clinical Trial Reporting & Data Analysis (GxP)",
      "Automated Medical Billing & Coding",
      "Prior Authorization & Payer Communications",
    ],
    regulations: ["HIPAA", "HITECH", "GxP", "21 CFR Part 11", "GDPR (EU)"],
    status: "active",
  },
  telecom: {
    id: "telecom",
    title: "Telecommunications",
    headline: "Autonomous Infrastructure Management at Scale",
    description:
      "Telecom networks generate massive amounts of operational data. ArqAI enables autonomous agents that can monitor, document, and optimize your infrastructure while maintaining complete audit trails for regulatory compliance.",
    useCases: [
      "Autonomous DevSecOps Documentation",
      "Network Performance Monitoring & Optimization",
      "Automated Incident Response & Resolution",
      "Compliance Documentation & Reporting",
    ],
    regulations: ["FCC Regulations", "CPNI", "SOC 2", "ISO 27001"],
    status: "active",
  },
  retail: {
    id: "retail",
    title: "Retail & E-Commerce",
    headline: "Customer Intelligence with Privacy Built In",
    description:
      "Retail runs on customer data and rapid decision-making. ArqAI enables AI agents that can personalize experiences, optimize inventory, and drive revenue while ensuring GDPR, CCPA, and PCI-DSS compliance at every step.",
    useCases: [
      "Personalized Customer Recommendations",
      "Dynamic Inventory Management",
      "Fraud Detection & Prevention",
      "Customer Service Automation",
    ],
    regulations: ["GDPR", "CCPA", "PCI-DSS", "Consumer Protection Laws"],
    status: "active",
  },
  realEstate: {
    id: "realEstate",
    title: "Real Estate",
    headline: "Intelligent Property Operations with Full Transparency",
    description:
      "Real estate transactions involve complex documentation and regulatory requirements. ArqAI agents can automate property analysis, due diligence, and transaction management with complete audit trails.",
    useCases: [
      "Automated Property Valuation & Analysis",
      "Due Diligence Document Processing",
      "Lease Management & Compliance",
      "Transaction Workflow Automation",
    ],
    regulations: ["Fair Housing Act", "RESPA", "State Licensing Requirements", "AML/KYC"],
    status: "pilot",
  },
  government: {
    id: "government",
    title: "Government & Public Sector",
    headline: "Trusted AI for Mission-Critical Public Services",
    description:
      "Government agencies require the highest standards of security, accountability, and transparency. ArqAI provides the governance framework for AI agents that can serve the public while meeting stringent federal requirements.",
    useCases: [
      "Citizen Service Automation",
      "Document Processing & Classification",
      "Compliance Monitoring & Reporting",
      "Inter-Agency Data Sharing",
    ],
    regulations: ["FedRAMP", "FISMA", "NIST 800-53", "Section 508"],
    status: "roadmap",
  },
};

// Helper to get industries by status
export const getActiveIndustries = () =>
  Object.values(industries).filter((i) => i.status === "active");

export const getAllIndustries = () => Object.values(industries);

// Industry keys for type safety
export type IndustryKey = keyof typeof industries;
export const industryKeys = Object.keys(industries) as IndustryKey[];
