import type { LoginRequest, AuthResponse, RegisterRequest } from "./auth";

export interface UseSignInResult {
  loginUser: (payload: LoginRequest) => Promise<any>;
  isLoading: boolean;
  isSuccess: boolean;
  error: string | null;
  handleSubmit: (formData: FormData) => Promise<void>;
}

export interface UseLoginResult {
  loginUser: (payload: LoginRequest) => Promise<AuthResponse | null>;
  isLoading: boolean;
  isSuccess: boolean;
  error: string | null;
}

export interface UseRegisterProps {
  goNext: () => void;
}

export interface UseRegisterResult {
  isLoading: boolean;
  isSuccess: boolean;
  error: string | null;
  setName: (name: string) => void;
  setPhone: (phone: string) => void;
  setPassword: (password: string) => void;
  setPasswordConfirm: (passwordConfirm: string) => void;
  validationError: string | null;
  formValid: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  name: string;
  phone: string;
  password: string;
  passwordConfirm: string;
}
