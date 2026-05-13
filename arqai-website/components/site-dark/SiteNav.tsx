"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={className}>
      <path
        d="M2 7h10M8 3l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const navLinks = [
  { name: "Services", href: "/services" },
  { name: "Process", href: "/how-we-work" },
  { name: "Accelerators", href: "/accelerators" },
  { name: "Industries", href: "/industries" },
  { name: "Careers", href: "/careers" },
  { name: "About", href: "/about" },
];

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <nav className={"a-nav" + (scrolled ? " scrolled" : "")}>
        <Link href="/" className="a-logo">
          <Image
            src="/img/ArqAI-Labs-Logo-light.png"
            alt="ArqAI Labs"
            width={720}
            height={240}
            className="h-9 md:h-10 w-auto"
            priority
          />
        </Link>
        <div className="a-nav-links">
          {navLinks.map((l) => (
            <Link key={l.name} href={l.href}>
              {l.name}
            </Link>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link
            href="/engage-us"
            className="a-btn a-btn-ghost a-nav-cta"
            style={{ padding: "10px 16px", fontSize: 13 }}
          >
            Get Started <ArrowIcon className="arrow" />
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="a-nav-burger"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            <span
              style={{
                display: "block",
                width: 18,
                height: 1.5,
                background: "currentColor",
                transform: mobileOpen ? "translateY(3px) rotate(45deg)" : "translateY(-4px)",
                transition: "transform .25s ease",
              }}
            />
            <span
              style={{
                display: "block",
                width: 18,
                height: 1.5,
                background: "currentColor",
                opacity: mobileOpen ? 0 : 1,
                transition: "opacity .25s ease",
              }}
            />
            <span
              style={{
                display: "block",
                width: 18,
                height: 1.5,
                background: "currentColor",
                transform: mobileOpen ? "translateY(-3px) rotate(-45deg)" : "translateY(4px)",
                transition: "transform .25s ease",
              }}
            />
          </button>
        </div>
      </nav>

      {mobileOpen ? (
        <div
          className="a-nav-mobile"
          onClick={() => setMobileOpen(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <ul>
              {navLinks.map((l) => (
                <li key={l.name}>
                  <Link href={l.href} onClick={() => setMobileOpen(false)}>
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/engage-us"
              onClick={() => setMobileOpen(false)}
              className="a-btn a-btn-primary"
              style={{ marginTop: 24 }}
            >
              Get Started <ArrowIcon className="arrow" />
            </Link>
          </div>
        </div>
      ) : null}
    </>
  );
}
