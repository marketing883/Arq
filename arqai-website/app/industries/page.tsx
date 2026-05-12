import Link from "next/link";
import { SiteNav } from "@/components/site-dark/SiteNav";
import { SiteFooter } from "@/components/site-dark/SiteFooter";

const industries = [
  {
    name: "Healthcare payers",
    href: "/industries/healthcare-payers",
    signal: "Claims, prior auth, provider ops",
    body: "Payer workflows where cycle time, policy evidence, and appeal readiness matter more than generic copilots.",
    accelerators: ["ArqFWA", "ArqClaims"],
  },
  {
    name: "Insurance carriers",
    href: "/industries/insurance-carriers",
    signal: "FNOL, triage, leakage, SIU",
    body: "Agentic claims operations that find exceptions, preserve judgment, and leave a clean audit trail.",
    accelerators: ["ArqClaims", "ArqFWA"],
  },
  {
    name: "Banking & financial services",
    href: "/industries/banking",
    signal: "AML, KYC, credit, service ops",
    body: "Regulated financial workflows where AI must explain every recommendation and respect every control boundary.",
    accelerators: ["ArqBanker", "ArqIntel"],
  },
  {
    name: "Retail",
    href: "/industries/retail",
    signal: "Loyalty, inventory, pricing",
    body: "Customer and store operations that need local context, live inventory, and governed experimentation.",
    accelerators: ["Revenue ops", "Demand gen"],
  },
  {
    name: "Manufacturing",
    href: "/industries/manufacturing",
    signal: "Quality, maintenance, ERP/MES",
    body: "Shop-floor and supply-chain use cases that connect sensor, ERP, and human approval loops.",
    accelerators: ["ArqOptimize", "ArqRelease"],
  },
];

function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={className}>
      <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function IndustriesPage() {
  return (
    <div className="arq-dark min-h-screen">
      <SiteNav />
      <main>
        <section className="a-section" style={{ paddingTop: "clamp(140px, 16vh, 210px)" }}>
          <div className="a-wrap">
            <span className="a-eyebrow">Industries</span>
            <h1 className="h-display" style={{ marginTop: 18, maxWidth: "13ch" }}>
              Vertical AI for operational teams with <span className="accent">real constraints</span>.
            </h1>
            <p className="lede" style={{ marginTop: 28 }}>
              We build where the workflow is high-volume, high-stakes, and impossible to fix with a generic chatbot. Each industry page is now shaped in the same dark ArqAI Labs system as the homepage.
            </p>
          </div>
        </section>

        <section className="a-section">
          <div className="a-wrap">
            <div className="a-section-head">
              <div>
                <span className="a-eyebrow">Focus areas</span>
                <h2 className="h-section" style={{ marginTop: 18 }}>Where we go <em>deep</em>.</h2>
              </div>
              <p className="lede">Each vertical combines process discovery, accelerator patterns, integration architecture, governance, and a measurable business case.</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
              {industries.map((industry) => (
                <Link className="a-card" href={industry.href} key={industry.name}>
                  <span className="a-tag">{industry.signal}</span>
                  <h3 style={{ marginTop: 22, fontSize: 28 }}>{industry.name}</h3>
                  <p style={{ color: "var(--ink-cream-d)", fontSize: 15, lineHeight: 1.6 }}>{industry.body}</p>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 22 }}>
                    {industry.accelerators.map((a) => <span className="a-pill" key={a}>{a}</span>)}
                  </div>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "var(--ember)", marginTop: 28, fontSize: 14 }}>Open industry <ArrowIcon className="arrow" /></span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="a-section final-cta-band">
          <div className="a-wrap">
            <span className="a-eyebrow">Different industry?</span>
            <h2 className="h-section final-cta-h" style={{ marginTop: 18, maxWidth: "18ch" }}>If your workflow is repeatable, governed, and painful, we can map it.</h2>
            <p className="lede" style={{ marginTop: 18 }}>Bring the messy version. We will tell you whether it wants a bespoke build, a service engagement, or an accelerator.</p>
            <Link href="/engage-us" className="a-btn a-btn-primary" style={{ marginTop: 28 }}>Engage us <ArrowIcon className="arrow" /></Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
