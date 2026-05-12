import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "@/components/site-dark/SiteNav";
import { SiteFooter } from "@/components/site-dark/SiteFooter";

export const metadata: Metadata = {
  title: "Trust",
  description:
    "Architectural controls and compliance posture across every ArqAI Labs engagement. SOC 2 in progress. HIPAA-aligned. GDPR-aligned. Control documentation under NDA.",
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
    progress: true,
  },
  {
    name: "HIPAA",
    status: "Aligned",
    body: "HIPAA-aligned controls. BAAs executed with healthcare customers. Internal HIPAA security and privacy policies in place.",
    progress: false,
  },
  {
    name: "GDPR",
    status: "Aligned",
    body: "GDPR-aligned data protection principles. EU customer engagements include the appropriate data processing addenda.",
    progress: false,
  },
  {
    name: "Regional frameworks",
    status: "Aligned",
    body: "SAMA Cybersecurity Framework, NCA Essential Cybersecurity Controls, KSA PDPL, UAE PDPL, and NHRA standards for engagements in MENA.",
    progress: false,
  },
];

export default function TrustPage() {
  return (
    <div className="arq-dark min-h-screen">
      <SiteNav />
      <main>
        <section className="a-section" style={{ paddingTop: "clamp(140px, 16vh, 200px)" }}>
          <div className="a-wrap">
            <span className="a-eyebrow">Trust</span>
            <h1 className="h-display" style={{ marginTop: 18, maxWidth: "18ch" }}>
              Architectural controls first.<br />
              <em>Certifications</em> next.
            </h1>
            <p className="lede" style={{ marginTop: 28, maxWidth: "62ch" }}>
              We don&apos;t claim certifications we don&apos;t have. We tell you exactly where we are on every framework
              you care about, and we share control documentation under NDA on request.
            </p>
          </div>
        </section>

        <section className="a-section" id="controls">
          <div className="a-wrap">
            <div className="a-section-head">
              <div>
                <span className="a-eyebrow">Architectural controls</span>
                <h2 className="h-section" style={{ marginTop: 18 }}>
                  Independent of <em>certification</em> status.
                </h2>
              </div>
              <p className="lede" style={{ justifySelf: "end" }}>
                The architecture every ArqAI Labs engagement runs on includes:
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12, maxWidth: 880 }}>
              {controls.map((c, i) => (
                <div
                  key={i}
                  className="a-card"
                  style={{ display: "flex", gap: 18, alignItems: "flex-start", padding: 24 }}
                >
                  <span
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: 11,
                      letterSpacing: ".14em",
                      color: "var(--ember)",
                      paddingTop: 4,
                      minWidth: 28,
                    }}
                  >
                    0{i + 1}
                  </span>
                  <p style={{ color: "var(--ink-cream)", fontSize: 16, lineHeight: 1.55, margin: 0 }}>{c}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="a-section" id="compliance">
          <div className="a-wrap">
            <div className="a-section-head">
              <div>
                <span className="a-eyebrow">Compliance posture</span>
                <h2 className="h-section" style={{ marginTop: 18 }}>
                  Honest status. By framework.
                </h2>
              </div>
              <p className="lede" style={{ justifySelf: "end" }}>
                Each row is the current honest read on alignment, audit, and customer-facing artefacts.
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 14 }}>
              {frameworks.map((f) => (
                <div key={f.name} className="a-card" style={{ padding: 28 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: 12,
                      marginBottom: 12,
                    }}
                  >
                    <h3
                      style={{
                        fontFamily: "var(--display)",
                        fontSize: 22,
                        fontWeight: 500,
                        letterSpacing: "-0.02em",
                        margin: 0,
                        color: "var(--ink-cream)",
                      }}
                    >
                      {f.name}
                    </h3>
                    <span
                      className="a-pill"
                      style={{
                        color: f.progress ? "var(--ember)" : "var(--ink-cream)",
                        borderColor: f.progress ? "rgba(208,244,56,0.4)" : "var(--aline-2)",
                      }}
                    >
                      <span className="dot" />
                      {f.status}
                    </span>
                  </div>
                  <p style={{ color: "var(--ink-cream-d)", fontSize: 15, lineHeight: 1.6, margin: 0 }}>{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="a-section" id="data">
          <div className="a-wrap">
            <div className="a-section-head">
              <div>
                <span className="a-eyebrow">Data handling</span>
                <h2 className="h-section" style={{ marginTop: 18 }}>
                  Your data stays <em>your</em> data.
                </h2>
              </div>
              <p className="lede" style={{ justifySelf: "end" }}>
                We don&apos;t move data outside customer environments to make our product work. Customer data is not
                used to train shared models.
              </p>
            </div>
          </div>
        </section>

        <section className="a-section" id="responsible-ai">
          <div className="a-wrap">
            <div className="a-section-head">
              <div>
                <span className="a-eyebrow">Responsible AI</span>
                <h2 className="h-section" style={{ marginTop: 18 }}>
                  Assist, don&apos;t <em>replace</em>.
                </h2>
              </div>
              <p className="lede" style={{ justifySelf: "end" }}>
                Every ArqAI Labs engagement is designed to assist a human professional. The AI surfaces evidence and
                reasoning. The human makes the consequential decision.
              </p>
            </div>
          </div>
        </section>

        <section className="a-section">
          <div className="a-wrap" style={{ textAlign: "center" }}>
            <h2 className="h-section" style={{ maxWidth: "20ch", marginInline: "auto" }}>
              Request control <em>documentation</em>.
            </h2>
            <p className="lede" style={{ marginTop: 20, marginInline: "auto" }}>
              Detailed control documentation is shared under NDA.
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 32, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/contact" className="a-btn a-btn-primary">
                Request documentation
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
