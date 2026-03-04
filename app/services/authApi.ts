// File: app/services/authApi.ts
import { apiClient } from "../lib/apiClient";
import {
  AuthResponse,
  ChangePasswordRequest,
  LoginRequest,
  ProfileResponse,
  RegisterRequest,
  SignInPhoneRequest,
  GenericSuccessResponse,
  AuthUser,
} from "../types/auth";

// Helper to decode JWT and extract user info
function decodeJWT(token: string): any {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

// Helper to extract user from response or JWT
function extractUserFromResponse(responseData: any, accessToken?: string): AuthUser | null {
  // If user object exists in response, process it to ensure proper types
  if (responseData.user && typeof responseData.user === "object") {
    const userData = responseData.user;
    const rawBalance = (userData as any).balance;
    const balance =
      typeof rawBalance === "number" ? rawBalance : typeof rawBalance === "string" ? Number(rawBalance) : undefined;

    const rawStartDayMonth = (userData as any).startDayMonth;
    const startDayMonth =
      typeof rawStartDayMonth === "number"
        ? rawStartDayMonth
        : typeof rawStartDayMonth === "string"
          ? Number(rawStartDayMonth)
          : undefined;

    return {
      ...userData,
      balance: Number.isFinite(balance as number) ? (balance as number) : undefined,
      startDayMonth: Number.isFinite(startDayMonth as number) ? (startDayMonth as number) : undefined,
    };
  }

  // If user fields are directly in response, construct user object
  if (responseData.id || responseData.name) {
    const rawBalance = (responseData as any).balance;
    const balance =
      typeof rawBalance === "number" ? rawBalance : typeof rawBalance === "string" ? Number(rawBalance) : undefined;

    const rawStartDayMonth = (responseData as any).startDayMonth;
    const startDayMonth =
      typeof rawStartDayMonth === "number"
        ? rawStartDayMonth
        : typeof rawStartDayMonth === "string"
          ? Number(rawStartDayMonth)
          : undefined;

    return {
      id: responseData.id || "",
      name: responseData.name || "",
      email: responseData.email,
      phone: responseData.phone,
      status: responseData.status,
      balance: Number.isFinite(balance as number) ? (balance as number) : undefined,
      startDayMonth: Number.isFinite(startDayMonth as number) ? (startDayMonth as number) : undefined,
    };
  }

  // Try to extract from JWT token if available
  if (accessToken) {
    const decoded = decodeJWT(accessToken);
    if (decoded) {
      const rawBalance = (decoded as any).balance;
      const balance =
        typeof rawBalance === "number" ? rawBalance : typeof rawBalance === "string" ? Number(rawBalance) : undefined;

      const rawStartDayMonth = (decoded as any).startDayMonth;
      const startDayMonth =
        typeof rawStartDayMonth === "number"
          ? rawStartDayMonth
          : typeof rawStartDayMonth === "string"
            ? Number(rawStartDayMonth)
            : undefined;

      return {
        id: decoded.id || "",
        name: decoded.name || "",
        email: decoded.email,
        phone: decoded.phone,
        status: decoded.status,
        balance: Number.isFinite(balance as number) ? (balance as number) : undefined,
        startDayMonth: Number.isFinite(startDayMonth as number) ? (startDayMonth as number) : undefined,
      };
    }
  }

  return null;
}

export const authApi = {
  register: async (payload: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<any>("/auth/register", payload);
    // Handle nested data structure if present
    const responseData = response.data?.data || response.data;

    // Ensure we have the correct structure
    if (responseData.accessToken) {
      const accessToken = responseData.accessToken;
      const user = extractUserFromResponse(responseData, accessToken);

      if (!user) {
        throw new Error("Unable to extract user information from register response");
      }

      return {
        accessToken,
        refreshToken: responseData.refreshToken,
        user,
      };
    }

    // Fallback to direct response if structure is different
    return responseData as AuthResponse;
  },

  login: async (payload: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<any>("/auth/login", payload);
    // Handle nested data structure if present
    const responseData = response.data?.data || response.data;

    // Ensure we have the correct structure
    if (responseData.accessToken) {
      const accessToken = responseData.accessToken;
      const user = extractUserFromResponse(responseData, accessToken);

      if (!user) {
        throw new Error("Unable to extract user information from login response");
      }

      return {
        accessToken,
        refreshToken: responseData.refreshToken,
        user,
      };
    }

    // Fallback to direct response if structure is different
    return responseData as AuthResponse;
  },

  signInWithPhone: async (payload: SignInPhoneRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<any>("/auth/signin", payload);
    // Handle nested data structure if present
    const responseData = response.data?.data || response.data;

    // Ensure we have the correct structure
    if (responseData.accessToken) {
      const accessToken = responseData.accessToken;
      const user = extractUserFromResponse(responseData, accessToken);

      if (!user) {
        throw new Error("Unable to extract user information from signin response");
      }

      return {
        accessToken,
        refreshToken: responseData.refreshToken,
        user,
      };
    }

    // Fallback to direct response if structure is different
    return responseData as AuthResponse;
  },

  getProfile: async (): Promise<ProfileResponse> => {
    const response = await apiClient.get<any>("/auth/profile");
    // Handle nested { data: {...} } structure
    const raw = response.data?.data || response.data;

    const rawBalance = raw.balance;
    const balance =
      typeof rawBalance === "number" ? rawBalance : typeof rawBalance === "string" ? Number(rawBalance) : undefined;

    const rawStartDayMonth = raw.startDayMonth;
    const startDayMonth =
      typeof rawStartDayMonth === "number"
        ? rawStartDayMonth
        : typeof rawStartDayMonth === "string"
          ? Number(rawStartDayMonth)
          : undefined;

    const profile: ProfileResponse = {
      id: raw.id,
      name: raw.name,
      email: raw.email,
      phone: raw.phone,
      status: raw.status,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      balance: Number.isFinite(balance as number) ? (balance as number) : undefined,
      startDayMonth: Number.isFinite(startDayMonth as number) ? (startDayMonth as number) : undefined,
    };

    return profile;
  },

  changePassword: async (payload: ChangePasswordRequest): Promise<GenericSuccessResponse> => {
    const response = await apiClient.put<GenericSuccessResponse>("/auth/change-password", payload);
    return response.data;
  },

  updateUser: async (userId: string, balance?: number, startDayMonth?: number): Promise<GenericSuccessResponse> => {
    const response = await apiClient.put<GenericSuccessResponse>(
      `/users/${userId}`,
      balance
        ? {
            balance,
          }
        : startDayMonth
          ? {
              startDayMonth,
            }
          : {},
    );
    return response.data;
  },
};
