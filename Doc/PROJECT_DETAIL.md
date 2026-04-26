# Tài liệu chi tiết project NuverxAI

> Tài liệu này viết cho người mới, không chuyên về lập trình.  
> Mục tiêu là giúp người đọc hiểu project có những phần nào, mỗi phần dùng để làm gì và khi sửa cần chú ý điều gì.

## 1. Project này là gì?

Đây là một website quản trị/demo cho hệ thống NuverxAI.

Website có các màn hình chính như:

- Đăng nhập.
- Bảng tổng quan.
- Quản lý chiến dịch marketing.
- Quản lý quảng cáo.
- Kết nối các kênh như Facebook, Shopee, Zalo OA.
- Quản lý người dùng.
- Hồ sơ cá nhân.

Nói đơn giản, project này đang giống một bản demo giao diện có một số chức năng xử lý nhỏ phía sau, nhưng chưa phải hệ thống hoàn chỉnh có cơ sở dữ liệu thật.

## 2. Các lệnh thường dùng

| Lệnh            | Dùng để làm gì                                                     |
| --------------- | ------------------------------------------------------------------ |
| `npm run dev`   | Chạy project trên máy để xem giao diện.                            |
| `npm run lint`  | Kiểm tra lỗi code cơ bản.                                          |
| `npm run build` | Kiểm tra project có thể đóng gói để chạy bản chính thức hay không. |

Lưu ý: project này dùng **npm**, nên khi cài hoặc chạy thư viện thì ưu tiên dùng `npm`.

## 3. Chức năng từng thư mục chính

## `app/`

Đây là nơi chứa các trang chính của website.

Có thể hiểu đơn giản: mỗi thư mục nhỏ trong `app/` thường là một màn hình hoặc một nhóm màn hình.

| Thư mục/file                  | Chức năng                                                                                    |
| ----------------------------- | -------------------------------------------------------------------------------------------- |
| `app/layout.tsx`              | Khung chung của toàn bộ website. Những phần dùng chung cho toàn trang thường được đặt ở đây. |
| `app/page.tsx`                | Trang đầu tiên khi truy cập website.                                                         |
| `app/login/`                  | Màn hình đăng nhập.                                                                          |
| `app/reset-password/`         | Màn hình đặt lại mật khẩu.                                                                   |
| `app/change-password/`        | Màn hình đổi mật khẩu.                                                                       |
| `app/dashboard/`              | Màn hình bảng tổng quan, thống kê và biểu đồ.                                                |
| `app/marketing/`              | Nhóm màn hình quản lý marketing và chiến dịch.                                               |
| `app/marketing/create/`       | Màn hình tạo chiến dịch.                                                                     |
| `app/marketing/status/`       | Màn hình theo dõi trạng thái chiến dịch.                                                     |
| `app/marketing/ads/`          | Màn hình liên quan đến quảng cáo.                                                            |
| `app/marketing/[campaignId]/` | Màn hình chi tiết của một chiến dịch cụ thể.                                                 |
| `app/channels/`               | Màn hình quản lý các kênh kết nối.                                                           |
| `app/channels/connect/`       | Màn hình/luồng kết nối kênh.                                                                 |
| `app/profile/`                | Màn hình hồ sơ cá nhân.                                                                      |
| `app/users/`                  | Màn hình quản lý người dùng.                                                                 |
| `app/api/`                    | Nơi chứa các chức năng xử lý phía sau website.                                               |
| `app/popup/`                  | Các cửa sổ giả lập đăng nhập Facebook, Instagram, Shopee.                                    |

### Các thư mục `_components` trong `app/`

Ví dụ:

- `app/dashboard/_components/`
- `app/marketing/_components/`
- `app/users/_components/`

Các thư mục này chứa những phần giao diện nhỏ chỉ dùng cho màn hình đó.

Ví dụ: một biểu đồ chỉ xuất hiện ở dashboard thì nên đặt trong `app/dashboard/_components/`.

## `components/`

Đây là nơi chứa các phần giao diện có thể dùng lại ở nhiều màn hình.

| Thư mục                 | Chức năng                                                          |
| ----------------------- | ------------------------------------------------------------------ |
| `components/app-shell/` | Khung giao diện sau khi đăng nhập, gồm thanh bên, thanh trên cùng. |
| `components/auth/`      | Các phần giao diện liên quan đăng nhập, quên mật khẩu, logo.       |
| `components/data-list/` | Các phần giao diện cho danh sách, bộ lọc, chọn ngày.               |
| `components/marketing/` | Các phần giao diện riêng cho khu vực marketing.                    |
| `components/ui/`        | Các nút, ô nhập, hộp thoại, thông báo... dùng lại nhiều nơi.       |

Có thể hiểu `components/ui/` như một hộp đồ nghề giao diện. Khi cần nút, hộp thoại hoặc ô chọn, các màn hình sẽ lấy từ đây ra dùng.

## `lib/`

Đây là nơi chứa dữ liệu mẫu và các phần xử lý dùng chung.

| File                        | Chức năng                                                  |
| --------------------------- | ---------------------------------------------------------- |
| `auth-context.tsx`          | Lưu thông tin email đang đăng nhập trong lúc dùng website. |
| `channels-context.tsx`      | Lưu trạng thái các kênh đã kết nối.                        |
| `profile-context.tsx`       | Chia sẻ thông tin hồ sơ cá nhân cho nhiều màn hình.        |
| `profile-storage.ts`        | Đọc và lưu hồ sơ cá nhân tạm trên trình duyệt.             |
| `campaign-data.ts`          | Dữ liệu mẫu của các chiến dịch.                            |
| `campaign-media-storage.ts` | Lưu ảnh đại diện của chiến dịch.                           |
| `dashboard-range-data.ts`   | Dữ liệu mẫu cho biểu đồ và thống kê dashboard.             |
| `language-context.tsx`      | Ghi nhớ ngôn ngữ đang chọn.                                |
| `translations.ts`           | Danh sách chữ hiển thị trên giao diện theo ngôn ngữ.       |
| `route-state.ts`            | Ghi nhớ bộ lọc, vị trí cuộn và trang marketing vừa xem.    |
| `utils.ts`                  | Các hàm hỗ trợ nhỏ dùng chung trong project.               |

## `hooks/`

Chứa các hàm hỗ trợ dùng lại trong giao diện.

Hiện thư mục này chủ yếu liên quan đến thông báo trên màn hình.

## `public/`

Đây là nơi chứa file tĩnh như ảnh, logo, icon và file người dùng tải lên.

| Thư mục           | Chức năng                                                                                      |
| ----------------- | ---------------------------------------------------------------------------------------------- |
| `public/assets/`  | Ảnh đang được website sử dụng, ví dụ logo, icon, ảnh đăng nhập, logo kênh, ảnh chiến dịch mẫu. |
| `public/uploads/` | Ảnh/video người dùng tải lên khi test chức năng marketing.                                     |

Lưu ý quan trọng:

- Không nên xóa `public/uploads/` nếu chưa kiểm tra kỹ.
- Ảnh dùng trực tiếp trên giao diện hiện nằm trong `public/assets/`.

## `Doc/`

Đây là nơi chứa tài liệu giải thích project.

| File                   | Chức năng                                                 |
| ---------------------- | --------------------------------------------------------- |
| `PROJECT_STRUCTURE.md` | Tóm tắt cấu trúc project.                                 |
| `PROJECT_AUDIT.md`     | Ghi chú về cấu trúc, phần có thể dư và hướng dọn project. |
| `CODE_EXPLAINER.md`    | Giải thích code theo từng phần.                           |
| `PROJECT_DETAIL.md`    | File hiện tại, giải thích chi tiết cho người mới.         |

## Các file cấu hình ở ngoài cùng

| File/thư mục         | Chức năng                                            |
| -------------------- | ---------------------------------------------------- |
| `package.json`       | Ghi danh sách thư viện và các lệnh chạy project.     |
| `package-lock.json`  | Ghi chính xác phiên bản thư viện đang dùng với npm.  |
| `next.config.mjs`    | File thiết lập cho website Next.js.                  |
| `tsconfig.json`      | File thiết lập cho TypeScript.                       |
| `eslint.config.mjs`  | File thiết lập kiểm tra lỗi code.                    |
| `postcss.config.mjs` | File thiết lập xử lý CSS.                            |
| `.next/`             | Thư mục tự sinh khi chạy project, không cần sửa tay. |
| `node_modules/`      | Nơi chứa thư viện đã cài, không sửa tay.             |

## 4. Các phần xử lý phía sau website

Project này không có backend lớn riêng biệt, nhưng có một số phần xử lý phía sau nằm trong `app/api/` và `app/popup/`.

Có thể hiểu đơn giản:

- `app/api/` là nơi website nhận yêu cầu và xử lý dữ liệu nhỏ.
- `app/popup/` là nơi tạo các cửa sổ đăng nhập giả lập cho việc kết nối kênh.

| File                                | Chức năng                                        |
| ----------------------------------- | ------------------------------------------------ |
| `app/api/marketing/upload/route.ts` | Nhận ảnh/video từ người dùng và lưu vào project. |
| `app/popup/facebook/route.ts`       | Tạo cửa sổ đăng nhập Facebook giả lập.           |
| `app/popup/instagram/route.ts`      | Tạo cửa sổ đăng nhập Instagram giả lập.          |
| `app/popup/shopee/route.ts`         | Tạo cửa sổ đăng nhập Shopee giả lập.             |

## 5. Chi tiết từng phần xử lý phía sau

## Upload ảnh/video marketing

File:

```text
app/api/marketing/upload/route.ts
```

Chức năng:

- Nhận ảnh hoặc video người dùng chọn ở phần marketing.
- Kiểm tra file có hợp lệ không.
- Không nhận file rỗng.
- Không nhận file quá 10MB.
- Chỉ nhận ảnh hoặc video.
- Làm sạch tên file để tránh tên file lạ gây lỗi.
- Lưu file vào thư mục:

```text
public/uploads/marketing/<mã chiến dịch>/
```

Sau khi lưu xong, phần này trả lại thông tin file cho giao diện, ví dụ:

- Đường dẫn file.
- Tên file.
- Loại file.
- Dung lượng file.

Điểm cần chú ý:

- Đây là cách lưu file phù hợp cho demo local.
- Nếu đưa lên hệ thống thật, nên dùng nơi lưu file chuyên dụng như cloud storage.
- Không nên xóa `public/uploads/` nếu muốn giữ lại ảnh/video đã upload.

## Popup Facebook

File:

```text
app/popup/facebook/route.ts
```

Chức năng:

- Tạo một cửa sổ giống màn đăng nhập Facebook.
- Khi người dùng bấm đăng nhập, cửa sổ này báo về màn hình chính là Facebook đã kết nối thành công.
- Sau đó cửa sổ tự đóng.

Lưu ý:

- Đây chỉ là màn giả lập để demo.
- Không đăng nhập Facebook thật.
- Không gọi hệ thống thật của Facebook.

## Popup Instagram

File:

```text
app/popup/instagram/route.ts
```

Chức năng tương tự Facebook:

- Hiển thị màn đăng nhập Instagram giả lập.
- Bấm đăng nhập thì báo kết nối thành công về website chính.
- Sau đó cửa sổ tự đóng.

Lưu ý:

- Đây là demo, chưa phải kết nối Instagram thật.

## Popup Shopee

File:

```text
app/popup/shopee/route.ts
```

Chức năng:

- Hiển thị màn đăng nhập Shopee giả lập.
- Có phần đăng nhập bằng mật khẩu.
- Có phần đăng nhập bằng mã QR giả lập.
- Có nút hiện/ẩn mật khẩu.
- Khi bấm đăng nhập hoặc bấm vào QR, website xem như Shopee đã kết nối thành công.

Lưu ý:

- Đây là demo, chưa phải kết nối Shopee thật.
- Vì file này chứa cả giao diện và hành động của popup nên khá dài, khi sửa cần cẩn thận.

## 6. Dữ liệu trong project đang được lưu ở đâu?

Hiện project chưa có cơ sở dữ liệu thật.

Dữ liệu đang nằm ở 3 nơi chính.

## 1. Dữ liệu mẫu viết sẵn trong code

Ví dụ:

- `lib/campaign-data.ts`
- `lib/dashboard-range-data.ts`
- `lib/translations.ts`

Đây là dữ liệu có sẵn để demo giao diện.

## 2. Bộ nhớ tạm của trình duyệt

Một số thông tin được lưu tạm trong trình duyệt để khi tải lại trang vẫn còn dữ liệu.

Ví dụ:

| Khu vực       | Đang lưu gì                                      |
| ------------- | ------------------------------------------------ |
| Hồ sơ cá nhân | Tên, email, số điện thoại, ảnh đại diện...       |
| Kênh kết nối  | Số lượng kênh đã kết nối.                        |
| Marketing     | Chiến dịch, ảnh đại diện, bộ lọc, trang vừa xem. |
| Dashboard     | Một số trạng thái kênh hiển thị trên dashboard.  |

Điểm cần chú ý:

- Đây chỉ là lưu tạm trên trình duyệt.
- Không giống cơ sở dữ liệu thật.
- Nếu đổi trình duyệt hoặc xóa dữ liệu trình duyệt thì dữ liệu có thể mất.

## 3. File upload trong `public/uploads/`

Khi người dùng upload ảnh/video marketing, file thật được lưu trong:

```text
public/uploads/
```

Thư mục này nên được giữ lại nếu còn cần dữ liệu demo đã upload.

## 7. Các nhóm chức năng chính

## Đăng nhập và tài khoản

Nằm ở:

- `app/login/`
- `app/reset-password/`
- `app/change-password/`
- `components/auth/`
- `lib/auth-context.tsx`

Chức năng:

- Hiển thị màn đăng nhập.
- Ghi nhớ email người dùng trong lúc sử dụng.
- Có màn đổi mật khẩu và đặt lại mật khẩu ở mức demo.

## Dashboard

Nằm ở:

- `app/dashboard/`
- `app/dashboard/_components/`
- `lib/dashboard-range-data.ts`

Chức năng:

- Hiển thị số liệu tổng quan.
- Hiển thị biểu đồ.
- Cho phép lọc một số dữ liệu.
- Dữ liệu hiện chủ yếu là dữ liệu mẫu.

## Marketing và chiến dịch

Nằm ở:

- `app/marketing/`
- `lib/campaign-data.ts`
- `lib/campaign-media-storage.ts`
- `app/api/marketing/upload/route.ts`

Chức năng:

- Xem danh sách chiến dịch/ý tưởng.
- Tạo chiến dịch mới.
- Xem chi tiết chiến dịch.
- Theo dõi trạng thái chiến dịch.
- Upload ảnh/video cho chiến dịch.
- Ghi nhớ ảnh đại diện chiến dịch.

## Kênh kết nối

Nằm ở:

- `app/channels/`
- `app/channels/_components/channel-platform-data.ts`
- `lib/channels-context.tsx`
- `app/popup/`

Chức năng:

- Hiển thị danh sách kênh như Facebook, Shopee, Zalo OA.
- Cho người dùng bấm kết nối kênh.
- Mở cửa sổ đăng nhập giả lập.
- Sau khi kết nối thành công, cập nhật số lượng kênh đã kết nối.

## Người dùng và hồ sơ

Nằm ở:

- `app/users/`
- `app/profile/`
- `lib/profile-context.tsx`
- `lib/profile-storage.ts`

Chức năng:

- Quản lý danh sách người dùng trong giao diện.
- Xem và chỉnh sửa hồ sơ cá nhân.
- Lưu thông tin hồ sơ tạm trên trình duyệt.

## 8. Những điểm cần chú ý trong project

## 1. Project đang thiên về demo giao diện

Project hiện chưa phải hệ thống hoàn chỉnh.

Dấu hiệu:

- Nhiều dữ liệu là dữ liệu mẫu.
- Nhiều thông tin lưu tạm trên trình duyệt.
- Chưa có cơ sở dữ liệu thật.
- Kết nối Facebook, Instagram, Shopee là giả lập.

## 2. Không xóa `public/uploads/` tùy tiện

Thư mục này chứa ảnh/video đã upload trong quá trình demo.

Nếu xóa, một số chiến dịch có thể mất ảnh/video hiển thị.

## 3. Ảnh website đang dùng nằm trong `public/assets/`

Ví dụ:

- Logo.
- Icon.
- Ảnh trang đăng nhập.
- Logo các kênh.
- Ảnh mẫu của chiến dịch.

Nếu đổi vị trí ảnh, cần sửa lại đường dẫn trong code, nếu không ảnh sẽ bị lỗi không hiển thị.

## 4. Khi sửa chữ trên giao diện, nên kiểm tra `lib/translations.ts`

Nhiều chữ hiển thị có thể đang nằm trong file này.

Nếu sửa chữ trực tiếp ở một màn hình nhưng chữ thật lại lấy từ `translations.ts`, thay đổi có thể không có tác dụng.

## 5. Sửa phần giao diện dùng chung cần cẩn thận

Các file trong `components/ui/` hoặc `components/app-shell/` có thể được nhiều màn hình sử dụng.

Ví dụ:

- Sửa sidebar có thể ảnh hưởng dashboard, marketing, users, channels.
- Sửa hộp thoại có thể ảnh hưởng nhiều popup trong website.
- Sửa nút dùng chung có thể làm thay đổi nhiều màn hình cùng lúc.

## 6. Không sửa thư mục tự sinh

Không nên sửa tay các thư mục/file sau:

- `.next/`
- `node_modules/`
- `tsconfig.tsbuildinfo`

Đây là phần do công cụ tự tạo ra.

## 7. Không đưa mật khẩu thật hoặc khóa bí mật vào code

Nếu sau này kết nối Facebook, Shopee, Instagram thật, sẽ có các mã bí mật để xác thực.

Các mã này không được viết thẳng vào code giao diện hoặc đưa công khai trong project.

## 8. Trước khi xóa file phải kiểm tra còn dùng không

Cách an toàn:

- Tìm tên file trong toàn project.
- Tìm đường dẫn ảnh trong toàn project.
- Chạy kiểm tra lỗi bằng `npm run lint`.
- Mở lại giao diện để xem có bị vỡ ảnh hoặc lỗi màn hình không.

## 9. Hướng dẫn đọc project cho người mới

Nên đọc theo thứ tự này:

1. `Doc/PROJECT_DETAIL.md` - tài liệu chi tiết này.
2. `Doc/PROJECT_STRUCTURE.md` - bản tóm tắt cấu trúc.
3. `components/app-shell/sidebar.tsx` - xem menu chính để hiểu website có những mục nào.
4. `app/dashboard/` - xem dashboard.
5. `app/marketing/` - xem phần marketing.
6. `app/channels/` - xem phần kết nối kênh.
7. `lib/` - xem nơi chứa dữ liệu mẫu và thông tin lưu tạm.

## 10. Bảng màn hình nằm ở file nào

Bảng này giúp người mới biết muốn sửa một phần giao diện thì nên tìm ở đâu trước.

| Muốn xem/sửa phần nào         | Nên tìm ở đâu                                                                       |
| ----------------------------- | ----------------------------------------------------------------------------------- |
| Trang đăng nhập               | `app/login/page.tsx`                                                                |
| Trang đặt lại mật khẩu        | `app/reset-password/`                                                               |
| Trang đổi mật khẩu            | `app/change-password/`                                                              |
| Menu bên trái                 | `components/app-shell/sidebar.tsx`                                                  |
| Thanh trên cùng               | `components/app-shell/header.tsx`                                                   |
| Khung giao diện sau đăng nhập | `components/app-shell/app-shell.tsx`                                                |
| Dashboard tổng quan           | `app/dashboard/page.tsx`                                                            |
| Các phần nhỏ trong dashboard  | `app/dashboard/_components/`                                                        |
| Trang marketing chính         | `app/marketing/page.tsx` và `app/marketing/_components/marketing-campaign-page.tsx` |
| Trang tạo chiến dịch          | `app/marketing/create/`                                                             |
| Trang trạng thái chiến dịch   | `app/marketing/status/`                                                             |
| Trang quảng cáo               | `app/marketing/ads/`                                                                |
| Trang chi tiết chiến dịch     | `app/marketing/[campaignId]/`                                                       |
| Danh sách kênh kết nối        | `app/channels/`                                                                     |
| Dữ liệu logo/tên kênh         | `app/channels/_components/channel-platform-data.ts`                                 |
| Cửa sổ giả lập Facebook       | `app/popup/facebook/route.ts`                                                       |
| Cửa sổ giả lập Instagram      | `app/popup/instagram/route.ts`                                                      |
| Cửa sổ giả lập Shopee         | `app/popup/shopee/route.ts`                                                         |
| Trang hồ sơ cá nhân           | `app/profile/`                                                                      |
| Trang quản lý người dùng      | `app/users/`                                                                        |
| Ảnh/logo website đang dùng    | `public/assets/`                                                                    |
| Ảnh/video người dùng upload   | `public/uploads/`                                                                   |
| Dữ liệu mẫu chiến dịch        | `lib/campaign-data.ts`                                                              |
| Dữ liệu biểu đồ dashboard     | `lib/dashboard-range-data.ts`                                                       |
| Chữ hiển thị theo ngôn ngữ    | `lib/translations.ts`                                                               |
| Phần upload ảnh/video         | `app/api/marketing/upload/route.ts`                                                 |

## 11. Tóm tắt ngắn gọn

Project NuverxAI hiện là một website demo/quản trị.

Các điểm chính:

- Giao diện là phần quan trọng nhất của project.
- Có một phần xử lý nhỏ cho upload file và popup kết nối kênh.
- Chưa có cơ sở dữ liệu thật.
- Dữ liệu demo nằm nhiều trong `lib/`.
- Dữ liệu tạm được lưu trên trình duyệt.
- Ảnh website đang dùng nằm trong `public/assets/`.
- File người dùng upload nằm trong `public/uploads/`.
