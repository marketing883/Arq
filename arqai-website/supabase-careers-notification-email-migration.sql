-- =========================================================
-- ArqAI Labs Careers: per-job notification email
-- =========================================================
-- Adds an optional notification_email column to job_postings. When set on a
-- posting, new applications for that role notify this address in addition to
-- the default recruiting inbox (rmg.india@aciinfotech.com).
--
-- Idempotent. Run in the Supabase SQL editor.

alter table public.job_postings
  add column if not exists notification_email text;

-- Refresh PostgREST's schema cache so the API sees the new column immediately.
notify pgrst, 'reload schema';
