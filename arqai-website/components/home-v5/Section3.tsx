import Link from "next/link";
import { accelerators } from "@/lib/data/accelerators";

type IconProps = { id: string };

function AccIcon({ id }: IconProps) {
  const gradId = `g-${id}`;
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="56" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="55%" stopColor="#ec4899" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
      </defs>
      {iconPath(id, gradId)}
    </svg>
  );
}

function iconPath(id: string, g: string) {
  const stroke = `url(#${g})`;
  switch (id) {
    case "veyra":
      return (
        <g stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <circle cx="28" cy="28" r="6" />
          <path d="M28 4v8M28 44v8M4 28h8M44 28h8M11 11l5.6 5.6M39.4 39.4l5.6 5.6M11 45l5.6-5.6M39.4 16.6L45 11" />
        </g>
      );
    case "luma":
      return (
        <g stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <path d="M10 16h36v22a4 4 0 0 1-4 4H22l-8 6V20a4 4 0 0 1 4-4z" />
          <path d="M20 28h16M20 22h10" />
        </g>
      );
    case "sentra":
      return (
        <g stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <path d="M28 6l5.5 11 12 1.8-8.7 8.5 2 12L28 33.6 17.2 39.3l2-12L10.5 18.8l12-1.8z" />
        </g>
      );
    case "nuvia":
      return (
        <g stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <circle cx="20" cy="20" r="6" />
          <circle cx="38" cy="24" r="5" />
          <path d="M8 48c0-7 6-12 12-12s12 5 12 12M30 48c0-5 4-9 9-9s9 4 9 9" />
        </g>
      );
    case "kyra":
      return (
        <g stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <circle cx="28" cy="28" r="4" />
          <circle cx="8" cy="14" r="3" />
          <circle cx="48" cy="14" r="3" />
          <circle cx="8" cy="42" r="3" />
          <circle cx="48" cy="42" r="3" />
          <path d="M11 16l13 9M45 16L32 25M11 40l13-8M45 40L32 32" />
        </g>
      );
    case "orbis":
      return (
        <g stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <path d="M8 38l10 6 10-6V22L18 16 8 22z" />
          <path d="M28 38l10 6 10-6V22l-10-6-10 6z" />
          <path d="M18 16V8M38 16V8" />
        </g>
      );
    case "astra":
      return (
        <g stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <rect x="6" y="14" width="20" height="14" rx="2" />
          <rect x="30" y="14" width="20" height="14" rx="2" />
          <rect x="18" y="32" width="20" height="14" rx="2" />
          <path d="M16 28v4M40 28v4" />
        </g>
      );
    case "vantaq":
      return (
        <g stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <path d="M28 6l18 6v12c0 12-7.5 20-18 24-10.5-4-18-12-18-24V12z" />
          <path d="M21 28l5 5 9-11" />
        </g>
      );
    default:
      return (
        <g stroke={stroke} strokeWidth="2" fill="none">
          <circle cx="28" cy="28" r="14" />
        </g>
      );
  }
}

export default function Section3() {
  return (
    <section className="v5-section v5-section-3">
      <div className="v5-section-3-wrap">
        <div className="v5-section-3-eyebrow-row">
          <span className="v5-section-3-eyebrow">Amplify the competitive advantages of AI</span>
        </div>

        <h2 className="v5-section-3-h2">
          Built for your industry.
          <br />
          Adapted to your operation.
        </h2>

        <div className="v5-section-3-intro">
          <p>
            Our accelerators encode deep domain knowledge for the workflows that matter most in
            your industry. They are not off-the-shelf tools. They are the starting point every
            ArqAI Labs engagement builds from. Adapted to your data, your systems, and the way
            your operation actually runs.
          </p>
          <Link href="/accelerators" className="v5-section-3-cta">
            See All Accelerators
          </Link>
        </div>

        <div className="v5-section-3-grid">
          {accelerators.map((a) => (
            <article key={a.id} className="v5-acc-card">
              <h3 className="v5-acc-name">{a.name.toUpperCase()}</h3>
              <p className="v5-acc-category">{a.category}</p>
              <p className="v5-acc-summary">{a.summary}</p>
              <p className="v5-acc-built-for">
                <strong>Built for:</strong> {a.builtFor}
              </p>
              <div className="v5-acc-icon">
                <AccIcon id={a.id} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
