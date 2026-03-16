/**
 * User Repository Implementation
 *
 * Supabase-based implementation of user repository interface.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { IUserRepository, User } from "@/src/core";
import { BaseRepository } from "./base-repository";
import { Tables } from "../supabase-client";

/**
 * User repository implementation
 */
export class UserRepository
  extends BaseRepository<User>
  implements IUserRepository
{
  constructor(client?: SupabaseClient) {
    super(Tables.USERS, client);
  }

  async findBySessionId(sessionId: string): Promise<User | null> {
    const { data, error } = await this.client
      .from(this.tableName)
      .select("*")
      .eq("session_id", sessionId)
      .single();

    if (error || !data) return null;
    return this.mapFromDb(data);
  }

  async findByEmail(email: string): Promise<User | null> {
    const { data, error } = await this.client
      .from(this.tableName)
      .select("*")
      .eq("email", email.toLowerCase())
      .single();

    if (error || !data) return null;
    return this.mapFromDb(data);
  }

  async upsertBySession(
    sessionId: string,
    data: Partial<User>
  ): Promise<User> {
    const dbData = this.mapToDb({
      ...data,
      sessionId,
      updatedAt: new Date(),
    });

    const { data: result, error } = await this.client
      .from(this.tableName)
      .upsert(dbData, { onConflict: "session_id" })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to upsert user: ${error.message}`);
    }

    return this.mapFromDb(result);
  }

  /**
   * Merge users when email is captured
   * Updates all records with the same email to point to the canonical user
   */
  async mergeByEmail(email: string, canonicalUserId: string): Promise<void> {
    // Get all users with this email
    const { data: users } = await this.client
      .from(this.tableName)
      .select("id")
      .eq("email", email.toLowerCase())
      .neq("id", canonicalUserId);

    if (!users || users.length === 0) return;

    // Update related records to point to canonical user
    const userIds = users.map((u) => u.id);

    // Update conversations
    await this.client
      .from("conversations")
      .update({ user_id: canonicalUserId })
      .in("user_id", userIds);

    // Update lead intelligence
    await this.client
      .from("lead_intelligence")
      .update({ user_id: canonicalUserId })
      .in("user_id", userIds);

    // Delete duplicate users
    await this.client.from(this.tableName).delete().in("id", userIds);
  }

  /**
   * Get users with recent activity
   */
  async findRecentlyActive(hours: number = 24, limit: number = 100): Promise<User[]> {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();

    const { data, error } = await this.client
      .from(this.tableName)
      .select("*")
      .gte("updated_at", cutoff)
      .order("updated_at", { ascending: false })
      .limit(limit);

    if (error || !data) return [];
    return data.map((item) => this.mapFromDb(item));
  }

  /**
   * Get users by company domain
   */
  async findByCompanyDomain(domain: string): Promise<User[]> {
    const { data, error } = await this.client
      .from(this.tableName)
      .select("*")
      .ilike("email", `%@${domain}`);

    if (error || !data) return [];
    return data.map((item) => this.mapFromDb(item));
  }
}

/**
 * Factory function
 */
export function createUserRepository(client?: SupabaseClient): UserRepository {
  return new UserRepository(client);
}
