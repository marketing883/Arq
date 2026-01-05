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
    name: "ArqAI",
    url: "https://thearq.ai",
    logo: "https://thearq.ai/logo.png",
    description:
      "ArqAI is the industry's first integrated command platform for enterprise AI governance. Move from high-risk AI chaos to a secure, compliant, and fully governed AI workforce.",
    foundingDate: "2024",
    founders: [
      {
        "@type": "Person",
        name: "Habib Nassar",
        jobTitle: "CEO & Co-Founder",
      },
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "New Jersey",
      addressCountry: "US",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      email: "habib@thearq.ai",
      url: "https://thearq.ai/demo",
    },
    sameAs: [
      "https://linkedin.com/company/arqai",
      "https://twitter.com/arqai",
    ],
    knowsAbout: [
      "AI Governance",
      "Enterprise AI",
      "AI Security",
      "AI Compliance",
      "AI Orchestration",
      "Machine Learning",
      "Artificial Intelligence",
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
    name: "ArqAI Platform",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web-based, Cloud",
    description:
      "Enterprise AI command platform for deploying, governing, and managing AI agents securely with SOC 2, HIPAA, and GDPR compliance.",
    url: "https://thearq.ai/platform",
    provider: {
      "@type": "Organization",
      name: "ArqAI",
      url: "https://thearq.ai",
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: "Contact for enterprise pricing",
      url: "https://thearq.ai/demo",
    },
    featureList: [
      "AI Agent Orchestration",
      "Enterprise Governance",
      "Real-time Monitoring",
      "Compliance Management",
      "Security Controls",
      "Audit Trails",
      "Multi-model Support",
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
      name: "ArqAI",
      logo: {
        "@type": "ImageObject",
        url: "https://thearq.ai/logo.png",
      },
    },
    isPartOf: {
      "@type": "WebSite",
      name: "ArqAI",
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
 * Default FAQs for the website (AEO optimization)
 */
export const defaultFAQs: FAQData[] = [
  {
    question: "What is ArqAI?",
    answer:
      "ArqAI is the industry's first integrated command platform for enterprise AI governance. It enables organizations to deploy, govern, and manage AI agents securely with built-in compliance for SOC 2, HIPAA, and GDPR.",
  },
  {
    question: "How does ArqAI ensure AI compliance?",
    answer:
      "ArqAI provides comprehensive compliance controls including real-time monitoring, audit trails, policy enforcement, and automated compliance reporting. The platform is designed to meet SOC 2, HIPAA, GDPR, and other regulatory requirements out of the box.",
  },
  {
    question: "What industries does ArqAI serve?",
    answer:
      "ArqAI serves enterprise customers across Financial Services, Insurance, Healthcare, and other regulated industries that require secure and compliant AI deployments.",
  },
  {
    question: "Can ArqAI integrate with existing AI models?",
    answer:
      "Yes, ArqAI supports multi-model orchestration and can integrate with various AI providers including OpenAI, Anthropic, and custom enterprise models. The platform acts as a unified control layer for all your AI agents.",
  },
  {
    question: "How do I get started with ArqAI?",
    answer:
      "You can request a demo at thearq.ai/demo. Our team will provide a personalized walkthrough of the platform and discuss how ArqAI can address your specific enterprise AI governance needs.",
  },
  {
    question: "What security features does ArqAI provide?",
    answer:
      "ArqAI includes enterprise-grade security features such as encryption at rest and in transit, role-based access controls, audit logging, anomaly detection, and integration with enterprise SSO providers.",
  },
];
