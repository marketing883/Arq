import { INTEGRATION } from "./content";

export default function Integration() {
  return (
    <section className="v5-section v5-bg-white" id="integrations">
      <div className="v5-container">
        <div className="v5-integration-head">
          <span className="v5-badge">
            <span className="v5-badge-dot" />
            {INTEGRATION.eyebrow}
          </span>
          <h2 className="v5-h2">{INTEGRATION.heading}</h2>
          <p className="v5-lead">{INTEGRATION.sub}</p>
        </div>

        <div className="v5-tools-grid">
          {INTEGRATION.tools.map((t) => (
            <div className="v5-tool-card" key={t.name}>
              <span className="v5-tool-icon" style={{ background: t.color }}>
                {t.name.charAt(0)}
              </span>
              <div>
                <h3 className="v5-tool-name">{t.name}</h3>
                <p className="v5-body">{t.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
