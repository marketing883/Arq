import type { Metadata } from "next";
import Link from "next/link";
import V5SiteLayout from "@/components/home-v5/V5SiteLayout";
import { ArrowRight } from "@/components/home-v5/icons";

export const metadata: Metadata = {
  title: "Trust",
  description:
    "Architectural controls and compliance posture across every ArqAI Labs engagement. SOC 2 in progress. HIPAA-aligned. GDPR-aligned. Control documentation under NDA.",
  alternates: { canonical: "https://thearq.ai/trust" },
};

const controls = [
  "Cryptographic logging of every agent action and every data access.",
  "Policy enforcement before retrieval and before tool execution.",
  "Decision provenance exposed in the operational log and the user UI.",
  "Deployment options that respect data residency and tenancy requirements.",
];

const frameworks = [
  {
    name: "SOC 2",
    status: "In progress",
    body: "Aligned with SOC 2 Trust Services Criteria. Type II audit in progress.",
  },
  {
    name: "HIPAA",
    status: "Aligned",
    body: "HIPAA-aligned controls. BAAs executed with healthcare customers. Internal HIPAA security and privacy policies in place.",
  },
  {
    name: "GDPR",
    status: "Aligned",
    body: "GDPR-aligned data protection principles. EU customer engagements include the appropriate data processing addenda.",
  },
  {
    name: "Regional frameworks",
    status: "Aligned",
    body: "SAMA Cybersecurity Framework, NCA Essential Cybersecurity Controls, KSA PDPL, UAE PDPL, and NHRA standards for engagements in MENA.",
  },
];

export default function TrustPage() {
  return (
    <V5SiteLayout>
      {/* Hero */}
      <section className="v5-page-hero">
        <div className="v5-container">
          <div className="v5-page-hero-inner">
            <span className="v5-badge">
              <span className="v5-badge-dot" />
              Trust
            </span>
            <h1 className="v5-h1">Architectural controls first. Certifications next.</h1>
            <p className="v5-lead">
              We don&apos;t claim certifications we don&apos;t have. We tell you exactly where we are on every framework
              you care about, and we share control documentation under NDA on request.
            </p>
          </div>
        </div>
      </section>

      {/* Architectural controls */}
      <section className="v5-section v5-bg-grey" id="controls">
        <div className="v5-container">
          <div className="v5-section-head">
            <span className="v5-eyebrow">Architectural controls</span>
            <h2 className="v5-h2">Independent of certification status.</h2>
            <p className="v5-lead">
              The architecture every ArqAI Labs engagement runs on includes:
            </p>
          </div>
          <div className="v5-grid v5-grid-2">
            {controls.map((c, i) => (
              <div className="v5-card v5-numcard" key={i}>
                <span className="v5-num">{String(i + 1).padStart(2, "0")}</span>
                <p className="v5-body">{c}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance posture */}
      <section className="v5-section v5-bg-white" id="compliance">
        <div className="v5-container">
          <div className="v5-section-head">
            <span className="v5-eyebrow">Compliance posture</span>
            <h2 className="v5-h2">Honest status. By framework.</h2>
            <p className="v5-lead">
              Each row is the current honest read on alignment, audit, and customer-facing artefacts.
            </p>
          </div>
          <div className="v5-grid v5-grid-2">
            {frameworks.map((f) => (
              <div key={f.name} className="v5-card">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 12,
                    marginBottom: 14,
                  }}
                >
                  <h3 className="v5-h3" style={{ margin: 0 }}>
                    {f.name}
                  </h3>
                  <span className="v5-chip">{f.status}</span>
                </div>
                <p className="v5-body">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Data handling */}
      <section className="v5-section v5-bg-grey" id="data">
        <div className="v5-container">
          <div className="v5-section-head">
            <span className="v5-eyebrow">Data handling</span>
            <h2 className="v5-h2">Your data stays your data.</h2>
            <p className="v5-lead">
              We don&apos;t move data outside customer environments to make our product work. Customer data is not
              used to train shared models.
            </p>
          </div>
        </div>
      </section>

      {/* Responsible AI */}
      <section className="v5-section v5-bg-white" id="responsible-ai">
        <div className="v5-container">
          <div className="v5-section-head">
            <span className="v5-eyebrow">Responsible AI</span>
            <h2 className="v5-h2">Assist, don&apos;t replace.</h2>
            <p className="v5-lead">
              Every ArqAI Labs engagement is designed to assist a human professional. The AI surfaces evidence and
              reasoning. The human makes the consequential decision.
            </p>
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="v5-section v5-cta-band">
        <div className="v5-container">
          <div className="v5-cta-card">
            <div className="v5-cta-glow" />
            <h2 className="v5-h2">Request control documentation.</h2>
            <p className="v5-lead">Detailed control documentation is shared under NDA.</p>
            <div className="v5-cta-card-actions">
              <Link href="/contact" className="v5-btn v5-btn-primary">
                Request documentation <ArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </V5SiteLayout>
  );
}
