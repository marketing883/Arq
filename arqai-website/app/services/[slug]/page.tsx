import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import V5SiteLayout from "@/components/home-v5/V5SiteLayout";
import V5CtaSection from "@/components/home-v5/V5CtaSection";
import { ArrowRight, SparkIcon, ShieldIcon, InsightIcon, DocIcon, ChatIcon } from "@/components/home-v5/icons";
import { getService, services } from "@/lib/data/services";
import { generateServiceSchema, generateBreadcrumbSchema } from "@/lib/seo/structured-data";

const CAP_ICONS = [SparkIcon, InsightIcon, ShieldIcon, DocIcon, ChatIcon];

// Serve big decorative images straight from the Unsplash CDN (already AVIF/WebP
// via auto=format) instead of routing them through Next's image optimizer.
const cdn = (url: string, w: number) =>
  url.replace(/w=\d+/, `w=${w}`).replace(/q=\d+/, "q=62");
const cdnSrcSet = (url: string, widths: number[]) =>
  widths.map((w) => `${cdn(url, w)} ${w}w`).join(", ");

type ServicePageProps = {
  params: {
    slug: string;
  };
};

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export function generateMetadata({ params }: ServicePageProps): Metadata {
  const service = getService(params.slug);
  if (!service) {
    return { title: "Service Not Found | ArqAI Labs" };
  }
  return {
    title: `${service.title} | ArqAI Labs`,
    description: service.summary,
    alternates: { canonical: `https://thearq.ai/services/${service.slug}` },
    openGraph: {
      title: `${service.title} — ArqAI Labs`,
      description: service.summary,
      images: [{ url: service.heroImage }],
    },
  };
}

export default function ServiceDetailPage({ params }: ServicePageProps) {
  const service = getService(params.slug);
  if (!service) {
    notFound();
  }

  const others = services.filter((s) => s.slug !== service.slug).slice(0, 3);

  const url = `https://thearq.ai/services/${service.slug}`;
  const serviceSchema = generateServiceSchema({
    name: service.title,
    description: service.summary,
    serviceType: service.shortTitle,
    url,
    image: service.image,
  });
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://thearq.ai" },
    { name: "Services", url: "https://thearq.ai/services" },
    { name: service.title, url },
  ]);

  return (
    <V5SiteLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {/* Preload the LCP hero image (served from the Unsplash CDN) */}
      <link
        rel="preload"
        as="image"
        href={cdn(service.heroImage, 1920)}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        {...({ imageSrcSet: cdnSrcSet(service.heroImage, [960, 1280, 1600, 1920]), imageSizes: "100vw", fetchPriority: "high" } as any)}
      />

      {/* Hero — full-bleed image, animated overlay, content on top */}
      <section className="v5-acc-hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="v5-acc-hero-img"
          src={cdn(service.heroImage, 1920)}
          srcSet={cdnSrcSet(service.heroImage, [960, 1280, 1600, 1920])}
          sizes="100vw"
          alt={service.title}
          decoding="async"
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          {...({ fetchPriority: "high" } as any)}
        />
        <span className="v5-acc-hero-aurora" aria-hidden="true" />
        <span className="v5-acc-hero-sheen" aria-hidden="true" />
        <div className="v5-container">
          <div className="v5-acc-hero-body">
            <div className="v5-crumbs" style={{ marginBottom: 18 }}>
              <Link href="/platform">Platform</Link>
              <span>/</span>
              <Link href="/services">Services</Link>
              <span>/</span>
              <span style={{ color: "#fff" }}>{service.shortTitle}</span>
            </div>
            <span className="v5-badge on-dark">
              <span className="v5-badge-dot" />
              ArqAI Platform
            </span>
            <h1 className="v5-h1">{service.title}</h1>
            <p className="v5-lead">{service.summary}</p>
            <div className="v5-hero-actions">
              <Link href="/demo" className="v5-btn v5-btn-primary">
                Get Started <ArrowRight />
              </Link>
              <Link
                href="/services"
                className="v5-btn v5-btn-ghost"
                style={{ background: "transparent", borderColor: "rgba(255,255,255,0.4)", color: "#fff" }}
              >
                All services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Overview + outcomes */}
      <section className="v5-section v5-bg-grey">
        <div className="v5-container">
          <div className="v5-split">
            <div className="v5-split-copy">
              <span className="v5-eyebrow">Overview</span>
              <h2 className="v5-h2" style={{ marginTop: 14 }}>What this service is.</h2>
              <p className="v5-lead" style={{ marginTop: 16 }}>{service.overview}</p>
            </div>
            <div className="v5-stats" style={{ gridTemplateColumns: "1fr", alignContent: "start" }}>
              {service.outcomes.map((o) => (
                <div className="v5-stat" key={o.label} style={{ background: "var(--v5-white)" }}>
                  <strong>{o.value}</strong>
                  <span>{o.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Problem / Promise */}
      <section className="v5-section v5-bg-white">
        <div className="v5-container">
          <div className="v5-grid v5-grid-2">
            <article className="v5-card">
              <span className="v5-card-eyebrow">The challenge</span>
              <h2 className="v5-h3">Where teams get stuck.</h2>
              <p className="v5-body">{service.problem}</p>
            </article>
            <article className="v5-card dark">
              <span className="v5-card-eyebrow" style={{ color: "var(--v5-lime)" }}>The shift</span>
              <h2 className="v5-h3">What changes with ArqAI.</h2>
              <p className="v5-body">{service.promise}</p>
            </article>
          </div>
        </div>
      </section>

      {/* Full-width showcase band */}
      <section className="v5-showcase">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="v5-showcase-img"
          src={cdn(service.secondaryImage, 1920)}
          srcSet={cdnSrcSet(service.secondaryImage, [960, 1280, 1600, 1920])}
          sizes="100vw"
          alt=""
          loading="lazy"
          decoding="async"
        />
        <span className="v5-showcase-inset" />
        <div className="v5-container">
          <div className="v5-showcase-body">
            <span className="v5-card-eyebrow" style={{ color: "var(--v5-lime)" }}>Built for production</span>
            <h2 className="v5-h2" style={{ marginTop: 10 }}>{service.promise}</h2>
            <div className="v5-cta-card-actions" style={{ justifyContent: "flex-start", marginTop: 24 }}>
              <Link href="/demo" className="v5-btn v5-btn-primary">
                Get Started <ArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="v5-section v5-bg-grey">
        <div className="v5-container">
          <div className="v5-section-head">
            <span className="v5-eyebrow">Capabilities</span>
            <h2 className="v5-h2">What the engagement delivers.</h2>
            <p className="v5-lead">
              Bespoke engineering around your data, systems, and controls — not a generic model wrapper.
            </p>
          </div>
          <div className="v5-grid v5-grid-3">
            {service.capabilities.map((cap, i) => {
              const Icon = CAP_ICONS[i % CAP_ICONS.length];
              return (
                <div className="v5-card" key={cap.title}>
                  <span className="v5-card-ico"><Icon /></span>
                  <h3 className="v5-h3">{cap.title}</h3>
                  <p className="v5-body">{cap.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Deliverables */}
      <section className="v5-section v5-bg-white">
        <div className="v5-container">
          <div className="v5-split">
            <div className="v5-split-copy">
              <span className="v5-eyebrow">What you get</span>
              <h2 className="v5-h2">Concrete deliverables.</h2>
              <p className="v5-lead">
                Artifacts your business, technology, and risk owners can use — built for production, not the shelf.
              </p>
            </div>
            <div className="v5-card">
              <ul className="v5-list">
                {service.deliverables.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="v5-section v5-bg-grey">
        <div className="v5-container">
          <div className="v5-section-head">
            <span className="v5-eyebrow">Use cases</span>
            <h2 className="v5-h2">Where it earns its place.</h2>
          </div>
          <div className="v5-grid v5-grid-3">
            {service.useCases.map((uc) => (
              <div className="v5-card" key={uc.title}>
                <h3 className="v5-h3">{uc.title}</h3>
                <p className="v5-body">{uc.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations + supporting image */}
      <section className="v5-section v5-bg-white">
        <div className="v5-container">
          <div className="v5-split">
            <div className="v5-split-copy">
              <span className="v5-eyebrow">Integrations</span>
              <h2 className="v5-h2">Wired into the stack you already run.</h2>
              <p className="v5-lead">{service.promise}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 22 }}>
                {service.integrations.map((tool) => (
                  <span className="v5-chip" key={tool}>{tool}</span>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div className="v5-media-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cdn(service.tertiaryImage, 800)}
                  srcSet={cdnSrcSet(service.tertiaryImage, [480, 800])}
                  sizes="(min-width: 860px) 420px, 100vw"
                  alt={`${service.title} in context`}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fit signals */}
      <section className="v5-section v5-bg-grey">
        <div className="v5-container">
          <div className="v5-split">
            <div className="v5-split-copy">
              <span className="v5-eyebrow">Fit signals</span>
              <h2 className="v5-h2">When this service fits.</h2>
            </div>
            <div className="v5-card">
              <ul className="v5-list">
                {service.signals.map((signal) => (
                  <li key={signal}>{signal}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Explore other services */}
      <section className="v5-section v5-bg-white">
        <div className="v5-container">
          <div className="v5-section-head">
            <span className="v5-eyebrow">More of the platform</span>
            <h2 className="v5-h2">Explore the rest of the service line.</h2>
          </div>
          <div className="v5-grid v5-grid-3">
            {others.map((s) => (
              <Link
                href={`/services/${s.slug}`}
                className="v5-card v5-card-link"
                key={s.slug}
                style={{ padding: 0, overflow: "hidden" }}
              >
                <div className="v5-svc-media">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={cdn(s.image, 800)} alt="" loading="lazy" decoding="async" />
                </div>
                <div style={{ padding: 22, display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                  <span className="v5-card-eyebrow">{s.shortTitle}</span>
                  <h3 className="v5-h3">{s.title}</h3>
                  <p className="v5-body">{s.summary}</p>
                  <span className="v5-card-more">Learn more <ArrowRight /></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA band */}
      <V5CtaSection>
            <h2 className="v5-h2">{service.cta.heading}</h2>
            <p className="v5-lead">{service.cta.body}</p>
            <div className="v5-cta-card-actions">
              <Link href="/demo" className="v5-btn v5-btn-primary">
                Get Started <ArrowRight />
              </Link>
              <Link href="/services" className="v5-btn v5-btn-ghost">
                All services
              </Link>
            </div>
      </V5CtaSection>
    </V5SiteLayout>
  );
}
