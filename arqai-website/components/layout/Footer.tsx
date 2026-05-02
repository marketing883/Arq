"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { trackNewsletterSignup } from "@/lib/analytics/gtm-events";

const productsNav = [
  { name: "ArqFWA", href: "/products/arqfwa" },
  { name: "ArqClaims", href: "/products/arqclaims" },
  { name: "ArqBanker", href: "/products/arqbanker" },
  { name: "Roadmap", href: "/products/roadmap" },
];

const solutionsNav = [
  { name: "Healthcare payers", href: "/solutions/healthcare-payers" },
  { name: "P&C insurance", href: "/solutions/insurance-carriers" },
  { name: "Banks and FIs", href: "/solutions/banking" },
];

const companyNav = [
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "How it works", href: "/how-it-works" },
  { name: "Trust", href: "/trust" },
  { name: "Contact", href: "/contact" },
];

const resourceNav = [
  { name: "Blog", href: "/blog" },
  { name: "Case Studies", href: "/case-studies" },
  { name: "Whitepapers", href: "/resources/whitepapers" },
];

const legalNav = [
  { name: "Privacy notice", href: "/privacy" },
  { name: "Terms of service", href: "/terms" },
  { name: "Cookie notice", href: "/cookies" },
  { name: "Responsible AI policy", href: "/responsible-ai" },
];

const socialLinks = [
  { name: "LinkedIn", href: "https://www.linkedin.com/company/108201443" },
  { name: "Twitter", href: "https://x.com/The_ArqAI" },
  { name: "YouTube", href: "https://www.youtube.com/@TheArqAI" },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [subscribeStatus, setSubscribeStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [formLoadedAt, setFormLoadedAt] = useState(0);

  useEffect(() => {
    setFormLoadedAt(Date.now());
  }, []);

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
          website_url: websiteUrl,
          _formLoadedAt: formLoadedAt,
        }),
      });

      if (!response.ok) {
        throw new Error("Subscription failed");
      }

      trackNewsletterSignup("footer");
      setSubscribeStatus("success");
      setEmail("");
      setFormLoadedAt(Date.now());
    } catch {
      setSubscribeStatus("error");
    }
  };

  return (
    <footer className="bg-base border-t border-stroke-muted">
      <div className="container mx-auto px-4 md:px-6 py-16 md:py-20">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 lg:gap-12 mb-16">
          {/* Products */}
          <div>
            <h3 className="text-body-sm font-semibold text-text-bright uppercase tracking-wider mb-4">
              Products
            </h3>
            <ul className="space-y-3">
              {productsNav.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-body-sm text-text-muted hover:text-accent transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h3 className="text-body-sm font-semibold text-text-bright uppercase tracking-wider mb-4">
              Solutions
            </h3>
            <ul className="space-y-3">
              {solutionsNav.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-body-sm text-text-muted hover:text-accent transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-body-sm font-semibold text-text-bright uppercase tracking-wider mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              {companyNav.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-body-sm text-text-muted hover:text-accent transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-body-sm font-semibold text-text-bright uppercase tracking-wider mb-4">
              Resources
            </h3>
            <ul className="space-y-3">
              {resourceNav.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-body-sm text-text-muted hover:text-accent transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Subscribe */}
          <div className="col-span-2">
            <h3 className="text-body-sm font-semibold text-text-bright uppercase tracking-wider mb-4">
              Stay updated
            </h3>
            {subscribeStatus === "success" ? (
              <p className="text-body-sm text-accent">
                Thanks for subscribing.
              </p>
            ) : subscribeStatus === "error" ? (
              <div>
                <p className="text-body-sm text-red-500 mb-2">
                  Something went wrong.
                </p>
                <button
                  onClick={() => setSubscribeStatus("idle")}
                  className="text-body-xs text-accent hover:underline"
                >
                  Try again
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2 relative">
                <div className="absolute left-[-9999px] opacity-0 pointer-events-none" aria-hidden="true" tabIndex={-1}>
                  <input
                    type="text"
                    name="website_url"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your work email"
                  required
                  disabled={subscribeStatus === "loading"}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-base-tint border border-stroke-muted text-body-sm text-text-bright placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={subscribeStatus === "loading"}
                  className="px-4 py-2.5 rounded-lg bg-accent text-white font-medium hover:bg-accent/90 transition-colors disabled:opacity-50"
                >
                  {subscribeStatus === "loading" ? "..." : "Subscribe"}
                </button>
              </form>
            )}

            {/* Social Links */}
            <div className="mt-6 flex gap-4">
              {socialLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-body-sm text-text-muted hover:text-accent transition-colors"
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-accent rounded-2xl p-8 md:p-10 mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl md:text-3xl font-display font-semibold text-white mb-2">
                Tell us your workflow.
              </h3>
              <p className="text-white/80">
                We will tell you what is honestly possible.
              </p>
            </div>
            <Link
              href="/demo"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-accent font-semibold rounded-lg hover:shadow-lg transition-all shrink-0"
            >
              Book a demo
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 17L17 7M17 7H7M17 7v10"
                />
              </svg>
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-stroke-muted">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            {/* ACI Infotech Attribution */}
            <div className="text-body-sm text-text-muted">
              <p className="mb-2">
                ArqAI Labs is the AI products and services arm of{" "}
                <a
                  href="https://aciinfotech.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-bright hover:text-accent transition-colors"
                >
                  ACI Infotech
                </a>
                .
              </p>
              <p>
                &copy; {new Date().getFullYear()} ArqAI Labs. All rights reserved.
              </p>
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap gap-4 md:gap-6">
              {legalNav.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-body-xs text-text-muted hover:text-accent transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-base-tint shadow-lg flex items-center justify-center text-text-bright hover:bg-accent hover:text-white transition-all z-40"
        aria-label="Back to top"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </button>
    </footer>
  );
}
