"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import V5Nav from "@/components/home-v5/V5Nav";
import Footer from "@/components/home-v5/Footer";
import { ArrowRight } from "@/components/home-v5/icons";
import "@/components/home-v5/styles.css";

interface DownloadInfo {
  title: string;
  description: string;
  download_url: string;
  file_name: string;
  expires_at: string;
}

function Loader() {
  return (
    <div className="v5-shell">
      <V5Nav />
      <main>
        <section className="v5-section v5-bg-grey">
          <div className="v5-container">
            <p className="v5-body" style={{ textAlign: "center" }}>
              Loading...
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function ThankYouContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [downloadInfo, setDownloadInfo] = useState<DownloadInfo | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [hasDownloaded, setHasDownloaded] = useState(false);

  useEffect(() => {
    const fetchDownloadInfo = async () => {
      if (!token) {
        setError("Invalid or missing download token.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/resources/download?token=${token}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to retrieve download information");
        setDownloadInfo(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDownloadInfo();
  }, [token]);

  const handleDownload = () => {
    if (!downloadInfo) return;
    setHasDownloaded(true);
    window.open(downloadInfo.download_url, "_blank");
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="v5-shell">
        <V5Nav />
        <main>
          <section className="v5-section v5-bg-grey">
            <div className="v5-container">
              <div className="v5-card" style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
                <h1 className="v5-h2">Download Unavailable</h1>
                <p className="v5-body" style={{ marginTop: 12, marginBottom: 24 }}>
                  {error}
                </p>
                <Link href="/" className="v5-btn v5-btn-primary">
                  Return Home <ArrowRight />
                </Link>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="v5-shell">
      <V5Nav />
      <main>
        <section className="v5-section v5-bg-grey">
          <div className="v5-container">
            <div style={{ maxWidth: 680, margin: "0 auto" }}>
              <div className="v5-card v5-success">
                <div className="v5-success-mark">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--v5-ink)" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h1 className="v5-h2">Thank You!</h1>
                <p className="v5-lead" style={{ marginTop: 8 }}>
                  Your download is ready.
                </p>
              </div>

              {downloadInfo && (
                <div className="v5-card" style={{ marginTop: 24 }}>
                  <span className="v5-card-eyebrow">{downloadInfo.file_name} • PDF</span>
                  <h3 className="v5-h3">{downloadInfo.title}</h3>
                  <button
                    onClick={handleDownload}
                    disabled={hasDownloaded}
                    className="v5-btn v5-btn-primary v5-form-submit"
                    style={{ marginTop: 20 }}
                  >
                    {hasDownloaded ? "Download Started" : "Download Now"}
                  </button>
                  <p className="v5-form-note">This link is for one-time use only</p>
                </div>
              )}

              <div className="v5-card" style={{ marginTop: 24 }}>
                <h3 className="v5-h3">What&apos;s Next?</h3>
                <Link href="/engage-us" className="v5-card-more" style={{ marginTop: 12 }}>
                  Get Started — See ArqAI in action <ArrowRight />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={<Loader />}>
      <ThankYouContent />
    </Suspense>
  );
}
