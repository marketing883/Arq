"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Section, SectionHeader, LogoAccent } from "@/components/ui/Section";
import { AgentBlueprintCard } from "@/components/ui/AgentBlueprintCard";
import { blueprints, type Blueprint } from "@/lib/data/blueprints";
import { ArrowRightIcon } from "@/components/ui/Icons";

type StatusFilter = "all" | Blueprint["status"];

const statusFilters: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All Blueprints" },
  { value: "available", label: "Available Now" },
  { value: "blueprint", label: "Blueprint Ready" },
  { value: "pilot", label: "Pilot" },
  { value: "roadmap", label: "Coming Soon" },
];

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

export default function BlueprintsPage() {
  const [activeFilter, setActiveFilter] = useState<StatusFilter>("all");

  const filteredBlueprints =
    activeFilter === "all"
      ? blueprints
      : blueprints.filter((b) => b.status === activeFilter);

  const availableCount = blueprints.filter((b) => b.status === "available").length;
  const blueprintCount = blueprints.filter((b) => b.status === "blueprint").length;

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
                Pre-Built Agent Blueprints
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-5xl font-display font-bold text-text-bright mb-6 leading-tight"
              >
                Adaptive AI Agent{" "}
                <span className="text-accent">Blueprints</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-xl text-text-muted mb-8 max-w-3xl mx-auto"
              >
                Production-ready agents with governance built in. Choose a blueprint,
                configure for your compliance needs, and deploy in 30 days.
              </motion.p>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex justify-center gap-8"
              >
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent">{availableCount}</div>
                  <div className="text-sm text-text-muted">Available Now</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent">{blueprintCount}</div>
                  <div className="text-sm text-text-muted">Blueprint Ready</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent">30</div>
                  <div className="text-sm text-text-muted">Days to Deploy</div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Blueprints Grid */}
        <Section>
          {/* Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {statusFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeFilter === filter.value
                    ? "bg-accent text-white shadow-lg"
                    : "bg-base-tint text-text-muted hover:bg-base-shade"
                }`}
              >
                {filter.label}
                {filter.value !== "all" && (
                  <span className="ml-2 text-xs opacity-70">
                    ({blueprints.filter((b) => b.status === filter.value).length})
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Blueprints Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlueprints.map((blueprint, index) => (
              <AgentBlueprintCard
                key={blueprint.id}
                blueprint={blueprint}
                variant="default"
                index={index}
              />
            ))}
          </div>

          {filteredBlueprints.length === 0 && (
            <div className="text-center py-12">
              <p className="text-text-muted">No blueprints found with this filter.</p>
            </div>
          )}
        </Section>

        {/* Custom Build CTA */}
        <Section background="muted">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-display font-bold text-text-bright mb-4"
            >
              Need a Custom Agent?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-text-muted mb-8"
            >
              Our foundry can build custom AI agents tailored to your specific use case,
              with the same governance foundation as our pre-built blueprints.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <Link href="/contact" className="btn btn-primary group">
                Discuss Custom Build
                <ArrowRightIcon size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/agents" className="btn btn-outline group">
                Back to AI Agents
                <ArrowRightIcon size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
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
              Ready to get started?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-white/70 mb-8"
            >
              Schedule a demo to see these blueprints in action and learn how
              ArqAI can accelerate your enterprise AI strategy.
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
