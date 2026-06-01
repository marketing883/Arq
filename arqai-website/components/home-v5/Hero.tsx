import { ArrowUpRight } from "./icons";
import { HERO, HERO_VIDEO, HERO_POSTER } from "./content";

export default function Hero() {
  return (
    <section className="v5-hero" id="top">
      <video
        className="v5-hero-video"
        autoPlay
        muted
        loop
        playsInline
        poster={HERO_POSTER}
      >
        <source src={HERO_VIDEO} type="video/mp4" />
      </video>
      <div className="v5-hero-veil" />

      <div className="v5-hero-inner">
        <div className="v5-hero-left">
          <h1 className="v5-h1">{HERO.headline}</h1>

          <p className="v5-hero-sub">{HERO.sub}</p>

          <div className="v5-cta-wrap">
            <a href={HERO.cta.href} className="v5-cta">{HERO.cta.label}</a>
            <a href={HERO.cta.href} className="v5-cta-arrow" aria-label={HERO.cta.label}>
              <ArrowUpRight />
            </a>
          </div>
        </div>

        <div className="v5-hero-metrics">
          {HERO.metrics.map((m, i) => (
            <div
              className={`v5-hero-metric${i === HERO.metrics.length - 1 ? " accent" : ""}`}
              key={m.label}
            >
              <span className="v5-metric-glyph" aria-hidden="true">
                <svg viewBox="0 0 16 16" width="16" height="16" fill="none">
                  <rect x="2" y="6" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.3" />
                  <rect x="8.5" y="2.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
                </svg>
              </span>
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
