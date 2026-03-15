"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Section, SectionHeader, LogoAccent } from "@/components/ui/Section";
import { GovernanceArchitecture } from "@/components/diagrams/GovernanceArchitecture";
import { AgentBlueprintCard } from "@/components/ui/AgentBlueprintCard";
import { getAllIndustries } from "@/lib/data/industries";
import { getFeaturedBlueprints } from "@/lib/data/blueprints";
import { CheckIcon, ArrowRightIcon } from "@/components/ui/Icons";

const industries = getAllIndustries();
const blueprints = getFeaturedBlueprints(6);

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

export default function AgentsPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-16 overflow-hidden bg-base">
          <LogoAccent position="top-right" type="lime" size="lg" />

          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center gap-2 text-body-sm text-accent mb-4"
              >
                <StarIcon className="w-4 h-4" />
                AI Agents Built on Trust
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-text-bright mb-6 leading-tight"
              >
                Enterprise AI Agents{" "}
                <span className="text-accent">Built on Governance</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-xl text-text-muted mb-8 max-w-3xl mx-auto"
              >
                Pre-built adaptive AI agents for regulated industries. Every agent inherits
                trust, compliance, and observability from our governance foundation.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex flex-wrap justify-center gap-4"
              >
                <Link href="/demo" className="btn btn-primary group">
                  Request Demo
                  <ArrowRightIcon size={18} className="transition-transform group-hover:translate-x-1" />
                </Link>
                <Link href="#blueprints" className="btn btn-outline group">
                  Explore Blueprints
                  <ArrowRightIcon size={18} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Governance Architecture Section */}
        <Section background="muted">
          <SectionHeader
            eyebrow="Architecture"
            title="Governance Powers Everything"
            description="Our three patented technologies form the foundation layer. Every AI agent we build inherits enterprise-grade governance from the ground up."
          />

          <GovernanceArchitecture />
        </Section>

        {/* Industries Section */}
        <Section>
          <SectionHeader
            eyebrow="Industries"
            title="AI Agents Across Regulated Industries"
            description="Purpose-built agents for the world's most demanding verticals. Each configured for industry-specific compliance requirements."
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {industries.map((industry, index) => (
              <motion.div
                key={industry.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group card relative hover:border-accent transition-all"
              >
                {/* Status Badge */}
                {industry.status !== "active" && (
                  <span
                    className={`absolute top-4 right-4 text-xs font-medium px-2 py-0.5 rounded-full ${
                      industry.status === "pilot"
                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                        : "bg-gray-100 text-gray-600 dark:bg-gray-800/50 dark:text-gray-400"
                    }`}
                  >
                    {industry.status === "pilot" ? "Pilot" : "Roadmap"}
                  </span>
                )}

                <h3 className="text-xl font-display font-semibold text-text-bright mb-3 group-hover:text-accent transition-colors">
                  {industry.title}
                </h3>

                <p className="text-body-sm text-text-muted mb-4 line-clamp-2">
                  {industry.headline}
                </p>

                {/* Use Cases */}
                <div className="space-y-2 mb-4">
                  {industry.useCases.slice(0, 3).map((useCase, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckIcon size={14} className="text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-text-medium">{useCase}</span>
                    </div>
                  ))}
                </div>

                {/* Regulations */}
                <div className="flex flex-wrap gap-1.5 mt-auto">
                  {industry.regulations.slice(0, 3).map((reg) => (
                    <span
                      key={reg}
                      className="px-2 py-0.5 rounded-full bg-accent/10 text-[10px] font-medium text-accent"
                    >
                      {reg}
                    </span>
                  ))}
                  {industry.regulations.length > 3 && (
                    <span className="px-2 py-0.5 rounded-full bg-stroke-muted text-[10px] text-text-muted">
                      +{industry.regulations.length - 3}
                    </span>
                  )}
                </div>

                <Link href="/solutions" className="absolute inset-0">
                  <span className="sr-only">View {industry.title} solutions</span>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-10"
          >
            <Link href="/solutions" className="btn btn-outline group">
              View All Industry Solutions
              <ArrowRightIcon size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </Section>

        {/* Pre-Built Blueprints Section */}
        <Section background="muted" id="blueprints">
          <SectionHeader
            eyebrow="Pre-Built Agents"
            title="Adaptive AI Agent Blueprints"
            description="Production-ready agents for common enterprise use cases. Deploy in 30 days with governance built in from day one."
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blueprints.map((blueprint, index) => (
              <AgentBlueprintCard
                key={blueprint.id}
                blueprint={blueprint}
                variant="default"
                index={index}
              />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-10"
          >
            <Link href="/agents/blueprints" className="btn btn-outline group">
              View All Blueprints
              <ArrowRightIcon size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </Section>

        {/* How It Works Section */}
        <Section>
          <SectionHeader
            eyebrow="Process"
            title="From Blueprint to Production in 30 Days"
            description="Our foundry approach means you get governed AI agents faster than building from scratch."
          />

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Select Blueprint",
                description: "Choose from our library of pre-built agent blueprints or request a custom build.",
              },
              {
                step: "02",
                title: "Configure Governance",
                description: "Define your compliance requirements, policies, and audit needs.",
              },
              {
                step: "03",
                title: "Deploy & Test",
                description: "Deploy to your environment with full observability and testing.",
              },
              {
                step: "04",
                title: "Scale with Trust",
                description: "Scale your AI workforce knowing every action is governed and auditable.",
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="text-5xl font-display font-bold text-accent/20 mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-text-bright mb-2">
                  {item.title}
                </h3>
                <p className="text-body-sm text-text-muted">
                  {item.description}
                </p>
              </motion.div>
            ))}
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
              className="text-3xl md:text-4xl font-display font-bold text-white mb-6"
            >
              Ready to deploy governed AI agents?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-white/70 mb-8"
            >
              See how ArqAI can help you go from pilot to production with AI agents
              that are compliant, auditable, and enterprise-ready.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Link
                href="/demo"
                className="btn bg-accent text-base-opp hover:bg-accent/90 group"
              >
                Request a Demo
                <ArrowRightIcon size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
