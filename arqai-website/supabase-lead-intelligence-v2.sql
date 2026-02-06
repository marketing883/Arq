-- ============================================
-- ArqAI Lead Intelligence Engine V2 Schema
-- ============================================
-- This is an ADDITIVE migration that adds new tables and functions
-- WITHOUT modifying or breaking existing tables.
--
-- Existing tables preserved:
--   - users
--   - lead_intelligence
--   - conversations
--   - sessions
--   - contact_submissions
--   - resource_leads
--   - partner_enquiries
--
-- Run this AFTER the existing schema files:
--   1. supabase-schema.sql
--   2. supabase-content-schema.sql
--   3. supabase-partner-enquiries.sql
--   4. THIS FILE (supabase-lead-intelligence-v2.sql)
-- ============================================

-- ============================================
-- CONTACT SUBMISSIONS TABLE (if not exists)
-- This table may have been created manually
-- ============================================
CREATE TABLE IF NOT EXISTS public.contact_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    company TEXT,
    job_title TEXT,
    message TEXT,
    inquiry_type TEXT DEFAULT 'general',
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'closed')),
    -- AI Intel fields
    ai_detected_intent TEXT,
    ai_urgency TEXT,
    ai_company_industry TEXT,
    ai_company_size TEXT,
    ai_contact_seniority TEXT,
    ai_contact_department TEXT,
    ai_decision_maker BOOLEAN,
    ai_summary TEXT,
    ai_intel_json TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_contact_submissions_email ON public.contact_submissions(email);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON public.contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON public.contact_submissions(created_at DESC);

-- ============================================
-- LEAD PROFILES TABLE (V2 - Unified Profiles)
-- ============================================
-- This is the new unified lead profile that aggregates
-- data from all touchpoints with time-decay scoring.
-- It references the existing users table.
-- ============================================
CREATE TABLE IF NOT EXISTS public.lead_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Link to existing user (nullable - profile can exist before user identified)
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,

    -- Canonical identity (deduplicated)
    canonical_email TEXT UNIQUE,
    session_ids TEXT[] DEFAULT '{}',

    -- Aggregated touchpoints (JSONB for flexibility)
    touchpoints JSONB DEFAULT '{
        "chat": [],
        "contact_forms": [],
        "resource_downloads": [],
        "webinar_registrations": [],
        "page_views": [],
        "newsletter_signups": []
    }'::jsonb,

    -- Scored signals with timestamps (for decay calculation)
    scored_signals JSONB DEFAULT '[]'::jsonb,

    -- Company intelligence (enriched)
    company_intel JSONB DEFAULT '{}'::jsonb,

    -- Computed scores
    raw_score NUMERIC(5,2) DEFAULT 0,
    decay_adjusted_score NUMERIC(5,2) DEFAULT 0,
    engagement_velocity NUMERIC(5,2) DEFAULT 0,
    icp_fit_score NUMERIC(5,2) DEFAULT 0,
    composite_score NUMERIC(5,2) DEFAULT 0,

    -- Journey tracking
    journey_stage TEXT DEFAULT 'anonymous'
        CHECK (journey_stage IN ('anonymous', 'identified', 'engaged', 'qualified', 'opportunity')),

    -- Priority and qualification
    priority_tier TEXT DEFAULT 'P4'
        CHECK (priority_tier IN ('P1', 'P2', 'P3', 'P4')),

    -- Predictive insights (rule-based)
    recommended_action TEXT,
    recommended_channel TEXT CHECK (recommended_channel IN ('phone', 'email', 'chat', 'meeting')),
    ideal_outreach_window TEXT,

    -- Engagement tracking
    total_touchpoints INTEGER DEFAULT 0,
    days_since_first_touch INTEGER DEFAULT 0,
    days_since_last_touch INTEGER DEFAULT 0,

    -- Timestamps
    first_touch TIMESTAMPTZ DEFAULT NOW(),
    last_touch TIMESTAMPTZ DEFAULT NOW(),
    score_calculated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for lead_profiles
CREATE INDEX IF NOT EXISTS idx_lead_profiles_user_id ON public.lead_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_lead_profiles_canonical_email ON public.lead_profiles(canonical_email);
CREATE INDEX IF NOT EXISTS idx_lead_profiles_composite_score ON public.lead_profiles(composite_score DESC);
CREATE INDEX IF NOT EXISTS idx_lead_profiles_journey_stage ON public.lead_profiles(journey_stage);
CREATE INDEX IF NOT EXISTS idx_lead_profiles_priority_tier ON public.lead_profiles(priority_tier);
CREATE INDEX IF NOT EXISTS idx_lead_profiles_last_touch ON public.lead_profiles(last_touch DESC);

-- GIN index for JSONB searches
CREATE INDEX IF NOT EXISTS idx_lead_profiles_touchpoints ON public.lead_profiles USING GIN (touchpoints);
CREATE INDEX IF NOT EXISTS idx_lead_profiles_company_intel ON public.lead_profiles USING GIN (company_intel);

-- ============================================
-- JOURNEY TRANSITIONS TABLE
-- ============================================
-- Tracks all stage transitions for analytics
-- ============================================
CREATE TABLE IF NOT EXISTS public.journey_transitions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_profile_id UUID REFERENCES public.lead_profiles(id) ON DELETE CASCADE,

    from_stage TEXT NOT NULL,
    to_stage TEXT NOT NULL,
    trigger_type TEXT NOT NULL,
    trigger_details JSONB DEFAULT '{}'::jsonb,

    -- Score at time of transition
    score_at_transition NUMERIC(5,2),

    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_journey_transitions_lead_profile_id ON public.journey_transitions(lead_profile_id);
CREATE INDEX IF NOT EXISTS idx_journey_transitions_to_stage ON public.journey_transitions(to_stage);
CREATE INDEX IF NOT EXISTS idx_journey_transitions_created_at ON public.journey_transitions(created_at DESC);

-- ============================================
-- LEAD ALERTS TABLE
-- ============================================
-- Stores alerts generated by the intelligence engine
-- ============================================
CREATE TABLE IF NOT EXISTS public.lead_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_profile_id UUID REFERENCES public.lead_profiles(id) ON DELETE CASCADE,

    alert_type TEXT NOT NULL,
    priority TEXT NOT NULL CHECK (priority IN ('critical', 'high', 'medium', 'low')),

    title TEXT NOT NULL,
    message TEXT NOT NULL,
    suggested_action TEXT,

    -- Alert state
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'acknowledged', 'dismissed', 'actioned')),
    acknowledged_at TIMESTAMPTZ,
    acknowledged_by TEXT,

    -- Expiration
    expires_at TIMESTAMPTZ,

    -- Metadata
    trigger_event JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lead_alerts_lead_profile_id ON public.lead_alerts(lead_profile_id);
CREATE INDEX IF NOT EXISTS idx_lead_alerts_status ON public.lead_alerts(status);
CREATE INDEX IF NOT EXISTS idx_lead_alerts_priority ON public.lead_alerts(priority);
CREATE INDEX IF NOT EXISTS idx_lead_alerts_created_at ON public.lead_alerts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_lead_alerts_expires_at ON public.lead_alerts(expires_at);

-- ============================================
-- TOUCHPOINT EVENTS TABLE
-- ============================================
-- Raw event log for all touchpoints (append-only)
-- Used for recalculating scores and analytics
-- ============================================
CREATE TABLE IF NOT EXISTS public.touchpoint_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_profile_id UUID REFERENCES public.lead_profiles(id) ON DELETE CASCADE,

    -- Event classification
    source TEXT NOT NULL CHECK (source IN ('chat', 'contact_form', 'resource_download', 'webinar', 'page_view', 'newsletter')),
    event_type TEXT NOT NULL,

    -- Event data
    event_data JSONB DEFAULT '{}'::jsonb,

    -- Detected signals from this event
    signals JSONB DEFAULT '[]'::jsonb,

    -- Score contribution (before decay)
    raw_score_contribution NUMERIC(5,2) DEFAULT 0,

    -- Context
    page_url TEXT,
    session_id TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_touchpoint_events_lead_profile_id ON public.touchpoint_events(lead_profile_id);
CREATE INDEX IF NOT EXISTS idx_touchpoint_events_source ON public.touchpoint_events(source);
CREATE INDEX IF NOT EXISTS idx_touchpoint_events_created_at ON public.touchpoint_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_touchpoint_events_session_id ON public.touchpoint_events(session_id);

-- ============================================
-- DOMAIN INTELLIGENCE TABLE
-- ============================================
-- Pre-populated domain -> company intelligence mapping
-- ============================================
CREATE TABLE IF NOT EXISTS public.domain_intelligence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    domain TEXT UNIQUE NOT NULL,

    company_name TEXT,
    company_size TEXT CHECK (company_size IN ('startup', 'smb', 'mid-market', 'enterprise')),
    industry TEXT,
    compliance_frameworks TEXT[] DEFAULT '{}',

    -- Source of intelligence
    source TEXT DEFAULT 'manual' CHECK (source IN ('manual', 'clearbit', 'zoominfo', 'inferred')),
    confidence NUMERIC(3,2) DEFAULT 1.0,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_domain_intelligence_domain ON public.domain_intelligence(domain);
CREATE INDEX IF NOT EXISTS idx_domain_intelligence_industry ON public.domain_intelligence(industry);

-- ============================================
-- SIGNAL DEFINITIONS TABLE
-- ============================================
-- Configurable signal types and weights
-- ============================================
CREATE TABLE IF NOT EXISTS public.signal_definitions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    signal_type TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,

    -- Scoring parameters
    base_weight NUMERIC(5,2) NOT NULL,
    decay_half_life_days INTEGER DEFAULT 7,

    -- Detection patterns (regex)
    patterns TEXT[] DEFAULT '{}',

    -- Flags
    is_negative BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,

    description TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to calculate exponential decay factor
CREATE OR REPLACE FUNCTION calculate_decay_factor(
    event_timestamp TIMESTAMPTZ,
    half_life_days INTEGER DEFAULT 7
) RETURNS NUMERIC AS $$
DECLARE
    days_elapsed NUMERIC;
    decay_constant NUMERIC;
BEGIN
    days_elapsed := EXTRACT(EPOCH FROM (NOW() - event_timestamp)) / 86400.0;
    decay_constant := LN(2) / half_life_days;
    RETURN EXP(-decay_constant * days_elapsed);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to calculate decay-adjusted score for a lead profile
CREATE OR REPLACE FUNCTION calculate_lead_decay_score(profile_id UUID)
RETURNS NUMERIC AS $$
DECLARE
    total_score NUMERIC := 0;
    event_record RECORD;
BEGIN
    FOR event_record IN
        SELECT
            te.raw_score_contribution,
            te.created_at,
            te.source,
            COALESCE(sd.decay_half_life_days, 7) as half_life
        FROM touchpoint_events te
        LEFT JOIN signal_definitions sd ON te.event_type = sd.signal_type
        WHERE te.lead_profile_id = profile_id
    LOOP
        total_score := total_score + (
            event_record.raw_score_contribution *
            calculate_decay_factor(event_record.created_at, event_record.half_life)
        );
    END LOOP;

    RETURN LEAST(total_score, 100);
END;
$$ LANGUAGE plpgsql;

-- Function to update lead profile scores (can be called periodically or on events)
CREATE OR REPLACE FUNCTION update_lead_profile_scores(profile_id UUID)
RETURNS void AS $$
DECLARE
    decay_score NUMERIC;
    velocity NUMERIC;
    first_ts TIMESTAMPTZ;
    last_ts TIMESTAMPTZ;
    recent_count INTEGER;
    total_count INTEGER;
BEGIN
    -- Calculate decay-adjusted score
    decay_score := calculate_lead_decay_score(profile_id);

    -- Get touchpoint stats
    SELECT
        MIN(created_at),
        MAX(created_at),
        COUNT(*),
        COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '48 hours')
    INTO first_ts, last_ts, total_count, recent_count
    FROM touchpoint_events
    WHERE lead_profile_id = profile_id;

    -- Calculate velocity bonus
    velocity := CASE
        WHEN recent_count >= 5 THEN 15
        WHEN recent_count >= 3 THEN 8
        ELSE 0
    END;

    -- Update the profile
    UPDATE lead_profiles
    SET
        decay_adjusted_score = decay_score,
        engagement_velocity = velocity,
        composite_score = LEAST(decay_score + velocity, 100),
        total_touchpoints = total_count,
        first_touch = COALESCE(first_ts, first_touch),
        last_touch = COALESCE(last_ts, last_touch),
        days_since_first_touch = EXTRACT(DAY FROM NOW() - COALESCE(first_ts, first_touch)),
        days_since_last_touch = EXTRACT(DAY FROM NOW() - COALESCE(last_ts, last_touch)),
        score_calculated_at = NOW(),
        updated_at = NOW()
    WHERE id = profile_id;
END;
$$ LANGUAGE plpgsql;

-- Function to determine journey stage
CREATE OR REPLACE FUNCTION evaluate_journey_stage(profile_id UUID)
RETURNS TEXT AS $$
DECLARE
    profile RECORD;
    new_stage TEXT;
    current_stage TEXT;
BEGIN
    SELECT * INTO profile FROM lead_profiles WHERE id = profile_id;
    current_stage := profile.journey_stage;
    new_stage := current_stage;

    -- Stage transition logic
    IF current_stage = 'anonymous' THEN
        IF profile.canonical_email IS NOT NULL THEN
            new_stage := 'identified';
        END IF;
    ELSIF current_stage = 'identified' THEN
        IF profile.total_touchpoints >= 3 OR
           EXISTS (SELECT 1 FROM touchpoint_events WHERE lead_profile_id = profile_id AND source = 'resource_download') THEN
            new_stage := 'engaged';
        END IF;
    ELSIF current_stage = 'engaged' THEN
        IF profile.composite_score >= 60 OR
           EXISTS (SELECT 1 FROM touchpoint_events WHERE lead_profile_id = profile_id AND event_type = 'demo_request') OR
           EXISTS (SELECT 1 FROM touchpoint_events WHERE lead_profile_id = profile_id AND source = 'contact_form') THEN
            new_stage := 'qualified';
        END IF;
    ELSIF current_stage = 'qualified' THEN
        -- Opportunity stage requires manual promotion or meeting scheduled
        IF EXISTS (SELECT 1 FROM touchpoint_events WHERE lead_profile_id = profile_id AND event_type = 'meeting_scheduled') THEN
            new_stage := 'opportunity';
        END IF;
    END IF;

    -- Record transition if stage changed
    IF new_stage != current_stage THEN
        INSERT INTO journey_transitions (lead_profile_id, from_stage, to_stage, trigger_type, score_at_transition)
        VALUES (profile_id, current_stage, new_stage, 'auto_evaluation', profile.composite_score);

        UPDATE lead_profiles SET journey_stage = new_stage, updated_at = NOW() WHERE id = profile_id;
    END IF;

    RETURN new_stage;
END;
$$ LANGUAGE plpgsql;

-- Function to determine priority tier
CREATE OR REPLACE FUNCTION calculate_priority_tier(
    composite_score NUMERIC,
    company_size TEXT,
    journey_stage TEXT
) RETURNS TEXT AS $$
BEGIN
    -- P1: Immediate action required
    IF composite_score >= 70 OR journey_stage = 'qualified' THEN
        RETURN 'P1';
    END IF;

    -- Enterprise leads with decent score = P1
    IF company_size = 'enterprise' AND composite_score >= 50 THEN
        RETURN 'P1';
    END IF;

    -- P2: Follow up within 24 hours
    IF composite_score >= 50 OR journey_stage = 'engaged' THEN
        RETURN 'P2';
    END IF;

    IF company_size = 'mid-market' AND composite_score >= 30 THEN
        RETURN 'P2';
    END IF;

    -- P3: Standard follow up
    IF composite_score >= 30 THEN
        RETURN 'P3';
    END IF;

    -- P4: Nurture
    RETURN 'P4';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================
-- TRIGGERS
-- ============================================

-- Auto-update timestamps
CREATE TRIGGER update_lead_profiles_updated_at
    BEFORE UPDATE ON public.lead_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contact_submissions_updated_at
    BEFORE UPDATE ON public.contact_submissions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_domain_intelligence_updated_at
    BEFORE UPDATE ON public.domain_intelligence
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_signal_definitions_updated_at
    BEFORE UPDATE ON public.signal_definitions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (Disabled for service role)
-- ============================================
ALTER TABLE public.lead_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.journey_transitions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_alerts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.touchpoint_events DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.domain_intelligence DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.signal_definitions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions DISABLE ROW LEVEL SECURITY;

-- ============================================
-- PERMISSIONS
-- ============================================
GRANT ALL ON public.lead_profiles TO anon, authenticated, service_role;
GRANT ALL ON public.journey_transitions TO anon, authenticated, service_role;
GRANT ALL ON public.lead_alerts TO anon, authenticated, service_role;
GRANT ALL ON public.touchpoint_events TO anon, authenticated, service_role;
GRANT ALL ON public.domain_intelligence TO anon, authenticated, service_role;
GRANT ALL ON public.signal_definitions TO anon, authenticated, service_role;
GRANT ALL ON public.contact_submissions TO anon, authenticated, service_role;

-- ============================================
-- SEED DATA: Signal Definitions
-- ============================================
-- These are the configurable signal types with weights and decay rates

INSERT INTO public.signal_definitions (signal_type, category, base_weight, decay_half_life_days, patterns, is_negative, description)
VALUES
    -- Purchase Intent Signals (High Weight)
    ('demo_request', 'purchase_intent', 45, 7,
     ARRAY['demo', 'trial', 'poc', 'proof of concept', 'pilot', 'see it in action', 'show me', 'schedule', 'book', 'meeting'],
     false, 'Explicit request for product demonstration'),

    ('pricing_interest', 'purchase_intent', 40, 7,
     ARRAY['cost', 'price', 'pricing', 'budget', 'investment', 'roi', 'tcco', 'quote', 'proposal'],
     false, 'Interest in pricing or cost information'),

    ('solution_page_deep_dive', 'purchase_intent', 35, 7,
     ARRAY[]::TEXT[], -- Detected by behavior, not keywords
     false, 'Visited 3+ solution pages in a session'),

    -- Timeline Urgency Signals (High Weight)
    ('immediate_urgency', 'timeline', 45, 3,
     ARRAY['asap', 'urgent', 'immediately', 'right away', 'today', 'this week'],
     false, 'Immediate timeline need'),

    ('timeline_mention', 'timeline', 35, 7,
     ARRAY['timeline', 'deadline', 'this quarter', 'q1', 'q2', 'q3', 'q4', 'next month', 'by january', 'by february', 'by march', 'by april', 'by may', 'by june', 'by july', 'by august', 'by september', 'by october', 'by november', 'by december', 'board meeting', 'audit coming'],
     false, 'Mentioned specific timeline or deadline'),

    -- Decision Authority Signals (Medium-High Weight)
    ('decision_maker', 'authority', 35, 14,
     ARRAY['i decide', 'my team', 'we''re evaluating', 'i''m responsible', 'i own', 'my budget'],
     false, 'Indicates decision-making authority'),

    ('c_level_title', 'authority', 40, 14,
     ARRAY['ceo', 'cto', 'cio', 'ciso', 'cfo', 'chief', 'president', 'founder'],
     false, 'C-level job title detected'),

    ('vp_director_title', 'authority', 30, 14,
     ARRAY['vp', 'vice president', 'director', 'head of', 'svp', 'evp'],
     false, 'VP or Director level title detected'),

    -- Compliance Pressure Signals (Medium-High Weight)
    ('compliance_mention', 'compliance', 35, 21,
     ARRAY['hipaa', 'gdpr', 'sox', 'finra', 'naic', 'eu ai act', 'compliance', 'audit', 'regulator', 'fine', 'governance', 'shadow ai'],
     false, 'Mentioned compliance or regulatory requirement'),

    ('compliance_pain', 'compliance', 40, 21,
     ARRAY['failing audit', 'compliance gap', 'regulatory pressure', 'compliance risk', 'audit finding'],
     false, 'Expressed compliance pain point'),

    -- Technical Fit Signals (Medium Weight)
    ('integration_question', 'technical', 25, 14,
     ARRAY['integrate', 'api', 'connect', 'work with', 'compatible', 'snowflake', 'azure', 'aws', 'slack', 'erp', 'crm', 'salesforce'],
     false, 'Asked about integrations'),

    ('feature_interest', 'technical', 20, 14,
     ARRAY['feature', 'capability', 'can you', 'does it', 'support for', 'how does'],
     false, 'Asked about specific features'),

    -- Competitive Evaluation Signals (Medium Weight)
    ('competitor_mention', 'competitive', 30, 7,
     ARRAY['competitor', 'alternative', 'compare', 'vs', 'versus', 'switch from', 'currently using', 'looking at other'],
     false, 'Mentioned competitor or comparison'),

    -- Pain Severity Signals (Medium Weight)
    ('pain_point', 'pain', 25, 14,
     ARRAY['challenge', 'problem', 'issue', 'struggle', 'difficult', 'pain point', 'frustrated', 'manual process', 'can''t scale'],
     false, 'Described pain point or challenge'),

    -- Arq-Specific Technology Interest
    ('tao_interest', 'product', 30, 14,
     ARRAY['trust-aware', 'agent orchestration', 'cryptographic identity', 'capability token', 'audit trail', 'non-repudiable'],
     false, 'Interest in TAO technology'),

    ('capc_interest', 'product', 30, 14,
     ARRAY['compliance-aware', 'prompt compiler', 'compliance rules', 'baked-in compliance'],
     false, 'Interest in CAPC technology'),

    ('odarag_interest', 'product', 30, 14,
     ARRAY['observability', 'adaptive rag', 'quality scoring', 'confidence measurement', 'hallucination'],
     false, 'Interest in ODA-RAG technology'),

    -- Solution-Specific Interest
    ('arqrelease_interest', 'product', 25, 14,
     ARRAY['devsecops', 'release faster', '40% faster', 'ci/cd', 'arqrelease'],
     false, 'Interest in ArqRelease solution'),

    ('arqoptimize_interest', 'product', 25, 14,
     ARRAY['finsecops', 'cost reduction', '25-40%', 'cloud cost', 'arqoptimize'],
     false, 'Interest in ArqOptimize solution'),

    ('arqintel_interest', 'product', 25, 14,
     ARRAY['due diligence', 'investment screening', '70% faster', 'arqintel'],
     false, 'Interest in ArqIntel solution'),

    -- Engagement Signals (Lower Weight)
    ('return_visit', 'engagement', 15, 7,
     ARRAY[]::TEXT[],
     false, 'Returned to site within 7 days'),

    ('whitepaper_download', 'engagement', 20, 21,
     ARRAY[]::TEXT[],
     false, 'Downloaded a whitepaper'),

    ('webinar_registration', 'engagement', 20, 14,
     ARRAY[]::TEXT[],
     false, 'Registered for a webinar'),

    ('newsletter_signup', 'engagement', 10, 30,
     ARRAY[]::TEXT[],
     false, 'Signed up for newsletter'),

    -- Disqualifying Signals (Negative Weight)
    ('student_research', 'disqualifying', -20, 30,
     ARRAY['student', 'research project', 'university', 'thesis', 'academic'],
     true, 'Appears to be student or academic research'),

    ('no_budget', 'disqualifying', -25, 14,
     ARRAY['no budget', 'not looking to buy', 'just curious', 'free only'],
     true, 'Indicated no budget or intent'),

    ('unsubscribe', 'disqualifying', -15, 30,
     ARRAY[]::TEXT[],
     true, 'Unsubscribed from communications')

ON CONFLICT (signal_type) DO NOTHING;

-- ============================================
-- SEED DATA: Domain Intelligence
-- ============================================
-- Pre-populated enterprise domains for instant enrichment

INSERT INTO public.domain_intelligence (domain, company_name, company_size, industry, compliance_frameworks, source, confidence)
VALUES
    -- Major Financial Services
    ('jpmorgan.com', 'JPMorgan Chase', 'enterprise', 'Financial Services', ARRAY['SOX', 'FINRA', 'GDPR', 'CCPA'], 'manual', 1.0),
    ('jpmorganchase.com', 'JPMorgan Chase', 'enterprise', 'Financial Services', ARRAY['SOX', 'FINRA', 'GDPR', 'CCPA'], 'manual', 1.0),
    ('bankofamerica.com', 'Bank of America', 'enterprise', 'Financial Services', ARRAY['SOX', 'FINRA', 'GDPR'], 'manual', 1.0),
    ('wellsfargo.com', 'Wells Fargo', 'enterprise', 'Financial Services', ARRAY['SOX', 'FINRA', 'GDPR'], 'manual', 1.0),
    ('citi.com', 'Citigroup', 'enterprise', 'Financial Services', ARRAY['SOX', 'FINRA', 'GDPR'], 'manual', 1.0),
    ('goldmansachs.com', 'Goldman Sachs', 'enterprise', 'Financial Services', ARRAY['SOX', 'FINRA', 'GDPR'], 'manual', 1.0),
    ('morganstanley.com', 'Morgan Stanley', 'enterprise', 'Financial Services', ARRAY['SOX', 'FINRA', 'GDPR'], 'manual', 1.0),
    ('blackrock.com', 'BlackRock', 'enterprise', 'Financial Services', ARRAY['SOX', 'FINRA'], 'manual', 1.0),
    ('fidelity.com', 'Fidelity Investments', 'enterprise', 'Financial Services', ARRAY['SOX', 'FINRA'], 'manual', 1.0),
    ('schwab.com', 'Charles Schwab', 'enterprise', 'Financial Services', ARRAY['SOX', 'FINRA'], 'manual', 1.0),

    -- Major Healthcare
    ('unitedhealth.com', 'UnitedHealth Group', 'enterprise', 'Healthcare', ARRAY['HIPAA', 'SOX'], 'manual', 1.0),
    ('uhc.com', 'UnitedHealthcare', 'enterprise', 'Healthcare', ARRAY['HIPAA'], 'manual', 1.0),
    ('anthem.com', 'Anthem', 'enterprise', 'Healthcare', ARRAY['HIPAA', 'SOX'], 'manual', 1.0),
    ('cigna.com', 'Cigna', 'enterprise', 'Healthcare', ARRAY['HIPAA', 'SOX'], 'manual', 1.0),
    ('humana.com', 'Humana', 'enterprise', 'Healthcare', ARRAY['HIPAA', 'SOX'], 'manual', 1.0),
    ('cvs.com', 'CVS Health', 'enterprise', 'Healthcare', ARRAY['HIPAA', 'SOX'], 'manual', 1.0),
    ('kaiserpermanente.org', 'Kaiser Permanente', 'enterprise', 'Healthcare', ARRAY['HIPAA'], 'manual', 1.0),
    ('hcahealthcare.com', 'HCA Healthcare', 'enterprise', 'Healthcare', ARRAY['HIPAA', 'SOX'], 'manual', 1.0),

    -- Major Insurance
    ('statefarm.com', 'State Farm', 'enterprise', 'Insurance', ARRAY['NAIC', 'SOX'], 'manual', 1.0),
    ('progressive.com', 'Progressive', 'enterprise', 'Insurance', ARRAY['NAIC', 'SOX'], 'manual', 1.0),
    ('allstate.com', 'Allstate', 'enterprise', 'Insurance', ARRAY['NAIC', 'SOX'], 'manual', 1.0),
    ('geico.com', 'GEICO', 'enterprise', 'Insurance', ARRAY['NAIC'], 'manual', 1.0),
    ('libertymutual.com', 'Liberty Mutual', 'enterprise', 'Insurance', ARRAY['NAIC', 'SOX'], 'manual', 1.0),
    ('travelers.com', 'Travelers', 'enterprise', 'Insurance', ARRAY['NAIC', 'SOX'], 'manual', 1.0),
    ('metlife.com', 'MetLife', 'enterprise', 'Insurance', ARRAY['NAIC', 'SOX', 'GDPR'], 'manual', 1.0),
    ('prudential.com', 'Prudential', 'enterprise', 'Insurance', ARRAY['NAIC', 'SOX', 'GDPR'], 'manual', 1.0),

    -- Major Tech (for context)
    ('microsoft.com', 'Microsoft', 'enterprise', 'Technology', ARRAY['SOX', 'GDPR', 'SOC2'], 'manual', 1.0),
    ('google.com', 'Google', 'enterprise', 'Technology', ARRAY['SOX', 'GDPR', 'SOC2'], 'manual', 1.0),
    ('amazon.com', 'Amazon', 'enterprise', 'Technology', ARRAY['SOX', 'GDPR', 'SOC2'], 'manual', 1.0),
    ('apple.com', 'Apple', 'enterprise', 'Technology', ARRAY['SOX', 'GDPR'], 'manual', 1.0),
    ('salesforce.com', 'Salesforce', 'enterprise', 'Technology', ARRAY['SOX', 'GDPR', 'SOC2', 'HIPAA'], 'manual', 1.0),
    ('ibm.com', 'IBM', 'enterprise', 'Technology', ARRAY['SOX', 'GDPR', 'SOC2'], 'manual', 1.0),
    ('oracle.com', 'Oracle', 'enterprise', 'Technology', ARRAY['SOX', 'GDPR', 'SOC2'], 'manual', 1.0),

    -- Government TLDs (pattern-based, but we seed a few)
    ('treasury.gov', 'US Treasury', 'enterprise', 'Government', ARRAY['FedRAMP', 'FISMA'], 'manual', 1.0),
    ('sec.gov', 'SEC', 'enterprise', 'Government', ARRAY['FedRAMP', 'FISMA'], 'manual', 1.0)

ON CONFLICT (domain) DO NOTHING;

-- ============================================
-- DATA MIGRATION FUNCTION
-- ============================================
-- Call this function to migrate existing lead_intelligence data
-- to the new lead_profiles table

CREATE OR REPLACE FUNCTION migrate_existing_leads()
RETURNS INTEGER AS $$
DECLARE
    migrated_count INTEGER := 0;
    lead_record RECORD;
    new_profile_id UUID;
BEGIN
    -- Iterate through existing lead_intelligence records
    FOR lead_record IN
        SELECT
            li.*,
            u.email,
            u.name,
            u.company,
            u.job_title,
            u.session_id
        FROM lead_intelligence li
        JOIN users u ON li.user_id = u.id
        WHERE u.email IS NOT NULL
        AND NOT EXISTS (
            SELECT 1 FROM lead_profiles lp WHERE lp.canonical_email = LOWER(u.email)
        )
    LOOP
        -- Create new lead profile
        INSERT INTO lead_profiles (
            user_id,
            canonical_email,
            session_ids,
            raw_score,
            composite_score,
            company_intel,
            journey_stage,
            first_touch,
            last_touch
        )
        VALUES (
            lead_record.user_id,
            LOWER(lead_record.email),
            ARRAY[lead_record.session_id],
            lead_record.buy_intent_score,
            lead_record.buy_intent_score,
            jsonb_build_object(
                'size', lead_record.company_size,
                'industry', lead_record.company_research->>'industry',
                'compliance_frameworks', lead_record.company_research->'compliance_requirements'
            ),
            CASE
                WHEN lead_record.qualification_status = 'qualified' THEN 'qualified'
                WHEN lead_record.buy_intent_score >= 40 THEN 'engaged'
                ELSE 'identified'
            END,
            lead_record.created_at,
            lead_record.updated_at
        )
        RETURNING id INTO new_profile_id;

        -- Migrate behavioral signals to touchpoint events
        IF lead_record.behavioral_signals IS NOT NULL AND jsonb_array_length(lead_record.behavioral_signals) > 0 THEN
            INSERT INTO touchpoint_events (
                lead_profile_id,
                source,
                event_type,
                signals,
                raw_score_contribution,
                created_at
            )
            SELECT
                new_profile_id,
                'chat',
                signal->>'type',
                jsonb_build_array(signal),
                COALESCE((signal->>'confidence')::NUMERIC * 10, 10),
                COALESCE((signal->>'timestamp')::TIMESTAMPTZ, lead_record.created_at)
            FROM jsonb_array_elements(lead_record.behavioral_signals) AS signal;
        END IF;

        -- Update scores
        PERFORM update_lead_profile_scores(new_profile_id);

        migrated_count := migrated_count + 1;
    END LOOP;

    RETURN migrated_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- VIEWS FOR BACKWARD COMPATIBILITY
-- ============================================
-- These views allow existing queries to work while
-- providing enhanced data from the new system

CREATE OR REPLACE VIEW public.v_lead_dashboard AS
SELECT
    lp.id as profile_id,
    lp.user_id,
    u.name,
    u.email,
    u.company,
    u.job_title,
    lp.composite_score as score,
    lp.journey_stage,
    lp.priority_tier,
    lp.company_intel->>'industry' as industry,
    lp.company_intel->>'size' as company_size,
    lp.total_touchpoints,
    lp.days_since_last_touch,
    lp.recommended_action,
    lp.recommended_channel,
    lp.first_touch,
    lp.last_touch,
    lp.updated_at,
    -- Include legacy fields for compatibility
    li.intent_category,
    li.urgency,
    li.qualification_status,
    li.behavioral_signals
FROM lead_profiles lp
LEFT JOIN users u ON lp.user_id = u.id
LEFT JOIN lead_intelligence li ON lp.user_id = li.user_id
ORDER BY lp.composite_score DESC, lp.last_touch DESC;

-- Active alerts view
CREATE OR REPLACE VIEW public.v_active_alerts AS
SELECT
    la.*,
    lp.canonical_email,
    u.name as lead_name,
    u.company as lead_company
FROM lead_alerts la
JOIN lead_profiles lp ON la.lead_profile_id = lp.id
LEFT JOIN users u ON lp.user_id = u.id
WHERE la.status = 'active'
AND (la.expires_at IS NULL OR la.expires_at > NOW())
ORDER BY
    CASE la.priority
        WHEN 'critical' THEN 1
        WHEN 'high' THEN 2
        WHEN 'medium' THEN 3
        ELSE 4
    END,
    la.created_at DESC;

-- ============================================
-- COMPLETION MESSAGE
-- ============================================
DO $$
BEGIN
    RAISE NOTICE '============================================';
    RAISE NOTICE 'Lead Intelligence V2 Schema installed successfully!';
    RAISE NOTICE '';
    RAISE NOTICE 'New tables created:';
    RAISE NOTICE '  - lead_profiles (unified lead profiles)';
    RAISE NOTICE '  - journey_transitions (stage tracking)';
    RAISE NOTICE '  - lead_alerts (smart alerts)';
    RAISE NOTICE '  - touchpoint_events (event log)';
    RAISE NOTICE '  - domain_intelligence (company enrichment)';
    RAISE NOTICE '  - signal_definitions (configurable signals)';
    RAISE NOTICE '';
    RAISE NOTICE 'To migrate existing leads, run:';
    RAISE NOTICE '  SELECT migrate_existing_leads();';
    RAISE NOTICE '';
    RAISE NOTICE 'Existing tables are UNCHANGED and fully compatible.';
    RAISE NOTICE '============================================';
END $$;
