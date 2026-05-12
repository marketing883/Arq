import Link from "next/link";
import { serviceOfferings } from "@/lib/data/services";
import { SiteNav } from "@/components/site-dark/SiteNav";
import { SiteFooter } from "@/components/site-dark/SiteFooter";

function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={className}>
      <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function ServicesPage() {
  return (
    <div className="arq-dark min-h-screen">
      <SiteNav />
      <main>
        <section className="a-section" style={{ paddingTop: "clamp(140px, 16vh, 210px)" }}>
          <div className="a-wrap">
            <span className="a-eyebrow">Services</span>
            <h1 className="h-display" style={{ marginTop: 18, maxWidth: "13ch" }}>We build the operating layer around enterprise AI.</h1>
            <p className="lede" style={{ marginTop: 28 }}>
              ArqAI Labs is not a chatbot shop. We design, integrate, govern, and operationalise AI systems that touch real workflows and leave a reliable evidence trail.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 34 }}>
              <Link href="/engage-us" className="a-btn a-btn-primary">Start a working session <ArrowIcon className="arrow" /></Link>
              <Link href="/how-we-work" className="a-btn a-btn-ghost">See our process</Link>
            </div>
          </div>
        </section>

        <section className="a-section">
          <div className="a-wrap">
            <div className="a-section-head">
              <div>
                <span className="a-eyebrow">Capabilities</span>
                <h2 className="h-section" style={{ marginTop: 18 }}>From messy workflow to governed AI system.</h2>
              </div>
              <p className="lede">Every engagement combines advisory, architecture, build, integration, control design, and adoption. Open the service closest to your current constraint.</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
              {serviceOfferings.map((service, index) => (
                <Link className="a-card" href={`/services/${service.slug}`} key={service.slug}>
                  <span className="a-tag">0{index + 1}</span>
                  <h3 style={{ marginTop: 20, fontSize: 26 }}>{service.shortName}</h3>
                  <p style={{ color: "var(--ink-cream-d)", fontSize: 15, lineHeight: 1.6 }}>{service.proof}</p>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "var(--ember)", marginTop: 22, fontSize: 14 }}>
                    Open service <ArrowIcon className="arrow" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="a-section final-cta-band">
          <div className="a-wrap">
            <span className="a-eyebrow">Engagement model</span>
            <h2 className="h-section final-cta-h" style={{ marginTop: 18, maxWidth: "18ch" }}>Start narrow. Prove value. Expand with controls intact.</h2>
            <p className="lede" style={{ marginTop: 18 }}>We prefer a concrete workflow slice over an abstract AI roadmap. Bring one process, one pain point, and one measurable outcome.</p>
            <Link href="/engage-us" className="a-btn a-btn-primary" style={{ marginTop: 28 }}>Engage us <ArrowIcon className="arrow" /></Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
