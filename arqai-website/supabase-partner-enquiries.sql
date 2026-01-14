-- Partner Enquiries Schema
-- Run this in your Supabase SQL Editor to add the partner enquiries table

-- ============================================
-- PARTNER ENQUIRIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.partner_enquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    company TEXT,
    phone TEXT,
    job_title TEXT,
    partnership_type TEXT NOT NULL DEFAULT 'general',  -- technology, reseller, integration, strategic, general
    company_size TEXT,  -- startup, smb, mid-market, enterprise
    message TEXT,  -- their specific interest/opportunity
    website TEXT,
    status TEXT DEFAULT 'new',  -- new, contacted, qualified, negotiating, closed-won, closed-lost
    priority TEXT DEFAULT 'medium',  -- high, medium, low
    notes TEXT,
    assigned_to TEXT,
    source TEXT DEFAULT 'website',  -- website, referral, event, other
    last_contact_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_partner_enquiries_email ON public.partner_enquiries(email);
CREATE INDEX IF NOT EXISTS idx_partner_enquiries_status ON public.partner_enquiries(status);
CREATE INDEX IF NOT EXISTS idx_partner_enquiries_partnership_type ON public.partner_enquiries(partnership_type);
CREATE INDEX IF NOT EXISTS idx_partner_enquiries_priority ON public.partner_enquiries(priority);
CREATE INDEX IF NOT EXISTS idx_partner_enquiries_created_at ON public.partner_enquiries(created_at DESC);

-- Disable RLS for service role access
ALTER TABLE public.partner_enquiries DISABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT ALL ON public.partner_enquiries TO anon, authenticated, service_role;

-- Auto-update trigger for updated_at
CREATE TRIGGER update_partner_enquiries_updated_at
    BEFORE UPDATE ON public.partner_enquiries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
