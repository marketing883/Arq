import { PROOF } from "./content";

const TONES = ["dark", "green", "light"] as const;

export default function Proof() {
  return (
    <section className="v5-section v5-bg-grey" id="results">
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

        <div className="v6-proof-grid">
          {PROOF.results.map((r, i) => (
            <article className={`v6-proof-card ${TONES[i % TONES.length]}`} key={r.num}>
              <div className="v6-proof-num">{r.num}</div>
              <p className="v6-proof-body">{r.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
