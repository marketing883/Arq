/* eslint-disable @next/next/no-img-element */
"use client";

/* Custom animated SVG graphics for the Services and Why ArqAI cards.
 * Each graphic conveys the card's concept; designed to feel like the
 * hero orbital. Ported from the Claude Design handoff. */

import React from "react";

const VB = "0 0 320 180";
const STY: React.CSSProperties = { width: "100%", height: "100%", display: "block" };

function Bg({
  grid = true,
  vig = true,
  idSeed = "a",
}: {
  grid?: boolean;
  vig?: boolean;
  idSeed?: string;
}) {
  return (
    <>
      <defs>
        <pattern id={`grd_${idSeed}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0V20" fill="none" stroke="rgba(245,239,230,0.05)" strokeWidth="1" />
        </pattern>
        <radialGradient id={`vig_${idSeed}`} cx="60%" cy="0%" r="90%">
          <stop offset="0%" stopColor="rgba(208,244,56,0.20)" />
          <stop offset="70%" stopColor="rgba(208,244,56,0)" />
        </radialGradient>
      </defs>
      {grid && <rect width="320" height="180" fill={`url(#grd_${idSeed})`} />}
      {vig && <rect width="320" height="180" fill={`url(#vig_${idSeed})`} />}
    </>
  );
}

function Label({
  x,
  y,
  textAnchor,
  children,
}: {
  x: number;
  y: number;
  textAnchor?: "start" | "middle" | "end";
  children: React.ReactNode;
}) {
  return (
    <text
      x={x}
      y={y}
      fontFamily="ui-monospace, monospace"
      fontSize="8"
      fill="rgba(245,239,230,0.55)"
      letterSpacing="1.6"
      textAnchor={textAnchor}
    >
      {children}
    </text>
  );
}

/* 1. Workflow Strategy. animated map with waypoints */
export function WorkflowMap() {
  const points: [number, number][] = [
    [30, 140],
    [95, 75],
    [160, 95],
    [225, 72],
    [290, 50],
  ];
  return (
    <svg viewBox={VB} preserveAspectRatio="xMidYMid slice" style={STY}>
      <Bg idSeed="wm" />
      <path
        d="M30 140 Q 90 30 160 95 T 290 50"
        stroke="rgba(208,244,56,0.55)"
        strokeWidth="1.4"
        fill="none"
        strokeDasharray="4 4"
      >
        <animate attributeName="stroke-dashoffset" values="200;0" dur="6s" repeatCount="indefinite" />
      </path>
      {points.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="6" fill="none" stroke="rgba(208,244,56,0.5)">
            <animate attributeName="r" values="6;16;6" dur="2.4s" begin={`${i * 0.3}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="1;0;1" dur="2.4s" begin={`${i * 0.3}s`} repeatCount="indefinite" />
          </circle>
          <circle cx={x} cy={y} r="3" fill="#d0f438" />
        </g>
      ))}
      <Label x={20} y={24}>BLUEPRINT</Label>
      <Label x={300} y={24} textAnchor="end">DEPLOY</Label>
      <Label x={20} y={168}>5 WAYPOINTS · 1 OUTCOME</Label>
    </svg>
  );
}

/* 2. Agentic AI Buildout. agent constellation orbiting a core */
export function AgentConstellation() {
  return (
    <svg viewBox={VB} preserveAspectRatio="xMidYMid slice" style={STY}>
      <Bg idSeed="ac" grid={false} />
      <g transform="translate(160 90)">
        {[40, 60, 80].map((r, i) => (
          <circle
            key={i}
            cx="0"
            cy="0"
            r={r}
            fill="none"
            stroke="rgba(245,239,230,0.07)"
            strokeDasharray={i === 1 ? "2 4" : ""}
          />
        ))}
        {[
          [-90, -30],
          [80, -50],
          [100, 40],
          [-70, 55],
          [10, -78],
        ].map(([x, y], i) => (
          <g key={i}>
            <line x1="0" y1="0" x2={x} y2={y} stroke="rgba(208,244,56,0.35)" strokeWidth="0.8" strokeDasharray="2 3">
              <animate
                attributeName="stroke-dashoffset"
                values="0;-25"
                dur={`${3 + i * 0.5}s`}
                repeatCount="indefinite"
              />
            </line>
            <rect x={x - 7} y={y - 7} width="14" height="14" rx="2" fill="rgba(12,12,16,0.9)" stroke="rgba(208,244,56,0.6)" />
            <circle cx={x} cy={y} r="1.6" fill="#d0f438">
              <animate attributeName="opacity" values="1;0.2;1" dur="1.8s" begin={`${i * 0.3}s`} repeatCount="indefinite" />
            </circle>
          </g>
        ))}
        <polygon
          points="0,-18 16,-9 16,9 0,18 -16,9 -16,-9"
          fill="rgba(208,244,56,0.18)"
          stroke="#d0f438"
          strokeWidth="1.2"
        />
        <circle cx="0" cy="0" r="3" fill="#d0f438">
          <animate attributeName="r" values="2.5;5;2.5" dur="1.8s" repeatCount="indefinite" />
        </circle>
      </g>
      <Label x={20} y={24}>AGENTS · 5</Label>
      <Label x={300} y={24} textAnchor="end">CORE.WORKFLOW</Label>
    </svg>
  );
}

/* 3. Enterprise Integration. bus with system blocks plugging in */
export function IntegrationBus() {
  const blocks = [
    { x: 40, y: 30, label: "CRM" },
    { x: 110, y: 30, label: "ERP" },
    { x: 180, y: 30, label: "ITSM" },
    { x: 250, y: 30, label: "DATA" },
    { x: 75, y: 130, label: "AUTH" },
    { x: 145, y: 130, label: "KB" },
    { x: 215, y: 130, label: "CLOUD" },
  ];
  return (
    <svg viewBox={VB} preserveAspectRatio="xMidYMid slice" style={STY}>
      <Bg idSeed="ib" />
      <line x1="20" y1="90" x2="300" y2="90" stroke="rgba(208,244,56,0.5)" strokeWidth="1.2" />
      {[0, 1.4, 2.8].map((d, i) => (
        <circle key={i} r="2.5" fill="#d0f438" cy="90">
          <animate attributeName="cx" values="20;300" dur="4.2s" begin={`${d}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;1;1;0" dur="4.2s" begin={`${d}s`} repeatCount="indefinite" />
        </circle>
      ))}
      {blocks.map((b, i) => (
        <g key={i}>
          <line
            x1={b.x + 18}
            y1={b.y < 90 ? b.y + 22 : b.y - 2}
            x2={b.x + 18}
            y2="90"
            stroke="rgba(245,239,230,0.18)"
            strokeWidth="0.8"
            strokeDasharray="2 2"
          />
          <rect x={b.x} y={b.y} width="36" height="22" rx="2" fill="rgba(20,20,26,0.85)" stroke="rgba(245,239,230,0.18)" />
          <text
            x={b.x + 18}
            y={b.y + 15}
            fontFamily="ui-monospace, monospace"
            fontSize="8"
            fill="rgba(245,239,230,0.7)"
            textAnchor="middle"
            letterSpacing="1"
          >
            {b.label}
          </text>
          <circle cx={b.x + 18} cy="90" r="1.8" fill="#d0f438">
            <animate attributeName="opacity" values="0.2;1;0.2" dur="2s" begin={`${i * 0.25}s`} repeatCount="indefinite" />
          </circle>
        </g>
      ))}
      <Label x={20} y={168}>BUS · 7 SYSTEMS</Label>
    </svg>
  );
}

/* 4. Governance by Design. checkpoints stamping a request */
export function Gates() {
  const gates = [
    { x: 70, label: "POLICY" },
    { x: 138, label: "APPROVE" },
    { x: 206, label: "AUDIT" },
    { x: 274, label: "EXEC" },
  ];
  return (
    <svg viewBox={VB} preserveAspectRatio="xMidYMid slice" style={STY}>
      <Bg idSeed="gv" />
      <line x1="20" y1="100" x2="300" y2="100" stroke="rgba(245,239,230,0.18)" strokeWidth="1" strokeDasharray="2 4" />
      {gates.map((g, i) => (
        <g key={i}>
          <line x1={g.x} y1="60" x2={g.x} y2="140" stroke="rgba(208,244,56,0.45)" strokeWidth="1" />
          <g transform={`translate(${g.x} 78)`}>
            <circle r="9" fill="rgba(20,20,26,0.95)" stroke="rgba(208,244,56,0.45)" strokeWidth="1" />
            <circle r="9" fill="none" stroke="#d0f438" strokeWidth="1.4" strokeDasharray="56" strokeDashoffset="56">
              <animate
                attributeName="stroke-dashoffset"
                values="56;0;0;56"
                keyTimes="0;0.25;0.85;1"
                dur="5s"
                begin={`${i * 0.6}s`}
                repeatCount="indefinite"
              />
            </circle>
            <path
              d="M-4 0 L -1 3 L 4 -3"
              fill="none"
              stroke="#d0f438"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0"
            >
              <animate
                attributeName="opacity"
                values="0;0;1;1;0"
                keyTimes="0;0.2;0.3;0.85;1"
                dur="5s"
                begin={`${i * 0.6}s`}
                repeatCount="indefinite"
              />
            </path>
          </g>
          <text
            x={g.x}
            y="50"
            fontFamily="ui-monospace, monospace"
            fontSize="7.5"
            fill="rgba(245,239,230,0.7)"
            textAnchor="middle"
            letterSpacing="1.4"
          >
            {g.label}
          </text>
        </g>
      ))}
      <g>
        <rect width="16" height="16" rx="2" y="122" fill="rgba(208,244,56,0.18)" stroke="#d0f438" strokeWidth="1.2">
          <animate attributeName="x" values="4;284" dur="5s" repeatCount="indefinite" />
        </rect>
        <line y1="122" y2="100" stroke="#d0f438" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.7">
          <animate attributeName="x1" values="12;292" dur="5s" repeatCount="indefinite" />
          <animate attributeName="x2" values="12;292" dur="5s" repeatCount="indefinite" />
        </line>
      </g>
      <Label x={20} y={168}>4 CHECKPOINTS · BEFORE EXECUTION</Label>
    </svg>
  );
}

/* 5. Vertical Acceleration. compounding curve across verticals */
export function StackLift() {
  const labels = ["CLAIMS", "FRAUD", "AML", "LOYALTY", "OPS", "RISK"];
  const pts: [number, number][] = labels.map((_, i) => {
    const x = 36 + i * 46;
    const y = 150 - Math.pow(i, 1.55) * 8;
    return [x, y];
  });
  const pathD = `M ${pts.map((p) => p.join(" ")).join(" L ")}`;
  return (
    <svg viewBox={VB} preserveAspectRatio="xMidYMid slice" style={STY}>
      <Bg idSeed="sl" />
      <line x1="20" y1="150" x2="300" y2="150" stroke="rgba(245,239,230,0.15)" />
      <path d={pathD} fill="none" stroke="#d0f438" strokeWidth="1.6" strokeLinecap="round" strokeDasharray="400">
        <animate attributeName="stroke-dashoffset" values="400;0" dur="3s" repeatCount="indefinite" />
      </path>
      <path
        d={`M ${pts[0][0]} 150 L ${pts.map((p) => p.join(" ")).join(" L ")} L ${pts[pts.length - 1][0]} 150 Z`}
        fill="rgba(208,244,56,0.10)"
      />
      {pts.map(([x, y], i) => (
        <g key={i}>
          <line x1={x} y1="150" x2={x} y2={y} stroke="rgba(208,244,56,0.20)" strokeWidth="0.8" strokeDasharray="1 2" />
          <circle cx={x} cy={y} r="3" fill="#d0f438" />
          <circle cx={x} cy={y} r="3" fill="none" stroke="rgba(208,244,56,0.6)">
            <animate attributeName="r" values="3;10;3" dur="2.4s" begin={`${i * 0.25}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="1;0;1" dur="2.4s" begin={`${i * 0.25}s`} repeatCount="indefinite" />
          </circle>
          <text
            x={x}
            y="164"
            fontFamily="ui-monospace, monospace"
            fontSize="7.5"
            fill="rgba(245,239,230,0.55)"
            textAnchor="middle"
            letterSpacing="1"
          >
            {labels[i]}
          </text>
        </g>
      ))}
      <g transform="translate(286 30)" stroke="#d0f438" strokeWidth="1.4" fill="none">
        <path d="M-12 8 L 0 -2 M-2 -2 L 0 -2 L 0 0" />
      </g>
      <Label x={20} y={24}>ONE PATTERN · MANY VERTICALS</Label>
      <Label x={300} y={24} textAnchor="end">{"COMPOUND ↑"}</Label>
    </svg>
  );
}

/* 6. Managed AI Operations. running monitor with waveform + KPIs */
export function PulseMonitor() {
  const N = 90;
  const pts: [number, number][] = Array.from({ length: N }, (_, i) => {
    const t = i / (N - 1);
    const x = t * 280 + 20;
    const y = 100 + Math.sin(i * 0.32) * 10 + Math.sin(i * 0.11) * 8 + Math.sin(i * 0.06) * 5;
    return [x, y];
  });
  const path = `M ${pts.map((p) => p.join(" ")).join(" L ")}`;
  const fillPath = `${path} L 300 150 L 20 150 Z`;
  return (
    <svg viewBox={VB} preserveAspectRatio="xMidYMid slice" style={STY}>
      <Bg idSeed="pm" />
      <defs>
        <linearGradient id="pmFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(208,244,56,0.35)" />
          <stop offset="100%" stopColor="rgba(208,244,56,0)" />
        </linearGradient>
      </defs>
      {[60, 100, 140].map((y, i) => (
        <line key={i} x1="20" y1={y} x2="300" y2={y} stroke="rgba(245,239,230,0.07)" strokeDasharray="2 4" />
      ))}
      <path d={fillPath} fill="url(#pmFill)" opacity="0.6" />
      <g>
        <path
          d={path}
          fill="none"
          stroke="#d0f438"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ filter: "drop-shadow(0 0 4px rgba(208,244,56,0.55))" }}
        >
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0 0; -60 0; 0 0"
            dur="10s"
            repeatCount="indefinite"
          />
        </path>
      </g>
      <circle r="3" fill="#d0f438">
        <animateMotion dur="6s" repeatCount="indefinite" path={path} rotate="auto" />
        <animate attributeName="opacity" values="0;1;1;0" dur="6s" repeatCount="indefinite" />
      </circle>
      <g>
        <rect x="20" y="22" width="82" height="22" rx="3" fill="rgba(20,20,26,0.9)" stroke="rgba(245,239,230,0.18)" />
        <text x="30" y="36" fontFamily="ui-monospace, monospace" fontSize="9" fill="#d0f438" letterSpacing="1">
          P95
        </text>
        <text
          x="94"
          y="36"
          fontFamily="ui-monospace, monospace"
          fontSize="9"
          fill="rgba(245,239,230,0.9)"
          textAnchor="end"
          letterSpacing="0.5"
        >
          240ms
        </text>
        <rect x="218" y="22" width="82" height="22" rx="3" fill="rgba(20,20,26,0.9)" stroke="rgba(245,239,230,0.18)" />
        <text x="228" y="36" fontFamily="ui-monospace, monospace" fontSize="9" fill="#d0f438" letterSpacing="1">
          ERR
        </text>
        <text
          x="292"
          y="36"
          fontFamily="ui-monospace, monospace"
          fontSize="9"
          fill="rgba(245,239,230,0.9)"
          textAnchor="end"
          letterSpacing="0.5"
        >
          0.3%
        </text>
      </g>
      <g transform="translate(160 36)">
        <circle r="3" fill="#d0f438">
          <animate attributeName="opacity" values="1;0.2;1" dur="1.2s" repeatCount="indefinite" />
        </circle>
        <text x="8" y="3" fontFamily="ui-monospace, monospace" fontSize="9" fill="rgba(245,239,230,0.9)" letterSpacing="1.4">
          LIVE
        </text>
      </g>
      <Label x={20} y={168}>MONITOR · TUNE · IMPROVE</Label>
    </svg>
  );
}

/* 7. Built on your stack. agentic plane spanning systems */
export function StackTower() {
  const systems = [
    { x: 24, label: "CRM" },
    { x: 88, label: "ERP" },
    { x: 152, label: "DATA" },
    { x: 216, label: "CLOUD" },
    { x: 256, label: "KB" },
  ];
  return (
    <svg viewBox={VB} preserveAspectRatio="xMidYMid slice" style={STY}>
      <Bg idSeed="st" />
      <defs>
        <linearGradient id="aiBand" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(208,244,56,0)" />
          <stop offset="50%" stopColor="rgba(208,244,56,0.45)" />
          <stop offset="100%" stopColor="rgba(208,244,56,0)" />
        </linearGradient>
      </defs>
      <g>
        <rect x="16" y="40" width="288" height="22" rx="3" fill="rgba(208,244,56,0.10)" stroke="#d0f438" strokeWidth="1.2" />
        <rect x="16" y="40" width="288" height="22" rx="3" fill="url(#aiBand)">
          <animate attributeName="opacity" values="0.5;1;0.5" dur="3.4s" repeatCount="indefinite" />
        </rect>
        <text x="24" y="55" fontFamily="ui-monospace, monospace" fontSize="9" fill="#d0f438" letterSpacing="2">
          ARQ · AGENTIC PLANE
        </text>
        <circle cx="294" cy="51" r="2.5" fill="#d0f438">
          <animate attributeName="opacity" values="1;0.2;1" dur="1.2s" repeatCount="indefinite" />
        </circle>
      </g>
      {systems.map((s, i) => (
        <line
          key={"l" + i}
          x1={s.x + 24}
          y1="62"
          x2={s.x + 24}
          y2="112"
          stroke="rgba(208,244,56,0.35)"
          strokeWidth="0.8"
          strokeDasharray="2 3"
        >
          <animate attributeName="stroke-dashoffset" values="0;-20" dur={`${2.5 + i * 0.4}s`} repeatCount="indefinite" />
        </line>
      ))}
      {systems.map((s, i) => (
        <g key={"s" + i}>
          <rect x={s.x} y="112" width="48" height="30" rx="3" fill="rgba(20,20,26,0.85)" stroke="rgba(245,239,230,0.20)" />
          <g transform={`translate(${s.x + 8} 121)`} stroke="rgba(245,239,230,0.55)" fill="none" strokeWidth="1">
            {i === 0 && (
              <>
                <circle cx="4" cy="4" r="2.5" />
                <path d="M0 12 Q 4 8 8 12" />
              </>
            )}
            {i === 1 && (
              <>
                <rect x="0" y="0" width="8" height="12" />
                <path d="M0 4 H8 M0 8 H8" />
              </>
            )}
            {i === 2 && (
              <>
                <ellipse cx="4" cy="2" rx="4" ry="1.5" />
                <path d="M0 2 V10 Q 4 12 8 10 V2" />
              </>
            )}
            {i === 3 && <path d="M2 8 Q 0 4 4 4 Q 4 0 8 2 Q 12 4 8 8 Z" />}
            {i === 4 && (
              <>
                <rect x="0" y="1" width="8" height="10" />
                <path d="M2 3 H6 M2 6 H6 M2 9 H4" />
              </>
            )}
          </g>
          <text
            x={s.x + 24}
            y="137"
            fontFamily="ui-monospace, monospace"
            fontSize="8"
            fill="rgba(245,239,230,0.75)"
            textAnchor="middle"
            letterSpacing="1"
          >
            {s.label}
          </text>
          <circle cx={s.x + 24} cy="112" r="2" fill="#d0f438">
            <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" begin={`${i * 0.25}s`} repeatCount="indefinite" />
          </circle>
        </g>
      ))}
      <Label x={20} y={24}>ON YOUR STACK · UNTOUCHED</Label>
      <Label x={300} y={168} textAnchor="end">NO RIP-AND-REPLACE</Label>
    </svg>
  );
}

/* 8. Governed before it acts. risk funnel */
export function RiskFunnel() {
  return (
    <svg viewBox={VB} preserveAspectRatio="xMidYMid slice" style={STY}>
      <Bg idSeed="rf" />
      <path
        d="M40 40 L 280 40 L 200 110 L 200 150 L 120 150 L 120 110 Z"
        fill="rgba(208,244,56,0.05)"
        stroke="rgba(208,244,56,0.45)"
        strokeWidth="1"
      />
      {[60, 80, 100].map((y, i) => (
        <line
          key={i}
          x1={50 + i * 20}
          y1={y}
          x2={270 - i * 20}
          y2={y}
          stroke="rgba(245,239,230,0.15)"
          strokeDasharray="2 3"
        />
      ))}
      {[60, 110, 160, 210, 260].map((x, i) => (
        <rect key={i} x={x - 3} width="6" height="6" rx="1" fill="rgba(208,244,56,0.7)" y="20">
          <animate attributeName="y" values="20;38" dur="2s" begin={`${i * 0.18}s`} repeatCount="indefinite" />
          <animate
            attributeName="opacity"
            values="0;1;1;0"
            keyTimes="0;0.2;0.8;1"
            dur="2s"
            begin={`${i * 0.18}s`}
            repeatCount="indefinite"
          />
        </rect>
      ))}
      <Label x={50} y={64}>POLICY</Label>
      <Label x={70} y={84}>APPROVAL</Label>
      <Label x={90} y={104}>RISK</Label>
      <g>
        <rect x="156" y="118" width="8" height="8" rx="1" fill="#d0f438">
          <animate attributeName="y" values="118;160" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite" />
        </rect>
      </g>
      <Label x={160} y={168} textAnchor="middle">ACT</Label>
    </svg>
  );
}

/* 9. Human oversight. decision branching */
export function DecisionBranch() {
  return (
    <svg viewBox={VB} preserveAspectRatio="xMidYMid slice" style={STY}>
      <Bg idSeed="db" />
      <line x1="20" y1="90" x2="120" y2="90" stroke="rgba(208,244,56,0.5)" strokeWidth="1.2" />
      <circle r="3" fill="#d0f438" cy="90">
        <animate attributeName="cx" values="20;120" dur="2.4s" repeatCount="indefinite" />
      </circle>
      <polygon points="120,75 145,90 120,105 95,90" fill="rgba(20,20,26,0.9)" stroke="#d0f438" strokeWidth="1.2" />
      <text
        x="120"
        y="93"
        fontFamily="ui-monospace, monospace"
        fontSize="7"
        fill="rgba(245,239,230,0.7)"
        textAnchor="middle"
        letterSpacing="0.5"
      >
        RISK?
      </text>
      <path
        d="M145 90 L 200 130 L 290 130"
        fill="none"
        stroke="rgba(245,239,230,0.25)"
        strokeWidth="1"
        strokeDasharray="2 3"
      />
      <rect x="240" y="118" width="56" height="22" rx="2" fill="rgba(20,20,26,0.85)" stroke="rgba(245,239,230,0.25)" />
      <text
        x="268"
        y="132"
        fontFamily="ui-monospace, monospace"
        fontSize="8"
        fill="rgba(245,239,230,0.7)"
        textAnchor="middle"
        letterSpacing="1"
      >
        AUTO
      </text>
      <path d="M145 90 L 200 50 L 240 50" fill="none" stroke="#d0f438" strokeWidth="1.2" />
      <g transform="translate(264 50)">
        <rect x="-26" y="-12" width="52" height="24" rx="2" fill="rgba(208,244,56,0.15)" stroke="#d0f438" />
        <circle cx="-14" cy="-3" r="3" fill="#d0f438" />
        <path d="M-19 5 Q -14 0 -9 5" fill="none" stroke="#d0f438" strokeWidth="1.2" />
        <text x="6" y="3" fontFamily="ui-monospace, monospace" fontSize="8" fill="#d0f438" textAnchor="middle" letterSpacing="1">
          HUMAN
        </text>
      </g>
      <circle r="2.5" fill="#d0f438" cy="50">
        <animate attributeName="cx" values="145;238" dur="2s" begin="1s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0;1;0" dur="2s" begin="1s" repeatCount="indefinite" />
      </circle>
      <Label x={20} y={168}>ROUTE BY RISK · NOT BY DEFAULT</Label>
    </svg>
  );
}

/* 10. Audit-ready. scrolling log */
export function AuditLog() {
  const rows = [
    "14:02:11  approve  policy.kyc",
    "14:02:09  exec     claim.route",
    "14:01:58  flag     anomaly.amt",
    "14:01:42  audit    decision.id",
    "14:01:33  approve  reviewer.h",
    "14:01:21  exec     enrich.doc",
    "14:01:08  approve  policy.kyc",
    "14:00:56  flag     anomaly.geo",
    "14:00:41  audit    decision.id",
  ];
  return (
    <svg viewBox={VB} preserveAspectRatio="xMidYMid slice" style={STY}>
      <Bg idSeed="al" />
      <defs>
        <clipPath id="cliplog">
          <rect x="20" y="34" width="280" height="120" />
        </clipPath>
        <linearGradient id="logfade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(8,8,11,1)" />
          <stop offset="20%" stopColor="rgba(8,8,11,0)" />
          <stop offset="80%" stopColor="rgba(8,8,11,0)" />
          <stop offset="100%" stopColor="rgba(8,8,11,1)" />
        </linearGradient>
      </defs>
      <g clipPath="url(#cliplog)">
        <g>
          {rows.concat(rows).map((r, i) => (
            <g key={i} transform={`translate(28 ${50 + i * 16})`}>
              <circle cx="-2" cy="-3" r="2" fill={i % 4 === 2 ? "#d0f438" : "rgba(208,244,56,0.4)"} />
              <text
                fontFamily="ui-monospace, monospace"
                fontSize="9.5"
                fill={i % 4 === 2 ? "rgba(245,239,230,0.95)" : "rgba(245,239,230,0.6)"}
                letterSpacing="0.5"
                x="8"
              >
                {r}
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
      <rect x="0" y="0" width="320" height="180" fill="url(#logfade)" pointerEvents="none" />
      <Label x={20} y={24}>AUDIT TRAIL · IMMUTABLE</Label>
      <Label x={300} y={24} textAnchor="end">● LIVE</Label>
    </svg>
  );
}

/* 11. Improves after launch. growth chart */
export function GrowthChart() {
  const bars = [22, 30, 26, 38, 44, 42, 56, 62, 60, 78, 92, 110];
  return (
    <svg viewBox={VB} preserveAspectRatio="xMidYMid slice" style={STY}>
      <Bg idSeed="gc" />
      <line x1="20" y1="150" x2="300" y2="150" stroke="rgba(245,239,230,0.15)" />
      {bars.map((h, i) => {
        const x = 30 + i * 22;
        return (
          <g key={i}>
            <rect
              x={x}
              width="14"
              height={h}
              rx="1.5"
              fill={i >= bars.length - 3 ? "rgba(208,244,56,0.65)" : "rgba(245,239,230,0.18)"}
              y={150 - h}
            >
              <animate
                attributeName="height"
                values={`0;${h};${h}`}
                keyTimes="0;0.6;1"
                dur="3s"
                begin={`${i * 0.08}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="y"
                values={`150;${150 - h};${150 - h}`}
                keyTimes="0;0.6;1"
                dur="3s"
                begin={`${i * 0.08}s`}
                repeatCount="indefinite"
              />
            </rect>
          </g>
        );
      })}
      <polyline
        points={bars.map((h, i) => `${30 + i * 22 + 7},${150 - h}`).join(" ")}
        fill="none"
        stroke="#d0f438"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.85"
      />
      <g transform="translate(298 30)" stroke="#d0f438" strokeWidth="1.3" fill="none">
        <path d="M-10 6 L 0 -2 L -2 8 M0 -2 L -8 -4" />
      </g>
      <Label x={20} y={24}>{"WK 1 → WK 12"}</Label>
      <Label x={300} y={24} textAnchor="end">{"PERF · ↑ 4.2×"}</Label>
    </svg>
  );
}

/* 12. Enterprise delivery depth. geological strata */
export function DepthRings() {
  const strata = [
    { y: 44, label: "AI · AGENTS", weight: 1 },
    { y: 64, label: "DATA", weight: 0.85 },
    { y: 84, label: "CLOUD", weight: 0.7 },
    { y: 104, label: "CYBERSECURITY", weight: 0.55 },
    { y: 124, label: "ERP", weight: 0.4 },
    { y: 144, label: "MANAGED SVCS", weight: 0.3 },
  ];
  return (
    <svg viewBox={VB} preserveAspectRatio="xMidYMid slice" style={STY}>
      <Bg idSeed="dr" grid={false} />
      <defs>
        <linearGradient id="strataGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(208,244,56,0.35)" />
          <stop offset="100%" stopColor="rgba(208,244,56,0)" />
        </linearGradient>
      </defs>
      <rect x="110" y="30" width="100" height="130" fill="rgba(208,244,56,0.04)" stroke="rgba(208,244,56,0.18)" />
      {strata.map((s, i) => (
        <g key={i}>
          <line
            x1="20"
            y1={s.y}
            x2="300"
            y2={s.y}
            stroke={i === 0 ? "#d0f438" : `rgba(245,239,230,${0.12 + s.weight * 0.18})`}
            strokeWidth={i === 0 ? 1.4 : 1}
          />
          <rect
            x="110"
            y={s.y}
            width="100"
            height="18"
            fill={i === 0 ? "rgba(208,244,56,0.22)" : `rgba(208,244,56,${0.06 + s.weight * 0.05})`}
          />
          <line
            x1="110"
            y1={s.y + 9}
            x2="24"
            y2={s.y + 9}
            stroke={`rgba(245,239,230,${0.15 + s.weight * 0.15})`}
            strokeDasharray="2 3"
          />
          <line
            x1="210"
            y1={s.y + 9}
            x2="296"
            y2={s.y + 9}
            stroke={`rgba(245,239,230,${0.15 + s.weight * 0.15})`}
            strokeDasharray="2 3"
          />
          <text
            x="24"
            y={s.y + 12}
            fontFamily="ui-monospace, monospace"
            fontSize="8"
            fill={i === 0 ? "#d0f438" : `rgba(245,239,230,${0.45 + s.weight * 0.4})`}
            letterSpacing="1.4"
          >
            {s.label}
          </text>
          <text
            x="296"
            y={s.y + 12}
            fontFamily="ui-monospace, monospace"
            fontSize="8"
            fill="rgba(245,239,230,0.4)"
            textAnchor="end"
            letterSpacing="1"
          >
            {`Y${i + 1}+`}
          </text>
          {i === 0 && (
            <circle cx="160" cy={s.y + 9} r="3" fill="#d0f438">
              <animate attributeName="opacity" values="1;0.3;1" dur="1.6s" repeatCount="indefinite" />
            </circle>
          )}
        </g>
      ))}
      <line x1="160" y1="30" x2="160" y2="160" stroke="rgba(208,244,56,0.25)" strokeWidth="1" strokeDasharray="3 3">
        <animate attributeName="stroke-dashoffset" values="0;-30" dur="3s" repeatCount="indefinite" />
      </line>
      <Label x={20} y={24}>DEPTH · YEARS OF DELIVERY</Label>
      <Label x={300} y={24} textAnchor="end">6 DISCIPLINES</Label>
    </svg>
  );
}
