import Anthropic from "@anthropic-ai/sdk";

// Lazy initialization
let anthropicClient: Anthropic | null = null;

function getAnthropicClient(): Anthropic | null {
  if (!anthropicClient) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.warn("ANTHROPIC_API_KEY not configured - AI intel disabled");
      return null;
    }
    anthropicClient = new Anthropic({ apiKey });
  }
  return anthropicClient;
}

export interface LeadIntelResult {
  // Intent Analysis
  detectedIntent: "demo" | "pricing" | "support" | "partnership" | "general" | "urgent";
  intentConfidence: number;
  urgency: "high" | "medium" | "low";

  // Personalized Response
  personalizedGreeting: string;
  personalizedMessage: string;
  suggestedNextSteps: string[];

  // Lead Intelligence
  companyIntel: {
    likelyIndustry: string;
    estimatedSize: string;
    potentialUseCases: string[];
  };

  // Contact Intelligence
  contactIntel: {
    seniority: "c-level" | "vp" | "director" | "manager" | "individual" | "unknown";
    department: string;
    decisionMaker: boolean;
  };

  // Enrichment suggestions
  researchSuggestions: string[];

  // Raw analysis
  summary: string;
}

export async function analyzeLeadIntel(data: {
  name: string;
  email: string;
  company: string;
  jobTitle: string;
  message: string;
  inquiryType: string;
}): Promise<LeadIntelResult | null> {
  const anthropic = getAnthropicClient();
  if (!anthropic) return null;

  try {
    const prompt = `You are an expert B2B sales intelligence analyst. Analyze this inbound lead and provide actionable intelligence.

## Lead Information
- **Name:** ${data.name}
- **Email:** ${data.email}
- **Company:** ${data.company}
- **Job Title:** ${data.jobTitle}
- **Inquiry Type:** ${data.inquiryType}
- **Message:** ${data.message}

## Your Analysis Tasks

1. **Intent Detection:** What does this person actually want? (demo, pricing, support, partnership, general, urgent)
2. **Urgency Assessment:** How urgent is their need? (high/medium/low)
3. **Personalized Response:** Write a warm, personalized confirmation message for them (2-3 sentences)
4. **Company Intelligence:** Based on the company name and email domain, infer:
   - Likely industry
   - Estimated company size (startup, smb, mid-market, enterprise)
   - Potential AI use cases for their business
5. **Contact Intelligence:** Based on the job title:
   - Seniority level (c-level, vp, director, manager, individual, unknown)
   - Likely department
   - Are they a decision maker? (true/false)
6. **Research Suggestions:** What should the sales team research before reaching out?

Respond in this exact JSON format:
{
  "detectedIntent": "demo|pricing|support|partnership|general|urgent",
  "intentConfidence": 0.0-1.0,
  "urgency": "high|medium|low",
  "personalizedGreeting": "Hi [Name],",
  "personalizedMessage": "2-3 sentence personalized message based on their inquiry",
  "suggestedNextSteps": ["step1", "step2", "step3"],
  "companyIntel": {
    "likelyIndustry": "industry name",
    "estimatedSize": "startup|smb|mid-market|enterprise",
    "potentialUseCases": ["use case 1", "use case 2"]
  },
  "contactIntel": {
    "seniority": "c-level|vp|director|manager|individual|unknown",
    "department": "department name",
    "decisionMaker": true|false
  },
  "researchSuggestions": ["suggestion 1", "suggestion 2"],
  "summary": "One paragraph executive summary for the sales team"
}`;

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
    });

    const textContent = response.content.find((block) => block.type === "text");
    if (!textContent || textContent.type !== "text") {
      console.error("No text content in Anthropic response");
      return null;
    }

    // Parse JSON from response
    const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("No JSON found in Anthropic response");
      return null;
    }

    const result = JSON.parse(jsonMatch[0]) as LeadIntelResult;
    console.log("Lead intel analysis completed:", result.detectedIntent, result.urgency);
    return result;
  } catch (error) {
    console.error("Lead intel analysis failed:", error);
    return null;
  }
}

// Generate intent-specific email content
export function getIntentBasedEmailContent(intent: string, name: string): {
  subject: string;
  heading: string;
  message: string;
  ctaText: string;
  ctaUrl: string;
} {
  const firstName = name.split(" ")[0];

  const templates: Record<string, { subject: string; heading: string; message: string; ctaText: string; ctaUrl: string }> = {
    demo: {
      subject: `Your ArqAI Demo Request, ${firstName}`,
      heading: "Your Demo is Being Prepared",
      message: "We're excited to show you ArqAI in action! A solutions specialist will reach out within 24 hours to schedule your personalized demo and discuss your specific AI governance needs.",
      ctaText: "View Our Platform",
      ctaUrl: "https://thearq.ai/platform",
    },
    pricing: {
      subject: `ArqAI Pricing Information for ${firstName}`,
      heading: "Custom Pricing Coming Your Way",
      message: "Thank you for your interest in ArqAI pricing. Our team is preparing a custom quote tailored to your organization's needs. Expect to hear from us within 24 hours.",
      ctaText: "Explore Solutions",
      ctaUrl: "https://thearq.ai/solutions",
    },
    support: {
      subject: `ArqAI Support Request Received`,
      heading: "We're On It",
      message: "Our technical team has received your support request and is reviewing it now. We'll get back to you as quickly as possible with a resolution.",
      ctaText: "View Resources",
      ctaUrl: "https://thearq.ai/resources",
    },
    partnership: {
      subject: `Partnership Inquiry from ${firstName}`,
      heading: "Let's Explore Partnership",
      message: "Thank you for your interest in partnering with ArqAI. Our partnerships team will review your inquiry and reach out within 48 hours to discuss collaboration opportunities.",
      ctaText: "Learn About Partners",
      ctaUrl: "https://thearq.ai/partners",
    },
    urgent: {
      subject: `Urgent: ArqAI Response to ${firstName}`,
      heading: "We've Prioritized Your Request",
      message: "We understand the urgency of your inquiry. Our team has been notified and will respond as quickly as possible - typically within a few hours during business hours.",
      ctaText: "Contact Us Directly",
      ctaUrl: "mailto:hello@thearq.ai",
    },
    general: {
      subject: `Thanks for Reaching Out, ${firstName}!`,
      heading: "Message Received",
      message: "Thank you for your interest in ArqAI. Our team will review your inquiry and reach out within 24 hours to discuss how we can help you build, run, and govern your AI workforce.",
      ctaText: "Explore ArqAI",
      ctaUrl: "https://thearq.ai/platform",
    },
  };

  return templates[intent] || templates.general;
}
