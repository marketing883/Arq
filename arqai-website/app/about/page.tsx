import type { Metadata } from "next";
import Link from "next/link";
import V5SiteLayout from "@/components/home-v5/V5SiteLayout";
import V5CtaSection from "@/components/home-v5/V5CtaSection";
import { ArrowRight } from "@/components/home-v5/icons";

export const metadata: Metadata = {
  title: "About",
  description:
    "ArqAI Labs is an independent AI engineering studio. Production AI, bespoke to your operation. In partnership with ACI Infotech.",
  alternates: { canonical: "https://thearq.ai/about" },
};

const beliefs = [
  {
    no: "01",
    title: "Tuned beats templated.",
    body: "Every operation has its own quirks. Off-the-shelf AI averages them away. We build to the quirks.",
  },
  {
    no: "02",
    title: "Production beats pilots.",
    body: "Most enterprise AI never makes it past the sandbox. We engineer for production from day one. That is the only standard we ship at.",
  },
  {
    no: "03",
    title: "Engineers, not consultants.",
    body: "A lean team of senior AI engineers. We would rather build than describe.",
  },
];

export default function AboutPage() {
  return (
    <V5SiteLayout>
      {/* Hero */}
      <section className="v5-page-hero">
        <div className="v5-container">
          <div className="v5-page-hero-inner">
            <span className="v5-badge">
              <span className="v5-badge-dot" />
              About
            </span>
            <h1 className="v5-h1">We build AI for the way people actually work.</h1>
            <p className="v5-lead">
              ArqAI Labs is an AI engineering studio. We design, build, deploy, and run
              production AI for operations that don&apos;t fit off-the-shelf. We are an
              engineering team, not a consulting practice. We ship the work; we do not
              decorate the deck.
            </p>
          </div>
        </div>
      </section>

      {/* Beliefs */}
      <section className="v5-section v5-bg-grey" id="beliefs">
        <div className="v5-container">
          <div className="v5-section-head">
            <span className="v5-eyebrow">What we believe</span>
            <h2 className="v5-h2">Three things we will not compromise on.</h2>
            <p className="v5-lead">
              These are not aspirations. They are the rules of every engagement we run.
            </p>
          </div>
          <div className="v5-grid v5-grid-3">
            {beliefs.map((b) => (
              <div className="v5-card v5-numcard" key={b.no}>
                <span className="v5-num">{b.no}</span>
                <h3 className="v5-h3">{b.title}</h3>
                <p className="v5-body">{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ACI partnership */}
      <section className="v5-section v5-bg-white" id="partner">
        <div className="v5-container">
          <div className="v5-split">
            <div className="v5-split-copy">
              <span className="v5-eyebrow">Our partner</span>
              <h2 className="v5-h2">Independent studio. Enterprise reach.</h2>
              <p className="v5-lead">
                ArqAI Labs is an independent AI engineering studio. We work in close
                partnership with ACI Infotech, a privately held enterprise technology firm,
                and that partnership gives us what most AI studios never get: direct access
                to enterprise operators, proven implementation playbooks, and the delivery
                depth to take AI all the way into production and keep it running.
              </p>
            </div>
            <div className="v5-card">
              <p style={{ fontSize: 16, lineHeight: 1.65, color: "var(--v5-ink-soft)", margin: 0 }}>
                Our founders built their careers inside enterprise operations through ACI.
                That is why we engineer for production from day one, and why we stand up
                governed AI inside real systems instead of stopping at a slide.
              </p>
              <p style={{ fontSize: 16, fontWeight: 600, color: "var(--v5-ink)", marginTop: 18, marginBottom: 0 }}>
                Independent by design. Enterprise-deep by partnership.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA band */}
      <V5CtaSection>
            <h2 className="v5-h2">Want to work with us, build with us, or sell with us?</h2>
            <div className="v5-cta-card-actions">
              <Link href="/engage-us" className="v5-btn v5-btn-primary">
                Get Started <ArrowRight />
              </Link>
              <Link href="/careers" className="v5-btn v5-btn-ghost">
                See open roles
              </Link>
              <Link href="/contact" className="v5-btn v5-btn-ghost">
                Become a partner
              </Link>
            </div>
      </V5CtaSection>
    </V5SiteLayout>
  );
}
