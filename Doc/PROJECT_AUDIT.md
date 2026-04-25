# Phân tích cấu trúc project NuverxAI

Tài liệu này tóm tắt cấu trúc hiện tại của project, mức độ frontend/backend, các phần có thể dư thừa và hướng sắp xếp lại để source dễ nhìn hơn.

## 1. Chức năng của từng folder chính

| Folder / file         | Chức năng                                                                                                                                                                                                                                     |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `app/`                | Chứa route theo Next.js App Router. Mỗi thư mục con tương ứng một màn hình như `dashboard`, `marketing`, `channels`, `profile`, `users`, `change-password`. Các thư mục `_components` trong `app` chứa component chỉ dùng riêng cho route đó. |
| `app/api/`            | Chứa route API server-side nhỏ của Next.js. Hiện có API upload media marketing.                                                                                                                                                               |
| `app/popup/`          | Chứa các route popup redirect/auth giả lập cho kênh như Facebook, Instagram, Shopee.                                                                                                                                                          |
| `components/`         | Chứa component dùng lại nhiều nơi. Ví dụ `app-shell` là layout chung, `auth` là component đăng nhập/quên mật khẩu, `ui` là bộ UI primitive, `marketing` là layout/sidebar riêng cho marketing.                                                |
| `hooks/`              | Chứa custom hook dùng lại, hiện chủ yếu là `use-toast`.                                                                                                                                                                                       |
| `lib/`                | Chứa logic và dữ liệu dùng chung: campaign data, profile storage, translations, context, route state, utility.                                                                                                                                |
| `public/`             | Chứa asset tĩnh được Next.js serve trực tiếp như logo, icon, ảnh public.                                                                                                                                                                      |
| `styles/`             | Chứa CSS global cũ hoặc CSS phụ. Hiện project chủ yếu dùng `app/globals.css`.                                                                                                                                                                 |
| `Doc/`                | Chứa tài liệu giải thích cấu trúc và codebase.                                                                                                                                                                                                |
| `.agents/`, `AGENTS/` | Chứa hướng dẫn/lệnh nội bộ cho AI agent, không phải runtime của app.                                                                                                                                                                          |
| `.next/`              | Thư mục build/dev cache do Next.js sinh ra, không phải source code.                                                                                                                                                                           |
| `node_modules/`       | Dependency cài từ npm, không sửa thủ công.                                                                                                                                                                                                    |
| `Mẫu/`, `Ảnh/`        | Thư mục tài nguyên tham khảo/mockup/ảnh thiết kế. Không trực tiếp là source runtime nếu không được import.                                                                                                                                    |

## 2. Project thuần frontend hay có backend?

Project này **không phải backend đầy đủ**, nhưng cũng **không còn là thuần frontend 100%**.

Lý do:

- UI chính là Next.js + React, phần lớn dữ liệu đang nằm ở client hoặc mock data trong `lib/`.
- State người dùng/kênh/campaign chủ yếu lưu bằng `sessionStorage`, chưa có database thật.
- Có route API server-side trong `app/api/marketing/upload/route.ts` để xử lý upload.
- Có các route server trong `app/popup/*/route.ts` phục vụ luồng popup/kết nối kênh giả lập.

Kết luận ngắn:

> Đây là **project frontend Next.js có một lớp backend rất mỏng bằng Next.js Route Handler**, chưa phải hệ thống fullstack/backend hoàn chỉnh.

## 3. File/thư mục có thể thừa hoặc nên xem xét dọn

> Lưu ý: danh sách dưới đây là **ứng viên cần kiểm tra thêm trước khi xóa**, không nên xóa ngay nếu chưa chạy app và kiểm tra import đầy đủ.

| File / thư mục                                                                     | Nhận xét                                                                                                                                                                                |
| ---------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm-lock.yaml`                                                                   | Project quy định dùng npm và đang có `package-lock.json`. Nếu không dùng pnpm thì file này có thể gây nhiễu.                                                                            |
| `tsconfig.tsbuildinfo`                                                             | File cache build TypeScript, thường không cần lưu trong source.                                                                                                                         |
| `.next/`                                                                           | Cache/build output của Next.js, không cần đưa vào source hoặc tài liệu cấu trúc.                                                                                                        |
| `components/theme-provider.tsx`                                                    | Chưa thấy import trong các file đã kiểm tra. Nếu app không dùng dark/light theme provider thì có thể dư.                                                                                |
| `styles/`                                                                          | Hiện style chính nằm ở `app/globals.css`. Nếu `styles/globals.css` không được import thì có thể dư.                                                                                     |
| `components/ui/*`                                                                  | Bộ UI đang có rất nhiều primitive. Một số component có thể chưa dùng như `accordion`, `menubar`, `hover-card`, `carousel`, `chart`, v.v. Nên kiểm tra bằng search import trước khi xóa. |
| `components/auth/verify-otp-form.tsx`, `otp-input.tsx`, `forgot-password-form.tsx` | Có thể cần cho flow quên mật khẩu/OTP. Không xóa nếu route auth vẫn dùng hoặc dự kiến demo.                                                                                             |
| `Mẫu/`, `Ảnh/`                                                                     | Có vẻ là tài nguyên tham khảo. Nên giữ nếu còn dùng đối chiếu UI, hoặc chuyển vào `Doc/assets/` nếu chỉ là tài liệu.                                                                    |

Cách kiểm tra an toàn trước khi xóa:

```bash
npx eslint app components hooks lib
```

Sau đó search import theo từng file nghi ngờ, ví dụ:

```bash
# ví dụ kiểm tra theme-provider
rg "theme-provider|ThemeProvider" .
```

## 4. Phương án sắp xếp lại project cho dễ nhìn, dễ đọc, dễ hiểu

### Nguyên tắc đề xuất

- Không di chuyển ồ ạt khi app đang còn thay đổi nhiều.
- Giữ route-specific component trong `app/<route>/_components`.
- Component dùng lại nhiều nơi mới để ở `components/`.
- Mock data/storage/context gom rõ vào `lib/` theo module.

### Cấu trúc đề xuất

```text
app/
  dashboard/
    _components/
    page.tsx
  marketing/
    _components/
    ads/
    create/
    status/
    page.tsx
  channels/
    _components/
    connect/
    page.tsx
  profile/
    _components/
    page.tsx
  change-password/
    _components/
    page.tsx
  api/
    marketing/
      upload/
        route.ts

components/
  app-shell/
  auth/
  data-list/
  marketing/
  ui/

lib/
  campaign/
    campaign-data.ts
    campaign-media-storage.ts
  channels/
    channels-context.tsx
  profile/
    profile-context.tsx
    profile-storage.ts
  i18n/
    translations.ts
  utils.ts

Doc/
  PROJECT_STRUCTURE.md
  CODE_EXPLAINER.md
  PROJECT_AUDIT.md
```

### Các bước dọn nên làm theo thứ tự

1. **Dọn file cache/lock không dùng**
   - Xem xét bỏ `pnpm-lock.yaml` nếu team chỉ dùng npm.
   - Không đưa `.next/` và `tsconfig.tsbuildinfo` vào source.

2. **Kiểm tra component UI không dùng**
   - Search import từng file trong `components/ui`.
   - Chỉ xóa component chắc chắn không được import.

3. **Gom `lib` theo module**
   - `campaign-data.ts` và `campaign-media-storage.ts` có thể vào `lib/campaign/`.
   - `profile-storage.ts` và `profile-context.tsx` có thể vào `lib/profile/`.
   - `channels-context.tsx` có thể vào `lib/channels/`.

4. **Giữ component theo phạm vi sử dụng**
   - Component chỉ dùng ở một route nên để trong `app/<route>/_components`.
   - Component dùng lại nhiều nơi mới để trong `components/`.

5. **Cập nhật tài liệu sau khi dọn**
   - Cập nhật `Doc/PROJECT_STRUCTURE.md`.
   - Cập nhật `Doc/CODE_EXPLAINER.md` nếu đổi đường dẫn file.

## Kết luận

Source hiện tại chạy theo hướng frontend demo/product prototype là chính. Cấu trúc đã tương đối rõ theo App Router, nhưng có thể gọn hơn nếu:

- Loại bỏ cache/lockfile không dùng.
- Kiểm tra và xóa UI component không import.
- Gom `lib` theo module nghiệp vụ.
- Giữ quy tắc: route riêng nằm trong `app`, component dùng chung nằm trong `components`.
