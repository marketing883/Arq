import {
  generateOrganizationSchema,
  generateSoftwareSchema,
  generateFAQSchema,
  generateWebPageSchema,
  generateBreadcrumbSchema,
  defaultFAQs,
  FAQData,
} from "@/lib/seo/structured-data";

interface StructuredDataProps {
  type: "organization" | "software" | "faq" | "webpage" | "breadcrumb" | "all";
  pageTitle?: string;
  pageDescription?: string;
  pageUrl?: string;
  faqs?: FAQData[];
  breadcrumbs?: Array<{ name: string; url: string }>;
}

export function StructuredData({
  type,
  pageTitle,
  pageDescription,
  pageUrl,
  faqs,
  breadcrumbs,
}: StructuredDataProps) {
  const schemas: Record<string, unknown>[] = [];

  switch (type) {
    case "all":
      schemas.push(generateOrganizationSchema());
      schemas.push(generateSoftwareSchema());
      schemas.push(generateFAQSchema(faqs || defaultFAQs));
      if (pageTitle && pageDescription && pageUrl) {
        schemas.push(generateWebPageSchema(pageTitle, pageDescription, pageUrl));
      }
      if (breadcrumbs) {
        schemas.push(generateBreadcrumbSchema(breadcrumbs));
      }
      break;
    case "organization":
      schemas.push(generateOrganizationSchema());
      break;
    case "software":
      schemas.push(generateSoftwareSchema());
      break;
    case "faq":
      schemas.push(generateFAQSchema(faqs || defaultFAQs));
      break;
    case "webpage":
      if (pageTitle && pageDescription && pageUrl) {
        schemas.push(generateWebPageSchema(pageTitle, pageDescription, pageUrl));
      }
      break;
    case "breadcrumb":
      if (breadcrumbs) {
        schemas.push(generateBreadcrumbSchema(breadcrumbs));
      }
      break;
  }

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}

/**
 * Default structured data for homepage
 */
export function HomeStructuredData() {
  return (
    <StructuredData
      type="all"
      pageTitle="ArqAI Labs - Production AI Workflows"
      pageDescription="ArqAI Labs builds production AI workflows around enterprise operations: workflow strategy, agentic buildout, integration, governance, accelerators, and managed AI operations."
      pageUrl="https://thearq.ai"
      breadcrumbs={[{ name: "Home", url: "https://thearq.ai" }]}
    />
  );
}

/**
 * Platform page structured data
 */
export function PlatformStructuredData() {
  return (
    <StructuredData
      type="all"
      pageTitle="Platform | ArqAI Labs"
      pageDescription="Explore the ArqAI Operating Fabric for governed production AI workflows: orchestration, integrations, evidence, controls, and operating loops."
      pageUrl="https://thearq.ai/platform"
      breadcrumbs={[
        { name: "Home", url: "https://thearq.ai" },
        { name: "Platform", url: "https://thearq.ai/platform" },
      ]}
      faqs={[
        {
          question: "What is the ArqAI Operating Fabric?",
          answer:
            "The ArqAI Operating Fabric is the architecture we use to turn model output into governed workflow execution across orchestration, integrations, review, evidence, and monitoring.",
        },
        {
          question: "How does ArqAI handle governance?",
          answer:
            "Governance is designed into the workflow through permissions, policy checks, approval paths, human review, audit trails, and exception handling.",
        },
        {
          question: "Does ArqAI replace existing enterprise systems?",
          answer:
            "No. ArqAI connects AI workflows to the CRM, ERP, ITSM, data platforms, identity, knowledge, and operating tools already running the business.",
        },
      ]}
    />
  );
}

/**
 * Solutions page structured data
 */
export function SolutionsStructuredData() {
  return (
    <StructuredData
      type="all"
      pageTitle="Industries | ArqAI Labs"
      pageDescription="Industry AI workflow systems for healthcare payers, insurance carriers, banking, retail, and manufacturing teams."
      pageUrl="https://thearq.ai/industries"
      breadcrumbs={[
        { name: "Home", url: "https://thearq.ai" },
        { name: "Industries", url: "https://thearq.ai/industries" },
      ]}
      faqs={[
        {
          question: "How does ArqAI help financial services companies?",
          answer:
            "ArqAI helps financial institutions improve AML, KYC, sanctions, customer-risk, and alert-triage workflows with explainable recommendations, cleaner evidence, and reviewer authority preserved.",
        },
        {
          question: "How does ArqAI work with healthcare payer teams?",
          answer:
            "ArqAI supports payment integrity, prior authorization, utilization management, and member operations with governed AI workflows designed around evidence, policy, and human review.",
        },
      ]}
    />
  );
}
