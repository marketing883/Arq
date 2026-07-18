import { PROOF } from "./content";
import { ArrowRight } from "./icons";

/**
 * The homepage proof section. One real engagement, summarized — the full
 * narrative lives at /case-studies/tpa-blind-spot-assessment. Replaces the
 * Framer-template testimonials that shipped with the original design.
 */
export default function ProofSpotlight() {
  return (
    <section className="v5-section v5-bg-white" id="proof">
      <div className="v5-container">
        <div className="v5-title-block">
          <div>
            <span className="v5-badge">
              <span className="v5-badge-dot" />
              {PROOF.eyebrow}
            </span>
          </div>
          <div className="v5-title-main">
            <h2 className="v5-h2">{PROOF.heading}</h2>
            <p className="v5-lead">{PROOF.sub}</p>
          </div>
        </div>

        <div className="v5-grid v5-grid-3" style={{ marginTop: 32 }}>
          {PROOF.stats.map((stat) => (
            <div className="v5-card" key={stat.label}>
              <strong
                style={{
                  display: "block",
                  fontSize: 40,
                  lineHeight: 1.1,
                  color: "var(--v5-ink)",
                  letterSpacing: "-0.02em",
                }}
              >
                {stat.num}
              </strong>
              <p className="v5-body" style={{ marginTop: 10 }}>{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="v5-split" style={{ marginTop: 40, alignItems: "center" }}>
          <p className="v5-body" style={{ maxWidth: 720 }}>{PROOF.body}</p>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <a href={PROOF.cta.href} className="v5-btn v5-btn-dark">
              {PROOF.cta.label}
              <ArrowRight />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
