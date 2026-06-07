import Link from "next/link";
import { Metadata } from "next";
import V5SiteLayout from "@/components/home-v5/V5SiteLayout";
import V5CtaSection from "@/components/home-v5/V5CtaSection";
import { ArrowRight, ArrowUpRight } from "@/components/home-v5/icons";
import { accelerators } from "@/lib/data/accelerators";

export const metadata: Metadata = {
  title: "AI Accelerators | ArqAI Labs",
  description:
    "Productized AI accelerator patterns for payer operations, claims, financial crime, loyalty, network operations, service workflows, supply chain, and security operations.",
  alternates: { canonical: "https://thearq.ai/accelerators" },
};

const paths = [
  {
    title: "Fit check before build.",
    body:
      "We compare your workflow, data sources, review steps, and operating metric against the accelerator spine before recommending a rollout.",
    href: "/services/vertical-acceleration",
  },
  {
    title: "Configure the control model.",
    body:
      "Permissions, policy checks, escalation rules, evidence capture, and reviewer authority are tuned before the accelerator takes on live work.",
    href: "/services/governance-by-design",
  },
  {
    title: "Expand only after the first queue proves value.",
    body:
      "The first release stays narrow enough to measure, then expands into adjacent teams, queues, and use cases with the operating loop intact.",
    href: "/services/managed-ai-operations",
  },
];

export default function AcceleratorsPage() {
  return (
    <V5SiteLayout>
      {/* Hero */}
      <section className="v5-page-hero">
        <div className="v5-container">
          <div className="v5-page-hero-inner">
            <span className="v5-badge">
              <span className="v5-badge-dot" />
              Accelerators
            </span>
            <h1 className="v5-h1">Productized AI patterns, tailored to how your operation works.</h1>
            <p className="v5-lead">
              Accelerators are reusable workflow spines for recurring enterprise problems.
              They shorten discovery and build time, then adapt around your data, systems,
              policies, approval paths, and operating metric.
            </p>
            <div className="v5-hero-actions">
              <Link href="/engage-us" className="v5-btn v5-btn-primary">
                Get Started <ArrowRight />
              </Link>
              <Link href="/services/vertical-acceleration" className="v5-btn v5-btn-ghost">
                How acceleration works
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
              Each accelerator begins with a proven workflow architecture, then bends around
              the systems, policies, data quality, and reviewers in front of us.
            </p>
          </div>
          <div className="v5-grid v5-grid-3">
            {paths.map((path, index) => (
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

      {/* Accelerator catalog */}
      <section className="v5-section v5-bg-white">
        <div className="v5-container">
          <div className="v5-section-head">
            <span className="v5-eyebrow">Accelerator lines</span>
            <h2 className="v5-h2">Start from the workflow spine closest to the problem.</h2>
            <p className="v5-lead">
              These are not generic apps. Each line is a reusable starting point for a
              recurring operating pattern, shaped into a production system through services
              and the ArqAI operating fabric.
            </p>
          </div>
          <div className="v5-grid v5-grid-3">
            {accelerators.map((accelerator, index) => (
              <Link
                href={`/accelerators/${accelerator.id}`}
                className="v5-card v5-card-link"
                key={accelerator.id}
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
            ))}
          </div>
        </div>
      </section>

      {/* CTA band */}
      <V5CtaSection>
            <h2 className="v5-h2">Faster should still feel built for your business.</h2>
            <p className="v5-lead">
              Bring us the queue, case type, signal source, or review workflow. We will show
              which accelerator is closest, what must be customized, and where bespoke
              engineering is the better answer.
            </p>
            <div className="v5-cta-card-actions">
              <Link href="/engage-us" className="v5-btn v5-btn-primary">
                Get Started <ArrowRight />
              </Link>
              <Link href="/services" className="v5-btn v5-btn-ghost">
                View services
              </Link>
            </div>
      </V5CtaSection>
    </V5SiteLayout>
  );
}
