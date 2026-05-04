"use client";

import { useState, useEffect } from "react";
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

export default function DemoPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    company: "",
    role: "",
    industry: "",
    product: "",
    notes: "",
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
          jobTitle: formData.role,
          message: `Industry: ${formData.industry}\nProduct/Workflow: ${formData.product}\n\n${formData.notes}`,
          inquiryType: "demo",
          website_url: formData.website_url,
          _formLoadedAt: formLoadedAt,
        }),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({
          fullName: "",
          email: "",
          company: "",
          role: "",
          industry: "",
          product: "",
          notes: "",
          website_url: "",
        });
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
        {/* Hero Section */}
        <section className="pt-32 md:pt-40 pb-16 relative overflow-hidden">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="grid lg:grid-cols-5 gap-10 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-3"
              >
                <p className="flex items-center gap-2 text-body-sm text-accent mb-6 uppercase tracking-wider font-medium">
                  <StarIcon className="w-4 h-4" />
                  Engage us
                </p>

                <h1 className="text-display-xl md:text-[clamp(2.5rem,5vw,4rem)] font-display leading-[1.1] text-text-bright mb-6">
                  Tell us what your operation needs.
                </h1>

                <p className="text-body-lg text-text-medium leading-relaxed mb-8">
                  We&apos;ll tell you what&apos;s honestly possible. In plain language. Without a deck. Bring a sample of your data and we&apos;ll show you what changes when ArqAI Labs is in your operation.
                </p>

                <ul className="space-y-3 text-body-md text-text-medium">
                  {[
                    "Plain-language read on whether your workflow fits",
                    "Concrete deployment plan with a committed timeline",
                    "Senior engineering team in the room from day one",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-1 w-5 h-5 rounded-full bg-accent/15 flex items-center justify-center shrink-0">
                        <svg className="w-3 h-3 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="lg:col-span-2 relative"
              >
                <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-accent/10 bg-base-opp/5 p-1">
                  <div className="rounded-xl overflow-hidden bg-base-opp">
                    <video
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      className="w-full h-auto"
                      poster="/img/demo/arqai-foundry-v2-poster.webp"
                    >
                      <source src="/video/ArqAI-foundry-v2.webm" type="video/webm" />
                      <source src="/video/ArqAI-foundry-v2.mp4" type="video/mp4" />
                    </video>
                  </div>
                </div>
                <div className="absolute -bottom-6 -left-6 hidden md:block w-24 h-24 lg:w-28 lg:h-28 animate-rotate-slow opacity-90">
                  <Image
                    src="/img/hero/03_hero-img.webp"
                    alt=""
                    width={120}
                    height={120}
                    className="w-full h-full object-contain"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section className="py-section bg-base-tint">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
              {submitStatus === "success" ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card p-8 md:p-12 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mx-auto mb-6">
                    <svg
                      className="w-8 h-8 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-display font-semibold text-text-bright mb-4">
                    Thanks. We&apos;ll be in touch.
                  </h2>
                  <p className="text-body-md text-text-muted mb-6">
                    A senior on our team will reach out within one business day.
                  </p>
                  <Link href="/" className="btn btn-outline">
                    Back to home
                  </Link>
                </motion.div>
              ) : (
                <motion.form
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  onSubmit={handleSubmit}
                  className="card p-8 md:p-12"
                >
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

                  <div className="grid gap-6">
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

                    <div>
                      <label htmlFor="company" className="block text-body-sm font-medium text-text-bright mb-2">
                        Company *
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        required
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg bg-base border border-stroke-muted text-text-bright placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                    </div>

                    <div>
                      <label htmlFor="role" className="block text-body-sm font-medium text-text-bright mb-2">
                        Role *
                      </label>
                      <input
                        type="text"
                        id="role"
                        name="role"
                        required
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg bg-base border border-stroke-muted text-text-bright placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                    </div>

                    <div>
                      <label htmlFor="industry" className="block text-body-sm font-medium text-text-bright mb-2">
                        Industry *
                      </label>
                      <select
                        id="industry"
                        name="industry"
                        required
                        value={formData.industry}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg bg-base border border-stroke-muted text-text-bright focus:outline-none focus:ring-2 focus:ring-accent"
                      >
                        <option value="">Select industry</option>
                        <option value="healthcare-payer">Healthcare payer</option>
                        <option value="pc-insurance">P&C insurance</option>
                        <option value="banking">Banking</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="product" className="block text-body-sm font-medium text-text-bright mb-2">
                        Which product or workflow are you exploring? *
                      </label>
                      <input
                        type="text"
                        id="product"
                        name="product"
                        required
                        placeholder="e.g., ArqFWA, claims triage, custom workflow"
                        value={formData.product}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg bg-base border border-stroke-muted text-text-bright placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                    </div>

                    <div>
                      <label htmlFor="notes" className="block text-body-sm font-medium text-text-bright mb-2">
                        Anything else you&apos;d like us to know?
                      </label>
                      <textarea
                        id="notes"
                        name="notes"
                        rows={4}
                        value={formData.notes}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg bg-base border border-stroke-muted text-text-bright placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                      />
                    </div>
                  </div>

                  {submitStatus === "error" && (
                    <div className="mt-6 p-4 bg-red-100 dark:bg-red-900/20 rounded-lg">
                      <p className="text-sm text-red-600 dark:text-red-400">
                        Something went wrong. Please try again or email us at hello@thearq.ai.
                      </p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-8 w-full btn bg-accent text-white hover:bg-accent/90 disabled:opacity-50"
                  >
                    {isSubmitting ? "Sending..." : "Send"}
                  </button>

                  <p className="mt-4 text-body-xs text-text-muted text-center">
                    We use this information only to follow up with you. See our{" "}
                    <Link href="/privacy" className="text-accent hover:underline">
                      privacy notice
                    </Link>
                    .
                  </p>
                </motion.form>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
