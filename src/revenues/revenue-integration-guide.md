# Tài liệu tích hợp Module Revenue (Admin Dashboard)

Tài liệu này cung cấp các thông tin cần thiết về DTO, API và các quy tắc nghiệp vụ của module Revenue để Frontend (FE) tích hợp vào giao diện Admin Dashboard.

---

## 1. Danh sách API

### 1.1 Lấy chỉ số thống kê tổng quan (Dashboard Stats)
Dùng để hiển thị các con số tổng quát trên các thẻ (cards) ở đầu trang Dashboard.

- **Endpoint**: `GET /revenues/dashboard-stats`
- **Quyền truy cập**: Admin / Staff
- **Mô tả**: Trả về tổng số sản phẩm, danh mục, khách hàng, đơn hàng và tổng doanh thu thực tế.

### 1.2 Lấy doanh thu theo tháng (Monthly Revenue)
Dùng để vẽ biểu đồ đường (Line Chart) hoặc biểu đồ cột (Bar Chart) về tăng trưởng doanh thu.

- **Endpoint**: `GET /revenues/monthly-revenue/:year`
- **Params**: `year` (số nguyên, ví dụ: 2024)
- **Quyền truy cập**: Admin / Staff
- **Mô tả**: Trả về mảng 12 phần tử tương ứng với 12 tháng, mỗi phần tử chứa tháng và tổng doanh thu của tháng đó.

---

## 2. Cấu trúc DTO (Data Transfer Objects)

### 2.1 DashboardStatsResponseDto
```typescript
{
  "totalProducts": number,      // Tổng số lượng sản phẩm trong hệ thống
  "totalCategories": number,    // Tổng số lượng danh mục
  "totalCustomers": number,     // Tổng số người dùng có vai trò ROLE_CUSTOMER
  "totalOrders": number,        // Tổng số lượng tất cả đơn hàng
  "ordersByStatus": {           // Chi tiết số lượng đơn hàng theo trạng thái
    "PENDING": number,          // Chờ xử lý
    "SHIPPING": number,         // Đang giao hàng
    "DELIVERED": number,        // Đã giao thành công
    "CANCELLED": number         // Đã hủy
  },
  "totalRevenue": number        // Tổng doanh thu thực tế (chỉ tính đơn DELIVERED)
}
```

### 2.2 MonthlyRevenueResponseDto (Mảng)
```typescript
[
  {
    "month": 1,
    "revenue": 15000000.00
  },
  {
    "month": 2,
    "revenue": 0
  },
  ...
]
```

---

## 3. Quy tắc nghiệp vụ (Business Rules)

1.  **Doanh thu (Total Revenue)**: Chỉ tính từ các đơn hàng có trạng thái là `DELIVERED`. Các trạng thái khác như `PENDING` hay `SHIPPING` không được cộng vào doanh thu thực tế để tránh số liệu ảo.
2.  **Khách hàng (Total Customers)**: Chỉ đếm các tài khoản có `role` là `ROLE_CUSTOMER`. Không đếm Admin hay nhân viên (Staff).
3.  **Dữ liệu tháng (Monthly Data)**: API luôn trả về đủ 12 tháng (từ 1 đến 12). Nếu tháng nào không có doanh thu, giá trị `revenue` sẽ là `0`.
4.  **Định dạng tiền tệ**: Mọi giá trị tiền tệ trả về là kiểu `number` (float/decimal). FE cần format lại theo định dạng VNĐ (ví dụ: `1.000.000đ`) khi hiển thị.

---

## 4. Gợi ý cho Frontend (Skills & Implementation)

- **Biểu đồ**: Khuyến khích sử dụng `Chart.js` hoặc `Recharts` để hiển thị dữ liệu từ API `monthly-revenue`.
- **Cập nhật dữ liệu**: Các con số này thường không thay đổi liên tục theo từng giây, có thể sử dụng `React Query` với `staleTime` khoảng 5-10 phút để tối ưu performance.
- **Xử lý trạng thái**: Khi hiển thị `ordersByStatus`, nên mapping các key (`PENDING`, `SHIPPING`,...) sang tiếng Việt và gán màu sắc tương ứng (ví dụ: `PENDING` - Vàng, `DELIVERED` - Xanh lá).

---

> [!NOTE]
> Các API này yêu cầu Header `Authorization: Bearer <token>` của tài khoản Admin/Staff.
