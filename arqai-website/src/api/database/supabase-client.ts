/**
 * Supabase Client Factory
 *
 * Creates and exports Supabase client instances for different contexts.
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * Database configuration
 */
export interface SupabaseConfig {
  url: string;
  anonKey: string;
  serviceRoleKey?: string;
}

/**
 * Get configuration from environment
 */
function getConfig(): SupabaseConfig {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !anonKey) {
    throw new Error("Supabase URL and Anon Key are required");
  }

  return { url, anonKey, serviceRoleKey };
}

/**
 * Singleton clients
 */
let browserClient: SupabaseClient | null = null;
let serverClient: SupabaseClient | null = null;

/**
 * Get Supabase client for browser/client-side use
 * Uses the anon key with RLS policies
 */
export function getSupabaseBrowserClient(): SupabaseClient {
  if (!browserClient) {
    const config = getConfig();
    browserClient = createClient(config.url, config.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }
  return browserClient;
}

/**
 * Get Supabase client for server-side use
 * Uses service role key to bypass RLS
 */
export function getSupabaseServerClient(): SupabaseClient {
  if (!serverClient) {
    const config = getConfig();
    const key = config.serviceRoleKey || config.anonKey;

    serverClient = createClient(config.url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
  return serverClient;
}

/**
 * Create a new Supabase client with custom config
 */
export function createSupabaseClient(
  config: Partial<SupabaseConfig> = {}
): SupabaseClient {
  const defaultConfig = getConfig();
  const mergedConfig = { ...defaultConfig, ...config };

  return createClient(mergedConfig.url, mergedConfig.anonKey);
}

/**
 * Helper to check if we're on the server
 */
export function isServer(): boolean {
  return typeof window === "undefined";
}

/**
 * Get the appropriate client based on context
 */
export function getSupabaseClient(): SupabaseClient {
  return isServer() ? getSupabaseServerClient() : getSupabaseBrowserClient();
}

/**
 * Database table names
 */
export const Tables = {
  USERS: "users",
  SESSIONS: "sessions",
  CONVERSATIONS: "conversations",
  LEAD_INTELLIGENCE: "lead_intelligence",
  LEAD_PROFILES: "lead_profiles",
  TOUCHPOINT_EVENTS: "touchpoint_events",
  LEAD_ALERTS: "lead_alerts",
  BLOG_POSTS: "blog_posts",
  CASE_STUDIES: "case_studies",
  WHITEPAPERS: "whitepapers",
  WEBINARS: "webinars",
  CONTACT_SUBMISSIONS: "contact_submissions",
  PARTNER_ENQUIRIES: "partner_enquiries",
  RESOURCE_LEADS: "resource_leads",
  CONSENT_RECORDS: "consent_records",
  NEWSLETTER_SUBSCRIBERS: "newsletter_subscribers",
} as const;

export type TableName = (typeof Tables)[keyof typeof Tables];
