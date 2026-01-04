"use client";

import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Card, FeatureCard, TestimonialCard } from "@/components/ui/Card";
import { Section, SectionHeader, LogoAccent } from "@/components/ui/Section";
import {
  ComplianceIcon,
  BrokenShieldIcon,
  GearStopIcon,
  BlueprintIcon,
  CertificateIcon,
  DashboardIcon,
  ArrowRightIcon,
  CheckIcon,
} from "@/components/ui/Icons";
import { HomeStructuredData } from "@/components/seo/StructuredData";

export default function HomePage() {
  return (
    <>
      <HomeStructuredData />
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
          {/* Background accents */}
          <LogoAccent position="top-right" type="lime" size="lg" />
          <LogoAccent position="bottom-left" type="blue" size="md" />

          <div className="container relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="inline-block px-4 py-2 rounded-full bg-[var(--arq-blue)]/10 text-[var(--arq-blue)] text-sm font-semibold mb-6">
                  The Future of Enterprise AI
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--arq-black)] mb-6 leading-tight"
              >
                The Command Platform for{" "}
                <span className="text-[var(--arq-blue)]">Enterprise AI</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xl text-[var(--arq-gray-600)] mb-8 max-w-2xl mx-auto"
              >
                Move from high-risk AI chaos to a secure, compliant, and fully
                governed AI workforce.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Button href="/demo" size="lg">
                  Request a Demo
                </Button>
                <Button href="/platform" variant="secondary" size="lg">
                  Explore the Platform
                </Button>
              </motion.div>
            </div>

            {/* Dashboard Preview */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-16 relative"
            >
              <div className="glass-card p-4 md:p-8 mx-auto max-w-5xl">
                <div className="aspect-video bg-gradient-to-br from-[var(--arq-gray-100)] to-[var(--arq-gray-200)] rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <DashboardIcon
                      size={64}
                      className="mx-auto mb-4 text-[var(--arq-blue)]"
                    />
                    <p className="text-[var(--arq-gray-500)]">
                      Operations Center Dashboard Preview
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Social Proof Bar */}
        <Section background="muted" className="py-12">
          <div className="text-center">
            <p className="text-sm font-semibold text-[var(--arq-gray-500)] uppercase tracking-wider mb-8">
              Trusted by Leaders in the World&apos;s Most Demanding Industries
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60">
              {/* Placeholder logos */}
              {["Top 5 Global Bank", "Fortune 100 Insurer", "Major Healthcare System", "Enterprise Tech", "Financial Services"].map(
                (company, i) => (
                  <div
                    key={i}
                    className="text-[var(--arq-gray-400)] font-semibold text-sm"
                  >
                    [{company}]
                  </div>
                )
              )}
            </div>
          </div>
        </Section>

        {/* Problem Section */}
        <Section id="problem">
          <SectionHeader
            eyebrow="The Hidden Crisis"
            title="Your AI Future is Being Built on a Foundation of Chaos"
            description="Enterprises are racing to deploy AI, but this rapid adoption has created a hidden crisis of 'Shadow AI.' Uncontrolled agents, disconnected tools, and a lack of oversight create unacceptable risks and stall true innovation."
          />

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<ComplianceIcon size={28} />}
              title="Crippling Compliance Risk"
              description="Agents operating without guardrails risk multi-million dollar fines from GDPR, HIPAA, and industry-specific violations."
            />
            <FeatureCard
              icon={<BrokenShieldIcon size={28} />}
              title="Catastrophic Security Breaches"
              description="Ungoverned agents can expose sensitive customer data and proprietary information, leading to irreversible brand damage."
            />
            <FeatureCard
              icon={<GearStopIcon size={28} />}
              title="Stalled Innovation"
              description="The inability to prove safety and compliance means the most valuable AI projects never make it to production."
            />
          </div>
        </Section>

        {/* Solution Section */}
        <Section background="gradient" id="solution">
          <SectionHeader
            eyebrow="Introducing the Foundry"
            title="It's Time to Move from AI Chaos to AI Command"
            description="You can't just put a fence around the chaos. You need an industrial-strength solution. The ArqAI Foundry is the industry's first integrated command platform."
          />

          <div className="grid md:grid-cols-3 gap-8">
            <Card glass>
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-[var(--arq-blue)] flex items-center justify-center text-white">
                  <BlueprintIcon size={32} />
                </div>
                <h3 className="text-xl font-semibold">Build with Confidence</h3>
                <p className="text-[var(--arq-gray-600)]">
                  Visually assemble agents and bake compliance rules directly
                  into their DNA with our patented Policy Compiler.
                </p>
              </div>
            </Card>

            <Card glass>
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-[var(--arq-blue)] flex items-center justify-center text-white">
                  <CertificateIcon size={32} />
                </div>
                <h3 className="text-xl font-semibold">Run with Trust</h3>
                <p className="text-[var(--arq-gray-600)]">
                  Every action taken by every agent is secured by a
                  cryptographic, non-repudiable audit trail.
                </p>
              </div>
            </Card>

            <Card glass>
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-[var(--arq-blue)] flex items-center justify-center text-white">
                  <DashboardIcon size={32} />
                </div>
                <h3 className="text-xl font-semibold">Govern with Insight</h3>
                <p className="text-[var(--arq-gray-600)]">
                  Get real-time quality scores and performance metrics for your
                  entire AI workforce from a single pane of glass.
                </p>
              </div>
            </Card>
          </div>
        </Section>

        {/* How It Works Section */}
        <Section id="how-it-works">
          <SectionHeader
            eyebrow="How It Works"
            title="From Blueprint to Operation in Minutes"
          />

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-[var(--arq-gray-200)] -translate-y-1/2 z-0" />

            {[
              {
                step: "01",
                title: "Define Policy",
                description:
                  "In the Policy Hub, define and enable the precise business and compliance rules your agent must follow.",
              },
              {
                step: "02",
                title: "Assemble & Deploy",
                description:
                  "In the Agent Builder, configure your agent's skills and logic, attaching the relevant policies with a single click.",
              },
              {
                step: "03",
                title: "Operate & Audit",
                description:
                  "Run your agent in the Operations Center and monitor its performance, quality, and compliance in real-time.",
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative z-10"
              >
                <Card className="text-center h-full">
                  <div className="w-12 h-12 rounded-full bg-[var(--arq-lime)] text-[var(--arq-black)] font-bold text-lg flex items-center justify-center mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-[var(--arq-gray-600)]">
                    {item.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* Testimonial Section */}
        <Section background="muted" id="testimonials">
          <div className="max-w-4xl mx-auto">
            <TestimonialCard
              quote="ArqAI is the only platform we've seen that can provide the level of security and auditability required to automate our most critical compliance processes. It's a game-changer for enterprise AI."
              author="Head of Innovation"
              role="Top 5 Global Bank"
              className="text-center"
            />
          </div>
        </Section>

        {/* Features Checklist Section */}
        <Section>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <SectionHeader
                eyebrow="Enterprise Ready"
                title="Built for the World's Most Demanding Environments"
                description="ArqAI is designed from the ground up for enterprises that require the highest levels of security, compliance, and control."
                centered={false}
              />

              <div className="space-y-4">
                {[
                  "Policy enforcement before action execution",
                  "Automatic audit trail generation",
                  "Cryptographic evidence for every action",
                  "Data residency and jurisdiction controls",
                  "Role-based access with least-privilege",
                  "Human-in-the-loop for high-risk actions",
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-[var(--arq-lime)] flex items-center justify-center flex-shrink-0">
                      <CheckIcon size={14} className="text-[var(--arq-black)]" />
                    </div>
                    <span className="text-[var(--arq-gray-700)]">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="glass-card p-8">
              <div className="space-y-6">
                <h4 className="font-semibold text-lg">Compliance Frameworks</h4>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    "HIPAA",
                    "GDPR",
                    "CCPA",
                    "SOX",
                    "Fed SR 11-7",
                    "EU AI Act",
                    "NIST AI RMF",
                    "SOC 2",
                  ].map((framework) => (
                    <div
                      key={framework}
                      className="flex items-center gap-2 text-sm"
                    >
                      <CheckIcon
                        size={16}
                        className="text-[var(--arq-blue)]"
                      />
                      <span>{framework}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* CTA Section */}
        <Section background="dark" className="relative overflow-hidden">
          <LogoAccent position="top-right" type="lime" size="lg" />

          <div className="text-center max-w-3xl mx-auto relative z-10">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6"
            >
              Ready to take command of your AI workforce?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-[var(--arq-gray-300)] mb-8"
            >
              Schedule a personalized demo to see how the ArqAI Foundry can help
              you de-risk innovation and accelerate your enterprise AI strategy.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Button
                href="/demo"
                variant="accent"
                size="lg"
                rightIcon={<ArrowRightIcon size={20} />}
              >
                Request a Demo
              </Button>
            </motion.div>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
