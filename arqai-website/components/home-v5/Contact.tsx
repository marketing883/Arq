import { ArrowUpRight } from "./icons";
import { CONTACT } from "./content";

export default function Contact() {
  return (
    <section className="v5-section v5-bg-white" id="contact">
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
            <img src={CONTACT.founder.avatar} alt={CONTACT.founder.name} />
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
