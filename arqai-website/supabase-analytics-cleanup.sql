-- ============================================
-- ArqAI Analytics Cleanup (one-time, run once after deploying the
-- honest-analytics release)
-- ============================================
-- Fixes historical data so the Insights numbers become trustworthy:
--   1. Closes the stale sessions that inflated "active visitors" (the cleanup
--      job now runs every 5 minutes going forward).
--   2. Removes the team's own /admin browsing from page_views, which polluted
--      top pages, visitor counts, durations, and bounce rate.
--   3. Clears analytics_daily rollups computed from the polluted data; they
--      rebuild nightly from the clean page_views.
-- Safe to re-run. Run in the Supabase SQL Editor.
-- ============================================

-- 1. Close sessions with no activity in the last 30 minutes.
UPDATE public.active_sessions
SET is_active = false
WHERE is_active = true
  AND last_activity < NOW() - INTERVAL '30 minutes';

-- 2. Remove internal admin/api traffic from history.
DELETE FROM public.page_views
WHERE page_path LIKE '/admin%'
   OR page_path LIKE '/api%';

-- Also drop active_sessions rows whose current page is internal.
DELETE FROM public.active_sessions
WHERE current_page LIKE '/admin%';

-- 3. Reset daily rollups (rebuilt nightly from clean data).
DELETE FROM public.analytics_daily;

-- Verify:
--   SELECT COUNT(*) FROM public.active_sessions WHERE is_active = true;
--   SELECT COUNT(*) FROM public.page_views WHERE page_path LIKE '/admin%';
