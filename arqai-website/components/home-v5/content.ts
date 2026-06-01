// Real content + assets pulled from the published ArqAI Labs Framer site
// (light-homeowners-299551.framer.app). Assets live in /public/v5/assets.

export const A = "/v5/assets";

export const LOGO = `${A}/FEFrVVQtPUn7XSci8TiM5lb74o.png`;
export const HERO_VIDEO = `${A}/ufsUXNNTVPKgg5ZhfzY4DHtmrKY.mp4`;

export const NAV_LINKS = [
  { label: "Home", href: "#top" },
  { label: "About", href: "/about" },
  { label: "Feature", href: "#services" },
  { label: "Pricing", href: "#pricing" },
  { label: "Blog", href: "#insights" },
  { label: "Contact", href: "#contact" },
];

export const HERO = {
  trustAvatars: [
    `${A}/OlsXhJ1weAZUQl3ikE7Nrmj9cg8.jpg`,
    `${A}/xPotMb4VrNT5rTGtXQvpYqXunU.jpg`,
    `${A}/9TPGOiWddBWZAZ2mYFDOzpSoILE.jpg`,
    `${A}/oGgAZMF0jq3eb456pPCbrdFzqM.jpg`,
  ],
  trustLabel: "Trusted by 120+ Businesses",
  headline: "Empower Your Business with Operational AI",
  sub: "Accelerate operations, reduce costs, and unlock new growth with AI strategies tailored for your organization.",
  cta: { label: "Get Started", href: "#contact" },
  metrics: [
    { num: "98", suffix: "%", label: "Client Satisfaction Rate" },
    { num: "3", suffix: "X", label: "Faster Decision-Making" },
    { num: "40", suffix: "%", label: "Cost Reduction" },
  ],
};

export const FEATURES = {
  eyebrow: "Services",
  heading: "We Make Operational AI work inside your enterprise",
  sub: "Experience how our AI-powered features simplify workflows, automate routine tasks, and help your team achieve more—so you can focus on growing your business.",
  cta: { label: "See All Services", href: "/about" },
  cards: [
    {
      kind: "chat",
      title: "Workflow Discovery and Assessment",
      body: "We map your operations and identify exactly where AI agents will move the needle before any build begins.",
      avatars: [`${A}/pAPxY6GbR780p3WdmjMvK78GIo.png`, `${A}/O0Q8HWESw0SuJvRoaa0ATiDOF4k.png`],
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
      kind: "generate",
      title: "Enterprise Systems Integration",
      body: "Agents wired directly into your existing stack. No rip and replace. No operational disruption.",
    },
    {
      kind: "shield",
      title: "Governance and Audit Architecture",
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
    title: "Fraud Patterns Caught",
    body: "Veyra detects 120+ TPA-specific fraud patterns that generic payer tools were never designed to find.",
  },
  reuse: {
    num: "70%",
    title: "Substrate Reuse By Engagement 3",
    body: "Each delivery makes the next one faster. Our accelerator library compounds with every client we ship.",
  },
  governance: {
    num: "100%",
    title: "Governance Built In",
    body: "Every agent we deploy generates encrypted, audit-ready proof of its actions. Compliance architecture is never an afterthought.",
  },
  waste: {
    num: "$3.2M",
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
  eyebrow: "Connect Your Tools",
  heading: "Seamlessly Integrate With the Tools You Already Use",
  sub: "Connect your existing workflows with powerful AI capabilities. Whether it's Notion, Google Workspace, Slack, or Twitter, our solutions integrate effortlessly, keeping your data unified and your operations efficient.",
  tools: [
    { name: "Slack", color: "#4A154B", body: "Seamless team communication and real-time AI-powered responses through Slack integration." },
    { name: "Notion", color: "#111111", body: "Generate meeting notes, summaries, and structured content with AI embedded directly into Notion." },
    { name: "Gmail", color: "#EA4335", body: "Draft, sort, and prioritize emails faster using AI-powered insights via Gmail integration." },
    { name: "Google Sheets", color: "#0F9D58", body: "Automate data analysis, forecasting, and reporting with AI-enhanced Google Sheets workflows." },
    { name: "Amazon", color: "#FF9900", body: "Optimize product listings, inventory predictions with AI-powered tools integrated into your Amazon operations." },
    { name: "Reddit", color: "#FF4500", body: "Gain trend insights, automate content interaction, and analyze community sentiment with Reddit + AI integration." },
    { name: "X (Twitter)", color: "#111111", body: "Schedule, generate, and analyze posts with AI to enhance engagement and automate social media presence." },
    { name: "LinkedIn", color: "#0A66C2", body: "Craft professional outreach messages and automate lead research using AI for smarter networking on LinkedIn." },
    { name: "Meta", color: "#0866FF", body: "Use AI to auto-generate ad creatives, target the right audience, and optimize campaigns across Meta's platforms." },
    { name: "PayPal", color: "#003087", body: "Enhance fraud detection, automate transaction categorization with AI-powered PayPal integrations." },
  ],
};

export const TESTIMONIALS = {
  eyebrow: "Testimonials",
  heading: "Real Results from AI-Powered Success",
  sub: "Hear how businesses like yours accelerated growth, optimized workflows, and delivered measurable outcomes through our custom AI solutions.",
  image: `${A}/ftgLt3wWB2wrmUqDaOXqZwo66FA.jpeg`,
  items: [
    {
      quote: "We cut manual work by 70% and boosted task output 3.5× with their AI automation—like gaining a tireless team member.",
      name: "Alex Rivera",
      role: "Product Manager, Zylo Ren",
      avatar: `${A}/Ah6vtDjqQV4pmxuHjEOGW2rX0.jpg`,
      stats: [
        { num: "+70%", label: "Reduction in manual work" },
        { num: "3.5x", label: "Increase in automation efficiency" },
      ],
    },
    {
      quote: "Integrating their AI planning system cut our turnaround time in half. We now deliver client projects twice as fast, without sacrificing quality.",
      name: "Jenna Li",
      role: "Operations Director, NeoTech Architectures",
      avatar: `${A}/PQ0CdHcvW9qzllrrn2lyBWphgQ.jpg`,
      stats: [
        { num: "2x", label: "Faster project delivery" },
        { num: "+50%", label: "Improvement in client satisfaction" },
      ],
    },
    {
      quote: "The customer support automation workflow they built exceeded all expectations. It feels like a real assistant and drastically reduced our customer support load.",
      name: "Marcus Green",
      role: "Support Lead, HelioWave",
      avatar: `${A}/gVhsOa2hfMCiXvrdcBkklcFUIQ.jpg`,
      stats: [],
    },
    {
      quote: "Their team really understands AI. They guided us from strategy to deployment with clarity and precision. A pleasure to work with.",
      name: "Rachel Torres",
      role: "CTO, Wong's Wings",
      avatar: `${A}/GJfjZ9RBgmpJlrnvg487NysRJkE.jpg`,
      stats: [],
    },
  ],
};

export const FAQ = {
  eyebrow: "FAQs",
  heading: "Answers to Common Questions",
  sub: "We've gathered the most frequently asked questions to help you better understand our AI services, pricing, and integration process.",
  support: {
    avatar: `${A}/te6yqxk271CgPcNMrhntCcC6y7E.png`,
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

export const INSIGHTS = {
  eyebrow: "Insights & Articles",
  heading: "Discover the Future of AI in Business",
  sub: "Stay informed with expert-written articles on AI transformation, SaaS strategies, and startup innovation. Learn how to drive growth with the right technology.",
  cta: { label: "Discover More", href: "#insights" },
  posts: [
    {
      cover: `${A}/whRZNEnCa32wPqqJtkEo07xTe50.jpeg`,
      date: "Jun 18, 2025",
      title: "How AI is Revolutionizing Customer Support in 2025",
      body: "See how AI chatbots and NLP enhance support with speed and personalization.",
    },
    {
      cover: `${A}/6s6XHJiR7LUyTcFFZHDFjSarks.jpeg`,
      date: "May 29, 2025",
      title: "Building a Lean AI-Ready Startup: Tips for Founders",
      body: "Help startups adopt AI early with budget-friendly, scalable solutions.",
    },
    {
      cover: `${A}/mu6sFIgrbmHNxa3m94cG4VVROM.jpeg`,
      date: "Jun 4, 2025",
      title: "5 Must-Have SaaS Integrations to Supercharge Your Workflow",
      body: "Streamline team operations by integrating AI with essential SaaS tools.",
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
  cta: { label: "Get Started Now", href: "/demo" },
};

export const FOOTER = {
  links: ["Home", "About", "Feature", "Pricing", "Blog", "Contact"],
  copyright: "© Copyright 2026. All Rights Reserved.",
};
