"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ConsentCategories {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

const DEFAULT_CONSENT: ConsentCategories = {
  necessary: true, // Always required
  analytics: false,
  marketing: false,
  preferences: false,
};

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [consent, setConsent] = useState<ConsentCategories>(DEFAULT_CONSENT);

  useEffect(() => {
    // Check if consent has been given
    const savedConsent = localStorage.getItem("arqai_cookie_consent");
    if (!savedConsent) {
      // Wait a bit before showing the banner
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    } else {
      try {
        const parsed = JSON.parse(savedConsent);
        setConsent(parsed.categories || DEFAULT_CONSENT);
      } catch {
        // Invalid consent, show banner
        setIsVisible(true);
      }
    }
  }, []);

  const saveConsent = (categories: ConsentCategories) => {
    const consentData = {
      categories,
      consentedAt: new Date().toISOString(),
      version: "1.0",
    };
    localStorage.setItem("arqai_cookie_consent", JSON.stringify(consentData));
    setIsVisible(false);

    // Track consent in database (non-blocking)
    fetch("/api/consent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        consent_given: true,
        consent_categories: categories,
      }),
    }).catch(console.error);
  };

  const acceptAll = () => {
    const allAccepted: ConsentCategories = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    };
    setConsent(allAccepted);
    saveConsent(allAccepted);
  };

  const acceptSelected = () => {
    saveConsent(consent);
  };

  const rejectAll = () => {
    const onlyNecessary: ConsentCategories = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    };
    setConsent(onlyNecessary);
    saveConsent(onlyNecessary);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
      >
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl border border-[var(--arq-gray-200)] overflow-hidden">
          {/* Main Banner */}
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-[var(--arq-black)] mb-2">
                  We value your privacy
                </h3>
                <p className="text-sm text-[var(--arq-gray-600)] mb-4">
                  We use cookies to enhance your experience, analyze site traffic, and
                  personalize content. By clicking &ldquo;Accept All&rdquo;, you consent to
                  our use of cookies.{" "}
                  <a href="/privacy" className="text-[var(--arq-blue)] hover:underline">
                    Learn more
                  </a>
                </p>

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={acceptAll}
                    className="px-6 py-2.5 bg-[var(--arq-blue)] text-white font-semibold rounded-lg hover:bg-[var(--arq-blue-dark)] transition-colors"
                  >
                    Accept All
                  </button>
                  <button
                    onClick={rejectAll}
                    className="px-6 py-2.5 border border-[var(--arq-gray-300)] text-[var(--arq-gray-700)] font-semibold rounded-lg hover:bg-[var(--arq-gray-50)] transition-colors"
                  >
                    Reject All
                  </button>
                  <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="px-6 py-2.5 text-[var(--arq-blue)] font-semibold hover:underline"
                  >
                    {showDetails ? "Hide Details" : "Customize"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Settings */}
          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-t border-[var(--arq-gray-200)] overflow-hidden"
              >
                <div className="p-6 space-y-4 bg-[var(--arq-gray-50)]">
                  {/* Necessary */}
                  <div className="flex items-start gap-4 p-4 bg-white rounded-lg">
                    <input
                      type="checkbox"
                      checked={consent.necessary}
                      disabled
                      className="mt-1 w-5 h-5 rounded border-[var(--arq-gray-300)]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-[var(--arq-black)]">
                          Necessary
                        </h4>
                        <span className="text-xs px-2 py-0.5 bg-[var(--arq-gray-200)] text-[var(--arq-gray-600)] rounded">
                          Always Active
                        </span>
                      </div>
                      <p className="text-sm text-[var(--arq-gray-600)] mt-1">
                        Essential for the website to function. Cannot be disabled.
                      </p>
                    </div>
                  </div>

                  {/* Analytics */}
                  <div className="flex items-start gap-4 p-4 bg-white rounded-lg">
                    <input
                      type="checkbox"
                      checked={consent.analytics}
                      onChange={(e) =>
                        setConsent({ ...consent, analytics: e.target.checked })
                      }
                      className="mt-1 w-5 h-5 rounded border-[var(--arq-gray-300)] text-[var(--arq-blue)] focus:ring-[var(--arq-blue)]"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-[var(--arq-black)]">
                        Analytics
                      </h4>
                      <p className="text-sm text-[var(--arq-gray-600)] mt-1">
                        Help us understand how visitors interact with our website.
                      </p>
                    </div>
                  </div>

                  {/* Marketing */}
                  <div className="flex items-start gap-4 p-4 bg-white rounded-lg">
                    <input
                      type="checkbox"
                      checked={consent.marketing}
                      onChange={(e) =>
                        setConsent({ ...consent, marketing: e.target.checked })
                      }
                      className="mt-1 w-5 h-5 rounded border-[var(--arq-gray-300)] text-[var(--arq-blue)] focus:ring-[var(--arq-blue)]"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-[var(--arq-black)]">
                        Marketing
                      </h4>
                      <p className="text-sm text-[var(--arq-gray-600)] mt-1">
                        Used to deliver personalized advertisements.
                      </p>
                    </div>
                  </div>

                  {/* Preferences */}
                  <div className="flex items-start gap-4 p-4 bg-white rounded-lg">
                    <input
                      type="checkbox"
                      checked={consent.preferences}
                      onChange={(e) =>
                        setConsent({ ...consent, preferences: e.target.checked })
                      }
                      className="mt-1 w-5 h-5 rounded border-[var(--arq-gray-300)] text-[var(--arq-blue)] focus:ring-[var(--arq-blue)]"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-[var(--arq-black)]">
                        Preferences
                      </h4>
                      <p className="text-sm text-[var(--arq-gray-600)] mt-1">
                        Remember your settings and preferences.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={acceptSelected}
                    className="w-full py-3 bg-[var(--arq-blue)] text-white font-semibold rounded-lg hover:bg-[var(--arq-blue-dark)] transition-colors"
                  >
                    Save Preferences
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
