-- ============================================
-- ArqAI Lead Command Center Migration
-- ============================================
-- Additive migration for the Lead Command Center: the auto-running research
-- agent (agent_runs), its versioned output (lead_dossiers), the pipeline
-- action log (lead_activities), and the pipeline/contact columns the code and
-- UI already expect on lead_profiles. Idempotent and safe to re-run.
--
-- Run in the Supabase SQL Editor AFTER these prerequisite migrations, in order:
--   1. supabase-schema.sql
--   2. supabase-phase1-migration.sql
--   3. supabase-lead-intelligence-v2.sql
--   4. supabase-contact-attribution-migration.sql
--   5. supabase-lead-scores-migration.sql
--   6. THIS FILE (supabase-lead-command-center-migration.sql)
-- ============================================

-- ============================================
-- 1. lead_profiles: contact + pipeline columns
-- The TS LeadProfile type and the dashboard render these, but the base V2
-- schema never created them.
-- ============================================
ALTER TABLE public.lead_profiles
  ADD COLUMN IF NOT EXISTS first_name TEXT,
  ADD COLUMN IF NOT EXISTS last_name TEXT,
  ADD COLUMN IF NOT EXISTS company TEXT,
  ADD COLUMN IF NOT EXISTS job_title TEXT,
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS pipeline_status TEXT DEFAULT 'new'
    CHECK (pipeline_status IN (
      'new', 'researching', 'contacted', 'in_conversation',
      'meeting_booked', 'won', 'lost', 'nurture'
    )),
  ADD COLUMN IF NOT EXISTS next_step TEXT,
  ADD COLUMN IF NOT EXISTS next_step_due_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS last_contacted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS priority_tier_override TEXT;

-- ============================================
-- 2. agent_runs: durable queue + observability for the research agent
-- ============================================
CREATE TABLE IF NOT EXISTS public.agent_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_profile_id UUID REFERENCES public.lead_profiles(id) ON DELETE CASCADE,
    trigger_source TEXT NOT NULL,
    trigger_details JSONB DEFAULT '{}'::jsonb,
    status TEXT DEFAULT 'queued'
      CHECK (status IN ('queued', 'running', 'completed', 'failed', 'skipped')),
    attempts INTEGER DEFAULT 0,
    error_message TEXT,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    duration_ms INTEGER,
    model_used TEXT,
    web_search_used BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_agent_runs_status
  ON public.agent_runs (status, created_at);
CREATE INDEX IF NOT EXISTS idx_agent_runs_profile
  ON public.agent_runs (lead_profile_id, created_at DESC);

-- ============================================
-- 3. lead_dossiers: one row per completed agent run (versioned history)
-- ============================================
CREATE TABLE IF NOT EXISTS public.lead_dossiers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_profile_id UUID REFERENCES public.lead_profiles(id) ON DELETE CASCADE,
    agent_run_id UUID REFERENCES public.agent_runs(id) ON DELETE SET NULL,
    person JSONB DEFAULT '{}'::jsonb,
    company JSONB DEFAULT '{}'::jsonb,
    industry JSONB DEFAULT '{}'::jsonb,
    intent JSONB DEFAULT '{}'::jsonb,
    sales_approach JSONB DEFAULT '{}'::jsonb,
    draft_email JSONB DEFAULT '{}'::jsonb,
    summary TEXT,
    confidence NUMERIC(3, 2) DEFAULT 0.5,
    sources JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lead_dossiers_profile
  ON public.lead_dossiers (lead_profile_id, created_at DESC);

-- ============================================
-- 4. lead_activities: notes, status/stage changes, tasks, sent emails
-- ============================================
CREATE TABLE IF NOT EXISTS public.lead_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_profile_id UUID REFERENCES public.lead_profiles(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL CHECK (activity_type IN (
      'note', 'stage_change', 'status_change', 'contacted',
      'task', 'task_completed', 'email_draft_sent',
      'research_rerun', 'priority_change'
    )),
    body TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    due_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_by TEXT DEFAULT 'admin',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lead_activities_profile
  ON public.lead_activities (lead_profile_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_lead_activities_due
  ON public.lead_activities (due_at) WHERE completed_at IS NULL;

-- ============================================
-- 5. Permissions
-- These tables hold sensitive lead intelligence (dossiers, notes, research
-- runs) and are only ever read or written server-side via the service-role
-- key. Enable RLS with no policies so the public anon and authenticated keys
-- cannot reach them; the service-role key bypasses RLS and keeps working.
-- ============================================
ALTER TABLE public.agent_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_dossiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_activities ENABLE ROW LEVEL SECURITY;

GRANT ALL ON public.agent_runs TO service_role;
GRANT ALL ON public.lead_dossiers TO service_role;
GRANT ALL ON public.lead_activities TO service_role;
