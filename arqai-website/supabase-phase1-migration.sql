-- ============================================
-- ArqAI Phase 1 Database Migration
-- Next-Gen Lead Intelligence Platform
-- ============================================
--
-- This migration adds tables for:
-- 1. Analytics system (page views, sessions, funnels, goals)
-- 2. Domain research agent jobs
-- 3. Predictive scoring
-- 4. Notification channels
-- 5. Integration configurations
--
-- IMPORTANT: Run this migration AFTER the existing schema.
-- All tables use proper foreign keys and indexes.
-- ============================================

-- ============================================
-- ANALYTICS TABLES
-- ============================================

-- Page views (main analytics event table)
CREATE TABLE IF NOT EXISTS page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  lead_profile_id UUID REFERENCES lead_profiles(id) ON DELETE SET NULL,
  page_path TEXT NOT NULL,
  page_title TEXT,
  referrer TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,
  device_type TEXT DEFAULT 'unknown' CHECK (device_type IN ('desktop', 'mobile', 'tablet', 'unknown')),
  browser TEXT,
  os TEXT,
  country TEXT,
  region TEXT,
  city TEXT,
  time_on_page_seconds INTEGER,
  scroll_depth_percent INTEGER CHECK (scroll_depth_percent >= 0 AND scroll_depth_percent <= 100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for page_views (optimized for common queries)
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_session_id ON page_views(session_id);
CREATE INDEX IF NOT EXISTS idx_page_views_page_path ON page_views(page_path);
CREATE INDEX IF NOT EXISTS idx_page_views_lead_profile ON page_views(lead_profile_id) WHERE lead_profile_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_page_views_utm_source ON page_views(utm_source) WHERE utm_source IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_page_views_country ON page_views(country) WHERE country IS NOT NULL;

-- Active sessions (for real-time tracking)
CREATE TABLE IF NOT EXISTS active_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT UNIQUE NOT NULL,
  lead_profile_id UUID REFERENCES lead_profiles(id) ON DELETE SET NULL,
  visitor_identification_id UUID,
  current_page TEXT,
  pages_viewed JSONB DEFAULT '[]'::jsonb,
  time_on_site_seconds INTEGER DEFAULT 0,
  last_activity TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_active_sessions_active ON active_sessions(is_active, last_activity DESC) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_active_sessions_session_id ON active_sessions(session_id);

-- Daily analytics aggregations (for fast dashboard queries)
CREATE TABLE IF NOT EXISTS analytics_daily (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL UNIQUE,
  total_page_views INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  unique_sessions INTEGER DEFAULT 0,
  avg_session_duration_seconds DECIMAL,
  avg_pages_per_session DECIMAL,
  bounce_rate DECIMAL CHECK (bounce_rate >= 0 AND bounce_rate <= 1),
  new_leads INTEGER DEFAULT 0,
  chat_conversations INTEGER DEFAULT 0,
  form_submissions INTEGER DEFAULT 0,
  resource_downloads INTEGER DEFAULT 0,
  top_pages JSONB DEFAULT '[]'::jsonb,
  traffic_sources JSONB DEFAULT '[]'::jsonb,
  geo_breakdown JSONB DEFAULT '[]'::jsonb,
  device_breakdown JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analytics_daily_date ON analytics_daily(date DESC);

-- Conversion funnels
CREATE TABLE IF NOT EXISTS funnels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  steps JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS funnel_conversions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  funnel_id UUID NOT NULL REFERENCES funnels(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  lead_profile_id UUID REFERENCES lead_profiles(id) ON DELETE SET NULL,
  steps_completed INTEGER[] DEFAULT ARRAY[]::INTEGER[],
  completed_all BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_funnel_conversions_funnel ON funnel_conversions(funnel_id);
CREATE INDEX IF NOT EXISTS idx_funnel_conversions_session ON funnel_conversions(session_id);

-- Goals
CREATE TABLE IF NOT EXISTS goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  goal_type TEXT NOT NULL CHECK (goal_type IN ('page_view', 'event', 'duration', 'pages_per_session', 'form_submit', 'resource_download')),
  condition JSONB NOT NULL,
  value DECIMAL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS goal_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id UUID NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  lead_profile_id UUID REFERENCES lead_profiles(id) ON DELETE SET NULL,
  completion_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_goal_completions_goal ON goal_completions(goal_id);
CREATE INDEX IF NOT EXISTS idx_goal_completions_created ON goal_completions(created_at DESC);

-- ============================================
-- DOMAIN RESEARCH AGENT TABLES
-- ============================================

-- Research jobs
CREATE TABLE IF NOT EXISTS research_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed', 'cancelled')),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('high', 'normal', 'low')),
  requested_by TEXT,
  lead_profile_id UUID REFERENCES lead_profiles(id) ON DELETE SET NULL,
  depth TEXT DEFAULT 'standard' CHECK (depth IN ('quick', 'standard', 'deep')),
  sources_checked JSONB DEFAULT '[]'::jsonb,
  raw_findings JSONB DEFAULT '{}'::jsonb,
  synthesized_result JSONB,
  confidence_score DECIMAL CHECK (confidence_score >= 0 AND confidence_score <= 1),
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_research_jobs_status ON research_jobs(status);
CREATE INDEX IF NOT EXISTS idx_research_jobs_domain ON research_jobs(domain);
CREATE INDEX IF NOT EXISTS idx_research_jobs_created ON research_jobs(created_at DESC);

-- Domain intelligence cache (stores research results)
CREATE TABLE IF NOT EXISTS domain_intelligence_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain TEXT NOT NULL UNIQUE,
  research_result JSONB NOT NULL,
  source TEXT DEFAULT 'research_agent' CHECK (source IN ('research_agent', 'clearbit', 'apollo', 'manual')),
  confidence DECIMAL CHECK (confidence >= 0 AND confidence <= 1),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days')
);

CREATE INDEX IF NOT EXISTS idx_domain_intel_cache_domain ON domain_intelligence_cache(domain);
CREATE INDEX IF NOT EXISTS idx_domain_intel_cache_expires ON domain_intelligence_cache(expires_at);

-- ============================================
-- PREDICTIVE SCORING TABLES
-- ============================================

-- Conversion events (for ML training)
CREATE TABLE IF NOT EXISTS conversion_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_profile_id UUID NOT NULL REFERENCES lead_profiles(id) ON DELETE CASCADE,
  conversion_type TEXT NOT NULL CHECK (conversion_type IN ('demo_booked', 'opportunity_created', 'proposal_sent', 'closed_won', 'closed_lost')),
  conversion_value DECIMAL,
  attributed_touchpoints JSONB DEFAULT '[]'::jsonb,
  time_to_conversion_hours INTEGER,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_conversion_events_lead ON conversion_events(lead_profile_id);
CREATE INDEX IF NOT EXISTS idx_conversion_events_type ON conversion_events(conversion_type);
CREATE INDEX IF NOT EXISTS idx_conversion_events_created ON conversion_events(created_at DESC);

-- ML model metadata
CREATE TABLE IF NOT EXISTS ml_model_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_type TEXT NOT NULL CHECK (model_type IN ('conversion_probability', 'lead_scoring', 'churn_prediction')),
  model_version TEXT NOT NULL,
  training_date TIMESTAMPTZ NOT NULL,
  accuracy_metrics JSONB NOT NULL,
  feature_importance JSONB NOT NULL,
  training_config JSONB NOT NULL,
  model_weights JSONB,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(model_type, model_version)
);

CREATE INDEX IF NOT EXISTS idx_ml_model_active ON ml_model_metadata(model_type, is_active) WHERE is_active = true;

-- Prediction history
CREATE TABLE IF NOT EXISTS prediction_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_profile_id UUID NOT NULL REFERENCES lead_profiles(id) ON DELETE CASCADE,
  prediction_type TEXT NOT NULL,
  predicted_value DECIMAL NOT NULL,
  confidence DECIMAL NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
  model_version TEXT NOT NULL,
  feature_vector JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_prediction_history_lead ON prediction_history(lead_profile_id);
CREATE INDEX IF NOT EXISTS idx_prediction_history_created ON prediction_history(created_at DESC);

-- ============================================
-- NOTIFICATION & INTEGRATION TABLES
-- ============================================

-- Notification channels
CREATE TABLE IF NOT EXISTS notification_channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_type TEXT NOT NULL CHECK (channel_type IN ('slack', 'teams', 'email')),
  channel_config JSONB NOT NULL,
  alert_types TEXT[] DEFAULT ARRAY['hot_lead_new', 'engagement_surge'],
  min_priority TEXT DEFAULT 'high' CHECK (min_priority IN ('critical', 'high', 'medium', 'low')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Integration configurations
CREATE TABLE IF NOT EXISTS integration_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  integration_type TEXT NOT NULL UNIQUE CHECK (integration_type IN ('slack', 'teams', 'salesforce', 'hubspot', 'cal_com', 'clearbit', 'apollo', 'zapier')),
  config JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  last_connected TIMESTAMPTZ,
  last_error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CRM sync status
CREATE TABLE IF NOT EXISTS crm_sync_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_profile_id UUID NOT NULL REFERENCES lead_profiles(id) ON DELETE CASCADE,
  crm_type TEXT NOT NULL CHECK (crm_type IN ('salesforce', 'hubspot')),
  crm_record_id TEXT,
  crm_record_type TEXT DEFAULT 'lead' CHECK (crm_record_type IN ('lead', 'contact', 'account')),
  last_sync_at TIMESTAMPTZ,
  sync_status TEXT DEFAULT 'pending' CHECK (sync_status IN ('synced', 'pending', 'error')),
  sync_errors JSONB DEFAULT '[]'::jsonb,
  field_mappings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(lead_profile_id, crm_type)
);

CREATE INDEX IF NOT EXISTS idx_crm_sync_lead ON crm_sync_status(lead_profile_id);
CREATE INDEX IF NOT EXISTS idx_crm_sync_status ON crm_sync_status(sync_status);

-- ============================================
-- WEBHOOK & API TABLES
-- ============================================

-- Webhooks
CREATE TABLE IF NOT EXISTS webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  events TEXT[] NOT NULL,
  secret TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  failure_count INTEGER DEFAULT 0,
  last_triggered TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Webhook deliveries
CREATE TABLE IF NOT EXISTS webhook_deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  webhook_id UUID NOT NULL REFERENCES webhooks(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  response_status INTEGER,
  response_body TEXT,
  delivery_duration_ms INTEGER,
  success BOOLEAN DEFAULT false,
  retry_count INTEGER DEFAULT 0,
  delivered_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_webhook ON webhook_deliveries(webhook_id);
CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_delivered ON webhook_deliveries(delivered_at DESC);

-- API keys
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  key_prefix TEXT NOT NULL,
  key_hash TEXT NOT NULL,
  permissions TEXT[] DEFAULT ARRAY['read'],
  rate_limit INTEGER DEFAULT 1000,
  last_used TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_by TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_api_keys_prefix ON api_keys(key_prefix);
CREATE INDEX IF NOT EXISTS idx_api_keys_expires ON api_keys(expires_at) WHERE expires_at IS NOT NULL;

-- ============================================
-- VISITOR IDENTIFICATION TABLES
-- ============================================

-- Visitor identifications (for reverse IP lookup results)
CREATE TABLE IF NOT EXISTS visitor_identifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  ip_address TEXT,
  identified_company JSONB,
  identification_source TEXT CHECK (identification_source IN ('clearbit', 'research_agent', 'ip_geolocation', 'manual')),
  confidence DECIMAL CHECK (confidence >= 0 AND confidence <= 1),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_visitor_id_session ON visitor_identifications(session_id);
CREATE INDEX IF NOT EXISTS idx_visitor_id_created ON visitor_identifications(created_at DESC);

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to update analytics_daily aggregations
CREATE OR REPLACE FUNCTION update_daily_analytics(target_date DATE)
RETURNS void AS $$
BEGIN
  INSERT INTO analytics_daily (
    date,
    total_page_views,
    unique_visitors,
    unique_sessions,
    created_at
  )
  SELECT
    target_date,
    COUNT(*),
    COUNT(DISTINCT COALESCE(lead_profile_id::text, session_id)),
    COUNT(DISTINCT session_id),
    NOW()
  FROM page_views
  WHERE DATE(created_at) = target_date
  ON CONFLICT (date) DO UPDATE SET
    total_page_views = EXCLUDED.total_page_views,
    unique_visitors = EXCLUDED.unique_visitors,
    unique_sessions = EXCLUDED.unique_sessions;
END;
$$ LANGUAGE plpgsql;

-- Function to clean up expired sessions
CREATE OR REPLACE FUNCTION cleanup_inactive_sessions()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  WITH deleted AS (
    DELETE FROM active_sessions
    WHERE is_active = true
      AND last_activity < NOW() - INTERVAL '30 minutes'
    RETURNING id
  )
  SELECT COUNT(*) INTO deleted_count FROM deleted;

  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Function to mark session as inactive
CREATE OR REPLACE FUNCTION mark_session_inactive(p_session_id TEXT)
RETURNS void AS $$
BEGIN
  UPDATE active_sessions
  SET is_active = false
  WHERE session_id = p_session_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- ROW LEVEL SECURITY (optional, enable as needed)
-- ============================================

-- Enable RLS on sensitive tables
-- ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE integration_configs ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE notification_channels ENABLE ROW LEVEL SECURITY;

-- ============================================
-- GRANTS (adjust for your setup)
-- ============================================

-- Grant permissions to service role
-- GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
-- GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
-- GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO service_role;
