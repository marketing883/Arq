import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "ArqFWA | AI agent for fraud, waste, and abuse detection",
  description:
    "ArqFWA is the AI agent for fraud, waste, and abuse detection. Built for healthcare payers and P&C insurance carriers. Production-grade. End-to-end delivered.",
};

const differentiators = [
  {
    title: "Built for the workflow, not configured into it",
    description:
      "ArqFWA is a finished product. It does fraud, waste, and abuse. It does not ship as a kit. Your team does not train models. Your engineering bench does not get pulled into AI ops.",
  },
  {
    title: "Engineered for production from day one",
    description:
      "ArqFWA runs on the same architectural foundation every ArqAI Labs product is built on. Cryptographic identity for the agent. Runtime policy enforcement before any action. Observable, governed retrieval for every data lookup. Production-grade is the default state.",
  },
  {
    title: "Deployed end-to-end",
    description:
      "We deploy ArqFWA into your environment, integrate it with your existing systems, and run it alongside your team. Your operation gets a working agent. Not a software licence and a long project plan.",
  },
];

const faqs = [
  {
    question: "Does ArqFWA replace our team?",
    answer:
      "No. ArqFWA prioritises and explains. Your team makes the call on the case. Authority stays with your people.",
  },
  {
    question: "What does ArqFWA need to start?",
    answer:
      "A scoped pilot data set, your security and compliance review, and a defined target workflow. We commit a deployment timeline once those three are in place.",
  },
  {
    question: "How is ArqFWA priced?",
    answer:
      "Per engagement. We do not list pricing publicly. We work with each customer on the scope and pricing model that fits the deployment.",
  },
  {
    question: "Where does our data live?",
    answer:
      "In your environment. ArqFWA is deployed inside your cloud or your sovereign provider. Your data is not used to train shared models.",
  },
  {
    question: "Which AI provider does ArqFWA use?",
    answer:
      "ArqFWA is built to run on the AI provider your environment is already aligned with: Anthropic, OpenAI, Azure OpenAI, AWS Bedrock. Stack-agnostic by design.",
  },
];

function StarIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path d="M19.6,9.6h-3.9c-.4,0-1.8-.2-1.8-.2-.6,0-1.1-.2-1.6-.6-.5-.3-.9-.8-1.2-1.2-.3-.4-.4-.9-.5-1.4,0,0,0-1.1-.2-1.5V.4c0-.2-.2-.4-.4-.4s-.4.2-.4.4v4.4c0,.4-.2,1.5-.2,1.5,0,.5-.2,1-.5,1.4-.3.5-.7.9-1.2,1.2s-1,.5-1.6.6c0,0-1.2,0-1.7.2H.4c-.2,0-.4.2-.4.4s.2.4.4.4h4.1c.4,0,1.7.2,1.7.2.6,0,1.1.2,1.6.6.4.3.8.7,1.1,1.1.3.5.5,1,.6,1.6,0,0,0,1.3.2,1.7v4.1c0,.2.2.4.4.4s.4-.2.4-.4v-4.1c0-.4.2-1.7.2-1.7,0-.6.2-1.1.6-1.6.3-.4.7-.8,1.1-1.1.5-.3,1-.5,1.6-.6,0,0,1.3,0,1.8-.2h3.9c.2,0,.4-.2.4-.4s-.2-.4-.4-.4h0Z" />
    </svg>
  );
}

export default function ArqFWAPage() {
  return (
    <>
      <Header />
      <main className="bg-base pt-32 md:pt-40">
        {/* Hero Section */}
        <section className="pb-16 md:pb-24">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="grid lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-body-sm text-text-muted uppercase tracking-wider">
                    Product
                  </span>
                  <span className="text-text-muted">•</span>
                  <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full text-white bg-green-500">
                    LIVE
                  </span>
                </div>

                <h1 className="text-display-xl md:text-[clamp(2.5rem,5vw,4rem)] font-display leading-[1.1] text-text-bright mb-6">
                  The AI agent for fraud, waste, and abuse detection.{" "}
                  <span className="text-text-muted">Built for the workflow.</span>
                </h1>

                <p className="text-body-lg md:text-xl text-text-medium mb-10 leading-relaxed">
                  ArqFWA is purpose-built for fraud, waste, and abuse detection in healthcare payer and P&C insurance operations. It reviews high volumes of claims and transactions, prioritises the cases your team should focus on, and explains its reasoning so a human can act on it. Engineered for production from day one. Deployed end-to-end by our team.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/demo"
                    className="btn bg-accent text-white hover:bg-accent/90"
                  >
                    Book an ArqFWA demo
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
                    </svg>
                  </Link>
                  <Link href="/how-it-works" className="btn btn-outline">
                    See how ArqFWA is built
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5 relative">
                <div className="relative rounded-xl overflow-hidden shadow-2xl shadow-accent/15 border border-stroke-muted bg-base-tint">
                  <Image
                    src="/img/Operations-center.png"
                    alt="ArqFWA Operations Center interface"
                    width={900}
                    height={600}
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Product imagery strip */}
        <section className="pb-section">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="relative rounded-xl overflow-hidden border border-stroke-muted bg-base-tint">
                <Image
                  src="/img/Audit-logs.png"
                  alt="ArqFWA audit logs view"
                  width={900}
                  height={600}
                  className="w-full h-auto"
                />
                <div className="p-5 border-t border-stroke-muted">
                  <p className="text-body-xs text-accent uppercase tracking-wider mb-1">Audit logs</p>
                  <p className="text-body-sm text-text-muted">Every agent action is identified, signed, and traceable.</p>
                </div>
              </div>
              <div className="relative rounded-xl overflow-hidden border border-stroke-muted bg-base-tint">
                <Image
                  src="/img/Policy-Hub-Interface.png"
                  alt="ArqFWA policy hub interface"
                  width={900}
                  height={600}
                  className="w-full h-auto"
                />
                <div className="p-5 border-t border-stroke-muted">
                  <p className="text-body-xs text-accent uppercase tracking-wider mb-1">Policy hub</p>
                  <p className="text-body-sm text-text-muted">Compliance constraints enforced at runtime, not assumed.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Problem Section */}
        <section className="py-section bg-base-tint">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h2 className="text-display-lg font-display text-text-bright mb-6">
                Your team is the bottleneck. The AI alternatives do not help.
              </h2>
              <p className="text-body-lg text-text-muted leading-relaxed">
                Healthcare and insurance leak hundreds of billions of dollars to fraud, waste, and abuse every year. Most of it is caught manually. AI promised to fix this. But most of the AI options on the market either ask your team to build the agent themselves on a horizontal toolkit (twelve months of internal work, no guarantee of production), or arrive as a black box that your operations leaders cannot defend.
              </p>
            </div>
          </div>
        </section>

        {/* How ArqFWA is Different */}
        <section className="py-section bg-base">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="mb-12">
              <p className="flex items-center gap-2 text-body-sm text-accent mb-4">
                <StarIcon className="w-4 h-4" />
                Differentiation
              </p>
              <h2 className="text-display-lg font-display text-text-bright">
                How ArqFWA is different
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {differentiators.map((item, index) => (
                <div key={index} className="relative">
                  <div className="text-5xl font-display font-bold text-accent/20 mb-4">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <h3 className="text-xl font-display font-semibold text-text-bright mb-4">
                    {item.title}
                  </h3>
                  <p className="text-body-md text-text-muted leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Who ArqFWA is For */}
        <section className="py-section bg-base-tint">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="mb-12">
              <p className="flex items-center gap-2 text-body-sm text-accent mb-4">
                <StarIcon className="w-4 h-4" />
                Audience
              </p>
              <h2 className="text-display-lg font-display text-text-bright">
                Who ArqFWA is for
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="card p-8">
                <h3 className="text-xl font-display font-semibold text-text-bright mb-4">
                  For the workflow owner
                </h3>
                <p className="text-body-md text-text-muted">
                  Operations leaders, fraud and special-investigations teams, and program-integrity directors at healthcare payers and P&C carriers. The people who own the throughput, the recovery rate, and the operational economics of the workflow.
                </p>
              </div>
              <div className="card p-8">
                <h3 className="text-xl font-display font-semibold text-text-bright mb-4">
                  For the technology and AI executives backing them
                </h3>
                <p className="text-body-md text-text-muted">
                  CTOs, Chief Digital Officers, and Heads of AI evaluating the build-vs-deploy decision for fraud-detection AI. The case for ArqFWA is straightforward: deploy a finished agent, free your team to ship the things only you can ship.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What Changes */}
        <section className="py-section bg-base">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-display-md font-display text-text-bright mb-8 text-center">
                What changes when ArqFWA is in production
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-6 rounded-lg bg-base-tint">
                  <div className="w-2 h-2 rounded-full bg-accent mt-2 shrink-0" />
                  <p className="text-body-md text-text-bright">
                    More fraud, waste, and abuse detected, with the explanation needed for downstream action.
                  </p>
                </div>
                <div className="flex items-start gap-4 p-6 rounded-lg bg-base-tint">
                  <div className="w-2 h-2 rounded-full bg-accent mt-2 shrink-0" />
                  <p className="text-body-md text-text-bright">
                    Less time per investigation. Your team focuses on the work most likely to recover money.
                  </p>
                </div>
                <div className="flex items-start gap-4 p-6 rounded-lg bg-base-tint">
                  <div className="w-2 h-2 rounded-full bg-accent mt-2 shrink-0" />
                  <p className="text-body-md text-text-bright">
                    Predictable operational performance. Production-grade reliability without internal AI engineering overhead.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How We Deploy */}
        <section className="py-section bg-base-opp">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-display-md font-display text-base mb-6">
                How we deploy
              </h2>
              <p className="text-body-lg text-base/70 mb-0">
                ArqFWA deploys into your environment, on the cloud you already use, with the systems your team already runs. A senior delivery team works alongside your operations, technology, security, and compliance leaders. The deployment timeline is scoped per engagement and committed in writing before work starts. We do not publish a generic timeline because every operation is different. We will tell you ours when we know yours.
              </p>
            </div>
          </div>
        </section>

        {/* Trust and compliance */}
        <section className="py-section bg-base">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <p className="flex items-center gap-2 text-body-sm text-accent mb-4">
                <StarIcon className="w-4 h-4" />
                Trust and compliance
              </p>
              <h2 className="text-display-md font-display text-text-bright mb-6">
                Architectural controls. Compliance posture. Both.
              </h2>
              <p className="text-body-lg text-text-muted leading-relaxed mb-6">
                ArqFWA is built on architectural controls that align with the controls regulated environments require: cryptographic logging, runtime policy enforcement, decision provenance for every output. Aligned with SOC 2 Trust Services Criteria; Type II audit in progress. HIPAA-aligned controls and BAAs in place with healthcare customers.
              </p>
              <Link
                href="/trust"
                className="inline-flex items-center gap-2 text-accent font-medium hover:gap-3 transition-all"
              >
                See full trust and compliance posture
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-section bg-base">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-display-md font-display text-text-bright mb-12 text-center">
                Frequently asked questions
              </h2>
              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <div key={index} className="border-b border-stroke-muted pb-6">
                    <h3 className="text-lg font-semibold text-text-bright mb-3">
                      {faq.question}
                    </h3>
                    <p className="text-body-md text-text-muted">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="py-section bg-base-tint">
          <div className="container mx-auto px-4 md:px-6 lg:px-8 text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-display-lg font-display text-text-bright mb-6">
                Bring a sample of your data. We will show you what changes.
              </h2>
              <Link
                href="/demo"
                className="btn bg-accent text-white hover:bg-accent/90"
              >
                Engage us
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 17L17 7M17 7H7M17 7v10"
                  />
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
