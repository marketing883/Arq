/**
 * Content Domain Model
 *
 * Represents various content types managed through the CMS.
 */

/**
 * Content status for all content types
 */
export type ContentStatus = "draft" | "published" | "archived";

/**
 * Base content entity with shared fields
 */
export interface BaseContent {
  id: string;
  title: string;
  slug: string;
  status: ContentStatus;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  author?: string;
  seoMetadata?: SEOMetadata;
}

export interface SEOMetadata {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  ogImage?: string;
  canonicalUrl?: string;
}

/**
 * Blog post content
 */
export interface BlogPost extends BaseContent {
  excerpt?: string;
  content: string;
  featuredImage?: string;
  category?: string;
  tags: string[];
  readingTime?: number;
}

/**
 * Case study content
 */
export interface CaseStudy extends BaseContent {
  clientName: string;
  industry: string;
  heroImage?: string;
  overview?: string;
  challenge: CaseStudySection;
  solution: CaseStudySection;
  metrics: CaseStudyMetric[];
  impactSummary?: string;
  testimonial?: Testimonial;
  featured: boolean;
}

export interface CaseStudySection {
  description: string;
  points: string[];
}

export interface CaseStudyMetric {
  label: string;
  value: string;
  description?: string;
}

export interface Testimonial {
  quote: string;
  authorName: string;
  authorTitle: string;
  authorCompany?: string;
  authorImage?: string;
}

/**
 * Whitepaper/resource content
 */
export interface Whitepaper extends BaseContent {
  description?: string;
  content?: string;
  coverImage?: string;
  fileUrl?: string;
  category?: string;
  gated: boolean;
  downloadCount: number;
}

/**
 * Webinar content
 */
export interface Webinar extends BaseContent {
  description?: string;
  bannerImage?: string;
  webinarDate: Date;
  duration: number;
  timezone: string;
  presenters: Presenter[];
  learningPoints: string[];
  registrationUrl?: string;
  recordingUrl?: string;
  webinarStatus: WebinarStatus;
  featured: boolean;
}

export interface Presenter {
  name: string;
  title: string;
  company?: string;
  image?: string;
  bio?: string;
}

export type WebinarStatus = "upcoming" | "live" | "on-demand" | "past";

/**
 * Resource download tracking
 */
export interface ResourceLead {
  id: string;
  resourceType: "whitepaper" | "case_study" | "webinar";
  resourceId: string;
  name: string;
  email: string;
  company?: string;
  jobTitle?: string;
  downloadToken?: string;
  tokenUsed: boolean;
  tokenExpiresAt?: Date;
  createdAt: Date;
}
