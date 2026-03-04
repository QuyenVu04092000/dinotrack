// File: app/components/chat/ChatMessage.tsx
"use client";

import React, { memo } from "react";
import type { ChatMessageItem } from "../../types/chat";

export interface ChatMessageProps {
  message: ChatMessageItem;
}

function ChatMessageComponent({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`} role="listitem">
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
          isUser ? "bg-[#0046B0] text-white rounded-br-md" : "bg-slate-100 text-slate-800 rounded-bl-md"
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
      </div>
    </div>
  );
}

export const ChatMessage = memo(ChatMessageComponent);
