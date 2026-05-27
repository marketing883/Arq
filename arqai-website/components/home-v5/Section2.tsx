import Image from "next/image";
import Link from "next/link";

export default function Section2() {
  return (
    <section id="v5-next" className="v5-section v5-section-2">
      <div className="v5-section-2-wrap">
        <div className="v5-section-2-top">
          <h2 className="v5-section-2-h2">
            AI that does
            <br />
            what it is built to do.
          </h2>
          <div className="v5-section-2-body">
            <p>
              Most enterprise AI workflows have no way to show exactly what happened, why a
              decision was made, or whether a policy was followed. ArqAI builds every workflow
              with full execution traceability. Every agent action, every policy check, every
              approval and exception is logged, encrypted, and audit-ready from day one. Not
              added after the fact. Built into the system before it runs.
            </p>
            <ul>
              <li>
                <strong>Does what it is designed to do</strong> &mdash; Every workflow is built
                with defined boundaries, policy checks, and human review points before any
                action is taken.
              </li>
              <li>
                <strong>Leaves a complete record</strong> &mdash; Every decision, escalation,
                and exception is captured in an encrypted, immutable audit trail.
              </li>
              <li>
                <strong>Ready for any scrutiny</strong> &mdash; Compliance reviews, regulatory
                audits, internal governance. The evidence is already there.
              </li>
            </ul>
            <Link href="/platform" className="v5-section-2-cta">
              Learn More
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M5 12h14M13 5l7 7-7 7"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </div>

        <Image
          src="/img/Dooodle.png"
          alt=""
          width={1500}
          height={550}
          className="v5-section-2-doodle"
          aria-hidden="true"
        />

        <div className="v5-section-2-image">
          <Image
            src="/img/2nd-scroll-img.png"
            alt="Global workflow execution map"
            width={1240}
            height={680}
            sizes="(max-width: 900px) 100vw, 1240px"
            priority={false}
          />
          <div className="v5-section-2-icons" aria-hidden="true">
            <div className="v5-section-2-icon back" />
            <div className="v5-section-2-icon front">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
