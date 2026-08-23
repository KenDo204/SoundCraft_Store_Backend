# 📊 Hệ Thống API Backend SoundCraft

Tài liệu này liệt kê tất cả các route API được quét tự động từ các file Controller trong thư mục `src/` của dự án.

### 📈 Thống Kê Tổng Quan
- **Tổng số Controller**: `23`
- **Tổng số API Endpoints**: `121`
- **Số API bảo mật (JWT Required)**: `88` 🔒
- **Số API công khai (Public)**: `33` 🔓

## 📂 Danh Sách Các Chức Năng (Table of Contents)

- [Addresses](#addresses) (`7` APIs)
- [Admin - Users Management](#admin---users-management) (`4` APIs)
- [Auth - Nghiệp vụ xác thực](#auth---nghip-v-xc-thc) (`8` APIs)
- [Brands - Quản lý thương hiệu](#brands---qun-l-thng-hiu) (`5` APIs)
- [Carts](#carts) (`7` APIs)
- [Categories - Quản lý Danh mục](#categories---qun-l-danh-mc) (`7` APIs)
- [Coupons](#coupons) (`6` APIs)
- [Giao Hàng Nhanh Integration](#giao-hng-nhanh-integration) (`4` APIs)
- [Home Page (BFF)](#home-page-bff) (`1` APIs)
- [Notifications](#notifications) (`4` APIs)
- [Orders](#orders) (`8` APIs)
- [Pre-Orders](#pre-orders) (`5` APIs)
- [Products (Quản lý Nhạc cụ)](#products-qun-l-nhc-c) (`10` APIs)
- [Recommendations](#recommendations) (`2` APIs)
- [Revenues](#revenues) (`4` APIs)
- [Reviews](#reviews) (`9` APIs)
- [Search](#search) (`2` APIs)
- [Sliders - Quản lý Banner Quảng Cáo](#sliders---qun-l-banner-qung-co) (`7` APIs)
- [src/app.controller.ts](#srcappcontrollerts) (`1` APIs)
- [src/blogs/blogs.controller.ts](#srcblogsblogscontrollerts) (`9` APIs)
- [Tracking](#tracking) (`1` APIs)
- [Users](#users) (`6` APIs)
- [Wishlists](#wishlists) (`4` APIs)

---

## Addresses

- 📄 **File nguồn**: [addresses.controller.ts](file:///F:/TTTN/soundcraft-backend/src/addresses/addresses.controller.ts)
- 🌐 **Đường dẫn gốc**: `/addresses`

| Method | Route Path | Function / Method | Auth / Roles | Description |
| :--- | :--- | :--- | :---: | :--- |
| 🟢 `GET` | `/addresses` | [`getMyAddresses()`](file:///F:/TTTN/soundcraft-backend/src/addresses/addresses.controller.ts#L16) | 🔒 **JWT** | Lấy tất cả địa chỉ của user |
| 🟢 `GET` | `/addresses/default` | [`getDefaultAddress()`](file:///F:/TTTN/soundcraft-backend/src/addresses/addresses.controller.ts#L27) | 🔒 **JWT** | Lấy địa chỉ mặc định |
| 🟢 `GET` | `/addresses/:id` | [`getAddressById()`](file:///F:/TTTN/soundcraft-backend/src/addresses/addresses.controller.ts#L38) | 🔒 **JWT** | Lấy thông tin chi tiết một địa chỉ theo ID |
| 🔵 `POST` | `/addresses` | [`createAddress()`](file:///F:/TTTN/soundcraft-backend/src/addresses/addresses.controller.ts#L52) | 🔒 **JWT** | Tạo địa chỉ mới |
| 🟡 `PUT` | `/addresses/:id` | [`updateAddress()`](file:///F:/TTTN/soundcraft-backend/src/addresses/addresses.controller.ts#L63) | 🔒 **JWT** | Cập nhật địa chỉ |
| 🟣 `PATCH` | `/addresses/:id/set-default` | [`setDefaultAddress()`](file:///F:/TTTN/soundcraft-backend/src/addresses/addresses.controller.ts#L78) | 🔒 **JWT** | Đặt làm địa chỉ mặc định |
| 🔴 `DELETE` | `/addresses/:id` | [`deleteAddress()`](file:///F:/TTTN/soundcraft-backend/src/addresses/addresses.controller.ts#L89) | 🔒 **JWT** | Xóa địa chỉ |

---

## Admin - Users Management

- 📄 **File nguồn**: [admin.controller.ts](file:///F:/TTTN/soundcraft-backend/src/admin/admin.controller.ts)
- 🌐 **Đường dẫn gốc**: `/admin/users`

| Method | Route Path | Function / Method | Auth / Roles | Description |
| :--- | :--- | :--- | :---: | :--- |
| 🟢 `GET` | `/admin/users` | [`getUsers()`](file:///F:/TTTN/soundcraft-backend/src/admin/admin.controller.ts#L21) | 🔒 **JWT**<br><small>(OWNER, ADMIN, SUPER_ADMIN, MANAGER)</small> | Lấy danh sách người dùng (có phân trang và tìm kiếm) |
| 🟢 `GET` | `/admin/users/:id` | [`getUserDetail()`](file:///F:/TTTN/soundcraft-backend/src/admin/admin.controller.ts#L30) | 🔒 **JWT**<br><small>(OWNER, ADMIN, SUPER_ADMIN, MANAGER)</small> | Xem chi tiết hồ sơ một khách hàng |
| 🟡 `PUT` | `/admin/users/:id/status` | [`toggleUserStatus()`](file:///F:/TTTN/soundcraft-backend/src/admin/admin.controller.ts#L43) | 🔒 **JWT**<br><small>(OWNER, ADMIN, SUPER_ADMIN, MANAGER)</small> | Khóa (Ban) hoặc Mở khóa (Unban) tài khoản |
| 🔵 `POST` | `/admin/users/:id/force-reset-password` | [`forceResetPassword()`](file:///F:/TTTN/soundcraft-backend/src/admin/admin.controller.ts#L58) | 🔒 **JWT**<br><small>(OWNER, ADMIN)</small> | Admin chủ động đặt lại mật khẩu cho khách |

---

## Auth - Nghiệp vụ xác thực

- 📄 **File nguồn**: [auth.controller.ts](file:///F:/TTTN/soundcraft-backend/src/auth/auth.controller.ts)
- 🌐 **Đường dẫn gốc**: `/auth`

| Method | Route Path | Function / Method | Auth / Roles | Description |
| :--- | :--- | :--- | :---: | :--- |
| 🔵 `POST` | `/auth/register` | [`register()`](file:///F:/TTTN/soundcraft-backend/src/auth/auth.controller.ts#L15) | 🔓 Public | Đăng ký tài khoản mới |
| 🔵 `POST` | `/auth/login` | [`login()`](file:///F:/TTTN/soundcraft-backend/src/auth/auth.controller.ts#L22) | 🔓 Public | Đăng nhập truyền thống (Email/Password) |
| 🟢 `GET` | `/auth/refresh-token` | [`refreshToken()`](file:///F:/TTTN/soundcraft-backend/src/auth/auth.controller.ts#L29) | 🔓 Public | Lấy Access Token mới bằng Refresh Token từ Cookie |
| 🔵 `POST` | `/auth/logout` | [`logout()`](file:///F:/TTTN/soundcraft-backend/src/auth/auth.controller.ts#L37) | 🔓 Public | Đăng xuất và xóa Cookie |
| 🟢 `GET` | `/auth/account` | [`getAccount()`](file:///F:/TTTN/soundcraft-backend/src/auth/auth.controller.ts#L47) | 🔒 **JWT** | Lấy thông tin tài khoản đang đăng nhập |
| 🔵 `POST` | `/auth/login/social/google` | [`loginGoogle()`](file:///F:/TTTN/soundcraft-backend/src/auth/auth.controller.ts#L54) | 🔓 Public | Đăng nhập bằng Google |
| 🔵 `POST` | `/auth/forgot-password` | [`forgotPassword()`](file:///F:/TTTN/soundcraft-backend/src/auth/auth.controller.ts#L61) | 🔓 Public | Gửi yêu cầu quên mật khẩu (Nhận OTP qua mail) |
| 🔵 `POST` | `/auth/reset-password` | [`resetPassword()`](file:///F:/TTTN/soundcraft-backend/src/auth/auth.controller.ts#L71) | 🔓 Public | Đặt lại mật khẩu mới bằng mã OTP |

---

## Brands - Quản lý thương hiệu

- 📄 **File nguồn**: [brands.controller.ts](file:///F:/TTTN/soundcraft-backend/src/brands/brands.controller.ts)
- 🌐 **Đường dẫn gốc**: `/brands`

| Method | Route Path | Function / Method | Auth / Roles | Description |
| :--- | :--- | :--- | :---: | :--- |
| 🟢 `GET` | `/brands` | [`getAllBrands()`](file:///F:/TTTN/soundcraft-backend/src/brands/brands.controller.ts#L20) | 🔓 Public | Lấy danh sách tất cả thương hiệu |
| 🟢 `GET` | `/brands/:id` | [`getBrandById()`](file:///F:/TTTN/soundcraft-backend/src/brands/brands.controller.ts#L27) | 🔓 Public | Lấy chi tiết một thương hiệu theo ID |
| 🔵 `POST` | `/brands` | [`createBrand()`](file:///F:/TTTN/soundcraft-backend/src/brands/brands.controller.ts#L38) | 🔒 **JWT**<br><small>(ROLE_SUPER_ADMIN)</small> | Tạo thương hiệu mới (Yêu cầu quyền Super Admin) |
| 🟣 `PATCH` | `/brands/:id` | [`updateBrand()`](file:///F:/TTTN/soundcraft-backend/src/brands/brands.controller.ts#L53) | 🔒 **JWT**<br><small>(ROLE_SUPER_ADMIN)</small> | Cập nhật thông tin thương hiệu (Yêu cầu quyền Super Admin) |
| 🔴 `DELETE` | `/brands/:id` | [`deleteBrand()`](file:///F:/TTTN/soundcraft-backend/src/brands/brands.controller.ts#L69) | 🔒 **JWT**<br><small>(ROLE_SUPER_ADMIN)</small> | Xóa thương hiệu (Yêu cầu quyền Super Admin) |

---

## Carts

- 📄 **File nguồn**: [carts.controller.ts](file:///F:/TTTN/soundcraft-backend/src/carts/carts.controller.ts)
- 🌐 **Đường dẫn gốc**: `/carts`

| Method | Route Path | Function / Method | Auth / Roles | Description |
| :--- | :--- | :--- | :---: | :--- |
| 🟢 `GET` | `/carts` | [`getMyCart()`](file:///F:/TTTN/soundcraft-backend/src/carts/carts.controller.ts#L17) | 🔒 **JWT** | Lấy thông tin giỏ hàng (Kèm tính toán tồn kho) |
| 🔵 `POST` | `/carts/items` | [`upsertCartItem()`](file:///F:/TTTN/soundcraft-backend/src/carts/carts.controller.ts#L29) | 🔒 **JWT** | Thêm hoặc cập nhật (Upsert) sản phẩm vào giỏ hàng |
| 🟡 `PUT` | `/carts/items/:itemId/quantity` | [`updateItemQuantity()`](file:///F:/TTTN/soundcraft-backend/src/carts/carts.controller.ts#L44) | 🔒 **JWT** | Cập nhật trực tiếp số lượng của item |
| 🟡 `PUT` | `/carts/items/:itemId/note` | [`updateItemNote()`](file:///F:/TTTN/soundcraft-backend/src/carts/carts.controller.ts#L62) | 🔒 **JWT** | Cập nhật ghi chú của item |
| 🔴 `DELETE` | `/carts/items/bulk-delete` | [`deleteSelectedItems()`](file:///F:/TTTN/soundcraft-backend/src/carts/carts.controller.ts#L79) | 🔒 **JWT** | Xóa nhiều sản phẩm một lúc |
| 🔴 `DELETE` | `/carts/items/:itemId` | [`deleteItem()`](file:///F:/TTTN/soundcraft-backend/src/carts/carts.controller.ts#L93) | 🔒 **JWT** | Xóa 1 sản phẩm khỏi giỏ |
| 🔴 `DELETE` | `/carts/clear` | [`clearCart()`](file:///F:/TTTN/soundcraft-backend/src/carts/carts.controller.ts#L108) | 🔒 **JWT** | Dọn sạch giỏ hàng |

---

## Categories - Quản lý Danh mục

- 📄 **File nguồn**: [categories.controller.ts](file:///F:/TTTN/soundcraft-backend/src/categories/categories.controller.ts)
- 🌐 **Đường dẫn gốc**: `/categories`

| Method | Route Path | Function / Method | Auth / Roles | Description |
| :--- | :--- | :--- | :---: | :--- |
| 🟢 `GET` | `/categories/tree` | [`getCategoryTree()`](file:///F:/TTTN/soundcraft-backend/src/categories/categories.controller.ts#L22) | 🔓 Public | Lấy cây Danh mục (Phục vụ Menu Khách hàng) |
| 🟢 `GET` | `/categories/admin` | [`getAllForAdmin()`](file:///F:/TTTN/soundcraft-backend/src/categories/categories.controller.ts#L36) | 🔒 **JWT**<br><small>(ROLE_SUPER_ADMIN)</small> | Lấy danh sách Danh mục (Cho Admin quản lý) |
| 🟢 `GET` | `/categories/:id` | [`getCategoryById()`](file:///F:/TTTN/soundcraft-backend/src/categories/categories.controller.ts#L51) | 🔓 Public | Lấy chi tiết 1 danh mục |
| 🔵 `POST` | `/categories` | [`create()`](file:///F:/TTTN/soundcraft-backend/src/categories/categories.controller.ts#L58) | 🔒 **JWT**<br><small>(ROLE_SUPER_ADMIN)</small> | Tạo Danh mục mới |
| 🟡 `PUT` | `/categories/:id` | [`update()`](file:///F:/TTTN/soundcraft-backend/src/categories/categories.controller.ts#L73) | 🔒 **JWT**<br><small>(ROLE_SUPER_ADMIN)</small> | Cập nhật Danh mục |
| 🟣 `PATCH` | `/categories/:id/toggle` | [`toggleStatus()`](file:///F:/TTTN/soundcraft-backend/src/categories/categories.controller.ts#L90) | 🔒 **JWT**<br><small>(ROLE_SUPER_ADMIN)</small> | Đổi trạng thái Bật/Tắt Danh mục |
| 🔴 `DELETE` | `/categories/:id` | [`remove()`](file:///F:/TTTN/soundcraft-backend/src/categories/categories.controller.ts#L100) | 🔒 **JWT**<br><small>(ROLE_SUPER_ADMIN)</small> | Xóa Danh mục (Chỉ xóa nếu không có con) |

---

## Coupons

- 📄 **File nguồn**: [coupons.controller.ts](file:///F:/TTTN/soundcraft-backend/src/coupons/coupons.controller.ts)
- 🌐 **Đường dẫn gốc**: `/coupons`

| Method | Route Path | Function / Method | Auth / Roles | Description |
| :--- | :--- | :--- | :---: | :--- |
| 🟢 `GET` | `/coupons/available` | [`getAvailable()`](file:///F:/TTTN/soundcraft-backend/src/coupons/coupons.controller.ts#L16) | 🔒 **JWT** | Lấy các mã giảm giá còn hiệu lực |
| 🔵 `POST` | `/coupons/apply-preview` | [`applyPreview()`](file:///F:/TTTN/soundcraft-backend/src/coupons/coupons.controller.ts#L23) | 🔒 **JWT** | Xem trước số tiền được giảm |
| 🔵 `POST` | `/coupons/checkout/commit` | [`commitUsages()`](file:///F:/TTTN/soundcraft-backend/src/coupons/coupons.controller.ts#L30) | 🔒 **JWT** | Chốt lượt dùng mã giảm giá sau khi tạo đơn hàng |
| 🔵 `POST` | `/coupons/admin` | [`create()`](file:///F:/TTTN/soundcraft-backend/src/coupons/coupons.controller.ts#L39) | 🔒 **JWT** | Admin: Tạo mã giảm giá mới |
| 🟢 `GET` | `/coupons/admin` | [`findAll()`](file:///F:/TTTN/soundcraft-backend/src/coupons/coupons.controller.ts#L46) | 🔒 **JWT** | Admin: Lấy danh sách mã giảm giá |
| 🟣 `PATCH` | `/coupons/admin/:id/toggle-active` | [`toggleActive()`](file:///F:/TTTN/soundcraft-backend/src/coupons/coupons.controller.ts#L53) | 🔒 **JWT** | Admin: Bật/Tắt trạng thái hoạt động |

---

## Giao Hàng Nhanh Integration

- 📄 **File nguồn**: [ghn.controller.ts](file:///F:/TTTN/soundcraft-backend/src/ghn/ghn.controller.ts)
- 🌐 **Đường dẫn gốc**: `/ghn`

| Method | Route Path | Function / Method | Auth / Roles | Description |
| :--- | :--- | :--- | :---: | :--- |
| 🟢 `GET` | `/ghn/provinces` | [`getProvinces()`](file:///F:/TTTN/soundcraft-backend/src/ghn/ghn.controller.ts#L11) | 🔓 Public | Lấy danh sách Tỉnh/Thành phố |
| 🟢 `GET` | `/ghn/districts` | [`getDistricts()`](file:///F:/TTTN/soundcraft-backend/src/ghn/ghn.controller.ts#L21) | 🔓 Public | Lấy danh sách Quận/Huyện theo Tỉnh |
| 🟢 `GET` | `/ghn/wards` | [`getWards()`](file:///F:/TTTN/soundcraft-backend/src/ghn/ghn.controller.ts#L31) | 🔓 Public | Lấy danh sách Phường/Xã theo Quận/Huyện |
| 🔵 `POST` | `/ghn/shipping-fee` | [`calculateShippingFee()`](file:///F:/TTTN/soundcraft-backend/src/ghn/ghn.controller.ts#L41) | 🔓 Public | Tính phí vận chuyển cho đơn hàng |

---

## Home Page (BFF)

- 📄 **File nguồn**: [home-page.controller.ts](file:///F:/TTTN/soundcraft-backend/src/home-page/home-page.controller.ts)
- 🌐 **Đường dẫn gốc**: `/home`

| Method | Route Path | Function / Method | Auth / Roles | Description |
| :--- | :--- | :--- | :---: | :--- |
| 🟢 `GET` | `/home/dashboard` | [`getDashboard()`](file:///F:/TTTN/soundcraft-backend/src/home-page/home-page.controller.ts#L10) | 🔓 Public | Lấy toàn bộ dữ liệu tổng hợp cho màn hình Trang chủ |

---

## Notifications

- 📄 **File nguồn**: [notifications.controller.ts](file:///F:/TTTN/soundcraft-backend/src/notifications/notifications.controller.ts)
- 🌐 **Đường dẫn gốc**: `/notifications`

| Method | Route Path | Function / Method | Auth / Roles | Description |
| :--- | :--- | :--- | :---: | :--- |
| 🟢 `GET` | `/notifications` | [`getMyNotifications()`](file:///F:/TTTN/soundcraft-backend/src/notifications/notifications.controller.ts#L15) | 🔒 **JWT** | Lấy danh sách thông báo của tôi (Phân trang) |
| 🟢 `GET` | `/notifications/unread-count` | [`countUnread()`](file:///F:/TTTN/soundcraft-backend/src/notifications/notifications.controller.ts#L28) | 🔒 **JWT** | Lấy số lượng thông báo chưa đọc |
| 🟡 `PUT` | `/notifications/read-all` | [`markAllAsRead()`](file:///F:/TTTN/soundcraft-backend/src/notifications/notifications.controller.ts#L40) | 🔒 **JWT** | Đánh dấu tất cả thông báo là đã đọc |
| 🟡 `PUT` | `/notifications/:id/read` | [`markAsRead()`](file:///F:/TTTN/soundcraft-backend/src/notifications/notifications.controller.ts#L52) | 🔒 **JWT** | Đánh dấu 1 thông báo cụ thể là đã đọc |

---

## Orders

- 📄 **File nguồn**: [orders.controller.ts](file:///F:/TTTN/soundcraft-backend/src/orders/orders.controller.ts)
- 🌐 **Đường dẫn gốc**: `/orders`

| Method | Route Path | Function / Method | Auth / Roles | Description |
| :--- | :--- | :--- | :---: | :--- |
| 🔵 `POST` | `/orders/checkout` | [`checkout()`](file:///F:/TTTN/soundcraft-backend/src/orders/orders.controller.ts#L19) | 🔒 **JWT** | Thực hiện Đặt hàng (Checkout) các sản phẩm đã chọn |
| 🔵 `POST` | `/orders/:id/cancel` | [`cancelOrder()`](file:///F:/TTTN/soundcraft-backend/src/orders/orders.controller.ts#L38) | 🔒 **JWT** | Khách hàng yêu cầu hủy đơn hàng |
| 🟢 `GET` | `/orders/vnpay/ipn` | [`vnpayIpn()`](file:///F:/TTTN/soundcraft-backend/src/orders/orders.controller.ts#L54) | 🔒 **JWT** | Webhook/IPN từ VNPAY báo cáo kết quả thanh toán |
| 🟢 `GET` | `/orders/admin` | [`getAllOrdersAdmin()`](file:///F:/TTTN/soundcraft-backend/src/orders/orders.controller.ts#L62) | 🔒 **JWT**<br><small>(ROLE_SUPER_ADMIN, ROLE_OWNER, ROLE_ADMIN)</small> | Lấy tất cả list order dành riêng cho Admin |
| 🔵 `POST` | `/orders/admin/:id/status` | [`updateOrderStatus()`](file:///F:/TTTN/soundcraft-backend/src/orders/orders.controller.ts#L77) | 🔒 **JWT**<br><small>(ROLE_SUPER_ADMIN, ROLE_OWNER, ROLE_ADMIN)</small> | Admin thay đổi status (PENDING, SHIPPING, DELIVERED, CANCELLED) |
| 🔵 `POST` | `/orders/admin/:id/items` | [`updateOrderItems()`](file:///F:/TTTN/soundcraft-backend/src/orders/orders.controller.ts#L94) | 🔒 **JWT**<br><small>(ROLE_SUPER_ADMIN, ROLE_OWNER, ROLE_ADMIN)</small> | Admin thay đổi món hàng bên trong đơn hàng khi khách có yêu cầu |
| 🟢 `GET` | `/orders/me` | [`getOrdersByCurrentUser()`](file:///F:/TTTN/soundcraft-backend/src/orders/orders.controller.ts#L113) | 🔒 **JWT** | Lấy danh sách đơn hàng của User đang đăng nhập |
| 🔵 `POST` | `/orders/:id/confirm-receipt` | [`confirmReceipt()`](file:///F:/TTTN/soundcraft-backend/src/orders/orders.controller.ts#L127) | 🔒 **JWT** | Khách hàng xác nhận đã nhận được hàng |

---

## Pre-Orders

- 📄 **File nguồn**: [pre-orders.controller.ts](file:///F:/TTTN/soundcraft-backend/src/pre-orders/pre-orders.controller.ts)
- 🌐 **Đường dẫn gốc**: `/pre-orders`

| Method | Route Path | Function / Method | Auth / Roles | Description |
| :--- | :--- | :--- | :---: | :--- |
| 🔵 `POST` | `/pre-orders` | [`create()`](file:///F:/TTTN/soundcraft-backend/src/pre-orders/pre-orders.controller.ts#L17) | 🔒 **JWT** | Đăng ký nhận thông báo khi có hàng |
| 🟢 `GET` | `/pre-orders` | [`findAll()`](file:///F:/TTTN/soundcraft-backend/src/pre-orders/pre-orders.controller.ts#L23) | 🔒 **JWT** | Lấy tất cả danh sách đăng ký nhận thông báo |
| 🟢 `GET` | `/pre-orders/:id` | [`findOne()`](file:///F:/TTTN/soundcraft-backend/src/pre-orders/pre-orders.controller.ts#L29) | 🔒 **JWT** | Lấy chi tiết một đăng ký |
| 🟣 `PATCH` | `/pre-orders/:id` | [`update()`](file:///F:/TTTN/soundcraft-backend/src/pre-orders/pre-orders.controller.ts#L37) | 🔒 **JWT** | Cập nhật trạng thái đăng ký |
| 🔴 `DELETE` | `/pre-orders/:id` | [`remove()`](file:///F:/TTTN/soundcraft-backend/src/pre-orders/pre-orders.controller.ts#L45) | 🔒 **JWT** | Xóa đăng ký |

---

## Products (Quản lý Nhạc cụ)

- 📄 **File nguồn**: [products.controller.ts](file:///F:/TTTN/soundcraft-backend/src/products/products.controller.ts)
- 🌐 **Đường dẫn gốc**: `/products`

| Method | Route Path | Function / Method | Auth / Roles | Description |
| :--- | :--- | :--- | :---: | :--- |
| 🔵 `POST` | `/products` | [`create()`](file:///F:/TTTN/soundcraft-backend/src/products/products.controller.ts#L32) | 🔓 Public | Tạo sản phẩm mới (Hỗ trợ Upload Ảnh & Variants) |
| 🟢 `GET` | `/products` | [`findAll()`](file:///F:/TTTN/soundcraft-backend/src/products/products.controller.ts#L60) | 🔓 Public | Lấy danh sách sản phẩm (Có phân trang & Lọc) |
| 🟢 `GET` | `/products/arrivals` | [`getArrivals()`](file:///F:/TTTN/soundcraft-backend/src/products/products.controller.ts#L85) | 🔓 Public | Lấy danh sách sản phẩm mới nhất (Có phân trang & Lọc) |
| 🟢 `GET` | `/products/active` | [`getActiveList()`](file:///F:/TTTN/soundcraft-backend/src/products/products.controller.ts#L103) | 🔓 Public | Lấy danh sách tất cả sản phẩm đang hoạt động |
| 🟢 `GET` | `/products/best-sellers` | [`getBestSellersList()`](file:///F:/TTTN/soundcraft-backend/src/products/products.controller.ts#L129) | 🔓 Public | Lấy danh sách sản phẩm bán chạy (số lượng bán >= 2) |
| 🟢 `GET` | `/products/category/parent/:parentId` | [`getByParentCategory()`](file:///F:/TTTN/soundcraft-backend/src/products/products.controller.ts#L149) | 🔓 Public | Lấy danh sách sản phẩm theo danh mục cha và các danh mục con trực thuộc |
| 🟢 `GET` | `/products/discounted` | [`getDiscountedList()`](file:///F:/TTTN/soundcraft-backend/src/products/products.controller.ts#L173) | 🔓 Public | Lấy danh sách sản phẩm đang giảm giá (Giá bán < Giá gốc) |
| 🟢 `GET` | `/products/:slug` | [`findOne()`](file:///F:/TTTN/soundcraft-backend/src/products/products.controller.ts#L193) | 🔓 Public | Lấy chi tiết 1 sản phẩm theo ID hoặc Slug |
| 🟡 `PUT` | `/products/:id` | [`update()`](file:///F:/TTTN/soundcraft-backend/src/products/products.controller.ts#L213) | 🔓 Public | Cập nhật toàn bộ thông tin sản phẩm (Ghi đè) |
| 🔴 `DELETE` | `/products/:id` | [`remove()`](file:///F:/TTTN/soundcraft-backend/src/products/products.controller.ts#L242) | 🔓 Public | Xóa sản phẩm (Kéo theo xóa Ảnh trên Cloudinary & Biến thể) |

---

## Recommendations

- 📄 **File nguồn**: [recommendation.controller.ts](file:///F:/TTTN/soundcraft-backend/src/recommendation/recommendation.controller.ts)
- 🌐 **Đường dẫn gốc**: `/recommendations`

| Method | Route Path | Function / Method | Auth / Roles | Description |
| :--- | :--- | :--- | :---: | :--- |
| 🟢 `GET` | `/recommendations/products/:id/similar` | [`getSimilarProducts()`](file:///F:/TTTN/soundcraft-backend/src/recommendation/recommendation.controller.ts#L10) | 🔓 Public | Lấy danh sách nhạc cụ tương tự |
| 🟢 `GET` | `/recommendations/users/:userId/for-you` | [`getForYouProducts()`](file:///F:/TTTN/soundcraft-backend/src/recommendation/recommendation.controller.ts#L21) | 🔓 Public | Lấy danh sách gợi ý cá nhân hóa cho người dùng |

---

## Revenues

- 📄 **File nguồn**: [revenues.controller.ts](file:///F:/TTTN/soundcraft-backend/src/revenues/revenues.controller.ts)
- 🌐 **Đường dẫn gốc**: `/revenues`

| Method | Route Path | Function / Method | Auth / Roles | Description |
| :--- | :--- | :--- | :---: | :--- |
| 🟢 `GET` | `/revenues/dashboard-stats` | [`getStats()`](file:///F:/TTTN/soundcraft-backend/src/revenues/revenues.controller.ts#L20) | 🔒 **JWT**<br><small>(ROLE_SUPER_ADMIN, ROLE_OWNER, ROLE_ADMIN)</small> | Lấy các chỉ số thống kê cho Dashboard Admin |
| 🟢 `GET` | `/revenues/monthly-revenue/:year` | [`getMonthlyRevenue()`](file:///F:/TTTN/soundcraft-backend/src/revenues/revenues.controller.ts#L34) | 🔒 **JWT**<br><small>(ROLE_SUPER_ADMIN, ROLE_OWNER, ROLE_ADMIN)</small> | Lấy doanh thu theo tháng |
| 🟢 `GET` | `/revenues` | [`findAll()`](file:///F:/TTTN/soundcraft-backend/src/revenues/revenues.controller.ts#L46) | 🔒 **JWT**<br><small>(ROLE_SUPER_ADMIN, ROLE_OWNER, ROLE_ADMIN)</small> | Lấy danh sách các revenues |
| 🟢 `GET` | `/revenues/:id` | [`findOne()`](file:///F:/TTTN/soundcraft-backend/src/revenues/revenues.controller.ts#L53) | 🔒 **JWT**<br><small>(ROLE_SUPER_ADMIN, ROLE_OWNER, ROLE_ADMIN)</small> | Lấy thông tin chi tiết revenues theo ID/Slug |

---

## Reviews

- 📄 **File nguồn**: [reviews.controller.ts](file:///F:/TTTN/soundcraft-backend/src/reviews/reviews.controller.ts)
- 🌐 **Đường dẫn gốc**: `/reviews`

| Method | Route Path | Function / Method | Auth / Roles | Description |
| :--- | :--- | :--- | :---: | :--- |
| 🔵 `POST` | `/reviews` | [`create()`](file:///F:/TTTN/soundcraft-backend/src/reviews/reviews.controller.ts#L34) | 🔒 **JWT** | Người dùng gửi đánh giá sản phẩm (bao gồm upload ảnh) |
| 🟣 `PATCH` | `/reviews/:id` | [`update()`](file:///F:/TTTN/soundcraft-backend/src/reviews/reviews.controller.ts#L48) | 🔒 **JWT** | Người dùng chỉnh sửa đánh giá (bao gồm upload ảnh mới) |
| 🔴 `DELETE` | `/reviews/:id` | [`remove()`](file:///F:/TTTN/soundcraft-backend/src/reviews/reviews.controller.ts#L63) | 🔒 **JWT** | Người dùng xóa đánh giá |
| 🟣 `PATCH` | `/reviews/:id/approve` | [`approve()`](file:///F:/TTTN/soundcraft-backend/src/reviews/reviews.controller.ts#L73) | 🔒 **JWT**<br><small>(ADMIN, SUPER_ADMIN)</small> | Admin duyệt đánh giá (Chờ duyệt -> Đã duyệt) |
| 🟣 `PATCH` | `/reviews/:id/hide` | [`hide()`](file:///F:/TTTN/soundcraft-backend/src/reviews/reviews.controller.ts#L82) | 🔒 **JWT**<br><small>(ADMIN, SUPER_ADMIN)</small> | Admin duyệt đánh giá (Chờ duyệt -> Đã duyệt) |
| 🔴 `DELETE` | `/reviews/:id/admin` | [`removeByAdmin()`](file:///F:/TTTN/soundcraft-backend/src/reviews/reviews.controller.ts#L91) | 🔒 **JWT**<br><small>(ADMIN, SUPER_ADMIN)</small> | Admin ẩn đánh giá |
| 🟢 `GET` | `/reviews/admin/list` | [`findAllAdmin()`](file:///F:/TTTN/soundcraft-backend/src/reviews/reviews.controller.ts#L100) | 🔒 **JWT**<br><small>(ADMIN, SUPER_ADMIN)</small> | Admin xóa vĩnh viễn đánh giá |
| 🟢 `GET` | `/reviews/statistics/:productId` | [`getStatistics()`](file:///F:/TTTN/soundcraft-backend/src/reviews/reviews.controller.ts#L109) | 🔒 **JWT** | Admin lấy danh sách đánh giá có lọc |
| 🟢 `GET` | `/reviews` | [`findAll()`](file:///F:/TTTN/soundcraft-backend/src/reviews/reviews.controller.ts#L117) | 🔒 **JWT** | Lấy danh sách đánh giá công khai của sản phẩm |

---

## Search

- 📄 **File nguồn**: [search.controller.ts](file:///F:/TTTN/soundcraft-backend/src/search/search.controller.ts)
- 🌐 **Đường dẫn gốc**: `/search`

| Method | Route Path | Function / Method | Auth / Roles | Description |
| :--- | :--- | :--- | :---: | :--- |
| 🟢 `GET` | `/search/suggestions` | [`getSuggestions()`](file:///F:/TTTN/soundcraft-backend/src/search/search.controller.ts#L17) | 🔓 Public | Lấy danh sách gợi ý tìm kiếm (Rate Limited) |
| 🟢 `GET` | `/search/products` | [`searchProducts()`](file:///F:/TTTN/soundcraft-backend/src/search/search.controller.ts#L27) | 🔓 Public | Tìm kiếm sản phẩm với nhiều bộ lọc |

---

## Sliders - Quản lý Banner Quảng Cáo

- 📄 **File nguồn**: [sliders.controller.ts](file:///F:/TTTN/soundcraft-backend/src/sliders/sliders.controller.ts)
- 🌐 **Đường dẫn gốc**: `/sliders`

| Method | Route Path | Function / Method | Auth / Roles | Description |
| :--- | :--- | :--- | :---: | :--- |
| 🟢 `GET` | `/sliders/active` | [`getActiveSliders()`](file:///F:/TTTN/soundcraft-backend/src/sliders/sliders.controller.ts#L19) | 🔓 Public | Lấy danh sách Banner đang hoạt động (Cho Khách hàng) |
| 🟢 `GET` | `/sliders/admin` | [`getAllSlidersForAdmin()`](file:///F:/TTTN/soundcraft-backend/src/sliders/sliders.controller.ts#L29) | 🔒 **JWT**<br><small>(ROLE_SUPER_ADMIN)</small> | Lấy tất cả Banner (Cho Admin) |
| 🟢 `GET` | `/sliders/:id` | [`getSliderById()`](file:///F:/TTTN/soundcraft-backend/src/sliders/sliders.controller.ts#L39) | 🔒 **JWT**<br><small>(ROLE_SUPER_ADMIN)</small> | Lấy thông tin từ route :id |
| 🔵 `POST` | `/sliders` | [`createSlider()`](file:///F:/TTTN/soundcraft-backend/src/sliders/sliders.controller.ts#L48) | 🔒 **JWT**<br><small>(ROLE_SUPER_ADMIN)</small> | Tạo Banner mới |
| 🟡 `PUT` | `/sliders/:id` | [`updateSlider()`](file:///F:/TTTN/soundcraft-backend/src/sliders/sliders.controller.ts#L63) | 🔒 **JWT**<br><small>(ROLE_SUPER_ADMIN)</small> | Cập nhật Banner |
| 🟣 `PATCH` | `/sliders/:id/toggle` | [`toggleSliderStatus()`](file:///F:/TTTN/soundcraft-backend/src/sliders/sliders.controller.ts#L79) | 🔒 **JWT**<br><small>(ROLE_SUPER_ADMIN)</small> | Đổi trạng thái Bật/Tắt Banner |
| 🔴 `DELETE` | `/sliders/:id` | [`deleteSlider()`](file:///F:/TTTN/soundcraft-backend/src/sliders/sliders.controller.ts#L89) | 🔒 **JWT**<br><small>(ROLE_SUPER_ADMIN)</small> | Xóa Banner |

---

## src/app.controller.ts

- 📄 **File nguồn**: [app.controller.ts](file:///F:/TTTN/soundcraft-backend/src/app.controller.ts)
- 🌐 **Đường dẫn gốc**: `/`

| Method | Route Path | Function / Method | Auth / Roles | Description |
| :--- | :--- | :--- | :---: | :--- |
| 🟢 `GET` | `/` | [`getHello()`](file:///F:/TTTN/soundcraft-backend/src/app.controller.ts#L8) | 🔓 Public | API kiểm tra kết nối hệ thống (Hello World) |

---

## src/blogs/blogs.controller.ts

- 📄 **File nguồn**: [blogs.controller.ts](file:///F:/TTTN/soundcraft-backend/src/blogs/blogs.controller.ts)
- 🌐 **Đường dẫn gốc**: `/blogs`

| Method | Route Path | Function / Method | Auth / Roles | Description |
| :--- | :--- | :--- | :---: | :--- |
| 🟢 `GET` | `/blogs` | [`getPublishedBlogs()`](file:///F:/TTTN/soundcraft-backend/src/blogs/blogs.controller.ts#L18) | 🔒 **JWT** | Lấy danh sách các bài viết (blog) đã xuất bản |
| 🟢 `GET` | `/blogs/admin` | [`getAllAdminBlogs()`](file:///F:/TTTN/soundcraft-backend/src/blogs/blogs.controller.ts#L32) | 🔒 **JWT**<br><small>(ROLE_ADMIN, ROLE_SUPER_ADMIN, ROLE_OWNER)</small> | Lấy danh sách tất cả blog cho Admin (Có phân trang) |
| 🟢 `GET` | `/blogs/admin/:id` | [`getAdminBlogById()`](file:///F:/TTTN/soundcraft-backend/src/blogs/blogs.controller.ts#L43) | 🔒 **JWT**<br><small>(ROLE_ADMIN, ROLE_SUPER_ADMIN, ROLE_OWNER)</small> | Lấy chi tiết 1 blog theo ID cho Admin để Edit |
| 🔵 `POST` | `/blogs/admin` | [`createBlog()`](file:///F:/TTTN/soundcraft-backend/src/blogs/blogs.controller.ts#L51) | 🔒 **JWT**<br><small>(ROLE_ADMIN, ROLE_SUPER_ADMIN, ROLE_OWNER)</small> | Tạo bài viết mới |
| 🟡 `PUT` | `/blogs/admin/:id` | [`updateBlog()`](file:///F:/TTTN/soundcraft-backend/src/blogs/blogs.controller.ts#L64) | 🔒 **JWT**<br><small>(ROLE_ADMIN, ROLE_SUPER_ADMIN, ROLE_OWNER)</small> | Cập nhật thông tin bài viết |
| 🟡 `PUT` | `/blogs/admin/:id/publish` | [`publishBlog()`](file:///F:/TTTN/soundcraft-backend/src/blogs/blogs.controller.ts#L77) | 🔒 **JWT**<br><small>(ROLE_ADMIN, ROLE_SUPER_ADMIN, ROLE_OWNER)</small> | Xuất bản bài viết |
| 🟡 `PUT` | `/blogs/admin/:id/hide` | [`hideBlog()`](file:///F:/TTTN/soundcraft-backend/src/blogs/blogs.controller.ts#L84) | 🔒 **JWT**<br><small>(ROLE_ADMIN, ROLE_SUPER_ADMIN, ROLE_OWNER)</small> | Ẩn bài viết |
| 🔴 `DELETE` | `/blogs/admin/:id` | [`deleteBlog()`](file:///F:/TTTN/soundcraft-backend/src/blogs/blogs.controller.ts#L91) | 🔒 **JWT**<br><small>(ROLE_ADMIN, ROLE_SUPER_ADMIN, ROLE_OWNER)</small> | Xóa bài viết |
| 🟢 `GET` | `/blogs/:slug` | [`getBlogBySlug()`](file:///F:/TTTN/soundcraft-backend/src/blogs/blogs.controller.ts#L98) | 🔒 **JWT** | Lấy chi tiết bài viết (blog) theo slug |

---

## Tracking

- 📄 **File nguồn**: [tracking.controller.ts](file:///F:/TTTN/soundcraft-backend/src/tracking/tracking.controller.ts)
- 🌐 **Đường dẫn gốc**: `/tracking/behaviors`

| Method | Route Path | Function / Method | Auth / Roles | Description |
| :--- | :--- | :--- | :---: | :--- |
| 🔵 `POST` | `/tracking/behaviors/batch` | [`ingestBatch()`](file:///F:/TTTN/soundcraft-backend/src/tracking/tracking.controller.ts#L11) | 🔓 Public | Ghi log hành vi người dùng theo lô (Bất đồng bộ) |

---

## Users

- 📄 **File nguồn**: [users.controller.ts](file:///F:/TTTN/soundcraft-backend/src/users/users.controller.ts)
- 🌐 **Đường dẫn gốc**: `/users`

| Method | Route Path | Function / Method | Auth / Roles | Description |
| :--- | :--- | :--- | :---: | :--- |
| 🟢 `GET` | `/users/account` | [`getMyProfile()`](file:///F:/TTTN/soundcraft-backend/src/users/users.controller.ts#L24) | 🔒 **JWT** | Lấy thông tin cá nhân |
| 🟡 `PUT` | `/users/account` | [`updateMyProfile()`](file:///F:/TTTN/soundcraft-backend/src/users/users.controller.ts#L35) | 🔒 **JWT** | Cập nhật thông tin cá nhân |
| 🟡 `PUT` | `/users/account/password` | [`changeMyPassword()`](file:///F:/TTTN/soundcraft-backend/src/users/users.controller.ts#L52) | 🔒 **JWT** | Đổi mật khẩu |
| 🔵 `POST` | `/users` | [`createAccount()`](file:///F:/TTTN/soundcraft-backend/src/users/users.controller.ts#L91) | 🔒 **JWT**<br><small>(SUPER_ADMIN, OWNER, ADMIN, MANAGER)</small> | Tạo tài khoản mới |
| 🟡 `PUT` | `/users/:id` | [`updateAccount()`](file:///F:/TTTN/soundcraft-backend/src/users/users.controller.ts#L107) | 🔒 **JWT**<br><small>(SUPER_ADMIN, OWNER, ADMIN, MANAGER)</small> | Cập nhật tài khoản |
| 🔴 `DELETE` | `/users/:id` | [`deleteAccount()`](file:///F:/TTTN/soundcraft-backend/src/users/users.controller.ts#L127) | 🔒 **JWT**<br><small>(SUPER_ADMIN, OWNER, ADMIN, MANAGER)</small> | Xóa tài khoản |

---

## Wishlists

- 📄 **File nguồn**: [wishlists.controller.ts](file:///F:/TTTN/soundcraft-backend/src/wishlists/wishlists.controller.ts)
- 🌐 **Đường dẫn gốc**: `/wishlists`

| Method | Route Path | Function / Method | Auth / Roles | Description |
| :--- | :--- | :--- | :---: | :--- |
| 🔵 `POST` | `/wishlists/toggle` | [`toggle()`](file:///F:/TTTN/soundcraft-backend/src/wishlists/wishlists.controller.ts#L16) | 🔒 **JWT** | Thêm hoặc xóa sản phẩm khỏi danh sách yêu thích (Toggle) |
| 🟢 `GET` | `/wishlists/me` | [`findMyWishlist()`](file:///F:/TTTN/soundcraft-backend/src/wishlists/wishlists.controller.ts#L23) | 🔒 **JWT** | Lấy danh sách yêu thích của người dùng hiện tại |
| 🟢 `GET` | `/wishlists/check/:productId` | [`checkStatus()`](file:///F:/TTTN/soundcraft-backend/src/wishlists/wishlists.controller.ts#L29) | 🔒 **JWT** | Lấy danh sách yêu thích của người dùng hiện tại |
| 🔴 `DELETE` | `/wishlists/:productId` | [`remove()`](file:///F:/TTTN/soundcraft-backend/src/wishlists/wishlists.controller.ts#L39) | 🔒 **JWT** | Xóa một sản phẩm cụ thể khỏi danh sách yêu thích |

---

