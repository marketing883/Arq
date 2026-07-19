import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import V5SiteLayout from "@/components/home-v5/V5SiteLayout";
import ClosingCta from "@/components/v6/ClosingCta";
import { generateCaseStudySchema, generateBreadcrumbSchema } from "@/lib/seo/structured-data";

function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey) return null;
  return createClient(supabaseUrl, supabaseKey);
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const supabase = getSupabase();

  if (!supabase) {
    return { title: "Case Study" };
  }

  const { data: caseStudy } = await supabase
    .from("case_studies")
    .select("title, overview, industry, client_name, hero_image")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!caseStudy) {
    return { title: "Case Study Not Found" };
  }

  const title = `${caseStudy.title} — Case Study`;
  const description = caseStudy.overview || `See how ${caseStudy.client_name || "our client"} in ${caseStudy.industry} transformed their operations with ArqAI's governed AI solutions.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url: `https://thearq.ai/case-studies/${slug}`,
      images: caseStudy.hero_image ? [{ url: caseStudy.hero_image, alt: caseStudy.title }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: caseStudy.hero_image ? [caseStudy.hero_image] : [],
      site: "@The_ArqAI",
      creator: "@The_ArqAI",
    },
    alternates: {
      canonical: `https://thearq.ai/case-studies/${slug}`,
    },
  };
}

async function getCaseStudy(slug: string) {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("case_studies")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error || !data) return null;
  return data;
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const caseStudy = await getCaseStudy(slug);

  if (!caseStudy) {
    notFound();
  }

  const metrics = caseStudy.metrics || [];
  const challengePoints = caseStudy.challenge_points || [];
  const solutionPoints = caseStudy.solution_points || [];

  // Generate structured data for SEO/AEO
  const caseStudySchema = generateCaseStudySchema({
    title: caseStudy.title,
    description: caseStudy.overview || caseStudy.title,
    url: `https://thearq.ai/case-studies/${slug}`,
    image: caseStudy.featured_image,
    client: caseStudy.client_name || "Enterprise Client",
    industry: caseStudy.industry,
    publishedDate: caseStudy.created_at || new Date().toISOString(),
    metrics: metrics,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://thearq.ai" },
    { name: "Case Studies", url: "https://thearq.ai/case-studies" },
    { name: caseStudy.title, url: `https://thearq.ai/case-studies/${slug}` },
  ]);

  return (
    <V5SiteLayout>
      {/* Structured Data for SEO/AEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(caseStudySchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Hero */}
      <section className="v5-page-hero">
        <div className="v5-container">
          <div className="v5-page-hero-inner">
            <div className="v5-crumbs" style={{ marginBottom: 24 }}>
              <Link href="/">Home</Link>
              <span>/</span>
              <Link href="/case-studies">Case Studies</Link>
              <span>/</span>
              <span style={{ color: "var(--v5-ink-soft)" }}>{caseStudy.title}</span>
            </div>
            <span className="v5-badge">
              <span className="v5-badge-dot" />
              {caseStudy.industry}
              {caseStudy.client_name ? ` · ${caseStudy.client_name}` : ""}
            </span>
            <h1 className="v5-h1">{caseStudy.title}</h1>
            {caseStudy.overview && <p className="v5-lead">{caseStudy.overview}</p>}
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      {metrics.length > 0 && (
        <section className="v5-section v5-bg-white">
          <div className="v5-container">
            <div className="v5-stats">
              {metrics.map(
                (
                  metric: { label: string; value: string; description: string },
                  index: number
                ) => (
                  <div key={index} className="v5-stat">
                    <strong>{metric.value}</strong>
                    <span>{metric.label}</span>
                    {metric.description && (
                      <span style={{ color: "var(--v5-grey-100)" }}>
                        {metric.description}
                      </span>
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        </section>
      )}

      {/* Challenge Section */}
      {(caseStudy.challenge_description || challengePoints.length > 0) && (
        <section className="v5-section v5-bg-grey">
          <div className="v5-container">
            <div className="v5-section-head">
              <span className="v5-eyebrow">The Challenge</span>
              {caseStudy.challenge_description && (
                <p className="v5-lead">{caseStudy.challenge_description}</p>
              )}
            </div>
            {challengePoints.length > 0 && (
              <ul className="v5-prose" style={{ maxWidth: "none" }}>
                {challengePoints.map((point: { text: string }, index: number) => (
                  <li key={index}>{point.text}</li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}

      {/* Solution Section */}
      {(caseStudy.solution_description || solutionPoints.length > 0) && (
        <section className="v5-section v5-bg-white">
          <div className="v5-container">
            <div className="v5-section-head">
              <span className="v5-eyebrow">Our Solution</span>
              {caseStudy.solution_description && (
                <p className="v5-lead">{caseStudy.solution_description}</p>
              )}
            </div>
            {solutionPoints.length > 0 && (
              <ul className="v5-prose" style={{ maxWidth: "none" }}>
                {solutionPoints.map((point: { text: string }, index: number) => (
                  <li key={index}>{point.text}</li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}

      {/* Impact Section */}
      {caseStudy.impact_summary && (
        <section className="v5-section v5-bg-grey">
          <div className="v5-container">
            <div className="v5-section-head">
              <span className="v5-eyebrow">The Impact</span>
              <p className="v5-lead">{caseStudy.impact_summary}</p>
            </div>
          </div>
        </section>
      )}

      {/* Testimonial Section */}
      {caseStudy.testimonial_quote && (
        <section className="v5-section v5-bg-white">
          <div className="v5-container">
            <div className="v5-section-head center">
              <blockquote className="v5-h2">
                &ldquo;{caseStudy.testimonial_quote}&rdquo;
              </blockquote>
              {caseStudy.testimonial_author_name && (
                <p className="v5-lead">
                  {caseStudy.testimonial_author_name}
                  {(caseStudy.testimonial_author_title ||
                    caseStudy.testimonial_author_company) && (
                    <>
                      {" — "}
                      {caseStudy.testimonial_author_title}
                      {caseStudy.testimonial_author_title &&
                        caseStudy.testimonial_author_company &&
                        ", "}
                      {caseStudy.testimonial_author_company}
                    </>
                  )}
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <ClosingCta
        heading="Ready to Transform Your Business?"
        sub="See how ArqAI can help you achieve similar results with governed AI solutions."
        ctaLabel="Get Started"
        ctaHref="/contact"
        secondaryLabel="View More Case Studies"
        secondaryHref="/case-studies"
      />
    </V5SiteLayout>
  );
}
