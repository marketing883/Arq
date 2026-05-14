// Structured Data for SEO/AEO (Answer Engine Optimization)

export interface OrganizationData {
  name: string;
  url: string;
  logo: string;
  description: string;
  sameAs: string[];
}

export interface ProductData {
  name: string;
  description: string;
  url: string;
  image: string;
  brand: string;
}

export interface FAQData {
  question: string;
  answer: string;
}

/**
 * Generate Organization structured data (JSON-LD)
 */
export function generateOrganizationSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ArqAI Labs",
    url: "https://thearq.ai",
    logo: "https://thearq.ai/img/ArqAI-Labs-Logo.png",
    description:
      "ArqAI Labs builds production AI workflows for enterprise operations, combining workflow strategy, agentic buildout, integration, governance, accelerators, and managed AI operations.",
    foundingDate: "2024",
    address: {
      "@type": "PostalAddress",
      addressLocality: "New Jersey",
      addressCountry: "US",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      url: "https://thearq.ai/engage-us",
    },
    sameAs: [
      "https://linkedin.com/company/arqai",
      "https://twitter.com/arqai",
    ],
    knowsAbout: [
      "Agentic AI",
      "Enterprise AI Workflows",
      "AI Governance",
      "Enterprise AI",
      "AI Security",
      "AI Compliance",
      "AI Orchestration",
      "Workflow Automation",
      "Managed AI Operations",
    ],
  };
}

/**
 * Generate SoftwareApplication structured data (JSON-LD)
 */
export function generateSoftwareSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "ArqAI Operating Fabric",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web-based, Cloud",
    description:
      "Operating fabric for production AI workflows across orchestration, enterprise integrations, human review, policy controls, audit evidence, and ongoing optimization.",
    url: "https://thearq.ai/platform",
    provider: {
      "@type": "Organization",
      name: "ArqAI Labs",
      url: "https://thearq.ai",
    },
    offers: {
      "@type": "Offer",
      description: "Contact for enterprise pricing",
      url: "https://thearq.ai/engage-us",
    },
    featureList: [
      "Agentic Workflow Orchestration",
      "Enterprise Integration",
      "Human Review Loops",
      "Policy Controls",
      "Audit Trails",
      "Evaluation and Monitoring",
      "Managed AI Operations",
    ],
  };
}

/**
 * Generate FAQ structured data (JSON-LD) for AEO
 */
export function generateFAQSchema(faqs: FAQData[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate WebPage structured data
 */
export function generateWebPageSchema(
  title: string,
  description: string,
  url: string
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description: description,
    url: url,
    publisher: {
      "@type": "Organization",
      name: "ArqAI Labs",
      logo: {
        "@type": "ImageObject",
        url: "https://thearq.ai/img/ArqAI-Labs-Logo.png",
      },
    },
    isPartOf: {
      "@type": "WebSite",
      name: "ArqAI Labs",
      url: "https://thearq.ai",
    },
  };
}

/**
 * Generate BreadcrumbList structured data
 */
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate Article structured data for blog posts (SEO/AEO)
 */
export interface ArticleData {
  title: string;
  description: string;
  url: string;
  image?: string;
  author: string;
  publishedDate: string;
  modifiedDate?: string;
  category?: string;
  tags?: string[];
}

export function generateArticleSchema(article: ArticleData): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    url: article.url,
    image: article.image || "https://thearq.ai/og-image.png",
    author: {
      "@type": "Person",
      name: article.author,
    },
    publisher: {
      "@type": "Organization",
      name: "ArqAI",
      logo: {
        "@type": "ImageObject",
        url: "https://thearq.ai/logo.png",
      },
    },
    datePublished: article.publishedDate,
    dateModified: article.modifiedDate || article.publishedDate,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": article.url,
    },
    ...(article.category && { articleSection: article.category }),
    ...(article.tags && { keywords: article.tags.join(", ") }),
  };
}

/**
 * Generate CaseStudy structured data (SEO/AEO)
 */
export interface CaseStudyData {
  title: string;
  description: string;
  url: string;
  image?: string;
  client: string;
  industry: string;
  publishedDate: string;
  metrics?: Array<{ label: string; value: string }>;
}

export function generateCaseStudySchema(caseStudy: CaseStudyData): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": caseStudy.url,
    headline: caseStudy.title,
    description: caseStudy.description,
    url: caseStudy.url,
    image: caseStudy.image || "https://thearq.ai/og-image.png",
    author: {
      "@type": "Organization",
      name: "ArqAI Labs",
    },
    publisher: {
      "@type": "Organization",
      name: "ArqAI Labs",
      logo: {
        "@type": "ImageObject",
        url: "https://thearq.ai/img/ArqAI-Labs-Logo.png",
      },
    },
    datePublished: caseStudy.publishedDate,
    about: {
      "@type": "Organization",
      name: caseStudy.client,
      industry: caseStudy.industry,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": caseStudy.url,
    },
    articleSection: "Case Study",
    keywords: `${caseStudy.industry}, AI case study, enterprise AI, ${caseStudy.client}`,
  };
}

/**
 * Default FAQs for the website (AEO optimization)
 */
export const defaultFAQs: FAQData[] = [
  {
    question: "What is ArqAI?",
    answer:
      "ArqAI Labs is an AI engineering studio that builds production AI workflows around enterprise operations, with services and accelerators for strategy, buildout, integration, governance, and managed AI operations.",
  },
  {
    question: "How does ArqAI handle governance?",
    answer:
      "ArqAI designs governance into the workflow through permissions, policy checks, approval paths, human review, audit trails, exception handling, and evidence capture.",
  },
  {
    question: "What industries does ArqAI serve?",
    answer:
      "ArqAI focuses on healthcare payers, P&C insurance carriers, banking, retail, manufacturing, and other operations where AI has to work with complex data, policy, exceptions, and human accountability.",
  },
  {
    question: "Can ArqAI integrate with existing enterprise systems?",
    answer:
      "Yes. ArqAI connects AI workflows to CRM, ERP, ITSM, data platforms, identity, knowledge bases, and operating tools without forcing rip-and-replace.",
  },
  {
    question: "How do I get started with ArqAI?",
    answer:
      "Start at thearq.ai/engage-us and share the workflow, systems, industry, and operating outcome you want to improve.",
  },
  {
    question: "What does ArqAI build?",
    answer:
      "ArqAI builds agentic workflows, copilots, automations, decision-support systems, integration layers, governance controls, and managed operating loops for enterprise work.",
  },
];
