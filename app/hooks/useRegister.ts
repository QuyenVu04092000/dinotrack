// File: app/hooks/useRegister.ts
"use client";

import { useState, useCallback } from "react";
import { authApi } from "../services/authApi";
import { RegisterRequest } from "../types/auth";
import { extractErrorMessage } from "../lib/apiClient";
import type { UseRegisterProps, UseRegisterResult } from "../types/useRegister";

export const useRegister = ({ goNext }: UseRegisterProps): UseRegisterResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const validateRegistration = useCallback(
    (name: string, phone: string, email: string, password: string, passwordConfirm: string): string | null => {
      if (!name.trim()) {
        return "Vui lòng nhập tên của bạn.";
      }

      if (!phone.trim()) {
        return "Vui lòng nhập số điện thoại.";
      }

      if (!email.trim()) {
        return "Vui lòng nhập email.";
      }

      if (!/^[^@]+@[^@]+$/.test(email)) {
        return "Email không hợp lệ.";
      }

      if (email.length > 50) {
        return "Email phải có tối đa 50 ký tự.";
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return "Email không hợp lệ.";
      }

      if (!password) {
        return "Vui lòng nhập mật khẩu.";
      }

      if (password.length < 6) {
        return "Mật khẩu phải có ít nhất 6 ký tự.";
      }

      if (password !== passwordConfirm) {
        return "Mật khẩu xác nhận không khớp.";
      }

      return null;
    },
    [],
  );

  const isFormValid = useCallback(
    (name: string, phone: string, email: string, password: string, passwordConfirm: string): boolean => {
      return (
        !!name.trim() &&
        !!phone.trim() &&
        !!email.trim() &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
        email.length <= 50 &&
        !!password &&
        !!passwordConfirm &&
        password === passwordConfirm &&
        password.length >= 6
      );
    },
    [],
  );

  const registerUser = useCallback(async (payload: RegisterRequest) => {
    setIsLoading(true);
    setIsSuccess(false);
    setError(null);
    try {
      const response = await authApi.register(payload);
      setIsSuccess(true);
      return response;
    } catch (err) {
      const message = extractErrorMessage(err);
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Validation using hook function
    const validationErr = validateRegistration(name, phone, email, password, passwordConfirm);
    if (validationErr) {
      setValidationError(validationErr);
      return;
    }

    // Call register API
    const response = await registerUser({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      password: password,
    });

    if (response) {
      // Store registration response for Step2
      if (typeof window !== "undefined") {
        localStorage.setItem("pendingRegistration", JSON.stringify(response));
      }
      // Go to next step
      goNext();
    }
  };

  const formValid = isFormValid(name, phone, email, password, passwordConfirm);
  return {
    isLoading,
    isSuccess,
    error,
    setName,
    setPhone,
    setEmail,
    setPassword,
    setPasswordConfirm,
    validationError,
    formValid,
    handleSubmit,
    name,
    phone,
    email,
    password,
    passwordConfirm,
  };
};
