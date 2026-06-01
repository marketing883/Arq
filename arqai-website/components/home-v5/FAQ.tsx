"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "What does ArqAI actually deliver?",
    a: "We design, build, deploy, and run production AI workflows for your operation — not slideware or proofs of concept. Every engagement ships to production with governance and monitoring in place.",
  },
  {
    q: "Which industries do you focus on?",
    a: "We go deep on one vertical at a time — healthcare payers and TPAs, insurance, banking, and retail — so the models understand the patterns and regulations that matter in your world.",
  },
  {
    q: "How fast can we see value?",
    a: "Proven vertical accelerators give every engagement a head start. Most clients move from discovery to a production workflow in weeks, not months, with impact measured against targets we set up front.",
  },
  {
    q: "How do you handle governance and compliance?",
    a: "Human-in-the-loop controls, audit trails, and proof attached to every decision are built in from day one — so your compliance and risk teams stay in control.",
  },
  {
    q: "Will it integrate with our existing systems?",
    a: "Yes. We build around how your operation actually works and connect to your data warehouse, core systems, and collaboration tools so your data stays unified.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="v5-section v5-bg-white" id="faq">
      <div className="v5-container">
        <div className="v5-faq-layout">
          <aside className="v5-support-card">
            <span className="v5-badge">
              <span className="v5-badge-dot" />
              FAQ
            </span>
            <h3 className="v5-h3">Answers to Common Questions</h3>
            <p>
              We&rsquo;ve gathered the most frequently asked questions to help you
              better understand our AI services, process, and integration approach.
            </p>
            <a href="#contact" className="v5-btn v5-btn-primary">
              Talk to our team
            </a>
          </aside>

          <div className="v5-faq-list">
            {FAQS.map((item, i) => {
              const isOpen = open === i;
              return (
                <div className={`v5-faq-item${isOpen ? " open" : ""}`} key={item.q}>
                  <button
                    type="button"
                    className="v5-faq-q"
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    {item.q}
                    <span className="v5-faq-icon">+</span>
                  </button>
                  <div className="v5-faq-a">
                    <div className="v5-faq-a-inner">{item.a}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
