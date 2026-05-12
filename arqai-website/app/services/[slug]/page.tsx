import Link from "next/link";
import { notFound } from "next/navigation";
import { getServiceOffering, serviceOfferings } from "@/lib/data/services";
import { SiteNav } from "@/components/site-dark/SiteNav";
import { SiteFooter } from "@/components/site-dark/SiteFooter";

function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={className}>
      <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function generateStaticParams() {
  return serviceOfferings.map((service) => ({ slug: service.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const service = getServiceOffering(params.slug);
  return {
    title: service ? `${service.name} | ArqAI Labs Services` : "Service | ArqAI Labs",
    description: service?.subhead,
  };
}

export default function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const service = getServiceOffering(params.slug);
  if (!service) notFound();

  return (
    <div className="arq-dark min-h-screen">
      <SiteNav />
      <main>
        <section className="a-section" style={{ paddingTop: "clamp(140px, 16vh, 210px)" }}>
          <div className="a-wrap">
            <Link href="/services" className="a-eyebrow">{service.eyebrow}</Link>
            <h1 className="h-display" style={{ marginTop: 18, maxWidth: "13ch" }}>{service.headline}</h1>
            <p className="lede" style={{ marginTop: 26 }}>{service.subhead}</p>
            <p className="lede" style={{ marginTop: 16, color: "var(--ink-cream)" }}>{service.proof}</p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 34 }}>
              <Link href="/engage-us" className="a-btn a-btn-primary">Book a working session <ArrowIcon className="arrow" /></Link>
              <Link href="/accelerators" className="a-btn a-btn-ghost">Compare accelerators</Link>
            </div>
          </div>
        </section>

        <section className="a-section">
          <div className="a-wrap" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 18 }}>
            <article className="a-card">
              <span className="a-eyebrow">The issue</span>
              <h2 className="h-section" style={{ marginTop: 18 }}>Why this usually stalls.</h2>
              <p className="lede" style={{ marginTop: 18 }}>{service.problem}</p>
            </article>
            <article className="a-card">
              <span className="a-eyebrow">What we change</span>
              <h2 className="h-section" style={{ marginTop: 18 }}>The production path.</h2>
              <p className="lede" style={{ marginTop: 18 }}>{service.promise}</p>
            </article>
          </div>
        </section>

        <section className="a-section">
          <div className="a-wrap">
            <div className="a-section-head">
              <div>
                <span className="a-eyebrow">Outcomes</span>
                <h2 className="h-section" style={{ marginTop: 18 }}>What the buyer can measure.</h2>
              </div>
              <p className="lede">The copy is intentionally operational: each service is framed around what changes in the workflow, not what the technology is called.</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
              {service.outcomes.map((outcome) => (
                <article className="a-card" key={outcome.label}>
                  <div style={{ color: "var(--ember)", fontSize: "clamp(40px, 5vw, 64px)", fontFamily: "var(--display)", lineHeight: 1 }}>{outcome.metric}</div>
                  <h3 style={{ marginTop: 18, fontSize: 22 }}>{outcome.label}</h3>
                  <p style={{ color: "var(--ink-cream-d)", fontSize: 14, lineHeight: 1.6 }}>{outcome.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="a-section">
          <div className="a-wrap" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 18 }}>
            <article className="a-card">
              <span className="a-eyebrow">Deliverables</span>
              <div style={{ display: "grid", gap: 12, marginTop: 24 }}>
                {service.deliverables.map((item) => <div className="a-pill" key={item}>{item}</div>)}
              </div>
            </article>
            <article className="a-card">
              <span className="a-eyebrow">Signals</span>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 24 }}>
                {service.signals.map((item) => <span className="a-tag" key={item}>{item}</span>)}
              </div>
            </article>
            <article className="a-card">
              <span className="a-eyebrow">Best fit</span>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 24 }}>
                {service.bestFit.map((item) => <span className="a-tag" key={item}>{item}</span>)}
              </div>
            </article>
          </div>
        </section>

        <section className="a-section final-cta-band">
          <div className="a-wrap">
            <span className="a-eyebrow">Next step</span>
            <h2 className="h-section final-cta-h" style={{ marginTop: 18, maxWidth: "18ch" }}>{service.ctaHeadline}</h2>
            <p className="lede" style={{ marginTop: 18 }}>{service.ctaBody}</p>
            <Link href="/engage-us" className="a-btn a-btn-primary" style={{ marginTop: 28 }}>Engage us <ArrowIcon className="arrow" /></Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
