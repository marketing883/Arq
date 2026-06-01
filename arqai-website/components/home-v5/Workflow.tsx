const STEPS = [
  {
    num: "01",
    title: "Discovery & Strategy",
    body:
      "We map your operation, find the highest-value workflows, and align on measurable outcomes before a line of code is written.",
  },
  {
    num: "02",
    title: "Build & Integrate",
    body:
      "Vertical accelerators give every engagement a head start. We build around how your operation actually works and connect to your systems.",
  },
  {
    num: "03",
    title: "Deploy to Production",
    body:
      "No endless pilots. We ship to production with governance, monitoring, and human-in-the-loop controls from day one.",
  },
  {
    num: "04",
    title: "Measure & Scale",
    body:
      "We attach proof to everything we deploy, track impact against the targets we set, and expand to the next workflow.",
  },
];

export default function Workflow() {
  return (
    <section className="v5-section v5-bg-grey" id="process">
      <div className="v5-container">
        <div className="v5-title-block">
          <div>
            <span className="v5-badge">
              <span className="v5-badge-dot" />
              Process
            </span>
          </div>
          <div className="v5-title-main">
            <h2 className="v5-h2">From Strategy to AI Success</h2>
            <p className="v5-lead">
              We streamline the AI adoption journey with a clear, proven process —
              designed to ensure alignment, speed, and measurable outcomes.
            </p>
          </div>
        </div>

        <div className="v5-steps">
          {STEPS.map((s) => (
            <div className="v5-step-card" key={s.num}>
              <span className="v5-step-num">{s.num}</span>
              <h3 className="v5-h3">{s.title}</h3>
              <p className="v5-body">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
