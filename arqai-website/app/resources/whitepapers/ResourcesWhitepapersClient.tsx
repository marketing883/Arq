"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import V6Nav from "@/components/v6/V6Nav";
import V6Footer from "@/components/v6/V6Footer";
import ClosingCta from "@/components/v6/ClosingCta";
import { ArrowRight } from "@/components/home-v5/icons";
import { trackResourceDownload } from "@/lib/analytics/gtm-events";
import "@/components/v6/v6.css";
import "@/components/home-v5/styles.css";

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

      // Track file_download event in GTM
      if (selectedWhitepaper) {
        trackResourceDownload({
          resource_title: selectedWhitepaper.title,
          resource_type: "whitepaper",
          resource_id: selectedWhitepaper.id,
        });
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
    <div className="v5-shell">
      <V6Nav />
      <main>
        {/* Hero */}
        <section className="v5-page-hero">
          <div className="v5-container">
            <div className="v5-page-hero-inner">
              <span className="v5-badge">
                <span className="v5-badge-dot" />
                Resources
              </span>
              <h1 className="v5-h1">Whitepapers &amp; Guides</h1>
              <p className="v5-lead">
                Deep-dive resources on AI governance, compliance frameworks, and enterprise
                automation strategies.
              </p>
            </div>
          </div>
        </section>

        {/* Whitepapers grid */}
        <section className="v5-section v5-bg-grey">
          <div className="v5-container">
            {isLoading ? (
              <p className="v5-body" style={{ textAlign: "center" }}>
                Loading whitepapers...
              </p>
            ) : whitepapers.length === 0 ? (
              <div className="v5-card" style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
                <h2 className="v5-h2">No Whitepapers Yet</h2>
                <p className="v5-body" style={{ marginTop: 12, marginBottom: 24 }}>
                  Check back soon for our latest research and guides.
                </p>
                <Link href="/" className="v5-btn v5-btn-primary">
                  Back to Home <ArrowRight />
                </Link>
              </div>
            ) : (
              <div className="v5-blog-grid">
                {whitepapers.map((whitepaper) => (
                  <button
                    key={whitepaper.id}
                    type="button"
                    onClick={() => handleDownload(whitepaper)}
                    className="v5-blog-card"
                    style={{ textAlign: "left", cursor: "pointer", background: "none", border: "none", padding: 0 }}
                  >
                    <div className="v5-blog-cover">
                      {whitepaper.cover_image ? (
                        <Image
                          src={whitepaper.cover_image}
                          alt={whitepaper.title}
                          fill
                          style={{ objectFit: "cover" }}
                        />
                      ) : (
                        <div className="v5-blog-cover-placeholder" />
                      )}
                    </div>
                    <div className="v5-blog-body">
                      <span className="v5-blog-meta">
                        {whitepaper.category && (
                          <span className="v5-blog-cat">{whitepaper.category}</span>
                        )}
                        {formatDate(whitepaper.published_at)}
                      </span>
                      <h3 className="v5-h3">{whitepaper.title}</h3>
                      <p className="v5-body">{whitepaper.description}</p>
                      <span className="v5-card-more">
                        {whitepaper.gated ? "Download Free" : "Download"} <ArrowRight />
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>
        <ClosingCta
          heading="Want the thinking applied, not just written down?"
          sub="Tell us which workflow should run differently and we will scope the path to production."
        />
      </main>
      <V6Footer />

      {/* Lead capture modal */}
      {selectedWhitepaper && (
        <div
          onClick={() => setSelectedWhitepaper(null)}
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
            onClick={(e) => e.stopPropagation()}
            className="v5-card v5-form"
            style={{ maxWidth: 460, width: "100%", position: "relative" }}
          >
            <button
              type="button"
              onClick={() => setSelectedWhitepaper(null)}
              aria-label="Close"
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                width: 32,
                height: 32,
                borderRadius: 999,
                border: "none",
                background: "var(--v5-grey-100)",
                cursor: "pointer",
                display: "grid",
                placeItems: "center",
                color: "var(--v5-ink)",
              }}
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <span className="v5-card-eyebrow">Free Download</span>
            <h3 className="v5-h3" style={{ marginBottom: 20, paddingRight: 32 }}>
              {selectedWhitepaper.title}
            </h3>

            <form onSubmit={handleSubmit}>
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

              {error && <div className="v5-form-error">{error}</div>}

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
    </div>
  );
}
