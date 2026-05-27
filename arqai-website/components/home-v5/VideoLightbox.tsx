"use client";

import { useCallback, useEffect, useState } from "react";

type Props = {
  videoUrl?: string;
  poster?: string;
};

export default function VideoLightbox({ videoUrl, poster }: Props) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    setMounted(true);
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close]);

  return (
    <>
      <button
        type="button"
        className="v5-section-2-icons"
        aria-label="Play video"
        onClick={() => setOpen(true)}
      >
        <span className="v5-section-2-icon back" aria-hidden="true" />
        <span className="v5-section-2-icon front" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </button>

      {open && (
        <div
          className={`v5-lightbox ${mounted ? "is-open" : ""}`}
          onClick={(e) => { if (e.target === e.currentTarget) close(); }}
          role="dialog"
          aria-modal="true"
          aria-label="Video player"
        >
          <div className="v5-lightbox-glass" aria-hidden="true" />
          <div className="v5-lightbox-panel">
            <button
              type="button"
              className="v5-lightbox-close"
              aria-label="Close video"
              onClick={close}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
            <div className="v5-lightbox-frame">
              {videoUrl ? (
                <video
                  controls
                  autoPlay
                  playsInline
                  poster={poster}
                  style={{ width: "100%", height: "100%", borderRadius: 18 }}
                >
                  <source src={videoUrl} />
                </video>
              ) : (
                <div className="v5-lightbox-placeholder">
                  <svg width="42" height="42" viewBox="0 0 24 24" fill="white">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  <p>Video coming soon</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
