import type { Category } from "./category";

export interface UseCategoriesResult {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}
