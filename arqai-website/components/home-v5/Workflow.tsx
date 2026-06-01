import { PROCESS } from "./content";

export default function Workflow() {
  return (
    <section className="v5-section v5-bg-grey" id="process">
      <div className="v5-container">
        <div className="v5-title-block">
          <div>
            <span className="v5-badge">
              <span className="v5-badge-dot" />
              {PROCESS.eyebrow}
            </span>
          </div>
          <div className="v5-title-main">
            <h2 className="v5-h2">{PROCESS.heading}</h2>
            <p className="v5-lead">{PROCESS.sub}</p>
          </div>
        </div>

        <div className="v5-steps">
          {PROCESS.steps.map((s) => (
            <div className="v5-step-card" key={s.num}>
              <div className="v5-step-media">
                <img src={s.image} alt={s.title} />
                <span className="v5-step-num">{s.num}</span>
              </div>
              <h3 className="v5-h3">{s.title}</h3>
              <p className="v5-body">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
