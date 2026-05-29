/* eslint-disable @next/next/no-img-element */
"use client";

/* Custom animated SVG graphics for the Services and Why ArqAI cards.
 * Flat dark bg, lime-with-glow accents, smooth motion. No gradient
 * overlays/backgrounds. Ported from the Claude Design handoff. */

import React from "react";

const VB = "0 0 320 180";
const STY: React.CSSProperties = { width: "100%", height: "100%", display: "block" };
const G_LIME = "#d0f438";
const G_INK = "rgba(245,239,230,0.85)";
const G_INK_DIM = "rgba(245,239,230,0.4)";
const G_INK_FAINT = "rgba(245,239,230,0.16)";
const G_BG = "#0a0a0d";

function Defs({ p }: { p: string }) {
  return (
    <defs>
      <filter id={`${p}-glow`} x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="2.4" result="b" />
        <feMerge>
          <feMergeNode in="b" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <filter id={`${p}-glowS`} x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="1.4" result="b" />
        <feMerge>
          <feMergeNode in="b" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  );
}

function Bg() {
  return <rect width="320" height="180" fill={G_BG} />;
}

type LabelProps = React.SVGTextElementAttributes<SVGTextElement> & {
  size?: number;
  lime?: boolean;
  dim?: boolean;
};

function Label({ size, lime, dim, children, ...rest }: LabelProps) {
  return (
    <text
      fontFamily="'Funnel Sans', sans-serif"
      fontSize={size ?? 9}
      fontWeight="600"
      fill={lime ? G_LIME : dim ? G_INK_DIM : G_INK}
      letterSpacing="1.5"
      style={{ textTransform: "uppercase" }}
      {...rest}
    >
      {children}
    </text>
  );
}

function NumLabel({ size, lime, children, ...rest }: LabelProps) {
  return (
    <text
      fontFamily="'Funnel Display', serif"
      fontSize={size ?? 32}
      fontWeight="300"
      fill={lime ? G_LIME : G_INK}
      letterSpacing="-0.02em"
      {...rest}
    >
      {children}
    </text>
  );
}

/* 1. Workflow Strategy — phase scale w/ moving indicator */
export function WorkflowMap() {
  const p = "wm";
  const phases = ["DISCOVER", "DEFINE", "BUILD", "DEPLOY", "OPERATE"];
  const xs = phases.map((_, i) => 50 + i * 55);
  const splines = "0.4 0 0.2 1;0.4 0 0.2 1;0.4 0 0.2 1;0.4 0 0.2 1;0 0 1 1;0 0 0 0";
  const keyTimes = "0;0.16;0.32;0.48;0.64;0.86;1";
  const cxValues = "50;105;160;215;270;270;50";
  return (
    <svg viewBox={VB} preserveAspectRatio="xMidYMid slice" style={STY}>
      <Defs p={p} />
      <Bg />
      <line x1="40" y1="100" x2="280" y2="100" stroke={G_INK_FAINT} strokeWidth="1" />
      <line
        x1="40"
        y1="100"
        x2="280"
        y2="100"
        stroke={G_LIME}
        strokeWidth="2"
        filter={`url(#${p}-glowS)`}
        strokeDasharray="240"
        strokeDashoffset="240"
      >
        <animate
          attributeName="stroke-dashoffset"
          values="240;0;0;240"
          keyTimes="0;0.6;0.85;1"
          dur="6s"
          repeatCount="indefinite"
        />
      </line>
      {xs.map((x, i) => (
        <g key={i}>
          <line x1={x} y1="92" x2={x} y2="108" stroke={G_INK} strokeWidth="1" />
          <Label x={x} y={78} textAnchor="middle" size={7.5}>
            {phases[i]}
          </Label>
        </g>
      ))}
      <g filter={`url(#${p}-glow)`}>
        <circle r="6" fill={G_BG} stroke={G_LIME} strokeWidth="2">
          <animate
            attributeName="cx"
            values={cxValues}
            keyTimes={keyTimes}
            dur="6s"
            repeatCount="indefinite"
            calcMode="spline"
            keySplines={splines}
          />
          <animate attributeName="cy" values="100" dur="6s" repeatCount="indefinite" />
        </circle>
        <circle r="2.5" fill={G_LIME}>
          <animate
            attributeName="cx"
            values={cxValues}
            keyTimes={keyTimes}
            dur="6s"
            repeatCount="indefinite"
            calcMode="spline"
            keySplines={splines}
          />
          <animate attributeName="cy" values="100" dur="6s" repeatCount="indefinite" />
        </circle>
      </g>
      <NumLabel x={40} y={156} size={14} lime>
        05
      </NumLabel>
      <Label x={64} y={155} size={8} dim>
        PHASES
      </Label>
    </svg>
  );
}

/* 2. Agentic AI Buildout — central core + orbiting agents */
export function AgentConstellation() {
  const p = "ac";
  const N = 6;
  const R = 52;
  return (
    <svg viewBox={VB} preserveAspectRatio="xMidYMid slice" style={STY}>
      <Defs p={p} />
      <Bg />
      <g transform="translate(160 92)">
        <circle r={R} fill="none" stroke={G_INK_FAINT} strokeWidth="1" />
        {Array.from({ length: N }, (_, i) => {
          const a = (i / N) * Math.PI * 2 - Math.PI / 2;
          const x = Math.cos(a) * R;
          const y = Math.sin(a) * R;
          return (
            <g key={i}>
              <line x1="0" y1="0" x2={x} y2={y} stroke={G_INK_FAINT} strokeWidth="1" />
              <circle cx={x} cy={y} r="6" fill={G_BG} stroke={G_INK} strokeWidth="1" />
              <circle cx={x} cy={y} r="3" fill={G_LIME} filter={`url(#${p}-glowS)`}>
                <animate
                  attributeName="opacity"
                  values="0;1;1;0"
                  keyTimes="0;0.1;0.5;0.6"
                  dur={`${N * 0.85}s`}
                  begin={`${i * 0.85}s`}
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          );
        })}
        <circle r="14" fill={G_LIME} filter={`url(#${p}-glow)`}>
          <animate
            attributeName="r"
            values="13;15;13"
            dur="2.6s"
            repeatCount="indefinite"
            calcMode="spline"
            keySplines="0.4 0 0.6 1;0.4 0 0.6 1"
          />
        </circle>
      </g>
      <NumLabel x={20} y={156} size={14} lime>
        0{N}
      </NumLabel>
      <Label x={44} y={155} size={8} dim>
        AGENTS · 1 CORE
      </Label>
    </svg>
  );
}

/* 3. Enterprise Integration — system bus */
export function IntegrationBus() {
  const p = "ib";
  const systems = ["CRM", "ERP", "ITSM", "DATA", "AUTH", "KB", "CLOUD", "API"];
  return (
    <svg viewBox={VB} preserveAspectRatio="xMidYMid slice" style={STY}>
      <Defs p={p} />
      <Bg />
      <line x1="40" y1="92" x2="280" y2="92" stroke={G_LIME} strokeWidth="2" filter={`url(#${p}-glowS)`} />
      {systems.map((s, i) => {
        const col = i % 4;
        const row = Math.floor(i / 4);
        const x = 50 + col * 60;
        const y = row === 0 ? 40 : 124;
        return (
          <g key={i}>
            <rect x={x} y={y} width="46" height="20" fill="none" stroke={G_INK_DIM} strokeWidth="1" />
            <Label x={x + 23} y={y + 13} textAnchor="middle" size={7.5}>
              {s}
            </Label>
            <line
              x1={x + 23}
              y1={row === 0 ? y + 20 : y}
              x2={x + 23}
              y2="92"
              stroke={G_INK_FAINT}
              strokeWidth="1"
            />
            <circle cx={x + 23} cy="92" r="2" fill={G_LIME} filter={`url(#${p}-glowS)`}>
              <animate
                attributeName="opacity"
                values="0.3;1;0.3"
                dur="3s"
                begin={`${i * 0.25}s`}
                repeatCount="indefinite"
              />
            </circle>
          </g>
        );
      })}
      {[0, 2].map((delay, i) => (
        <circle key={i} r="3" fill={G_LIME} cy="92" filter={`url(#${p}-glowS)`}>
          <animate
            attributeName="cx"
            values="40;280"
            dur="4s"
            begin={`${delay}s`}
            repeatCount="indefinite"
            calcMode="spline"
            keySplines="0.4 0 0.6 1"
          />
          <animate
            attributeName="opacity"
            values="0;1;1;0"
            keyTimes="0;0.1;0.9;1"
            dur="4s"
            begin={`${delay}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}
      <NumLabel x={20} y={156} size={14} lime>
        08
      </NumLabel>
      <Label x={44} y={155} size={8} dim>
        SYSTEMS
      </Label>
    </svg>
  );
}

/* 4. Governance — checkpoint stations */
export function Gates() {
  const p = "gt";
  const steps = ["POLICY", "APPROVE", "AUDIT", "EXEC"];
  return (
    <svg viewBox={VB} preserveAspectRatio="xMidYMid slice" style={STY}>
      <Defs p={p} />
      <Bg />
      <line x1="40" y1="100" x2="280" y2="100" stroke={G_INK_FAINT} strokeWidth="1" />
      {steps.map((s, i) => {
        const x = 56 + i * 70;
        return (
          <g key={i}>
            <circle cx={x} cy="100" r="14" fill={G_BG} stroke={G_INK_DIM} strokeWidth="1" />
            <circle
              cx={x}
              cy="100"
              r="14"
              fill="none"
              stroke={G_LIME}
              strokeWidth="2"
              filter={`url(#${p}-glowS)`}
              strokeDasharray="88"
              strokeDashoffset="88"
            >
              <animate
                attributeName="stroke-dashoffset"
                values="88;0;0;88"
                keyTimes="0;0.15;0.65;1"
                dur="5s"
                begin={`${i * 1}s`}
                repeatCount="indefinite"
              />
            </circle>
            <text
              x={x}
              y="104"
              fontFamily="'Funnel Display', serif"
              fontSize="13"
              fontWeight="300"
              fill={G_INK}
              textAnchor="middle"
              letterSpacing="-0.02em"
            >
              0{i + 1}
            </text>
            <Label x={x} y={76} textAnchor="middle" size={7.5}>
              {s}
            </Label>
            {i < steps.length - 1 && (
              <line x1={x + 14} y1="100" x2={x + 56} y2="100" stroke={G_INK_FAINT} strokeWidth="1" />
            )}
          </g>
        );
      })}
      <NumLabel x={20} y={156} size={14} lime>
        04
      </NumLabel>
      <Label x={44} y={155} size={8} dim>
        CHECKPOINTS
      </Label>
    </svg>
  );
}

/* 5. Vertical Acceleration — ascending bars */
export function StackLift() {
  const p = "sl";
  const verticals = ["CLAIMS", "FRAUD", "AML", "LOYAL", "OPS", "RISK"];
  const heights = [28, 42, 50, 64, 80, 96];
  return (
    <svg viewBox={VB} preserveAspectRatio="xMidYMid slice" style={STY}>
      <Defs p={p} />
      <Bg />
      <line x1="40" y1="142" x2="280" y2="142" stroke={G_INK} strokeWidth="1" />
      {heights.map((h, i) => {
        const x = 50 + i * 38;
        const isLast = i === heights.length - 1;
        return (
          <g key={i}>
            <rect
              x={x}
              y={142 - h}
              width="22"
              height={h}
              fill={isLast ? G_LIME : G_INK_FAINT}
              filter={isLast ? `url(#${p}-glowS)` : undefined}
            >
              <animate
                attributeName="height"
                values={`0;${h};${h}`}
                keyTimes="0;0.55;1"
                dur="4s"
                begin={`${i * 0.18}s`}
                repeatCount="indefinite"
                calcMode="spline"
                keySplines="0.4 0 0.2 1;0 0 1 1"
              />
              <animate
                attributeName="y"
                values={`142;${142 - h};${142 - h}`}
                keyTimes="0;0.55;1"
                dur="4s"
                begin={`${i * 0.18}s`}
                repeatCount="indefinite"
                calcMode="spline"
                keySplines="0.4 0 0.2 1;0 0 1 1"
              />
            </rect>
            <Label x={x + 11} y={158} textAnchor="middle" size={7}>
              {verticals[i]}
            </Label>
            <text
              x={x + 11}
              y={140 - h - 5}
              fontFamily="'Funnel Sans', sans-serif"
              fontSize="7"
              fontWeight="600"
              fill={G_INK_DIM}
              textAnchor="middle"
              letterSpacing="1"
            >
              0{i + 1}
            </text>
          </g>
        );
      })}
      <NumLabel x={266} y={58} size={22} lime>
        ↑
      </NumLabel>
    </svg>
  );
}

/* 6. Managed AI Operations — clean waveform */
export function PulseMonitor() {
  const p = "pm";
  const N = 80;
  const pts: [number, number][] = Array.from({ length: N }, (_, i) => {
    const x = 40 + (i / (N - 1)) * 240;
    const y = 110 + Math.sin(i * 0.32) * 14 + Math.sin(i * 0.11) * 6;
    return [x, y];
  });
  const path = `M ${pts.map((q) => q.join(" ")).join(" L ")}`;
  return (
    <svg viewBox={VB} preserveAspectRatio="xMidYMid slice" style={STY}>
      <Defs p={p} />
      <Bg />
      <line x1="40" y1="110" x2="280" y2="110" stroke={G_INK_FAINT} strokeWidth="1" strokeDasharray="2 4" />
      <path d={path} fill="none" stroke={G_LIME} strokeWidth="1.6" strokeLinecap="round" filter={`url(#${p}-glowS)`} />
      <circle r="3.5" fill={G_LIME} filter={`url(#${p}-glow)`}>
        <animateMotion dur="6s" repeatCount="indefinite" path={path} calcMode="spline" keySplines="0.4 0 0.6 1" />
      </circle>
      <Label x={40} y={44} size={7.5} dim>
        P95
      </Label>
      <NumLabel x={40} y={68} size={20}>
        240
      </NumLabel>
      <Label x={80} y={68} size={8} dim>
        MS
      </Label>
      <Label x={200} y={44} size={7.5} dim>
        ERR
      </Label>
      <NumLabel x={200} y={68} size={20} lime>
        0.3
      </NumLabel>
      <Label x={240} y={68} size={8} dim>
        %
      </Label>
      <Label x={280} y={158} textAnchor="end" size={7.5} dim>
        LIVE · 24/7
      </Label>
    </svg>
  );
}

/* 7. Built on your stack — ARQ band over systems */
export function StackTower() {
  const p = "st";
  const systems = ["CRM", "ERP", "DATA", "CLOUD", "KB"];
  return (
    <svg viewBox={VB} preserveAspectRatio="xMidYMid slice" style={STY}>
      <Defs p={p} />
      <Bg />
      <rect x="40" y="46" width="240" height="22" fill={G_LIME} filter={`url(#${p}-glow)`} />
      <text
        x="48"
        y="62"
        fontFamily="'Funnel Sans', sans-serif"
        fontSize="10"
        fontWeight="700"
        fill={G_BG}
        letterSpacing="2"
      >
        ARQ · ORCHESTRATION
      </text>
      {systems.map((s, i) => {
        const x = 48 + i * 48;
        return (
          <g key={i}>
            <line x1={x + 18} y1="68" x2={x + 18} y2="100" stroke={G_INK_FAINT} strokeWidth="1" />
            <rect x={x} y="100" width="36" height="32" fill="none" stroke={G_INK_DIM} strokeWidth="1" />
            <Label x={x + 18} y={120} textAnchor="middle" size={7.5}>
              {s}
            </Label>
            <circle cx={x + 18} cy="100" r="2" fill={G_LIME} filter={`url(#${p}-glowS)`}>
              <animate
                attributeName="opacity"
                values="0.3;1;0.3"
                dur="2.6s"
                begin={`${i * 0.32}s`}
                repeatCount="indefinite"
              />
            </circle>
          </g>
        );
      })}
      <Label x={40} y={156} size={8} dim>
        YOUR STACK · UNTOUCHED
      </Label>
    </svg>
  );
}

/* 8. Governed before it acts — funnel filter */
export function RiskFunnel() {
  const p = "rf";
  const stages = [
    { y: 50, w: 200, label: "POLICY" },
    { y: 80, w: 150, label: "APPROVAL" },
    { y: 110, w: 100, label: "RISK" },
  ];
  return (
    <svg viewBox={VB} preserveAspectRatio="xMidYMid slice" style={STY}>
      <Defs p={p} />
      <Bg />
      {stages.map((s, i) => (
        <g key={i}>
          <rect x={160 - s.w / 2} y={s.y} width={s.w} height="14" fill="none" stroke={G_INK_DIM} strokeWidth="1" />
          <Label x={160} y={s.y + 9} textAnchor="middle" size={7.5}>
            {s.label}
          </Label>
          <rect
            x={160 - s.w / 2}
            y={s.y}
            width="22"
            height="14"
            fill={G_LIME}
            opacity="0.8"
            filter={`url(#${p}-glowS)`}
          >
            <animate
              attributeName="x"
              values={`${160 - s.w / 2};${160 + s.w / 2 - 22};${160 - s.w / 2}`}
              dur="3.6s"
              begin={`${i * 0.4}s`}
              repeatCount="indefinite"
              calcMode="spline"
              keySplines="0.4 0 0.6 1; 0.4 0 0.6 1"
            />
          </rect>
        </g>
      ))}
      <line x1="160" y1="124" x2="160" y2="148" stroke={G_LIME} strokeWidth="2" filter={`url(#${p}-glowS)`} />
      <path d="M154 142 L 160 148 L 166 142" fill="none" stroke={G_LIME} strokeWidth="2" filter={`url(#${p}-glowS)`} />
      <Label x={180} y={148} size={8} lime>
        ACT
      </Label>
      <Label x={40} y={40} size={8} dim>
        REQUEST
      </Label>
    </svg>
  );
}

/* 9. Human oversight — branching diagram */
export function DecisionBranch() {
  const p = "db";
  return (
    <svg viewBox={VB} preserveAspectRatio="xMidYMid slice" style={STY}>
      <Defs p={p} />
      <Bg />
      <line x1="40" y1="92" x2="120" y2="92" stroke={G_INK} strokeWidth="1.5" />
      <Label x={40} y={80} size={7.5} dim>
        REQUEST
      </Label>
      <polygon points="120,72 144,92 120,112 96,92" fill="none" stroke={G_INK} strokeWidth="1.5" />
      <Label x={120} y={95} textAnchor="middle" size={7.5}>
        RISK
      </Label>
      <path d="M144 92 L 200 130 L 264 130" fill="none" stroke={G_INK_DIM} strokeWidth="1" />
      <rect x="220" y="118" width="56" height="24" fill="none" stroke={G_INK_DIM} strokeWidth="1" />
      <Label x={248} y={134} textAnchor="middle" size={8}>
        AUTO
      </Label>
      <path d="M144 92 L 200 54 L 264 54" fill="none" stroke={G_LIME} strokeWidth="2" filter={`url(#${p}-glowS)`} />
      <rect x="220" y="42" width="56" height="24" fill={G_LIME} filter={`url(#${p}-glow)`} />
      <text
        x="248"
        y="58"
        fontFamily="'Funnel Sans', sans-serif"
        fontSize="9"
        fontWeight="700"
        fill={G_BG}
        textAnchor="middle"
        letterSpacing="2"
      >
        HUMAN
      </text>
      <circle r="3" fill={G_LIME} filter={`url(#${p}-glowS)`}>
        <animate
          attributeName="cx"
          values="40;120;144;200;264;40"
          keyTimes="0;0.22;0.32;0.55;0.78;1"
          dur="4.5s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="cy"
          values="92;92;92;54;54;92"
          keyTimes="0;0.22;0.32;0.55;0.78;1"
          dur="4.5s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="1;1;1;1;0;0"
          keyTimes="0;0.22;0.32;0.55;0.78;1"
          dur="4.5s"
          repeatCount="indefinite"
        />
      </circle>
      <Label x={40} y={158} size={8} dim>
        ROUTE BY RISK
      </Label>
    </svg>
  );
}

/* 10. Audit-ready — scrolling log */
export function AuditLog() {
  const rows = [
    ["14:02", "APPROVE", "POLICY.KYC"],
    ["14:01", "EXEC", "CLAIM.ROUTE"],
    ["13:58", "FLAG", "ANOMALY.AMT"],
    ["13:42", "AUDIT", "DECISION.ID"],
    ["13:33", "APPROVE", "REVIEWER.H"],
    ["13:21", "EXEC", "ENRICH.DOC"],
    ["13:08", "APPROVE", "POLICY.KYC"],
    ["12:56", "FLAG", "ANOMALY.GEO"],
  ];
  const all = [...rows, ...rows];
  return (
    <svg viewBox={VB} preserveAspectRatio="xMidYMid slice" style={STY}>
      <Bg />
      <defs>
        <clipPath id="alclip2">
          <rect x="40" y="36" width="240" height="118" />
        </clipPath>
        <linearGradient id="alfade2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={G_BG} stopOpacity="1" />
          <stop offset="20%" stopColor={G_BG} stopOpacity="0" />
          <stop offset="80%" stopColor={G_BG} stopOpacity="0" />
          <stop offset="100%" stopColor={G_BG} stopOpacity="1" />
        </linearGradient>
      </defs>
      <line x1="78" y1="36" x2="78" y2="154" stroke={G_INK_FAINT} strokeWidth="1" />
      <line x1="148" y1="36" x2="148" y2="154" stroke={G_INK_FAINT} strokeWidth="1" />
      <g clipPath="url(#alclip2)">
        <g>
          {all.map((r, i) => (
            <g key={i} transform={`translate(0 ${50 + i * 16})`}>
              <text
                x="44"
                fontFamily="'Funnel Sans', sans-serif"
                fontSize="8.5"
                fontWeight="500"
                fill={G_INK_DIM}
                letterSpacing="1"
              >
                {r[0]}
              </text>
              <text
                x="84"
                fontFamily="'Funnel Sans', sans-serif"
                fontSize="8.5"
                fontWeight="600"
                fill={i % 4 === 2 ? G_LIME : G_INK}
                letterSpacing="1.5"
                style={{ textTransform: "uppercase" }}
              >
                {r[1]}
              </text>
              <text
                x="154"
                fontFamily="'Funnel Sans', sans-serif"
                fontSize="8.5"
                fontWeight="500"
                fill={G_INK}
                letterSpacing="1"
                style={{ textTransform: "uppercase" }}
              >
                {r[2]}
              </text>
            </g>
          ))}
          <animateTransform
            attributeName="transform"
            type="translate"
            values={`0 0; 0 -${rows.length * 16}`}
            dur="14s"
            repeatCount="indefinite"
          />
        </g>
      </g>
      <rect x="0" y="0" width="320" height="180" fill="url(#alfade2)" pointerEvents="none" />
      <Label x={44} y={32} size={7.5} dim>
        TIME
      </Label>
      <Label x={84} y={32} size={7.5} dim>
        EVENT
      </Label>
      <Label x={154} y={32} size={7.5} dim>
        REF
      </Label>
    </svg>
  );
}

/* 11. Improves after launch — line chart */
export function GrowthChart() {
  const p = "gc";
  const vals = [22, 28, 26, 38, 44, 50, 60, 72, 80, 92, 108, 120];
  const xs = vals.map((_, i) => 40 + i * 22);
  const ys = vals.map((v) => 144 - v);
  const path = xs.map((x, i) => `${i === 0 ? "M" : "L"} ${x} ${ys[i]}`).join(" ");
  return (
    <svg viewBox={VB} preserveAspectRatio="xMidYMid slice" style={STY}>
      <Defs p={p} />
      <Bg />
      <line x1="40" y1="144" x2="280" y2="144" stroke={G_INK_FAINT} strokeWidth="1" />
      <line x1="40" y1="40" x2="40" y2="144" stroke={G_INK_FAINT} strokeWidth="1" />
      {[40, 80, 120].map((y, i) => (
        <line
          key={i}
          x1="40"
          y1={y}
          x2="280"
          y2={y}
          stroke={G_INK_FAINT}
          strokeWidth="1"
          strokeDasharray="2 4"
          opacity="0.5"
        />
      ))}
      <path
        d={path}
        fill="none"
        stroke={G_LIME}
        strokeWidth="2"
        filter={`url(#${p}-glowS)`}
        strokeDasharray="500"
        strokeDashoffset="500"
      >
        <animate
          attributeName="stroke-dashoffset"
          values="500;0;0;500"
          keyTimes="0;0.5;0.85;1"
          dur="5s"
          repeatCount="indefinite"
          calcMode="spline"
          keySplines="0.4 0 0.2 1;0 0 1 1;0 0 1 1"
        />
      </path>
      {xs.map((x, i) => (
        <circle
          key={i}
          cx={x}
          cy={ys[i]}
          r={i === xs.length - 1 ? 3 : 2}
          fill={i === xs.length - 1 ? G_LIME : G_BG}
          stroke={G_LIME}
          strokeWidth={i === xs.length - 1 ? 0 : 1}
          filter={i === xs.length - 1 ? `url(#${p}-glow)` : undefined}
        >
          <animate
            attributeName="opacity"
            values="0;0;1"
            keyTimes={`0;${0.04 * (i + 1)};${0.04 * (i + 1) + 0.01}`}
            dur="5s"
            repeatCount="indefinite"
          />
        </circle>
      ))}
      <Label x={280} y={58} textAnchor="end" size={7.5} dim>
        DELTA
      </Label>
      <NumLabel x={280} y={36} textAnchor="end" size={22} lime>
        4.2×
      </NumLabel>
      <Label x={40} y={158} size={7.5} dim>
        WK 01
      </Label>
      <Label x={280} y={158} textAnchor="end" size={7.5} dim>
        WK 12
      </Label>
    </svg>
  );
}

/* 12. Enterprise depth — concentric rings + radial labels */
export function DepthRings() {
  const p = "dr";
  const disciplines = ["AI", "DATA", "CLOUD", "CYBER", "ERP", "OPS"];
  return (
    <svg viewBox={VB} preserveAspectRatio="xMidYMid slice" style={STY}>
      <Defs p={p} />
      <Bg />
      <g transform="translate(160 102)">
        {[74, 60, 46, 32].map((r, i) => (
          <circle key={i} r={r} fill="none" stroke={G_INK_DIM} strokeWidth="1" opacity={1 - i * 0.13} />
        ))}
        <circle r="18" fill={G_LIME} filter={`url(#${p}-glow)`}>
          <animate
            attributeName="r"
            values="18;22;18"
            dur="3.4s"
            repeatCount="indefinite"
            calcMode="spline"
            keySplines="0.4 0 0.6 1; 0.4 0 0.6 1"
          />
        </circle>
        {disciplines.map((d, i) => {
          const a = (i / disciplines.length) * Math.PI * 2 - Math.PI / 2;
          const tx = Math.cos(a) * 78;
          const ty = Math.sin(a) * 78;
          const lx = Math.cos(a) * 92;
          const ly = Math.sin(a) * 92;
          const anchor = Math.cos(a) > 0.3 ? "start" : Math.cos(a) < -0.3 ? "end" : "middle";
          return (
            <g key={i}>
              <line x1={tx} y1={ty} x2={lx * 0.94} y2={ly * 0.94} stroke={G_INK_FAINT} strokeWidth="1" />
              <text
                x={lx}
                y={ly + 3}
                fontFamily="'Funnel Sans', sans-serif"
                fontSize="8"
                fontWeight="600"
                fill={G_INK}
                letterSpacing="1.5"
                textAnchor={anchor}
                style={{ textTransform: "uppercase" }}
              >
                {d}
              </text>
            </g>
          );
        })}
      </g>
      <NumLabel x={20} y={36} size={14} lime>
        06
      </NumLabel>
      <Label x={44} y={34} size={8} dim>
        DISCIPLINES
      </Label>
    </svg>
  );
}
