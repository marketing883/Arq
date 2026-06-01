import { ArrowRight } from "./icons";
import { WHY } from "./content";

export default function WhyChooseUs() {
  return (
    <section className="v5-section v5-bg-white" id="why">
      <div className="v5-container">
        <div className="v5-title-block">
          <div>
            <span className="v5-badge">
              <span className="v5-badge-dot" />
              {WHY.eyebrow}
            </span>
          </div>
          <div className="v5-title-main">
            <h2 className="v5-h2">{WHY.heading}</h2>
            <p className="v5-lead">{WHY.sub}</p>
            <a href={WHY.cta.href} className="v5-btn v5-btn-dark v5-why-cta">
              {WHY.cta.label}
              <ArrowRight />
            </a>
          </div>
        </div>

        <div className="v5-why-grid">
          <div className="v5-why-media">
            <img src={WHY.image} alt="" />
          </div>
          <div className="v5-why-stats">
            {WHY.stats.map((s) => (
              <div className="v5-stat-card" key={s.title}>
                <div className="v5-stat-num">{s.num}</div>
                <div className="v5-stat-title">{s.title}</div>
                <p className="v5-body">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
