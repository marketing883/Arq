"use client";

/**
 * Chats: every conversation the site assistant has had, newest first.
 *
 * The marketing read on the chatbot: what visitors actually ask, which pages
 * start conversations, and which chatters became leads. Includes anonymous
 * conversations that never reach the lead pipeline. Replaces the legacy V1
 * "Chat Leads" dashboard (scoring now lives solely in Lead Intelligence V2).
 */

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import { getTimeAgo } from "@/components/admin/leads/leadUi";

interface ChatRow {
  id: string;
  session_id: string;
  started_at: string;
  page?: string;
  message_count: number;
  preview: string;
  first_question: string;
  name?: string;
  email?: string;
  company?: string;
  lead_profile_id?: string;
}

interface TranscriptMessage {
  role: string;
  content: string;
}

function Transcript({ chatId }: { chatId: string }) {
  const [messages, setMessages] = useState<TranscriptMessage[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/admin/chats?id=${chatId}`)
      .then((r) => r.json())
      .then((json) => {
        if (!cancelled) setMessages(json.conversation?.messages || []);
      })
      .catch(() => !cancelled && setFailed(true));
    return () => {
      cancelled = true;
    };
  }, [chatId]);

  if (failed) return <p className="text-[11px] text-red-500 p-3">Failed to load transcript.</p>;
  if (!messages) return <p className="text-[11px] text-slate-400 p-3">Loading transcript...</p>;
  if (messages.length === 0)
    return <p className="text-[11px] text-slate-400 p-3">Empty conversation.</p>;

  return (
    <div className="bg-slate-50 rounded p-3 space-y-2 max-h-80 overflow-y-auto">
      {messages.map((m, i) => (
        <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
          <div
            className={`max-w-[80%] px-3 py-1.5 rounded text-[12px] leading-relaxed ${
              m.role === "user"
                ? "bg-slate-900 text-white"
                : "bg-white border border-slate-200 text-slate-700"
            }`}
          >
            {m.content}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ChatsPage() {
  const [chats, setChats] = useState<ChatRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [identifiedOnly, setIdentifiedOnly] = useState(false);
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const router = useRouter();

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/chats");
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      if (!res.ok) throw new Error("failed");
      const json = await res.json();
      setChats(json.chats || []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load conversations");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const q = search.trim().toLowerCase();
  const visible = chats.filter((c) => {
    if (identifiedOnly && !c.email) return false;
    if (q) {
      const haystack = [c.name, c.email, c.company, c.preview, c.first_question, c.page]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });

  const identifiedCount = chats.filter((c) => !!c.email).length;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-500 text-xs">Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminHeader
        title="Chats"
        subtitle="What visitors ask the assistant, and who became a lead"
        onRefresh={fetchData}
      />

      <div className="p-5">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <div className="relative">
            <svg
              className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search questions, emails, pages..."
              className="pl-8 pr-3 py-2 w-72 bg-white rounded border border-slate-200 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
            />
          </div>
          <button
            onClick={() => setIdentifiedOnly((v) => !v)}
            className={`px-3 py-2 rounded border text-xs font-medium transition-colors ${
              identifiedOnly
                ? "bg-emerald-600 text-white border-emerald-600"
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
            }`}
          >
            Identified only ({identifiedCount})
          </button>
          <span className="ml-auto text-[11px] text-slate-400">
            {visible.length} of {chats.length} conversations
          </span>
        </div>

        {/* Conversation list */}
        {visible.length === 0 ? (
          <div className="bg-white rounded-md p-10 text-center border border-slate-200">
            <h3 className="text-sm font-medium text-slate-900 mb-1">No conversations</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Conversations appear here as visitors talk to the site assistant.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {visible.map((c) => {
              const open = openId === c.id;
              return (
                <div key={c.id} className="bg-white rounded-md border border-slate-200">
                  <button
                    onClick={() => setOpenId(open ? null : c.id)}
                    className="w-full p-3.5 text-left hover:bg-slate-50/70 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className={`w-2 h-2 rounded-full flex-shrink-0 ${
                            c.email ? "bg-emerald-500" : "bg-slate-300"
                          }`}
                          title={c.email ? "Identified" : "Anonymous"}
                        />
                        <p className="text-xs font-medium text-slate-900 truncate">
                          {c.name || c.email || "Anonymous visitor"}
                          {c.company ? (
                            <span className="text-slate-400 font-normal"> · {c.company}</span>
                          ) : null}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0 text-[10px] text-slate-400">
                        <span>{c.message_count} messages</span>
                        {c.page && <span className="hidden sm:inline">from {c.page}</span>}
                        <span>{getTimeAgo(c.started_at)}</span>
                      </div>
                    </div>
                    {c.preview && (
                      <p className="text-[11px] text-slate-500 mt-1 truncate">
                        &ldquo;{c.preview}&rdquo;
                      </p>
                    )}
                  </button>
                  {open && (
                    <div className="px-3.5 pb-3.5">
                      <Transcript chatId={c.id} />
                      {c.lead_profile_id && (
                        <Link
                          href={`/admin/leads-v2/${c.lead_profile_id}`}
                          className="inline-block mt-2 px-3 py-1.5 bg-slate-900 text-white text-xs font-medium rounded hover:bg-slate-800"
                        >
                          Open lead command center
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
