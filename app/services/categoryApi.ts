// File: app/services/categoryApi.ts
import { apiClient } from "../lib/apiClient";
import {
  Category,
  CategoriesResponse,
  CreateSubCategoryRequest,
  CreateSubCategoryResponse,
  SubCategory,
} from "../types/category";

export const categoryApi = {
  getCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get<CategoriesResponse | Category[]>("/categories");
    // Handle nested data structure, relax typing to avoid 'never' issues
    const raw: any = response.data;
    const responseData: any = raw?.data ?? raw;

    // If response.data is an array, return it directly
    if (Array.isArray(responseData)) {
      return responseData;
    }

    // If response.data has a data property with array
    if (responseData?.data && Array.isArray(responseData.data)) {
      return responseData.data;
    }

    // Fallback: return empty array
    return [];
  },

  getDefaultCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get<CategoriesResponse | Category[]>("/categories/default");
    // Handle nested data structure
    const raw: any = response.data;
    const responseData: any = raw?.data ?? raw;

    if (Array.isArray(responseData)) {
      return responseData;
    }

    if (responseData?.data && Array.isArray(responseData.data)) {
      return responseData.data;
    }

    return [];
  },

  createSubCategory: async (payload: CreateSubCategoryRequest): Promise<CreateSubCategoryResponse> => {
    const response = await apiClient.post<CreateSubCategoryResponse>("/sub-categories", {
      name: payload.name,
      categoryId: payload.categoryId,
      userId: payload.userId,
      icon: payload.icon,
    });
    // Handle nested data structure
    const raw: any = response.data;
    return raw?.data ?? raw;
  },

  getSubCategories: async (): Promise<SubCategory[]> => {
    const response = await apiClient.get<any>("/sub-categories");
    const raw: any = response.data;
    const data: any = raw?.data ?? raw;

    if (Array.isArray(data)) {
      return data as SubCategory[];
    }

    return [];
  },
};
