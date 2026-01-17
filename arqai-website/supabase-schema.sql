-- ArqAI Database Schema
-- Run this in your Supabase SQL Editor (https://app.supabase.com -> SQL Editor)

-- ============================================
-- CLEANUP (drop existing tables if any)
-- ============================================
DROP TABLE IF EXISTS public.sessions CASCADE;
DROP TABLE IF EXISTS public.lead_intelligence CASCADE;
DROP TABLE IF EXISTS public.conversations CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE public.users (
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
CREATE INDEX idx_users_session_id ON public.users(session_id);
CREATE INDEX idx_users_email ON public.users(email);

-- ============================================
-- CONVERSATIONS TABLE
-- ============================================
CREATE TABLE public.conversations (
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
CREATE INDEX idx_conversations_session_id ON public.conversations(session_id);
CREATE INDEX idx_conversations_user_id ON public.conversations(user_id);

-- ============================================
-- LEAD INTELLIGENCE TABLE
-- ============================================
CREATE TABLE public.lead_intelligence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE,
    buy_intent_score INTEGER DEFAULT 0,
    intent_category TEXT DEFAULT 'cold',
    urgency TEXT DEFAULT 'low',
    company_size TEXT,
    qualification_status TEXT DEFAULT 'new',
    behavioral_signals JSONB DEFAULT '[]'::jsonb,
    company_research JSONB DEFAULT '{}'::jsonb,
    user_research JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for lead intelligence
CREATE INDEX idx_lead_intelligence_user_id ON public.lead_intelligence(user_id);
CREATE INDEX idx_lead_intelligence_intent_category ON public.lead_intelligence(intent_category);
CREATE INDEX idx_lead_intelligence_updated_at ON public.lead_intelligence(updated_at DESC);

-- ============================================
-- SESSIONS TABLE (for tracking visitors)
-- ============================================
CREATE TABLE public.sessions (
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
CREATE INDEX idx_sessions_session_id ON public.sessions(session_id);

-- ============================================
-- AUTO-UPDATE TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lead_intelligence_updated_at
    BEFORE UPDATE ON public.lead_intelligence
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- DISABLE RLS (for service role access)
-- ============================================
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_intelligence DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions DISABLE ROW LEVEL SECURITY;

-- ============================================
-- GRANT PERMISSIONS
-- ============================================
GRANT ALL ON public.users TO anon, authenticated, service_role;
GRANT ALL ON public.conversations TO anon, authenticated, service_role;
GRANT ALL ON public.lead_intelligence TO anon, authenticated, service_role;
GRANT ALL ON public.sessions TO anon, authenticated, service_role;
