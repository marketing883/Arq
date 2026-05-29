/**
 * Microsoft Teams Notification Adapter
 *
 * Sends real-time alerts to Teams channels via webhooks.
 * No paid API required - uses free incoming webhooks.
 *
 * SECURITY: Webhook URLs are never exposed to clients.
 */

import { BaseServiceAdapter, AdapterConfig } from "../base-adapter";
import type {
  TeamsMessage,
  TeamsSection,
  TeamsFact,
  TeamsAction,
  NotificationPayload,
  NotificationLeadData,
} from "@/types/integrations";

export interface TeamsNotificationResult {
  sent: boolean;
  webhook_response?: string;
}

export class TeamsAdapter extends BaseServiceAdapter<TeamsNotificationResult> {
  private readonly webhookUrl: string | undefined;

  constructor() {
    const config: AdapterConfig = {
      name: "teams",
      envKeyName: "TEAMS_WEBHOOK_URL",
      timeoutMs: 5000,
      retryCount: 2,
      retryDelayMs: 500,
    };
    super(config);
    this.webhookUrl = process.env.TEAMS_WEBHOOK_URL;
  }

  /**
   * Send notification to Teams
   */
  public async sendNotification(payload: NotificationPayload): Promise<TeamsNotificationResult> {
    const message = this.buildTeamsMessage(payload);
    const result = await this.execute(message);
    return result.data ?? { sent: false };
  }

  protected async callService(
    input: unknown,
    signal: AbortSignal
  ): Promise<TeamsNotificationResult | null> {
    if (!this.webhookUrl) {
      return null;
    }

    const message = input as TeamsMessage;

    const response = await fetch(this.webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
      signal,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Teams webhook failed: ${response.status} - ${errorText}`);
    }

    return {
      sent: true,
      webhook_response: "1", // Teams returns "1" on success
    };
  }

  protected async fallback(_input: unknown): Promise<TeamsNotificationResult | null> {
    // Log to console when Teams is not configured
    console.log("[Teams Fallback] Notification would be sent:", JSON.stringify(_input, null, 2));
    return { sent: false };
  }

  /**
   * Build Teams message from notification payload
   */
  private buildTeamsMessage(payload: NotificationPayload): TeamsMessage {
    const priorityEmoji = this.getPriorityEmoji(payload.priority);
    const themeColor = this.getPriorityColor(payload.priority);

    const sections: TeamsSection[] = [
      {
        activityTitle: `${priorityEmoji} ${payload.title}`,
        activitySubtitle: `Alert Type: ${payload.alert_type} | Priority: ${payload.priority.toUpperCase()}`,
        markdown: true,
        text: payload.message,
      },
    ];

    // Add lead data if available
    if (payload.lead_data) {
      sections.push(this.buildLeadDataSection(payload.lead_data));
    }

    // Add timestamp
    sections.push({
      text: `_Generated at ${new Date().toISOString()}_`,
      markdown: true,
    });

    const potentialAction: TeamsAction[] = [];

    // Add action button if URL provided
    if (payload.action_url) {
      potentialAction.push({
        "@type": "OpenUri",
        name: payload.action_text ?? "View Lead",
        targets: [
          {
            os: "default",
            uri: payload.action_url,
          },
        ],
      });
    }

    return {
      "@type": "MessageCard",
      "@context": "https://schema.org/extensions",
      themeColor,
      summary: `${priorityEmoji} ${payload.title}`,
      sections,
      potentialAction: potentialAction.length > 0 ? potentialAction : undefined,
    };
  }

  /**
   * Build lead data section for Teams
   */
  private buildLeadDataSection(leadData: NotificationLeadData): TeamsSection {
    const facts: TeamsFact[] = [];

    if (leadData.email) {
      facts.push({ name: "Email", value: leadData.email });
    }
    if (leadData.name) {
      facts.push({ name: "Name", value: leadData.name });
    }
    if (leadData.company) {
      facts.push({ name: "Company", value: leadData.company });
    }
    if (leadData.score !== undefined) {
      facts.push({ name: "Score", value: String(leadData.score) });
    }
    if (leadData.journey_stage) {
      facts.push({ name: "Journey Stage", value: leadData.journey_stage });
    }
    if (leadData.priority_tier) {
      facts.push({ name: "Priority Tier", value: leadData.priority_tier });
    }

    return {
      facts,
      markdown: true,
    };
  }

  private getPriorityEmoji(priority: string): string {
    switch (priority) {
      case "critical":
        return "🚨";
      case "high":
        return "🔥";
      case "medium":
        return "⚠️";
      case "low":
        return "ℹ️";
      default:
        return "📢";
    }
  }

  private getPriorityColor(priority: string): string {
    switch (priority) {
      case "critical":
        return "dc2626"; // red-600 (no # for Teams)
      case "high":
        return "f59e0b"; // amber-500
      case "medium":
        return "3b82f6"; // blue-500
      case "low":
        return "6b7280"; // gray-500
      default:
        return "9ca3af"; // gray-400
    }
  }
}

// Singleton instance
let teamsAdapterInstance: TeamsAdapter | null = null;

export function getTeamsAdapter(): TeamsAdapter {
  if (!teamsAdapterInstance) {
    teamsAdapterInstance = new TeamsAdapter();
  }
  return teamsAdapterInstance;
}
