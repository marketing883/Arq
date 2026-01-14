"use client";

import { motion } from "framer-motion";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glass?: boolean;
  onClick?: () => void;
}

export function Card({
  children,
  className = "",
  hover = true,
  glass = false,
  onClick,
}: CardProps) {
  const baseStyles = glass
    ? "glass-card p-6"
    : "bg-white rounded-xl border border-[var(--arq-gray-200)] p-6 shadow-sm";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={hover ? { y: -4, boxShadow: "var(--shadow-lg)" } : undefined}
      className={`${baseStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

export function FeatureCard({
  icon,
  title,
  description,
  className = "",
}: FeatureCardProps) {
  return (
    <Card className={className}>
      <div className="flex flex-col gap-4">
        <div className="w-12 h-12 rounded-lg bg-[var(--arq-blue)]/10 flex items-center justify-center text-[var(--arq-blue)]">
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-[var(--arq-black)]">{title}</h3>
        <p className="text-[var(--arq-gray-600)] leading-relaxed">{description}</p>
      </div>
    </Card>
  );
}

interface StatCardProps {
  value: string;
  label: string;
  className?: string;
}

export function StatCard({ value, label, className = "" }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className={`text-center ${className}`}
    >
      <div className="text-4xl md:text-5xl font-bold text-[var(--arq-blue)] mb-2">
        {value}
      </div>
      <div className="text-[var(--arq-gray-600)]">{label}</div>
    </motion.div>
  );
}

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  company?: string;
  className?: string;
}

export function TestimonialCard({
  quote,
  author,
  role,
  company,
  className = "",
}: TestimonialCardProps) {
  return (
    <Card glass className={`relative ${className}`}>
      {/* Quote mark */}
      <div className="absolute top-4 left-4 text-6xl text-[var(--arq-lime)] opacity-50 font-serif">
        &ldquo;
      </div>
      <div className="relative z-10 pt-8">
        <p className="text-lg text-[var(--arq-gray-700)] italic mb-6 leading-relaxed">
          {quote}
        </p>
        <div className="border-t border-[var(--arq-gray-200)] pt-4">
          <p className="font-semibold text-[var(--arq-black)]">{author}</p>
          <p className="text-sm text-[var(--arq-gray-500)]">
            {role}
            {company && `, ${company}`}
          </p>
        </div>
      </div>
    </Card>
  );
}
