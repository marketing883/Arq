"use client";

import React, { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";

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
  testimonial_quote?: string | null;
  testimonial_author_name?: string | null;
  testimonial_author_title?: string | null;
};

const FALLBACK_BG =
  "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1920&q=80";

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

/** Parse "30%+", "$3.2M", "100%", "2x" into count-up parts; null when non-numeric. */
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
  const metrics = (study.metrics ?? []).slice(0, 4);
  const bg = study.hero_image || FALLBACK_BG;

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

      {/* Animated outcome curve — draws itself on entry */}
      <svg
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[46%] w-full"
        viewBox="0 0 1200 300"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="cs-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(208,244,56,0.16)" />
            <stop offset="100%" stopColor="rgba(208,244,56,0)" />
          </linearGradient>
        </defs>
        <path
          d="M0,268 C140,258 240,252 360,224 S 600,160 740,128 S 1020,64 1200,34 L1200,300 L0,300 Z"
          fill="url(#cs-area)"
          className={`transition-opacity duration-[1400ms] ${inView ? "opacity-100" : "opacity-0"}`}
          style={{ transitionDelay: "700ms" }}
        />
        <path
          d="M0,268 C140,258 240,252 360,224 S 600,160 740,128 S 1020,64 1200,34"
          fill="none"
          stroke="#d0f438"
          strokeWidth="2.4"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={inView ? 0 : 1}
          style={{ transition: "stroke-dashoffset 2000ms cubic-bezier(0.4,0,0.2,1) 300ms" }}
          opacity={0.75}
        />
      </svg>

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
          <a
            href="/case-studies"
            className="group inline-flex items-center gap-1.5 text-[13px] font-semibold text-white/70 transition-colors hover:text-white"
          >
            All case studies
            <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>

        {/* Study narrative */}
        <div className="mt-8 max-w-3xl">
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

          {(study.impact_summary || study.overview) && (
            <p
              className={`mt-4 max-w-2xl text-[15px] leading-relaxed text-white/70 transition-all duration-700 ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
              }`}
              style={{ transitionDelay: "260ms" }}
            >
              {study.impact_summary || study.overview}
            </p>
          )}

          <div
            className={`mt-6 flex flex-wrap items-center gap-5 transition-all duration-700 ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            }`}
            style={{ transitionDelay: "340ms" }}
          >
            <a
              href={`/case-studies/${study.slug}`}
              className="inline-flex items-center gap-2 rounded-lg bg-[#d0f438] px-6 py-3 text-sm font-semibold text-gray-900 transition-all duration-300 hover:-translate-y-0.5 hover:brightness-105"
            >
              Read the full case study
              <ArrowRight size={15} />
            </a>
            {others.slice(0, 2).map((o) => (
              <a
                key={o.slug}
                href={`/case-studies/${o.slug}`}
                className="group inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-white/65 transition-colors hover:text-white"
              >
                {o.title}
                <ArrowUpRight size={13} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            ))}
          </div>
        </div>

        {/* Stats row — percentages front and center */}
        {metrics.length > 0 && (
          <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-white/10 pt-8 md:mt-14 md:flex md:items-start md:gap-0">
            {metrics.map((m, i) => (
              <div
                key={m.label}
                className={`relative transition-all duration-700 ease-out md:flex-1 md:px-8 md:first:pl-0 md:last:pr-0 ${
                  inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                }`}
                style={{ transitionDelay: `${420 + i * 120}ms` }}
              >
                <div className="font-display text-[44px] font-semibold leading-none tracking-tight text-[#d0f438] md:text-[60px]">
                  <StatValue value={m.value} start={inView} />
                </div>
                <div className="mt-2.5 text-[12.5px] font-semibold uppercase tracking-[0.08em] text-white/80">
                  {m.label}
                </div>
                {m.description && (
                  <div className="mt-1 text-[12.5px] leading-snug text-white/50">{m.description}</div>
                )}
                {/* slanted hairline between stats */}
                {i < metrics.length - 1 && (
                  <span
                    className="absolute right-0 top-1/2 hidden h-14 w-px -translate-y-1/2 rotate-[16deg] bg-white/15 md:block"
                    aria-hidden="true"
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
