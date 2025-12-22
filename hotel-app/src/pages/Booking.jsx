// src/pages/Booking.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { roomService, bookingService } from '../utils/api';
import { toast } from 'react-toastify';

const Booking = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);

  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    phone: '',
    email: '',
    peopleCount: 1,
    roomCount: 1,
    checkIn: '',
    checkOut: '',
    requests: ''
  });

  const [errors, setErrors] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);

  // --- SỬA LỖI TRANG TRẮNG TẠI ĐÂY ---
  useEffect(() => {
    const fetchRoomData = async () => {
        try {
            // Thêm 'await' để chờ lấy dữ liệu từ Server về
            const allRooms = await roomService.getAll(); 
            
            // Kiểm tra xem dữ liệu trả về có phải mảng không để tránh lỗi
            if (Array.isArray(allRooms)) {
                const foundRoom = allRooms.find(r => r.id === parseInt(roomId));
                if (foundRoom) {
                    setRoom(foundRoom);
                    setTotalPrice(foundRoom.price);
                } else {
                    toast.error("Không tìm thấy phòng!");
                    navigate('/rooms');
                }
            }
        } catch (error) {
            console.error("Lỗi tải phòng:", error);
        }
    };

    fetchRoomData();
  }, [roomId, navigate]);
  // ------------------------------------

  // Tính toán lại tổng tiền khi thay đổi ngày hoặc số phòng
  useEffect(() => {
    if (room && formData.checkIn && formData.checkOut && formData.roomCount) {
        const start = new Date(formData.checkIn);
        const end = new Date(formData.checkOut);
        
        // Tính số ngày
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

        if (diffDays > 0) {
            setTotalPrice(room.price * diffDays * formData.roomCount);
        } else {
            setTotalPrice(room.price); // Nếu chọn sai ngày (checkin = checkout) thì tính 1 ngày
        }
    }
  }, [formData.checkIn, formData.checkOut, formData.roomCount, room]);

  const validate = () => {
    const newErrors = {};
    const today = new Date();
    today.setHours(0,0,0,0);

    if (!formData.fullName) newErrors.fullName = "Vui lòng nhập họ tên";
    if (!formData.age || formData.age < 18) newErrors.age = "Phải trên 18 tuổi";
    if (!formData.phone) newErrors.phone = "Vui lòng nhập SĐT";
    if (!formData.email) newErrors.email = "Vui lòng nhập Email";
    if (!formData.peopleCount || formData.peopleCount < 1) newErrors.peopleCount = "Ít nhất 1 người";
    if (!formData.roomCount || formData.roomCount < 1) newErrors.roomCount = "Ít nhất 1 phòng";

    if (!formData.checkIn) {
        newErrors.checkIn = "Chọn ngày nhận phòng";
    } else if (new Date(formData.checkIn) < today) {
        newErrors.checkIn = "Ngày nhận phòng không được ở quá khứ";
    }

    if (!formData.checkOut) {
        newErrors.checkOut = "Chọn ngày trả phòng";
    } else if (formData.checkIn && new Date(formData.checkOut) <= new Date(formData.checkIn)) {
        newErrors.checkOut = "Ngày trả phòng phải sau ngày nhận phòng";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => { // Thêm async ở đây cho chắc chắn
    e.preventDefault();
    if (!validate()) {
        toast.warning("Vui lòng kiểm tra lại thông tin nhập vào!");
        return;
    }

    // Gọi API lưu booking (Hàm này trong api.js đã xử lý map dữ liệu)
    const result = await bookingService.book({
      roomId: room.id,
      roomName: room.name,
      price: totalPrice, 
      customer: formData
    });

    if (result.success) {
      toast.success("Đã ghi nhận đơn! Đang chuyển trang thanh toán...");
      // Chuyển hướng đến trang thanh toán với ID booking vừa tạo
      navigate(`/payment/${result.booking.id}`);
    } else {
      toast.error(result.message || "Lỗi đặt phòng, vui lòng thử lại.");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (!room) return (
    <div className="d-flex justify-content-center align-items-center" style={{height: '100vh'}}>
        <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
        </div>
    </div>
  );

  return (
    <>
      <Header />
      <section className="breadcumb-area bg-img d-flex align-items-center justify-content-center" style={{backgroundImage: "url('https://ezcloud.vn/wp-content/uploads/2023/05/kinh-nghiem-dat-phong-khach-san-da-lat-gia-re-scaled.webp')", height: '400px'}}>
        <div className="bradcumbContent">
            <h2 className="mb-4 text-center text-lobster" style={{color: '#736de9ff', fontSize: '50px' }}>Đặt phòng</h2>
        </div>
      </section>

      <section className="contact-form-area mb-100 mt-50">
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-12 col-lg-8">
                    <div className="section-heading text-center">
                        <div className="line-"></div>
                        <h2>Đặt phòng: {room.name}</h2>
                        <h4 className="mt-2" style={{ color: '#8597f1ff', fontWeight: 'bold', fontSize: '24px' }}>
                            Chi phí dự kiến: ${totalPrice}
                        </h4>
                    </div>

                    <form onSubmit={handleSubmit} className="p-4" style={{background: '#f8f9fa', borderRadius: '5px'}}>
                        <div className="row">
                            {/* --- Hàng 1: Checkin - Checkout --- */}
                            <div className="col-md-6 mb-3">
                                <label>Ngày nhận phòng (Check-in) <span className="text-danger">*</span></label>
                                <input 
                                    type="date" 
                                    className={`form-control ${errors.checkIn ? 'is-invalid' : ''}`} 
                                    name="checkIn" 
                                    onChange={handleChange} 
                                />
                                {errors.checkIn && <small className="text-danger">{errors.checkIn}</small>}
                            </div>
                            <div className="col-md-6 mb-3">
                                <label>Ngày trả phòng (Check-out) <span className="text-danger">*</span></label>
                                <input 
                                    type="date" 
                                    className={`form-control ${errors.checkOut ? 'is-invalid' : ''}`} 
                                    name="checkOut" 
                                    onChange={handleChange} 
                                />
                                {errors.checkOut && <small className="text-danger">{errors.checkOut}</small>}
                            </div>

                            {/* --- Các thông tin khách hàng --- */}
                            <div className="col-md-6 mb-3">
                                <label>Họ và tên <span className="text-danger">*</span></label>
                                <input type="text" className={`form-control ${errors.fullName ? 'is-invalid' : ''}`} name="fullName" onChange={handleChange} />
                                {errors.fullName && <small className="text-danger">{errors.fullName}</small>}
                            </div>
                            <div className="col-md-6 mb-3">
                                <label>Tuổi <span className="text-danger">*</span></label>
                                <input type="number" className={`form-control ${errors.age ? 'is-invalid' : ''}`} name="age" onChange={handleChange} />
                                {errors.age && <small className="text-danger">{errors.age}</small>}
                            </div>
                            
                            <div className="col-md-6 mb-3">
                                <label>Số điện thoại <span className="text-danger">*</span></label>
                                <input type="text" className={`form-control ${errors.phone ? 'is-invalid' : ''}`} name="phone" onChange={handleChange} />
                                {errors.phone && <small className="text-danger">{errors.phone}</small>}
                            </div>
                            <div className="col-md-6 mb-3">
                                <label>Email <span className="text-danger">*</span></label>
                                <input type="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`} name="email" onChange={handleChange} />
                                {errors.email && <small className="text-danger">{errors.email}</small>}
                            </div>

                            <div className="col-md-6 mb-3">
                                <label>Số người <span className="text-danger">*</span></label>
                                <input type="number" className={`form-control ${errors.peopleCount ? 'is-invalid' : ''}`} name="peopleCount" value={formData.peopleCount} onChange={handleChange} />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label>Số phòng <span className="text-danger">*</span></label>
                                <input type="number" className={`form-control ${errors.roomCount ? 'is-invalid' : ''}`} name="roomCount" value={formData.roomCount} onChange={handleChange} />
                            </div>

                            <div className="col-12 mb-3">
                                <label>Yêu cầu thêm</label>
                                <textarea className="form-control" name="requests" rows="3" onChange={handleChange}></textarea>
                            </div>

                            <div className="col-12 text-center">
                                <button type="submit" className="btn palatin-btn">Xác nhận đặt phòng</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Booking;