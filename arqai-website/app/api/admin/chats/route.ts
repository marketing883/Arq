/**
 * Admin Chats API: browse chatbot conversations.
 *
 * Lists every conversation the assistant has had, including anonymous
 * visitors who never shared an email (invisible in the lead pipeline but
 * full of "what are people asking us" signal). Identified chatters link to
 * their lead profile.
 *
 * GET  /api/admin/chats            -> conversation list (no full transcripts)
 * GET  /api/admin/chats?id=<uuid>  -> one conversation with full messages
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getAdminSession } from "@/lib/auth/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

interface ChatMessage {
  role: string;
  content: string;
}

export async function GET(request: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    const id = request.nextUrl.searchParams.get("id");

    // Detail: one conversation with the full transcript.
    if (id) {
      const { data: convo, error } = await supabase
        .from("conversations")
        .select("id, session_id, user_id, messages, page_context, started_at")
        .eq("id", id)
        .maybeSingle();
      if (error || !convo) {
        return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
      }
      return NextResponse.json({ conversation: convo });
    }

    // List: newest conversations, transcripts summarized to preview + count.
    const { data: convos, error } = await supabase
      .from("conversations")
      .select("id, session_id, user_id, messages, page_context, started_at")
      .order("started_at", { ascending: false })
      .limit(100);
    if (error) throw error;

    const userIds = Array.from(
      new Set((convos || []).map((c) => c.user_id).filter(Boolean))
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const usersById = new Map<string, any>();
    const profileByEmail = new Map<string, string>();
    if (userIds.length > 0) {
      const { data: users } = await supabase
        .from("users")
        .select("id, name, email, company")
        .in("id", userIds.slice(0, 200));
      for (const u of users || []) usersById.set(u.id, u);

      const emails = Array.from(
        new Set((users || []).map((u) => u.email).filter(Boolean))
      );
      if (emails.length > 0) {
        const { data: profiles } = await supabase
          .from("lead_profiles")
          .select("id, canonical_email")
          .in("canonical_email", emails.slice(0, 200));
        for (const p of profiles || []) {
          if (p.canonical_email) profileByEmail.set(p.canonical_email, p.id);
        }
      }
    }

    const items = (convos || []).map((c) => {
      const messages = (c.messages as ChatMessage[]) || [];
      const userMessages = messages.filter((m) => m.role === "user");
      const user = c.user_id ? usersById.get(c.user_id) : null;
      const email: string | undefined = user?.email || undefined;
      return {
        id: c.id,
        session_id: c.session_id,
        started_at: c.started_at,
        page: (c.page_context as { current_page?: string } | null)?.current_page,
        message_count: messages.length,
        preview: userMessages[userMessages.length - 1]?.content?.slice(0, 160) || "",
        first_question: userMessages[0]?.content?.slice(0, 160) || "",
        name: user?.name || undefined,
        email,
        company: user?.company || undefined,
        lead_profile_id: email ? profileByEmail.get(email) : undefined,
      };
    });

    return NextResponse.json({ chats: items });
  } catch (error) {
    console.error("Admin chats error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
