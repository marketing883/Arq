import React from "react";
import SourceLink from "@/components/common/SourceLink";

const HERO_VIDEO = "/v5/assets/ufsUXNNTVPKgg5ZhfzY4DHtmrKY.mp4";
const HERO_POSTER = "/v5/assets/pR0DzH2JNZa0vnz4l8WJLxvUKA.jpg";

export default function ClosingCta({
  heading,
  sub,
  ctaLabel = "Book a Demo",
  ctaHref = "/engage-us",
  secondaryLabel,
  secondaryHref,
}: {
  heading?: React.ReactNode;
  sub?: string;
  ctaLabel?: string;
  ctaHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
} = {}) {
  return (
    <section className="relative flex min-h-[62vh] items-center justify-center overflow-hidden bg-[#06080f]" id="contact">
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
      <div className="absolute inset-0 bg-[#06080f]/80" aria-hidden="true" />
      <div
        className="absolute inset-0 bg-[radial-gradient(50%_60%_at_50%_30%,rgba(208,244,56,0.10),transparent_65%)]"
        aria-hidden="true"
      />
      <div className="absolute inset-0 shadow-[inset_0_0_180px_70px_rgba(0,0,0,0.7)]" aria-hidden="true" />
      <div className="noise-overlay absolute inset-0" aria-hidden="true" />

      <div className="relative px-6 py-24 text-center">
        <h2 className="mx-auto max-w-3xl font-display text-[clamp(28px,3.8vw,52px)] font-semibold leading-[1.1] tracking-tight text-white">
          {heading ?? (<>Start with the workflow,<br />not the platform.</>)}
        </h2>
        {sub && (
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-white/70">{sub}</p>
        )}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <SourceLink
            href={ctaHref}
            className="inline-block rounded-lg bg-[#d0f438] px-10 py-4 text-[16px] font-semibold text-gray-900 shadow-[0_20px_50px_-20px_rgba(208,244,56,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-105"
          >
            {ctaLabel}
          </SourceLink>
          {secondaryLabel && secondaryHref && (
            <SourceLink
              href={secondaryHref}
              className="inline-block rounded-lg border border-white/20 px-10 py-4 text-[16px] font-semibold text-white transition-all duration-300 hover:border-white/40 hover:bg-white/5"
            >
              {secondaryLabel}
            </SourceLink>
          )}
        </div>
      </div>
    </section>
  );
}
