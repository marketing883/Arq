-- =========================================================
-- ArqAI Labs Careers schema
-- Run this in Supabase SQL editor.
-- Storage bucket setup is documented at the bottom (UI steps).
-- =========================================================

-- ---------------------------------------------------------
-- 1. JOB POSTINGS
-- ---------------------------------------------------------
create table if not exists public.job_postings (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  department text not null,
  location text not null,
  employment_type text not null check (
    employment_type in (
      'full-time',
      'part-time',
      'contract',
      'internship',
      'temporary'
    )
  ),
  short_description text,
  description text,            -- rich-text / markdown body
  requirements text,           -- markdown block
  responsibilities text,       -- markdown block
  salary_range text,           -- e.g. "$120k - $160k" (optional, free text)
  experience_level text check (
    experience_level in ('entry', 'mid', 'senior', 'lead', 'principal') or experience_level is null
  ),
  remote boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'active', 'closed')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists job_postings_status_idx on public.job_postings(status);
create index if not exists job_postings_department_idx on public.job_postings(department);
create index if not exists job_postings_location_idx on public.job_postings(location);
create index if not exists job_postings_published_at_idx on public.job_postings(published_at desc);

-- If this table was created by an older schema, `create table if not exists`
-- will not add newer columns or replace legacy check constraints. Run
-- supabase-careers-existing-table-migration.sql to upgrade an existing table,
-- normalize job status values, and reload Supabase/PostgREST's schema cache.

-- updated_at trigger
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

-- ---------------------------------------------------------
-- 2. JOB APPLICATIONS
-- ---------------------------------------------------------
create table if not exists public.job_applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.job_postings(id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text,                          -- required by the application API
  linkedin_url text,
  total_experience text,
  skills text,
  achievements text,
  compensation_currency text,
  compensation_basis text,
  current_compensation text,           -- optional; salary-history rules vary by jurisdiction
  expected_compensation text,
  compensation_negotiable boolean not null default false,
  current_ctc text,                    -- legacy field retained for older records
  expected_ctc text,                   -- legacy field retained for older records
  notice_period text,
  cover_letter text,
  resume_path text not null,           -- storage path within `resumes` bucket
  resume_filename text not null,
  resume_mime_type text not null,
  resume_size_bytes bigint not null,
  status text not null default 'new' check (
    status in ('new', 'reviewing', 'interviewed', 'offered', 'hired', 'rejected', 'withdrawn')
  ),
  notes text,                          -- internal admin notes
  ip text,
  user_agent text,
  notified_at timestamptz,             -- when the rmg notification email was sent
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists job_applications_job_id_idx on public.job_applications(job_id);
create index if not exists job_applications_status_idx on public.job_applications(status);
create index if not exists job_applications_created_at_idx on public.job_applications(created_at desc);
create index if not exists job_applications_email_idx on public.job_applications(email);

drop trigger if exists job_applications_set_updated_at on public.job_applications;
create trigger job_applications_set_updated_at
before update on public.job_applications
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------
-- 3. ROW LEVEL SECURITY
-- ---------------------------------------------------------
alter table public.job_postings enable row level security;
alter table public.job_applications enable row level security;

-- Public can read only ACTIVE job postings
drop policy if exists "Public read active jobs" on public.job_postings;
create policy "Public read active jobs"
on public.job_postings
for select
to anon, authenticated
using (status = 'active');

-- Service role bypasses RLS automatically. The application server uses the
-- service role for admin CRUD and for inserting applications, so no anon
-- write/update/delete policies are needed.

-- Applications: NO anon access. The application server (service role) writes
-- and reads. RLS denies anon by default once enabled.

-- ---------------------------------------------------------
-- 4. STORAGE BUCKET (run in Supabase Storage UI, not SQL)
-- ---------------------------------------------------------
-- 1. Open Supabase Studio -> Storage -> New bucket.
-- 2. Name: resumes
-- 3. Public: NO (keep private; we serve via signed URLs from the server).
-- 4. Allowed MIME types (paste each on a new line):
--      application/pdf
--      application/msword
--      application/vnd.openxmlformats-officedocument.wordprocessingml.document
-- 5. File size limit: 10485760  (10 MB; the API enforces 5 MB on top of this).
-- 6. After creation, no extra storage policies are required: the application
--    server uses the service role for both upload (on apply) and signed-URL
--    generation (in admin), and the bucket stays private to anon.
--
-- If you prefer SQL for the bucket row, you can run:
--   insert into storage.buckets (id, name, public)
--   values ('resumes', 'resumes', false)
--   on conflict (id) do nothing;
-- but the MIME-type and size-limit fields are best set via the UI.

-- ---------------------------------------------------------
-- 5. SEED (optional). One example role, status 'draft' so it's hidden
--    from the public site until you flip it to 'active' in admin.
-- ---------------------------------------------------------
-- insert into public.job_postings (slug, title, department, location,
--   employment_type, short_description, description, requirements,
--   responsibilities, experience_level, remote, status)
-- values (
--   'senior-ai-engineer',
--   'Senior AI Engineer',
--   'Engineering',
--   'Remote, US',
--   'full-time',
--   'Ship production AI for the operations that matter.',
--   'We design, build, deploy, and run AI for high-stakes operational workflows.',
--   '6+ years engineering, hands-on with frontier LLM stack, production-grade software shipping experience.',
--   'Lead the build of bespoke AI agents into customer environments.',
--   'senior',
--   true,
--   'draft'
-- )
-- on conflict (slug) do nothing;
