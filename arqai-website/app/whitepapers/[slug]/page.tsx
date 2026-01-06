"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

interface Whitepaper {
  id: string;
  title: string;
  slug: string;
  description: string;
  content?: string;
  cover_image?: string;
  file_url?: string;
  category?: string;
  gated: boolean;
  published_at: string;
}

export default function WhitepaperDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [whitepaper, setWhitepaper] = useState<Whitepaper | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchWhitepaper() {
      try {
        const response = await fetch(`/api/whitepapers/${slug}`);
        if (response.ok) {
          const data = await response.json();
          setWhitepaper(data.whitepaper);
        }
      } catch (error) {
        console.error("Error fetching whitepaper:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (slug) {
      fetchWhitepaper();
    }
  }, [slug]);

  const handleDownload = () => {
    if (!whitepaper) return;

    if (whitepaper.gated) {
      setShowModal(true);
    } else if (whitepaper.file_url) {
      window.open(whitepaper.file_url, "_blank");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!whitepaper) return;

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-base pt-32 pb-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto animate-pulse">
              <div className="h-8 bg-base-tint rounded w-1/4 mb-4" />
              <div className="h-12 bg-base-tint rounded w-3/4 mb-6" />
              <div className="h-6 bg-base-tint rounded w-1/2 mb-8" />
              <div className="aspect-[16/9] bg-base-tint rounded-2xl mb-8" />
              <div className="space-y-4">
                <div className="h-4 bg-base-tint rounded" />
                <div className="h-4 bg-base-tint rounded w-5/6" />
                <div className="h-4 bg-base-tint rounded w-4/6" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!whitepaper) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-base pt-32 pb-16">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-accent/10 flex items-center justify-center">
              <svg className="w-10 h-10 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-3xl font-display font-bold text-text-bright mb-4">
              Whitepaper Not Found
            </h1>
            <p className="text-text-muted mb-8">
              The whitepaper you are looking for does not exist or has been removed.
            </p>
            <Link href="/whitepapers" className="btn bg-accent text-white">
              View All Whitepapers
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

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
              className="max-w-4xl mx-auto"
            >
              <Link
                href="/whitepapers"
                className="inline-flex items-center gap-2 text-accent hover:underline mb-6"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Whitepapers
              </Link>

              {whitepaper.category && (
                <span className="inline-block px-4 py-2 rounded-full bg-accent/20 text-accent text-sm font-semibold mb-4">
                  {whitepaper.category}
                </span>
              )}

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-base mb-4">
                {whitepaper.title}
              </h1>

              <p className="text-lg text-base/70 mb-6">
                {whitepaper.description}
              </p>

              <div className="flex items-center gap-4 text-sm text-base/60">
                <span>Published {formatDate(whitepaper.published_at)}</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <div className="grid lg:grid-cols-3 gap-12">
                {/* Main Content */}
                <div className="lg:col-span-2">
                  {whitepaper.cover_image && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-8 shadow-lg"
                    >
                      <Image
                        src={whitepaper.cover_image}
                        alt={whitepaper.title}
                        fill
                        className="object-cover"
                      />
                    </motion.div>
                  )}

                  {whitepaper.content && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="prose prose-lg dark:prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: whitepaper.content }}
                    />
                  )}
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="card sticky top-32"
                  >
                    <h3 className="text-lg font-display font-bold text-text-bright mb-4">
                      Download This Whitepaper
                    </h3>
                    <p className="text-sm text-text-muted mb-6">
                      Get instant access to this comprehensive guide on AI governance and compliance.
                    </p>
                    <button
                      onClick={handleDownload}
                      className="w-full py-3 px-4 bg-accent text-white font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      {whitepaper.gated ? "Download Free" : "Download PDF"}
                    </button>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Lead Capture Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
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
                    onClick={() => setShowModal(false)}
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
