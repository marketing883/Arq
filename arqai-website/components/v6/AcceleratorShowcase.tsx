"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
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

const PLACEHOLDER_VIDEO = "/v5/assets/ufsUXNNTVPKgg5ZhfzY4DHtmrKY.mp4";

type SceneKind = "fireflies" | "petals" | "hills";

type MainItem = {
  id: string;
  name: string;
  track: string;
  line: string;
  stat: { value: string; label: string };
  href: string;
  videoSrc: string;
  scene: SceneKind;
};

type SecondaryItem = {
  id: string;
  name: string;
  track: string;
  tagline: string;
  more: string;
  href: string;
  tint: string;
  icon: React.ReactNode;
};

const MAINS: Record<string, MainItem> = {
  arqfwa: {
    id: "arqfwa",
    name: "ArqFWA",
    track: "Vertical · Healthcare Payers",
    line: "Surfaces the cases most likely to be fraud, waste, or abuse before payment leaves the door — with evidence investigators can defend.",
    stat: { value: "30%+", label: "more high-value cases surfaced" },
    href: "/accelerators/arqfwa",
    videoSrc: PLACEHOLDER_VIDEO,
    scene: "fireflies",
  },
  arqloyalty: {
    id: "arqloyalty",
    name: "ArqLoyalty",
    track: "Vertical · Retail & Hospitality",
    line: "Replace your loyalty platform without betting the business. Parallel-run validation until cut-over risk is zero.",
    stat: { value: "Zero", label: "migration risk at cut-over" },
    href: "/accelerators/arqloyalty",
    videoSrc: PLACEHOLDER_VIDEO,
    scene: "petals",
  },
  arqvantage: {
    id: "arqvantage",
    name: "ArqVantage",
    track: "Horizontal · Cross-Industry",
    line: "Reads why competitor prices moved — and responds in minutes within your guardrails, with MAP compliance enforced automatically.",
    stat: { value: "<5 min", label: "to respond to a price move" },
    href: "/accelerators/arqvantage",
    videoSrc: PLACEHOLDER_VIDEO,
    scene: "hills",
  },
};

const SECONDARIES: Record<string, SecondaryItem> = {
  arqbanker: {
    id: "arqbanker",
    name: "ArqBanker",
    track: "Vertical · Banking",
    tagline: "AI-native underwriting, onboarding, AML, and compliance.",
    more: "70% faster underwriting, 85% less KYC manual review, and 3x fraud detection precision — with explainable reasoning on every decision.",
    href: "/accelerators/arqbanker",
    tint: "#26333f",
    icon: <Landmark size={18} strokeWidth={1.5} />,
  },
  arqsupport: {
    id: "arqsupport",
    name: "ArqSupport",
    track: "Horizontal · Shared Services",
    tagline: "Agentic L1/L2/L3 triage and auto-resolution.",
    more: "40–60% of L1 tickets resolved autonomously from your knowledge base, with SLA breaches prevented rather than reported.",
    href: "/accelerators/arqsupport",
    tint: "#333044",
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
// Canvas dream-loops (idle scenes) — lightweight 2D canvas, no three.js.
// ---------------------------------------------------------------------------

type DrawFn = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => void;

function createFireflies(): DrawFn {
  const flies = Array.from({ length: 42 }, (_, i) => ({
    x: Math.random(),
    y: Math.random(),
    r: 1.2 + Math.random() * 2.4,
    speed: 0.008 + Math.random() * 0.02,
    sway: 0.4 + Math.random() * 1.4,
    phase: Math.random() * Math.PI * 2,
    signal: i % 9 === 0,
  }));
  return (ctx, w, h, t) => {
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, "#07181d");
    sky.addColorStop(0.55, "#0c2a2a");
    sky.addColorStop(1, "#123a33");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    const glow = ctx.createRadialGradient(w * 0.78, h * 0.2, 0, w * 0.78, h * 0.2, w * 0.45);
    glow.addColorStop(0, "rgba(214,255,235,0.10)");
    glow.addColorStop(1, "rgba(214,255,235,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);

    for (const f of flies) {
      const y = ((f.y - t * f.speed) % 1 + 1) % 1;
      const x = f.x + Math.sin(t * f.sway + f.phase) * 0.03;
      const px = x * w;
      const py = y * h;
      const pulse = f.signal ? 0.65 + 0.35 * Math.sin(t * 2.2 + f.phase) : 0.5 + 0.2 * Math.sin(t + f.phase);
      const color = f.signal ? "208,244,56" : "225,245,235";
      const r = f.signal ? f.r * 1.7 : f.r;
      const halo = ctx.createRadialGradient(px, py, 0, px, py, r * 6);
      halo.addColorStop(0, `rgba(${color},${0.5 * pulse})`);
      halo.addColorStop(1, `rgba(${color},0)`);
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(px, py, r * 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = `rgba(${color},${0.95 * pulse})`;
      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.fill();
    }
  };
}

function createPetals(): DrawFn {
  const petals = Array.from({ length: 26 }, () => ({
    x: 0.06 + Math.random() * 0.36,
    y: Math.random(),
    r: 2.5 + Math.random() * 3.5,
    speed: 0.02 + Math.random() * 0.028,
    sway: 0.5 + Math.random() * 1.2,
    spin: 0.6 + Math.random() * 1.6,
    phase: Math.random() * Math.PI * 2,
  }));
  const drawPetal = (
    ctx: CanvasRenderingContext2D,
    px: number,
    py: number,
    r: number,
    angle: number,
    alpha: number
  ) => {
    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(angle);
    ctx.fillStyle = `rgba(255,196,214,${alpha})`;
    ctx.beginPath();
    ctx.ellipse(0, 0, r, r * 0.55, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };
  return (ctx, w, h, t) => {
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, "#231327");
    sky.addColorStop(0.6, "#3a1e33");
    sky.addColorStop(1, "#54283a");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    const glow = ctx.createRadialGradient(w * 0.5, h * 1.05, 0, w * 0.5, h * 1.05, h * 0.9);
    glow.addColorStop(0, "rgba(255,171,122,0.20)");
    glow.addColorStop(1, "rgba(255,171,122,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);

    const seam = ctx.createLinearGradient(0, 0, 0, h);
    seam.addColorStop(0, "rgba(208,244,56,0)");
    seam.addColorStop(0.5, "rgba(208,244,56,0.35)");
    seam.addColorStop(1, "rgba(208,244,56,0)");
    ctx.fillStyle = seam;
    ctx.fillRect(w / 2 - 0.7, 0, 1.4, h);

    for (const p of petals) {
      const y = ((p.y + t * p.speed) % 1.1) - 0.05;
      const x = p.x + Math.sin(t * p.sway + p.phase) * 0.025;
      const angle = t * p.spin + p.phase;
      const alpha = 0.55 + 0.3 * Math.sin(t + p.phase);
      drawPetal(ctx, x * w, y * h, p.r, angle, alpha);
      drawPetal(ctx, (1 - x) * w, y * h, p.r, -angle, alpha);
    }
  };
}

function createHills(): DrawFn {
  const stars = Array.from({ length: 40 }, () => ({
    x: Math.random(),
    y: Math.random() * 0.5,
    r: 0.6 + Math.random() * 1.2,
    phase: Math.random() * Math.PI * 2,
  }));
  const layers = [
    { base: 0.62, amp: 0.05, freq: 1.6, speed: 0.05, color: "rgba(46,58,110,0.85)" },
    { base: 0.72, amp: 0.06, freq: 2.3, speed: 0.085, color: "rgba(32,42,86,0.92)" },
    { base: 0.82, amp: 0.05, freq: 3.1, speed: 0.13, color: "rgba(20,27,58,0.98)" },
  ];
  return (ctx, w, h, t) => {
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, "#0a1030");
    sky.addColorStop(0.6, "#14204a");
    sky.addColorStop(1, "#1d2c5e");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    const mx = w * 0.24;
    const my = h * 0.24;
    const moon = ctx.createRadialGradient(mx, my, 0, mx, my, w * 0.3);
    moon.addColorStop(0, "rgba(240,244,214,0.55)");
    moon.addColorStop(0.08, "rgba(240,244,214,0.35)");
    moon.addColorStop(1, "rgba(240,244,214,0)");
    ctx.fillStyle = moon;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "rgba(245,248,225,0.9)";
    ctx.beginPath();
    ctx.arc(mx, my, Math.min(w, h) * 0.045, 0, Math.PI * 2);
    ctx.fill();

    for (const s of stars) {
      const tw = 0.35 + 0.4 * Math.sin(t * 1.6 + s.phase);
      ctx.fillStyle = `rgba(235,240,255,${tw})`;
      ctx.beginPath();
      ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2);
      ctx.fill();
    }

    for (const layer of layers) {
      ctx.fillStyle = layer.color;
      ctx.beginPath();
      ctx.moveTo(0, h);
      for (let x = 0; x <= w; x += 6) {
        const nx = x / w;
        const y =
          h *
          (layer.base +
            layer.amp * Math.sin(nx * Math.PI * layer.freq + t * layer.speed * Math.PI * 2) +
            layer.amp * 0.5 * Math.sin(nx * Math.PI * layer.freq * 2.7 + t * layer.speed * 4));
        ctx.lineTo(x, y);
      }
      ctx.lineTo(w, h);
      ctx.closePath();
      ctx.fill();
    }

    const front = layers[2];
    const tx = ((t * 0.06) % 1) * w;
    const nx = tx / w;
    const ty =
      h *
      (front.base +
        front.amp * Math.sin(nx * Math.PI * front.freq + t * front.speed * Math.PI * 2) +
        front.amp * 0.5 * Math.sin(nx * Math.PI * front.freq * 2.7 + t * front.speed * 4));
    const tracer = ctx.createRadialGradient(tx, ty, 0, tx, ty, 26);
    tracer.addColorStop(0, "rgba(208,244,56,0.65)");
    tracer.addColorStop(1, "rgba(208,244,56,0)");
    ctx.fillStyle = tracer;
    ctx.beginPath();
    ctx.arc(tx, ty, 26, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(208,244,56,0.95)";
    ctx.beginPath();
    ctx.arc(tx, ty, 3, 0, Math.PI * 2);
    ctx.fill();
  };
}

const SCENE_FACTORIES: Record<SceneKind, () => DrawFn> = {
  fireflies: createFireflies,
  petals: createPetals,
  hills: createHills,
};

function SceneCanvas({ scene }: { scene: SceneKind }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const draw = useMemo(() => SCENE_FACTORIES[scene](), [scene]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let running = true;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, rect.width * dpr);
      canvas.height = Math.max(1, rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const t0 = performance.now();
    const loop = (now: number) => {
      if (!running) return;
      const rect = canvas.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        draw(ctx, rect.width, rect.height, (now - t0) / 1000);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [draw]);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />;
}

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
      <SceneCanvas scene={item.scene} />

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
            ? "from-black/85 via-black/25 to-black/15"
            : "from-black/70 via-black/10 to-black/30"
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
              className="transition-transform duration-300 group-hover/main:translate-x-0.5 group-hover/main:-translate-y-0.5"
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
      {/* Compact: icon only */}
      <span
        className={`absolute inset-0 flex items-center justify-center text-white/70 transition-opacity duration-300 ${
          compact ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden="true"
      >
        {item.icon}
      </span>

      <span className={`transition-opacity duration-300 ${compact ? "opacity-0" : "opacity-100"}`}>
        <span className="flex items-center justify-between">
          <CardLabel light={false}>{item.track}</CardLabel>
          <span className="liquid-glass flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white transition-transform duration-300 group-hover/sec:rotate-45">
            <ArrowUpRight size={15} strokeWidth={1.5} />
          </span>
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
            Explore {item.name} <ArrowRight size={13} />
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
              Proven workflow spines,
              <br />
              running in production.
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-[1.6] text-white/60 md:text-[15px]">
              An accelerator is a reusable workflow spine for a recurring
              enterprise problem: a proven pattern of agents, integrations, and
              governance controls, configured to your systems and policies
              rather than designed from scratch.
            </p>
          </div>
          <a
            href="/accelerators"
            className="liquid-glass inline-flex shrink-0 items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 sm:px-6 sm:py-3"
          >
            Explore All Accelerators
            <ArrowRight size={15} />
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
              <SceneCanvas scene={item.scene} />
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
                      Explore {item.name} <ArrowUpRight size={14} />
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
              <span className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-[#d0f438]">{item.icon}</span>
                <span className="font-display text-lg font-semibold text-white">{item.name}</span>
                <ArrowUpRight size={15} className="ml-auto text-white/70" />
              </span>
              <span className="mt-2 block text-[13px] leading-[1.6] text-white/80">{item.tagline}</span>
            </a>
          ))}
        </div>

        {/* The rest of the portfolio */}
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <span className="text-[11px] uppercase tracking-[0.22em] text-white/50">Plus five more</span>
          {CHIPS.map((m) => (
            <a
              key={m.href}
              href={m.href}
              className="liquid-glass rounded-lg px-4 py-2 text-[13px] font-medium text-white/85 transition-all duration-300 hover:-translate-y-0.5 hover:text-white"
            >
              {m.name}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
