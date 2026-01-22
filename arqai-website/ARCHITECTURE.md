# ArqAI Website - Complete Architecture Documentation

> **Version:** 1.0
> **Last Updated:** January 2026
> **Tech Stack:** Next.js 14, TypeScript, Tailwind CSS v4, Supabase, Anthropic Claude AI

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Directory Structure](#3-directory-structure)
4. [Environment Variables](#4-environment-variables)
5. [Pages & Routes](#5-pages--routes)
6. [API Endpoints](#6-api-endpoints)
7. [Database Schema](#7-database-schema)
8. [Authentication System](#8-authentication-system)
9. [AI Integrations](#9-ai-integrations)
10. [Email System](#10-email-system)
11. [Chat Widget](#11-chat-widget)
12. [Content Management](#12-content-management)
13. [Lead Intelligence](#13-lead-intelligence)
14. [Analytics & Tracking](#14-analytics--tracking)
15. [Security Implementation](#15-security-implementation)
16. [Styling & Design System](#16-styling--design-system)
17. [Components Library](#17-components-library)
18. [Deployment](#18-deployment)
19. [Common Tasks](#19-common-tasks)

---

## 1. Project Overview

ArqAI is an enterprise AI governance platform website built with Next.js 14 App Router. The site includes:

- **Marketing Pages**: Homepage, Platform, Solutions, Case Studies, Resources
- **Content Management**: Blog, Whitepapers, Webinars, Case Studies (admin-managed)
- **Lead Generation**: AI-powered chat widget, contact forms, gated content
- **Admin Dashboard**: Content management, lead tracking, SEO tools
- **AI Features**: Intelligent chat, lead scoring, content personalization

### Key URLs
- **Production:** https://thearq.ai
- **Admin Panel:** https://thearq.ai/admin

---

## 2. Tech Stack

### Core Framework
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 14.2.0 | React framework with App Router |
| React | 18.2.0 | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.0.0 | Styling |

### Backend Services
| Service | Purpose |
|---------|---------|
| Supabase | Database, storage, real-time |
| Anthropic Claude | AI chat, lead analysis |
| Resend | Transactional emails |
| Mailchimp | Newsletter subscriptions |

### Key Libraries
| Library | Purpose |
|---------|---------|
| `@anthropic-ai/sdk` | Claude AI integration |
| `@supabase/supabase-js` | Database client |
| `framer-motion` | Animations |
| `@tiptap/react` | Rich text editor |
| `jose` | JWT handling |
| `bcryptjs` | Password hashing |
| `zod` | Input validation |
| `dompurify` | XSS sanitization |
| `resend` | Email sending |

---

## 3. Directory Structure

```
arqai-website/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx                # Root layout (includes GA, CookieConsent)
│   ├── page.tsx                  # Homepage
│   ├── globals.css               # Global styles + Tailwind config
│   ├── admin/                    # Admin dashboard pages
│   │   ├── layout.tsx            # Admin layout with auth check
│   │   ├── page.tsx              # Main dashboard
│   │   ├── login/                # Admin login
│   │   ├── content/              # Content management
│   │   ├── contacts/             # Contact submissions
│   │   ├── partners/             # Partner enquiries
│   │   ├── subscribers/          # Newsletter subscribers
│   │   └── seo/                  # SEO tools
│   ├── api/                      # API routes
│   │   ├── admin/                # Protected admin APIs
│   │   ├── chat/                 # AI chat endpoint
│   │   ├── contact/              # Contact form
│   │   ├── newsletter/           # Newsletter signup
│   │   └── ...
│   ├── about/                    # About page
│   ├── blog/                     # Blog listing & posts
│   ├── case-studies/             # Case studies
│   ├── contact/                  # Contact page
│   ├── demo/                     # Demo booking
│   ├── partners/                 # Partners page
│   ├── platform/                 # Platform page
│   ├── privacy/                  # Privacy policy
│   ├── resources/                # Resources hub
│   ├── solutions/                # Solutions pages
│   │   ├── page.tsx              # Solutions overview
│   │   ├── arqfwa/               # ArqFWA solution
│   │   ├── arqintel/             # ArqIntel solution
│   │   ├── arqoptimize/          # ArqOptimize solution
│   │   └── arqrelease/           # ArqRelease solution
│   ├── terms/                    # Terms of service
│   ├── webinars/                 # Webinars
│   └── whitepapers/              # Whitepapers
│
├── components/                   # React components
│   ├── admin/                    # Admin-specific components
│   │   └── seo/                  # SEO tools components
│   ├── analytics/                # Analytics (Google Analytics)
│   ├── chat/                     # Chat widget components
│   ├── compliance/               # Cookie consent
│   ├── editor/                   # Tiptap editor
│   ├── i18n/                     # Language switcher
│   ├── layout/                   # Header, Footer, Logo
│   ├── morph/                    # Content morphing system
│   ├── seo/                      # SEO components
│   └── ui/                       # Reusable UI components
│
├── contexts/                     # React contexts
│   ├── LocaleContext.tsx         # i18n context
│   └── MorphContext.tsx          # Content morphing context
│
├── lib/                          # Shared utilities
│   ├── ai/                       # AI integrations
│   │   ├── anthropic.ts          # Claude API
│   │   ├── lead-intel.ts         # Lead intelligence AI
│   │   ├── knowledge-base.ts     # AI knowledge base
│   │   └── prompts/              # AI prompts
│   ├── auth/                     # Authentication
│   │   └── admin-auth.ts         # Admin JWT auth
│   ├── chat/                     # Chat system
│   ├── email/                    # Email services
│   │   ├── resend.ts             # Resend integration
│   │   └── mailchimp.ts          # Mailchimp integration
│   ├── lead/                     # Lead management
│   ├── security/                 # Security utilities
│   │   ├── rate-limiter.ts       # Rate limiting
│   │   ├── validation.ts         # Zod schemas
│   │   ├── sanitize.ts           # XSS sanitization
│   │   └── prompt-guard.ts       # AI prompt injection guard
│   ├── seo/                      # SEO utilities
│   └── supabase/                 # Supabase clients
│
├── public/                       # Static assets
│   ├── img/                      # Images
│   └── ...
│
├── types/                        # TypeScript types
│   └── index.ts                  # Shared types
│
├── middleware.ts                 # Next.js middleware (admin auth)
├── next.config.mjs               # Next.js config (security headers)
├── package.json                  # Dependencies
├── tailwind.config.ts            # Tailwind config
└── tsconfig.json                 # TypeScript config
```

---

## 4. Environment Variables

Create `.env.local` from `.env.example`:

```bash
# REQUIRED
JWT_SECRET=                       # Min 32 chars, generate: openssl rand -base64 48
ANTHROPIC_API_KEY=                # Claude AI API key
NEXT_PUBLIC_SUPABASE_URL=         # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=    # Supabase anon key
SUPABASE_SERVICE_ROLE_KEY=        # Supabase service role key
RESEND_API_KEY=                   # Resend email API key

# OPTIONAL
ADMIN_USERNAME=arqadmin           # Admin login username
ADMIN_PASSWORD_HASH=              # bcrypt hash of admin password
OPENAI_API_KEY=                   # OpenAI (backup for Claude)
MAILCHIMP_API_KEY=                # Newsletter integration
MAILCHIMP_LIST_ID=                # Mailchimp audience ID
```

### Generate Admin Password Hash
```bash
npx bcryptjs hash "your-secure-password"
```

---

## 5. Pages & Routes

### Public Pages

| Route | File | Description |
|-------|------|-------------|
| `/` | `app/page.tsx` | Homepage |
| `/about` | `app/about/page.tsx` | About page |
| `/platform` | `app/platform/page.tsx` | Platform overview |
| `/solutions` | `app/solutions/page.tsx` | Solutions overview |
| `/solutions/arqfwa` | `app/solutions/arqfwa/page.tsx` | ArqFWA solution |
| `/solutions/arqintel` | `app/solutions/arqintel/page.tsx` | ArqIntel solution |
| `/solutions/arqoptimize` | `app/solutions/arqoptimize/page.tsx` | ArqOptimize solution |
| `/solutions/arqrelease` | `app/solutions/arqrelease/page.tsx` | ArqRelease solution |
| `/case-studies` | `app/case-studies/page.tsx` | Case studies listing |
| `/case-studies/[slug]` | `app/case-studies/[slug]/page.tsx` | Individual case study |
| `/blog` | `app/blog/page.tsx` | Blog listing |
| `/blog/[slug]` | `app/blog/[slug]/page.tsx` | Individual blog post |
| `/whitepapers` | `app/whitepapers/page.tsx` | Whitepapers listing |
| `/whitepapers/[slug]` | `app/whitepapers/[slug]/page.tsx` | Individual whitepaper |
| `/webinars` | `app/webinars/page.tsx` | Webinars listing |
| `/webinars/[slug]` | `app/webinars/[slug]/page.tsx` | Individual webinar |
| `/resources/whitepapers` | `app/resources/whitepapers/page.tsx` | Resources hub |
| `/partners` | `app/partners/page.tsx` | Partners page |
| `/contact` | `app/contact/page.tsx` | Contact page |
| `/demo` | `app/demo/page.tsx` | Demo booking (Cal.com embed) |
| `/privacy` | `app/privacy/page.tsx` | Privacy policy |
| `/terms` | `app/terms/page.tsx` | Terms of service |

### Admin Pages (Protected)

| Route | File | Description |
|-------|------|-------------|
| `/admin/login` | `app/admin/login/page.tsx` | Admin login |
| `/admin` | `app/admin/page.tsx` | Dashboard overview |
| `/admin/content` | `app/admin/content/page.tsx` | Content management hub |
| `/admin/content/case-studies/new` | `app/admin/content/case-studies/new/page.tsx` | Create case study |
| `/admin/content/case-studies/[id]/edit` | `app/admin/content/case-studies/[id]/edit/page.tsx` | Edit case study |
| `/admin/content/blog/new` | `app/admin/content/blog/new/page.tsx` | Create blog post |
| `/admin/content/blog/[id]/edit` | `app/admin/content/blog/[id]/edit/page.tsx` | Edit blog post |
| `/admin/content/whitepapers/new` | `app/admin/content/whitepapers/new/page.tsx` | Create whitepaper |
| `/admin/content/whitepapers/[id]/edit` | `app/admin/content/whitepapers/[id]/edit/page.tsx` | Edit whitepaper |
| `/admin/content/webinars/new` | `app/admin/content/webinars/new/page.tsx` | Create webinar |
| `/admin/content/webinars/[id]/edit` | `app/admin/content/webinars/[id]/edit/page.tsx` | Edit webinar |
| `/admin/contacts` | `app/admin/contacts/page.tsx` | Contact submissions |
| `/admin/partners` | `app/admin/partners/page.tsx` | Partner enquiries |
| `/admin/subscribers` | `app/admin/subscribers/page.tsx` | Newsletter subscribers |
| `/admin/seo` | `app/admin/seo/page.tsx` | SEO tools |

---

## 6. API Endpoints

### Public APIs

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/chat` | POST | AI chat messages |
| `/api/contact` | POST | Contact form submission |
| `/api/newsletter` | POST | Newsletter signup |
| `/api/partner-enquiry` | POST | Partner enquiry form |
| `/api/consent` | POST | Cookie consent tracking |
| `/api/geo` | GET | Geo-location detection |
| `/api/resources/download` | POST | Gated content download |

### Content APIs (Public Read)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/case-studies/list` | GET | List published case studies |
| `/api/case-studies/featured` | GET | Featured case studies |
| `/api/case-studies/[slug]` | GET | Single case study |
| `/api/blog/published` | GET | Published blog posts |
| `/api/blog/[slug]` | GET | Single blog post |
| `/api/whitepapers/list` | GET | Published whitepapers |
| `/api/whitepapers/featured` | GET | Featured whitepapers |
| `/api/whitepapers/[slug]` | GET | Single whitepaper |
| `/api/webinars/list` | GET | Published webinars |
| `/api/webinars/[slug]` | GET | Single webinar |
| `/api/promo-content` | GET | Promotional content for header |

### Admin APIs (Protected)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/admin/login` | POST | Admin login |
| `/api/admin/logout` | POST | Admin logout |
| `/api/admin/contacts` | GET | List contact submissions |
| `/api/admin/leads` | GET | List leads with intelligence |
| `/api/admin/partner-enquiries` | GET/PUT | Partner enquiries CRUD |
| `/api/admin/export` | GET | Export data as CSV |
| `/api/admin/upload` | POST | File upload to Supabase |
| `/api/admin/content/case-studies` | GET/POST | Case studies CRUD |
| `/api/admin/content/case-studies/[id]` | GET/PUT/DELETE | Single case study |
| `/api/admin/content/blog` | GET/POST | Blog posts CRUD |
| `/api/admin/content/blog/[id]` | GET/PUT/DELETE | Single blog post |
| `/api/admin/content/whitepapers` | GET/POST | Whitepapers CRUD |
| `/api/admin/content/whitepapers/[id]` | GET/PUT/DELETE | Single whitepaper |
| `/api/admin/content/webinars` | GET/POST | Webinars CRUD |
| `/api/admin/content/webinars/[id]` | GET/PUT/DELETE | Single webinar |
| `/api/admin/seo/analyze` | POST | AI-powered SEO analysis |
| `/api/ai/generate` | POST | AI content generation |

---

## 7. Database Schema

### Supabase Tables

Run these SQL files in order in Supabase SQL Editor:
1. `supabase-schema.sql` - Core tables
2. `supabase-content-schema.sql` - Content management
3. `supabase-partner-enquiries.sql` - Partner enquiries

### Core Tables

#### `users`
Tracks website visitors/leads.
```sql
id UUID PRIMARY KEY
session_id TEXT UNIQUE NOT NULL
name TEXT
email TEXT
company TEXT
job_title TEXT
phone TEXT
location TEXT
created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
```

#### `conversations`
Chat conversations history.
```sql
id UUID PRIMARY KEY
user_id UUID REFERENCES users(id)
session_id TEXT NOT NULL
messages JSONB DEFAULT '[]'
page_context JSONB
started_at TIMESTAMPTZ
ended_at TIMESTAMPTZ
is_active BOOLEAN DEFAULT true
```

#### `lead_intelligence`
AI-powered lead scoring data.
```sql
id UUID PRIMARY KEY
user_id UUID REFERENCES users(id) UNIQUE
buy_intent_score INTEGER DEFAULT 0
intent_category TEXT DEFAULT 'cold'
urgency TEXT DEFAULT 'low'
company_size TEXT
qualification_status TEXT DEFAULT 'new'
behavioral_signals JSONB DEFAULT '[]'
company_research JSONB DEFAULT '{}'
user_research JSONB DEFAULT '{}'
```

#### `sessions`
Visitor session tracking.
```sql
id UUID PRIMARY KEY
session_id TEXT UNIQUE NOT NULL
user_id UUID REFERENCES users(id)
ip_address TEXT
user_agent TEXT
detected_country TEXT
detected_language TEXT
pages_visited JSONB DEFAULT '[]'
first_visit TIMESTAMPTZ
last_activity TIMESTAMPTZ
```

### Content Tables

#### `blog_posts`
```sql
id UUID PRIMARY KEY
title TEXT NOT NULL
slug TEXT UNIQUE NOT NULL
excerpt TEXT
content TEXT
featured_image TEXT
category TEXT
tags TEXT[] DEFAULT '{}'
author TEXT DEFAULT 'ArqAI Team'
status TEXT DEFAULT 'draft' -- 'draft' | 'published'
published_at TIMESTAMPTZ
```

#### `case_studies`
```sql
id UUID PRIMARY KEY
title TEXT NOT NULL
slug TEXT UNIQUE NOT NULL
client_name TEXT NOT NULL
industry TEXT NOT NULL
hero_image TEXT
overview TEXT
challenge_description TEXT
challenge_points JSONB DEFAULT '[]'
solution_description TEXT
solution_points JSONB DEFAULT '[]'
metrics JSONB DEFAULT '[]'
impact_summary TEXT
testimonial_quote TEXT
testimonial_author_name TEXT
testimonial_author_title TEXT
testimonial_author_company TEXT
status TEXT DEFAULT 'draft'
featured BOOLEAN DEFAULT false
```

#### `whitepapers`
```sql
id UUID PRIMARY KEY
title TEXT NOT NULL
slug TEXT UNIQUE NOT NULL
description TEXT
content TEXT
cover_image TEXT
file_url TEXT
category TEXT
status TEXT DEFAULT 'draft'
gated BOOLEAN DEFAULT true
download_count INTEGER DEFAULT 0
```

#### `webinars`
```sql
id UUID PRIMARY KEY
title TEXT NOT NULL
slug TEXT UNIQUE NOT NULL
description TEXT
banner_image TEXT
webinar_date TIMESTAMPTZ NOT NULL
duration INTEGER DEFAULT 60
timezone TEXT DEFAULT 'America/New_York'
presenters JSONB DEFAULT '[]'
learning_points JSONB DEFAULT '[]'
registration_url TEXT
recording_url TEXT
status TEXT DEFAULT 'upcoming' -- 'upcoming' | 'live' | 'on-demand' | 'past'
featured BOOLEAN DEFAULT false
```

#### `contact_submissions`
```sql
id UUID PRIMARY KEY
name TEXT NOT NULL
email TEXT NOT NULL
company TEXT
job_title TEXT
message TEXT
inquiry_type TEXT DEFAULT 'general'
status TEXT DEFAULT 'new'
-- AI Intel fields
ai_detected_intent TEXT
ai_urgency TEXT
ai_company_industry TEXT
ai_company_size TEXT
ai_contact_seniority TEXT
ai_contact_department TEXT
ai_decision_maker BOOLEAN
ai_summary TEXT
ai_intel_json JSONB
created_at TIMESTAMPTZ
```

#### `partner_enquiries`
```sql
id UUID PRIMARY KEY
name TEXT NOT NULL
email TEXT NOT NULL
company TEXT
phone TEXT
job_title TEXT
partnership_type TEXT NOT NULL DEFAULT 'general'
company_size TEXT
message TEXT
website TEXT
status TEXT DEFAULT 'new'
priority TEXT DEFAULT 'medium'
notes TEXT
assigned_to TEXT
source TEXT DEFAULT 'website'
last_contact_at TIMESTAMPTZ
```

#### `resource_leads`
Gated content downloads.
```sql
id UUID PRIMARY KEY
resource_type TEXT NOT NULL
resource_id UUID NOT NULL
name TEXT NOT NULL
email TEXT NOT NULL
company TEXT
job_title TEXT
download_token TEXT UNIQUE
token_used BOOLEAN DEFAULT false
token_expires_at TIMESTAMPTZ
```

---

## 8. Authentication System

### Admin Authentication

**Location:** `lib/auth/admin-auth.ts`

#### How It Works
1. Single admin user (credentials in env vars)
2. Password hashed with bcrypt (12 rounds)
3. JWT tokens with 2-hour expiry
4. HttpOnly, Secure, SameSite=strict cookies

#### Key Functions
```typescript
verifyAdminCredentials(username, password)  // Verify login
createAdminSession(username)                 // Create JWT token
verifyAdminSession(token)                    // Verify JWT token
getAdminSession()                            // Get session from cookies
setAdminSessionCookie(token)                 // Set auth cookie
clearAdminSessionCookie()                    // Logout
```

#### Middleware Protection
**Location:** `middleware.ts`

Protects `/admin/*` routes (except `/admin/login`).

```typescript
// Checks for valid admin_session cookie
// Redirects to /admin/login if invalid
```

---

## 9. AI Integrations

### Claude AI Chat
**Location:** `lib/ai/anthropic.ts`

Powers the website chat widget with context-aware responses.

```typescript
generateChatResponse(userMessage, context)
// Returns AI response based on page context and conversation history
```

### Lead Intelligence AI
**Location:** `lib/ai/lead-intel.ts`

Analyzes contact form submissions in real-time.

```typescript
interface LeadIntelResult {
  detectedIntent: "demo" | "pricing" | "support" | "partnership" | "general" | "urgent"
  intentConfidence: number
  urgency: "high" | "medium" | "low"
  personalizedGreeting: string
  personalizedMessage: string
  suggestedNextSteps: string[]
  companyIntel: {
    likelyIndustry: string
    estimatedSize: string
    potentialUseCases: string[]
  }
  contactIntel: {
    seniority: "c-level" | "vp" | "director" | "manager" | "individual"
    department: string
    decisionMaker: boolean
  }
  researchSuggestions: string[]
  summary: string
}

analyzeLeadIntel(data) // Returns LeadIntelResult
getIntentBasedEmailContent(intent, name) // Returns personalized email content
```

### AI Knowledge Base
**Location:** `lib/ai/knowledge-base.ts`

Contains ArqAI product information, pricing, competitors, and FAQs for the chat AI.

---

## 10. Email System

### Resend Integration
**Location:** `lib/email/resend.ts`

#### Configuration
```typescript
const FROM_EMAIL = "ArqAI <no-reply@thearq.ai>"
const TEAM_EMAIL = "habib@thearq.ai"
```

#### Email Functions

| Function | Purpose |
|----------|---------|
| `sendUserConfirmation(data)` | Thank you email to form filler (personalized by AI) |
| `sendContactFormNotification(data)` | Team notification with AI intel |
| `sendLeadNotification(data)` | Hot lead alerts |
| `sendPartnerEnquiryNotification(data)` | Partner enquiry alerts |

#### Email Templates
- Light header with ArqAI logo
- Responsive design
- Personalized based on detected intent
- Include AI insights in team notifications

### Mailchimp Integration
**Location:** `lib/email/mailchimp.ts`

Newsletter subscription management.

```typescript
subscribeToNewsletter(email, name?)
```

---

## 11. Chat Widget

### Components
**Location:** `components/chat/`

| Component | Purpose |
|-----------|---------|
| `ChatWidget.tsx` | Main chat widget container |
| `ChatInput.tsx` | Message input field |
| `ChatMessage.tsx` | Message bubble |
| `FallbackForm.tsx` | Lead capture form |

### Features
- Floating chat bubble (bottom-right)
- AI-powered responses (Claude)
- Context-aware (knows current page)
- Lead capture integration
- Mobile responsive

### Configuration
Edit system prompt in `lib/ai/knowledge-base.ts` to customize AI behavior.

---

## 12. Content Management

### Admin CMS

Accessible at `/admin/content`

#### Content Types

| Type | Create | Edit | List |
|------|--------|------|------|
| Case Studies | `/admin/content/case-studies/new` | `/admin/content/case-studies/[id]/edit` | `/admin/content` |
| Blog Posts | `/admin/content/blog/new` | `/admin/content/blog/[id]/edit` | `/admin/content` |
| Whitepapers | `/admin/content/whitepapers/new` | `/admin/content/whitepapers/[id]/edit` | `/admin/content` |
| Webinars | `/admin/content/webinars/new` | `/admin/content/webinars/[id]/edit` | `/admin/content` |

### Rich Text Editor
**Location:** `components/editor/TiptapEditor.tsx`

Features:
- WYSIWYG editing
- Image upload (to Supabase)
- YouTube embeds
- Links
- Code blocks

### Slug Generation
Slugs are auto-generated from titles and sanitized:
- Lowercase
- Spaces → hyphens
- Special characters removed

---

## 13. Lead Intelligence

### Lead Tracking Flow

1. **Visitor arrives** → Session created
2. **Interacts with chat** → User record created, conversation stored
3. **Submits form** → Lead intelligence generated
4. **AI Analysis** → Intent, urgency, company intel extracted
5. **Emails sent** → Personalized to user, enriched to team
6. **Admin views** → Full intel in dashboard

### Lead Scoring
**Location:** `lib/lead/lead-intelligence.ts`

```typescript
// Intent categories
"hot" | "warm" | "cold"

// Urgency levels
"immediate" | "high" | "medium" | "low"

// Qualification status
"new" | "contacted" | "qualified" | "opportunity" | "customer"
```

---

## 14. Analytics & Tracking

### Google Analytics
**Location:** `components/analytics/GoogleAnalytics.tsx`

- **Measurement ID:** `G-GJ2E4L3NMD`
- **Cookie Consent:** Only loads after user accepts analytics cookies
- **Event Tracking:** Automatic pageviews

### Cookie Consent
**Location:** `components/compliance/CookieConsent.tsx`

Categories:
- **Necessary** (always on)
- **Analytics** (GA4)
- **Marketing** (future use)
- **Preferences** (future use)

Consent stored in:
- `localStorage` (key: `arqai_cookie_consent`)
- Database via `/api/consent`

---

## 15. Security Implementation

### Security Headers
**Location:** `next.config.mjs`

| Header | Value |
|--------|-------|
| X-Frame-Options | DENY |
| X-Content-Type-Options | nosniff |
| X-XSS-Protection | 1; mode=block |
| Referrer-Policy | strict-origin-when-cross-origin |
| Strict-Transport-Security | max-age=31536000; includeSubDomains; preload |
| Content-Security-Policy | Strict CSP with allowed domains |

### Rate Limiting
**Location:** `lib/security/rate-limiter.ts`

| Endpoint Type | Limit |
|---------------|-------|
| Auth | 5 requests / 15 min |
| Chat | 20 requests / min |
| API | 60 requests / min |
| Sensitive | 10 requests / hour |

### Input Validation
**Location:** `lib/security/validation.ts`

Zod schemas for all user input:
- Email validation
- Password requirements
- Chat message limits
- Form field sanitization

### XSS Prevention
**Location:** `lib/security/sanitize.ts`

DOMPurify sanitization for user-generated content.

### Prompt Injection Guard
**Location:** `lib/security/prompt-guard.ts`

Protects AI endpoints from prompt injection attacks.

---

## 16. Styling & Design System

### Tailwind CSS v4
**Location:** `app/globals.css`

### Brand Colors
```css
--arq-blue: #0432a5      /* Primary blue */
--arq-lime: #d0f438      /* Accent lime */
--arq-black: #161616     /* Text black */
--arq-white: #FAF7F6     /* Background white */
```

### CSS Variables (Theme)
```css
/* Light mode */
--background: #FAF7F6
--text-bright: #161616
--text-medium: #303030
--text-muted: #585858
--accent: #0432a5

/* Dark mode */
--background: #161616
--text-bright: #FFFFFF
--text-medium: #ACACAC
--text-muted: #838383
--accent: #d0f438
```

### Typography
- **Display Font:** Funnel Display
- **Body Font:** Funnel Sans

### Component Classes
```css
.btn              /* Base button */
.btn-primary      /* Primary CTA */
.btn-outline      /* Outline button */
.container        /* Max-width container */
.section          /* Page section */
```

---

## 17. Components Library

### Layout Components
**Location:** `components/layout/`

| Component | Description |
|-----------|-------------|
| `Header.tsx` | Main navigation header with mega menu |
| `Footer.tsx` | Site footer with links |
| `Logo.tsx` | ArqAI logo component |

### UI Components
**Location:** `components/ui/`

| Component | Description |
|-----------|-------------|
| `Section.tsx` | Page section wrapper |
| `IntegrationLogos.tsx` | Partner/integration logos |
| `AnimatedCounter.tsx` | Animated number counter |

### SEO Components
**Location:** `components/seo/`

| Component | Description |
|-----------|-------------|
| `StructuredData.tsx` | JSON-LD schema markup |

### Admin Components
**Location:** `components/admin/seo/`

| Component | Description |
|-----------|-------------|
| `SEOFieldsPanel.tsx` | SEO metadata editor |
| `ContentGenerator.tsx` | AI content generation |
| `KeywordResearchPanel.tsx` | Keyword research tool |

---

## 18. Deployment

### Production Server Setup

1. **Clone repository**
```bash
git clone https://github.com/marketing883/Arq.git
cd Arq/arqai-website
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```bash
cp .env.example .env.local
# Edit .env.local with production values
```

4. **Build**
```bash
npm run build
```

5. **Run with PM2**
```bash
pm2 start npm --name "arqai" -- start
```

### Update Deployment
```bash
cd /home/arqadmin/arq-website
git pull origin claude/improve-arq-architecture-h9vHj
cd arqai-website
npm run build
pm2 restart arqai
```

### Required Environment Variables (Production)
- `JWT_SECRET` (32+ chars)
- `ANTHROPIC_API_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`

---

## 19. Common Tasks

### Add a New Page

1. Create file in `app/[route]/page.tsx`
2. Add to navigation in `components/layout/Header.tsx`
3. Add to footer if needed in `components/layout/Footer.tsx`
4. Add to sitemap in `app/sitemap.ts`

### Add a New API Endpoint

1. Create `app/api/[route]/route.ts`
2. Add rate limiting if needed
3. Add input validation with Zod
4. Add to admin if protected

### Create New Case Study

1. Go to `/admin/content/case-studies/new`
2. Fill in all fields
3. Add metrics as JSON array
4. Set status to "published"
5. Optionally mark as "featured"

### Modify Email Templates

Edit `lib/email/resend.ts`:
- `sendUserConfirmation()` - User confirmation email
- `sendContactFormNotification()` - Team notification

### Update AI Behavior

Edit `lib/ai/knowledge-base.ts`:
- `SYSTEM_PROMPT` - Main AI personality
- `PAGE_CONTEXT_PROMPTS` - Page-specific context

### Add New Admin Feature

1. Create page in `app/admin/[feature]/page.tsx`
2. Create API in `app/api/admin/[feature]/route.ts`
3. Add to admin navigation in `app/admin/layout.tsx`

### Debug Issues

```bash
# View PM2 logs
pm2 logs arqai --lines 50

# View error logs
tail -50 /root/.pm2/logs/arqai-error.log

# Check environment
grep VARIABLE /path/to/.env.local
```

---

## Quick Reference

### Admin Login
- **URL:** https://thearq.ai/admin/login
- **Default Dev Credentials:** arqadmin / AdminDev2026!
- **Change in production** via `ADMIN_USERNAME` and `ADMIN_PASSWORD_HASH` env vars

### Key Files to Edit

| Task | File(s) |
|------|---------|
| Homepage content | `app/page.tsx` |
| Navigation menu | `components/layout/Header.tsx` |
| Footer links | `components/layout/Footer.tsx` |
| Email templates | `lib/email/resend.ts` |
| AI chat behavior | `lib/ai/knowledge-base.ts` |
| Security headers | `next.config.mjs` |
| Global styles | `app/globals.css` |

### Support

- **GitHub:** https://github.com/marketing883/Arq
- **Production:** https://thearq.ai

---

*This documentation covers the complete ArqAI website architecture as of January 2026.*
