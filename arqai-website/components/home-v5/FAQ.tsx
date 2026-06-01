"use client";

import { useState } from "react";
import { FAQ as DATA } from "./content";

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  const { support, items } = DATA;

  return (
    <section className="v5-section v5-bg-white" id="faq">
      <div className="v5-container">
        <div className="v5-title-block">
          <div>
            <span className="v5-badge">
              <span className="v5-badge-dot" />
              {DATA.eyebrow}
            </span>
          </div>
          <div className="v5-title-main">
            <h2 className="v5-h2">{DATA.heading}</h2>
            <p className="v5-lead">{DATA.sub}</p>
          </div>
        </div>

        <div className="v5-faq-layout">
          <aside className="v5-support-card">
            <img className="v5-support-avatar" src={support.avatar} alt="" />
            <h3 className="v5-h3">{support.title}</h3>
            <p>{support.body}</p>
            <a href={support.cta.href} className="v5-btn v5-btn-primary">
              {support.cta.label}
            </a>
          </aside>

          <div className="v5-faq-list">
            {items.map((item, i) => {
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
