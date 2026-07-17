import React from "react";
import { ArrowRight, Sparkle } from "lucide-react";

const HERO_VIDEO = "/v5/assets/ufsUXNNTVPKgg5ZhfzY4DHtmrKY.mp4";
const HERO_POSTER = "/v5/assets/pR0DzH2JNZa0vnz4l8WJLxvUKA.jpg";

// Outcomes from deployed work — rendered as a live ticker.
const TICKER: { value: string; label: string }[] = [
  { value: "$3.2M", label: "undetected waste surfaced in one assessment" },
  { value: "30%+", label: "more high-value FWA cases vs. rules-only" },
  { value: "2x", label: "faster case triage, assignment to decision" },
  { value: "100%", label: "agent actions with audit-ready proof" },
  { value: "Zero", label: "migration risk at loyalty cut-over" },
  { value: "<5 min", label: "to answer a competitor price move" },
];

function TickerRun() {
  return (
    <div className="flex shrink-0 items-center" aria-hidden="true">
      {TICKER.map((item) => (
        <span key={item.label} className="flex items-center">
          <span className="flex items-baseline gap-3 whitespace-nowrap px-7">
            <span className="font-display text-3xl font-semibold tracking-tight text-[#d0f438] md:text-4xl">
              {item.value}
            </span>
            <span className="text-[13px] text-white/70 md:text-sm">{item.label}</span>
          </span>
          <Sparkle className="h-3.5 w-3.5 shrink-0 text-white/30" strokeWidth={1.5} />
        </span>
      ))}
    </div>
  );
}

export default function ProofBand() {
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

      <div className="relative py-9 md:py-11">
        {/* Header line */}
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 sm:px-6 md:px-10 lg:px-14">
          <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.22em] text-white/80">
            <span className="inline-flex h-2 w-2 rounded-full bg-[#d0f438] shadow-[0_0_0_4px_rgba(208,244,56,0.25)]" />
            Results — measured in production, not in demos
          </p>
          <a
            href="/case-studies"
            className="group inline-flex items-center gap-1.5 text-[13px] font-semibold text-white/85 transition-colors hover:text-white"
          >
            See the case studies
            <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>

        {/* Stat ticker */}
        <div
          className="v6-ticker mt-6 flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]"
          role="list"
          aria-label="Production outcomes"
        >
          {/* Screen-reader friendly static list */}
          <span className="sr-only">
            {TICKER.map((t) => `${t.value} ${t.label}`).join("; ")}
          </span>
          <div className="v6-ticker-track flex">
            <TickerRun />
            <TickerRun />
          </div>
        </div>
      </div>
    </section>
  );
}
