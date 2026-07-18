"use client";

import Link from "next/link";

import React, { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  Bot,
  Compass,
  Layers,
  Link2,
  ShieldCheck,
} from "lucide-react";

const A = "/v5/assets";

// ---------------------------------------------------------------------------
// Content — sourced from the v2 homepage copy (Services section)
// ---------------------------------------------------------------------------

type Service = {
  num: string;
  title: string;
  body: string;
  href: string;
  icon: React.ReactNode;
  image: string;
};

const SERVICES: Service[] = [
  {
    num: "01",
    title: "Workflow Discovery and Assessment",
    body: "We map your operations and identify exactly where agents will move the needle before any build begins. You get a prioritized roadmap with expected impact, and the output is yours regardless of what you decide next.",
    href: "/services/workflow-strategy",
    icon: <Compass size={20} />,
    image: `${A}/VjFhPmRUqOEECNBJzS5qTNQ2M.jpeg`,
  },
  {
    num: "02",
    title: "Accelerator Deployment",
    body: "Industry-specific patterns, validated across deployments and configured to your data, policies, and reviewers. Faster to production, lower cost per engagement, less risk than a custom build from scratch.",
    href: "/services/vertical-acceleration",
    icon: <Layers size={20} />,
    image: `${A}/H4rP4HWageK0Wzp8OfGGGbv8M0.jpeg`,
  },
  {
    num: "03",
    title: "Custom Agent Development",
    body: "When no accelerator fits, we build bespoke agents around your workflows, your data, and your compliance requirements. Nothing generic, nothing you have to bend your operation around.",
    href: "/services/agentic-ai-buildout",
    icon: <Bot size={20} />,
    image: `${A}/wqdffQW0WSkz5XQ7YchgqN2bDQ.jpeg`,
  },
  {
    num: "04",
    title: "Enterprise Systems Integration",
    body: "Agents wired directly into your existing stack, reading live context and writing back within the permissions your security team already trusts. No rip and replace. No operational disruption.",
    href: "/services/enterprise-integration",
    icon: <Link2 size={20} />,
    image: `${A}/SDagoZAQXE61AebEi54KUY4RZ6A.jpeg`,
  },
  {
    num: "05",
    title: "Governance and Audit Architecture",
    body: "Every agent action carries the trigger, the reasoning, the inputs, and the outcome in an encrypted, persistent audit trail. Built in from day one, because in regulated operations an agent you cannot audit is an agent you cannot run.",
    href: "/services/governance-by-design",
    icon: <ShieldCheck size={20} />,
    image: `${A}/DzGwMiEB7s9v8Ge70ZnDD22pw.jpeg`,
  },
];

// ---------------------------------------------------------------------------
// Scroll reveal helper
// ---------------------------------------------------------------------------

function useInView<T extends HTMLElement>(threshold = 0.25) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out will-change-transform ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Section
// ---------------------------------------------------------------------------

export default function ForwardDeployed() {
  const [active, setActive] = useState(0);
  const service = SERVICES[active];

  return (
    <section className="relative bg-white" id="forward-deployed">
      <div className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
        {/* --- Contrast statement --- */}
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr] md:items-end">
          <div className="font-display font-semibold tracking-tight">
            <Reveal>
              <p className="text-[clamp(22px,2.6vw,36px)] leading-tight text-gray-400">
                Platforms hand you tools.
              </p>
            </Reveal>
            <Reveal delay={120}>
              <p className="mt-1 text-[clamp(22px,2.6vw,36px)] leading-tight text-gray-400">
                Consultancies hand you decks.
              </p>
            </Reveal>
            <Reveal delay={260}>
              <h2 className="mt-4 text-[clamp(30px,3.6vw,52px)] leading-[1.06] text-gray-900">
                We embed engineers
                <br />
                in your operation.
              </h2>
            </Reveal>
          </div>
          <Reveal delay={340}>
            <p className="text-lg leading-relaxed text-gray-600">
              Forward-deployed means our engineers take responsibility for the
              full path: mapping the workflow, building the agents, wiring them
              into your systems, and running them in production with governance
              attached.
            </p>
          </Reveal>
        </div>

        {/* --- Interactive services showcase --- */}
        <div className="mt-16 grid gap-8 lg:mt-20 lg:grid-cols-[1fr_1.25fr]">
          {/* Left: service list */}
          <Reveal delay={80} className="flex flex-col">
            <div className="flex flex-col divide-y divide-gray-100 border-y border-gray-100">
              {SERVICES.map((s, i) => {
                const isActive = i === active;
                return (
                  <button
                    key={s.num}
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                    aria-pressed={isActive}
                    className={`group/item flex items-center gap-5 px-2 py-5 text-left transition-colors duration-300 md:px-4 ${
                      isActive ? "bg-gray-50/80" : "hover:bg-gray-50/50"
                    }`}
                  >
                    <span
                      className={`font-display text-sm font-semibold transition-colors duration-300 ${
                        isActive ? "text-gray-900" : "text-gray-300"
                      }`}
                    >
                      {s.num}
                    </span>
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg transition-all duration-300 ${
                        isActive
                          ? "bg-gray-900 text-[#d0f438]"
                          : "bg-gray-100 text-gray-500 group-hover/item:text-gray-900"
                      }`}
                    >
                      {s.icon}
                    </span>
                    <span
                      className={`font-display text-[16px] font-semibold leading-snug transition-colors duration-300 md:text-[18px] ${
                        isActive ? "text-gray-900" : "text-gray-500 group-hover/item:text-gray-800"
                      }`}
                    >
                      {s.title}
                    </span>
                    <span
                      className={`ml-auto h-2 w-2 shrink-0 rounded-full bg-[#d0f438] shadow-[0_0_0_4px_rgba(208,244,56,0.3)] transition-all duration-300 ${
                        isActive ? "opacity-100 scale-100" : "opacity-0 scale-50"
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                );
              })}
            </div>

            <div className="mt-8">
              <Link
                href="/services"
                className="group inline-flex items-center gap-1.5 text-[15.5px] font-semibold text-gray-900 transition-colors hover:text-gray-600"
              >
                See All Services
                <ArrowUpRight
                  size={17}
                  className="text-[#9bbf2e] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </div>
          </Reveal>

          {/* Right: detail panel */}
          <Reveal delay={160}>
            <Link
              key={service.num}
              href={service.href}
              className="group/panel relative flex h-full min-h-[420px] flex-col justify-end overflow-hidden rounded-2xl bg-[#0d1226]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={service.image}
                alt=""
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover opacity-70 transition-transform duration-700 group-hover/panel:scale-105 animate-fade-in"
              />
              <span
                className="absolute inset-0 bg-gradient-to-t from-[#0d1226]/95 via-[#0d1226]/45 to-[#0d1226]/10"
                aria-hidden="true"
              />
              {/* Giant number watermark */}
              <span
                className="pointer-events-none absolute right-6 top-2 font-display text-[120px] font-bold leading-none text-white/10 md:text-[160px] animate-fade-in"
                aria-hidden="true"
              >
                {service.num}
              </span>

              <span className="relative z-10 p-7 md:p-9">
                <span className="block animate-fade-in-up opacity-0" style={{ animationDelay: "60ms" }}>
                  <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#d0f438]">
                    Forward-deployed service
                  </span>
                  <span className="mt-2 block font-display text-2xl font-semibold text-white md:text-3xl">
                    {service.title}
                  </span>
                </span>
                <span
                  className="mt-3 block max-w-xl animate-fade-in-up text-[15px] leading-relaxed text-white/80 opacity-0"
                  style={{ animationDelay: "140ms" }}
                >
                  {service.body}
                </span>
                <span
                  className="mt-5 inline-flex animate-fade-in-up items-center gap-1.5 text-sm font-semibold text-white opacity-0"
                  style={{ animationDelay: "220ms" }}
                >
                  Explore this service
                  <ArrowUpRight
                    size={15}
                    className="text-[#d0f438] transition-transform duration-300 group-hover/panel:translate-x-0.5 group-hover/panel:-translate-y-0.5"
                  />
                </span>
              </span>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
