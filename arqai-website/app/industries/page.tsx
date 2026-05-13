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
      "Payment integrity, prior authorization, utilization management, and member operations where claims, policy, and clinical context have to line up.",
    href: "/industries/healthcare-payers",
    image: "/img/services/Healthcare-Real-Time-Risk-Stratification-With-Built-In-Compliance.jpg",
    products: ["Veyra", "Luma"],
  },
  {
    title: "P&C insurance carriers",
    description:
      "Claims intake, coverage review, SIU routing, reserve analysis, and adjuster support for carriers that need speed without losing judgment.",
    href: "/industries/insurance-carriers",
    image: "/img/industries/insurance-claims-vehicle.jpg",
    products: ["Luma", "Veyra"],
  },
  {
    title: "Banks and financial institutions",
    description:
      "AML, KYC, sanctions, alert triage, customer due diligence, and SAR support for teams that need cleaner evidence and fewer false positives.",
    href: "/industries/banking",
    image: "/img/services/Banking-Customer-Service-That-Resolves-50-percent-of-Tickets-Automatically.jpg",
    products: ["Sentra"],
  },
  {
    title: "Retail and QSR",
    description:
      "Loyalty, pricing, inventory, store operations, and customer-service workflows where every signal should improve margin or repeat behavior.",
    href: "/industries/retail",
    image: "/img/services/Retail-40-percent-Faster-Pricing-Ops-Without-Manual-Review.jpg",
    products: ["Nuvia"],
  },
  {
    title: "Manufacturing and supply chain",
    description:
      "Quality, maintenance, supplier risk, procurement exposure, and production exceptions across plants, ERP, MES, and supply-chain systems.",
    href: "/industries/manufacturing",
    image: "/img/services/Manufacturing-Autonomous-Maintenance-With-Scoped-Agent-Control.jpg",
    products: ["Orbis", "Kyra"],
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
                AI for industries where the work is complex and the stakes are real.
              </h1>
            </div>
            <div>
              <p className="lede">
                ArqAI Labs builds governed AI workflows for sectors where decisions depend on messy data, changing
                policy, exception handling, and human accountability.
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
            title="Built around the workflows where generic AI falls short."
            body="Every industry we enter has fragmented systems, high exception volume, and teams that are accountable for the final call. We turn that complexity into AI workflows that can be governed, measured, and expanded."
            variant="network"
            points={["Policy", "Evidence", "Exceptions", "Human judgment"]}
          />
        </div>
      </section>

      <section className="a-section">
        <div className="a-wrap">
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
                    {industry.products.map((product) => (
                      <span className="a-tag" key={product}>
                        {product}
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
