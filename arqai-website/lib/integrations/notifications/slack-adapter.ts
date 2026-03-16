/**
 * Slack Notification Adapter
 *
 * Sends real-time alerts to Slack channels via webhooks.
 * No paid API required - uses free incoming webhooks.
 *
 * SECURITY: Webhook URLs are never exposed to clients.
 */

import { BaseServiceAdapter, AdapterConfig } from "../base-adapter";
import type {
  SlackMessage,
  SlackBlock,
  NotificationPayload,
  NotificationLeadData,
} from "@/types/integrations";

export interface SlackNotificationResult {
  sent: boolean;
  webhook_response?: string;
}

export class SlackAdapter extends BaseServiceAdapter<SlackNotificationResult> {
  private readonly webhookUrl: string | undefined;

  constructor() {
    const config: AdapterConfig = {
      name: "slack",
      envKeyName: "SLACK_WEBHOOK_URL",
      timeoutMs: 5000,
      retryCount: 2,
      retryDelayMs: 500,
    };
    super(config);
    this.webhookUrl = process.env.SLACK_WEBHOOK_URL;
  }

  /**
   * Send notification to Slack
   */
  public async sendNotification(payload: NotificationPayload): Promise<SlackNotificationResult> {
    const message = this.buildSlackMessage(payload);
    const result = await this.execute(message);
    return result.data ?? { sent: false };
  }

  protected async callService(
    input: unknown,
    signal: AbortSignal
  ): Promise<SlackNotificationResult | null> {
    if (!this.webhookUrl) {
      return null;
    }

    const message = input as SlackMessage;

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
      throw new Error(`Slack webhook failed: ${response.status} - ${errorText}`);
    }

    return {
      sent: true,
      webhook_response: await response.text(),
    };
  }

  protected async fallback(_input: unknown): Promise<SlackNotificationResult | null> {
    // Log to console when Slack is not configured
    console.log("[Slack Fallback] Notification would be sent:", JSON.stringify(_input, null, 2));
    return { sent: false };
  }

  /**
   * Build Slack message from notification payload
   */
  private buildSlackMessage(payload: NotificationPayload): SlackMessage {
    const priorityEmoji = this.getPriorityEmoji(payload.priority);
    const priorityColor = this.getPriorityColor(payload.priority);

    const blocks: SlackBlock[] = [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: `${priorityEmoji} ${payload.title}`,
          emoji: true,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: payload.message,
        },
      },
    ];

    // Add lead data if available
    if (payload.lead_data) {
      blocks.push(this.buildLeadDataBlock(payload.lead_data));
    }

    // Add action buttons
    if (payload.action_url) {
      blocks.push({
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: payload.action_text ?? "View Lead",
              emoji: true,
            },
            url: payload.action_url,
            style: "primary",
          },
        ],
      });
    }

    // Add context footer as a section instead of context (for type compatibility)
    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `_Alert Type: ${payload.alert_type} | Priority: ${payload.priority.toUpperCase()} | ${new Date().toISOString()}_`,
      },
    });

    return {
      text: `${priorityEmoji} ${payload.title}`,
      blocks,
      attachments: [
        {
          color: priorityColor,
        },
      ],
    };
  }

  /**
   * Build lead data block for Slack
   */
  private buildLeadDataBlock(leadData: NotificationLeadData): SlackBlock {
    const fields: Array<{ type: "mrkdwn"; text: string }> = [];

    if (leadData.email) {
      fields.push({ type: "mrkdwn", text: `*Email:*\n${leadData.email}` });
    }
    if (leadData.name) {
      fields.push({ type: "mrkdwn", text: `*Name:*\n${leadData.name}` });
    }
    if (leadData.company) {
      fields.push({ type: "mrkdwn", text: `*Company:*\n${leadData.company}` });
    }
    if (leadData.score !== undefined) {
      fields.push({ type: "mrkdwn", text: `*Score:*\n${leadData.score}` });
    }
    if (leadData.journey_stage) {
      fields.push({ type: "mrkdwn", text: `*Stage:*\n${leadData.journey_stage}` });
    }
    if (leadData.priority_tier) {
      fields.push({ type: "mrkdwn", text: `*Priority:*\n${leadData.priority_tier}` });
    }

    return {
      type: "section",
      fields,
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
        return "#dc2626"; // red-600
      case "high":
        return "#f59e0b"; // amber-500
      case "medium":
        return "#3b82f6"; // blue-500
      case "low":
        return "#6b7280"; // gray-500
      default:
        return "#9ca3af"; // gray-400
    }
  }
}

// Singleton instance
let slackAdapterInstance: SlackAdapter | null = null;

export function getSlackAdapter(): SlackAdapter {
  if (!slackAdapterInstance) {
    slackAdapterInstance = new SlackAdapter();
  }
  return slackAdapterInstance;
}
