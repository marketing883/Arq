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
      pageTitle="ArqAI - The Command Platform for Enterprise AI"
      pageDescription="Move from high-risk AI chaos to a secure, compliant, and fully governed AI workforce. ArqAI is the industry's first integrated command platform for enterprise AI governance."
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
      pageTitle="Platform | ArqAI"
      pageDescription="Explore the ArqAI platform features including CAPC, TAO, ODA-RAG, and enterprise integrations for AI governance."
      pageUrl="https://thearq.ai/platform"
      breadcrumbs={[
        { name: "Home", url: "https://thearq.ai" },
        { name: "Platform", url: "https://thearq.ai/platform" },
      ]}
      faqs={[
        {
          question: "What is CAPC?",
          answer:
            "CAPC (Command Agent Protocol Core) is ArqAI's core orchestration engine that manages AI agent deployment, communication, and lifecycle across your enterprise.",
        },
        {
          question: "What is TAO?",
          answer:
            "TAO (Trust Audit & Observability) provides real-time monitoring, compliance tracking, and audit capabilities for all AI operations in your organization.",
        },
        {
          question: "What is ODA-RAG?",
          answer:
            "ODA-RAG (Optimized Domain Adaptive Retrieval Augmented Generation) is ArqAI's advanced RAG system that enables AI agents to access and reason over your enterprise knowledge securely.",
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
      pageTitle="Solutions | ArqAI"
      pageDescription="Enterprise AI solutions for Financial Services, Insurance, Healthcare, and other regulated industries."
      pageUrl="https://thearq.ai/solutions"
      breadcrumbs={[
        { name: "Home", url: "https://thearq.ai" },
        { name: "Solutions", url: "https://thearq.ai/solutions" },
      ]}
      faqs={[
        {
          question: "How does ArqAI help financial services companies?",
          answer:
            "ArqAI provides financial services companies with compliant AI deployment, real-time risk monitoring, and audit trails that meet SEC, FINRA, and SOX requirements.",
        },
        {
          question: "Is ArqAI HIPAA compliant for healthcare?",
          answer:
            "Yes, ArqAI is designed with HIPAA compliance built-in, providing healthcare organizations with secure AI deployment that protects patient data and meets regulatory requirements.",
        },
      ]}
    />
  );
}
