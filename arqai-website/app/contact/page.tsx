"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Section, LogoAccent } from "@/components/ui/Section";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    jobTitle: "",
    message: "",
    inquiryType: "general",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({
          name: "",
          email: "",
          company: "",
          jobTitle: "",
          message: "",
          inquiryType: "general",
        });
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
      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-12 overflow-hidden">
          <LogoAccent position="top-right" type="lime" size="lg" />

          <div className="container relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-5xl font-bold text-text-bright mb-6 leading-tight"
              >
                Let&apos;s Start a{" "}
                <span className="text-accent">Conversation</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-xl text-text-muted mb-8"
              >
                Whether you&apos;re ready to deploy enterprise AI or just exploring your options,
                we&apos;re here to help.
              </motion.p>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <Section>
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-1"
            >
              <h2 className="text-2xl font-bold text-text-bright mb-6">Get in Touch</h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-additional flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-text-bright" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h5 className="text-lg font-semibold text-text-bright dark:text-[var(--arq-blue)] mb-1">Email Us</h5>
                    <a href="mailto:hello@thearq.ai" className="text-text-muted hover:text-accent transition-colors">
                      hello@thearq.ai
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-additional flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-text-bright" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h5 className="text-lg font-semibold text-text-bright dark:text-[var(--arq-blue)] mb-1">Headquarters</h5>
                    <p className="text-text-muted">
                      United States
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="mt-8 pt-8 border-t border-stroke-muted">
                <h5 className="text-lg font-semibold text-text-bright dark:text-[var(--arq-blue)] mb-4">Follow Us</h5>
                <div className="flex gap-4">
                  <a
                    href="https://linkedin.com/company/arqai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-base-tint border border-stroke-muted flex items-center justify-center text-text-muted hover:text-accent hover:border-accent transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                  <a
                    href="https://twitter.com/arqai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-base-tint border border-stroke-muted flex items-center justify-center text-text-muted hover:text-accent hover:border-accent transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:col-span-2"
            >
              <div className="bg-base-tint rounded-2xl p-8 border border-stroke-muted">
                <h2 className="text-2xl font-bold text-text-bright mb-6">Send Us a Message</h2>

                {submitStatus === "success" ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-text-bright mb-2">Message Sent!</h3>
                    <p className="text-text-muted mb-6">
                      Thank you for reaching out. We&apos;ll get back to you within 24 hours.
                    </p>
                    <button
                      onClick={() => setSubmitStatus("idle")}
                      className="text-accent hover:underline"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-text-bright mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border border-stroke-muted bg-base text-text-bright placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                          placeholder="John Smith"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-text-bright mb-2">
                          Work Email *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border border-stroke-muted bg-base text-text-bright placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                          placeholder="john@company.com"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="company" className="block text-sm font-medium text-text-bright mb-2">
                          Company *
                        </label>
                        <input
                          type="text"
                          id="company"
                          name="company"
                          required
                          value={formData.company}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border border-stroke-muted bg-base text-text-bright placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                          placeholder="Acme Inc."
                        />
                      </div>
                      <div>
                        <label htmlFor="jobTitle" className="block text-sm font-medium text-text-bright mb-2">
                          Job Title *
                        </label>
                        <input
                          type="text"
                          id="jobTitle"
                          name="jobTitle"
                          required
                          value={formData.jobTitle}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border border-stroke-muted bg-base text-text-bright placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                          placeholder="VP of Engineering"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="inquiryType" className="block text-sm font-medium text-text-bright mb-2">
                        I&apos;m interested in...
                      </label>
                      <select
                        id="inquiryType"
                        name="inquiryType"
                        value={formData.inquiryType}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-stroke-muted bg-base text-text-bright focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                      >
                        <option value="general">General Inquiry</option>
                        <option value="demo">Scheduling a Demo</option>
                        <option value="partnership">Partnership Opportunities</option>
                        <option value="pricing">Pricing Information</option>
                        <option value="support">Technical Support</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-text-bright mb-2">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-stroke-muted bg-base text-text-bright placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all resize-none"
                        placeholder="Tell us about your AI governance needs..."
                      />
                    </div>

                    {submitStatus === "error" && (
                      <div className="p-4 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
                        Something went wrong. Please try again or email us directly.
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full md:w-auto px-8 py-4 bg-[var(--arq-blue)] text-white dark:bg-[var(--arq-lime)] dark:text-black font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Sending...
                        </span>
                      ) : (
                        "Send Message"
                      )}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </Section>

        {/* CTA Section */}
        <Section background="dark">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to See ArqAI in Action?
            </h2>
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
              Schedule a personalized demo and discover how to build, run, and govern
              your AI workforce with confidence.
            </p>
            <a
              href="/demo"
              className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
            >
              Schedule a Demo
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
