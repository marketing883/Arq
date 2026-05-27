"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { primaryNavigation } from "@/lib/data/site-navigation";

function ChevDown({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M3 4.5l3 3 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" />
      <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export default function V5Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="v5-nav">
      <Link href="/" className="v5-nav-logo" aria-label="ArqAI Labs">
        <Image
          src="/img/ArqAI-Labs-Logo-light.png"
          alt="ArqAI Labs"
          width={720}
          height={240}
          priority
        />
      </Link>

      <div className="v5-nav-pill-wrap">
        <nav className="v5-nav-pill" aria-label="Primary">
          {primaryNavigation.map((item) => {
            const firstSection = item.sections[0];
            return (
              <div key={item.label} className="v5-nav-item">
                <Link href={item.href} className="v5-nav-link">
                  {item.label}
                  <ChevDown className="v5-nav-chev" />
                </Link>
                {firstSection && (
                  <div className="v5-nav-mega" role="menu">
                    {firstSection.links.map((link) => (
                      <Link key={link.href} href={link.href} className="v5-nav-mega-link">
                        {link.label}
                        {link.description && <span className="desc">{link.description}</span>}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      <div className="v5-nav-right">
        <button type="button" className="v5-nav-search" aria-label="Search">
          <SearchIcon />
        </button>
        <Link href="/demo" className="v5-nav-cta">Get Started</Link>
        <button
          type="button"
          className="v5-nav-burger"
          aria-label="Open menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(true)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className={`v5-nav-mobile ${mobileOpen ? "open" : ""}`} aria-hidden={!mobileOpen}>
        <button
          type="button"
          className="v5-nav-mobile-close"
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
        >
          ×
        </button>
        {primaryNavigation.map((item) => (
          <div key={item.label} className="v5-nav-mobile-section">
            <h4>{item.label}</h4>
            {item.sections[0]?.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="v5-nav-mobile-link"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        ))}
        <Link href="/demo" className="v5-nav-mobile-cta" onClick={() => setMobileOpen(false)}>
          Get Started
        </Link>
      </div>
    </header>
  );
}
