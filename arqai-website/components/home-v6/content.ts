// v6 Homepage copy — sourced from "ArqAI Labs Homepage Copy, v2"
// (forward-deployed positioning). Layout/assets carry over from home-v5;
// assets live in /public/v5/assets.

export const A = "/v5/assets";

export const LOGO = `${A}/FEFrVVQtPUn7XSci8TiM5lb74o.png`;
export const HERO_VIDEO = `${A}/ufsUXNNTVPKgg5ZhfzY4DHtmrKY.mp4`;
export const HERO_POSTER = `${A}/pR0DzH2JNZa0vnz4l8WJLxvUKA.jpg`;

export const HERO = {
  tags: ["Forward-Deployed", "Accelerators", "Production AI"],
  headline: "Forward Deployed AI Engineering. At Scale.",
  sub: "Engineers embedded in the problem, not advising from outside. Every accelerator comes from years of doing this work: designed, built, deployed, and run in production, with audit-ready proof on every agent action.",
  cta: { label: "Book a Workflow Assessment", href: "/demo" },
  ctaSecondary: { label: "Explore Accelerators", href: "#accelerators" },
  metrics: [
    { num: "40–60", suffix: "%", label: "Faster delivery on flagship accelerators" },
    { num: "70", suffix: "%", label: "Substrate reuse by engagement three" },
    { num: "100", suffix: "%", label: "Agent actions with audit-ready proof" },
  ],
};

export const FEATURES = {
  eyebrow: "Services",
  heading: "Engineers embedded in your operation, not advising from outside",
  seeAllImage: `${A}/seeall-abstract.jpg`,
  sub: "Platforms hand you tools. Consultancies hand you decks. Our engineers deploy into your operation and take responsibility for the full path: mapping the workflow, building the agents, wiring them into your systems, and running them in production with governance attached.",
  cta: { label: "See All Services", href: "/services" },
  cards: [
    {
      kind: "chat",
      title: "Workflow Discovery and Assessment",
      body: "We map your operations and identify exactly where agents will move the needle before any build begins. You get a prioritized roadmap with expected impact, and the output is yours regardless of what you decide next.",
      avatars: [`${A}/pAPxY6GbR780p3WdmjMvK78GIo.png`, `${A}/O0Q8HWESw0SuJvRoaa0ATiDOF4k.png`],
    },
    {
      kind: "doc",
      title: "Custom Agent Development",
      body: "When no accelerator fits, we build bespoke agents around your workflows, your data, and your compliance requirements. Nothing generic, nothing you have to bend your operation around.",
    },
    {
      kind: "chart",
      title: "Accelerator Deployment",
      body: "Industry-specific workflow spines, validated across deployments and configured to your data, policies, and reviewers. Faster to production, lower cost per engagement, less risk than a custom build from scratch.",
    },
    {
      kind: "wave",
      title: "Enterprise Systems Integration",
      body: "Agents wired directly into your existing stack, reading live context and writing back within the permissions your security team already trusts. No rip and replace. No operational disruption.",
    },
    {
      kind: "generate",
      title: "Governance and Audit Architecture",
      body: "Every agent action carries the trigger, the reasoning, the inputs, and the outcome in an encrypted, persistent audit trail. Built in from day one, because in regulated operations an agent you cannot audit is an agent you cannot run.",
    },
  ],
};

export const ACCELERATORS = {
  eyebrow: "Accelerators",
  heading: "Flagship accelerators, proven in production",
  sub: "An accelerator is a reusable workflow spine for a recurring enterprise problem: a proven pattern of agents, integrations, and governance controls, configured to your systems and policies rather than designed from scratch. Two tracks: vertical accelerators built for one industry's operations, and horizontal accelerators that solve a problem every regulated enterprise shares.",
  closing: "Part of a growing accelerator library",
  cta: { label: "Explore all accelerators", href: "/accelerators" },
  flagships: [
    {
      id: "arqfwa",
      track: "Vertical · Healthcare Payers",
      blurb:
        "Reads across claims, providers, policy, and member context to surface the cases most likely to be fraud, waste, abuse, or leakage, with the evidence trail investigators need to act and defend.",
      stat: { value: "30%+", label: "More high-value cases surfaced" },
    },
    {
      id: "arqloyalty",
      track: "Vertical · Retail & Hospitality",
      blurb:
        "Replace your loyalty platform without betting the business. Parallel-run validation until cut-over risk is zero.",
      stat: { value: "0", label: "Migration risk at cut-over" },
    },
    {
      id: "arqvantage",
      track: "Horizontal · Cross-Industry",
      blurb:
        "Agents monitor competitor SKUs in real time, reason about why prices moved rather than just that they did, and adjust within your guardrails, with MAP compliance enforced automatically.",
      stat: { value: "Minutes", label: "To respond to competitor price moves" },
    },
  ],
};

export const WHY = {
  eyebrow: "Why ArqAI Labs",
  heading: "We know your industry. We build for your operation. We stay after launch.",
  sub: "Forward-deployed means our engineers work inside your operation, not from a slide deck. Three things follow from that: we go deep on one vertical at a time, we ship to production rather than pilots, and we attach proof to everything we deploy. Every accelerator in the library exists because we did this work by hand first.",
  cta: { label: "Get to Know Us", href: "/about" },
  abstractImage: `${A}/DzGwMiEB7s9v8Ge70ZnDD22pw.jpeg`,
  handImage: `${A}/CtN60Gw14rqeKcm73KuXfmRIBo4.jpg`,
  logos: [
    `${A}/akO2rrXbBEO8RfhaK5uhWc4DNI.png`,
    `${A}/IiNIMrlDdvweoyBG7DLzHieUFTA.png`,
    `${A}/pl5sJDvTaeMYiqEwKprWNAmZI.png`,
    `${A}/79WYzIFrcCC8qjZDpQFVCxF7L8.png`,
    `${A}/B50CBh3QVNPbytu88jXaXBG1Lg.png`,
  ],
  fraud: {
    num: "TPA-specific",
    title: "Fraud patterns generic tools never see",
    body: "ArqFWA detects fraud patterns built for TPA operations that generic payer tools were never designed to find.",
  },
  reuse: {
    num: "70%",
    title: "Substrate reuse by engagement three",
    body: "Each delivery makes the next one faster. Our accelerator library compounds with every client we ship.",
  },
  governance: {
    num: "100%",
    title: "Governance built in",
    body: "Every agent we deploy generates encrypted, audit-ready proof of its actions. Compliance architecture is never an afterthought.",
  },
  waste: {
    num: "$3.2M",
    title: "Undetected waste found",
    body: "Identified in a single Blind Spot Assessment for a mid-size TPA whose incumbent vendor had rated them fully compliant.",
  },
};

export const PROCESS = {
  eyebrow: "Our Process",
  heading: "From assessment to agents in production",
  sub: "",
  steps: [
    {
      num: "01",
      title: "Discover and Assess",
      body: "A paid two-to-three week Workflow Assessment. We map your operations, quantify where agents will move the needle, and hand you a prioritized roadmap you own regardless of next steps.",
      image: `${A}/VjFhPmRUqOEECNBJzS5qTNQ2M.jpeg`,
    },
    {
      num: "02",
      title: "Design",
      body: "We select the accelerator or design the bespoke agents, define the governance model, and set the measurable targets the engagement will be judged against.",
      image: `${A}/wqdffQW0WSkz5XQ7YchgqN2bDQ.jpeg`,
    },
    {
      num: "03",
      title: "Deploy and Integrate",
      body: "Agents go into your existing systems within your security and permission model. First production agent in weeks, sequenced so you see measurable value early.",
      image: `${A}/H4rP4HWageK0Wzp8OfGGGbv8M0.jpeg`,
    },
    {
      num: "04",
      title: "Run and Expand",
      body: "We stay accountable after go-live: monitoring against the targets we set up front, recalibrating as your operation changes, and expanding to the next workflow when the numbers justify it.",
      image: `${A}/SDagoZAQXE61AebEi54KUY4RZ6A.jpeg`,
    },
  ],
};

export const PROOF = {
  eyebrow: "Results",
  heading: "Measured in production, not in demos",
  sub: "Every engagement is judged against targets set before the build starts. These are outcomes from deployed work.",
  results: [
    {
      num: "$3.2M",
      body: "In annual undetected waste surfaced at a single mid-size TPA, in one Blind Spot Assessment, at an account its incumbent vendor rated fully compliant.",
    },
    {
      num: "30%+",
      body: "More high-value FWA cases surfaced versus a rules-only baseline, with 100% decision-evidence capture for audit and recovery.",
    },
    {
      num: "2x",
      body: "Faster case triage from assignment to decision, with reviewer context assembled and the audit trail exportable.",
    },
  ],
};

export const FAQ = {
  eyebrow: "FAQs",
  heading: "Answers to common questions",
  sub: "The most common questions about how we engage, what we deploy, and what happens after go-live.",
  support: {
    avatar: `${A}/te6yqxk271CgPcNMrhntCcC6y7E.png`,
    title: "Need more help?",
    body: "We're here to answer any questions you may have.",
    cta: { label: "Ask a Question", href: "#contact" },
  },
  items: [
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
  ],
};

export const INSIGHTS = {
  eyebrow: "Insights & Articles",
  heading: "What we are learning by running AI in production",
  sub: "Trends, patterns, and hard lessons from deploying operational AI in regulated enterprises, direct from our team.",
  cta: { label: "Read the Blog", href: "/blog" },
};

export const CONTACT = {
  eyebrow: "Let's Connect",
  heading: "Start with the workflow, not the platform",
  quote:
    "We built ArqAI Labs because mid-market enterprises were being sold platforms when they needed a partner. Someone who understands their industry, builds for their specific operation, and stays accountable after go-live.",
  founder: {
    name: "Jag Kanumuri",
    role: "Founder & CEO of ArqAI Labs",
    avatar: `${A}/8KKNOMGpz3fVUEZDOXTVXjXkICU.jpg`,
  },
  cta: { label: "Book a Workflow Assessment", href: "/demo" },
};
