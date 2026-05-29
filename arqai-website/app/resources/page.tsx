import Link from "next/link";
import { Metadata } from "next";
import { ArrowIcon, DarkShell } from "@/components/site-dark/DarkShell";
import { SignalStrip } from "@/components/site-dark/InternalVisuals";

export const metadata: Metadata = {
  title: "Resources | ArqAI Labs",
  description:
    "ArqAI Labs resources for enterprise AI leaders: blogs, case studies, whitepapers, webinars, and trust material for production AI workflows.",
};

const resources = [
  {
    title: "Blog",
    label: "Field notes",
    body:
      "Practical thinking on agentic workflows, governance, enterprise AI delivery, and the operating patterns that move AI past pilots.",
    href: "/blog",
    image: "/img/blog/preview/arqmesh.webp",
  },
  {
    title: "Case studies",
    label: "Proof",
    body:
      "Implementation stories and operating lessons from teams using AI to improve complex enterprise workflows.",
    href: "/case-studies",
    image: "/img/services/Manufacturing-Autonomous-Maintenance-With-Scoped-Agent-Control.jpg",
  },
  {
    title: "Whitepapers",
    label: "Guides",
    body:
      "Downloadable playbooks for governance-first AI programs, workflow selection, and production readiness.",
    href: "/resources/whitepapers",
    image: "/img/services/Healthcare-Real-Time-Risk-Stratification-With-Built-In-Compliance.jpg",
  },
  {
    title: "Webinars",
    label: "Conversations",
    body:
      "Live and on-demand sessions for leaders building governed AI systems inside real operating environments.",
    href: "/webinars",
    image: "/img/cta/latest-bg.jpg",
  },
];

const tracks = [
  "Selecting the right workflow for production AI",
  "Designing human review and policy controls",
  "Connecting AI to enterprise systems without rip-and-replace",
  "Measuring value after the first release",
];

export default function ResourcesPage() {
  return (
    <DarkShell>
      <section className="a-hero">
        <div className="a-hero-grid" />
        <div className="a-wrap" style={{ position: "relative" }}>
          <span className="a-pill">
            <span className="dot" /> Resources
          </span>
          <div className="a-section-head" style={{ marginTop: 28, alignItems: "start" }}>
            <div>
              <h1 className="h-display" style={{ maxWidth: "13ch" }}>
                Thinking for teams turning AI into operating advantage.
              </h1>
            </div>
            <div>
              <p className="lede">
                Browse practical writing, proof, guides, and conversations for enterprise teams moving from AI
                experiments to governed workflows that people use every day.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 28 }}>
                <Link href="/engage-us" className="a-btn a-btn-primary">
                  Get Started <ArrowIcon className="arrow" />
                </Link>
                <Link href="/blog" className="a-btn a-btn-ghost">
                  Read the blog
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="a-section">
        <div className="a-wrap">
          <SignalStrip
            label="Knowledge hub"
            title="Practical material for production AI decisions."
            body="The useful questions are rarely model-only questions. The resources here focus on workflow selection, operating metrics, integration, governance, adoption, and expansion."
            variant="evidence"
            points={tracks}
          />
        </div>
      </section>

      <section className="a-section">
        <div className="a-wrap">
          <div className="resource-grid">
            {resources.map((resource) => (
              <Link href={resource.href} className="resource-card" key={resource.href}>
                <div className="resource-card-media" style={{ backgroundImage: `url(${resource.image})` }} aria-hidden="true" />
                <div className="resource-card-shade" aria-hidden="true" />
                <div className="resource-card-body">
                  <span className="a-tag">{resource.label}</span>
                  <h2>{resource.title}</h2>
                  <p>{resource.body}</p>
                  <span className="resource-card-link">
                    Explore <ArrowIcon className="arrow" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="a-section">
        <div className="a-wrap">
          <div className="cta-strip">
            <h2 className="h-section" style={{ marginTop: 0, maxWidth: "18ch" }}>
              Want a sharper point of view for your workflow?
            </h2>
            <p className="lede" style={{ marginTop: 18, maxWidth: "62ch" }}>
              Bring us the workflow, the systems involved, and the decision your team wants to improve. We will help
              turn the question into a buildable path.
            </p>
            <Link href="/engage-us" className="a-btn a-btn-primary" style={{ marginTop: 28 }}>
              Get Started <ArrowIcon className="arrow" />
            </Link>
          </div>
        </div>
      </section>
    </DarkShell>
  );
}
