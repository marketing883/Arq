-- Contact and Partner Intake Schema Update
-- Run this in Supabase SQL Editor after the existing base/content/partner/lead-v2 schemas.
-- It is idempotent and safe to re-run.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ============================================
-- CONTACT SUBMISSIONS
-- ============================================
CREATE TABLE IF NOT EXISTS public.contact_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    company TEXT,
    job_title TEXT,
    phone TEXT,
    message TEXT,
    inquiry_type TEXT DEFAULT 'general',
    company_size TEXT,
    industry TEXT,
    workflow_area TEXT,
    timeline TEXT,
    budget_range TEXT,
    current_systems TEXT,
    status TEXT DEFAULT 'new',
    ai_detected_intent TEXT,
    ai_urgency TEXT,
    ai_company_industry TEXT,
    ai_company_size TEXT,
    ai_contact_seniority TEXT,
    ai_contact_department TEXT,
    ai_decision_maker BOOLEAN,
    ai_summary TEXT,
    ai_intel_json TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.contact_submissions ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.contact_submissions ADD COLUMN IF NOT EXISTS company_size TEXT;
ALTER TABLE public.contact_submissions ADD COLUMN IF NOT EXISTS industry TEXT;
ALTER TABLE public.contact_submissions ADD COLUMN IF NOT EXISTS workflow_area TEXT;
ALTER TABLE public.contact_submissions ADD COLUMN IF NOT EXISTS timeline TEXT;
ALTER TABLE public.contact_submissions ADD COLUMN IF NOT EXISTS budget_range TEXT;
ALTER TABLE public.contact_submissions ADD COLUMN IF NOT EXISTS current_systems TEXT;
ALTER TABLE public.contact_submissions ADD COLUMN IF NOT EXISTS ai_detected_intent TEXT;
ALTER TABLE public.contact_submissions ADD COLUMN IF NOT EXISTS ai_urgency TEXT;
ALTER TABLE public.contact_submissions ADD COLUMN IF NOT EXISTS ai_company_industry TEXT;
ALTER TABLE public.contact_submissions ADD COLUMN IF NOT EXISTS ai_company_size TEXT;
ALTER TABLE public.contact_submissions ADD COLUMN IF NOT EXISTS ai_contact_seniority TEXT;
ALTER TABLE public.contact_submissions ADD COLUMN IF NOT EXISTS ai_contact_department TEXT;
ALTER TABLE public.contact_submissions ADD COLUMN IF NOT EXISTS ai_decision_maker BOOLEAN;
ALTER TABLE public.contact_submissions ADD COLUMN IF NOT EXISTS ai_summary TEXT;
ALTER TABLE public.contact_submissions ADD COLUMN IF NOT EXISTS ai_intel_json TEXT;

DO $$
DECLARE
    constraint_name TEXT;
BEGIN
    SELECT conname INTO constraint_name
    FROM pg_constraint
    WHERE conrelid = 'public.contact_submissions'::regclass
      AND contype = 'c'
      AND pg_get_constraintdef(oid) ILIKE '%status%';

    IF constraint_name IS NOT NULL THEN
        EXECUTE format('ALTER TABLE public.contact_submissions DROP CONSTRAINT %I', constraint_name);
    END IF;
END $$;

ALTER TABLE public.contact_submissions
    ADD CONSTRAINT contact_submissions_status_check
    CHECK (status IN ('new', 'contacted', 'qualified', 'closed', 'in_progress', 'resolved'));

CREATE INDEX IF NOT EXISTS idx_contact_submissions_email ON public.contact_submissions(email);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON public.contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_inquiry_type ON public.contact_submissions(inquiry_type);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_workflow_area ON public.contact_submissions(workflow_area);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON public.contact_submissions(created_at DESC);

DROP TRIGGER IF EXISTS update_contact_submissions_updated_at ON public.contact_submissions;
CREATE TRIGGER update_contact_submissions_updated_at
    BEFORE UPDATE ON public.contact_submissions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- PARTNER ENQUIRIES
-- ============================================
CREATE TABLE IF NOT EXISTS public.partner_enquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    company TEXT,
    phone TEXT,
    job_title TEXT,
    partnership_type TEXT NOT NULL DEFAULT 'general',
    company_size TEXT,
    message TEXT,
    website TEXT,
    partner_region TEXT,
    customer_base TEXT,
    solution_areas TEXT,
    typical_deal_size TEXT,
    timeline TEXT,
    existing_relationship TEXT,
    proposed_opportunity TEXT,
    status TEXT DEFAULT 'new',
    priority TEXT DEFAULT 'medium',
    notes TEXT,
    assigned_to TEXT,
    source TEXT DEFAULT 'website',
    ai_detected_intent TEXT,
    ai_urgency TEXT,
    ai_summary TEXT,
    ai_intel_json TEXT,
    last_contact_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.partner_enquiries ADD COLUMN IF NOT EXISTS partner_region TEXT;
ALTER TABLE public.partner_enquiries ADD COLUMN IF NOT EXISTS customer_base TEXT;
ALTER TABLE public.partner_enquiries ADD COLUMN IF NOT EXISTS solution_areas TEXT;
ALTER TABLE public.partner_enquiries ADD COLUMN IF NOT EXISTS typical_deal_size TEXT;
ALTER TABLE public.partner_enquiries ADD COLUMN IF NOT EXISTS timeline TEXT;
ALTER TABLE public.partner_enquiries ADD COLUMN IF NOT EXISTS existing_relationship TEXT;
ALTER TABLE public.partner_enquiries ADD COLUMN IF NOT EXISTS proposed_opportunity TEXT;
ALTER TABLE public.partner_enquiries ADD COLUMN IF NOT EXISTS ai_detected_intent TEXT;
ALTER TABLE public.partner_enquiries ADD COLUMN IF NOT EXISTS ai_urgency TEXT;
ALTER TABLE public.partner_enquiries ADD COLUMN IF NOT EXISTS ai_summary TEXT;
ALTER TABLE public.partner_enquiries ADD COLUMN IF NOT EXISTS ai_intel_json TEXT;

CREATE INDEX IF NOT EXISTS idx_partner_enquiries_email ON public.partner_enquiries(email);
CREATE INDEX IF NOT EXISTS idx_partner_enquiries_status ON public.partner_enquiries(status);
CREATE INDEX IF NOT EXISTS idx_partner_enquiries_partnership_type ON public.partner_enquiries(partnership_type);
CREATE INDEX IF NOT EXISTS idx_partner_enquiries_priority ON public.partner_enquiries(priority);
CREATE INDEX IF NOT EXISTS idx_partner_enquiries_timeline ON public.partner_enquiries(timeline);
CREATE INDEX IF NOT EXISTS idx_partner_enquiries_created_at ON public.partner_enquiries(created_at DESC);

DROP TRIGGER IF EXISTS update_partner_enquiries_updated_at ON public.partner_enquiries;
CREATE TRIGGER update_partner_enquiries_updated_at
    BEFORE UPDATE ON public.partner_enquiries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE public.contact_submissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_enquiries DISABLE ROW LEVEL SECURITY;

GRANT ALL ON public.contact_submissions TO service_role;
GRANT ALL ON public.partner_enquiries TO service_role;
