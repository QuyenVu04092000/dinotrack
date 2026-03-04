// File: app/lib/apiClient.ts
import axios from "axios";
import type { ApiErrorResponse } from "app/types/api";

/**
 * Base URL for backend API.
 * - Prefer NEXT_PUBLIC_BASE_URL_API (e.g. http://localhost:3080 or https://api.example.com)
 * - Fallback to localhost for dev.
 */
const API_ORIGIN = process.env.NEXT_PUBLIC_BASE_URL_API?.trim();
const API_BASE_URL = API_ORIGIN?.endsWith("/api") ? API_ORIGIN : `${API_ORIGIN}/api`;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export function extractErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as (Partial<ApiErrorResponse> & { message?: string | string[] }) | undefined;
    if (data?.message) return Array.isArray(data.message) ? data.message.join(" ") : data.message;
    if (typeof error.message === "string" && error.message.length > 0) {
      return error.message;
    }
  }
  return "An unexpected error occurred. Please try again.";
}
