import { INTEGRATION } from "./content";

function ToolCard({ name, color, body }: { name: string; color: string; body: string }) {
  return (
    <div className="v5-tool-card">
      <span className="v5-tool-icon" style={{ background: color }}>
        {name.charAt(0)}
      </span>
      <div>
        <h3 className="v5-tool-name">{name}</h3>
        <p className="v5-body">{body}</p>
      </div>
    </div>
  );
}

function Row({ items, reverse }: { items: typeof INTEGRATION.tools; reverse?: boolean }) {
  return (
    <div className={`v5-tools-row${reverse ? " reverse" : ""}`}>
      <div className="v5-tools-track">
        {[...items, ...items].map((t, i) => (
          <ToolCard key={`${t.name}-${i}`} {...t} />
        ))}
      </div>
    </div>
  );
}

export default function Integration() {
  const half = Math.ceil(INTEGRATION.tools.length / 2);
  const rowOne = INTEGRATION.tools.slice(0, half);
  const rowTwo = INTEGRATION.tools.slice(half);
  return (
    <section className="v5-section v5-bg-white" id="integrations">
      <div className="v5-integration-head">
        <span className="v5-badge">
          <span className="v5-badge-dot" />
          {INTEGRATION.eyebrow}
        </span>
        <h2 className="v5-h2">{INTEGRATION.heading}</h2>
        <p className="v5-lead">{INTEGRATION.sub}</p>
      </div>

      <div className="v5-tools-rows">
        <Row items={rowOne} />
        <Row items={rowTwo} reverse />
      </div>
    </section>
  );
}
