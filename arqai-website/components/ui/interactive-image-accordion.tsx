"use client";

import React, { useState } from "react";
import { ArrowUpRight } from "lucide-react";

// --- Data for the image accordion ---
// The five accelerators we lead with, each panel linking to its page.
// Images are the same Unsplash assets used across the accelerator catalog.
export type ImageAccordionItem = {
  id: string;
  title: string;
  tag: string;
  description: string;
  imageUrl: string;
  href: string;
};

const unsplash = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

const HERO_VIDEO = "/v5/assets/ufsUXNNTVPKgg5ZhfzY4DHtmrKY.mp4";
const HERO_POSTER = "/v5/assets/pR0DzH2JNZa0vnz4l8WJLxvUKA.jpg";

export const defaultAccordionItems: ImageAccordionItem[] = [
  {
    id: "arqfwa",
    title: "ArqFWA",
    tag: "Payment Integrity",
    description:
      "Surfaces the claims most likely to be fraud, waste, or abuse — with evidence investigators can defend.",
    imageUrl: unsplash("photo-1576091160550-2173dba999ef"),
    href: "/accelerators/arqfwa",
  },
  {
    id: "arqloyalty",
    title: "ArqLoyalty",
    tag: "Loyalty Modernization",
    description:
      "Replace your loyalty platform with parity proven daily. Zero migration risk at cut-over.",
    imageUrl: unsplash("photo-1481437156560-3205f6a55735"),
    href: "/accelerators/arqloyalty",
  },
  {
    id: "arqvantage",
    title: "ArqVantage",
    tag: "Pricing Intelligence",
    description:
      "Reads why competitor prices moved and reprices within your guardrails, with MAP enforced automatically.",
    imageUrl: unsplash("photo-1460925895917-afdab827c52f"),
    href: "/accelerators/arqvantage",
  },
  {
    id: "arqbanker",
    title: "ArqBanker",
    tag: "Banking Operations",
    description:
      "Underwriting, KYC, AML, and regulatory reporting — with explainable reasoning on every decision.",
    imageUrl: unsplash("photo-1582139329536-e7284fece509"),
    href: "/accelerators/arqbanker",
  },
  {
    id: "arqsupport",
    title: "ArqSupport",
    tag: "Service Management",
    description:
      "Agentic L1/L2/L3 ticket triage and auto-resolution, with SLA breaches prevented rather than reported.",
    imageUrl: unsplash("photo-1497366754035-f200968a6e72"),
    href: "/accelerators/arqsupport",
  },
];

// --- Accordion Item Component ---
type AccordionPanelProps = {
  item: ImageAccordionItem;
  isActive: boolean;
  onActivate: () => void;
};

function AccordionPanel({ item, isActive, onActivate }: AccordionPanelProps) {
  return (
    <a
      href={item.href}
      aria-label={`${item.title} — ${item.tag}`}
      className={`
        relative block h-[360px] md:h-[470px] rounded-2xl overflow-hidden cursor-pointer
        outline-none transition-all duration-700 ease-in-out
        ${isActive ? "w-[230px] md:w-[350px]" : "w-[48px] md:w-[60px]"}
      `}
      onMouseEnter={onActivate}
      onFocus={onActivate}
    >
      {/* Background Image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={item.imageUrl}
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src =
            "https://placehold.co/400x450/161f3d/ffffff?text=ArqAI";
        }}
      />
      {/* Dark overlay for legibility */}
      <div
        className={`absolute inset-0 transition-colors duration-700 ${
          isActive
            ? "bg-gradient-to-t from-black/80 via-black/25 to-black/10"
            : "bg-black/45"
        }`}
      />

      {/* Collapsed caption — rotated name */}
      <span
        className={`
          absolute bottom-20 left-1/2 -translate-x-1/2 rotate-90 whitespace-nowrap
          font-display font-semibold text-white text-sm md:text-base
          transition-opacity duration-300
          ${isActive ? "opacity-0" : "opacity-100"}
        `}
        aria-hidden="true"
      >
        {item.title}
      </span>

      {/* Active caption — name, tag, description */}
      <span
        className={`
          absolute inset-x-0 bottom-0 p-5 transition-all duration-500 ease-out
          ${isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"}
        `}
      >
        <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#d0f438]">
          {item.tag}
        </span>
        <span className="mt-1 block font-display text-lg md:text-xl font-semibold text-white">
          {item.title}
        </span>
        <span className="mt-1.5 block max-w-[290px] text-xs md:text-[13px] leading-relaxed text-white/80">
          {item.description}
        </span>
      </span>
    </a>
  );
}

// --- Main Hero Component ---
type LandingAccordionItemProps = {
  items?: ImageAccordionItem[];
};

export function LandingAccordionItem({
  items = defaultAccordionItems,
}: LandingAccordionItemProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="relative overflow-hidden bg-white font-sans">
      {/* --- Background video with stylized overlay --- */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={HERO_POSTER}
        aria-hidden="true"
      >
        <source src={HERO_VIDEO} type="video/mp4" />
      </video>
      {/* Legibility veil: strong on the copy side, lighter over the accordion */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-white/35"
        aria-hidden="true"
      />
      {/* Lime glow accent, top-right */}
      <div
        className="absolute inset-0 bg-[radial-gradient(52%_44%_at_82%_6%,rgba(208,244,56,0.22),transparent_62%)]"
        aria-hidden="true"
      />
      {/* Fade into the next section */}
      <div
        className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white to-transparent"
        aria-hidden="true"
      />

      <section className="relative mx-auto flex min-h-screen max-w-7xl items-center px-4 pt-24 pb-10 md:px-8 md:pt-20 md:pb-14">
        <div className="flex w-full flex-col items-center justify-between gap-12 md:-mt-10 md:flex-row">
          {/* Left Side: Text Content */}
          <div className="w-full text-center md:w-1/2 md:text-left">
            <h1 className="font-display text-[clamp(26px,3.8vw,52px)] font-semibold text-gray-900 leading-[1.08] tracking-tight whitespace-nowrap">
              Forward Deployed AI
              <br />
              Engineering. At Scale.
            </h1>

            <p className="mt-6 text-lg text-gray-600 max-w-xl mx-auto md:mx-0">
              Engineers embedded in the problem, not advising from outside.
              Every accelerator comes from years of doing this work: designed,
              built, deployed, and run in production, with audit-ready proof on
              every agent action.
            </p>

            <div className="mt-8">
              <a
                href="/demo"
                className="group inline-flex items-center gap-2 text-[17px] font-semibold text-gray-900 transition-colors hover:text-gray-600 md:text-lg"
              >
                Book a Workflow Assessment
                <ArrowUpRight
                  size={19}
                  className="text-[#9bbf2e] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
            </div>

            {/* Stat strip */}
            <div className="mt-10 flex items-center justify-center md:justify-start gap-8 md:gap-10">
              {[
                { num: "40–60%", label: "Faster delivery on flagship accelerators" },
                { num: "70%", label: "Substrate reuse by engagement three" },
                { num: "100%", label: "Agent actions with audit-ready proof" },
              ].map((s) => (
                <div key={s.num} className="text-left max-w-[130px]">
                  <div className="font-display text-2xl md:text-3xl font-semibold text-gray-900">
                    {s.num}
                  </div>
                  <div className="mt-1 text-xs text-gray-500 leading-snug">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Image Accordion */}
          <div className="w-full md:w-1/2">
            <div className="flex flex-row items-center justify-center gap-3 md:gap-4 overflow-x-auto p-4">
              {items.map((item, index) => (
                <AccordionPanel
                  key={item.id}
                  item={item}
                  isActive={index === activeIndex}
                  onActivate={() => setActiveIndex(index)}
                />
              ))}
            </div>
            <p className="text-center text-xs text-gray-500 mt-2">
              Flagship accelerators — part of a growing library.{" "}
              <a href="/accelerators" className="underline underline-offset-2 hover:text-gray-800">
                Explore all
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
