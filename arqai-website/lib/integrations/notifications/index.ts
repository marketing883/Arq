/**
 * Notifications Module
 *
 * Exports all notification-related functionality.
 */

export { SlackAdapter, getSlackAdapter } from "./slack-adapter";
export { TeamsAdapter, getTeamsAdapter } from "./teams-adapter";
export {
  getNotificationStatus,
  registerChannel,
  getChannels,
  removeChannel,
  sendNotification,
  sendLeadAlert,
  sendBatchAlerts,
  testNotifications,
} from "./notification-service";
export type {
  NotificationResult,
  NotificationSendResult,
} from "./notification-service";
