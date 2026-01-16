import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
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
    return { title: "Case Study | ArqAI" };
  }

  const { data: caseStudy } = await supabase
    .from("case_studies")
    .select("title, overview, industry, client_name, featured_image")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!caseStudy) {
    return { title: "Case Study Not Found | ArqAI" };
  }

  const title = `${caseStudy.title} | ArqAI Case Study`;
  const description = caseStudy.overview || `See how ${caseStudy.client_name || "our client"} in ${caseStudy.industry} transformed their operations with ArqAI's governed AI solutions.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url: `https://thearq.ai/case-studies/${slug}`,
      images: caseStudy.featured_image ? [{ url: caseStudy.featured_image, alt: caseStudy.title }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: caseStudy.featured_image ? [caseStudy.featured_image] : [],
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
    <>
      {/* Structured Data for SEO/AEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(caseStudySchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Header />
      <main className="min-h-screen bg-base">
        {/* Hero Section - Uses ArqAI brand blue */}
        <section className="bg-[#0432a5] py-20 md:py-28">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl">
              <div className="flex items-center gap-3 mb-6">
                <span className="px-3 py-1 bg-white/20 text-white rounded-full text-sm font-medium">
                  {caseStudy.industry}
                </span>
                <span className="text-white/60">|</span>
                <span className="text-white/80">{caseStudy.client_name}</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                {caseStudy.title}
              </h1>
              {caseStudy.overview && (
                <p className="text-xl text-white/90 leading-relaxed">
                  {caseStudy.overview}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Metrics Section */}
        {metrics.length > 0 && (
          <section className="py-16 bg-[#161616]">
            <div className="container mx-auto px-4 md:px-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {metrics.map((metric: { label: string; value: string; description: string }, index: number) => (
                  <div
                    key={index}
                    className="bg-[#1C1C1C] rounded-2xl p-6 text-center border border-[#252525]"
                  >
                    <div className="text-4xl md:text-5xl font-bold text-[#d0f438] mb-2">
                      {metric.value}
                    </div>
                    <div className="font-semibold text-white mb-1">
                      {metric.label}
                    </div>
                    {metric.description && (
                      <div className="text-sm text-[#ACACAC]">
                        {metric.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Challenge Section */}
        {(caseStudy.challenge_description || challengePoints.length > 0) && (
          <section className="py-16 md:py-20 bg-base">
            <div className="container mx-auto px-4 md:px-6">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                    <svg className="w-6 h-6 text-base-opp" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-text-bright">
                    The Challenge
                  </h2>
                </div>
                {caseStudy.challenge_description && (
                  <p className="text-lg text-text-muted mb-8 leading-relaxed">
                    {caseStudy.challenge_description}
                  </p>
                )}
                {challengePoints.length > 0 && (
                  <ul className="space-y-4">
                    {challengePoints.map((point: { text: string }, index: number) => (
                      <li key={index} className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </div>
                        <span className="text-text-medium">
                          {point.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Solution Section */}
        {(caseStudy.solution_description || solutionPoints.length > 0) && (
          <section className="py-16 md:py-20 bg-[#161616]">
            <div className="container mx-auto px-4 md:px-6">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-[#0432a5] flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white">
                    Our Solution
                  </h2>
                </div>
                {caseStudy.solution_description && (
                  <p className="text-lg text-[#ACACAC] mb-8 leading-relaxed">
                    {caseStudy.solution_description}
                  </p>
                )}
                {solutionPoints.length > 0 && (
                  <ul className="space-y-4">
                    {solutionPoints.map((point: { text: string }, index: number) => (
                      <li key={index} className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-[#E0E0E0]">
                          {point.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Impact Section */}
        {caseStudy.impact_summary && (
          <section className="py-16 md:py-20 bg-base">
            <div className="container mx-auto px-4 md:px-6">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                    <svg className="w-6 h-6 text-base-opp" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-text-bright">
                    The Impact
                  </h2>
                </div>
                <p className="text-lg text-text-muted leading-relaxed">
                  {caseStudy.impact_summary}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Testimonial Section */}
        {caseStudy.testimonial_quote && (
          <section className="py-16 md:py-20 bg-[#0432a5]">
            <div className="container mx-auto px-4 md:px-6">
              <div className="max-w-4xl mx-auto text-center">
                <svg className="w-12 h-12 mx-auto mb-6 text-white/40" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <blockquote className="text-2xl md:text-3xl font-medium text-white mb-8 leading-relaxed">
                  &ldquo;{caseStudy.testimonial_quote}&rdquo;
                </blockquote>
                {caseStudy.testimonial_author_name && (
                  <div className="flex flex-col items-center">
                    <div className="font-semibold text-white text-lg">
                      {caseStudy.testimonial_author_name}
                    </div>
                    {(caseStudy.testimonial_author_title || caseStudy.testimonial_author_company) && (
                      <div className="text-white/80">
                        {caseStudy.testimonial_author_title}
                        {caseStudy.testimonial_author_title && caseStudy.testimonial_author_company && ", "}
                        {caseStudy.testimonial_author_company}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-16 md:py-20 bg-base">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-text-bright mb-4">
              Ready to Transform Your Business?
            </h2>
            <p className="text-lg text-text-muted mb-8 max-w-2xl mx-auto">
              See how ArqAI can help you achieve similar results with governed AI solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="btn btn-primary"
              >
                Schedule a Demo
              </Link>
              <Link
                href="/case-studies"
                className="btn btn-outline"
              >
                View More Case Studies
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
