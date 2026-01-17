"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

interface Whitepaper {
  id: string;
  title: string;
  slug: string;
  description: string;
  cover_image?: string;
  file_url?: string;
  category?: string;
  gated: boolean;
  published_at: string;
}

export default function WhitepapersPage() {
  const [whitepapers, setWhitepapers] = useState<Whitepaper[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedWhitepaper, setSelectedWhitepaper] = useState<Whitepaper | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    job_title: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchWhitepapers() {
      try {
        const response = await fetch("/api/whitepapers/list");
        if (response.ok) {
          const data = await response.json();
          setWhitepapers(data.whitepapers || []);
        }
      } catch (error) {
        console.error("Error fetching whitepapers:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchWhitepapers();
  }, []);

  const handleDownload = (whitepaper: Whitepaper) => {
    if (whitepaper.gated) {
      setSelectedWhitepaper(whitepaper);
    } else if (whitepaper.file_url) {
      window.open(whitepaper.file_url, "_blank");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWhitepaper) return;

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/resources/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          resource_id: selectedWhitepaper.id,
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-base">
        {/* Hero Section */}
        <section className="pt-32 pb-16 bg-base-opp">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-3xl mx-auto"
            >
              <span className="inline-block px-4 py-2 rounded-full bg-accent/20 text-accent text-sm font-semibold mb-6">
                Resources
              </span>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-base mb-6">
                Whitepapers & Guides
              </h1>
              <p className="text-lg text-base/70">
                Deep-dive resources on AI governance, compliance frameworks, and enterprise automation strategies
              </p>
            </motion.div>
          </div>
        </section>

        {/* Whitepapers Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4 md:px-6">
            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="card overflow-hidden animate-pulse">
                    <div className="aspect-[3/4] bg-base-tint" />
                    <div className="p-6 space-y-3">
                      <div className="h-4 bg-base-tint rounded w-1/3" />
                      <div className="h-6 bg-base-tint rounded" />
                      <div className="h-4 bg-base-tint rounded w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : whitepapers.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-accent/10 flex items-center justify-center">
                  <svg className="w-10 h-10 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-text-bright mb-4">
                  No Whitepapers Yet
                </h2>
                <p className="text-text-muted mb-8">
                  Check back soon for our latest research and guides.
                </p>
                <Link
                  href="/"
                  className="btn bg-accent text-white"
                >
                  Back to Home
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {whitepapers.map((whitepaper, index) => (
                  <motion.div
                    key={whitepaper.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="card overflow-hidden group"
                  >
                    {/* Cover Image */}
                    <div className="relative aspect-[3/4] bg-base-tint">
                      {whitepaper.cover_image ? (
                        <Image
                          src={whitepaper.cover_image}
                          alt={whitepaper.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-base-tint to-base-shade">
                          <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <p className="text-sm text-text-muted">
                            {whitepaper.title}
                          </p>
                        </div>
                      )}
                      {whitepaper.category && (
                        <span className="absolute top-4 left-4 px-3 py-1 bg-base/90 backdrop-blur-sm text-xs font-semibold text-accent rounded-full">
                          {whitepaper.category}
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <p className="text-sm text-text-muted mb-2">
                        {formatDate(whitepaper.published_at)}
                      </p>
                      <h3 className="text-lg font-display font-bold text-text-bright mb-3 line-clamp-2">
                        {whitepaper.title}
                      </h3>
                      <p className="text-sm text-text-muted mb-4 line-clamp-3">
                        {whitepaper.description}
                      </p>
                      <button
                        onClick={() => handleDownload(whitepaper)}
                        className="w-full py-3 px-4 bg-accent text-white font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        {whitepaper.gated ? "Download Free" : "Download"}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Lead Capture Modal */}
      <AnimatePresence>
        {selectedWhitepaper && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedWhitepaper(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-base rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-accent p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">Free Download</span>
                  <button
                    onClick={() => setSelectedWhitepaper(null)}
                    className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <h3 className="text-xl font-bold">{selectedWhitepaper.title}</h3>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {error && (
                  <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>
                )}

                <div>
                  <label className="block text-sm font-medium text-text-medium mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-stroke-muted bg-base text-text-bright focus:ring-2 focus:ring-accent focus:border-transparent"
                    placeholder="John Smith"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-medium mb-1.5">
                    Work Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-stroke-muted bg-base text-text-bright focus:ring-2 focus:ring-accent focus:border-transparent"
                    placeholder="john@company.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-medium mb-1.5">
                    Company
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-stroke-muted bg-base text-text-bright focus:ring-2 focus:ring-accent focus:border-transparent"
                    placeholder="Acme Corp"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-6 bg-accent text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
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

      <Footer />
    </>
  );
}
