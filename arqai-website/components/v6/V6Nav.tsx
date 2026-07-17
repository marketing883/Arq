"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

const LOGO = "/v5/assets/FEFrVVQtPUn7XSci8TiM5lb74o.png";

const LINKS = [
  { label: "Accelerators", href: "/accelerators" },
  { label: "Services", href: "/services" },
  { label: "Industries", href: "/industries" },
  { label: "Resources", href: "/resources" },
  { label: "About", href: "/about" },
];

export default function V6Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-8">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-6 rounded-full border border-gray-900/10 bg-white/80 py-2.5 pl-6 pr-2.5 shadow-[0_14px_40px_-26px_rgba(22,31,61,0.5)] backdrop-blur-xl">
        {/* Brand */}
        <a href="/" className="flex shrink-0 items-center" aria-label="ArqAI Labs home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO} alt="ArqAI Labs" className="h-8 w-auto md:h-9" />
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="rounded-full px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-900/5 hover:text-gray-900"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA + mobile toggle */}
        <div className="flex items-center gap-2">
          <a
            href="/demo"
            className="hidden rounded-full bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-gray-800 md:inline-flex"
          >
            Book a Demo
          </a>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-900/10 bg-white text-gray-900 md:hidden"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile panel */}
      {open && (
        <div className="mx-auto mt-2 max-w-7xl rounded-3xl border border-gray-900/10 bg-white p-3 shadow-xl md:hidden">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="block rounded-xl px-4 py-3 font-medium text-gray-800 hover:bg-gray-50"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a
            href="/demo"
            className="mt-2 block rounded-full bg-gray-900 px-5 py-3 text-center font-semibold text-white"
          >
            Book a Demo
          </a>
        </div>
      )}
    </header>
  );
}
