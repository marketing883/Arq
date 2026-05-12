"use client";

import Image from "next/image";
import Link from "next/link";
import { SiteNav } from "@/components/site-dark/SiteNav";
import { SiteFooter } from "@/components/site-dark/SiteFooter";

interface IndustryPageData {
  eyebrow: string;
  heroHeadline: string;
  heroSubhead: string;
  heroImage: string;
  heroImageAlt: string;
  primaryCta: { label: string; href: string };
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
  products: { name: string; href: string; description: string; status?: string; statusColor?: string; cta?: string }[];
  closingCta: { headline: string; body: string; ctaLabel?: string; ctaHref?: string };
}

interface IndustryPageProps {
  data: IndustryPageData;
}

function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={className}>
      <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IndustryPage({ data }: IndustryPageProps) {
  return (
    <div className="arq-dark min-h-screen">
      <SiteNav />
      <main>
        <section className="a-section" style={{ paddingTop: "clamp(140px, 16vh, 210px)" }}>
          <div className="a-wrap" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 44, alignItems: "center" }}>
            <div>
              <span className="a-eyebrow">{data.eyebrow}</span>
              <h1 className="h-display" style={{ marginTop: 18, maxWidth: "12ch" }}>{data.heroHeadline}</h1>
              <p className="lede" style={{ marginTop: 26 }}>{data.heroSubhead}</p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 34 }}>
                <Link href={data.primaryCta.href} className="a-btn a-btn-primary">{data.primaryCta.label}<ArrowIcon className="arrow" /></Link>
                {data.secondaryCta ? <Link href={data.secondaryCta.href} className="a-btn a-btn-ghost">{data.secondaryCta.label}</Link> : null}
              </div>
            </div>
            <div className="a-card" style={{ padding: 0, overflow: "hidden", minHeight: 420 }}>
              <div style={{ position: "relative", minHeight: 420 }}>
                <Image src={data.heroImage} alt={data.heroImageAlt} fill priority sizes="(min-width: 900px) 50vw, 100vw" style={{ objectFit: "cover", filter: "grayscale(.25) brightness(.78) saturate(.9)" }} />
                <div style={{ position: "absolute", inset: 0, background: "radial-gradient(70% 70% at 25% 15%, rgba(208,244,56,.18), transparent 60%), linear-gradient(180deg, transparent, rgba(8,8,11,.72))" }} />
              </div>
            </div>
          </div>
        </section>

        <section className="a-section">
          <div className="a-wrap">
            <div className="a-section-head">
              <div>
                <span className="a-eyebrow">What changes</span>
                <h2 className="h-section" style={{ marginTop: 18 }}>Outcomes teams can <em>measure</em>.</h2>
              </div>
              <p className="lede">Each build is tuned to operational evidence: cycle time, exception volume, leakage, quality, and control coverage.</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
              {data.outcomes.map((o) => (
                <article className="a-card" key={o.label}>
                  <div style={{ color: "var(--ember)", fontSize: "clamp(40px, 5vw, 64px)", fontFamily: "var(--display)", lineHeight: 1 }}>{o.metric}</div>
                  <h3 style={{ marginTop: 18, fontSize: 22 }}>{o.label}</h3>
                  <p style={{ color: "var(--ink-cream-d)", fontSize: 14, lineHeight: 1.6 }}>{o.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="a-section">
          <div className="a-wrap">
            <div className="a-section-head">
              <div>
                <span className="a-eyebrow">Use cases</span>
                <h2 className="h-section" style={{ marginTop: 18 }}>{data.useCasesHeading}</h2>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
              {data.useCases.map((uc) => (
                <article className="a-card" key={uc.title}>
                  <span className="a-tag">{uc.tag}</span>
                  <h3 style={{ marginTop: 18, fontSize: 24 }}>{uc.title}</h3>
                  <p style={{ color: "var(--ink-cream-d)", fontSize: 15 }}>{uc.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="a-section final-cta-band" style={{ paddingBlock: "80px" }}>
          <div className="a-wrap" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 28, alignItems: "center" }}>
            <div>
              <span className="a-eyebrow">Working session</span>
              <h2 className="h-section final-cta-h" style={{ marginTop: 18 }}>{data.midCtaHeadline}</h2>
              <p className="lede" style={{ marginTop: 18 }}>{data.midCtaBody}</p>
            </div>
            <Link href="/engage-us" className="a-btn a-btn-primary" style={{ justifySelf: "start" }}>Book the session<ArrowIcon className="arrow" /></Link>
          </div>
        </section>

        <section className="a-section">
          <div className="a-wrap" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 22 }}>
            <article className="a-card">
              <span className="a-eyebrow">Audience</span>
              <h2 className="h-section" style={{ marginTop: 18 }}>{data.audienceHeading}</h2>
              <p className="lede" style={{ marginTop: 18 }}>{data.audienceBody}</p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 24 }}>
                {data.audienceList.map((item) => <span className="a-tag" key={item}>{item}</span>)}
              </div>
            </article>
            <article className="a-card">
              <span className="a-eyebrow">Accelerators</span>
              <h2 className="h-section" style={{ marginTop: 18 }}>{data.productsHeading}</h2>
              <p className="lede" style={{ marginTop: 18 }}>{data.productsBody}</p>
              <div style={{ display: "grid", gap: 12, marginTop: 24 }}>
                {data.products.length ? data.products.map((p) => (
                  <Link className="a-card" style={{ padding: 18 }} href={p.href} key={p.name}>
                    <strong>{p.name}</strong>
                    <p style={{ margin: "6px 0 0", color: "var(--ink-cream-d)", fontSize: 14 }}>{p.description}</p>
                  </Link>
                )) : <p style={{ color: "var(--ink-cream-d)", fontSize: 15 }}>Most of this work starts bespoke. We productise only after the pattern repeats across customers.</p>}
              </div>
            </article>
          </div>
        </section>

        <section className="a-section final-cta-band">
          <div className="a-wrap">
            <span className="a-eyebrow">Next step</span>
            <h2 className="h-section final-cta-h" style={{ marginTop: 18, maxWidth: "16ch" }}>{data.closingCta.headline}</h2>
            <p className="lede" style={{ marginTop: 18 }}>{data.closingCta.body}</p>
            <Link href={data.closingCta.ctaHref ?? "/engage-us"} className="a-btn a-btn-primary" style={{ marginTop: 28 }}>{data.closingCta.ctaLabel ?? "Engage us"}<ArrowIcon className="arrow" /></Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
