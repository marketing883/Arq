"use client";

import Image from "next/image";

type SignalVariant = "flow" | "orbit" | "evidence" | "network";

type SignalGlyphProps = {
  variant?: SignalVariant;
  className?: string;
};

export function SignalGlyph({ variant = "flow", className = "" }: SignalGlyphProps) {
  return (
    <div className={`internal-glyph internal-glyph-${variant} ${className}`} aria-hidden="true">
      {variant === "orbit" ? <OrbitGlyph /> : null}
      {variant === "evidence" ? <EvidenceGlyph /> : null}
      {variant === "network" ? <NetworkGlyph /> : null}
      {variant === "flow" ? <FlowGlyph /> : null}
    </div>
  );
}

type HeroImagePanelProps = {
  image: string;
  alt: string;
  label: string;
  title: string;
  variant?: SignalVariant;
  priority?: boolean;
};

export function HeroImagePanel({ image, alt, label, title, variant = "flow", priority = false }: HeroImagePanelProps) {
  return (
    <figure className="internal-hero-panel">
      <div className="internal-hero-media">
        <Image
          src={image}
          alt={alt}
          fill
          priority={priority}
          sizes="(min-width: 1000px) 42vw, 100vw"
          style={{ objectFit: "cover" }}
        />
        <div className="internal-hero-media-shade" />
      </div>
      <div className="internal-hero-overlay">
        <div>
          <span className="a-tag">{label}</span>
          <figcaption>{title}</figcaption>
        </div>
        <SignalGlyph variant={variant} />
      </div>
    </figure>
  );
}

type SignalStripProps = {
  label: string;
  title: string;
  body: string;
  variant?: SignalVariant;
  points?: string[];
};

export function SignalStrip({ label, title, body, variant = "network", points = [] }: SignalStripProps) {
  return (
    <div className="internal-signal-strip">
      <div className="internal-signal-copy">
        <span className="a-eyebrow">{label}</span>
        <h2 className="h-section">{title}</h2>
        <p className="lede">{body}</p>
        {points.length > 0 ? (
          <ul className="internal-signal-points">
            {points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        ) : null}
      </div>
      <SignalGlyph variant={variant} />
    </div>
  );
}

function FlowGlyph() {
  return (
    <svg viewBox="0 0 360 260" role="presentation">
      <defs>
        <linearGradient id="flowLine" x1="0" x2="1">
          <stop offset="0" stopColor="rgba(208,244,56,0)" />
          <stop offset="0.45" stopColor="rgba(208,244,56,0.95)" />
          <stop offset="1" stopColor="rgba(125,211,252,0.65)" />
        </linearGradient>
      </defs>
      <path className="glyph-grid" d="M40 54H320M40 130H320M40 206H320M84 30V230M180 30V230M276 30V230" />
      <path className="glyph-flow" d="M48 196C92 82 139 74 185 136S267 188 318 62" />
      <path className="glyph-flow glyph-flow-ghost" d="M52 72C94 138 136 158 180 102S260 84 314 166" />
      {[48, 180, 318].map((x, index) => (
        <circle key={x} className="glyph-node" cx={x} cy={index === 0 ? 196 : index === 1 ? 136 : 62} r="8" />
      ))}
      <circle className="glyph-pulse" cx="180" cy="136" r="28" />
    </svg>
  );
}

function OrbitGlyph() {
  return (
    <svg viewBox="0 0 360 260" role="presentation">
      <circle className="glyph-orbit glyph-orbit-a" cx="180" cy="130" r="92" />
      <circle className="glyph-orbit glyph-orbit-b" cx="180" cy="130" r="58" />
      <ellipse className="glyph-orbit glyph-orbit-c" cx="180" cy="130" rx="126" ry="42" />
      <circle className="glyph-core" cx="180" cy="130" r="24" />
      <circle className="glyph-node" cx="272" cy="130" r="7" />
      <circle className="glyph-node" cx="118" cy="88" r="7" />
      <circle className="glyph-node" cx="206" cy="185" r="7" />
    </svg>
  );
}

function EvidenceGlyph() {
  return (
    <svg viewBox="0 0 360 260" role="presentation">
      {[0, 1, 2].map((index) => (
        <g key={index} className={`glyph-doc glyph-doc-${index + 1}`}>
          <rect x={84 + index * 28} y={48 + index * 24} width="164" height="116" rx="16" />
          <path d={`M${112 + index * 28} ${88 + index * 24}H${214 + index * 28}`} />
          <path d={`M${112 + index * 28} ${116 + index * 24}H${194 + index * 28}`} />
          <path d={`M${112 + index * 28} ${144 + index * 24}H${226 + index * 28}`} />
        </g>
      ))}
      <path className="glyph-scan" d="M80 96H284" />
      <circle className="glyph-node" cx="264" cy="190" r="10" />
      <path className="glyph-check" d="M258 190l5 5 11-14" />
    </svg>
  );
}

function NetworkGlyph() {
  const nodes = [
    [74, 82],
    [178, 54],
    [286, 90],
    [118, 184],
    [230, 184],
    [180, 132],
  ];

  return (
    <svg viewBox="0 0 360 260" role="presentation">
      <path className="glyph-link" d="M74 82L178 54L286 90L230 184L118 184L74 82M178 54L180 132L118 184M286 90L180 132L230 184" />
      {nodes.map(([x, y], index) => (
        <circle key={`${x}-${y}`} className={`glyph-node glyph-node-${index + 1}`} cx={x} cy={y} r={index === 5 ? 13 : 8} />
      ))}
      <circle className="glyph-pulse" cx="180" cy="132" r="34" />
    </svg>
  );
}
