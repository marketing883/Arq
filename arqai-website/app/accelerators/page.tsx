import Link from "next/link";
import { Metadata } from "next";
import { ArrowIcon, DarkShell } from "@/components/site-dark/DarkShell";
import { SignalStrip } from "@/components/site-dark/InternalVisuals";
import { accelerators } from "@/lib/data/accelerators";

export const metadata: Metadata = {
  title: "AI Accelerators | ArqAI Labs",
  description:
    "Productized AI accelerator patterns for payer operations, claims, financial crime, loyalty, network operations, service workflows, supply chain, and security operations.",
};

export default function AcceleratorsPage() {
  return (
    <DarkShell>
      <section className="a-hero">
        <div className="a-hero-grid" />
        <div className="a-wrap" style={{ position: "relative" }}>
          <span className="a-pill">
            <span className="dot" /> Accelerators
          </span>
          <div className="a-section-head" style={{ marginTop: 28, alignItems: "start" }}>
            <div>
              <h1 className="h-display" style={{ maxWidth: "13ch" }}>
                Productized AI patterns, tailored to how your operation works.
              </h1>
            </div>
            <div>
              <p className="lede">
                Accelerators are reusable workflow spines for recurring enterprise problems. They shorten discovery and
                build time, then adapt around your data, systems, policies, approval paths, and operating metric.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 28 }}>
                <Link href="/engage-us" className="a-btn a-btn-primary">
                  Get Started <ArrowIcon className="arrow" />
                </Link>
                <Link href="/services/vertical-acceleration" className="a-btn a-btn-ghost">
                  How acceleration works
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="a-section">
        <div className="a-wrap">
          <SignalStrip
            label="Pattern library"
            title="Speed from the reusable core. Value from the enterprise fit."
            body="Each accelerator begins with a proven workflow architecture, then bends around the systems, policies, data quality, and reviewers in front of us."
            variant="orbit"
            points={["Reusable core", "Vertical context", "Controls", "Enterprise fit"]}
          />
        </div>
      </section>

      <section className="a-section">
        <div className="a-wrap">
          <div className="pathway-list">
            {[
              {
                title: "Fit check before build.",
                body:
                  "We compare your workflow, data sources, review steps, and operating metric against the accelerator spine before recommending a rollout.",
                href: "/services/vertical-acceleration",
              },
              {
                title: "Configure the control model.",
                body:
                  "Permissions, policy checks, escalation rules, evidence capture, and reviewer authority are tuned before the accelerator takes on live work.",
                href: "/services/governance-by-design",
              },
              {
                title: "Expand only after the first queue proves value.",
                body:
                  "The first release stays narrow enough to measure, then expands into adjacent teams, queues, and use cases with the operating loop intact.",
                href: "/services/managed-ai-operations",
              },
            ].map((path, index) => (
              <Link href={path.href} className="pathway-row" key={path.href}>
                <span className="num">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{path.title}</h3>
                  <p>{path.body}</p>
                </div>
                <ArrowIcon className="arrow" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="a-section">
        <div className="a-wrap">
          <div className="a-section-head">
            <div>
              <span className="a-eyebrow">Accelerator lines</span>
              <h2 className="h-section" style={{ marginTop: 18 }}>
                Start from the workflow spine closest to the problem.
              </h2>
            </div>
            <p className="lede">
              These are not generic apps. Each line is a reusable starting point for a recurring operating pattern,
              shaped into a production system through services and the ArqAI operating fabric.
            </p>
          </div>
          <div className="acc-grid reveal in">
            {accelerators.map((accelerator, index) => (
              <Link
                href={`/accelerators/${accelerator.id}`}
                className="acc-card"
                key={accelerator.id}
                style={{ color: "inherit", textDecoration: "none" }}
              >
                <div className="acc-bg" style={{ backgroundImage: `url(${accelerator.image})` }} aria-hidden="true" />
                <div className="acc-glass" aria-hidden="true" />
                <div className="acc-content">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div className="name">{accelerator.name}</div>
                    <span className="a-tag">{String(index + 1).padStart(2, "0")}</span>
                  </div>
                  <div className="tagline">{accelerator.category}</div>
                  <div className="desc">{accelerator.summary}</div>
                  <div className="built">
                    Built for <b>{accelerator.builtFor}</b>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="a-section">
        <div className="a-wrap">
          <div className="cta-strip">
            <h2 className="h-section" style={{ marginTop: 0, maxWidth: "18ch" }}>
              Faster should still feel built for your business.
            </h2>
            <p className="lede" style={{ marginTop: 18, maxWidth: "62ch" }}>
              Bring us the queue, case type, signal source, or review workflow. We will show which accelerator is
              closest, what must be customized, and where bespoke engineering is the better answer.
            </p>
            <Link href="/engage-us" className="a-btn a-btn-primary" style={{ marginTop: 28 }}>
              Get Started <ArrowIcon className="arrow" />
            </Link>
          </div>
        </div>
      </section>
    </DarkShell>
  );
}
