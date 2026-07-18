"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FAQS } from "./faqs";

// ---------------------------------------------------------------------------
// FAQ — copy from the v2 homepage doc. Hairline accordion, no boxes.
// ---------------------------------------------------------------------------


export default function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="relative bg-white" id="faq">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 md:px-10 md:py-24 lg:grid-cols-[1fr_1.7fr] lg:gap-16 lg:px-14">
        {/* Left: header */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.22em] text-gray-500">
            <span className="inline-flex h-2 w-2 rounded-full bg-[#d0f438] shadow-[0_0_0_4px_rgba(208,244,56,0.35)]" />
            FAQs
          </p>
          <h2 className="mt-4 font-display text-[clamp(26px,3vw,40px)] font-semibold leading-[1.12] tracking-tight text-gray-900">
            Answers to
            <br />
            common questions.
          </h2>
          <p className="mt-4 max-w-sm text-[14.5px] leading-relaxed text-gray-600">
            The short versions. For anything specific to your operation,{" "}
            <a
              href="/contact"
              className="font-semibold text-gray-900 underline decoration-[#9bbf2e] decoration-2 underline-offset-4 transition-colors hover:text-gray-600"
            >
              ask us directly
            </a>
            .
          </p>
        </div>

        {/* Right: hairline accordion */}
        <div className="divide-y divide-gray-100 border-y border-gray-100">
          {FAQS.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div key={faq.q}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-6 py-5 text-left"
                >
                  <span
                    className={`font-display text-[16.5px] font-semibold transition-colors duration-300 md:text-[18px] ${
                      isOpen ? "text-gray-900" : "text-gray-700 hover:text-gray-900"
                    }`}
                  >
                    {faq.q}
                  </span>
                  <ChevronDown
                    size={17}
                    className={`shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-[#9bbf2e]" : "text-gray-400"
                    }`}
                  />
                </button>
                <div
                  className={`grid transition-all duration-500 ease-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-2xl pb-5 text-[14.5px] leading-relaxed text-gray-600">{faq.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
