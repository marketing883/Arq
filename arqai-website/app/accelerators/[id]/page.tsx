import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowIcon, CheckIcon, DarkShell } from "@/components/site-dark/DarkShell";
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
  };
}

export default function AcceleratorDetailPage({ params }: AcceleratorPageProps) {
  const accelerator = getAccelerator(params.id);

  if (!accelerator) {
    notFound();
  }

  return (
    <DarkShell>
      <section className="a-hero">
        <div className="a-hero-grid" />
        <div className="a-wrap" style={{ position: "relative" }}>
          <div className="detail-hero-grid" style={{ display: "grid", gap: 48, alignItems: "center" }}>
            <div>
              <span className="a-pill">
                <span className="dot" /> Accelerator / {accelerator.name}
              </span>
              <h1 className="h-display" style={{ marginTop: 28, maxWidth: "13ch" }}>
                {accelerator.name}
              </h1>
              <p className="lede" style={{ marginTop: 28, maxWidth: "62ch" }}>
                {accelerator.tagline}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 30 }}>
                <Link href="/engage-us" className="a-btn a-btn-primary">
                  Explore fit <ArrowIcon className="arrow" />
                </Link>
                <Link href="/accelerators" className="a-btn a-btn-ghost">
                  All accelerators
                </Link>
              </div>
            </div>

            <div className="acc-card" style={{ minHeight: 440 }}>
              <div className="acc-bg" style={{ backgroundImage: `url(${accelerator.image})` }} aria-hidden="true" />
              <div className="acc-glass" aria-hidden="true" />
              <div className="acc-content">
                <span className="a-tag">{accelerator.category}</span>
                <div className="name" style={{ marginTop: "auto" }}>{accelerator.name}</div>
                <div className="tagline">{accelerator.summary}</div>
                <div className="built">
                  Built for <b>{accelerator.builtFor}</b>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="a-section">
        <div className="a-wrap">
          <div className="gap-split">
            <article className="gap-col fail">
              <h4>Pain</h4>
              <div className="big" style={{ marginTop: 8 }}>
                The operating drag.
              </div>
              <p style={{ color: "var(--ink-cream-d)", lineHeight: 1.65, marginTop: 18 }}>
                {accelerator.pain}
              </p>
            </article>
            <article className="gap-col win">
              <h4>Promise</h4>
              <div className="big" style={{ marginTop: 8 }}>
                The workflow shift.
              </div>
              <p style={{ color: "var(--ink-cream-d)", lineHeight: 1.65, marginTop: 18 }}>
                {accelerator.promise}
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="a-section">
        <div className="a-wrap">
          <div className="a-section-head">
            <div>
              <span className="a-eyebrow">Proof</span>
              <h2 className="h-section" style={{ marginTop: 18 }}>
                Reusable pattern, enterprise controls.
              </h2>
            </div>
            <p className="lede">{accelerator.proof}</p>
          </div>

          <div className="steps" style={{ marginTop: 44 }}>
            {accelerator.metrics.map((metric) => (
              <div className="step" key={metric.label}>
                <span className="num">{metric.value}</span>
                <h3 style={{ marginTop: 28 }}>{metric.label}</h3>
                <p>Target outcome calibrated against your workflow data, volume, controls, and reviewer feedback.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="a-section">
        <div className="a-wrap">
          <div className="a-section-head">
            <div>
              <span className="a-eyebrow">Rollout</span>
              <h2 className="h-section" style={{ marginTop: 18 }}>
                From fit check to first operating queue.
              </h2>
            </div>
            <p className="lede">
              Accelerators move fastest when the first release is narrow, measurable, and connected to the people who
              own the work.
            </p>
          </div>

          <div className="steps" style={{ marginTop: 44 }}>
            {accelerator.rollout.map((step, index) => (
              <div className="step" key={step}>
                <span className="num">STEP {String(index + 1).padStart(2, "0")}</span>
                <h3 style={{ marginTop: 28 }}>{step}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="a-section">
        <div className="a-wrap">
          <div className="a-card" style={{ padding: 32 }}>
            <div className="a-section-head" style={{ alignItems: "start" }}>
              <div>
                <span className="a-eyebrow">Fit signals</span>
                <h2 className="h-section" style={{ marginTop: 18 }}>
                  When {accelerator.name} is worth a closer look.
                </h2>
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 14 }}>
                {accelerator.signals.map((signal) => (
                  <li key={signal} style={{ display: "flex", gap: 12, color: "var(--ink-cream-d)", lineHeight: 1.5 }}>
                    <span style={{ color: "var(--ember)", marginTop: 2 }}>
                      <CheckIcon />
                    </span>
                    {signal}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="a-section">
        <div className="a-wrap">
          <div className="cta-strip">
            <span className="a-eyebrow">CTA</span>
            <h2 className="h-section" style={{ marginTop: 18, maxWidth: "18ch" }}>
              Start with accelerator fit, not a generic demo.
            </h2>
            <p className="lede" style={{ marginTop: 18, maxWidth: "62ch" }}>
              Bring us the workflow, the data sources, and the operating metric. We will show where {accelerator.name}
              helps, what must be customized, and what should stay human-led.
            </p>
            <Link href="/engage-us" className="a-btn a-btn-primary" style={{ marginTop: 28 }}>
              Engage us <ArrowIcon className="arrow" />
            </Link>
          </div>
        </div>
      </section>
    </DarkShell>
  );
}
