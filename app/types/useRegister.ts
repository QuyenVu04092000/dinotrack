export interface UseRegisterProps {
  goNext: () => void;
}

export interface UseRegisterResult {
  isLoading: boolean;
  isSuccess: boolean;
  error: string | null;
  setName: (name: string) => void;
  setPhone: (phone: string) => void;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setPasswordConfirm: (passwordConfirm: string) => void;
  validationError: string | null;
  formValid: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  name: string;
  phone: string;
  email: string;
  password: string;
  passwordConfirm: string;
}
