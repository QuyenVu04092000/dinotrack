# Feature Requirement: [Tên Feature]

> **Nguồn**: [Link Ticket / Tên PO]
> **Ngày tạo**: YYYY-MM-DD
> **Assignee**: [Tên Dev]

---

## 1. Mục tiêu

Cải thiện tính năng ngân sách.

---

## 2. User Stories

- **Story 1**: Là người dùng, tôi muốn mình có thể quản lý ngân sách của tôi trong tháng bắt đầu từ ngày bắt đầu của tháng mà tôi đã cài đặt trước đó.
- **Story 2**: Là người dùng, tôi muốn mình có thể xem lịch sử ngân sách của tôi trong quá khứ.

---

## 3. Acceptance Criteria

**Story 1 — Quản lý ngân sách theo kỳ tài chính đã cài đặt**
- [ ] Màn hình `/budgets` hiển thị `periodLabel` đúng theo `startDayMonth` của user — ví dụ: "Tháng 6 (15/06–14/07)" nếu `startDayMonth = 15`
- [ ] Nếu user chưa cài `startDayMonth`, hiển thị mặc định ngày 1 (tháng 1–31) và hiện banner nhắc "Vào Cài đặt để tuỳ chỉnh ngày bắt đầu tháng"
- [ ] Kỳ tài chính tính đúng khi ngày hiện tại < `startDayMonth` — lùi về tháng trước (ví dụ: hôm nay 10/06, `startDayMonth = 15` → đang ở kỳ 15/05–14/06)

**Story 2 — Xem lịch sử ngân sách**
- [ ] Màn hình `/budgets` có 2 nút điều hướng tháng: mũi tên trái (tháng trước) và phải (tháng sau)
- [ ] Nhấn mũi tên → danh sách và `periodLabel` cập nhật theo tháng được chọn
- [ ] Nút mũi tên phải bị disabled khi đang ở tháng hiện tại — không cho chuyển sang tháng tương lai
- [ ] Tháng không có budget nào → hiển thị "Tháng này chưa có ngân sách nào"
- [ ] Khi đang xem tháng quá khứ, nút "Thêm ngân sách" bị ẩn — chỉ được tạo budget cho tháng hiện tại

**Chung**
- [ ] Khi API thất bại → hiển thị thông báo lỗi, không crash màn hình
- [ ] Nếu tạo budget trùng sub-category + tháng đã tồn tại → hiển thị lỗi từ backend, không tạo thêm bản ghi

---

## 4. Edge Cases

[Điền sau khi đã hỏi AI ở bước phân tích — dùng prompt từ 00_ai_prompts.md]

- [ ] Code hiện tại fallback về startDay = 1 khi user?.startDayMonth là null — nhưng requirement Story 1 nói "tháng bắt đầu từ ngày đã cài đặt". Nếu user chưa vào Settings để cài, họ sẽ thấy tháng 1–31 thay vì được nhắc đi cài đặt trước. Cần quyết định: hiển thị mặc định ngày 1, hay redirect/nudge user đi cài startDayMonth?
- [ ] Story 2 nói "xem lịch sử trong quá khứ" nhưng không rõ UX: có bộ chọn tháng (month picker) không, hay chỉ scroll ngược? API getBudgetsSubCategories nhận param month: string — nghĩa là backend đã hỗ trợ, nhưng FE hiện tại hardcode monthParam theo tháng hiện tại, không cho chọn. Cần thiết kế UI cho việc chuyển tháng.
- [ ] Nếu user chọn tháng 3/2025 nhưng họ chưa tạo budget nào tháng đó — hiện tại chỉ có text "Chưa có ngân sách". Với lịch sử quá khứ, UX này có ổn không? Hay cần thông báo rõ hơn kiểu "Tháng này bạn chưa đặt ngân sách"?
- [ ] Ví dụ: user tạo budget tháng 5 khi startDayMonth = 1 (tháng 01/05–31/05). Sau đó đổi startDayMonth = 15. Lịch sử tháng 5 bây giờ sẽ hiển thị theo kỳ nào — kỳ cũ (1–31/5) hay kỳ mới (15/4–14/5)? Backend lưu month = "2025-05" dạng string, không lưu kỳ tài chính thực — nên FE sẽ render sai kỳ khi startDayMonth đã đổi.
- [ ] API POST /budgets/sub-categories không có cơ chế kiểm tra trùng lặp phía FE. Nếu user tạo budget cho "Ăn uống" tháng 6, rồi tạo lại lần nữa cho cùng sub-category cùng tháng — sẽ ra sao? Hai dòng cùng tên hiện trên danh sách, hay backend báo lỗi? Cần xác nhận với backend và xử lý thông báo lỗi phù hợp ở FE.

---

## 5. Ghi chú

[Lưu ý về UI/UX, link Figma, hoặc tích hợp đặc biệt]
