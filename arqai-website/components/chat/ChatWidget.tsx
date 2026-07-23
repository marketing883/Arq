"use client";

/**
 * ArqAI chat widget.
 *
 * Desktop: the signature bottom-center pill expands into a panel.
 * Mobile (<640px): a compact floating launcher opens a full-screen sheet with
 * safe-area handling and a sticky input above the keyboard.
 *
 * Replies stream in word by word. The assistant can attach actions to a reply
 * (quick-reply chips, site links, an inline email capture) via the machine
 * block protocol, so the next step is always one tap away.
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { FallbackForm } from "./FallbackForm";
import { LogoIcon } from "@/components/layout/Logo";
import { MinimizeIcon } from "@/components/ui/Icons";
import { resolveGreeting } from "@/lib/ai/greetings";
import { trackChatMessage, trackChatOpen, trackGenerateLead } from "@/lib/analytics/gtm-events";
import { getAttribution } from "@/lib/attribution/visitor-context";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface UserInfo {
  name?: string;
  email?: string;
  company?: string;
  jobTitle?: string;
  phone?: string;
}

interface ContextSummary {
  industry?: string;
  painPoints?: string[];
  complianceFrameworks?: string[];
  engagementLevel?: "low" | "medium" | "high";
  completeness?: number;
}

interface ChatAction {
  type: "quick_replies" | "link" | "ask_email";
  options?: string[];
  label?: string;
  href?: string;
}

/** Greeting quick replies so the first tap never requires typing. */
function greetingQuickReplies(pathname: string | null): string[] {
  const p = pathname || "/";
  if (p.startsWith("/accelerators/")) {
    return ["How does the fit check work?", "What does it integrate with?", "How do we start?"];
  }
  if (p.startsWith("/accelerators")) {
    return ["Which one fits my team?", "How do engagements start?", "What do they cost?"];
  }
  if (p.startsWith("/services")) {
    return ["How do engagements run?", "What's the first step?", "Show me the accelerators"];
  }
  if (p.startsWith("/industries")) {
    return ["What have you built in my industry?", "How do we start?"];
  }
  return ["What do you do?", "Show me the accelerators", "How do engagements start?"];
}

function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return isMobile;
}

export function ChatWidget() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showFallbackForm, setShowFallbackForm] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo>({});
  const [hasGreeted, setHasGreeted] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [userContext, setUserContext] = useState<string | null>(null);
  const [contextSummary, setContextSummary] = useState<ContextSummary | null>(null);
  const [actions, setActions] = useState<ChatAction[]>([]);
  const [teaser, setTeaser] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasTrackedOpen = useRef(false);
  const pathname = usePathname();
  const router = useRouter();
  const isMobile = useIsMobile();

  // Fire chat_open once, the first time the widget is expanded this session.
  useEffect(() => {
    if (isExpanded && !hasTrackedOpen.current) {
      hasTrackedOpen.current = true;
      trackChatOpen({ page_location: pathname ?? undefined });
    }
  }, [isExpanded, pathname]);

  // Disable chat widget on admin pages, design-preview routes, and standalone survey pages
  const isAdminPage =
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/v4") ||
    pathname?.startsWith("/v5") ||
    pathname?.startsWith("/survey");

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, actions, isTyping]);

  // Load conversation and context from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem("arqai_chat_messages");
    const savedUserInfo = localStorage.getItem("arqai_user_info");
    const savedSessionId = localStorage.getItem("arqai_session_id");
    const savedUserContext = localStorage.getItem("arqai_user_context");

    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        setMessages(
          parsed.map((m: Message) => ({ ...m, timestamp: new Date(m.timestamp) }))
        );
        setHasGreeted(true);
      } catch (e) {
        console.error("Failed to parse saved messages:", e);
      }
    }
    if (savedUserInfo) {
      try {
        setUserInfo(JSON.parse(savedUserInfo));
      } catch (e) {
        console.error("Failed to parse saved user info:", e);
      }
    }
    if (savedSessionId) setSessionId(savedSessionId);
    if (savedUserContext) setUserContext(savedUserContext);
  }, []);

  // Persist conversation state
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("arqai_chat_messages", JSON.stringify(messages));
    }
  }, [messages]);
  useEffect(() => {
    if (Object.keys(userInfo).length > 0) {
      localStorage.setItem("arqai_user_info", JSON.stringify(userInfo));
    }
  }, [userInfo]);
  useEffect(() => {
    if (sessionId) localStorage.setItem("arqai_session_id", sessionId);
  }, [sessionId]);
  useEffect(() => {
    if (userContext) localStorage.setItem("arqai_user_context", userContext);
  }, [userContext]);

  // Send greeting when expanded for the first time
  useEffect(() => {
    if (!isExpanded || hasGreeted) return;
    const greeting = resolveGreeting(pathname);
    const greetingMessage: Message = {
      id: `greeting-${Date.now()}`,
      role: "assistant",
      content: greeting,
      timestamp: new Date(),
    };
    const timer = setTimeout(() => {
      setMessages([greetingMessage]);
      setActions([{ type: "quick_replies", options: greetingQuickReplies(pathname) }]);
      setHasGreeted(true);
    }, 300);
    return () => clearTimeout(timer);
  }, [pathname, hasGreeted, isExpanded]);

  // Proactive teaser: after 45s of dwell on high-intent pages, offer help once
  // per browser session. Dismissible; clicking it opens the chat.
  useEffect(() => {
    if (isExpanded || messages.length > 0 || isAdminPage) return;
    const p = pathname || "";
    const highIntent =
      p.startsWith("/accelerators") || p.startsWith("/services") || p.startsWith("/industries");
    if (!highIntent) return;
    if (sessionStorage.getItem("arq_chat_teased")) return;

    const timer = setTimeout(() => {
      if (sessionStorage.getItem("arq_chat_teased")) return;
      sessionStorage.setItem("arq_chat_teased", "1");
      setTeaser(
        p.startsWith("/accelerators/")
          ? "Questions about this accelerator? The fit check takes two weeks."
          : "Wondering which of these fits your team? Ask me."
      );
    }, 45000);
    return () => clearTimeout(timer);
  }, [pathname, isExpanded, messages.length, isAdminPage]);

  // Close on click outside (desktop only; mobile uses an explicit close)
  useEffect(() => {
    if (isMobile) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };
    if (isExpanded) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isExpanded, isMobile]);

  // Lock body scroll while the mobile sheet is open
  useEffect(() => {
    if (isMobile && isExpanded) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isMobile, isExpanded]);

  const startNewConversation = useCallback(() => {
    localStorage.removeItem("arqai_chat_messages");
    localStorage.removeItem("arqai_user_context");
    localStorage.removeItem("arqai_session_id");
    setMessages([]);
    setActions([]);
    setUserContext(null);
    setSessionId(null);
    setContextSummary(null);
    setHasGreeted(false);
    setShowFallbackForm(false);
    setErrorCount(0);
  }, []);

  // Apply a meta payload from the server (streaming or JSON path).
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const applyPayload = useCallback((data: any) => {
    if (!data) return;
    if (data.sessionId) setSessionId((prev) => prev || data.sessionId);
    if (data.userContext) setUserContext(data.userContext);
    if (data.contextSummary) setContextSummary(data.contextSummary);
    if (data.extractedInfo && Object.keys(data.extractedInfo).length > 0) {
      setUserInfo((prev) => ({ ...prev, ...data.extractedInfo }));
    }
    if (Array.isArray(data.actions)) setActions(data.actions);

    if (data.morphTrigger) {
      window.dispatchEvent(
        new CustomEvent("arqai:morph", {
          detail: {
            type: data.morphTrigger.type,
            customizations: data.morphTrigger.customizations,
          },
        })
      );
      if (data.cardFollowUp) {
        setMessages((prev) => [
          ...prev,
          {
            id: `followup-${Date.now()}`,
            role: "assistant",
            content: data.cardFollowUp,
            timestamp: new Date(),
          },
        ]);
      }
    }
  }, []);

  // Send message to API (streaming with JSON fallback)
  const sendMessage = async (
    content: string,
    options: { via?: "quick_reply" | "email_capture" } = {}
  ) => {
    if (!content.trim() || isTyping) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setActions([]);
    setIsTyping(true);

    const conversationHistory = messages.map((m) => ({ role: m.role, content: m.content }));
    const attribution = getAttribution(pathname);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          stream: true,
          via: options.via,
          sessionId,
          analyticsSessionId: attribution.sessionId,
          userContext,
          conversationHistory,
          context: {
            currentPage: pathname,
            userName: userInfo.name,
            userEmail: userInfo.email,
            userCompany: userInfo.company,
          },
        }),
      });

      if (response.status === 429) {
        setMessages((prev) => [
          ...prev,
          {
            id: `rl-${Date.now()}`,
            role: "assistant",
            content: "You're sending messages quickly. Give me a few seconds and try again.",
            timestamp: new Date(),
          },
        ]);
        return;
      }

      const contentType = response.headers.get("content-type") || "";

      // JSON path: guard blocks, validation errors, or legacy responses.
      if (contentType.includes("application/json")) {
        const data = response.ok ? await response.json().catch(() => null) : null;
        if (!data) throw new Error("Failed to get response");
        setMessages((prev) => [
          ...prev,
          {
            id: `assistant-${Date.now()}`,
            role: "assistant",
            content: data.response,
            timestamp: new Date(),
          },
        ]);
        applyPayload(data);
        setErrorCount(0);
        trackChatMessage({
          message_count: messages.length + 2,
          session_id: sessionId || undefined,
          engagement_level: contextSummary?.engagementLevel,
        });
        return;
      }

      if (!response.ok || !response.body) throw new Error("Failed to get response");

      // Streaming path: grow one assistant message as deltas arrive.
      const assistantId = `assistant-${Date.now()}`;
      let assistantText = "";
      let firstToken = true;

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      const appendDelta = (delta: string) => {
        assistantText += delta;
        if (firstToken) {
          firstToken = false;
          setIsTyping(false);
          setMessages((prev) => [
            ...prev,
            { id: assistantId, role: "assistant", content: assistantText, timestamp: new Date() },
          ]);
        } else {
          setMessages((prev) =>
            prev.map((m) => (m.id === assistantId ? { ...m, content: assistantText } : m))
          );
        }
      };

      let receivedDone = false;
      while (!receivedDone) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const frames = buffer.split("\n\n");
        buffer = frames.pop() || "";
        for (const frame of frames) {
          const line = frame.trim();
          if (!line.startsWith("data:")) continue;
          try {
            const event = JSON.parse(line.slice(5).trim());
            if (event.type === "text" && typeof event.delta === "string") {
              appendDelta(event.delta);
            } else if (event.type === "meta") {
              applyPayload(event.payload);
            } else if (event.type === "done") {
              receivedDone = true;
            }
          } catch {
            // Skip malformed frame
          }
        }
      }

      if (assistantText.length === 0) throw new Error("Empty response");
      setErrorCount(0);
      trackChatMessage({
        message_count: messages.length + 2,
        session_id: sessionId || undefined,
        engagement_level: contextSummary?.engagementLevel,
      });
    } catch (error) {
      console.error("Chat error:", error);
      setErrorCount((prev) => prev + 1);
      if (errorCount >= 2) {
        setShowFallbackForm(true);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `error-${Date.now()}`,
            role: "assistant",
            content: "I apologize, but I'm having trouble connecting. Please try again.",
            timestamp: new Date(),
          },
        ]);
      }
    } finally {
      setIsTyping(false);
    }
  };

  if (isAdminPage) return null;

  const openChat = () => {
    setTeaser(null);
    setIsExpanded(true);
  };

  // ==========================================================================
  // Shared inner content (header, messages, action bar, fallback form)
  // ==========================================================================

  const header = (
    <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100 bg-gray-50 flex-shrink-0">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 flex items-center justify-center">
          <LogoIcon size={22} />
        </div>
        <span className="text-sm font-medium text-gray-900">ArqAI Assistant</span>
        {isTyping && <span className="text-xs text-gray-500">thinking...</span>}
        {contextSummary?.engagementLevel === "high" && (
          <span
            className="w-2 h-2 rounded-full bg-green-500 animate-pulse"
            title="Highly engaged"
          />
        )}
      </div>
      <div className="flex items-center gap-1">
        {messages.length > 1 && (
          <button
            onClick={startNewConversation}
            className="px-2 py-1 text-[11px] text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Start a new conversation"
          >
            New
          </button>
        )}
        <button
          onClick={() => setIsExpanded(false)}
          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Close chat"
        >
          {isMobile ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <MinimizeIcon size={16} />
          )}
        </button>
      </div>
    </div>
  );

  const messageList = (
    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-white overscroll-contain">
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}

      {isTyping && (
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      )}

      {/* Action bar: quick replies, links, inline email capture */}
      {!isTyping && actions.length > 0 && !showFallbackForm && (
        <ActionBar
          actions={actions}
          onQuickReply={(text) => sendMessage(text, { via: "quick_reply" })}
          onLink={(href) => {
            if (isMobile) setIsExpanded(false);
            router.push(href);
          }}
          onEmail={(email) => sendMessage(`My email is ${email}`, { via: "email_capture" })}
          hasEmail={!!userInfo.email}
        />
      )}

      {showFallbackForm && (
        <FallbackForm
          onSubmit={async (data) => {
            const attribution = getAttribution(pathname);
            const res = await fetch("/api/contact", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: data.name,
                email: data.email,
                company: data.company || "Not provided",
                jobTitle: "Not provided",
                workflowArea: "Chat inquiry",
                message:
                  "Requested a callback via the site chat (the assistant was temporarily unavailable).",
                inquiryType: "chat",
                attribution: { ...attribution, sourceContext: "Chat fallback" },
              }),
            });
            const body = await res.json().catch(() => null);
            if (!res.ok || !body?.success) {
              throw new Error(body?.error || "Could not send. Please try again.");
            }
            setUserInfo((prev) => ({ ...prev, ...data }));
            trackGenerateLead({
              form_name: "chat_fallback",
              inquiry_type: "chat",
              value: data.company ? 100 : 50,
            });
            setShowFallbackForm(false);
            setMessages((prev) => [
              ...prev,
              {
                id: `thanks-${Date.now()}`,
                role: "assistant",
                content: `Thanks${data.name ? `, ${data.name}` : ""}! We'll be in touch soon.`,
                timestamp: new Date(),
              },
            ]);
          }}
          onCancel={() => setShowFallbackForm(false)}
        />
      )}

      <div ref={messagesEndRef} />
    </div>
  );

  // ==========================================================================
  // MOBILE: floating launcher + full-screen sheet
  // ==========================================================================
  if (isMobile) {
    return (
      <>
        <AnimatePresence>
          {!isExpanded && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed z-50"
              style={{
                right: "16px",
                bottom: "calc(16px + env(safe-area-inset-bottom, 0px))",
              }}
            >
              {/* Teaser bubble */}
              <AnimatePresence>
                {teaser && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute bottom-16 right-0 w-60 bg-white border border-gray-200 rounded-xl shadow-lg p-3"
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setTeaser(null);
                      }}
                      className="absolute top-1.5 right-1.5 p-0.5 text-gray-300 hover:text-gray-500"
                      aria-label="Dismiss"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <button onClick={openChat} className="text-left">
                      <p className="text-xs text-gray-700 leading-snug pr-3">{teaser}</p>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                onClick={openChat}
                aria-label="Open chat"
                className="w-14 h-14 rounded-full bg-[#252e3d] shadow-xl flex items-center justify-center active:scale-95 transition-transform"
              >
                <LogoIcon size={28} className="[&_path]:fill-white [&_circle]:fill-[#d0f439]" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed inset-0 z-[60] bg-white flex flex-col"
              style={{ height: "100dvh" }}
            >
              <div style={{ paddingTop: "env(safe-area-inset-top, 0px)" }} className="flex-shrink-0">
                {header}
              </div>
              {messageList}
              <div
                className="flex-shrink-0 border-t border-gray-100 px-3 py-2 bg-white"
                style={{ paddingBottom: "calc(8px + env(safe-area-inset-bottom, 0px))" }}
              >
                <ChatInput
                  onSend={(msg) => sendMessage(msg)}
                  disabled={isTyping || showFallbackForm}
                  compact
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  // ==========================================================================
  // DESKTOP: bottom-center pill + expanding panel
  // ==========================================================================
  return (
    <div
      ref={containerRef}
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-[600px]"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative"
      >
        {/* Teaser bubble (desktop) */}
        <AnimatePresence>
          {teaser && !isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 bg-white border border-gray-200 rounded-xl shadow-lg px-4 py-2.5 flex items-center gap-3 whitespace-nowrap"
            >
              <button onClick={openChat} className="text-xs text-gray-700">
                {teaser}
              </button>
              <button
                onClick={() => setTeaser(null)}
                className="p-0.5 text-gray-300 hover:text-gray-500"
                aria-label="Dismiss"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Expanded Messages Panel */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: 10 }}
              animate={{ opacity: 1, height: "480px", y: 0 }}
              exit={{ opacity: 0, height: 0, y: 10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="mb-2 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden flex flex-col"
            >
              {header}
              {messageList}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Bar - Always Visible */}
        <div
          className={`bg-white border border-gray-200 rounded-full shadow-lg transition-shadow ${
            isExpanded ? "shadow-xl" : "hover:shadow-xl"
          }`}
        >
          <div className="flex items-center gap-2 px-3 py-1">
            {!isExpanded && (
              <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                <LogoIcon size={28} />
              </div>
            )}
            <div className="flex-1" onClick={openChat}>
              <ChatInput
                onSend={(msg) => {
                  openChat();
                  sendMessage(msg);
                }}
                disabled={isTyping || showFallbackForm}
                onFocus={openChat}
                compact
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ============================================================================
// Action bar: the assistant's tappable next steps
// ============================================================================

function ActionBar({
  actions,
  onQuickReply,
  onLink,
  onEmail,
  hasEmail,
}: {
  actions: ChatAction[];
  onQuickReply: (text: string) => void;
  onLink: (href: string) => void;
  onEmail: (email: string) => void;
  hasEmail: boolean;
}) {
  const quickReplies = actions.find((a) => a.type === "quick_replies")?.options || [];
  const links = actions.filter((a) => a.type === "link" && a.href);
  const askEmail = actions.some((a) => a.type === "ask_email") && !hasEmail;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-2 pl-11"
    >
      {(quickReplies.length > 0 || links.length > 0) && (
        <div className="flex flex-wrap gap-1.5">
          {quickReplies.map((option) => (
            <button
              key={option}
              onClick={() => onQuickReply(option)}
              className="px-3 py-1.5 text-xs font-medium text-[#252e3d] bg-white border border-gray-300 rounded-full hover:border-[#252e3d] hover:bg-gray-50 transition-colors"
            >
              {option}
            </button>
          ))}
          {links.map((link) => (
            <button
              key={link.href}
              onClick={() => onLink(link.href!)}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-[#252e3d] rounded-full hover:bg-[#1a2230] transition-colors inline-flex items-center gap-1"
            >
              {link.label || "Learn more"}
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>
      )}
      {askEmail && <EmailCapture onSubmit={onEmail} />}
    </motion.div>
  );
}

function EmailCapture({ onSubmit }: { onSubmit: (email: string) => void }) {
  const [email, setEmail] = useState("");
  const valid = /^[\w.+-]+@[\w-]+\.[\w.-]+$/.test(email.trim());

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (valid) onSubmit(email.trim());
      }}
      className="flex items-center gap-1.5 max-w-[320px] bg-gray-50 border border-gray-200 rounded-full pl-3 pr-1 py-1"
    >
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Work email"
        autoComplete="email"
        className="flex-1 min-w-0 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
      />
      <button
        type="submit"
        disabled={!valid}
        className="px-3 py-1.5 text-xs font-semibold text-white bg-[#252e3d] rounded-full disabled:opacity-40 hover:bg-[#1a2230] transition-colors flex-shrink-0"
      >
        Send
      </button>
    </form>
  );
}
