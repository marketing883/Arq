// Homepage FAQ content. Shared by the visible FaqSection (client) and the
// FAQPage JSON-LD in app/page.tsx (server) so schema and on-page content
// stay in parity by construction.
export const FAQS: { q: string; a: string }[] = [
  {
    q: "How do we get started?",
    a: "Most engagements begin with a Workflow Assessment: a paid, two-to-three week engagement where we map your operations, identify the workflows with the highest automation ROI, and deliver a prioritized roadmap. The output is yours regardless of what you decide next.",
  },
  {
    q: "How long does a full deployment take?",
    a: "Timelines depend on scope, but our accelerator library means most first agents reach production in weeks, not months. We sequence work so you see measurable value early and expand from there.",
  },
  {
    q: "We already use AI tools. Why ArqAI?",
    a: "Generic tools are built for everyone, so they miss the patterns, policies, and edge cases specific to your industry. Our engineers embed in your operation, build around it, ship to production, and attach audit-ready proof to every agent action.",
  },
  {
    q: "How do you handle data and compliance?",
    a: "Compliance architecture is built in from day one. Every agent generates encrypted, audit-ready proof of its actions, and we work within your governance, security, and data-residency requirements.",
  },
  {
    q: "Do your agents replace our team?",
    a: "No. Agents handle the routine and surface the exceptions, so your team spends judgment where it matters. Humans stay in control of every decision that needs one.",
  },
  {
    q: "What happens after go-live?",
    a: "We stay accountable: monitoring results against the targets we set up front, iterating, and expanding capabilities as your business grows.",
  },
  {
    q: "Do you integrate with our existing systems?",
    a: "Yes. Agents are wired directly into your existing stack, no rip and replace, so your data stays unified across the tools you already use.",
  },
];
