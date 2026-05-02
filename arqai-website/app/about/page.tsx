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

const beliefs = [
  {
    title: "Vertical depth beats horizontal breadth.",
    description:
      "AI agents that try to do everything end up doing nothing well. We pick one workflow at a time and we go deep.",
  },
  {
    title: "Reliability is engineered, not promised.",
    description:
      "Production-grade is a property of the architecture, not a marketing line. We build the substrate first, then the products on top.",
  },
  {
    title: "Delivery is the product.",
    description:
      "A licence and a quickstart guide is not enough. We deploy. We run. We support. The same standard for every customer.",
  },
];

const team = [
  {
    name: "Jagannadh Varma Kanumuri",
    role: "Founder & CEO",
  },
  {
    name: "Habib Mehmoodi",
    role: "VP, Strategy & Innovation",
  },
];

export default function AboutPage() {
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
                About
              </p>

              <h1 className="text-display-xl md:text-[clamp(2.5rem,5vw,4rem)] font-display leading-[1.1] text-text-bright mb-6">
                We build AI agents for the workflows that matter most.
              </h1>

              <p className="text-body-lg md:text-xl text-text-medium max-w-3xl leading-relaxed">
                ArqAI Labs is the AI products and services arm of ACI Infotech. We build vertical AI agents for healthcare, insurance, and banking workflows where the cost of a wrong decision is measured in money, reputation, and operational time.
              </p>
            </motion.div>
          </div>
        </section>

        {/* What We Believe */}
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
                Our Beliefs
              </p>
              <h2 className="text-display-lg font-display text-text-bright">
                What we believe
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {beliefs.map((belief, index) => (
                <motion.div
                  key={belief.title}
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
                    {belief.title}
                  </h3>
                  <p className="text-body-md text-text-muted leading-relaxed">
                    {belief.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* The Team */}
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
                  Leadership
                </p>
                <h2 className="text-display-lg font-display text-text-bright mb-6">
                  The team
                </h2>
                <p className="text-body-lg text-text-muted mb-10">
                  ACI Infotech, our parent, has spent over a decade delivering Fortune 500 technology programmes in regulated industries. The team that builds and deploys ArqAI Labs products is the same team that has shipped at the standard our customers expect.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  {team.map((member, index) => (
                    <motion.div
                      key={member.name}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="card p-6"
                    >
                      <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                        <span className="text-2xl font-display font-bold text-accent">
                          {member.name.charAt(0)}
                        </span>
                      </div>
                      <h3 className="text-xl font-display font-semibold text-text-bright">
                        {member.name}
                      </h3>
                      <p className="text-body-md text-text-muted">{member.role}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Our Parent */}
        <section className="py-section bg-base-tint">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-display-lg font-display text-text-bright mb-6">
                  Our parent
                </h2>
                <div className="card p-8 bg-base">
                  <p className="text-body-lg text-text-muted leading-relaxed">
                    ArqAI Labs is part of ACI Infotech, a privately held technology services firm. ACI works with senior technology leaders across financial services, healthcare, insurance, telecommunications, and manufacturing.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-section bg-base">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-2xl md:text-3xl font-display font-semibold text-text-bright mb-8">
                  Want to work with us, build with us, or sell with us?
                </h2>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/demo"
                    className="btn bg-accent text-white hover:bg-accent/90"
                  >
                    Book a demo
                  </Link>
                  <Link href="/careers" className="btn btn-outline">
                    See open roles
                  </Link>
                  <Link href="/contact" className="btn btn-outline">
                    Become a partner
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
