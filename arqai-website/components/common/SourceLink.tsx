"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ComponentProps } from "react";

/**
 * A Link that tells the destination form where the visitor came from.
 *
 * For internal links pointing at /contact or /engage-us, appends
 * `?source=<current-path>` so the form can pre-fill context (accelerator,
 * service, industry) and attribute the lead. All other hrefs pass through
 * untouched.
 */
export default function SourceLink({
  href,
  ...rest
}: ComponentProps<typeof Link> & { href: string }) {
  const pathname = usePathname();

  let finalHref = href;
  const isFormTarget = href.startsWith("/contact") || href.startsWith("/engage-us");
  if (
    isFormTarget &&
    pathname &&
    pathname !== "/contact" &&
    pathname !== "/engage-us" &&
    !href.includes("source=")
  ) {
    finalHref = `${href}${href.includes("?") ? "&" : "?"}source=${encodeURIComponent(pathname)}`;
  }

  return <Link href={finalHref} {...rest} />;
}
