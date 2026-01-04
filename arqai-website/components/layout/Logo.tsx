"use client";

import Link from "next/link";

interface LogoProps {
  className?: string;
  showTagline?: boolean;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className = "", showTagline = false, size = "md" }: LogoProps) {
  const sizes = {
    sm: { width: 100, height: 32 },
    md: { width: 140, height: 44 },
    lg: { width: 180, height: 56 },
  };

  const { width, height } = sizes[size];

  return (
    <Link href="/" className={`flex items-center gap-3 ${className}`}>
      <svg
        width={width}
        height={height}
        viewBox="0 0 200 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        {/* Logo Mark - Stylized A with arrow */}
        <path
          d="M8 52L28 8L38 28L48 8L58 52H48L42 32L32 52L22 32L16 52H8Z"
          fill="#0052CC"
        />
        <path
          d="M28 8L38 28L32 40L22 20L28 8Z"
          fill="#0052CC"
        />

        {/* Lime accent dot */}
        <circle cx="52" cy="18" r="6" fill="#CCFF00" />

        {/* ArqAI Text */}
        <text
          x="70"
          y="38"
          fontFamily="Funnel Display, system-ui, sans-serif"
          fontSize="28"
          fontWeight="700"
          fill="#1A1A1A"
        >
          Arq
        </text>
        <text
          x="118"
          y="38"
          fontFamily="Funnel Display, system-ui, sans-serif"
          fontSize="28"
          fontWeight="700"
          fill="#1A1A1A"
        >
          AI
        </text>

        {/* Tagline */}
        {showTagline && (
          <text
            x="70"
            y="54"
            fontFamily="Funnel Display, system-ui, sans-serif"
            fontSize="10"
            fontWeight="400"
            fill="#6B7280"
            letterSpacing="0.1em"
          >
            INTELLIGENCE, BY DESIGN
          </text>
        )}
      </svg>
    </Link>
  );
}

export function LogoIcon({ className = "", size = 40 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Logo Mark - Stylized A with arrow */}
      <path
        d="M8 52L28 8L38 28L48 8L58 52H48L42 32L32 52L22 32L16 52H8Z"
        fill="#0052CC"
      />
      <path
        d="M28 8L38 28L32 40L22 20L28 8Z"
        fill="#0052CC"
      />

      {/* Lime accent dot */}
      <circle cx="52" cy="18" r="6" fill="#CCFF00" />
    </svg>
  );
}
