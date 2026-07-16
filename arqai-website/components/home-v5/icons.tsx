import type { SVGProps } from "react";

export function ArrowRight(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="v5-btn-arrow" {...props}>
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ArrowUpRight(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" width="16" height="16" {...props}>
      <path
        d="M5 11l6-6M6 5h5v5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Star(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor" {...props}>
      <path d="M10 1.5l2.47 5.18 5.7.62-4.24 3.85 1.16 5.6L10 13.9l-5.09 2.85 1.16-5.6L1.83 7.3l5.7-.62L10 1.5z" />
    </svg>
  );
}

export function ChatIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" {...props}>
      <path d="M4 5h16v11H8l-4 4V5z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}

export function DocIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" {...props}>
      <path d="M6 3h8l4 4v14H6V3z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M14 3v4h4M9 12h6M9 16h6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function InsightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" {...props}>
      <path d="M4 19h16M7 16V9M12 16V5M17 16v-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function ShieldIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" {...props}>
      <path d="M12 3l7 3v5c0 4.4-3 7.7-7 9-4-1.3-7-4.6-7-9V6l7-3z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SparkIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" {...props}>
      <path d="M12 3v6M12 15v6M3 12h6M15 12h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="12" r="2.4" fill="currentColor" />
    </svg>
  );
}

/* ---- Mega-menu icon set. 24px grid, 1.7 stroke, round caps ---- */

export function CompassIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" {...props}>
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M15.5 8.5l-1.8 5.2-5.2 1.8 1.8-5.2 5.2-1.8z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}

export function BotIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" {...props}>
      <rect x="4.5" y="8.5" width="15" height="11" rx="3" stroke="currentColor" strokeWidth="1.7" />
      <path d="M12 8.5V5.4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <circle cx="12" cy="4" r="1.3" fill="currentColor" />
      <circle cx="9.3" cy="13.5" r="1.2" fill="currentColor" />
      <circle cx="14.7" cy="13.5" r="1.2" fill="currentColor" />
    </svg>
  );
}

export function LinkIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" {...props}>
      <path
        d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LayersIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" {...props}>
      <path d="M12 3l9 4.7-9 4.7-9-4.7L12 3z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M3 12.4l9 4.7 9-4.7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 16.8l9 4.7 9-4.7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function GaugeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" {...props}>
      <path d="M4.5 18.5a8.5 8.5 0 1115 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M12 13.5l3.6-3.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <circle cx="12" cy="13.5" r="1.4" fill="currentColor" />
    </svg>
  );
}

export function FraudIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" {...props}>
      <circle cx="10.5" cy="10.5" r="6.8" stroke="currentColor" strokeWidth="1.7" />
      <path d="M15.6 15.6L21 21" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M10.5 7.2v3.7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <circle cx="10.5" cy="13.6" r="1.1" fill="currentColor" />
    </svg>
  );
}

export function ClaimsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" {...props}>
      <rect x="5" y="4" width="14" height="17" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <rect x="9" y="2.5" width="6" height="3.5" rx="1" stroke="currentColor" strokeWidth="1.7" />
      <path d="M9 14l2.2 2.2 4.3-4.4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function BankIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" {...props}>
      <path d="M3.5 9L12 4l8.5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.5 11.5v6M9.8 11.5v6M14.2 11.5v6M18.5 11.5v6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M3.5 20.5h17" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function TagIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" {...props}>
      <path
        d="M3.5 12.4V5.5a2 2 0 012-2h6.9a2 2 0 011.4.59l6.7 6.7a2 2 0 010 2.83l-6.88 6.88a2 2 0 01-2.83 0l-6.7-6.7a2 2 0 01-.59-1.4z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <circle cx="8.2" cy="8.2" r="1.2" fill="currentColor" />
    </svg>
  );
}

export function NetworkIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" {...props}>
      <circle cx="12" cy="5" r="2.3" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="5" cy="18.5" r="2.3" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="19" cy="18.5" r="2.3" stroke="currentColor" strokeWidth="1.7" />
      <path d="M10.9 7L6 16.5M13.1 7l4.9 9.5M7.3 18.5h9.4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function TruckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" {...props}>
      <path d="M2.5 6.5H14v10H2.5z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M14 10h3.6l3 3.2v3.3H14" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <circle cx="7" cy="18.6" r="1.9" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="17" cy="18.6" r="1.9" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

export function HeadsetIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" {...props}>
      <path d="M4 14.5V12a8 8 0 0116 0v2.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <rect x="2.8" y="13.5" width="4.4" height="6" rx="1.8" stroke="currentColor" strokeWidth="1.7" />
      <rect x="16.8" y="13.5" width="4.4" height="6" rx="1.8" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

export function LockIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" {...props}>
      <rect x="4.5" y="10.5" width="15" height="9.5" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8 10.5V7.5a4 4 0 018 0v3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <circle cx="12" cy="15.2" r="1.3" fill="currentColor" />
    </svg>
  );
}

export function HeartPulseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" {...props}>
      <path
        d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0016.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 002 8.5c0 2.29 1.51 4.04 3 5.5l7 7z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M3.5 11.5H9l1-1.8 2 4.2 1.5-2.4h6.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function UmbrellaIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" {...props}>
      <path d="M22 12a10.06 10.06 0 00-20 0z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M12 12v7a2 2 0 004 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M12 2v1" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function BagIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" {...props}>
      <path d="M5 8h14l-1.2 13H6.2L5 8z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M9 10.5V6a3 3 0 016 0v4.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function FactoryIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" {...props}>
      <path d="M4 20.5V8.5l5 3v-3l5 3v-3l5.5 3.3v8.7H4z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M7.5 17.5h1M11.5 17.5h1M15.5 17.5h1" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function PenIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" {...props}>
      <path d="M4 20l1.2-4.2L16.8 4.2a2.2 2.2 0 013.1 3.1L8.3 18.9 4 20z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M14.8 6.2l3 3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function FlagIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" {...props}>
      <path
        d="M4.5 15s1-1 4-1 5 2 8 2 3.5-1 3.5-1V3.5s-.5 1-3.5 1-5-2-8-2-4 1-4 1V15z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M4.5 21.5V15" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function RouteIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" {...props}>
      <circle cx="6" cy="19" r="2.5" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="18" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8.7 19h7.8a3.5 3.5 0 000-7h-9a3.5 3.5 0 010-7h7.8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function BriefcaseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" {...props}>
      <rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8.5 7V5.5a2 2 0 012-2h3a2 2 0 012 2V7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M3 12.5h18" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

export function UsersIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" {...props}>
      <circle cx="9" cy="7.5" r="3.4" stroke="currentColor" strokeWidth="1.7" />
      <path d="M2.5 20.5v-1.6a4.4 4.4 0 014.4-4.4h4.2a4.4 4.4 0 014.4 4.4v1.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M15.8 4.4a3.4 3.4 0 010 6.3M18.4 14.7a4.4 4.4 0 013.1 4.2v1.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function MailIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" {...props}>
      <rect x="2.5" y="4.5" width="19" height="15" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M3.5 7l8.5 6 8.5-6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function TrendIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" {...props}>
      <path d="M3.5 17.5l5-5 3.5 3.5 7.5-7.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14.5 8.5h5v5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function EyeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" {...props}>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

export function DatabaseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" {...props}>
      <ellipse cx="12" cy="5.5" rx="7.5" ry="3" stroke="currentColor" strokeWidth="1.7" />
      <path d="M4.5 5.5v13c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3v-13" stroke="currentColor" strokeWidth="1.7" />
      <path d="M4.5 12c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}
