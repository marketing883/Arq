// AI Content Generation Configuration

export interface ToneOption {
  id: string;
  label: string;
  description: string;
  promptInstruction: string;
}

export const TONE_OPTIONS: ToneOption[] = [
  // Professional Spectrum
  {
    id: "authoritative-trustworthy",
    label: "Authoritative & Trustworthy",
    description: "Expert voice, backed by data, inspires confidence",
    promptInstruction:
      "Write with authority and expertise. Use confident language, cite data when available, and position the reader as making informed decisions. Establish credibility through depth of knowledge.",
  },
  {
    id: "professional-approachable",
    label: "Professional yet Approachable",
    description: "Business-appropriate but warm and human",
    promptInstruction:
      "Maintain professionalism while being warm and relatable. Avoid unnecessary jargon, explain complex concepts clearly, and use a conversational but respectful tone.",
  },
  {
    id: "thought-leadership",
    label: "Thought Leadership",
    description: "Visionary, forward-thinking, industry-shaping",
    promptInstruction:
      "Write as an industry thought leader. Share unique perspectives, challenge conventional thinking, paint a vision for the future, and position the content as cutting-edge insight.",
  },
  {
    id: "consultative",
    label: "Consultative & Advisory",
    description: "Like a trusted advisor guiding decisions",
    promptInstruction:
      "Write as a trusted consultant. Anticipate concerns, offer balanced perspectives, acknowledge trade-offs, and guide the reader through decision-making with empathy.",
  },

  // Technical Spectrum
  {
    id: "technical-precise",
    label: "Technical & Precise",
    description: "Detailed, accurate, for technical audiences",
    promptInstruction:
      "Be technically precise and detailed. Use industry terminology appropriately, include specifications where relevant, maintain accuracy, and assume technical competence.",
  },
  {
    id: "technical-accessible",
    label: "Technical but Accessible",
    description: "Complex topics made understandable",
    promptInstruction:
      "Explain technical concepts clearly for non-experts. Use analogies, break down complexity step by step, but maintain accuracy and don't oversimplify to the point of inaccuracy.",
  },

  // Engagement Spectrum
  {
    id: "educational",
    label: "Educational & Informative",
    description: "Teaching-focused, clear explanations",
    promptInstruction:
      "Write to educate. Structure content for optimal learning, use clear examples, build concepts progressively, and ensure the reader gains practical, applicable knowledge.",
  },
  {
    id: "persuasive",
    label: "Persuasive & Compelling",
    description: "Drives action, creates urgency",
    promptInstruction:
      "Write persuasively. Build a compelling case, address potential objections proactively, create appropriate urgency, and motivate the reader toward action.",
  },
  {
    id: "storytelling",
    label: "Narrative & Storytelling",
    description: "Engages through stories and examples",
    promptInstruction:
      "Use storytelling techniques. Lead with relatable scenarios, incorporate case examples, create emotional connection while maintaining professionalism, and make abstract concepts concrete.",
  },

  // Specialized
  {
    id: "compliance-focused",
    label: "Compliance & Risk-Aware",
    description: "Emphasizes security, compliance, risk mitigation",
    promptInstruction:
      "Write with compliance and risk awareness. Emphasize security considerations, regulatory requirements, risk mitigation strategies, and best practices for governance.",
  },
  {
    id: "roi-focused",
    label: "ROI & Business Value",
    description: "Focuses on business outcomes and value",
    promptInstruction:
      "Focus on business value and ROI. Quantify benefits where possible, discuss cost implications, efficiency gains, and tie everything back to measurable business outcomes.",
  },
  {
    id: "innovation-forward",
    label: "Innovation-Forward",
    description: "Cutting-edge, early adopter appeal",
    promptInstruction:
      "Write for innovators and early adopters. Emphasize what's new and cutting-edge, highlight competitive advantages of being ahead, and appeal to those who want to lead rather than follow.",
  },
];

export interface AudiencePreset {
  id: string;
  label: string;
  description: string;
  contextPrompt: string;
}

export const AUDIENCE_PRESETS: AudiencePreset[] = [
  {
    id: "c-suite",
    label: "C-Suite Executives",
    description: "CEOs, CTOs, CIOs, CFOs",
    contextPrompt:
      "The audience is C-level executives who are strategic decision-makers focused on business value, ROI, and organizational impact. They are time-constrained and need executive-level summaries with clear business implications.",
  },
  {
    id: "it-leaders",
    label: "IT Decision Makers",
    description: "IT Directors, VPs of Engineering, Architects",
    contextPrompt:
      "The audience is IT leadership evaluating technology solutions. They care about integration capabilities, security architecture, scalability, team adoption, and technical feasibility.",
  },
  {
    id: "compliance-risk",
    label: "Compliance & Risk Officers",
    description: "CROs, Compliance Directors, Legal",
    contextPrompt:
      "The audience is compliance and risk professionals who are risk-averse and need detailed information about regulatory compliance, audit trails, certifications, and governance frameworks.",
  },
  {
    id: "operations",
    label: "Operations Leaders",
    description: "COOs, VP Operations, Process Owners",
    contextPrompt:
      "The audience is operations leadership focused on efficiency, process automation, and operational improvements. They need practical implementation details and workflow considerations.",
  },
  {
    id: "technical-practitioners",
    label: "Technical Practitioners",
    description: "Developers, Engineers, Data Scientists",
    contextPrompt:
      "The audience is hands-on technical professionals who want technical depth, implementation specifics, code examples where relevant, and integration details.",
  },
];

export interface LengthOption {
  id: string;
  label: string;
  wordRange: string;
  minWords: number;
  maxWords: number;
  readTime: string;
  bestFor: string;
  seoNote: string;
}

export const LENGTH_OPTIONS: LengthOption[] = [
  {
    id: "quick",
    label: "Quick Read",
    wordRange: "800-1,200 words",
    minWords: 800,
    maxWords: 1200,
    readTime: "4-5 min",
    bestFor: "News updates, announcements, quick tips",
    seoNote: "Good for trending topics, may struggle for competitive keywords",
  },
  {
    id: "standard",
    label: "Standard Article",
    wordRange: "1,500-2,000 words",
    minWords: 1500,
    maxWords: 2000,
    readTime: "7-9 min",
    bestFor: "How-to guides, feature explanations, comparisons",
    seoNote: "Sweet spot for most keywords, good depth without overwhelming",
  },
  {
    id: "deep-dive",
    label: "Deep Dive",
    wordRange: "2,500-3,500 words",
    minWords: 2500,
    maxWords: 3500,
    readTime: "12-15 min",
    bestFor: "Comprehensive guides, detailed tutorials, research pieces",
    seoNote: "Excellent for competitive keywords, establishes authority",
  },
  {
    id: "pillar",
    label: "Pillar Content",
    wordRange: "4,000+ words",
    minWords: 4000,
    maxWords: 5000,
    readTime: "18+ min",
    bestFor: "Ultimate guides, cornerstone content, link magnets",
    seoNote: "Highest ranking potential, ideal for topic clusters",
  },
];

export const DEFAULT_TONE = "authoritative-trustworthy";
export const DEFAULT_LENGTH = "standard";
export const DEFAULT_AUDIENCES = ["c-suite", "it-leaders"];
