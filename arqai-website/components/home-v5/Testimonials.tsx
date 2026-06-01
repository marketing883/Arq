import { Star } from "./icons";

const TESTIMONIALS = [
  {
    feature: false,
    quote:
      "They didn't sell us a platform — they learned our claims operation and shipped something that actually runs in production.",
    name: "VP, Claims Operations",
    role: "Mid-size TPA",
    initials: "TPA",
  },
  {
    feature: true,
    quote:
      "The Blind Spot Assessment found $3.2M in waste our existing vendor rated fully compliant. That paid for the whole engagement in week one.",
    name: "Chief Financial Officer",
    role: "Healthcare Payer",
    initials: "HP",
  },
  {
    feature: false,
    quote:
      "Every flag comes with proof. Our auditors stopped asking how the model decided and started asking why we didn't do this sooner.",
    name: "Director, Compliance",
    role: "Regional Insurer",
    initials: "RI",
  },
];

export default function Testimonials() {
  return (
    <section className="v5-section v5-bg-grey" id="testimonials">
      <div className="v5-container">
        <div className="v5-title-block">
          <div>
            <span className="v5-badge">
              <span className="v5-badge-dot" />
              Testimonials
            </span>
          </div>
          <div className="v5-title-main">
            <h2 className="v5-h2">Real Results from AI-Powered Success</h2>
            <p className="v5-lead">
              Hear how businesses like yours accelerated growth, optimized workflows,
              and delivered measurable outcomes through our custom AI solutions.
            </p>
          </div>
        </div>

        <div className="v5-testi-grid">
          {TESTIMONIALS.map((t) => (
            <article
              className={`v5-testi-card${t.feature ? " feature" : ""}`}
              key={t.name + t.role}
            >
              <div className="v5-stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} />
                ))}
              </div>
              <p className="v5-testi-quote">&ldquo;{t.quote}&rdquo;</p>
              <div className="v5-testi-author">
                <span className="v5-testi-avatar">{t.initials}</span>
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
