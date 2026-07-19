import Link from "next/link";
import { Metadata } from "next";
import { PlatformStructuredData } from "@/components/seo/StructuredData";
import V5SiteLayout from "@/components/home-v5/V5SiteLayout";
import ClosingCta from "@/components/v6/ClosingCta";
import FAQStatic from "@/components/home-v5/FAQStatic";
import { ArrowRight, ArrowUpRight } from "@/components/home-v5/icons";

// One list feeds both the visible FAQ section and the FAQPage JSON-LD, so
// schema and on-page content stay in parity.
const faqs = [
  {
    question: "What is the ArqAI Operating Fabric?",
    answer:
      "The ArqAI Operating Fabric is the architecture we use to turn model output into governed workflow execution across orchestration, integrations, review, evidence, and monitoring.",
  },
  {
    question: "How does ArqAI handle governance?",
    answer:
      "Governance is designed into the workflow through permissions, policy checks, approval paths, human review, audit trails, and exception handling.",
  },
  {
    question: "Does ArqAI replace existing enterprise systems?",
    answer:
      "No. ArqAI connects AI workflows to the CRM, ERP, ITSM, data platforms, identity, knowledge, and operating tools already running the business.",
  },
  {
    question: "Is the Operating Fabric a standalone product we license?",
    answer:
      "No. It is the architecture every ArqAI Labs engagement runs on, delivered through services and accelerators and adapted to your systems, data, and controls rather than licensed as a standalone platform.",
  },
];

export const metadata: Metadata = {
  title: "Platform: The Operating Fabric for Production AI",
  description:
    "The ArqAI Operating Fabric turns models into governed workflow execution across orchestration, integrations, evidence, controls, and managed AI operations.",
  alternates: { canonical: "https://thearq.ai/platform" },
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
    <V5SiteLayout>
      <PlatformStructuredData faqs={faqs} />

      {/* Hero */}
      <section className="v5-page-hero">
        <div className="v5-container">
          <div className="v5-page-hero-inner">
            <span className="v5-badge">
              <span className="v5-badge-dot" />
              Platform
            </span>
            <h1 className="v5-h1">The operating fabric for production AI workflows.</h1>
            <p className="v5-lead">
              ArqAI is not a generic model wrapper. It is the architecture we use to move
              enterprise AI from useful output to governed business execution: workflow
              intelligence, orchestration, integrations, evidence, controls, and an
              operating loop that keeps improving after launch.
            </p>
            <div className="v5-hero-actions">
              <Link href="/engage-us" className="v5-btn v5-btn-primary">
                Get Started <ArrowRight />
              </Link>
              <Link href="/services" className="v5-btn v5-btn-ghost">
                View services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Four layers */}
      <section className="v5-section v5-bg-grey">
        <div className="v5-container">
          <div className="v5-section-head">
            <span className="v5-eyebrow">Operating fabric</span>
            <h2 className="v5-h2">Four layers that turn AI into execution.</h2>
            <p className="v5-lead">
              Each layer can be part of a services engagement, an accelerator rollout, or a
              managed AI operations program. The point is to build the whole path, not a
              clever fragment.
            </p>
          </div>

          <div className="v5-grid v5-grid-2">
            {layers.map((layer, index) => (
              <article id={layer.id} className="v5-card v5-numcard" key={layer.id}>
                <span className="v5-num">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="v5-h3">{layer.title}</h3>
                <p className="v5-body">{layer.body}</p>
                <div className="v5-card-more" style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
                  {layer.links.map((link) => (
                    <Link href={link.href} key={link.href} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                      {link.label} <ArrowUpRight />
                    </Link>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise standard + principles */}
      <section className="v5-section v5-bg-white">
        <div className="v5-container">
          <div className="v5-split">
            <div className="v5-split-copy">
              <span className="v5-eyebrow">Enterprise standard</span>
              <h2 className="v5-h2">Built for environments where the final decision still matters.</h2>
              <p className="v5-lead">
                The operating fabric is designed for regulated, data-rich, exception-heavy
                work where AI has to earn trust from operators, technology leaders, and risk
                owners at the same time.
              </p>
            </div>
            <div className="v5-card">
              <ul className="v5-list">
                {principles.map((principle) => (
                  <li key={principle}>{principle}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pathways */}
      <section className="v5-section v5-bg-grey">
        <div className="v5-container">
          <div className="v5-section-head">
            <span className="v5-eyebrow">Pathways</span>
            <h2 className="v5-h2">Choose the right starting point.</h2>
            <p className="v5-lead">
              The same operating fabric can support bespoke workflows, productized
              accelerator patterns, and ongoing AI operations. The starting point depends on
              how specific the work is and how fast the first release needs to land.
            </p>
          </div>

          <div className="v5-grid v5-grid-3">
            {pathways.map((pathway, index) => (
              <Link href={pathway.href} className="v5-card v5-card-link v5-numcard" key={pathway.href}>
                <span className="v5-num">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="v5-h3">{pathway.title}</h3>
                <p className="v5-body">{pathway.body}</p>
                <span className="v5-card-more">
                  Explore <ArrowRight />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ — visible content matching the FAQPage schema above */}
      <FAQStatic
        items={faqs}
        heading="Platform questions, answered."
        bg="white"
        withSchema={false}
      />

      {/* CTA band */}
      <ClosingCta
        heading={<>Bring us the workflow that should be operating differently.</>}
        sub="We will map the operating fabric around it: the systems, evidence, risk boundaries, users, approvals, integrations, and first release path."
        secondaryLabel="View services"
        secondaryHref="/services"
      />
    </V5SiteLayout>
  );
}
