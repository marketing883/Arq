"use client";

import { useEffect, useState } from "react";
import V5Nav from "@/components/home-v5/V5Nav";
import Footer from "@/components/home-v5/Footer";
import { ArrowRight } from "@/components/home-v5/icons";
import "@/components/home-v5/styles.css";

interface CaseStudy {
  id: string;
  title: string;
  slug: string;
  client_name: string;
  industry: string;
  hero_image?: string;
  overview?: string;
  impact_summary?: string;
  metrics?: { label: string; value: string }[];
  published_at: string;
}

export default function CaseStudiesPage() {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCaseStudies() {
      try {
        const response = await fetch("/api/case-studies/list");
        if (response.ok) {
          const data = await response.json();
          setCaseStudies(data.caseStudies || []);
        }
      } catch (error) {
        console.error("Error fetching case studies:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCaseStudies();
  }, []);

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
            {isLoading ? (
              <div className="v5-cs-grid">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="v5-blog-card v5-blog-skeleton">
                    <div className="v5-blog-cover v5-blog-cover-placeholder" />
                    <div className="v5-blog-body">
                      <div className="v5-skel v5-skel-sm" />
                      <div className="v5-skel v5-skel-lg" />
                      <div className="v5-skel v5-skel-md" />
                    </div>
                  </div>
                ))}
              </div>
            ) : caseStudies.length === 0 ? (
              <div className="v5-section-head center">
                <h2 className="v5-h2">No case studies yet</h2>
                <p className="v5-lead">Check back soon for client success stories.</p>
              </div>
            ) : (
              <div className="v5-cs-grid">
                {caseStudies.map((study) => (
                  <a
                    key={study.id}
                    className="v5-blog-card"
                    href={`/case-studies/${study.slug}`}
                  >
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
                        {study.industry && (
                          <span className="v5-blog-cat">{study.industry}</span>
                        )}
                        {study.client_name}
                      </span>
                      <h3 className="v5-h3">{study.title}</h3>
                      {study.overview && <p className="v5-cs-overview">{study.overview}</p>}

                      {/* Impact metrics */}
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
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
