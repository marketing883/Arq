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

// Industry-specific case studies
export const caseStudies = {
  healthcare: {
    industry: "Healthcare",
    badge: "Major Health System",
    title: "Patient Data Workflows with Governance Built In",
    challenge:
      "A large health system wanted to use AI for patient data summarization and care coordination but couldn't risk HIPAA violations.",
    solution:
      "ArqAI designed the workflow so AI-assisted summarization and care coordination stayed inside defined access, approval, and audit boundaries.",
    results: [
      { metric: "50%", label: "Reduced Admin Time" },
      { metric: "100%", label: "HIPAA Compliance" },
      { metric: "40%", label: "Faster Care Coordination" },
      { metric: "3x", label: "AI Deployment Scale" },
    ],
    quote:
      "Patient data security is non-negotiable. ArqAI's workflow-first approach gave us the control model we needed.",
    quoteAuthor: "CISO",
  },
  financial: {
    industry: "Financial Services",
    badge: "Top 5 Global Bank",
    title: "Automated Loan Underwriting with Complete Audit Trails",
    challenge:
      "A leading global bank needed to automate their loan underwriting process while maintaining strict SOX compliance and Fair Lending Act adherence.",
    solution:
      "ArqAI helped shape an underwriting workflow with policy-aware recommendations, human review, and decision evidence captured for audit.",
    results: [
      { metric: "70%", label: "Faster Underwriting" },
      { metric: "100%", label: "Audit Compliance" },
      { metric: "$2.3M", label: "Annual Savings" },
      { metric: "Zero", label: "Regulatory Findings" },
    ],
    quote:
      "ArqAI gave us the confidence to use AI in the workflow because the evidence and review path were designed in.",
    quoteAuthor: "Chief Risk Officer",
  },
  insurance: {
    industry: "Insurance",
    badge: "Fortune 100 Insurer",
    title: "Intelligent Claims Processing with Fraud Detection",
    challenge:
      "A major insurer needed to accelerate claims processing while maintaining regulatory compliance with NAIC guidelines and detecting potential fraud.",
    solution:
      "ArqAI designed claims support that enriches files, recommends routing, flags suspicious patterns, and keeps adjusters in control of the final decision.",
    results: [
      { metric: "80%", label: "Faster Processing" },
      { metric: "35%", label: "More Fraud Detected" },
      { metric: "$5M+", label: "Fraud Prevented" },
      { metric: "98%", label: "Customer Satisfaction" },
    ],
    quote:
      "The combination of speed and compliance oversight has transformed our claims operation.",
    quoteAuthor: "VP of Claims Operations",
  },
  general: {
    industry: "Enterprise",
    badge: "Fortune 500 Company",
    title: "Enterprise Workflow Governance at Scale",
    challenge:
      "A Fortune 500 company was moving AI into multiple operating teams but lacked a consistent way to govern workflow actions, evidence, and review.",
    solution:
      "ArqAI helped define a shared operating fabric with consistent policy enforcement, integration patterns, and audit trails across workflows.",
    results: [
      { metric: "60%", label: "Faster Deployment" },
      { metric: "100%", label: "Policy Compliance" },
      { metric: "45%", label: "Cost Reduction" },
      { metric: "10x", label: "Workflow Scale Increase" },
    ],
    quote:
      "We finally have the control and visibility we need to confidently scale AI across the enterprise.",
    quoteAuthor: "CIO",
  },
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
