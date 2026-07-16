import type { Metadata } from "next";
import V5Nav from "@/components/home-v5/V5Nav";
import Hero from "@/components/home-v6/Hero";
import Features from "@/components/home-v6/Features";
import Accelerators from "@/components/home-v6/Accelerators";
import WhyChooseUs from "@/components/home-v6/WhyChooseUs";
import Workflow from "@/components/home-v6/Workflow";
import Integration from "@/components/home-v5/Integration";
import Proof from "@/components/home-v6/Proof";
import FAQ from "@/components/home-v6/FAQ";
import Blogs from "@/components/home-v6/Blogs";
import Contact from "@/components/home-v6/Contact";
import Footer from "@/components/home-v5/Footer";
import { FAQ as FAQ_DATA, HERO_POSTER, HERO_VIDEO } from "@/components/home-v6/content";
import { accelerators } from "@/lib/data/accelerators";
import "@/components/home-v5/styles.css";
import "@/components/home-v6/styles.css";

const SITE_URL = "https://thearq.ai";
const PAGE_TITLE =
  "Forward-deployed AI engineering, at scale — ArqAI Labs";
const PAGE_DESC =
  "ArqAI Labs embeds forward-deployed AI engineers in your operation — designing, building, deploying, and running production AI agents for regulated enterprises, with audit-ready proof on every agent action.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
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
      "ArqAI Labs is a forward-deployed AI engineering firm for regulated enterprises: engineers embedded in the operation who design, build, deploy, and run production AI agents with audit-ready proof on every action.",
    foundingDate: "2024",
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
    { name: "Workflow Discovery and Assessment", desc: "Map operations and identify exactly where agents will move the needle before any build begins." },
    { name: "Accelerator Deployment", desc: "Industry-specific workflow spines, validated across deployments and configured to your systems and policies." },
    { name: "Custom Agent Development", desc: "Bespoke agents built around your workflows, your data, and your compliance requirements." },
    { name: "Enterprise Systems Integration", desc: "Agents wired directly into your existing stack within the permissions your security team already trusts." },
    { name: "Governance and Audit Architecture", desc: "Encrypted, persistent audit trails on every agent action, built in from day one." },
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
      "Reusable workflow spines for recurring enterprise problems: proven patterns of agents, integrations, and governance controls, configured to your systems and policies.",
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
    name: "ArqAI Labs — Forward-Deployed AI Engineering",
    description:
      "Forward-deployed AI engineering for regulated enterprises: workflow assessment, accelerator deployment, custom agent development, enterprise integration, and governance — designed, built, and run in production.",
    url: SITE_URL,
    provider: { "@id": orgId },
    serviceType: "Forward-deployed AI engineering and managed services",
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
    <div className="v5-shell v6-home">
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
        <Proof />
        <FAQ />
        <Blogs />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
