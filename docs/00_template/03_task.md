---
feature: budget-improve
status: In-Progress
created_at: 2026-06-11
updated_at: 2026-06-11
---

# Feature Task List

<!-- AI_TAGS: BUDGET_IMPROVE -->

## FRONTEND (FE)

### Utility
- [x] **FE-01**: Thêm `getCurrentFinancialPeriodStart()` vào `app/utilities/common/functions.ts`
  - [x] Extract logic tính kỳ tài chính hiện đang duplicate ở 2 chỗ: `useBudgetsList.ts` dòng 43–65 và `useCreateBudget.ts` dòng 49–61
  - [x] Signature: `export function getCurrentFinancialPeriodStart(startDayMonth: number): Date`
  - [x] Logic: nếu `today.getDate() < startDayMonth` thì lùi về tháng trước; trả về `new Date(year, month, 1)`
  - [x] Thêm JSDoc mô tả tham số và giá trị trả về

### Types
- [x] **FE-02**: Thêm `UseBudgetsListResult` và `CategoryBudgets` vào `app/types/budgets.ts`
  - [x] Export `CategoryBudgets` type (hiện đang khai báo nội bộ trong `useBudgetsList.ts`)
  - [x] Thêm interface `UseBudgetsListResult` với 8 fields: `loading`, `error`, `periodLabel`, `budgetsByCategory`, `isCurrentMonth`, `hasStartDayMonth`, `goToPrevMonth`, `goToNextMonth`

### Hook
- [x] **FE-03**: Refactor `app/hooks/useBudgetsList.ts`
  - [x] Import `getCurrentFinancialPeriodStart` từ `app/utilities/common/functions`
  - [x] Import `UseBudgetsListResult`, `CategoryBudgets` từ `app/types/budgets`
  - [x] Import `extractErrorMessage` từ `app/lib/apiClient`
  - [x] Thêm state `selectedMonth: Date` — init bằng `getCurrentFinancialPeriodStart(startDayMonth)`
  - [x] Thêm state `error: string | null` — init `null`
  - [x] Tính `monthParam` từ `selectedMonth` thay vì `today`
  - [x] Tính `periodLabel` từ `selectedMonth` + `startDayMonth`
  - [x] Tính `isCurrentMonth`: so sánh year+month của `selectedMonth` với `currentPeriodStart`
  - [x] Tính `hasStartDayMonth`: `Boolean(user?.startDayMonth)`
  - [x] Thêm `goToPrevMonth`: `setSelectedMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))`
  - [x] Thêm `goToNextMonth`: `setSelectedMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))`
  - [x] Trong `catch` của `fetchBudgets`: thay `console.error` bằng `setError(extractErrorMessage(err))`
  - [x] Return type là `UseBudgetsListResult`

### Component mới
- [x] **FE-04**: Tạo `app/components/budgets/MonthNavigator.tsx`
  - [x] Props: `periodLabel: string`, `onPrev: () => void`, `onNext: () => void`, `isNextDisabled: boolean`
  - [x] UI: nút `<` — text periodLabel ở giữa — nút `>`
  - [x] Nút `>`: `disabled={isNextDisabled}` + `className` có `disabled:opacity-40 disabled:cursor-not-allowed`
  - [x] Dùng `"use client"` directive

### Component sửa
- [x] **FE-05**: Cập nhật `app/components/budgets/ListBudgets.tsx`
  - [x] Destructure thêm `error`, `isCurrentMonth`, `hasStartDayMonth`, `goToPrevMonth`, `goToNextMonth` từ `useBudgetsList()`
  - [x] Import `MonthNavigator` từ `app/components/budgets/MonthNavigator`
  - [x] Thay block `<p ...>{periodLabel}</p>` bằng `<MonthNavigator periodLabel={periodLabel} onPrev={goToPrevMonth} onNext={goToNextMonth} isNextDisabled={isCurrentMonth} />`
  - [x] Ẩn nút "Thêm ngân sách" khi `!isCurrentMonth`: wrap bằng `{isCurrentMonth && <button ...>}`
  - [x] Hiển thị banner khi `!hasStartDayMonth`: text "Vào Cài đặt để tuỳ chỉnh ngày bắt đầu tháng" — style `bg-yellow-50 text-yellow-700`
  - [x] Hiển thị `error` khi fetch thất bại: `{error && <p className="text-sm text-red-500">{error}</p>}`
  - [x] Empty state: khi `isCurrentMonth` hiện "Tháng này chưa có ngân sách nào" + gợi ý thêm; khi `!isCurrentMonth` chỉ hiện "Tháng này chưa có ngân sách nào"

---

## VERIFICATION

- [x] Chạy `npm test` — pre-existing `jsdom` missing, không liên quan code mới; TypeScript check ✅ pass
- [x] Logic `getCurrentFinancialPeriodStart`: hôm nay 11/06, `startDayMonth=15` → trả về 01/05 ✅
- [x] `isCurrentMonth` đúng khi ở tháng hiện tại (true) và tháng trước (false) ✅
- [x] `goToPrev` / `goToNext` dịch chuyển tháng đúng ✅
- [x] `hasStartDayMonth`: true khi có giá trị, false khi null/undefined ✅
- [ ] Test thủ công: bấm `<` để xem tháng trước — `periodLabel` và danh sách cập nhật đúng
- [ ] Test thủ công: ở tháng hiện tại — nút `>` disabled, nút "Thêm ngân sách" hiển thị
- [ ] Test thủ công: ở tháng quá khứ — nút "Thêm ngân sách" ẩn
- [ ] Test thủ công: user chưa cài `startDayMonth` — banner vàng hiện ra
