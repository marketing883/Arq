/**
 * Integration Types
 *
 * Types for external service integrations including:
 * - CRM (Salesforce, HubSpot)
 * - Calendar (Cal.com)
 * - Notifications (Slack, Teams)
 * - Enrichment (Clearbit, Apollo)
 */

// ============================================
// INTEGRATION STATUS TYPES
// ============================================

export type IntegrationType =
  | "slack"
  | "teams"
  | "salesforce"
  | "hubspot"
  | "cal_com"
  | "clearbit"
  | "apollo"
  | "zapier";

export type IntegrationStatus = "connected" | "disconnected" | "error" | "not_configured";

export interface IntegrationConfig {
  id: string;
  integration_type: IntegrationType;
  config: IntegrationConfigData;
  is_active: boolean;
  last_connected?: string;
  last_error?: string;
  created_at: string;
  updated_at: string;
}

export interface IntegrationConfigData {
  api_key?: string;
  webhook_url?: string;
  client_id?: string;
  client_secret?: string;
  access_token?: string;
  refresh_token?: string;
  instance_url?: string;
  custom_fields?: Record<string, string>;
}

export interface IntegrationStatusInfo {
  type: IntegrationType;
  name: string;
  status: IntegrationStatus;
  is_configured: boolean;
  last_sync?: string;
  error_message?: string;
}

// ============================================
// NOTIFICATION TYPES
// ============================================

export interface NotificationChannel {
  id: string;
  channel_type: "slack" | "teams" | "email";
  channel_config: NotificationChannelConfig;
  alert_types: string[];
  min_priority: "critical" | "high" | "medium" | "low";
  is_active: boolean;
  created_at: string;
}

export interface NotificationChannelConfig {
  webhook_url?: string;
  channel_name?: string;
  channel_id?: string;
  email_addresses?: string[];
  mention_users?: string[];
}

export interface NotificationPayload {
  channel_id: string;
  alert_type: string;
  priority: "critical" | "high" | "medium" | "low";
  title: string;
  message: string;
  lead_data?: NotificationLeadData;
  action_url?: string;
  action_text?: string;
}

export interface NotificationLeadData {
  email?: string;
  name?: string;
  company?: string;
  score?: number;
  journey_stage?: string;
  priority_tier?: string;
}

export interface SlackMessage {
  channel?: string;
  text: string;
  blocks?: SlackBlock[];
  attachments?: SlackAttachment[];
}

export interface SlackBlock {
  type: string;
  text?: SlackTextObject;
  fields?: SlackTextObject[];
  elements?: SlackElement[];
  accessory?: SlackElement;
}

export interface SlackTextObject {
  type: "plain_text" | "mrkdwn";
  text: string;
  emoji?: boolean;
}

export interface SlackElement {
  type: string;
  text?: SlackTextObject;
  url?: string;
  action_id?: string;
  value?: string;
  style?: "primary" | "danger";
}

export interface SlackAttachment {
  color?: string;
  pretext?: string;
  title?: string;
  title_link?: string;
  text?: string;
  fields?: SlackAttachmentField[];
  footer?: string;
  ts?: number;
}

export interface SlackAttachmentField {
  title: string;
  value: string;
  short?: boolean;
}

export interface TeamsMessage {
  "@type": "MessageCard";
  "@context": string;
  themeColor?: string;
  summary: string;
  sections: TeamsSection[];
  potentialAction?: TeamsAction[];
}

export interface TeamsSection {
  activityTitle?: string;
  activitySubtitle?: string;
  activityImage?: string;
  facts?: TeamsFact[];
  markdown?: boolean;
  text?: string;
}

export interface TeamsFact {
  name: string;
  value: string;
}

export interface TeamsAction {
  "@type": string;
  name: string;
  targets?: TeamsActionTarget[];
}

export interface TeamsActionTarget {
  os: string;
  uri: string;
}

// ============================================
// CRM TYPES
// ============================================

export interface CRMSyncStatus {
  id: string;
  lead_profile_id: string;
  crm_type: "salesforce" | "hubspot";
  crm_record_id?: string;
  crm_record_type: "lead" | "contact" | "account";
  last_sync_at?: string;
  sync_status: "synced" | "pending" | "error";
  sync_errors?: CRMSyncError[];
  field_mappings?: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export interface CRMSyncError {
  field?: string;
  error_code: string;
  error_message: string;
  timestamp: string;
}

export interface CRMFieldMapping {
  local_field: string;
  crm_field: string;
  direction: "push" | "pull" | "bidirectional";
  transform?: string;
}

export interface CRMLead {
  id?: string;
  email: string;
  first_name?: string;
  last_name?: string;
  company?: string;
  title?: string;
  phone?: string;
  website?: string;
  industry?: string;
  lead_source?: string;
  status?: string;
  score?: number;
  custom_fields?: Record<string, unknown>;
}

export interface CRMContact {
  id?: string;
  email: string;
  first_name?: string;
  last_name?: string;
  account_id?: string;
  title?: string;
  phone?: string;
  department?: string;
  custom_fields?: Record<string, unknown>;
}

export interface CRMAccount {
  id?: string;
  name: string;
  domain?: string;
  industry?: string;
  employee_count?: number;
  annual_revenue?: number;
  billing_address?: CRMAddress;
  custom_fields?: Record<string, unknown>;
}

export interface CRMAddress {
  street?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
}

export interface CRMActivity {
  id?: string;
  type: "email" | "call" | "meeting" | "task" | "note";
  subject: string;
  description?: string;
  related_to_id: string;
  related_to_type: "lead" | "contact" | "account";
  due_date?: string;
  completed_date?: string;
  status?: string;
}

// ============================================
// CALENDAR TYPES (Cal.com)
// ============================================

export interface CalendarConfig {
  api_key?: string;
  event_type_id?: string;
  event_type_slug?: string;
  default_duration_minutes: number;
  booking_url?: string;
}

export interface CalendarBooking {
  id: string;
  event_type_id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  attendees: CalendarAttendee[];
  location?: string;
  meeting_url?: string;
  status: "confirmed" | "cancelled" | "pending";
  created_at: string;
}

export interface CalendarAttendee {
  email: string;
  name?: string;
  timezone?: string;
}

export interface CalendarAvailability {
  date: string;
  slots: CalendarSlot[];
}

export interface CalendarSlot {
  start_time: string;
  end_time: string;
  available: boolean;
}

export interface BookingRequest {
  event_type_id: string;
  start_time: string;
  attendee_email: string;
  attendee_name?: string;
  attendee_timezone?: string;
  notes?: string;
  lead_profile_id?: string;
}

// ============================================
// WEBHOOK TYPES
// ============================================

export interface Webhook {
  id: string;
  name: string;
  url: string;
  events: WebhookEventType[];
  secret: string;
  is_active: boolean;
  failure_count: number;
  last_triggered?: string;
  created_at: string;
  updated_at: string;
}

export type WebhookEventType =
  | "lead.created"
  | "lead.updated"
  | "lead.scored"
  | "lead.stage_changed"
  | "lead.alert_triggered"
  | "form.submitted"
  | "chat.started"
  | "chat.completed"
  | "booking.created"
  | "booking.cancelled";

export interface WebhookDelivery {
  id: string;
  webhook_id: string;
  event_type: WebhookEventType;
  payload: WebhookPayload;
  response_status?: number;
  response_body?: string;
  delivery_duration_ms?: number;
  delivered_at: string;
  success: boolean;
  retry_count: number;
}

export interface WebhookPayload {
  event: WebhookEventType;
  timestamp: string;
  data: Record<string, unknown>;
}

export interface WebhookSignature {
  signature: string;
  timestamp: string;
}

// ============================================
// API KEY TYPES
// ============================================

export interface APIKey {
  id: string;
  name: string;
  key_prefix: string;
  key_hash: string;
  permissions: APIPermission[];
  rate_limit: number;
  last_used?: string;
  expires_at?: string;
  created_by: string;
  created_at: string;
}

export type APIPermission =
  | "read"
  | "write"
  | "leads.read"
  | "leads.write"
  | "analytics.read"
  | "webhooks.manage";

export interface APIKeyCreateRequest {
  name: string;
  permissions: APIPermission[];
  rate_limit?: number;
  expires_in_days?: number;
}

export interface APIKeyCreateResponse {
  id: string;
  name: string;
  key: string;
  key_prefix: string;
  permissions: APIPermission[];
  rate_limit: number;
  expires_at?: string;
  created_at: string;
}

// ============================================
// ENRICHMENT SERVICE TYPES
// ============================================

export interface ClearbitCompany {
  id: string;
  name: string;
  legalName?: string;
  domain: string;
  domainAliases?: string[];
  site?: ClearbitSite;
  category?: ClearbitCategory;
  tags?: string[];
  description?: string;
  foundedYear?: number;
  location?: string;
  geo?: ClearbitGeo;
  logo?: string;
  facebook?: ClearbitSocial;
  linkedin?: ClearbitSocial;
  twitter?: ClearbitSocial;
  crunchbase?: ClearbitSocial;
  emailProvider?: boolean;
  type?: string;
  ticker?: string;
  identifiers?: ClearbitIdentifiers;
  phone?: string;
  metrics?: ClearbitMetrics;
  tech?: string[];
  techCategories?: string[];
  parent?: ClearbitParent;
  ultimateParent?: ClearbitParent;
}

export interface ClearbitSite {
  phoneNumbers?: string[];
  emailAddresses?: string[];
}

export interface ClearbitCategory {
  sector?: string;
  industryGroup?: string;
  industry?: string;
  subIndustry?: string;
  sicCode?: string;
  naicsCode?: string;
}

export interface ClearbitGeo {
  streetNumber?: string;
  streetName?: string;
  subPremise?: string;
  street?: string;
  city?: string;
  postalCode?: string;
  state?: string;
  stateCode?: string;
  country?: string;
  countryCode?: string;
  lat?: number;
  lng?: number;
}

export interface ClearbitSocial {
  handle?: string;
}

export interface ClearbitIdentifiers {
  usEIN?: string;
}

export interface ClearbitMetrics {
  alexaUsRank?: number;
  alexaGlobalRank?: number;
  employees?: number;
  employeesRange?: string;
  marketCap?: number;
  raised?: number;
  annualRevenue?: number;
  estimatedAnnualRevenue?: string;
  fiscalYearEnd?: number;
}

export interface ClearbitParent {
  domain?: string;
}

export interface ApolloCompany {
  id: string;
  name: string;
  website_url?: string;
  linkedin_url?: string;
  twitter_url?: string;
  facebook_url?: string;
  primary_phone?: ApolloPhone;
  languages?: string[];
  alexa_ranking?: number;
  phone?: string;
  linkedin_uid?: string;
  founded_year?: number;
  publicly_traded_symbol?: string;
  publicly_traded_exchange?: string;
  logo_url?: string;
  crunchbase_url?: string;
  primary_domain?: string;
  sanitized_phone?: string;
  industry?: string;
  keywords?: string[];
  estimated_num_employees?: number;
  snippets_loaded?: boolean;
  industry_tag_id?: string;
  retail_location_count?: number;
  raw_address?: string;
  street_address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  owned_by_organization_id?: string;
  suborganizations?: string[];
  num_suborganizations?: number;
  seo_description?: string;
  short_description?: string;
  annual_revenue_printed?: string;
  annual_revenue?: number;
  total_funding?: number;
  total_funding_printed?: string;
  latest_funding_round_date?: string;
  latest_funding_stage?: string;
  funding_events?: ApolloFundingEvent[];
  technology_names?: string[];
  current_technologies?: ApolloTechnology[];
  account_id?: string;
  account?: ApolloAccount;
}

export interface ApolloPhone {
  number: string;
  source: string;
}

export interface ApolloFundingEvent {
  id: string;
  date: string;
  news_url?: string;
  type: string;
  investors?: string;
  amount?: string;
  currency?: string;
}

export interface ApolloTechnology {
  uid: string;
  name: string;
  category?: string;
}

export interface ApolloAccount {
  id: string;
  domain?: string;
  name?: string;
  team_id?: string;
  organization_id?: string;
  account_stage_id?: string;
  source?: string;
  original_source?: string;
  owner_id?: string;
  created_at?: string;
  phone?: string;
  phone_status?: string;
  test_predictive_score?: string;
  hubspot_id?: string;
  salesforce_id?: string;
  crm_owner_id?: string;
  parent_account_id?: string;
  sanitized_phone?: string;
  account_playbook_statuses?: unknown[];
  existence_level?: string;
  label_ids?: string[];
  typed_custom_fields?: Record<string, unknown>;
  modality?: string;
  persona_counts?: Record<string, number>;
}
