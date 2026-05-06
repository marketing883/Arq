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

function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
    </svg>
  );
}

export type IndustryPageData = {
  eyebrow: string;
  heroHeadline: string;
  heroSubhead: string;
  heroImage: string;
  heroImageAlt: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  outcomes: { metric: string; label: string; description: string }[];
  useCasesHeading: string;
  useCases: { tag: string; title: string; body: string }[];
  midCtaHeadline: string;
  midCtaBody: string;
  audienceHeading: string;
  audienceBody: string;
  audienceList: string[];
  productsHeading: string;
  productsBody: string;
  products: {
    name: string;
    status: string;
    statusColor: string;
    description: string;
    cta: string;
    href: string;
  }[];
  closingCta: { headline: string; body: string };
};

export function IndustryPage({ data }: { data: IndustryPageData }) {
  return (
    <>
      <Header />

      <main className="bg-base">
        {/* Hero */}
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
                  {data.eyebrow}
                </p>

                <h1 className="text-display-xl md:text-[clamp(2.5rem,5vw,4rem)] font-display leading-[1.1] text-text-bright mb-6">
                  {data.heroHeadline}
                </h1>

                <p className="text-body-lg md:text-xl text-text-medium leading-relaxed mb-8 max-w-xl">
                  {data.heroSubhead}
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href={data.primaryCta?.href ?? "/engage-us"}
                    className="btn bg-accent text-white hover:bg-accent/90 group"
                  >
                    {data.primaryCta?.label ?? "Engage us"}
                    <ArrowIcon className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                  {data.secondaryCta && (
                    <Link href={data.secondaryCta.href} className="btn btn-outline">
                      {data.secondaryCta.label}
                    </Link>
                  )}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-2xl shadow-accent/15"
              >
                <Image
                  src={data.heroImage}
                  alt={data.heroImageAlt}
                  fill
                  priority
                  sizes="(min-width:1024px) 50vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-base-opp/40 via-transparent to-transparent" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Outcomes */}
        <section className="py-section bg-base-tint">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl mb-14"
            >
              <p className="flex items-center gap-2 text-body-sm text-accent mb-4 uppercase tracking-wider font-medium">
                <StarIcon className="w-4 h-4" />
                What changes
              </p>
              <h2 className="text-display-lg font-display text-text-bright">
                Outcomes our customers measure.
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {data.outcomes.map((o, i) => (
                <motion.div
                  key={o.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="border-t-2 border-accent pt-6"
                >
                  <div className="text-5xl md:text-6xl font-display font-bold text-accent mb-3 leading-none">
                    {o.metric}
                  </div>
                  <h3 className="text-lg font-display font-semibold text-text-bright mb-2">
                    {o.label}
                  </h3>
                  <p className="text-body-sm text-text-muted leading-relaxed">{o.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Use cases */}
        <section className="py-section bg-base">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mb-14"
            >
              <p className="flex items-center gap-2 text-body-sm text-accent mb-4 uppercase tracking-wider font-medium">
                <StarIcon className="w-4 h-4" />
                Use cases
              </p>
              <h2 className="text-display-lg font-display text-text-bright">
                {data.useCasesHeading}
              </h2>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-5 lg:gap-6">
              {data.useCases.map((uc, i) => (
                <motion.article
                  key={uc.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 20,
                    delay: (i % 2) * 0.06,
                  }}
                  whileHover={{ y: -4 }}
                  className="card flex flex-col h-full hover:border-accent transition-colors"
                >
                  <p className="text-body-xs text-accent uppercase tracking-wider mb-3">{uc.tag}</p>
                  <h3 className="text-xl font-display font-semibold text-text-bright leading-snug mb-3">
                    {uc.title}
                  </h3>
                  <p className="text-body-sm text-text-muted leading-relaxed flex-1">{uc.body}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* Mid CTA */}
        <section className="py-12 md:py-16 bg-base-tint">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="relative bg-gradient-to-r from-accent via-accent to-accent/90 rounded-2xl p-8 md:p-10 overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
              <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex-1 max-w-2xl">
                  <h3 className="text-display-sm font-display mb-3 text-white">
                    {data.midCtaHeadline}
                  </h3>
                  <p className="text-body-md text-white/85">{data.midCtaBody}</p>
                </div>
                <div className="shrink-0">
                  <Link
                    href="/engage-us"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-accent font-semibold rounded-lg hover:shadow-lg hover:shadow-black/20 transition-all group"
                  >
                    Engage us
                    <ArrowIcon className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Audience */}
        <section className="py-section bg-base">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="max-w-4xl">
              <h2 className="text-display-md font-display text-text-bright mb-6">
                {data.audienceHeading}
              </h2>
              <p className="text-body-lg text-text-muted mb-8">{data.audienceBody}</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {data.audienceList.map((a) => (
                  <div
                    key={a}
                    className="flex items-center gap-3 p-4 bg-base-tint rounded-lg border border-stroke-muted"
                  >
                    <div className="w-2 h-2 rounded-full bg-accent shrink-0" />
                    <span className="text-body-md text-text-bright">{a}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Products */}
        {data.products.length > 0 && (
          <section className="py-section bg-base-tint">
            <div className="container mx-auto px-4 md:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="max-w-3xl mb-12"
              >
                <p className="flex items-center gap-2 text-body-sm text-accent mb-4 uppercase tracking-wider font-medium">
                  <StarIcon className="w-4 h-4" />
                  Productised
                </p>
                <h2 className="text-display-lg font-display text-text-bright mb-4">
                  {data.productsHeading}
                </h2>
                <p className="text-body-lg text-text-muted">{data.productsBody}</p>
              </motion.div>

              <div className="grid md:grid-cols-3 gap-6">
                {data.products.map((p) => (
                  <div key={p.name} className="card group flex flex-col h-full hover:border-accent transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-display font-semibold text-text-bright group-hover:text-accent transition-colors">
                        {p.name}
                      </h3>
                      <span
                        className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full text-white ${p.statusColor}`}
                      >
                        {p.status}
                      </span>
                    </div>
                    <p className="text-body-sm text-text-muted mb-6 flex-1">{p.description}</p>
                    <Link
                      href={p.href}
                      className="inline-flex items-center gap-2 text-accent font-medium hover:gap-3 transition-all"
                    >
                      {p.cta}
                      <ArrowIcon className="w-4 h-4" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Trust strip */}
        <section className="py-12 bg-base border-y border-stroke-muted">
          <div className="container mx-auto px-4 md:px-6 lg:px-8 text-center">
            <p className="text-body-md text-text-muted">
              Architectural controls first. SOC 2 in progress, HIPAA-aligned, GDPR-aligned.{" "}
              <Link href="/trust" className="text-accent font-medium hover:underline">
                See trust posture &rarr;
              </Link>
            </p>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="py-section bg-base text-center">
          <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-3xl mx-auto">
            <h2 className="text-display-md font-display text-text-bright mb-6">
              {data.closingCta.headline}
            </h2>
            <p className="text-body-lg text-text-muted mb-8">{data.closingCta.body}</p>
            <Link href="/engage-us" className="btn bg-accent text-white">
              Engage us
              <ArrowIcon className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
