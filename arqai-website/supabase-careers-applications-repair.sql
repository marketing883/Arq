-- =========================================================
-- ArqAI Labs Careers: complete job_applications repair
-- =========================================================
-- Symptom this fixes:
--   Candidates submit the application form but nothing is saved and nothing
--   appears in /admin/jobs/applications. Root cause on the affected install:
--   the job_applications table was missing screening columns the application
--   API writes (total_experience, skills, achievements, notice_period), so
--   every insert failed before a row could be created.
--
-- This consolidated script guarantees the table has every column the apply
-- API writes, plus the foreign key the admin dashboard joins on, then reloads
-- the PostgREST schema cache. It is idempotent -- safe to run more than once.
--
-- Run in the Supabase SQL editor.

begin;

-- 1. Ensure every candidate column the application API writes actually exists.
alter table public.job_applications
  add column if not exists linkedin_url text,
  add column if not exists total_experience text,
  add column if not exists skills text,
  add column if not exists achievements text,
  add column if not exists compensation_currency text,
  add column if not exists compensation_basis text,
  add column if not exists current_compensation text,
  add column if not exists expected_compensation text,
  add column if not exists compensation_negotiable boolean not null default false,
  add column if not exists notice_period text,
  add column if not exists cover_letter text,
  add column if not exists notes text,
  add column if not exists ip text,
  add column if not exists user_agent text,
  add column if not exists notified_at timestamptz;

-- 2. Ensure the job_id column + foreign key to job_postings exist. The admin
--    dashboard joins job_applications -> job_postings; without this FK the list
--    query errors once real rows are present.
alter table public.job_applications
  add column if not exists job_id uuid;

update public.job_applications a
set job_id = null
where a.job_id is not null
  and not exists (select 1 from public.job_postings p where p.id = a.job_id);

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.job_applications'::regclass
      and contype = 'f'
      and conname = 'job_applications_job_id_fkey'
  ) then
    alter table public.job_applications
      add constraint job_applications_job_id_fkey
      foreign key (job_id) references public.job_postings(id) on delete cascade;
  end if;
end$$;

create index if not exists job_applications_job_id_idx
  on public.job_applications(job_id);

commit;

-- 3. Force PostgREST to refresh its schema cache immediately.
notify pgrst, 'reload schema';
