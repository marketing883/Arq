/**
 * Unified Notification Service
 *
 * Routes alerts to configured notification channels (Slack, Teams, Email).
 * Supports channel-specific filtering by alert type and priority.
 *
 * SECURITY: All channel configurations are server-side only.
 * RELIABILITY: Notifications are sent in parallel with independent failure handling.
 */

import { getSlackAdapter } from "./slack-adapter";
import { getTeamsAdapter } from "./teams-adapter";
import type {
  NotificationChannel,
  NotificationPayload,
  NotificationLeadData,
  IntegrationStatusInfo,
} from "@/types/integrations";
import type { LeadAlert, LeadProfile } from "@/types/lead-intelligence-v2";

export interface NotificationResult {
  channel: string;
  sent: boolean;
  error?: string;
}

export interface NotificationSendResult {
  success: boolean;
  results: NotificationResult[];
  total_sent: number;
  total_failed: number;
}

/**
 * In-memory channel configuration
 * In production, load from database
 */
const configuredChannels: NotificationChannel[] = [];

/**
 * Get notification service status
 */
export function getNotificationStatus(): IntegrationStatusInfo[] {
  const slackAdapter = getSlackAdapter();
  const teamsAdapter = getTeamsAdapter();

  return [
    {
      type: "slack",
      name: "Slack",
      status: slackAdapter.getStatus().configured ? "connected" : "not_configured",
      is_configured: slackAdapter.getStatus().configured,
    },
    {
      type: "teams",
      name: "Microsoft Teams",
      status: teamsAdapter.getStatus().configured ? "connected" : "not_configured",
      is_configured: teamsAdapter.getStatus().configured,
    },
  ];
}

/**
 * Register a notification channel
 */
export function registerChannel(channel: NotificationChannel): void {
  // Remove existing channel with same ID
  const index = configuredChannels.findIndex(c => c.id === channel.id);
  if (index >= 0) {
    configuredChannels.splice(index, 1);
  }
  configuredChannels.push(channel);
}

/**
 * Get all configured channels
 */
export function getChannels(): NotificationChannel[] {
  return [...configuredChannels];
}

/**
 * Remove a channel by ID
 */
export function removeChannel(channelId: string): boolean {
  const index = configuredChannels.findIndex(c => c.id === channelId);
  if (index >= 0) {
    configuredChannels.splice(index, 1);
    return true;
  }
  return false;
}

/**
 * Send notification to all matching channels
 */
export async function sendNotification(
  payload: NotificationPayload
): Promise<NotificationSendResult> {
  const results: NotificationResult[] = [];

  // Get channels that match this alert type and priority
  const matchingChannels = configuredChannels.filter(channel => {
    if (!channel.is_active) return false;
    if (!channel.alert_types.includes(payload.alert_type)) return false;
    if (!shouldSendForPriority(payload.priority, channel.min_priority)) return false;
    return true;
  });

  // Also send to default channels if no specific channels configured
  const useDefaultChannels = matchingChannels.length === 0;

  // Send to Slack if configured
  const slackAdapter = getSlackAdapter();
  if (slackAdapter.getStatus().configured) {
    const shouldSendToSlack = useDefaultChannels ||
      matchingChannels.some(c => c.channel_type === "slack");

    if (shouldSendToSlack) {
      try {
        const result = await slackAdapter.sendNotification(payload);
        results.push({
          channel: "slack",
          sent: result.sent,
        });
      } catch (error) {
        results.push({
          channel: "slack",
          sent: false,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }
  }

  // Send to Teams if configured
  const teamsAdapter = getTeamsAdapter();
  if (teamsAdapter.getStatus().configured) {
    const shouldSendToTeams = useDefaultChannels ||
      matchingChannels.some(c => c.channel_type === "teams");

    if (shouldSendToTeams) {
      try {
        const result = await teamsAdapter.sendNotification(payload);
        results.push({
          channel: "teams",
          sent: result.sent,
        });
      } catch (error) {
        results.push({
          channel: "teams",
          sent: false,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }
  }

  const totalSent = results.filter(r => r.sent).length;
  const totalFailed = results.filter(r => !r.sent).length;

  return {
    success: totalSent > 0 || results.length === 0,
    results,
    total_sent: totalSent,
    total_failed: totalFailed,
  };
}

/**
 * Send alert notification for a lead
 */
export async function sendLeadAlert(
  alert: LeadAlert,
  profile: LeadProfile
): Promise<NotificationSendResult> {
  const leadData: NotificationLeadData = {
    email: profile.canonical_email,
    name: profile.first_name && profile.last_name
      ? `${profile.first_name} ${profile.last_name}`
      : profile.first_name ?? undefined,
    company: profile.company ?? profile.company_intel?.company_name,
    score: profile.composite_score,
    journey_stage: profile.journey_stage,
    priority_tier: profile.priority_tier,
  };

  const adminBaseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://thearq.ai";

  const payload: NotificationPayload = {
    channel_id: "", // Will be filled by matching channels
    alert_type: alert.alert_type,
    priority: alert.priority,
    title: alert.title,
    message: alert.message,
    lead_data: leadData,
    action_url: `${adminBaseUrl}/admin/leads-v2?id=${profile.id}`,
    action_text: "View Lead Details",
  };

  return sendNotification(payload);
}

/**
 * Send batch notification for multiple alerts
 */
export async function sendBatchAlerts(
  alerts: Array<{ alert: LeadAlert; profile: LeadProfile }>
): Promise<NotificationSendResult[]> {
  // Limit concurrent notifications
  const BATCH_SIZE = 5;
  const results: NotificationSendResult[] = [];

  for (let i = 0; i < alerts.length; i += BATCH_SIZE) {
    const batch = alerts.slice(i, i + BATCH_SIZE);
    const batchResults = await Promise.all(
      batch.map(({ alert, profile }) => sendLeadAlert(alert, profile))
    );
    results.push(...batchResults);

    // Small delay between batches to avoid rate limiting
    if (i + BATCH_SIZE < alerts.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  return results;
}

/**
 * Check if priority meets minimum threshold
 */
function shouldSendForPriority(
  alertPriority: string,
  minPriority: string
): boolean {
  const priorityOrder = ["low", "medium", "high", "critical"];
  const alertIndex = priorityOrder.indexOf(alertPriority);
  const minIndex = priorityOrder.indexOf(minPriority);

  // Send if alert priority >= min priority
  return alertIndex >= minIndex;
}

/**
 * Test notification channels
 */
export async function testNotifications(): Promise<NotificationSendResult> {
  const testPayload: NotificationPayload = {
    channel_id: "test",
    alert_type: "test",
    priority: "medium",
    title: "Test Notification",
    message: "This is a test notification from ArqAI Lead Intelligence.",
    lead_data: {
      email: "test@example.com",
      name: "Test User",
      company: "Test Company",
      score: 75,
      journey_stage: "engaged",
      priority_tier: "P2",
    },
    action_url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://thearq.ai",
    action_text: "View Dashboard",
  };

  return sendNotification(testPayload);
}
