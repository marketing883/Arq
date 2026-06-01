import { ArrowUpRight } from "./icons";
import { CONTACT, HERO_VIDEO, HERO_POSTER } from "./content";

export default function Contact() {
  return (
    <section className="v5-section v5-contact-section" id="contact">
      <video
        className="v5-contact-video"
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
      <div className="v5-contact-veil" />

      <div className="v5-container">
        <div className="v5-contact-head">
          <span className="v5-badge">
            <span className="v5-badge-dot" />
            {CONTACT.eyebrow}
          </span>
          <h2 className="v5-h2">{CONTACT.heading}</h2>
        </div>

        <div className="v5-contact-card">
          <blockquote className="v5-contact-quote">{CONTACT.quote}</blockquote>

          <div className="v5-contact-founder">
            <img src={CONTACT.founder.avatar} alt={CONTACT.founder.name} loading="lazy" decoding="async" />
            <span>
              <span className="v5-contact-name">{CONTACT.founder.name}</span>
              <br />
              <span className="v5-contact-role">{CONTACT.founder.role}</span>
            </span>
          </div>

          <div className="v5-cta-wrap">
            <a href={CONTACT.cta.href} className="v5-cta">{CONTACT.cta.label}</a>
            <a href={CONTACT.cta.href} className="v5-cta-arrow" aria-label={CONTACT.cta.label}>
              <ArrowUpRight />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
