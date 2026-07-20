import React from "react";
import Link from "next/link";

// Internal path prefixes the assistant may mention. Only these become links,
// so arbitrary slashes in prose don't turn into dead links.
const INTERNAL_PREFIXES = [
  "/engage-us",
  "/contact",
  "/accelerators",
  "/services",
  "/industries",
  "/platform",
  "/resources",
  "/case-studies",
  "/whitepapers",
  "/webinars",
  "/blog",
  "/use-cases",
  "/trust",
  "/partners",
  "/careers",
  "/about",
];

// Matches an absolute http(s) URL or an internal path starting with a known
// prefix. Trailing punctuation is trimmed after matching.
const TOKEN_RE = new RegExp(
  `(https?://[^\\s]+|(?:${INTERNAL_PREFIXES.map((p) => p.replace("/", "\\/")).join("|")})(?:\\/[\\w\\-./#?=&%]*)?)`,
  "g"
);

const LINK_CLASS = "underline underline-offset-2 font-medium hover:opacity-80";

function trimTrailing(url: string): { url: string; trail: string } {
  const m = url.match(/[.,;:!?)]+$/);
  if (m) return { url: url.slice(0, -m[0].length), trail: m[0] };
  return { url, trail: "" };
}

/**
 * Render text with internal paths and URLs as clickable links. Safe by
 * construction — links are built from matched substrings as React elements,
 * never via dangerouslySetInnerHTML.
 */
export function linkify(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;

  for (const match of Array.from(text.matchAll(TOKEN_RE))) {
    const raw = match[0];
    const start = match.index ?? 0;
    if (start > lastIndex) nodes.push(text.slice(lastIndex, start));

    const { url, trail } = trimTrailing(raw);
    const isExternal = /^https?:\/\//.test(url);
    if (isExternal) {
      nodes.push(
        <a key={`l${key++}`} href={url} target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>
          {url}
        </a>
      );
    } else {
      nodes.push(
        <Link key={`l${key++}`} href={url} className={LINK_CLASS}>
          {url}
        </Link>
      );
    }
    if (trail) nodes.push(trail);
    lastIndex = start + raw.length;
  }

  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}
