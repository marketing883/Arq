"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, Sparkle } from "lucide-react";

// ---------------------------------------------------------------------------
// Content
// ---------------------------------------------------------------------------
// NOTE: `videoSrc` currently points at the brand placeholder reel. Swap each
// entry with the real screengrab footage of the accelerator in action when
// the files land (drop them in /public/v6/footage and update the paths).

const PLACEHOLDER_VIDEO = "/v5/assets/ufsUXNNTVPKgg5ZhfzY4DHtmrKY.mp4";

type SceneKind = "fireflies" | "petals" | "hills";

type ShowcaseItem = {
  id: string;
  name: string;
  track: string;
  line: string;
  stat: { value: string; label: string };
  href: string;
  videoSrc: string;
  scene: SceneKind;
};

const ITEMS: ShowcaseItem[] = [
  {
    id: "arqfwa",
    name: "ArqFWA",
    track: "Vertical · Healthcare Payers",
    line: "Surfaces the cases most likely to be fraud, waste, or abuse before payment leaves the door — with evidence investigators can defend.",
    stat: { value: "30%+", label: "more high-value cases surfaced" },
    href: "/accelerators/arqfwa",
    videoSrc: PLACEHOLDER_VIDEO,
    scene: "fireflies",
  },
  {
    id: "arqloyalty",
    name: "ArqLoyalty",
    track: "Vertical · Retail & Hospitality",
    line: "Replace your loyalty platform without betting the business. Parallel-run validation until cut-over risk is zero.",
    stat: { value: "Zero", label: "migration risk at cut-over" },
    href: "/accelerators/arqloyalty",
    videoSrc: PLACEHOLDER_VIDEO,
    scene: "petals",
  },
  {
    id: "arqvantage",
    name: "ArqVantage",
    track: "Horizontal · Cross-Industry",
    line: "Reads why competitor prices moved — and responds in minutes within your guardrails, with MAP compliance enforced automatically.",
    stat: { value: "<5 min", label: "to respond to a price move" },
    href: "/accelerators/arqvantage",
    videoSrc: PLACEHOLDER_VIDEO,
    scene: "hills",
  },
];

const MORE = [
  { name: "ArqLogistics", href: "/accelerators/arqlogistics" },
  { name: "ArqBanker", href: "/accelerators/arqbanker" },
  { name: "ArqForecast", href: "/accelerators/arqforecast" },
  { name: "ArqSupport", href: "/accelerators/arqsupport" },
  { name: "ArqDataQ", href: "/accelerators/arqdataq" },
  { name: "ArqSecOps", href: "/accelerators/arqsecops" },
  { name: "ArqEye", href: "/accelerators/arqeye" },
];

// ---------------------------------------------------------------------------
// Canvas dream-loops — serene, hand-animated idle scenes per accelerator.
// Lightweight 2D canvas (no three.js dependency); each scene is a closure
// holding its own particle state.
// ---------------------------------------------------------------------------

type DrawFn = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => void;

/** ArqFWA — deep-teal night, drifting lanterns; a few glow lime (the signal in the noise). */
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

    // soft moon glow
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

/** ArqLoyalty — dusk sky, petals falling in perfect mirror parity across a glowing seam. */
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
  const drawPetal = (ctx: CanvasRenderingContext2D, px: number, py: number, r: number, angle: number, alpha: number) => {
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

    // warm horizon glow
    const glow = ctx.createRadialGradient(w * 0.5, h * 1.05, 0, w * 0.5, h * 1.05, h * 0.9);
    glow.addColorStop(0, "rgba(255,171,122,0.20)");
    glow.addColorStop(1, "rgba(255,171,122,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);

    // parity seam
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
      // left petal and its mirror twin — penny-for-penny parity
      drawPetal(ctx, x * w, y * h, p.r, angle, alpha);
      drawPetal(ctx, (1 - x) * w, y * h, p.r, -angle, alpha);
    }
  };
}

/** ArqVantage — moonlit rolling hills that read like gentle price curves, stars above. */
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

    // moon
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

    // rolling hills = drifting price curves
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

    // a single lime tracer riding the front hill — the repricing signal
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
// Section label with sparkles (from the seed layout)
// ---------------------------------------------------------------------------

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-white/70">
      <Sparkle className="h-3 w-3" strokeWidth={1.5} />
      {children}
      <Sparkle className="h-3 w-3" strokeWidth={1.5} />
    </span>
  );
}

// ---------------------------------------------------------------------------
// Accordion card
// ---------------------------------------------------------------------------

function ShowcaseCard({
  item,
  isActive,
  anyActive,
  onActivate,
}: {
  item: ShowcaseItem;
  isActive: boolean;
  anyActive: boolean;
  onActivate: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

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

  const collapsed = anyActive && !isActive;

  return (
    <div
      className={`
        group/card relative h-[420px] cursor-pointer overflow-hidden rounded-2xl bg-black
        transition-[flex-grow] duration-700 ease-[cubic-bezier(0.32,0.72,0.24,1)] lg:h-[560px]
        ${isActive ? "flex-[10]" : collapsed ? "flex-[1.15]" : "flex-[3.33]"}
      `}
      style={{ flexBasis: 0, minWidth: 0 }}
      onMouseEnter={onActivate}
      onFocus={onActivate}
    >
      {/* Idle dream-loop */}
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

      {/* Scrims */}
      <span
        className={`absolute inset-0 bg-gradient-to-t transition-opacity duration-700 ${
          isActive
            ? "from-black/85 via-black/25 to-black/15 opacity-100"
            : "from-black/70 via-black/10 to-black/25 opacity-90"
        }`}
        aria-hidden="true"
      />

      {/* Collapsed chip: rotated name */}
      <span
        className={`absolute bottom-24 left-1/2 -translate-x-1/2 rotate-90 whitespace-nowrap font-display text-[15px] font-semibold text-white transition-opacity duration-300 ${
          collapsed ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden="true"
      >
        {item.name}
      </span>

      {/* Resting caption (equal thirds, nothing hovered) */}
      <span
        className={`absolute inset-x-0 bottom-0 p-6 transition-all duration-500 md:p-7 ${
          !anyActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"
        }`}
      >
        <span className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-[#d0f438]">{item.track}</span>
        <span className="mt-1.5 block font-display text-2xl font-semibold text-white">{item.name}</span>
        <span className="mt-1 block text-[13px] text-white/65">Hover to see it in action</span>
      </span>

      {/* Expanded content */}
      <a
        href={item.href}
        className={`absolute inset-0 flex flex-col justify-end p-7 outline-none transition-all duration-500 md:p-9 ${
          isActive ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 translate-y-4"
        }`}
        tabIndex={isActive ? 0 : -1}
      >
        <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#d0f438]">{item.track}</span>
        <span className="mt-2 block font-display text-3xl font-semibold text-white md:text-4xl">{item.name}</span>
        <span className="mt-3 block max-w-xl text-[15px] leading-relaxed text-white/80">{item.line}</span>

        <span className="mt-6 flex flex-wrap items-center gap-4">
          <span className="liquid-glass inline-flex items-baseline gap-2 rounded-lg px-4 py-2.5">
            <span className="font-display text-xl font-semibold text-[#d0f438]">{item.stat.value}</span>
            <span className="text-[12px] text-white/70">{item.stat.label}</span>
          </span>
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-white">
            Explore {item.name}
            <ArrowUpRight size={15} className="transition-transform duration-300 group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5" />
          </span>
        </span>
      </a>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Section
// ---------------------------------------------------------------------------

export default function AcceleratorShowcase() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section className="relative overflow-hidden bg-[#0a0a0a] antialiased" id="accelerators">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:px-10 md:py-24 lg:px-14">
        {/* Header row */}
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <SectionLabel>Accelerators in action</SectionLabel>
            <h2 className="mt-4 font-display text-[28px] font-semibold leading-[1.15] tracking-tight text-white sm:text-3xl md:text-4xl lg:text-[44px]">
              Proven workflow spines,
              <br />
              running in production.
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-[1.6] text-white/60 md:text-[15px]">
              An accelerator is a reusable workflow spine for a recurring
              enterprise problem: a proven pattern of agents, integrations, and
              governance controls, configured to your systems and policies
              rather than designed from scratch. These are three of them —
              hover to watch each one work.
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

        {/* Accordion stage */}
        <div
          className="mt-12 hidden gap-4 md:gap-5 lg:flex"
          onMouseLeave={() => setActive(null)}
        >
          {ITEMS.map((item, i) => (
            <ShowcaseCard
              key={item.id}
              item={item}
              isActive={active === i}
              anyActive={active !== null}
              onActivate={() => setActive(i)}
            />
          ))}
        </div>

        {/* Mobile / tablet: stacked cards, tap to expand */}
        <div className="mt-12 flex flex-col gap-4 lg:hidden">
          {ITEMS.map((item, i) => (
            <div
              key={item.id}
              className={`relative overflow-hidden rounded-2xl bg-black transition-all duration-500 ${
                active === i ? "h-[440px]" : "h-[150px]"
              }`}
              onClick={() => setActive(active === i ? null : i)}
            >
              <SceneCanvas scene={item.scene} />
              {active === i && (
                <video
                  className="absolute inset-0 h-full w-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  aria-hidden="true"
                >
                  <source src={item.videoSrc} type="video/mp4" />
                </video>
              )}
              <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/15" aria-hidden="true" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <span className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-[#d0f438]">{item.track}</span>
                <span className="mt-1 block font-display text-xl font-semibold text-white">{item.name}</span>
                {active === i && (
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
        </div>

        {/* The rest of the portfolio — liquid-glass chips */}
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <span className="text-[11px] uppercase tracking-[0.22em] text-white/50">
            Plus seven more
          </span>
          {MORE.map((m) => (
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
