"use client";

import { useState } from "react";
import Link from "next/link";

const LINKS = [
  { label: "Platform", href: "#features" },
  { label: "Why ArqAI", href: "#why" },
  { label: "Process", href: "#process" },
  { label: "Stories", href: "#testimonials" },
  { label: "Insights", href: "#blog" },
];

export default function V5Nav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="v5-nav">
        <div className="v5-nav-inner">
          <Link href="/v5" className="v5-nav-brand" onClick={() => setOpen(false)}>
            <span className="v5-nav-logo">
              <span />
            </span>
            ArqAI
          </Link>

          <ul className="v5-nav-links">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href}>{l.label}</a>
              </li>
            ))}
          </ul>

          <div className="v5-nav-cta">
            <a href="#contact" className="v5-btn v5-btn-primary">
              Book a Strategy Call
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
        {LINKS.map((l) => (
          <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
            {l.label}
          </a>
        ))}
        <a href="#contact" className="v5-btn v5-btn-primary" onClick={() => setOpen(false)}>
          Book a Strategy Call
        </a>
      </div>
    </>
  );
}
