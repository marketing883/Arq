-- Removes the fictional sample content that earlier versions of
-- supabase-content-schema.sql seeded as status='published'. Run this against
-- any environment (especially production) that ever executed the old schema
-- file, then verify nothing renders at /case-studies/healthcare-ai-transformation.

-- Fictional case study: "Regional Health Network" / "Dr. Sarah Chen"
DELETE FROM public.case_studies
WHERE slug = 'healthcare-ai-transformation'
  AND client_name = 'Regional Health Network';

-- Stub blog post seeded by the schema file
DELETE FROM public.blog_posts
WHERE slug = 'getting-started-ai-governance'
  AND content = '<h2>Introduction</h2><p>AI governance is essential for enterprise success...</p>';

-- Stub whitepaper with no file behind it
DELETE FROM public.whitepapers
WHERE slug = 'enterprise-ai-governance-playbook'
  AND file_url IS NULL;
