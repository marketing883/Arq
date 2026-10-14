import Link from "next/link";
import { Fragment } from "react";
import { Metadata } from "next";
import V5SiteLayout from "@/components/home-v5/V5SiteLayout";
import { ArrowRight, SparkIcon, ShieldIcon, InsightIcon, DocIcon, ChatIcon } from "@/components/home-v5/icons";
import { accelerators } from "@/lib/data/accelerators";
import { lf, plain, type LfItem } from "@/lib/data/arqlaborforecast";
import {
  generateBreadcrumbSchema,
  generateFAQSchema,
} from "@/lib/seo/structured-data";
import AcceleratorForm from "@/components/accelerators/AcceleratorForm";

// A static route, so it takes precedence over app/accelerators/[id]. The
// finalized copy (lib/data/arqlaborforecast.ts) has its own structure - a
// comparison table, a three-step method, an FAQ - so it is laid out here in
// the accelerator-page visual system rather than squeezed into the
// data-driven template, which would need copy the document does not have.

const NAME = "ArqLaborForecast";
const URL = "https://thearq.ai/accelerators/arqlaborforecast";
const ICONS = [SparkIcon, InsightIcon, ShieldIcon, DocIcon, ChatIcon];

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1920&q=62";
const heroSrc = (w: number) => HERO_IMAGE.replace(/w=\d+/, `w=${w}`);
const heroSrcSet = [960, 1280, 1600, 1920].map((w) => `${heroSrc(w)} ${w}w`).join(", ");

// .v5-btn is nowrap; the finalized CTA label is long enough to overflow a phone.
const WRAP_BTN = { whiteSpace: "normal", lineHeight: 1.25, textAlign: "center" } as const;

/** Render the `**bold**` runs of the source copy. */
function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
        part.startsWith("**") ? <strong key={i}>{part.slice(2, -2)}</strong> : <Fragment key={i}>{part}</Fragment>
      )}
    </>
  );
}

/** An answer-first block: the question in bold, then the answer. */
function QA({ q, a }: { q: string; a: string }) {
  return (
    <p className="v5-lead v5-lf-rich" style={{ marginTop: 18 }}>
      <strong>{q}</strong> <Rich text={a} />
    </p>
  );
}

function ItemGrid({ items, cols }: { items: LfItem[]; cols: 2 | 3 | 4 }) {
  return (
    <ul className={`v5-grid v5-grid-${cols} v5-lf-items`}>
      {items.map((item, i) => {
        const Icon = ICONS[i % ICONS.length];
        return (
          <li className="v5-card" key={item.label}>
            <span className="v5-card-ico"><Icon /></span>
            <p className="v5-h3" style={{ margin: 0 }}>{item.label}</p>
            <p className="v5-body">{item.body}</p>
          </li>
        );
      })}
    </ul>
  );
}

const faqItems = [
  lf.definition,
  lf.capacity.qa,
  lf.drivers.qa,
  lf.reallocation.qa,
  lf.assistant.qa,
  ...lf.faqs,
].map(({ q, a }) => ({ question: q, answer: plain(a) }));

export const metadata: Metadata = {
  title: lf.title,
  description: lf.subtitle,
  keywords: [
    NAME,
    "Arqai Labor Forecast",
    "zero-schema labor demand forecasting",
    "predictive roster planning for multi-site enterprise operations",
    "multi-site capacity planning software",
    "cross-department labor reallocation and overtime prevention",
    "reduce overtime costs in multi-site operations",
    "labor cost margin protection strategies",
    "ArqAI Labs",
  ],
  alternates: { canonical: URL },
  openGraph: {
    type: "website",
    url: URL,
    title: lf.title,
    description: lf.subtitle,
    siteName: "ArqAI Labs",
    images: [{ url: heroSrc(1600), alt: lf.title }],
  },
  twitter: {
    card: "summary_large_image",
    title: lf.title,
    description: lf.subtitle,
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
    description: plain(lf.definition.a),
    url: URL,
    image: heroSrc(1600),
    provider: { "@type": "Organization", name: "ArqAI Labs", url: "https://thearq.ai" },
  };
  const faqSchema = generateFAQSchema(faqItems);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://thearq.ai" },
    { name: "Accelerators", url: "https://thearq.ai/accelerators" },
    { name: NAME, url: URL },
  ]);
  const { capacity, drivers, reallocation, assistant, integration } = lf;

  return (
    <V5SiteLayout>
      {[softwareSchema, faqSchema, breadcrumbSchema].map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
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
          alt={lf.title}
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
              {lf.title}
            </h1>
            <h2
              className="v5-lead"
              style={{ color: "rgba(255,255,255,0.86)", fontWeight: 500, marginTop: 20, maxWidth: "52ch" }}
            >
              {lf.subtitle}
            </h2>
            <div className="v5-hero-actions">
              <Link href="#get-started" className="v5-btn v5-btn-primary" style={WRAP_BTN}>
                {lf.cta.button} <ArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Definition: answer-first, for people and answer engines alike */}
      <section className="v5-section v5-bg-grey">
        <div className="v5-container">
          <p className="v5-lead v5-lf-rich" style={{ maxWidth: 900, margin: 0 }}>
            <strong>{lf.definition.q}</strong> <Rich text={lf.definition.a} />
          </p>
        </div>
      </section>

      {/* Executive value proposition */}
      <section className="v5-section v5-bg-white">
        <div className="v5-container">
          <div className="v5-split">
            <div className="v5-split-copy" style={{ alignSelf: "start" }}>
              <h3 className="v5-h2">{lf.value.heading}</h3>
            </div>
            <div className="v5-lf-rich" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <p className="v5-lead" style={{ margin: 0 }}><Rich text={lf.value.paragraphs[0]} /></p>
              <p className="v5-body v5-lf-p" style={{ margin: 0 }}><Rich text={lf.value.paragraphs[1]} /></p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA, where the document places it, beside the accelerator form */}
      <section className="v5-section v5-bg-grey" id="get-started" style={{ scrollMarginTop: 96 }}>
        <div className="v5-container">
          <div className="v5-contact-grid">
            <aside>
              <div className="v5-card dark" style={{ gap: 16 }}>
                <h3 className="v5-h3">{lf.cta.heading}</h3>
                <p className="v5-body">{lf.cta.body}</p>
                <Link href="#audit-form" className="v5-btn v5-btn-primary" style={{ ...WRAP_BTN, alignSelf: "flex-start" }}>
                  {lf.cta.button} <ArrowRight />
                </Link>
                <p className="v5-body" style={{ fontStyle: "italic" }}>{lf.cta.note}</p>
              </div>
            </aside>
            <div id="audit-form" style={{ scrollMarginTop: 96 }}>
              <AcceleratorForm acceleratorName={NAME} acceleratorCategory="Labor demand forecasting" />
            </div>
          </div>
        </div>
      </section>

      {/* Multi-site capacity planning */}
      <section className="v5-section v5-bg-white">
        <div className="v5-container">
          <div className="v5-section-head" style={{ maxWidth: 900 }}>
            <h2 className="v5-h2">{capacity.heading}</h2>
            <QA {...capacity.qa} />
          </div>
          <div className="v5-lf-rich" style={{ maxWidth: 900 }}>
            <h3 className="v5-h3">{capacity.subheading}</h3>
            <p className="v5-body v5-lf-p" style={{ marginTop: 12 }}><Rich text={capacity.body} /></p>
          </div>
          <div className="v5-lf-table-wrap">
            <table className="v5-lf-table">
              <thead>
                <tr>{capacity.table.columns.map((c) => <th key={c} scope="col">{c}</th>)}</tr>
              </thead>
              <tbody>
                {capacity.table.rows.map((row) => (
                  <tr key={row[0]}>
                    <th scope="row">{row[0]}</th>
                    {row.slice(1).map((cell, i) => (
                      <td key={i} data-label={capacity.table.columns[i + 1]}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="v5-body v5-lf-p v5-lf-rich" style={{ maxWidth: 900, marginTop: 28 }}>
            <Rich text={capacity.closing} />
          </p>
        </div>
      </section>

      {/* Driver-based roster planning */}
      <section className="v5-section v5-bg-grey">
        <div className="v5-container">
          <div className="v5-section-head" style={{ maxWidth: 900 }}>
            <h2 className="v5-h2">{drivers.heading}</h2>
            <QA {...drivers.qa} />
          </div>
          <div style={{ maxWidth: 900, marginBottom: 28 }}>
            <h3 className="v5-h3">{drivers.subheading}</h3>
            {drivers.paragraphs.map((p) => (
              <p className="v5-body v5-lf-p" style={{ marginTop: 12 }} key={p}>{p}</p>
            ))}
          </div>
          <ItemGrid items={drivers.items} cols={3} />
          <p className="v5-body v5-lf-p v5-lf-rich" style={{ maxWidth: 900, marginTop: 28 }}>
            <Rich text={drivers.closing} />
          </p>
        </div>
      </section>

      {/* Cross-department reallocation */}
      <section className="v5-section v5-bg-white">
        <div className="v5-container">
          <div className="v5-section-head" style={{ maxWidth: 900 }}>
            <h2 className="v5-h2">{reallocation.heading}</h2>
            <h3 className="v5-h3" style={{ marginTop: 18 }}>{reallocation.subheading}</h3>
            <QA {...reallocation.qa} />
          </div>
          <div className="v5-lf-rich" style={{ maxWidth: 900, marginBottom: 28 }}>
            <h3 className="v5-h3">{reallocation.stepsHeading}</h3>
            <p className="v5-body v5-lf-p" style={{ marginTop: 12 }}><Rich text={reallocation.stepsIntro} /></p>
          </div>
          <div className="v5-grid v5-grid-3">
            {reallocation.steps.map((step, i) => (
              <article className="v5-card v5-numcard v5-lf-rich" key={step.title}>
                <span className="v5-num">{String(i + 1).padStart(2, "0")}</span>
                <h4 className="v5-h3" style={{ margin: 0 }}>{step.title}</h4>
                <p className="v5-body"><strong>System Mechanism:</strong> {step.mechanism}</p>
                <p className="v5-body"><strong>Business Outcome:</strong> <Rich text={step.outcome} /></p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Conversational assistant */}
      <section className="v5-section v5-bg-grey">
        <div className="v5-container">
          <div className="v5-section-head" style={{ maxWidth: 900 }}>
            <h2 className="v5-h2">{assistant.heading}</h2>
            <h3 className="v5-h3" style={{ marginTop: 18 }}>{assistant.subheading}</h3>
            <QA {...assistant.qa} />
          </div>
          <div style={{ maxWidth: 900, marginBottom: 28 }}>
            <h3 className="v5-h3">{assistant.answersHeading}</h3>
            {assistant.answersParagraphs.map((p) => (
              <p className="v5-body v5-lf-p" style={{ marginTop: 12 }} key={p}>{p}</p>
            ))}
          </div>
          <ItemGrid items={assistant.items} cols={4} />
          <article className="v5-card dark v5-lf-rich" style={{ marginTop: 28 }}>
            <h3 className="v5-h3">{assistant.restraintHeading}</h3>
            {assistant.restraintParagraphs.map((p) => (
              <p className="v5-body v5-lf-p" key={p}><Rich text={p} /></p>
            ))}
          </article>
        </div>
      </section>

      {/* Zero-IT integration */}
      <section className="v5-section v5-bg-white">
        <div className="v5-container">
          <div className="v5-section-head" style={{ maxWidth: 900 }}>
            <h2 className="v5-h2">{integration.heading}</h2>
          </div>
          <div style={{ maxWidth: 900, marginBottom: 28 }}>
            <h3 className="v5-h3">{integration.ingestHeading}</h3>
            {integration.ingestParagraphs.map((p) => (
              <p className="v5-body v5-lf-p" style={{ marginTop: 12 }} key={p}>{p}</p>
            ))}
          </div>
          <ItemGrid items={integration.ingestItems} cols={4} />

          <div style={{ maxWidth: 900, margin: "56px 0 28px" }}>
            <h3 className="v5-h3">{integration.cleanHeading}</h3>
            {integration.cleanParagraphs.map((p) => (
              <p className="v5-body v5-lf-p" style={{ marginTop: 12 }} key={p}>{p}</p>
            ))}
          </div>
          <ul className="v5-list v5-lf-checks">
            {integration.cleanItems.map((item) => (
              <li key={item.label}><strong>{item.label}</strong>: {item.body}</li>
            ))}
          </ul>

          <div className="v5-card" style={{ marginTop: 56, maxWidth: 900 }}>
            <h3 className="v5-h3">{integration.nightlyHeading}</h3>
            <p className="v5-body v5-lf-p">{integration.nightly}</p>
          </div>
        </div>
      </section>

      {/* FAQ: visible answers, as on the other accelerator pages */}
      <section className="v5-section v5-bg-grey">
        <div className="v5-container">
          <div className="v5-section-head">
            <h2 className="v5-h2">FAQ</h2>
          </div>
          <div className="v5-grid v5-grid-2">
            {lf.faqs.map((faq) => (
              <article className="v5-card" key={faq.q}>
                <h3 className="v5-h3">{faq.q}</h3>
                <p className="v5-body">{faq.a}</p>
              </article>
            ))}
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
    </V5SiteLayout>
  );
}
