import { ArrowRight, Star } from "./icons";
import { HERO } from "./content";

export default function Hero() {
  return (
    <section className="v5-hero" id="top">
      <div className="v5-hero-inner">
        <div className="v5-hero-left">
          <span className="v5-trust">
            <span className="v5-trust-avatars">
              {HERO.trustAvatars.map((src, i) => (
                <img key={i} src={src} alt="" />
              ))}
            </span>
            <span className="v5-trust-meta">
              <span className="v5-stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} />
                ))}
              </span>
              <span className="v5-trust-label">{HERO.trustLabel}</span>
            </span>
          </span>

          <h1 className="v5-h1">{HERO.headline}</h1>

          <p className="v5-hero-sub">{HERO.sub}</p>

          <a href={HERO.cta.href} className="v5-btn v5-btn-dark">
            {HERO.cta.label}
            <ArrowRight />
          </a>
        </div>

        <div className="v5-hero-metrics">
          {HERO.metrics.map((m, i) => (
            <div
              className={`v5-hero-metric${i === HERO.metrics.length - 1 ? " accent" : ""}`}
              key={m.label}
            >
              <div className="v5-hero-metric-num">
                {m.num}
                <span>{m.suffix}</span>
              </div>
              <div className="v5-hero-metric-label">{m.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
