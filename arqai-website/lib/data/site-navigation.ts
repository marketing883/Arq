import { accelerators } from "@/lib/data/accelerators";
import { services } from "@/lib/data/services";

export type SiteNavLink = {
  label: string;
  href: string;
  description?: string;
};

export type SiteNavSection = {
  title: string;
  links: SiteNavLink[];
};

export type SiteNavItem = {
  label: string;
  href: string;
  summary: string;
  feature: {
    title: string;
    body: string;
    href: string;
    cta: string;
  };
  sections: SiteNavSection[];
};

export const industryLinks: SiteNavLink[] = [
  {
    label: "Healthcare payers",
    href: "/industries/healthcare-payers",
    description: "Payment integrity, prior authorization, utilization management, and member operations.",
  },
  {
    label: "P&C insurance carriers",
    href: "/industries/insurance-carriers",
    description: "Claims triage, SIU routing, reserve support, and adjuster workflow intelligence.",
  },
  {
    label: "Banking",
    href: "/industries/banking",
    description: "AML, KYC, sanctions, CDD, alert triage, and examiner-ready evidence.",
  },
  {
    label: "Retail and QSR",
    href: "/industries/retail",
    description: "Loyalty, inventory, pricing, store operations, and customer-service workflows.",
  },
  {
    label: "Manufacturing and supply chain",
    href: "/industries/manufacturing",
    description: "Quality, maintenance, supplier risk, ERP, MES, and production exceptions.",
  },
];

export const resourceLinks: SiteNavLink[] = [
  {
    label: "Resources",
    href: "/resources",
    description: "A curated index of ArqAI field notes, case material, whitepapers, and events.",
  },
  {
    label: "Blog",
    href: "/blog",
    description: "Practical thinking for teams moving AI from pilot to production.",
  },
  {
    label: "Case studies",
    href: "/case-studies",
    description: "Implementation stories, operating outcomes, and delivery lessons.",
  },
  {
    label: "Whitepapers",
    href: "/resources/whitepapers",
    description: "Downloadable guides for governance-first enterprise AI programs.",
  },
  {
    label: "Webinars",
    href: "/webinars",
    description: "Live and on-demand conversations about production AI workflows.",
  },
];

export const companyLinks: SiteNavLink[] = [
  {
    label: "About",
    href: "/about",
    description: "The AI engineering studio and enterprise delivery team behind ArqAI Labs.",
  },
  {
    label: "How we work",
    href: "/how-we-work",
    description: "The operating rhythm from workflow blueprint to production run.",
  },
  {
    label: "Partners",
    href: "/partners",
    description: "Build, channel, platform, and design partnerships.",
  },
  {
    label: "Careers",
    href: "/careers",
    description: "Open roles for people who want to build production AI systems.",
  },
  {
    label: "Contact",
    href: "/contact",
    description: "Reach the ArqAI team with a workflow, partnership, or media request.",
  },
];

export const primaryNavigation: SiteNavItem[] = [
  {
    label: "Platform",
    href: "/platform",
    summary: "The architecture ArqAI uses to turn models into governed business execution.",
    feature: {
      title: "ArqAI Operating Fabric",
      body: "A workflow-first layer for orchestration, governance, integrations, evaluation, and continuous improvement.",
      href: "/platform",
      cta: "Explore the platform",
    },
    sections: [
      {
        title: "Operating fabric",
        links: [
          {
            label: "Workflow intelligence",
            href: "/platform#workflow-intelligence",
            description: "Map decisions, exceptions, evidence, and the metrics that matter.",
          },
          {
            label: "Governance plane",
            href: "/platform#governance-plane",
            description: "Permissions, approvals, policy checks, audit trails, and review loops.",
          },
          {
            label: "Integration layer",
            href: "/platform#integration-layer",
            description: "Connect AI to CRM, ERP, ITSM, data, knowledge, and operating systems.",
          },
          {
            label: "Operating loop",
            href: "/platform#operating-loop",
            description: "Monitor, evaluate, tune, and expand workflows after launch.",
          },
        ],
      },
      {
        title: "Build paths",
        links: [
          { label: "Services-led build", href: "/services", description: "For specific workflows that need bespoke engineering." },
          { label: "Accelerator-backed build", href: "/accelerators", description: "For repeatable vertical patterns with a faster starting point." },
          { label: "Managed AI operations", href: "/services/managed-ai-operations", description: "For production workflows that need ongoing ownership." },
        ],
      },
    ],
  },
  {
    label: "Services",
    href: "/services",
    summary: "Strategy, buildout, integration, governance, acceleration, and operations.",
    feature: {
      title: "From workflow problem to production system",
      body: "Use services when the workflow, data, controls, and operating metric need to be shaped around your business.",
      href: "/services",
      cta: "View services",
    },
    sections: [
      {
        title: "Service lines",
        links: services.map((service) => ({
          label: service.title,
          href: `/services/${service.slug}`,
          description: service.summary,
        })),
      },
    ],
  },
  {
    label: "Accelerators",
    href: "/accelerators",
    summary: "Reusable vertical AI patterns that are tailored to your systems, policies, and review model.",
    feature: {
      title: "Productized patterns, tuned for your operation",
      body: "Start closer to production with accelerators for claims, payment integrity, financial crime, loyalty, service ops, supply chain, and SecOps.",
      href: "/accelerators",
      cta: "Explore accelerators",
    },
    sections: [
      {
        title: "Accelerator lines",
        links: accelerators.map((accelerator) => ({
          label: accelerator.name,
          href: `/accelerators/${accelerator.id}`,
          description: accelerator.tagline,
        })),
      },
    ],
  },
  {
    label: "Industries",
    href: "/industries",
    summary: "Industry transformation pages for high-stakes, data-rich operating environments.",
    feature: {
      title: "Where generic AI falls short",
      body: "We build around industry-specific policy, evidence, exception paths, and the people accountable for the final decision.",
      href: "/industries",
      cta: "View industries",
    },
    sections: [
      {
        title: "Industry focus",
        links: industryLinks,
      },
    ],
  },
  {
    label: "Resources",
    href: "/resources",
    summary: "Thinking, proof, and practical field material for production AI teams.",
    feature: {
      title: "Learn from the work",
      body: "Browse writing, case material, guides, and events shaped around governed enterprise AI workflows.",
      href: "/resources",
      cta: "Open resources",
    },
    sections: [
      {
        title: "Knowledge hub",
        links: resourceLinks,
      },
    ],
  },
  {
    label: "Company",
    href: "/about",
    summary: "ArqAI Labs, our operating model, partners, careers, and contact paths.",
    feature: {
      title: "AI engineering with enterprise delivery depth",
      body: "ArqAI Labs combines a focused AI studio with delivery experience across data, cloud, security, ERP, and managed services.",
      href: "/about",
      cta: "About ArqAI",
    },
    sections: [
      {
        title: "Company",
        links: companyLinks,
      },
      {
        title: "Trust",
        links: [
          {
            label: "Trust center",
            href: "/trust",
            description: "Responsible AI, security posture, and governance commitments.",
          },
          {
            label: "Get Started",
            href: "/engage-us",
            description: "Bring us one workflow and we will map the production path.",
          },
        ],
      },
    ],
  },
];

export const footerNavigation: SiteNavSection[] = [
  {
    title: "Work",
    links: [
      { label: "Platform", href: "/platform" },
      { label: "Services", href: "/services" },
      { label: "Accelerators", href: "/accelerators" },
      { label: "Industries", href: "/industries" },
      { label: "How we work", href: "/how-we-work" },
    ],
  },
  {
    title: "Industries",
    links: industryLinks.map(({ label, href }) => ({ label, href })),
  },
  {
    title: "Resources",
    links: resourceLinks.map(({ label, href }) => ({ label, href })),
  },
  {
    title: "Company",
    links: companyLinks.map(({ label, href }) => ({ label, href })).concat([
      { label: "Trust", href: "/trust" },
      { label: "Get Started", href: "/engage-us" },
    ]),
  },
];

export const coreStaticPaths = [
  "/",
  "/platform",
  "/services",
  "/accelerators",
  "/industries",
  "/resources",
  "/how-we-work",
  "/how-it-works",
  "/use-cases",
  "/about",
  "/partners",
  "/careers",
  "/contact",
  "/trust",
  "/blog",
  "/case-studies",
  "/resources/whitepapers",
  "/whitepapers",
  "/webinars",
  "/engage-us",
  "/demo",
];
