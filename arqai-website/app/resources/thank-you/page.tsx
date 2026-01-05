"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

interface DownloadInfo {
  title: string;
  description: string;
  download_url: string;
  file_name: string;
  expires_at: string;
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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[var(--arq-blue)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-32 pb-16 bg-[var(--arq-gray-50)] dark:bg-[var(--arq-gray-900)]">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-lg mx-auto text-center">
              <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-[var(--arq-black)] dark:text-white mb-4">Download Unavailable</h1>
              <p className="text-[var(--arq-gray-600)] dark:text-[var(--arq-gray-400)] mb-8">{error}</p>
              <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--arq-blue)] text-white font-semibold rounded-full">Return Home</Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-32 pb-16 bg-gradient-to-b from-[var(--arq-gray-50)] to-white dark:from-[var(--arq-gray-900)] dark:to-[var(--arq-gray-800)]">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[var(--arq-lime)] to-[var(--arq-lime-dark)] flex items-center justify-center mx-auto mb-8 shadow-lg">
              <svg className="w-12 h-12 text-[var(--arq-black)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--arq-black)] dark:text-white mb-4">Thank You!</h1>
            <p className="text-xl text-[var(--arq-gray-600)] dark:text-[var(--arq-gray-400)] mb-8">Your download is ready.</p>

            {downloadInfo && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-[var(--arq-gray-800)] rounded-2xl p-8 shadow-xl border border-[var(--arq-gray-200)] dark:border-[var(--arq-gray-700)] mb-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-xl bg-[var(--arq-blue)]/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-8 h-8 text-[var(--arq-blue)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-[var(--arq-black)] dark:text-white">{downloadInfo.title}</h3>
                    <p className="text-sm text-[var(--arq-gray-500)]">{downloadInfo.file_name} • PDF</p>
                  </div>
                </div>
                <button
                  onClick={handleDownload}
                  disabled={hasDownloaded}
                  className={`w-full py-4 px-6 font-semibold rounded-xl flex items-center justify-center gap-3 transition-all ${hasDownloaded ? "bg-[var(--arq-gray-200)] dark:bg-[var(--arq-gray-700)] text-[var(--arq-gray-500)] cursor-not-allowed" : "bg-[var(--arq-blue)] text-white hover:bg-[var(--arq-blue-dark)]"}`}
                >
                  {hasDownloaded ? "Download Started" : "Download Now"}
                </button>
                <p className="mt-4 text-sm text-[var(--arq-gray-500)]">This link is for one-time use only</p>
              </motion.div>
            )}

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-left bg-[var(--arq-gray-50)] dark:bg-[var(--arq-gray-900)] rounded-2xl p-8">
              <h3 className="text-lg font-semibold text-[var(--arq-black)] dark:text-white mb-4">What&apos;s Next?</h3>
              <div className="space-y-4">
                <Link href="/demo" className="flex items-center gap-4 p-4 bg-white dark:bg-[var(--arq-gray-800)] rounded-xl hover:shadow-md transition-shadow group">
                  <div className="w-12 h-12 rounded-lg bg-[var(--arq-blue)]/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-[var(--arq-blue)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-[var(--arq-black)] dark:text-white">Schedule a Demo</h4>
                    <p className="text-sm text-[var(--arq-gray-500)]">See ArqAI in action</p>
                  </div>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-16 h-16 border-4 border-[var(--arq-blue)] border-t-transparent rounded-full animate-spin" /></div>}>
      <ThankYouContent />
    </Suspense>
  );
}
