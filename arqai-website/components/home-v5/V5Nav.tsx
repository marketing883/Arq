"use client";

import { useState } from "react";
import { LOGO, NAV_LINKS } from "./content";

export default function V5Nav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="v5-nav">
        <div className="v5-nav-inner">
          <a href="#top" className="v5-nav-brand" onClick={() => setOpen(false)}>
            <img src={LOGO} alt="ArqAI Labs" className="v5-nav-logo-img" />
          </a>

          <ul className="v5-nav-links">
            {NAV_LINKS.map((l) => (
              <li key={l.label}>
                <a href={l.href}>{l.label}</a>
              </li>
            ))}
          </ul>

          <div className="v5-nav-cta">
            <a href="#contact" className="v5-btn v5-btn-dark">
              Get Started
            </a>
            <button
              type="button"
              className="v5-nav-burger"
              aria-label="Toggle menu"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              <span />
            </button>
          </div>
        </div>
      </nav>

      <div className={`v5-nav-mobile${open ? " open" : ""}`}>
        {NAV_LINKS.map((l) => (
          <a key={l.label} href={l.href} onClick={() => setOpen(false)}>
            {l.label}
          </a>
        ))}
        <a href="#contact" className="v5-btn v5-btn-dark" onClick={() => setOpen(false)}>
          Get Started
        </a>
      </div>
    </>
  );
}
