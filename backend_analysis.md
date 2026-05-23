# Phân tích Mã nguồn Backend SoundCraft (NestJS)

Dựa trên việc rà soát cấu trúc thư mục, các Entity, Controller và Logic nghiệp vụ, dưới đây là bản phân tích chi tiết hệ thống:

## 1. Mô tả nghiệp vụ tổng quan
Dự án **SoundCraft Store** là một hệ thống thương mại điện tử chuyên biệt cho lĩnh vực **Nhạc cụ** (Đàn Guitar, Piano, phụ kiện...). Hệ thống giải quyết bài toán quản lý chuỗi cung ứng từ khâu nhập hàng (Inventory), trưng bày sản phẩm (Catalog), tương tác với khách hàng (Review, Wishlist) cho đến khâu thanh toán trực tuyến (VNPAY) và vận chuyển (GHN).

## 2. Các Module nghiệp vụ chính
Hệ thống được chia thành các module chức năng rõ rệt:
- **Quản lý Sản phẩm & Catalog**: `products`, `categories`, `brands`. Hỗ trợ quản lý ảnh qua Cloudinary, SEO slug, và phân loại đa cấp.
- **Xác thực & Phân quyền (Auth)**: `auth`, `users`. Sử dụng JWT, phân chia vai trò (Customer, Admin, Owner, Seller).
- **Quản lý Đơn hàng & Thanh toán**: `orders`, `vnpay`, `carts`. Xử lý luồng checkout, tích hợp cổng thanh toán VNPAY, quản lý trạng thái đơn hàng.
- **Vận chuyển & Địa chỉ**: `ghn`, `addresses`. Tích hợp API Giao Hàng Nhanh để tính phí ship tự động và quản lý sổ địa chỉ người dùng.
- **Chương trình Ưu đãi**: `coupons`, `pre-orders`. Quản lý mã giảm giá và đặt hàng trước cho các sản phẩm hot.
- **Tương tác & Chăm sóc khách hàng**: `reviews`, `wishlists`, `notifications`, `blogs`.
- **Phân tích & Dashboard (Admin)**: `revenues`, `tracking`, `recommendation`. Theo dõi doanh thu, hành vi người dùng và gợi ý sản phẩm thông minh.

## 3. Phân quyền: Client vs Admin

### Dành cho Người dùng cuối (Client)
- **Cửa hàng**: Xem danh sách sản phẩm (phân trang, lọc), chi tiết sản phẩm, xem cây danh mục.
- **Tài khoản**: Đăng ký, đăng nhập (JWT), cập nhật profile, quản lý sổ địa chỉ.
- **Mua sắm**: Thêm vào giỏ hàng, áp dụng mã giảm giá, thực hiện checkout, thanh toán qua VNPAY.
- **Theo dõi**: Xem lịch sử đơn hàng cá nhân, nhận thông báo về trạng thái đơn hàng, quản lý danh sách yêu thích.
- **Đánh giá**: Gửi review và upload ảnh thực tế sản phẩm.

### Dành cho Quản trị hệ thống (Admin/Owner)
- **Quản lý người dùng**: Xem danh sách khách hàng, Khóa/Mở khóa tài khoản (`AdminController`).
- **Quản lý Catalog**: CRUD Sản phẩm, Danh mục, Thương hiệu. Bật/Tắt trạng thái hiển thị của danh mục.
- **Xử lý Đơn hàng**: Xem toàn bộ đơn hàng, cập nhật trạng thái (Pending -> Shipping -> Delivered), chỉnh sửa vật phẩm trong đơn theo yêu cầu khách.
- **Thống kê (Dashboard)**: Xem tổng quan doanh thu, số lượng khách hàng, sản phẩm bán chạy qua module `revenues`.
- **Cấu hình hệ thống**: Quản lý Sliders (Banner), Bài viết (Blogs).

> [!NOTE]
> **Cần xác minh thêm**: Một số Controller mới như `RevenuesController` và các phương thức ghi (`POST/PUT/DELETE`) trong `ProductsController` hiện chưa thấy gắn Guard bảo mật trong mã nguồn. Cần kiểm tra xem có được bảo vệ bởi Global Guard ẩn hoặc đang trong quá trình phát triển hay không.

## 4. Luồng dữ liệu (Ví dụ: Tính năng Thanh toán - Checkout)

1. **Request (Client)**: Gửi thông tin giỏ hàng, địa chỉ và phương thức thanh toán tới `POST /orders/checkout`.
2. **Validation & Guard**: `JwtAuthGuard` xác thực người dùng. Dữ liệu đầu vào được kiểm tra qua `CheckoutRequestDto`.
3. **Business Logic (`OrdersService.checkout`)**:
    - Sử dụng **TypeORM Transaction** để đảm bảo tính toàn vẹn.
    - Kiểm tra tồn kho (`InventoryService`), nếu đủ thì trừ kho tạm thời.
    - Gọi API `GhnService` để lấy phí vận chuyển thực tế dựa trên địa chỉ và khối lượng.
    - Tính toán tổng tiền (Giá gốc - Discount + Ship).
    - Tạo bản ghi `Order` và các `OrderItem`.
    - Xóa các item tương ứng trong giỏ hàng (`CartItem`).
4. **Integration**: Nếu chọn VNPAY, hệ thống gọi `VnpayService` để tạo URL thanh toán gửi về cho khách hàng.
5. **Persistence**: Dữ liệu được lưu xuống các bảng `orders`, `order_items`, `transactions` trong PostgreSQL.
6. **Notification**: `NotificationsService` gửi thông báo (Firebase/System) báo đặt hàng thành công.
7. **Response**: Trả về `order_id` và `paymentUrl` (nếu có).

---
*Báo cáo được thực hiện dựa trên phân tích mã nguồn hiện tại.*
