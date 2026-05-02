"use client";

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

const useCases = [
  {
    title: "When the workflow has no productised agent yet",
    description:
      "Your team has a workflow we have not built a product for. We deploy a custom agent calibrated to your operation. Same engineering standard as our products.",
  },
  {
    title: "When the standard product needs more depth",
    description:
      "ArqFWA, ArqClaims, or ArqBanker is the right starting point, but your environment requires deeper integration or workflow customisation than the standard product configuration provides.",
  },
  {
    title: "When the AI agenda spans multiple workflows",
    description:
      "Your operation has a programme-level AI agenda. You need a senior partner who can deliver across multiple agents over multiple quarters at a single engineering standard.",
  },
];

const howWeWork = [
  {
    title: "Discovery, scoped to the outcome",
    description:
      "We start with the workflow, the buyer, and the operational metric. Discovery is short, focused, and outputs a concrete deployment plan and a committed timeline. We do not start engagements without one.",
  },
  {
    title: "Build, on your stack",
    description:
      "We deploy into your cloud, your data systems, your security perimeter. AWS. Azure. Sovereign provider. Whichever your team already runs. We do not ask you to migrate to deploy an agent.",
  },
  {
    title: "Operate, with named accountability",
    description:
      "Every engagement has a named technical lead and a named relationship lead. Post-deployment support cadence and SLAs are defined up front.",
  },
];

const whatWeDontDo = [
  "Pure AI strategy decks without delivery commitment.",
  "Generic enterprise IT modernisation.",
  "Workflow automation that is not AI-native.",
  "Engagements without a named workflow owner and a defined success metric.",
];

export default function ServicesPage() {
  return (
    <>
      <Header />

      <main className="bg-base">
        {/* Hero Section */}
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
                Services
              </p>

              <h1 className="text-display-xl md:text-[clamp(2.5rem,5vw,4rem)] font-display leading-[1.1] text-text-bright mb-6">
                When the productised agent is not the fit, we build the one you need.
              </h1>

              <p className="text-body-lg md:text-xl text-text-medium max-w-3xl mb-10 leading-relaxed">
                ArqAI Labs Services is our delivery arm. Senior engineers and domain leads who have shipped Fortune 500 programs in regulated industries for over a decade. We build custom AI agents into your environment, on the cloud you already use, integrated with the systems your team already runs. Same architectural foundation as our products. Same end-to-end ownership.
              </p>

              <Link
                href="/contact"
                className="btn bg-accent text-white hover:bg-accent/90"
              >
                Talk to delivery
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
            </motion.div>
          </div>
        </section>

        {/* When Customers Come to Us */}
        <section className="py-section bg-base-tint">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <p className="flex items-center justify-center gap-2 text-body-sm text-accent mb-4">
                <StarIcon className="w-4 h-4" />
                Use Cases
              </p>
              <h2 className="text-display-lg font-display text-text-bright">
                When customers come to us
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {useCases.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="card p-8"
                >
                  <div className="text-4xl font-display font-bold text-accent/20 mb-4">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <h3 className="text-xl font-display font-semibold text-text-bright mb-4">
                    {item.title}
                  </h3>
                  <p className="text-body-md text-text-muted leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How We Work */}
        <section className="py-section bg-base">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <p className="flex items-center justify-center gap-2 text-body-sm text-accent mb-4">
                <StarIcon className="w-4 h-4" />
                Process
              </p>
              <h2 className="text-display-lg font-display text-text-bright">
                How we work
              </h2>
            </motion.div>

            <div className="max-w-4xl mx-auto">
              {howWeWork.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-6 mb-8 last:mb-0"
                >
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                    <span className="text-accent font-bold">{index + 1}</span>
                  </div>
                  <div className="flex-1 pt-2">
                    <h3 className="text-xl font-display font-semibold text-text-bright mb-2">
                      {item.title}
                    </h3>
                    <p className="text-body-md text-text-muted leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* What We Don't Do */}
        <section className="py-section bg-base-tint">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-display-lg font-display text-text-bright mb-8">
                  What we do not do
                </h2>
                <div className="space-y-4">
                  {whatWeDontDo.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-4 bg-base rounded-lg border border-stroke-muted"
                    >
                      <div className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center shrink-0 mt-0.5">
                        <svg
                          className="w-4 h-4 text-red-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </div>
                      <p className="text-body-md text-text-muted">{item}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-section bg-base">
          <div className="container mx-auto px-4 md:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="text-display-lg md:text-display-xl font-display text-text-bright mb-6">
                Tell us your workflow.
              </h2>
              <p className="text-body-lg text-text-muted mb-8">
                We will tell you whether one of our products fits, whether services is the right path, and what realistic looks like.
              </p>
              <Link
                href="/contact"
                className="btn bg-accent text-white hover:bg-accent/90"
              >
                Talk to delivery
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
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
