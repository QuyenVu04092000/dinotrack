export interface ILoginRequest {
  phone: string;
  password: string;
}
export interface IRegisterRequest {
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface IChangePasswordRequest {
  confirmPassword: string;
  oldPassword: string;
  newPassword: string;
}
