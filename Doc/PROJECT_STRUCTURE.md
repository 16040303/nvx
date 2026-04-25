# Project structure

Mục tiêu của file này là giúp repo dễ nhìn và dễ đặt code hơn **mà không đổi cấu trúc runtime hiện tại**.

## Thư mục chính

### `app/`

Chứa routes theo App Router của Next.js.

- `app/login`, `app/reset-password`: luồng xác thực
- `app/dashboard`: giao diện dashboard
- `app/marketing`: màn hình marketing/campaign/ads
- `app/channels`: luồng kết nối kênh
- `app/profile`, `app/users`: màn hình quản trị nội bộ
- `app/popup`: popup routes
- `app/api`: API routes

### `components/`

Chứa UI và component dùng lại theo nhóm chức năng.

- `components/ui`: primitive/shared UI components
- `components/auth`: component cho auth flow
- `components/app-shell`: shell/layout components
- `components/marketing`: component riêng cho marketing
- `components/data-list`: component liên quan danh sách/filter/date

### `hooks/`

Chứa custom hooks dùng lại.

### `lib/`

Chứa utilities, context, dữ liệu mock/storage và helpers dùng chung.

### `public/`

Static assets.

### `styles/`

CSS bổ sung ngoài `app/globals.css` nếu có.

## Quy ước đặt file

- Route-specific UI: ưu tiên đặt trong `app/**/_components`
- Shared UI primitives: đặt trong `components/ui`
- Shared feature components: đặt trong `components/<feature>`
- Shared state/context/helpers: đặt trong `lib/`
- Reusable hooks: đặt trong `hooks/`

## Nguyên tắc duy trì

- Ưu tiên sửa nhỏ nhất, không move/rename file hàng loạt nếu chưa cần
- Nếu thêm file mới, đặt đúng feature để tránh dồn code vào root
- Chỉ tách thư mục mới khi đã có từ 2–3 file cùng trách nhiệm rõ ràng
