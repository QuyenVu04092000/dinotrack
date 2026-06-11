# AI Prompt Library (Dành cho Dev "lười")

Sử dụng các prompt mẫu dưới đây để điều khiển AI làm việc dựa trên bộ template docs.
Chỉ cần copy-paste và điền thêm thông tin vào chỗ trống `[...]`.

---

## 1. Giai đoạn Phân tích Yêu cầu (Requirement)
> **Mục tiêu**: Bắt đầu một feature mới và yêu cầu AI rà soát logic.

**Prompt**:
```
Hãy đọc file `01_requirement.md` và liệt kê cho tôi 5 trường hợp edge-case hoặc rủi ro logic mà PO chưa đề cập đến. Trả lời bằng tiếng Việt.
```

---

## 2. Giai đoạn Thiết kế Kỹ thuật (Technical Design)
> **Mục tiêu**: Để AI tự viết bản thiết kế dựa trên yêu cầu.

**Prompt**:
```
Dựa trên `01_requirement.md`, hãy soạn thảo nội dung cho file `02_technical_design.md`.
Bao gồm:
- Flow diagram bằng Mermaid
- Component tree (danh sách component cần tạo/sửa)
- State design (state nào cần, ở đâu, hook nào quản lý)
- Các thay đổi API cần thiết (nếu có)
```

---

## 3. Giai đoạn Lập kế hoạch (Tasking)
> **Mục tiêu**: Để AI chia nhỏ task để "nhai" dần.

**Prompt**:
```
Hãy phân tích `01_requirement.md` và `02_technical_design.md`. Sau đó lập danh sách task chi tiết vào file `03_task.md`.
Chia rõ các phần FE và API (nếu có). Mỗi task cần có mô tả cụ thể từng bước thực hiện.
```

---

## 4. Giai đoạn Code (Implementation)
> **Mục tiêu**: Yêu cầu AI thực hiện một task cụ thể trong danh sách.

**Prompt**:
```
Hãy nhìn vào `03_task.md` và thực hiện Task ID `[Ví dụ: FE-01]`.
Nhớ tuân thủ:
- Spec API trong `04_api.md`
- Convention trong `05_coding_convention.md`
- CLAUDE.md ở root project

Code xong hãy tự chạy `npm test` nếu có test liên quan.
```

---

## 6. Giai đoạn Review Code
> **Mục tiêu**: Nhờ AI làm "Senior Reviewer" soát lỗi logic, bug và style.

**Prompt**:
```
Hãy đóng vai một Senior Frontend Developer, review các thay đổi trong branch hiện tại dựa trên nội dung Task `[Copy nội dung task vào đây hoặc chỉ định file 03_task.md]`.

Công việc cần làm:
1. Phân tích xem các thay đổi có bám sát yêu cầu nghiệp vụ của task hay không.
2. Kiểm tra lỗi logic, khả năng gây crash, performance và accessibility.
3. Kiểm tra có tuân thủ convention trong `05_coding_convention.md` không.

Output yêu cầu — duyệt qua từng vấn đề tìm thấy và trình bày theo format:
- **Đoạn code**: [file:dòng hoặc copy đoạn code có vấn đề]
- **Vấn đề & Giải pháp**: [Mô tả chi tiết lỗi và cách sửa tối ưu]
- **Mức độ**: [Nghiêm trọng | Cần sửa | Góp ý/Refactor]

Cuối cùng, hãy đưa ra đánh giá tổng quan: **Pass** hay **Needs Changes**.
```

---

## 7. Giai đoạn Debug
> **Mục tiêu**: Nhờ AI debug một bug cụ thể.

**Prompt**:
```
Tôi gặp bug sau: [Mô tả bug, kèm error message hoặc screenshot nếu có]

File liên quan: [Tên file]
Hành vi kỳ vọng: [...]
Hành vi thực tế: [...]

Hãy đọc file liên quan, tìm nguyên nhân gốc rễ và đề xuất cách sửa. Đừng sửa code khi chưa giải thích nguyên nhân.
```

---

*Mẹo: Thêm câu "Hãy trả lời bằng tiếng Việt" vào cuối mỗi prompt nếu muốn AI giải thích chi tiết hơn bằng tiếng mẹ đẻ!*
