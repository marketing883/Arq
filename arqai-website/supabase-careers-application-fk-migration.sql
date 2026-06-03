-- =========================================================
-- ArqAI Labs Careers: restore job_applications -> job_postings FK
-- =========================================================
-- Symptom this fixes:
--   Candidates apply successfully (rows land in public.job_applications and
--   the notification email is sent), but the admin dashboard at
--   /admin/jobs/applications shows nothing.
--
-- Root cause on older installs:
--   The job_applications table was created before the foreign key to
--   job_postings existed, so PostgREST cannot resolve the embedded
--   relationship `job_postings:job_id (...)` used by the dashboard query,
--   and the request errors out.
--
-- The application code now degrades gracefully without this FK, but running
-- this migration restores the efficient single-query path and keeps the
-- schema correct. It is idempotent -- safe to run more than once.
--
-- Run in the Supabase SQL editor, then retry the dashboard.

begin;

-- 1. Make sure the join column exists and is the right type.
alter table public.job_applications
  add column if not exists job_id uuid;

-- 2. Clean up orphaned rows that would block the FK (job deleted, etc.).
--    These can't be attributed to a posting; leaving job_id null keeps them
--    visible in the dashboard via the code-side fallback.
update public.job_applications a
set job_id = null
where a.job_id is not null
  and not exists (
    select 1 from public.job_postings p where p.id = a.job_id
  );

-- 3. Add the foreign key only if it isn't already present.
do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.job_applications'::regclass
      and contype = 'f'
      and conname = 'job_applications_job_id_fkey'
  ) then
    alter table public.job_applications
      add constraint job_applications_job_id_fkey
      foreign key (job_id)
      references public.job_postings(id)
      on delete cascade;
  end if;
end$$;

-- 4. Keep the supporting index for the join/filter.
create index if not exists job_applications_job_id_idx
  on public.job_applications(job_id);

commit;

-- 5. Ask PostgREST to reload its schema cache so the relationship is picked
--    up immediately (otherwise it refreshes on its own shortly).
notify pgrst, 'reload schema';
