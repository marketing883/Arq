-- ArqAI Database Schema
-- Run this in your Supabase SQL Editor (https://app.supabase.com -> SQL Editor)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id TEXT UNIQUE NOT NULL,
    name TEXT,
    email TEXT,
    company TEXT,
    job_title TEXT,
    phone TEXT,
    location TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for session lookups
CREATE INDEX IF NOT EXISTS idx_users_session_id ON public.users(session_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- ============================================
-- CONVERSATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    session_id TEXT NOT NULL,
    messages JSONB DEFAULT '[]'::jsonb,
    page_context JSONB,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    ended_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for conversation lookups
CREATE INDEX IF NOT EXISTS idx_conversations_session_id ON public.conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON public.conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_is_active ON public.conversations(is_active);

-- ============================================
-- LEAD INTELLIGENCE TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.lead_intelligence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE,

    -- Intent scoring
    buy_intent_score INTEGER DEFAULT 0 CHECK (buy_intent_score >= 0 AND buy_intent_score <= 100),
    intent_category TEXT DEFAULT 'cold' CHECK (intent_category IN ('hot', 'warm', 'cold')),
    urgency TEXT DEFAULT 'low' CHECK (urgency IN ('immediate', 'high', 'medium', 'low')),

    -- Classification
    company_size TEXT CHECK (company_size IN ('startup', 'smb', 'mid-market', 'enterprise', NULL)),
    qualification_status TEXT DEFAULT 'new' CHECK (qualification_status IN ('qualified', 'nurture', 'unqualified', 'new')),

    -- Behavioral signals (array of signal objects)
    behavioral_signals JSONB DEFAULT '[]'::jsonb,

    -- Company research
    company_research JSONB DEFAULT '{}'::jsonb,

    -- User research
    user_research JSONB DEFAULT '{}'::jsonb,

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for lead intelligence
CREATE INDEX IF NOT EXISTS idx_lead_intelligence_user_id ON public.lead_intelligence(user_id);
CREATE INDEX IF NOT EXISTS idx_lead_intelligence_intent_category ON public.lead_intelligence(intent_category);
CREATE INDEX IF NOT EXISTS idx_lead_intelligence_company_size ON public.lead_intelligence(company_size);
CREATE INDEX IF NOT EXISTS idx_lead_intelligence_urgency ON public.lead_intelligence(urgency);
CREATE INDEX IF NOT EXISTS idx_lead_intelligence_qualification_status ON public.lead_intelligence(qualification_status);
CREATE INDEX IF NOT EXISTS idx_lead_intelligence_updated_at ON public.lead_intelligence(updated_at DESC);

-- ============================================
-- SESSIONS TABLE (for tracking visitors)
-- ============================================
CREATE TABLE IF NOT EXISTS public.sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    ip_address TEXT,
    user_agent TEXT,
    detected_country TEXT,
    detected_language TEXT,
    pages_visited JSONB DEFAULT '[]'::jsonb,
    first_visit TIMESTAMPTZ DEFAULT NOW(),
    last_activity TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for sessions
CREATE INDEX IF NOT EXISTS idx_sessions_session_id ON public.sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON public.sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_last_activity ON public.sessions(last_activity DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_intelligence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

-- Policy for service role (full access)
-- Note: Service role bypasses RLS by default, but these policies
-- allow authenticated users with proper roles to access data

-- Users table policies
CREATE POLICY "Service role can manage users" ON public.users
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Conversations table policies
CREATE POLICY "Service role can manage conversations" ON public.conversations
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Lead intelligence table policies
CREATE POLICY "Service role can manage lead_intelligence" ON public.lead_intelligence
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Sessions table policies
CREATE POLICY "Service role can manage sessions" ON public.sessions
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_lead_intelligence_updated_at ON public.lead_intelligence;
CREATE TRIGGER update_lead_intelligence_updated_at
    BEFORE UPDATE ON public.lead_intelligence
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- GRANT PERMISSIONS
-- ============================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- Grant all on tables
GRANT ALL ON public.users TO anon, authenticated, service_role;
GRANT ALL ON public.conversations TO anon, authenticated, service_role;
GRANT ALL ON public.lead_intelligence TO anon, authenticated, service_role;
GRANT ALL ON public.sessions TO anon, authenticated, service_role;

-- Grant sequence usage
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

-- ============================================
-- SAMPLE DATA (optional - comment out in production)
-- ============================================

-- Uncomment to add test data:
/*
INSERT INTO public.users (session_id, name, email, company, job_title)
VALUES
    ('test-session-1', 'John Doe', 'john@example.com', 'Acme Corp', 'CTO'),
    ('test-session-2', 'Jane Smith', 'jane@example.com', 'Tech Startup', 'CEO');

INSERT INTO public.lead_intelligence (user_id, buy_intent_score, intent_category, urgency, company_size, qualification_status)
SELECT id, 85, 'hot', 'high', 'enterprise', 'qualified'
FROM public.users WHERE email = 'john@example.com';

INSERT INTO public.lead_intelligence (user_id, buy_intent_score, intent_category, urgency, company_size, qualification_status)
SELECT id, 45, 'warm', 'medium', 'startup', 'new'
FROM public.users WHERE email = 'jane@example.com';
*/
