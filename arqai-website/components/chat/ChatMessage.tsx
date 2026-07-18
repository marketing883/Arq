"use client";

import { motion } from "framer-motion";
import { LogoIcon } from "@/components/layout/Logo";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}
    >
      {/* Avatar */}
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-[#252e3d] flex items-center justify-center flex-shrink-0">
          <LogoIcon size={18} className="[&_path]:fill-white [&_circle]:fill-[#d0f439]" />
        </div>
      )}

      {/* Message Bubble */}
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
          isUser
            ? "bg-[#252e3d] rounded-br-md"
            : "bg-gray-100 rounded-bl-md"
        }`}
      >
        <p className={`text-sm leading-relaxed whitespace-pre-wrap ${
          isUser ? "text-white" : "text-gray-900"
        }`}>{message.content}</p>
        <p
          className={`text-xs mt-1 ${
            isUser ? "text-white/70" : "text-gray-500"
          }`}
        >
          {formatTime(message.timestamp)}
        </p>
      </div>

      {/* User Avatar Placeholder */}
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-[var(--arq-gray-200)] flex items-center justify-center flex-shrink-0">
          <span className="text-sm font-medium text-[var(--arq-gray-600)]">
            You
          </span>
        </div>
      )}
    </motion.div>
  );
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
