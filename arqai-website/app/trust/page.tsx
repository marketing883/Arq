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

const architecturalControls = [
  "Cryptographic logging of every agent action and every data access.",
  "Policy enforcement before retrieval and before tool execution.",
  "Decision provenance exposed in the audit log and in the user UI.",
  "Deployment options that respect data residency and tenancy requirements.",
];

const complianceFrameworks = [
  {
    name: "SOC 2",
    status: "In Progress",
    description:
      "Aligned with SOC 2 Trust Services Criteria. Type II audit in progress.",
  },
  {
    name: "HIPAA",
    status: "Aligned",
    description:
      "HIPAA-aligned controls. BAAs executed with healthcare customers. Internal HIPAA security and privacy policies in place.",
  },
  {
    name: "GDPR",
    status: "Aligned",
    description:
      "GDPR-aligned data protection principles. EU customer engagements include the appropriate data processing addenda.",
  },
  {
    name: "MENA Frameworks",
    status: "Aligned",
    description:
      "Aligned with the SAMA Cybersecurity Framework, Saudi NCA Essential Cybersecurity Controls, KSA PDPL, UAE PDPL, and NHRA standards for engagements in the GCC and broader MENA region.",
  },
];

export default function TrustPage() {
  return (
    <>
      <Header />

      <main className="bg-base">
        {/* Hero Section */}
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
                  Trust
                </p>

                <h1 className="text-display-xl md:text-[clamp(2.5rem,5vw,4rem)] font-display leading-[1.1] text-text-bright mb-6">
                  Architectural controls first. Certifications next.
                </h1>

                <p className="text-body-lg md:text-xl text-text-medium leading-relaxed">
                  ArqAI Labs is built for the controls that regulated environments require. We do not claim certifications we do not have. We do tell you exactly where we are on every framework you care about, and we share control documentation under NDA on request.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="grid grid-cols-2 gap-4"
              >
                {[
                  { src: "/img/icons/Composable-Architecture.webp", label: "Composable architecture" },
                  { src: "/img/icons/Governance-Built-In.webp", label: "Governance built in" },
                  { src: "/img/icons/Orchestrated-Intelligence.webp", label: "Orchestrated intelligence" },
                  { src: "/img/icons/Outcome-Driven-Stack.webp", label: "Outcome-driven stack" },
                ].map((tile) => (
                  <div key={tile.label} className="card p-6 flex flex-col items-start gap-4">
                    <div className="w-14 h-14 relative">
                      <Image src={tile.src} alt="" fill sizes="56px" className="object-contain" />
                    </div>
                    <p className="text-body-sm font-medium text-text-bright leading-snug">
                      {tile.label}
                    </p>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Architectural Controls */}
        <section className="py-section bg-base-tint">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              <h2 className="text-display-lg font-display text-text-bright mb-8">
                Architectural controls
              </h2>
              <p className="text-body-lg text-text-muted mb-8">
                Independent of certification status, the architecture every ArqAI Labs product runs on includes:
              </p>
              <div className="space-y-4">
                {architecturalControls.map((control, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4 p-5 bg-base rounded-lg border border-stroke-muted"
                  >
                    <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                      <svg
                        className="w-4 h-4 text-accent"
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
                    <p className="text-body-md text-text-bright">{control}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Compliance Posture */}
        <section className="py-section bg-base">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-display-lg font-display text-text-bright">
                Compliance posture
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {complianceFrameworks.map((framework, index) => (
                <motion.div
                  key={framework.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="card p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-display font-semibold text-text-bright">
                      {framework.name}
                    </h3>
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        framework.status === "In Progress"
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                          : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      }`}
                    >
                      {framework.status}
                    </span>
                  </div>
                  <p className="text-body-sm text-text-muted">
                    {framework.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Data Handling */}
        <section className="py-section bg-base-tint">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-display-lg font-display text-text-bright mb-6">
                  Data handling
                </h2>
                <div className="card p-8 bg-base">
                  <p className="text-body-lg text-text-muted leading-relaxed">
                    Customer data stays in customer environments. Agents are deployed inside customer cloud or sovereign cloud of choice. Customer data is not used to train shared models.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Responsible AI */}
        <section className="py-section bg-base">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <p className="flex items-center gap-2 text-body-sm text-accent mb-4">
                  <StarIcon className="w-4 h-4" />
                  Responsible AI
                </p>
                <h2 className="text-display-lg font-display text-text-bright mb-6">
                  Human in the loop. Always.
                </h2>
                <p className="text-body-lg text-text-muted leading-relaxed">
                  Every ArqAI Labs agent is designed to assist a human professional, not replace one. The agent surfaces evidence and reasoning. The human makes the consequential decision. We do not deploy agents into autonomous decision paths in regulated workflows.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-section bg-base-tint">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="bg-accent rounded-2xl p-8 md:p-12 text-center max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-display font-semibold text-white mb-6">
                Request control documentation
              </h2>
              <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
                We share detailed control documentation under NDA. Reach out to request it.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-accent font-semibold rounded-lg hover:shadow-lg transition-all"
              >
                Request documentation
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
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
