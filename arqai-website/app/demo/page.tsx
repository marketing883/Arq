"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Section, LogoAccent } from "@/components/ui/Section";
import { CheckIcon } from "@/components/ui/Icons";

export default function DemoPage() {
  const [isCalLoaded, setIsCalLoaded] = useState(false);

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
                className="text-4xl md:text-5xl font-bold text-[var(--arq-black)] mb-6 leading-tight"
              >
                See the ArqAI Command Platform{" "}
                <span className="text-[var(--arq-blue)]">in Action</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-xl text-[var(--arq-gray-600)] mb-8"
              >
                Schedule a personalized demo with our team to discover how you can
                build, run, and govern a trusted AI workforce.
              </motion.p>
            </div>
          </div>
        </section>

        {/* Demo Booking Section */}
        <Section>
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Benefits Column */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold mb-6">What to Expect</h2>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-[var(--arq-lime)] flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-[var(--arq-black)]">1</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Discovery Call</h3>
                    <p className="text-[var(--arq-gray-600)]">
                      We&apos;ll learn about your specific AI governance challenges and compliance requirements.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-[var(--arq-lime)] flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-[var(--arq-black)]">2</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Platform Walkthrough</h3>
                    <p className="text-[var(--arq-gray-600)]">
                      See CAPC, TAO, and ODA-RAG in action with use cases relevant to your industry.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-[var(--arq-lime)] flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-[var(--arq-black)]">3</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Custom Roadmap</h3>
                    <p className="text-[var(--arq-gray-600)]">
                      Get a tailored implementation plan based on your organization&apos;s needs.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-10 p-6 glass-card">
                <h3 className="text-lg font-semibold mb-4">What Our Customers Say</h3>
                <blockquote className="text-[var(--arq-gray-600)] italic mb-4">
                  &ldquo;The demo was an eye-opener. ArqAI is solving the problems that
                  keep us awake at night.&rdquo;
                </blockquote>
                <p className="text-sm text-[var(--arq-gray-500)]">
                  - CISO, Fortune 500 Financial Services Company
                </p>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Trusted by Leaders In</h3>
                <div className="flex flex-wrap gap-4">
                  {["Financial Services", "Insurance", "Healthcare", "Enterprise Tech"].map(
                    (industry) => (
                      <span
                        key={industry}
                        className="px-3 py-1 bg-[var(--arq-gray-100)] rounded-full text-sm text-[var(--arq-gray-600)]"
                      >
                        {industry}
                      </span>
                    )
                  )}
                </div>
              </div>
            </motion.div>

            {/* Cal.com Embed Column */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="glass-card p-6"
            >
              <h2 className="text-xl font-bold mb-4 text-center">
                Book Your Demo
              </h2>

              {/* Cal.com Embed */}
              <div className="min-h-[600px] relative">
                {!isCalLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-8 h-8 border-2 border-[var(--arq-blue)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                      <p className="text-[var(--arq-gray-500)]">Loading calendar...</p>
                    </div>
                  </div>
                )}
                <iframe
                  src="https://cal.com/habib-mehmoodi-rj394w/30min?embed=true&theme=light"
                  width="100%"
                  height="600"
                  frameBorder="0"
                  onLoad={() => setIsCalLoaded(true)}
                  className={`rounded-lg transition-opacity duration-300 ${
                    isCalLoaded ? "opacity-100" : "opacity-0"
                  }`}
                  title="Book a demo with ArqAI"
                />
              </div>

              <div className="mt-6 pt-6 border-t border-[var(--arq-gray-200)]">
                <div className="flex items-center gap-2 text-sm text-[var(--arq-gray-600)]">
                  <CheckIcon size={16} className="text-[var(--arq-blue)]" />
                  <span>30-minute call</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[var(--arq-gray-600)] mt-2">
                  <CheckIcon size={16} className="text-[var(--arq-blue)]" />
                  <span>No commitment required</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[var(--arq-gray-600)] mt-2">
                  <CheckIcon size={16} className="text-[var(--arq-blue)]" />
                  <span>Tailored to your industry</span>
                </div>
              </div>
            </motion.div>
          </div>
        </Section>

        {/* FAQ Section */}
        <Section background="muted">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">
              Frequently Asked Questions
            </h2>

            <div className="space-y-6">
              {[
                {
                  q: "How long does implementation typically take?",
                  a: "Implementation timelines vary based on complexity, but typically range from 30-90 days for initial deployment. Our team will provide a detailed timeline during your demo.",
                },
                {
                  q: "What compliance frameworks do you support?",
                  a: "We support HIPAA, GDPR, CCPA, SOX, FINRA, NAIC, EU AI Act, NIST AI RMF, and more. Our platform is designed to be configurable for your specific regulatory requirements.",
                },
                {
                  q: "Can ArqAI integrate with our existing AI infrastructure?",
                  a: "Yes, ArqAI is designed to work as a governance layer on top of your existing AI infrastructure. We integrate with major cloud providers, LLM providers, and enterprise tools.",
                },
                {
                  q: "Is there a minimum company size requirement?",
                  a: "ArqAI is built for enterprises with significant AI governance needs. We typically work with organizations deploying AI at scale in regulated industries.",
                },
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl p-6 shadow-sm"
                >
                  <h3 className="text-base font-semibold mb-2">{faq.q}</h3>
                  <p className="text-[var(--arq-gray-600)]">{faq.a}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
