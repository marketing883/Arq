-- =========================================================
-- ArqAI Labs Careers compensation fields migration
-- =========================================================
-- Run this in Supabase SQL editor when upgrading an existing careers schema
-- from India-specific CTC fields to global compensation fields.

begin;

alter table public.job_applications
  add column if not exists compensation_currency text,
  add column if not exists compensation_basis text,
  add column if not exists current_compensation text,
  add column if not exists expected_compensation text,
  add column if not exists compensation_negotiable boolean not null default false;

comment on column public.job_applications.compensation_currency is
  'Candidate-selected currency or other/discuss for globally applicable compensation capture.';
comment on column public.job_applications.compensation_basis is
  'Pay basis such as annual, monthly, hourly, daily, project, stipend, or other.';
comment on column public.job_applications.current_compensation is
  'Optional current compensation; free text to support any currency, location, or engagement model.';
comment on column public.job_applications.expected_compensation is
  'Expected compensation or range; free text to support any currency, location, or engagement model.';
comment on column public.job_applications.compensation_negotiable is
  'Whether the candidate is open to market-aligned compensation discussion.';

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'job_applications'
      and column_name = 'current_ctc'
  ) then
    update public.job_applications
    set current_compensation = coalesce(current_compensation, current_ctc)
    where current_compensation is null
      and current_ctc is not null;
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'job_applications'
      and column_name = 'expected_ctc'
  ) then
    update public.job_applications
    set expected_compensation = coalesce(expected_compensation, expected_ctc)
    where expected_compensation is null
      and expected_ctc is not null;
  end if;
end $$;

commit;

notify pgrst, 'reload schema';
