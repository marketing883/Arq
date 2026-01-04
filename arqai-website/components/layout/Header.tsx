"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const navigation = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const pathname = usePathname();

  // Handle dark mode toggle
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setIsDarkMode(isDark);
  }, []);

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
    setIsDarkMode(!isDarkMode);
  };

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-[100]">
        <div className="container mx-auto px-4 md:px-6 py-4 md:py-6 flex items-center justify-between">
          {/* Logo - Left Side */}
          <Link
            href="/"
            className="mxd-logo flex items-center gap-2 loading__fade"
          >
            {/* Light mode logo (dark logo for light bg) */}
            <Image
              src="/img/favicon/ArqAI-favicon.png"
              alt="ArqAI Logo"
              width={40}
              height={40}
              className="w-8 h-8 md:w-10 md:h-10 dark:hidden"
            />
            {/* Dark mode logo (light logo for dark bg) */}
            <Image
              src="/img/favicon/ArqAI-favicon.png"
              alt="ArqAI Logo"
              width={40}
              height={40}
              className="w-8 h-8 md:w-10 md:h-10 hidden dark:block brightness-0 invert"
            />
            <span className="mxd-logo__text font-display font-semibold text-xl md:text-2xl text-text-bright">
              ArqAI
            </span>
          </Link>

          {/* Controls - Right Side */}
          <div className="flex items-center gap-3 md:gap-4 loading__fade">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-base-tint flex items-center justify-center transition-colors hover:bg-base-shade"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <svg className="w-5 h-5 text-text-bright" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-text-bright" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>

            {/* Hamburger Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`mxd-nav__hamburger relative w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-300 ${
                isMenuOpen
                  ? "bg-accent"
                  : "bg-base-tint"
              }`}
              aria-label="Toggle menu"
            >
              <span className={`hamburger-line absolute w-5 h-[2px] transition-all duration-300 ${
                isMenuOpen
                  ? "bg-base-opp rotate-45 translate-y-0"
                  : "bg-text-bright -translate-y-1.5"
              }`} />
              <span className={`hamburger-line absolute w-5 h-[2px] transition-all duration-300 ${
                isMenuOpen
                  ? "bg-base-opp -rotate-45 translate-y-0"
                  : "bg-text-bright translate-y-1.5"
              }`} />
            </button>

            {/* Say Hello Button */}
            <Link
              href="/contact"
              className="btn btn-outline group flex items-center gap-2"
            >
              <span className="btn-caption hidden sm:inline">Say Hello</span>
              <svg
                className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
              </svg>
            </Link>
          </div>
        </div>
      </header>

      {/* Full Screen Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[90] bg-base"
          >
            <div className="h-full flex items-center justify-center">
              <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-2 gap-12">
                  {/* Left Side - Caption */}
                  <div className="hidden md:flex flex-col justify-center">
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-body-lg text-text-muted max-w-md"
                    >
                      ArqAI turns AI pilots into governed, ROI-driven intelligence.
                    </motion.p>
                  </div>

                  {/* Right Side - Navigation */}
                  <nav className="flex flex-col justify-center">
                    <ul className="space-y-4">
                      {navigation.map((item, index) => (
                        <motion.li
                          key={item.name}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 + index * 0.1 }}
                        >
                          <Link
                            href={item.href}
                            className={`block text-display-md md:text-display-lg font-display transition-colors ${
                              pathname === item.href
                                ? "text-accent"
                                : "text-text-bright hover:text-accent"
                            }`}
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {item.name}
                          </Link>
                        </motion.li>
                      ))}
                    </ul>

                    {/* Menu Footer */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="mt-12 pt-8 border-t border-stroke-muted"
                    >
                      <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
                        <a
                          href="mailto:hello@thearq.ai"
                          className="text-body-sm text-text-muted hover:text-accent transition-colors"
                        >
                          hello@thearq.ai
                        </a>
                        <a
                          href="tel:+18565400149"
                          className="text-body-sm text-text-muted hover:text-accent transition-colors"
                        >
                          +1 856-540-0149
                        </a>
                      </div>
                    </motion.div>
                  </nav>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
