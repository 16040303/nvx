# NuverxAI Project

Tài liệu này hướng dẫn cách cài và chạy project sau khi clone về máy.

## 1. Yêu cầu trước khi chạy

Cần cài sẵn:

- Node.js
- npm

Project này dùng **npm**, nên không cần dùng `pnpm` hoặc `yarn`.

## 2. Cài thư viện

Mở terminal tại thư mục project, sau đó chạy:

```bash
npm install
```

Lệnh này sẽ tải các thư viện cần thiết vào thư mục `node_modules/`.

## 3. Chạy project trên máy

Sau khi cài xong thư viện, chạy:

```bash
npm run dev
```

Sau đó mở trình duyệt và truy cập:

```text
http://localhost:3000
```

## 4. Kiểm tra lỗi code cơ bản

Trước khi bàn giao hoặc sau khi sửa code, chạy:

```bash
npm run lint
```

Nếu không báo lỗi là ổn.

## 5. Build thử bản chính thức

Khi cần kiểm tra project có thể đóng gói để chạy thật hay không, dùng:

```bash
npm run build
```

Nếu chỉ sửa giao diện nhỏ thì thường chưa cần chạy lệnh này.

## 6. Các thư mục cần chú ý

| Thư mục/file            | Ý nghĩa                                                  |
| ----------------------- | -------------------------------------------------------- |
| `app/`                  | Chứa các trang chính của website.                        |
| `components/`           | Chứa các phần giao diện dùng lại.                        |
| `lib/`                  | Chứa dữ liệu mẫu và phần xử lý dùng chung.               |
| `public/assets/`        | Ảnh/logo/icon website đang dùng.                         |
| `public/uploads/`       | Ảnh/video người dùng upload khi demo. Không nên xóa bừa. |
| `Doc/PROJECT_DETAIL.md` | Tài liệu giải thích project chi tiết cho người mới.      |

## 7. Lưu ý khi clone project

- Không sửa tay thư mục `node_modules/`.
- Không sửa tay thư mục `.next/`.
- Nếu thiếu ảnh upload cũ, kiểm tra thư mục `public/uploads/`.
- Nếu ảnh logo/icon không hiện, kiểm tra thư mục `public/assets/`.
- Nếu chạy lỗi, thử xóa `node_modules/` rồi chạy lại `npm install`.

## 8. Tài khoản/dữ liệu demo

Project hiện chủ yếu dùng dữ liệu mẫu và dữ liệu lưu tạm trên trình duyệt.

Điều này có nghĩa là:

- Chưa có cơ sở dữ liệu thật.
- Một số thay đổi chỉ lưu trên trình duyệt đang dùng.
- Nếu đổi máy, đổi trình duyệt hoặc xóa dữ liệu trình duyệt thì dữ liệu tạm có thể mất.

## 9. Tài liệu nên đọc thêm

- `Doc/PROJECT_DETAIL.md`: giải thích project chi tiết.
- `Doc/PROJECT_STRUCTURE.md`: tóm tắt cấu trúc thư mục.
- `Doc/PROJECT_AUDIT.md`: ghi chú về cấu trúc và hướng dọn project.
