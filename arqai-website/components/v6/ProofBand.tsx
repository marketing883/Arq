"use client";

import React, { useEffect, useRef, useState } from "react";

const HERO_VIDEO = "/v5/assets/ufsUXNNTVPKgg5ZhfzY4DHtmrKY.mp4";
const HERO_POSTER = "/v5/assets/pR0DzH2JNZa0vnz4l8WJLxvUKA.jpg";

// Outcomes from deployed work.
type Stat = {
  prefix?: string;
  target?: number;
  decimals?: number;
  suffix?: string;
  fixed?: string; // non-numeric display (no count-up)
  label: string;
  detail: string;
};

const STATS: Stat[] = [
  {
    prefix: "$",
    target: 3.2,
    decimals: 1,
    suffix: "M",
    label: "hidden waste, one assessment",
    detail: "Surfaced at a single TPA its vendor rated fully compliant",
  },
  {
    target: 30,
    suffix: "%+",
    label: "more high-value cases",
    detail: "vs. a rules-only baseline, evidence captured on every one",
  },
  {
    target: 2,
    suffix: "x",
    label: "faster case triage",
    detail: "From assignment to decision, audit trail exportable",
  },
  {
    target: 100,
    suffix: "%",
    label: "audit-ready proof",
    detail: "Every agent action carries trigger, reasoning, and outcome",
  },
];

function useInView<T extends HTMLElement>(threshold = 0.4) {
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

function useCountUp(target: number, start: boolean, decimals = 0, duration = 1400) {
  const [display, setDisplay] = useState((0).toFixed(decimals));

  useEffect(() => {
    if (!start) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay((target * eased).toFixed(decimals));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, target, decimals, duration]);

  return display;
}

function StatBlock({ stat, index, start }: { stat: Stat; index: number; start: boolean }) {
  const count = useCountUp(stat.target ?? 0, start, stat.decimals ?? 0);
  const value = stat.fixed ?? `${stat.prefix ?? ""}${count}${stat.suffix ?? ""}`;

  return (
    <div
      className={`group/stat relative flex-1 px-6 py-1 transition-all duration-700 ease-out first:pl-0 last:pr-0 md:px-8 ${
        start ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
      }`}
      style={{ transitionDelay: `${140 + index * 110}ms` }}
    >
      <div className="flex items-baseline gap-3">
        <span className="font-display text-[44px] font-semibold leading-none tracking-tight text-[#d0f438] transition-all duration-300 group-hover/stat:drop-shadow-[0_0_18px_rgba(208,244,56,0.45)] md:text-[56px]">
          {value}
        </span>
        <span className="max-w-[130px] text-[11px] font-semibold uppercase leading-snug tracking-[0.08em] text-white/75">
          {stat.label}
        </span>
      </div>
      {/* Context line — dormant until hover */}
      <p className="mt-2 max-h-0 overflow-hidden text-[12px] leading-snug text-white/55 opacity-0 transition-all duration-500 group-hover/stat:max-h-10 group-hover/stat:opacity-100">
        {stat.detail}
      </p>

      {/* Slanted hairline divider */}
      <span
        className="absolute right-0 top-1/2 hidden h-14 w-px -translate-y-1/2 rotate-[16deg] bg-white/15 group-last/stat:hidden md:block"
        aria-hidden="true"
      />
    </div>
  );
}

export default function ProofBand() {
  const { ref, inView } = useInView<HTMLDivElement>(0.35);

  return (
    <section className="relative overflow-hidden bg-[#0a0a0a]" id="results">
      {/* Background video */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={HERO_POSTER}
        aria-hidden="true"
      >
        <source src={HERO_VIDEO} type="video/mp4" />
      </video>
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-[#06080f]/85" aria-hidden="true" />
      <div
        className="absolute inset-0 bg-[radial-gradient(60%_120%_at_85%_0%,rgba(208,244,56,0.10),transparent_60%)]"
        aria-hidden="true"
      />
      {/* Hairlines top & bottom */}
      <div className="absolute inset-x-0 top-0 h-px bg-white/10" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-white/10" aria-hidden="true" />

      <div
        ref={ref}
        className="relative mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 md:flex-row md:items-center md:gap-10 md:px-10 md:py-12 lg:px-14"
      >
        {/* Header block */}
        <div
          className={`shrink-0 transition-all duration-700 ease-out md:max-w-[190px] ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <p className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.22em] text-white/80">
            <span className="inline-flex h-2 w-2 rounded-full bg-[#d0f438] shadow-[0_0_0_4px_rgba(208,244,56,0.25)]" />
            Results
          </p>
          <p className="mt-2 font-display text-[17px] font-semibold leading-snug text-white">
            Measured in production, not in demos.
          </p>
          <a
            href="/case-studies"
            className="mt-3 inline-block text-[12.5px] font-semibold text-white/70 underline-offset-4 transition-colors hover:text-white hover:underline"
          >
            See the case studies
          </a>
        </div>

        {/* Vertical hairline after header */}
        <span className="hidden h-16 w-px shrink-0 rotate-[16deg] bg-white/15 md:block" aria-hidden="true" />

        {/* Stats row */}
        <div className="flex flex-1 flex-col gap-6 sm:grid sm:grid-cols-2 md:flex md:flex-row md:items-center md:gap-0">
          {STATS.map((stat, i) => (
            <StatBlock key={stat.label} stat={stat} index={i} start={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}
