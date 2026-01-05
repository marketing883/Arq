"use client";

import { motion } from "framer-motion";
import { CheckIcon, ArrowRightIcon } from "@/components/ui/Icons";

const timelinePhases = [
  {
    phase: 1,
    title: "Discovery & Planning",
    duration: "1-2 weeks",
    description:
      "We work with your team to understand your AI governance requirements, existing infrastructure, and compliance obligations.",
    activities: [
      "Technical architecture review",
      "Compliance requirements mapping",
      "Integration planning",
      "Success criteria definition",
    ],
    deliverables: [
      "Implementation roadmap",
      "Technical specification",
      "Compliance checklist",
    ],
  },
  {
    phase: 2,
    title: "Platform Setup & Configuration",
    duration: "2-3 weeks",
    description:
      "We deploy the ArqAI Foundry in your environment and configure it to match your organization's policies and workflows.",
    activities: [
      "Environment provisioning",
      "Policy Hub configuration",
      "Integration with existing systems",
      "Security configuration",
    ],
    deliverables: [
      "Deployed ArqAI instance",
      "Configured policy rules",
      "Integration connections",
    ],
  },
  {
    phase: 3,
    title: "Agent Migration & Testing",
    duration: "3-4 weeks",
    description:
      "We help migrate your existing AI agents to the platform and thoroughly test compliance enforcement and audit capabilities.",
    activities: [
      "Agent onboarding",
      "Compliance testing",
      "Audit trail validation",
      "Performance optimization",
    ],
    deliverables: [
      "Migrated agents",
      "Test reports",
      "Performance benchmarks",
    ],
  },
  {
    phase: 4,
    title: "Training & Go-Live",
    duration: "1-2 weeks",
    description:
      "We train your team on the platform and support you through the go-live process with hands-on assistance.",
    activities: [
      "Admin training",
      "Developer training",
      "Go-live support",
      "Documentation handoff",
    ],
    deliverables: [
      "Trained team",
      "Production deployment",
      "Operational runbooks",
    ],
  },
  {
    phase: 5,
    title: "Ongoing Optimization",
    duration: "Continuous",
    description:
      "Our customer success team works with you to optimize your AI governance program and expand platform adoption.",
    activities: [
      "Quarterly business reviews",
      "New use case enablement",
      "Policy optimization",
      "Platform updates",
    ],
    deliverables: [
      "Performance reports",
      "Optimization recommendations",
      "Expanded capabilities",
    ],
  },
];

export function TimelineBlock() {
  return (
    <div className="space-y-8">
      <p className="text-[var(--arq-gray-600)] text-center max-w-2xl mx-auto">
        Our proven implementation methodology ensures a smooth deployment of the
        ArqAI Foundry platform in your enterprise environment.
      </p>

      {/* Timeline Total */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center"
      >
        <div className="inline-flex items-center gap-4 px-6 py-3 rounded-full bg-[var(--arq-blue)]/10 border border-[var(--arq-blue)]/20">
          <span className="text-[var(--arq-gray-600)]">Typical Timeline:</span>
          <span className="text-xl font-bold text-[var(--arq-blue)]">
            30-90 Days
          </span>
          <span className="text-sm text-[var(--arq-gray-500)]">
            to production
          </span>
        </div>
      </motion.div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-8 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[var(--arq-blue)] via-[var(--arq-lime)] to-[var(--arq-blue)]" />

        <div className="space-y-12">
          {timelinePhases.map((phase, index) => (
            <motion.div
              key={phase.phase}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.15 }}
              className={`relative flex flex-col md:flex-row gap-8 ${
                index % 2 === 0 ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Phase Indicator */}
              <div className="absolute left-8 md:left-1/2 md:-translate-x-1/2 w-4 h-4 rounded-full bg-[var(--arq-blue)] border-4 border-white shadow-lg z-10" />

              {/* Content Card */}
              <div
                className={`flex-1 ml-16 md:ml-0 ${
                  index % 2 === 0 ? "md:pr-16" : "md:pl-16"
                }`}
              >
                <div className="p-8 md:p-10 rounded-2xl bg-white border border-[var(--arq-gray-200)] shadow-sm hover:shadow-md transition-shadow">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div>
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[var(--arq-blue)]/10 text-[var(--arq-blue)] mb-3">
                        Phase {phase.phase}
                      </span>
                      <h3 className="text-xl font-bold text-[var(--arq-black)]">
                        {phase.title}
                      </h3>
                    </div>
                    <span className="text-sm font-semibold text-[var(--arq-lime)] bg-[var(--arq-black)] px-4 py-1.5 rounded-full whitespace-nowrap">
                      {phase.duration}
                    </span>
                  </div>

                  <p className="text-[var(--arq-gray-600)] mb-6 leading-relaxed">
                    {phase.description}
                  </p>

                  {/* Activities & Deliverables */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-semibold text-[var(--arq-gray-700)] mb-3">
                        Key Activities
                      </h4>
                      <ul className="space-y-2">
                        {phase.activities.map((activity, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm text-[var(--arq-gray-600)]"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--arq-blue)] mt-1.5 flex-shrink-0" />
                            {activity}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-[var(--arq-gray-700)] mb-3">
                        Deliverables
                      </h4>
                      <ul className="space-y-2">
                        {phase.deliverables.map((deliverable, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm text-[var(--arq-gray-600)]"
                          >
                            <CheckIcon
                              size={14}
                              className="text-[var(--arq-lime)] mt-0.5 flex-shrink-0"
                            />
                            {deliverable}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Empty space for alternating layout */}
              <div className="hidden md:block flex-1" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="text-center pt-8"
      >
        <p className="text-sm text-[var(--arq-gray-600)] mb-4">
          Ready to start your implementation journey?
        </p>
        <a
          href="/demo"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--arq-blue)] text-white rounded-lg font-semibold hover:bg-[var(--arq-blue)]/90 transition-colors"
        >
          Schedule a Discovery Call
          <ArrowRightIcon size={18} />
        </a>
      </motion.div>
    </div>
  );
}
