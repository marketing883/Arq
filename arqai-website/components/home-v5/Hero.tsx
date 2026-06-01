import { ArrowRight } from "./icons";

const METRICS = [
  { num: "4", label: "Industry accelerators, production-ready" },
  { num: "100%", label: "Built and run as production AI" },
  { num: "10x", label: "Faster path from pilot to value" },
];

export default function Hero() {
  return (
    <section className="v5-hero" id="top">
      <video
        className="v5-hero-video"
        autoPlay
        muted
        loop
        playsInline
        poster="/img/hero/home-hero-v5.jpg"
      >
        <source src="/video/1920x1080_video.webm" type="video/webm" />
        <source src="/video/1920x1080_video.mp4" type="video/mp4" />
      </video>
      <div className="v5-hero-overlay" />

      <div className="v5-hero-inner">
        <div className="v5-hero-left">
          <span className="v5-hero-eyebrow">
            <span className="v5-badge-dot" />
            Operational AI for regulated enterprises
          </span>

          <h1 className="v5-h1">
            Empower Your Business with <span className="lime">Operational AI</span>
          </h1>

          <p className="v5-hero-sub">
            Accelerate operations, reduce costs, and unlock new growth with AI
            strategies tailored for your organization.
          </p>

          <div className="v5-hero-actions">
            <a href="#contact" className="v5-btn v5-btn-primary">
              Book a Strategy Call
              <ArrowRight />
            </a>
            <a href="#features" className="v5-btn v5-btn-ghost">
              Explore the platform
            </a>
          </div>
        </div>

        <div className="v5-hero-metrics">
          {METRICS.map((m) => (
            <div className="v5-metric-card" key={m.num}>
              <div className="v5-metric-num">{m.num}</div>
              <div className="v5-metric-label">{m.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
