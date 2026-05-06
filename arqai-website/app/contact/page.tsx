"use client";

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

const contactOptions = [
  {
    title: "Engagements and demos",
    description: "Bring your workflow. We will tell you what is honestly possible.",
    cta: "Engage us",
    href: "/engage-us",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M3 7l9 6 9-6" />
        <rect x="3" y="5" width="18" height="14" rx="2" />
      </svg>
    ),
  },
  {
    title: "Partnerships and design-partner program",
    description: "Co-develop a productised agent or join the ArqClaims design-partner program.",
    cta: "partnerships@aciinfotech.net",
    href: "mailto:partnerships@aciinfotech.net",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <circle cx="9" cy="9" r="3" />
        <circle cx="17" cy="11" r="2.5" />
        <path d="M3 19c0-3 3-5 6-5s6 2 6 5" />
        <path d="M14 19c0-2 1.5-3.5 3.5-3.5S21 17 21 19" />
      </svg>
    ),
  },
  {
    title: "Press, analyst, and general inquiries",
    description: "Media requests, analyst briefings, and general questions.",
    cta: "marketing@aciinfotech.net",
    href: "mailto:marketing@aciinfotech.net",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 8l9 6 9-6" />
      </svg>
    ),
  },
  {
    title: "Careers",
    description: "Join the team shipping production AI for the operations that matter.",
    cta: "See open roles",
    href: "/careers",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2" />
        <path d="M3 13h18" />
      </svg>
    ),
  },
];

export default function ContactPage() {
  return (
    <>
      <Header />

      <main className="bg-base">
        {/* Hero Section with imagery */}
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

        {/* Contact Options */}
        <section className="py-section bg-base-tint">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {contactOptions.map((option, index) => (
                <motion.div
                  key={option.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="card p-8 group hover:border-accent transition-all"
                >
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-6 text-accent">
                    {option.icon}
                  </div>
                  <h3 className="text-xl font-display font-semibold text-text-bright mb-2">
                    {option.title}
                  </h3>
                  <p className="text-body-md text-text-muted mb-6">
                    {option.description}
                  </p>
                  <Link
                    href={option.href}
                    className="inline-flex items-center gap-2 text-accent font-medium hover:gap-3 transition-all"
                  >
                    {option.cta}
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
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* General Contact */}
        <section className="py-section bg-base">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-2xl font-display font-semibold text-text-bright mb-4">
                  General inquiries
                </h2>
                <p className="text-body-lg text-text-muted mb-6">
                  For anything else, reach us at:
                </p>
                <a
                  href="mailto:hello@thearq.ai"
                  className="inline-flex items-center gap-2 text-xl text-accent font-medium hover:underline"
                >
                  hello@thearq.ai
                </a>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
