import type { Metadata } from "next";
import Link from "next/link";
import V5SiteLayout from "@/components/home-v5/V5SiteLayout";
import V5CtaSection from "@/components/home-v5/V5CtaSection";
import { ArrowRight } from "@/components/home-v5/icons";

export const metadata: Metadata = {
  title: "How It Works: Inside the Agent Runtime",
  description:
    "Inside the governance plane of the ArqAI Operating Fabric, every agent runs on the same three runtime guarantees: scoped agent identity, runtime policy enforcement, and observable retrieval.",
  alternates: { canonical: "https://thearq.ai/how-it-works" },
};

const layers = [
  {
    number: "01",
    title: "Agent identity",
    headline: "Every agent has a cryptographic identity and a defined set of capabilities.",
    description:
      "Before an agent acts, the runtime verifies who it is and what it is permitted to do. Capabilities are scoped to the workflow. Actions are logged with cryptographic provenance. Nothing happens off-policy.",
  },
  {
    number: "02",
    title: "Runtime policy enforcement",
    headline: "Policies live in the runtime, not in a filter applied after.",
    description:
      "Internal policies and the rules that apply to the workflow are compiled into the agent's execution path before it runs. The agent cannot take an action that violates the policies it has been given. Reliability is enforced, not promised.",
  },
  {
    number: "03",
    title: "Observable retrieval",
    headline: "Every data lookup is logged, governed, and quality-monitored.",
    description:
      "When the agent retrieves data, the lookup is logged, the data is policy-checked before access, and retrieval quality is monitored continuously. If quality drifts, the agent corrects.",
  },
];

export default function HowItWorksPage() {
  return (
    <V5SiteLayout>
      {/* Hero */}
      <section className="v5-page-hero">
        <div className="v5-container">
          <div className="v5-page-hero-inner">
            <span className="v5-badge">
              <span className="v5-badge-dot" />
              Architecture
            </span>
            <h1 className="v5-h1">Inside every agent: identity, policy, observability.</h1>
            <p className="v5-lead">
              The ArqAI Operating Fabric has four layers — workflow intelligence, the
              governance plane, the integration layer, and the operating loop. This page goes
              one level deeper: inside the governance plane, every agent we ship runs on the
              same three runtime guarantees. We build reliability once, deeply, and apply it
              everywhere — which is why repeat workflows move faster and a new agent never
              means re-evaluating the foundation from scratch.
            </p>
            <div className="v5-hero-actions">
              <Link href="/engage-us" className="v5-btn v5-btn-primary">
                Get Started <ArrowRight />
              </Link>
              <Link href="/platform" className="v5-btn v5-btn-ghost">
                See the full Operating Fabric
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Three layers */}
      <section className="v5-section v5-bg-grey">
        <div className="v5-container">
          <div className="v5-section-head">
            <span className="v5-eyebrow">The runtime</span>
            <h2 className="v5-h2">Three guarantees carry every agent from identity to action.</h2>
            <p className="v5-lead">
              Scoped, enforced, and observable end to end — this is what the Operating
              Fabric&apos;s governance plane means at the level of a single agent.
            </p>
          </div>
          <div className="v5-grid v5-grid-3">
            {layers.map((layer, index) => (
              <article className="v5-card v5-numcard" key={layer.number}>
                <span className="v5-num">{layer.number}</span>
                <span className="v5-card-eyebrow">Guarantee {index + 1} · {layer.title}</span>
                <h3 className="v5-h3">{layer.headline}</h3>
                <p className="v5-body">{layer.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* For engineers */}
      <section className="v5-section v5-bg-white">
        <div className="v5-container">
          <div className="v5-cta-card" style={{ background: "var(--v5-navy)" }}>
            <h2 className="v5-h2">For engineers</h2>
            <p className="v5-lead">
              Each layer has technical depth that your principal architect should evaluate
              directly. Reach out under NDA for control documentation. Read the engineering
              blog for deep technical posts on each layer.
            </p>
            <div className="v5-cta-card-actions">
              <Link href="/contact" className="v5-btn v5-btn-primary">
                Request control documentation
              </Link>
              <Link href="/blog" className="v5-btn v5-btn-ghost">
                Read the engineering blog
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA band */}
      <V5CtaSection>
            <h2 className="v5-h2">See the architecture in action.</h2>
            <p className="v5-lead">
              We can show how your workflow would run on this foundation in your environment.
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
