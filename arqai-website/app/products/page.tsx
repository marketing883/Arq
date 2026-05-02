import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Products | ArqAI Labs",
  description:
    "Vertical AI agents for high-stakes workflows. ArqFWA. ArqClaims. ArqBanker. Each one purpose-built for a single job, engineered for production.",
};

const products = [
  {
    id: "arqfwa",
    name: "ArqFWA",
    status: "LIVE",
    statusColor: "bg-green-500",
    tagline: "The AI agent for fraud, waste, and abuse detection.",
    description:
      "Reviews high volumes of claims and transactions, flags suspicious patterns, and surfaces the work your team should focus on first. Built for healthcare payers and P&C insurance carriers.",
    buyers:
      "For healthcare payer and P&C carrier operations leaders, fraud and special-investigations teams, and the technology and AI executives backing them.",
    cta: "See ArqFWA",
    href: "/products/arqfwa",
    image: "/img/Operations-center.png",
  },
  {
    id: "arqclaims",
    name: "ArqClaims",
    status: "IN BUILD",
    statusColor: "bg-amber-500",
    tagline: "The AI agent for claims triage and processing.",
    description:
      "Triages incoming claims and surfaces the right ones to the right adjuster, with the routing logic and reserve recommendations your operation actually uses. Built for mid-market P&C carriers.",
    buyers:
      "For claims operations leaders at mid-market P&C carriers, plus the technology and AI executives evaluating claims-process modernisation.",
    cta: "Join the design partner program",
    href: "/products/arqclaims",
    image: "/img/Policy-Hub-Interface.png",
  },
  {
    id: "arqbanker",
    name: "ArqBanker",
    status: "COMING",
    statusColor: "bg-blue-500",
    tagline: "The AI agent for AML, KYC, and financial crime.",
    description:
      "Built for the financial crimes operations at regional and mid-tier banks. Calibrated to the realities of running a financial crimes program on a lean team.",
    buyers:
      "For financial crimes leaders and BSA officers at regional and mid-tier banks, plus the CTOs and Heads of AI driving financial-crime modernisation.",
    cta: "Get notified at launch",
    href: "/products/arqbanker",
    image: "/img/Audit-logs.png",
  },
];

function StarIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
    >
      <path d="M19.6,9.6h-3.9c-.4,0-1.8-.2-1.8-.2-.6,0-1.1-.2-1.6-.6-.5-.3-.9-.8-1.2-1.2-.3-.4-.4-.9-.5-1.4,0,0,0-1.1-.2-1.5V.4c0-.2-.2-.4-.4-.4s-.4.2-.4.4v4.4c0,.4-.2,1.5-.2,1.5,0,.5-.2,1-.5,1.4-.3.5-.7.9-1.2,1.2s-1,.5-1.6.6c0,0-1.2,0-1.7.2H.4c-.2,0-.4.2-.4.4s.2.4.4.4h4.1c.4,0,1.7.2,1.7.2.6,0,1.1.2,1.6.6.4.3.8.7,1.1,1.1.3.5.5,1,.6,1.6,0,0,0,1.3.2,1.7v4.1c0,.2.2.4.4.4s.4-.2.4-.4v-4.1c0-.4.2-1.7.2-1.7,0-.6.2-1.1.6-1.6.3-.4.7-.8,1.1-1.1.5-.3,1-.5,1.6-.6,0,0,1.3,0,1.8-.2h3.9c.2,0,.4-.2.4-.4s-.2-.4-.4-.4h0Z" />
    </svg>
  );
}

export default function ProductsPage() {
  return (
    <>
      <Header />
      <main className="bg-base pt-32 md:pt-40">
        {/* Hero Section */}
        <section className="pb-16 md:pb-24">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="max-w-4xl">
              <h1 className="text-display-xl md:text-[clamp(3rem,5vw,4.5rem)] font-display leading-[1.05] text-text-bright mb-6">
                One agent per workflow.{" "}
                <span className="text-text-muted">Built for the job, not for the demo.</span>
              </h1>
              <p className="text-body-lg md:text-xl text-text-medium max-w-3xl leading-relaxed">
                Each ArqAI Labs product takes one operational workflow and makes the AI agent for it. Same architectural foundation. Same delivery standard. Different jobs.
              </p>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-section bg-base-tint">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="grid gap-8">
              {products.map((product, idx) => (
                <div
                  key={product.id}
                  className="card p-0 overflow-hidden hover:border-accent transition-all"
                >
                  <div className={`grid lg:grid-cols-12 gap-0 items-stretch ${idx % 2 === 1 ? "lg:[&>div:first-child]:order-2" : ""}`}>
                    <div className="lg:col-span-7 p-8 md:p-10">
                      <div className="flex items-center gap-3 mb-4">
                        <span
                          className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full text-white ${product.statusColor}`}
                        >
                          {product.status}
                        </span>
                      </div>
                      <h2 className="text-3xl md:text-4xl font-display font-semibold text-text-bright mb-3">
                        {product.name}
                      </h2>
                      <p className="text-xl text-text-bright mb-4">
                        {product.tagline}
                      </p>
                      <p className="text-body-md text-text-muted mb-6">
                        {product.description}
                      </p>
                      <p className="text-body-sm text-text-muted italic mb-8">
                        {product.buyers}
                      </p>
                      <Link
                        href={product.href}
                        className="btn bg-accent text-white hover:bg-accent/90 inline-flex items-center gap-2"
                      >
                        {product.cta}
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </Link>
                    </div>
                    <div className="lg:col-span-5 relative bg-base-tint min-h-[280px] lg:min-h-full">
                      <Image
                        src={product.image}
                        alt={`${product.name} interface`}
                        fill
                        sizes="(min-width:1024px) 40vw, 100vw"
                        className="object-cover object-center"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* One Architecture Section */}
        <section className="py-section bg-base">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <p className="flex items-center justify-center gap-2 text-body-sm text-accent mb-4">
                <StarIcon className="w-4 h-4" />
                Architecture
              </p>
              <h2 className="text-display-lg font-display text-text-bright mb-6">
                Every product is built on the same foundation.
              </h2>
              <p className="text-body-lg text-text-muted mb-8">
                Identity, policy enforcement, and observable retrieval are not features we add to each product separately. They are the foundation we build every product on. That is why our second product ships faster than our first. And why a customer deploying a second ArqAI Labs agent does not re-evaluate compliance and security from scratch.
              </p>
              <div className="relative rounded-xl overflow-hidden mb-10 border border-stroke-muted">
                <Image
                  src="/img/hero/arq-wf.png"
                  alt="ArqAI architecture diagram"
                  width={1200}
                  height={750}
                  className="w-full h-auto"
                />
              </div>
              <Link
                href="/how-it-works"
                className="btn btn-outline inline-flex items-center gap-2"
              >
                How it works
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
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* Roadmap CTA Section */}
        <section className="py-section bg-base-tint">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-display-md font-display text-text-bright mb-6">
                Have a workflow that needs a better answer?
              </h2>
              <p className="text-body-lg text-text-muted mb-8">
                Each new ArqAI Labs product targets an operational workflow where the customer&apos;s pain is acute and the AI alternatives all stop short. If you have a workflow you wish had a better answer, we want to hear from you.
              </p>
              <Link
                href="/contact"
                className="btn bg-accent text-white hover:bg-accent/90 inline-flex items-center gap-2"
              >
                Suggest a workflow
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
