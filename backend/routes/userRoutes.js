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

router.post("/register", registerUser);

// router
//   .route("/")
//   .post(createUser)
//   .get(authenticate, authorizeAdmin, getAllUsers);

router.post("/auth", loginUser);
router.post("/logout", logoutCurrentUser);

router.get("/", authenticate, getAllUsers);

router
  .route("/profile")
  .get(authenticate, getCurrentUserProfile)
  .put(authenticate, updateCurrentUserProfile);

// ADMIN ROUTES 👇
router
  .route("/:id")
  .delete(authenticate, deleteUserById)
  .get(authenticate, getUserById)
  .put(authenticate, updateUserById);

export default router;