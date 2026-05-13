import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "@/components/site-dark/SiteNav";
import { SiteFooter } from "@/components/site-dark/SiteFooter";

export const metadata: Metadata = {
  title: "About",
  description:
    "ArqAI Labs is an AI engineering studio. Production AI, bespoke to your operation. Backed by ACI Infotech.",
};

const beliefs = [
  {
    no: "01",
    title: "Tuned beats templated.",
    body: "Every operation has its own quirks. Off-the-shelf AI averages them away. We build to the quirks.",
  },
  {
    no: "02",
    title: "Production beats pilots.",
    body: "Most enterprise AI never makes it past the sandbox. We engineer for production from day one. That is the only standard we ship at.",
  },
  {
    no: "03",
    title: "Engineers, not consultants.",
    body: "A lean team of senior AI engineers. We would rather build than describe.",
  },
];

const team = [
  { name: "Jagannadh Varma Kanumuri", role: "Founder & CEO" },
  { name: "Habib Mehmoodi", role: "VP, Strategy & Innovation" },
  { name: "Amit Alshaikh", role: "Head of AI Engineering" },
  { name: "Naresh Naidu", role: "Head of Delivery" },
];

// Kept dormant while the public team section is redesigned.
const showLeadershipSection = false;

export default function AboutPage() {
  return (
    <div className="arq-dark min-h-screen">
      <SiteNav />
      <main>
        {/* Hero */}
        <section className="a-section" style={{ paddingTop: "clamp(140px, 16vh, 200px)" }}>
          <div className="a-wrap">
            <span className="a-eyebrow">About</span>
            <h1 className="h-display" style={{ marginTop: 18, maxWidth: "18ch" }}>
              We build AI for the way people <em>actually</em> work.
            </h1>
            <p className="lede" style={{ marginTop: 28, maxWidth: "62ch" }}>
              ArqAI Labs is an AI engineering studio. We design, build, deploy, and run production AI for operations
              that don&apos;t fit off-the-shelf. We are an engineering team, not a consulting practice. We ship the
              work; we do not decorate the deck.
            </p>
          </div>
        </section>

        {/* Beliefs */}
        <section className="a-section" id="beliefs">
          <div className="a-wrap">
            <div className="a-section-head">
              <div>
                <span className="a-eyebrow">What we believe</span>
                <h2 className="h-section" style={{ marginTop: 18 }}>
                  Three things we will <em>not</em> compromise on.
                </h2>
              </div>
              <p className="lede" style={{ justifySelf: "end" }}>
                These are not aspirations. They are the rules of every engagement we run.
              </p>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: 1,
                background: "var(--aline)",
                border: "1px solid var(--aline)",
                borderRadius: 20,
                overflow: "hidden",
              }}
            >
              <div className="about-beliefs-grid">
                {beliefs.map((b) => (
                  <div
                    key={b.no}
                    style={{
                      background: "var(--ink-2)",
                      padding: 32,
                      display: "flex",
                      flexDirection: "column",
                      gap: 18,
                      minHeight: 260,
                    }}
                  >
                    <span className="kicker" style={{ color: "var(--ember)" }}>
                      {b.no}
                    </span>
                    <h3
                      style={{
                        fontFamily: "var(--display)",
                        fontSize: 24,
                        fontWeight: 500,
                        letterSpacing: "-0.02em",
                        margin: 0,
                        color: "var(--ink-cream)",
                      }}
                    >
                      {b.title}
                    </h3>
                    <p style={{ color: "var(--ink-cream-d)", fontSize: 14.5, lineHeight: 1.55, margin: 0 }}>{b.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {showLeadershipSection ? (
          <section className="a-section" id="leadership">
            <div className="a-wrap">
              <div className="a-section-head">
                <div>
                  <span className="a-eyebrow">Leadership</span>
                  <h2 className="h-section" style={{ marginTop: 18 }}>
                    The team building it.
                  </h2>
                </div>
                <p className="lede" style={{ justifySelf: "end" }}>
                  ACI Infotech, our parent, has spent over a decade delivering Fortune 500 technology programmes in
                  regulated industries. The team that builds and deploys ArqAI Labs work is that same team.
                </p>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: 16,
                }}
              >
                {team.map((m) => (
                  <div className="a-card" key={m.name} style={{ minHeight: 160 }}>
                    <div
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: "50%",
                        background: "rgba(208,244,56,0.10)",
                        border: "1px solid rgba(208,244,56,0.25)",
                        display: "grid",
                        placeItems: "center",
                        color: "var(--ember)",
                        fontFamily: "var(--display)",
                        fontSize: 22,
                        fontWeight: 500,
                        letterSpacing: "-0.02em",
                        marginBottom: 16,
                      }}
                    >
                      {m.name.charAt(0)}
                    </div>
                    <h4 style={{ color: "var(--ink-cream)", fontSize: 16, fontWeight: 500, margin: "0 0 4px" }}>
                      {m.name}
                    </h4>
                    <p style={{ color: "var(--ink-cream-d)", fontSize: 13, margin: 0 }}>{m.role}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {/* ACI parent */}
        <section className="a-section" id="parent">
          <div className="a-wrap">
            <div className="a-section-head">
              <div>
                <span className="a-eyebrow">Our parent</span>
                <h2 className="h-section" style={{ marginTop: 18 }}>
                  Backed by enterprise <em>delivery depth</em>.
                </h2>
              </div>
              <p className="lede" style={{ justifySelf: "end" }}>
                ArqAI Labs is an AI engineering studio backed by ACI Infotech, a privately held technology services
                firm. ACI works with senior technology leaders across financial services, healthcare, insurance,
                telecommunications, and manufacturing.
              </p>
            </div>
            <div className="a-card" style={{ padding: "32px 36px" }}>
              <p style={{ color: "var(--ink-cream-d)", fontSize: 16, lineHeight: 1.65, margin: 0, maxWidth: "70ch" }}>
                The relationship gives ArqAI Labs the implementation playbooks, the delivery muscle, and the access to
                enterprise customers that most AI engineering studios don&apos;t have. Same engineering standard.
                Same end-to-end ownership. Same team, all the way from strategy to run.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="a-section">
          <div className="a-wrap" style={{ textAlign: "center" }}>
            <h2 className="h-section" style={{ maxWidth: "22ch", marginInline: "auto" }}>
              Want to <em>work</em> with us, build with us, or sell with us?
            </h2>
            <div style={{ display: "flex", gap: 12, marginTop: 32, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/engage-us" className="a-btn a-btn-primary">
                Get Started
              </Link>
              <Link href="/careers" className="a-btn a-btn-ghost">
                See open roles
              </Link>
              <Link href="/contact" className="a-btn a-btn-ghost">
                Become a partner
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
      <style>{`
        @media (min-width: 800px) {
          .arq-dark .about-beliefs-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1px;
            background: var(--aline);
          }
        }
        @media (max-width: 799px) {
          .arq-dark .about-beliefs-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1px;
            background: var(--aline);
          }
        }
      `}</style>
    </div>
  );
}
