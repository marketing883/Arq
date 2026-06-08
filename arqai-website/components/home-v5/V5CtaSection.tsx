"use client";

import { useEffect, useRef, useState } from "react";
import { HERO_VIDEO, HERO_POSTER } from "./content";

/**
 * Main CTA section shown above the footer across the site. Mirrors the
 * homepage treatment: a looping background video with a stylized overlay and
 * the CTA card on top. The video is lazy-loaded — only mounted once the
 * section scrolls near the viewport — with the poster shown until then so
 * there's no blank flash and no upfront video download.
 */
export default function V5CtaSection({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    if (load) return;
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setLoad(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setLoad(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [load]);

  return (
    <section ref={ref} className="v5-section v5-cta-band v5-cta-video">
      <div
        className="v5-cta-video-poster"
        style={{ backgroundImage: `url(${HERO_POSTER})` }}
        aria-hidden="true"
      />
      {load ? (
        <video
          className="v5-cta-video-bg"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={HERO_POSTER}
          aria-hidden="true"
        >
          <source src={HERO_VIDEO} type="video/mp4" />
        </video>
      ) : null}
      <span className="v5-cta-video-veil" aria-hidden="true" />
      <div className="v5-container">
        <div className="v5-cta-card">
          <div className="v5-cta-glow" />
          {children}
        </div>
      </div>
    </section>
  );
}
