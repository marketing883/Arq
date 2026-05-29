import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { ArrowIcon, DarkShell } from "@/components/site-dark/DarkShell";
import { SignalStrip } from "@/components/site-dark/InternalVisuals";
import { services } from "@/lib/data/services";

export const metadata: Metadata = {
  title: "Services | ArqAI Labs",
  description:
    "Service lines for production AI workflows: strategy, agentic buildout, integration, governance, vertical acceleration, and managed AI operations.",
};

export default function ServicesPage() {
  return (
    <DarkShell>
      <section className="a-hero">
        <div className="a-hero-grid" />
        <div className="a-wrap" style={{ position: "relative" }}>
          <span className="a-pill">
            <span className="dot" /> Services
          </span>
          <div className="a-section-head" style={{ marginTop: 28, alignItems: "start" }}>
            <div>
              <h1 className="h-display" style={{ maxWidth: "13ch" }}>
                Services for turning AI into governed operating work.
              </h1>
            </div>
            <div>
              <p className="lede">
                ArqAI Labs helps enterprises select the right workflow, engineer the agentic system, connect it to the
                stack, wrap it in controls, and operate it after launch. The work is services-led when the operating
                reality is too specific for a generic product.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 28 }}>
                <Link href="/engage-us" className="a-btn a-btn-primary">
                  Get Started <ArrowIcon className="arrow" />
                </Link>
                <Link href="/platform" className="a-btn a-btn-ghost">
                  See the operating fabric
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="a-section">
        <div className="a-wrap">
          <SignalStrip
            label="Service map"
            title="The service line follows the production path."
            body="Strategy, buildout, integration, governance, acceleration, and operations are not separate boxes. They are the connected path from a workflow problem to a running AI system."
            variant="flow"
            points={["Discover", "Engineer", "Integrate", "Govern", "Operate"]}
          />
        </div>
      </section>

      <section className="a-section">
        <div className="a-wrap">
          <div className="pathway-list">
            {[
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
            ].map((path, index) => (
              <Link href={path.href} className="pathway-row" key={path.href}>
                <span className="num">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{path.title}</h3>
                  <p>{path.body}</p>
                </div>
                <ArrowIcon className="arrow" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="a-section">
        <div className="a-wrap">
          <div className="a-section-head">
            <div>
              <span className="a-eyebrow">Service lines</span>
              <h2 className="h-section" style={{ marginTop: 18 }}>
                Capabilities that compound into one system.
              </h2>
            </div>
            <p className="lede">
              Each line can stand alone, but the strongest engagements connect them into one production track: workflow
              strategy, build, integration, governance, accelerator fit, and managed operations.
            </p>
          </div>
          <div className="svc-grid relief-grid">
            {services.map((service, index) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="svc reveal in"
                data-d={(index % 3) + 1}
                style={{ color: "inherit", textDecoration: "none" }}
              >
                <div className="svc-media">
                  <Image
                    src={service.image}
                    alt=""
                    fill
                    sizes="(min-width: 1100px) 33vw, (min-width: 700px) 50vw, 100vw"
                    style={{ objectFit: "cover" }}
                  />
                  <div className="svc-media-shade" />
                  <div className="svc-media-icon">{String(index + 1).padStart(2, "0")}</div>
                </div>
                <h4>{service.title}</h4>
                <p>{service.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="a-section">
        <div className="a-wrap">
          <div className="cta-strip">
            <h2 className="h-section" style={{ marginTop: 0, maxWidth: "18ch" }}>
              Start with the workflow that needs to change.
            </h2>
            <p className="lede" style={{ marginTop: 18, maxWidth: "62ch" }}>
              We will help decide whether the right path is a strategy sprint, a bespoke agentic build, an accelerator,
              or managed operations around an existing production workflow.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 28 }}>
              <Link href="/engage-us" className="a-btn a-btn-primary">
                Get Started <ArrowIcon className="arrow" />
              </Link>
              <Link href="/accelerators" className="a-btn a-btn-ghost">
                Explore accelerators
              </Link>
            </div>
          </div>
        </div>
      </section>
    </DarkShell>
  );
}
