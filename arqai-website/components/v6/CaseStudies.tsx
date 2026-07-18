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

// The one real, publishable engagement — a static route at
// /case-studies/tpa-blind-spot-assessment — always leads the spotlight so
// the proof band never renders empty, whatever the CMS holds.
const pinned: SpotlightStudy = {
  title: "$3.2M in Undetected Waste Found at a Mid-Size TPA",
  slug: "tpa-blind-spot-assessment",
  client_name: "Mid-size third-party administrator",
  industry: "Healthcare Payers",
  hero_image: "/v5/assets/accel/arqfwa.jpg",
  overview:
    "Rated fully compliant by its payment-integrity vendor, one ArqAI Blind Spot Assessment still surfaced roughly $3.2M in undetected waste — and cut manual claims-review time by about 70%.",
  impact_summary:
    "One Blind Spot Assessment surfaced roughly $3.2M in waste a compliant-rated program had missed.",
  metrics: [
    { label: "Undetected waste surfaced", value: "$3.2M" },
    { label: "Less manual review time", value: "70%" },
    { label: "Assessment engagement", value: "1" },
    { label: "Findings with reviewable evidence", value: "100%" },
  ],
};

export default async function CaseStudies() {
  const studies = await getCaseStudies();
  const rest = studies.filter((s) => s.slug !== pinned.slug);

  return <CaseStudySpotlight study={pinned} others={rest} />;
}
