import React from "react";
import { createClient } from "@supabase/supabase-js";
import CaseStudySpotlight, { type SpotlightStudy } from "./CaseStudySpotlight";

// ---------------------------------------------------------------------------
// Data — published case studies from the CMS (Supabase). The first (featured
// first, newest first) leads the spotlight band; the rest become quick links.
// ---------------------------------------------------------------------------

async function getCaseStudies(): Promise<SpotlightStudy[]> {
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
        "title, slug, client_name, industry, hero_image, overview, impact_summary, metrics, testimonial_quote, testimonial_author_name, testimonial_author_title"
      )
      .eq("status", "published")
      .order("featured", { ascending: false })
      .order("published_at", { ascending: false })
      .limit(3);

    if (error) return [];
    return (data as SpotlightStudy[]) || [];
  } catch {
    return [];
  }
}

export default async function CaseStudies() {
  const studies = await getCaseStudies();
  const [featured, ...rest] = studies;

  // No published case studies -> slim placeholder band that keeps the rhythm.
  if (!featured) {
    return (
      <section className="relative overflow-hidden bg-[#070a14]" id="case-studies">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:px-10 lg:px-14">
          <div className="h-5 w-64 animate-pulse rounded bg-white/10" />
          <div className="mt-6 h-10 w-3/4 animate-pulse rounded bg-white/10" />
          <div className="mt-4 h-4 w-1/2 animate-pulse rounded bg-white/10" />
          <div className="mt-10 grid grid-cols-2 gap-6 border-t border-white/10 pt-8 md:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i}>
                <div className="h-12 w-24 animate-pulse rounded bg-white/10" />
                <div className="mt-3 h-3 w-32 animate-pulse rounded bg-white/10" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return <CaseStudySpotlight study={featured} others={rest} />;
}
