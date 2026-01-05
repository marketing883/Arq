"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface Whitepaper {
  id: string;
  title: string;
  description: string;
  cover_image?: string;
  file_url?: string;
  page_count?: number;
  topics?: string[];
}

interface WhitepaperSectionProps {
  whitepaper: Whitepaper;
}

export function WhitepaperSection({ whitepaper }: WhitepaperSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    job_title: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/resources/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          resource_id: whitepaper.id,
          resource_type: "whitepaper",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to process request");
      }

      window.location.href = `/resources/thank-you?token=${data.token}`;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section className="py-20 bg-gradient-to-br from-[var(--arq-blue)] via-[var(--arq-blue-dark)] to-[#1a1a2e] relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[var(--arq-lime)] rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-block px-4 py-2 rounded-full bg-white/10 text-white text-sm font-semibold mb-6">
                Free Resource
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                {whitepaper.title}
              </h2>
              <p className="text-lg text-white/80 mb-8">
                {whitepaper.description}
              </p>

              {whitepaper.topics && whitepaper.topics.length > 0 && (
                <div className="mb-8">
                  <p className="text-white/60 text-sm font-medium mb-3">
                    What you&apos;ll learn:
                  </p>
                  <ul className="space-y-2">
                    {whitepaper.topics.map((topic, i) => (
                      <li key={i} className="flex items-start gap-3 text-white/90">
                        <svg className="w-5 h-5 mt-0.5 text-[var(--arq-lime)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{topic}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-3 px-8 py-4 bg-[var(--arq-lime)] text-[var(--arq-black)] font-bold rounded-full hover:bg-[var(--arq-lime-dark)] transition-colors text-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Free Guide
              </button>

              {whitepaper.page_count && (
                <p className="mt-4 text-white/60 text-sm">
                  {whitepaper.page_count} pages • PDF format
                </p>
              )}
            </motion.div>

            {/* Cover Image */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative aspect-[3/4] max-w-sm mx-auto">
                <div className="absolute inset-0 bg-black/20 rounded-lg transform rotate-3 translate-x-4 translate-y-4" />
                <div className="absolute inset-0 bg-black/10 rounded-lg transform rotate-1 translate-x-2 translate-y-2" />
                <div className="relative bg-white rounded-lg shadow-2xl overflow-hidden h-full">
                  {whitepaper.cover_image ? (
                    <Image
                      src={whitepaper.cover_image}
                      alt={whitepaper.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--arq-gray-100)] to-[var(--arq-gray-200)] flex flex-col items-center justify-center p-8 text-center">
                      <div className="w-20 h-20 rounded-2xl bg-[var(--arq-blue)]/10 flex items-center justify-center mb-6">
                        <svg className="w-10 h-10 text-[var(--arq-blue)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-bold text-[var(--arq-black)] mb-2">ArqAI</h3>
                      <p className="text-sm text-[var(--arq-gray-600)]">{whitepaper.title}</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Lead Capture Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-[var(--arq-gray-800)] rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-[var(--arq-blue)] to-[var(--arq-blue-dark)] p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">Free Download</span>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <h3 className="text-xl font-bold">{whitepaper.title}</h3>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {error && (
                  <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>
                )}

                <div>
                  <label className="block text-sm font-medium text-[var(--arq-gray-700)] dark:text-[var(--arq-gray-300)] mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-[var(--arq-gray-300)] dark:border-[var(--arq-gray-600)] bg-white dark:bg-[var(--arq-gray-900)] text-[var(--arq-black)] dark:text-white focus:ring-2 focus:ring-[var(--arq-blue)] focus:border-transparent"
                    placeholder="John Smith"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--arq-gray-700)] dark:text-[var(--arq-gray-300)] mb-1.5">
                    Work Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-[var(--arq-gray-300)] dark:border-[var(--arq-gray-600)] bg-white dark:bg-[var(--arq-gray-900)] text-[var(--arq-black)] dark:text-white focus:ring-2 focus:ring-[var(--arq-blue)] focus:border-transparent"
                    placeholder="john@company.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--arq-gray-700)] dark:text-[var(--arq-gray-300)] mb-1.5">
                    Company
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-[var(--arq-gray-300)] dark:border-[var(--arq-gray-600)] bg-white dark:bg-[var(--arq-gray-900)] text-[var(--arq-black)] dark:text-white focus:ring-2 focus:ring-[var(--arq-blue)] focus:border-transparent"
                    placeholder="Acme Corp"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-6 bg-[var(--arq-blue)] text-white font-semibold rounded-lg hover:bg-[var(--arq-blue-dark)] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Get Your Free Copy
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Placeholder whitepaper for fallback
const placeholderWhitepaper: Whitepaper = {
  id: "enterprise-ai-governance-2025",
  title: "The Enterprise AI Governance Playbook 2025",
  description: "Your comprehensive guide to building compliant, secure, and scalable AI operations. Learn from the strategies used by Fortune 500 companies to deploy AI at scale.",
  page_count: 45,
  topics: [
    "Building a governance-first AI strategy",
    "Compliance frameworks for regulated industries",
    "Zero-trust security architecture for AI agents",
    "Measuring and optimizing AI workforce ROI",
    "Case studies from financial services and healthcare",
  ],
};

// Dynamic version that fetches from database
export function WhitepaperSectionStatic() {
  const [whitepaper, setWhitepaper] = useState<Whitepaper>(placeholderWhitepaper);

  useEffect(() => {
    async function fetchWhitepaper() {
      try {
        const response = await fetch("/api/whitepapers/featured");
        if (response.ok) {
          const data = await response.json();
          if (data.whitepaper) {
            setWhitepaper(data.whitepaper);
          }
        }
      } catch (error) {
        console.error("Error fetching whitepaper:", error);
      }
    }

    fetchWhitepaper();
  }, []);

  return <WhitepaperSection whitepaper={whitepaper} />;
}
