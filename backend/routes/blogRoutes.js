// routes/blogRoutes.js

import express from "express";
const router = express.Router();
import {
    createBlog,
    updateBlog,
    deleteBlog,
    listBlogs,
    getBlog,
} from "../controllers/blogController.js";

import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

// Các route cho blog
router.route("/")
    .post(authenticate, authorizeAdmin, createBlog) // Thêm blog
    .get(listBlogs); // Lấy danh sách blog

router.route("/:id")
    .get(getBlog) // Lấy blog theo ID
    .put(authenticate, authorizeAdmin, updateBlog) // Sửa blog
    .delete(authenticate, authorizeAdmin, deleteBlog); // Xóa blog

export default router;
