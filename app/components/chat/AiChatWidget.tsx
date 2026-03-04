// File: app/components/chat/AiChatWidget.tsx
"use client";

import React, { useCallback, useState } from "react";
import { useChat } from "../../hooks/useChat";
import { ChatFab } from "./ChatFab";
import { ChatPanel } from "./ChatPanel";

/**
 * Global AI chat widget: FAB + slide-up panel.
 * When the panel is closed, the current page is reloaded so that all
 * hooks refetch fresh data from the backend.
 */
export function AiChatWidget() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const { messages, isLoading, error, sendMessage, clearError, clearMessages } = useChat();

  const openPanel = useCallback(() => setIsPanelOpen(true), []);
  const closePanel = useCallback(() => {
    setIsPanelOpen(false);
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  }, []);

  return (
    <>
      <ChatFab onClick={openPanel} />
      <ChatPanel
        isOpen={isPanelOpen}
        onClose={closePanel}
        messages={messages}
        isLoading={isLoading}
        error={error}
        onSendMessage={sendMessage}
        onClearError={clearError}
        onClearMessages={clearMessages}
      />
    </>
  );
}
