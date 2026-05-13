import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowIcon, CheckIcon, DarkShell } from "@/components/site-dark/DarkShell";
import { HeroImagePanel, SignalStrip } from "@/components/site-dark/InternalVisuals";
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
  };
}

export default function ServiceDetailPage({ params }: ServicePageProps) {
  const service = getService(params.slug);

  if (!service) {
    notFound();
  }

  return (
    <DarkShell>
      <section className="a-hero">
        <div className="a-hero-grid" />
        <div className="a-wrap" style={{ position: "relative" }}>
          <div style={{ display: "grid", gap: 48, alignItems: "center" }} className="detail-hero-grid">
            <div>
              <span className="a-pill">
                <span className="dot" /> {service.eyebrow}
              </span>
              <h1 className="h-display" style={{ marginTop: 28, maxWidth: "14ch" }}>
                {service.title}
              </h1>
              <p className="lede" style={{ marginTop: 28, maxWidth: "62ch" }}>
                {service.summary}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 30 }}>
                <Link href="/engage-us" className="a-btn a-btn-primary">
                  Get Started <ArrowIcon className="arrow" />
                </Link>
                <Link href="/services" className="a-btn a-btn-ghost">
                  All services
                </Link>
              </div>
            </div>

            <HeroImagePanel
              image={service.image}
              alt=""
              label={service.shortTitle}
              title="Workflow signal map"
              variant="flow"
              priority
            />
          </div>
        </div>
      </section>

      <section className="a-section">
        <div className="a-wrap">
          <div className="gap-split internal-story">
            <article className="gap-col fail">
              <h4>The problem</h4>
              <div className="big" style={{ marginTop: 8 }}>
                Why teams get stuck.
              </div>
              <p style={{ color: "var(--ink-cream-d)", lineHeight: 1.65, marginTop: 18 }}>
                {service.problem}
              </p>
            </article>
            <article className="gap-col win">
              <h4>The promise</h4>
              <div className="big" style={{ marginTop: 8 }}>
                What changes with ArqAI Labs.
              </div>
              <p style={{ color: "var(--ink-cream-d)", lineHeight: 1.65, marginTop: 18 }}>
                {service.promise}
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="a-section">
        <div className="a-wrap">
          <SignalStrip
            label="Operating path"
            title="A useful AI system needs more than a model."
            body="The work moves through data, policy, exception handling, reviewer judgment, and system updates. We design the service around that path so the first release can be used in production."
            variant="network"
            points={["Data", "Policy", "Review", "Action"]}
          />
        </div>
      </section>

      <section className="a-section">
        <div className="a-wrap">
          <div className="a-section-head">
            <div>
              <span className="a-eyebrow">Measurable outcomes</span>
              <h2 className="h-section" style={{ marginTop: 18 }}>
                Built to move an operating metric.
              </h2>
            </div>
            <p className="lede">
              Every service engagement starts with a specific workflow metric and a production path that can be
              inspected by business, technology, and risk owners.
            </p>
          </div>

          <div className="steps steps-relief" style={{ marginTop: 44 }}>
            {service.outcomes.map((outcome) => (
              <div className="step" key={outcome.label}>
                <span className="num">{outcome.value}</span>
                <h3 style={{ marginTop: 28 }}>{outcome.label}</h3>
                <p>{outcome.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="a-section">
        <div className="a-wrap">
          <div className="a-section-head">
            <div>
              <span className="a-eyebrow">Deliverables</span>
              <h2 className="h-section" style={{ marginTop: 18 }}>
                What the team leaves with.
              </h2>
            </div>
            <p className="lede">
              The artifacts are meant to be used by operators, engineers, risk owners, and executives. No shelfware.
            </p>
          </div>

          <div className="svc-grid relief-grid" style={{ marginTop: 44 }}>
            {service.deliverables.map((deliverable) => (
              <div className="a-card" key={deliverable} style={{ padding: 24 }}>
                <div style={{ color: "var(--ember)", marginBottom: 16 }}>
                  <CheckIcon />
                </div>
                <p style={{ color: "var(--ink-cream)", fontSize: 17, lineHeight: 1.45, margin: 0 }}>
                  {deliverable}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="a-section">
        <div className="a-wrap">
          <div className="gap-split internal-story">
            <article className="a-card" style={{ padding: 32 }}>
              <span className="a-eyebrow">Signals</span>
              <h2 className="h-section" style={{ fontSize: "clamp(28px, 3.2vw, 44px)", marginTop: 18 }}>
                When this service fits.
              </h2>
              <ul style={{ listStyle: "none", padding: 0, margin: "28px 0 0", display: "grid", gap: 14 }}>
                {service.signals.map((signal) => (
                  <li key={signal} style={{ display: "flex", gap: 12, color: "var(--ink-cream-d)", lineHeight: 1.5 }}>
                    <span style={{ color: "var(--ember)", marginTop: 2 }}>
                      <CheckIcon />
                    </span>
                    {signal}
                  </li>
                ))}
              </ul>
            </article>
            <article className="a-card" style={{ padding: 32 }}>
              <span className="a-eyebrow">Where this helps</span>
              <h2 className="h-section" style={{ fontSize: "clamp(28px, 3.2vw, 44px)", marginTop: 18 }}>
                What the work usually involves.
              </h2>
              <ul style={{ listStyle: "none", padding: 0, margin: "28px 0 0", display: "grid", gap: 14 }}>
                {service.workflowContexts.map((context) => (
                  <li key={context} style={{ display: "flex", gap: 12, color: "var(--ink-cream-d)", lineHeight: 1.5 }}>
                    <span style={{ color: "var(--ember)", marginTop: 2 }}>
                      <CheckIcon />
                    </span>
                    {context}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section className="a-section">
        <div className="a-wrap">
          <div className="cta-strip">
            <h2 className="h-section" style={{ marginTop: 0, maxWidth: "18ch" }}>
              {service.cta.heading}
            </h2>
            <p className="lede" style={{ marginTop: 18, maxWidth: "62ch" }}>
              {service.cta.body}
            </p>
            <Link href="/engage-us" className="a-btn a-btn-primary" style={{ marginTop: 28 }}>
              Get Started <ArrowIcon className="arrow" />
            </Link>
          </div>
        </div>
      </section>
    </DarkShell>
  );
}
