import Link from "next/link";
import { ACCELERATORS, SERVICES } from "./resolver";

export default function MobileHome() {
  return (
    <div className="v4m-stage">
      <div className="v4m-wrap">
        <span className="v4m-eyebrow">ArqAI Labs</span>
        <h1 className="v4m-h1">
          Production AI, <em>bespoke</em> to your operation.
        </h1>
        <p className="v4m-lede">
          We design, build, deploy, and run agentic AI for operations that don&apos;t fit off-the-shelf. Engineering team, not a consulting practice.
        </p>

        <Link href="/engage-us" className="v4m-cta">Engage us</Link>
        <Link href="/contact" className="v4m-cta-ghost">Talk to us</Link>

        <div className="v4m-section-label">Accelerators</div>
        {ACCELERATORS.map((a) => (
          <Link key={a.id} href={a.href} className="v4m-card">
            <div className="v4m-card-cat">{a.category}</div>
            <div className="v4m-card-top">
              <div className="v4m-card-name">{a.name}</div>
              <span className="v4m-card-arrow">→</span>
            </div>
            <div className="v4m-card-tag">{a.tagline}</div>
          </Link>
        ))}

        <div className="v4m-section-label">Services</div>
        {SERVICES.map((s) => (
          <Link key={s.slug} href={`/services/${s.slug}`} className="v4m-card">
            <div className="v4m-card-cat">Services</div>
            <div className="v4m-card-top">
              <div className="v4m-card-name">{s.full}</div>
              <span className="v4m-card-arrow">→</span>
            </div>
            <div className="v4m-card-tag">{s.blurb}</div>
          </Link>
        ))}

        <Link href="/engage-us" className="v4m-cta" style={{ marginTop: 36 }}>
          Bring your workflow
        </Link>
      </div>
    </div>
  );
}
