// File: app/components/chat/ChatInput.tsx
"use client";

import React, { useCallback, useRef, useState } from "react";
import { CHAT_MESSAGE_MAX_LENGTH } from "../../types/chat";

export interface ChatInputProps {
  onSend: (content: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({ onSend, disabled = false, placeholder = "Nhập tin nhắn..." }: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const trimmed = value.trim();
  const canSend = trimmed.length > 0 && !disabled;
  const isOverMax = value.length > CHAT_MESSAGE_MAX_LENGTH;

  const handleSubmit = useCallback(() => {
    if (!canSend || isOverMax) return;
    onSend(trimmed);
    setValue("");
  }, [canSend, isOverMax, trimmed, onSend]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit],
  );

  return (
    <div className="flex items-end gap-2 border-t border-slate-200 bg-white p-3">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value.slice(0, CHAT_MESSAGE_MAX_LENGTH))}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        rows={1}
        className="min-h-[44px] max-h-32 flex-1 resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#0046B0] focus:outline-none focus:ring-1 focus:ring-[#0046B0] disabled:opacity-60"
        aria-label="Tin nhắn"
        aria-invalid={isOverMax}
        maxLength={CHAT_MESSAGE_MAX_LENGTH}
      />
      <button
        type="button"
        onClick={handleSubmit}
        disabled={!canSend || isOverMax}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0046B0] text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        aria-label="Gửi tin nhắn"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M22 2L11 13" />
          <path d="M22 2L15 22L11 13L2 9L22 2Z" />
        </svg>
      </button>
    </div>
  );
}
