// File: app/types/transaction.ts

export type ApiTransactionType = "in" | "out";

export interface CreateTransactionRequest {
  type: ApiTransactionType;
  amount: number;
  categoryId: string;
  subCategoryId?: string | null;
  status: "ACTIVE" | "INACTIVE" | string;
  createdAt: string; // YYYY-MM-DD
  note?: string;
}

export interface TransactionResponse {
  id: string;
  type: ApiTransactionType;
  amount: number;
  categoryId: string;
  subCategoryId?: string | null;
  status: string;
  createdAt: string;
  note?: string;
  subCategoryName: string;
  categoryName: string;
}
