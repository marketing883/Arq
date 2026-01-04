"use client";

import { useState, useRef, useEffect } from "react";
import { SendIcon } from "@/components/ui/Icons";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  onFocus?: () => void;
  compact?: boolean;
}

export function ChatInput({ onSend, disabled = false, onFocus, compact = false }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, compact ? 40 : 120)}px`;
    }
  }, [message, compact]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage("");
      if (inputRef.current) {
        inputRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full">
        <textarea
          ref={inputRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={onFocus}
          placeholder="Ask ArqAI anything..."
          disabled={disabled}
          rows={1}
          className="flex-1 resize-none bg-transparent px-2 py-2 text-sm focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-[var(--arq-gray-400)]"
          style={{ maxHeight: "40px" }}
        />
        <button
          type="submit"
          disabled={!message.trim() || disabled}
          className="w-9 h-9 rounded-full bg-[var(--arq-blue)] text-white flex items-center justify-center hover:bg-[var(--arq-blue-dark)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
          aria-label="Send message"
        >
          <SendIcon size={16} />
        </button>
      </form>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-[var(--arq-gray-200)] p-3"
    >
      <div className="flex items-end gap-2">
        <textarea
          ref={inputRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={onFocus}
          placeholder="Type your message..."
          disabled={disabled}
          rows={1}
          className="flex-1 resize-none rounded-xl border border-[var(--arq-gray-200)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--arq-blue)] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed bg-white"
          style={{ maxHeight: "120px" }}
        />
        <button
          type="submit"
          disabled={!message.trim() || disabled}
          className="w-9 h-9 rounded-full bg-[var(--arq-blue)] text-white flex items-center justify-center hover:bg-[var(--arq-blue-dark)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          aria-label="Send message"
        >
          <SendIcon size={16} />
        </button>
      </div>
      <p className="text-xs text-[var(--arq-gray-400)] mt-2 text-center">
        Press Enter to send, Shift+Enter for new line
      </p>
    </form>
  );
}
