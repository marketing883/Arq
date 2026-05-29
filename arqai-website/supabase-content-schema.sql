-- ArqAI Content Management Schema
-- Run this in your Supabase SQL Editor AFTER the main schema
-- https://app.supabase.com -> SQL Editor

-- ============================================
-- BLOG POSTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT,
    featured_image TEXT,
    category TEXT,
    tags TEXT[] DEFAULT '{}',
    author TEXT DEFAULT 'ArqAI Team',
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON public.blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON public.blog_posts(published_at DESC);

-- ============================================
-- CASE STUDIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.case_studies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    client_name TEXT NOT NULL,
    industry TEXT NOT NULL,
    hero_image TEXT,
    overview TEXT,
    challenge_description TEXT,
    challenge_points JSONB DEFAULT '[]',
    solution_description TEXT,
    solution_points JSONB DEFAULT '[]',
    metrics JSONB DEFAULT '[]',
    impact_summary TEXT,
    testimonial_quote TEXT,
    testimonial_author_name TEXT,
    testimonial_author_title TEXT,
    testimonial_author_company TEXT,
    testimonial_author_photo TEXT,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    featured BOOLEAN DEFAULT false,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_case_studies_slug ON public.case_studies(slug);
CREATE INDEX IF NOT EXISTS idx_case_studies_status ON public.case_studies(status);
CREATE INDEX IF NOT EXISTS idx_case_studies_industry ON public.case_studies(industry);

-- ============================================
-- WHITEPAPERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.whitepapers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    cover_image TEXT,
    file_url TEXT,
    category TEXT,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    gated BOOLEAN DEFAULT true,
    download_count INTEGER DEFAULT 0,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_whitepapers_slug ON public.whitepapers(slug);
CREATE INDEX IF NOT EXISTS idx_whitepapers_status ON public.whitepapers(status);

-- ============================================
-- WEBINARS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.webinars (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    banner_image TEXT,
    webinar_date TIMESTAMPTZ NOT NULL,
    duration INTEGER DEFAULT 60,
    timezone TEXT DEFAULT 'America/New_York',
    presenters JSONB DEFAULT '[]',
    learning_points JSONB DEFAULT '[]',
    registration_url TEXT,
    recording_url TEXT,
    status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'live', 'on-demand', 'past')),
    featured BOOLEAN DEFAULT false,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_webinars_slug ON public.webinars(slug);
CREATE INDEX IF NOT EXISTS idx_webinars_status ON public.webinars(status);
CREATE INDEX IF NOT EXISTS idx_webinars_date ON public.webinars(webinar_date);

-- ============================================
-- RESOURCE LEADS TABLE (for gated content)
-- ============================================
CREATE TABLE IF NOT EXISTS public.resource_leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resource_type TEXT NOT NULL,
    resource_id UUID NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    company TEXT,
    job_title TEXT,
    download_token TEXT UNIQUE,
    token_used BOOLEAN DEFAULT false,
    token_expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_resource_leads_email ON public.resource_leads(email);
CREATE INDEX IF NOT EXISTS idx_resource_leads_token ON public.resource_leads(download_token);

-- ============================================
-- AUTO-UPDATE TRIGGERS
-- ============================================
CREATE TRIGGER update_blog_posts_updated_at
    BEFORE UPDATE ON public.blog_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_case_studies_updated_at
    BEFORE UPDATE ON public.case_studies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_whitepapers_updated_at
    BEFORE UPDATE ON public.whitepapers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_webinars_updated_at
    BEFORE UPDATE ON public.webinars
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- DISABLE RLS (for service role access)
-- ============================================
ALTER TABLE public.blog_posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_studies DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.whitepapers DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.webinars DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_leads DISABLE ROW LEVEL SECURITY;

-- ============================================
-- GRANT PERMISSIONS
-- ============================================
GRANT ALL ON public.blog_posts TO anon, authenticated, service_role;
GRANT ALL ON public.case_studies TO anon, authenticated, service_role;
GRANT ALL ON public.whitepapers TO anon, authenticated, service_role;
GRANT ALL ON public.webinars TO anon, authenticated, service_role;
GRANT ALL ON public.resource_leads TO anon, authenticated, service_role;

-- ============================================
-- SAMPLE DATA (optional - comment out if not needed)
-- ============================================

-- Sample blog post
INSERT INTO public.blog_posts (title, slug, excerpt, content, category, status, published_at)
VALUES (
    'Getting Started with AI Governance',
    'getting-started-ai-governance',
    'Learn the fundamentals of AI governance and why it matters for enterprise deployments.',
    '<h2>Introduction</h2><p>AI governance is essential for enterprise success...</p>',
    'AI & Automation',
    'published',
    NOW()
) ON CONFLICT (slug) DO NOTHING;

-- Sample case study
INSERT INTO public.case_studies (
    title, slug, client_name, industry, overview,
    challenge_description, challenge_points,
    solution_description, solution_points,
    metrics, impact_summary,
    testimonial_quote, testimonial_author_name, testimonial_author_title, testimonial_author_company,
    status, featured, published_at
) VALUES (
    'Healthcare AI Transformation',
    'healthcare-ai-transformation',
    'Regional Health Network',
    'Healthcare',
    'A leading regional health network transformed their patient care operations with AI-powered automation.',
    'The organization faced mounting pressure to improve patient outcomes while reducing operational costs.',
    '["Manual processes causing delays in patient care", "Compliance documentation taking excessive staff time", "Difficulty scaling operations across facilities"]',
    'ArqAI implemented a comprehensive AI governance platform with automated workflows.',
    '["Deployed AI agents for patient intake automation", "Implemented real-time compliance monitoring", "Created unified data fabric across all facilities"]',
    '[{"label": "Cost Reduction", "value": "40%", "description": "Operational savings in first year"}, {"label": "Time Saved", "value": "60%", "description": "Reduction in documentation time"}, {"label": "Compliance", "value": "100%", "description": "Audit trail coverage"}]',
    'The implementation resulted in significant improvements across all key metrics, enabling the network to serve more patients with better outcomes.',
    'ArqAI transformed how we approach patient care. The governance framework gave us confidence to scale AI across our entire network.',
    'Dr. Sarah Chen',
    'Chief Medical Information Officer',
    'Regional Health Network',
    'published',
    true,
    NOW()
) ON CONFLICT (slug) DO NOTHING;

-- Sample whitepaper
INSERT INTO public.whitepapers (title, slug, description, category, status, published_at)
VALUES (
    'The Enterprise AI Governance Playbook',
    'enterprise-ai-governance-playbook',
    'A comprehensive guide to implementing AI governance in regulated industries. Learn best practices for compliance, security, and scalability.',
    'Technical',
    'published',
    NOW()
) ON CONFLICT (slug) DO NOTHING;
