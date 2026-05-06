"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

function StarIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
    >
      <path d="M19.6,9.6h-3.9c-.4,0-1.8-.2-1.8-.2-.6,0-1.1-.2-1.6-.6-.5-.3-.9-.8-1.2-1.2-.3-.4-.4-.9-.5-1.4,0,0,0-1.1-.2-1.5V.4c0-.2-.2-.4-.4-.4s-.4.2-.4.4v4.4c0,.4-.2,1.5-.2,1.5,0,.5-.2,1-.5,1.4-.3.5-.7.9-1.2,1.2s-1,.5-1.6.6c0,0-1.2,0-1.7.2H.4c-.2,0-.4.2-.4.4s.2.4.4.4h4.1c.4,0,1.7.2,1.7.2.6,0,1.1.2,1.6.6.4.3.8.7,1.1,1.1.3.5.5,1,.6,1.6,0,0,0,1.3.2,1.7v4.1c0,.2.2.4.4.4s.4-.2.4-.4v-4.1c0-.4.2-1.7.2-1.7,0-.6.2-1.1.6-1.6.3-.4.7-.8,1.1-1.1.5-.3,1-.5,1.6-.6,0,0,1.3,0,1.8-.2h3.9c.2,0,.4-.2.4-.4s-.2-.4-.4-.4h0Z" />
    </svg>
  );
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    company: "",
    message: "",
    website_url: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [formLoadedAt, setFormLoadedAt] = useState(0);

  useEffect(() => {
    setFormLoadedAt(Date.now());
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          company: formData.company,
          message: formData.message,
          inquiryType: "general",
          website_url: formData.website_url,
          _formLoadedAt: formLoadedAt,
        }),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({ fullName: "", email: "", company: "", message: "", website_url: "" });
        setFormLoadedAt(Date.now());
      } else {
        setSubmitStatus("error");
      }
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <>
      <Header />

      <main className="bg-base">
        {/* Hero */}
        <section className="pt-32 md:pt-40 pb-16 relative overflow-hidden">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <p className="flex items-center gap-2 text-body-sm text-accent mb-6 uppercase tracking-wider font-medium">
                  <StarIcon className="w-4 h-4" />
                  Contact
                </p>

                <h1 className="text-display-xl md:text-[clamp(3rem,5vw,4.5rem)] font-display leading-[1.1] text-text-bright mb-6">
                  Talk to us.
                </h1>

                <p className="text-body-lg text-text-medium leading-relaxed">
                  Tell us what your operation needs. We&apos;ll tell you what&apos;s honestly possible. In plain language. Without a deck.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-2xl shadow-accent/10"
              >
                <Image
                  src="/img/cta/cta-img-02.webp"
                  alt=""
                  fill
                  priority
                  sizes="(min-width:1024px) 50vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-accent/20 via-transparent to-transparent" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* General inquiries + form */}
        <section className="py-section bg-base-tint">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
              {/* Left: General inquiries info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="lg:col-span-5 lg:sticky lg:top-32"
              >
                <p className="flex items-center gap-2 text-body-sm text-accent mb-4 uppercase tracking-wider font-medium">
                  <StarIcon className="w-4 h-4" />
                  General inquiries
                </p>
                <h2 className="text-display-md font-display text-text-bright mb-6">
                  For anything else, write to us.
                </h2>
                <a
                  href="mailto:hello@thearq.ai"
                  className="inline-flex items-center gap-2 text-xl md:text-2xl text-accent font-medium hover:underline mb-10"
                >
                  hello@thearq.ai
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>

                <div className="space-y-5 pt-6 border-t border-stroke-muted">
                  <div>
                    <p className="text-body-xs text-accent uppercase tracking-wider mb-2">
                      Engagements and demos
                    </p>
                    <Link
                      href="/engage-us"
                      className="text-body-md text-text-bright hover:text-accent transition-colors"
                    >
                      Bring your workflow &rarr;
                    </Link>
                  </div>
                  <div>
                    <p className="text-body-xs text-accent uppercase tracking-wider mb-2">
                      Partnerships and design partners
                    </p>
                    <a
                      href="mailto:partnerships@aciinfotech.net"
                      className="text-body-md text-text-bright hover:text-accent transition-colors"
                    >
                      partnerships@aciinfotech.net
                    </a>
                  </div>
                  <div>
                    <p className="text-body-xs text-accent uppercase tracking-wider mb-2">
                      Press and analyst
                    </p>
                    <a
                      href="mailto:marketing@aciinfotech.net"
                      className="text-body-md text-text-bright hover:text-accent transition-colors"
                    >
                      marketing@aciinfotech.net
                    </a>
                  </div>
                  <div>
                    <p className="text-body-xs text-accent uppercase tracking-wider mb-2">
                      Careers
                    </p>
                    <Link
                      href="/careers"
                      className="text-body-md text-text-bright hover:text-accent transition-colors"
                    >
                      See open roles &rarr;
                    </Link>
                  </div>
                </div>
              </motion.div>

              {/* Right: Contact form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="lg:col-span-7"
              >
                {submitStatus === "success" ? (
                  <div className="card p-8 md:p-12 text-center">
                    <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mx-auto mb-5">
                      <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-display font-semibold text-text-bright mb-3">
                      Thanks. We&apos;ll be in touch.
                    </h3>
                    <p className="text-body-md text-text-muted">
                      A senior on our team will reach out within one business day.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="card p-6 md:p-10 relative">
                    {/* Honeypot */}
                    <div className="absolute left-[-9999px] opacity-0 pointer-events-none" aria-hidden="true" tabIndex={-1}>
                      <input
                        type="text"
                        name="website_url"
                        value={formData.website_url}
                        onChange={handleChange}
                        tabIndex={-1}
                        autoComplete="off"
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5 mb-5">
                      <div>
                        <label htmlFor="fullName" className="block text-body-sm font-medium text-text-bright mb-2">
                          Full name *
                        </label>
                        <input
                          type="text"
                          id="fullName"
                          name="fullName"
                          required
                          value={formData.fullName}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg bg-base border border-stroke-muted text-text-bright placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-body-sm font-medium text-text-bright mb-2">
                          Work email *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg bg-base border border-stroke-muted text-text-bright placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                      </div>
                    </div>

                    <div className="mb-5">
                      <label htmlFor="company" className="block text-body-sm font-medium text-text-bright mb-2">
                        Company
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg bg-base border border-stroke-muted text-text-bright placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                    </div>

                    <div className="mb-6">
                      <label htmlFor="message" className="block text-body-sm font-medium text-text-bright mb-2">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        required
                        placeholder="Tell us a little about what you&apos;re trying to do."
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg bg-base border border-stroke-muted text-text-bright placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                      />
                    </div>

                    {submitStatus === "error" && (
                      <div className="mb-5 p-4 bg-red-100 dark:bg-red-900/20 rounded-lg">
                        <p className="text-sm text-red-600 dark:text-red-400">
                          Something went wrong. Please try again or email us at{" "}
                          <a href="mailto:hello@thearq.ai" className="underline">
                            hello@thearq.ai
                          </a>
                          .
                        </p>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full btn bg-accent text-white hover:bg-accent/90 disabled:opacity-50"
                    >
                      {isSubmitting ? "Sending..." : "Send"}
                    </button>

                    <p className="mt-4 text-body-xs text-text-muted text-center">
                      We use this only to follow up. See our{" "}
                      <Link href="/privacy" className="text-accent hover:underline">
                        privacy notice
                      </Link>
                      .
                    </p>
                  </form>
                )}
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
