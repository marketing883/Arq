"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Section, SectionHeader, LogoAccent } from "@/components/ui/Section";
import {
  BlueprintIcon,
  CertificateIcon,
  DashboardIcon,
  CheckIcon,
  ArrowRightIcon,
} from "@/components/ui/Icons";
import { getIntegrationLogo } from "@/components/ui/IntegrationLogos";
import type { Metadata } from "next";

export default function PlatformPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <LogoAccent position="top-right" type="lime" size="lg" />

          <div className="container relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="inline-block px-4 py-2 rounded-full bg-[var(--arq-blue)]/10 text-[var(--arq-blue)] text-sm font-semibold mb-6">
                  The ArqAI Foundry
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--arq-black)] mb-6 leading-tight"
              >
                The Integrated Foundry for{" "}
                <span className="text-[var(--arq-blue)]">Enterprise AI</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xl text-[var(--arq-gray-600)] mb-8 max-w-2xl mx-auto"
              >
                ArqAI is not a single tool, but a complete, end-to-end platform
                that unifies the three pillars of trusted AI: Compliance, Security, and Operations.
              </motion.p>
            </div>
          </div>
        </section>

        {/* CAPC Section */}
        <Section id="capc" background="muted">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[var(--arq-blue)] flex items-center justify-center">
                    <BlueprintIcon size={24} className="text-white" />
                  </div>
                  <span className="text-sm font-semibold text-[var(--arq-blue)] uppercase tracking-wider">
                    Build with Confidence
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Compliance-Aware Prompt Compiler
                </h2>
                <p className="text-lg text-[var(--arq-gray-600)] mb-6">
                  Bake compliance in, don&apos;t bolt it on. ArqAI&apos;s patented compiler
                  acts as an intelligent guardrail at the point of creation.
                </p>
                <p className="text-[var(--arq-gray-600)] mb-6">
                  Define your business and regulatory policies in a central hub, and the
                  Foundry automatically enforces them during both agent assembly and execution.
                  This prevents compliance violations before they can ever happen, turning your
                  policies from static documents into active, automated enforcement.
                </p>

                <div className="space-y-3">
                  {[
                    "Central Policy Hub for all business rules",
                    "Automatic enforcement at assembly time",
                    "Real-time validation during execution",
                    "Audit trail of policy enforcement",
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckIcon size={20} className="text-[var(--arq-lime)] flex-shrink-0" />
                      <span className="text-[var(--arq-gray-700)]">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-card p-4"
            >
              <div className="aspect-video relative rounded-lg overflow-hidden">
                <Image
                  src="/img/Policy-Hub-Interface.png"
                  alt="Policy Hub Interface - Central hub for managing compliance policies"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </motion.div>
          </div>
        </Section>

        {/* TAO Section */}
        <Section id="tao">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-card p-4 order-2 lg:order-1"
            >
              <div className="aspect-video relative rounded-lg overflow-hidden">
                <Image
                  src="/img/Audit-logs.png"
                  alt="Audit Log Interface - Immutable audit trail for every AI action"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--arq-blue)] flex items-center justify-center">
                  <CertificateIcon size={24} className="text-white" />
                </div>
                <span className="text-sm font-semibold text-[var(--arq-blue)] uppercase tracking-wider">
                  Run with Trust
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Trust-Aware Agent Orchestration
              </h2>
              <p className="text-lg text-[var(--arq-gray-600)] mb-6">
                Every action, cryptographically signed and proven. Our zero-trust framework
                treats every AI action as a sensitive transaction.
              </p>
              <p className="text-[var(--arq-gray-600)] mb-6">
                Before execution, the platform issues a single-use, cryptographically-signed
                capability token that serves as permission. This token is consumed upon use,
                and the entire lifecycle (issuance, validation, and consumption) is recorded
                on an immutable audit log.
              </p>

              <div className="space-y-3">
                {[
                  "Single-use cryptographic capability tokens",
                  "Non-repudiable, court-admissible records",
                  "Immutable audit trail for every action",
                  "Zero-trust security architecture",
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckIcon size={20} className="text-[var(--arq-lime)] flex-shrink-0" />
                    <span className="text-[var(--arq-gray-700)]">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </Section>

        {/* ODA-RAG Section */}
        <Section id="oda-rag" background="muted">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[var(--arq-blue)] flex items-center justify-center">
                    <DashboardIcon size={24} className="text-white" />
                  </div>
                  <span className="text-sm font-semibold text-[var(--arq-blue)] uppercase tracking-wider">
                    Govern with Insight
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Observability-Driven Adaptive RAG
                </h2>
                <p className="text-lg text-[var(--arq-gray-600)] mb-6">
                  Move from a black box to a transparent, managed workforce. How do you
                  know if your agents are performing well?
                </p>
                <p className="text-[var(--arq-gray-600)] mb-6">
                  ArqAI&apos;s observability loop uses a secondary AI quality analyst to score
                  the confidence and quality of every agent&apos;s output in real-time. This data
                  feeds into a central dashboard, giving you unprecedented insight into your
                  AI workforce&apos;s performance and flagging low-confidence results before
                  they can impact your business.
                </p>

                <div className="space-y-3">
                  {[
                    "Real-time quality scoring by AI analyst",
                    "Confidence metrics for every output",
                    "Single pane of glass for all agents",
                    "Proactive low-confidence alerts",
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckIcon size={20} className="text-[var(--arq-lime)] flex-shrink-0" />
                      <span className="text-[var(--arq-gray-700)]">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-card p-4"
            >
              <div className="aspect-video relative rounded-lg overflow-hidden">
                <Image
                  src="/img/Operations-center.png"
                  alt="Operations Center Dashboard - Real-time monitoring and quality scoring"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </motion.div>
          </div>
        </Section>

        {/* Integrations Section */}
        <Section id="integrations">
          <SectionHeader
            eyebrow="Integrations"
            title="Connect Seamlessly Across Your Ecosystem"
            description="The ArqAI Foundry acts as the command layer on top of your existing infrastructure and models. We provide robust integrations with the platforms you already use."
          />

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[
              "AWS",
              "Azure",
              "Google Cloud",
              "OpenAI",
              "Anthropic",
              "Cohere",
              "Slack",
              "Microsoft Teams",
              "Salesforce",
              "ServiceNow",
              "Snowflake",
              "Databricks",
            ].map((integration, index) => {
              const LogoComponent = getIntegrationLogo(integration);
              return (
                <motion.div
                  key={integration}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="flex flex-col items-center justify-center py-6 px-4 bg-white border border-[var(--arq-gray-200)] hover:border-[var(--arq-lime)] transition-colors group">
                    {LogoComponent && (
                      <LogoComponent
                        size={40}
                        className="text-[var(--arq-black)] group-hover:text-[var(--arq-gray-800)] transition-colors mb-3"
                      />
                    )}
                    <span className="text-sm text-[var(--arq-gray-600)] font-medium group-hover:text-[var(--arq-black)] transition-colors">
                      {integration}
                    </span>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </Section>

        {/* CTA Section */}
        <Section background="dark" className="relative overflow-hidden">
          <LogoAccent position="top-right" type="lime" size="lg" />

          <div className="text-center max-w-3xl mx-auto relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to see the platform in action?
            </h2>
            <p className="text-lg text-[var(--arq-gray-300)] mb-8">
              Schedule a personalized demo and see how the ArqAI Foundry can transform
              your enterprise AI governance.
            </p>
            <Button
              href="/demo"
              variant="accent"
              size="lg"
              rightIcon={<ArrowRightIcon size={20} />}
            >
              Request a Demo
            </Button>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
