"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const values = [
  {
    title: "Trust-First",
    description: "Every feature we build starts with the question: 'How does this earn and maintain trust?'",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: "Enterprise-Grade",
    description: "We build for the world's most demanding environments. Security, compliance, and scale are non-negotiable.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    title: "Innovation with Integrity",
    description: "We push the boundaries of what's possible while maintaining the highest ethical standards.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    title: "Customer Obsession",
    description: "Our customers' success is our success. We go above and beyond to ensure they achieve their goals.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
];

const leadership = [
  { name: "CEO", role: "Chief Executive Officer", bio: "20+ years in enterprise software" },
  { name: "CTO", role: "Chief Technology Officer", bio: "Former AI research lead at Fortune 100" },
  { name: "CPO", role: "Chief Product Officer", bio: "Built products used by 500M+ users" },
  { name: "CISO", role: "Chief Information Security Officer", bio: "Former federal cybersecurity advisor" },
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="bg-base">
        {/* Hero Section */}
        <section className="pt-40 pb-20 bg-base-tint">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto text-center"
            >
              <span className="inline-block px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-semibold mb-6">
                About ArqAI
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-text-bright mb-6 leading-tight">
                Building the Foundation for
                <span className="text-accent"> Trusted AI</span>
              </h1>
              <p className="text-xl text-text-muted max-w-2xl mx-auto">
                We&apos;re on a mission to make enterprise AI safe, auditable, and production-ready.
                Our platform enables organizations to deploy AI with confidence.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Mission & Vision Section */}
        <section className="py-20 bg-base">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              {/* Mission */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-16"
              >
                <span className="inline-block px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-semibold mb-4">
                  Our Mission
                </span>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-text-bright mb-6">
                  Empowering Enterprises to Harness AI with Confidence
                </h2>
                <p className="text-lg text-text-muted">
                  We exist to bridge the gap between AI&apos;s transformative potential and the rigorous
                  governance enterprises demand. Our mission is to provide the infrastructure that makes
                  AI deployment safe, auditable, and aligned with business objectives—so organizations
                  can innovate boldly without compromising on security, compliance, or control.
                </p>
              </motion.div>

              {/* Vision */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-16"
              >
                <span className="inline-block px-4 py-2 rounded-full bg-additional/20 text-additional text-sm font-semibold mb-4">
                  Our Vision
                </span>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-text-bright mb-6">
                  A World Where AI Works for Everyone
                </h2>
                <p className="text-lg text-text-muted">
                  We envision a future where every enterprise can deploy AI agents that are as trustworthy
                  as their best employees—transparent in their reasoning, accountable for their actions,
                  and aligned with organizational values. A future where &quot;Shadow AI&quot; is a relic of the past,
                  and every AI interaction strengthens rather than undermines trust.
                </p>
              </motion.div>

              {/* Origin Story */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <span className="inline-block px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-semibold mb-4">
                  Our Story
                </span>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-text-bright mb-6">
                  Born from a Real Problem
                </h2>
                <div className="space-y-6 text-lg text-text-muted">
                  <p>
                    ArqAI was founded in 2023 by a team of enterprise architects and AI researchers who
                    witnessed firsthand the chaos unfolding inside Fortune 500 companies. Teams were
                    deploying AI tools in silos—some sanctioned, many not. Security teams were blindsided.
                    Compliance officers were scrambling. And executives were asking a question no one
                    could answer: &quot;What is AI actually doing in our organization?&quot;
                  </p>
                  <p>
                    We knew there had to be a better way. Not another AI tool, but a governance layer—an
                    &quot;architecture&quot; (hence Arq) that could bring order to AI chaos while preserving the
                    speed and innovation enterprises needed to compete.
                  </p>
                  <p>
                    Today, ArqAI serves organizations across financial services, healthcare, and technology,
                    helping them transform AI from a risk factor into a competitive advantage. We&apos;re
                    proud to be building the foundation for the next era of enterprise technology—one
                    where AI and trust go hand in hand.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-base-tint">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="inline-block px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-semibold mb-4">
                Our Values
              </span>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-text-bright">
                What We Stand For
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="card text-center"
                >
                  <div className="w-16 h-16 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4 text-accent">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-display font-semibold text-text-bright mb-3">
                    {value.title}
                  </h3>
                  <p className="text-text-muted">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Leadership Section - Temporarily hidden until team photos are ready
        <section className="py-20 bg-base">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="inline-block px-4 py-2 rounded-full bg-additional/20 text-additional text-sm font-semibold mb-4">
                Leadership
              </span>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-text-bright">
                Meet the Team
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {leadership.map((person, index) => (
                <motion.div
                  key={person.role}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-32 h-32 rounded-full bg-base-tint mx-auto mb-4 flex items-center justify-center border border-stroke-muted">
                    <span className="text-2xl font-bold text-text-muted">{person.name}</span>
                  </div>
                  <h3 className="text-lg font-display font-semibold text-text-bright">
                    {person.role}
                  </h3>
                  <p className="text-sm text-text-muted mt-1">{person.bio}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        */}

        {/* CTA Section */}
        <section className="py-20 bg-accent">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
                Ready to Transform Your AI Strategy?
              </h2>
              <p className="text-xl text-white/80 mb-8">
                Join the enterprises that trust ArqAI to power their AI workforce.
              </p>
              <Link
                href="/demo"
                className="inline-flex items-center gap-2 px-8 py-4 bg-additional text-black font-bold rounded-lg hover:opacity-90 transition-opacity"
              >
                Request a Demo
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
