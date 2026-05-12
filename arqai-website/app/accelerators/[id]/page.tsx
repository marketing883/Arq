import Link from "next/link";
import { notFound } from "next/navigation";
import { blueprints } from "@/lib/data/blueprints";
import { SiteNav } from "@/components/site-dark/SiteNav";
import { SiteFooter } from "@/components/site-dark/SiteFooter";

function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={className}>
      <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function acceleratorCopy(blueprint: (typeof blueprints)[number]) {
  const buyer = blueprint.targetBuyers[0] ?? "enterprise operators";
  const industry = blueprint.industries[0] ?? "high-stakes operations";
  return {
    pain: `${buyer} do not need another AI demo. They need a governed way to move ${blueprint.category.toLowerCase()} work through messy data, live systems, approvals, and exceptions without losing the evidence trail.`,
    promise: `${blueprint.name} gives the engagement a starting architecture: reusable agent behavior, integration assumptions, measurement signals, and control patterns that are adapted to your ${industry} environment before production use.`,
    proof: `Use this accelerator when the workflow repeats often enough to justify product speed, but still carries enough operational nuance that a generic SaaS tool will miss the edge cases.`,
    steps: [
      "Map the live workflow, users, systems, policy gates, and failure modes.",
      "Adapt the accelerator to your data boundaries, integrations, and human-review paths.",
      "Prove value on one narrow workflow slice with measurable operational signals.",
      "Expand only after quality, control coverage, and adoption are visible.",
    ],
  };
}

export function generateStaticParams() {
  return blueprints.map((blueprint) => ({ id: blueprint.id }));
}

export function generateMetadata({ params }: { params: { id: string } }) {
  const blueprint = blueprints.find((item) => item.id === params.id);
  return {
    title: blueprint ? `${blueprint.name} Accelerator | ArqAI Labs` : "Accelerator | ArqAI Labs",
    description: blueprint?.description,
  };
}

export default function AcceleratorDetailPage({ params }: { params: { id: string } }) {
  const blueprint = blueprints.find((item) => item.id === params.id);
  if (!blueprint) notFound();
  const copy = acceleratorCopy(blueprint);

  return (
    <div className="arq-dark min-h-screen">
      <SiteNav />
      <main>
        <section className="a-section" style={{ paddingTop: "clamp(140px, 16vh, 210px)" }}>
          <div className="a-wrap">
            <Link href="/accelerators" className="a-eyebrow">Accelerators / {blueprint.category}</Link>
            <h1 className="h-display" style={{ marginTop: 18, maxWidth: "13ch" }}>{blueprint.name}</h1>
            <p className="lede" style={{ marginTop: 26 }}>{blueprint.headline}</p>
            <p className="lede" style={{ marginTop: 16 }}>{blueprint.description}</p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 32 }}>
              <Link href="/engage-us" className="a-btn a-btn-primary">Discuss this accelerator <ArrowIcon className="arrow" /></Link>
              <Link href="/industries" className="a-btn a-btn-ghost">See industries</Link>
            </div>
          </div>
        </section>

        <section className="a-section">
          <div className="a-wrap" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 18 }}>
            <article className="a-card">
              <span className="a-eyebrow">Capabilities</span>
              <div style={{ display: "grid", gap: 12, marginTop: 24 }}>
                {blueprint.features.map((feature) => <div className="a-pill" key={feature}>{feature}</div>)}
              </div>
            </article>
            <article className="a-card">
              <span className="a-eyebrow">Measured signals</span>
              <div style={{ display: "grid", gap: 16, marginTop: 24 }}>
                {blueprint.metrics.map((metric) => (
                  <div key={`${metric.value}-${metric.label}`}>
                    <div style={{ color: "var(--ember)", fontFamily: "var(--display)", fontSize: 38, lineHeight: 1 }}>{metric.value}</div>
                    <p style={{ color: "var(--ink-cream-d)", fontSize: 14, margin: "6px 0 0" }}>{metric.label}</p>
                  </div>
                ))}
              </div>
            </article>
            <article className="a-card">
              <span className="a-eyebrow">Best fit</span>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 24 }}>
                {blueprint.targetBuyers.map((buyer) => <span className="a-tag" key={buyer}>{buyer}</span>)}
                {blueprint.industries.map((industry) => <span className="a-tag" key={industry}>{industry}</span>)}
              </div>
            </article>
          </div>
        </section>

        <section className="a-section">
          <div className="a-wrap" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 18 }}>
            <article className="a-card">
              <span className="a-eyebrow">Why it matters</span>
              <h2 className="h-section" style={{ marginTop: 18 }}>The pain behind the pattern.</h2>
              <p className="lede" style={{ marginTop: 18 }}>{copy.pain}</p>
            </article>
            <article className="a-card">
              <span className="a-eyebrow">Conversion story</span>
              <h2 className="h-section" style={{ marginTop: 18 }}>Speed without pretending it is generic.</h2>
              <p className="lede" style={{ marginTop: 18 }}>{copy.promise}</p>
              <p className="lede" style={{ marginTop: 16, color: "var(--ink-cream)" }}>{copy.proof}</p>
            </article>
          </div>
        </section>

        <section className="a-section">
          <div className="a-wrap">
            <div className="a-section-head">
              <div>
                <span className="a-eyebrow">Rollout</span>
                <h2 className="h-section" style={{ marginTop: 18 }}>How this becomes production work.</h2>
              </div>
              <p className="lede">The accelerator is the start. The conversion path is the adaptation work around your workflow, controls, integrations, and users.</p>
            </div>
            <div className="steps">
              {copy.steps.map((step, index) => (
                <div className="step" key={step}>
                  <span className="num">STEP 0{index + 1}</span>
                  <h3>{step}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="a-section final-cta-band">
          <div className="a-wrap">
            <span className="a-eyebrow">Delivery path</span>
            <h2 className="h-section final-cta-h" style={{ marginTop: 18, maxWidth: "18ch" }}>From blueprint to production-grade operating system.</h2>
            <p className="lede" style={{ marginTop: 18 }}>We start by mapping the live workflow, controls, data contracts, and human approvals. Then we adapt the accelerator and prove value on a narrow slice before broader rollout.</p>
            <Link href="/engage-us" className="a-btn a-btn-primary" style={{ marginTop: 28 }}>Start with this pattern <ArrowIcon className="arrow" /></Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
