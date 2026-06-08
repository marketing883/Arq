-- =========================================================
-- ArqAI Labs — accelerator naming survey
-- =========================================================
-- One isolated table for the internal sales survey at /survey/naming.
-- Run once in the Supabase SQL editor. Idempotent.

create table if not exists public.naming_survey_responses (
  id uuid primary key default gen_random_uuid(),
  respondent_name text not null,
  respondent_email text,
  q1 text,
  q2 text,
  q3 text,
  q4 text,
  q5 integer,
  q6 text[] not null default '{}',
  q7 text,
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists naming_survey_created_idx
  on public.naming_survey_responses(created_at desc);

-- The application server uses the service role (which bypasses RLS) for
-- inserts and for reading results; no anon policies are needed.
alter table public.naming_survey_responses enable row level security;

notify pgrst, 'reload schema';
