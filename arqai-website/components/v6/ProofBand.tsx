"use client";

import React, { useEffect, useRef, useState } from "react";
import { ArrowRight, ShieldCheck } from "lucide-react";

// ---------------------------------------------------------------------------
// Content — sourced from the v2 homepage copy (Results section)
// ---------------------------------------------------------------------------

type Result = {
  prefix?: string;
  value: number;
  decimals?: number;
  suffix?: string;
  label: string;
  body: string;
};

const RESULTS: Result[] = [
  {
    prefix: "$",
    value: 3.2,
    decimals: 1,
    suffix: "M",
    label: "Undetected waste surfaced",
    body: "In annual undetected waste surfaced at a single mid-size TPA, in one Blind Spot Assessment, at an account its incumbent vendor rated fully compliant.",
  },
  {
    value: 30,
    suffix: "%+",
    label: "More high-value cases",
    body: "More high-value FWA cases surfaced versus a rules-only baseline, with 100% decision-evidence capture for audit and recovery.",
  },
  {
    value: 2,
    suffix: "x",
    label: "Faster case triage",
    body: "Faster case triage from assignment to decision, with reviewer context assembled and the audit trail exportable.",
  },
];

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

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

function useCountUp(target: number, start: boolean, decimals = 0, duration = 1600) {
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!start) return;
    let raf: number;
    const t0 = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setDisplay((target * eased).toFixed(decimals));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, target, decimals, duration]);

  return display;
}

// ---------------------------------------------------------------------------
// Pieces
// ---------------------------------------------------------------------------

function ResultCard({ result, index, start }: { result: Result; index: number; start: boolean }) {
  const count = useCountUp(result.value, start, result.decimals ?? 0);

  return (
    <div
      className={`relative flex flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-sm transition-all duration-700 ease-out md:p-9 ${
        start ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{ transitionDelay: `${index * 140}ms` }}
    >
      <span className="font-display text-[56px] font-semibold leading-none tracking-tight text-[#d0f438] md:text-[72px]">
        {result.prefix}
        {count}
        {result.suffix}
      </span>
      <span className="mt-3 font-display text-[17px] font-semibold text-white">
        {result.label}
      </span>
      <p className="mt-2.5 text-[14.5px] leading-relaxed text-white/60">{result.body}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Section
// ---------------------------------------------------------------------------

export default function ProofBand() {
  const { ref, inView } = useInView<HTMLDivElement>(0.2);

  return (
    <section className="relative overflow-hidden bg-[#0d1226]" id="results">
      {/* Ambient glows */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_60%_at_85%_0%,rgba(208,244,56,0.13),transparent_60%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(45%_55%_at_0%_100%,rgba(65,54,201,0.22),transparent_62%)]"
        aria-hidden="true"
      />
      {/* Faint grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:linear-gradient(rgba(255,255,255,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.6)_1px,transparent_1px)] [background-size:56px_56px]"
        aria-hidden="true"
      />

      <div ref={ref} className="relative mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
        {/* Header */}
        <div className="grid gap-6 md:grid-cols-[1.3fr_1fr] md:items-end">
          <div>
            <p
              className={`text-[12px] font-bold uppercase tracking-[0.18em] text-[#d0f438] transition-all duration-700 ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              Results
            </p>
            <h2
              className={`mt-3 font-display text-[clamp(28px,3.4vw,48px)] font-semibold leading-[1.08] tracking-tight text-white transition-all duration-700 ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: "80ms" }}
            >
              Measured in production,
              <br />
              not in demos.
            </h2>
          </div>
          <p
            className={`text-[16px] leading-relaxed text-white/60 transition-all duration-700 ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "160ms" }}
          >
            Every engagement is judged against targets set before the build
            starts. These are outcomes from deployed work.
          </p>
        </div>

        {/* Stat cards */}
        <div className="mt-12 grid gap-5 md:mt-16 md:grid-cols-3">
          {RESULTS.map((result, i) => (
            <ResultCard key={result.label} result={result} index={i} start={inView} />
          ))}
        </div>

        {/* Governance footnote */}
        <div
          className={`mt-10 flex flex-col items-start justify-between gap-6 border-t border-white/10 pt-8 transition-all duration-700 md:flex-row md:items-center ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "480ms" }}
        >
          <p className="flex items-center gap-3 text-[15px] text-white/70">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#d0f438]/15 text-[#d0f438]">
              <ShieldCheck size={18} />
            </span>
            100% of agent actions carry encrypted, audit-ready proof — on every
            engagement, from day one.
          </p>
          <a
            href="/case-studies"
            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-[#d0f438] px-6 py-3 text-sm font-semibold text-gray-900 transition-all duration-300 hover:-translate-y-0.5 hover:brightness-105"
          >
            See the case studies
            <ArrowRight size={15} />
          </a>
        </div>
      </div>
    </section>
  );
}
