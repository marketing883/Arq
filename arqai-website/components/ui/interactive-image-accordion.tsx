"use client";

import React, { useState } from "react";

// --- Data for the image accordion ---
// The five accelerators we lead with, each panel linking to its page.
// Images are the same Unsplash assets used across the accelerator catalog.
export type ImageAccordionItem = {
  id: string;
  title: string;
  tag: string;
  imageUrl: string;
  href: string;
};

const unsplash = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const defaultAccordionItems: ImageAccordionItem[] = [
  {
    id: "arqfwa",
    title: "ArqFWA",
    tag: "Payment Integrity",
    imageUrl: unsplash("photo-1576091160550-2173dba999ef"),
    href: "/accelerators/arqfwa",
  },
  {
    id: "arqloyalty",
    title: "ArqLoyalty",
    tag: "Loyalty Modernization",
    imageUrl: unsplash("photo-1481437156560-3205f6a55735"),
    href: "/accelerators/arqloyalty",
  },
  {
    id: "arqbanker",
    title: "ArqBanker",
    tag: "Banking Operations",
    imageUrl: unsplash("photo-1582139329536-e7284fece509"),
    href: "/accelerators/arqbanker",
  },
  {
    id: "arqvantage",
    title: "ArqVantage",
    tag: "Pricing Intelligence",
    imageUrl: unsplash("photo-1460925895917-afdab827c52f"),
    href: "/accelerators/arqvantage",
  },
  {
    id: "arqforecast",
    title: "ArqForecast",
    tag: "Forecasting",
    imageUrl: unsplash("photo-1554224155-1696413565d3"),
    href: "/accelerators/arqforecast",
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
        relative block h-[340px] md:h-[460px] rounded-2xl overflow-hidden cursor-pointer
        outline-none transition-all duration-700 ease-in-out
        ${isActive ? "w-[220px] md:w-[340px]" : "w-[48px] md:w-[60px]"}
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
            ? "bg-gradient-to-t from-black/70 via-black/20 to-black/10"
            : "bg-black/45"
        }`}
      />

      {/* Caption */}
      <span
        className={`
          absolute text-white whitespace-nowrap font-display font-semibold
          transition-all duration-300 ease-in-out
          ${
            isActive
              ? "bottom-5 left-5 rotate-0 text-lg md:text-xl"
              : "bottom-20 left-1/2 -translate-x-1/2 rotate-90 text-sm md:text-base"
          }
        `}
      >
        {item.title}
        {isActive && (
          <span className="block text-xs md:text-sm font-sans font-medium text-white/75 mt-0.5">
            {item.tag}
          </span>
        )}
      </span>

      {/* Lime tick on the active panel */}
      <span
        className={`absolute top-4 right-4 h-2.5 w-2.5 rounded-full bg-[#d0f438] shadow-[0_0_0_4px_rgba(208,244,56,0.3)] transition-opacity duration-500 ${
          isActive ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden="true"
      />
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
    <div className="bg-white font-sans">
      <section className="container mx-auto px-4 pt-28 pb-12 md:pt-36 md:pb-24">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Left Side: Text Content */}
          <div className="w-full md:w-1/2 text-center md:text-left">
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-6">
              {["Forward-Deployed", "Accelerators", "Production AI"].map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-gray-900 shadow-sm"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#d0f438] shadow-[0_0_0_3px_rgba(208,244,56,0.35)]" />
                  {t}
                </span>
              ))}
            </div>

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
                className="inline-block bg-gray-900 text-white font-semibold px-8 py-3.5 rounded-full shadow-lg hover:bg-gray-800 hover:-translate-y-0.5 transition-all duration-300"
              >
                Book a Workflow Assessment
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
            <p className="text-center text-xs text-gray-400 mt-2">
              Flagship accelerators — part of a growing library.{" "}
              <a href="/accelerators" className="underline underline-offset-2 hover:text-gray-600">
                Explore all
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
