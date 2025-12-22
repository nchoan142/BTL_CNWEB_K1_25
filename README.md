# 🏨 Hotel Booking System (Web Đặt Phòng Khách Sạn)

Dự án Website quản lý và đặt phòng khách sạn Fullstack, bao gồm giao diện người dùng (đặt phòng, thanh toán, lịch sử) và giao diện Admin (quản lý phòng, đơn hàng).

## 🚀 Công Nghệ Sử Dụng

* **Frontend:** ReactJS (Vite), Bootstrap, React Router, Axios.
* **Backend:** Node.js, Express.js.
* **Database:** MySQL.

---

## 🛠️ Hướng Dẫn Cài Đặt & Chạy Dự Án

Để chạy dự án này, hãy đảm bảo máy bạn đã cài đặt:
1.  **Node.js** (Phiên bản 14 trở lên).
2.  **MySQL Server** & **MySQL Workbench**.

### Bước 1: Cấu Hình Cơ Sở Dữ Liệu (MySQL)

1.  Mở **MySQL Workbench**.
2.  Tạo một kết nối localhost (nếu chưa có).
3.  Mở file `Dump20251222.sql` (hoặc file SQL mới nhất của dự án) và thực thi (nút tia sét ⚡) để tạo Database `hotel_db` và các bảng dữ liệu.

### Bước 2: Cài Đặt & Chạy Backend (Server)

1.  Mở Terminal và di chuyển vào thư mục backend:
    ```bash
    cd back-end
    ```

2.  Cài đặt các thư viện cần thiết:
    ```bash
    npm install
    ```

3.  **QUAN TRỌNG:** Cấu hình kết nối Database.
    * Tạo file `back-end/config/db.js` (nếu chưa có).
    * Nội dung file:
    ```javascript
    const mysql = require('mysql2');
    const pool = mysql.createPool({
        host: 'localhost',
        user: 'root',      // Tên đăng nhập MySQL của bạn
        password: 'YOUR_PASSWORD', // <--- THAY MẬT KHẨU MYSQL CỦA BẠN VÀO ĐÂY
        database: 'hotel_db',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });
    module.exports = pool.promise();
    ```

4.  Khởi chạy Server:
    ```bash
    node server.js
    ```
    ✅ Nếu thấy thông báo: `Server is running on port 3000` là thành công.

### Bước 3: Cài Đặt & Chạy Frontend (Client)

1.  Mở một Terminal mới (giữ Terminal backend đang chạy).
2.  Di chuyển vào thư mục frontend:
    ```bash
    cd hotel-app
    ```

3.  Cài đặt các thư viện:
    ```bash
    npm install
    npm instal axios
    ```

4.  Khởi chạy giao diện web:
    ```bash
    npm run dev
    ```
    ✅ Truy cập vào đường dẫn hiện ra (thường là `http://localhost:5173`).

---

## 🔑 Tài Khoản Demo

Dưới đây là các tài khoản có sẵn trong Database để test nhanh:

### 1. Tài Khoản Quản Trị Viên (Admin)
* **Username:** `admin`
* **Password:** `admin123`
* **Quyền:** Truy cập trang `/admin` và `/admin-bookings`.
* **Chức năng:** Thêm/Sửa/Xóa phòng, Xem/Xóa đơn đặt phòng của khách.

### 2. Tài Khoản Khách Hàng (User)
* **Username:** `user` (hoặc `nguyenvana`)
* **Password:** `123456`
* **Chức năng:** Xem phòng, Đặt phòng, Thanh toán, Xem lịch sử đặt phòng.

---

## 🌟 Các Chức Năng Chính

### Người Dùng (Client)
* Đăng ký / Đăng nhập tài khoản.
* Xem danh sách các loại phòng khách sạn.
* Xem chi tiết từng phòng.
* Đặt phòng (Chọn ngày Check-in/Check-out, nhập thông tin khách ở, số người, số phòng).
* Thanh toán (Giả lập thanh toán ngay hoặc thanh toán tại khách sạn).
* Xem lịch sử các đơn đã đặt.

### Quản Trị (Admin)
* Quản lý danh sách phòng: Thêm phòng mới, Sửa thông tin phòng, Xóa phòng.
* Quản lý đơn hàng: Xem danh sách khách đặt, chi tiết ngày giờ, xóa đơn hàng.
