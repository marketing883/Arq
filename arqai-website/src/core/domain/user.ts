/**
 * User Domain Model
 *
 * Represents a website visitor or lead in the system.
 */

/**
 * Base user entity representing a website visitor
 */
export interface User {
  id: string;
  sessionId: string;
  name?: string;
  email?: string;
  company?: string;
  jobTitle?: string;
  phone?: string;
  location?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Admin user with authentication capabilities
 */
export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  createdAt: Date;
  lastLoginAt?: Date;
}

export type AdminRole = "admin" | "viewer";

/**
 * User session tracking information
 */
export interface UserSession {
  id: string;
  sessionId: string;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  detectedCountry?: string;
  detectedLanguage?: string;
  pagesVisited: PageVisit[];
  firstVisit: Date;
  lastActivity: Date;
}

export interface PageVisit {
  path: string;
  timestamp: Date;
  duration?: number;
  referrer?: string;
}

/**
 * User research/enrichment data
 */
export interface UserResearch {
  roleSeniority?: Seniority;
  department?: string;
  decisionMaker?: boolean;
  linkedInUrl?: string;
}

export type Seniority =
  | "c-level"
  | "vp"
  | "director"
  | "manager"
  | "individual";
