-- ============================================
-- ArqAI Lead Emails Migration
-- ============================================
-- Adds the lead_emails table backing the AI-assisted email composer in the
-- Lead Command Center: every draft and sent email per lead, with the
-- instruction used to generate it and the Resend message id.
--
-- Prerequisite: supabase-lead-command-center-migration.sql (lead_profiles,
-- lead_dossiers must exist). Safe to re-run (idempotent).
-- ============================================

CREATE TABLE IF NOT EXISTS public.lead_emails (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_profile_id UUID REFERENCES public.lead_profiles(id) ON DELETE CASCADE,
    dossier_id UUID REFERENCES public.lead_dossiers(id) ON DELETE SET NULL,
    direction TEXT NOT NULL DEFAULT 'outbound' CHECK (direction IN ('outbound')),
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'failed')),
    subject TEXT NOT NULL DEFAULT '',
    body TEXT NOT NULL DEFAULT '',
    generated_by TEXT DEFAULT 'human' CHECK (generated_by IN ('ai', 'human', 'ai_edited')),
    instruction TEXT,
    resend_id TEXT,
    sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lead_emails_profile
    ON public.lead_emails(lead_profile_id, created_at DESC);

-- Server-only access, same posture as the other command center tables:
-- RLS on with no policies blocks anon/authenticated; service_role bypasses.
ALTER TABLE public.lead_emails ENABLE ROW LEVEL SECURITY;
GRANT ALL ON public.lead_emails TO service_role;
