// File: app/components/AuthRedirect.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "../context/AuthContext";
import type { AuthRedirectProps } from "app/types/authRedirect";

/**
 * Component that automatically redirects based on authentication status
 * - If redirectIfAuthenticated is true: redirects to redirectTo when user is authenticated
 * - If redirectIfAuthenticated is false: redirects to redirectTo when user is NOT authenticated
 */
export default function AuthRedirect({ redirectTo = "/home", redirectIfAuthenticated = true }: AuthRedirectProps) {
  const router = useRouter();
  const { isAuthenticated, isTokenValid, isLoading } = useAuthContext();

  useEffect(() => {
    // Wait for auth to finish loading
    if (isLoading) return;

    if (redirectIfAuthenticated) {
      // Redirect if authenticated with valid token
      if (isTokenValid && isAuthenticated) {
        router.replace(redirectTo);
      }
    } else {
      // Redirect if NOT authenticated
      if (!isAuthenticated || !isTokenValid) {
        router.replace(redirectTo);
      }
    }
  }, [isAuthenticated, isTokenValid, isLoading, redirectTo, redirectIfAuthenticated, router]);

  return null; // This component doesn't render anything
}
