// File: app/types/category.ts

export interface Category {
  id: string;
  name: string;
  userId: string;
  purpose?: string;
  formulaHint?: string;
  note?: string;
  isDefault: boolean;
  icon: string;
  subCategories: SubCategory[];
}

export interface SubCategory {
  id: string;
  name: string;
  userId: string;
  categoryId: string;
  icon: string;
}

export interface CategoriesResponse {
  data: Category[];
}

export interface QuickCategory {
  id: string;
  label: string;
  emoji: string;
}

export interface CreateSubCategoryRequest {
  name: string;
  categoryId: string;
  userId: string;
  icon: string;
}

export interface CreateSubCategoryResponse {
  id: string;
  name: string;
  categoryId: string;
  userId: string;
  icon: string;
}
