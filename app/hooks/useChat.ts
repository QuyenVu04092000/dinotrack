// File: app/hooks/useChat.ts
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { sendChatMessage, getChatErrorMessage } from "../services/chatApi";
import type { ChatMessageItem, ChatHistoryItem } from "../types/chat";

/** Max history turns to send (avoids oversized payloads; spec recommends cap) */
const MAX_HISTORY_TURNS = 20;

function createMessageId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export interface UseChatReturn {
  messages: ChatMessageItem[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  clearError: () => void;
  clearMessages: () => void;
}

export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesRef = useRef<ChatMessageItem[]>([]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const clearError = useCallback(() => setError(null), []);

  const clearMessages = useCallback(() => setMessages([]), []);

  const sendMessage = useCallback(async (content: string) => {
    const trimmed = content.trim();
    if (!trimmed) return;

    const userMessage: ChatMessageItem = {
      id: createMessageId(),
      role: "user",
      content: trimmed,
      createdAt: new Date().toISOString(),
    };
    const nextMessages = [...messagesRef.current, userMessage];
    messagesRef.current = nextMessages;
    setMessages(nextMessages);
    setError(null);
    setIsLoading(true);

    try {
      const history: ChatHistoryItem[] = nextMessages
        .filter((m) => m.role === "user" || m.role === "assistant")
        .slice(-MAX_HISTORY_TURNS * 2)
        .map((m) => ({ role: m.role, content: m.content }));
      const data = await sendChatMessage(trimmed, history.length > 0 ? history : undefined);

      const assistantMessage: ChatMessageItem = {
        id: createMessageId(),
        role: "assistant",
        content: data.reply,
        createdAt: new Date().toISOString(),
      };
      const withAssistant = [...messagesRef.current, assistantMessage];
      messagesRef.current = withAssistant;
      setMessages(withAssistant);
    } catch (err) {
      setError(getChatErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearError,
    clearMessages,
  };
}
