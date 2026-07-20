-- Lead Profile Sub-Score Migration
-- Adds the intent and engagement sub-scores that the V2 lead dashboard and
-- alert emails display alongside the composite score. Until this runs, the
-- code degrades gracefully (the columns simply read as undefined in the UI).
-- Run in the Supabase SQL Editor. Idempotent and safe to re-run.

ALTER TABLE public.lead_profiles ADD COLUMN IF NOT EXISTS intent_score NUMERIC DEFAULT 0;
ALTER TABLE public.lead_profiles ADD COLUMN IF NOT EXISTS engagement_score NUMERIC DEFAULT 0;
