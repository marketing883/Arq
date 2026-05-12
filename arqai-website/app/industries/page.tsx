import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { ArrowIcon, DarkShell } from "@/components/site-dark/DarkShell";
import { SignalStrip } from "@/components/site-dark/InternalVisuals";

export const metadata: Metadata = {
  title: "Industries | ArqAI Labs",
  description:
    "AI operating systems and agentic workflows for healthcare payers, insurance carriers, banking, retail, and manufacturing teams.",
};

const industries = [
  {
    title: "Healthcare payers",
    description:
      "Fraud, waste, abuse, utilization management, prior authorization, and patient-management workflows built for payer operating reality.",
    href: "/industries/healthcare-payers",
    image: "/img/services/Healthcare-Real-Time-Risk-Stratification-With-Built-In-Compliance.jpg",
    products: ["Veyra", "Luma", "ArqFWA"],
  },
  {
    title: "P&C insurance carriers",
    description:
      "Claims triage, investigation support, reserve recommendations, documentation review, and auditable decision support for carrier teams.",
    href: "/industries/insurance-carriers",
    image: "/img/services/Retail-40-percent-Faster-Pricing-Ops-Without-Manual-Review.jpg",
    products: ["Luma", "ArqClaims", "Veyra"],
  },
  {
    title: "Banks and financial institutions",
    description:
      "AML, KYC, sanctions, customer due diligence, alert triage, and SAR support for regional and mid-tier financial institutions.",
    href: "/industries/banking",
    image: "/img/services/Banking-Customer-Service-That-Resolves-50-percent-of-Tickets-Automatically.jpg",
    products: ["Sentra", "ArqBanker"],
  },
  {
    title: "Retail and QSR",
    description:
      "Loyalty, personalization, inventory, pricing, store operations, and customer-service workflows built around margin and repeat behavior.",
    href: "/industries/retail",
    image: "/img/services/Retail-40-percent-Faster-Pricing-Ops-Without-Manual-Review.jpg",
    products: ["Nuvia"],
  },
  {
    title: "Manufacturing and supply chain",
    description:
      "Vendor risk, procurement exposure, production exceptions, quality signals, and operational dependency workflows for industrial teams.",
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
                AI for the industries where we go deep.
              </h1>
            </div>
            <div>
              <p className="lede">
                ArqAI Labs builds agentic workflows for high-stakes operational environments where data, policy,
                exceptions, and human review all matter.
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
            label="Industry depth"
            title="Visualize the operating terrain before we build."
            body="Every industry page now creates room for the things that make the work specific: systems, exceptions, reviewers, risk boundaries, and measurable outcomes."
            variant="network"
            points={["Systems", "Exceptions", "Risk", "Outcomes"]}
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
                    alt=""
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
