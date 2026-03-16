/**
 * Domain Event Types
 *
 * Defines all domain events in the system.
 */

import type { JourneyStage, PriorityTier, TouchpointSource } from "../domain/lead";
import type { MessageRole } from "../domain/conversation";

/**
 * Base event interface
 */
export interface DomainEvent {
  readonly eventId: string;
  readonly eventType: string;
  readonly timestamp: Date;
  readonly metadata?: EventMetadata;
}

export interface EventMetadata {
  correlationId?: string;
  causationId?: string;
  userId?: string;
  sessionId?: string;
  source?: string;
}

/**
 * Lead Events
 */
export interface LeadCreatedEvent extends DomainEvent {
  eventType: "lead.created";
  data: {
    leadId: string;
    userId?: string;
    email?: string;
    source: TouchpointSource;
    initialScore: number;
  };
}

export interface LeadScoredEvent extends DomainEvent {
  eventType: "lead.scored";
  data: {
    leadId: string;
    previousScore: number;
    newScore: number;
    scoreDelta: number;
    journeyStage: JourneyStage;
    priorityTier: PriorityTier;
    signals: Array<{ type: string; weight: number }>;
  };
}

export interface LeadStageChangedEvent extends DomainEvent {
  eventType: "lead.stage_changed";
  data: {
    leadId: string;
    previousStage: JourneyStage;
    newStage: JourneyStage;
    trigger: string;
  };
}

export interface LeadAlertTriggeredEvent extends DomainEvent {
  eventType: "lead.alert_triggered";
  data: {
    alertId: string;
    leadId: string;
    alertType: string;
    priority: string;
    title: string;
    message: string;
  };
}

/**
 * Touchpoint Events
 */
export interface TouchpointRecordedEvent extends DomainEvent {
  eventType: "touchpoint.recorded";
  data: {
    touchpointId: string;
    leadId: string;
    source: TouchpointSource;
    eventType: string;
    scoreContribution: number;
    signalsDetected: string[];
  };
}

/**
 * Conversation Events
 */
export interface ConversationStartedEvent extends DomainEvent {
  eventType: "conversation.started";
  data: {
    conversationId: string;
    sessionId: string;
    userId?: string;
    pageUrl?: string;
  };
}

export interface ConversationMessageEvent extends DomainEvent {
  eventType: "conversation.message";
  data: {
    conversationId: string;
    messageId: string;
    role: MessageRole;
    intentDetected?: string;
    signalsDetected?: string[];
  };
}

export interface ConversationEndedEvent extends DomainEvent {
  eventType: "conversation.ended";
  data: {
    conversationId: string;
    messageCount: number;
    duration: number;
    leadCaptured: boolean;
    intentsDetected: string[];
  };
}

/**
 * Form Events
 */
export interface FormSubmittedEvent extends DomainEvent {
  eventType: "form.submitted";
  data: {
    formType: "contact" | "partner" | "resource_download" | "newsletter";
    submissionId: string;
    email: string;
    leadId?: string;
    fields: Record<string, string>;
  };
}

/**
 * Content Events
 */
export interface ContentViewedEvent extends DomainEvent {
  eventType: "content.viewed";
  data: {
    contentType: "blog" | "case_study" | "whitepaper" | "webinar";
    contentId: string;
    slug: string;
    sessionId: string;
    userId?: string;
    duration?: number;
  };
}

export interface ContentDownloadedEvent extends DomainEvent {
  eventType: "content.downloaded";
  data: {
    contentType: "whitepaper" | "case_study";
    contentId: string;
    leadId: string;
    email: string;
  };
}

/**
 * Notification Events
 */
export interface NotificationSentEvent extends DomainEvent {
  eventType: "notification.sent";
  data: {
    channel: "email" | "slack" | "teams";
    recipient: string;
    templateId?: string;
    success: boolean;
    error?: string;
  };
}

/**
 * Union type of all domain events
 */
export type ArqDomainEvent =
  | LeadCreatedEvent
  | LeadScoredEvent
  | LeadStageChangedEvent
  | LeadAlertTriggeredEvent
  | TouchpointRecordedEvent
  | ConversationStartedEvent
  | ConversationMessageEvent
  | ConversationEndedEvent
  | FormSubmittedEvent
  | ContentViewedEvent
  | ContentDownloadedEvent
  | NotificationSentEvent;

/**
 * Event type string union
 */
export type ArqEventType = ArqDomainEvent["eventType"];
