import type { Metadata } from "next";
import V6Nav from "@/components/v6/V6Nav";
import ForwardDeployed from "@/components/v6/ForwardDeployed";
import ProofBand from "@/components/v6/ProofBand";
import AcceleratorShowcase from "@/components/v6/AcceleratorShowcase";
import CaseStudies from "@/components/v6/CaseStudies";
import Insights from "@/components/v6/Insights";
import FaqSection from "@/components/v6/FaqSection";
import { FAQS } from "@/components/v6/faqs";
import ClosingCta from "@/components/v6/ClosingCta";
import V6Footer from "@/components/v6/V6Footer";
import { LandingAccordionItem } from "@/components/ui/interactive-image-accordion";
import { accelerators } from "@/lib/data/accelerators";
import "@/components/v6/v6.css";

const SITE_URL = "https://thearq.ai";
const PAGE_TITLE = "Forward-Deployed AI Engineering, at Scale — ArqAI Labs";
const PAGE_DESC =
  "ArqAI Labs embeds forward-deployed AI engineers in your operation — designing, building, deploying, and running production AI agents for regulated enterprises, with audit-ready proof on every agent action.";

export const metadata: Metadata = {
  // Absolute: the brand is already in the title, so skip the layout template.
  title: { absolute: PAGE_TITLE },
  description: PAGE_DESC,
  alternates: { canonical: SITE_URL },
  keywords: [
    "forward-deployed AI engineering",
    "forward deployed engineers",
    "production AI for enterprise",
    "AI accelerators",
    "AI agents for healthcare payers",
    "AI agents for banking",
    "AI agents for insurance carriers",
    "AI workflow automation",
    "agentic AI",
    "AI governance and compliance",
    "AI for regulated enterprises",
    "ArqAI Labs",
  ],
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: PAGE_TITLE,
    description: PAGE_DESC,
    siteName: "ArqAI Labs",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "ArqAI Labs" }],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESC,
    images: ["/og-image.png"],
    site: "@The_ArqAI",
    creator: "@The_ArqAI",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

// Case studies and insights revalidate from the CMS periodically.
export const revalidate = 300;

function StructuredData() {
  const orgId = `${SITE_URL}#organization`;
  const siteId = `${SITE_URL}#website`;
  const pageId = `${SITE_URL}#webpage`;

  const organization = {
    "@type": "Organization",
    "@id": orgId,
    name: "ArqAI Labs",
    url: SITE_URL,
    logo: `${SITE_URL}/v5/assets/FEFrVVQtPUn7XSci8TiM5lb74o.png`,
    description:
      "ArqAI Labs embeds forward-deployed AI engineers in enterprise operations — designing, building, deploying, and running production AI workflows across healthcare, banking, insurance, retail, and manufacturing.",
    foundingDate: "2024",
    address: {
      "@type": "PostalAddress",
      streetAddress: "220 Davidson Ave, Suite 129",
      addressLocality: "Somerset",
      addressRegion: "NJ",
      postalCode: "08873",
      addressCountry: "US",
    },
    sameAs: [
      "https://www.linkedin.com/company/thearq-ai",
      "https://x.com/The_ArqAI",
      "https://www.instagram.com/thearq.ai",
    ],
    knowsAbout: [
      "Forward-deployed AI engineering",
      "Operational AI",
      "Agentic AI",
      "AI governance",
      "Healthcare payer AI",
      "Banking financial-crime AI",
      "Insurance claims AI",
      "AI workflow automation",
      "Enterprise AI integration",
    ],
    areaServed: { "@type": "Place", name: "Worldwide" },
  };

  const website = {
    "@type": "WebSite",
    "@id": siteId,
    url: SITE_URL,
    name: "ArqAI Labs",
    publisher: { "@id": orgId },
    inLanguage: "en-US",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/blog?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const webpage = {
    "@type": "WebPage",
    "@id": pageId,
    url: SITE_URL,
    name: PAGE_TITLE,
    description: PAGE_DESC,
    isPartOf: { "@id": siteId },
    about: { "@id": orgId },
    primaryImageOfPage: `${SITE_URL}/og-image.png`,
    inLanguage: "en-US",
  };

  const services = [
    { name: "Workflow Strategy", desc: "Identify the workflows worth automating before any build begins." },
    { name: "Agentic AI Buildout", desc: "Production AI agents shipped end-to-end, not demos." },
    { name: "Enterprise Integration", desc: "AI wired directly into your existing systems and data." },
    { name: "Governance by Design", desc: "Audit-ready evidence trails attached to every agent action." },
    { name: "Vertical Acceleration", desc: "Pre-built accelerator patterns for healthcare, banking, and insurance." },
    { name: "Managed AI Operations", desc: "Ongoing operation, monitoring, and iteration after go-live." },
  ];

  const offerCatalog = {
    "@type": "OfferCatalog",
    name: "Forward-Deployed AI Engineering Services",
    itemListElement: services.map((s) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: s.name,
        description: s.desc,
        provider: { "@id": orgId },
      },
    })),
  };

  const acceleratorList = {
    "@type": "ItemList",
    "@id": `${SITE_URL}#accelerators`,
    name: "ArqAI Accelerators",
    description:
      "Ten production-ready, governed AI accelerators — four vertical, six horizontal — that shorten discovery and de-risk enterprise AI delivery.",
    numberOfItems: accelerators.length,
    itemListElement: accelerators.map((a, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "SoftwareApplication",
        name: a.name,
        applicationCategory: "BusinessApplication",
        applicationSubCategory: a.category,
        description: a.summary,
        url: `${SITE_URL}/accelerators/${a.id}`,
        provider: { "@id": orgId },
      },
    })),
  };

  // Parity by construction: the same FAQS array renders the visible FAQ
  // section below, so schema and on-page content cannot drift.
  const faqPage = {
    "@type": "FAQPage",
    "@id": `${SITE_URL}#faq`,
    mainEntity: FAQS.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };

  const professionalService = {
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}#service`,
    name: "ArqAI Labs — Forward-Deployed AI Engineering",
    description:
      "End-to-end operational AI partner: workflow assessment, agent buildout, enterprise integration, governance, and managed operations after go-live.",
    url: SITE_URL,
    provider: { "@id": orgId },
    serviceType: "Forward-deployed AI engineering and managed AI operations",
    areaServed: { "@type": "Place", name: "Worldwide" },
    audience: {
      "@type": "BusinessAudience",
      audienceType: "Mid-market and enterprise operations leaders",
    },
    hasOfferCatalog: offerCatalog,
  };

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      organization,
      website,
      webpage,
      professionalService,
      acceleratorList,
      faqPage,
    ],
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}

export default function HomePage() {
  return (
    <main className="w-full">
      <StructuredData />
      <V6Nav />
      <LandingAccordionItem />
      <ForwardDeployed />
      <ProofBand />
      <AcceleratorShowcase />
      <CaseStudies />
      <Insights />
      <FaqSection />
      <ClosingCta />
      <V6Footer />
    </main>
  );
}
