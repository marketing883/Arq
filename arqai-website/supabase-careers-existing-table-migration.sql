-- =========================================================
-- ArqAI Labs Careers existing-table migration
-- =========================================================
-- Use this when an older Supabase project already has public.job_postings
-- and admin job creation reports a missing column in the PostgREST schema
-- cache, for example:
--   Could not find the 'experience_level' column of 'job_postings'
--
-- Run in Supabase SQL editor, then retry the admin job form.

begin;

alter table public.job_postings
  add column if not exists short_description text,
  add column if not exists description text,
  add column if not exists requirements text,
  add column if not exists responsibilities text,
  add column if not exists salary_range text,
  add column if not exists experience_level text,
  add column if not exists remote boolean not null default false,
  add column if not exists status text not null default 'draft',
  add column if not exists published_at timestamptz,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

-- Older installs may already have a check constraint named
-- job_postings_status_check with a different vocabulary, such as
-- published/unpublished. Replace it with the status values used by the admin UI.
alter table public.job_postings
  drop constraint if exists job_postings_status_check;

update public.job_postings
set status = case
  when status is null then 'draft'
  when lower(status) in ('active', 'published', 'open', 'live') then 'active'
  when lower(status) in ('closed', 'archived', 'filled') then 'closed'
  else 'draft'
end;

alter table public.job_postings
  alter column status set default 'draft',
  alter column status set not null,
  add constraint job_postings_status_check
  check (status in ('draft', 'active', 'closed'));

update public.job_postings
set published_at = coalesce(published_at, created_at, now())
where status = 'active'
  and published_at is null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.job_postings'::regclass
      and conname = 'job_postings_employment_type_check'
  ) then
    alter table public.job_postings
      add constraint job_postings_employment_type_check
      check (
        employment_type in (
          'full-time',
          'part-time',
          'contract',
          'internship',
          'temporary'
        )
      )
      not valid;
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.job_postings'::regclass
      and conname = 'job_postings_experience_level_check'
  ) then
    alter table public.job_postings
      add constraint job_postings_experience_level_check
      check (
        experience_level in ('entry', 'mid', 'senior', 'lead', 'principal')
        or experience_level is null
      )
      not valid;
  end if;

end $$;

create index if not exists job_postings_status_idx on public.job_postings(status);
create index if not exists job_postings_department_idx on public.job_postings(department);
create index if not exists job_postings_location_idx on public.job_postings(location);
create index if not exists job_postings_published_at_idx on public.job_postings(published_at desc);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists job_postings_set_updated_at on public.job_postings;
create trigger job_postings_set_updated_at
before update on public.job_postings
for each row execute function public.set_updated_at();

commit;

notify pgrst, 'reload schema';
