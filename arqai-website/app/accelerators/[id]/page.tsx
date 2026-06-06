import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import V5SiteLayout from "@/components/home-v5/V5SiteLayout";
import { ArrowRight, SparkIcon, ShieldIcon, InsightIcon, DocIcon, ChatIcon } from "@/components/home-v5/icons";
import { accelerators, getAccelerator } from "@/lib/data/accelerators";

const CAP_ICONS = [SparkIcon, InsightIcon, ShieldIcon, DocIcon, ChatIcon];

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
    openGraph: {
      title: `${accelerator.name} — ${accelerator.category}`,
      description: accelerator.summary,
      images: [{ url: accelerator.heroImage }],
    },
  };
}

export default function AcceleratorDetailPage({ params }: AcceleratorPageProps) {
  const accelerator = getAccelerator(params.id);

  if (!accelerator) {
    notFound();
  }

  const others = accelerators.filter((a) => a.id !== accelerator.id).slice(0, 3);

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
                src={accelerator.heroImage}
                alt={`${accelerator.name} — ${accelerator.category}`}
                fill
                sizes="(min-width: 860px) 50vw, 100vw"
                style={{ objectFit: "cover" }}
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Overview + metrics */}
      <section className="v5-section v5-bg-grey">
        <div className="v5-container">
          <div className="v5-split">
            <div className="v5-split-copy">
              <span className="v5-eyebrow">Overview</span>
              <h2 className="v5-h2" style={{ marginTop: 14 }}>Built for {accelerator.builtFor.split(",")[0].toLowerCase()} and the teams around them.</h2>
              <p className="v5-lead" style={{ marginTop: 16 }}>{accelerator.overview}</p>
              <p className="v5-body" style={{ marginTop: 16 }}>
                <strong style={{ color: "var(--v5-ink)" }}>Built for:</strong> {accelerator.builtFor}
              </p>
            </div>
            <div className="v5-stats" style={{ gridTemplateColumns: "1fr", alignContent: "start" }}>
              {accelerator.metrics.map((metric) => (
                <div className="v5-stat" key={metric.label} style={{ background: "var(--v5-white)" }}>
                  <strong>{metric.value}</strong>
                  <span>{metric.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pain / Promise */}
      <section className="v5-section v5-bg-white">
        <div className="v5-container">
          <div className="v5-grid v5-grid-2">
            <article className="v5-card">
              <span className="v5-card-eyebrow">The challenge</span>
              <h2 className="v5-h3">Where teams get stuck.</h2>
              <p className="v5-body">{accelerator.pain}</p>
            </article>
            <article className="v5-card dark">
              <span className="v5-card-eyebrow" style={{ color: "var(--v5-lime)" }}>The shift</span>
              <h2 className="v5-h3">What changes with {accelerator.name}.</h2>
              <p className="v5-body">{accelerator.promise}</p>
            </article>
          </div>
        </div>
      </section>

      {/* Full-width showcase band */}
      <section className="v5-showcase">
        <Image
          src={accelerator.secondaryImage}
          alt=""
          fill
          sizes="100vw"
          className="v5-showcase-img"
        />
        <span className="v5-showcase-inset" />
        <div className="v5-container">
          <div className="v5-showcase-body">
            <span className="v5-card-eyebrow" style={{ color: "var(--v5-lime)" }}>
              Built for production
            </span>
            <h2 className="v5-h2" style={{ marginTop: 10 }}>{accelerator.promise}</h2>
            <div className="v5-cta-card-actions" style={{ justifyContent: "flex-start", marginTop: 24 }}>
              <Link href="/engage-us" className="v5-btn v5-btn-primary">
                Get Started <ArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="v5-section v5-bg-grey">
        <div className="v5-container">
          <div className="v5-section-head">
            <span className="v5-eyebrow">Capabilities</span>
            <h2 className="v5-h2">What {accelerator.name} does.</h2>
            <p className="v5-lead">
              A reusable workflow spine, tuned to your data, systems, and controls — not a generic model wrapper.
            </p>
          </div>
          <div className="v5-grid v5-grid-3">
            {accelerator.capabilities.map((cap, i) => {
              const Icon = CAP_ICONS[i % CAP_ICONS.length];
              return (
                <div className="v5-card" key={cap.title}>
                  <span className="v5-card-ico"><Icon /></span>
                  <h3 className="v5-h3">{cap.title}</h3>
                  <p className="v5-body">{cap.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works (rollout) */}
      <section className="v5-section v5-bg-white">
        <div className="v5-container">
          <div className="v5-section-head">
            <span className="v5-eyebrow">How it rolls out</span>
            <h2 className="v5-h2">From fit check to first operating queue.</h2>
            <p className="v5-lead">
              Accelerators move fastest when the first release is narrow, measurable, and connected to the people who own the work.
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

      {/* Use cases */}
      <section className="v5-section v5-bg-grey">
        <div className="v5-container">
          <div className="v5-section-head">
            <span className="v5-eyebrow">Use cases</span>
            <h2 className="v5-h2">Where it earns its place.</h2>
          </div>
          <div className="v5-grid v5-grid-3">
            {accelerator.useCases.map((uc) => (
              <div className="v5-card" key={uc.title}>
                <h3 className="v5-h3">{uc.title}</h3>
                <p className="v5-body">{uc.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations + proof */}
      <section className="v5-section v5-bg-white">
        <div className="v5-container">
          <div className="v5-split">
            <div className="v5-split-copy">
              <span className="v5-eyebrow">Integrations</span>
              <h2 className="v5-h2">Wired into the stack you already run.</h2>
              <p className="v5-lead">{accelerator.proof}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 22 }}>
                {accelerator.integrations.map((tool) => (
                  <span className="v5-chip" key={tool}>{tool}</span>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div className="v5-media-sm">
                <Image
                  src={accelerator.tertiaryImage}
                  alt={`${accelerator.name} in context`}
                  width={420}
                  height={315}
                  sizes="(min-width: 860px) 420px, 100vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fit signals */}
      <section className="v5-section v5-bg-grey">
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

      {/* Explore other accelerators */}
      <section className="v5-section v5-bg-white">
        <div className="v5-container">
          <div className="v5-section-head">
            <span className="v5-eyebrow">More accelerators</span>
            <h2 className="v5-h2">Explore the rest of the catalog.</h2>
          </div>
          <div className="v5-grid v5-grid-3">
            {others.map((a) => (
              <Link
                href={`/accelerators/${a.id}`}
                className="v5-card v5-card-link"
                key={a.id}
                style={{ padding: 0, overflow: "hidden" }}
              >
                <div className="v5-acc-cover" style={{ backgroundImage: `url(${a.image})` }} aria-hidden="true">
                  <span className="v5-acc-name">{a.name}</span>
                </div>
                <div style={{ padding: 22, display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                  <span className="v5-card-eyebrow">{a.category}</span>
                  <p className="v5-body">{a.tagline}</p>
                  <span className="v5-card-more">View accelerator <ArrowRight /></span>
                </div>
              </Link>
            ))}
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
              Bring us the workflow, the data sources, and the operating metric. We will show where {accelerator.name} helps, what must be customized, and what should stay human-led.
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
