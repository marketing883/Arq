// Real content + assets pulled from the published ArqAI Labs Framer site
// (light-homeowners-299551.framer.app). Assets live in /public/v5/assets.

export const A = "/v5/assets";

export const LOGO = `${A}/FEFrVVQtPUn7XSci8TiM5lb74o.png`;
export const HERO_VIDEO = `${A}/ufsUXNNTVPKgg5ZhfzY4DHtmrKY.mp4`;
export const HERO_POSTER = `${A}/pR0DzH2JNZa0vnz4l8WJLxvUKA.jpg`;

export const HERO = {
  headline: "Operational AI. Built for Your Enterprise.",
  sub: "We design, build, deploy, and run AI for the operations that don't fit off-the-shelf — bespoke to how your team works, with governance attached to every action.",
  cta: { label: "Get Started", href: "#contact" },
  // Real proof only: the TPA Blind Spot Assessment engagement and the
  // shipped accelerator catalog. No template numbers.
  metrics: [
    { num: "Waste", suffix: "", label: "surfaced in one Blind Spot Assessment" },
    { num: "Less", suffix: "", label: "manual review time in that engagement" },
    { num: "10", suffix: "", label: "Production-ready accelerator lines" },
  ],
};

export const FEATURES = {
  eyebrow: "Services",
  heading: "We Make Operational AI work inside your enterprise",
  seeAllImage: `${A}/seeall-abstract.jpg`,
  sub: "Experience how our AI-powered features simplify workflows, automate routine tasks, and help your team achieve more—so you can focus on growing your business.",
  cta: { label: "See All Services", href: "/services" },
  cards: [
    {
      kind: "chat",
      title: "Workflow Discovery And Assessment",
      body: "We map your operations and identify exactly where AI agents will move the needle before any build begins.",
    },
    {
      kind: "doc",
      title: "Custom Agent Development",
      body: "Bespoke agents built around your workflows, your data, and your compliance requirements. Nothing generic.",
    },
    {
      kind: "chart",
      title: "Accelerator Deployment",
      body: "Industry-specific patterns, pre-validated and ready to deploy. Faster to production, lower cost per engagement.",
    },
    {
      kind: "wave",
      title: "Enterprise Systems Integration",
      body: "Agents wired directly into your existing stack. No rip and replace. No operational disruption.",
    },
    {
      kind: "generate",
      title: "Governance And Audit Architecture",
      body: "Encrypted, audit-ready proof on every agent action. Built in from day one, not added later.",
    },
  ],
};

export const WHY = {
  eyebrow: "Why ArqAI Labs",
  heading: "We know your industry. We build for your operation. We stay after launch.",
  sub: "Three things separate us from platforms and consulting firms. We go deep on one vertical at a time, we ship to production, and we attach proof to everything we deploy.",
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
    num: "120+",
    title: "Fraud Pattern Library",
    body: "ArqFWA draws on a library of 120+ TPA-specific fraud, waste, and abuse patterns that generic payer tools were never designed to find.",
  },
  reuse: {
    num: "Less",
    title: "Review Time Saved",
    body: "The same Blind Spot Assessment sharply cut manual claims-review time for the team running it.",
  },
  governance: {
    num: "Every",
    title: "Governance Built In",
    body: "Every agent we deploy generates encrypted, audit-ready proof of its actions. Compliance architecture is never an afterthought.",
  },
  waste: {
    num: "Waste",
    title: "Undetected Waste Found",
    body: "Identified in a single Blind Spot Assessment for a mid-size TPA whose current vendor rated them fully compliant.",
  },
};

export const PROCESS = {
  eyebrow: "Our Process",
  heading: "From Strategy to AI Success",
  sub: "We streamline the AI adoption journey with a clear, proven process — designed to ensure alignment, speed, and measurable outcomes.",
  steps: [
    {
      num: "01",
      title: "Discover & Assess",
      body: "We map your operations and identify exactly where AI agents will move the needle before any build begins.",
      image: `${A}/VjFhPmRUqOEECNBJzS5qTNQ2M.jpeg`,
    },
    {
      num: "02",
      title: "Design AI Strategy",
      body: "Develop tailored solutions that align with your goals and technical capabilities.",
      image: `${A}/wqdffQW0WSkz5XQ7YchgqN2bDQ.jpeg`,
    },
    {
      num: "03",
      title: "Implement & Integrate",
      body: "Seamlessly deploy AI into your existing systems with minimal disruption.",
      image: `${A}/H4rP4HWageK0Wzp8OfGGGbv8M0.jpeg`,
    },
    {
      num: "04",
      title: "Optimize & Scale",
      body: "Monitor results, iterate, and expand AI capabilities as your business grows.",
      image: `${A}/SDagoZAQXE61AebEi54KUY4RZ6A.jpeg`,
    },
  ],
};

export const INTEGRATION = {
  eyebrow: "Connect Your Stack",
  heading: "Wired into the systems already running your business",
  sub: "Agents connect to the CRM, ERP, ITSM, data platforms, identity, and core systems your operation depends on — retrieving live context and updating records within the permissions your security team already trusts. No rip-and-replace, no disconnected workbench.",
  tools: [
    { name: "Salesforce", color: "#00A1E0", body: "Ground agents in live CRM data and let them update records within your permission model." },
    { name: "SAP", color: "#0FAAFF", body: "Turn ERP master data into decisions, with governed write-back inside approval boundaries." },
    { name: "ServiceNow", color: "#62D84E", body: "Classify, enrich, and route tickets — and resolve the repeatable ones end to end." },
    { name: "Snowflake", color: "#29B5E8", body: "Read governed, current data from the warehouse instead of stale exports." },
    { name: "Databricks", color: "#FF3621", body: "Run retrieval and reasoning against the lakehouse your data team already operates." },
    { name: "Microsoft 365", color: "#0078D4", body: "Extend Copilot with your context, workflows, and the security posture IT requires." },
    { name: "Okta", color: "#007DC1", body: "Agent actions inherit the identity and access boundaries your security team already trusts." },
    { name: "Guidewire", color: "#00739D", body: "Wire claims and policy workflows into the core platform carriers run on." },
  ],
};

// The one real, publishable engagement — told once in full at
// /case-studies/tpa-blind-spot-assessment and summarized here. No invented
// clients, no fabricated quotes.
export const PROOF = {
  eyebrow: "Proof",
  heading: "One assessment. Waste surfaced.",
  sub: "A mid-size third-party administrator came to us rated fully compliant by its payment-integrity vendor. One ArqAI Blind Spot Assessment later, the picture looked different.",
  stats: [
    { num: "Surfaced", label: "Undetected waste and claims leakage" },
    { num: "Cut", label: "Manual review time for the claims team" },
    { num: "Evidenced", label: "Every finding delivered with reviewable proof" },
  ],
  body: "The assessment ran ArqFWA's cross-signal analysis across historical claims the incumbent tools had already cleared — correlating billing patterns, provider behavior, and member history that rule-based reviews score in isolation. Every flagged case carried the evidence an investigator needed to act on it.",
  cta: { label: "Read the case study", href: "/case-studies/tpa-blind-spot-assessment" },
};

export const FAQ = {
  eyebrow: "FAQs",
  heading: "Answers to Common Questions",
  sub: "We've gathered the most frequently asked questions to help you better understand our AI services, pricing, and integration process.",
  support: {
    title: "Need more help?",
    body: "We're here to answer any questions you may have.",
    cta: { label: "Ask a Question", href: "#contact" },
  },
  items: [
    {
      q: "How do we get started?",
      a: "Most engagements begin with a Workflow Assessment. We spend time understanding your operations, identify the workflows with the highest automation ROI, and deliver a prioritized roadmap. It is a paid engagement, typically completed in two to three weeks, and the output is yours regardless of what you decide next.",
    },
    {
      q: "How long does a full deployment take?",
      a: "Timelines depend on scope, but our accelerator library means most first agents reach production in weeks, not months. We sequence work so you see measurable value early and expand from there.",
    },
    {
      q: "We already use AI tools. Why do we need ArqAI?",
      a: "Generic tools are built for everyone, so they miss the patterns and rules specific to your industry. We build around your operation, ship to production, and attach proof to every agent action.",
    },
    {
      q: "How do you handle our data and compliance requirements?",
      a: "Compliance architecture is built in from day one. Every agent generates encrypted, audit-ready proof of its actions, and we work within your governance, security, and data-residency requirements.",
    },
    {
      q: "Do your agents replace our team?",
      a: "No. Our agents handle the routine and surface the exceptions so your team spends judgment where it matters most. Humans stay in control of every decision that needs them.",
    },
    {
      q: "What happens after go-live?",
      a: "We stay accountable after launch — monitoring results, iterating, and expanding capabilities as your business grows. We measure impact against the targets we set up front.",
    },
    {
      q: "Do you integrate with our existing systems?",
      a: "Yes. Agents are wired directly into your existing stack — no rip and replace, no operational disruption — so your data stays unified across the tools you already use.",
    },
  ],
};

export const CONTACT = {
  eyebrow: "Let's Connect",
  heading: "Start the Conversation Today",
  quote:
    "We built ArqAI Labs because mid-market enterprises were being sold platforms when they needed a partner. Someone who understands their industry, builds for their specific operation, and stays accountable after go-live.",
  founder: {
    name: "Jag Kanumuri",
    role: "Founder & CEO of ArqAI Labs",
    avatar: `${A}/8KKNOMGpz3fVUEZDOXTVXjXkICU.jpg`,
  },
  cta: { label: "Get Started Now", href: "/engage-us" },
};

export const FOOTER = {
  copyright: "© Copyright 2026. All Rights Reserved.",
};
