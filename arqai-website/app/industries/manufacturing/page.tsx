"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

function StarIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path d="M19.6,9.6h-3.9c-.4,0-1.8-.2-1.8-.2-.6,0-1.1-.2-1.6-.6-.5-.3-.9-.8-1.2-1.2-.3-.4-.4-.9-.5-1.4,0,0,0-1.1-.2-1.5V.4c0-.2-.2-.4-.4-.4s-.4.2-.4.4v4.4c0,.4-.2,1.5-.2,1.5,0,.5-.2,1-.5,1.4-.3.5-.7.9-1.2,1.2s-1,.5-1.6.6c0,0-1.2,0-1.7.2H.4c-.2,0-.4.2-.4.4s.2.4.4.4h4.1c.4,0,1.7.2,1.7.2.6,0,1.1.2,1.6.6.4.3.8.7,1.1,1.1.3.5.5,1,.6,1.6,0,0,0,1.3.2,1.7v4.1c0,.2.2.4.4.4s.4-.2.4-.4v-4.1c0-.4.2-1.7.2-1.7,0-.6.2-1.1.6-1.6.3-.4.7-.8,1.1-1.1.5-.3,1-.5,1.6-.6,0,0,1.3,0,1.8-.2h3.9c.2,0,.4-.2.4-.4s-.2-.4-.4-.4h0Z" />
    </svg>
  );
}

const useCases = [
  {
    title: "ERP that finally answers the question.",
    body: "AI on top of your ERP that turns the data into decisions. Fewer reports your team has to assemble by hand.",
  },
  {
    title: "Quality control with eyes on every shift.",
    body: "Vision and language models that catch what the manual sample missed. Defect rates down. Yield up.",
  },
  {
    title: "Predictive maintenance for the shop floor.",
    body: "AI that predicts failures across critical equipment from sensor data and service history. Less downtime. Lower cost per repair.",
  },
];

export default function ManufacturingPage() {
  return (
    <>
      <Header />

      <main className="bg-base">
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
                  Industries / Manufacturing
                </p>
                <h1 className="text-display-xl md:text-[clamp(2.5rem,5vw,4rem)] font-display leading-[1.1] text-text-bright mb-6">
                  AI for manufacturing operations that need their data to talk back.
                </h1>
                <p className="text-body-lg text-text-medium leading-relaxed mb-8">
                  We build AI on top of your ERP, your shop floor, and your quality-control workflow. Reports that don&apos;t take your team three days to assemble.
                </p>
                <Link href="/engage-us" className="btn bg-accent text-white hover:bg-accent/90">
                  Engage us
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-2xl shadow-accent/15"
              >
                <Image
                  src="/img/services/Manufacturing-Autonomous-Maintenance-With-Scoped-Agent-Control.jpg"
                  alt="Manufacturing operations"
                  fill
                  priority
                  sizes="(min-width:1024px) 50vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-base-opp/40 to-transparent" />
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-section bg-base-tint">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <h2 className="text-display-md font-display text-text-bright mb-10 max-w-3xl">
              Where we work in manufacturing.
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {useCases.map((uc) => (
                <div key={uc.title} className="card flex flex-col h-full">
                  <h3 className="text-lg font-display font-semibold text-text-bright mb-3">
                    {uc.title}
                  </h3>
                  <p className="text-body-sm text-text-muted leading-relaxed">{uc.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-section bg-base text-center">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <h2 className="text-display-md font-display text-text-bright mb-6">
              Tell us what your operation needs.
            </h2>
            <Link href="/engage-us" className="btn bg-accent text-white">
              Engage us
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
