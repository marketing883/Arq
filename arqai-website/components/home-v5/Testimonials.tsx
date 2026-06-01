import { Star } from "./icons";
import { TESTIMONIALS } from "./content";

export default function Testimonials() {
  return (
    <section className="v5-section v5-bg-grey" id="testimonials">
      <div className="v5-container">
        <div className="v5-title-block">
          <div>
            <span className="v5-badge">
              <span className="v5-badge-dot" />
              {TESTIMONIALS.eyebrow}
            </span>
          </div>
          <div className="v5-title-main">
            <h2 className="v5-h2">{TESTIMONIALS.heading}</h2>
            <p className="v5-lead">{TESTIMONIALS.sub}</p>
          </div>
        </div>

        <div className="v5-testi-grid">
          {TESTIMONIALS.items.map((t, i) => (
            <article
              className={`v5-testi-card${i === 0 ? " feature" : ""}`}
              key={t.name}
            >
              <div className="v5-stars">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} />
                ))}
              </div>
              <p className="v5-testi-quote">{t.quote}</p>

              {t.stats.length > 0 && (
                <div className="v5-testi-stats">
                  {t.stats.map((st) => (
                    <div key={st.label}>
                      <strong>{st.num}</strong>
                      <span>{st.label}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="v5-testi-author">
                <img className="v5-testi-avatar" src={t.avatar} alt={t.name} />
                <span>
                  <span className="v5-testi-name">{t.name}</span>
                  <br />
                  <span className="v5-testi-role">{t.role}</span>
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
