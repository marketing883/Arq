const PARTNERS = [
  "Healthcare Payers",
  "TPAs",
  "Retail",
  "Banking",
  "Insurance",
  "Capital Markets",
];

const STATS = [
  {
    num: "120+",
    title: "Fraud Patterns Caught",
    body:
      "Veyra detects 120+ TPA-specific fraud patterns that generic payer tools were never designed to find.",
  },
  {
    num: "70%",
    title: "Less Manual Review",
    body:
      "Teams cut hands-on review time by routing the routine to AI and reserving human judgment for the exceptions.",
  },
  {
    num: "$3.2M",
    title: "Undetected Waste Found",
    body:
      "Identified in a single Blind Spot Assessment for a mid-size TPA whose current vendor rated them fully compliant.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="v5-section v5-bg-white" id="why">
      <div className="v5-container">
        <div className="v5-title-block">
          <div>
            <span className="v5-badge">
              <span className="v5-badge-dot" />
              Why ArqAI
            </span>
          </div>
          <div className="v5-title-main">
            <h2 className="v5-h2">
              We know your industry. We build for your operation. We stay after
              launch.
            </h2>
            <p className="v5-lead">
              Three things separate us from platforms and consulting firms. We go deep
              on one vertical at a time, we ship to production, and we attach proof to
              everything we deploy.
            </p>
          </div>
        </div>

        <div className="v5-ticker" aria-hidden="true">
          <div className="v5-ticker-track">
            {[...PARTNERS, ...PARTNERS].map((p, i) => (
              <span className="v5-ticker-item" key={i}>
                <span className="v5-badge-dot" style={{ background: "#c0de49" }} />
                {p}
              </span>
            ))}
          </div>
        </div>

        <div className="v5-why-stats">
          {STATS.map((s) => (
            <div className="v5-stat-card" key={s.title}>
              <div className="v5-stat-num">{s.num}</div>
              <div className="v5-stat-title">{s.title}</div>
              <p className="v5-body">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
