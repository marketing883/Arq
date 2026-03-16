/**
 * Analytics System Types
 *
 * Comprehensive analytics for traffic, engagement, funnels, and goals.
 * All types are fully typed with no 'any' usage.
 */

// ============================================
// PAGE VIEW & SESSION TYPES
// ============================================

export interface PageView {
  id: string;
  session_id: string;
  lead_profile_id?: string;
  page_path: string;
  page_title?: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  device_type: DeviceType;
  browser?: string;
  os?: string;
  country?: string;
  region?: string;
  city?: string;
  time_on_page_seconds?: number;
  scroll_depth_percent?: number;
  created_at: string;
}

export type DeviceType = "desktop" | "mobile" | "tablet" | "unknown";

export interface ActiveSession {
  id: string;
  session_id: string;
  lead_profile_id?: string;
  visitor_identification_id?: string;
  current_page: string;
  pages_viewed: PageViewSummary[];
  time_on_site_seconds: number;
  last_activity: string;
  is_active: boolean;
  created_at: string;
}

export interface PageViewSummary {
  path: string;
  title?: string;
  timestamp: string;
  duration_seconds?: number;
}

// ============================================
// TRAFFIC ANALYTICS TYPES
// ============================================

export interface TrafficSource {
  source: string;
  medium: string;
  campaign?: string;
  visits: number;
  unique_visitors: number;
  bounce_rate: number;
  avg_session_duration: number;
  conversions: number;
}

export interface ReferrerData {
  domain: string;
  path?: string;
  visits: number;
  unique_visitors: number;
}

export interface GeoData {
  country: string;
  region?: string;
  city?: string;
  visitors: number;
  sessions: number;
}

export interface DeviceData {
  device_type: DeviceType;
  browser?: string;
  os?: string;
  visitors: number;
  sessions: number;
}

// ============================================
// ENGAGEMENT ANALYTICS TYPES
// ============================================

export interface EngagementMetrics {
  total_page_views: number;
  unique_visitors: number;
  unique_sessions: number;
  avg_session_duration_seconds: number;
  avg_pages_per_session: number;
  bounce_rate: number;
  return_visitor_rate: number;
}

export interface PageEngagement {
  page_path: string;
  page_title?: string;
  views: number;
  unique_visitors: number;
  avg_time_on_page_seconds: number;
  avg_scroll_depth_percent: number;
  bounce_rate: number;
  exit_rate: number;
}

export interface ScrollDepthData {
  page_path: string;
  depth_25: number;
  depth_50: number;
  depth_75: number;
  depth_100: number;
}

// ============================================
// FUNNEL TYPES
// ============================================

export interface Funnel {
  id: string;
  name: string;
  steps: FunnelStep[];
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface FunnelStep {
  name: string;
  condition_type: FunnelConditionType;
  condition_value: string;
  order: number;
}

export type FunnelConditionType =
  | "page_view"
  | "event"
  | "form_submit"
  | "chat_start"
  | "resource_download"
  | "journey_stage";

export interface FunnelConversion {
  id: string;
  funnel_id: string;
  session_id: string;
  lead_profile_id?: string;
  steps_completed: number[];
  completed_all: boolean;
  completed_at?: string;
  created_at: string;
}

export interface FunnelAnalytics {
  funnel_id: string;
  funnel_name: string;
  total_entered: number;
  steps: FunnelStepAnalytics[];
  overall_conversion_rate: number;
}

export interface FunnelStepAnalytics {
  step_name: string;
  step_order: number;
  entered: number;
  completed: number;
  conversion_rate: number;
  drop_off_rate: number;
  avg_time_to_complete_seconds?: number;
}

// ============================================
// GOAL TYPES
// ============================================

export interface Goal {
  id: string;
  name: string;
  goal_type: GoalType;
  condition: GoalCondition;
  value?: number;
  is_active: boolean;
  created_at: string;
}

export type GoalType =
  | "page_view"
  | "event"
  | "duration"
  | "pages_per_session"
  | "form_submit"
  | "resource_download";

export interface GoalCondition {
  operator: "equals" | "contains" | "greater_than" | "less_than" | "regex";
  value: string;
  page_path?: string;
  event_name?: string;
}

export interface GoalCompletion {
  id: string;
  goal_id: string;
  session_id: string;
  lead_profile_id?: string;
  completion_data: Record<string, unknown>;
  created_at: string;
}

export interface GoalAnalytics {
  goal_id: string;
  goal_name: string;
  total_completions: number;
  unique_completions: number;
  completion_rate: number;
  total_value: number;
  avg_value_per_completion: number;
}

// ============================================
// DAILY AGGREGATION TYPES
// ============================================

export interface AnalyticsDaily {
  id: string;
  date: string;
  total_page_views: number;
  unique_visitors: number;
  unique_sessions: number;
  avg_session_duration_seconds: number;
  avg_pages_per_session: number;
  bounce_rate: number;
  new_leads: number;
  chat_conversations: number;
  form_submissions: number;
  resource_downloads: number;
  top_pages: TopPageData[];
  traffic_sources: TrafficSourceData[];
  geo_breakdown: GeoBreakdownData[];
  device_breakdown: DeviceBreakdownData[];
  created_at: string;
}

export interface TopPageData {
  path: string;
  title?: string;
  views: number;
}

export interface TrafficSourceData {
  source: string;
  medium: string;
  visits: number;
}

export interface GeoBreakdownData {
  country: string;
  visitors: number;
}

export interface DeviceBreakdownData {
  device_type: DeviceType;
  visitors: number;
}

// ============================================
// REAL-TIME ANALYTICS TYPES
// ============================================

export interface RealTimeStats {
  active_visitors: number;
  active_sessions: ActiveSessionSummary[];
  pages_being_viewed: PageViewCount[];
  recent_events: RecentEvent[];
  geo_distribution: GeoData[];
  timestamp: string;
}

export interface ActiveSessionSummary {
  session_id: string;
  lead_profile_id?: string;
  company_name?: string;
  current_page: string;
  time_on_site_seconds: number;
  pages_viewed: number;
  country?: string;
}

export interface PageViewCount {
  page_path: string;
  page_title?: string;
  active_viewers: number;
}

export interface RecentEvent {
  event_type: string;
  event_data: Record<string, unknown>;
  session_id: string;
  lead_profile_id?: string;
  timestamp: string;
}

// ============================================
// CONTENT PERFORMANCE TYPES
// ============================================

export interface ContentPerformance {
  content_type: ContentType;
  content_id: string;
  title: string;
  views: number;
  unique_viewers: number;
  avg_time_on_page_seconds: number;
  avg_scroll_depth_percent: number;
  conversions: number;
  conversion_rate: number;
  downloads?: number;
  registrations?: number;
}

export type ContentType = "blog" | "whitepaper" | "case_study" | "webinar" | "page";

// ============================================
// LEAD ANALYTICS TYPES
// ============================================

export interface LeadAnalytics {
  period_start: string;
  period_end: string;
  total_leads: number;
  new_leads: number;
  leads_by_source: LeadSourceData[];
  leads_by_stage: LeadStageData[];
  leads_by_priority: LeadPriorityData[];
  avg_score: number;
  avg_time_to_conversion_days?: number;
  conversion_rate: number;
}

export interface LeadSourceData {
  source: string;
  count: number;
  avg_score: number;
  conversion_rate: number;
}

export interface LeadStageData {
  stage: string;
  count: number;
  avg_days_in_stage: number;
}

export interface LeadPriorityData {
  priority: string;
  count: number;
  avg_score: number;
}

// ============================================
// CHAT ANALYTICS TYPES
// ============================================

export interface ChatAnalytics {
  period_start: string;
  period_end: string;
  total_conversations: number;
  total_messages: number;
  avg_messages_per_conversation: number;
  avg_conversation_duration_seconds: number;
  sentiment_distribution: SentimentData[];
  top_topics: TopicData[];
  peak_hours: PeakHourData[];
  conversion_rate: number;
}

export interface SentimentData {
  sentiment: "positive" | "neutral" | "negative";
  count: number;
  percentage: number;
}

export interface TopicData {
  topic: string;
  count: number;
  avg_sentiment: number;
}

export interface PeakHourData {
  hour: number;
  conversations: number;
}

// ============================================
// ANALYTICS API TYPES
// ============================================

export type DateRange = "today" | "yesterday" | "7d" | "30d" | "90d" | "custom";

export interface AnalyticsQueryParams {
  range: DateRange;
  start_date?: string;
  end_date?: string;
  page?: number;
  limit?: number;
  filters?: AnalyticsFilters;
}

export interface AnalyticsFilters {
  page_path?: string;
  source?: string;
  medium?: string;
  campaign?: string;
  country?: string;
  device_type?: DeviceType;
}

// ============================================
// TRACKING EVENT TYPES
// ============================================

export interface TrackingEvent {
  event_type: TrackingEventType;
  session_id: string;
  page_path: string;
  page_title?: string;
  event_data?: Record<string, unknown>;
  timestamp?: string;
}

export type TrackingEventType =
  | "page_view"
  | "scroll_depth"
  | "time_on_page"
  | "click"
  | "form_start"
  | "form_submit"
  | "chat_open"
  | "chat_message"
  | "resource_download"
  | "video_play"
  | "video_complete";

export interface TrackingConfig {
  track_page_views: boolean;
  track_scroll_depth: boolean;
  track_time_on_page: boolean;
  track_clicks: boolean;
  track_forms: boolean;
  scroll_depth_thresholds: number[];
  time_on_page_interval_seconds: number;
}

export const DEFAULT_TRACKING_CONFIG: TrackingConfig = {
  track_page_views: true,
  track_scroll_depth: true,
  track_time_on_page: true,
  track_clicks: true,
  track_forms: true,
  scroll_depth_thresholds: [25, 50, 75, 100],
  time_on_page_interval_seconds: 30,
};
