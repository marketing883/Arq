import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import V5SiteLayout from "@/components/home-v5/V5SiteLayout";
import { ArrowRight } from "@/components/home-v5/icons";
import { services } from "@/lib/data/services";

export const metadata: Metadata = {
  title: "Services | ArqAI Labs",
  description:
    "Service lines for production AI workflows: strategy, agentic buildout, integration, governance, vertical acceleration, and managed AI operations.",
  alternates: { canonical: "https://thearq.ai/services" },
};

const paths = [
  {
    title: "Advise where the workflow is still unclear.",
    body:
      "Start with the operating problem, the decision owner, the systems, the risk boundary, and the metric leadership will actually fund.",
    href: "/services/workflow-strategy",
  },
  {
    title: "Build where AI has to act inside real systems.",
    body:
      "Design agents, copilots, automations, retrieval, review loops, and integration paths that reflect how the work is done today.",
    href: "/services/agentic-ai-buildout",
  },
  {
    title: "Run where production value has to keep compounding.",
    body:
      "Monitor performance, tune prompts and policies, support users, and expand from the first governed workflow to the next.",
    href: "/services/managed-ai-operations",
  },
];

export default function ServicesPage() {
  return (
    <V5SiteLayout>
      {/* Hero */}
      <section className="v5-page-hero">
        <div className="v5-container">
          <div className="v5-page-hero-inner">
            <span className="v5-badge">
              <span className="v5-badge-dot" />
              Services
            </span>
            <h1 className="v5-h1">Services for turning AI into governed operating work.</h1>
            <p className="v5-lead">
              ArqAI Labs helps enterprises select the right workflow, engineer the agentic
              system, connect it to the stack, wrap it in controls, and operate it after
              launch. The work is services-led when the operating reality is too specific for
              a generic product.
            </p>
            <div className="v5-hero-actions">
              <Link href="/engage-us" className="v5-btn v5-btn-primary">
                Get Started <ArrowRight />
              </Link>
              <Link href="/platform" className="v5-btn v5-btn-ghost">
                See the operating fabric
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* The three postures */}
      <section className="v5-section v5-bg-grey">
        <div className="v5-container">
          <div className="v5-section-head">
            <span className="v5-eyebrow">Service map</span>
            <h2 className="v5-h2">The service line follows the production path.</h2>
            <p className="v5-lead">
              Strategy, buildout, integration, governance, acceleration, and operations are
              not separate boxes. They are the connected path from a workflow problem to a
              running AI system.
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

      {/* Service lines grid */}
      <section className="v5-section v5-bg-white">
        <div className="v5-container">
          <div className="v5-section-head">
            <span className="v5-eyebrow">Service lines</span>
            <h2 className="v5-h2">Capabilities that compound into one system.</h2>
            <p className="v5-lead">
              Each line can stand alone, but the strongest engagements connect them into one
              production track: workflow strategy, build, integration, governance,
              accelerator fit, and managed operations.
            </p>
          </div>

          <div className="v5-grid v5-grid-3">
            {services.map((service, index) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="v5-card v5-card-link"
                style={{ padding: 0, overflow: "hidden" }}
              >
                <div className="v5-svc-media">
                  <Image
                    src={service.image}
                    alt=""
                    fill
                    sizes="(min-width: 1100px) 33vw, (min-width: 700px) 50vw, 100vw"
                    style={{ objectFit: "cover" }}
                  />
                  <span className="v5-svc-num">{String(index + 1).padStart(2, "0")}</span>
                </div>
                <div style={{ padding: 26, display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
                  <h3 className="v5-h3">{service.title}</h3>
                  <p className="v5-body">{service.summary}</p>
                  <span className="v5-card-more">
                    Learn more <ArrowRight />
                  </span>
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
            <h2 className="v5-h2">Start with the workflow that needs to change.</h2>
            <p className="v5-lead">
              We will help decide whether the right path is a strategy sprint, a bespoke
              agentic build, an accelerator, or managed operations around an existing
              production workflow.
            </p>
            <div className="v5-cta-card-actions">
              <Link href="/engage-us" className="v5-btn v5-btn-primary">
                Get Started <ArrowRight />
              </Link>
              <Link href="/accelerators" className="v5-btn v5-btn-ghost">
                Explore accelerators
              </Link>
            </div>
          </div>
        </div>
      </section>
    </V5SiteLayout>
  );
}
