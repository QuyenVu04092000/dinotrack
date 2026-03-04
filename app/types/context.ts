import type { AuthResponse, AuthUser } from "./auth";

export interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
}

export interface AuthContextValue extends AuthState {
  isAuthenticated: boolean;
  isTokenValid: boolean;
  login: (auth: AuthResponse) => void;
  logout: () => void;
  reloadProfile: () => Promise<void>;
}

export interface FooterContextType {
  isFooterVisible: boolean;
  setFooterVisible: (visible: boolean) => void;
}
