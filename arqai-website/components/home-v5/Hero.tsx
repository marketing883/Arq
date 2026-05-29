"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import V5Nav from "./V5Nav";

type Slide = {
  bg: string;
  eyebrow?: string;
  h1: React.ReactNode;
  sub: string;
  cta: { label: string; href: string };
};

const SLIDES: Slide[] = [
  {
    bg: "/img/hero/home-hero-v5.jpg",
    h1: (
      <>
        Industry-deep AI,
        <br />
        built around
        <br />
        Your Operations.
      </>
    ),
    sub:
      "We build and run production AI for retail, healthcare, banking, and insurance. Proven vertical accelerators give every engagement a head start. Everything else is built around how your operation actually works.",
    cta: { label: "See How We Build", href: "/how-we-work" },
  },
  {
    bg: "/img/hero/slide-2-bg.jpg",
    h1: (
      <>
        Slide 2 headline
        <br />
        coming soon.
      </>
    ),
    sub: "Content for slide two will be added once finalized.",
    cta: { label: "Explore Accelerators", href: "/accelerators" },
  },
  {
    bg: "/img/hero/slide-3-bg.jpg",
    h1: (
      <>
        Slide 3 headline
        <br />
        coming soon.
      </>
    ),
    sub: "Content for slide three will be added once finalized.",
    cta: { label: "Engage Us", href: "/demo" },
  },
];

const AUTO_ADVANCE_MS = 7000;

export default function Hero() {
  const [active, setActive] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = useCallback((i: number) => {
    setActive(((i % SLIDES.length) + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => goTo(active + 1), AUTO_ADVANCE_MS);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [active, goTo]);

  const scrollNext = () => {
    const el = document.getElementById("v5-next");
    if (el) el.scrollIntoView({ behavior: "smooth" });
    else window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
  };

  return (
    <section className="v5-hero" aria-roledescription="carousel">
      <V5Nav />
      <div className="v5-hero-bg">
        {SLIDES.map((s, i) => (
          <div
            key={i}
            className={`v5-hero-slide ${i === active ? "active" : ""}`}
            aria-hidden={i !== active}
          >
            <div className="v5-hero-slide-img" style={{ backgroundImage: `url(${s.bg})` }} />
            <div className="v5-hero-slide-tint" />
          </div>
        ))}
      </div>

      <div className="v5-hero-wrap">
        <div className="v5-hero-text" key={active}>
          <h1 className="v5-hero-h1">{SLIDES[active].h1}</h1>
          <p className="v5-hero-sub">{SLIDES[active].sub}</p>
          <Link href={SLIDES[active].cta.href} className="v5-hero-cta">
            {SLIDES[active].cta.label}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M5 12h14M13 5l7 7-7 7"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </div>

      <div className="v5-hero-cut-bl" aria-hidden="true" />

      <div className="v5-hero-indicators" role="tablist" aria-label="Slide selector">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-label={`Slide ${i + 1}`}
            className={i === active ? "active" : ""}
            onClick={() => goTo(i)}
          >
            {String(i + 1).padStart(2, "0")}
          </button>
        ))}
      </div>

      <div className="v5-hero-scroll">
        <div className="v5-hero-scroll-text" aria-hidden="true">Scroll</div>
        <button
          type="button"
          className="v5-hero-scroll-arrow"
          aria-label="Scroll down"
          onClick={scrollNext}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M12 5v14M5 12l7 7 7-7"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </section>
  );
}
