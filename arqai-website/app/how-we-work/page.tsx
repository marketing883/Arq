"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

function StarIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path d="M19.6,9.6h-3.9c-.4,0-1.8-.2-1.8-.2-.6,0-1.1-.2-1.6-.6-.5-.3-.9-.8-1.2-1.2-.3-.4-.4-.9-.5-1.4,0,0,0-1.1-.2-1.5V.4c0-.2-.2-.4-.4-.4s-.4.2-.4.4v4.4c0,.4-.2,1.5-.2,1.5,0,.5-.2,1-.5,1.4-.3.5-.7.9-1.2,1.2s-1,.5-1.6.6c0,0-1.2,0-1.7.2H.4c-.2,0-.4.2-.4.4s.2.4.4.4h4.1c.4,0,1.7.2,1.7.2.6,0,1.1.2,1.6.6.4.3.8.7,1.1,1.1.3.5.5,1,.6,1.6,0,0,0,1.3.2,1.7v4.1c0,.2.2.4.4.4s.4-.2.4-.4v-4.1c0-.4.2-1.7.2-1.7,0-.6.2-1.1.6-1.6.3-.4.7-.8,1.1-1.1.5-.3,1-.5,1.6-.6,0,0,1.3,0,1.8-.2h3.9c.2,0,.4-.2.4-.4s-.2-.4-.4-.4h0Z" />
    </svg>
  );
}

const steps = [
  {
    name: "Strategy",
    description:
      "We start with the workflow, the buyer, and the operational metric. We don't run a generic AI assessment. We run a discovery scoped to the outcome you want, the timeline you need, and the constraints your environment imposes. Output: a concrete deployment plan and a committed timeline.",
  },
  {
    name: "Build",
    description:
      "We engineer the AI tuned to your environment. On the cloud you already run. Integrated with the systems your team already uses. Built on the modern frontier stack: Anthropic, OpenAI, Azure OpenAI, AWS Bedrock. Stack-agnostic by design. The build standard is production from day one, not a benchmark or a demo.",
  },
  {
    name: "Deploy",
    description:
      "We push it into your production environment. Not a sandbox. Not a pilot that lives in a slide deck. The same security review, change-management posture, and operational handoff your team applies to anything else that runs in production.",
  },
  {
    name: "Run",
    description:
      "We operate the AI alongside your team. Named technical lead. Named relationship lead. Defined SLAs. Defined cadence. The AI keeps shipping, your team keeps the lead, and the engagement compounds over time.",
  },
];

const dontDo = [
  "Pure AI strategy decks without a delivery commitment.",
  "Engagements without a named workflow owner and a defined success metric.",
  "AI that ships into a sandbox and never sees production.",
  "Generic enterprise IT modernisation that happens to mention AI.",
];

export default function HowWeWorkPage() {
  return (
    <>
      <Header />

      <main className="bg-base">
        {/* Hero */}
        <section className="pt-32 md:pt-40 pb-16">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl"
            >
              <p className="flex items-center gap-2 text-body-sm text-accent mb-6 uppercase tracking-wider font-medium">
                <StarIcon className="w-4 h-4" />
                How we work
              </p>

              <h1 className="text-display-xl md:text-[clamp(2.5rem,5vw,4.5rem)] font-display leading-[1.1] text-text-bright mb-6">
                Four steps. End-to-end. No handoffs to someone else&apos;s team.
              </h1>

              <p className="text-body-lg md:text-xl text-text-medium leading-relaxed max-w-3xl">
                Every ArqAI Labs engagement runs on the same four steps. We do all of them. Together. With your team in the room.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Steps */}
        <section className="py-section bg-base-tint">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="space-y-12 md:space-y-16 max-w-4xl mx-auto">
              {steps.map((step, index) => (
                <motion.div
                  key={step.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="flex gap-8 md:gap-12 items-start"
                >
                  <div className="text-6xl md:text-8xl font-display font-bold text-accent/20 shrink-0 leading-none">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div className="flex-1 pt-2">
                    <h2 className="text-2xl md:text-3xl font-display font-semibold text-text-bright mb-4">
                      {step.name}
                    </h2>
                    <p className="text-body-lg text-text-muted leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* What we don't do */}
        <section className="py-section bg-base">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-display-md font-display text-text-bright mb-8">
                What we don&apos;t do.
              </h2>
              <ul className="space-y-4">
                {dontDo.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-4 p-5 rounded-lg bg-base-tint border border-stroke-muted"
                  >
                    <div className="w-2 h-2 rounded-full bg-accent shrink-0 mt-2.5" />
                    <p className="text-body-md text-text-bright">{item}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-section bg-base-tint">
          <div className="container mx-auto px-4 md:px-6 lg:px-8 text-center">
            <h2 className="text-display-md font-display text-text-bright mb-6">
              Tell us what your operation needs.
            </h2>
            <p className="text-body-lg text-text-muted mb-8">
              We&apos;ll tell you what&apos;s honestly possible. In plain language. Without a deck.
            </p>
            <Link href="/engage-us" className="btn bg-accent text-white">
              Engage us
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
              </svg>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
