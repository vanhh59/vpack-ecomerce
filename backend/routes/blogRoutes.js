import express from "express";
import cors from "cors"; // Import the CORS package
import {
    createBlog,
    updateBlog,
    deleteBlog,
    listBlogs,
    getBlog,
} from "../controllers/blogController.js";

import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Define CORS options if needed (Optional)
const corsOptions = {
    origin: '*', // Allow requests from any origin (or specify the domain you want)
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    credentials: true, // Enable cookies if necessary
};

// Apply CORS middleware to all blog routes
router.use(cors(corsOptions));

// Define the routes with authentication and authorization
router.route("/")
    .post(authenticate, authorizeAdmin, createBlog)
    .get(listBlogs);

router.route("/:id")
    .get(getBlog)
    .put(authenticate, authorizeAdmin, updateBlog)
    .delete(authenticate, authorizeAdmin, deleteBlog);

export default router;
