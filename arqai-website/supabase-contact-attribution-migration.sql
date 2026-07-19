-- Contact Submission Attribution Migration
-- Adds visitor journey / campaign attribution columns to contact_submissions
-- so every lead can be tied back to the session, source page, and campaign
-- that produced it. Run in the Supabase SQL Editor.
-- Idempotent and safe to re-run.

-- Analytics session id (joins against page_views.session_id)
ALTER TABLE public.contact_submissions ADD COLUMN IF NOT EXISTS session_id TEXT;

-- The page the visitor was on before opening the form (or the page hosting
-- the embedded form), plus a friendly label of its topic (e.g. "ArqFWA").
ALTER TABLE public.contact_submissions ADD COLUMN IF NOT EXISTS source_page TEXT;
ALTER TABLE public.contact_submissions ADD COLUMN IF NOT EXISTS source_context TEXT;

-- First-touch attribution for the session
ALTER TABLE public.contact_submissions ADD COLUMN IF NOT EXISTS landing_page TEXT;
ALTER TABLE public.contact_submissions ADD COLUMN IF NOT EXISTS referrer TEXT;
ALTER TABLE public.contact_submissions ADD COLUMN IF NOT EXISTS utm_source TEXT;
ALTER TABLE public.contact_submissions ADD COLUMN IF NOT EXISTS utm_medium TEXT;
ALTER TABLE public.contact_submissions ADD COLUMN IF NOT EXISTS utm_campaign TEXT;
ALTER TABLE public.contact_submissions ADD COLUMN IF NOT EXISTS utm_term TEXT;
ALTER TABLE public.contact_submissions ADD COLUMN IF NOT EXISTS utm_content TEXT;

-- On-site journey: JSON array of { p: "/path", t: <ms epoch> } steps
ALTER TABLE public.contact_submissions ADD COLUMN IF NOT EXISTS journey TEXT;

-- When the visit (first touch) started
ALTER TABLE public.contact_submissions ADD COLUMN IF NOT EXISTS visit_started_at TIMESTAMPTZ;

-- Join key for analytics queries
CREATE INDEX IF NOT EXISTS idx_contact_submissions_session_id
  ON public.contact_submissions(session_id)
  WHERE session_id IS NOT NULL;
