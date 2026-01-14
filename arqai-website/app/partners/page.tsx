"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Section, SectionHeader, LogoAccent } from "@/components/ui/Section";
import {
  CheckIcon,
  ArrowRightIcon,
  SecurityIcon,
  CertificateIcon,
} from "@/components/ui/Icons";
import { getIntegrationLogo } from "@/components/ui/IntegrationLogos";

// Strategic Technology Partners
const strategicPartners = [
  {
    name: "AWS",
    tier: "Advanced Consulting Partner",
    description: "Enterprise cloud infrastructure & AI/ML services",
  },
  {
    name: "Azure",
    tier: "Gold Partner",
    description: "Hybrid cloud & enterprise integration",
  },
  {
    name: "Google Cloud",
    tier: "Premier Partner",
    description: "Data analytics & AI platform services",
  },
  {
    name: "Anthropic",
    tier: "Enterprise Partner",
    description: "Safe, beneficial AI deployment",
  },
  {
    name: "OpenAI",
    tier: "Technology Partner",
    description: "GPT model integration & fine-tuning",
  },
  {
    name: "Salesforce",
    tier: "AppExchange Partner",
    description: "CRM integration & automation",
  },
];

// Integration & Platform Partners
const integrationPartners = [
  {
    name: "ServiceNow",
    description: "IT workflow automation",
  },
  {
    name: "Snowflake",
    description: "Data cloud & analytics",
  },
  {
    name: "Databricks",
    description: "Unified analytics platform",
  },
  {
    name: "Cohere",
    description: "Enterprise NLP solutions",
  },
  {
    name: "Slack",
    description: "Workplace communication",
  },
  {
    name: "Microsoft Teams",
    description: "Collaboration & productivity",
  },
];

// Partnership Stats
const partnerStats = [
  { value: "50+", label: "Technology Partners" },
  { value: "200+", label: "Enterprise Certifications" },
  { value: "35%", label: "Faster Deployment" },
  { value: "15+", label: "Countries Covered" },
];

// Partnership Models
const partnershipModels = [
  {
    title: "Technology Alliance",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
      </svg>
    ),
    forWho: "Software/platform vendors, cloud providers",
    benefits: [
      "Co-marketing & joint solutions",
      "Technical integration support",
      "Executive sponsorship",
      "Joint go-to-market programs",
    ],
    requirements: "Complementary technology, enterprise focus",
  },
  {
    title: "Implementation Partner",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    forWho: "Regional specialists, boutique consultancies",
    benefits: [
      "Deal registration & protection",
      "Technical training & certification",
      "Co-delivery opportunities",
      "Pre-sales support",
    ],
    requirements: "Technical certification, proven delivery track record",
  },
  {
    title: "Reseller Partner",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    forWho: "VARs, MSPs, system integrators",
    benefits: [
      "Competitive margin structure",
      "Deal support & enablement",
      "Demo environments",
      "Marketing development funds",
    ],
    requirements: "Sales capacity, customer support capability",
  },
  {
    title: "Strategic Alliance",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    forWho: "Market leaders, complementary service providers",
    benefits: [
      "Executive sponsorship",
      "Co-innovation programs",
      "Joint IP development",
      "Strategic account alignment",
    ],
    requirements: "Strategic fit, enterprise relationships",
  },
];

// Partner Benefits
const partnerBenefits = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    title: "Training & Certification",
    description: "Access ArqAI methodology, technical training, and certification programs",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
      </svg>
    ),
    title: "Sales Enablement",
    description: "Demo environments, pre-sales support, and RFP assistance",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
      </svg>
    ),
    title: "Marketing Support",
    description: "Co-branded materials, event participation, and PR opportunities",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    title: "Technical Resources",
    description: "API documentation, sandbox environments, and integration support",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: "Deal Support",
    description: "Deal registration, solution architecting, and joint pursuit teams",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
      </svg>
    ),
    title: "Partner Portal",
    description: "Resource library, certification tracking, and deal pipeline management",
  },
];

// Partner Testimonials
const testimonials = [
  {
    quote: "ArqAI doesn't just implement our platform—they extend it. Their deep technical expertise and customer-first approach make them our go-to partner for complex enterprise deployments.",
    author: "VP Strategic Partnerships",
    company: "Major Cloud Provider",
  },
  {
    quote: "The level of integration and co-innovation we've achieved with ArqAI has transformed how our mutual customers approach AI governance. They truly understand enterprise requirements.",
    author: "Director of Alliances",
    company: "Enterprise Software Vendor",
  },
  {
    quote: "Working with ArqAI has accelerated our time-to-market for AI solutions by 40%. Their compliance-first approach aligns perfectly with our regulated industry customers.",
    author: "Head of Partner Ecosystem",
    company: "Global Systems Integrator",
  },
];

// Certifications
const certifications = [
  { provider: "AWS", certs: ["Advanced Consulting Partner", "Well-Architected", "AI/ML Competency"] },
  { provider: "Azure", certs: ["Gold Partner", "AI & Machine Learning", "Security"] },
  { provider: "Google Cloud", certs: ["Premier Partner", "Machine Learning", "Data Analytics"] },
  { provider: "Salesforce", certs: ["Summit Partner", "AI Associate", "Platform Developer"] },
];

export default function PartnersPage() {
  const [activeModel, setActiveModel] = useState<number | null>(null);
  const [showAllCerts, setShowAllCerts] = useState(false);

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
                  Partner Ecosystem
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--arq-black)] mb-6 leading-tight"
              >
                Building Tomorrow&apos;s Enterprise Solutions,{" "}
                <span className="text-[var(--arq-blue)]">Together</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xl text-[var(--arq-gray-600)] mb-8 max-w-3xl mx-auto"
              >
                At ArqAI, we don&apos;t just work with technology leaders—we build integrated
                solutions that deliver measurable enterprise outcomes. Our partnerships extend
                your capabilities and amplify your impact.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex justify-center"
              >
                <Button
                  href="#become-partner"
                  variant="primary"
                  size="lg"
                  rightIcon={<ArrowRightIcon size={20} />}
                >
                  Become a Partner
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Partnership Philosophy Section */}
        <Section background="muted">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-block text-sm font-semibold text-[var(--arq-blue)] uppercase tracking-wider mb-4">
                Our Philosophy
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--arq-black)] mb-6">
                True Collaboration, Not Vendor Relationships
              </h2>
              <p className="text-lg text-[var(--arq-gray-600)] mb-6">
                We believe the best enterprise solutions emerge from true collaboration,
                not transactional vendor relationships. Our partners aren&apos;t logos on a
                page—they&apos;re co-creators in delivering business transformation for
                Fortune 500 clients.
              </p>
              <p className="text-[var(--arq-gray-600)] mb-8">
                Every partnership is built on shared success metrics, deep technical
                integration, and a co-innovation approach that ensures we&apos;re always
                pushing the boundaries of what&apos;s possible in enterprise AI governance.
              </p>
              <div className="space-y-4">
                {[
                  "Deep technical integration vs. superficial partnerships",
                  "Shared success metrics tied to customer outcomes",
                  "Co-innovation approach to product development",
                  "Enterprise-grade implementation expertise",
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckIcon size={20} className="text-[var(--arq-lime)] flex-shrink-0" />
                    <span className="text-[var(--arq-gray-700)]">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              {partnerStats.map((stat, index) => (
                <Card
                  key={index}
                  className="p-6 text-center bg-white border border-[var(--arq-gray-200)] !rounded-lg"
                >
                  <div className="text-4xl md:text-5xl font-bold text-[var(--arq-blue)] mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-[var(--arq-gray-600)]">{stat.label}</div>
                </Card>
              ))}
            </motion.div>
          </div>
        </Section>

        {/* Partner Ecosystem Section */}
        <Section id="partner-ecosystem">
          <SectionHeader
            eyebrow="Partner Ecosystem"
            title="World-Class Technology Partners"
            description="We've built strategic alliances with the world's leading technology providers to deliver comprehensive, integrated solutions."
          />

          {/* Strategic Partners */}
          <div className="mb-16">
            <h3 className="text-xl font-semibold text-[var(--arq-black)] mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--arq-blue)]" />
              Strategic Technology Partners
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {strategicPartners.map((partner, index) => {
                const LogoComponent = getIntegrationLogo(partner.name);
                return (
                  <motion.div
                    key={partner.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="p-6 bg-white border border-[var(--arq-gray-200)] hover:border-[var(--arq-blue)] hover:shadow-lg transition-all group !rounded-lg">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-lg bg-[var(--arq-gray-50)] flex items-center justify-center group-hover:bg-[var(--arq-blue)]/10 transition-colors">
                          {LogoComponent && (
                            <LogoComponent
                              size={32}
                              className="text-[var(--arq-black)]"
                            />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-[var(--arq-black)]">
                              {partner.name}
                            </h4>
                            <span className="px-2 py-0.5 text-xs font-medium bg-[var(--arq-lime)]/20 text-[var(--arq-black)] rounded-full">
                              Strategic
                            </span>
                          </div>
                          <p className="text-xs text-[var(--arq-blue)] font-medium mb-2">
                            {partner.tier}
                          </p>
                          <p className="text-sm text-[var(--arq-gray-600)]">
                            {partner.description}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Integration Partners */}
          <div>
            <h3 className="text-xl font-semibold text-[var(--arq-black)] mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--arq-lime)]" />
              Integration & Platform Partners
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {integrationPartners.map((partner, index) => {
                const LogoComponent = getIntegrationLogo(partner.name);
                return (
                  <motion.div
                    key={partner.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="p-4 bg-white border border-[var(--arq-gray-200)] hover:border-[var(--arq-lime)] transition-colors group text-center !rounded-lg">
                      {LogoComponent && (
                        <LogoComponent
                          size={40}
                          className="text-[var(--arq-black)] mx-auto mb-3 group-hover:text-[var(--arq-gray-800)] transition-colors"
                        />
                      )}
                      <h4 className="font-medium text-sm text-[var(--arq-black)] mb-1">
                        {partner.name}
                      </h4>
                      <p className="text-xs text-[var(--arq-gray-500)]">
                        {partner.description}
                      </p>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </Section>

        {/* Partnership Models Section */}
        <Section background="muted">
          <SectionHeader
            eyebrow="Partnership Models"
            title="Choose Your Partnership Path"
            description="We offer flexible partnership models designed to maximize mutual value and drive customer success."
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {partnershipModels.map((model, index) => (
              <motion.div
                key={model.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className={`p-6 h-full bg-white border transition-all cursor-pointer !rounded-lg ${
                    activeModel === index
                      ? "border-[var(--arq-blue)] shadow-lg"
                      : "border-[var(--arq-gray-200)] hover:border-[var(--arq-gray-300)]"
                  }`}
                  onClick={() => setActiveModel(activeModel === index ? null : index)}
                >
                  <div className="w-14 h-14 rounded-lg bg-[var(--arq-blue)]/10 flex items-center justify-center text-[var(--arq-blue)] mb-4">
                    {model.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-[var(--arq-black)] mb-2">
                    {model.title}
                  </h3>
                  <p className="text-sm text-[var(--arq-gray-600)] mb-4">
                    <span className="font-medium">For:</span> {model.forWho}
                  </p>

                  <motion.div
                    initial={false}
                    animate={{ height: activeModel === index ? "auto" : 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 border-t border-[var(--arq-gray-100)]">
                      <p className="text-sm font-medium text-[var(--arq-black)] mb-3">Benefits:</p>
                      <ul className="space-y-2 mb-4">
                        {model.benefits.map((benefit, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-[var(--arq-gray-600)]">
                            <CheckIcon size={16} className="text-[var(--arq-lime)] flex-shrink-0 mt-0.5" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                      <p className="text-xs text-[var(--arq-gray-500)]">
                        <span className="font-medium">Requirements:</span> {model.requirements}
                      </p>
                    </div>
                  </motion.div>

                  <div className="mt-4 flex items-center gap-1 text-sm text-[var(--arq-blue)]">
                    {activeModel === index ? "Less details" : "View details"}
                    <svg
                      className={`w-4 h-4 transition-transform ${activeModel === index ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* Partner Benefits Section */}
        <Section>
          <SectionHeader
            eyebrow="Partner Benefits"
            title="Everything You Need to Succeed"
            description="Our partners receive comprehensive support to drive mutual success and deliver exceptional value to customers."
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partnerBenefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-6 bg-white border border-[var(--arq-gray-200)] hover:shadow-md transition-shadow h-full !rounded-lg">
                  <div className="w-12 h-12 rounded-lg bg-[var(--arq-lime)]/20 flex items-center justify-center text-[var(--arq-black)] mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-[var(--arq-black)] mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-[var(--arq-gray-600)]">
                    {benefit.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* Testimonials Section */}
        <Section>
          <SectionHeader
            eyebrow="Partner Testimonials"
            title="What Our Partners Say"
            description="Hear directly from our partners about the value of working with ArqAI."
          />

          <div className="grid lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 bg-[var(--arq-gray-50)] border-0 h-full flex flex-col !rounded-lg">
                  <div className="mb-4">
                    <svg className="w-10 h-10 text-[var(--arq-blue)]/20" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                  </div>
                  <blockquote className="text-[var(--arq-gray-700)] mb-6 flex-1">
                    &ldquo;{testimonial.quote}&rdquo;
                  </blockquote>
                  <div className="pt-4 border-t border-[var(--arq-gray-200)]">
                    <p className="font-semibold text-[var(--arq-black)]">{testimonial.author}</p>
                    <p className="text-sm text-[var(--arq-gray-500)]">{testimonial.company}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* Certifications Section */}
        <Section background="muted">
          <SectionHeader
            eyebrow="Certifications"
            title="Verified Expertise Across Platforms"
            description="Our team maintains the highest level of certifications across our partner ecosystem."
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((cert, index) => {
              const LogoComponent = getIntegrationLogo(cert.provider);
              return (
                <motion.div
                  key={cert.provider}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="p-6 bg-white border border-[var(--arq-gray-200)] text-center !rounded-lg">
                    <div className="w-16 h-16 mx-auto rounded-lg bg-[var(--arq-gray-50)] flex items-center justify-center mb-4">
                      {LogoComponent && (
                        <LogoComponent size={36} className="text-[var(--arq-black)]" />
                      )}
                    </div>
                    <h4 className="font-semibold text-[var(--arq-black)] mb-3">{cert.provider}</h4>
                    <ul className="space-y-2">
                      {cert.certs.map((c, i) => (
                        <li key={i} className="flex items-center justify-center gap-2 text-sm text-[var(--arq-gray-600)]">
                          <CertificateIcon size={14} className="text-[var(--arq-lime)]" />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </Section>

        {/* Become a Partner CTA Section */}
        <Section id="become-partner" background="dark" className="relative overflow-hidden">
          <LogoAccent position="top-right" type="lime" size="lg" />
          <LogoAccent position="bottom-left" type="blue" size="md" />

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                Let&apos;s Build Something Great Together
              </h2>
              <p className="text-lg text-[var(--arq-gray-300)] mb-8 max-w-2xl mx-auto">
                We&apos;re always looking for like-minded innovators who share our passion for
                transforming enterprise AI. If you believe in collaboration over competition,
                we&apos;d love to hear from you.
              </p>

              {/* Process Steps */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                {[
                  { step: "1", label: "Start a Conversation" },
                  { step: "2", label: "Explore the Fit" },
                  { step: "3", label: "Align on Goals" },
                  { step: "4", label: "Launch Together" },
                ].map((item, index) => (
                  <div key={item.step} className="text-center">
                    <div className="w-10 h-10 rounded-full bg-[var(--arq-lime)] text-[var(--arq-black)] font-bold flex items-center justify-center mx-auto mb-2">
                      {item.step}
                    </div>
                    <p className="text-sm text-[var(--arq-gray-300)]">{item.label}</p>
                    {index < 3 && (
                      <div className="hidden md:block absolute h-0.5 w-12 bg-[var(--arq-gray-700)] top-5 -right-8" />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-center">
                <Button
                  href="/contact?type=partner"
                  variant="accent"
                  size="lg"
                  rightIcon={<ArrowRightIcon size={20} />}
                >
                  Start the Conversation
                </Button>
              </div>

              <p className="mt-6 text-sm text-[var(--arq-gray-400)]">
                Questions? Email us at{" "}
                <a href="mailto:partners@thearq.ai" className="text-[var(--arq-lime)] hover:underline">
                  partners@thearq.ai
                </a>
              </p>
            </motion.div>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
