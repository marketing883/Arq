"use client";

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

const useCases: { tag: string; title: string; body: string }[] = [
  {
    tag: "Retail",
    title: "Loyalty that learns what each customer values.",
    body: "AI that replaces points-and-badges with offers tuned to actual buying behavior. Retention up. Spend on stale incentives down.",
  },
  {
    tag: "Healthcare",
    title: "Patient management that doesn't drop people in the gap.",
    body: "AI that follows up, schedules, and surfaces the patients your team needs to call today. Less leakage between visits.",
  },
  {
    tag: "Insurance / Healthcare",
    title: "Claims triage in days, not weeks.",
    body: "AI that routes incoming claims to the right person, prioritises the queue, and supports the decision your team makes.",
  },
  {
    tag: "Manufacturing",
    title: "ERP that finally answers the question.",
    body: "AI on top of your ERP that turns the data into decisions. Fewer reports your team has to assemble by hand.",
  },
  {
    tag: "Hospitality",
    title: "Revenue management that doesn't miss a fill night.",
    body: "AI that prices rooms, packages, and add-ons dynamically against demand, competitor pricing, and your own historical patterns. More revenue per available unit. Fewer empty rooms.",
  },
  {
    tag: "Facilities management",
    title: "Maintenance that fixes things before they break.",
    body: "AI that predicts failures across HVAC, elevators, lighting, and critical equipment from sensor data and service history. Less downtime. Lower cost per repair.",
  },
  {
    tag: "Microsoft 365",
    title: "Microsoft Copilot, tuned to your operation.",
    body: "Copilot extended with your context, your workflows, and the security posture your IT requires. Out-of-the-box does not get you there. We do.",
  },
  {
    tag: "Microsoft Dynamics",
    title: "Dynamics 365, AI-fied.",
    body: "Your Dynamics with AI that learns from your sales motion and your service desk. Less manual entry. Better next-best actions.",
  },
  {
    tag: "AWS ecosystem",
    title: "AWS Quick, configured.",
    body: "Quick Suite tuned for the agents your operation actually needs, integrated with the systems you already run.",
  },
  {
    tag: "Banking",
    title: "Customer onboarding that finishes itself.",
    body: "AI that gets KYC and CDD across the line without dropping the application. Fewer abandoned applications. Faster time-to-active customer.",
  },
  {
    tag: "Retail",
    title: "Inventory that anticipates.",
    body: "AI that sees the shelf, the season, and the local trend at once. Stock-outs down. Markdowns down.",
  },
  {
    tag: "Manufacturing",
    title: "Quality control with eyes on every shift.",
    body: "Vision and language models that catch what the manual sample missed. Defect rates down. Yield up.",
  },
  {
    tag: "Cross-industry",
    title: "SAP S/4HANA, AI-fied.",
    body: "Your S/4HANA with AI that turns master data into decisions. Less time in screens. More time in the work.",
  },
];

export default function UseCasesPage() {
  return (
    <>
      <Header />

      <main className="bg-base">
        {/* Hero */}
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
                What we work on
              </p>

              <h1 className="text-display-xl md:text-[clamp(2.5rem,5vw,4.5rem)] font-display leading-[1.1] text-text-bright mb-6">
                Use cases we&apos;ve built. Or are building. Or are ready to build.
              </h1>

              <p className="text-body-lg md:text-xl text-text-medium leading-relaxed max-w-3xl">
                Each one started the same way: a team with a complex operation and an AI alternative that didn&apos;t fit. We tuned it until it did.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Use case grid */}
        <section className="py-section bg-base-tint">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
              {useCases.map((uc, index) => (
                <motion.article
                  key={uc.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 20,
                    delay: (index % 3) * 0.06,
                  }}
                  whileHover={{ y: -4 }}
                  className="card flex flex-col h-full hover:border-accent transition-colors"
                >
                  <p className="text-body-xs text-accent uppercase tracking-wider mb-3">
                    {uc.tag}
                  </p>
                  <h3 className="text-lg font-display font-semibold text-text-bright leading-snug mb-3">
                    {uc.title}
                  </h3>
                  <p className="text-body-sm text-text-muted leading-relaxed flex-1">
                    {uc.body}
                  </p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* Don't see your use case */}
        <section className="py-section bg-base">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-display-md font-display text-text-bright mb-6">
                Don&apos;t see your use case?
              </h2>
              <p className="text-body-lg text-text-muted mb-8">
                We don&apos;t ship templates. Most of the engagements we run weren&apos;t on a public page when they started. Tell us what your operation needs. We&apos;ll tell you what&apos;s honestly possible.
              </p>
              <Link href="/engage-us" className="btn bg-accent text-white">
                Get Started
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
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
