/**
 * Repository Interfaces
 *
 * Defines contracts for data access layer.
 * Repositories abstract the data store (Supabase, etc.)
 */

import type { User, UserSession } from "../domain/user";
import type { LeadIntelligence, LeadAlert, TouchpointEvent } from "../domain/lead";
import type { Conversation, Message } from "../domain/conversation";
import type { BlogPost, CaseStudy, Whitepaper, Webinar, ResourceLead } from "../domain/content";
import type { ConsentRecord } from "../domain/analytics";

/**
 * Base repository interface with common CRUD operations
 */
export interface IRepository<T, TCreate = Omit<T, "id" | "createdAt" | "updatedAt">> {
  findById(id: string): Promise<T | null>;
  findAll(options?: FindOptions): Promise<T[]>;
  create(data: TCreate): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
  count(options?: FindOptions): Promise<number>;
}

export interface FindOptions {
  where?: Record<string, unknown>;
  orderBy?: { field: string; direction: "asc" | "desc" };
  limit?: number;
  offset?: number;
}

/**
 * User Repository
 */
export interface IUserRepository extends IRepository<User> {
  findBySessionId(sessionId: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  upsertBySession(sessionId: string, data: Partial<User>): Promise<User>;
}

/**
 * Session Repository
 */
export interface ISessionRepository extends IRepository<UserSession> {
  findBySessionId(sessionId: string): Promise<UserSession | null>;
  updateActivity(sessionId: string): Promise<void>;
  addPageVisit(sessionId: string, path: string): Promise<void>;
}

/**
 * Lead Repository
 */
export interface ILeadRepository extends IRepository<LeadIntelligence> {
  findByUserId(userId: string): Promise<LeadIntelligence | null>;
  findByEmail(email: string): Promise<LeadIntelligence | null>;
  updateScore(id: string, scoreData: LeadScoreUpdate): Promise<LeadIntelligence>;
  findByJourneyStage(stage: string): Promise<LeadIntelligence[]>;
  findByPriorityTier(tier: string): Promise<LeadIntelligence[]>;
  findHotLeads(limit?: number): Promise<LeadIntelligence[]>;
}

export interface LeadScoreUpdate {
  score: number;
  intentScore?: number;
  engagementScore?: number;
  icpFitScore?: number;
  journeyStage?: string;
  priorityTier?: string;
  scoreCalculatedAt: Date;
}

/**
 * Lead Alert Repository
 */
export interface IAlertRepository extends IRepository<LeadAlert> {
  findByLeadId(leadId: string): Promise<LeadAlert[]>;
  findActive(): Promise<LeadAlert[]>;
  acknowledge(id: string, userId: string): Promise<LeadAlert>;
  dismiss(id: string): Promise<void>;
  cleanupExpired(): Promise<number>;
}

/**
 * Touchpoint Repository
 */
export interface ITouchpointRepository extends IRepository<TouchpointEvent> {
  findByLeadId(leadId: string): Promise<TouchpointEvent[]>;
  findRecent(leadId: string, hours: number): Promise<TouchpointEvent[]>;
  countBySource(leadId: string): Promise<Record<string, number>>;
}

/**
 * Conversation Repository
 */
export interface IConversationRepository extends IRepository<Conversation> {
  findBySessionId(sessionId: string): Promise<Conversation[]>;
  findActiveBySession(sessionId: string): Promise<Conversation | null>;
  addMessage(conversationId: string, message: Message): Promise<Conversation>;
  endConversation(id: string): Promise<void>;
}

/**
 * Content Repositories
 */
export interface IBlogPostRepository extends IRepository<BlogPost> {
  findBySlug(slug: string): Promise<BlogPost | null>;
  findPublished(limit?: number): Promise<BlogPost[]>;
  findByCategory(category: string): Promise<BlogPost[]>;
  findByTag(tag: string): Promise<BlogPost[]>;
}

export interface ICaseStudyRepository extends IRepository<CaseStudy> {
  findBySlug(slug: string): Promise<CaseStudy | null>;
  findPublished(limit?: number): Promise<CaseStudy[]>;
  findFeatured(limit?: number): Promise<CaseStudy[]>;
  findByIndustry(industry: string): Promise<CaseStudy[]>;
}

export interface IWhitepaperRepository extends IRepository<Whitepaper> {
  findBySlug(slug: string): Promise<Whitepaper | null>;
  findPublished(limit?: number): Promise<Whitepaper[]>;
  findFeatured(limit?: number): Promise<Whitepaper[]>;
  incrementDownloadCount(id: string): Promise<void>;
}

export interface IWebinarRepository extends IRepository<Webinar> {
  findBySlug(slug: string): Promise<Webinar | null>;
  findUpcoming(limit?: number): Promise<Webinar[]>;
  findOnDemand(limit?: number): Promise<Webinar[]>;
  findFeatured(limit?: number): Promise<Webinar[]>;
}

export interface IResourceLeadRepository extends IRepository<ResourceLead> {
  findByEmail(email: string): Promise<ResourceLead[]>;
  findByResource(resourceType: string, resourceId: string): Promise<ResourceLead[]>;
  validateToken(token: string): Promise<ResourceLead | null>;
  markTokenUsed(id: string): Promise<void>;
}

/**
 * Consent Repository
 */
export interface IConsentRepository extends IRepository<ConsentRecord> {
  findBySessionId(sessionId: string): Promise<ConsentRecord | null>;
  upsertBySession(sessionId: string, data: Partial<ConsentRecord>): Promise<ConsentRecord>;
}
