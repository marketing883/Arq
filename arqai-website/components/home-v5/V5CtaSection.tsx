import { HERO_VIDEO, HERO_POSTER } from "./content";

/**
 * Main CTA section shown above the footer across the site. Mirrors the
 * homepage treatment: a looping background video with a stylized overlay,
 * and the CTA card (heading, body, actions) on top. Pass the card's inner
 * content as children.
 */
export default function V5CtaSection({ children }: { children: React.ReactNode }) {
  return (
    <section className="v5-section v5-cta-band v5-cta-video">
      <video
        className="v5-cta-video-bg"
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        poster={HERO_POSTER}
        aria-hidden="true"
      >
        <source src={HERO_VIDEO} type="video/mp4" />
      </video>
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
