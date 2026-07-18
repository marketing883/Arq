import Link from "next/link";
import { Metadata } from "next";
import V5SiteLayout from "@/components/home-v5/V5SiteLayout";
import V5CtaSection from "@/components/home-v5/V5CtaSection";
import { ArrowRight, ArrowUpRight } from "@/components/home-v5/icons";
import {
  accelerators,
  verticalAccelerators,
  horizontalAccelerators,
  type Accelerator,
} from "@/lib/data/accelerators";
import { generateBreadcrumbSchema, generateFAQSchema } from "@/lib/seo/structured-data";

const SITE_URL = "https://thearq.ai";
const PAGE_TITLE = "AI Accelerators — Production-Ready, Governed From Day One";
const PAGE_DESC =
  "Ten production-ready AI accelerators, governed from day one: four vertical (ArqFWA, ArqLoyalty, ArqLogistics, ArqBanker) and six horizontal (ArqForecast, ArqSupport, ArqDataQ, ArqVantage, ArqSecOps, ArqEye). Every agent action carries encrypted, audit-ready proof.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESC,
  keywords: [
    "AI accelerators",
    "enterprise AI accelerators",
    "production AI workflow patterns",
    "vertical AI accelerators",
    "agentic AI accelerators",
    "governed AI agents",
    "ArqAI accelerators",
  ],
  alternates: { canonical: `${SITE_URL}/accelerators` },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/accelerators`,
    title: PAGE_TITLE,
    description: PAGE_DESC,
    siteName: "ArqAI Labs",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "ArqAI Labs Accelerators" }],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESC,
    site: "@The_ArqAI",
  },
};

const PORTFOLIO_FAQS = [
  {
    question: "What is an ArqAI accelerator?",
    answer:
      "An ArqAI accelerator is a pre-built, production-proven pattern of agents, integrations, governance controls, and operational logic for a recurring enterprise problem, configured to fit your data, systems, policies, and operating metrics. Deployment is measured in weeks rather than quarters.",
  },
  {
    question: "What is the difference between vertical and horizontal accelerators?",
    answer:
      "Vertical accelerators are built for a specific industry where domain knowledge is integral: ArqFWA for healthcare payment integrity, ArqLoyalty for loyalty platform modernization, ArqLogistics for supply chain risk, and ArqBanker for banking operations. Horizontal accelerators solve problems that appear across industries: ArqForecast (forecasting), ArqSupport (ticket management), ArqDataQ (data quality), ArqVantage (competitive pricing), ArqSecOps (security operations), and ArqEye (data observability).",
  },
  {
    question: "How are ArqAI accelerators governed?",
    answer:
      "Every accelerator produces encrypted, audit-ready proof on every agent action. No agent operates as a black box: every decision, recommendation, or autonomous action carries the trigger, the reasoning, the data inputs, and the outcome in a structured, persistent audit trail — designed into the architecture as a foundational requirement.",
  },
  {
    question: "How do accelerator engagements start?",
    answer:
      "Each accelerator has a fixed two-week entry point — a fit check such as the FWA Blind Spot Assessment or the Forecasting Accuracy Baseline — that compares your workflow, data, and controls against the accelerator and delivers a quantified analysis before any build commitment.",
  },
];

function CatalogCard({ accelerator, index }: { accelerator: Accelerator; index: number }) {
  return (
    <Link
      href={`/accelerators/${accelerator.id}`}
      className="v5-card v5-card-link"
      style={{ padding: 0, overflow: "hidden" }}
    >
      <div
        className="v5-acc-cover"
        style={{ backgroundImage: `url(${accelerator.image})` }}
        aria-hidden="true"
      >
        <span className="v5-acc-name">{accelerator.name}</span>
        <span className="v5-svc-num">{String(index + 1).padStart(2, "0")}</span>
      </div>
      <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
        <span className="v5-card-eyebrow">{accelerator.category}</span>
        <p className="v5-body">{accelerator.summary}</p>
        <p className="v5-body" style={{ marginTop: "auto", color: "var(--v5-ink-soft)" }}>
          Built for <strong style={{ color: "var(--v5-ink)" }}>{accelerator.builtFor}</strong>
        </p>
        <span className="v5-card-more">
          View accelerator <ArrowUpRight />
        </span>
      </div>
    </Link>
  );
}

export default function AcceleratorsPage() {
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "ArqAI Labs Accelerator Portfolio",
    description: PAGE_DESC,
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
      },
    })),
  };
  const faqSchema = generateFAQSchema(PORTFOLIO_FAQS);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Accelerators", url: `${SITE_URL}/accelerators` },
  ]);

  return (
    <V5SiteLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Hero */}
      <section className="v5-page-hero">
        <div className="v5-container">
          <div className="v5-page-hero-inner">
            <span className="v5-badge">
              <span className="v5-badge-dot" />
              Accelerators
            </span>
            <h1 className="v5-h1">Ten production-ready accelerators. Governed from day one.</h1>
            <p className="v5-lead">
              An accelerator is a proven pattern of agents, integrations, and governance
              controls for a recurring enterprise problem, configured to your data, systems,
              and policies rather than designed from scratch. Four vertical
              accelerators for industry-specific deployment. Six horizontal accelerators for
              cross-industry configuration.
            </p>
            <div className="v5-hero-actions">
              <Link href="/engage-us" className="v5-btn v5-btn-primary">
                Book a fit check <ArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How it rolls out */}
      <section className="v5-section v5-bg-grey">
        <div className="v5-container">
          <div className="v5-section-head">
            <span className="v5-eyebrow">Pattern library</span>
            <h2 className="v5-h2">Speed from the reusable core. Value from the enterprise fit.</h2>
            <p className="v5-lead">
              Deployment timelines are measured in weeks rather than quarters, discovery focuses
              on configuration rather than design from scratch, and you adopt a pattern validated
              across deployments rather than betting on a custom build.
            </p>
          </div>
          <div className="v5-grid v5-grid-3">
            {[
              {
                title: "Fit check before build.",
                body: "Every accelerator starts with a fixed two-week entry point that compares your workflow, data sources, and controls against the accelerator — and delivers a quantified analysis you keep.",
                href: "/services/vertical-acceleration",
              },
              {
                title: "Configure the control model.",
                body: "Permissions, policy checks, escalation rules, evidence capture, and reviewer authority are tuned before the accelerator takes on live work.",
                href: "/services/governance-by-design",
              },
              {
                title: "Expand only after the first queue proves value.",
                body: "The first release stays narrow enough to measure, then expands into adjacent teams, queues, and use cases with the operating loop intact.",
                href: "/services/managed-ai-operations",
              },
            ].map((path, index) => (
              <Link href={path.href} className="v5-card v5-card-link v5-numcard" key={path.href}>
                <span className="v5-num">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="v5-h3">{path.title}</h3>
                <p className="v5-body">{path.body}</p>
                <span className="v5-card-more">
                  Explore <ArrowRight />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Vertical accelerators */}
      <section className="v5-section v5-bg-white">
        <div className="v5-container">
          <div className="v5-section-head">
            <span className="v5-eyebrow">Vertical · {verticalAccelerators.length} accelerators</span>
            <h2 className="v5-h2">Industry-specific domain intelligence built in.</h2>
            <p className="v5-lead">
              Built for industries where domain knowledge is integral to the solution: healthcare
              payment integrity, loyalty program reconciliation, supply chain dependency modeling,
              and banking operations intelligence.
            </p>
          </div>
          <div className="v5-grid v5-grid-2">
            {verticalAccelerators.map((accelerator, index) => (
              <CatalogCard accelerator={accelerator} index={index} key={accelerator.id} />
            ))}
          </div>
        </div>
      </section>

      {/* Horizontal accelerators */}
      <section className="v5-section v5-bg-grey">
        <div className="v5-container">
          <div className="v5-section-head">
            <span className="v5-eyebrow">Horizontal · {horizontalAccelerators.length} accelerators</span>
            <h2 className="v5-h2">Cross-industry problem patterns, configured to your context.</h2>
            <p className="v5-lead">
              Built for problems every enterprise shares — forecasting, service management, data
              quality, competitive pricing, security operations, and data observability — configured
              to your data and operating context.
            </p>
          </div>
          <div className="v5-grid v5-grid-3">
            {horizontalAccelerators.map((accelerator, index) => (
              <CatalogCard accelerator={accelerator} index={index + verticalAccelerators.length} key={accelerator.id} />
            ))}
          </div>
        </div>
      </section>

      {/* Governance commitment */}
      <section className="v5-section v5-bg-white">
        <div className="v5-container">
          <div className="v5-split">
            <div className="v5-split-copy">
              <span className="v5-eyebrow">Governance commitment</span>
              <h2 className="v5-h2">No black boxes. Governance designed in, not bolted on.</h2>
              <p className="v5-lead" style={{ marginTop: 16 }}>
                Every accelerator produces encrypted, audit-ready proof on every agent action.
                Every decision, recommendation, or autonomous action carries the trigger, the
                reasoning, the data inputs, and the outcome in a structured, persistent audit
                trail — a foundational requirement of the agent architecture, not an afterthought.
              </p>
            </div>
            <div className="v5-card dark">
              <span className="v5-card-eyebrow" style={{ color: "var(--v5-lime)" }}>FAQ</span>
              {PORTFOLIO_FAQS.slice(0, 2).map((faq) => (
                <div key={faq.question} style={{ marginBottom: 14 }}>
                  <h3 className="v5-h3" style={{ fontSize: 17, marginBottom: 6 }}>{faq.question}</h3>
                  <p className="v5-body">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA band */}
      <V5CtaSection>
            <h2 className="v5-h2">Put an accelerator to work.</h2>
            <p className="v5-lead">
              Start with a fit check. We compare your workflow, data, and controls against the
              accelerator before recommending a rollout path — and show where bespoke
              engineering is the better answer.
            </p>
            <div className="v5-cta-card-actions">
              <Link href="/engage-us" className="v5-btn v5-btn-primary">
                Book a fit check <ArrowRight />
              </Link>
            </div>
      </V5CtaSection>
    </V5SiteLayout>
  );
}
