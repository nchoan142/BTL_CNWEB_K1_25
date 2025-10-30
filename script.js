document.getElementById('bookingForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const checkin = new Date(document.getElementById('checkin').value);
  const checkout = new Date(document.getElementById('checkout').value);
  const guests = parseInt(document.getElementById('guests').value);
  const roomType = document.getElementById('roomType').value;

  const resultDiv = document.getElementById('result');

  // Kiểm tra ngày
  if (checkout <= checkin) {
    resultDiv.innerHTML = "❌ Ngày trả phòng phải sau ngày nhận phòng!";
    resultDiv.style.color = "red";
    return;
  }

  // Tính số đêm
  const nights = Math.ceil((checkout - checkin) / (1000 * 60 * 60 * 24));

  // Bảng giá
  const prices = {
    "standard": 500000,
    "deluxe": 800000,
    "suite": 1200000
  };

  const total = prices[roomType] * nights;

  // Kết quả
  resultDiv.style.color = "#2b7a78";
  resultDiv.innerHTML = `
    ✅ Cảm ơn <b>${name}</b> đã đặt phòng!<br>
    Loại phòng: <b>${roomType.toUpperCase()}</b><br>
    Số đêm: <b>${nights}</b><br>
    Tổng tiền: <b>${total.toLocaleString()}đ</b>
  `;
});
