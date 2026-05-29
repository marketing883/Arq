/**
 * Slack Notification Adapter
 *
 * Implements notification integration for Slack webhooks.
 */

import type {
  INotificationIntegration,
  IntegrationStatus,
  IntegrationTestResult,
  NotificationPayload,
  NotificationResult,
} from "@/src/core";

/**
 * Slack configuration
 */
export interface SlackConfig {
  webhookUrl: string;
  channelName?: string;
  username?: string;
  iconEmoji?: string;
}

/**
 * Slack block structure
 */
interface SlackBlock {
  type: string;
  text?: { type: string; text: string; emoji?: boolean };
  fields?: Array<{ type: string; text: string }>;
  elements?: Array<{
    type: string;
    text?: { type: string; text: string };
    url?: string;
    style?: string;
  }>;
}

/**
 * Slack API Adapter
 */
export class SlackAdapter implements INotificationIntegration {
  readonly name = "Slack";
  readonly type = "slack";

  private config: SlackConfig;

  constructor(config: Partial<SlackConfig> = {}) {
    this.config = {
      webhookUrl: config.webhookUrl || process.env.SLACK_WEBHOOK_URL || "",
      channelName: config.channelName,
      username: config.username || "ArqAI",
      iconEmoji: config.iconEmoji || ":robot_face:",
    };
  }

  isConfigured(): boolean {
    return !!this.config.webhookUrl;
  }

  async checkConnection(): Promise<IntegrationStatus> {
    if (!this.isConfigured()) {
      return "not_configured";
    }

    try {
      const result = await this.test();
      return result.success ? "connected" : "error";
    } catch {
      return "error";
    }
  }

  async test(): Promise<IntegrationTestResult> {
    if (!this.isConfigured()) {
      return {
        success: false,
        message: "Slack webhook URL not configured",
      };
    }

    try {
      const result = await this.send({
        title: "Test Notification",
        message: "This is a test notification from ArqAI",
        priority: "low",
      });

      return {
        success: result.success,
        message: result.success
          ? "Test notification sent successfully"
          : result.error || "Failed to send test notification",
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async send(notification: NotificationPayload): Promise<NotificationResult> {
    if (!this.isConfigured()) {
      return {
        success: false,
        error: "Slack webhook URL not configured",
      };
    }

    try {
      const blocks = this.buildBlocks(notification);

      const payload = {
        username: this.config.username,
        icon_emoji: this.config.iconEmoji,
        channel: this.config.channelName,
        text: `${notification.title}: ${notification.message}`,
        blocks,
      };

      const response = await fetch(this.config.webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return {
          success: false,
          error: `Slack API error: ${response.status} - ${errorText}`,
        };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Build Slack blocks from notification
   */
  private buildBlocks(notification: NotificationPayload): SlackBlock[] {
    const blocks: SlackBlock[] = [];

    // Header with emoji based on priority
    const priorityEmoji = this.getPriorityEmoji(notification.priority);
    blocks.push({
      type: "header",
      text: {
        type: "plain_text",
        text: `${priorityEmoji} ${notification.title}`,
        emoji: true,
      },
    });

    // Main message
    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: notification.message,
      },
    });

    // Fields if provided
    if (notification.fields && notification.fields.length > 0) {
      blocks.push({
        type: "section",
        fields: notification.fields.map((f) => ({
          type: "mrkdwn",
          text: `*${f.label}:*\n${f.value}`,
        })),
      });
    }

    // Action button if URL provided
    if (notification.actionUrl) {
      blocks.push({
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: notification.actionText || "View Details",
            },
            url: notification.actionUrl,
            style: "primary",
          },
        ],
      });
    }

    return blocks;
  }

  /**
   * Get emoji based on priority
   */
  private getPriorityEmoji(priority?: string): string {
    const emojis: Record<string, string> = {
      critical: ":rotating_light:",
      high: ":fire:",
      medium: ":bell:",
      low: ":information_source:",
    };
    return emojis[priority || "medium"] || ":bell:";
  }
}

/**
 * Factory function to create Slack adapter
 */
export function createSlackAdapter(
  config?: Partial<SlackConfig>
): SlackAdapter {
  return new SlackAdapter(config);
}
