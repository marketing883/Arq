import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import V5SiteLayout from "@/components/home-v5/V5SiteLayout";
import { ArrowRight } from "@/components/home-v5/icons";
import { getService, services } from "@/lib/data/services";

type ServicePageProps = {
  params: {
    slug: string;
  };
};

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export function generateMetadata({ params }: ServicePageProps): Metadata {
  const service = getService(params.slug);

  if (!service) {
    return {
      title: "Service Not Found | ArqAI Labs",
    };
  }

  return {
    title: `${service.title} | ArqAI Labs`,
    description: service.summary,
    alternates: { canonical: `https://thearq.ai/services/${service.slug}` },
  };
}

export default function ServiceDetailPage({ params }: ServicePageProps) {
  const service = getService(params.slug);

  if (!service) {
    notFound();
  }

  return (
    <V5SiteLayout>
      {/* Hero */}
      <section className="v5-page-hero">
        <div className="v5-container">
          <div className="v5-crumbs" style={{ marginBottom: 22 }}>
            <Link href="/services">Services</Link>
            <span>/</span>
            <span style={{ color: "var(--v5-ink-soft)" }}>{service.shortTitle}</span>
          </div>
          <div className="v5-split">
            <div className="v5-split-copy">
              <span className="v5-badge">
                <span className="v5-badge-dot" />
                {service.eyebrow}
              </span>
              <h1 className="v5-h1" style={{ marginTop: 18 }}>{service.title}</h1>
              <p className="v5-lead">{service.summary}</p>
              <div className="v5-hero-actions">
                <Link href="/engage-us" className="v5-btn v5-btn-primary">
                  Get Started <ArrowRight />
                </Link>
                <Link href="/services" className="v5-btn v5-btn-ghost">
                  All services
                </Link>
              </div>
            </div>
            <div className="v5-split-media">
              <Image
                src={service.image}
                alt=""
                fill
                sizes="(min-width: 860px) 50vw, 100vw"
                style={{ objectFit: "cover" }}
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Problem / Promise */}
      <section className="v5-section v5-bg-grey">
        <div className="v5-container">
          <div className="v5-grid v5-grid-2">
            <article className="v5-card">
              <span className="v5-card-eyebrow">The problem</span>
              <h2 className="v5-h3">Why teams get stuck.</h2>
              <p className="v5-body">{service.problem}</p>
            </article>
            <article className="v5-card dark">
              <span className="v5-card-eyebrow" style={{ color: "var(--v5-lime)" }}>The promise</span>
              <h2 className="v5-h3">What changes with ArqAI Labs.</h2>
              <p className="v5-body">{service.promise}</p>
            </article>
          </div>
        </div>
      </section>

      {/* Outcomes */}
      <section className="v5-section v5-bg-white">
        <div className="v5-container">
          <div className="v5-section-head">
            <span className="v5-eyebrow">Measurable outcomes</span>
            <h2 className="v5-h2">Built to move an operating metric.</h2>
            <p className="v5-lead">
              Every service engagement starts with a specific workflow metric and a
              production path that can be inspected by business, technology, and risk owners.
            </p>
          </div>
          <div className="v5-grid v5-grid-3">
            {service.outcomes.map((outcome) => (
              <div className="v5-card" key={outcome.label}>
                <strong style={{ fontFamily: "var(--v5-display)", fontWeight: 600, fontSize: 38, lineHeight: 1, color: "var(--v5-ink)", letterSpacing: "-0.02em" }}>
                  {outcome.value}
                </strong>
                <h3 className="v5-h3" style={{ marginTop: 6 }}>{outcome.label}</h3>
                <p className="v5-body">{outcome.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deliverables */}
      <section className="v5-section v5-bg-grey">
        <div className="v5-container">
          <div className="v5-section-head">
            <span className="v5-eyebrow">Deliverables</span>
            <h2 className="v5-h2">What the team leaves with.</h2>
            <p className="v5-lead">
              The artifacts are meant to be used by operators, engineers, risk owners, and
              executives. No shelfware.
            </p>
          </div>
          <div className="v5-grid v5-grid-3">
            {service.deliverables.map((deliverable) => (
              <div className="v5-card" key={deliverable}>
                <p style={{ fontSize: 16, lineHeight: 1.5, color: "var(--v5-ink-soft)", margin: 0 }}>
                  {deliverable}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Signals + contexts */}
      <section className="v5-section v5-bg-white">
        <div className="v5-container">
          <div className="v5-grid v5-grid-2">
            <article className="v5-card">
              <span className="v5-card-eyebrow">Signals</span>
              <h2 className="v5-h3">When this service fits.</h2>
              <ul className="v5-list">
                {service.signals.map((signal) => (
                  <li key={signal}>{signal}</li>
                ))}
              </ul>
            </article>
            <article className="v5-card">
              <span className="v5-card-eyebrow">Where this helps</span>
              <h2 className="v5-h3">What the work usually involves.</h2>
              <ul className="v5-list">
                {service.workflowContexts.map((context) => (
                  <li key={context}>{context}</li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="v5-section v5-cta-band">
        <div className="v5-container">
          <div className="v5-cta-card">
            <div className="v5-cta-glow" />
            <h2 className="v5-h2">{service.cta.heading}</h2>
            <p className="v5-lead">{service.cta.body}</p>
            <div className="v5-cta-card-actions">
              <Link href="/engage-us" className="v5-btn v5-btn-primary">
                Get Started <ArrowRight />
              </Link>
              <Link href="/services" className="v5-btn v5-btn-ghost">
                All services
              </Link>
            </div>
          </div>
        </div>
      </section>
    </V5SiteLayout>
  );
}
