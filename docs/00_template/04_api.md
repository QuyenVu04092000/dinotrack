---
feature: [slug-feature-name]
base_url: /api
---

# API Documentation

<!-- AI_PARSER: API_SPEC -->

> Điền spec của từng endpoint mà feature này cần gọi.
> Nguồn thông tin: backend swagger, Insomnia collection (`insomnia.collection.json`), hoặc hỏi trực tiếp backend dev.

---

## 1. [Tên API — Ví dụ: Get Transaction List]

**Endpoint**: `GET /transactions`
**Auth Required**: Yes (Bearer Token — tự động qua `apiClient.ts`)

### Overview
[Mô tả chi tiết về chức năng của API này. Ví dụ: API này trả về danh sách giao dịch trong một khoảng thời gian, hỗ trợ filter theo loại (in/out) và danh mục. Kết quả được sort theo ngày giảm dần.]

### Query Params

| Param | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `startDate` | `string` | No | ISO 8601, ví dụ: `2025-01-01T00:00:00+07:00` |
| `endDate` | `string` | No | ISO 8601 |
| `type` | `"in" \| "out"` | No | Lọc theo loại giao dịch |

### Success Response (200)

```json
{
  "data": [
    {
      "id": "abc123",
      "type": "out",
      "amount": 150000,
      "categoryName": "Ăn uống",
      "createdAt": "2025-06-10T12:00:00+07:00"
    }
  ]
}
```

### Error Responses

| HTTP Status | Message | Mô tả |
| :--- | :--- | :--- |
| `401` | Unauthorized | Token hết hạn hoặc không hợp lệ |
| `500` | Internal Server Error | Lỗi phía server |

### Service function
```typescript
// app/services/transactionApi.ts
getAllTransactions: async (params: GetAllTransactionsParams): Promise<GetAllTransactionsResponse>
```

---

## 2. [Tên API tiếp theo — Ví dụ: Update Transaction]

**Endpoint**: `PUT /transactions/:id`
**Auth Required**: Yes

### Overview
[Mô tả...]

### Request Payload

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `amount` | `number` | No | Số tiền mới (integer, VND) |
| `categoryId` | `string` | No | ID danh mục mới |
| `note` | `string` | No | Ghi chú |
| `createdAt` | `string` | No | ISO 8601 với +07:00 |

### Example Request
```json
{
  "amount": 200000,
  "categoryId": "cat-uuid",
  "createdAt": "2025-06-10T09:30:00+07:00"
}
```

### Success Response (200)
```json
{
  "id": "abc123",
  "amount": 200000,
  "categoryName": "Di chuyển"
}
```

### Error Responses

| HTTP Status | Message | Mô tả |
| :--- | :--- | :--- |
| `400` | Bad Request | Payload sai format |
| `404` | Not Found | Giao dịch không tồn tại |
| `401` | Unauthorized | Token không hợp lệ |

### Service function
```typescript
// app/services/transactionApi.ts
updateTransaction: async (id: string, payload: UpdateTransactionRequest): Promise<TransactionResponse>
```
