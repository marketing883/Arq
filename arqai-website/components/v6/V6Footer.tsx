import React from "react";
import { ArrowUpRight } from "lucide-react";

const LOGO = "/v5/assets/FEFrVVQtPUn7XSci8TiM5lb74o.png";

// ---------------------------------------------------------------------------
// Footer — dark, editorial, fully linked.
// ---------------------------------------------------------------------------

type FooterLink = { label: string; href: string };

const ACCELERATORS: FooterLink[] = [
  { label: "ArqFWA", href: "/accelerators/arqfwa" },
  { label: "ArqLoyalty", href: "/accelerators/arqloyalty" },
  { label: "ArqLogistics", href: "/accelerators/arqlogistics" },
  { label: "ArqBanker", href: "/accelerators/arqbanker" },
  { label: "ArqForecast", href: "/accelerators/arqforecast" },
  { label: "ArqSupport", href: "/accelerators/arqsupport" },
  { label: "ArqDataQ", href: "/accelerators/arqdataq" },
  { label: "ArqVantage", href: "/accelerators/arqvantage" },
  { label: "ArqSecOps", href: "/accelerators/arqsecops" },
  { label: "ArqEye", href: "/accelerators/arqeye" },
];

const SERVICES: FooterLink[] = [
  { label: "Workflow Strategy", href: "/services/workflow-strategy" },
  { label: "Agentic AI Buildout", href: "/services/agentic-ai-buildout" },
  { label: "Enterprise Integration", href: "/services/enterprise-integration" },
  { label: "Governance by Design", href: "/services/governance-by-design" },
  { label: "Vertical Acceleration", href: "/services/vertical-acceleration" },
  { label: "Managed AI Operations", href: "/services/managed-ai-operations" },
  { label: "All Services", href: "/services" },
];

const INDUSTRIES: FooterLink[] = [
  { label: "Healthcare Payers", href: "/industries/healthcare-payers" },
  { label: "Insurance Carriers", href: "/industries/insurance-carriers" },
  { label: "Banking", href: "/industries/banking" },
  { label: "Retail & QSR", href: "/industries/retail" },
  { label: "Manufacturing", href: "/industries/manufacturing" },
  { label: "All Industries", href: "/industries" },
];

const RESOURCES: FooterLink[] = [
  { label: "Blog", href: "/blog" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Whitepapers", href: "/whitepapers" },
  { label: "Webinars", href: "/webinars" },
  { label: "Resource Library", href: "/resources" },
];

const COMPANY: FooterLink[] = [
  { label: "About", href: "/about" },
  { label: "How We Work", href: "/how-we-work" },
  { label: "Careers", href: "/careers" },
  { label: "Partners", href: "/partners" },
  { label: "Trust & Security", href: "/trust" },
  { label: "Contact", href: "/contact" },
];

const SOCIALS: { label: string; href: string; path: string }[] = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/thearq-ai",
    path: "M4.98 3.5a2.5 2.5 0 11-.02 5 2.5 2.5 0 01.02-5zM3 9h4v12H3zM10 9h3.8v1.7h.05c.53-1 1.83-2.05 3.76-2.05 4.02 0 4.76 2.65 4.76 6.1V21h-4v-5.5c0-1.3-.02-3-1.83-3-1.84 0-2.12 1.43-2.12 2.9V21H10z",
  },
  {
    label: "X",
    href: "https://x.com/The_ArqAI",
    path: "M18.9 2H22l-7.5 8.6L23 22h-6.8l-5.3-6.9L4.8 22H1.7l8-9.2L1 2h7l4.8 6.3L18.9 2zm-1.2 18h1.9L7.1 4H5.1l12.6 16z",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/thearq.ai",
    path: "M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.43.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.43.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.43-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.43-.16 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07zM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.31-1.46.72-2.12 1.38C1.36 2.67.95 3.34.64 4.13.34 4.9.14 5.77.08 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.28.26 2.15.56 2.92.31.79.72 1.46 1.38 2.12.66.66 1.33 1.07 2.12 1.38.77.3 1.64.5 2.92.56 1.28.06 1.69.07 4.95.07s3.67-.01 4.95-.07c1.28-.06 2.15-.26 2.92-.56.79-.31 1.46-.72 2.12-1.38.66-.66 1.07-1.33 1.38-2.12.3-.77.5-1.64.56-2.92.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.28-.26-2.15-.56-2.92-.31-.79-.72-1.46-1.38-2.12-.66-.66-1.33-1.07-2.12-1.38-.77-.3-1.64-.5-2.92-.56C15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 100 12.32 6.16 6.16 0 000-12.32zM12 16a4 4 0 110-8 4 4 0 010 8zm6.4-11.85a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z",
  },
];

function Column({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div>
      <h3 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white/50">
        <span className="h-1.5 w-1.5 rounded-full bg-[#d0f438]/80" aria-hidden="true" />
        {title}
      </h3>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className="text-[13.5px] text-white/60 transition-colors duration-200 hover:text-white"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function V6Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#070a14]">
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(45%_50%_at_0%_0%,rgba(208,244,56,0.06),transparent_60%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-16 sm:px-6 md:px-10 md:pt-20 lg:px-14">
        {/* Top: brand + columns */}
        <div className="grid gap-12 lg:grid-cols-[1.25fr_1fr_1fr_1fr_1fr] lg:gap-10">
          {/* Brand block */}
          <div className="max-w-xs">
            <a href="/" aria-label="ArqAI Labs home" className="inline-block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={LOGO} alt="ArqAI Labs" className="h-9 w-auto brightness-0 invert" />
            </a>
            <p className="mt-5 text-[13.5px] leading-relaxed text-white/60">
              Forward-deployed AI engineering for regulated enterprises.
              Designed, built, and run in production.
            </p>
            <a
              href="/demo"
              className="group mt-6 inline-flex items-center gap-1.5 text-[14.5px] font-semibold text-white transition-colors hover:text-[#d0f438]"
            >
              Book a Workflow Assessment
              <ArrowUpRight
                size={15}
                className="text-[#d0f438] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
            <div className="mt-7 flex gap-2.5">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-white/60 transition-all duration-300 hover:border-white/30 hover:bg-white/5 hover:text-white"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <Column title="Accelerators" links={ACCELERATORS} />
          <Column title="Services" links={SERVICES} />
          <Column title="Industries" links={INDUSTRIES} />
          <div className="space-y-10">
            <Column title="Resources" links={RESOURCES} />
            <Column title="Company" links={COMPANY} />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-7 md:flex-row md:items-center md:justify-between">
          <p className="text-[12.5px] text-white/45">
            © 2026 ArqAI Labs. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[12.5px]">
            <a href="/privacy" className="text-white/45 transition-colors hover:text-white">
              Privacy
            </a>
            <a href="/terms" className="text-white/45 transition-colors hover:text-white">
              Terms
            </a>
            <a href="/trust" className="text-white/45 transition-colors hover:text-white">
              Trust &amp; Security
            </a>
            <span className="hidden items-center gap-2 text-white/35 md:inline-flex">
              <span className="h-1.5 w-1.5 rounded-full bg-[#d0f438]/70" aria-hidden="true" />
              Ten accelerators, governed from day one.
            </span>
          </div>
        </div>
      </div>

      {/* Watermark wordmark */}
      <div className="pointer-events-none relative -mb-4 select-none overflow-hidden md:-mb-8" aria-hidden="true">
        <p className="whitespace-nowrap text-center font-display text-[19vw] font-bold leading-[0.78] tracking-tight text-white/[0.04]">
          ArqAI Labs
        </p>
      </div>
    </footer>
  );
}
