"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

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
    <>
      <Header />
      <main className="min-h-screen bg-base pt-24 md:pt-32">
        <div className="container mx-auto px-4 md:px-6">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12 md:mb-16"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-semibold mb-4">
              Case Studies
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-text-bright mb-4">
              Client Success Stories
            </h1>
            <p className="text-lg text-text-muted max-w-2xl mx-auto">
              See how leading organizations have transformed their operations with ArqAI
            </p>
          </motion.div>

          {/* Case Studies Grid */}
          {isLoading ? (
            <div className="grid md:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[16/10] rounded-2xl bg-base-tint mb-5" />
                  <div className="h-4 bg-base-tint rounded w-24 mb-3" />
                  <div className="h-6 bg-base-tint rounded w-3/4 mb-3" />
                  <div className="h-4 bg-base-tint rounded w-full mb-2" />
                  <div className="h-4 bg-base-tint rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : caseStudies.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-base-tint flex items-center justify-center">
                <svg className="w-10 h-10 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-text-bright mb-3">No case studies yet</h2>
              <p className="text-text-muted">Check back soon for client success stories.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {caseStudies.map((study, index) => (
                <motion.article
                  key={study.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <Link href={`/case-studies/${study.slug}`} className="block">
                    {/* Image Container */}
                    <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-5 bg-base-tint">
                      {study.hero_image ? (
                        <Image
                          src={study.hero_image}
                          alt={study.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-accent/20 to-accent/5">
                          <span className="text-4xl font-bold text-accent/30">
                            {study.client_name.charAt(0)}
                          </span>
                        </div>
                      )}
                      {study.industry && (
                        <span className="absolute top-4 left-4 px-3 py-1 bg-white/90 dark:bg-base-tint/90 backdrop-blur-sm text-xs font-semibold text-accent rounded-full">
                          {study.industry}
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div>
                      <p className="text-sm text-text-muted mb-2">{study.client_name}</p>
                      <h2 className="text-xl font-semibold text-text-bright mb-3 group-hover:text-accent transition-colors line-clamp-2">
                        {study.title}
                      </h2>
                      {study.overview && (
                        <p className="text-text-muted line-clamp-2 mb-4">
                          {study.overview}
                        </p>
                      )}

                      {/* Metrics Preview */}
                      {study.metrics && study.metrics.length > 0 && (
                        <div className="flex gap-6 mb-4">
                          {study.metrics.slice(0, 3).map((metric, idx) => (
                            <div key={idx} className="text-center">
                              <p className="text-lg font-bold text-accent">{metric.value}</p>
                              <p className="text-xs text-text-muted">{metric.label}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      <span className="inline-flex items-center gap-2 text-accent font-medium group-hover:gap-3 transition-all">
                        Read Case Study
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </span>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          )}
        </div>

        {/* Spacer */}
        <div className="h-20" />
      </main>
      <Footer />
    </>
  );
}
