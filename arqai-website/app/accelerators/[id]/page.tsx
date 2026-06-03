import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import V5SiteLayout from "@/components/home-v5/V5SiteLayout";
import { ArrowRight } from "@/components/home-v5/icons";
import { accelerators, getAccelerator } from "@/lib/data/accelerators";

type AcceleratorPageProps = {
  params: {
    id: string;
  };
};

export function generateStaticParams() {
  return accelerators.map((accelerator) => ({ id: accelerator.id }));
}

export function generateMetadata({ params }: AcceleratorPageProps): Metadata {
  const accelerator = getAccelerator(params.id);

  if (!accelerator) {
    return {
      title: "Accelerator Not Found | ArqAI Labs",
    };
  }

  return {
    title: `${accelerator.name} | ArqAI Labs Accelerators`,
    description: accelerator.summary,
    alternates: { canonical: `https://thearq.ai/accelerators/${accelerator.id}` },
  };
}

export default function AcceleratorDetailPage({ params }: AcceleratorPageProps) {
  const accelerator = getAccelerator(params.id);

  if (!accelerator) {
    notFound();
  }

  return (
    <V5SiteLayout>
      {/* Hero */}
      <section className="v5-page-hero">
        <div className="v5-container">
          <div className="v5-crumbs" style={{ marginBottom: 22 }}>
            <Link href="/accelerators">Accelerators</Link>
            <span>/</span>
            <span style={{ color: "var(--v5-ink-soft)" }}>{accelerator.name}</span>
          </div>
          <div className="v5-split">
            <div className="v5-split-copy">
              <span className="v5-badge">
                <span className="v5-badge-dot" />
                {accelerator.category}
              </span>
              <h1 className="v5-h1" style={{ marginTop: 18 }}>{accelerator.name}</h1>
              <p className="v5-lead">{accelerator.tagline}</p>
              <div className="v5-hero-actions">
                <Link href="/engage-us" className="v5-btn v5-btn-primary">
                  Get Started <ArrowRight />
                </Link>
                <Link href="/accelerators" className="v5-btn v5-btn-ghost">
                  All accelerators
                </Link>
              </div>
            </div>
            <div className="v5-split-media">
              <Image
                src={accelerator.image}
                alt={accelerator.name}
                fill
                sizes="(min-width: 860px) 50vw, 100vw"
                style={{ objectFit: "cover" }}
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Pain / Promise */}
      <section className="v5-section v5-bg-grey">
        <div className="v5-container">
          <div className="v5-grid v5-grid-2">
            <article className="v5-card">
              <span className="v5-card-eyebrow">Pain</span>
              <h2 className="v5-h3">The operating drag.</h2>
              <p className="v5-body">{accelerator.pain}</p>
            </article>
            <article className="v5-card dark">
              <span className="v5-card-eyebrow" style={{ color: "var(--v5-lime)" }}>Promise</span>
              <h2 className="v5-h3">The workflow shift.</h2>
              <p className="v5-body">{accelerator.promise}</p>
            </article>
          </div>
        </div>
      </section>

      {/* Proof + metrics */}
      <section className="v5-section v5-bg-white">
        <div className="v5-container">
          <div className="v5-section-head">
            <span className="v5-eyebrow">Proof</span>
            <h2 className="v5-h2">Reusable pattern, enterprise controls.</h2>
            <p className="v5-lead">{accelerator.proof}</p>
          </div>
          <div className="v5-stats">
            {accelerator.metrics.map((metric) => (
              <div className="v5-stat" key={metric.label}>
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rollout */}
      <section className="v5-section v5-bg-grey">
        <div className="v5-container">
          <div className="v5-section-head">
            <span className="v5-eyebrow">Rollout</span>
            <h2 className="v5-h2">From fit check to first operating queue.</h2>
            <p className="v5-lead">
              Accelerators move fastest when the first release is narrow, measurable, and
              connected to the people who own the work.
            </p>
          </div>
          <div className="v5-grid v5-grid-4">
            {accelerator.rollout.map((step, index) => (
              <div className="v5-card v5-numcard" key={step}>
                <span className="v5-num">{String(index + 1).padStart(2, "0")}</span>
                <p className="v5-body" style={{ color: "var(--v5-ink-soft)" }}>{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fit signals */}
      <section className="v5-section v5-bg-white">
        <div className="v5-container">
          <div className="v5-split">
            <div className="v5-split-copy">
              <span className="v5-eyebrow">Fit signals</span>
              <h2 className="v5-h2">When {accelerator.name} is worth a closer look.</h2>
            </div>
            <div className="v5-card">
              <ul className="v5-list">
                {accelerator.signals.map((signal) => (
                  <li key={signal}>{signal}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="v5-section v5-cta-band">
        <div className="v5-container">
          <div className="v5-cta-card">
            <div className="v5-cta-glow" />
            <h2 className="v5-h2">Start with accelerator fit, not a generic demo.</h2>
            <p className="v5-lead">
              Bring us the workflow, the data sources, and the operating metric. We will show
              where {accelerator.name} helps, what must be customized, and what should stay
              human-led.
            </p>
            <div className="v5-cta-card-actions">
              <Link href="/engage-us" className="v5-btn v5-btn-primary">
                Get Started <ArrowRight />
              </Link>
              <Link href="/accelerators" className="v5-btn v5-btn-ghost">
                All accelerators
              </Link>
            </div>
          </div>
        </div>
      </section>
    </V5SiteLayout>
  );
}
