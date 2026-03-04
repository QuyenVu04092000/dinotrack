// File: app/hooks/useCategories.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { categoryApi } from "../services/categoryApi";
import { Category } from "../types/category";
import { extractErrorMessage } from "../lib/apiClient";
import type { UseCategoriesResult } from "../types/categoriesHooks";

export const useCategories = (): UseCategoriesResult => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await categoryApi.getCategories();
      setCategories(data);
    } catch (err) {
      const message = extractErrorMessage(err);
      setError(message);
      setCategories([]); // Clear categories on error
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    isLoading,
    error,
    refetch: fetchCategories,
  };
};
