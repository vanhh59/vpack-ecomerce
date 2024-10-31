// index.js
import path from "path"; // Nhập khẩu path
import express from "express"; // Nhập khẩu express
import dotenv from "dotenv"; // Nhập khẩu dotenv
import cookieParser from "cookie-parser"; // Nhập khẩu cookie-parser
import cors from "cors"; // Nhập khẩu cors
import swaggerDocs from "./swagger.js"; // Nhập khẩu swaggerDocs
// Utiles
import connectDB from "./config/db.js"; // Nhập khẩu connectDB
import userRoutes from "./routes/userRoutes.js"; // Nhập khẩu userRoutes
import categoryRoutes from "./routes/categoryRoutes.js"; // Nhập khẩu categoryRoutes
import productRoutes from "./routes/productRoutes.js"; // Nhập khẩu productRoutes
import uploadRoutes from "./routes/uploadRoutes.js"; // Nhập khẩu uploadRoutes
import orderRoutes from "./routes/orderRoutes.js"; // Nhập khẩu orderRoutes
import blogRoutes from "./routes/blogRoutes.js"; // Nhập khẩu blogRoutes

import PayOS from "@payos/node"; // Thay thế require bằng import
dotenv.config(); // Tải biến môi trường từ .env

const payos = new PayOS(
  process.env.PAYOS_CLIENT_ID,
  process.env.PAYOS_API_KEY,
  process.env.PAYOS_CHECKSUM_KEY
); // Khởi tạo đối tượng PayOS

const port = process.env.PORT; // Lấy cổng từ biến môi trường

connectDB(); // Kết nối đến cơ sở dữ liệu

const app = express(); // Tạo ứng dụng Express

// Các middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use(express.static('public'));

// Định nghĩa các route
app.use("/api/users", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/blogs", blogRoutes); // Sử dụng blog routes

app.get("/api/config/paypal", (req, res) => {
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID });
});

// Định nghĩa __dirname
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname + "/uploads")));

// Khởi động server
app.listen(port, () => console.log(`Server running on http://localhost:${port}/api/users`));
swaggerDocs(app, port); // Khởi tạo Swagger documentation
