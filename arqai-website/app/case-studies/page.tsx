import type { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";
import V5Nav from "@/components/home-v5/V5Nav";
import Footer from "@/components/home-v5/Footer";
import { ArrowRight } from "@/components/home-v5/icons";
import "@/components/home-v5/styles.css";

// Server-rendered so the proof section of the site is visible to crawlers
// and answer engines (which do not execute JavaScript).
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Case Studies: Production AI Results",
  description:
    "How enterprise teams put ArqAI Labs accelerators and agents into production — with the baseline, the intervention, and the measured outcome for each engagement.",
  alternates: { canonical: "https://thearq.ai/case-studies" },
  openGraph: {
    title: "Case Studies: Production AI Results | ArqAI Labs",
    description:
      "How enterprise teams put ArqAI Labs accelerators and agents into production — with the baseline, the intervention, and the measured outcome for each engagement.",
    url: "https://thearq.ai/case-studies",
  },
};

type CaseStudy = {
  id: string;
  title: string;
  slug: string;
  client_name?: string;
  industry?: string;
  hero_image?: string;
  overview?: string;
  impact_summary?: string;
  metrics?: { label: string; value: string }[];
  published_at?: string;
};

async function getCaseStudies(): Promise<CaseStudy[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return [];

  const supabase = createClient(url, key);
  const { data, error } = await supabase
    .from("case_studies")
    .select("id, title, slug, client_name, industry, hero_image, overview, impact_summary, metrics, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) return [];
  return (data as CaseStudy[]) || [];
}

// The real, publishable engagement lives at a static route and is pinned to
// the top of the listing so the proof section is never empty.
const pinned: CaseStudy = {
  id: "tpa-blind-spot-assessment",
  title: "$3.2M in Undetected Waste Found at a Mid-Size TPA",
  slug: "tpa-blind-spot-assessment",
  client_name: "Mid-size third-party administrator",
  industry: "Healthcare Payers",
  overview:
    "Rated fully compliant by its payment-integrity vendor, one ArqAI Blind Spot Assessment still surfaced roughly $3.2M in undetected waste — and cut manual claims-review time by about 70%.",
  metrics: [
    { label: "Undetected waste surfaced", value: "$3.2M" },
    { label: "Less manual review time", value: "70%" },
    { label: "Assessment engagement", value: "1" },
  ],
};

export default async function CaseStudiesPage() {
  const fromDb = await getCaseStudies();
  const caseStudies = [pinned, ...fromDb.filter((s) => s.slug !== pinned.slug)];

  return (
    <div className="v5-shell">
      <V5Nav />
      <main>
        {/* Hero */}
        <section className="v5-page-hero">
          <div className="v5-container">
            <div className="v5-page-hero-inner">
              <span className="v5-badge">
                <span className="v5-badge-dot" />
                Case Studies
              </span>
              <h1 className="v5-h1">Client Success Stories</h1>
              <p className="v5-lead">
                See how leading organizations have transformed their operations with ArqAI
              </p>
            </div>
          </div>
        </section>

        {/* Case Studies Grid */}
        <section className="v5-section v5-bg-grey">
          <div className="v5-container">
            <div className="v5-cs-grid">
                {caseStudies.map((study) => (
                  <a key={study.id} className="v5-blog-card" href={`/case-studies/${study.slug}`}>
                    <div className="v5-blog-cover">
                      {study.hero_image ? (
                        <img
                          src={study.hero_image}
                          alt={study.title}
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <div className="v5-blog-cover-placeholder" />
                      )}
                    </div>
                    <div className="v5-blog-body">
                      <span className="v5-blog-meta">
                        {study.industry && <span className="v5-blog-cat">{study.industry}</span>}
                        {study.client_name}
                      </span>
                      <h3 className="v5-h3">{study.title}</h3>
                      {study.overview && <p className="v5-cs-overview">{study.overview}</p>}

                      {study.metrics && study.metrics.length > 0 && (
                        <div className="v5-cs-metrics">
                          {study.metrics.slice(0, 3).map((metric, idx) => (
                            <div key={idx} className="v5-cs-metric">
                              <strong>{metric.value}</strong>
                              <span>{metric.label}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <span className="v5-card-more">
                        Read Case Study <ArrowRight />
                      </span>
                    </div>
                  </a>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
