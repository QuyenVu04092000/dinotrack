"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "app/context/AuthContext";
import { useLogin } from "./useLogin";
import type { UseSignInResult } from "app/types/authHooks";

export const useSignIn = (): UseSignInResult => {
  const router = useRouter();
  const { isAuthenticated, isTokenValid, isLoading: authLoading } = useAuthContext();
  const { loginUser, isLoading, isSuccess, error } = useLogin();

  // Auto-redirect if token is valid (not expired)
  useEffect(() => {
    if (!authLoading && isTokenValid && isAuthenticated) {
      router.replace("/home");
    }
  }, [isAuthenticated, isTokenValid, authLoading, router]);

  // Redirect when authenticated (fallback)
  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/home");
    }
  }, [isAuthenticated, router]);

  // Redirect immediately after successful login
  useEffect(() => {
    if (isSuccess) {
      // Give context time to update, then redirect
      const timer = setTimeout(() => {
        router.replace("/home");
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, router]);

  const handleSubmit = useCallback(
    async (formData: FormData) => {
      const phone = formData.get("phone")?.toString() ?? "";
      const password = formData.get("password")?.toString() ?? "";
      const result = await loginUser({ phone, password });
      // Redirect immediately if login was successful (backup)
      if (result) {
        // Small delay to ensure context state is updated
        setTimeout(() => {
          router.replace("/home");
        }, 100);
      }
    },
    [loginUser, router],
  );

  return {
    loginUser,
    isLoading,
    isSuccess,
    error,
    handleSubmit,
  };
};
