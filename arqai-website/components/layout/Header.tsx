"use client";

import { useEffect } from "react";
import { SiteNav } from "@/components/site-dark/SiteNav";

/**
 * Compatibility wrapper for legacy pages.
 *
 * New public pages use the dark ArqAI Labs shell directly. Older pages still
 * import `Header`; keeping this adapter lets those routes inherit the same
 * fixed nav and dark/lime token scope without rewriting every content page.
 */
export function Header() {
  useEffect(() => {
    document.body.classList.add("arq-dark-body");
  }, []);

  return <SiteNav />;
}
