import { PROCESS } from "./content";

export default function Workflow() {
  return (
    <section className="v5-section v5-bg-grey" id="process">
      <div className="v5-container v5-process">
        {/* Left column — pinned while the steps scroll past */}
        <div className="v5-process-left">
          <span className="v5-badge">
            <span className="v5-badge-dot" />
            {PROCESS.eyebrow}
          </span>
          <h2 className="v5-h2">{PROCESS.heading}</h2>
          <p className="v5-lead">{PROCESS.sub}</p>
        </div>

        {/* Right column — steps revealed one by one on scroll */}
        <div className="v5-process-right">
          {PROCESS.steps.map((s) => (
            <article className="v5-process-step" key={s.num}>
              <span className="v5-process-num">{s.num}</span>
              <div className="v5-process-step-main">
                <h3 className="v5-h3">{s.title}</h3>
                <p className="v5-body">{s.body}</p>
                <div className="v5-process-step-media">
                  <img src={s.image} alt={s.title} loading="lazy" decoding="async" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
