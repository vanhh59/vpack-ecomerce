import express from "express";
import formidable from "express-formidable";
const router = express.Router();

// controllers
import {
  addProduct,
  updateProductDetails,
  removeProduct,
  fetchProducts,
  fetchProductById,
  fetchAllProducts,
  addProductReview,
  fetchTopProducts,
  fetchNewProducts,
  filterProducts,
} from "../controllers/productController.js";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
import checkId from "../middlewares/checkId.js";

// config swagger

/**
 * @openapi
 * /:
 *  get:
 *    tags:
 *    - Product Controller
 *    summary: Fetch all products with filters
 *    responses:
 *      200:
 *        description: Products retrieved successfully
 *      500:
 *        description: Server error
 */
router.route("/").get(fetchProducts);

// router
//   .route("/")
//   .get(fetchProducts)
//   .post(authenticate, authorizeAdmin, formidable(), addProduct);
// // formidable() middleware is used to parse form data

/**
 * @openapi
 * /:
 *  post:
 *    tags:
 *    - Product
 *    summary: Add a new product
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        multipart/form-data:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *              price:
 *                type: number
 *              description:
 *                type: string
 *              image:
 *                type: string
 *                format: binary
 *    responses:
 *      201:
 *        description: Product created successfully
 *      403:
 *        description: Forbidden - Unauthorized access
 *      500:
 *        description: Server error
 */
router.route("/").post(authenticate, authorizeAdmin, formidable(), addProduct);

/**
 * @openapi
 * /allproducts:
 *  get:
 *    tags:
 *    - Product
 *    summary: Fetch all products without filters
 *    responses:
 *      200:
 *        description: All products retrieved successfully
 *      500:
 *        description: Server error
 */
router.route("/allproducts").get(fetchAllProducts);


router.route("/:id/reviews").post(authenticate, checkId, addProductReview);

router.get("/top", fetchTopProducts);
router.get("/new", fetchNewProducts);

router
  .route("/:id")
  .get(fetchProductById)
  .put(authenticate, authorizeAdmin, formidable(), updateProductDetails)
  .delete(authenticate, authorizeAdmin, removeProduct);

router.route("/filtered-products").post(filterProducts);

export default router;