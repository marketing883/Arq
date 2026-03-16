/**
 * Microsoft Teams Notification Adapter
 *
 * Implements notification integration for Teams webhooks.
 */

import type {
  INotificationIntegration,
  IntegrationStatus,
  IntegrationTestResult,
  NotificationPayload,
  NotificationResult,
} from "@/src/core";

/**
 * Teams configuration
 */
export interface TeamsConfig {
  webhookUrl: string;
}

/**
 * Teams message card structure
 */
interface TeamsMessageCard {
  "@type": "MessageCard";
  "@context": string;
  themeColor: string;
  summary: string;
  sections: TeamsSection[];
  potentialAction?: TeamsAction[];
}

interface TeamsSection {
  activityTitle?: string;
  activitySubtitle?: string;
  facts?: Array<{ name: string; value: string }>;
  markdown?: boolean;
  text?: string;
}

interface TeamsAction {
  "@type": string;
  name: string;
  targets?: Array<{ os: string; uri: string }>;
}

/**
 * Teams API Adapter
 */
export class TeamsAdapter implements INotificationIntegration {
  readonly name = "Microsoft Teams";
  readonly type = "teams";

  private config: TeamsConfig;

  constructor(config: Partial<TeamsConfig> = {}) {
    this.config = {
      webhookUrl: config.webhookUrl || process.env.TEAMS_WEBHOOK_URL || "",
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
        message: "Teams webhook URL not configured",
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
        error: "Teams webhook URL not configured",
      };
    }

    try {
      const card = this.buildMessageCard(notification);

      const response = await fetch(this.config.webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(card),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return {
          success: false,
          error: `Teams API error: ${response.status} - ${errorText}`,
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
   * Build Teams message card from notification
   */
  private buildMessageCard(notification: NotificationPayload): TeamsMessageCard {
    const themeColor = this.getPriorityColor(notification.priority);

    const sections: TeamsSection[] = [
      {
        activityTitle: notification.title,
        activitySubtitle: `Priority: ${notification.priority || "medium"}`,
        markdown: true,
        text: notification.message,
      },
    ];

    // Add fields as facts
    if (notification.fields && notification.fields.length > 0) {
      sections.push({
        facts: notification.fields.map((f) => ({
          name: f.label,
          value: f.value,
        })),
      });
    }

    const card: TeamsMessageCard = {
      "@type": "MessageCard",
      "@context": "http://schema.org/extensions",
      themeColor,
      summary: notification.title,
      sections,
    };

    // Add action button if URL provided
    if (notification.actionUrl) {
      card.potentialAction = [
        {
          "@type": "OpenUri",
          name: notification.actionText || "View Details",
          targets: [
            {
              os: "default",
              uri: notification.actionUrl,
            },
          ],
        },
      ];
    }

    return card;
  }

  /**
   * Get color based on priority
   */
  private getPriorityColor(priority?: string): string {
    const colors: Record<string, string> = {
      critical: "FF0000", // Red
      high: "FF8C00", // Dark Orange
      medium: "FFC107", // Amber
      low: "28A745", // Green
    };
    return colors[priority || "medium"] || "0078D7";
  }
}

/**
 * Factory function to create Teams adapter
 */
export function createTeamsAdapter(
  config?: Partial<TeamsConfig>
): TeamsAdapter {
  return new TeamsAdapter(config);
}
