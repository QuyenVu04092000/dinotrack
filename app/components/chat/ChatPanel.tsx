// File: app/components/chat/ChatPanel.tsx
"use client";

import React, { useCallback, useEffect, useRef } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import type { ChatMessageItem } from "../../types/chat";

export interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessageItem[];
  isLoading: boolean;
  error: string | null;
  onSendMessage: (content: string) => void;
  onClearError: () => void;
  onClearMessages: () => void;
}

export function ChatPanel({
  isOpen,
  onClose,
  messages,
  isLoading,
  error,
  onSendMessage,
  onClearError,
  onClearMessages,
}: ChatPanelProps) {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isLoading]);

  const handleClearAll = useCallback(() => {
    onClearMessages();
    onClearError();
  }, [onClearMessages, onClearError]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/90" aria-hidden onClick={onClose} />
      <aside
        role="dialog"
        aria-label="Trợ lý tài chính AI"
        className="fixed bottom-0 left-0 right-0 z-50 flex max-h-[85vh] flex-col rounded-t-2xl bg-white shadow-xl"
      >
        <header className="flex shrink-0 items-center justify-between border-b border-slate-200 px-4 py-3">
          <h2 className="text-base font-semibold text-slate-800">Trợ lý tài chính</h2>
          <div className="flex items-center gap-1">
            {messages.length > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="rounded-lg px-2 py-1.5 text-xs text-slate-500 hover:bg-slate-100 hover:text-slate-700"
              >
                Xóa hội thoại
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
              aria-label="Đóng"
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
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </header>

        <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-3" style={{ minHeight: "200px" }}>
          {messages.length === 0 && !isLoading && !error && (
            <p className="py-6 text-center text-sm text-slate-500">
              Hỏi về ngân sách, chi tiêu, giao dịch... Tôi sẽ trả lời ngắn gọn.
            </p>
          )}
          <div className="flex flex-col gap-3">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {isLoading && (
              <div className="flex justify-start" role="status" aria-live="polite">
                <div className="rounded-2xl rounded-bl-md bg-slate-100 px-4 py-2.5">
                  <span className="flex gap-1">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" />
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div
            className="mx-4 mb-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800"
            role="alert"
          >
            <p>{error}</p>
            <button
              type="button"
              onClick={onClearError}
              className="mt-1 text-xs font-medium text-amber-700 underline hover:no-underline"
            >
              Đóng
            </button>
          </div>
        )}

        <ChatInput onSend={onSendMessage} disabled={isLoading} placeholder="Viết câu hỏi về tài chính..." />
      </aside>
    </>
  );
}
