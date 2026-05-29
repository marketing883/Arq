/**
 * Integration Interfaces
 *
 * Defines contracts for external service integrations.
 */

/**
 * Integration status
 */
export type IntegrationStatus = "connected" | "disconnected" | "error" | "not_configured";

/**
 * Base integration interface
 */
export interface IIntegration {
  readonly name: string;
  readonly type: string;

  /**
   * Check if the integration is configured
   */
  isConfigured(): boolean;

  /**
   * Check connection status
   */
  checkConnection(): Promise<IntegrationStatus>;

  /**
   * Test the integration
   */
  test(): Promise<IntegrationTestResult>;
}

export interface IntegrationTestResult {
  success: boolean;
  message: string;
  details?: Record<string, unknown>;
}

/**
 * Notification Integration (Slack, Teams, etc.)
 */
export interface INotificationIntegration extends IIntegration {
  /**
   * Send a notification
   */
  send(notification: NotificationPayload): Promise<NotificationResult>;
}

export interface NotificationPayload {
  title: string;
  message: string;
  priority?: "critical" | "high" | "medium" | "low";
  fields?: Array<{ label: string; value: string }>;
  actionUrl?: string;
  actionText?: string;
}

export interface NotificationResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * CRM Integration (Salesforce, HubSpot, etc.)
 */
export interface ICRMIntegration extends IIntegration {
  /**
   * Create or update a lead
   */
  upsertLead(lead: CRMLeadData): Promise<CRMSyncResult>;

  /**
   * Create or update a contact
   */
  upsertContact(contact: CRMContactData): Promise<CRMSyncResult>;

  /**
   * Create or update an account
   */
  upsertAccount(account: CRMAccountData): Promise<CRMSyncResult>;

  /**
   * Log an activity
   */
  logActivity(activity: CRMActivityData): Promise<CRMSyncResult>;
}

export interface CRMLeadData {
  email: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  title?: string;
  phone?: string;
  source?: string;
  score?: number;
  customFields?: Record<string, unknown>;
}

export interface CRMContactData {
  email: string;
  firstName?: string;
  lastName?: string;
  accountId?: string;
  title?: string;
  phone?: string;
  customFields?: Record<string, unknown>;
}

export interface CRMAccountData {
  name: string;
  domain?: string;
  industry?: string;
  employeeCount?: number;
  annualRevenue?: number;
  customFields?: Record<string, unknown>;
}

export interface CRMActivityData {
  type: "email" | "call" | "meeting" | "task" | "note";
  subject: string;
  description?: string;
  relatedToId: string;
  relatedToType: "lead" | "contact" | "account";
  dueDate?: Date;
  completedDate?: Date;
}

export interface CRMSyncResult {
  success: boolean;
  recordId?: string;
  action: "created" | "updated" | "skipped";
  error?: string;
}

/**
 * Calendar Integration (Cal.com, etc.)
 */
export interface ICalendarIntegration extends IIntegration {
  /**
   * Get available slots
   */
  getAvailability(
    startDate: Date,
    endDate: Date,
    eventTypeId?: string
  ): Promise<CalendarSlot[]>;

  /**
   * Create a booking
   */
  createBooking(booking: BookingRequest): Promise<BookingResult>;

  /**
   * Cancel a booking
   */
  cancelBooking(bookingId: string): Promise<void>;
}

export interface CalendarSlot {
  startTime: Date;
  endTime: Date;
  available: boolean;
}

export interface BookingRequest {
  eventTypeId: string;
  startTime: Date;
  attendeeEmail: string;
  attendeeName?: string;
  attendeeTimezone?: string;
  notes?: string;
  metadata?: Record<string, unknown>;
}

export interface BookingResult {
  success: boolean;
  bookingId?: string;
  bookingUrl?: string;
  meetingUrl?: string;
  error?: string;
}

/**
 * Enrichment Integration (Clearbit, Apollo, etc.)
 */
export interface IEnrichmentIntegration extends IIntegration {
  /**
   * Enrich company data by domain
   */
  enrichCompany(domain: string): Promise<EnrichedCompanyData | null>;

  /**
   * Enrich person data by email
   */
  enrichPerson(email: string): Promise<EnrichedPersonData | null>;
}

export interface EnrichedCompanyData {
  name: string;
  domain: string;
  industry?: string;
  sector?: string;
  employeeCount?: number;
  employeeRange?: string;
  annualRevenue?: number;
  revenueRange?: string;
  foundedYear?: number;
  location?: {
    city?: string;
    state?: string;
    country?: string;
  };
  technologies?: string[];
  socialProfiles?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
}

export interface EnrichedPersonData {
  email: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  title?: string;
  seniority?: string;
  department?: string;
  company?: EnrichedCompanyData;
  socialProfiles?: {
    linkedin?: string;
    twitter?: string;
  };
}

/**
 * Webhook Integration
 */
export interface IWebhookIntegration extends IIntegration {
  /**
   * Send a webhook payload
   */
  send(eventType: string, payload: Record<string, unknown>): Promise<WebhookResult>;

  /**
   * Verify webhook signature
   */
  verifySignature(payload: string, signature: string): boolean;
}

export interface WebhookResult {
  success: boolean;
  statusCode?: number;
  responseTime?: number;
  error?: string;
}
