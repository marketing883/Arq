type IconProps = { id: string };

function FeatureIcon({ id }: IconProps) {
  const gradId = `g-feat-${id}`;
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="55%" stopColor="#f472b6" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
      </defs>
      {featurePath(id, gradId)}
    </svg>
  );
}

function featurePath(id: string, g: string) {
  const stroke = `url(#${g})`;
  switch (id) {
    case "industry":
      return (
        <g stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <rect x="12" y="14" width="20" height="20" rx="3" />
          <circle cx="18" cy="22" r="1.5" />
          <circle cx="26" cy="22" r="1.5" />
          <path d="M16 28h12M22 14v-4M16 10h12" />
        </g>
      );
    case "run":
      return (
        <g stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <circle cx="22" cy="22" r="12" />
          <path d="M22 14v8l5 3" />
          <path d="M10 22h4M30 22h4" />
        </g>
      );
    case "governance":
      return (
        <g stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <path d="M22 8l12 4v10c0 7-5 12-12 14-7-2-12-7-12-14V12z" />
          <path d="M17 22l4 4 7-8" />
        </g>
      );
    default:
      return null;
  }
}

const FEATURES = [
  {
    id: "industry",
    num: "(1)",
    title: "Industry knowledge",
    body:
      "We have spent years building AI for healthcare payers, financial institutions, and retailers. When we start an engagement, we already know the workflows, the compliance constraints, and the edge cases your operation runs on. That is not something a platform ships with.",
  },
  {
    id: "run",
    num: "(2)",
    title: "We build it. We run it.",
    body:
      "Most AI implementations end at go-live. We stay. We monitor, tune, and improve every workflow in production so it keeps performing as your business, your data, and your policies change. You are not handed a system and left to manage it alone.",
  },
  {
    id: "governance",
    num: "(3)",
    title: "Governance & Compliance",
    body:
      "Every system is built with policy checks, approval flows, audit trails, and human review points from day one. Governance is not added after deployment. It is built into how the AI operates before a single action is taken.",
  },
];

export default function Section4() {
  return (
    <section className="v5-section v5-section-4">
      <div className="v5-section-4-wrap">
        <div className="v5-section-4-card">
          {/* Corner notches */}
          <span className="v5-card-notch tl" aria-hidden="true" />
          <span className="v5-card-notch tr" aria-hidden="true" />
          <span className="v5-card-notch bl" aria-hidden="true" />
          <span className="v5-card-notch br" aria-hidden="true" />

          <div className="v5-section-4-head">
            <span className="v5-section-4-eyebrow">Our Philosophy</span>
            <h2 className="v5-section-4-h2">
              Deep industry knowledge.
              <br />
              Production delivery. Operations
              <br />
              managed after launch.
            </h2>
          </div>

          <div className="v5-section-4-grid">
            <div className="v5-section-4-image">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/img/v5/about-image.jpg"
                alt="ArqAI Labs philosophy visual"
                loading="lazy"
              />
              <span className="v5-section-4-image-notch tr" aria-hidden="true" />
              <span className="v5-section-4-image-notch br" aria-hidden="true" />
              <div className="v5-section-4-badge" aria-hidden="true">
                <svg className="v5-section-4-badge-text" viewBox="0 0 120 120">
                  <defs>
                    <path
                      id="badgeCircle"
                      d="M 60, 60 m -48, 0 a 48,48 0 1,1 96,0 a 48,48 0 1,1 -96,0"
                    />
                  </defs>
                  <text fontSize="9" letterSpacing="3" fill="#fff" fontFamily="var(--mono, monospace)">
                    <textPath href="#badgeCircle" startOffset="0">
                      ABOUT US · ABOUT US · ABOUT US ·
                    </textPath>
                  </text>
                </svg>
                <span className="v5-section-4-badge-dot">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M7 17L17 7M9 7h8v8"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>
            </div>

            <ol className="v5-section-4-features">
              {FEATURES.map((f) => (
                <li key={f.id} className="v5-feature">
                  <div className="v5-feature-num">{f.num}</div>
                  <div className="v5-feature-body">
                    <div className="v5-feature-head">
                      <FeatureIcon id={f.id} />
                      <h3>{f.title}</h3>
                    </div>
                    <p>{f.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
