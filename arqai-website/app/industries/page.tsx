import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { ArrowIcon, DarkShell } from "@/components/site-dark/DarkShell";
import { SignalStrip } from "@/components/site-dark/InternalVisuals";

export const metadata: Metadata = {
  title: "Industries | ArqAI Labs",
  description:
    "AI workflow systems for healthcare payers, insurance carriers, banking, retail, and manufacturing teams operating in high-stakes, data-rich environments.",
};

const industries = [
  {
    title: "Healthcare payers",
    description:
      "Payment integrity, prior authorization, utilization management, and member operations where policy, claims, clinical context, and reviewer judgment need to line up.",
    href: "/industries/healthcare-payers",
    image: "/img/services/Healthcare-Real-Time-Risk-Stratification-With-Built-In-Compliance.jpg",
    accelerators: ["Veyra", "Luma"],
  },
  {
    title: "P&C insurance carriers",
    description:
      "Claims intake, coverage review, SIU routing, reserve analysis, and adjuster support for carriers that need faster movement without weaker judgment.",
    href: "/industries/insurance-carriers",
    image: "/img/industries/insurance-claims-vehicle.jpg",
    accelerators: ["Luma", "Veyra"],
  },
  {
    title: "Banks and financial institutions",
    description:
      "AML, KYC, sanctions, alert triage, customer due diligence, and SAR support for institutions that need cleaner evidence and fewer false positives.",
    href: "/industries/banking",
    image: "/img/services/Banking-Customer-Service-That-Resolves-50-percent-of-Tickets-Automatically.jpg",
    accelerators: ["Sentra"],
  },
  {
    title: "Retail and QSR",
    description:
      "Loyalty, pricing, inventory, store operations, and customer-service workflows where every signal should improve margin, experience, or repeat behavior.",
    href: "/industries/retail",
    image: "/img/services/Retail-40-percent-Faster-Pricing-Ops-Without-Manual-Review.jpg",
    accelerators: ["Nuvia"],
  },
  {
    title: "Manufacturing and supply chain",
    description:
      "Quality, maintenance, supplier risk, procurement exposure, and production exceptions across plants, ERP, MES, and supply-chain systems.",
    href: "/industries/manufacturing",
    image: "/img/services/Manufacturing-Autonomous-Maintenance-With-Scoped-Agent-Control.jpg",
    accelerators: ["Orbis", "Kyra"],
  },
];

export default function IndustriesPage() {
  return (
    <DarkShell>
      <section className="a-hero">
        <div className="a-hero-grid" />
        <div className="a-wrap" style={{ position: "relative" }}>
          <span className="a-pill">
            <span className="dot" /> Industries
          </span>
          <div className="a-section-head" style={{ marginTop: 28, alignItems: "start" }}>
            <div>
              <h1 className="h-display" style={{ maxWidth: "13ch" }}>
                AI for industries where the work cannot be reduced to a prompt.
              </h1>
            </div>
            <div>
              <p className="lede">
                ArqAI Labs builds governed AI workflows for sectors where decisions depend on messy data, changing
                policy, exception handling, evidence, and human accountability. We start with the work as it really
                runs, then shape AI around the operating terrain.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 28 }}>
                <Link href="/engage-us" className="a-btn a-btn-primary">
                  Get Started <ArrowIcon className="arrow" />
                </Link>
                <Link href="/accelerators" className="a-btn a-btn-ghost">
                  View accelerators
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="a-section">
        <div className="a-wrap">
          <SignalStrip
            label="Industry focus"
            title="Built where generic AI falls short."
            body="Every industry we enter has fragmented systems, high exception volume, and teams accountable for the final call. We turn that complexity into AI workflows that can be governed, measured, and expanded."
            variant="network"
            points={["Policy", "Evidence", "Exceptions", "Human judgment", "Operating metrics"]}
          />
        </div>
      </section>

      <section className="a-section">
        <div className="a-wrap">
          <div className="pathway-list">
            {[
              {
                title: "Industry pages start with the workflow under pressure.",
                body:
                  "Claims, alerts, authorizations, inspections, loyalty actions, and production exceptions all need different data, controls, and review habits.",
                href: "/services/workflow-strategy",
              },
              {
                title: "Accelerators shorten the path when the pattern repeats.",
                body:
                  "Claims triage, payment integrity, financial crime, loyalty, service operations, supply chain, and SecOps have reusable spines that still need enterprise fit.",
                href: "/accelerators",
              },
              {
                title: "The operating fabric keeps the work governable.",
                body:
                  "Each industry workflow gets the permissions, policy checks, evidence capture, and human review needed for production use.",
                href: "/platform",
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
              <span className="a-eyebrow">Industry depth</span>
              <h2 className="h-section" style={{ marginTop: 18 }}>
                Transformation areas we can build around today.
              </h2>
            </div>
            <p className="lede">
              Each page describes the workflows, outcomes, and accelerator starting points that make the industry
              specific, from the systems involved to the evidence and review paths that shape production use.
            </p>
          </div>
          <div style={{ display: "grid", gap: 22 }}>
            {industries.map((industry, index) => (
              <Link
                href={industry.href}
                key={industry.href}
                className="a-card industry-row"
                style={{ color: "inherit", textDecoration: "none", overflow: "hidden", padding: 0 }}
              >
                <div style={{ position: "relative", minHeight: 260 }}>
                  <Image
                    src={industry.image}
                    alt={`${industry.title} operations`}
                    fill
                    sizes="(min-width: 1000px) 38vw, 100vw"
                    style={{ objectFit: "cover" }}
                  />
                  <div className="svc-media-shade" />
                </div>
                <div style={{ padding: "clamp(24px, 4vw, 42px)", display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 18 }}>
                    <span className="a-eyebrow">0{index + 1}</span>
                    <ArrowIcon className="arrow" />
                  </div>
                  <h2 className="h-section" style={{ fontSize: "clamp(28px, 3vw, 42px)", marginTop: 22 }}>
                    {industry.title}
                  </h2>
                  <p className="lede" style={{ marginTop: 14 }}>
                    {industry.description}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 24 }}>
                    {industry.accelerators.map((accelerator) => (
                      <span className="a-tag" key={accelerator}>
                        {accelerator}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </DarkShell>
  );
}
