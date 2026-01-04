"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Section, SectionHeader, LogoAccent } from "@/components/ui/Section";
import { CheckIcon, ArrowRightIcon } from "@/components/ui/Icons";

type Industry = "financial" | "insurance" | "healthcare";

const industries = {
  financial: {
    title: "Financial Services",
    headline: "AI-Powered Automation with Unbreakable Compliance",
    description:
      "In an industry where a single compliance failure can cost millions, ArqAI provides the assurance to automate your most critical processes. From SOX and FINRA to the Fair Lending Act, our platform allows you to codify your regulatory obligations and build agents that adhere to them by design.",
    useCases: [
      "Automated Loan & Mortgage Underwriting",
      "Algorithmic Trade Compliance Monitoring",
      "KYC/AML Process Automation",
      "Automated Generation of Regulatory Reports",
    ],
    regulations: ["SOX", "FINRA", "Fair Lending Act", "GLBA", "Basel III"],
  },
  insurance: {
    title: "Insurance",
    headline: "Build a Trusted Agent Workforce for Claims Processing",
    description:
      "The insurance industry runs on complex rules and sensitive data. ArqAI provides the foundry to build agents that can navigate this complexity securely. Automate claims, price policies, and detect fraud with a complete audit trail for every decision.",
    useCases: [
      "Autonomous Claims Adjudication & Processing",
      "Dynamic Policy Underwriting & Pricing",
      "Automated Fraud Detection & Flagging",
      "Compliance with NAIC and IFRS 17 standards",
    ],
    regulations: ["NAIC Model Laws", "IFRS 17", "State Insurance Regulations", "HIPAA (Health)"],
  },
  healthcare: {
    title: "Healthcare",
    headline: "Securely Automate Clinical and Administrative Processes",
    description:
      "Patient data is your most sensitive asset. ArqAI's zero-trust architecture ensures that agents interacting with PHI do so with provable, audited permission. Build agents that can streamline operations while maintaining the highest standards of patient data privacy.",
    useCases: [
      "Patient Data Management & Summarization",
      "Clinical Trial Reporting & Data Analysis (GxP)",
      "Automated Medical Billing & Coding",
      "Prior Authorization & Payer Communications",
    ],
    regulations: ["HIPAA", "HITECH", "GxP", "21 CFR Part 11", "GDPR (EU)"],
  },
};

export default function SolutionsPage() {
  const [activeIndustry, setActiveIndustry] = useState<Industry>("financial");
  const industry = industries[activeIndustry];

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
                Trusted AI for the World&apos;s{" "}
                <span className="text-[var(--arq-blue)]">Most Demanding Industries</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-xl text-[var(--arq-gray-600)]"
              >
                ArqAI is engineered to solve the unique compliance, security, and
                operational challenges of enterprises in highly regulated verticals.
              </motion.p>
            </div>
          </div>
        </section>

        {/* Industry Tabs */}
        <Section>
          {/* Tab Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {(Object.keys(industries) as Industry[]).map((key) => (
              <button
                key={key}
                onClick={() => setActiveIndustry(key)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  activeIndustry === key
                    ? "bg-[var(--arq-blue)] text-white shadow-lg"
                    : "bg-[var(--arq-gray-100)] text-[var(--arq-gray-600)] hover:bg-[var(--arq-gray-200)]"
                }`}
              >
                {industries[key].title}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndustry}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid lg:grid-cols-2 gap-12 items-start">
                {/* Content */}
                <div>
                  <span className="inline-block px-3 py-1 rounded-full bg-[var(--arq-blue)]/10 text-[var(--arq-blue)] text-sm font-semibold mb-4">
                    {industry.title}
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold mb-6">
                    {industry.headline}
                  </h2>
                  <p className="text-lg text-[var(--arq-gray-600)] mb-8">
                    {industry.description}
                  </p>

                  <h3 className="font-semibold mb-4">Key Use Cases</h3>
                  <div className="space-y-3 mb-8">
                    {industry.useCases.map((useCase, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckIcon
                          size={20}
                          className="text-[var(--arq-lime)] flex-shrink-0 mt-0.5"
                        />
                        <span className="text-[var(--arq-gray-700)]">{useCase}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    href="/demo"
                    rightIcon={<ArrowRightIcon size={18} />}
                  >
                    See {industry.title} Demo
                  </Button>
                </div>

                {/* Regulations Card */}
                <div className="glass-card p-8">
                  <h3 className="font-semibold mb-6">Compliance Frameworks Supported</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {industry.regulations.map((reg) => (
                      <div
                        key={reg}
                        className="flex items-center gap-2 p-3 bg-white rounded-lg border border-[var(--arq-gray-200)]"
                      >
                        <CheckIcon size={16} className="text-[var(--arq-blue)]" />
                        <span className="text-sm font-medium">{reg}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 pt-6 border-t border-[var(--arq-gray-200)]">
                    <h4 className="font-semibold mb-3">Industry-Specific Features</h4>
                    <ul className="space-y-2 text-sm text-[var(--arq-gray-600)]">
                      <li>• Pre-built policy templates for {industry.title.toLowerCase()}</li>
                      <li>• Industry-specific audit report formats</li>
                      <li>• Integration with common {industry.title.toLowerCase()} systems</li>
                      <li>• Expert implementation support</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </Section>

        {/* Cross-Industry Benefits */}
        <Section background="muted">
          <SectionHeader
            eyebrow="Universal Benefits"
            title="Enterprise-Grade Governance for Every Industry"
            description="Regardless of your vertical, ArqAI provides the foundational capabilities needed for trusted AI at scale."
          />

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Cryptographic Audit Trails",
                description:
                  "Every AI action is recorded with cryptographic proof, providing court-admissible evidence of compliance.",
              },
              {
                title: "Policy Enforcement at Scale",
                description:
                  "Define once, enforce everywhere. Your compliance policies automatically apply to all agents.",
              },
              {
                title: "Real-Time Observability",
                description:
                  "Monitor your entire AI workforce from a single dashboard with confidence scoring and alerts.",
              },
            ].map((benefit, index) => (
              <Card key={index} glass>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-[var(--arq-lime)] flex items-center justify-center mx-auto mb-4">
                    <CheckIcon size={24} className="text-[var(--arq-black)]" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-[var(--arq-gray-600)]">{benefit.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </Section>

        {/* CTA Section */}
        <Section background="dark" className="relative overflow-hidden">
          <LogoAccent position="top-right" type="lime" size="lg" />

          <div className="text-center max-w-3xl mx-auto relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to see ArqAI in your industry?
            </h2>
            <p className="text-lg text-[var(--arq-gray-300)] mb-8">
              Schedule a demo tailored to your specific regulatory and operational requirements.
            </p>
            <Button
              href="/demo"
              variant="accent"
              size="lg"
              rightIcon={<ArrowRightIcon size={20} />}
            >
              Request Industry Demo
            </Button>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
