"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "@/contexts/LocaleContext";
import {
  Locale,
  SUPPORTED_LOCALES,
  LOCALE_NAMES,
  LOCALE_FLAGS,
} from "@/lib/i18n/translations";

interface LanguageSwitcherProps {
  variant?: "header" | "footer";
}

export function LanguageSwitcher({ variant = "header" }: LanguageSwitcherProps) {
  const { locale, setLocale, isLoading } = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const handleSelect = (newLocale: Locale) => {
    setLocale(newLocale);
    setIsOpen(false);
  };

  if (isLoading) {
    return (
      <div className="w-24 h-10 bg-[var(--arq-gray-100)] rounded-lg animate-pulse" />
    );
  }

  const isFooter = variant === "footer";

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-lg transition-colors
          ${
            isFooter
              ? "text-[var(--arq-gray-400)] hover:text-white hover:bg-[var(--arq-gray-700)]"
              : "text-[var(--arq-gray-700)] hover:bg-[var(--arq-gray-100)]"
          }
        `}
        aria-label="Select language"
        aria-expanded={isOpen}
      >
        <span className="text-lg">{LOCALE_FLAGS[locale]}</span>
        <span className="text-sm font-medium">{LOCALE_NAMES[locale]}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
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
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`
              absolute right-0 mt-2 py-2 min-w-[160px] rounded-xl shadow-xl z-50
              ${
                isFooter
                  ? "bg-[var(--arq-gray-800)] border border-[var(--arq-gray-700)] bottom-full mb-2"
                  : "bg-white border border-[var(--arq-gray-200)]"
              }
            `}
          >
            {SUPPORTED_LOCALES.map((loc) => (
              <button
                key={loc}
                onClick={() => handleSelect(loc)}
                className={`
                  w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors
                  ${
                    loc === locale
                      ? isFooter
                        ? "bg-[var(--arq-blue)] text-white"
                        : "bg-[var(--arq-blue-light)] text-[var(--arq-blue)]"
                      : isFooter
                        ? "text-[var(--arq-gray-300)] hover:bg-[var(--arq-gray-700)]"
                        : "text-[var(--arq-gray-700)] hover:bg-[var(--arq-gray-50)]"
                  }
                `}
              >
                <span className="text-lg">{LOCALE_FLAGS[loc]}</span>
                <span className="text-sm font-medium">{LOCALE_NAMES[loc]}</span>
                {loc === locale && (
                  <svg
                    className="w-4 h-4 ml-auto"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
