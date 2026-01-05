import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { LeadIntelligence, User, Conversation, Message, BehavioralSignal } from "@/types";
import { generateLeadIntelligence, getLeadPriorityTier } from "./lead-intelligence";
import { sendLeadNotification, sendUserConfirmation } from "@/lib/email/resend";
import { addSubscriber, getIntentTags } from "@/lib/email/mailchimp";

// Database types for Supabase (simplified)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Database = any;

// Lazy-initialized Supabase client for server-side operations
let supabaseClient: SupabaseClient<Database> | null = null;

function getSupabaseClient(): SupabaseClient<Database> | null {
  if (!supabaseClient) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
      console.warn("Supabase credentials not configured");
      return null;
    }

    supabaseClient = createClient<Database>(url, key);
  }
  return supabaseClient;
}

/**
 * Create or update a user record
 */
export async function upsertUser(
  sessionId: string,
  userInfo: Partial<User>
): Promise<User | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    // Check if user exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("*")
      .eq("session_id", sessionId)
      .single();

    if (existingUser) {
      // Update existing user
      const { data, error } = await supabase
        .from("users")
        .update({
          ...userInfo,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingUser.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      // Create new user
      const { data, error } = await supabase
        .from("users")
        .insert({
          session_id: sessionId,
          ...userInfo,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  } catch (error) {
    console.error("Error upserting user:", error);
    return null;
  }
}

/**
 * Store or update a conversation
 */
export async function upsertConversation(
  userId: string,
  sessionId: string,
  messages: Message[],
  pageContext?: { current_page: string }
): Promise<Conversation | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    // Check for existing conversation
    const { data: existingConvo } = await supabase
      .from("conversations")
      .select("*")
      .eq("session_id", sessionId)
      .eq("is_active", true)
      .single();

    if (existingConvo) {
      // Update existing conversation
      const { data, error } = await supabase
        .from("conversations")
        .update({
          messages: messages,
          page_context: pageContext,
        })
        .eq("id", existingConvo.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      // Create new conversation
      const { data, error } = await supabase
        .from("conversations")
        .insert({
          user_id: userId,
          session_id: sessionId,
          messages: messages,
          page_context: pageContext,
          started_at: new Date().toISOString(),
          is_active: true,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  } catch (error) {
    console.error("Error upserting conversation:", error);
    return null;
  }
}

/**
 * Store or update lead intelligence
 */
export async function upsertLeadIntelligence(
  userId: string,
  intelligence: Partial<LeadIntelligence>
): Promise<LeadIntelligence | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    // Check for existing record
    const { data: existing } = await supabase
      .from("lead_intelligence")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (existing) {
      // Merge behavioral signals
      const existingSignals = existing.behavioral_signals || [];
      const newSignals = intelligence.behavioral_signals || [];
      const mergedSignals = [...existingSignals, ...newSignals];

      // Keep only the last 50 signals
      const limitedSignals = mergedSignals.slice(-50);

      // Update with new data
      const { data, error } = await supabase
        .from("lead_intelligence")
        .update({
          ...intelligence,
          behavioral_signals: limitedSignals,
          // Take higher intent score
          buy_intent_score: Math.max(
            existing.buy_intent_score || 0,
            intelligence.buy_intent_score || 0
          ),
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      // Create new record
      const { data, error } = await supabase
        .from("lead_intelligence")
        .insert({
          user_id: userId,
          ...intelligence,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  } catch (error) {
    console.error("Error upserting lead intelligence:", error);
    return null;
  }
}

/**
 * Process a chat message and update lead intelligence
 */
export async function processMessageForIntelligence(
  sessionId: string,
  userMessage: string,
  userInfo: {
    name?: string;
    email?: string;
    company?: string;
    jobTitle?: string;
  },
  conversationHistory: Array<{ role: string; content: string }>
): Promise<{
  user: User | null;
  intelligence: Partial<LeadIntelligence> | null;
  priorityTier: "tier1" | "tier2" | "tier3";
}> {
  try {
    // Get or create user
    const user = await upsertUser(sessionId, {
      name: userInfo.name,
      email: userInfo.email,
      company: userInfo.company,
      job_title: userInfo.jobTitle,
    });

    if (!user) {
      return { user: null, intelligence: null, priorityTier: "tier3" };
    }

    // Collect all user messages for analysis
    const allUserMessages = conversationHistory
      .filter((m) => m.role === "user")
      .map((m) => m.content);
    allUserMessages.push(userMessage);

    // Generate lead intelligence
    const intelligence = generateLeadIntelligence(
      user.id,
      allUserMessages,
      userInfo
    );

    // Store in database
    await upsertLeadIntelligence(user.id, intelligence);

    // Determine priority tier
    const priorityTier = getLeadPriorityTier(intelligence);

    // Send notifications for high-priority leads (non-blocking)
    if (priorityTier === "tier1" || intelligence.intent_category === "hot") {
      sendLeadNotification({
        name: userInfo.name,
        email: userInfo.email,
        company: userInfo.company,
        jobTitle: userInfo.jobTitle,
        intentScore: intelligence.buy_intent_score || 0,
        intentCategory: intelligence.intent_category || "cold",
        urgency: intelligence.urgency || "low",
        companySize: intelligence.company_size,
        industry: intelligence.company_research?.industry,
        complianceRequirements: intelligence.company_research?.compliance_requirements,
        signalSummary: intelligence.behavioral_signals
          ?.slice(-5)
          .map((s) => `${s.type}: ${s.content.substring(0, 50)}...`)
          .join("\n"),
      }).catch(console.error);
    }

    // Send user confirmation if email is provided (first time only)
    if (userInfo.email && userInfo.name) {
      // Check if we've already sent a confirmation (simplified check)
      const emailKey = `confirmation_sent_${userInfo.email}`;
      if (typeof window === "undefined") {
        // Server-side - could use database flag, but for now just send
        sendUserConfirmation({
          name: userInfo.name,
          email: userInfo.email,
        }).catch(console.error);
      }
    }

    // Add to Mailchimp (non-blocking)
    if (userInfo.email) {
      const nameParts = (userInfo.name || "").split(" ");
      addSubscriber({
        email: userInfo.email,
        firstName: nameParts[0],
        lastName: nameParts.slice(1).join(" "),
        company: userInfo.company,
        jobTitle: userInfo.jobTitle,
        tags: getIntentTags(
          intelligence.intent_category || "cold",
          intelligence.company_size,
          intelligence.company_research?.industry
        ),
      }).catch(console.error);
    }

    return { user, intelligence, priorityTier };
  } catch (error) {
    console.error("Error processing message for intelligence:", error);
    return { user: null, intelligence: null, priorityTier: "tier3" };
  }
}

/**
 * Get lead intelligence by session ID
 */
export async function getLeadBySession(sessionId: string): Promise<{
  user: User | null;
  intelligence: LeadIntelligence | null;
} | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    const { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("session_id", sessionId)
      .single();

    if (!user) return { user: null, intelligence: null };

    const { data: intelligence } = await supabase
      .from("lead_intelligence")
      .select("*")
      .eq("user_id", user.id)
      .single();

    return { user, intelligence };
  } catch (error) {
    console.error("Error getting lead by session:", error);
    return null;
  }
}

/**
 * Get all leads for admin dashboard
 */
export async function getAllLeads(filters?: {
  intent_category?: string;
  company_size?: string;
  urgency?: string;
  qualification_status?: string;
}): Promise<Array<{ user: User; intelligence: LeadIntelligence }>> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  try {
    // Build query for lead intelligence
    let query = supabase
      .from("lead_intelligence")
      .select("*, users!inner(*)")
      .order("updated_at", { ascending: false });

    // Apply filters
    if (filters?.intent_category) {
      query = query.eq("intent_category", filters.intent_category);
    }
    if (filters?.company_size) {
      query = query.eq("company_size", filters.company_size);
    }
    if (filters?.urgency) {
      query = query.eq("urgency", filters.urgency);
    }
    if (filters?.qualification_status) {
      query = query.eq("qualification_status", filters.qualification_status);
    }

    const { data, error } = await query.limit(100);

    if (error) throw error;

    return (data || []).map((item) => ({
      user: item.users as User,
      intelligence: item as LeadIntelligence,
    }));
  } catch (error) {
    console.error("Error getting all leads:", error);
    return [];
  }
}

/**
 * Get lead statistics for dashboard
 */
export async function getLeadStats(): Promise<{
  total: number;
  hot: number;
  warm: number;
  cold: number;
  qualified: number;
  enterprise: number;
  recentLeads: number;
}> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { total: 0, hot: 0, warm: 0, cold: 0, qualified: 0, enterprise: 0, recentLeads: 0 };
  }

  try {
    // Get total count
    const { count: total } = await supabase
      .from("lead_intelligence")
      .select("*", { count: "exact", head: true });

    // Get hot leads
    const { count: hot } = await supabase
      .from("lead_intelligence")
      .select("*", { count: "exact", head: true })
      .eq("intent_category", "hot");

    // Get warm leads
    const { count: warm } = await supabase
      .from("lead_intelligence")
      .select("*", { count: "exact", head: true })
      .eq("intent_category", "warm");

    // Get cold leads
    const { count: cold } = await supabase
      .from("lead_intelligence")
      .select("*", { count: "exact", head: true })
      .eq("intent_category", "cold");

    // Get qualified leads
    const { count: qualified } = await supabase
      .from("lead_intelligence")
      .select("*", { count: "exact", head: true })
      .eq("qualification_status", "qualified");

    // Get enterprise leads
    const { count: enterprise } = await supabase
      .from("lead_intelligence")
      .select("*", { count: "exact", head: true })
      .eq("company_size", "enterprise");

    // Get leads from last 24 hours
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { count: recentLeads } = await supabase
      .from("lead_intelligence")
      .select("*", { count: "exact", head: true })
      .gte("created_at", oneDayAgo);

    return {
      total: total || 0,
      hot: hot || 0,
      warm: warm || 0,
      cold: cold || 0,
      qualified: qualified || 0,
      enterprise: enterprise || 0,
      recentLeads: recentLeads || 0,
    };
  } catch (error) {
    console.error("Error getting lead stats:", error);
    return { total: 0, hot: 0, warm: 0, cold: 0, qualified: 0, enterprise: 0, recentLeads: 0 };
  }
}

/**
 * Record a session for tracking
 */
export async function recordSession(
  sessionId: string,
  data: {
    ipAddress?: string;
    userAgent?: string;
    country?: string;
    language?: string;
    currentPage?: string;
  }
): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) return;

  try {
    const { data: existing } = await supabase
      .from("sessions")
      .select("id, pages_visited")
      .eq("session_id", sessionId)
      .single();

    const pageVisit = data.currentPage
      ? {
          page: data.currentPage,
          timestamp: new Date().toISOString(),
          duration: 0,
        }
      : null;

    if (existing) {
      // Update existing session
      const pagesVisited = existing.pages_visited || [];
      if (pageVisit && !pagesVisited.some((p: { page: string }) => p.page === pageVisit.page)) {
        pagesVisited.push(pageVisit);
      }

      await supabase
        .from("sessions")
        .update({
          last_activity: new Date().toISOString(),
          pages_visited: pagesVisited,
        })
        .eq("id", existing.id);
    } else {
      // Create new session
      await supabase.from("sessions").insert({
        session_id: sessionId,
        ip_address: data.ipAddress,
        user_agent: data.userAgent,
        detected_country: data.country,
        detected_language: data.language,
        pages_visited: pageVisit ? [pageVisit] : [],
        first_visit: new Date().toISOString(),
        last_activity: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error("Error recording session:", error);
  }
}
