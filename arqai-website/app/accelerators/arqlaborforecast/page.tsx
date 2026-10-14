import Link from "next/link";
import { Metadata } from "next";
import V5SiteLayout from "@/components/home-v5/V5SiteLayout";
import { ArrowRight } from "@/components/home-v5/icons";
import { accelerators } from "@/lib/data/accelerators";
import {
  generateBreadcrumbSchema,
  generateFAQSchema,
} from "@/lib/seo/structured-data";
import AcceleratorForm from "@/components/accelerators/AcceleratorForm";

// A static route, so it takes precedence over app/accelerators/[id]. This page
// carries finalized copy that does not fit the data-driven accelerator
// template (no capabilities, use cases, metrics, or FAQs), so it renders that
// copy as provided, in the same visual system, rather than inventing the rest.

const NAME = "ArqLaborForecast";
const URL = "https://thearq.ai/accelerators/arqlaborforecast";

const TITLE =
  "Enterprise Labor Demand Forecasting & Predictive Workforce Roster Optimization";
const SUBTITLE =
  "Protect Margins with Automated Multi-Site Staffing Forecasts and Overtime and Agency Labor Cost Reduction";

const DEFINITION_Q = "What is zero-schema labor demand forecasting?";
const DEFINITION_A =
  "Zero-schema labor demand forecasting with Arqai Labor Forecast provides an enterprise workforce planning engine that converts raw HCM exports into forward-looking, site-and-department demand forecasts before the operating week begins. By evaluating historical operational data against planned rosters using localized machine learning models, the platform identifies staffing deficits early, generates ranked cross-site capacity recommendations, and prevents margin erosion driven by unbudgeted overtime and premium agency spend without requiring schema mapping or custom API development.";

// .v5-btn is nowrap; the finalized CTA label is long enough to overflow a phone.
const WRAP_BTN = { whiteSpace: "normal", lineHeight: 1.25, textAlign: "center" } as const;

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1920&q=62";
const heroSrc = (w: number) => HERO_IMAGE.replace(/w=\d+/, `w=${w}`);
const heroSrcSet = [960, 1280, 1600, 1920].map((w) => `${heroSrc(w)} ${w}w`).join(", ");

export const metadata: Metadata = {
  title: TITLE,
  description: SUBTITLE,
  keywords: [
    NAME,
    "Arqai Labor Forecast",
    "zero-schema labor demand forecasting",
    "predictive roster planning for multi-site enterprise operations",
    "cross-department labor reallocation and overtime prevention",
    "labor cost margin protection strategies",
    "ArqAI Labs",
  ],
  alternates: { canonical: URL },
  openGraph: {
    type: "website",
    url: URL,
    title: TITLE,
    description: SUBTITLE,
    siteName: "ArqAI Labs",
    images: [{ url: heroSrc(1600), alt: TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: SUBTITLE,
    images: [heroSrc(1600)],
    site: "@The_ArqAI",
  },
};

export default function ArqLaborForecastPage() {
  // ArqForecast is the closest sibling, so it leads the rail.
  const others = [
    ...accelerators.filter((a) => a.id === "arqforecast"),
    ...accelerators.filter((a) => a.id !== "arqforecast" && a.track === "Horizontal"),
  ].slice(0, 3);

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: NAME,
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "Labor demand forecasting",
    operatingSystem: "Cloud",
    description: DEFINITION_A,
    url: URL,
    image: heroSrc(1600),
    provider: {
      "@type": "Organization",
      name: "ArqAI Labs",
      url: "https://thearq.ai",
    },
  };
  const faqSchema = generateFAQSchema([{ question: DEFINITION_Q, answer: DEFINITION_A }]);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://thearq.ai" },
    { name: "Accelerators", url: "https://thearq.ai/accelerators" },
    { name: NAME, url: URL },
  ]);

  return (
    <V5SiteLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <link
        rel="preload"
        as="image"
        href={heroSrc(1920)}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        {...({ imageSrcSet: heroSrcSet, imageSizes: "100vw", fetchPriority: "high" } as any)}
      />

      {/* Hero */}
      <section className="v5-acc-hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="v5-acc-hero-img"
          src={heroSrc(1920)}
          srcSet={heroSrcSet}
          sizes="100vw"
          alt={TITLE}
          decoding="async"
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          {...({ fetchPriority: "high" } as any)}
        />
        <span className="v5-acc-hero-aurora" aria-hidden="true" />
        <span className="v5-acc-hero-sheen" aria-hidden="true" />
        <div className="v5-container">
          <div className="v5-acc-hero-body" style={{ maxWidth: 860 }}>
            <div className="v5-crumbs" style={{ marginBottom: 18 }}>
              <Link href="/accelerators">Accelerators</Link>
              <span>/</span>
              <span style={{ color: "#fff" }}>{NAME}</span>
            </div>
            {/* The finalized title runs two lines; the template's 78px cap is sized for a one-word name. */}
            <h1 className="v5-h1" style={{ fontSize: "clamp(32px, 4.6vw, 58px)", lineHeight: 1.08 }}>
              {TITLE}
            </h1>
            <h2
              className="v5-lead"
              style={{ color: "rgba(255,255,255,0.86)", fontWeight: 500, marginTop: 20, maxWidth: "52ch" }}
            >
              {SUBTITLE}
            </h2>
            <div className="v5-hero-actions">
              <Link href="#get-started" className="v5-btn v5-btn-primary" style={WRAP_BTN}>
                Schedule a 15-Minute Operational Audit <ArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Definition: answer-first, for people and answer engines alike */}
      <section className="v5-section v5-bg-grey">
        <div className="v5-container">
          <p className="v5-lead" style={{ maxWidth: 900, margin: 0, color: "var(--v5-ink-soft)" }}>
            <strong style={{ color: "var(--v5-ink)" }}>{DEFINITION_Q}</strong>{" "}
            <strong style={{ color: "var(--v5-ink)" }}>Zero-schema labor demand forecasting</strong>
            {DEFINITION_A.slice("Zero-schema labor demand forecasting".length)}
          </p>
        </div>
      </section>

      {/* Executive value proposition */}
      <section className="v5-section v5-bg-white">
        <div className="v5-container">
          <div className="v5-split">
            <div className="v5-split-copy" style={{ alignSelf: "start" }}>
              <h3 className="v5-h2">Executive Value Proposition</h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <p className="v5-lead" style={{ margin: 0 }}>
                For COOs, CFOs, and VPs of Operations, unbudgeted labor expenditure is rarely a
                forecasting failure; it is a lead-time failure. When operational demand shifts
                unexpectedly, static schedules force site managers into high-cost agency staffing or
                emergency overtime to maintain service levels.
              </p>
              <p className="v5-body" style={{ margin: 0, fontSize: 17, lineHeight: 1.7 }}>
                Arqai Labor Forecast establishes forward-looking operational control through{" "}
                <strong style={{ color: "var(--v5-ink)" }}>
                  predictive roster planning for multi-site enterprise operations
                </strong>
                , translating flat file exports from Workday, UKG, SAP SuccessFactors, or local
                spreadsheets into precise period-by-period labor requirements. By comparing projected
                demand against scheduled hours weeks in advance, enterprise leaders gain the
                visibility required for{" "}
                <strong style={{ color: "var(--v5-ink)" }}>
                  cross-department labor reallocation and overtime prevention
                </strong>
                , executing{" "}
                <strong style={{ color: "var(--v5-ink)" }}>labor cost margin protection strategies</strong>{" "}
                and enforcing operational governance across multi-site footprints without triggering
                costly IT integration projects.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Explore other accelerators (shared accelerator-page rail) */}
      <section className="v5-section v5-bg-white">
        <div className="v5-container">
          <div className="v5-section-head">
            <span className="v5-eyebrow">More accelerators</span>
            <h2 className="v5-h2">Explore the rest of the portfolio.</h2>
          </div>
          <div className="v5-grid v5-grid-3">
            {others.map((a) => (
              <Link
                href={`/accelerators/${a.id}`}
                className="v5-card v5-card-link"
                key={a.id}
                style={{ padding: 0, overflow: "hidden" }}
              >
                <div className="v5-acc-cover" style={{ backgroundImage: `url(${a.image})` }} aria-hidden="true">
                  <span className="v5-acc-name">{a.name}</span>
                </div>
                <div style={{ padding: 22, display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                  <span className="v5-card-eyebrow">{a.category}</span>
                  <p className="v5-body">{a.tagline}</p>
                  <span className="v5-card-more">View accelerator <ArrowRight /></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      {/* Conversion: the finalized CTA beside the standard accelerator form */}
      <section className="v5-section v5-bg-grey" id="get-started" style={{ scrollMarginTop: 96 }}>
        <div className="v5-container">
          <div className="v5-contact-grid">
            <aside>
              <div className="v5-card dark" style={{ gap: 16 }}>
                <h3 className="v5-h3">Ready to Eliminate Unbudgeted Agency Spend Across Your Sites?</h3>
                <p className="v5-body">
                  Join enterprise operations teams using driver-backed predictive workforce planning
                  to enforce payroll discipline and automate cross-site reallocation.
                </p>
                <Link href="#audit-form" className="v5-btn v5-btn-primary" style={{ ...WRAP_BTN, alignSelf: "flex-start" }}>
                  Schedule a 15-Minute Operational Audit <ArrowRight />
                </Link>
                <p className="v5-body" style={{ fontStyle: "italic" }}>
                  Zero schema mapping required. Standard CSV and Excel exports work out of the box.
                </p>
              </div>
            </aside>
            <div id="audit-form" style={{ scrollMarginTop: 96 }}>
              <AcceleratorForm acceleratorName={NAME} acceleratorCategory="Labor demand forecasting" />
            </div>
          </div>
        </div>
      </section>

    </V5SiteLayout>
  );
}
