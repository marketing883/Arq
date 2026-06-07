import Link from "next/link";
import V5Nav from "@/components/home-v5/V5Nav";
import Footer from "@/components/home-v5/Footer";
import V5CtaSection from "@/components/home-v5/V5CtaSection";
import { ArrowRight } from "@/components/home-v5/icons";
import { getAccelerator } from "@/lib/data/accelerators";
import "@/components/home-v5/styles.css";

// Serve big decorative images straight from the Unsplash CDN.
const cdn = (url: string, w: number) =>
  url.replace(/w=\d+/, `w=${w}`).replace(/q=\d+/, "q=62");
const cdnSrcSet = (url: string, widths: number[]) =>
  widths.map((w) => `${cdn(url, w)} ${w}w`).join(", ");

export type IndustryPageData = {
  eyebrow: string;
  heroHeadline: string;
  heroSubhead: string;
  heroImage: string;
  secondaryImage: string;
  heroImageAlt: string;
  /** The single accelerator built for this industry (id from lib/data/accelerators). */
  featuredAcceleratorId: string;
  /** Pre-fill values carried into the contact form. */
  contactIndustry: string;
  contactWorkflow: string;
  primaryCta?: { label: string; href: string };
  outcomes: { metric: string; label: string; description: string }[];
  useCasesHeading: string;
  useCases: { tag: string; title: string; body: string }[];
  midCtaHeadline: string;
  midCtaBody: string;
  operatingContextHeading: string;
  operatingContextBody: string;
  operatingContextList: string[];
  closingCta: { headline: string; body: string };
  // Legacy fields retained for compatibility; no longer rendered.
  secondaryCta?: { label: string; href: string };
  productsHeading?: string;
  productsBody?: string;
  products?: {
    name: string;
    status: string;
    statusColor: string;
    description: string;
    cta: string;
    href: string;
  }[];
};

export function IndustryPage({ data }: { data: IndustryPageData }) {
  const ctaLabel = data.primaryCta?.label ?? "Talk to our team";
  const contactHref = `/contact?industry=${encodeURIComponent(
    data.contactIndustry
  )}&workflow=${encodeURIComponent(data.contactWorkflow)}&inquiry=workflow`;
  const accelerator = getAccelerator(data.featuredAcceleratorId);
  const accMetric = accelerator?.metrics?.[0];

  return (
    <div className="v5-shell">
      <link
        rel="preload"
        as="image"
        href={cdn(data.heroImage, 1920)}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        {...({ imageSrcSet: cdnSrcSet(data.heroImage, [960, 1280, 1600, 1920]), imageSizes: "100vw", fetchPriority: "high" } as any)}
      />
      <V5Nav />
      <main>
        {/* Hero — full-bleed image, animated overlay, content on top */}
        <section className="v5-acc-hero">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="v5-acc-hero-img"
            src={cdn(data.heroImage, 1920)}
            srcSet={cdnSrcSet(data.heroImage, [960, 1280, 1600, 1920])}
            sizes="100vw"
            alt={data.heroImageAlt}
            decoding="async"
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            {...({ fetchPriority: "high" } as any)}
          />
          <span className="v5-acc-hero-aurora" aria-hidden="true" />
          <span className="v5-acc-hero-sheen" aria-hidden="true" />
          <div className="v5-container">
            <div className="v5-acc-hero-body">
              <span className="v5-badge on-dark">
                <span className="v5-badge-dot" />
                {data.eyebrow}
              </span>
              <h1 className="v5-h1">{data.heroHeadline}</h1>
              <p className="v5-lead">{data.heroSubhead}</p>
              <div className="v5-hero-actions">
                <Link href={contactHref} className="v5-btn v5-btn-primary">
                  {ctaLabel} <ArrowRight />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Outcomes — accented stat band */}
        <section className="v5-section v5-bg-grey">
          <div className="v5-container">
            <div className="v5-section-head center">
              <span className="v5-eyebrow">What changes</span>
              <h2 className="v5-h2">Outcomes leaders can measure.</h2>
              <p className="v5-lead">
                Every engagement is anchored to metrics operating leaders can defend — faster
                resolution, sharper prioritization, cleaner evidence, decisions people trust.
              </p>
            </div>
            <div className="v5-grid v5-grid-3">
              {data.outcomes.map((outcome) => (
                <div className="v5-card v5-outcome" key={outcome.label}>
                  <strong className="v5-outcome-metric">{outcome.metric}</strong>
                  <h3 className="v5-h3">{outcome.label}</h3>
                  <p className="v5-body">{outcome.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Use cases — numbered cards */}
        <section className="v5-section v5-bg-white">
          <div className="v5-container">
            <div className="v5-section-head">
              <span className="v5-eyebrow">Use cases</span>
              <h2 className="v5-h2">{data.useCasesHeading}</h2>
              <p className="v5-lead">
                Each use case is scoped around the owner of the work, the systems they rely
                on, the decisions they make, and the audit trail the business needs afterward.
              </p>
            </div>
            <div className="v5-grid v5-grid-2">
              {data.useCases.map((useCase, i) => (
                <article className="v5-card v5-usecase" key={useCase.title}>
                  <span className="v5-num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="v5-chip">{useCase.tag}</span>
                  <h3 className="v5-h3">{useCase.title}</h3>
                  <p className="v5-body">{useCase.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Full-width showcase band */}
        <section className="v5-showcase">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="v5-showcase-img"
            src={cdn(data.secondaryImage, 1920)}
            srcSet={cdnSrcSet(data.secondaryImage, [960, 1280, 1600, 1920])}
            sizes="100vw"
            alt=""
            loading="lazy"
            decoding="async"
          />
          <span className="v5-showcase-inset" />
          <div className="v5-container">
            <div className="v5-showcase-body">
              <span className="v5-card-eyebrow" style={{ color: "var(--v5-lime)" }}>Next step</span>
              <h2 className="v5-h2" style={{ marginTop: 10 }}>{data.midCtaHeadline}</h2>
              <p className="v5-lead">{data.midCtaBody}</p>
              <div className="v5-cta-card-actions" style={{ justifyContent: "flex-start", marginTop: 24 }}>
                <Link href={contactHref} className="v5-btn v5-btn-primary">
                  {ctaLabel} <ArrowRight />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Operating context */}
        <section className="v5-section v5-bg-grey">
          <div className="v5-container">
            <div className="v5-split">
              <div className="v5-split-copy">
                <span className="v5-eyebrow">Where this helps</span>
                <h2 className="v5-h2">{data.operatingContextHeading}</h2>
                <p className="v5-lead">{data.operatingContextBody}</p>
              </div>
              <div className="v5-card">
                <ul className="v5-list">
                  {data.operatingContextList.map((context) => (
                    <li key={context}>{context}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Featured accelerator — the one built for this industry */}
        {accelerator ? (
          <section className="v5-section v5-bg-white">
            <div className="v5-container">
              <div className="v5-section-head">
                <span className="v5-eyebrow">Recommended accelerator</span>
                <h2 className="v5-h2">Start from the pattern built for this work.</h2>
              </div>
              <div className="v5-split">
                <div className="v5-split-media">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cdn(accelerator.image, 1200)}
                    srcSet={cdnSrcSet(accelerator.image, [640, 960, 1200])}
                    sizes="(min-width: 860px) 50vw, 100vw"
                    alt={accelerator.name}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="v5-split-copy">
                  <span className="v5-chip">{accelerator.category}</span>
                  <h3 className="v5-h2" style={{ fontSize: "clamp(28px, 3vw, 38px)", marginTop: 12 }}>
                    {accelerator.name}
                  </h3>
                  <p className="v5-lead" style={{ marginTop: 12 }}>{accelerator.tagline}</p>
                  {accMetric ? (
                    <div className="v5-stat" style={{ background: "var(--v5-grey-5)", marginTop: 20, maxWidth: 260 }}>
                      <strong>{accMetric.value}</strong>
                      <span>{accMetric.label}</span>
                    </div>
                  ) : null}
                  <Link
                    href={`/accelerators/${accelerator.id}`}
                    className="v5-card-more"
                    style={{ marginTop: 22, fontSize: 16 }}
                  >
                    Explore the {accelerator.name} accelerator <ArrowRight />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {/* Closing CTA */}
        <V5CtaSection>
              <h2 className="v5-h2">{data.closingCta.headline}</h2>
              <p className="v5-lead">{data.closingCta.body}</p>
              <div className="v5-cta-card-actions">
                <Link href={contactHref} className="v5-btn v5-btn-primary">
                  {ctaLabel} <ArrowRight />
                </Link>
              </div>
        </V5CtaSection>
      </main>
      <Footer />
    </div>
  );
}
