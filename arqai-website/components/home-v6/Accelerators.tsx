import { ArrowRight, ArrowUpRight } from "../home-v5/icons";
import { getAccelerator } from "@/lib/data/accelerators";
import { ACCELERATORS } from "./content";

export default function Accelerators() {
  return (
    <section className="v5-section v5-accel" id="accelerators">
      <div className="v5-accel-glow" />
      <div className="v5-container">
        <div className="v5-accel-head">
          <div>
            <span className="v5-badge v5-badge-dark">
              <span className="v5-badge-dot" />
              {ACCELERATORS.eyebrow}
            </span>
            <h2 className="v5-h2">{ACCELERATORS.heading}</h2>
          </div>
          <p className="v5-lead">{ACCELERATORS.sub}</p>
        </div>

        <div className="v5-accel-grid v6-accel-grid">
          {ACCELERATORS.flagships.map((f, i) => {
            const a = getAccelerator(f.id);
            if (!a) return null;
            return (
              <a
                key={f.id}
                href={`/accelerators/${f.id}`}
                className="v5-accel-card"
                style={{ ["--i" as string]: i }}
              >
                <div className="v5-accel-media">
                  <img src={a.image} alt={a.name} loading="lazy" decoding="async" />
                  <span className="v5-accel-cat">{f.track}</span>
                  <span className="v5-accel-go">
                    <ArrowUpRight />
                  </span>
                </div>
                <div className="v5-accel-body">
                  <h3 className="v5-accel-name">{a.name}</h3>
                  <p className="v6-accel-cat-line">{a.category}</p>
                  <p className="v5-accel-tag">{f.blurb}</p>
                  <div className="v5-accel-metric">
                    <strong>{f.stat.value}</strong>
                    <span>{f.stat.label}</span>
                  </div>
                </div>
              </a>
            );
          })}
        </div>

        <div className="v5-accel-foot">
          <span className="v5-accel-count">{ACCELERATORS.closing}</span>
          <a href={ACCELERATORS.cta.href} className="v5-btn v5-btn-primary">
            {ACCELERATORS.cta.label}
            <ArrowRight />
          </a>
        </div>
      </div>
    </section>
  );
}
