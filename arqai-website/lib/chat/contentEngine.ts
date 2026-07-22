// Dynamic content generation engine for personalized morph cards

import {
  UserContext,
  CardCustomization,
  DynamicContent,
  Industry,
  PainPoint,
  ComplianceFramework,
} from "./types";
import { industryNames, painPointNames } from "./context";

// The one real, publishable engagement. All industry keys resolve to it,
// proof content is never invented or personalized per-industry.
// Full narrative: /case-studies/tpa-blind-spot-assessment
const realCaseStudy = {
  industry: "Healthcare Payers",
  badge: "Mid-Size TPA",
  title: "Undetected Waste Found in One Blind Spot Assessment",
  challenge:
    "A mid-size third-party administrator had been rated fully compliant by its payment-integrity vendor, a rating that reflected what the incumbent tooling was designed to look for, not what pattern-level analysis could still find.",
  solution:
    "A single ArqAI Blind Spot Assessment ran ArqFWA's cross-signal analysis over historical claims the incumbent tools had already cleared, and delivered every flagged case with the evidence a reviewer needs to act.",
  results: [
    { metric: "Surfaced", label: "Undetected waste" },
    { metric: "Cut", label: "Manual review time" },
    { metric: "1", label: "Assessment engagement" },
    { metric: "Evidenced", label: "Every finding" },
  ],
  quote: "",
  quoteAuthor: "",
};

export const caseStudies = {
  healthcare: realCaseStudy,
  financial: realCaseStudy,
  insurance: realCaseStudy,
  general: realCaseStudy,
};

// Industry-specific messaging
const industryMessaging: Partial<Record<NonNullable<Industry>, {
  headline: string;
  challenges: string[];
  benefits: string[];
}>> = {
  healthcare: {
    headline: "AI Workflows Built for Healthcare",
    challenges: [
      "HIPAA compliance for AI systems",
      "Patient data protection",
      "Clinical workflow automation",
    ],
    benefits: [
      "HIPAA-ready policy templates",
      "PHI access logging and audit trails",
      "Healthcare-specific compliance rules",
    ],
  },
  financial_services: {
    headline: "Enterprise AI Workflows for Financial Services",
    challenges: [
      "SOX and regulatory compliance",
      "Fair lending requirements",
      "Audit and examination readiness",
    ],
    benefits: [
      "SOX-compliant audit trails",
      "Model risk management integration",
      "Regulatory examination packages",
    ],
  },
  insurance: {
    headline: "AI Workflows for Modern Insurance",
    challenges: [
      "NAIC and state regulatory compliance",
      "Claims automation with oversight",
      "Underwriting transparency",
    ],
    benefits: [
      "Insurance regulatory templates",
      "Claims processing governance",
      "Actuarial model oversight",
    ],
  },
};

// Pain point to solution mapping
const painPointSolutions: Record<PainPoint, {
  headline: string;
  solution: string;
  feature: string;
}> = {
  compliance_complexity: {
    headline: "Build Compliance into the Workflow",
    solution: "Compliance rules, approvals, and evidence capture are designed into the workflow before launch.",
    feature: "Governance by Design",
  },
  audit_trail: {
    headline: "Decision Trails Reviewers Can Trust",
    solution: "Every recommendation, action, approval, and override can carry the evidence needed for review.",
    feature: "Audit Evidence Layer",
  },
  ai_governance: {
    headline: "Governed AI Workflows",
    solution: "A shared operating fabric helps teams build, run, and govern AI workflows without losing control.",
    feature: "ArqAI Operating Fabric",
  },
  security_concerns: {
    headline: "Permission-Aware AI Actions",
    solution: "Every action runs inside explicit access, policy, and approval boundaries.",
    feature: "Governance Plane",
  },
  scaling_ai: {
    headline: "Scale AI with Confidence",
    solution: "Governance that scales from one workflow to a portfolio of production AI systems.",
    feature: "Operating Loop",
  },
  cost_reduction: {
    headline: "Maximize AI ROI",
    solution: "Reduce compliance overhead and manual audit costs while scaling faster.",
    feature: "ROI Calculator",
  },
  risk_management: {
    headline: "Mitigate AI Risk",
    solution: "Proactive risk management with pre-execution policy enforcement.",
    feature: "Policy and Review Controls",
  },
  manual_processes: {
    headline: "Automate Compliance Work",
    solution: "Eliminate manual policy checks and audit preparation with built-in automation.",
    feature: "Automated Compliance Reporting",
  },
  lack_visibility: {
    headline: "Complete Workflow Visibility",
    solution: "Monitoring across workflow performance, exceptions, evidence, and reviewer feedback.",
    feature: "Workflow Observability",
  },
  integration_challenges: {
    headline: "Seamless Integration",
    solution: "Connect to any LLM, cloud, or enterprise system while maintaining governance.",
    feature: "Integration Ecosystem",
  },
  quality_control: {
    headline: "AI Quality Assurance",
    solution: "Secondary AI analyst evaluates every output with confidence scoring.",
    feature: "Evaluation and Quality Analysis",
  },
};

// Get personalized case study based on context
export function getPersonalizedCaseStudy(context: UserContext) {
  const industry = context.industry;

  if (industry === "healthcare") return caseStudies.healthcare;
  if (industry === "financial_services") return caseStudies.financial;
  if (industry === "insurance") return caseStudies.insurance;

  return caseStudies.general;
}

// Generate personalized headline based on context
export function getPersonalizedHeadline(context: UserContext): string {
  // Industry-specific headline
  if (context.industry && industryMessaging[context.industry]) {
    return industryMessaging[context.industry]!.headline;
  }

  // Pain point-specific headline
  if (context.painPoints.length > 0) {
    const primaryPainPoint = context.painPoints[0];
    return painPointSolutions[primaryPainPoint].headline;
  }

  // Default headline
  return "Production AI workflows built around your operation";
}

// Generate personalized feature highlights
export function getPersonalizedFeatures(context: UserContext): string[] {
  const features: string[] = [];

  // Add industry-specific benefits
  if (context.industry && industryMessaging[context.industry]) {
    features.push(...industryMessaging[context.industry]!.benefits);
  }

  // Add pain point solutions
  for (const painPoint of context.painPoints.slice(0, 2)) {
    features.push(painPointSolutions[painPoint].solution);
  }

  // Add compliance-specific features
  for (const framework of context.complianceFrameworks.slice(0, 2)) {
    features.push(getComplianceFeature(framework));
  }

  // Default features if nothing specific
  if (features.length === 0) {
    features.push(
      "Build agents with compliance baked in from day one",
      "Complete audit trails for every AI action",
      "Workflow visibility from signal to action"
    );
  }

  return features.slice(0, 4);
}

// Get compliance-specific feature description
function getComplianceFeature(framework: ComplianceFramework): string {
  const features: Record<ComplianceFramework, string> = {
    hipaa: "HIPAA-ready policy templates and PHI protection",
    sox: "SOX-compliant audit trails and controls",
    gdpr: "GDPR data processing and consent management",
    ccpa: "CCPA privacy controls and data rights",
    pci_dss: "PCI DSS compliant data handling",
    naic: "Insurance regulatory compliance templates",
    finra: "FINRA communication monitoring integration",
    fedramp: "FedRAMP-ready security controls",
    iso27001: "ISO 27001 security framework alignment",
  };
  return features[framework];
}

// Generate ROI calculator defaults based on context
export function getROIDefaults(context: UserContext) {
  let agentCount = 10;
  let complianceRisk: "low" | "medium" | "high" = "medium";
  let avgSalary = 120000;
  let auditHours = 20;

  // Set agent count if known
  if (context.aiAgentCount) {
    agentCount = context.aiAgentCount;
  }

  // Determine compliance risk from industry/frameworks
  const highRiskIndustries: Industry[] = ["healthcare", "financial_services", "insurance"];
  if (context.industry && highRiskIndustries.includes(context.industry)) {
    complianceRisk = "high";
    auditHours = 30; // Higher audit burden
  }

  // Adjust salary based on industry
  if (context.industry === "financial_services") {
    avgSalary = 180000;
  } else if (context.industry === "technology") {
    avgSalary = 160000;
  }

  // Adjust based on company size
  if (context.companySize === "enterprise") {
    agentCount = Math.max(agentCount, 25);
  } else if (context.companySize === "startup") {
    agentCount = Math.min(agentCount, 10);
    avgSalary = Math.round(avgSalary * 0.85);
  }

  return { agentCount, complianceRisk, avgSalary, auditHours };
}

// Generate personalized comparison highlights
export function getComparisonHighlights(context: UserContext): string[] {
  const highlights: string[] = [];

  // Add pain point specific highlights
  if (context.painPoints.includes("audit_trail")) {
    highlights.push("Cryptographic Audit Trails");
  }
  if (context.painPoints.includes("compliance_complexity")) {
    highlights.push("Compliance-Aware Prompt Compilation");
  }
  if (context.painPoints.includes("security_concerns")) {
    highlights.push("Zero-Trust Architecture");
  }
  if (context.painPoints.includes("lack_visibility")) {
    highlights.push("AI-Powered Quality Scoring");
  }

  // Default highlights
  if (highlights.length === 0) {
    highlights.push(
      "Pre-Execution Policy Enforcement",
      "Cryptographic Audit Trails",
      "AI-Powered Quality Scoring"
    );
  }

  return highlights;
}

// Generate contextual welcome message
export function getContextualWelcome(context: UserContext): string {
  if (context.industry && industryMessaging[context.industry]) {
    const industry = industryNames[context.industry];
    return `Welcome. I see you're in ${industry}. I can help map how ArqAI supports governed AI workflows for ${industry.toLowerCase()} operations. What workflow are you evaluating?`;
  }

  if (context.painPoints.length > 0) {
    const painPoint = painPointNames[context.painPoints[0]];
    return `I understand ${painPoint.toLowerCase()} is a challenge you're facing. Want to look at how ArqAI would handle that inside a real workflow?`;
  }

  return "Hi. I can help you explore how ArqAI builds, governs, and operates production AI workflows. What workflow brings you here today?";
}

// Generate contextual follow-up based on card shown
export function getCardFollowUp(
  cardType: string,
  context: UserContext
): string {
  const followUps: Record<string, string[]> = {
    features: [
      "Would you like to dive deeper into any of these capabilities?",
      "I can show you how this works for your specific use case. What's your biggest priority?",
    ],
    comparison: [
      "As you can see, ArqAI's integrated approach is unique. Want to discuss how this applies to your situation?",
      "Would you like to see a case study from your industry?",
    ],
    timeline: [
      "Does this timeline align with your needs? We can adjust based on your requirements.",
      "Would you like to discuss what a proof-of-concept might look like for your team?",
    ],
    roi: [
      "These numbers are based on averages - I can help you refine them for your specific situation.",
      "Would you like to schedule a call with our team for a detailed ROI analysis?",
    ],
    casestudy: [
      "This customer had similar challenges. Would you like to discuss how we'd approach your situation?",
      "I can connect you with our team to hear more about results like these.",
    ],
    architecture: [
      "Would you like to discuss how this integrates with your current infrastructure?",
      "I can arrange a technical deep-dive with our engineering team if you'd like.",
    ],
    integration: [
      "Do you see the integrations you need? We support many more through our open API.",
      "Would you like to discuss your specific integration requirements?",
    ],
  };

  const options = followUps[cardType] || followUps.features;
  return options[Math.floor(Math.random() * options.length)];
}

// Package all customizations for a card
export function generateCardCustomizations(
  cardType: string,
  context: UserContext
): CardCustomization {
  // Get the personalized case study
  const caseStudy = getPersonalizedCaseStudy(context);

  // Get the ROI defaults
  const roiDefaultsRaw = getROIDefaults(context);

  // Build the customization object with all the properties needed by morph blocks
  return {
    // Basic context
    industry: context.industry,
    companySize: context.companySize,
    painPoints: context.painPoints,
    complianceFrameworks: context.complianceFrameworks,

    // Content customization
    headline: getPersonalizedHeadline(context),
    subheadline: getPersonalizedSubheadline(cardType, context),
    highlightedFeatures: getComparisonHighlights(context),

    // Case study customization
    caseStudy: {
      industry: caseStudy.industry,
      companyType: caseStudy.badge,
      title: caseStudy.title,
      challenge: caseStudy.challenge,
      solution: caseStudy.solution,
      results: caseStudy.results,
      quote: caseStudy.quote,
      quoteAuthor: caseStudy.quoteAuthor,
    },

    // ROI calculator defaults
    roiDefaults: {
      aiAgentCount: roiDefaultsRaw.agentCount,
      avgSalary: roiDefaultsRaw.avgSalary,
      complianceLevel: roiDefaultsRaw.complianceRisk,
      auditHoursPerAgent: roiDefaultsRaw.auditHours,
    },
  };
}

// Generate personalized subheadline based on card type and context
function getPersonalizedSubheadline(cardType: string, context: UserContext): string {
  const industryName = context.industry ? industryNames[context.industry] : null;

  switch (cardType) {
    case "casestudy":
    case "case-study":
      if (industryName) {
        return `See how organizations in ${industryName} can improve workflow speed, evidence quality, and governance without handing decisions to a black box.`;
      }
      return "See how enterprises use ArqAI to turn AI into governed workflow execution.";

    case "roi":
      if (industryName) {
        return `Calculate the potential ROI of ArqAI for your ${industryName.toLowerCase()} organization.`;
      }
      return "Estimate the potential return from improving a production workflow with ArqAI.";

    case "features":
      if (context.painPoints.length > 0) {
        const painPoint = painPointNames[context.painPoints[0]];
        return `Explore how ArqAI addresses ${painPoint.toLowerCase()} and more.`;
      }
      return "Explore the workflow, integration, governance, and operations capabilities behind ArqAI.";

    case "comparison":
      return "See how ArqAI's integrated approach compares to traditional solutions.";

    case "architecture":
      return "The ArqAI Operating Fabric connects workflow intelligence, governance, integration, and an operating loop for production AI.";

    case "timeline":
      if (context.companySize === "enterprise") {
        return "Our proven enterprise implementation methodology ensures a smooth deployment at scale.";
      }
      return "Our implementation method keeps workflow scope, buildout, deployment, and operations connected.";

    case "integration":
      return "ArqAI integrates seamlessly with your existing infrastructure while maintaining complete governance.";

    default:
      return "";
  }
}
