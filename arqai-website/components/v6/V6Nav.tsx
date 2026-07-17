"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BadgePercent,
  BookOpen,
  Bot,
  Briefcase,
  Building2,
  ChevronDown,
  Compass,
  Database,
  Eye,
  FileText,
  Gauge,
  Handshake,
  Headset,
  Landmark,
  Layers,
  LineChart,
  Link2,
  Lock,
  Mail,
  Menu,
  MonitorPlay,
  Newspaper,
  Route,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  Truck,
  X,
} from "lucide-react";

const A = "/v5/assets";
const LOGO = `${A}/FEFrVVQtPUn7XSci8TiM5lb74o.png`;
const NAV_VIDEO = `${A}/ufsUXNNTVPKgg5ZhfzY4DHtmrKY.mp4`;
const NAV_POSTER = `${A}/pR0DzH2JNZa0vnz4l8WJLxvUKA.jpg`;

const unsplash = (id: string, w = 800) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

// ---------------------------------------------------------------------------
// Menu data
// ---------------------------------------------------------------------------

type MegaLink = {
  label: string;
  desc: string;
  href: string;
  icon: React.ReactNode;
};

const ACCELERATORS_VERTICAL: MegaLink[] = [
  { label: "ArqFWA", desc: "Payment integrity & fraud intelligence", href: "/accelerators/arqfwa", icon: <ShieldAlert size={18} /> },
  { label: "ArqLoyalty", desc: "Zero-risk loyalty modernization", href: "/accelerators/arqloyalty", icon: <BadgePercent size={18} /> },
  { label: "ArqLogistics", desc: "Supplier & supply chain risk", href: "/accelerators/arqlogistics", icon: <Truck size={18} /> },
  { label: "ArqBanker", desc: "Underwriting, KYC, AML & reporting", href: "/accelerators/arqbanker", icon: <Landmark size={18} /> },
];

const ACCELERATORS_HORIZONTAL: MegaLink[] = [
  { label: "ArqForecast", desc: "Demand & cash flow forecasting", href: "/accelerators/arqforecast", icon: <TrendingUp size={18} /> },
  { label: "ArqSupport", desc: "Agentic ticket & service management", href: "/accelerators/arqsupport", icon: <Headset size={18} /> },
  { label: "ArqDataQ", desc: "Data quality monitoring & remediation", href: "/accelerators/arqdataq", icon: <Database size={18} /> },
  { label: "ArqVantage", desc: "Pricing intelligence & repricing", href: "/accelerators/arqvantage", icon: <LineChart size={18} /> },
  { label: "ArqSecOps", desc: "SecOps & incident intelligence", href: "/accelerators/arqsecops", icon: <Lock size={18} /> },
  { label: "ArqEye", desc: "AI-native data observability", href: "/accelerators/arqeye", icon: <Eye size={18} /> },
];

const SERVICES: MegaLink[] = [
  { label: "Workflow Strategy", desc: "Find the workflows worth automating", href: "/services/workflow-strategy", icon: <Compass size={18} /> },
  { label: "Agentic AI Buildout", desc: "Production agents, not demos", href: "/services/agentic-ai-buildout", icon: <Bot size={18} /> },
  { label: "Enterprise Integration", desc: "Wired into your existing stack", href: "/services/enterprise-integration", icon: <Link2 size={18} /> },
  { label: "Governance by Design", desc: "Audit-ready from day one", href: "/services/governance-by-design", icon: <ShieldCheck size={18} /> },
  { label: "Vertical Acceleration", desc: "Pre-built patterns for your industry", href: "/services/vertical-acceleration", icon: <Layers size={18} /> },
  { label: "Managed AI Operations", desc: "We run it after go-live", href: "/services/managed-ai-operations", icon: <Gauge size={18} /> },
];

const INDUSTRIES = [
  { label: "Healthcare Payers", desc: "Payment integrity & member ops", href: "/industries/healthcare-payers", image: unsplash("photo-1551076805-e1869033e561") },
  { label: "Insurance Carriers", desc: "Claims, SIU & underwriting", href: "/industries/insurance-carriers", image: unsplash("photo-1597328290883-50c5787b7c7e") },
  { label: "Banking", desc: "AML, KYC & financial crime", href: "/industries/banking", image: unsplash("photo-1684679674829-fc7b436ec8e8") },
  { label: "Retail & QSR", desc: "Loyalty, pricing & stores", href: "/industries/retail", image: unsplash("photo-1759323321196-2813db509285") },
  { label: "Manufacturing", desc: "Supply chain & plant operations", href: "/industries/manufacturing", image: unsplash("photo-1610891015188-5369212db097") },
];

const RESOURCES: MegaLink[] = [
  { label: "Blog", desc: "Lessons from running AI in production", href: "/blog", icon: <Newspaper size={18} /> },
  { label: "Case Studies", desc: "Outcomes from deployed work", href: "/case-studies", icon: <FileText size={18} /> },
  { label: "Whitepapers", desc: "Deep dives on governed AI", href: "/whitepapers", icon: <BookOpen size={18} /> },
  { label: "Webinars", desc: "Live sessions with our engineers", href: "/webinars", icon: <MonitorPlay size={18} /> },
];

const COMPANY: MegaLink[] = [
  { label: "About", desc: "Who we are & why we exist", href: "/about", icon: <Building2 size={18} /> },
  { label: "How We Work", desc: "Forward-deployed, end to end", href: "/how-we-work", icon: <Route size={18} /> },
  { label: "Careers", desc: "Join the forward-deployed team", href: "/careers", icon: <Briefcase size={18} /> },
  { label: "Partners", desc: "Delivery & technology alliances", href: "/partners", icon: <Handshake size={18} /> },
  { label: "Trust & Security", desc: "Controls, compliance & posture", href: "/trust", icon: <ShieldCheck size={18} /> },
  { label: "Contact", desc: "Start the conversation", href: "/contact", icon: <Mail size={18} /> },
];

type MenuKey = "accelerators" | "services" | "industries" | "resources" | "company";

const MENUS: { key: MenuKey; label: string }[] = [
  { key: "accelerators", label: "Accelerators" },
  { key: "services", label: "Services" },
  { key: "industries", label: "Industries" },
  { key: "resources", label: "Resources" },
  { key: "company", label: "Company" },
];

// ---------------------------------------------------------------------------
// Shared pieces
// ---------------------------------------------------------------------------

function MegaLinkItem({ link, index }: { link: MegaLink; index: number }) {
  return (
    <a
      href={link.href}
      className="group/link flex items-start gap-3.5 rounded-2xl p-3 opacity-0 animate-fade-in-up transition-colors hover:bg-gray-50"
      style={{ animationDelay: `${60 + index * 35}ms` }}
    >
      <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-900 transition-all duration-300 group-hover/link:bg-gray-900 group-hover/link:text-[#d0f438] group-hover/link:scale-105">
        {link.icon}
      </span>
      <span>
        <span className="flex items-center gap-1.5 font-display text-[15px] font-semibold text-gray-900">
          {link.label}
          <ArrowUpRight
            size={13}
            className="text-gray-400 opacity-0 -translate-x-1 translate-y-1 transition-all duration-300 group-hover/link:opacity-100 group-hover/link:translate-x-0 group-hover/link:translate-y-0"
          />
        </span>
        <span className="mt-0.5 block text-[12.5px] leading-snug text-gray-500">{link.desc}</span>
      </span>
    </a>
  );
}

function FeatureTile({
  href,
  tag,
  title,
  cta,
  image,
  video,
  delay = 180,
}: {
  href: string;
  tag: string;
  title: string;
  cta: string;
  image?: string;
  video?: boolean;
  delay?: number;
}) {
  return (
    <a
      href={href}
      className="group/feature relative flex min-h-[230px] flex-col justify-end overflow-hidden rounded-2xl opacity-0 animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      {video ? (
        <video
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover/feature:scale-105"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={NAV_POSTER}
          aria-hidden="true"
        >
          <source src={NAV_VIDEO} type="video/mp4" />
        </video>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover/feature:scale-105"
        />
      )}
      <span className="absolute inset-0 bg-gradient-to-t from-[#0d1226]/85 via-[#0d1226]/25 to-transparent" aria-hidden="true" />
      <span className="relative z-10 p-5">
        <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#d0f438]">{tag}</span>
        <span className="mt-1 block font-display text-lg font-semibold leading-snug text-white">{title}</span>
        <span className="mt-2 inline-flex items-center gap-1.5 text-[13px] font-semibold text-white">
          {cta}
          <ArrowRight size={14} className="transition-transform duration-300 group-hover/feature:translate-x-1" />
        </span>
      </span>
    </a>
  );
}

function ColumnHeading({ children, delay = 40 }: { children: React.ReactNode; delay?: number }) {
  return (
    <p
      className="mb-1 px-3 text-[11px] font-bold uppercase tracking-[0.14em] text-gray-400 opacity-0 animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </p>
  );
}

// ---------------------------------------------------------------------------
// Mega panels
// ---------------------------------------------------------------------------

function AcceleratorsPanel() {
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.5fr_1fr]">
      <div>
        <ColumnHeading>Vertical · Industry-specific</ColumnHeading>
        <div className="flex flex-col">
          {ACCELERATORS_VERTICAL.map((link, i) => (
            <MegaLinkItem key={link.href} link={link} index={i} />
          ))}
        </div>
      </div>
      <div>
        <ColumnHeading>Horizontal · Cross-industry</ColumnHeading>
        <div className="grid sm:grid-cols-2">
          {ACCELERATORS_HORIZONTAL.map((link, i) => (
            <MegaLinkItem key={link.href} link={link} index={i + 2} />
          ))}
        </div>
      </div>
      <FeatureTile
        href="/accelerators"
        tag="The portfolio"
        title="Ten accelerators. One governed spine."
        cta="Explore all accelerators"
        video
      />
    </div>
  );
}

function ServicesPanel() {
  return (
    <div className="grid gap-8 lg:grid-cols-[2.2fr_1fr]">
      <div>
        <ColumnHeading>Forward-deployed engineering, end to end</ColumnHeading>
        <div className="grid sm:grid-cols-2">
          {SERVICES.map((link, i) => (
            <MegaLinkItem key={link.href} link={link} index={i} />
          ))}
        </div>
      </div>
      <FeatureTile
        href="/services"
        tag="Services"
        title="Embedded in your operation, not advising from outside."
        cta="See all services"
        image={`${A}/H4rP4HWageK0Wzp8OfGGGbv8M0.jpeg`}
      />
    </div>
  );
}

function IndustriesPanel() {
  return (
    <div>
      <ColumnHeading>Regulated industries, one governed spine</ColumnHeading>
      <div className="mt-2 grid grid-cols-2 gap-4 lg:grid-cols-5">
        {INDUSTRIES.map((ind, i) => (
          <a
            key={ind.href}
            href={ind.href}
            className="group/card relative flex h-[190px] flex-col justify-end overflow-hidden rounded-2xl opacity-0 animate-fade-in-up"
            style={{ animationDelay: `${60 + i * 55}ms` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={ind.image}
              alt=""
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover/card:scale-105"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-[#0d1226]/85 via-[#0d1226]/25 to-transparent transition-colors duration-300 group-hover/card:from-[#0d1226]/95" aria-hidden="true" />
            <span className="relative z-10 p-4">
              <span className="block font-display text-[15px] font-semibold text-white">{ind.label}</span>
              <span className="mt-0.5 block text-[12px] leading-snug text-white/70">{ind.desc}</span>
            </span>
            <span className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[#d0f438] text-gray-900 opacity-0 scale-75 transition-all duration-300 group-hover/card:opacity-100 group-hover/card:scale-100">
              <ArrowUpRight size={15} />
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

function ResourcesPanel() {
  return (
    <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
      <div>
        <ColumnHeading>Learn from production, not theory</ColumnHeading>
        <div className="grid sm:grid-cols-2">
          {RESOURCES.map((link, i) => (
            <MegaLinkItem key={link.href} link={link} index={i} />
          ))}
        </div>
      </div>
      <FeatureTile
        href="/resources"
        tag="Resource library"
        title="What we are learning by running AI in production."
        cta="Browse the library"
        image={`${A}/wqdffQW0WSkz5XQ7YchgqN2bDQ.jpeg`}
      />
    </div>
  );
}

function CompanyPanel() {
  return (
    <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
      <div>
        <ColumnHeading>ArqAI Labs</ColumnHeading>
        <div className="grid sm:grid-cols-2">
          {COMPANY.map((link, i) => (
            <MegaLinkItem key={link.href} link={link} index={i} />
          ))}
        </div>
      </div>
      <FeatureTile
        href="/about"
        tag="Why we exist"
        title="A partner that stays accountable after go-live."
        cta="Get to know us"
        image={`${A}/CtN60Gw14rqeKcm73KuXfmRIBo4.jpg`}
      />
    </div>
  );
}

const PANELS: Record<MenuKey, React.ReactNode> = {
  accelerators: <AcceleratorsPanel />,
  services: <ServicesPanel />,
  industries: <IndustriesPanel />,
  resources: <ResourcesPanel />,
  company: <CompanyPanel />,
};

// ---------------------------------------------------------------------------
// Nav
// ---------------------------------------------------------------------------

export default function V6Nav() {
  const [active, setActive] = useState<MenuKey | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileGroup, setMobileGroup] = useState<MenuKey | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const open = (key: MenuKey) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActive(key);
  };
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setActive(null), 140);
  };
  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  const solid = scrolled || active !== null || mobileOpen;

  return (
    <header
      className="fixed inset-x-0 top-0 z-50"
      onMouseLeave={scheduleClose}
    >
      {/* Bar */}
      <div
        className={`w-full border-b transition-all duration-300 ${
          solid
            ? "border-gray-900/10 bg-white/95 shadow-[0_18px_50px_-32px_rgba(22,31,61,0.4)] backdrop-blur-xl"
            : "border-transparent bg-transparent"
        }`}
        onMouseEnter={cancelClose}
      >
        <nav className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-6 px-4 md:px-8">
          {/* Brand */}
          <a href="/" className="flex shrink-0 items-center" aria-label="ArqAI Labs home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={LOGO} alt="ArqAI Labs" className="h-9 w-auto" />
          </a>

          {/* Desktop menu */}
          <ul className="hidden items-center lg:flex">
            {MENUS.map((menu) => (
              <li key={menu.key}>
                <button
                  type="button"
                  className={`group/trigger relative flex items-center gap-1.5 px-4 py-2.5 text-[15px] font-medium transition-colors ${
                    active === menu.key ? "text-gray-900" : "text-gray-700 hover:text-gray-900"
                  }`}
                  aria-expanded={active === menu.key}
                  onMouseEnter={() => open(menu.key)}
                  onFocus={() => open(menu.key)}
                  onClick={() => setActive(active === menu.key ? null : menu.key)}
                >
                  {menu.label}
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-300 ${active === menu.key ? "rotate-180" : ""}`}
                  />
                  {/* animated underline */}
                  <span
                    className={`absolute inset-x-4 -bottom-0.5 h-[2px] rounded-full bg-[#d0f438] transition-all duration-300 ${
                      active === menu.key ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
                    }`}
                    aria-hidden="true"
                  />
                </button>
              </li>
            ))}
          </ul>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <a
              href="/demo"
              className="hidden rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-gray-800 lg:inline-flex"
            >
              Book a Demo
            </a>
            <button
              type="button"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-900/10 bg-white text-gray-900 lg:hidden"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>

        {/* Mega panel — full width, animated */}
        {active && (
          <div
            className="hidden w-full border-t border-gray-900/5 lg:block"
            onMouseEnter={cancelClose}
          >
            <div key={active} className="mx-auto max-w-7xl px-8 py-7">
              {PANELS[active]}
            </div>
          </div>
        )}
      </div>

      {/* Backdrop blur below the open mega menu */}
      <div
        className={`fixed inset-0 -z-10 bg-[#0d1226]/25 backdrop-blur-[2px] transition-opacity duration-300 ${
          active ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden="true"
        onMouseEnter={scheduleClose}
      />

      {/* Mobile panel */}
      {mobileOpen && (
        <div className="max-h-[calc(100dvh-72px)] overflow-y-auto border-t border-gray-900/10 bg-white px-4 pb-6 pt-2 lg:hidden">
          {MENUS.map((menu) => (
            <div key={menu.key} className="border-b border-gray-100">
              <button
                type="button"
                className="flex w-full items-center justify-between px-2 py-4 text-left font-display text-[16px] font-semibold text-gray-900"
                aria-expanded={mobileGroup === menu.key}
                onClick={() => setMobileGroup(mobileGroup === menu.key ? null : menu.key)}
              >
                {menu.label}
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-300 ${mobileGroup === menu.key ? "rotate-180" : ""}`}
                />
              </button>
              {mobileGroup === menu.key && (
                <div className="pb-3">
                  {(menu.key === "industries"
                    ? INDUSTRIES.map((i) => ({ label: i.label, desc: i.desc, href: i.href, icon: null as React.ReactNode }))
                    : menu.key === "accelerators"
                      ? [...ACCELERATORS_VERTICAL, ...ACCELERATORS_HORIZONTAL]
                      : menu.key === "services"
                        ? SERVICES
                        : menu.key === "resources"
                          ? RESOURCES
                          : COMPANY
                  ).map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className="flex items-center gap-3 rounded-lg px-2 py-2.5 text-[15px] text-gray-700 hover:bg-gray-50"
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.icon && <span className="text-gray-500">{link.icon}</span>}
                      {link.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
          <a
            href="/demo"
            className="mt-4 block rounded-lg bg-gray-900 px-5 py-3.5 text-center font-semibold text-white"
          >
            Book a Demo
          </a>
        </div>
      )}
    </header>
  );
}
