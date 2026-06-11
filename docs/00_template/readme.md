# Template Docs

Mỗi feature có một folder riêng trong `/docs`. Folder chứa đủ context để AI (Claude / Cursor) hiểu yêu cầu, thiết kế và convention — không cần giải thích lại từ đầu mỗi lần.

---

## Bắt đầu feature mới

```
cp -r docs/00_template docs/[tên-feature]
```

Sau đó điền vào từng file theo thứ tự `01 → 02 → 03 → 04`.

---

## Các file trong template

| File | Ai điền | Nội dung |
| :--- | :--- | :--- |
| `00_ai_prompts.md` | Dev | Prompt mẫu cho từng giai đoạn — copy & paste là dùng được |
| `01_requirement.md` | Dev | Yêu cầu từ PO: mục tiêu, user stories, acceptance criteria, edge cases |
| `02_technical_design.md` | Dev / AI | Flow diagram, component tree, state & hook design, API cần gọi |
| `03_task.md` | Dev / AI | Danh sách task FE chia nhỏ — AI thực hiện từng task theo ID |
| `04_api.md` | Dev | Spec API do backend cung cấp: endpoint, payload, response, error codes |
| `05_coding_convention.md` | — | Convention cố định của codebase. Không sửa, AI đọc trước khi code |

> `04_api.md` chỉ điền khi feature có gọi API mới. Nguồn: swagger của backend hoặc Insomnia collection ở root project.

---

## Flow làm việc

```
01_requirement  →  02_technical_design  →  03_task  →  code từng task
      ↑                                                        ↑
  (Dev điền)                                         (AI đọc 04_api + 05_convention)
```

1. Điền `01_requirement.md` → dùng prompt #1 trong `00_ai_prompts.md` để AI tìm edge cases còn thiếu.
2. Dùng prompt #2 để AI draft `02_technical_design.md`.
3. Dùng prompt #3 để AI tạo task list vào `03_task.md`.
4. Khi code: dùng prompt #4, chỉ định task ID — AI tự đọc `04_api.md` và `05_coding_convention.md`.
