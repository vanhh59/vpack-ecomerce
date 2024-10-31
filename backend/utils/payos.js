// payos.js
import PayOS from "@payos/node"; // Sử dụng cú pháp import
import dotenv from 'dotenv'; // Sử dụng import cho dotenv

dotenv.config(); // Tải biến môi trường từ .env

// Khởi tạo PayOS với các biến môi trường
const payOSInstance = new PayOS(
    process.env.PAYOS_CLIENT_ID,
    process.env.PAYOS_API_KEY,
    process.env.PAYOS_CHECKSUM_KEY
);

// Xuất đối tượng PayOS
export default payOSInstance; // Sử dụng export default
