import type { Metadata } from "next";
import Link from "next/link";
import V5SiteLayout from "@/components/home-v5/V5SiteLayout";
import ClosingCta from "@/components/v6/ClosingCta";
import { ArrowRight } from "@/components/home-v5/icons";
import { generateBreadcrumbSchema } from "@/lib/seo/structured-data";

// The one real, publishable ArqAI Labs engagement, told in full. This static
// route intentionally takes precedence over the CMS-driven [slug] route so
// the site's canonical proof exists independent of database state.

const CANONICAL = "https://thearq.ai/case-studies/tpa-blind-spot-assessment";
const TITLE = "Case Study: Undetected Waste Found at a Mid-Size TPA Rated Fully Compliant";
const DESCRIPTION =
  "A mid-size third-party administrator rated fully compliant by its payment-integrity vendor ran one ArqAI Blind Spot Assessment. It surfaced significant undetected waste and sharply cut manual claims-review time.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: CANONICAL },
  openGraph: {
    type: "article",
    title: `${TITLE} | ArqAI Labs`,
    description: DESCRIPTION,
    url: CANONICAL,
  },
  twitter: {
    card: "summary_large_image",
    title: `${TITLE} | ArqAI Labs`,
    description: DESCRIPTION,
    site: "@The_ArqAI",
    creator: "@The_ArqAI",
  },
};

const results = [
  {
    value: "Surfaced",
    label: "Undetected waste",
    detail:
      "Fraud, waste, abuse, and claims-leakage signals across historical claims the incumbent tooling had already cleared.",
  },
  {
    value: "Cut",
    label: "Manual review time",
    detail:
      "The claims team spent far less time on manual review, because flagged cases arrived with the evidence already assembled.",
  },
  {
    value: "1",
    label: "Assessment engagement",
    detail:
      "The findings came from a single Blind Spot Assessment — not a multi-year platform rollout.",
  },
];

const steps = [
  {
    title: "Ingest what already exists",
    body: "The assessment runs on historical claims, provider, policy, and member data the TPA already has — no new pipelines, no system migration, no disruption to live operations.",
  },
  {
    title: "Correlate signals rule engines score in isolation",
    body: "ArqFWA reads billing patterns, provider behavior, and member history as one risk picture. Cases that look clean to isolated rule hits become visible when the signals are read together.",
  },
  {
    title: "Score against a payer-specific pattern library",
    body: "The analysis draws on a library of 120+ TPA-specific fraud, waste, and abuse patterns — the operating patterns of payer work that generic tools were never designed to look for.",
  },
  {
    title: "Deliver findings a reviewer can defend",
    body: "Every flagged case carries the evidence, peer comparisons, and policy references an investigator needs to act — no black-box scores, nothing the team has to take on faith.",
  },
];

function StructuredData() {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${CANONICAL}#article`,
        headline: TITLE,
        description: DESCRIPTION,
        url: CANONICAL,
        author: { "@type": "Organization", name: "ArqAI Labs", url: "https://thearq.ai" },
        publisher: { "@type": "Organization", name: "ArqAI Labs", url: "https://thearq.ai" },
        articleSection: "Case Study",
        about: [
          "Payment integrity",
          "Fraud, waste, and abuse detection",
          "Healthcare payer operations",
          "Third-party administrators",
        ],
        mainEntityOfPage: CANONICAL,
      },
      generateBreadcrumbSchema([
        { name: "Home", url: "https://thearq.ai" },
        { name: "Case Studies", url: "https://thearq.ai/case-studies" },
        { name: "TPA Blind Spot Assessment", url: CANONICAL },
      ]),
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}

export default function TpaBlindSpotCaseStudy() {
  return (
    <V5SiteLayout>
      <StructuredData />

      {/* Hero */}
      <section className="v5-page-hero">
        <div className="v5-container">
          <div className="v5-page-hero-inner">
            <div className="v5-crumbs" style={{ marginBottom: 24 }}>
              <Link href="/">Home</Link>
              <span>/</span>
              <Link href="/case-studies">Case Studies</Link>
              <span>/</span>
              <span style={{ color: "var(--v5-ink-soft)" }}>TPA Blind Spot Assessment</span>
            </div>
            <span className="v5-badge">
              <span className="v5-badge-dot" />
              Healthcare Payers · Payment Integrity
            </span>
            <h1 className="v5-h1">
              Rated fully compliant. Significant waste still on the table.
            </h1>
            <p className="v5-lead">
              A mid-size third-party administrator ran a single ArqAI Blind Spot
              Assessment over claims its payment-integrity vendor had already cleared.
              The assessment surfaced significant undetected waste — and sharply cut the
              team&apos;s manual review time while doing it.
            </p>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="v5-section v5-bg-grey">
        <div className="v5-container">
          <div className="v5-section-head">
            <span className="v5-eyebrow">The results</span>
            <h2 className="v5-h2">What one assessment produced.</h2>
          </div>
          <div className="v5-grid v5-grid-3">
            {results.map((r) => (
              <div className="v5-card" key={r.label}>
                <strong
                  style={{
                    display: "block",
                    fontSize: 40,
                    lineHeight: 1.1,
                    color: "var(--v5-ink)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {r.value}
                </strong>
                <h3 className="v5-h3" style={{ marginTop: 10 }}>{r.label}</h3>
                <p className="v5-body" style={{ marginTop: 8 }}>{r.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Context */}
      <section className="v5-section v5-bg-white">
        <div className="v5-container">
          <div className="v5-split">
            <div className="v5-split-copy">
              <span className="v5-eyebrow">The situation</span>
              <h2 className="v5-h2">&ldquo;Fully compliant&rdquo; is not the same as &ldquo;nothing left to find.&rdquo;</h2>
              <p className="v5-lead">
                The TPA&apos;s incumbent payment-integrity vendor had rated the operation
                fully compliant. On paper, the program was working.
              </p>
              <p className="v5-body" style={{ marginTop: 16 }}>
                That rating reflected what the incumbent tooling was designed to look
                for: individual claims scored against generic payer rules. What it could
                not see was the pattern-level picture — billing behavior that only looks
                anomalous when you correlate it across providers, members, and time.
                That gap between &ldquo;passed the rules&rdquo; and &ldquo;nothing left to
                find&rdquo; is exactly what a Blind Spot Assessment exists to measure.
              </p>
            </div>
            <div className="v5-card">
              <span className="v5-eyebrow">The engagement</span>
              <ul className="v5-list" style={{ marginTop: 14 }}>
                <li>Client: mid-size third-party administrator (anonymized)</li>
                <li>Prior state: rated fully compliant by the incumbent payment-integrity vendor</li>
                <li>Scope: one ArqAI Blind Spot Assessment over historical claims data</li>
                <li>Engine: ArqFWA cross-signal analysis and explainable case scoring</li>
                <li>Findings: significant undetected waste and claims leakage</li>
                <li>Side effect: a sharp reduction in manual claims-review time</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How it worked */}
      <section className="v5-section v5-bg-grey">
        <div className="v5-container">
          <div className="v5-section-head">
            <span className="v5-eyebrow">How it worked</span>
            <h2 className="v5-h2">What a Blind Spot Assessment actually does.</h2>
            <p className="v5-lead">
              No rip-and-replace, no long deployment. The assessment reads the data the
              operation already has and reports what the current program cannot see.
            </p>
          </div>
          <div className="v5-grid v5-grid-2">
            {steps.map((step, i) => (
              <div className="v5-card v5-numcard" key={step.title}>
                <span className="v5-num">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="v5-h3">{step.title}</h3>
                <p className="v5-body">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why review time fell */}
      <section className="v5-section v5-bg-white">
        <div className="v5-container">
          <div className="v5-split">
            <div className="v5-split-copy">
              <span className="v5-eyebrow">Less review, more findings</span>
              <h2 className="v5-h2">Why review time fell while findings went up.</h2>
              <p className="v5-body">
                Traditional payment-integrity tooling produces thousands of isolated
                rule hits, and the claims team pays for every false positive with
                review hours. The assessment inverted that: instead of more alerts, the
                team received fewer, better cases — each one already carrying the
                evidence, peer comparisons, and policy references a reviewer needs to
                make a defensible decision. Less time hunting for context, more time
                acting on cases that matter. That is where the sharp reduction in
                manual review time came from.
              </p>
            </div>
            <div className="v5-card">
              <span className="v5-eyebrow">Built with</span>
              <h3 className="v5-h3" style={{ marginTop: 12 }}>ArqFWA</h3>
              <p className="v5-body" style={{ marginTop: 8 }}>
                The payment-integrity accelerator behind the assessment: cross-signal
                anomaly detection, explainable case scoring, and provider risk
                profiling for payer operations.
              </p>
              <Link
                href="/accelerators/arqfwa"
                className="v5-card-more"
                style={{ marginTop: 14, display: "inline-flex", alignItems: "center", gap: 6 }}
              >
                Explore ArqFWA <ArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <ClosingCta
        heading="What would an assessment find in your claims data?"
        sub="If your payment-integrity program has been running on the same rules for years, the honest answer is: nobody knows yet. A Blind Spot Assessment is the fastest way to find out."
        ctaLabel="Request an assessment"
        secondaryLabel="Explore ArqFWA"
        secondaryHref="/accelerators/arqfwa"
      />
    </V5SiteLayout>
  );
}
