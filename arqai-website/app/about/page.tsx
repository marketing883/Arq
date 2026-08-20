import type { Metadata } from "next";
import Link from "next/link";
import V5SiteLayout from "@/components/home-v5/V5SiteLayout";
import ClosingCta from "@/components/v6/ClosingCta";
import {
  generateOrganizationSchema,
  generateBreadcrumbSchema,
} from "@/lib/seo/structured-data";

// /about is the entity home for ArqAI Labs: it carries the Organization
// schema plus an AboutPage wrapper so search and answer engines have one
// authoritative source for company facts.
function AboutStructuredData() {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        "@id": "https://thearq.ai/about#webpage",
        url: "https://thearq.ai/about",
        name: "About ArqAI Labs",
        description:
          "ArqAI Labs is an independent AI engineering studio. Production AI, bespoke to your operation. In partnership with ACI Infotech.",
        inLanguage: "en-US",
        about: { "@id": "https://thearq.ai/#organization" },
      },
      { ...generateOrganizationSchema(), "@id": "https://thearq.ai/#organization" },
      generateBreadcrumbSchema([
        { name: "Home", url: "https://thearq.ai" },
        { name: "About", url: "https://thearq.ai/about" },
      ]),
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}

const glance = [
  { label: "What we are", value: "An independent AI engineering studio" },
  { label: "What we do", value: "Design, build, deploy, and run production AI for enterprise operations" },
  { label: "Founded", value: "2024" },
  { label: "Headquarters", value: "220 Davidson Ave, 2nd Floor, Suite 129, Somerset, NJ 08873, United States" },
  { label: "Delivery partner", value: "ACI Infotech — enterprise delivery and distribution partner" },
  { label: "Industries", value: "Healthcare payers, insurance carriers, banking, retail, manufacturing" },
  { label: "How we deliver", value: "Six service lines and eight Arq-prefixed accelerators on one operating fabric" },
];

export const metadata: Metadata = {
  title: "About",
  description:
    "ArqAI Labs is an independent AI engineering studio. Production AI, bespoke to your operation. In partnership with ACI Infotech.",
  alternates: { canonical: "https://thearq.ai/about" },
};

const beliefs = [
  {
    no: "01",
    title: "Tuned beats templated.",
    body: "Every operation has its own quirks. Off-the-shelf AI averages them away. We build to the quirks.",
  },
  {
    no: "02",
    title: "Production beats pilots.",
    body: "Most enterprise AI never makes it past the sandbox. We engineer for production from day one. That is the only standard we ship at.",
  },
  {
    no: "03",
    title: "Engineers, not consultants.",
    body: "A lean team of senior AI engineers. We would rather build than describe.",
  },
];

export default function AboutPage() {
  return (
    <V5SiteLayout>
      <AboutStructuredData />
      {/* Hero */}
      <section className="v5-page-hero">
        <div className="v5-container">
          <div className="v5-page-hero-inner">
            <span className="v5-badge">
              <span className="v5-badge-dot" />
              About
            </span>
            <h1 className="v5-h1">We build AI for the way people actually work.</h1>
            <p className="v5-lead">
              ArqAI Labs is an AI engineering studio. We design, build, deploy, and run
              production AI for operations that don&apos;t fit off-the-shelf. We are an
              engineering team, not a consulting practice. We ship the work; we do not
              decorate the deck.
            </p>
          </div>
        </div>
      </section>

      {/* At a glance — the extractable fact box answer engines can cite */}
      <section className="v5-section v5-bg-white" id="at-a-glance">
        <div className="v5-container">
          <div className="v5-section-head">
            <span className="v5-eyebrow">At a glance</span>
            <h2 className="v5-h2">ArqAI Labs, in plain facts.</h2>
          </div>
          <div className="v5-grid v5-grid-3">
            {glance.map((fact) => (
              <div className="v5-card" key={fact.label}>
                <span className="v5-eyebrow">{fact.label}</span>
                <p className="v5-body" style={{ marginTop: 8 }}>{fact.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Beliefs */}
      <section className="v5-section v5-bg-grey" id="beliefs">
        <div className="v5-container">
          <div className="v5-section-head">
            <span className="v5-eyebrow">What we believe</span>
            <h2 className="v5-h2">Three things we will not compromise on.</h2>
            <p className="v5-lead">
              These are not aspirations. They are the rules of every engagement we run.
            </p>
          </div>
          <div className="v5-grid v5-grid-3">
            {beliefs.map((b) => (
              <div className="v5-card v5-numcard" key={b.no}>
                <span className="v5-num">{b.no}</span>
                <h3 className="v5-h3">{b.title}</h3>
                <p className="v5-body">{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ACI partnership */}
      <section className="v5-section v5-bg-white" id="partner">
        <div className="v5-container">
          <div className="v5-split">
            <div className="v5-split-copy">
              <span className="v5-eyebrow">Our partner</span>
              <h2 className="v5-h2">Independent studio. Enterprise reach.</h2>
              <p className="v5-lead">
                ArqAI Labs is an independent AI engineering studio. We work in close
                partnership with ACI Infotech, a privately held enterprise technology firm,
                and that partnership gives us what most AI studios never get: direct access
                to enterprise operators, proven implementation playbooks, and the delivery
                depth to take AI all the way into production and keep it running.
              </p>
            </div>
            <div className="v5-card">
              <p style={{ fontSize: 16, lineHeight: 1.65, color: "var(--v5-ink-soft)", margin: 0 }}>
                Our founders built their careers inside enterprise operations through ACI.
                That is why we engineer for production from day one, and why we stand up
                governed AI inside real systems instead of stopping at a slide.
              </p>
              <p style={{ fontSize: 16, fontWeight: 600, color: "var(--v5-ink)", marginTop: 18, marginBottom: 0 }}>
                Independent by design. Enterprise-deep by partnership.
              </p>
            </div>
          </div>
        </div>
      </section>

      <ClosingCta
        heading="Want to work with us, build with us, or sell with us?"
        ctaLabel="Get Started"
        secondaryLabel="See open roles"
        secondaryHref="/careers"
      />
    </V5SiteLayout>
  );
}
