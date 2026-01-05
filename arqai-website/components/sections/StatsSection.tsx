"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

interface StatItem {
  value: string;
  numericValue: number;
  suffix: string;
  label: string;
  description: string;
}

interface StatsSectionProps {
  stats: StatItem[];
  className?: string;
}

// Animated counter component
function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const duration = 2000;
          const steps = 60;
          const increment = value / steps;
          let current = 0;

          const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
              setCount(value);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);

          return () => clearInterval(timer);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [value, hasAnimated]);

  return (
    <div ref={ref} className="text-6xl md:text-7xl font-bold text-[var(--arq-blue)]">
      {count}{suffix}
    </div>
  );
}

// 3D rotating element
function Rotating3DElement({ color, size = 80, reverse = false }: { color: string; size?: number; reverse?: boolean }) {
  return (
    <div
      className={`${reverse ? 'animate-rotate-reverse' : 'animate-rotate-slow'}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <linearGradient id={`grad-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.8" />
            <stop offset="100%" stopColor={color} stopOpacity="0.3" />
          </linearGradient>
        </defs>
        <polygon
          points="50,5 95,30 95,70 50,95 5,70 5,30"
          fill={`url(#grad-${color})`}
          stroke={color}
          strokeWidth="2"
        />
        <polygon
          points="50,20 80,35 80,65 50,80 20,65 20,35"
          fill="none"
          stroke={color}
          strokeWidth="1"
          opacity="0.5"
        />
      </svg>
    </div>
  );
}

export function StatsSection({ stats, className = "" }: StatsSectionProps) {
  return (
    <section className={`py-20 bg-gradient-to-br from-[var(--arq-gray-50)] to-white dark:from-[var(--arq-gray-900)] dark:to-[var(--arq-gray-800)] relative overflow-hidden ${className}`}>
      {/* Background decorative elements */}
      <div className="absolute top-10 left-10 opacity-20">
        <Rotating3DElement color="var(--arq-blue)" size={120} />
      </div>
      <div className="absolute bottom-10 right-10 opacity-20">
        <Rotating3DElement color="var(--arq-lime)" size={100} reverse />
      </div>
      <div className="absolute top-1/2 left-1/4 opacity-10">
        <Rotating3DElement color="var(--arq-blue)" size={60} />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-[var(--arq-blue)]/10 text-[var(--arq-blue)] text-sm font-semibold mb-4">
            By The Numbers
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--arq-black)] dark:text-white">
            Proven Enterprise Impact
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="relative group"
            >
              <div className="bg-white dark:bg-[var(--arq-gray-800)] rounded-2xl p-8 shadow-lg border border-[var(--arq-gray-200)] dark:border-[var(--arq-gray-700)] hover:shadow-xl hover:border-[var(--arq-blue)] transition-all duration-300 h-full">
                {/* Decorative corner element */}
                <div className="absolute top-4 right-4 w-8 h-8 opacity-20 group-hover:opacity-40 transition-opacity">
                  <Rotating3DElement
                    color={index % 2 === 0 ? "var(--arq-blue)" : "var(--arq-lime)"}
                    size={32}
                    reverse={index % 2 === 1}
                  />
                </div>

                <div className="text-center">
                  <AnimatedCounter value={stat.numericValue} suffix={stat.suffix} />
                  <h3 className="text-lg font-semibold text-[var(--arq-black)] dark:text-white mt-4 mb-2">
                    {stat.label}
                  </h3>
                  <p className="text-sm text-[var(--arq-gray-600)] dark:text-[var(--arq-gray-400)]">
                    {stat.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Pre-configured stats for homepage
export const homepageStats: StatItem[] = [
  {
    value: "60%",
    numericValue: 60,
    suffix: "%",
    label: "Faster Compliance",
    description: "Reduce audit preparation time with automated evidence collection."
  },
  {
    value: "20+",
    numericValue: 20,
    suffix: "+",
    label: "Enterprise Deployments",
    description: "Production AI agents across regulated industries."
  },
  {
    value: "40%",
    numericValue: 40,
    suffix: "%",
    label: "Cost Reduction",
    description: "Average operational savings from AI automation."
  },
  {
    value: "100%",
    numericValue: 100,
    suffix: "%",
    label: "Audit Trail Coverage",
    description: "Every AI action logged with cryptographic proof."
  }
];

// Pre-configured stats for about page
export const aboutStats: StatItem[] = [
  {
    value: "2019",
    numericValue: 2019,
    suffix: "",
    label: "Founded",
    description: "Built by enterprise AI veterans."
  },
  {
    value: "3",
    numericValue: 3,
    suffix: "",
    label: "Patents Granted",
    description: "Industry-first governance innovations."
  },
  {
    value: "50+",
    numericValue: 50,
    suffix: "+",
    label: "Team Members",
    description: "AI, security, and compliance experts."
  },
  {
    value: "$25M",
    numericValue: 25,
    suffix: "M",
    label: "Funding Raised",
    description: "Backed by leading enterprise VCs."
  }
];
