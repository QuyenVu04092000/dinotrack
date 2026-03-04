"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useCategories } from "./useCategories";
import { useAuthContext } from "app/context/AuthContext";
import { categoryApi } from "app/services/categoryApi";
import { extractErrorMessage } from "app/lib/apiClient";
import { ICON_OPTIONS } from "app/constants/icons";

interface UseCreateCategoryResult {
  // Form state
  categoryName: string;
  setCategoryName: (name: string) => void;
  selectedCategoryId: string | null;
  setSelectedCategoryId: (id: string | null) => void;
  selectedIcon: string;
  setSelectedIcon: (icon: string) => void;
  isIconPickerOpen: boolean;
  setIsIconPickerOpen: (isOpen: boolean) => void;

  // Validation
  isFormValid: boolean;

  // Submission
  handleConfirm: () => Promise<void>;
  isSubmitting: boolean;
  submitError: string | null;
  submitSuccess: boolean;

  // Data
  categories: ReturnType<typeof useCategories>["categories"];
  iconOptions: string[];

  // Navigation
  handleBack: () => void;
}

export const useCreateCategory = (): UseCreateCategoryResult => {
  const router = useRouter();
  const { categories } = useCategories();
  const { user } = useAuthContext();

  // Form state
  const [categoryName, setCategoryName] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedIcon, setSelectedIcon] = useState("🏀"); // Default icon
  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Validation
  const isFormValid = categoryName.trim().length > 0 && selectedCategoryId && user?.id;

  // Handle form submission
  const handleConfirm = useCallback(async () => {
    if (!isFormValid || !user?.id || !selectedCategoryId) return;

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      await categoryApi.createSubCategory({
        name: categoryName.trim(),
        categoryId: selectedCategoryId,
        userId: user.id,
        icon: selectedIcon,
      });

      setSubmitSuccess(true);
      // Navigate back after successful creation
      setTimeout(() => {
        router.back();
      }, 1000);
    } catch (error) {
      const message = extractErrorMessage(error);
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  }, [isFormValid, user?.id, selectedCategoryId, categoryName, selectedIcon, router]);

  // Handle back navigation
  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  return {
    // Form state
    categoryName,
    setCategoryName,
    selectedCategoryId,
    setSelectedCategoryId,
    selectedIcon,
    setSelectedIcon,
    isIconPickerOpen,
    setIsIconPickerOpen,

    // Validation
    isFormValid: Boolean(isFormValid),

    // Submission
    handleConfirm,
    isSubmitting,
    submitError,
    submitSuccess,

    // Data
    categories,
    iconOptions: ICON_OPTIONS,

    // Navigation
    handleBack,
  };
};
