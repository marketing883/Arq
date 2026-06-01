import { ArrowRight } from "./icons";
import { HERO, HERO_VIDEO } from "./content";

export default function Hero() {
  return (
    <section className="v5-hero" id="top">
      <video className="v5-hero-video" autoPlay muted loop playsInline>
        <source src={HERO_VIDEO} type="video/mp4" />
      </video>
      <div className="v5-hero-overlay" />

      <div className="v5-hero-inner">
        <div className="v5-hero-left">
          <span className="v5-hero-eyebrow">
            <span className="v5-avatar-stack">
              {HERO.trustAvatars.map((src, i) => (
                <img key={i} src={src} alt="" className="v5-avatar-stack-img" />
              ))}
            </span>
            {HERO.trustLabel}
          </span>

          <h1 className="v5-h1">{HERO.headline}</h1>

          <p className="v5-hero-sub">{HERO.sub}</p>

          <div className="v5-hero-actions">
            <a href={HERO.cta.href} className="v5-btn v5-btn-primary">
              {HERO.cta.label}
              <ArrowRight />
            </a>
          </div>
        </div>

        <div className="v5-hero-metrics">
          {HERO.metrics.map((m) => (
            <div className="v5-metric-card" key={m.label}>
              <div className="v5-metric-num">
                {m.num}
                <span>{m.suffix}</span>
              </div>
              <div className="v5-metric-label">{m.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
