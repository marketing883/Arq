import { ArrowRight, ArrowUpRight } from "./icons";
import { accelerators } from "@/lib/data/accelerators";

const FEATURED = accelerators.slice(0, 4);

export default function Accelerators() {
  return (
    <section className="v5-section v5-accel" id="accelerators">
      <div className="v5-accel-glow" />
      <div className="v5-container">
        <div className="v5-accel-head">
          <div>
            <span className="v5-badge v5-badge-dark">
              <span className="v5-badge-dot" />
              Accelerators
            </span>
            <h2 className="v5-h2">Production accelerators, built for your vertical</h2>
          </div>
          <p className="v5-lead">
            Reusable workflow spines for recurring enterprise problems. They shorten
            discovery, de-risk the build, and bend around the systems, policies, and
            reviewers already in front of you.
          </p>
        </div>

        <div className="v5-accel-grid">
          {FEATURED.map((a, i) => {
            const metric = a.metrics?.[0];
            return (
              <a
                key={a.id}
                href={`/accelerators/${a.id}`}
                className="v5-accel-card"
                style={{ ["--i" as string]: i }}
              >
                <div className="v5-accel-media">
                  <img src={a.image} alt={a.name} loading="lazy" decoding="async" />
                  <span className="v5-accel-cat">{a.category}</span>
                  <span className="v5-accel-go">
                    <ArrowUpRight />
                  </span>
                </div>
                <div className="v5-accel-body">
                  <h3 className="v5-accel-name">{a.name}</h3>
                  <p className="v5-accel-tag">{a.tagline}</p>
                  {metric && (
                    <div className="v5-accel-metric">
                      <strong>{metric.value}</strong>
                      <span>{metric.label}</span>
                    </div>
                  )}
                </div>
              </a>
            );
          })}
        </div>

        <div className="v5-accel-foot">
          <span className="v5-accel-count">{accelerators.length} accelerators and counting</span>
          <a href="/accelerators" className="v5-btn v5-btn-primary">
            Explore all accelerators
            <ArrowRight />
          </a>
        </div>
      </div>
    </section>
  );
}
