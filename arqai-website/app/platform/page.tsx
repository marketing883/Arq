import Link from "next/link";
import { Metadata } from "next";
import { PlatformStructuredData } from "@/components/seo/StructuredData";
import { ArrowIcon, CheckIcon, DarkShell } from "@/components/site-dark/DarkShell";
import { HeroImagePanel, SignalStrip } from "@/components/site-dark/InternalVisuals";

export const metadata: Metadata = {
  title: "Platform | ArqAI Labs",
  description:
    "The ArqAI Operating Fabric turns models into governed workflow execution across orchestration, integrations, evidence, controls, and managed AI operations.",
};

const layers = [
  {
    id: "workflow-intelligence",
    title: "Workflow intelligence",
    body:
      "We map the decisions, handoffs, evidence, exceptions, and operating metrics that define how work actually moves before any agent is designed.",
    links: [
      { label: "Workflow Strategy", href: "/services/workflow-strategy" },
      { label: "Use cases", href: "/use-cases" },
    ],
  },
  {
    id: "governance-plane",
    title: "Governance plane",
    body:
      "Permissions, policy checks, approval paths, human review, audit trails, and exception handling are designed into the workflow from the start.",
    links: [
      { label: "Governance by Design", href: "/services/governance-by-design" },
      { label: "Trust", href: "/trust" },
    ],
  },
  {
    id: "integration-layer",
    title: "Integration layer",
    body:
      "The system connects to the stack already running the business: CRM, ERP, ITSM, data platforms, identity, knowledge bases, and operating tools.",
    links: [
      { label: "Enterprise Integration", href: "/services/enterprise-integration" },
      { label: "Agentic AI Buildout", href: "/services/agentic-ai-buildout" },
    ],
  },
  {
    id: "operating-loop",
    title: "Operating loop",
    body:
      "After launch, the workflow is monitored, evaluated, tuned, and expanded so performance improves as users, data, and policy conditions change.",
    links: [
      { label: "Managed AI Operations", href: "/services/managed-ai-operations" },
      { label: "How we work", href: "/how-we-work" },
    ],
  },
];

const principles = [
  "Start with the workflow metric, not the model benchmark.",
  "Keep human authority explicit at every high-risk decision point.",
  "Log the evidence behind recommendations, actions, approvals, and overrides.",
  "Connect to existing systems instead of creating another disconnected workbench.",
  "Use accelerators where patterns repeat, and bespoke engineering where the work is unique.",
  "Treat launch as the start of an operating cadence, not the finish line.",
];

const pathways = [
  {
    title: "Services-led build",
    body:
      "Best when the workflow is specific, cross-functional, and important enough to need bespoke engineering around your data, controls, and systems.",
    href: "/services",
  },
  {
    title: "Accelerator-backed build",
    body:
      "Best when the pattern is already proven across claims, financial crime, loyalty, service operations, supply chain, or security operations.",
    href: "/accelerators",
  },
  {
    title: "Managed AI operations",
    body:
      "Best when the workflow is live, business-critical, and needs monitoring, tuning, user support, and expansion after launch.",
    href: "/services/managed-ai-operations",
  },
];

export default function PlatformPage() {
  return (
    <>
      <PlatformStructuredData />
      <DarkShell>
      <section className="a-hero">
        <div className="a-hero-grid" />
        <div className="a-wrap" style={{ position: "relative" }}>
          <div className="detail-hero-grid" style={{ display: "grid", gap: 48, alignItems: "center" }}>
            <div>
              <span className="a-pill">
                <span className="dot" /> Platform
              </span>
              <h1 className="h-display" style={{ marginTop: 28, maxWidth: "13ch" }}>
                The operating fabric for production AI workflows.
              </h1>
              <p className="lede" style={{ marginTop: 28, maxWidth: "62ch" }}>
                ArqAI is not a generic model wrapper. It is the architecture we use to move enterprise AI from useful
                output to governed business execution: workflow intelligence, orchestration, integrations, evidence,
                controls, and an operating loop that keeps improving after launch.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 30 }}>
                <Link href="/engage-us" className="a-btn a-btn-primary">
                  Get Started <ArrowIcon className="arrow" />
                </Link>
                <Link href="/services" className="a-btn a-btn-ghost">
                  View services
                </Link>
              </div>
            </div>

            <HeroImagePanel
              image="/img/hero/arq-layer.png"
              alt="ArqAI operating fabric"
              label="Operating fabric"
              title="From signal to governed action"
              variant="orbit"
              priority
            />
          </div>
        </div>
      </section>

      <section className="a-section">
        <div className="a-wrap">
          <SignalStrip
            label="Platform architecture"
            title="Models answer. Operating fabric makes the work move."
            body="The difference between a demo and an operating system is everything around the model: context, tools, permissions, review, observability, evidence, and ownership."
            variant="flow"
            points={["Context", "Tools", "Controls", "Evidence", "Improvement"]}
          />
        </div>
      </section>

      <section className="a-section">
        <div className="a-wrap">
          <div className="a-section-head">
            <div>
              <span className="a-eyebrow">Operating fabric</span>
              <h2 className="h-section" style={{ marginTop: 18 }}>
                Four layers that turn AI into execution.
              </h2>
            </div>
            <p className="lede">
              Each layer can be part of a services engagement, an accelerator rollout, or a managed AI operations
              program. The point is to build the whole path, not a clever fragment.
            </p>
          </div>

          <div className="platform-layers">
            {layers.map((layer, index) => (
              <article id={layer.id} className="platform-layer" key={layer.id}>
                <span className="num">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{layer.title}</h3>
                  <p>{layer.body}</p>
                  <div className="platform-layer-links">
                    {layer.links.map((link) => (
                      <Link href={link.href} key={link.href}>
                        {link.label} <ArrowIcon className="arrow" />
                      </Link>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="a-section">
        <div className="a-wrap">
          <div className="gap-split internal-story">
            <article className="a-card" style={{ padding: 32 }}>
              <span className="a-eyebrow">Enterprise standard</span>
              <h2 className="h-section" style={{ fontSize: "clamp(28px, 3.2vw, 44px)", marginTop: 18 }}>
                Built for environments where the final decision still matters.
              </h2>
              <p className="lede" style={{ marginTop: 18 }}>
                The operating fabric is designed for regulated, data-rich, exception-heavy work where AI has to earn
                trust from operators, technology leaders, and risk owners at the same time.
              </p>
            </article>
            <article className="a-card" style={{ padding: 32 }}>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 14 }}>
                {principles.map((principle) => (
                  <li key={principle} style={{ display: "flex", gap: 12, color: "var(--ink-cream-d)", lineHeight: 1.5 }}>
                    <span style={{ color: "var(--ember)", marginTop: 2 }}>
                      <CheckIcon />
                    </span>
                    {principle}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section className="a-section">
        <div className="a-wrap">
          <div className="a-section-head">
            <div>
              <span className="a-eyebrow">Pathways</span>
              <h2 className="h-section" style={{ marginTop: 18 }}>
                Choose the right starting point.
              </h2>
            </div>
            <p className="lede">
              The same operating fabric can support bespoke workflows, productized accelerator patterns, and ongoing
              AI operations. The starting point depends on how specific the work is and how fast the first release
              needs to land.
            </p>
          </div>

          <div className="pathway-list">
            {pathways.map((pathway, index) => (
              <Link href={pathway.href} className="pathway-row" key={pathway.href}>
                <span className="num">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{pathway.title}</h3>
                  <p>{pathway.body}</p>
                </div>
                <ArrowIcon className="arrow" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="a-section">
        <div className="a-wrap">
          <div className="cta-strip">
            <h2 className="h-section" style={{ marginTop: 0, maxWidth: "18ch" }}>
              Bring us the workflow that should be operating differently.
            </h2>
            <p className="lede" style={{ marginTop: 18, maxWidth: "62ch" }}>
              We will map the operating fabric around it: the systems, evidence, risk boundaries, users, approvals,
              integrations, and first release path.
            </p>
            <Link href="/engage-us" className="a-btn a-btn-primary" style={{ marginTop: 28 }}>
              Get Started <ArrowIcon className="arrow" />
            </Link>
          </div>
        </div>
      </section>
      </DarkShell>
    </>
  );
}
