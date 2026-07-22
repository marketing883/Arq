"use client";

import Link from "next/link";

import React, { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";

// ---------------------------------------------------------------------------
// Client presentation for the CMS-driven case study spotlight band.
// ---------------------------------------------------------------------------

export type SpotlightMetric = { label: string; value: string; description?: string };

export type SpotlightStudy = {
  title: string;
  slug: string;
  client_name: string;
  industry: string;
  hero_image?: string | null;
  impact_summary?: string | null;
  overview?: string | null;
  metrics?: SpotlightMetric[] | null;
  /** Qualitative proof points. Rendered as a checklist when present, in place
   *  of the numeric stat grid — for studies whose proof isn't a figure. */
  highlights?: string[] | null;
  testimonial_quote?: string | null;
  testimonial_author_name?: string | null;
  testimonial_author_title?: string | null;
};

const FALLBACK_BG = "/v5/assets/accel/arqfwa.jpg";

function useInView<T extends HTMLElement>(threshold = 0.3) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

/** Parse "30%+", "$1M", "2x", "45%" into count-up parts; null when non-numeric. */
function parseValue(value: string) {
  const match = value.match(/^([^0-9]*)([0-9]+(?:\.[0-9]+)?)(.*)$/);
  if (!match) return null;
  const decimals = match[2].includes(".") ? match[2].split(".")[1].length : 0;
  return { prefix: match[1], target: parseFloat(match[2]), suffix: match[3], decimals };
}

function StatValue({ value, start }: { value: string; start: boolean }) {
  const parsed = parseValue(value);
  const [display, setDisplay] = useState(parsed ? (0).toFixed(parsed.decimals) : value);

  useEffect(() => {
    if (!start || !parsed) return;
    let raf = 0;
    const t0 = performance.now();
    const duration = 1500;
    const tick = (now: number) => {
      const progress = Math.min((now - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay((parsed.target * eased).toFixed(parsed.decimals));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start, value]);

  return <>{parsed ? `${parsed.prefix}${display}${parsed.suffix}` : value}</>;
}

export default function CaseStudySpotlight({
  study,
  others,
}: {
  study: SpotlightStudy;
  others: SpotlightStudy[];
}) {
  const { ref, inView } = useInView<HTMLElement>(0.25);
  const highlights = (study.highlights ?? []).filter(Boolean).slice(0, 4);
  const metrics = (study.metrics ?? []).slice(0, 4);
  const bg = study.hero_image || FALLBACK_BG;
  const rawSummary = study.impact_summary || study.overview || "";
  const summary = rawSummary.split(/(?<=[.!?])\s+/)[0] ?? rawSummary;

  return (
    <section ref={ref} className="relative overflow-hidden bg-[#070a14]" id="case-studies">
      {/* Background + overlay */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={bg}
        alt=""
        loading="lazy"
        decoding="async"
        className="kenburns absolute inset-0 h-full w-full object-cover opacity-45"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#070a14]/95 via-[#070a14]/80 to-[#070a14]/60" aria-hidden="true" />
      <div className="absolute inset-0 bg-[radial-gradient(55%_80%_at_90%_10%,rgba(208,244,56,0.12),transparent_60%)]" aria-hidden="true" />
      <div className="absolute inset-0 shadow-[inset_0_0_160px_60px_rgba(0,0,0,0.65)]" aria-hidden="true" />
      <div className="noise-overlay absolute inset-0" aria-hidden="true" />


      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 md:px-10 md:py-20 lg:px-14">
        {/* Overline row */}
        <div
          className={`flex flex-wrap items-center justify-between gap-3 transition-all duration-700 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <p className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.22em] text-white/80">
            <span className="inline-flex h-2 w-2 rounded-full bg-[#d0f438] shadow-[0_0_0_4px_rgba(208,244,56,0.25)]" />
            Case study — the specifics, not the pitch
          </p>
          <Link
            href="/case-studies"
            className="text-[13px] font-semibold text-white/70 transition-colors hover:text-white"
          >
            All case studies
          </Link>
        </div>

        {/* Narrative left · stats right */}
        <div className="mt-8 grid gap-10 lg:grid-cols-[1.45fr_1fr] lg:gap-14">
          <div>
            <div
              className={`flex flex-wrap items-center gap-2.5 transition-all duration-700 ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: "100ms" }}
            >
              <span className="bg-[#d0f438] px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.14em] text-gray-900">
                {study.industry}
              </span>
              <span className="text-[13px] font-medium text-white/60">{study.client_name}</span>
            </div>

            <h2
              className={`mt-4 font-display text-[clamp(26px,3.2vw,44px)] font-semibold leading-[1.1] tracking-tight text-white transition-all duration-700 ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
              }`}
              style={{ transitionDelay: "180ms" }}
            >
              {study.title}
            </h2>

            {summary && (
              <p
                className={`mt-4 max-w-xl text-[15px] leading-relaxed text-white/70 transition-all duration-700 ${
                  inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
                }`}
                style={{ transitionDelay: "260ms" }}
              >
                {summary}
              </p>
            )}

            <div
              className={`mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 transition-all duration-700 ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
              }`}
              style={{ transitionDelay: "340ms" }}
            >
              <Link
                href={`/case-studies/${study.slug}`}
                className="group inline-flex items-center gap-1.5 text-[15.5px] font-semibold text-white transition-colors hover:text-[#d0f438]"
              >
                Read the full case study
                <ArrowUpRight
                  size={17}
                  className="text-[#d0f438] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
              {others.slice(0, 2).map((o) => (
                <Link
                  key={o.slug}
                  href={`/case-studies/${o.slug}`}
                  className="text-[13.5px] font-semibold text-white/65 underline-offset-4 transition-colors hover:text-white hover:underline"
                >
                  {o.title}
                </Link>
              ))}
            </div>
          </div>

          {/* Proof column — a scannable checklist when the proof is
              qualitative, or the numeric stat grid when metrics carry figures. */}
          {highlights.length > 0 ? (
            <ul className="flex flex-col justify-center gap-4 border-t border-white/10 pt-8 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0">
              {highlights.map((h, i) => (
                <li
                  key={h}
                  className={`flex items-start gap-3 transition-all duration-700 ease-out ${
                    inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                  }`}
                  style={{ transitionDelay: `${420 + i * 110}ms` }}
                >
                  <span className="mt-0.5 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#d0f438]/15">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#d0f438" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span className="text-[15px] font-medium leading-snug text-white/85">{h}</span>
                </li>
              ))}
            </ul>
          ) : metrics.length > 0 ? (
            <div className="grid grid-cols-1 min-[380px]:grid-cols-2 content-center gap-x-8 gap-y-7 border-t border-white/10 pt-8 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0">
              {metrics.map((m, i) => (
                <div
                  key={m.label}
                  className={`transition-all duration-700 ease-out ${
                    inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                  }`}
                  style={{ transitionDelay: `${420 + i * 120}ms` }}
                >
                  <div className="font-display text-[40px] font-semibold leading-none tracking-tight text-[#d0f438] md:text-[48px]">
                    <StatValue value={m.value} start={inView} />
                  </div>
                  <div className="mt-2 text-[12px] font-semibold uppercase tracking-[0.08em] text-white/80">
                    {m.label}
                  </div>
                  {m.description && (
                    <div className="mt-0.5 text-[12px] leading-snug text-white/50">{m.description}</div>
                  )}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
