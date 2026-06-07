import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import V5SiteLayout from "@/components/home-v5/V5SiteLayout";
import { ArrowRight, ArrowUpRight } from "@/components/home-v5/icons";

export const metadata: Metadata = {
  title: "Industries | ArqAI Labs",
  description:
    "AI workflow systems for healthcare payers, insurance carriers, banking, retail, and manufacturing teams operating in high-stakes, data-rich environments.",
  alternates: { canonical: "https://thearq.ai/industries" },
};

const industries = [
  {
    title: "Healthcare payers",
    description:
      "Payment integrity, prior authorization, utilization management, and member operations where policy, claims, clinical context, and reviewer judgment need to line up.",
    href: "/industries/healthcare-payers",
    image: "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1400&q=80",
    accelerators: ["Veyra", "Luma"],
  },
  {
    title: "P&C insurance carriers",
    description:
      "Claims intake, coverage review, SIU routing, reserve analysis, and adjuster support for carriers that need faster movement without weaker judgment.",
    href: "/industries/insurance-carriers",
    image: "https://images.unsplash.com/photo-1597328290883-50c5787b7c7e?auto=format&fit=crop&w=1400&q=80",
    accelerators: ["Luma", "Veyra"],
  },
  {
    title: "Banks and financial institutions",
    description:
      "AML, KYC, sanctions, alert triage, customer due diligence, and SAR support for institutions that need cleaner evidence and fewer false positives.",
    href: "/industries/banking",
    image: "https://images.unsplash.com/photo-1684679674829-fc7b436ec8e8?auto=format&fit=crop&w=1400&q=80",
    accelerators: ["Sentra"],
  },
  {
    title: "Retail and QSR",
    description:
      "Loyalty, pricing, inventory, store operations, and customer-service workflows where every signal should improve margin, experience, or repeat behavior.",
    href: "/industries/retail",
    image: "https://images.unsplash.com/photo-1759323321196-2813db509285?auto=format&fit=crop&w=1400&q=80",
    accelerators: ["Nuvia"],
  },
  {
    title: "Manufacturing and supply chain",
    description:
      "Quality, maintenance, supplier risk, procurement exposure, and production exceptions across plants, ERP, MES, and supply-chain systems.",
    href: "/industries/manufacturing",
    image: "https://images.unsplash.com/photo-1610891015188-5369212db097?auto=format&fit=crop&w=1400&q=80",
    accelerators: ["Orbis", "Kyra"],
  },
];

const paths = [
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
];

export default function IndustriesPage() {
  return (
    <V5SiteLayout>
      {/* Hero */}
      <section className="v5-page-hero">
        <div className="v5-container">
          <div className="v5-page-hero-inner">
            <span className="v5-badge">
              <span className="v5-badge-dot" />
              Industries
            </span>
            <h1 className="v5-h1">AI for industries where the work cannot be reduced to a prompt.</h1>
            <p className="v5-lead">
              ArqAI Labs builds governed AI workflows for sectors where decisions depend on
              messy data, changing policy, exception handling, evidence, and human
              accountability. We start with the work as it really runs, then shape AI around
              the operating terrain.
            </p>
            <div className="v5-hero-actions">
              <Link href="/engage-us" className="v5-btn v5-btn-primary">
                Get Started <ArrowRight />
              </Link>
              <Link href="/accelerators" className="v5-btn v5-btn-ghost">
                View accelerators
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How industry work is shaped */}
      <section className="v5-section v5-bg-grey">
        <div className="v5-container">
          <div className="v5-section-head">
            <span className="v5-eyebrow">Industry focus</span>
            <h2 className="v5-h2">Built where generic AI falls short.</h2>
            <p className="v5-lead">
              Every industry we enter has fragmented systems, high exception volume, and
              teams accountable for the final call. We turn that complexity into AI workflows
              that can be governed, measured, and expanded.
            </p>
          </div>
          <div className="v5-grid v5-grid-3">
            {paths.map((path, index) => (
              <Link href={path.href} className="v5-card v5-card-link v5-numcard" key={path.href}>
                <span className="v5-num">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="v5-h3">{path.title}</h3>
                <p className="v5-body">{path.body}</p>
                <span className="v5-card-more">
                  Explore <ArrowRight />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Industry rows */}
      <section className="v5-section v5-bg-white">
        <div className="v5-container">
          <div className="v5-section-head">
            <span className="v5-eyebrow">Industry depth</span>
            <h2 className="v5-h2">Transformation areas we can build around today.</h2>
            <p className="v5-lead">
              Each page describes the workflows, outcomes, and accelerator starting points
              that make the industry specific, from the systems involved to the evidence and
              review paths that shape production use.
            </p>
          </div>
          <div style={{ display: "grid", gap: 22 }}>
            {industries.map((industry, index) => (
              <Link
                href={industry.href}
                key={industry.href}
                className="v5-card v5-card-link v5-industry-row"
                style={{ padding: 0, overflow: "hidden" }}
              >
                <div className="v5-industry-media">
                  <Image
                    src={industry.image}
                    alt={`${industry.title} operations`}
                    fill
                    sizes="(min-width: 1000px) 38vw, 100vw"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="v5-industry-body">
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 18 }}>
                    <span className="v5-card-eyebrow">0{index + 1}</span>
                    <ArrowUpRight />
                  </div>
                  <h3 className="v5-h2" style={{ fontSize: "clamp(24px, 2.6vw, 34px)", marginTop: 16 }}>
                    {industry.title}
                  </h3>
                  <p className="v5-lead" style={{ marginTop: 12 }}>{industry.description}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 22 }}>
                    {industry.accelerators.map((accelerator) => (
                      <span className="v5-chip" key={accelerator}>{accelerator}</span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="v5-section v5-cta-band">
        <div className="v5-container">
          <div className="v5-cta-card">
            <div className="v5-cta-glow" />
            <h2 className="v5-h2">Tell us how the work really runs in your industry.</h2>
            <p className="v5-lead">
              We will map the workflow, the systems, the evidence, and the review paths, then
              shape governed AI around the operating terrain you already know.
            </p>
            <div className="v5-cta-card-actions">
              <Link href="/engage-us" className="v5-btn v5-btn-primary">
                Get Started <ArrowRight />
              </Link>
              <Link href="/accelerators" className="v5-btn v5-btn-ghost">
                View accelerators
              </Link>
            </div>
          </div>
        </div>
      </section>
    </V5SiteLayout>
  );
}
