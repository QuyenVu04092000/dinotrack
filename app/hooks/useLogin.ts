// File: app/hooks/useLogin.ts
"use client";

import { useState, useCallback } from "react";
import { authApi } from "../services/authApi";
import { LoginRequest } from "../types/auth";
import { extractErrorMessage } from "../lib/apiClient";
import { useAuthContext } from "../context/AuthContext";
import type { UseLoginResult } from "app/types/authHooks";

export const useLogin = (): UseLoginResult => {
  const { login } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loginUser = useCallback(
    async (payload: LoginRequest) => {
      setIsLoading(true);
      setIsSuccess(false);
      setError(null);
      try {
        const response = await authApi.login(payload);
        login(response);
        setIsSuccess(true);
        return response;
      } catch (err) {
        const message = extractErrorMessage(err);
        setError(message);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [login],
  );

  return { loginUser, isLoading, isSuccess, error };
};
