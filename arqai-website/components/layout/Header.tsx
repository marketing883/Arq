"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface NavItem {
  name: string;
  href: string;
  children?: { name: string; href: string; description?: string }[];
}

const navigation: NavItem[] = [
  {
    name: "Products",
    href: "/products",
    children: [
      { name: "ArqFWA", href: "/products/arqfwa", description: "Fraud, waste, and abuse detection" },
      { name: "ArqClaims", href: "/products/arqclaims", description: "Claims triage and processing" },
      { name: "ArqBanker", href: "/products/arqbanker", description: "AML, KYC, and financial crime" },
      { name: "Roadmap", href: "/products/roadmap", description: "What we are building next" },
    ],
  },
  {
    name: "Solutions",
    href: "/solutions",
    children: [
      { name: "Healthcare payers", href: "/solutions/healthcare-payers", description: "For payer operations teams" },
      { name: "P&C insurance", href: "/solutions/insurance-carriers", description: "For carrier claims teams" },
      { name: "Banks and FIs", href: "/solutions/banking", description: "For financial crimes teams" },
    ],
  },
  { name: "Services", href: "/services" },
  { name: "How it works", href: "/how-it-works" },
  { name: "Trust", href: "/trust" },
  {
    name: "Resources",
    href: "#",
    children: [
      { name: "Blog", href: "/blog", description: "Insights and updates" },
      { name: "Case Studies", href: "/case-studies", description: "Client success stories" },
      { name: "Whitepapers", href: "/resources/whitepapers", description: "In-depth research" },
    ],
  },
  {
    name: "Company",
    href: "#",
    children: [
      { name: "About", href: "/about", description: "Our story and team" },
      { name: "Careers", href: "/careers", description: "Join us" },
      { name: "Contact", href: "/contact", description: "Get in touch" },
    ],
  },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setIsDarkMode(isDark);
  }, []);

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    setIsMenuOpen(false);
    setExpandedSection(null);
  }, [pathname]);

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

  const showDarkLogo = mounted && isDarkMode;

  const toggleSection = (sectionName: string) => {
    setExpandedSection(expandedSection === sectionName ? null : sectionName);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
          isScrolled
            ? "bg-base/80 backdrop-blur-md border-b border-stroke-muted/30"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 py-4 md:py-6 flex items-center justify-between">
          <Link href="/" className="flex items-center" aria-label="ArqAI">
            <Image
              src="/img/ArqAI-Logo-no-tagline.png"
              alt="ArqAI"
              width={720}
              height={240}
              className={`h-10 md:h-12 w-auto ${showDarkLogo ? "hidden" : "block"}`}
              priority
            />
            <Image
              src="/img/arq-ai-logo-white.svg"
              alt="ArqAI"
              width={180}
              height={60}
              className={`h-10 md:h-12 w-auto ${showDarkLogo ? "block" : "hidden"}`}
              priority
            />
          </Link>

          <div className="flex items-center gap-3 md:gap-4">
            <button
              onClick={toggleDarkMode}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-base-tint flex items-center justify-center transition-colors hover:bg-base-shade"
              aria-label="Toggle dark mode"
            >
              {showDarkLogo ? (
                <svg className="w-5 h-5 text-text-bright" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-text-bright" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`relative w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-300 ${
                isMenuOpen ? "bg-accent" : "bg-base-tint"
              }`}
              aria-label="Toggle menu"
            >
              <span
                className={`hamburger-line absolute w-5 h-[2px] transition-all duration-300 ${
                  isMenuOpen
                    ? "bg-base-opp rotate-45 translate-y-0"
                    : "bg-text-bright -translate-y-1.5"
                }`}
              />
              <span
                className={`hamburger-line absolute w-5 h-[2px] transition-all duration-300 ${
                  isMenuOpen
                    ? "bg-base-opp -rotate-45 translate-y-0"
                    : "bg-text-bright translate-y-1.5"
                }`}
              />
            </button>

            <Link
              href="/demo"
              className="btn bg-accent text-white hover:bg-accent/90 flex items-center gap-2"
            >
              <span className="hidden sm:inline">Book a demo</span>
              <span className="sm:hidden">Demo</span>
              <svg
                className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 17L17 7M17 7H7M17 7v10"
                />
              </svg>
            </Link>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[90] bg-base overflow-y-auto"
          >
            <div className="min-h-full flex items-center justify-center py-24 px-4">
              <div className="container mx-auto px-2 md:px-6">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                  <div className="hidden lg:flex flex-col justify-center">
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-body-lg text-text-muted max-w-md mb-8"
                    >
                      ArqAI Labs builds vertical AI agents for high-stakes operational workflows. Purpose-built. End-to-end delivered. Engineered for production.
                    </motion.p>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="max-w-md"
                    >
                      <div className="bg-base-tint rounded-2xl p-6 border border-stroke-muted/30">
                        <p className="text-body-xs text-accent uppercase tracking-wider mb-3">
                          Featured Product
                        </p>
                        <h4 className="text-xl font-display font-semibold text-text-bright mb-2">
                          ArqFWA
                        </h4>
                        <p className="text-body-sm text-text-muted mb-4">
                          The AI agent for fraud, waste, and abuse detection. Live in production for healthcare payers and P&C carriers.
                        </p>
                        <Link
                          href="/products/arqfwa"
                          onClick={() => setIsMenuOpen(false)}
                          className="inline-flex items-center gap-2 text-accent font-medium hover:gap-3 transition-all"
                        >
                          Learn more
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </Link>
                      </div>
                    </motion.div>
                  </div>

                  <nav className="flex flex-col justify-center">
                    <ul className="space-y-4">
                      {navigation.map((item, index) => (
                        <motion.li
                          key={item.name}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 + index * 0.05 }}
                        >
                          {item.children ? (
                            <div>
                              <button
                                onClick={() => toggleSection(item.name)}
                                className={`flex items-center gap-3 text-3xl md:text-4xl lg:text-5xl font-display transition-colors ${
                                  expandedSection === item.name
                                    ? "text-accent"
                                    : "text-text-bright hover:text-accent"
                                }`}
                              >
                                {item.name}
                                <svg
                                  className={`w-5 h-5 transition-transform ${
                                    expandedSection === item.name ? "rotate-180" : ""
                                  }`}
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                  />
                                </svg>
                              </button>

                              <AnimatePresence>
                                {expandedSection === item.name && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden"
                                  >
                                    <div className="pt-3 pl-4 space-y-2">
                                      {item.children.map((child) => (
                                        <Link
                                          key={child.name}
                                          href={child.href}
                                          onClick={() => setIsMenuOpen(false)}
                                          className={`block py-2 transition-colors group ${
                                            pathname === child.href
                                              ? "text-accent"
                                              : "text-text-muted hover:text-accent"
                                          }`}
                                        >
                                          <span className="text-body-lg font-medium block">
                                            {child.name}
                                          </span>
                                          {child.description && (
                                            <span className="text-body-sm text-text-muted">
                                              {child.description}
                                            </span>
                                          )}
                                        </Link>
                                      ))}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          ) : (
                            <Link
                              href={item.href}
                              className={`block text-3xl md:text-4xl lg:text-5xl font-display transition-colors ${
                                pathname === item.href
                                  ? "text-accent"
                                  : "text-text-bright hover:text-accent"
                              }`}
                              onClick={() => setIsMenuOpen(false)}
                            >
                              {item.name}
                            </Link>
                          )}
                        </motion.li>
                      ))}
                    </ul>

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
