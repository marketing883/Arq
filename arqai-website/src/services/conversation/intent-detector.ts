/**
 * Intent Detector Module
 *
 * Detects user intent and extracts behavioral signals from messages.
 */

import type { DetectedIntent, ConversationIntent, BehavioralSignalType } from "@/src/core";

/**
 * Intent patterns for detection
 */
interface IntentPattern {
  intent: ConversationIntent;
  patterns: RegExp[];
  weight: number;
}

const INTENT_PATTERNS: IntentPattern[] = [
  {
    intent: "demo_request",
    patterns: [
      /\b(demo|demonstration|trial|try|test|pilot)\b/i,
      /\b(show\s+me|walk\s+through|see\s+(it|how))\b/i,
      /\b(schedule|book|set\s+up).*(demo|call|meeting)\b/i,
    ],
    weight: 0.9,
  },
  {
    intent: "pricing_inquiry",
    patterns: [
      /\b(price|pricing|cost|budget|quote|estimate)\b/i,
      /\bhow\s+much\b/i,
      /\b(enterprise|team|pro)\s+(plan|tier|pricing)\b/i,
      /\b(discount|deal|offer)\b/i,
    ],
    weight: 0.85,
  },
  {
    intent: "support_request",
    patterns: [
      /\b(help|support|issue|problem|error|bug)\b/i,
      /\b(not\s+working|doesn't\s+work|broken)\b/i,
      /\b(fix|resolve|troubleshoot)\b/i,
    ],
    weight: 0.8,
  },
  {
    intent: "partnership_inquiry",
    patterns: [
      /\b(partner|partnership|reseller|integrate|integration)\b/i,
      /\b(white\s*label|oem|affiliate)\b/i,
      /\b(collaborate|collaboration)\b/i,
    ],
    weight: 0.85,
  },
  {
    intent: "competitor_comparison",
    patterns: [
      /\bvs\b|\bversus\b|\bcompare|comparison\b/i,
      /\b(alternative|better\s+than|different\s+from)\b/i,
      /\b(competition|competitor)\b/i,
    ],
    weight: 0.75,
  },
  {
    intent: "feature_question",
    patterns: [
      /\b(feature|capability|function|does\s+it)\b/i,
      /\bcan\s+(you|it|the\s+platform)\b/i,
      /\b(support|handle|work\s+with)\b/i,
    ],
    weight: 0.7,
  },
  {
    intent: "urgent_need",
    patterns: [
      /\b(urgent|asap|immediately|right\s+now|today)\b/i,
      /\b(deadline|time\s*sensitive|critical)\b/i,
      /\b(need\s+this\s+(now|quickly|fast))\b/i,
    ],
    weight: 0.95,
  },
];

/**
 * Signal patterns for extraction
 */
interface SignalPattern {
  type: BehavioralSignalType;
  patterns: RegExp[];
  baseConfidence: number;
}

const SIGNAL_PATTERNS: SignalPattern[] = [
  {
    type: "pricing_interest",
    patterns: [
      /\b(price|pricing|cost|budget|roi|investment)\b/i,
      /\bhow\s+much\b/i,
      /\b(affordable|expensive|cheaper)\b/i,
    ],
    baseConfidence: 0.8,
  },
  {
    type: "competitor_mention",
    patterns: [
      /\b(datadog|splunk|dynatrace|newrelic|elastic|sumo\s*logic)\b/i,
      /\b(other\s+(tools|platforms|solutions)|alternatives)\b/i,
      /\bcurrently\s+using\b/i,
    ],
    baseConfidence: 0.9,
  },
  {
    type: "timeline_mention",
    patterns: [
      /\b(this\s+(week|month|quarter)|next\s+(week|month|quarter))\b/i,
      /\b(deadline|timeline|timeframe|by\s+(january|february|march|april|may|june|july|august|september|october|november|december))\b/i,
      /\b(q[1-4]|fy\d{2,4})\b/i,
    ],
    baseConfidence: 0.85,
  },
  {
    type: "pain_point",
    patterns: [
      /\b(struggle|struggling|frustrated|frustrating|pain\s*point)\b/i,
      /\b(problem|issue|challenge|difficulty)\b/i,
      /\b(waste|wasting|inefficient)\b/i,
    ],
    baseConfidence: 0.75,
  },
  {
    type: "feature_interest",
    patterns: [
      /\b(interested\s+in|looking\s+for|need)\b/i,
      /\b(feature|capability|functionality)\b/i,
      /\b(important|critical|essential|must\s*have)\b/i,
    ],
    baseConfidence: 0.7,
  },
  {
    type: "demo_request",
    patterns: [
      /\b(demo|demonstration|trial|poc|pilot)\b/i,
      /\b(show\s+me|see\s+(it|how\s+it\s+works))\b/i,
      /\b(test|try|evaluate)\b/i,
    ],
    baseConfidence: 0.9,
  },
  {
    type: "compliance_mention",
    patterns: [
      /\b(compliance|compliant|regulatory|regulation)\b/i,
      /\b(soc\s*2|iso\s*27001|hipaa|gdpr|pci|fedramp)\b/i,
      /\b(audit|certification|certified)\b/i,
    ],
    baseConfidence: 0.85,
  },
  {
    type: "integration_question",
    patterns: [
      /\b(integrate|integration|connect|api)\b/i,
      /\b(work\s+with|compatible|support)\s+(our|existing)\b/i,
      /\b(slack|jira|salesforce|hubspot|github|aws|azure|gcp)\b/i,
    ],
    baseConfidence: 0.75,
  },
];

/**
 * Detect intent from a message
 */
export function detectIntent(message: string): DetectedIntent {
  let bestMatch: { intent: ConversationIntent; confidence: number } = {
    intent: "general_question",
    confidence: 0.5,
  };

  for (const pattern of INTENT_PATTERNS) {
    let matches = 0;
    for (const regex of pattern.patterns) {
      if (regex.test(message)) {
        matches++;
      }
    }

    if (matches > 0) {
      const confidence = Math.min(
        pattern.weight * (1 + (matches - 1) * 0.1),
        1
      );

      if (confidence > bestMatch.confidence) {
        bestMatch = {
          intent: pattern.intent,
          confidence,
        };
      }
    }
  }

  return {
    intent: bestMatch.intent,
    confidence: bestMatch.confidence,
  };
}

/**
 * Extract behavioral signals from a message
 */
export function extractSignals(
  message: string
): Array<{ type: BehavioralSignalType; confidence: number; content: string }> {
  const signals: Array<{
    type: BehavioralSignalType;
    confidence: number;
    content: string;
  }> = [];

  for (const pattern of SIGNAL_PATTERNS) {
    for (const regex of pattern.patterns) {
      const match = message.match(regex);
      if (match) {
        // Check if we already have this signal type
        const existing = signals.find((s) => s.type === pattern.type);
        if (!existing) {
          signals.push({
            type: pattern.type,
            confidence: pattern.baseConfidence,
            content: match[0],
          });
        } else {
          // Boost confidence for multiple matches
          existing.confidence = Math.min(existing.confidence + 0.1, 1);
          existing.content += `, ${match[0]}`;
        }
      }
    }
  }

  return signals;
}

/**
 * Get intent description for display
 */
export function getIntentDescription(intent: ConversationIntent): string {
  const descriptions: Record<ConversationIntent, string> = {
    demo_request: "Interested in seeing a demo",
    pricing_inquiry: "Asking about pricing",
    support_request: "Needs help or support",
    partnership_inquiry: "Interested in partnership",
    general_question: "General inquiry",
    urgent_need: "Has urgent requirements",
    feature_question: "Asking about features",
    competitor_comparison: "Comparing with competitors",
  };
  return descriptions[intent];
}

/**
 * Get signal description for display
 */
export function getSignalDescription(type: BehavioralSignalType): string {
  const descriptions: Record<BehavioralSignalType, string> = {
    pricing_interest: "Showed interest in pricing",
    competitor_mention: "Mentioned competitors",
    timeline_mention: "Has a specific timeline",
    pain_point: "Expressed pain points",
    feature_interest: "Interested in specific features",
    demo_request: "Requested a demo",
    compliance_mention: "Has compliance requirements",
    integration_question: "Asked about integrations",
  };
  return descriptions[type];
}
