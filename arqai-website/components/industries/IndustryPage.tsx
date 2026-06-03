import Image from "next/image";
import Link from "next/link";
import V5Nav from "@/components/home-v5/V5Nav";
import Footer from "@/components/home-v5/Footer";
import { ArrowRight, ArrowUpRight } from "@/components/home-v5/icons";
import "@/components/home-v5/styles.css";

export type IndustryPageData = {
  eyebrow: string;
  heroHeadline: string;
  heroSubhead: string;
  heroImage: string;
  heroImageAlt: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  outcomes: { metric: string; label: string; description: string }[];
  useCasesHeading: string;
  useCases: { tag: string; title: string; body: string }[];
  midCtaHeadline: string;
  midCtaBody: string;
  operatingContextHeading: string;
  operatingContextBody: string;
  operatingContextList: string[];
  productsHeading: string;
  productsBody: string;
  products: {
    name: string;
    status: string;
    statusColor: string;
    description: string;
    cta: string;
    href: string;
  }[];
  closingCta: { headline: string; body: string };
};

export function IndustryPage({ data }: { data: IndustryPageData }) {
  return (
    <div className="v5-shell">
      <V5Nav />
      <main>
        {/* Hero */}
        <section className="v5-page-hero">
          <div className="v5-container">
            <div className="v5-split">
              <div className="v5-split-copy">
                <span className="v5-badge">
                  <span className="v5-badge-dot" />
                  {data.eyebrow}
                </span>
                <h1 className="v5-h1" style={{ marginTop: 18 }}>{data.heroHeadline}</h1>
                <p className="v5-lead">{data.heroSubhead}</p>
                <div className="v5-hero-actions">
                  <Link href={data.primaryCta?.href ?? "/engage-us"} className="v5-btn v5-btn-primary">
                    {data.primaryCta?.label ?? "Get Started"} <ArrowRight />
                  </Link>
                  {data.secondaryCta ? (
                    <Link href={data.secondaryCta.href} className="v5-btn v5-btn-ghost">
                      {data.secondaryCta.label}
                    </Link>
                  ) : null}
                </div>
              </div>
              <div className="v5-split-media">
                <Image
                  src={data.heroImage}
                  alt={data.heroImageAlt}
                  fill
                  sizes="(min-width: 860px) 50vw, 100vw"
                  style={{ objectFit: "cover" }}
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Outcomes */}
        <section className="v5-section v5-bg-grey">
          <div className="v5-container">
            <div className="v5-section-head">
              <span className="v5-eyebrow">What changes</span>
              <h2 className="v5-h2">Outcomes customers can measure.</h2>
              <p className="v5-lead">
                We anchor every engagement to the metrics operating leaders can defend:
                faster resolution, sharper prioritization, cleaner evidence, and decisions
                people can trust.
              </p>
            </div>
            <div className="v5-grid v5-grid-3">
              {data.outcomes.map((outcome) => (
                <div className="v5-card" key={outcome.label}>
                  <strong style={{ fontFamily: "var(--v5-display)", fontWeight: 600, fontSize: 40, lineHeight: 1, color: "var(--v5-ink)", letterSpacing: "-0.02em" }}>
                    {outcome.metric}
                  </strong>
                  <h3 className="v5-h3" style={{ marginTop: 6 }}>{outcome.label}</h3>
                  <p className="v5-body">{outcome.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Use cases */}
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
              {data.useCases.map((useCase) => (
                <article className="v5-card" key={useCase.title}>
                  <span className="v5-chip">{useCase.tag}</span>
                  <h3 className="v5-h3" style={{ marginTop: 6 }}>{useCase.title}</h3>
                  <p className="v5-body">{useCase.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Mid CTA */}
        <section className="v5-section v5-cta-band">
          <div className="v5-container">
            <div className="v5-cta-card">
              <div className="v5-cta-glow" />
              <span className="v5-card-eyebrow" style={{ color: "var(--v5-lime)" }}>Next step</span>
              <h2 className="v5-h2" style={{ marginTop: 12 }}>{data.midCtaHeadline}</h2>
              <p className="v5-lead">{data.midCtaBody}</p>
              <div className="v5-cta-card-actions">
                <Link href="/engage-us" className="v5-btn v5-btn-primary">
                  Get Started <ArrowRight />
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

        {/* Accelerator products */}
        {data.products.length > 0 ? (
          <section className="v5-section v5-bg-white">
            <div className="v5-container">
              <div className="v5-section-head">
                <span className="v5-eyebrow">Accelerator starting points</span>
                <h2 className="v5-h2">{data.productsHeading}</h2>
                <p className="v5-lead">{data.productsBody}</p>
              </div>
              <div className="v5-grid v5-grid-2">
                {data.products.map((product) => (
                  <Link href={product.href} key={product.name} className="v5-card v5-card-link">
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "center" }}>
                      <h3 className="v5-h3" style={{ fontSize: 26 }}>{product.name}</h3>
                      <span className="v5-chip">{product.status}</span>
                    </div>
                    <p className="v5-body">{product.description}</p>
                    <span className="v5-card-more">
                      {product.cta} <ArrowUpRight />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {/* Closing CTA */}
        <section className="v5-section v5-cta-band">
          <div className="v5-container">
            <div className="v5-cta-card">
              <div className="v5-cta-glow" />
              <h2 className="v5-h2">{data.closingCta.headline}</h2>
              <p className="v5-lead">{data.closingCta.body}</p>
              <div className="v5-cta-card-actions">
                <Link href="/engage-us" className="v5-btn v5-btn-primary">
                  Get Started <ArrowRight />
                </Link>
                <Link href="/accelerators" className="v5-btn v5-btn-ghost">
                  View accelerators
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
