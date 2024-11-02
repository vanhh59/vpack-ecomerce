import express from "express";
import {
    createBlogDetail,
    getAllBlogDetails,
    getBlogDetailById,
    getBlogDetailByBlogId,
    updateBlogDetail,
    deleteBlogDetail,
} from "../controllers/blogDetailController.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     BlogDetail:
 *       type: object
 *       required:
 *         - blogId
 *         - title
 *         - description
 *         - image
 *       properties:
 *         blogId:
 *           type: string
 *           description: The ID of the associated blog
 *         title:
 *           type: string
 *           description: Title of the blog detail
 *         description:
 *           type: string
 *           description: Description of the blog detail
 *         image:
 *           type: string
 *           description: URL of the blog detail image
 *       example:
 *         blogId: "67054015ff8f629e37efe654"
 *         title: "Trống Đồng"
 *         description: "Hãy cùng chiêm ngưỡng trống đồng - biểu tượng vĩ đại của văn hóa Việt Nam! Với hoa văn tinh xảo, trống đồng không chỉ gợi nhớ về cội nguồn lịch sử mà còn mang đến cảm giác vừa cổ điển vừa hiện đại, thể hiện niềm tự hào của dân tộc."
 *         image: "https://cdn-icons-png.flaticon.com/128/197/197473.png"
 */

/**
 * @swagger
 * /api/design-details:
 *   post:
 *     summary: Create a new blog detail
 *     tags: [Design Details]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BlogDetail'
 *     responses:
 *       201:
 *         description: Blog detail created successfully
 *       500:
 *         description: Error creating blog detail
 */
router.post("/", createBlogDetail);

/**
 * @swagger
 * /api/design-details:
 *   get:
 *     summary: Get all blog details
 *     tags: [Design Details]
 *     responses:
 *       200:
 *         description: Successfully retrieved all blog details
 *       500:
 *         description: Error fetching blog details
 */
router.get("/", getAllBlogDetails);

/**
 * @swagger
 * /api/design-details/{id}:
 *   get:
 *     summary: Get a blog detail by ID
 *     tags: [Design Details]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the blog detail
 *     responses:
 *       200:
 *         description: Successfully retrieved the blog detail
 *       404:
 *         description: Blog detail not found
 *       500:
 *         description: Error fetching blog detail
 */
router.get("/:id", getBlogDetailById);

/**
 * @swagger
 * /api/design-details/blogs/{id}:
 *   get:
 *     summary: Get blog details by blog ID
 *     tags: [Design Details]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The blog ID to search blog details
 *     responses:
 *       200:
 *         description: Successfully retrieved blog details
 *       404:
 *         description: Blog detail not found
 *       500:
 *         description: Error fetching blog details
 */
router.get("/blogs/:id", getBlogDetailByBlogId);

/**
 * @swagger
 * /api/design-details/{id}:
 *   put:
 *     summary: Update a blog detail
 *     tags: [Design Details]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the blog detail to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BlogDetail'
 *     responses:
 *       200:
 *         description: Blog detail updated successfully
 *       404:
 *         description: Blog detail not found
 *       500:
 *         description: Error updating blog detail
 */
router.put("/:id", updateBlogDetail);

/**
 * @swagger
 * /api/design-details/{id}:
 *   delete:
 *     summary: Delete a blog detail
 *     tags: [Design Details]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the blog detail to delete
 *     responses:
 *       200:
 *         description: Blog detail deleted successfully
 *       404:
 *         description: Blog detail not found
 *       500:
 *         description: Error deleting blog detail
 */
router.delete("/:id", deleteBlogDetail);

export default router;
