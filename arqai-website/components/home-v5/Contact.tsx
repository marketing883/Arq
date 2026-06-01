import { ArrowRight } from "./icons";
import { CONTACT } from "./content";

export default function Contact() {
  return (
    <section className="v5-section v5-bg-white" id="contact">
      <div className="v5-container">
        <div className="v5-contact-card">
          <span className="v5-badge">
            <span className="v5-badge-dot" />
            {CONTACT.eyebrow}
          </span>

          <blockquote className="v5-contact-quote">{CONTACT.quote}</blockquote>

          <div className="v5-contact-founder">
            <img src={CONTACT.founder.avatar} alt={CONTACT.founder.name} />
            <span>
              <span className="v5-contact-name">{CONTACT.founder.name}</span>
              <br />
              <span className="v5-contact-role">{CONTACT.founder.role}</span>
            </span>
          </div>

          <div className="v5-contact-actions">
            <a href={CONTACT.cta.href} className="v5-btn v5-btn-primary">
              {CONTACT.cta.label}
              <ArrowRight />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
