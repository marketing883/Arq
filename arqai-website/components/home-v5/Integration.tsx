const ROW_ONE = [
  "Snowflake",
  "Databricks",
  "Salesforce",
  "ServiceNow",
  "SAP",
  "Workday",
];
const ROW_TWO = [
  "Microsoft 365",
  "Google Workspace",
  "Slack",
  "Epic",
  "Guidewire",
  "AWS",
];

function Row({ items, reverse }: { items: string[]; reverse?: boolean }) {
  return (
    <div className={`v5-logo-row${reverse ? " reverse" : ""}`}>
      <div className="v5-logo-track">
        {[...items, ...items].map((name, i) => (
          <span className="v5-logo-chip" key={`${name}-${i}`}>
            <span className="dot" />
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Integration() {
  return (
    <section className="v5-section v5-bg-white" id="integrations">
      <div className="v5-container v5-integration-inner">
        <span className="v5-badge">
          <span className="v5-badge-dot" />
          Integrations
        </span>
        <h2 className="v5-h2">Seamlessly Integrate With the Tools You Already Use</h2>
        <p className="v5-lead">
          Connect your existing workflows with powerful AI capabilities. Whether it&rsquo;s
          your data warehouse, core systems, or collaboration tools, our solutions
          integrate effortlessly — keeping your data unified and your operations
          efficient.
        </p>

        <div className="v5-logo-rows">
          <Row items={ROW_ONE} />
          <Row items={ROW_TWO} reverse />
        </div>
      </div>
    </section>
  );
}
