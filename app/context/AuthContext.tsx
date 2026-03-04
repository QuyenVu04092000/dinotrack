// File: app/context/AuthContext.tsx
"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import type { AuthUser } from "../types/auth";
import type { AuthContextValue } from "../types/context";
import { AuthResponse } from "../types/auth";
import { authApi } from "../services/authApi";
import { isTokenValid } from "../lib/jwt";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const USER_KEY = "authUser";

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const clearPersistedAuth = useCallback(() => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }, []);

  const persistAuth = useCallback((auth: AuthResponse) => {
    if (typeof window === "undefined") return;

    // Store access token
    if (auth.accessToken) {
      localStorage.setItem(ACCESS_TOKEN_KEY, auth.accessToken);
    }

    // Store refresh token if present
    if (auth.refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, auth.refreshToken);
    }

    // Store user info
    if (auth.user) {
      localStorage.setItem(USER_KEY, JSON.stringify(auth.user));
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedAccess = localStorage.getItem(ACCESS_TOKEN_KEY);
    const storedRefresh = localStorage.getItem(REFRESH_TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);

    // Check if token is valid before setting it
    if (storedAccess && isTokenValid(storedAccess)) {
      setAccessToken(storedAccess);

      // Load user from storage if available
      if (storedUser) {
        try {
          const parsed: AuthUser = JSON.parse(storedUser);
          setUser(parsed);
        } catch {
          // ignore parse errors
        }
      }

      if (storedRefresh) {
        setRefreshToken(storedRefresh);
      }
    } else {
      // Token is expired or invalid, clear everything
      if (storedAccess) {
        clearPersistedAuth();
      }
    }

    setIsLoading(false);
  }, [clearPersistedAuth]);

  const login = useCallback(
    (auth: AuthResponse) => {
      if (auth.accessToken) {
        setAccessToken(auth.accessToken);
      }
      if (auth.user) {
        setUser(auth.user);
      }
      if (auth.refreshToken) {
        setRefreshToken(auth.refreshToken);
      } else {
        setRefreshToken(null);
      }
      persistAuth(auth);
    },
    [persistAuth],
  );

  const logout = useCallback(() => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    clearPersistedAuth();
  }, [clearPersistedAuth]);

  const reloadProfile = useCallback(async () => {
    // Check if we have an access token before trying to fetch profile
    const currentToken = accessToken || (typeof window !== "undefined" ? localStorage.getItem(ACCESS_TOKEN_KEY) : null);

    if (!currentToken) {
      console.log("⚠️ reloadProfile: No access token available, skipping profile fetch");
      return;
    }

    try {
      const profile = await authApi.getProfile();
      setUser(profile);
      if (typeof window !== "undefined") {
        const profileToStore = JSON.stringify(profile);
        localStorage.setItem(USER_KEY, profileToStore);
        // Verify what was stored
        const stored = localStorage.getItem(USER_KEY);
        const parsed = stored ? JSON.parse(stored) : null;
      }
    } catch (error) {
      // profile fetch failed, optionally handle (e.g., logout)
      console.error("❌ reloadProfile: Failed to fetch profile", error);
    }
  }, [accessToken]);

  const tokenValid = useMemo(() => {
    return accessToken ? isTokenValid(accessToken) : false;
  }, [accessToken]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      accessToken,
      refreshToken,
      isLoading,
      isAuthenticated: !!accessToken && !!user && tokenValid,
      isTokenValid: tokenValid,
      login,
      logout,
      reloadProfile,
    }),
    [user, accessToken, refreshToken, isLoading, tokenValid, login, logout, reloadProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return ctx;
};
