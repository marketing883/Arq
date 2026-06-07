import type { Metadata } from "next";
import Link from "next/link";
import V5SiteLayout from "@/components/home-v5/V5SiteLayout";
import V5CtaSection from "@/components/home-v5/V5CtaSection";
import { ArrowRight } from "@/components/home-v5/icons";

export const metadata: Metadata = {
  title: "How We Work",
  description:
    "Every ArqAI Labs engagement runs on the same four steps — strategy, build, deploy, run — end-to-end, with your team in the room.",
  alternates: { canonical: "https://thearq.ai/how-we-work" },
};

const steps = [
  {
    name: "Strategy",
    description:
      "We start with the workflow, the owner, and the operating metric. We don't run a generic AI assessment. We run discovery around the outcome you want, the timeline you need, and the constraints your environment imposes. Output: a concrete deployment plan and a committed timeline.",
  },
  {
    name: "Build",
    description:
      "We engineer the AI tuned to your environment. On the cloud you already run. Integrated with the systems your team already uses. Built on the modern frontier stack: Anthropic, OpenAI, Azure OpenAI, AWS Bedrock. Stack-agnostic by design. The build standard is production from day one, not a benchmark or a demo.",
  },
  {
    name: "Deploy",
    description:
      "We push it into your production environment. Not a sandbox. Not a pilot that lives in a slide deck. The same security review, change-management posture, and operational handoff your team applies to anything else that runs in production.",
  },
  {
    name: "Run",
    description:
      "We operate the AI alongside your team. Named technical lead. Named relationship lead. Defined SLAs. Defined cadence. The AI keeps shipping, your team keeps the lead, and the engagement compounds over time.",
  },
];

const dontDo = [
  "Pure AI strategy decks without a delivery commitment.",
  "Engagements without a named workflow owner and a defined success metric.",
  "AI that ships into a sandbox and never sees production.",
  "Generic enterprise IT modernization that happens to mention AI.",
];

export default function HowWeWorkPage() {
  return (
    <V5SiteLayout>
      {/* Hero */}
      <section className="v5-page-hero">
        <div className="v5-container">
          <div className="v5-page-hero-inner">
            <span className="v5-badge">
              <span className="v5-badge-dot" />
              How we work
            </span>
            <h1 className="v5-h1">Four steps. End-to-end. No handoffs to someone else&apos;s team.</h1>
            <p className="v5-lead">
              Every ArqAI Labs engagement runs on the same four steps. We do all of them.
              Together. With your team in the room.
            </p>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="v5-section v5-bg-grey">
        <div className="v5-container">
          <div className="v5-section-head">
            <span className="v5-eyebrow">Operating rhythm</span>
            <h2 className="v5-h2">From messy signal to governed system.</h2>
            <p className="v5-lead">
              We move from a real workflow problem to a governed production system, keeping
              scope, build, deployment, and ongoing operations connected the whole way.
            </p>
          </div>
          <div className="v5-grid v5-grid-2">
            {steps.map((step, index) => (
              <article className="v5-card v5-numcard" key={step.name}>
                <span className="v5-num">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="v5-h3">{step.name}</h3>
                <p className="v5-body">{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* What we don't do */}
      <section className="v5-section v5-bg-white">
        <div className="v5-container">
          <div className="v5-split">
            <div className="v5-split-copy">
              <span className="v5-eyebrow">Boundaries</span>
              <h2 className="v5-h2">What we don&apos;t do.</h2>
              <p className="v5-lead">
                Clear boundaries keep every engagement honest. If a request looks like one of
                these, we will say so early.
              </p>
            </div>
            <div className="v5-card">
              <ul className="v5-list">
                {dontDo.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA band */}
      <V5CtaSection>
            <h2 className="v5-h2">Tell us what your operation needs.</h2>
            <p className="v5-lead">
              We&apos;ll tell you what&apos;s honestly possible. In plain language. Without a deck.
            </p>
            <div className="v5-cta-card-actions">
              <Link href="/engage-us" className="v5-btn v5-btn-primary">
                Get Started <ArrowRight />
              </Link>
            </div>
      </V5CtaSection>
    </V5SiteLayout>
  );
}
