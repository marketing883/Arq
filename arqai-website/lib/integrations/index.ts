/**
 * Integrations Module
 *
 * Unified exports for all integration adapters and services.
 */

// Base adapter
export { BaseServiceAdapter, AdapterCache, AdapterRateLimiter } from "./base-adapter";
export type { AdapterConfig, AdapterResult } from "./base-adapter";

// Notifications
export {
  getSlackAdapter,
  getTeamsAdapter,
  getNotificationStatus,
  registerChannel,
  getChannels,
  removeChannel,
  sendNotification,
  sendLeadAlert,
  sendBatchAlerts,
  testNotifications,
} from "./notifications";
