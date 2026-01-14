"use client";

import Link from "next/link";
import { useState } from "react";

const footerNav = [
  { name: "Home", href: "/" },
  { name: "Platform", href: "/platform" },
  { name: "Solutions", href: "/solutions" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

const resourceNav = [
  { name: "Blog", href: "/blog" },
  { name: "Case Studies", href: "/case-studies" },
  { name: "Whitepapers", href: "/resources/whitepapers" },
  { name: "Webinars", href: "/webinars" },
];

const legalNav = [
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Terms of Service", href: "/terms" },
];

const socialLinks = [
  { name: "LinkedIn", href: "https://www.linkedin.com/company/108201443" },
  { name: "Instagram", href: "https://www.instagram.com/thearq.ai/" },
  { name: "YouTube", href: "https://www.youtube.com/@TheArqAI" },
  { name: "Twitter", href: "https://x.com/The_ArqAI" },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribeStatus, setSubscribeStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setSubscribeStatus("loading");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          source: "footer",
        }),
      });

      if (!response.ok) {
        throw new Error("Subscription failed");
      }

      setSubscribeStatus("success");
      setEmail("");
    } catch {
      setSubscribeStatus("error");
    }
  };

  return (
    <footer className="mxd-footer bg-base">
      {/* Large CTA Text */}
      <div className="container mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="mxd-footer__text-wrap mb-16 md:mb-24">
          <h2 className="text-display-xl md:text-[clamp(4rem,12vw,10rem)] font-display leading-[0.9] text-text-bright">
            Get in touch<span className="text-additional">.</span>
          </h2>
        </div>

        {/* Footer Grid */}
        <div className="mxd-footer__blocks grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Column 1 - Navigation */}
          <div className="card p-6 md:p-8 flex flex-col justify-between min-h-[300px]">
            <div>
              <h3 className="text-[28px] font-display text-text-bright mb-4">Navigation</h3>
              <nav className="footer-nav">
                <ul className="space-y-3">
                  {footerNav.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-body-md text-text-bright hover:text-accent transition-colors"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              <h3 className="text-[28px] font-display text-text-bright mt-6 mb-4">Resources</h3>
              <ul className="space-y-3">
                {resourceNav.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-body-md text-text-bright hover:text-accent transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6 pt-6 border-t border-stroke-muted">
              <ul className="flex flex-wrap gap-4">
                {legalNav.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-body-xs text-text-muted hover:text-accent transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Column 2 - Contact Info & Subscribe */}
          <div className="space-y-6">
            {/* Email */}
            <div className="card p-6">
              <div className="flex items-center gap-3 text-text-bright">
                <StarIcon />
                <a
                  href="mailto:hello@thearq.ai"
                  className="text-body-md hover:text-accent transition-colors"
                >
                  hello@thearq.ai
                </a>
              </div>
            </div>

            {/* Phone */}
            <div className="card p-6">
              <div className="flex items-center gap-3 text-text-bright">
                <StarIcon />
                <a
                  href="tel:+18565400149"
                  className="text-body-md hover:text-accent transition-colors"
                >
                  +1 856-540-0149
                </a>
              </div>
            </div>

            {/* Subscribe Form */}
            <div className="card card-filled p-6">
              <p className="text-body-sm font-medium text-text-bright mb-4">
                Subscribe to our insights:
              </p>
              {subscribeStatus === "success" ? (
                <p className="text-body-sm text-additional">
                  Done! Thanks for subscribing.
                </p>
              ) : subscribeStatus === "error" ? (
                <div>
                  <p className="text-body-sm text-red-500 mb-2">
                    Oops! Something went wrong.
                  </p>
                  <button
                    onClick={() => setSubscribeStatus("idle")}
                    className="text-body-xs text-accent hover:underline"
                  >
                    Try again
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your Email"
                    required
                    disabled={subscribeStatus === "loading"}
                    className="flex-1 px-4 py-2 rounded-lg bg-base border border-stroke-muted text-body-sm text-text-bright placeholder:text-text-muted-extra focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={subscribeStatus === "loading"}
                    className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-50"
                    aria-label="Subscribe"
                  >
                    {subscribeStatus === "loading" ? (
                      <svg className="w-4 h-4 text-base animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    ) : (
                      <svg
                        className="w-4 h-4 text-base"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
                      </svg>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Column 3 - Socials */}
          <div className="card p-6 md:p-8 flex flex-col justify-between min-h-[300px]">
            <div>
              <h3 className="text-[28px] font-display text-text-bright mb-6">
                Let&apos;s Socialize
              </h3>
              <ul className="space-y-3">
                {socialLinks.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-body-md text-text-muted hover:text-accent transition-colors"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-8 pt-6 border-t border-stroke-muted">
              <p className="text-body-xs text-text-muted">
                <a href="https://thearq.ai" className="hover:text-accent transition-colors">
                  ArqAI
                </a>
                {" "}&copy; {new Date().getFullYear()}
              </p>
            </div>
          </div>

          {/* Column 4 - Brand Statement */}
          <div className="card p-6 md:p-8 bg-accent flex flex-col justify-between min-h-[300px] footer-brand-card">
            <div>
              <p className="text-xl font-semibold mb-3 !text-white dark:!text-black">
                The Enterprise Foundry for Trusted AI
              </p>
              <p className="text-body-sm leading-snug !text-white/90 dark:!text-black/70">
                ArqAI enables regulated industries to build, run, and govern mission-critical agent workforces at production scale. Through three patented technologies, ArqAI compiles regulatory policies and security controls directly into AI infrastructure, eliminating the choice between speed and safety. Deployed across healthcare, financial services, manufacturing, and telecommunications, ArqAI delivers 30-day pilot-to-production deployments with cryptographic audit trails and adaptive performance monitoring built into every agent&apos;s DNA.
              </p>
            </div>
            <div className="mt-6">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-body-md font-medium !text-white dark:!text-black hover:opacity-80 transition-opacity"
              >
                Request a Demo
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* To Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-base-tint shadow-lg flex items-center justify-center text-text-bright hover:bg-accent hover:text-base transition-all z-40"
        aria-label="Back to top"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </button>
    </footer>
  );
}

// Star icon used in the original template
function StarIcon() {
  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fill="currentColor"
        d="M19.6,9.6c0,0-3,0-4,0c-0.4,0-1.8-0.2-1.8-0.2c-0.6-0.1-1.1-0.2-1.6-0.6c-0.5-0.3-0.9-0.8-1.2-1.2
        c-0.3-0.4-0.4-0.9-0.5-1.4c0,0-0.1-1.1-0.2-1.5c-0.1-1.1,0-4.4,0-4.4C10.4,0.2,10.2,0,10,0S9.6,0.2,9.6,0.4c0,0,0.1,3.3,0,4.4
        c0,0.4-0.2,1.5-0.2,1.5C9.4,6.7,9.2,7.2,9,7.6C8.7,8.1,8.2,8.5,7.8,8.9c-0.5,0.3-1,0.5-1.6,0.6c0,0-1.2,0.1-1.7,0.2
        c-1,0.1-4.2,0-4.2,0C0.2,9.6,0,9.8,0,10c0,0.2,0.2,0.4,0.4,0.4c0,0,3.1-0.1,4.2,0c0.4,0,1.7,0.2,1.7,0.2c0.6,0.1,1.1,0.2,1.6,0.6
        c0.4,0.3,0.8,0.7,1.1,1.1c0.3,0.5,0.5,1,0.6,1.6c0,0,0.1,1.3,0.2,1.7c0,1,0,4.1,0,4.1c0,0.2,0.2,0.4,0.4,0.4s0.4-0.2,0.4-0.4
        c0,0,0-3.1,0-4.1c0-0.4,0.2-1.7,0.2-1.7c0.1-0.6,0.2-1.1,0.6-1.6c0.3-0.4,0.7-0.8,1.1-1.1c0.5-0.3,1-0.5,1.6-0.6
        c0,0,1.3-0.1,1.8-0.2c1,0,4,0,4,0c0.2,0,0.4-0.2,0.4-0.4C20,9.8,19.8,9.6,19.6,9.6L19.6,9.6z"
      />
    </svg>
  );
}
