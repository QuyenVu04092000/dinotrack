// File: app/types/auth.ts
export type UserStatus = "ACTIVE" | "INACTIVE" | "PENDING" | string;

export interface AuthUser {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  status?: UserStatus;
  createdAt?: string;
  updatedAt?: string;
  balance?: number;
  startDayMonth?: number;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface LoginRequest {
  phone: string;
  password: string;
}

export interface SignInPhoneRequest {
  phone: string;
  password: string;
}

export interface ChangePasswordRequest {
  phone: string;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  user: AuthUser;
}

export interface ProfileResponse extends AuthUser {}

export interface GenericSuccessResponse {
  success: boolean;
  message?: string;
}
