/**
 * Chat API types per AI_CHATBOT_FEATURE_SPEC.md
 */

export type ChatRole = "system" | "user" | "assistant";

export interface ChatHistoryItem {
  role: ChatRole;
  content: string;
}

export interface ChatRequestPayload {
  message: string;
  history?: ChatHistoryItem[];
}

export interface ChatUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export interface ChatSuccessData {
  reply: string;
  usage?: ChatUsage;
}

/** Standard envelope: { data: ChatSuccessData } */
export interface ChatSuccessResponse {
  data: ChatSuccessData;
}

/** Global error format per spec (statusCode, message, error, timestamp, path) */
export interface ChatApiErrorBody {
  statusCode: number;
  message: string | string[];
  error?: string;
  timestamp?: string;
  path?: string;
}

/** UI message with id and timestamp for list rendering */
export interface ChatMessageItem {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

/** Max message length per spec */
export const CHAT_MESSAGE_MAX_LENGTH = 10_000;
