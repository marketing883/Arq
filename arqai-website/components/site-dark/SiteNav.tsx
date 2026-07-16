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

type MegaVisualConfig = {
  kicker: string;
  title: string;
  footer: string;
  kind: "platform" | "services" | "accelerators" | "industries" | "resources" | "company";
};

const megaVisuals: Record<string, MegaVisualConfig> = {
  Platform: {
    kicker: "Operating fabric",
    title: "Governed execution map",
    footer: "Workflow, policy, evidence, and action connected in one operating loop.",
    kind: "platform",
  },
  Services: {
    kicker: "Service motion",
    title: "From problem to release",
    footer: "Discover, build, deploy, and improve around measurable operating outcomes.",
    kind: "services",
  },
  Accelerators: {
    kicker: "Pattern library",
    title: "Reusable workflow starts",
    footer: "Domain-ready patterns tuned to your systems, controls, and review model.",
    kind: "accelerators",
  },
  Industries: {
    kicker: "Industry terrain",
    title: "Rules before automation",
    footer: "Model the operating context before agents touch high-stakes work.",
    kind: "industries",
  },
  Resources: {
    kicker: "Knowledge hub",
    title: "Proof, guides, and field notes",
    footer: "Learn from practical delivery material shaped around production AI.",
    kind: "resources",
  },
  Company: {
    kicker: "Studio depth",
    title: "AI plus enterprise delivery",
    footer: "Focused AI engineering backed by cloud, data, security, and managed operations.",
    kind: "company",
  },
};

function VisualDefs({ label }: { label: string }) {
  return (
    <defs>
      <filter id={`mega-${label}-glow`} x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur stdDeviation="5" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <linearGradient id={`mega-${label}-lime`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#d0f438" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0.45" />
      </linearGradient>
    </defs>
  );
}

function PlatformVisual({ label }: { label: string }) {
  const layers = [
    { name: "Data", y: 48, width: 158 },
    { name: "Policy", y: 82, width: 184 },
    { name: "Review", y: 116, width: 168 },
    { name: "Action", y: 150, width: 196 },
  ];

  return (
    <svg viewBox="0 0 280 220" className="a-mega-visual-svg" role="img">
      <VisualDefs label={label} />
      <path className="a-mega-v-grid" d="M34 34H246M34 76H246M34 118H246M34 160H246M58 24V190M116 24V190M174 24V190M232 24V190" />
      <path className="a-mega-v-flow" d="M42 36C82 26 116 38 144 64S188 96 232 84" />
      {layers.map((layer, index) => (
        <g key={layer.name} className="a-mega-v-layer" style={{ animationDelay: `${index * 0.18}s` }}>
          <rect x={(280 - layer.width) / 2} y={layer.y} width={layer.width} height="22" rx="11" />
          <text x="140" y={layer.y + 15} textAnchor="middle">
            {layer.name}
          </text>
        </g>
      ))}
      <g className="a-mega-v-core" filter={`url(#mega-${label}-glow)`}>
        <circle cx="140" cy="111" r="28" />
        <path d="M127 111h26M140 98v26" />
      </g>
      <path className="a-mega-v-pulse-line" d="M140 139v36h72" />
      <circle className="a-mega-v-dot" cx="212" cy="175" r="5" />
    </svg>
  );
}

function ServicesVisual({ label, spotlight }: { label: string; spotlight: string | null }) {
  const stages = ["Map", "Build", "Launch", "Tune"];
  const spotlightStage = spotlight
    ? {
        "Workflow Strategy": "Map",
        "Agentic AI Buildout": "Build",
        "Enterprise Integration": "Launch",
        "Governance by Design": "Map",
        "Vertical Acceleration": "Build",
        "Managed AI Operations": "Tune",
      }[spotlight] ?? null
    : null;

  return (
    <svg viewBox="0 0 280 220" className="a-mega-visual-svg" role="img">
      <VisualDefs label={label} />
      <path className="a-mega-v-blueprint" d="M40 42h82v84H40zM54 60h54M54 78h36M54 96h48M54 114h28" />
      <path className="a-mega-v-flow" d="M122 84C148 76 154 54 180 58C208 62 206 92 232 96" />
      <path className="a-mega-v-flow a-mega-v-flow-slow" d="M122 112C150 120 158 156 188 156H238" />
      {stages.map((stage, index) => (
        <g
          key={stage}
          className={`a-mega-v-module${spotlightStage === stage ? " is-active" : ""}`}
          style={{ animationDelay: `${index * 0.16}s` }}
          transform={`translate(${142 + (index % 2) * 68} ${46 + Math.floor(index / 2) * 76})`}
        >
          <rect width="58" height="42" rx="12" />
          <text x="29" y="25" textAnchor="middle">
            {stage}
          </text>
        </g>
      ))}
      <g className="a-mega-v-core" filter={`url(#mega-${label}-glow)`}>
        <circle cx="140" cy="176" r="18" />
        <path d="M132 176h16M140 168v16" />
      </g>
    </svg>
  );
}

function AcceleratorsVisual({ label, spotlight }: { label: string; spotlight: string | null }) {
  const tiles = ["ArqFWA", "ArqLoyalty", "ArqLogistics", "ArqBanker", "ArqForecast", "ArqSupport", "ArqDataQ", "ArqVantage", "ArqSecOps", "ArqEye"];
  // Show the part after the shared "Arq" prefix and size each tile to fit
  // its label (9px mono + letter-spacing runs ~6.2px per character).
  const tileText = (name: string) => name.replace(/^Arq/, "");
  const tileWidth = (text: string) => Math.max(48, text.length * 6.2 + 14);

  return (
    <svg viewBox="0 0 280 220" className="a-mega-visual-svg" role="img">
      <VisualDefs label={label} />
      <path className="a-mega-v-spine" d="M140 34v152" />
      <circle className="a-mega-v-orbit" cx="140" cy="110" r="70" />
      <circle className="a-mega-v-orbit a-mega-v-orbit-inner" cx="140" cy="110" r="42" />
      {tiles.map((tile, index) => {
        const text = tileText(tile);
        const w = tileWidth(text);
        const angle = (Math.PI * 2 * index) / tiles.length - Math.PI / 2;
        const x = 140 + Math.cos(angle) * 76 - w / 2;
        const y = 110 + Math.sin(angle) * 62 - 12;
        const active = spotlight === tile;

        return (
          <g
            key={tile}
            className={`a-mega-v-tile${active ? " is-active" : ""}`}
            style={{ animationDelay: `${index * 0.08}s` }}
            transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}
          >
            <rect width={w} height="24" rx="9" />
            <text x={w / 2} y="16" textAnchor="middle">
              {text}
            </text>
          </g>
        );
      })}
      <g className="a-mega-v-core" filter={`url(#mega-${label}-glow)`}>
        <circle cx="140" cy="110" r="25" />
        <path d="M127 110h26M140 97v26" />
      </g>
      <path className="a-mega-v-flow" d="M82 180C116 158 164 158 198 180" />
    </svg>
  );
}

function IndustriesVisual({ label }: { label: string }) {
  const pins = [
    { name: "Payer", x: 70, y: 66 },
    { name: "P&C", x: 206, y: 64 },
    { name: "Bank", x: 144, y: 104 },
    { name: "Retail", x: 86, y: 160 },
    { name: "MFG", x: 198, y: 158 },
  ];

  return (
    <svg viewBox="0 0 280 220" className="a-mega-visual-svg" role="img">
      <VisualDefs label={label} />
      <path className="a-mega-v-terrain" d="M44 76L96 38L148 70L212 42L238 92L206 168L134 184L74 154Z" />
      <path className="a-mega-v-flow" d="M70 66L144 104L206 64M144 104L86 160M144 104L198 158" />
      {pins.map((pin, index) => (
        <g key={pin.name} className="a-mega-v-pin" style={{ animationDelay: `${index * 0.18}s` }}>
          <circle cx={pin.x} cy={pin.y} r="10" />
          <circle cx={pin.x} cy={pin.y} r="3.5" />
          <text x={pin.x} y={pin.y + 25} textAnchor="middle">
            {pin.name}
          </text>
        </g>
      ))}
      <path className="a-mega-v-risk" d="M40 178h62M178 38h58" />
    </svg>
  );
}

function ResourcesVisual({ label }: { label: string }) {
  const cards = [
    { title: "Blog", x: 46, y: 52 },
    { title: "Case", x: 116, y: 36 },
    { title: "Guide", x: 154, y: 100 },
    { title: "Event", x: 74, y: 126 },
  ];

  return (
    <svg viewBox="0 0 280 220" className="a-mega-visual-svg" role="img">
      <VisualDefs label={label} />
      <circle className="a-mega-v-orbit" cx="142" cy="110" r="74" />
      <path className="a-mega-v-flow" d="M74 96C96 72 132 62 166 74C198 86 216 116 210 148" />
      {cards.map((card, index) => (
        <g key={card.title} className="a-mega-v-doc" style={{ animationDelay: `${index * 0.2}s` }} transform={`translate(${card.x} ${card.y})`}>
          <rect width="64" height="44" rx="10" />
          <path d="M12 16h38M12 27h28" />
          <text x="32" y="58" textAnchor="middle">
            {card.title}
          </text>
        </g>
      ))}
      <g className="a-mega-v-search" filter={`url(#mega-${label}-glow)`}>
        <circle cx="184" cy="150" r="25" />
        <path d="M202 168l22 22" />
        <path d="M174 150l9 8l16 -18" />
      </g>
    </svg>
  );
}

function CompanyVisual({ label }: { label: string }) {
  const pillars = [
    { name: "AI", x: 50, h: 74 },
    { name: "Data", x: 96, h: 96 },
    { name: "Cloud", x: 142, h: 84 },
    { name: "Sec", x: 188, h: 106 },
  ];

  return (
    <svg viewBox="0 0 280 220" className="a-mega-visual-svg" role="img">
      <VisualDefs label={label} />
      <path className="a-mega-v-grid" d="M38 174h202M38 134h202M38 94h202M38 54h202" />
      {pillars.map((pillar, index) => (
        <g key={pillar.name} className={`a-mega-v-pillar${index % 2 === 1 ? " is-accent" : ""}`} style={{ animationDelay: `${index * 0.14}s` }}>
          <rect x={pillar.x} y={174 - pillar.h} width="34" height={pillar.h} rx="12" />
          <text x={pillar.x + 17} y={192} textAnchor="middle">
            {pillar.name}
          </text>
        </g>
      ))}
      <path className="a-mega-v-flow" d="M67 88C100 52 164 50 205 76C228 90 236 116 222 140" />
      <g className="a-mega-v-core" filter={`url(#mega-${label}-glow)`}>
        <circle cx="220" cy="136" r="27" />
        <path d="M209 136h22M220 125v22" />
      </g>
      <text className="a-mega-v-caption" x="140" y="34" textAnchor="middle">
        Enterprise delivery stack
      </text>
    </svg>
  );
}

function MegaVisualSvg({ label, kind, spotlight }: { label: string; kind: MegaVisualConfig["kind"]; spotlight: string | null }) {
  switch (kind) {
    case "platform":
      return <PlatformVisual label={label} />;
    case "services":
      return <ServicesVisual label={label} spotlight={spotlight} />;
    case "accelerators":
      return <AcceleratorsVisual label={label} spotlight={spotlight} />;
    case "industries":
      return <IndustriesVisual label={label} />;
    case "resources":
      return <ResourcesVisual label={label} />;
    case "company":
      return <CompanyVisual label={label} />;
    default:
      return <PlatformVisual label={label} />;
  }
}

function MegaMenuVisual({ label, spotlight }: { label: string; spotlight: string | null }) {
  const visual = megaVisuals[label] ?? megaVisuals.Platform;

  return (
    <div className="a-mega-visual" aria-hidden="true">
      <div className="a-mega-visual-copy">
        <span>{visual.kicker}</span>
        <strong>{visual.title}</strong>
      </div>
      <MegaVisualSvg label={label} kind={visual.kind} spotlight={spotlight} />
      <p>{visual.footer}</p>
    </div>
  );
}

function MegaMenu({ item, onNavigate }: { item: SiteNavItem; onNavigate: () => void }) {
  const [spotlight, setSpotlight] = useState<string | null>(null);
  const linkCount = item.sections.reduce((total, section) => total + section.links.length, 0);

  useEffect(() => {
    setSpotlight(null);
  }, [item.label]);

  return (
    <div className={`a-mega${linkCount > 5 ? " a-mega-many" : ""}`} role="group" aria-label={`${item.label} menu`}>
      <div className="a-mega-feature">
        <span className="a-tag">{item.label}</span>
        <h3>{item.feature.title}</h3>
        <p>{item.feature.body}</p>
        <Link href={item.feature.href} onClick={onNavigate} className="a-mega-cta">
          {item.feature.cta} <ArrowIcon className="arrow" />
        </Link>
      </div>

      <div className="a-mega-sections" onMouseLeave={() => setSpotlight(null)}>
        {item.sections.map((section) => (
          <section key={section.title} className={`a-mega-section${section.links.length > 5 ? " is-wide" : ""}`}>
            <h4>{section.title}</h4>
            <div className={`a-mega-links${section.links.length > 5 ? " is-two-col" : ""}`}>
              {section.links.map((link) => (
                <Link
                  key={`${section.title}-${link.href}`}
                  href={link.href}
                  onClick={onNavigate}
                  onFocus={() => setSpotlight(link.label)}
                  onMouseEnter={() => setSpotlight(link.label)}
                  className="a-mega-link"
                >
                  <span>{link.label}</span>
                  {link.description ? <small>{link.description}</small> : null}
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>

      <MegaMenuVisual label={item.label} spotlight={spotlight} />
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
