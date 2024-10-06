import Blog from "../models/blogModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import { initializeApp } from "firebase/app";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

// Cấu hình Firebase
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: "your-app-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-app-id.appspot.com",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

// Hàm lấy imageUrl từ Firebase Storage
const getImageUrl = asyncHandler(async (filePath) => {
    try {
        const fileRef = ref(storage, filePath);
        const imageUrl = await getDownloadURL(fileRef);
        return imageUrl;
    } catch (error) {
        console.error("Error getting image URL:", error);
        throw new Error("Failed to retrieve image URL from Firebase");
    }
});

/**
 * @swagger
 * tags:
 *   name: Blogs
 *   description: Blog management
 */

/**
 * @swagger
 * /api/blogs:
 *   post:
 *     summary: Create a new blog
 *     tags: [Blogs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               filePath:
 *                 type: string
 *     responses:
 *       200:
 *         description: The created blog
 *       400:
 *         description: Invalid input
 */
const createBlog = asyncHandler(async (req, res) => {
    const { title, content, filePath } = req.body;

    if (!title || !content || !filePath) {
        return res.status(400).json({ error: "All fields are required" });
    }

    // Lấy imageUrl từ Firebase dựa trên filePath
    const imageUrl = await getImageUrl(filePath);

    const blog = await new Blog({ title, content, imageUrl }).save();
    res.status(201).json(blog);
});

/**
 * @swagger
 * /api/blogs/{id}:
 *   put:
 *     summary: Update a blog
 *     tags: [Blogs]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The blog ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               filePath:
 *                 type: string
 *     responses:
 *       200:
 *         description: The updated blog
 *       404:
 *         description: Blog not found
 */
const updateBlog = asyncHandler(async (req, res) => {
    const { title, content, filePath } = req.body;
    const { id } = req.params;

    const blog = await Blog.findById(id);
    if (!blog) {
        return res.status(404).json({ error: "Blog not found" });
    }

    blog.title = title || blog.title;
    blog.content = content || blog.content;

    // Nếu có filePath mới, cập nhật imageUrl
    if (filePath) {
        blog.imageUrl = await getImageUrl(filePath);
    }

    const updatedBlog = await blog.save();
    res.json(updatedBlog);
});

/**
 * @swagger
 * /api/blogs/{id}:
 *   delete:
 *     summary: Delete a blog
 *     tags: [Blogs]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The blog ID
 *     responses:
 *       204:
 *         description: Blog deleted
 *       404:
 *         description: Blog not found
 */
const deleteBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const blog = await Blog.findByIdAndUpdate(id, { status: "inactive" });

    if (!blog) {
        return res.status(404).json({ error: "Blog not found" });
    }

    res.status(204).send();
});

/**
 * @swagger
 * /api/blogs:
 *   get:
 *     summary: Get all blogs
 *     tags: [Blogs]
 *     responses:
 *       200:
 *         description: List of blogs
 */
const listBlogs = asyncHandler(async (req, res) => {
    const blogs = await Blog.find({ status: "active" });
    res.json(blogs);
});

/**
 * @swagger
 * /api/blogs/{id}:
 *   get:
 *     summary: Get a blog by ID
 *     tags: [Blogs]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The blog ID
 *     responses:
 *       200:
 *         description: The requested blog
 *       404:
 *         description: Blog not found
 */
const getBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const blog = await Blog.findById(id);

    if (!blog) {
        return res.status(404).json({ error: "Blog not found" });
    }

    res.json(blog);
});

export { createBlog, updateBlog, deleteBlog, listBlogs, getBlog };
