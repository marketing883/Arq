/**
 * Lead Alerts Module
 *
 * Evaluates alert rules and generates notifications for sales team.
 */

import type {
  LeadIntelligence,
  LeadAlert,
  AlertType,
  AlertPriority,
} from "@/src/core";
import type { ScoreResult } from "./scoring";

/**
 * Alert rule definition
 */
interface AlertRule {
  type: AlertType;
  priority: AlertPriority;
  ttlHours: number;
  condition: (lead: LeadIntelligence, scoreResult: ScoreResult) => boolean;
  getMessage: (lead: LeadIntelligence, scoreResult: ScoreResult) => {
    title: string;
    message: string;
    suggestedAction: string;
  };
}

/**
 * Alert rules configuration
 */
const ALERT_RULES: AlertRule[] = [
  {
    type: "hot_lead_new",
    priority: "critical",
    ttlHours: 4,
    condition: (lead, scoreResult) =>
      scoreResult.compositeScore >= 70 &&
      lead.journeyStage !== "opportunity" &&
      lead.daysSinceLastTouch <= 1,
    getMessage: (lead, scoreResult) => ({
      title: "Hot Lead Alert",
      message: `${lead.user?.name || lead.user?.email || "New lead"} scored ${scoreResult.compositeScore}/100. Recent high-intent activity detected.`,
      suggestedAction: "Contact within 1 hour for best conversion chance",
    }),
  },
  {
    type: "engagement_surge",
    priority: "high",
    ttlHours: 8,
    condition: (lead, scoreResult) => scoreResult.velocityBonus >= 10,
    getMessage: (lead) => ({
      title: "Engagement Surge",
      message: `${lead.user?.name || "Lead"} from ${lead.companyResearch?.name || lead.user?.company || "Unknown"} showing 5+ interactions in 48 hours.`,
      suggestedAction: "Strike while iron is hot - reach out today",
    }),
  },
  {
    type: "competitor_mention",
    priority: "high",
    ttlHours: 24,
    condition: (lead) =>
      lead.behavioralSignals.some(
        (s) =>
          s.type === "competitor_mention" &&
          new Date().getTime() - s.timestamp.getTime() < 24 * 60 * 60 * 1000
      ),
    getMessage: (lead) => {
      const competitorSignal = lead.behavioralSignals.find(
        (s) => s.type === "competitor_mention"
      );
      return {
        title: "Competitor Mentioned",
        message: `${lead.user?.name || "Lead"} mentioned competitors: "${competitorSignal?.content || "unknown"}". Active evaluation in progress.`,
        suggestedAction: "Prepare competitive battle card and reach out with differentiation points",
      };
    },
  },
  {
    type: "demo_page_visit",
    priority: "high",
    ttlHours: 4,
    condition: (lead) =>
      lead.behavioralSignals.some(
        (s) =>
          s.type === "demo_request" &&
          new Date().getTime() - s.timestamp.getTime() < 4 * 60 * 60 * 1000
      ),
    getMessage: (lead) => ({
      title: "Demo Interest",
      message: `${lead.user?.name || "Lead"} from ${lead.companyResearch?.name || lead.user?.company || "Unknown"} requested a demo.`,
      suggestedAction: "Schedule demo call within 4 hours",
    }),
  },
  {
    type: "compliance_urgency",
    priority: "high",
    ttlHours: 24,
    condition: (lead) =>
      lead.behavioralSignals.some(
        (s) =>
          s.type === "compliance_mention" &&
          s.content.toLowerCase().includes("urgent")
      ),
    getMessage: (lead) => ({
      title: "Urgent Compliance Need",
      message: `${lead.user?.name || "Lead"} mentioned urgent compliance requirements. High buying intent.`,
      suggestedAction: "Contact immediately - time-sensitive opportunity",
    }),
  },
  {
    type: "decision_maker_engaged",
    priority: "critical",
    ttlHours: 8,
    condition: (lead, scoreResult) =>
      lead.userResearch?.decisionMaker === true &&
      scoreResult.compositeScore >= 50 &&
      lead.daysSinceLastTouch <= 2,
    getMessage: (lead, scoreResult) => ({
      title: "Decision Maker Engaged",
      message: `${lead.user?.name || "Lead"} (${lead.userResearch?.roleSeniority || "decision maker"}) from ${lead.companyResearch?.name || lead.user?.company || "Unknown"} is actively engaged. Score: ${scoreResult.compositeScore}/100.`,
      suggestedAction: "Prioritize executive outreach with ROI-focused messaging",
    }),
  },
  {
    type: "dormant_high_value",
    priority: "medium",
    ttlHours: 72,
    condition: (lead, scoreResult) =>
      scoreResult.icpFitScore >= 70 &&
      lead.daysSinceLastTouch >= 14 &&
      lead.daysSinceLastTouch <= 30,
    getMessage: (lead) => ({
      title: "High-Value Lead Going Cold",
      message: `${lead.user?.name || "Lead"} from ${lead.companyResearch?.name || lead.user?.company || "Unknown"} matches ICP but hasn't engaged in ${lead.daysSinceLastTouch} days.`,
      suggestedAction: "Re-engage with valuable content or personalized outreach",
    }),
  },
  {
    type: "score_threshold_reached",
    priority: "medium",
    ttlHours: 24,
    condition: (lead, scoreResult) =>
      scoreResult.compositeScore >= 60 && lead.journeyStage === "engaged",
    getMessage: (lead, scoreResult) => ({
      title: "Lead Ready to Qualify",
      message: `${lead.user?.name || "Lead"} reached score threshold (${scoreResult.compositeScore}/100). Ready for sales qualification.`,
      suggestedAction: "Schedule discovery call to qualify opportunity",
    }),
  },
];

/**
 * Evaluate all alert rules for a lead
 */
export async function evaluateAlertRules(
  lead: LeadIntelligence,
  scoreResult: ScoreResult
): Promise<Omit<LeadAlert, "id" | "createdAt">[]> {
  const alerts: Omit<LeadAlert, "id" | "createdAt">[] = [];

  for (const rule of ALERT_RULES) {
    try {
      if (rule.condition(lead, scoreResult)) {
        const { title, message, suggestedAction } = rule.getMessage(lead, scoreResult);

        alerts.push({
          leadProfileId: lead.id,
          alertType: rule.type,
          priority: rule.priority,
          title,
          message,
          suggestedAction,
          status: "active",
          expiresAt: new Date(Date.now() + rule.ttlHours * 60 * 60 * 1000),
          triggerEvent: {
            scoreResult: {
              compositeScore: scoreResult.compositeScore,
              intentScore: scoreResult.intentScore,
              engagementScore: scoreResult.engagementScore,
            },
            journeyStage: lead.journeyStage,
            priorityTier: lead.priorityTier,
          },
        });
      }
    } catch (error) {
      console.error(`Error evaluating alert rule ${rule.type}:`, error);
    }
  }

  return alerts;
}

/**
 * Get alert priority color for UI
 */
export function getAlertPriorityColor(priority: AlertPriority): string {
  const colors: Record<AlertPriority, string> = {
    critical: "#ef4444", // red
    high: "#f97316", // orange
    medium: "#eab308", // yellow
    low: "#22c55e", // green
  };
  return colors[priority];
}

/**
 * Get alert priority label
 */
export function getAlertPriorityLabel(priority: AlertPriority): string {
  const labels: Record<AlertPriority, string> = {
    critical: "Critical",
    high: "High Priority",
    medium: "Medium Priority",
    low: "Low Priority",
  };
  return labels[priority];
}
