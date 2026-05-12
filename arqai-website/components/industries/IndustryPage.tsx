"use client";

import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "@/components/site-dark/SiteFooter";
import { SiteNav } from "@/components/site-dark/SiteNav";

function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={className} aria-hidden="true">
      <path
        d="M2 7h10M8 3l4 4-4 4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3 8.5 6.4 12 13 4.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}

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
  audienceHeading: string;
  audienceBody: string;
  audienceList: string[];
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
    <div className="arq-dark min-h-screen">
      <SiteNav />
      <main>
        <section className="a-hero">
          <div className="a-hero-grid" />
          <div className="a-wrap" style={{ position: "relative" }}>
            <div className="detail-hero-grid" style={{ display: "grid", gap: 48, alignItems: "center" }}>
              <div>
                <span className="a-pill">
                  <span className="dot" /> {data.eyebrow}
                </span>
                <h1 className="h-display" style={{ marginTop: 28, maxWidth: "14ch" }}>
                  {data.heroHeadline}
                </h1>
                <p className="lede" style={{ marginTop: 28, maxWidth: "62ch" }}>
                  {data.heroSubhead}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 30 }}>
                  <Link href={data.primaryCta?.href ?? "/engage-us"} className="a-btn a-btn-primary">
                    {data.primaryCta?.label ?? "Engage us"} <ArrowIcon className="arrow" />
                  </Link>
                  {data.secondaryCta ? (
                    <Link href={data.secondaryCta.href} className="a-btn a-btn-ghost">
                      {data.secondaryCta.label}
                    </Link>
                  ) : null}
                </div>
              </div>

              <div className="a-card" style={{ padding: 0, overflow: "hidden" }}>
                <div style={{ position: "relative", aspectRatio: "4 / 3" }}>
                  <Image
                    src={data.heroImage}
                    alt={data.heroImageAlt}
                    fill
                    priority
                    sizes="(min-width: 1000px) 42vw, 100vw"
                    style={{ objectFit: "cover" }}
                  />
                  <div className="svc-media-shade" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="a-section">
          <div className="a-wrap">
            <div className="a-section-head">
              <div>
                <span className="a-eyebrow">What changes</span>
                <h2 className="h-section" style={{ marginTop: 18 }}>
                  Outcomes customers can measure.
                </h2>
              </div>
              <p className="lede">
                Each industry page starts with the operating result: better prioritization, faster resolution, cleaner
                evidence, and workflows people can trust.
              </p>
            </div>
            <div className="steps" style={{ marginTop: 44 }}>
              {data.outcomes.map((outcome) => (
                <div className="step" key={outcome.label}>
                  <span className="num">{outcome.metric}</span>
                  <h3 style={{ marginTop: 28 }}>{outcome.label}</h3>
                  <p>{outcome.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="a-section">
          <div className="a-wrap">
            <div className="a-section-head">
              <div>
                <span className="a-eyebrow">Use cases</span>
                <h2 className="h-section" style={{ marginTop: 18 }}>
                  {data.useCasesHeading}
                </h2>
              </div>
              <p className="lede">
                We build around the process, the exception path, the data reality, and the review model that already
                exists inside the business.
              </p>
            </div>

            <div className="svc-grid" style={{ marginTop: 44 }}>
              {data.useCases.map((useCase) => (
                <article className="a-card" key={useCase.title} style={{ padding: 28 }}>
                  <span className="a-tag">{useCase.tag}</span>
                  <h3 style={{ color: "var(--ink-cream)", fontFamily: "var(--display)", fontSize: 24, marginTop: 22 }}>
                    {useCase.title}
                  </h3>
                  <p style={{ color: "var(--ink-cream-d)", lineHeight: 1.6, marginTop: 12 }}>{useCase.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="a-section">
          <div className="a-wrap">
            <div className="cta-strip">
              <span className="a-eyebrow">Next step</span>
              <h2 className="h-section" style={{ marginTop: 18, maxWidth: "18ch" }}>
                {data.midCtaHeadline}
              </h2>
              <p className="lede" style={{ marginTop: 18, maxWidth: "62ch" }}>
                {data.midCtaBody}
              </p>
              <Link href="/engage-us" className="a-btn a-btn-primary" style={{ marginTop: 28 }}>
                Engage us <ArrowIcon className="arrow" />
              </Link>
            </div>
          </div>
        </section>

        <section className="a-section">
          <div className="a-wrap">
            <div className="gap-split">
              <article className="a-card" style={{ padding: 32 }}>
                <span className="a-eyebrow">Audience</span>
                <h2 className="h-section" style={{ fontSize: "clamp(28px, 3.2vw, 44px)", marginTop: 18 }}>
                  {data.audienceHeading}
                </h2>
                <p className="lede" style={{ marginTop: 18 }}>
                  {data.audienceBody}
                </p>
              </article>
              <article className="a-card" style={{ padding: 32 }}>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 14 }}>
                  {data.audienceList.map((audience) => (
                    <li key={audience} style={{ display: "flex", gap: 12, color: "var(--ink-cream-d)", lineHeight: 1.5 }}>
                      <span style={{ color: "var(--ember)", marginTop: 2 }}>
                        <CheckIcon />
                      </span>
                      {audience}
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
                <span className="a-eyebrow">Productized where it fits</span>
                <h2 className="h-section" style={{ marginTop: 18 }}>
                  {data.productsHeading}
                </h2>
              </div>
              <p className="lede">{data.productsBody}</p>
            </div>

            {data.products.length > 0 ? (
              <div className="svc-grid" style={{ marginTop: 44 }}>
                {data.products.map((product) => (
                  <Link
                    href={product.href}
                    key={product.name}
                    className="a-card"
                    style={{ color: "inherit", textDecoration: "none", padding: 28 }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "center" }}>
                      <h3 style={{ color: "var(--ink-cream)", fontFamily: "var(--display)", fontSize: 28, margin: 0 }}>
                        {product.name}
                      </h3>
                      <span className="a-tag">{product.status}</span>
                    </div>
                    <p style={{ color: "var(--ink-cream-d)", lineHeight: 1.6, marginTop: 18 }}>{product.description}</p>
                    <span style={{ color: "var(--ember)", display: "inline-flex", gap: 8, alignItems: "center", marginTop: 18 }}>
                      {product.cta} <ArrowIcon className="arrow" />
                    </span>
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        </section>

        <section className="a-section">
          <div className="a-wrap">
            <div className="cta-strip">
              <span className="a-eyebrow">CTA</span>
              <h2 className="h-section" style={{ marginTop: 18, maxWidth: "18ch" }}>
                {data.closingCta.headline}
              </h2>
              <p className="lede" style={{ marginTop: 18, maxWidth: "62ch" }}>
                {data.closingCta.body}
              </p>
              <Link href="/engage-us" className="a-btn a-btn-primary" style={{ marginTop: 28 }}>
                Engage us <ArrowIcon className="arrow" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
