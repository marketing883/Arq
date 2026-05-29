/**
 * Lead Repository Implementation
 *
 * Supabase-based implementation of lead repository interface.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  ILeadRepository,
  LeadIntelligence,
  LeadScoreUpdate,
} from "@/src/core";
import { BaseRepository } from "./base-repository";
import { Tables } from "../supabase-client";

/**
 * Lead repository implementation
 */
export class LeadRepository
  extends BaseRepository<LeadIntelligence>
  implements ILeadRepository
{
  constructor(client?: SupabaseClient) {
    super(Tables.LEAD_PROFILES, client);
  }

  async findByUserId(userId: string): Promise<LeadIntelligence | null> {
    const { data, error } = await this.client
      .from(this.tableName)
      .select(`
        *,
        user:users(*)
      `)
      .eq("user_id", userId)
      .single();

    if (error || !data) return null;
    return this.mapFromDb(data);
  }

  async findByEmail(email: string): Promise<LeadIntelligence | null> {
    const { data, error } = await this.client
      .from(this.tableName)
      .select(`
        *,
        user:users(*)
      `)
      .eq("canonical_email", email.toLowerCase())
      .single();

    if (error || !data) return null;
    return this.mapFromDb(data);
  }

  async updateScore(
    id: string,
    scoreData: LeadScoreUpdate
  ): Promise<LeadIntelligence> {
    const { data, error } = await this.client
      .from(this.tableName)
      .update({
        composite_score: scoreData.score,
        intent_score: scoreData.intentScore,
        engagement_score: scoreData.engagementScore,
        icp_fit_score: scoreData.icpFitScore,
        journey_stage: scoreData.journeyStage,
        priority_tier: scoreData.priorityTier,
        score_calculated_at: scoreData.scoreCalculatedAt.toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select(`
        *,
        user:users(*)
      `)
      .single();

    if (error) {
      throw new Error(`Failed to update lead score: ${error.message}`);
    }

    return this.mapFromDb(data);
  }

  async findByJourneyStage(stage: string): Promise<LeadIntelligence[]> {
    const { data, error } = await this.client
      .from(this.tableName)
      .select(`
        *,
        user:users(*)
      `)
      .eq("journey_stage", stage)
      .order("composite_score", { ascending: false });

    if (error || !data) return [];
    return data.map((item) => this.mapFromDb(item));
  }

  async findByPriorityTier(tier: string): Promise<LeadIntelligence[]> {
    const { data, error } = await this.client
      .from(this.tableName)
      .select(`
        *,
        user:users(*)
      `)
      .eq("priority_tier", tier)
      .order("composite_score", { ascending: false });

    if (error || !data) return [];
    return data.map((item) => this.mapFromDb(item));
  }

  async findHotLeads(limit: number = 20): Promise<LeadIntelligence[]> {
    const { data, error } = await this.client
      .from(this.tableName)
      .select(`
        *,
        user:users(*)
      `)
      .in("priority_tier", ["P1", "P2"])
      .order("composite_score", { ascending: false })
      .limit(limit);

    if (error || !data) return [];
    return data.map((item) => this.mapFromDb(item));
  }

  /**
   * Get leads with recent activity
   */
  async findRecentlyActive(hours: number = 48): Promise<LeadIntelligence[]> {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();

    const { data, error } = await this.client
      .from(this.tableName)
      .select(`
        *,
        user:users(*)
      `)
      .gte("last_touch", cutoff)
      .order("last_touch", { ascending: false });

    if (error || !data) return [];
    return data.map((item) => this.mapFromDb(item));
  }

  /**
   * Get leads with high engagement velocity
   */
  async findHighVelocity(threshold: number = 5): Promise<LeadIntelligence[]> {
    const { data, error } = await this.client
      .from(this.tableName)
      .select(`
        *,
        user:users(*)
      `)
      .gte("engagement_velocity", threshold)
      .order("engagement_velocity", { ascending: false });

    if (error || !data) return [];
    return data.map((item) => this.mapFromDb(item));
  }

  /**
   * Get dormant high-value leads
   */
  async findDormantHighValue(
    scoreTreshold: number = 50,
    inactiveDays: number = 14
  ): Promise<LeadIntelligence[]> {
    const cutoff = new Date(
      Date.now() - inactiveDays * 24 * 60 * 60 * 1000
    ).toISOString();

    const { data, error } = await this.client
      .from(this.tableName)
      .select(`
        *,
        user:users(*)
      `)
      .gte("composite_score", scoreTreshold)
      .lte("last_touch", cutoff)
      .order("composite_score", { ascending: false });

    if (error || !data) return [];
    return data.map((item) => this.mapFromDb(item));
  }

  /**
   * Map database record to domain model
   */
  protected override mapFromDb(data: Record<string, unknown>): LeadIntelligence {
    const base = super.mapFromDb(data);
    const mapped = base as unknown as Record<string, unknown>;

    // Handle nested user data
    if (data.user && typeof data.user === "object") {
      mapped.user = super.mapFromDb(
        data.user as Record<string, unknown>
      );
    }

    // Map score fields
    mapped.score = data.composite_score;
    mapped.journeyStage = data.journey_stage;
    mapped.priorityTier = data.priority_tier;
    mapped.firstTouch = data.first_touch
      ? new Date(data.first_touch as string)
      : null;
    mapped.lastTouch = data.last_touch
      ? new Date(data.last_touch as string)
      : null;

    return mapped as unknown as LeadIntelligence;
  }
}

/**
 * Factory function
 */
export function createLeadRepository(client?: SupabaseClient): LeadRepository {
  return new LeadRepository(client);
}
