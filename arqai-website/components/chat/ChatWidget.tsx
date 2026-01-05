"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { FallbackForm } from "./FallbackForm";
import { LogoIcon } from "@/components/layout/Logo";
import { MinimizeIcon } from "@/components/ui/Icons";
import { GREETING_MESSAGES } from "@/lib/ai/knowledge-base";

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

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load conversation and context from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem("arqai_chat_messages");
    const savedUserInfo = localStorage.getItem("arqai_user_info");
    const savedSessionId = localStorage.getItem("arqai_session_id");
    const savedUserContext = localStorage.getItem("arqai_user_context");

    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        setMessages(parsed.map((m: Message) => ({
          ...m,
          timestamp: new Date(m.timestamp),
        })));
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

    if (savedSessionId) {
      setSessionId(savedSessionId);
    }

    if (savedUserContext) {
      setUserContext(savedUserContext);
    }
  }, []);

  // Save conversation to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("arqai_chat_messages", JSON.stringify(messages));
    }
  }, [messages]);

  // Save user info to localStorage
  useEffect(() => {
    if (Object.keys(userInfo).length > 0) {
      localStorage.setItem("arqai_user_info", JSON.stringify(userInfo));
    }
  }, [userInfo]);

  // Save session ID and user context to localStorage
  useEffect(() => {
    if (sessionId) {
      localStorage.setItem("arqai_session_id", sessionId);
    }
  }, [sessionId]);

  useEffect(() => {
    if (userContext) {
      localStorage.setItem("arqai_user_context", userContext);
    }
  }, [userContext]);

  // Send greeting when expanded for first time
  useEffect(() => {
    if (!isExpanded || hasGreeted) return;

    const greeting = GREETING_MESSAGES[pathname] || GREETING_MESSAGES.default;

    const greetingMessage: Message = {
      id: `greeting-${Date.now()}`,
      role: "assistant",
      content: greeting,
      timestamp: new Date(),
    };

    const timer = setTimeout(() => {
      setMessages([greetingMessage]);
      setHasGreeted(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [pathname, hasGreeted, isExpanded]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExpanded]);

  // Send message to API
  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    const conversationHistory = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: content,
          sessionId,
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

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();

      // Update session ID if provided
      if (data.sessionId && !sessionId) {
        setSessionId(data.sessionId);
      }

      // Update user context for future requests
      if (data.userContext) {
        setUserContext(data.userContext);
      }

      // Update context summary for UI display
      if (data.contextSummary) {
        setContextSummary(data.contextSummary);
      }

      // Update user info from extracted entities
      if (data.extractedInfo && Object.keys(data.extractedInfo).length > 0) {
        setUserInfo((prev) => ({ ...prev, ...data.extractedInfo }));
      }

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setErrorCount(0);

      // Handle morph trigger with customizations
      if (data.morphTrigger) {
        window.dispatchEvent(
          new CustomEvent("arqai:morph", {
            detail: {
              type: data.morphTrigger.type,
              customizations: data.morphTrigger.customizations,
            },
          })
        );
      }
    } catch (error) {
      console.error("Chat error:", error);
      setErrorCount((prev) => prev + 1);

      if (errorCount >= 2) {
        setShowFallbackForm(true);
      } else {
        const errorMessage: Message = {
          id: `error-${Date.now()}`,
          role: "assistant",
          content: "I apologize, but I'm having trouble connecting. Please try again.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } finally {
      setIsTyping(false);
    }
  };

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
        {/* Expanded Messages Panel */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: 10 }}
              animate={{ opacity: 1, height: "350px", y: 0 }}
              exit={{ opacity: 0, height: 0, y: 10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="mb-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 flex items-center justify-center">
                    <LogoIcon size={22} />
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">ArqAI Assistant</span>
                  {isTyping && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">typing...</span>
                  )}
                  {/* Show engagement indicator */}
                  {contextSummary?.engagementLevel === "high" && (
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" title="Highly engaged" />
                  )}
                </div>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  aria-label="Minimize"
                >
                  <MinimizeIcon size={16} />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-white dark:bg-gray-900">
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

                {showFallbackForm && (
                  <FallbackForm
                    onSubmit={(data) => {
                      setUserInfo((prev) => ({ ...prev, ...data }));
                      setShowFallbackForm(false);
                      const thankYouMessage: Message = {
                        id: `thanks-${Date.now()}`,
                        role: "assistant",
                        content: `Thanks${data.name ? `, ${data.name}` : ""}! We'll be in touch soon.`,
                        timestamp: new Date(),
                      };
                      setMessages((prev) => [...prev, thankYouMessage]);
                    }}
                    onCancel={() => setShowFallbackForm(false)}
                  />
                )}

                <div ref={messagesEndRef} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Bar - Always Visible */}
        <div
          className={`bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-full shadow-lg transition-shadow ${
            isExpanded ? "shadow-xl" : "hover:shadow-xl"
          }`}
        >
          <div className="flex items-center gap-2 px-3 py-1">
            {!isExpanded && (
              <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                <LogoIcon size={28} />
              </div>
            )}
            <div className="flex-1" onClick={() => setIsExpanded(true)}>
              <ChatInput
                onSend={(msg) => {
                  setIsExpanded(true);
                  sendMessage(msg);
                }}
                disabled={isTyping || showFallbackForm}
                onFocus={() => setIsExpanded(true)}
                compact
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
