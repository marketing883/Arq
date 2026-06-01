"use client";

import { useState } from "react";
import { LOGO } from "./content";
import {
  ArrowUpRight,
  ChatIcon,
  DocIcon,
  InsightIcon,
  ShieldIcon,
  SparkIcon,
} from "./icons";

const A = "/v5/assets";

type Link = { title: string; desc: string; href: string; icon: React.ReactNode };
type Menu = {
  label: string;
  links: Link[];
  feature: { href: string; image: string; tag: string; title: string };
};

const MENUS: Menu[] = [
  {
    label: "Platform",
    links: [
      { title: "Platform Overview", desc: "The operational AI foundation", href: "/platform", icon: <SparkIcon /> },
      { title: "How It Works", desc: "From discovery to production", href: "/how-it-works", icon: <InsightIcon /> },
      { title: "Accelerators", desc: "Pre-validated vertical patterns", href: "/accelerators", icon: <SparkIcon /> },
      { title: "Services", desc: "Build, deploy, and run with us", href: "/services", icon: <DocIcon /> },
      { title: "Trust & Security", desc: "Governance and audit, built in", href: "/trust", icon: <ShieldIcon /> },
    ],
    feature: { href: "/demo", image: `${A}/seeall-abstract.jpg`, tag: "Get a demo", title: "See operational AI in action" },
  },
  {
    label: "Solutions",
    links: [
      { title: "Industries", desc: "Healthcare, banking, insurance, retail", href: "/industries", icon: <InsightIcon /> },
      { title: "Use Cases", desc: "Where agents move the needle", href: "/use-cases", icon: <ChatIcon /> },
      { title: "Case Studies", desc: "Proof from production deployments", href: "/case-studies", icon: <DocIcon /> },
      { title: "How We Work", desc: "Our engagement model", href: "/how-we-work", icon: <SparkIcon /> },
    ],
    feature: { href: "/case-studies", image: `${A}/H4rP4HWageK0Wzp8OfGGGbv8M0.jpeg`, tag: "Case study", title: "$3.2M in undetected waste, found" },
  },
  {
    label: "Resources",
    links: [
      { title: "Blog", desc: "Insights on operational AI", href: "/blog", icon: <ChatIcon /> },
      { title: "Whitepapers", desc: "Deep dives and frameworks", href: "/whitepapers", icon: <DocIcon /> },
      { title: "Webinars", desc: "Live sessions and replays", href: "/webinars", icon: <InsightIcon /> },
      { title: "Resource Library", desc: "Everything in one place", href: "/resources", icon: <SparkIcon /> },
    ],
    feature: { href: "/blog", image: `${A}/whRZNEnCa32wPqqJtkEo07xTe50.jpeg`, tag: "Latest", title: "How AI is revolutionizing support" },
  },
  {
    label: "Company",
    links: [
      { title: "About", desc: "Why we built ArqAI Labs", href: "/about", icon: <SparkIcon /> },
      { title: "Careers", desc: "Build the future with us", href: "/careers", icon: <ChatIcon /> },
      { title: "Partners", desc: "Grow together", href: "/partners", icon: <ShieldIcon /> },
      { title: "Engage Us", desc: "Start a conversation", href: "/engage-us", icon: <InsightIcon /> },
      { title: "Contact", desc: "Talk to our team", href: "/contact", icon: <DocIcon /> },
    ],
    feature: { href: "/about", image: `${A}/8KKNOMGpz3fVUEZDOXTVXjXkICU.jpg`, tag: "About us", title: "A partner, not a platform vendor" },
  },
];

function Chevron() {
  return (
    <svg className="v5-nav-chev" viewBox="0 0 12 12" width="12" height="12" fill="none">
      <path d="M3 4.5L6 7.5l3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function V5Nav() {
  const [open, setOpen] = useState<number | null>(null);
  const [mobile, setMobile] = useState(false);

  return (
    <>
      <div className="v5-nav" onMouseLeave={() => setOpen(null)}>
        <div className="v5-nav-inner">
          <a href="#top" className="v5-nav-brand" onClick={() => setMobile(false)}>
            <img src={LOGO} alt="ArqAI Labs" className="v5-nav-logo-img" />
          </a>

          <ul className="v5-nav-links">
            {MENUS.map((m, i) => (
              <li key={m.label} onMouseEnter={() => setOpen(i)}>
                <button type="button" className={`v5-nav-trigger${open === i ? " active" : ""}`}>
                  {m.label}
                  <Chevron />
                </button>
              </li>
            ))}
          </ul>

          <div className="v5-nav-cta">
            <a href="/demo" className="v5-nav-demo">Book a Demo</a>
            <button
              type="button"
              className="v5-nav-burger"
              aria-label="Toggle menu"
              aria-expanded={mobile}
              onClick={() => setMobile((v) => !v)}
            >
              <span />
            </button>
          </div>
        </div>

        {/* mega panel */}
        <div className={`v5-mega-wrap${open !== null ? " show" : ""}`}>
          {open !== null && (
            <div className="v5-mega" onMouseEnter={() => setOpen(open)}>
              <div className="v5-mega-links">
                {MENUS[open].links.map((l) => (
                  <a key={l.title} href={l.href} className="v5-mega-link" onClick={() => setOpen(null)}>
                    <span className="v5-mega-ico">{l.icon}</span>
                    <span className="v5-mega-text">
                      <strong>{l.title}</strong>
                      <span>{l.desc}</span>
                    </span>
                  </a>
                ))}
              </div>
              <a href={MENUS[open].feature.href} className="v5-mega-feature" onClick={() => setOpen(null)}>
                <img src={MENUS[open].feature.image} alt="" />
                <span className="v5-mega-feature-body">
                  <span className="v5-mega-feature-tag">{MENUS[open].feature.tag}</span>
                  <strong>{MENUS[open].feature.title}</strong>
                  <span className="v5-mega-feature-cta">
                    Explore <ArrowUpRight />
                  </span>
                </span>
              </a>
            </div>
          )}
        </div>
      </div>

      {/* mobile menu */}
      <div className={`v5-nav-mobile${mobile ? " open" : ""}`}>
        {MENUS.map((m) => (
          <div className="v5-nav-mobile-group" key={m.label}>
            <span className="v5-nav-mobile-title">{m.label}</span>
            {m.links.map((l) => (
              <a key={l.title} href={l.href} onClick={() => setMobile(false)}>
                {l.title}
              </a>
            ))}
          </div>
        ))}
        <a href="/demo" className="v5-cta" onClick={() => setMobile(false)} style={{ marginTop: 10 }}>
          Book a Demo
        </a>
      </div>
    </>
  );
}
