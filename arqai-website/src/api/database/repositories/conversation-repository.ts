/**
 * Conversation Repository Implementation
 *
 * Supabase-based implementation of conversation repository interface.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { IConversationRepository, Conversation, Message } from "@/src/core";
import { BaseRepository } from "./base-repository";
import { Tables } from "../supabase-client";

/**
 * Conversation repository implementation
 */
export class ConversationRepository
  extends BaseRepository<Conversation>
  implements IConversationRepository
{
  constructor(client?: SupabaseClient) {
    super(Tables.CONVERSATIONS, client);
  }

  async findBySessionId(sessionId: string): Promise<Conversation[]> {
    const { data, error } = await this.client
      .from(this.tableName)
      .select("*")
      .eq("session_id", sessionId)
      .order("started_at", { ascending: false });

    if (error || !data) return [];
    return data.map((item) => this.mapFromDb(item));
  }

  async findActiveBySession(sessionId: string): Promise<Conversation | null> {
    const { data, error } = await this.client
      .from(this.tableName)
      .select("*")
      .eq("session_id", sessionId)
      .eq("is_active", true)
      .order("started_at", { ascending: false })
      .limit(1)
      .single();

    if (error || !data) return null;
    return this.mapFromDb(data);
  }

  async addMessage(
    conversationId: string,
    message: Message
  ): Promise<Conversation> {
    // Get current conversation
    const { data: current, error: fetchError } = await this.client
      .from(this.tableName)
      .select("messages")
      .eq("id", conversationId)
      .single();

    if (fetchError) {
      throw new Error(`Failed to fetch conversation: ${fetchError.message}`);
    }

    // Append new message
    const messages = (current?.messages as Message[]) || [];
    messages.push({
      ...message,
      id: message.id || this.generateMessageId(),
      timestamp: message.timestamp || new Date(),
    });

    // Update conversation
    const { data, error } = await this.client
      .from(this.tableName)
      .update({
        messages,
        updated_at: new Date().toISOString(),
      })
      .eq("id", conversationId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to add message: ${error.message}`);
    }

    return this.mapFromDb(data);
  }

  async endConversation(id: string): Promise<void> {
    const { error } = await this.client
      .from(this.tableName)
      .update({
        is_active: false,
        ended_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      throw new Error(`Failed to end conversation: ${error.message}`);
    }
  }

  /**
   * Get recent conversations for analytics
   */
  async findRecent(limit: number = 100): Promise<Conversation[]> {
    const { data, error } = await this.client
      .from(this.tableName)
      .select("*")
      .order("started_at", { ascending: false })
      .limit(limit);

    if (error || !data) return [];
    return data.map((item) => this.mapFromDb(item));
  }

  /**
   * Get conversations by user ID
   */
  async findByUserId(userId: string): Promise<Conversation[]> {
    const { data, error } = await this.client
      .from(this.tableName)
      .select("*")
      .eq("user_id", userId)
      .order("started_at", { ascending: false });

    if (error || !data) return [];
    return data.map((item) => this.mapFromDb(item));
  }

  /**
   * Get conversation statistics
   */
  async getStats(): Promise<{
    total: number;
    active: number;
    avgMessageCount: number;
  }> {
    const [totalResult, activeResult, messagesResult] = await Promise.all([
      this.client.from(this.tableName).select("*", { count: "exact", head: true }),
      this.client
        .from(this.tableName)
        .select("*", { count: "exact", head: true })
        .eq("is_active", true),
      this.client.from(this.tableName).select("messages"),
    ]);

    const total = totalResult.count || 0;
    const active = activeResult.count || 0;

    let totalMessages = 0;
    if (messagesResult.data) {
      for (const conv of messagesResult.data) {
        totalMessages += ((conv.messages as Message[]) || []).length;
      }
    }

    return {
      total,
      active,
      avgMessageCount: total > 0 ? totalMessages / total : 0,
    };
  }

  /**
   * Map database record to domain model
   */
  protected override mapFromDb(data: Record<string, unknown>): Conversation {
    const base = super.mapFromDb(data);
    const mapped = base as unknown as Record<string, unknown>;

    // Parse messages from JSONB
    if (data.messages && Array.isArray(data.messages)) {
      mapped.messages = (data.messages as Record<string, unknown>[]).map((m) => ({
        ...m,
        timestamp: m.timestamp ? new Date(m.timestamp as string) : new Date(),
      }));
    } else {
      mapped.messages = [];
    }

    // Parse page context from JSONB
    if (data.page_context) {
      mapped.pageContext = data.page_context;
    }

    return mapped as unknown as Conversation;
  }

  /**
   * Generate unique message ID
   */
  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

/**
 * Factory function
 */
export function createConversationRepository(
  client?: SupabaseClient
): ConversationRepository {
  return new ConversationRepository(client);
}
