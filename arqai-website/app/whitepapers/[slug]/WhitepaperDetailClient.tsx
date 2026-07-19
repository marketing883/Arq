"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import V6Nav from "@/components/v6/V6Nav";
import V6Footer from "@/components/v6/V6Footer";
import ClosingCta from "@/components/v6/ClosingCta";
import { ArrowRight } from "@/components/home-v5/icons";
import { sanitizeHtml } from "@/lib/security/sanitize";
import { trackResourceDownload } from "@/lib/analytics/gtm-events";
import "@/components/v6/v6.css";
import "@/components/home-v5/styles.css";

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
    website_url: "", // honeypot
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formLoadedAt, setFormLoadedAt] = useState(0);

  useEffect(() => {
    setFormLoadedAt(Date.now());
  }, []);

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
          _formLoadedAt: formLoadedAt,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to process request");
      }

      // Track file_download event in GTM
      trackResourceDownload({
        resource_title: whitepaper.title,
        resource_type: "whitepaper",
        resource_id: whitepaper.id,
      });

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
      <div className="v5-shell">
        <V6Nav />
        <main>
          <section className="v5-section v5-bg-grey">
            <div className="v5-container">
              <div style={{ maxWidth: 880, margin: "0 auto" }}>
                <div className="v5-skel v5-skel-sm" style={{ width: "25%" }} />
                <div className="v5-skel v5-skel-lg" style={{ width: "75%", marginTop: 16 }} />
                <div className="v5-skel v5-skel-md" style={{ width: "50%", marginTop: 16 }} />
                <div className="v5-blog-cover v5-blog-cover-placeholder" style={{ marginTop: 32 }} />
                <div className="v5-skel v5-skel-md" style={{ marginTop: 24 }} />
                <div className="v5-skel v5-skel-md" style={{ width: "83%", marginTop: 12 }} />
                <div className="v5-skel v5-skel-md" style={{ width: "66%", marginTop: 12 }} />
              </div>
            </div>
          </section>
        </main>
        <V6Footer />
      </div>
    );
  }

  if (!whitepaper) {
    return (
      <div className="v5-shell">
        <V6Nav />
        <main>
          <section className="v5-section v5-bg-grey">
            <div className="v5-container">
              <div className="v5-card" style={{ textAlign: "center", padding: "clamp(32px, 6vw, 72px)" }}>
                <h1 className="v5-h2">Whitepaper Not Found</h1>
                <p className="v5-lead" style={{ margin: "16px auto 28px", maxWidth: "52ch" }}>
                  The whitepaper you are looking for does not exist or has been removed.
                </p>
                <Link href="/whitepapers" className="v5-btn v5-btn-primary">
                  View All Whitepapers <ArrowRight />
                </Link>
              </div>
            </div>
          </section>
        </main>
        <V6Footer />
      </div>
    );
  }

  return (
    <div className="v5-shell">
      <V6Nav />
      <main>
        {/* Hero */}
        <section className="v5-page-hero">
          <div className="v5-container">
            <div style={{ maxWidth: 880, margin: "0 auto" }}>
              <div className="v5-crumbs">
                <Link href="/whitepapers">Whitepapers</Link>
                <span>/</span>
                <span style={{ color: "var(--v5-ink-soft)" }}>{whitepaper.title}</span>
              </div>

              {whitepaper.category && (
                <span className="v5-badge" style={{ marginTop: 18 }}>
                  <span className="v5-badge-dot" />
                  {whitepaper.category}
                </span>
              )}

              <h1 className="v5-h1" style={{ marginTop: 18 }}>
                {whitepaper.title}
              </h1>

              <p className="v5-lead" style={{ marginTop: 18 }}>
                {whitepaper.description}
              </p>

              <p className="v5-body" style={{ marginTop: 18, color: "var(--v5-ink-soft)" }}>
                Published {formatDate(whitepaper.published_at)}
              </p>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="v5-section v5-bg-grey">
          <div className="v5-container">
            <div className="v5-split">
              <div className="v5-split-copy">
                {whitepaper.cover_image && (
                  <div
                    style={{
                      position: "relative",
                      aspectRatio: "3 / 4",
                      borderRadius: 16,
                      overflow: "hidden",
                      marginBottom: 32,
                    }}
                  >
                    <Image
                      src={whitepaper.cover_image}
                      alt={whitepaper.title}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                )}

                {whitepaper.content && (
                  <div
                    className="v5-prose"
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(whitepaper.content) }}
                  />
                )}
              </div>

              <div className="v5-split-media">
                <div className="v5-card" style={{ position: "sticky", top: 112 }}>
                  <h3 className="v5-h3">Download This Whitepaper</h3>
                  <p className="v5-body" style={{ marginTop: 12 }}>
                    Get instant access to this comprehensive guide on AI governance and
                    compliance.
                  </p>
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="v5-btn v5-btn-primary"
                    style={{ marginTop: 22, width: "100%", justifyContent: "center" }}
                  >
                    {whitepaper.gated ? "Download Free" : "Download PDF"} <ArrowRight />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
        <ClosingCta
          heading="Want the thinking applied, not just written down?"
          sub="Tell us which workflow should run differently and we will scope the path to production."
        />
      </main>

      {/* Lead capture modal */}
      {showModal && (
        <div
          className="v5-modal-overlay"
          onClick={() => setShowModal(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
          }}
        >
          <div
            className="v5-card v5-form"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 460, width: "100%", position: "relative" }}
          >
            <button
              type="button"
              onClick={() => setShowModal(false)}
              aria-label="Close"
              className="v5-btn v5-btn-ghost"
              style={{ position: "absolute", top: 16, right: 16, padding: "6px 10px" }}
            >
              ✕
            </button>

            <span className="v5-eyebrow">Free Download</span>
            <h3 className="v5-h3" style={{ marginTop: 10 }}>
              {whitepaper.title}
            </h3>

            <form onSubmit={handleSubmit} style={{ marginTop: 22 }}>
              {error && <div className="v5-form-error">{error}</div>}

              <label className="v5-field">
                <span className="v5-field-label">
                  Full Name <span className="req">*</span>
                </span>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="v5-input"
                  placeholder="John Smith"
                />
              </label>

              <label className="v5-field">
                <span className="v5-field-label">
                  Work Email <span className="req">*</span>
                </span>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="v5-input"
                  placeholder="john@company.com"
                />
              </label>

              <label className="v5-field">
                <span className="v5-field-label">Company</span>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="v5-input"
                  placeholder="Acme Corp"
                />
              </label>

              {/* Honeypot field - hidden from real users */}
              <div className="v5-honeypot" aria-hidden="true">
                <label htmlFor="wpd_website_url">Website</label>
                <input
                  type="text"
                  id="wpd_website_url"
                  name="website_url"
                  value={formData.website_url}
                  onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="v5-btn v5-btn-primary v5-form-submit"
              >
                {isSubmitting ? "Processing..." : "Get Your Free Copy"}
              </button>
            </form>
          </div>
        </div>
      )}

      <V6Footer />
    </div>
  );
}
