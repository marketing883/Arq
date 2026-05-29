"use client";

import { motion } from "framer-motion";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  background?: "white" | "muted" | "gradient" | "dark";
  id?: string;
}

const bgStyles = {
  white: "bg-white",
  muted: "bg-[var(--arq-gray-50)]",
  gradient: "bg-gradient-to-b from-white to-[var(--arq-gray-50)]",
  dark: "bg-[var(--arq-gray-900)] text-white",
};

export function Section({
  children,
  className = "",
  background = "white",
  id,
}: SectionProps) {
  return (
    <section
      id={id}
      className={`py-16 md:py-24 relative overflow-hidden ${bgStyles[background]} ${className}`}
    >
      <div className="container relative z-10">{children}</div>
    </section>
  );
}

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  centered?: boolean;
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  centered = true,
  className = "",
}: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`max-w-3xl ${centered ? "mx-auto text-center" : ""} mb-12 md:mb-16 ${className}`}
    >
      {eyebrow && (
        <span className="inline-block text-sm font-semibold text-[var(--arq-blue)] uppercase tracking-wider mb-4">
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--arq-black)] mb-4">
        {title}
      </h2>
      {description && (
        <p className="text-lg text-[var(--arq-gray-600)] leading-relaxed">
          {description}
        </p>
      )}
    </motion.div>
  );
}

interface LogoAccentProps {
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  type?: "blue" | "lime";
  size?: "sm" | "md" | "lg";
}

const positionStyles = {
  "top-left": "-top-20 -left-20",
  "top-right": "-top-20 -right-20",
  "bottom-left": "-bottom-20 -left-20",
  "bottom-right": "-bottom-20 -right-20",
};

const sizeStyles = {
  sm: "w-40 h-40",
  md: "w-60 h-60",
  lg: "w-80 h-80",
};

export function LogoAccent({
  position,
  type = "lime",
  size = "md",
}: LogoAccentProps) {
  return (
    <div
      className={`absolute ${positionStyles[position]} ${sizeStyles[size]} ${
        type === "blue" ? "logo-accent-blue" : "logo-accent-lime"
      } pointer-events-none`}
      style={{
        transform: type === "blue" ? "rotate(-15deg)" : "none",
      }}
    />
  );
}
