"use client";

import { useEffect, useRef, useState } from "react";
import { LOGO } from "./content";
import { accelerators } from "@/lib/data/accelerators";
import {
  ArrowUpRight,
  BagIcon,
  BankIcon,
  BotIcon,
  BriefcaseIcon,
  ClaimsIcon,
  CompassIcon,
  FactoryIcon,
  FlagIcon,
  FraudIcon,
  GaugeIcon,
  HeadsetIcon,
  HeartPulseIcon,
  InsightIcon,
  LayersIcon,
  LinkIcon,
  LockIcon,
  MailIcon,
  NetworkIcon,
  PenIcon,
  RouteIcon,
  ShieldIcon,
  SparkIcon,
  TagIcon,
  TruckIcon,
  UmbrellaIcon,
  UsersIcon,
} from "./icons";

const A = "/v5/assets";

type Link = { title: string; desc: string; href: string; icon: React.ReactNode };
type Menu = {
  label: string;
  links: Link[];
  feature: { href: string; image: string; tag: string; title: string };
};

const ACCEL_ICONS: Record<string, React.ReactNode> = {
  arqfwa: <FraudIcon />,
  arqclaims: <ClaimsIcon />,
  arqbanker: <BankIcon />,
  arqloyalty: <TagIcon />,
  arqtechops: <NetworkIcon />,
  arqlogistics: <TruckIcon />,
  arqdesk: <HeadsetIcon />,
  arqsecops: <LockIcon />,
  arqvantage: <InsightIcon />,
};

const ACCEL_LINKS: Link[] = accelerators.map((a) => ({
  title: a.name,
  desc: a.category,
  href: `/accelerators/${a.id}`,
  icon: ACCEL_ICONS[a.id] ?? <SparkIcon />,
}));

const MENUS: Menu[] = [
  {
    label: "Platform",
    links: [
      { title: "Workflow Strategy", desc: "Find the workflows worth automating", href: "/services/workflow-strategy", icon: <CompassIcon /> },
      { title: "Agentic AI Buildout", desc: "Production agents, not demos", href: "/services/agentic-ai-buildout", icon: <BotIcon /> },
      { title: "Enterprise Integration", desc: "Wired into your existing stack", href: "/services/enterprise-integration", icon: <LinkIcon /> },
      { title: "Governance by Design", desc: "Audit-ready from day one", href: "/services/governance-by-design", icon: <ShieldIcon /> },
      { title: "Vertical Acceleration", desc: "Pre-built patterns for your industry", href: "/services/vertical-acceleration", icon: <LayersIcon /> },
      { title: "Managed AI Operations", desc: "We run it after go-live", href: "/services/managed-ai-operations", icon: <GaugeIcon /> },
    ],
    feature: { href: "/platform", image: `${A}/seeall-abstract.jpg`, tag: "Platform", title: "The operational AI foundation" },
  },
  {
    label: "Accelerators",
    links: ACCEL_LINKS,
    feature: { href: "/accelerators", image: `${A}/H4rP4HWageK0Wzp8OfGGGbv8M0.jpeg`, tag: "Catalog", title: `${accelerators.length} accelerators, production-ready` },
  },
  {
    label: "Industries",
    links: [
      { title: "Healthcare Payers", desc: "Claims, fraud, program integrity", href: "/industries/healthcare-payers", icon: <HeartPulseIcon /> },
      { title: "Banking", desc: "Financial crime and customer risk", href: "/industries/banking", icon: <BankIcon /> },
      { title: "Insurance Carriers", desc: "Triage, intake, and review", href: "/industries/insurance-carriers", icon: <UmbrellaIcon /> },
      { title: "Retail", desc: "Loyalty, pricing, and service", href: "/industries/retail", icon: <BagIcon /> },
      { title: "Manufacturing", desc: "Supply chain and operations", href: "/industries/manufacturing", icon: <FactoryIcon /> },
    ],
    feature: { href: "/case-studies", image: `${A}/wqdffQW0WSkz5XQ7YchgqN2bDQ.jpeg`, tag: "Case study", title: "$3.2M in undetected waste, found" },
  },
  {
    label: "Resources",
    links: [
      { title: "Blog", desc: "Insights on operational AI", href: "/blog", icon: <PenIcon /> },
      { title: "Case Studies", desc: "Proof from production", href: "/case-studies", icon: <InsightIcon /> },
      // Deactivated until there is published CMS content. Re-enable by
      // uncommenting (the destination pages already exist and render) and
      // re-importing the referenced icons from "./icons".
      // { title: "Whitepapers", desc: "Deep dives and frameworks", href: "/whitepapers", icon: <DocIcon /> },
      // { title: "Webinars", desc: "Live sessions and replays", href: "/webinars", icon: <InsightIcon /> },
      // { title: "Resource Library", desc: "Everything in one place", href: "/resources", icon: <SparkIcon /> },
    ],
    feature: { href: "/blog", image: `${A}/whRZNEnCa32wPqqJtkEo07xTe50.jpeg`, tag: "Latest", title: "How AI is revolutionizing support" },
  },
  {
    label: "Company",
    links: [
      { title: "About", desc: "Why we built ArqAI Labs", href: "/about", icon: <FlagIcon /> },
      { title: "How We Work", desc: "Our engagement model", href: "/how-we-work", icon: <RouteIcon /> },
      { title: "Careers", desc: "Build the future with us", href: "/careers", icon: <BriefcaseIcon /> },
      { title: "Partners", desc: "Grow together", href: "/partners", icon: <UsersIcon /> },
      { title: "Contact", desc: "Talk to our team", href: "/contact", icon: <MailIcon /> },
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

const CLOSE_DELAY = 140;

export default function V5Nav() {
  const [open, setOpen] = useState<number | null>(null);
  const [mobile, setMobile] = useState(false);
  const [mobileSection, setMobileSection] = useState<number | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const closeMobile = () => {
    setMobile(false);
    setMobileSection(null);
  };

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(null), CLOSE_DELAY);
  };
  const openMenu = (i: number) => {
    cancelClose();
    setOpen(i);
  };
  const closeNow = () => {
    cancelClose();
    setOpen(null);
  };

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) closeNow();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeNow();
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
      cancelClose();
    };
  }, []);

  return (
    <>
      <div
        className="v5-nav"
        ref={rootRef}
        onMouseLeave={scheduleClose}
        onMouseEnter={cancelClose}
      >
        <div className="v5-nav-inner">
          <a href="/" className="v5-nav-brand" onClick={() => setMobile(false)}>
            <img src={LOGO} alt="ArqAI Labs" className="v5-nav-logo-img" width="160" height="38" decoding="async" />
          </a>

          <ul className="v5-nav-links">
            {MENUS.map((m, i) => (
              <li
                key={m.label}
                onMouseEnter={() => openMenu(i)}
                onMouseLeave={scheduleClose}
              >
                <button
                  type="button"
                  className={`v5-nav-trigger${open === i ? " active" : ""}`}
                  onFocus={() => openMenu(i)}
                >
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
              onClick={() => (mobile ? closeMobile() : setMobile(true))}
            >
              <span />
            </button>
          </div>
        </div>

        <div
          className={`v5-mega-wrap${open !== null ? " show" : ""}`}
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
        >
          {open !== null && (
            <div className="v5-mega">
              <div className="v5-mega-links">
                {MENUS[open].links.map((l) => (
                  <a key={l.title} href={l.href} className="v5-mega-link" onClick={closeNow}>
                    <span className="v5-mega-ico">{l.icon}</span>
                    <span className="v5-mega-text">
                      <strong>{l.title}</strong>
                      <span>{l.desc}</span>
                    </span>
                  </a>
                ))}
              </div>
              <a href={MENUS[open].feature.href} className="v5-mega-feature" onClick={closeNow}>
                <img src={MENUS[open].feature.image} alt="" loading="lazy" decoding="async" />
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

      <div className={`v5-nav-mobile${mobile ? " open" : ""}`}>
        {MENUS.map((m, i) => {
          const expanded = mobileSection === i;
          return (
            <div
              className={`v5-nav-mobile-group${expanded ? " expanded" : ""}`}
              key={m.label}
            >
              <button
                type="button"
                className="v5-nav-mobile-title"
                aria-expanded={expanded}
                onClick={() => setMobileSection(expanded ? null : i)}
              >
                {m.label}
                <Chevron />
              </button>
              <div className="v5-nav-mobile-panel">
                {m.links.map((l) => (
                  <a key={l.title} href={l.href} onClick={closeMobile}>
                    {l.title}
                  </a>
                ))}
              </div>
            </div>
          );
        })}
        <a href="/demo" className="v5-cta" onClick={closeMobile} style={{ marginTop: 10 }}>
          Book a Demo
        </a>
      </div>
    </>
  );
}
