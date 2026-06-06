-- =========================================================
-- ArqAI Labs lead-capture schema: verify & repair
-- =========================================================
-- Ensures every table the public forms write to exists with the columns the
-- API routes expect. Idempotent -- safe to run more than once. Run in the
-- Supabase SQL editor.
--
-- Tables covered here:
--   * newsletter_subscriptions   (footer / blog / popup newsletter signups)
--                                 -- NOTE: this table had NO migration in the
--                                 -- repo, so newsletter signups were being
--                                 -- silently dropped if the table was never
--                                 -- created manually. This creates it.
--   * resource_leads             (whitepaper / webinar gated downloads)
--
-- Tables covered by OTHER migrations -- run these too if not already applied:
--   * contact_submissions, partner_enquiries  -> supabase-contact-partner-intake-migration.sql
--   * job_applications, job_postings           -> supabase-careers-applications-repair.sql
--   * lead_profiles, touchpoint_events, ...    -> supabase-lead-intelligence-v2.sql

begin;

-- ---------------------------------------------------------
-- newsletter_subscriptions  (api/newsletter)
-- ---------------------------------------------------------
create table if not exists public.newsletter_subscriptions (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  source text default 'footer',
  segment text default 'general',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Tolerate an older partial table missing newer columns.
alter table public.newsletter_subscriptions
  add column if not exists source text default 'footer',
  add column if not exists segment text default 'general',
  add column if not exists status text not null default 'active',
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

create index if not exists newsletter_subscriptions_created_idx
  on public.newsletter_subscriptions(created_at desc);

alter table public.newsletter_subscriptions enable row level security;
-- The API uses the service role (which bypasses RLS); no anon policies needed.

-- ---------------------------------------------------------
-- resource_leads  (api/resources/download)
-- Required columns the route reads/writes; the download GET breaks (404)
-- if the POST insert can't store the token, so keep this in sync.
-- ---------------------------------------------------------
create table if not exists public.resource_leads (
  id uuid primary key default gen_random_uuid(),
  resource_type text not null,
  resource_id uuid not null,
  name text,
  email text,
  company text,
  job_title text,
  download_token text unique,
  token_used boolean default false,
  token_expires_at timestamptz,
  downloaded_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.resource_leads
  add column if not exists name text,
  add column if not exists company text,
  add column if not exists job_title text,
  add column if not exists download_token text,
  add column if not exists token_used boolean default false,
  add column if not exists token_expires_at timestamptz,
  add column if not exists downloaded_at timestamptz;

create index if not exists idx_resource_leads_token
  on public.resource_leads(download_token);

alter table public.resource_leads enable row level security;

commit;

notify pgrst, 'reload schema';

-- ---------------------------------------------------------
-- DIAGNOSTIC: which lead-capture tables exist + row counts
-- (run separately to audit)
-- ---------------------------------------------------------
-- select table_name,
--        (select count(*) from public.contact_submissions)      as contacts,
--        (select count(*) from public.partner_enquiries)        as partners,
--        (select count(*) from public.newsletter_subscriptions) as newsletter,
--        (select count(*) from public.resource_leads)           as resource_leads,
--        (select count(*) from public.job_applications)         as job_applications
-- from (values ('counts')) as t(table_name);
