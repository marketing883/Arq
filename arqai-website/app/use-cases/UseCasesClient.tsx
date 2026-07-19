"use client";

import Link from "next/link";
import V6Nav from "@/components/v6/V6Nav";
import V6Footer from "@/components/v6/V6Footer";
import ClosingCta from "@/components/v6/ClosingCta";
import "@/components/v6/v6.css";
import "@/components/home-v5/styles.css";

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
    body: "AI that routes incoming claims to the right person, prioritizes the queue, and supports the decision your team makes.",
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
    <div className="v5-shell">
      <V6Nav />
      <main>
        {/* Hero */}
        <section className="v5-page-hero">
          <div className="v5-container">
            <div className="v5-page-hero-inner">
              <span className="v5-badge">
                <span className="v5-badge-dot" />
                What we work on
              </span>
              <h1 className="v5-h1">
                Use cases we&apos;ve built. Or are building. Or are ready to build.
              </h1>
              <p className="v5-lead">
                Each one started the same way: a team with a complex operation and an AI alternative that didn&apos;t fit. We tuned it until it did.
              </p>
            </div>
          </div>
        </section>

        {/* Use case grid */}
        <section className="v5-section v5-bg-grey">
          <div className="v5-container">
            <div className="v5-grid v5-grid-3">
              {useCases.map((uc) => (
                <article key={uc.title} className="v5-card">
                  <span className="v5-card-eyebrow">{uc.tag}</span>
                  <h3 className="v5-h3">{uc.title}</h3>
                  <p className="v5-body">{uc.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <ClosingCta
          heading="Don't see your use case?"
          sub="We don't ship templates. Most of the engagements we run weren't on a public page when they started. Tell us what your operation needs. We'll tell you what's honestly possible."
          ctaLabel="Get Started"
        />
      </main>
      <V6Footer />
    </div>
  );
}
