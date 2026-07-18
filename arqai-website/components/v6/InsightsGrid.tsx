"use client";

import React, { useState } from "react";
import { ArrowUpRight, BookOpen, MonitorPlay, Sparkle } from "lucide-react";

// ---------------------------------------------------------------------------
// Insights bento — same visual family as the accelerator grid, lower height.
// Three CMS posts expand on hover; two tinted panels route to the libraries.
// ---------------------------------------------------------------------------

export type InsightPost = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  featured_image?: string | null;
  category?: string | null;
  published_at: string;
};

const EASE = "cubic-bezier(0.32,0.72,0.24,1)";

function formatDate(dateString: string): string {
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

function extractSlug(slugOrUrl: string): string {
  if (!slugOrUrl) return "";
  if (slugOrUrl.includes("/blog/")) {
    const parts = slugOrUrl.split("/blog/");
    return parts[parts.length - 1].replace(/\/$/, "");
  }
  return slugOrUrl;
}

function CardLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="pointer-events-none inline-flex items-center gap-2 text-[10.5px] uppercase tracking-[0.22em] text-white/70">
      <Sparkle className="h-3 w-3" strokeWidth={1.5} />
      {children}
      <Sparkle className="h-3 w-3" strokeWidth={1.5} />
    </span>
  );
}

// ---------------------------------------------------------------------------
// Post card (main)
// ---------------------------------------------------------------------------

function PostCard({
  post,
  flexGrow,
  state,
  onActivate,
}: {
  post: InsightPost;
  flexGrow: number;
  state: "rest" | "active" | "compact";
  onActivate: () => void;
}) {
  const isActive = state === "active";
  const href = `/blog/${extractSlug(post.slug)}`;

  return (
    <a
      href={href}
      className="group/post relative block min-h-0 overflow-hidden rounded-2xl bg-[#131722] transition-[flex-grow] duration-700"
      style={{ flexGrow, flexBasis: 0, transitionTimingFunction: EASE }}
      onMouseEnter={onActivate}
      onFocus={onActivate}
    >
      {post.featured_image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.featured_image}
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover opacity-70 transition-transform duration-700 group-hover/post:scale-105"
        />
      ) : (
        <span
          className="absolute inset-0 bg-[radial-gradient(70%_70%_at_70%_20%,rgba(208,244,56,0.14),transparent_60%),linear-gradient(160deg,#141a2c,#0d1120)]"
          aria-hidden="true"
        />
      )}
      <span
        className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20"
        aria-hidden="true"
      />

      {/* Top label */}
      <span
        className={`absolute inset-x-0 top-4 flex justify-center transition-opacity duration-500 ${
          state === "compact" ? "opacity-0" : "opacity-100"
        }`}
      >
        <CardLabel>{post.category || "Insights"}</CardLabel>
      </span>

      {/* Compact chip: rotated title */}
      <span
        className={`absolute bottom-16 left-1/2 max-w-[260px] -translate-x-1/2 rotate-90 truncate whitespace-nowrap font-display text-[13px] font-semibold text-white transition-opacity duration-300 ${
          state === "compact" ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden="true"
      >
        {post.title}
      </span>

      {/* Caption */}
      <span
        className={`absolute inset-x-0 bottom-0 p-5 transition-all duration-500 md:p-6 ${
          state === "compact" ? "pointer-events-none opacity-0 translate-y-3" : "opacity-100 translate-y-0"
        }`}
      >
        <span className="block text-[11px] font-medium text-white/50">{formatDate(post.published_at)}</span>
        <span
          className={`mt-1.5 block font-display font-semibold leading-snug text-white transition-all duration-500 ${
            isActive ? "text-xl md:text-[22px]" : "text-[17px]"
          }`}
        >
          {post.title}
        </span>
        {post.excerpt && (
          <span
            className={`block overflow-hidden transition-all duration-500 ${
              isActive ? "mt-2 max-h-24 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <span className="block text-[13px] leading-relaxed text-white/70">{post.excerpt}</span>
          </span>
        )}
        <span
          className={`mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-white transition-all duration-500 ${
            isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
        >
          Read the post
          <ArrowUpRight size={13} className="text-[#d0f438]" />
        </span>
      </span>
    </a>
  );
}

// ---------------------------------------------------------------------------
// Library panel (secondary)
// ---------------------------------------------------------------------------

function LibraryPanel({
  label,
  title,
  body,
  href,
  linkText,
  tint,
  icon,
  compact,
}: {
  label: string;
  title: string;
  body: string;
  href: string;
  linkText: string;
  tint: string;
  icon: React.ReactNode;
  compact: boolean;
}) {
  return (
    <a
      href={href}
      className="noise-overlay group/lib relative flex min-h-0 flex-col justify-between overflow-hidden rounded-2xl p-5 transition-[flex-grow] duration-700 md:p-6"
      style={{ flexGrow: compact ? 0.45 : 1, flexBasis: 0, backgroundColor: tint, transitionTimingFunction: EASE }}
    >
      <span
        className={`absolute inset-0 flex items-center justify-center text-white/70 transition-opacity duration-300 ${
          compact ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden="true"
      >
        {icon}
      </span>

      <span className={`transition-opacity duration-300 ${compact ? "opacity-0" : "opacity-100"}`}>
        <CardLabel>{label}</CardLabel>
        <span className="mt-3 flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-[#d0f438]">{icon}</span>
          <span className="font-display text-lg font-semibold text-white">{title}</span>
        </span>
        <span className="mt-2 block text-[12.5px] leading-[1.6] text-white/75">{body}</span>
      </span>
      <span
        className={`inline-flex items-center gap-1.5 pt-3 text-[13px] font-semibold text-white transition-opacity duration-300 ${
          compact ? "opacity-0" : "opacity-100"
        }`}
      >
        {linkText}
        <ArrowUpRight
          size={13}
          className="text-[#d0f438] transition-transform duration-300 group-hover/lib:translate-x-0.5 group-hover/lib:-translate-y-0.5"
        />
      </span>
    </a>
  );
}

// ---------------------------------------------------------------------------
// Section
// ---------------------------------------------------------------------------

export default function InsightsGrid({ posts }: { posts: InsightPost[] }) {
  const [active, setActive] = useState<number | null>(null);
  const [p0, p1, p2] = posts;

  // Column of each main post
  const colOf = [0, 1, 2];
  const activeCol = active !== null ? colOf[active] : null;
  const colFlex = (col: number) => (activeCol === null ? 1 : activeCol === col ? 2.4 : 0.7);
  const state = (i: number): "rest" | "active" | "compact" =>
    active === i ? "active" : active !== null ? "compact" : "rest";

  return (
    <section className="relative overflow-hidden bg-[#0a0a0a] antialiased" id="insights">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:px-10 md:py-20 lg:px-14">
        {/* Header row */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <CardLabel>Insights &amp; articles</CardLabel>
            <h2 className="mt-4 font-display text-[26px] font-semibold leading-[1.15] tracking-tight text-white sm:text-3xl md:text-4xl">
              What we are learning by
              <br />
              running AI in production.
            </h2>
          </div>
          <a
            href="/blog"
            className="group inline-flex shrink-0 items-center gap-1.5 text-[15px] font-semibold text-white transition-colors hover:text-[#d0f438]"
          >
            Read the Blog
            <ArrowUpRight
              size={16}
              className="text-[#d0f438] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
        </div>

        {/* Bento stage — desktop */}
        <div
          className="mt-10 hidden h-[420px] gap-4 md:gap-5 lg:flex"
          onMouseLeave={() => setActive(null)}
        >
          {/* Column 1 — post 0 */}
          <div
            className="flex min-w-0 flex-col gap-4 transition-[flex-grow] duration-700 md:gap-5"
            style={{ flexGrow: colFlex(0), flexBasis: 0, transitionTimingFunction: EASE }}
          >
            {p0 && <PostCard post={p0} flexGrow={1} state={state(0)} onActivate={() => setActive(0)} />}
          </div>

          {/* Column 2 — whitepapers panel + post 1 */}
          <div
            className="flex min-w-0 flex-col gap-4 transition-[flex-grow] duration-700 md:gap-5"
            style={{ flexGrow: colFlex(1), flexBasis: 0, transitionTimingFunction: EASE }}
          >
            <LibraryPanel
              label="Deep dives"
              title="Whitepapers"
              body="Governed AI in regulated industries, written for the people who sign off."
              href="/whitepapers"
              linkText="Browse whitepapers"
              tint="#26333f"
              icon={<BookOpen size={18} strokeWidth={1.5} />}
              compact={active !== null && activeCol !== 1}
            />
            {p1 && (
              <PostCard post={p1} flexGrow={active === 1 ? 6 : 1.5} state={state(1)} onActivate={() => setActive(1)} />
            )}
          </div>

          {/* Column 3 — post 2 + webinars panel */}
          <div
            className="flex min-w-0 flex-col gap-4 transition-[flex-grow] duration-700 md:gap-5"
            style={{ flexGrow: colFlex(2), flexBasis: 0, transitionTimingFunction: EASE }}
          >
            {p2 && (
              <PostCard post={p2} flexGrow={active === 2 ? 6 : 1.5} state={state(2)} onActivate={() => setActive(2)} />
            )}
            <LibraryPanel
              label="Live sessions"
              title="Webinars"
              body="Our engineers on what actually ships — with the scars to prove it."
              href="/webinars"
              linkText="See the webinars"
              tint="#333044"
              icon={<MonitorPlay size={18} strokeWidth={1.5} />}
              compact={active !== null && activeCol !== 2}
            />
          </div>
        </div>

        {/* Mobile / tablet */}
        <div className="mt-10 flex flex-col gap-4 lg:hidden">
          {posts.map((post) => (
            <a
              key={post.id}
              href={`/blog/${extractSlug(post.slug)}`}
              className="relative overflow-hidden rounded-2xl bg-[#131722] p-5"
            >
              {post.featured_image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={post.featured_image} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover opacity-40" />
              )}
              <span className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/30" aria-hidden="true" />
              <span className="relative">
                <span className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-[#d0f438]">
                  {post.category || "Insights"}
                </span>
                <span className="mt-1.5 block font-display text-[17px] font-semibold leading-snug text-white">
                  {post.title}
                </span>
                <span className="mt-1 block text-[11px] text-white/50">{formatDate(post.published_at)}</span>
              </span>
            </a>
          ))}
          <div className="grid grid-cols-2 gap-4">
            <a href="/whitepapers" className="noise-overlay rounded-2xl p-5" style={{ backgroundColor: "#26333f" }}>
              <BookOpen size={18} strokeWidth={1.5} className="text-[#d0f438]" />
              <span className="mt-2 block font-display text-[15px] font-semibold text-white">Whitepapers</span>
            </a>
            <a href="/webinars" className="noise-overlay rounded-2xl p-5" style={{ backgroundColor: "#333044" }}>
              <MonitorPlay size={18} strokeWidth={1.5} className="text-[#d0f438]" />
              <span className="mt-2 block font-display text-[15px] font-semibold text-white">Webinars</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
