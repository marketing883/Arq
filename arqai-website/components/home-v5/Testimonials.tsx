import { Star } from "./icons";
import { TESTIMONIALS } from "./content";

type Item = (typeof TESTIMONIALS.items)[number];

function Author({ t, light }: { t: Item; light?: boolean }) {
  return (
    <div className={`v5-testi-author${light ? " light" : ""}`}>
      <img src={t.avatar} alt={t.name} />
      <span>
        <span className="v5-testi-name">{t.name}</span>
        <br />
        <span className="v5-testi-role">{t.role}</span>
      </span>
    </div>
  );
}

function Stats({ stats }: { stats: Item["stats"] }) {
  if (!stats.length) return null;
  return (
    <div className="v5-testi-stats">
      {stats.map((s) => (
        <div key={s.label}>
          <strong>{s.num}</strong>
          <span>{s.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const [alex, jenna, marcus, rachel] = TESTIMONIALS.items;
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

        <div className="v5-testi-bento">
          <div className="v5-testi-photo" style={{ backgroundImage: `url(${TESTIMONIALS.image})` }} />

          <article className="v5-testi-card area-jenna">
            <div className="v5-stars">{Array.from({ length: 5 }).map((_, i) => <Star key={i} />)}</div>
            <p className="v5-testi-quote">{jenna.quote}</p>
            <Stats stats={jenna.stats} />
            <Author t={jenna} />
          </article>

          <article className="v5-testi-card feature area-alex">
            <div className="v5-stars">{Array.from({ length: 5 }).map((_, i) => <Star key={i} />)}</div>
            <p className="v5-testi-quote">{alex.quote}</p>
            <Stats stats={alex.stats} />
            <Author t={alex} light />
          </article>

          <article className="v5-testi-card area-marcus">
            <div className="v5-stars">{Array.from({ length: 5 }).map((_, i) => <Star key={i} />)}</div>
            <p className="v5-testi-quote">{marcus.quote}</p>
            <Author t={marcus} />
          </article>

          <article className="v5-testi-card dark area-rachel">
            <div className="v5-stars">{Array.from({ length: 5 }).map((_, i) => <Star key={i} />)}</div>
            <p className="v5-testi-quote">{rachel.quote}</p>
            <Author t={rachel} light />
          </article>
        </div>
      </div>
    </section>
  );
}
