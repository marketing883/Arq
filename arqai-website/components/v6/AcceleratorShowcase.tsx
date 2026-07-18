"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowUpRight,
  Headset,
  Landmark,
  Sparkle,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Content
// ---------------------------------------------------------------------------
// NOTE: `videoSrc` currently points at the brand placeholder reel. Swap each
// entry with the real screengrab footage of the accelerator in action when
// the files land (drop them in /public/v6/footage and update the paths).
// Card backgrounds are Unsplash photography (host allowed in next.config)
// chosen per vertical, sitting under a per-card duotone + scrim stack for
// text legibility.

const PLACEHOLDER_VIDEO = "/v5/assets/ufsUXNNTVPKgg5ZhfzY4DHtmrKY.mp4";

const unsplash = (id: string, w = 1400) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

type MainItem = {
  id: string;
  name: string;
  track: string;
  line: string;
  stat: { value: string; label: string };
  href: string;
  videoSrc: string;
  imageUrl: string;
  /** Duotone overlay colors [from, to] that tint the photo toward the card's palette. */
  duo: [string, string];
};

type SecondaryItem = {
  id: string;
  name: string;
  track: string;
  tagline: string;
  more: string;
  href: string;
  tint: string;
  imageUrl: string;
  icon: React.ReactNode;
};

const MAINS: Record<string, MainItem> = {
  arqfwa: {
    id: "arqfwa",
    name: "ArqFWA",
    track: "Vertical · Healthcare Payers",
    line: "Surfaces the cases most likely to be fraud, waste, or abuse before payment leaves the door — with evidence investigators can defend.",
    stat: { value: "$3.2M", label: "surfaced in one Blind Spot Assessment" },
    href: "/accelerators/arqfwa",
    videoSrc: PLACEHOLDER_VIDEO,
    imageUrl: unsplash("photo-1530026405186-ed1f139313f8"),
    duo: ["#052e2a", "#0a5c46"],
  },
  arqloyalty: {
    id: "arqloyalty",
    name: "ArqLoyalty",
    track: "Vertical · Retail & Hospitality",
    line: "Replace your loyalty platform without betting the business. Parallel-run validation until cut-over risk is zero.",
    stat: { value: "Zero", label: "migration risk at cut-over" },
    href: "/accelerators/arqloyalty",
    videoSrc: PLACEHOLDER_VIDEO,
    imageUrl: unsplash("photo-1563245372-f21724e3856d"),
    duo: ["#4a0f3a", "#7a2f14"],
  },
  arqvantage: {
    id: "arqvantage",
    name: "ArqVantage",
    track: "Horizontal · Cross-Industry",
    line: "Reads why competitor prices moved — and responds in minutes within your guardrails, with MAP compliance enforced automatically.",
    stat: { value: "<5 min", label: "designed response to a price move" },
    href: "/accelerators/arqvantage",
    videoSrc: PLACEHOLDER_VIDEO,
    imageUrl: unsplash("photo-1519501025264-65ba15a82390"),
    duo: ["#1a1040", "#4a1050"],
  },
};

const SECONDARIES: Record<string, SecondaryItem> = {
  arqbanker: {
    id: "arqbanker",
    name: "ArqBanker",
    track: "Vertical · Banking",
    tagline: "AI-native underwriting, onboarding, AML, and compliance.",
    more: "Engineered for faster underwriting, sharply reduced KYC manual review, and higher fraud-detection precision — with explainable reasoning on every decision.",
    href: "/accelerators/arqbanker",
    tint: "#26333f",
    imageUrl: unsplash("photo-1486406146926-c627a92ad1ab"),
    icon: <Landmark size={18} strokeWidth={1.5} />,
  },
  arqsupport: {
    id: "arqsupport",
    name: "ArqSupport",
    track: "Horizontal · Shared Services",
    tagline: "Agentic L1/L2/L3 triage and auto-resolution.",
    more: "Built to resolve 40–60% of L1 tickets autonomously from your knowledge base — designed to prevent SLA breaches rather than report them.",
    href: "/accelerators/arqsupport",
    tint: "#333044",
    imageUrl: unsplash("photo-1451187580459-43490279c0fa"),
    icon: <Headset size={18} strokeWidth={1.5} />,
  },
};

const CHIPS = [
  { name: "ArqLogistics", href: "/accelerators/arqlogistics" },
  { name: "ArqForecast", href: "/accelerators/arqforecast" },
  { name: "ArqDataQ", href: "/accelerators/arqdataq" },
  { name: "ArqSecOps", href: "/accelerators/arqsecops" },
  { name: "ArqEye", href: "/accelerators/arqeye" },
];

// Column membership for the bento stage
const COL_OF: Record<string, number> = {
  arqfwa: 0,
  arqbanker: 1,
  arqloyalty: 1,
  arqvantage: 2,
  arqsupport: 2,
};

// ---------------------------------------------------------------------------
// Shared pieces
// ---------------------------------------------------------------------------

function CardLabel({ children, light = true }: { children: React.ReactNode; light?: boolean }) {
  return (
    <span
      className={`pointer-events-none inline-flex items-center gap-2 text-[10.5px] uppercase tracking-[0.22em] ${
        light ? "text-white/70" : "text-white/60"
      }`}
    >
      <Sparkle className="h-3 w-3" strokeWidth={1.5} />
      {children}
      <Sparkle className="h-3 w-3" strokeWidth={1.5} />
    </span>
  );
}

const EASE = "cubic-bezier(0.32,0.72,0.24,1)";

// ---------------------------------------------------------------------------
// Main (video) card
// ---------------------------------------------------------------------------

function MainCard({
  item,
  flexGrow,
  state,
  onActivate,
}: {
  item: MainItem;
  flexGrow: number;
  state: "rest" | "active" | "compact";
  onActivate: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const isActive = state === "active";

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isActive) {
      video.currentTime = 0;
      void video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isActive]);

  return (
    <div
      className="group/main relative min-h-0 cursor-pointer overflow-hidden rounded-2xl bg-black transition-[flex-grow] duration-700"
      style={{ flexGrow, flexBasis: 0, transitionTimingFunction: EASE }}
      onMouseEnter={onActivate}
      onFocus={onActivate}
    >
      {/* Idle imagery — vibrant abstract with a slow drift, dimmed for legibility */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={item.imageUrl}
        alt=""
        loading="lazy"
        decoding="async"
        className="kenburns absolute inset-0 h-full w-full object-cover opacity-80 saturate-[1.15]"
      />
      {/* Cinematic layers: base dim, drifting particles, shimmer sweep */}
      <span
        className="absolute inset-0 mix-blend-multiply opacity-80"
        style={{ background: `linear-gradient(150deg, ${item.duo[0]} 0%, transparent 48%, ${item.duo[1]} 100%)` }}
        aria-hidden="true"
      />
      <span className="absolute inset-0 bg-black/25" aria-hidden="true" />
      <span className="v6-particles absolute inset-0" aria-hidden="true" />
      <span className="v6-sheen absolute inset-0" aria-hidden="true" />

      {/* Screengrab footage — fades in when the card takes the stage */}
      <video
        ref={videoRef}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
          isActive ? "opacity-100" : "opacity-0"
        }`}
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      >
        <source src={item.videoSrc} type="video/mp4" />
      </video>

      <span
        className={`absolute inset-0 bg-gradient-to-t transition-opacity duration-700 ${
          isActive
            ? "from-black/90 via-black/35 to-black/20"
            : "from-black/85 via-black/25 to-black/35"
        }`}
        aria-hidden="true"
      />

      {/* Top label (rest state) */}
      <span
        className={`absolute inset-x-0 top-5 flex justify-center transition-opacity duration-500 ${
          state === "rest" ? "opacity-100" : "opacity-0"
        }`}
      >
        <CardLabel>{item.track}</CardLabel>
      </span>

      {/* Rest caption */}
      <span
        className={`absolute inset-x-0 bottom-0 p-5 transition-all duration-500 md:p-6 ${
          state === "rest" ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 translate-y-3"
        }`}
      >
        <span className="block font-display text-2xl font-semibold text-white">{item.name}</span>
        <span className="mt-1 block text-[12.5px] text-white/60">Hover to see it in action</span>
      </span>

      {/* Compact chip: rotated name */}
      <span
        className={`absolute bottom-20 left-1/2 -translate-x-1/2 rotate-90 whitespace-nowrap font-display text-[15px] font-semibold text-white transition-opacity duration-300 ${
          state === "compact" ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden="true"
      >
        {item.name}
      </span>

      {/* Active content */}
      <a
        href={item.href}
        className={`absolute inset-0 flex flex-col justify-end p-6 outline-none transition-all duration-500 md:p-8 ${
          isActive ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 translate-y-4"
        }`}
        tabIndex={isActive ? 0 : -1}
      >
        <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#d0f438]">{item.track}</span>
        <span className="mt-2 block font-display text-3xl font-semibold text-white md:text-4xl">{item.name}</span>
        <span className="mt-3 block max-w-xl text-[15px] leading-relaxed text-white/80">{item.line}</span>
        <span className="mt-5 flex flex-wrap items-center gap-4">
          <span className="liquid-glass inline-flex items-baseline gap-2 rounded-lg px-4 py-2.5">
            <span className="font-display text-xl font-semibold text-[#d0f438]">{item.stat.value}</span>
            <span className="text-[12px] text-white/70">{item.stat.label}</span>
          </span>
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-white">
            Explore {item.name}
            <ArrowUpRight
              size={15}
              className="text-[#d0f438] transition-transform duration-300 group-hover/main:translate-x-0.5 group-hover/main:-translate-y-0.5"
            />
          </span>
        </span>
      </a>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Secondary (solid panel) card
// ---------------------------------------------------------------------------

function SecondaryCard({
  item,
  flexGrow,
  compact,
  hovered,
  onHover,
  onLeave,
}: {
  item: SecondaryItem;
  flexGrow: number;
  compact: boolean;
  hovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}) {
  return (
    <a
      href={item.href}
      className="noise-overlay group/sec relative flex min-h-0 flex-col overflow-hidden rounded-2xl p-5 transition-[flex-grow] duration-700 md:p-6"
      style={{ flexGrow, flexBasis: 0, backgroundColor: item.tint, transitionTimingFunction: EASE }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onFocus={onHover}
    >
      {/* Photo bg under a heavy tint veil so the panel keeps its color voice */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={item.imageUrl}
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover opacity-45 saturate-[1.1]"
        aria-hidden="true"
      />
      <span className="absolute inset-0" style={{ backgroundColor: item.tint, opacity: 0.82 }} aria-hidden="true" />
      <span
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.05), rgba(0,0,0,0.45))" }}
        aria-hidden="true"
      />
      {/* Compact: icon only */}
      <span
        className={`absolute inset-0 flex items-center justify-center text-white/70 transition-opacity duration-300 ${
          compact ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden="true"
      >
        {item.icon}
      </span>

      <span className={`relative transition-opacity duration-300 ${compact ? "opacity-0" : "opacity-100"}`}>
        <span className="flex items-center">
          <CardLabel light={false}>{item.track}</CardLabel>
        </span>

        <span className="mt-3 flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-[#d0f438]">
            {item.icon}
          </span>
          <span className="font-display text-xl font-semibold text-white">{item.name}</span>
        </span>
        <span className="mt-2 block text-[13px] leading-[1.6] text-white/85">{item.tagline}</span>

        {/* Extra content revealed on hover */}
        <span
          className={`block overflow-hidden transition-all duration-500 ${
            hovered ? "mt-2.5 max-h-32 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <span className="block text-[12.5px] leading-[1.6] text-white/60">{item.more}</span>
          <span className="mt-2 inline-flex items-center gap-1.5 text-[13px] font-semibold text-white">
            Explore {item.name} <ArrowUpRight size={13} className="text-[#d0f438]" />
          </span>
        </span>
      </span>
    </a>
  );
}

// ---------------------------------------------------------------------------
// Section
// ---------------------------------------------------------------------------

export default function AcceleratorShowcase() {
  const [activeMain, setActiveMain] = useState<string | null>(null);
  const [hoverSec, setHoverSec] = useState<string | null>(null);

  const activeCol = activeMain ? COL_OF[activeMain] : null;

  // Column flex: the column holding the active main takes over the stage.
  const colFlex = (col: number) => (activeCol === null ? 1 : activeCol === col ? 6.5 : 0.55);

  // In-column flex values.
  const mainFlex = (id: string) => {
    if (activeMain === id) return 9;
    if (activeMain && COL_OF[activeMain] === COL_OF[id]) return 0.6; // same column as an active main
    if (!activeMain && hoverSec && COL_OF[hoverSec] === COL_OF[id]) return 1.55; // secondary sibling grew a bit
    return COL_OF[id] === 0 ? 1 : 1.9;
  };
  const secFlex = (id: string) => {
    if (activeMain && COL_OF[activeMain] === COL_OF[id]) return 0.45;
    if (!activeMain && hoverSec === id) return 1.45;
    return 1;
  };

  const mainState = (id: string): "rest" | "active" | "compact" =>
    activeMain === id ? "active" : activeMain ? "compact" : "rest";

  const secCompact = (id: string) => activeMain !== null && COL_OF[activeMain!] !== COL_OF[id];

  return (
    <section className="relative overflow-hidden bg-[#0a0a0a] antialiased" id="accelerators">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:px-10 md:py-24 lg:px-14">
        {/* Header row */}
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <CardLabel>Accelerators in action</CardLabel>
            <h2 className="mt-4 font-display text-[28px] font-semibold leading-[1.15] tracking-tight text-white sm:text-3xl md:text-4xl lg:text-[44px]">
              Proven in production,
              <br />
              configured to your operation.
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-[1.6] text-white/60 md:text-[15px]">
              An accelerator is a proven pattern of agents, integrations, and
              governance controls for a recurring enterprise problem —
              configured to your systems and policies rather than designed
              from scratch.
            </p>
          </div>
          <a
            href="/accelerators"
            className="group inline-flex shrink-0 items-center gap-1.5 text-[15px] font-semibold text-white transition-colors hover:text-[#d0f438]"
          >
            Explore All Accelerators
            <ArrowUpRight
              size={16}
              className="text-[#d0f438] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
        </div>

        {/* Bento stage — desktop */}
        <div
          className="mt-12 hidden h-[620px] gap-4 md:gap-5 lg:flex"
          onMouseLeave={() => {
            setActiveMain(null);
            setHoverSec(null);
          }}
        >
          {/* Column 1 — ArqFWA */}
          <div
            className="flex min-w-0 flex-col gap-4 transition-[flex-grow] duration-700 md:gap-5"
            style={{ flexGrow: colFlex(0), flexBasis: 0, transitionTimingFunction: EASE }}
          >
            <MainCard
              item={MAINS.arqfwa}
              flexGrow={mainFlex("arqfwa")}
              state={mainState("arqfwa")}
              onActivate={() => setActiveMain("arqfwa")}
            />
          </div>

          {/* Column 2 — ArqBanker (secondary) + ArqLoyalty (main) */}
          <div
            className="flex min-w-0 flex-col gap-4 transition-[flex-grow] duration-700 md:gap-5"
            style={{ flexGrow: colFlex(1), flexBasis: 0, transitionTimingFunction: EASE }}
          >
            <SecondaryCard
              item={SECONDARIES.arqbanker}
              flexGrow={secFlex("arqbanker")}
              compact={secCompact("arqbanker")}
              hovered={hoverSec === "arqbanker"}
              onHover={() => {
                setHoverSec("arqbanker");
                setActiveMain(null);
              }}
              onLeave={() => setHoverSec(null)}
            />
            <MainCard
              item={MAINS.arqloyalty}
              flexGrow={mainFlex("arqloyalty")}
              state={mainState("arqloyalty")}
              onActivate={() => setActiveMain("arqloyalty")}
            />
          </div>

          {/* Column 3 — ArqVantage (main) + ArqSupport (secondary) */}
          <div
            className="flex min-w-0 flex-col gap-4 transition-[flex-grow] duration-700 md:gap-5"
            style={{ flexGrow: colFlex(2), flexBasis: 0, transitionTimingFunction: EASE }}
          >
            <MainCard
              item={MAINS.arqvantage}
              flexGrow={mainFlex("arqvantage")}
              state={mainState("arqvantage")}
              onActivate={() => setActiveMain("arqvantage")}
            />
            <SecondaryCard
              item={SECONDARIES.arqsupport}
              flexGrow={secFlex("arqsupport")}
              compact={secCompact("arqsupport")}
              hovered={hoverSec === "arqsupport"}
              onHover={() => {
                setHoverSec("arqsupport");
                setActiveMain(null);
              }}
              onLeave={() => setHoverSec(null)}
            />
          </div>
        </div>

        {/* Mobile / tablet: stacked cards, tap to expand mains */}
        <div className="mt-12 flex flex-col gap-4 lg:hidden">
          {Object.values(MAINS).map((item) => (
            <div
              key={item.id}
              className={`relative overflow-hidden rounded-2xl bg-black transition-all duration-500 ${
                activeMain === item.id ? "h-[440px]" : "h-[150px]"
              }`}
              onClick={() => setActiveMain(activeMain === item.id ? null : item.id)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.imageUrl} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover opacity-85 saturate-[1.15]" />
              <span
                className="absolute inset-0 mix-blend-multiply opacity-80"
                style={{ background: `linear-gradient(150deg, ${item.duo[0]} 0%, transparent 48%, ${item.duo[1]} 100%)` }}
                aria-hidden="true"
              />
              <span className="absolute inset-0 bg-black/25" aria-hidden="true" />
              <span className="v6-particles absolute inset-0" aria-hidden="true" />
              <span className="v6-sheen absolute inset-0" aria-hidden="true" />
              {activeMain === item.id && (
                <video className="absolute inset-0 h-full w-full object-cover" autoPlay muted loop playsInline aria-hidden="true">
                  <source src={item.videoSrc} type="video/mp4" />
                </video>
              )}
              <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/15" aria-hidden="true" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <span className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-[#d0f438]">{item.track}</span>
                <span className="mt-1 block font-display text-xl font-semibold text-white">{item.name}</span>
                {activeMain === item.id && (
                  <>
                    <p className="mt-2 text-[13.5px] leading-relaxed text-white/80">{item.line}</p>
                    <a href={item.href} className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-white">
                      Explore {item.name} <ArrowUpRight size={14} className="text-[#d0f438]" />
                    </a>
                  </>
                )}
              </div>
            </div>
          ))}
          {Object.values(SECONDARIES).map((item) => (
            <a
              key={item.id}
              href={item.href}
              className="noise-overlay relative overflow-hidden rounded-2xl p-5"
              style={{ backgroundColor: item.tint }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.imageUrl} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover opacity-45 saturate-[1.1]" aria-hidden="true" />
              <span className="absolute inset-0" style={{ backgroundColor: item.tint, opacity: 0.82 }} aria-hidden="true" />
              <span className="relative flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-[#d0f438]">{item.icon}</span>
                <span className="font-display text-lg font-semibold text-white">{item.name}</span>
              </span>
              <span className="relative mt-2 block text-[13px] leading-[1.6] text-white/80">{item.tagline}</span>
            </a>
          ))}
        </div>

        {/* The rest of the portfolio */}
        <div className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="mr-1 text-[11px] uppercase tracking-[0.22em] text-white/50">Plus five more</span>
          {CHIPS.map((m, i) => (
            <span key={m.href} className="flex items-center gap-3">
              <a
                href={m.href}
                className="text-[13.5px] font-medium text-white/75 underline-offset-4 transition-colors hover:text-white hover:underline"
              >
                {m.name}
              </a>
              {i < CHIPS.length - 1 && <span className="text-white/25" aria-hidden="true">·</span>}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
