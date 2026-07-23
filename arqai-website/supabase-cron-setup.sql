-- ============================================
-- ArqAI Cron Setup (Supabase pg_cron + pg_net)
-- ============================================
-- For deployments NOT on Vercel (e.g. a VPS running `next start`). This makes
-- Supabase call the app's two cron endpoints on a schedule instead of relying
-- on Vercel Cron. The endpoints hold the Node logic (scoring, research agent),
-- so Supabase just triggers them over HTTP with the CRON_SECRET bearer token.
--
-- BEFORE RUNNING:
--   1. Replace https://YOUR_DOMAIN with your app's public URL (no trailing slash).
--   2. Replace YOUR_CRON_SECRET with the exact value of CRON_SECRET in the app's
--      environment (they must match, or the endpoints return 401).
-- Run in the Supabase SQL Editor.
-- ============================================

-- 1. Extensions (idempotent). pg_cron schedules jobs; pg_net makes HTTP calls.
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- 2. Lead Intelligence Agent sweep: runs queued research, retries failures, and
--    reclaims stuck runs. Every 5 minutes (matches the Vercel schedule).
--    Re-running cron.schedule with the same job name replaces the schedule.
SELECT cron.schedule(
  'lead-agent-runs',
  '*/5 * * * *',
  $$
  SELECT net.http_get(
    url := 'https://YOUR_DOMAIN/api/cron/agent-runs',
    headers := jsonb_build_object('Authorization', 'Bearer YOUR_CRON_SECRET'),
    timeout_milliseconds := 60000
  );
  $$
);

-- 3. Daily score recalculation + alert cleanup. 03:00 UTC (matches Vercel).
SELECT cron.schedule(
  'lead-recalc-scores',
  '0 3 * * *',
  $$
  SELECT net.http_get(
    url := 'https://YOUR_DOMAIN/api/cron/recalculate-scores',
    headers := jsonb_build_object('Authorization', 'Bearer YOUR_CRON_SECRET'),
    timeout_milliseconds := 120000
  );
  $$
);

-- ============================================
-- Notes
-- ============================================
-- * pg_net is fire-and-forget: it queues the request in a background worker and
--   returns immediately. The app still receives and fully processes the request
--   regardless of the timeout_milliseconds value, which only controls how long
--   pg_net waits before recording the response. So the sweep runs even if the
--   endpoint takes longer than the timeout.
--
-- * Inspect scheduled jobs:      SELECT * FROM cron.job;
-- * Inspect recent runs:         SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 20;
-- * Inspect HTTP responses:      SELECT * FROM net._http_response ORDER BY created DESC LIMIT 20;
-- * Remove a job:                SELECT cron.unschedule('lead-agent-runs');
--
-- * cron.schedule evaluates the cron expression in UTC.
--
-- * On the Supabase Hobby/free tier pg_cron and pg_net are available; the every
--   5 minutes cadence is fine. Lower it (e.g. '*/15 * * * *') to reduce load.
--
-- * Prefer keeping the CRON_SECRET out of the SQL? Store it in Supabase Vault
--   and read it in the job body instead of inlining:
--     -- one-time:  SELECT vault.create_secret('YOUR_CRON_SECRET', 'cron_secret');
--     -- in the job body, build the header from the decrypted secret:
--     --   headers := jsonb_build_object(
--     --     'Authorization',
--     --     'Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets
--     --                    WHERE name = 'cron_secret')
--     --   )
