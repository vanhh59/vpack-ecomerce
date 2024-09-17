import express from "express";
import {
  registerUser,
  loginUser,
  logoutCurrentUser,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  deleteUserById,
  getUserById,
  updateUserById,
} from "../controllers/userController.js";

import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

/** POST Methods */

/**
 * @openapi
 * '/api/users/register':
 *  post:
 *     tags:
 *     - User Controller
 *     summary: Register a new user
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - username
 *              - email
 *              - password
 *            properties:
 *              username:
 *                type: string
 *                default: guest
 *              email:
 *                type: string
 *                default: guest@mail.com
 *              password:
 *                type: string
 *                default: vipack
 *     responses:
 *      201:
 *        description: User registered successfully
 *      409:
 *        description: Conflict - User already exists
 *      500:
 *        description: Server error
 */
router.post("/register", registerUser);

/**
 * @openapi
 * '/api/users/auth':
 *  post:
 *    tags:
 *     - User Controller
 *    summary: Login a user
 *    description: Allows a user to login by providing email and password
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - email
 *              - password
 *            properties:
 *              email:
 *                type: string
 *                format: email
 *                example: admin@gmail.com
 *              password:
 *                type: string
 *                format: password
 *                example: vipack
 *    responses:
 *      200:
 *        description: Successful login
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                _id:
 *                  type: string
 *                username:
 *                  type: string
 *                email:
 *                  type: string
 *                  format: email
 *                isAdmin:
 *                  type: boolean
 *      401:
 *        description: Invalid email or password
 *      404:
 *        description: User not found
 *      500:
 *        description: Server error
 */

router.post("/auth", loginUser);

/**
 * @openapi
 * '/api/users/logout':
 *  post:
 *     tags:
 *     - User Controller
 *     summary: Logout the current user
 *     responses:
 *      200:
 *        description: User logged out successfully
 *      500:
 *        description: Server error
 */
router.post("/logout", logoutCurrentUser);

/**
 * @openapi
 * '/api/users':
 *  get:
 *     tags:
 *     - User Controller
 *     summary: Get all users (admin access required)
 *     security:
 *      - bearerAuth: []
 *     responses:
 *      200:
 *        description: Successfully retrieved users
 *      403:
 *        description: Forbidden - Admin access only
 *      500:
 *        description: Server error
 */
router.get("/", authenticate, authorizeAdmin, getAllUsers);

/**
 * @openapi
 * '/api/users/profile':
 *  get:
 *     tags:
 *     - User Controller
 *     summary: Get current user profile
 *     security:
 *      - bearerAuth: []
 *     responses:
 *      200:
 *        description: Successfully retrieved user profile
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Server error
 *  put:
 *     tags:
 *     - User Controller
 *     summary: Update current user profile
 *     security:
 *      - bearerAuth: []
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            properties:
 *              username:
 *                type: string
 *              email:
 *                type: string
 *              password:
 *                type: string
 *     responses:
 *      200:
 *        description: User profile updated successfully
 *      400:
 *        description: Bad request
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Server error
 */
router
  .route("/profile")
  .get(authenticate, getCurrentUserProfile)
  .put(authenticate, updateCurrentUserProfile);

// ADMIN ROUTES 👇
/** ADMIN ROUTES */

/**
 * @openapi
 * '/api/users/{id}':
 *  get:
 *     tags:
 *     - User Controller
 *     summary: Get user by ID (admin access required)
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        description: The user ID
 *        schema:
 *          type: string
 *     responses:
 *      200:
 *        description: Successfully retrieved user
 *      403:
 *        description: Forbidden - Admin access only
 *      404:
 *        description: User not found
 *      500:
 *        description: Server error
 *  put:
 *     tags:
 *     - User Controller
 *     summary: Update user by ID (admin access required)
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        description: The user ID
 *        schema:
 *          type: string
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            properties:
 *              username:
 *                type: string
 *              email:
 *                type: string
 *              isAdmin:
 *                type: boolean
 *              isStaff:
 *                type: boolean
 *     responses:
 *      200:
 *        description: User updated successfully
 *      400:
 *        description: Bad request
 *      403:
 *        description: Forbidden - Admin access only
 *      404:
 *        description: User not found
 *      500:
 *        description: Server error
 *  delete:
 *     tags:
 *     - User Controller
 *     summary: Delete user by ID (admin access required)
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        description: The user ID
 *        schema:
 *          type: string
 *     responses:
 *      200:
 *        description: User deleted successfully
 *      403:
 *        description: Forbidden - Admin access only
 *      404:
 *        description: User not found
 *      500:
 *        description: Server error
 */
router
  .route("/:id")
  .delete(authenticate, deleteUserById)
  .get(authenticate, getUserById)
  .put(authenticate, updateUserById);

export default router;