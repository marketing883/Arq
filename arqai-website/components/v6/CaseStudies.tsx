import React from "react";
import { createClient } from "@supabase/supabase-js";
import { ArrowRight, ArrowUpRight, Quote } from "lucide-react";

// ---------------------------------------------------------------------------
// Data — published case studies from the CMS (Supabase). The first (featured
// first, newest first) becomes the editorial lead; the rest render as cards.
// ---------------------------------------------------------------------------

type Metric = { label: string; value: string; description?: string };

type CaseStudy = {
  id: string;
  title: string;
  slug: string;
  client_name: string;
  industry: string;
  hero_image?: string | null;
  overview?: string | null;
  impact_summary?: string | null;
  metrics?: Metric[] | null;
  testimonial_quote?: string | null;
  testimonial_author_name?: string | null;
  testimonial_author_title?: string | null;
};

async function getCaseStudies(): Promise<CaseStudy[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) return [];

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase
      .from("case_studies")
      .select(
        "id, title, slug, client_name, industry, hero_image, overview, impact_summary, metrics, testimonial_quote, testimonial_author_name, testimonial_author_title"
      )
      .eq("status", "published")
      .order("featured", { ascending: false })
      .order("published_at", { ascending: false })
      .limit(3);

    if (error) return [];
    return (data as CaseStudy[]) || [];
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// Pieces
// ---------------------------------------------------------------------------

function MetricRow({ metric, lead = false }: { metric: Metric; lead?: boolean }) {
  return (
    <div className="py-5 first:pt-0 last:pb-0">
      <div className="flex items-baseline gap-3">
        <span
          className={`font-display font-semibold tracking-tight text-gray-900 ${
            lead ? "text-5xl md:text-[56px]" : "text-3xl md:text-4xl"
          }`}
        >
          {metric.value}
        </span>
        {lead && (
          <span className="h-2.5 w-2.5 shrink-0 self-center bg-[#d0f438]" aria-hidden="true" />
        )}
      </div>
      <div className="mt-1.5 text-[13px] font-semibold text-gray-800">{metric.label}</div>
      {metric.description && (
        <div className="mt-0.5 text-[12.5px] leading-snug text-gray-500">{metric.description}</div>
      )}
    </div>
  );
}

function FeaturedStudy({ study }: { study: CaseStudy }) {
  const metrics = (study.metrics ?? []).slice(0, 3);

  return (
    <div className="grid overflow-hidden rounded-2xl border border-gray-100 bg-gray-50/60 lg:grid-cols-[1.35fr_1fr]">
      {/* Narrative side */}
      <div className="flex flex-col p-8 md:p-10">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-[#0d1226] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[#d0f438]">
            {study.industry}
          </span>
          <span className="text-[13px] font-medium text-gray-500">{study.client_name}</span>
        </div>

        <h3 className="mt-5 font-display text-[26px] font-semibold leading-tight tracking-tight text-gray-900 md:text-[32px]">
          {study.title}
        </h3>

        {(study.impact_summary || study.overview) && (
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-gray-600">
            {study.impact_summary || study.overview}
          </p>
        )}

        {study.testimonial_quote && (
          <figure className="mt-6 border-l-2 border-[#d0f438] pl-4">
            <Quote size={14} className="mb-1.5 text-gray-300" aria-hidden="true" />
            <blockquote className="text-[14.5px] italic leading-relaxed text-gray-700">
              “{study.testimonial_quote}”
            </blockquote>
            {study.testimonial_author_name && (
              <figcaption className="mt-2 text-[12.5px] font-semibold text-gray-500">
                {study.testimonial_author_name}
                {study.testimonial_author_title ? ` — ${study.testimonial_author_title}` : ""}
              </figcaption>
            )}
          </figure>
        )}

        <a
          href={`/case-studies/${study.slug}`}
          className="group mt-auto inline-flex items-center gap-2 pt-8 text-[14.5px] font-semibold text-gray-900"
        >
          Read the full case study
          <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
        </a>
      </div>

      {/* Metrics side — editorial rows, hairline-divided */}
      <div className="relative flex flex-col justify-center border-t border-gray-100 bg-white p-8 md:p-10 lg:border-l lg:border-t-0">
        <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.18em] text-gray-400">
          Measured outcomes
        </p>
        {metrics.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {metrics.map((m, i) => (
              <MetricRow key={m.label} metric={m} lead={i === 0} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">{study.overview}</p>
        )}
      </div>
    </div>
  );
}

function StudyCard({ study }: { study: CaseStudy }) {
  const headline = (study.metrics ?? [])[0];

  return (
    <a
      href={`/case-studies/${study.slug}`}
      className="group flex flex-col rounded-2xl border border-gray-100 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_-32px_rgba(22,31,61,0.35)]"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-md bg-gray-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-gray-700">
          {study.industry}
        </span>
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-700 transition-all duration-300 group-hover:border-gray-900 group-hover:bg-gray-900 group-hover:text-[#d0f438]">
          <ArrowUpRight size={15} />
        </span>
      </div>

      {headline && (
        <div className="mt-6 flex items-baseline gap-2.5">
          <span className="font-display text-4xl font-semibold tracking-tight text-gray-900">
            {headline.value}
          </span>
          <span className="text-[12.5px] font-semibold text-gray-500">{headline.label}</span>
        </div>
      )}

      <h3 className="mt-3 font-display text-[19px] font-semibold leading-snug text-gray-900">
        {study.title}
      </h3>
      <p className="mt-1.5 text-[13px] text-gray-500">{study.client_name}</p>

      {(study.impact_summary || study.overview) && (
        <p className="mt-3 line-clamp-3 text-[13.5px] leading-relaxed text-gray-600">
          {study.impact_summary || study.overview}
        </p>
      )}
    </a>
  );
}

function SkeletonSection() {
  return (
    <div className="grid gap-5 lg:grid-cols-[1.35fr_1fr]">
      <div className="h-[380px] animate-pulse rounded-2xl bg-gray-100" />
      <div className="flex flex-col gap-5">
        <div className="h-[180px] animate-pulse rounded-2xl bg-gray-100" />
        <div className="h-[180px] animate-pulse rounded-2xl bg-gray-100" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Section
// ---------------------------------------------------------------------------

export default async function CaseStudies() {
  const studies = await getCaseStudies();
  const [featured, ...rest] = studies;

  return (
    <section className="relative bg-white" id="case-studies">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:px-10 md:py-28 lg:px-14">
        {/* Header */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.22em] text-gray-500">
              <span className="inline-flex h-2 w-2 rounded-full bg-[#d0f438] shadow-[0_0_0_4px_rgba(208,244,56,0.35)]" />
              Case studies
            </p>
            <h2 className="mt-4 font-display text-[clamp(28px,3.4vw,44px)] font-semibold leading-[1.1] tracking-tight text-gray-900">
              The specifics, not the pitch.
            </h2>
            <p className="mt-4 text-[15.5px] leading-relaxed text-gray-600">
              Named workflows, real constraints, measured outcomes — how deployed
              engagements actually ran, written for the people who will be asked
              to sign off on the next one.
            </p>
          </div>
          <a
            href="/case-studies"
            className="group inline-flex shrink-0 items-center gap-2 rounded-lg bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800"
          >
            All case studies
            <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </a>
        </div>

        {/* Content */}
        <div className="mt-12">
          {!featured ? (
            <SkeletonSection />
          ) : (
            <div className="flex flex-col gap-5">
              <FeaturedStudy study={featured} />
              {rest.length > 0 && (
                <div className={`grid gap-5 ${rest.length > 1 ? "md:grid-cols-2" : ""}`}>
                  {rest.map((study) => (
                    <StudyCard key={study.id} study={study} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
