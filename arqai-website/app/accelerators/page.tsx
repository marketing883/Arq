import Link from "next/link";
import { Metadata } from "next";
import { ArrowIcon, DarkShell } from "@/components/site-dark/DarkShell";
import { SignalStrip } from "@/components/site-dark/InternalVisuals";
import { accelerators } from "@/lib/data/accelerators";

export const metadata: Metadata = {
  title: "AI Accelerators | ArqAI Labs",
  description:
    "Vertical AI accelerators for payer operations, claims, financial crime, loyalty, network operations, service workflows, supply chain, and security operations.",
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
                Vertical AI accelerators for repeatable enterprise workflows.
              </h1>
            </div>
            <div>
              <p className="lede">
                Not off-the-shelf tools. Reusable AI accelerator patterns built from recurring operating patterns, then adapted
                to each client's data, systems, policies, and review model.
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
            title="Each accelerator begins as a reusable workflow spine."
            body="The speed comes from not restarting the same operating architecture each time. The value comes from tuning that spine to the policies, systems, data quality, and reviewers in front of us."
            variant="orbit"
            points={["Reusable core", "Vertical context", "Controls", "Fit check"]}
          />
        </div>
      </section>

      <section className="a-section">
        <div className="a-wrap">
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
          <div className="a-card" style={{ padding: "clamp(28px, 5vw, 56px)" }}>
            <div className="a-section-head" style={{ alignItems: "center" }}>
              <div>
                <span className="a-eyebrow">Reusable, then tailored</span>
                <h2 className="h-section" style={{ marginTop: 18 }}>
                  Faster does not mean generic.
                </h2>
              </div>
              <div>
                <p className="lede">
                  Each accelerator starts with a proven workflow architecture, but the value comes from adapting it to
                  your data quality, policies, systems, approval paths, and operating metric.
                </p>
                <Link href="/engage-us" className="a-btn a-btn-primary" style={{ marginTop: 28 }}>
                  Get Started <ArrowIcon className="arrow" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </DarkShell>
  );
}
