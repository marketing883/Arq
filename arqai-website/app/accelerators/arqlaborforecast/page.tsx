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

// A static route, so it takes precedence over app/accelerators/[id]. It
// follows that template section for section - hero, overview split,
// challenge/shift cards, showcase band, capability grid, numbered split,
// integrations split, fit-signals split, FAQ, portfolio rail, form - with
// the finalized copy from lib/data/arqlaborforecast.ts in each slot, in the
// document's order. The data template itself needs fields (metrics, use
// cases, rollout) the document does not have, so it is not reused directly.

const NAME = "ArqLaborForecast";
const URL = "https://thearq.ai/accelerators/arqlaborforecast";
const ICONS = [SparkIcon, InsightIcon, ShieldIcon, DocIcon, ChatIcon];

const unsplash = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=62`;
const IMG = {
  hero: unsplash("photo-1586528116311-ad8dd3c8310d"),
  overview: unsplash("photo-1556761175-b413da4baf72"),
  showcase: unsplash("photo-1553413077-190dd305871c"),
  capacity: unsplash("photo-1460925895917-afdab827c52f"),
  assistant: unsplash("photo-1590650153855-d9e808231d41"),
  integration: unsplash("photo-1573164713988-8665fc963095"),
};
// Served straight from the Unsplash CDN, as on the other accelerator pages.
const cdn = (url: string, w: number) => url.replace(/w=\d+/, `w=${w}`);
const cdnSrcSet = (url: string, widths: number[]) => widths.map((w) => `${cdn(url, w)} ${w}w`).join(", ");

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

/** The answer-first block each section opens with: bold question, then the answer. */
function QA({ q, a }: { q: string; a: string }) {
  return (
    <p className="v5-lead v5-lf-rich">
      <strong>{q}</strong> <Rich text={a} />
    </p>
  );
}

/** The accelerator pages' small framed image (.v5-media-sm). */
function Media({ src, alt }: { src: string; alt: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div className="v5-media-sm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cdn(src, 800)}
          srcSet={cdnSrcSet(src, [480, 800])}
          sizes="(min-width: 860px) 420px, 100vw"
          alt={alt}
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  );
}

/** The capability-card grid used across accelerator pages. */
function CardGrid({ items, cols }: { items: LfItem[]; cols: 3 | 4 }) {
  return (
    <div className={`v5-grid v5-grid-${cols}`}>
      {items.map((item, i) => {
        const Icon = ICONS[i % ICONS.length];
        return (
          <div className="v5-card" key={item.label}>
            <span className="v5-card-ico"><Icon /></span>
            <h3 className="v5-h3">{item.label}</h3>
            <p className="v5-body">{item.body}</p>
          </div>
        );
      })}
    </div>
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
    images: [{ url: cdn(IMG.hero, 1600), alt: lf.title }],
  },
  twitter: {
    card: "summary_large_image",
    title: lf.title,
    description: lf.subtitle,
    images: [cdn(IMG.hero, 1600)],
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
    image: cdn(IMG.hero, 1600),
    provider: { "@type": "Organization", name: "ArqAI Labs", url: "https://thearq.ai" },
    offers: { "@type": "Offer", url: `${URL}#get-started`, description: lf.cta.button },
  };
  const faqSchema = generateFAQSchema(faqItems);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://thearq.ai" },
    { name: "Accelerators", url: "https://thearq.ai/accelerators" },
    { name: NAME, url: URL },
  ]);
  const { value, cta, capacity, drivers, reallocation, assistant, integration } = lf;

  return (
    <V5SiteLayout>
      {[softwareSchema, faqSchema, breadcrumbSchema].map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <link
        rel="preload"
        as="image"
        href={cdn(IMG.hero, 1920)}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        {...({ imageSrcSet: cdnSrcSet(IMG.hero, [960, 1280, 1600, 1920]), imageSizes: "100vw", fetchPriority: "high" } as any)}
      />

      {/* Hero — full-bleed image, animated overlay, content on top */}
      <section className="v5-acc-hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="v5-acc-hero-img"
          src={cdn(IMG.hero, 1920)}
          srcSet={cdnSrcSet(IMG.hero, [960, 1280, 1600, 1920])}
          sizes="100vw"
          alt={lf.title}
          decoding="async"
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          {...({ fetchPriority: "high" } as any)}
        />
        <span className="v5-acc-hero-aurora" aria-hidden="true" />
        <span className="v5-acc-hero-sheen" aria-hidden="true" />
        <div className="v5-container">
          <div className="v5-acc-hero-body v5-lf-hero">
            <div className="v5-crumbs" style={{ marginBottom: 18 }}>
              <Link href="/accelerators">Accelerators</Link>
              <span>/</span>
              <span style={{ color: "#fff" }}>{NAME}</span>
            </div>
            <h1 className="v5-h1">{lf.title}</h1>
            <h2 className="v5-lead">{lf.subtitle}</h2>
            <div className="v5-hero-actions">
              <Link href="#get-started" className="v5-btn v5-btn-primary" style={WRAP_BTN}>
                {cta.button} <ArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="v5-section v5-bg-grey">
        <div className="v5-container">
          <div className="v5-split">
            <div className="v5-split-copy v5-lf-rich">
              <span className="v5-eyebrow">Overview</span>
              <h2 className="v5-h2">{lf.definition.q}</h2>
              <p className="v5-lead"><Rich text={lf.definition.a} /></p>
            </div>
            <Media src={IMG.overview} alt="Operations team planning multi-site staffing" />
          </div>
        </div>
      </section>

      {/* Executive value proposition — the challenge / the shift */}
      <section className="v5-section v5-bg-white">
        <div className="v5-container">
          <div className="v5-section-head">
            <h2 className="v5-h2">{value.heading}</h2>
          </div>
          <div className="v5-grid v5-grid-2">
            <article className="v5-card">
              <span className="v5-card-eyebrow">The challenge</span>
              <p className="v5-lf-card-lead">{value.paragraphs[0]}</p>
            </article>
            <article className="v5-card dark v5-lf-rich">
              <span className="v5-card-eyebrow" style={{ color: "var(--v5-lime)" }}>The shift</span>
              <p className="v5-body"><Rich text={value.paragraphs[1]} /></p>
            </article>
          </div>
        </div>
      </section>

      {/* Full-width showcase band — the document's CTA */}
      <section className="v5-showcase">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="v5-showcase-img"
          src={cdn(IMG.showcase, 1920)}
          srcSet={cdnSrcSet(IMG.showcase, [960, 1280, 1600, 1920])}
          sizes="100vw"
          alt=""
          loading="lazy"
          decoding="async"
        />
        <span className="v5-showcase-inset" />
        <div className="v5-container">
          <div className="v5-showcase-body">
            <h2 className="v5-h2">{cta.heading}</h2>
            <p className="v5-lead">{cta.body}</p>
            <div className="v5-cta-card-actions" style={{ justifyContent: "flex-start", marginTop: 24 }}>
              <Link href="#get-started" className="v5-btn v5-btn-primary" style={WRAP_BTN}>
                {cta.button} <ArrowRight />
              </Link>
            </div>
            <p className="v5-lf-note">{cta.note}</p>
          </div>
        </div>
      </section>

      {/* Multi-site capacity planning */}
      <section className="v5-section v5-bg-grey">
        <div className="v5-container">
          <div className="v5-section-head v5-lf-head">
            <h2 className="v5-h2">{capacity.heading}</h2>
            <QA {...capacity.qa} />
          </div>
          <div className="v5-split">
            <div className="v5-split-copy v5-lf-rich">
              <h3 className="v5-h3">{capacity.subheading}</h3>
              <p className="v5-body v5-lf-copy"><Rich text={capacity.body} /></p>
            </div>
            <Media src={IMG.capacity} alt="Labor demand forecast compared against scheduled hours" />
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
          <p className="v5-body v5-lf-copy v5-lf-rich v5-lf-after"><Rich text={capacity.closing} /></p>
        </div>
      </section>

      {/* Driver-based roster planning — capabilities */}
      <section className="v5-section v5-bg-white">
        <div className="v5-container">
          <div className="v5-section-head v5-lf-head">
            <span className="v5-eyebrow">Capabilities</span>
            <h2 className="v5-h2">{drivers.heading}</h2>
            <QA {...drivers.qa} />
          </div>
          <div className="v5-lf-block">
            <h3 className="v5-h3">{drivers.subheading}</h3>
            {drivers.paragraphs.map((p) => (
              <p className="v5-body v5-lf-copy" key={p}>{p}</p>
            ))}
          </div>
          <CardGrid items={drivers.items} cols={3} />
          <p className="v5-body v5-lf-copy v5-lf-rich v5-lf-after"><Rich text={drivers.closing} /></p>
        </div>
      </section>

      {/* Cross-department reallocation — numbered split */}
      <section className="v5-section v5-bg-grey">
        <div className="v5-container">
          <div className="v5-split v5-lf-split-top">
            <div className="v5-split-copy v5-lf-rich">
              <h2 className="v5-h2">{reallocation.heading}</h2>
              <h3 className="v5-h3 v5-lf-sub">{reallocation.subheading}</h3>
              <QA {...reallocation.qa} />
              <h3 className="v5-h3 v5-lf-sub">{reallocation.stepsHeading}</h3>
              <p className="v5-body v5-lf-copy"><Rich text={reallocation.stepsIntro} /></p>
            </div>
            <div className="v5-lf-stack">
              {reallocation.steps.map((step, i) => (
                <article className="v5-card v5-numcard v5-lf-rich" key={step.title}>
                  <span className="v5-num">{String(i + 1).padStart(2, "0")}</span>
                  <h4 className="v5-h3">{step.title}</h4>
                  <p className="v5-body"><strong>System Mechanism:</strong> {step.mechanism}</p>
                  <p className="v5-body"><strong>Business Outcome:</strong> <Rich text={step.outcome} /></p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Conversational assistant */}
      <section className="v5-section v5-bg-white">
        <div className="v5-container">
          <div className="v5-section-head v5-lf-head">
            <h2 className="v5-h2">{assistant.heading}</h2>
            <h3 className="v5-h3 v5-lf-sub">{assistant.subheading}</h3>
            <QA {...assistant.qa} />
          </div>
          <div className="v5-split">
            <div className="v5-split-copy">
              <h3 className="v5-h3">{assistant.answersHeading}</h3>
              {assistant.answersParagraphs.map((p) => (
                <p className="v5-body v5-lf-copy" key={p}>{p}</p>
              ))}
            </div>
            <Media src={IMG.assistant} alt="Operations leader querying roster data in plain language" />
          </div>
          <div className="v5-lf-after">
            <CardGrid items={assistant.items} cols={4} />
          </div>
          <article className="v5-card dark v5-lf-rich v5-lf-after">
            <h3 className="v5-h3">{assistant.restraintHeading}</h3>
            {assistant.restraintParagraphs.map((p) => (
              <p className="v5-body" key={p}><Rich text={p} /></p>
            ))}
          </article>
        </div>
      </section>

      {/* Zero-IT integration — integrations split */}
      <section className="v5-section v5-bg-grey">
        <div className="v5-container">
          <div className="v5-split">
            <div className="v5-split-copy">
              <span className="v5-eyebrow">Integrations</span>
              <h2 className="v5-h2">{integration.heading}</h2>
              <h3 className="v5-h3 v5-lf-sub">{integration.ingestHeading}</h3>
              {integration.ingestParagraphs.map((p) => (
                <p className="v5-body v5-lf-copy" key={p}>{p}</p>
              ))}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 22 }}>
                {["Workday", "UKG", "SAP SuccessFactors", "Oracle HCM", "CSV", "Excel"].map((tool) => (
                  <span className="v5-chip" key={tool} style={{ background: "var(--v5-white)" }}>{tool}</span>
                ))}
              </div>
            </div>
            <Media src={IMG.integration} alt="Systems of record exporting flat files for ingestion" />
          </div>
          <div className="v5-lf-after">
            <CardGrid items={integration.ingestItems} cols={4} />
          </div>
        </div>
      </section>

      {/* File normalization + nightly ingestion — fit-signals split */}
      <section className="v5-section v5-bg-white">
        <div className="v5-container">
          <div className="v5-split v5-lf-split-top">
            <div className="v5-split-copy">
              <h3 className="v5-h2">{integration.cleanHeading}</h3>
              {integration.cleanParagraphs.map((p) => (
                <p className="v5-body v5-lf-copy" key={p}>{p}</p>
              ))}
              <div className="v5-card dark" style={{ marginTop: 24 }}>
                <h3 className="v5-h3">{integration.nightlyHeading}</h3>
                <p className="v5-body">{integration.nightly}</p>
              </div>
            </div>
            <div className="v5-card">
              <ul className="v5-list v5-lf-list">
                {integration.cleanItems.map((item) => (
                  <li key={item.label}><strong>{item.label}</strong>: {item.body}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ — visible answers for people and answer engines alike */}
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

      {/* Explore other accelerators */}
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

      {/* Conversion form */}
      <section className="v5-section v5-bg-grey" id="get-started" style={{ scrollMarginTop: 96 }}>
        <div className="v5-container">
          <div className="v5-contact-grid">
            <aside>
              <span className="v5-eyebrow">Get started</span>
              <h2 className="v5-h2" style={{ marginTop: 14 }}>{cta.button}</h2>
              <p className="v5-lead" style={{ marginTop: 16, fontStyle: "italic" }}>{cta.note}</p>
            </aside>
            <div>
              <AcceleratorForm acceleratorName={NAME} acceleratorCategory="Labor demand forecasting" />
            </div>
          </div>
        </div>
      </section>
    </V5SiteLayout>
  );
}
