"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface PromoContent {
  type: "webinar" | "whitepaper" | "case-study";
  title: string;
  description: string;
  slug: string;
  image: string;
  date?: string;
  status?: string;
  category?: string;
  industry?: string;
  link: string;
  cta: string;
}

const navigation = [
  { name: "Home", href: "/" },
  { name: "Platform", href: "/platform" },
  { name: "Solutions", href: "/solutions" },
  { name: "About", href: "/about" },
  { name: "Resources", href: "#", hasDropdown: true },
  { name: "Contact", href: "/contact" },
];

const resourceLinks = [
  {
    name: "Blog",
    href: "/blog",
    description: "Insights and updates",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
      </svg>
    ),
  },
  {
    name: "Case Studies",
    href: "/case-studies",
    description: "Real client success stories",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    name: "Whitepapers",
    href: "/resources/whitepapers",
    description: "In-depth research & guides",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    name: "Webinars",
    href: "/webinars",
    description: "Live & on-demand sessions",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
  },
];

function formatPromoDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [promoContent, setPromoContent] = useState<PromoContent | null>(null);
  const [resourcesExpanded, setResourcesExpanded] = useState(false);
  const pathname = usePathname();

  // Fetch promo content
  useEffect(() => {
    fetch("/api/promo-content")
      .then(res => res.json())
      .then(data => {
        if (data.promo) {
          setPromoContent(data.promo);
        }
      })
      .catch(err => console.error("Failed to fetch promo:", err));
  }, []);

  // Handle scroll to show/hide header background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check initial state
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    setResourcesExpanded(false);
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
      <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        isScrolled
          ? "bg-base/80 backdrop-blur-md border-b border-stroke-muted/30"
          : "bg-transparent border-b border-transparent"
      }`}>
        <div className="container mx-auto px-4 md:px-6 py-4 md:py-6 flex items-center justify-between">
          {/* Logo - Left Side */}
          <Link
            href="/"
            className="mxd-logo flex items-center loading__fade"
          >
            {/* Light mode logo (colored PNG with tagline) */}
            <Image
              src="/img/ArqAI-logo.png"
              alt="ArqAI - Intelligence, By Design"
              width={160}
              height={50}
              className={`h-12 md:h-14 w-auto ${isDarkMode ? "hidden" : "block"}`}
              priority
            />
            {/* Dark mode logo (white) */}
            <Image
              src="/img/arq-ai-logo-white.svg"
              alt="ArqAI Logo"
              width={180}
              height={60}
              className={`h-10 md:h-14 w-auto ${isDarkMode ? "block" : "hidden"}`}
              priority
            />
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
            className="fixed inset-0 z-[90] bg-base overflow-y-auto"
          >
            <div className="min-h-full flex items-center justify-center py-24 px-4">
              <div className="container mx-auto px-2 md:px-6">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                  {/* Left Side - Caption + Promo (Desktop) */}
                  <div className="hidden lg:flex flex-col justify-center">
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-body-lg text-text-muted max-w-md mb-8"
                    >
                      ArqAI turns AI pilots into governed, ROI-driven intelligence.
                    </motion.p>

                    {/* Promotional Content (Desktop Only) */}
                    {promoContent && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="max-w-md"
                      >
                        <Link
                          href={promoContent.link}
                          onClick={() => setIsMenuOpen(false)}
                          className="block group"
                        >
                          <div className="bg-base-tint rounded-2xl overflow-hidden border border-stroke-muted/30 hover:border-accent/50 transition-all">
                            {/* Image */}
                            {promoContent.image && (
                              <div className="relative h-40 bg-gradient-to-br from-blue-600 to-purple-700">
                                <img
                                  src={promoContent.image}
                                  alt={promoContent.title}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                {/* Badge */}
                                <div className="absolute top-3 left-3">
                                  {promoContent.type === "webinar" && (
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                                      promoContent.status === "live"
                                        ? "bg-green-500 text-white"
                                        : "bg-blue-500 text-white"
                                    }`}>
                                      {promoContent.status === "live" && (
                                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                      )}
                                      {promoContent.status === "live" ? "Live Now" : "Upcoming Webinar"}
                                    </span>
                                  )}
                                  {promoContent.type === "whitepaper" && (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-500 text-white">
                                      Free Download
                                    </span>
                                  )}
                                  {promoContent.type === "case-study" && (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-teal-500 text-white">
                                      Case Study
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}
                            {/* Content */}
                            <div className="p-5">
                              {promoContent.type === "webinar" && promoContent.date && (
                                <p className="text-xs text-text-muted mb-2 flex items-center gap-1.5">
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  {formatPromoDate(promoContent.date)}
                                </p>
                              )}
                              <h4 className="text-lg font-semibold text-text-bright group-hover:text-accent transition-colors line-clamp-2 mb-2">
                                {promoContent.title}
                              </h4>
                              <p className="text-sm text-text-muted line-clamp-2 mb-4">
                                {promoContent.description}
                              </p>
                              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-accent group-hover:gap-2.5 transition-all">
                                {promoContent.cta}
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                              </span>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    )}
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
                          {item.hasDropdown ? (
                            <div>
                              <button
                                onClick={() => setResourcesExpanded(!resourcesExpanded)}
                                className={`flex items-center gap-3 text-display-md md:text-display-lg font-display transition-colors ${
                                  resourcesExpanded || pathname.startsWith("/blog") || pathname.startsWith("/case-studies") || pathname.startsWith("/whitepapers") || pathname.startsWith("/webinars")
                                    ? "text-accent"
                                    : "text-text-bright hover:text-accent"
                                }`}
                              >
                                {item.name}
                                <svg
                                  className={`w-6 h-6 transition-transform ${resourcesExpanded ? "rotate-180" : ""}`}
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </button>

                              <AnimatePresence>
                                {resourcesExpanded && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden"
                                  >
                                    <div className="pt-4 pl-4 space-y-3">
                                      {resourceLinks.map((link) => (
                                        <Link
                                          key={link.name}
                                          href={link.href}
                                          onClick={() => setIsMenuOpen(false)}
                                          className={`flex items-center gap-3 py-2 transition-colors group ${
                                            pathname.startsWith(link.href)
                                              ? "text-accent"
                                              : "text-text-muted hover:text-accent"
                                          }`}
                                        >
                                          <span className="text-text-muted group-hover:text-accent transition-colors">
                                            {link.icon}
                                          </span>
                                          <div>
                                            <span className="text-body-lg font-medium block">{link.name}</span>
                                            <span className="text-body-sm text-text-muted">{link.description}</span>
                                          </div>
                                        </Link>
                                      ))}
                                    </div>

                                    {/* Mobile Promo */}
                                    {promoContent && (
                                      <div className="lg:hidden mt-6 pt-4 border-t border-stroke-muted/30">
                                        <Link
                                          href={promoContent.link}
                                          onClick={() => setIsMenuOpen(false)}
                                          className="flex items-center gap-4 p-3 bg-base-tint rounded-xl group"
                                        >
                                          {promoContent.image && (
                                            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-blue-600 to-purple-700">
                                              <img
                                                src={promoContent.image}
                                                alt=""
                                                className="w-full h-full object-cover"
                                              />
                                            </div>
                                          )}
                                          <div className="flex-1 min-w-0">
                                            <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full mb-1 ${
                                              promoContent.type === "webinar"
                                                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                                : promoContent.type === "whitepaper"
                                                ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                                                : "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400"
                                            }`}>
                                              {promoContent.type === "webinar" ? "Webinar" : promoContent.type === "whitepaper" ? "Whitepaper" : "Case Study"}
                                            </span>
                                            <p className="text-sm font-medium text-text-bright truncate group-hover:text-accent transition-colors">
                                              {promoContent.title}
                                            </p>
                                          </div>
                                          <svg className="w-5 h-5 text-text-muted group-hover:text-accent transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                          </svg>
                                        </Link>
                                      </div>
                                    )}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          ) : (
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
                          )}
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
