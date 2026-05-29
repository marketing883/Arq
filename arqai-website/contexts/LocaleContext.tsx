"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import {
  Locale,
  SUPPORTED_LOCALES,
  t as translate,
  getTranslations,
} from "@/lib/i18n/translations";

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  translations: Record<string, string>;
  isLoading: boolean;
}

const LocaleContext = createContext<LocaleContextType | null>(null);

// Map country codes to locales
const COUNTRY_TO_LOCALE: Record<string, Locale> = {
  // English-speaking countries
  US: "en",
  GB: "en",
  CA: "en",
  AU: "en",
  NZ: "en",
  IE: "en",
  // Spanish-speaking countries
  ES: "es",
  MX: "es",
  AR: "es",
  CO: "es",
  CL: "es",
  PE: "es",
  // French-speaking countries
  FR: "fr",
  BE: "fr",
  CH: "fr",
  // German-speaking countries
  DE: "de",
  AT: "de",
  // Japan
  JP: "ja",
};

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [isLoading, setIsLoading] = useState(true);

  // Detect locale from IP or browser on mount
  useEffect(() => {
    const detectLocale = async () => {
      // Check if user has a saved preference
      const savedLocale = localStorage.getItem("arqai_locale") as Locale;
      if (savedLocale && SUPPORTED_LOCALES.includes(savedLocale)) {
        setLocaleState(savedLocale);
        setIsLoading(false);
        return;
      }

      // Try to detect from IP using a free geo-IP service
      try {
        const response = await fetch("/api/geo");
        if (response.ok) {
          const data = await response.json();
          const detectedLocale = COUNTRY_TO_LOCALE[data.country];
          if (detectedLocale) {
            setLocaleState(detectedLocale);
            setIsLoading(false);
            return;
          }
        }
      } catch (error) {
        console.error("Geo detection failed:", error);
      }

      // Fallback to browser language
      const browserLang = navigator.language.split("-")[0];
      const browserLocale = SUPPORTED_LOCALES.find(
        (l) => l === browserLang
      ) as Locale | undefined;
      if (browserLocale) {
        setLocaleState(browserLocale);
      }

      setIsLoading(false);
    };

    detectLocale();
  }, []);

  // Update locale and save preference
  const setLocale = useCallback((newLocale: Locale) => {
    if (SUPPORTED_LOCALES.includes(newLocale)) {
      setLocaleState(newLocale);
      localStorage.setItem("arqai_locale", newLocale);
      // Update HTML lang attribute
      document.documentElement.lang = newLocale;
    }
  }, []);

  // Translation function
  const t = useCallback(
    (key: string): string => translate(locale, key),
    [locale]
  );

  // Get all translations for current locale
  const translations = getTranslations(locale);

  return (
    <LocaleContext.Provider
      value={{ locale, setLocale, t, translations, isLoading }}
    >
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return context;
}
