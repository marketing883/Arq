import { ArrowRight, DocIcon, InsightIcon, ShieldIcon, SparkIcon } from "./icons";
import { FEATURES } from "./content";

function Visual({ kind, avatars }: { kind: string; avatars?: string[] }) {
  if (kind === "chat") {
    return (
      <div className="v5-feature-visual v5-chat">
        <div className="bubble">
          {avatars?.[0] && <img src={avatars[0]} alt="" />}
          Can I send you a proposal via email?
        </div>
        <div className="bubble me">Yes, please.</div>
        <div className="bubble">
          {avatars?.[1] && <img src={avatars[1]} alt="" />}
          Done ✅
        </div>
      </div>
    );
  }
  if (kind === "doc") {
    return (
      <div className="v5-feature-visual v5-docmock">
        <div className="v5-docmock-title">Service Agreement Summary</div>
        <p>
          This agreement is made between NovaTech Solutions (&ldquo;Provider&rdquo;) and
          Skybridge Enterprises (&ldquo;Client&rdquo;) on March 15, 2025. The Provider
          agrees to deliver customized AI-driven data solutions.
        </p>
        <div className="v5-docmock-tag">Key Terms</div>
      </div>
    );
  }
  if (kind === "chart") {
    return (
      <div className="v5-feature-visual v5-chartmock">
        <div className="v5-chartmock-head">Comparison</div>
        <div className="v5-chartmock-row">
          <span>Nov 24</span>
          <div className="bar lime" style={{ width: "92%" }} />
          <strong>$3,642</strong>
        </div>
        <div className="v5-chartmock-row">
          <span>Nov 23</span>
          <div className="bar" style={{ width: "48%" }} />
          <strong>$1,937</strong>
        </div>
      </div>
    );
  }
  if (kind === "generate") {
    return (
      <div className="v5-feature-visual v5-genmock">
        <div className="v5-genmock-chip">
          <span className="v5-genmock-ai">AI</span>
          Generate email copy for…
        </div>
        <button className="v5-genmock-btn" type="button" tabIndex={-1}>
          <SparkIcon width={16} height={16} />
          Generate
        </button>
      </div>
    );
  }
  return (
    <div className="v5-feature-visual v5-shieldmock">
      <ShieldIcon width={56} height={56} />
    </div>
  );
}

const ICONS: Record<string, React.ReactNode> = {
  chat: <SparkIcon />,
  doc: <DocIcon />,
  chart: <InsightIcon />,
  generate: <SparkIcon />,
  shield: <ShieldIcon />,
};

export default function Features() {
  const { cards } = FEATURES;
  return (
    <section className="v5-section v5-bg-grey" id="services">
      <div className="v5-container">
        <div className="v5-title-block">
          <div>
            <span className="v5-badge">
              <span className="v5-badge-dot" />
              {FEATURES.eyebrow}
            </span>
          </div>
          <div className="v5-title-main">
            <h2 className="v5-h2">{FEATURES.heading}</h2>
            <p className="v5-lead">{FEATURES.sub}</p>
          </div>
        </div>

        <div className="v5-features-grid">
          {cards.map((c) => (
            <article className="v5-feature-card" key={c.title}>
              <Visual kind={c.kind} avatars={(c as { avatars?: string[] }).avatars} />
              <div className="v5-feature-icon">{ICONS[c.kind]}</div>
              <h3 className="v5-h3">{c.title}</h3>
              <p className="v5-body">{c.body}</p>
            </article>
          ))}
        </div>

        <div className="v5-features-foot">
          <a href={FEATURES.cta.href} className="v5-btn v5-btn-dark">
            {FEATURES.cta.label}
            <ArrowRight />
          </a>
        </div>
      </div>
    </section>
  );
}
