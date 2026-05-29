"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

// Animated counter component
function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
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
    <div ref={ref} className="text-6xl md:text-7xl lg:text-8xl font-bold leading-none">
      {count}{suffix}
    </div>
  );
}

// Star icon for avatars
function StarIcon() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M58.9,28.9c0,0-9.1,0.1-12.1,0c-1.3,0-5.3-0.5-5.3-0.5c-1.7-0.2-3.4-0.7-4.8-1.7c-1.4-1-2.7-2.3-3.6-3.7c-0.8-1.3-1.3-2.7-1.5-4.2c0,0-0.4-3.3-0.5-4.4c-0.2-3.3,0-13.1,0-13.1c0-0.6-0.5-1.1-1.1-1.1s-1.1,0.5-1.1,1.1c0,0,0.2,9.8,0,13.1c0,1.1-0.5,4.4-0.5,4.4c-0.2,1.5-0.6,3-1.5,4.2c-0.9,1.5-2.2,2.7-3.6,3.7s-3,1.5-4.7,1.7c0,0-3.7,0.4-5,0.5c-3.1,0.2-12.5,0-12.5,0C0.5,28.9,0,29.4,0,30s0.5,1.1,1.1,1.1c0,0,9.4-0.2,12.5,0c1.2,0,5,0.5,5,0.5c1.7,0.2,3.3,0.7,4.7,1.7c1.3,0.9,2.4,2,3.3,3.3c1,1.4,1.5,3.1,1.7,4.8c0,0,0.4,3.9,0.5,5.2c0.1,3,0,12.2,0,12.2c0,0.6,0.5,1.1,1.1,1.1s1.1-0.5,1.1-1.1c0,0-0.1-9.2,0-12.2c0-1.3,0.5-5.2,0.5-5.2c0.2-1.7,0.7-3.4,1.7-4.8c0.9-1.3,2-2.4,3.3-3.3c1.4-1,3.1-1.5,4.8-1.7c0,0,3.9-0.4,5.3-0.5c3-0.1,12.1,0,12.1,0c0.6,0,1.1-0.5,1.1-1.1s-0.5-1.1-1.1-1.1l0,0L58.9,28.9z"
        fill="#c8ff00"
      />
    </svg>
  );
}

export function StatsSection() {
  return (
    <section className="py-16 md:py-24 bg-[var(--background)] dark:bg-[var(--arq-gray-900)]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-12 gap-4 md:gap-6">

          {/* Card 1 - 30+ Success Stories (Blue card) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="col-span-12 xl:col-span-5"
          >
            <div className="relative bg-[var(--arq-blue)] rounded-2xl p-6 md:p-8 h-full min-h-[320px] md:min-h-[380px] overflow-hidden flex flex-col justify-between">
              {/* 3D Star Image */}
              <div className="absolute left-4 md:left-6 bottom-4 md:bottom-6 w-32 h-32 md:w-48 md:h-48 lg:w-56 lg:h-56">
                <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
                  <defs>
                    <linearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#e8e8e8" />
                      <stop offset="30%" stopColor="#ffffff" />
                      <stop offset="50%" stopColor="#c0c0c0" />
                      <stop offset="70%" stopColor="#ffffff" />
                      <stop offset="100%" stopColor="#a8a8a8" />
                    </linearGradient>
                    <filter id="starShadow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="4" dy="8" stdDeviation="8" floodOpacity="0.3"/>
                    </filter>
                  </defs>
                  <path
                    d="M100,10 L115,75 L180,85 L125,125 L140,190 L100,150 L60,190 L75,125 L20,85 L85,75 Z"
                    fill="url(#starGrad)"
                    filter="url(#starShadow)"
                  />
                  <path
                    d="M100,25 L112,72 L165,80 L120,115 L132,170 L100,138 L68,170 L80,115 L35,80 L88,72 Z"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="1"
                    opacity="0.4"
                  />
                </svg>
              </div>

              {/* Content aligned to right */}
              <div className="ml-auto text-right max-w-[60%]">
                <div className="text-white">
                  <AnimatedCounter value={30} suffix="+" />
                </div>
                <p className="text-lg md:text-xl text-white/90 mt-2">
                  Success stories,<br/> and counting.
                </p>
              </div>

              {/* Button */}
              <div className="mt-auto flex justify-end">
                <Link
                  href="#intelligence"
                  className="inline-flex items-center gap-2 px-5 py-2.5 border border-white/30 text-white rounded-full hover:bg-white/10 transition-colors text-sm font-medium"
                >
                  <span>Launch Intelligence</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7V17" />
                  </svg>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Card 2 - 60% Shorter Build Cycles */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="col-span-12 xl:col-span-7"
          >
            <div className="relative bg-[#f5f0e8] dark:bg-[var(--arq-gray-800)] rounded-2xl p-6 md:p-8 h-full min-h-[320px] md:min-h-[380px] overflow-hidden flex flex-col justify-between">
              {/* 3D Wooden Shapes */}
              <div className="absolute left-1/2 -translate-x-1/2 top-4 md:top-6 w-48 h-48 md:w-64 md:h-64">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  <defs>
                    <linearGradient id="woodGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#8B4513" />
                      <stop offset="50%" stopColor="#D2691E" />
                      <stop offset="100%" stopColor="#A0522D" />
                    </linearGradient>
                    <linearGradient id="woodGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#DEB887" />
                      <stop offset="50%" stopColor="#F5DEB3" />
                      <stop offset="100%" stopColor="#D2B48C" />
                    </linearGradient>
                    <filter id="woodShadow">
                      <feDropShadow dx="2" dy="4" stdDeviation="4" floodOpacity="0.2"/>
                    </filter>
                  </defs>
                  {/* Top shape */}
                  <g transform="translate(60, 10)" filter="url(#woodShadow)">
                    <polygon points="40,0 80,20 80,60 40,80 0,60 0,20" fill="url(#woodGrad1)" />
                    <polygon points="40,0 80,20 40,40 0,20" fill="url(#woodGrad2)" />
                    <polygon points="80,20 80,60 40,80 40,40" fill="#6B3E26" />
                  </g>
                  {/* Bottom shape */}
                  <g transform="translate(40, 80)" filter="url(#woodShadow)">
                    <polygon points="60,0 120,30 120,90 60,120 0,90 0,30" fill="url(#woodGrad1)" />
                    <polygon points="60,0 120,30 60,60 0,30" fill="url(#woodGrad2)" />
                    <polygon points="120,30 120,90 60,120 60,60" fill="#6B3E26" />
                  </g>
                </svg>
              </div>

              {/* Avatars in top right */}
              <div className="absolute top-4 md:top-6 right-4 md:right-6 flex items-center">
                <div className="flex -space-x-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white flex items-center justify-center overflow-hidden">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[var(--arq-black)] border-2 border-white flex items-center justify-center">
                    <StarIcon />
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-white flex items-center justify-center overflow-hidden">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Content aligned to right bottom */}
              <div className="mt-auto ml-auto text-right">
                <div className="text-[var(--arq-black)] dark:text-white">
                  <AnimatedCounter value={60} suffix="%" />
                </div>
                <p className="text-lg md:text-xl text-[var(--arq-gray-600)] dark:text-[var(--arq-gray-400)] mt-2">
                  Shorter build cycles.<br/>Enterprise ready.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Card 3 - 20+ Years Experience */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="col-span-12 xl:col-span-7"
          >
            <div className="relative bg-[#f5f0e8] dark:bg-[var(--arq-gray-800)] rounded-2xl p-6 md:p-8 h-full min-h-[320px] md:min-h-[380px] overflow-hidden flex flex-col">
              {/* Content aligned to left top */}
              <div className="max-w-[60%]">
                <div className="text-[var(--arq-black)] dark:text-white">
                  <AnimatedCounter value={20} suffix="+" />
                </div>
                <p className="text-lg md:text-xl text-[var(--arq-gray-600)] dark:text-[var(--arq-gray-400)] mt-2">
                  Years of solving enterprise data, cloud, martech and security challenges.
                </p>
              </div>

              {/* Button */}
              <div className="mt-4">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 px-5 py-2.5 border border-[var(--arq-gray-300)] dark:border-[var(--arq-gray-600)] text-[var(--arq-black)] dark:text-white rounded-full hover:bg-[var(--arq-gray-100)] dark:hover:bg-[var(--arq-gray-700)] transition-colors text-sm font-medium"
                >
                  <span>Explore Our Experience</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>

              {/* 3D Silver Sphere with holes */}
              <div className="absolute right-4 md:right-8 bottom-4 md:bottom-8 w-40 h-40 md:w-56 md:h-56 animate-spin-slow">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  <defs>
                    <radialGradient id="sphereGrad" cx="30%" cy="30%" r="70%">
                      <stop offset="0%" stopColor="#ffffff" />
                      <stop offset="50%" stopColor="#d0d0d0" />
                      <stop offset="100%" stopColor="#808080" />
                    </radialGradient>
                    <filter id="sphereShadow">
                      <feDropShadow dx="4" dy="8" stdDeviation="6" floodOpacity="0.3"/>
                    </filter>
                  </defs>
                  <circle cx="100" cy="100" r="80" fill="url(#sphereGrad)" filter="url(#sphereShadow)" />
                  {/* Holes pattern */}
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                    <ellipse
                      key={i}
                      cx={100 + 50 * Math.cos((angle * Math.PI) / 180)}
                      cy={100 + 50 * Math.sin((angle * Math.PI) / 180)}
                      rx="18"
                      ry="14"
                      fill="#404040"
                      transform={`rotate(${angle}, ${100 + 50 * Math.cos((angle * Math.PI) / 180)}, ${100 + 50 * Math.sin((angle * Math.PI) / 180)})`}
                    />
                  ))}
                  {/* Center holes */}
                  <ellipse cx="100" cy="100" rx="20" ry="16" fill="#505050" />
                  <ellipse cx="100" cy="55" rx="14" ry="10" fill="#404040" />
                  <ellipse cx="100" cy="145" rx="14" ry="10" fill="#404040" />
                </svg>
              </div>
            </div>
          </motion.div>

          {/* Card 4 - 40% Cost Reduction */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="col-span-12 xl:col-span-5"
          >
            <div className="relative bg-[#f5f0e8] dark:bg-[var(--arq-gray-800)] rounded-2xl p-6 md:p-8 h-full min-h-[320px] md:min-h-[380px] overflow-hidden flex flex-col">
              {/* Content aligned to left top */}
              <div className="max-w-[70%]">
                <div className="text-[var(--arq-black)] dark:text-white">
                  <AnimatedCounter value={40} suffix="%" />
                </div>
                <p className="text-lg md:text-xl text-[var(--arq-gray-600)] dark:text-[var(--arq-gray-400)] mt-2">
                  Cost reduction delivered!
                </p>
              </div>

              {/* Button */}
              <div className="mt-4">
                <Link
                  href="#use-cases"
                  className="inline-flex items-center gap-2 px-5 py-2.5 border border-[var(--arq-gray-300)] dark:border-[var(--arq-gray-600)] text-[var(--arq-black)] dark:text-white rounded-full hover:bg-[var(--arq-gray-100)] dark:hover:bg-[var(--arq-gray-700)] transition-colors text-sm font-medium"
                >
                  <span>See Use Cases</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7V17" />
                  </svg>
                </Link>
              </div>

              {/* 3D Wireframe Sphere */}
              <div className="absolute right-2 md:right-4 bottom-2 md:bottom-4 w-40 h-40 md:w-52 md:h-52 animate-spin-reverse">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  <defs>
                    <filter id="wireShadow">
                      <feDropShadow dx="2" dy="4" stdDeviation="2" floodOpacity="0.1"/>
                    </filter>
                  </defs>
                  {/* Wireframe globe */}
                  <g stroke="#333" strokeWidth="1" fill="none" filter="url(#wireShadow)">
                    {/* Horizontal rings */}
                    <ellipse cx="100" cy="100" rx="70" ry="70" />
                    <ellipse cx="100" cy="100" rx="70" ry="20" />
                    <ellipse cx="100" cy="70" rx="55" ry="15" />
                    <ellipse cx="100" cy="130" rx="55" ry="15" />
                    <ellipse cx="100" cy="50" rx="35" ry="10" />
                    <ellipse cx="100" cy="150" rx="35" ry="10" />
                    {/* Vertical arcs */}
                    <path d="M100,30 Q130,100 100,170" />
                    <path d="M100,30 Q70,100 100,170" />
                    <path d="M100,30 Q160,100 100,170" />
                    <path d="M100,30 Q40,100 100,170" />
                  </g>
                  {/* Nodes */}
                  {[
                    [100, 30], [100, 170], [30, 100], [170, 100],
                    [55, 55], [145, 55], [55, 145], [145, 145],
                    [75, 70], [125, 70], [75, 130], [125, 130],
                    [100, 70], [100, 130], [70, 100], [130, 100]
                  ].map(([x, y], i) => (
                    <circle key={i} cx={x} cy={y} r="3" fill="#333" />
                  ))}
                  {/* Connecting lines to nodes */}
                  <g stroke="#333" strokeWidth="0.5" opacity="0.5">
                    <line x1="100" y1="30" x2="55" y2="55" />
                    <line x1="100" y1="30" x2="145" y2="55" />
                    <line x1="55" y1="55" x2="30" y2="100" />
                    <line x1="145" y1="55" x2="170" y2="100" />
                    <line x1="30" y1="100" x2="55" y2="145" />
                    <line x1="170" y1="100" x2="145" y2="145" />
                    <line x1="55" y1="145" x2="100" y2="170" />
                    <line x1="145" y1="145" x2="100" y2="170" />
                  </g>
                </svg>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

// Export the old interfaces for backward compatibility but the new component doesn't need them
export const homepageStats = [];
export const aboutStats = [];
