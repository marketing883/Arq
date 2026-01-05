"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { StatsSection, aboutStats } from "@/components/sections/StatsSection";

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
    description: "We build for the world's most demanding environments—security, compliance, and scale are non-negotiable.",
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
        <section className="pt-40 pb-20 bg-gradient-to-br from-[var(--arq-gray-50)] to-white dark:from-[var(--arq-gray-900)] dark:to-[var(--arq-gray-800)]">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto text-center"
            >
              <span className="inline-block px-4 py-2 rounded-full bg-[var(--arq-blue)]/10 text-[var(--arq-blue)] text-sm font-semibold mb-6">
                About ArqAI
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--arq-black)] dark:text-white mb-6 leading-tight">
                Building the Foundation for
                <span className="text-[var(--arq-blue)]"> Trusted AI</span>
              </h1>
              <p className="text-xl text-[var(--arq-gray-600)] dark:text-[var(--arq-gray-400)] max-w-2xl mx-auto">
                We&apos;re on a mission to make enterprise AI safe, auditable, and production-ready.
                Our platform enables organizations to deploy AI with confidence.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <StatsSection stats={aboutStats} />

        {/* Mission Section */}
        <section className="py-20 bg-white dark:bg-[var(--arq-gray-800)]">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <span className="inline-block px-4 py-2 rounded-full bg-[var(--arq-lime)]/20 text-[var(--arq-lime-dark)] dark:text-[var(--arq-lime)] text-sm font-semibold mb-4">
                  Our Mission
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-[var(--arq-black)] dark:text-white mb-6">
                  From AI Chaos to AI Command
                </h2>
                <p className="text-lg text-[var(--arq-gray-600)] dark:text-[var(--arq-gray-400)] mb-6">
                  Enterprises are racing to deploy AI, but this rapid adoption has created a hidden crisis
                  of &quot;Shadow AI&quot;—uncontrolled agents, disconnected tools, and a lack of oversight that
                  creates unacceptable risks.
                </p>
                <p className="text-lg text-[var(--arq-gray-600)] dark:text-[var(--arq-gray-400)]">
                  ArqAI exists to solve this problem. We provide the governance fabric that makes
                  enterprise AI safe, auditable, and production-ready—so organizations can innovate
                  without compromising on security or compliance.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="aspect-square bg-gradient-to-br from-[var(--arq-blue)] to-[var(--arq-blue-dark)] rounded-2xl flex items-center justify-center">
                  <Image
                    src="/img/hero/arq-wf.png"
                    alt="ArqAI Platform"
                    width={400}
                    height={400}
                    className="w-3/4 h-auto"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-[var(--arq-gray-50)] dark:bg-[var(--arq-gray-900)]">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="inline-block px-4 py-2 rounded-full bg-[var(--arq-blue)]/10 text-[var(--arq-blue)] text-sm font-semibold mb-4">
                Our Values
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--arq-black)] dark:text-white">
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
                  className="bg-white dark:bg-[var(--arq-gray-800)] rounded-2xl p-8 text-center"
                >
                  <div className="w-16 h-16 rounded-xl bg-[var(--arq-blue)]/10 flex items-center justify-center mx-auto mb-4 text-[var(--arq-blue)]">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-[var(--arq-black)] dark:text-white mb-3">
                    {value.title}
                  </h3>
                  <p className="text-[var(--arq-gray-600)] dark:text-[var(--arq-gray-400)]">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Leadership Section */}
        <section className="py-20 bg-white dark:bg-[var(--arq-gray-800)]">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="inline-block px-4 py-2 rounded-full bg-[var(--arq-lime)]/20 text-[var(--arq-lime-dark)] dark:text-[var(--arq-lime)] text-sm font-semibold mb-4">
                Leadership
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--arq-black)] dark:text-white">
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
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[var(--arq-gray-200)] to-[var(--arq-gray-300)] dark:from-[var(--arq-gray-700)] dark:to-[var(--arq-gray-600)] mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-[var(--arq-gray-500)]">{person.name}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-[var(--arq-black)] dark:text-white">
                    {person.role}
                  </h3>
                  <p className="text-sm text-[var(--arq-gray-500)] mt-1">{person.bio}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-[var(--arq-blue)] to-[var(--arq-blue-dark)]">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Transform Your AI Strategy?
              </h2>
              <p className="text-xl text-white/80 mb-8">
                Join the enterprises that trust ArqAI to power their AI workforce.
              </p>
              <Link
                href="/demo"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--arq-lime)] text-[var(--arq-black)] font-bold rounded-full hover:bg-[var(--arq-lime-dark)] transition-colors"
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
