import type { Metadata } from "next";
import V5Nav from "@/components/home-v5/V5Nav";
import Hero from "@/components/home-v5/Hero";
import Features from "@/components/home-v5/Features";
import Accelerators from "@/components/home-v5/Accelerators";
import WhyChooseUs from "@/components/home-v5/WhyChooseUs";
import Workflow from "@/components/home-v5/Workflow";
import Integration from "@/components/home-v5/Integration";
import Testimonials from "@/components/home-v5/Testimonials";
import FAQ from "@/components/home-v5/FAQ";
import Blogs from "@/components/home-v5/Blogs";
import Contact from "@/components/home-v5/Contact";
import Footer from "@/components/home-v5/Footer";
import { FAQ as FAQ_DATA, HERO_POSTER, HERO_VIDEO } from "@/components/home-v5/content";
import { accelerators } from "@/lib/data/accelerators";
import "@/components/home-v5/styles.css";

const SITE_URL = "https://thearq.ai";
const PAGE_TITLE =
  "Operational AI for enterprise — designed, deployed, and run by ArqAI Labs";
const PAGE_DESC =
  "ArqAI Labs is the operational AI partner for mid-market and enterprise teams in healthcare, banking, insurance, retail, and manufacturing. We design, build, deploy, and run production AI agents — with governance attached to every action.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESC,
  alternates: { canonical: SITE_URL },
  keywords: [
    "operational AI",
    "production AI for enterprise",
    "AI agents for healthcare payers",
    "AI agents for banking",
    "AI agents for insurance carriers",
    "AI workflow automation",
    "agentic AI platform",
    "AI accelerators",
    "AI governance and compliance",
    "managed AI operations",
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

// Cache the rendered page; Blogs.tsx revalidates from Supabase periodically.
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
      "ArqAI Labs designs, builds, deploys, and runs production AI workflows for enterprise operations across healthcare, banking, insurance, retail, and manufacturing.",
    foundingDate: "2024",
    sameAs: [
      "https://www.linkedin.com/company/thearq-ai",
      "https://x.com/The_ArqAI",
      "https://www.instagram.com/thearq.ai",
    ],
    knowsAbout: [
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
    name: "Operational AI Services",
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
      "Production-ready, vertical-tuned AI accelerators that shorten discovery and de-risk enterprise AI delivery.",
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

  const faqPage = {
    "@type": "FAQPage",
    "@id": `${SITE_URL}#faq`,
    mainEntity: FAQ_DATA.items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };

  const professionalService = {
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}#service`,
    name: "ArqAI Labs — Operational AI",
    description:
      "End-to-end operational AI partner: workflow assessment, agent buildout, enterprise integration, governance, and managed operations after go-live.",
    url: SITE_URL,
    provider: { "@id": orgId },
    serviceType: "Operational AI consulting and managed services",
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
    <div className="v5-shell">
      <link rel="preload" as="image" href={HERO_POSTER} fetchPriority="high" />
      <link rel="preload" as="video" href={HERO_VIDEO} type="video/mp4" />
      <link rel="dns-prefetch" href="https://images.unsplash.com" />
      <StructuredData />

      <V5Nav />
      <main>
        <Hero />
        <Features />
        <Accelerators />
        <WhyChooseUs />
        <Workflow />
        <Integration />
        <Testimonials />
        <FAQ />
        <Blogs />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
