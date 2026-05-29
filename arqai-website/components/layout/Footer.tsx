"use client";

import { SiteFooter } from "@/components/site-dark/SiteFooter";

/** Compatibility wrapper for legacy pages now sharing the dark site footer. */
export function Footer() {
  return (
    <div className="arq-dark arq-dark-compat">
      <SiteFooter />
    </div>
  );
}
