import { ArrowRight } from "./icons";

export default function Contact() {
  return (
    <section className="v5-section v5-bg-white" id="contact">
      <div className="v5-container">
        <div className="v5-contact-card">
          <span className="v5-badge">
            <span className="v5-badge-dot" />
            Get started
          </span>
          <h2 className="v5-h2">
            Let&rsquo;s build your <span className="lime">operational AI</span>
          </h2>
          <p>
            Tell us how your operation works. We&rsquo;ll show you where AI delivers
            measurable value — and how fast we can get it into production.
          </p>
          <div className="v5-contact-actions">
            <a href="/demo" className="v5-btn v5-btn-primary">
              Book a Strategy Call
              <ArrowRight />
            </a>
            <a href="/contact" className="v5-btn v5-btn-ghost">
              Contact us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
