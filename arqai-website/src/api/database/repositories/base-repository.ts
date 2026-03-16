/**
 * Base Repository Implementation
 *
 * Abstract base class for Supabase-based repositories.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { IRepository, FindOptions } from "@/src/core";
import { getSupabaseServerClient, type TableName } from "../supabase-client";

/**
 * Base repository with common CRUD operations
 */
export abstract class BaseRepository<T, TCreate = Omit<T, "id" | "createdAt" | "updatedAt">>
  implements IRepository<T, TCreate>
{
  protected client: SupabaseClient;
  protected tableName: TableName;

  constructor(tableName: TableName, client?: SupabaseClient) {
    this.tableName = tableName;
    this.client = client || getSupabaseServerClient();
  }

  async findById(id: string): Promise<T | null> {
    const { data, error } = await this.client
      .from(this.tableName)
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) return null;
    return this.mapFromDb(data);
  }

  async findAll(options?: FindOptions): Promise<T[]> {
    let query = this.client.from(this.tableName).select("*");

    if (options?.where) {
      for (const [key, value] of Object.entries(options.where)) {
        if (key === "search") {
          // Handle search separately
          query = query.ilike("title", `%${value}%`);
        } else {
          query = query.eq(this.toSnakeCase(key), value);
        }
      }
    }

    if (options?.orderBy) {
      query = query.order(this.toSnakeCase(options.orderBy.field), {
        ascending: options.orderBy.direction === "asc",
      });
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.range(
        options.offset,
        options.offset + (options.limit || 10) - 1
      );
    }

    const { data, error } = await query;

    if (error || !data) return [];
    return data.map((item) => this.mapFromDb(item));
  }

  async create(data: TCreate): Promise<T> {
    const dbData = this.mapToDb(data as Record<string, unknown>);

    const { data: result, error } = await this.client
      .from(this.tableName)
      .insert(dbData)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create record: ${error.message}`);
    }

    return this.mapFromDb(result);
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    const dbData = this.mapToDb(data as Record<string, unknown>);
    dbData.updated_at = new Date().toISOString();

    const { data: result, error } = await this.client
      .from(this.tableName)
      .update(dbData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update record: ${error.message}`);
    }

    return this.mapFromDb(result);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.client
      .from(this.tableName)
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(`Failed to delete record: ${error.message}`);
    }
  }

  async count(options?: FindOptions): Promise<number> {
    let query = this.client
      .from(this.tableName)
      .select("*", { count: "exact", head: true });

    if (options?.where) {
      for (const [key, value] of Object.entries(options.where)) {
        if (key !== "search") {
          query = query.eq(this.toSnakeCase(key), value);
        }
      }
    }

    const { count, error } = await query;

    if (error) return 0;
    return count || 0;
  }

  /**
   * Map database record to domain model
   * Override in subclasses for custom mapping
   */
  protected mapFromDb(data: Record<string, unknown>): T {
    const mapped: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(data)) {
      const camelKey = this.toCamelCase(key);
      mapped[camelKey] = this.convertValue(value);
    }

    return mapped as T;
  }

  /**
   * Map domain model to database record
   * Override in subclasses for custom mapping
   */
  protected mapToDb(data: Record<string, unknown>): Record<string, unknown> {
    const mapped: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(data)) {
      const snakeKey = this.toSnakeCase(key);
      mapped[snakeKey] = value;
    }

    return mapped;
  }

  /**
   * Convert database value to domain value
   */
  protected convertValue(value: unknown): unknown {
    if (value === null || value === undefined) return value;

    // Convert ISO date strings to Date objects
    if (
      typeof value === "string" &&
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)
    ) {
      return new Date(value);
    }

    return value;
  }

  /**
   * Convert camelCase to snake_case
   */
  protected toSnakeCase(str: string): string {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
  }

  /**
   * Convert snake_case to camelCase
   */
  protected toCamelCase(str: string): string {
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
  }
}
