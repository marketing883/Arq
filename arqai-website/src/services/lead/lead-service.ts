/**
 * Lead Service Implementation
 *
 * Handles lead intelligence operations including scoring,
 * touchpoint processing, and journey stage management.
 */

import type {
  ILeadService,
  ILeadRepository,
  ITouchpointRepository,
  IAlertRepository,
} from "@/src/core";
import type {
  LeadIntelligence,
  LeadAlert,
  TouchpointEvent,
  JourneyStage,
  PriorityTier,
} from "@/src/core";
import { getEventBus, generateEventId, createEventMetadata } from "@/src/core";
import type { LeadScoredEvent, LeadStageChangedEvent, TouchpointRecordedEvent } from "@/src/core";
import { calculateLeadScore, determineJourneyStage, determinePriorityTier } from "./scoring";
import { evaluateAlertRules } from "./alerts";

export interface LeadServiceDependencies {
  leadRepository: ILeadRepository;
  touchpointRepository: ITouchpointRepository;
  alertRepository: IAlertRepository;
}

export class LeadService implements ILeadService {
  private leadRepo: ILeadRepository;
  private touchpointRepo: ITouchpointRepository;
  private alertRepo: IAlertRepository;
  private eventBus = getEventBus();

  constructor(deps: LeadServiceDependencies) {
    this.leadRepo = deps.leadRepository;
    this.touchpointRepo = deps.touchpointRepository;
    this.alertRepo = deps.alertRepository;
  }

  async getByUserId(userId: string): Promise<LeadIntelligence | null> {
    return this.leadRepo.findByUserId(userId);
  }

  async getByEmail(email: string): Promise<LeadIntelligence | null> {
    return this.leadRepo.findByEmail(email);
  }

  async calculateScore(userId: string): Promise<LeadIntelligence> {
    const lead = await this.leadRepo.findByUserId(userId);
    if (!lead) {
      throw new Error(`Lead not found for user: ${userId}`);
    }

    const touchpoints = await this.touchpointRepo.findByLeadId(lead.id);
    const previousScore = lead.score;

    // Calculate new scores
    const scoreResult = calculateLeadScore(lead, touchpoints);

    // Determine journey stage and priority
    const newJourneyStage = determineJourneyStage(lead, scoreResult);
    const newPriorityTier = determinePriorityTier(lead, scoreResult);

    // Update lead with new scores
    const updatedLead = await this.leadRepo.updateScore(lead.id, {
      score: scoreResult.compositeScore,
      intentScore: scoreResult.intentScore,
      engagementScore: scoreResult.engagementScore,
      icpFitScore: scoreResult.icpFitScore,
      journeyStage: newJourneyStage,
      priorityTier: newPriorityTier,
      scoreCalculatedAt: new Date(),
    });

    // Emit score event
    const scoredEvent: LeadScoredEvent = {
      eventId: generateEventId(),
      eventType: "lead.scored",
      timestamp: new Date(),
      metadata: createEventMetadata({ userId }),
      data: {
        leadId: lead.id,
        previousScore,
        newScore: scoreResult.compositeScore,
        scoreDelta: scoreResult.compositeScore - previousScore,
        journeyStage: newJourneyStage,
        priorityTier: newPriorityTier,
        signals: scoreResult.signals.map((s) => ({ type: s.type, weight: s.weight })),
      },
    };
    this.eventBus.emit(scoredEvent);

    // Check for journey stage change
    if (lead.journeyStage !== newJourneyStage) {
      const stageEvent: LeadStageChangedEvent = {
        eventId: generateEventId(),
        eventType: "lead.stage_changed",
        timestamp: new Date(),
        metadata: createEventMetadata({ userId }),
        data: {
          leadId: lead.id,
          previousStage: lead.journeyStage,
          newStage: newJourneyStage,
          trigger: "score_calculation",
        },
      };
      this.eventBus.emit(stageEvent);
    }

    // Evaluate alert rules
    const alerts = await evaluateAlertRules(updatedLead, scoreResult);
    for (const alert of alerts) {
      await this.alertRepo.create(alert);
    }

    return updatedLead;
  }

  async processTouchpoint(event: TouchpointEvent): Promise<LeadIntelligence> {
    // Record the touchpoint
    const savedTouchpoint = await this.touchpointRepo.create(event);

    // Emit touchpoint event
    const touchpointEvent: TouchpointRecordedEvent = {
      eventId: generateEventId(),
      eventType: "touchpoint.recorded",
      timestamp: new Date(),
      metadata: createEventMetadata({ sessionId: event.sessionId }),
      data: {
        touchpointId: savedTouchpoint.id,
        leadId: event.leadProfileId,
        source: event.source,
        eventType: event.eventType,
        scoreContribution: event.scoreContribution,
        signalsDetected: [], // Signals are detected during scoring
      },
    };
    this.eventBus.emit(touchpointEvent);

    // Get lead and recalculate score
    const lead = await this.leadRepo.findById(event.leadProfileId);
    if (!lead) {
      throw new Error(`Lead not found: ${event.leadProfileId}`);
    }

    return this.calculateScore(lead.userId);
  }

  async getAlerts(leadId: string): Promise<LeadAlert[]> {
    return this.alertRepo.findByLeadId(leadId);
  }

  async acknowledgeAlert(alertId: string, userId: string): Promise<void> {
    await this.alertRepo.acknowledge(alertId, userId);
  }

  async getByJourneyStage(stage: JourneyStage): Promise<LeadIntelligence[]> {
    return this.leadRepo.findByJourneyStage(stage);
  }

  async getByPriorityTier(tier: PriorityTier): Promise<LeadIntelligence[]> {
    return this.leadRepo.findByPriorityTier(tier);
  }

  /**
   * Get hot leads (P1 and P2) for sales dashboard
   */
  async getHotLeads(limit = 20): Promise<LeadIntelligence[]> {
    return this.leadRepo.findHotLeads(limit);
  }

  /**
   * Clean up expired alerts
   */
  async cleanupExpiredAlerts(): Promise<number> {
    return this.alertRepo.cleanupExpired();
  }
}
