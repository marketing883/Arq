import Link from "next/link";
import { Metadata } from "next";
import V5SiteLayout from "@/components/home-v5/V5SiteLayout";
import V5CtaSection from "@/components/home-v5/V5CtaSection";
import { ArrowRight } from "@/components/home-v5/icons";

export const metadata: Metadata = {
  title: "Resources | ArqAI Labs",
  description:
    "ArqAI Labs resources for enterprise AI leaders: blogs, case studies, whitepapers, webinars, and trust material for production AI workflows.",
  alternates: { canonical: "https://thearq.ai/resources" },
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
    <V5SiteLayout>
      {/* Hero */}
      <section className="v5-page-hero">
        <div className="v5-container">
          <div className="v5-page-hero-inner">
            <span className="v5-badge">
              <span className="v5-badge-dot" />
              Resources
            </span>
            <h1 className="v5-h1">Thinking for teams turning AI into operating advantage.</h1>
            <p className="v5-lead">
              Browse practical writing, proof, guides, and conversations for enterprise teams moving from AI
              experiments to governed workflows that people use every day.
            </p>
            <div className="v5-hero-actions">
              <Link href="/engage-us" className="v5-btn v5-btn-primary">
                Get Started <ArrowRight />
              </Link>
              <Link href="/blog" className="v5-btn v5-btn-ghost">
                Read the blog
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Knowledge hub */}
      <section className="v5-section v5-bg-grey">
        <div className="v5-container">
          <div className="v5-split">
            <div className="v5-split-copy">
              <span className="v5-eyebrow">Knowledge hub</span>
              <h2 className="v5-h2">Practical material for production AI decisions.</h2>
              <p className="v5-lead">
                The useful questions are rarely model-only questions. The resources here focus on workflow
                selection, operating metrics, integration, governance, adoption, and expansion.
              </p>
            </div>
            <div className="v5-card">
              <ul className="v5-list">
                {tracks.map((track) => (
                  <li key={track}>{track}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Resource grid */}
      <section className="v5-section v5-bg-white">
        <div className="v5-container">
          <div className="v5-blog-grid">
            {resources.map((resource) => (
              <Link href={resource.href} className="v5-blog-card" key={resource.href}>
                <div className="v5-blog-cover">
                  <img src={resource.image} alt={resource.title} loading="lazy" decoding="async" />
                </div>
                <div className="v5-blog-body">
                  <span className="v5-blog-meta">
                    <span className="v5-blog-cat">{resource.label}</span>
                  </span>
                  <h2 className="v5-h3">{resource.title}</h2>
                  <p className="v5-body">{resource.body}</p>
                  <span className="v5-card-more">
                    Explore <ArrowRight />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA band */}
      <V5CtaSection>
            <h2 className="v5-h2">Want a sharper point of view for your workflow?</h2>
            <p className="v5-lead">
              Bring us the workflow, the systems involved, and the decision your team wants to improve. We will help
              turn the question into a buildable path.
            </p>
            <div className="v5-cta-card-actions">
              <Link href="/engage-us" className="v5-btn v5-btn-primary">
                Get Started <ArrowRight />
              </Link>
            </div>
      </V5CtaSection>
    </V5SiteLayout>
  );
}
