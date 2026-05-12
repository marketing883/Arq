import Link from "next/link";
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

const statusLabel = {
  available: "Live accelerator",
  pilot: "Pilot-ready",
  blueprint: "Blueprint",
  roadmap: "Roadmap",
};

export default function AcceleratorsPage() {
  return (
    <div className="arq-dark min-h-screen">
      <SiteNav />
      <main>
        <section className="a-section" style={{ paddingTop: "clamp(140px, 16vh, 210px)" }}>
          <div className="a-wrap">
            <span className="a-eyebrow">Accelerators</span>
            <h1 className="h-display" style={{ marginTop: 18, maxWidth: "13ch" }}>
              Reusable agentic patterns. <em>Customised</em> to your stack.
            </h1>
            <p className="lede" style={{ marginTop: 28 }}>
              Accelerators are the repeatable parts of our work: agent blueprints, control scaffolds, integration patterns, evaluation harnesses, and workflow primitives that shorten time-to-value without pretending every enterprise works the same way.
            </p>
          </div>
        </section>

        <section className="a-section">
          <div className="a-wrap">
            <div className="a-section-head">
              <div>
                <span className="a-eyebrow">Catalog</span>
                <h2 className="h-section" style={{ marginTop: 18 }}>Built to start <em>faster</em>, not generic.</h2>
              </div>
              <p className="lede">Each accelerator can become a bespoke build, a proof of value, or a productised deployment when the workflow matches.</p>
            </div>
            <div className="acc-grid">
              {blueprints.map((bp) => (
                <Link className="acc-card" href={`/accelerators/${bp.id}`} key={bp.id}>
                  <div className="acc-content">
                    <span className="a-tag">{bp.category}</span>
                    <div className="name" style={{ marginTop: 18 }}>{bp.name}</div>
                    <div className="tagline">{bp.headline}</div>
                    <p className="desc" style={{ opacity: 1, maxHeight: "none" }}>{bp.description}</p>
                    <div className="built"><b>{statusLabel[bp.status]}</b></div>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "var(--ember)", fontSize: 13, marginTop: 18 }}>View blueprint <ArrowIcon className="arrow" /></span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="a-section final-cta-band">
          <div className="a-wrap">
            <span className="a-eyebrow">Implementation model</span>
            <h2 className="h-section final-cta-h" style={{ marginTop: 18, maxWidth: "18ch" }}>Every accelerator ships with governance, integration, and adoption work.</h2>
            <p className="lede" style={{ marginTop: 18 }}>We adapt the accelerator to your data boundaries, approval paths, legacy systems, and controls before it touches production operations.</p>
            <Link href="/engage-us" className="a-btn a-btn-primary" style={{ marginTop: 28 }}>Map an accelerator <ArrowIcon className="arrow" /></Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
