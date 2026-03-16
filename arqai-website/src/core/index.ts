/**
 * Core Module
 *
 * This is the main entry point for the core domain module.
 * It exports all domain models, interfaces, and events.
 *
 * Usage:
 *   import { User, LeadIntelligence, ILeadService } from "@/src/core";
 *
 * The core module is framework-agnostic and contains:
 * - Domain models (entities and value objects)
 * - Service interfaces (contracts for business logic)
 * - Repository interfaces (contracts for data access)
 * - Integration interfaces (contracts for external services)
 * - Domain events (for event-driven architecture)
 */

// Domain Models
export * from "./domain";

// Interfaces
export * from "./interfaces";

// Events
export * from "./events";

// Re-export commonly used types for convenience
export type {
  // User domain
  User,
  AdminUser,
  UserSession,
  PageVisit,
  UserResearch,
  Seniority,
  AdminRole,
} from "./domain/user";

export type {
  // Lead domain
  LeadIntelligence,
  LeadAlert,
  TouchpointEvent,
  BehavioralSignal,
  CompanyResearch,
  IntentCategory,
  UrgencyLevel,
  CompanySize,
  QualificationStatus,
  JourneyStage,
  PriorityTier,
  RecommendedChannel,
  TouchpointSource,
  AlertType,
  AlertPriority,
  AlertStatus,
  BehavioralSignalType,
} from "./domain/lead";

export type {
  // Conversation domain
  Conversation,
  Message,
  PageContext,
  DetectedIntent,
  MessageRole,
  ConversationIntent,
  MessageMetadata,
  ConversationMetadata,
} from "./domain/conversation";

export type {
  // Content domain
  BlogPost,
  CaseStudy,
  Whitepaper,
  Webinar,
  ResourceLead,
  ContentStatus,
  SEOMetadata,
  CaseStudySection,
  CaseStudyMetric,
  Testimonial,
  Presenter,
  WebinarStatus,
  BaseContent,
} from "./domain/content";

export type {
  // Analytics domain
  ConsentRecord,
  ConsentPreferences,
  ConsentType,
  AnalyticsEvent,
  PageAnalytics,
  LeadAnalytics,
  AnalyticsPeriod,
  PredictiveScoringConfig,
  SignalWeight,
  VelocityBonus,
  ICPCriteria,
} from "./domain/analytics";

export type {
  // Service interfaces
  ILeadService,
  IConversationService,
  IUserService,
  IContentService,
  IConsentService,
  IEmailService,
  IAIService,
  ContentListOptions,
  ContentListResult,
  EmailOptions,
  EmailResult,
  AIResponse,
  LeadAnalysisInput,
  LeadAnalysisResult,
  ContentGenerationOptions,
} from "./interfaces/services";

export type {
  // Repository interfaces
  IRepository,
  IUserRepository,
  ISessionRepository,
  ILeadRepository,
  IAlertRepository,
  ITouchpointRepository,
  IConversationRepository,
  IBlogPostRepository,
  ICaseStudyRepository,
  IWhitepaperRepository,
  IWebinarRepository,
  IResourceLeadRepository,
  IConsentRepository,
  FindOptions,
  LeadScoreUpdate,
} from "./interfaces/repositories";

export type {
  // Integration interfaces
  IIntegration,
  INotificationIntegration,
  ICRMIntegration,
  ICalendarIntegration,
  IEnrichmentIntegration,
  IWebhookIntegration,
  IntegrationStatus,
  IntegrationTestResult,
  NotificationPayload,
  NotificationResult,
  CRMLeadData,
  CRMContactData,
  CRMAccountData,
  CRMActivityData,
  CRMSyncResult,
  CalendarSlot,
  BookingRequest,
  BookingResult,
  EnrichedCompanyData,
  EnrichedPersonData,
  WebhookResult,
} from "./interfaces/integrations";

export {
  // Event emitter
  EventEmitter,
  getEventBus,
  resetEventBus,
  generateEventId,
  createEventMetadata,
} from "./events/emitter";

export type {
  // Event types
  DomainEvent,
  EventMetadata,
  ArqDomainEvent,
  ArqEventType,
  LeadCreatedEvent,
  LeadScoredEvent,
  LeadStageChangedEvent,
  LeadAlertTriggeredEvent,
  TouchpointRecordedEvent,
  ConversationStartedEvent,
  ConversationMessageEvent,
  ConversationEndedEvent,
  FormSubmittedEvent,
  ContentViewedEvent,
  ContentDownloadedEvent,
  NotificationSentEvent,
} from "./events/types";
