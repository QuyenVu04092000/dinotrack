// File: app/services/chatApi.ts
import { apiClient } from "../lib/apiClient";
import { extractErrorMessage } from "../lib/apiClient";
import type { ChatRequestPayload, ChatSuccessResponse, ChatHistoryItem } from "../types/chat";

const CHAT_PATH = "/v1/chat";

/**
 * Sends a message to the chat endpoint (POST /api/v1/chat).
 * Uses Bearer token from apiClient interceptor.
 * Per spec: message required, history optional for multi-turn.
 */
export async function sendChatMessage(
  message: string,
  history?: ChatHistoryItem[],
): Promise<ChatSuccessResponse["data"]> {
  const payload: ChatRequestPayload = { message };
  if (history && history.length > 0) {
    payload.history = history;
  }

  const response = await apiClient.post<ChatSuccessResponse>(CHAT_PATH, payload);
  const data = response.data?.data;
  if (!data?.reply) {
    throw new Error("Invalid chat response: missing reply");
  }
  return data;
}

export { extractErrorMessage as getChatErrorMessage };
