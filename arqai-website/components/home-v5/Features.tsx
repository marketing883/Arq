import { ArrowRight } from "./icons";
import { FEATURES } from "./content";

type Card = (typeof FEATURES.cards)[number];

function ChatViz({ avatars }: { avatars?: string[] }) {
  return (
    <div className="v5-fviz v5-chat">
      <span className="v5-chat-blur b1" />
      <span className="v5-chat-blur b2" />
      <div className="bubble b-q">Can I send you a proposal via email?</div>
      <div className="bubble b-a">Yes, please.</div>
      <div className="bubble b-done">
        Done <span className="check">✓</span>
      </div>
      <div className="bubble b-pill">Built for the specific decisions</div>
    </div>
  );
}

function DocViz() {
  return (
    <div className="v5-fviz v5-docbr">
      <span className="brk tl" />
      <span className="brk tr" />
      <span className="brk bl" />
      <span className="brk br" />
      <div className="v5-docbr-paper">
        <div className="v5-docbr-title">Service Agreement Summary</div>
        <p>
          This agreement is made between NovaTech Solutions
          (&ldquo;Provider&rdquo;) and Skybridge Enterprises
          (&ldquo;Client&rdquo;) on March 15, 2025. The Provider agrees to
          deliver customized AI-driven data solutions, including predictive
          analytics and automated reporting, to the Client for a duration of 12
          months.
        </p>
        <span className="v5-docbr-key">Key Terms:</span>
      </div>
    </div>
  );
}

function ChartViz() {
  return (
    <div className="v5-fviz v5-chart2">
      <svg className="v5-chart-svg" viewBox="0 0 320 150" preserveAspectRatio="none">
        <path
          d="M0,110 C50,108 70,118 100,112 C140,104 170,96 210,92 C250,88 290,98 320,86"
          fill="none"
          stroke="#c9cdd4"
          strokeWidth="2.5"
        />
        <path
          d="M0,96 C50,92 75,70 110,72 C150,74 175,52 210,54 C250,56 285,40 320,42"
          fill="none"
          stroke="#a9d62b"
          strokeWidth="3"
        />
      </svg>
      <span className="v5-chart-dot" />
      <div className="v5-chart-tip">
        <div className="v5-chart-tip-head">Comparison</div>
        <div className="v5-chart-tip-row">
          <span className="dot lime" /> Nov 24 <strong>$3,642</strong>
        </div>
        <div className="v5-chart-tip-row">
          <span className="dot grey" /> Nov 23 <strong>$1,937</strong>
        </div>
      </div>
    </div>
  );
}

function WaveViz() {
  // symmetric equalizer wave
  const bars = Array.from({ length: 42 }, (_, i) => {
    const t = i / 41;
    const h = 16 + Math.sin(t * Math.PI) * 70 * (0.55 + 0.45 * Math.sin(t * Math.PI * 6));
    return Math.max(8, Math.round(Math.abs(h)));
  });
  return (
    <div className="v5-fviz v5-wave">
      <div className="v5-wave-bars">
        {bars.map((h, i) => (
          <span key={i} style={{ height: `${h}%` }} />
        ))}
      </div>
      <svg className="v5-wave-arrow" viewBox="0 0 24 24" fill="none">
        <path d="M12 4v14M6 13l6 6 6-6" stroke="#a9d62b" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function GenerateViz() {
  return (
    <div className="v5-fviz v5-gen">
      <div className="v5-gen-ai">AI</div>
      <div className="v5-gen-aichip">Encrypted</div>
      <div className="v5-gen-input">
        <span>Generate email copy for...</span>
        <button type="button" tabIndex={-1}>Generate</button>
      </div>
    </div>
  );
}

function Viz({ card }: { card: Card }) {
  switch (card.kind) {
    case "chat":
      return <ChatViz avatars={(card as { avatars?: string[] }).avatars} />;
    case "doc":
      return <DocViz />;
    case "chart":
      return <ChartViz />;
    case "wave":
      return <WaveViz />;
    default:
      return <GenerateViz />;
  }
}

function FeatureCard({ card }: { card: Card }) {
  return (
    <article className="v5-feature-card">
      <Viz card={card} />
      <h3 className="v5-h3">{card.title}</h3>
      <p className="v5-body">{card.body}</p>
    </article>
  );
}

export default function Features() {
  const [workflow, customAgent, accelerator, enterprise, governance] = FEATURES.cards;
  return (
    <section className="v5-section v5-bg-grey" id="services">
      <div className="v5-container">
        <div className="v5-features-head">
          <span className="v5-badge">
            <span className="v5-badge-dot" />
            {FEATURES.eyebrow}
          </span>
          <h2 className="v5-h2">{FEATURES.heading}</h2>
        </div>

        <div className="v5-features-masonry">
          <div className="v5-fcol">
            <p className="v5-lead v5-features-sub">{FEATURES.sub}</p>
            <FeatureCard card={accelerator} />
          </div>

          <div className="v5-fcol">
            <FeatureCard card={workflow} />
            <FeatureCard card={enterprise} />
            <FeatureCard card={governance} />
          </div>

          <div className="v5-fcol">
            <FeatureCard card={customAgent} />
            <a className="v5-feature-card v5-seeall" href={FEATURES.cta.href}>
              <div className="v5-checker" />
              <span className="v5-seeall-link">
                {FEATURES.cta.label}
                <ArrowRight />
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
