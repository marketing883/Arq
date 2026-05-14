"use client";

import type { FocusEvent } from "react";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { primaryNavigation, SiteNavItem } from "@/lib/data/site-navigation";

function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={className} aria-hidden="true">
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

function ChevronIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={className} aria-hidden="true">
      <path d="M3 4.5 6 7.5 9 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MegaMenu({ item, onNavigate }: { item: SiteNavItem; onNavigate: () => void }) {
  return (
    <div className="a-mega" role="group" aria-label={`${item.label} menu`}>
      <div className="a-mega-feature">
        <span className="a-tag">{item.label}</span>
        <h3>{item.feature.title}</h3>
        <p>{item.feature.body}</p>
        <Link href={item.feature.href} onClick={onNavigate} className="a-mega-cta">
          {item.feature.cta} <ArrowIcon className="arrow" />
        </Link>
      </div>

      <div className="a-mega-sections">
        {item.sections.map((section) => (
          <section key={section.title} className="a-mega-section">
            <h4>{section.title}</h4>
            <div className="a-mega-links">
              {section.links.map((link) => (
                <Link key={`${section.title}-${link.href}`} href={link.href} onClick={onNavigate} className="a-mega-link">
                  <span>{link.label}</span>
                  {link.description ? <small>{link.description}</small> : null}
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const activeItem = primaryNavigation.find((item) => item.label === activeMenu) ?? null;

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

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveMenu(null);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const closeMenus = () => {
    setActiveMenu(null);
    setMobileOpen(false);
  };

  const handleBlur = (event: FocusEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setActiveMenu(null);
    }
  };

  return (
    <>
      <nav
        className={"a-nav" + (scrolled || activeItem ? " scrolled" : "")}
        onMouseLeave={() => setActiveMenu(null)}
        onBlur={handleBlur}
      >
        <Link href="/" className="a-logo" onClick={closeMenus}>
          <Image
            src="/img/ArqAI-Labs-Logo-light.png"
            alt="ArqAI Labs"
            width={720}
            height={240}
            className="h-9 md:h-10 w-auto"
            priority
          />
        </Link>

        <div className="a-nav-links" aria-label="Primary navigation">
          {primaryNavigation.map((item) => (
            <div
              className="a-nav-item"
              key={item.label}
              onMouseEnter={() => setActiveMenu(item.label)}
              onFocus={() => setActiveMenu(item.label)}
            >
              <Link
                href={item.href}
                className="a-nav-link"
                aria-haspopup="true"
                aria-expanded={activeMenu === item.label}
                onClick={() => setActiveMenu(null)}
              >
                {item.label}
                <ChevronIcon className="a-nav-chevron" />
              </Link>
            </div>
          ))}
        </div>

        <div className="a-nav-actions">
          <Link href="/engage-us" className="a-btn a-btn-ghost a-nav-cta" style={{ padding: "10px 16px", fontSize: 13 }}>
            Get Started <ArrowIcon className="arrow" />
          </Link>
          <button
            type="button"
            onClick={() => {
              setMobileOpen((value) => !value);
              setActiveMenu(null);
            }}
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

        {activeItem ? <MegaMenu item={activeItem} onNavigate={closeMenus} /> : null}
      </nav>

      {mobileOpen ? (
        <div className="a-nav-mobile" onClick={() => setMobileOpen(false)}>
          <div className="a-nav-mobile-panel" onClick={(event) => event.stopPropagation()}>
            <ul>
              {primaryNavigation.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} onClick={closeMenus} className="a-mobile-primary">
                    {item.label}
                  </Link>
                  <div className="a-mobile-sublinks">
                    {item.sections.flatMap((section) => section.links).slice(0, 4).map((link) => (
                      <Link href={link.href} onClick={closeMenus} key={`${item.label}-${link.href}`}>
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
            <Link href="/engage-us" onClick={closeMenus} className="a-btn a-btn-primary" style={{ marginTop: 24 }}>
              Get Started <ArrowIcon className="arrow" />
            </Link>
          </div>
        </div>
      ) : null}
    </>
  );
}
