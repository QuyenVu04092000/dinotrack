# Coding Convention — financial_management_fe

> AI phải đọc file này trước khi bắt đầu code bất kỳ task nào.
> Đây là các quy tắc bắt buộc, không được bỏ qua.

---

## 1. Luồng tổng quát

```
User Action → Component → Hook → Service → apiClient (Axios) → Backend API
                                               ↓
                                         State update → Re-render
```

- **Component**: Nhận props, render UI, gọi handler từ hook. Không chứa logic nghiệp vụ.
- **Hook** (`app/hooks/`): Chứa toàn bộ state và logic. Return typed object.
- **Service** (`app/services/`): Gọi API thông qua `apiClient`. Không chứa state.
- **apiClient** (`app/lib/apiClient.ts`): Axios instance với JWT interceptor tự động.

---

## 2. Component Rules

### 2.1 Luôn dùng `"use client"`
Tất cả component trong project này là Client Component:
```typescript
// ĐÚNG
"use client";

export function MyComponent({ value }: MyComponentProps) { ... }
```

### 2.2 Props interface bắt buộc — khai báo ngay trên component
```typescript
// ĐÚNG
interface EditTransactionModalProps {
  transaction: TransactionResponse;
  onSave: (id: string, payload: UpdateTransactionRequest) => Promise<void>;
  onClose: () => void;
}

export function EditTransactionModal({ transaction, onSave, onClose }: EditTransactionModalProps) { ... }

// SAI — không dùng inline type hoặc bỏ qua interface
export function EditTransactionModal({ transaction, onSave }: { transaction: any; onSave: any }) { ... }
```

### 2.3 Tailwind CSS — không dùng inline style
```typescript
// ĐÚNG
<div className="flex items-center justify-between px-4 py-2 bg-background border border-border rounded-lg">

// SAI
<div style={{ display: 'flex', padding: '8px 16px' }}>
```

### 2.4 Custom color tokens — dùng token, không hardcode màu
```typescript
// ĐÚNG — dùng token từ tailwind.config.mjs
className="text-primary bg-background border-border text-muted-foreground"

// SAI — hardcode màu
className="text-blue-500 bg-white"
```

---

## 3. Custom Hook Rules

### 3.1 Mỗi hook có một return interface rõ ràng
```typescript
// ĐÚNG
interface UseTransactionsPageResult {
  isLoading: boolean;
  error: string | null;
  groupedTransactions: GroupedTransaction[];
  handleEditSave: (id: string, payload: UpdateTransactionRequest) => Promise<void>;
}

export const useTransactionsPage = (): UseTransactionsPageResult => { ... }
```

### 3.2 Pattern refresh data sau mutation
```typescript
// ĐÚNG — dùng counter để trigger useEffect
const [refreshToken, setRefreshToken] = useState(0);

useEffect(() => {
  fetchData();
}, [refreshToken]); // re-fetch khi counter thay đổi

const handleDelete = useCallback(async (id: string) => {
  await transactionApi.deleteTransaction(id);
  setRefreshToken((t) => t + 1); // trigger refresh
}, []);
```

### 3.3 useCallback cho mọi handler trả về từ hook
```typescript
// ĐÚNG
const handleSubmit = useCallback(async (payload: CreateTransactionRequest) => {
  setIsLoading(true);
  try {
    await transactionApi.createTransaction(payload);
    setRefreshToken((t) => t + 1);
  } catch (err) {
    setError(extractErrorMessage(err));
  } finally {
    setIsLoading(false);
  }
}, []);

return { handleSubmit }; // component nhận function ổn định, không re-render thừa
```

---

## 4. API Service Rules

### 4.1 Service là object có các method — không export function lẻ
```typescript
// ĐÚNG
export const transactionApi = {
  createTransaction: async (payload: CreateTransactionRequest): Promise<TransactionResponse> => {
    const response = await apiClient.post<TransactionResponse>("/transactions", payload);
    return response.data;
  },
  updateTransaction: async (id: string, payload: UpdateTransactionRequest): Promise<TransactionResponse> => {
    const response = await apiClient.put<TransactionResponse>(`/transactions/${id}`, payload);
    return response.data;
  },
};

// SAI — export function lẻ
export async function createTransaction(payload: CreateTransactionRequest) { ... }
```

### 4.2 Normalize response defensively khi API trả về cấu trúc không ổn định
```typescript
// ĐÚNG — xử lý nhiều response shape
const raw = response.data as TransactionResponse[] | { data: TransactionResponse[] };
if (Array.isArray(raw)) return { data: raw };
if ("data" in raw && Array.isArray(raw.data)) return { data: raw.data };
return { data: [] };
```

### 4.3 Luôn dùng `extractErrorMessage()` để xử lý lỗi
```typescript
// ĐÚNG
import { extractErrorMessage } from "app/lib/apiClient";

try {
  await transactionApi.deleteTransaction(id);
} catch (err) {
  setError(extractErrorMessage(err)); // chuẩn hóa thành string hiển thị được
}

// SAI
} catch (err: any) {
  setError(err.message || "Lỗi không xác định");
}
```

---

## 5. TypeScript Rules

### 5.1 Không dùng `any` — luôn dùng interface hoặc union type
```typescript
// ĐÚNG
const raw: TransactionResponse | { data: TransactionResponse } = response.data;

// SAI
const raw: any = response.data;
```

### 5.2 Types tổ chức theo feature trong `app/types/`
```
app/types/
├── transaction.ts   → CreateTransactionRequest, TransactionResponse, UpdateTransactionRequest
├── category.ts      → Category, SubCategory
├── budget.ts        → Budget, CreateBudgetRequest
├── auth.ts          → AuthUser, LoginRequest, AuthResponse
└── api.ts           → ApiErrorResponse (dùng chung)
```

### 5.3 Tách Request type và Response type
```typescript
// ĐÚNG — tách rõ ràng
export interface UpdateTransactionRequest {
  amount?: number;
  categoryId?: string;
  createdAt?: string;
}

export interface TransactionResponse {
  id: string;
  amount: number;
  categoryName: string;
  createdAt: string;
}
```

---

## 6. Date & Currency — Luôn dùng utility functions

**File**: `app/utilities/common/functions.ts`

| Function | Khi nào dùng | Ví dụ |
| :--- | :--- | :--- |
| `formatVietnameseCurrency(amount)` | Hiển thị số tiền | `150.000 ₫` |
| `formatAmountInput(value)` | Hiển thị trong input | `"150.000đ"` |
| `parseAmountInput(value)` | Lấy số từ input trước khi gửi API | `150000` |
| `toVietnamISO(date, time?)` | Gửi date lên API | `"2025-06-10T09:30:00+07:00"` |
| `formatDateDDMMYYYY(date)` | Hiển thị ngày trên UI | `"10/06/2025"` |

**QUAN TRỌNG — Không bao giờ dùng `new Date().toLocaleDateString()`** vì sẽ bị lệch timezone.

```typescript
// ĐÚNG
import { formatDateDDMMYYYY } from "app/utilities/common/functions";
const display = formatDateDDMMYYYY(transaction.createdAt); // "10/06/2025"

// SAI — bị lệch timezone
const display = new Date(transaction.createdAt).toLocaleDateString("vi-VN");
```

---

## 7. Authentication & State

### 7.1 Dùng `useAuthContext()` để lấy user info
```typescript
// ĐÚNG
import { useAuthContext } from "app/context/AuthContext";

const { user, isAuthenticated, logout } = useAuthContext();
```

### 7.2 Không đọc localStorage trực tiếp trong component/hook
Tất cả auth state đã được quản lý trong `AuthContext`. Không cần đọc `localStorage.getItem("accessToken")` trong component.

---

## 8. File Naming

| Loại file | Convention | Ví dụ |
| :--- | :--- | :--- |
| Component | PascalCase | `EditTransactionModal.tsx` |
| Hook | camelCase, prefix `use` | `useTransactionsPage.ts` |
| Service | camelCase, suffix `Api` | `transactionApi.ts` |
| Type file | camelCase | `transaction.ts` |
| Utility | camelCase | `functions.ts` |
| Page | `page.tsx` (Next.js convention) | `app/(main)/home/page.tsx` |

---

## 9. Testing Rules

- Unit test đặt trong `__tests__/` — mirror cấu trúc source
- Chạy `npm test` trước khi commit — không được để failing test
- Mỗi hook mới phải có test coverage cho happy path và error case
