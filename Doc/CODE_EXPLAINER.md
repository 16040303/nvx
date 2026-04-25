# Code explainer

File này giải thích project bằng ngôn ngữ dễ hiểu cho người không chuyên code.

## 1. App này làm gì?

Đây là một ứng dụng Next.js gồm các nhóm chức năng chính:

- `login` / `reset-password`: đăng nhập và khôi phục mật khẩu
- `dashboard`: màn hình tổng quan
- `marketing`: tạo, theo dõi và xem chi tiết chiến dịch
- `channels`: kết nối các kênh như Facebook, Instagram, Shopee, Zalo...
- `profile`, `users`: thông tin cá nhân và quản lý người dùng

## 2. File gốc quan trọng nhất

### `app/layout.tsx`

Đây là lớp khung ngoài cùng của toàn bộ ứng dụng.

Nó chịu trách nhiệm:

- khai báo thông tin chung của app như tên và icon
- nạp font chữ
- bọc toàn bộ app bằng các `Provider`
- hiển thị `WorkspaceShell` để các trang có chung khung giao diện
- hiển thị `Toaster` để hiện thông báo ngắn

Hiểu đơn giản: đây là **khung nhà chính** mà mọi màn hình khác nằm bên trong.

## 3. Dashboard hoạt động thế nào?

### `app/dashboard/page.tsx`

File này là điểm vào của trang dashboard.

Nó làm 3 việc chính:

- đọc `tab` trên URL để biết đang mở nhóm dữ liệu nào
- giữ `timeRange` để biết người dùng đang xem dữ liệu theo mốc thời gian nào
- hiển thị đúng tab tương ứng (`CSKH`, `Customer`, `Marketing`)

Hiểu đơn giản: file này giống như **bộ điều hướng của trang dashboard**.

## 4. Màn hình marketing hoạt động thế nào?

### `app/marketing/_components/marketing-campaign-page.tsx`

Đây là file lớn điều khiển màn hình danh sách/gợi ý chiến dịch marketing.

#### Người dùng nhìn thấy gì?

- ô nhập ý tưởng
- ô nhập số lượng bài muốn tạo
- thanh công cụ để dán link, đính kèm file, chọn chiến dịch liên kết
- nút `Sinh bài`
- danh sách các thẻ chiến dịch AI gợi ý
- nút xem chi tiết, tạo mới, theo dõi trạng thái

#### File này đang làm gì phía sau?

- giữ toàn bộ state của màn hình bằng `useState`
- dùng `useEffect` để khôi phục dữ liệu cũ khi quay lại màn hình
- dùng `router.push(...)` để chuyển sang trang tạo mới / trạng thái / chi tiết
- gọi `createCampaign(...)` để tạo chiến dịch mới khi người dùng bấm `Sinh bài`
- điều khiển carousel danh sách chiến dịch để kéo qua trái/phải
- hiển thị ảnh/video đại diện của từng chiến dịch nếu đã có media

#### Hiểu đơn giản

File này là **bộ não của trang marketing campaign**: vừa nhận input từ người dùng, vừa tạo dữ liệu campaign, vừa điều hướng sang các màn hình tiếp theo.

## 5. Dữ liệu campaign được giữ ở đâu?

### `lib/campaign-data.ts`

Đây là file dữ liệu trung tâm của phần campaign.

#### Nó chứa gì?

- kiểu dữ liệu của campaign (`CampaignDetail`, `CampaignStatus`)
- dữ liệu mẫu ban đầu (`CAMPAIGN_DETAILS`, `CAMPAIGN_STATUSES`)
- bộ nhớ tạm cho campaign do user tạo
- các hàm thêm / sửa / xóa / archive / đọc campaign
- logic lưu và đọc dữ liệu từ `localStorage`

#### Khi người dùng tạo campaign thì chuyện gì xảy ra?

1. màn hình marketing gọi `createCampaign(...)`
2. file này tạo `id` mới
3. tạo bản ghi chi tiết (`detail`) và trạng thái (`status`)
4. lưu vào bộ nhớ đang dùng
5. ghi xuống `localStorage` để reload trang vẫn còn

#### Tại sao file này quan trọng?

Vì đây là nơi quyết định:

- campaign nào đang tồn tại
- campaign nào đã bị xóa
- campaign nào đang nháp / đã lên lịch / đã đăng
- campaign nào do hệ thống mẫu tạo sẵn và campaign nào do user tạo mới

Hiểu đơn giản: file này là **kho dữ liệu campaign ở phía trình duyệt**.

## 6. Khu vực channels hoạt động thế nào?

### `app/channels/_components/connect-channels-page.tsx`

Đây là màn hình cho phép người dùng kết nối các nền tảng bên ngoài.

#### Người dùng nhìn thấy gì?

- ô tìm kiếm nền tảng
- bộ lọc nền tảng
- các card như Facebook, Instagram, Shopee, Zalo...
- popup nhập thông tin kênh sau khi kết nối thành công

#### File này đang làm gì phía sau?

- lọc danh sách nền tảng theo từ khóa và nhóm
- mở popup/login flow cho từng nền tảng
- nhận tín hiệu trả về từ popup bằng `window.postMessage`
- tạm tăng số lượng tài khoản đã kết nối trên giao diện
- khi người dùng bấm tạo kênh, lưu dữ liệu kênh vào `localStorage`
- chuyển người dùng về trang `/channels`

Hiểu đơn giản: đây là **cầu nối giữa app và các nền tảng bên ngoài**.

## 7. Component nhập mật khẩu làm gì?

### `components/auth/password-input.tsx`

Đây là component nhỏ nhưng dùng rất thực tế trong form đăng nhập/đổi mật khẩu.

Nó làm các việc sau:

- nhận giá trị mật khẩu từ component cha
- hiển thị ô input mật khẩu
- cho phép bấm biểu tượng con mắt để ẩn/hiện mật khẩu
- giữ trạng thái `showPassword` để biết đang hiện hay ẩn

Hiểu đơn giản: đây là **ô nhập mật khẩu có nút xem/ẩn mật khẩu**.

## 8. Vì sao project có `components`, `app`, `lib`, `hooks`?

### `app/`

Chứa các trang và route.

### `components/`

Chứa các khối giao diện tái sử dụng.

### `lib/`

Chứa dữ liệu dùng chung, context, helper và logic chia sẻ.

### `hooks/`

Chứa custom hooks để tái sử dụng hành vi.

Hiểu đơn giản:

- `app` = màn hình
- `components` = khối UI
- `lib` = dữ liệu + logic dùng chung
- `hooks` = hành vi tái sử dụng

## 9. Khi đọc một file code nên hiểu theo thứ tự nào?

Khi gặp một file lạ, nên đọc theo thứ tự này:

1. **Tên file** → đoán file này thuộc màn hình nào
2. **import** → xem nó phụ thuộc vào gì
3. **state** (`useState`) → xem file đang giữ dữ liệu gì
4. **effect** (`useEffect`) → xem lúc mở màn hình nó tự làm gì
5. **handler function** → xem bấm nút sẽ xảy ra gì
6. **return JSX** → xem cuối cùng người dùng nhìn thấy gì

## 10. Gợi ý mở rộng tài liệu sau này

Nếu cần giải thích sâu hơn, có thể tạo thêm các file sau trong `Doc/`:

- `MARKETING_EXPLAINER.md`
- `CHANNELS_EXPLAINER.md`
- `DASHBOARD_EXPLAINER.md`
- `AUTH_EXPLAINER.md`

Mỗi file nên trả lời 5 câu hỏi:

- file/module này dùng để làm gì?
- người dùng thấy gì?
- dữ liệu đi vào từ đâu?
- khi bấm nút thì chuyện gì xảy ra?
- file nào liên quan trực tiếp?
