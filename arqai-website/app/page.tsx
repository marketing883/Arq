"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HomeStructuredData } from "@/components/seo/StructuredData";
import {
  WorkflowMap,
  AgentConstellation,
  IntegrationBus,
  Gates,
  StackLift,
  PulseMonitor,
  StackTower,
  RiskFunnel,
  DecisionBranch,
  AuditLog,
  GrowthChart,
  DepthRings,
} from "@/components/home/SvcGraphics";

/* ============================================================
   ArqAI Labs homepage v4. Dark, agentic-OS positioning.
   Tokens + utility classes live in app/globals.css under .arq-dark.
   ============================================================ */

type IconProps = React.SVGProps<SVGSVGElement>;

const Icon = {
  Arrow: (p: IconProps) => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" {...p}>
      <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Cross: (p: IconProps) => (
    <svg viewBox="0 0 16 16" fill="none" width="16" height="16" {...p}>
      <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  ),
  Check: (p: IconProps) => (
    <svg viewBox="0 0 16 16" fill="none" width="16" height="16" {...p}>
      <path d="M3 8.5l3.5 3.5L13 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Workflow: (p: IconProps) => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" {...p}>
      <rect x="2" y="2" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <rect x="12" y="2" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <rect x="7" y="12" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <path d="M5 8v2h5v2M15 8v2H10" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  ),
  Agent: (p: IconProps) => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" {...p}>
      <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2 2" />
      <circle cx="3" cy="10" r="1.4" fill="currentColor" />
      <circle cx="17" cy="10" r="1.4" fill="currentColor" />
      <circle cx="10" cy="3" r="1.4" fill="currentColor" />
      <circle cx="10" cy="17" r="1.4" fill="currentColor" />
    </svg>
  ),
  Plug: (p: IconProps) => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" {...p}>
      <path d="M7 2v3M13 2v3M5 5h10v4a5 5 0 0 1-10 0V5zM10 14v4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  ),
  Shield: (p: IconProps) => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" {...p}>
      <path d="M10 2l7 3v5c0 4-3 7-7 8-4-1-7-4-7-8V5l7-3z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Stack: (p: IconProps) => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" {...p}>
      <path d="M10 2l7 4-7 4-7-4 7-4zM3 10l7 4 7-4M3 14l7 4 7-4" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  ),
  Pulse: (p: IconProps) => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" {...p}>
      <path d="M2 10h3l2-5 3 10 2-7 2 4 4-2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Map: (p: IconProps) => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" {...p}>
      <path d="M2 5l5-2 6 2 5-2v12l-5 2-6-2-5 2V5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M7 3v14M13 5v14" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  ),
  Cube: (p: IconProps) => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" {...p}>
      <path d="M10 2l7 4v8l-7 4-7-4V6l7-4zM3 6l7 4 7-4M10 10v8" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  ),
  Eye: (p: IconProps) => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" {...p}>
      <path d="M1 10s3-6 9-6 9 6 9 6-3 6-9 6-9-6-9-6z" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  ),
  Trail: (p: IconProps) => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" {...p}>
      <path d="M3 4h14M3 8h10M3 12h14M3 16h8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="16" cy="8" r="1.5" fill="currentColor" />
      <circle cx="13" cy="16" r="1.5" fill="currentColor" />
    </svg>
  ),
  Build: (p: IconProps) => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" {...p}>
      <path d="M10 2l7 4v8l-7 4-7-4V6l7-4z" stroke="currentColor" strokeWidth="1.2" />
      <path d="M10 6v8M6.5 8l7 4M13.5 8l-7 4" stroke="currentColor" strokeWidth="1" />
    </svg>
  ),
};

/* ---------- Nav ---------- */
function HomeNav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <nav className={"a-nav" + (scrolled ? " scrolled" : "")}>
      <Link href="/" className="a-logo">
        <Image
          src="/img/arq-ai-logo-white.svg"
          alt="ArqAI Labs"
          width={160}
          height={36}
          className="h-8 md:h-9 w-auto"
          priority
        />
      </Link>
      <div className="a-nav-links">
        <a href="#services">Services</a>
        <a href="#process">Process</a>
        <a href="#accelerators">Accelerators</a>
        <a href="#why">Why ArqAI</a>
        <a href="#insights">Insights</a>
        <Link href="/careers">Careers</Link>
      </div>
      <Link href="/engage-us" className="a-btn a-btn-ghost" style={{ padding: "10px 16px", fontSize: 13 }}>
        Engage us <Icon.Arrow className="arrow" />
      </Link>
    </nav>
  );
}

/* ---------- Hero orbital diagram ---------- */
function Orbital() {
  return (
    <div className="orbital" aria-hidden="true">
      <div className="orbital-ring" style={{ inset: "8%" }} />
      <div className="orbital-ring" style={{ inset: "20%" }} />
      <div className="orbital-ring" style={{ inset: "32%" }} />
      <div className="orbital-ring" style={{ inset: "0%", borderStyle: "solid", borderColor: "rgba(245,239,230,0.05)" }} />

      <svg viewBox="-100 -100 200 200" style={{ position: "absolute", inset: 0, animation: "arq-spin 60s linear infinite", overflow: "visible" }}>
        {[0, 60, 120, 180, 240, 300].map((a, i) => (
          <g key={i} transform={`rotate(${a})`}>
            <circle cx="0" cy="-92" r="2.6" fill="#F5EFE6" />
          </g>
        ))}
      </svg>
      <svg viewBox="-100 -100 200 200" style={{ position: "absolute", inset: "12%", animation: "arq-spin-rev 45s linear infinite", overflow: "visible" }}>
        {[30, 110, 200, 290].map((a, i) => (
          <g key={i} transform={`rotate(${a})`}>
            <rect x="-3" y="-83" width="6" height="6" fill="none" stroke="#7DD3FC" strokeWidth="1" />
          </g>
        ))}
      </svg>
      <svg viewBox="-100 -100 200 200" style={{ position: "absolute", inset: "24%", animation: "arq-spin 30s linear infinite", overflow: "visible" }}>
        {[0, 90, 180, 270].map((a, i) => (
          <g key={i} transform={`rotate(${a})`}>
            <circle cx="0" cy="-72" r="3" fill="#d0f438" />
            <circle cx="0" cy="-72" r="6" fill="none" stroke="rgba(208,244,56,0.4)" />
          </g>
        ))}
      </svg>

      <div style={{ position: "absolute", top: "2%", left: "50%", transform: "translateX(-50%)" }}>
        <span className="kicker">DATA · POLICY</span>
      </div>
      <div style={{ position: "absolute", bottom: "2%", left: "50%", transform: "translateX(-50%)" }}>
        <span className="kicker">AUDIT · APPROVAL</span>
      </div>
      <div style={{ position: "absolute", top: "50%", left: "-2%", transform: "translateY(-50%) rotate(-90deg)", transformOrigin: "center" }}>
        <span className="kicker">AGENTS</span>
      </div>
      <div style={{ position: "absolute", top: "50%", right: "-2%", transform: "translateY(-50%) rotate(90deg)", transformOrigin: "center" }}>
        <span className="kicker">SYSTEMS</span>
      </div>

      <div className="orbital-core" />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          fontFamily: "var(--mono)",
          fontSize: 10,
          letterSpacing: ".14em",
          color: "var(--ink)",
          textTransform: "uppercase",
          fontWeight: 600,
          zIndex: 2,
        }}
      >
        Workflow
      </div>
    </div>
  );
}

/* ---------- Hero ---------- */
function Hero() {
  return (
    <section className="a-hero" id="top">
      <div className="a-hero-grid" />
      <div className="a-wrap" style={{ position: "relative" }}>
        <div className="hero-row" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 56, alignItems: "center" }}>
          {/* Left column: pill + H1 + lede + CTAs */}
          <div>
            <div className="reveal in" style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
              <span className="a-pill"><span className="dot" /> An AI engineering studio</span>
            </div>

            <h1 className="h-display hero-h1 reveal in" data-d="1" style={{ maxWidth: "16ch" }}>
              We build <em>agentic</em>
              <br />
              operating systems
              <br />
              for <span className="accent">enterprise</span> workflows.
            </h1>

            <div className="reveal in" data-d="2" style={{ marginTop: 36 }}>
              <p className="lede" style={{ maxWidth: "52ch" }}>
                Production-grade AI agents and workflow systems for complex enterprise environments. From fraud detection
                and claims triage to AML, loyalty, network operations, and service workflows, we help enterprises turn
                AI from scattered pilots into{" "}
                <em style={{ fontFamily: "var(--serif)", fontStyle: "italic", color: "var(--ink-cream)" }}>governed business execution</em>.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 28 }}>
                <Link href="/engage-us" className="a-btn a-btn-primary">
                  Start with one workflow <Icon.Arrow className="arrow" />
                </Link>
                <a href="#process" className="a-btn a-btn-ghost">See how we build</a>
              </div>
              <div style={{ display: "flex", gap: 28, marginTop: 40, color: "var(--ink-muted)", fontSize: 12, fontFamily: "var(--mono)", letterSpacing: ".1em", textTransform: "uppercase" }}>
                <span>SOC 2 · HIPAA · GDPR aligned</span>
              </div>
            </div>
          </div>

          {/* Right column: orbital */}
          <div className="reveal in hero-orbital" data-d="3" style={{ display: "grid", placeItems: "center" }}>
            <Orbital />
          </div>
        </div>
      </div>
      <style>{`
        @media (min-width: 1000px) {
          .arq-dark .hero-row { grid-template-columns: 1.1fr 0.9fr !important; gap: 72px !important; }
        }
        .arq-dark .hero-h1 { font-size: clamp(40px, 5.4vw, 76px) !important; }
        .arq-dark .hero-orbital .orbital { max-width: 460px !important; }
        @media (min-width: 1280px) {
          .arq-dark .hero-orbital .orbital { max-width: 500px !important; }
        }
      `}</style>
    </section>
  );
}

/* ---------- Marquee ---------- */
function Marquee() {
  const items = [
    "Production-grade AI",
    "Bespoke to your operation",
    "Tuned, not templated",
    "Engineers, not consultants",
    "Governed before it acts",
    "Plus a growing line of accelerators",
  ];
  return (
    <div className="a-marquee" aria-hidden="true">
      {[0, 1].map((k) => (
        <div className="a-marquee-track" key={k}>
          {items.map((t, i) => (
            <span key={i}>{t}</span>
          ))}
        </div>
      ))}
    </div>
  );
}

/* ---------- Section 2: The Gap ---------- */
function GapSection() {
  const fails = [
    "Understand the workflow",
    "Connect to the right systems",
    "Handle messy data and exceptions",
    "Follow compliance and approval rules",
    "Act with the right level of human oversight",
    "Earn enough trust to become daily operations",
  ];
  return (
    <section className="a-section" id="gap">
      <div className="a-wrap">
        <div className="a-section-head reveal">
          <div>
            <span className="a-eyebrow">02 · The problem</span>
            <h2 className="h-section" style={{ marginTop: 18 }}>
              The gap between <em>AI demos</em>
              <br />
              and AI operations.
            </h2>
          </div>
          <p className="lede" style={{ justifySelf: "end" }}>
            Most enterprise AI pilots prove the model can work.
            <br />
            Very few prove it can{" "}
            <em style={{ fontFamily: "var(--serif)", fontStyle: "italic", color: "var(--ink-cream)" }}>actually run the work</em>.
          </p>
        </div>

        <div className="gap-split">
          <div className="gap-col fail reveal" data-d="1">
            <h4>Most pilots stop here</h4>
            <div className="big" style={{ marginTop: 8 }}>
              The model answers a question on staged data.
            </div>
            <ul style={{ marginTop: 18 }}>
              {fails.map((f, i) => (
                <li key={i}>
                  <span className="mark" style={{ color: "var(--ink-muted-2)" }}>
                    <Icon.Cross />
                  </span>
                  Cannot {f.toLowerCase()}
                </li>
              ))}
            </ul>
          </div>
          <div className="gap-col win reveal" data-d="2">
            <h4>Agentic workflows go further</h4>
            <div className="big" style={{ marginTop: 8 }}>
              Built around the way your business <em>actually runs</em>.
            </div>
            <ul style={{ marginTop: 18 }}>
              {fails.map((f, i) => (
                <li key={i}>
                  <span className="mark" style={{ color: "var(--ember)" }}>
                    <Icon.Check />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            <div style={{ marginTop: "auto", paddingTop: 24 }}>
              <Link href="/engage-us" className="a-btn a-btn-ghost" style={{ borderColor: "rgba(208,244,56,0.35)" }}>
                Start with one workflow <Icon.Arrow className="arrow" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Section 3: Services ---------- */
function ServicesSection() {
  const services = [
    {
      icon: <Icon.Map />,
      title: "Workflow Strategy",
      desc: "Identify the right use cases, business impact, users, data, risks, and success metrics before anything is built.",
      Art: WorkflowMap,
    },
    {
      icon: <Icon.Agent />,
      title: "Agentic AI Buildout",
      desc: "Design and deploy agents, copilots, automations, decision systems, and retrieval flows around your actual process.",
      Art: AgentConstellation,
    },
    {
      icon: <Icon.Plug />,
      title: "Enterprise Integration",
      desc: "Connect AI into your CRM, ERP, ITSM, data platforms, cloud stack, knowledge bases, and operating tools.",
      Art: IntegrationBus,
    },
    {
      icon: <Icon.Shield />,
      title: "Governance by Design",
      desc: "Build in permissions, approvals, policy checks, human review, audit trails, and exception handling from day one.",
      Art: Gates,
    },
    {
      icon: <Icon.Cube />,
      title: "Vertical Acceleration",
      desc: "Use proven product lines for repeatable workflows: claims, fraud, AML, loyalty, network ops, supply chain risk.",
      Art: StackLift,
    },
    {
      icon: <Icon.Pulse />,
      title: "Managed AI Operations",
      desc: "Monitor, improve, and expand AI workflows after launch so they keep performing in real business conditions.",
      Art: PulseMonitor,
    },
  ];
  return (
    <section className="a-section" id="services">
      <div className="a-wrap">
        <div className="a-section-head reveal">
          <div>
            <span className="a-eyebrow">03 · Services</span>
            <h2 className="h-section" style={{ marginTop: 18 }}>
              AI systems built around the
              <br />
              work that <em>matters</em>.
            </h2>
          </div>
          <p className="lede" style={{ justifySelf: "end" }}>
            ArqAI Labs designs, builds, and runs AI-enabled workflows for high-value enterprise processes, with the
            controls needed to move from pilot to production.
          </p>
        </div>

        <div className="svc-grid">
          {services.map((s, i) => {
            const Art = s.Art;
            return (
              <div className="svc reveal" data-d={(i % 3) + 1} key={s.title}>
                <div className="svc-media">
                  <Art />
                  <div className="svc-media-shade" />
                  <div className="svc-media-icon">{s.icon}</div>
                </div>
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="reveal" style={{ marginTop: 56, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 24 }}>
          <p style={{ color: "var(--ink-cream-d)", fontSize: 17, maxWidth: "60ch", margin: 0 }}>
            <em style={{ fontFamily: "var(--serif)", fontStyle: "italic", color: "var(--ink-cream)" }}>Services-led</em> where the problem is
            specific. <em style={{ fontFamily: "var(--serif)", fontStyle: "italic", color: "var(--ink-cream)" }}>Product-accelerated</em> where the pattern is
            proven.
          </p>
          <Link href="/engage-us" className="a-btn a-btn-primary">
            Start with one workflow <Icon.Arrow className="arrow" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ---------- Section 4: Process ---------- */
function ProcessSection() {
  const steps = [
    { num: "01", icon: <Icon.Map />, title: "Blueprint", desc: "Map the workflow, users, systems, risks, rules, and success metrics." },
    { num: "02", icon: <Icon.Build />, title: "Build", desc: "Design the agents, automations, integrations, retrieval flows, and human review loops." },
    { num: "03", icon: <Icon.Shield />, title: "Govern", desc: "Add policy checks, permissions, audit trails, exception handling, and approval paths before launch." },
    { num: "04", icon: <Icon.Pulse />, title: "Scale", desc: "Turn the first working workflow into a repeatable AI pattern across teams, functions, and verticals." },
  ];
  return (
    <section className="a-section" id="process">
      <div className="a-wrap">
        <div className="a-section-head reveal">
          <div>
            <span className="a-eyebrow">04 · Process</span>
            <h2 className="h-section" style={{ marginTop: 18 }}>
              From one workflow
              <br />
              to <em>production</em> AI.
            </h2>
          </div>
          <p className="lede" style={{ justifySelf: "end" }}>
            We start small enough to prove value fast, and build with enough structure to scale.
          </p>
        </div>

        <div className="steps reveal">
          {steps.map((s) => (
            <div className="step" key={s.num}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div className="icon" style={{ color: "var(--ember)" }}>{s.icon}</div>
                <span className="num">STEP {s.num}</span>
              </div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="reveal" style={{ marginTop: 48, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 24 }}>
          <p style={{ color: "var(--ink-cream-d)", fontSize: 17, maxWidth: "60ch", margin: 0 }}>
            The goal is not another AI pilot. It is{" "}
            <em style={{ fontFamily: "var(--serif)", fontStyle: "italic", color: "var(--ink-cream)" }}>one working system</em> your business can build on.
          </p>
          <Link href="/engage-us" className="a-btn a-btn-primary">
            Start with one workflow <Icon.Arrow className="arrow" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ---------- Section 5: Accelerators ---------- */
function AcceleratorsSection() {
  const products = [
    { name: "Veyra",  tag: "Payment integrity & fraud intelligence", desc: "Detect fraud, waste, abuse, billing anomalies, provider risk, and claims leakage across healthcare payer workflows.", built: "Healthcare payers · TPAs · PBMs" },
    { name: "Luma",   tag: "Claims triage & decision support",       desc: "Prioritize, route, enrich, and resolve claims faster with AI-assisted intake, documentation checks, and reviewer support.", built: "Healthcare · Insurance · Benefits" },
    { name: "Sentra", tag: "Financial crime & customer risk",         desc: "Automate AML, KYC, sanctions review, beneficial ownership checks, alert triage, and customer due diligence.",            built: "Banks · Fintechs · Financial institutions" },
    { name: "Nuvia",  tag: "Loyalty & personalization automation",    desc: "Turn customer, transaction, and behavioral data into personalized offers, retention actions, and next-best engagement.", built: "Retail · QSR · Consumer brands" },
    { name: "Kyra",   tag: "Network & service operations",            desc: "Accelerate incident detection, ticket enrichment, outage triage, escalation routing, and service restoration workflows.", built: "Telecom · Managed services · Operations" },
    { name: "Orbis",  tag: "Supply chain & vendor risk",              desc: "Monitor supplier risk, procurement exposure, contract signals, shipment exceptions, and operational dependencies.",      built: "Energy · Manufacturing · Logistics" },
    { name: "Astra",  tag: "Enterprise service workflow automation",  desc: "Classify, route, resolve, and govern service workflows across ITSM, internal operations, knowledge bases, and tools.", built: "Enterprise IT · Shared services · Ops" },
    { name: "Vantaq", tag: "Security operations & incident intel",    desc: "Triage alerts, summarize incidents, enrich threat context, recommend response actions, and generate compliance evidence.", built: "Cybersecurity · SecOps · Risk teams" },
  ];

  return (
    <section className="a-section" id="accelerators" style={{ position: "relative" }}>
      <div className="a-wrap">
        <div className="a-section-head reveal">
          <div>
            <span className="a-eyebrow">05 · Accelerators</span>
            <h2 className="h-section" style={{ marginTop: 18 }}>
              Vertical AI <em>Accelerators</em>.
            </h2>
            <p className="kicker" style={{ marginTop: 12 }}>Productized intelligence systems for repeatable enterprise workflows</p>
          </div>
          <p className="lede" style={{ justifySelf: "end" }}>
            Not off-the-shelf tools. Reusable AI product lines built from recurring enterprise patterns, then adapted
            to each client&apos;s data, systems, policies, and operating model.
          </p>
        </div>

        <div className="acc-grid reveal">
          {products.map((p, i) => (
            <div className="acc-card" key={p.name}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div className="name">
                  {p.name}
                  <sup>™</sup>
                </div>
                <span className="a-tag">0{i + 1}</span>
              </div>
              <div className="tagline">{p.tag}</div>
              <div className="desc">{p.desc}</div>
              <div className="built">
                Built for <b>{p.built}</b>
              </div>
            </div>
          ))}
        </div>

        <div className="reveal" style={{ marginTop: 48, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 24 }}>
          <p style={{ color: "var(--ink-cream-d)", fontSize: 17, maxWidth: "60ch", margin: 0 }}>
            Start with the accelerator closest to your workflow. Customize it around your enterprise reality.{" "}
            <em style={{ fontFamily: "var(--serif)", fontStyle: "italic", color: "var(--ink-cream)" }}>Scale from there.</em>
          </p>
          <Link href="/engage-us" className="a-btn a-btn-primary">
            Explore accelerators <Icon.Arrow className="arrow" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ---------- Section 6: Why ---------- */
function WhySection() {
  const proofs = [
    { icon: <Icon.Stack />, title: "Built on your stack", desc: "Works across cloud, on-prem, enterprise apps, data platforms, knowledge bases, and operating tools, without forcing rip-and-replace.", Art: StackTower },
    { icon: <Icon.Shield />, title: "Governed before it acts", desc: "Policies, permissions, approvals, and risk checks are built into the workflow before AI takes any action.", Art: RiskFunnel },
    { icon: <Icon.Eye />, title: "Human oversight where it matters", desc: "High-risk steps can be routed for review, escalation, sandboxing, or approval.", Art: DecisionBranch },
    { icon: <Icon.Trail />, title: "Audit-ready by default", desc: "Workflow decisions, policy checks, approvals, and execution trails captured for compliance and review.", Art: AuditLog },
    { icon: <Icon.Pulse />, title: "Improves after launch", desc: "AI workflows are monitored, tuned, and expanded as data, users, policies, and business conditions change.", Art: GrowthChart },
    { icon: <Icon.Cube />, title: "Enterprise delivery depth", desc: "Built by teams that have spent years delivering complex systems across data, cloud, AI, cybersecurity, ERP, and managed services.", Art: DepthRings },
  ];
  return (
    <section className="a-section" id="why">
      <div className="a-wrap">
        <div className="a-section-head reveal">
          <div>
            <span className="a-eyebrow">06 · Why ArqAI</span>
            <h2 className="h-section" style={{ marginTop: 18 }}>
              Built for the <em>realities</em>
              <br />
              of enterprise AI.
            </h2>
          </div>
          <p className="lede" style={{ justifySelf: "end" }}>
            ArqAI Labs combines enterprise delivery experience, governance-first engineering, and productized
            accelerators to help AI workflows move safely from prototype to production.
          </p>
        </div>

        <div className="svc-grid">
          {proofs.map((p, i) => {
            const Art = p.Art;
            return (
              <div className="svc reveal" data-d={(i % 3) + 1} key={p.title}>
                <div className="svc-media">
                  <Art />
                  <div className="svc-media-shade" />
                  <div className="svc-media-icon">{p.icon}</div>
                </div>
                <h4>{p.title}</h4>
                <p>{p.desc}</p>
              </div>
            );
          })}
        </div>

        <p className="reveal" style={{ marginTop: 56, color: "var(--ink-cream-d)", fontSize: 19, maxWidth: "64ch", textAlign: "center", marginInline: "auto", lineHeight: 1.45 }}>
          Because enterprise AI does not just need to be intelligent. It needs to be{" "}
          <em style={{ fontFamily: "var(--serif)", fontStyle: "italic", color: "var(--ink-cream)" }}>usable</em>,{" "}
          <em style={{ fontFamily: "var(--serif)", fontStyle: "italic", color: "var(--ink-cream)" }}>governed</em>, and{" "}
          <em style={{ fontFamily: "var(--serif)", fontStyle: "italic", color: "var(--ink-cream)" }}>trusted</em> in the flow of work.
        </p>
        <div className="reveal" style={{ display: "flex", justifyContent: "center", marginTop: 28 }}>
          <Link href="/engage-us" className="a-btn a-btn-primary">
            Start with one workflow <Icon.Arrow className="arrow" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ---------- Section 7: Insights (live blog feed) ---------- */
type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  category: string | null;
  published_at: string | null;
};

function readingTime(excerpt: string | null) {
  // Rough estimate based on excerpt length when full content isn't available.
  if (!excerpt) return "5 min";
  const words = excerpt.trim().split(/\s+/).length;
  const minutes = Math.max(4, Math.round((words * 6) / 240));
  return `${minutes} min`;
}

function formatDate(s: string | null) {
  if (!s) return "·";
  try {
    return new Date(s).toLocaleDateString("en-US", { month: "short", year: "numeric" });
  } catch {
    return "·";
  }
}

function InsightsSection() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetch("/api/blog/published")
      .then((r) => r.json())
      .then((data) => {
        if (!active) return;
        setPosts((data?.posts ?? []).slice(0, 3));
      })
      .catch(() => undefined)
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="a-section" id="insights">
      <div className="a-wrap">
        <div className="a-section-head reveal">
          <div>
            <span className="a-eyebrow">07 · Insights</span>
            <h2 className="h-section" style={{ marginTop: 18 }}>
              For leaders building AI that
              <br />
              <em>actually runs</em>.
            </h2>
          </div>
          <p className="lede" style={{ justifySelf: "end" }}>
            Practical thinking, field notes, and free resources for teams moving from AI pilots to governed enterprise
            workflows.
          </p>
        </div>

        <div className="insight-grid">
          <div className="reveal" data-d="1">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <span className="kicker">Latest insights</span>
              <Link href="/blog" style={{ color: "var(--ink-cream-d)", fontSize: 13, display: "inline-flex", alignItems: "center", gap: 8 }}>
                Read all <Icon.Arrow />
              </Link>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {loading && posts.length === 0 ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div className="insight-card" key={i} style={{ opacity: 0.4 }}>
                    <div className="meta">Loading…</div>
                    <h4 style={{ height: 22, background: "rgba(245,239,230,0.06)", borderRadius: 4 }} />
                  </div>
                ))
              ) : posts.length === 0 ? (
                <div className="insight-card">
                  <div className="meta">
                    <span style={{ color: "var(--ember)" }}>Coming soon</span>
                  </div>
                  <h4>The first insights are being prepared.</h4>
                  <p>Check back shortly, or subscribe to be notified when we publish.</p>
                  <Link href="/blog" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "var(--ink-cream)", fontSize: 13 }}>
                    Visit the blog <Icon.Arrow />
                  </Link>
                </div>
              ) : (
                posts.map((p) => (
                  <Link href={`/blog/${p.slug}`} className="insight-card" key={p.id}>
                    <div className="meta">
                      {p.category ? <span style={{ color: "var(--ember)" }}>{p.category}</span> : null}
                      {p.category ? <span style={{ color: "var(--ink-muted-2)" }}>·</span> : null}
                      <span>{formatDate(p.published_at)}</span>
                      <span style={{ color: "var(--ink-muted-2)" }}>·</span>
                      <span>{readingTime(p.excerpt)} read</span>
                    </div>
                    <h4>{p.title}</h4>
                    {p.excerpt ? <p>{p.excerpt}</p> : null}
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "var(--ink-cream)", fontSize: 13 }}>
                      Read <Icon.Arrow />
                    </span>
                  </Link>
                ))
              )}
            </div>
          </div>

          <div className="reveal" data-d="2">
            <div className="blueprint">
              <span className="a-pill"><span className="dot" /> Free download</span>
              <h3 style={{ fontSize: 28, fontWeight: 500, letterSpacing: "-0.02em", margin: "8px 0 0", lineHeight: 1.15, color: "var(--ink-cream)" }}>
                The AI Workflow{" "}
                <em style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>Blueprint</em>.
              </h3>
              <p style={{ color: "var(--ink-cream-d)", fontSize: 15, lineHeight: 1.55, margin: 0 }}>
                Find one enterprise workflow where AI can create measurable impact in 30 days. Identify the right
                process, success metrics, risks, systems, data, and governance before you build.
              </p>
              <div>
                <span className="kicker">You&apos;ll get clarity on</span>
                <ul style={{ listStyle: "none", padding: 0, marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
                  {[
                    "Which workflow is worth prioritizing",
                    "Where AI can reduce manual effort or decision lag",
                    "What data, systems, and approvals are involved",
                    "What controls are needed before deployment",
                    "What a practical first-phase build could look like",
                  ].map((t) => (
                    <li key={t} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 14, color: "var(--ink-cream-d)" }}>
                      <span style={{ color: "var(--ember)", flex: "0 0 auto", marginTop: 2 }}>
                        <Icon.Check />
                      </span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                <Link href="/engage-us" className="a-btn a-btn-primary">
                  Get the free blueprint <Icon.Arrow className="arrow" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Section 8: Final CTA ---------- */
function FinalCTA() {
  return (
    <section className="a-section" id="cta" style={{ paddingTop: "clamp(80px, 12vh, 140px)" }}>
      <div className="a-wrap">
        <div
          className="cta-strip cta-strip--photo reveal"
          style={{
            position: "relative",
            padding: 0,
            border: "1px solid var(--aline-2)",
            background: "transparent",
            overflow: "hidden",
          }}
        >
          {/* Background image */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: "url('/img/cta/latest-bg.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center right",
              filter: "brightness(0.78) saturate(1.05)",
            }}
          />
          {/* Dark + ember tint overlay */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(105deg, rgba(8,8,11,0.92) 0%, rgba(8,8,11,0.72) 38%, rgba(8,8,11,0.35) 65%, rgba(8,8,11,0.55) 100%), radial-gradient(60% 80% at 0% 0%, rgba(208,244,56,0.20), transparent 60%), radial-gradient(50% 60% at 100% 100%, rgba(125,211,252,0.10), transparent 60%)",
            }}
          />

          {/* Inner glass card */}
          <div
            className="cta-glass"
            style={{
              position: "relative",
              margin: "clamp(28px, 6vw, 64px)",
              padding: "clamp(40px, 6vw, 72px)",
              borderRadius: 24,
              border: "1px solid rgba(245,239,230,0.16)",
              background: "linear-gradient(135deg, rgba(245,239,230,0.10) 0%, rgba(245,239,230,0.04) 100%)",
              backdropFilter: "blur(22px) saturate(140%)",
              WebkitBackdropFilter: "blur(22px) saturate(140%)",
              boxShadow: "0 20px 60px -10px rgba(0,0,0,0.55), inset 0 1px 0 rgba(245,239,230,0.10)",
              maxWidth: 760,
            }}
          >
            <div className="kicker" style={{ color: "var(--ember)" }}>Engage us</div>
            <h2 className="h-section" style={{ marginTop: 16, maxWidth: "20ch" }}>
              Start with one workflow.
              <br />
              Prove value <em>fast</em>.
            </h2>
            <p className="lede" style={{ marginTop: 24, maxWidth: "60ch" }}>
              Bring us one high-value process where AI should be doing more than answering questions. We&apos;ll help map
              the workflow, define the controls, identify the integrations, and show what a production-ready agentic
              system could look like.
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 32, flexWrap: "wrap" }}>
              <Link href="/engage-us" className="a-btn a-btn-primary">
                Start with one workflow <Icon.Arrow className="arrow" />
              </Link>
              <Link href="/engage-us" className="a-btn a-btn-ghost">
                Book a 30-min discovery
              </Link>
            </div>
          </div>

          {/* Decorative ember bloom on top-right */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              right: "-80px",
              top: "-80px",
              width: 320,
              height: 320,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(208,244,56,0.18), transparent 60%)",
              filter: "blur(20px)",
              pointerEvents: "none",
            }}
          />
        </div>
      </div>
    </section>
  );
}

/* ---------- Footer ---------- */
function HomeFooter() {
  return (
    <footer className="a-footer">
      <div className="a-footer-grid">
        <div>
          <Link href="/" className="a-logo">
            <Image src="/img/arq-ai-logo-white.svg" alt="ArqAI Labs" width={140} height={32} className="h-7 w-auto" />
          </Link>
          <p style={{ color: "var(--ink-cream-d)", fontSize: 14, lineHeight: 1.55, marginTop: 16, maxWidth: 360 }}>
            Agentic operating systems for enterprise workflows. The AI products and services arm of{" "}
            <a href="https://aciinfotech.com" target="_blank" rel="noopener noreferrer" style={{ color: "var(--ink-cream)", borderBottom: "1px solid var(--aline-2)" }}>
              ACI Infotech
            </a>
            .
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            <span className="a-tag">SOC 2</span>
            <span className="a-tag">HIPAA</span>
            <span className="a-tag">GDPR</span>
          </div>
        </div>
        <div>
          <h5>Work</h5>
          <ul>
            <li><a href="#services">Services</a></li>
            <li><a href="#process">How we work</a></li>
            <li><a href="#accelerators">Accelerators</a></li>
            <li><a href="#why">Why ArqAI</a></li>
          </ul>
        </div>
        <div>
          <h5>Company</h5>
          <ul>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/careers">Careers</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/trust">Trust</Link></li>
          </ul>
        </div>
        <div>
          <h5>Resources</h5>
          <ul>
            <li><Link href="/blog">Blog</Link></li>
            <li><Link href="/case-studies">Case studies</Link></li>
            <li><Link href="/whitepapers">Whitepapers</Link></li>
            <li><Link href="/engage-us">Blueprint</Link></li>
          </ul>
        </div>
      </div>
      <div className="a-footer-bottom">
        <span>© {new Date().getFullYear()} ArqAI Labs. All rights reserved.</span>
        <span style={{ display: "flex", gap: 16 }}>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/responsible-ai">Responsible AI</Link>
        </span>
      </div>
    </footer>
  );
}

/* ---------- Reveal-on-scroll ---------- */
function useReveal() {
  const ran = useRef(false);
  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    const els = document.querySelectorAll(".arq-dark .reveal:not(.in)");
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

export default function HomePage() {
  useReveal();
  return (
    <>
      <HomeStructuredData />
      <div className="arq-dark min-h-screen">
        <HomeNav />
        <main>
          <Hero />
          <Marquee />
          <GapSection />
          <ServicesSection />
          <ProcessSection />
          <AcceleratorsSection />
          <WhySection />
          <InsightsSection />
          <FinalCTA />
        </main>
        <HomeFooter />
      </div>
    </>
  );
}
